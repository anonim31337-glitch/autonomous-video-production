"""Delivery gates from manifest.json on a final MP4 (+ optional SRT). Appends one record to an append-only qa_history.json
(never overwrites it) and saves 1 frame per minute + 1 frame per detector interval for human/vision review.
usage: python qa_film.py <film.mp4> --id render1 [--srt film.srt] [--max 2370] [--history 09_QA/qa_history.json]
exit code 0 = PASS, 1 = FAIL. Frames: <history dir>/<id>/frames/*.jpg
"""
import argparse, datetime, json, re, subprocess
from pathlib import Path

FF = r'<FFMPEG_BIN>'


def run(*a):
    return subprocess.run(a, capture_output=True, text=True, encoding='utf-8', errors='replace')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('film'); ap.add_argument('--id', required=True); ap.add_argument('--srt')
    ap.add_argument('--max', type=float, default=39 * 60 + 30); ap.add_argument('--history', default=r'<PROJECT_ROOT>\09_QA\qa_history.json')
    ap.add_argument('--phonetic', nargs='*', default=['Klod', 'Antropik', 'F F mpeg', 'ej-aj', 'dżi-pi-ti'])
    a = ap.parse_args()
    film, hist = Path(a.film), Path(a.history)
    out = hist.parent / a.id
    (out / 'frames').mkdir(parents=True, exist_ok=True)

    pr = json.loads(run(f'{FF}\\ffprobe.exe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(film)).stdout)
    v = next(s for s in pr['streams'] if s['codec_type'] == 'video')
    au = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
    dur = float(pr['format']['duration'])
    det = run(f'{FF}\\ffmpeg.exe', '-v', 'info', '-i', str(film), '-vf', 'blackdetect=d=0.5:pix_th=0.08',
              '-af', 'silencedetect=noise=-50dB:d=2,ebur128=peak=true', '-f', 'null', '-').stderr
    blacks = [[float(x), float(y)] for x, y in re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', det)]
    sil = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', det)]
    summ = det[det.rfind('Summary:'):]
    lufs = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    errs = run(f'{FF}\\ffmpeg.exe', '-v', 'error', '-i', str(film), '-f', 'null', '-').stderr.strip()

    gates = {
        'runtime_at_most_limit': dur <= a.max,
        'resolution_1920x1080': (v['width'], v['height']) == (1920, 1080),
        'fps_30': v['r_frame_rate'] in ('30/1', '30000/1000'),
        'audio_48k': au['sample_rate'] == '48000',
        'loudness_-15_to_-13': -15 <= lufs <= -13,
        'true_peak_le_-1': tp <= -1.0,
        'no_black_over_0.5s': not blacks,
        'no_silence_over_2s': not sil,
        'no_decode_errors': not errs,
        'pix_fmt_yuv420p': v['pix_fmt'] == 'yuv420p',
        'color_range_tv': v.get('color_range') == 'tv',
    }
    if a.srt:
        srt = Path(a.srt).read_text(encoding='utf-8')
        sec = lambda s: sum(float(x) * k for x, k in zip(s.replace(',', '.').split(':'), (3600, 60, 1)))
        cues = [(sec(x), sec(y)) for x, y in re.findall(r'(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)', srt)]
        body = re.sub(r'"[^"]*"|„[^”]*”', '', srt)  # quoted examples may show a respelling on purpose
        gates['captions_inside_film'] = bool(cues) and cues[-1][1] <= dur
        gates['captions_ordered_no_overlap'] = all(s < e for s, e in cues) and all(cues[i][1] <= cues[i + 1][0] for i in range(len(cues) - 1))
        gates['captions_no_phonetics'] = not [p for p in a.phonetic if re.search(rf'\b{re.escape(p)}\b', body)]

    stamps = sorted({*range(30, int(dur), 60), *[round((x + y) / 2, 2) for x, y in blacks], *[s + 1 for s in sil]})
    for t in stamps:
        run(f'{FF}\\ffmpeg.exe', '-v', 'error', '-y', '-ss', str(t), '-i', str(film), '-frames:v', '1', '-q:v', '3', str(out / 'frames' / f'{t:08.2f}.jpg'))
    rec = {'id': a.id, 'finished': datetime.datetime.now().isoformat(timespec='seconds'), 'file': film.name, 'duration_s': round(dur, 3),
           'video': f"{v['codec_name']} {v['width']}x{v['height']} {v['r_frame_rate']} {v['pix_fmt']} {v.get('color_range')}",
           'loudness': {'I_LUFS': lufs, 'TP_dBFS': tp}, 'black_segments': blacks, 'silences_over_2s_start': sil,
           'decode_errors': errs[:500], 'gates': gates, 'frames_saved': len(stamps), 'verdict': 'PASS' if all(gates.values()) else 'FAIL'}
    h = json.loads(hist.read_text(encoding='utf-8')) if hist.exists() else {'note': 'append-only QA history (qa_film.py)', 'renders': []}
    h['renders'].append(rec)
    hist.write_text(json.dumps(h, ensure_ascii=False, indent=1), encoding='utf-8')
    for k, ok in gates.items():
        print(('PASS ' if ok else 'FAIL ') + k)
    print(rec['verdict'], rec['video'], f'{dur:.1f}s', f'{lufs} LUFS', f'TP {tp}', f'frames {len(stamps)} -> {out / "frames"}')
    raise SystemExit(0 if rec['verdict'] == 'PASS' else 1)


if __name__ == '__main__':
    main()
