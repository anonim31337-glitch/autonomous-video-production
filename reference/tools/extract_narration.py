"""Narration audio + line timings from the Scrimba recordings (N0..N7, P1) for Remotion.
-> remotion/public/<name>_narration.wav, remotion/src/data/<name>_cues.json   (times relative to the start of the wav)
Sign-up nag pauses are cut out of the audio and the timings shifted, as in the v1 edit.
usage: python extract_narration.py N0 N1 ...
"""
import json, subprocess, sys
from pathlib import Path

P = Path(r'<PROJECT_ROOT>')
REC = P / '03_SCRIMBA_RAW' / 'recordings'
V = P / 'V2' / 'remotion'
FF = r'<FFMPEG_BIN>\ffmpeg.exe'


def extract(name):
    meta = json.loads((REC / f'{name}.json').read_text(encoding='utf-8-sig'))
    log = json.loads((REC / f'{name}.timeline.json').read_text(encoding='utf-8-sig'))
    lines = [e for e in log if e['k'] == 'line' and e['v']]
    t0 = meta['playAt_ms'] / 1000 - 0.15
    end = lines[-1]['t'] + 1.8
    cuts = sorted([e['from'] - 0.08, e['t'] + 0.35] for e in log if e['k'] == 'nag_off' and e['t'] - e['from'] > 0.1)
    keep, cur = [], t0
    for a, b in cuts:
        if a > cur:
            keep.append((cur, a))
        cur = max(cur, b)
    keep.append((cur, end))
    sel = '+'.join(f'between(t,{a:.3f},{b:.3f})' for a, b in keep)
    subprocess.run([FF, '-v', 'error', '-y', '-i', str(REC / f'{name}.webm'), '-vn', '-af', f"aselect='{sel}',asetpts=N/SR/TB",
                    '-ac', '2', '-ar', '48000', str(V / 'public' / f'{name.lower()}_narration.wav')], check=True)

    def out(t):  # recording time -> wav time
        acc = 0.0
        for a, b in keep:
            if t < b:
                return acc + max(0.0, t - a)
            acc += b - a
        return acc
    cues = {'duration': round(sum(b - a for a, b in keep), 3), 'lines': [{'t': round(out(e['t']), 3), 'text': e['v']} for e in lines]}
    (V / 'src' / 'data' / f'{name.lower()}_cues.json').write_text(json.dumps(cues, ensure_ascii=False), encoding='utf-8')
    print(name, 'duration', cues['duration'], 'lines', len(lines), 'nag cuts', len(cuts))


if __name__ == '__main__':
    for n in sys.argv[1:]:
        extract(n)
