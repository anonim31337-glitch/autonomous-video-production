"""Technical QA of the final MP4 -> 09_REPORTS/QA_REPORT.json + qa_contact.png + qa_frames/*.png
usage: python qa.py <final.mp4> [srt] [reportDir]
"""
import json, re, subprocess, sys
from pathlib import Path

FF = r'<FFMPEG_BIN>'
REP = Path(r'<PROJECT_ROOT>\09_REPORTS')
run = lambda a: subprocess.run(a, capture_output=True, text=True, encoding='utf-8', errors='replace')


def main():
    f = sys.argv[1]
    global REP
    srt = sys.argv[2] if len(sys.argv) > 2 else None
    if len(sys.argv) > 3:
        REP = Path(sys.argv[3])
        REP.mkdir(parents=True, exist_ok=True)
    pr = json.loads(run([FF + r'\ffprobe.exe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', f]).stdout)
    v = next(s for s in pr['streams'] if s['codec_type'] == 'video')
    a = next((s for s in pr['streams'] if s['codec_type'] == 'audio'), None)
    dur = float(pr['format']['duration'])
    err = run([FF + r'\ffmpeg.exe', '-hide_banner', '-nostats', '-i', f,
               '-vf', 'blackdetect=d=0.5:pix_th=0.08', '-af', 'silencedetect=noise=-50dB:d=2,ebur128=peak=true',
               '-f', 'null', '-']).stderr
    summ = err[err.rfind('Summary:'):]
    g = lambda k: float(re.search(k + r':\s+(-?[\d.]+)', summ).group(1))
    blacks = re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', err)
    sil = re.findall(r'silence_start: ([\d.]+)', err)
    decode_errors = [l for l in err.splitlines() if re.search(r'error|corrupt|invalid', l, re.I)][:10]
    res = {'file': f, 'size_mb': round(int(pr['format']['size']) / 2**20, 1), 'duration_s': round(dur, 2),
           'duration_mmss': f'{int(dur // 60)}:{int(dur % 60):02d}', 'video': f"{v['codec_name']} {v['width']}x{v['height']} {v['r_frame_rate']} {v.get('pix_fmt')}",
           'video_bitrate_kbps': round(int(pr['format']['bit_rate']) / 1000),
           'audio': f"{a['codec_name']} {a['sample_rate']} Hz {a['channels']} ch" if a else None,
           'loudness': {'I_LUFS': g('I'), 'LRA_LU': g('LRA'), 'TP_dBFS': g('Peak')},
           'black_segments': [[float(x), float(y)] for x, y in blacks], 'silences_over_2s': [float(s) for s in sil],
           'decode_errors': decode_errors}
    checks = {'32-35 min': 32 * 60 <= dur <= 35 * 60, '16:9 >=1080p': v['width'] * 9 == v['height'] * 16 and v['height'] >= 1080,
              'audio 48 kHz present': bool(a) and a['sample_rate'] == '48000', 'loudness -14±1 LUFS': abs(g('I') + 14) <= 1,
              'true peak <= -1 dBFS': g('Peak') <= -1.0, 'no black >0.5 s': not blacks, 'no silence >2 s': not sil,
              'no decode errors': not decode_errors}
    if srt:
        last = re.findall(r'--> (\d+):(\d+):(\d+),(\d+)', Path(srt).read_text(encoding='utf-8'))[-1]
        end = int(last[0]) * 3600 + int(last[1]) * 60 + int(last[2]) + int(last[3]) / 1000
        res['srt_last_cue_s'] = end
        checks['subtitles end within film'] = end <= dur
    res['checks'] = checks
    out = REP / 'qa_frames'
    out.mkdir(exist_ok=True)
    for p in (0.02, 0.25, 0.5, 0.75, 0.98):
        run([FF + r'\ffmpeg.exe', '-v', 'error', '-y', '-ss', f'{dur * p:.2f}', '-i', f, '-frames:v', '1', str(out / f'frame_{int(p * 100):02d}.png')])
    run([FF + r'\ffmpeg.exe', '-v', 'error', '-y', '-i', f, '-vf', 'fps=1/60,scale=384:-1,tile=6x6', '-frames:v', '1', str(REP / 'qa_contact.png')])
    (REP / 'QA_REPORT.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({k: res[k] for k in ('duration_mmss', 'video', 'audio', 'loudness', 'size_mb')}, ensure_ascii=False))
    for k, ok in checks.items():
        print(('PASS ' if ok else 'FAIL ') + k)


if __name__ == '__main__':
    main()
