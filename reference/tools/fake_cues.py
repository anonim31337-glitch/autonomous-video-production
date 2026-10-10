"""Placeholder timings (155 words/min, 5-word lines) + silent wav for chapters whose narration is not recorded yet,
so the Remotion code can be compiled and laid out early. Real recordings overwrite both (extract_narration.py).
usage: python fake_cues.py N0 N1 ...   (skips names that already have a real recording)"""
import json, re, subprocess, sys
from pathlib import Path

P = Path(r'<PROJECT_ROOT>')
V = P / 'V2' / 'remotion'
for name in sys.argv[1:]:
    if (P / '03_SCRIMBA_RAW' / 'recordings' / f'{name}.timeline.json').exists():
        continue
    x = (P / 'V2' / '02_SCRIPTS' / f'{name}.xml').read_text(encoding='utf-8')
    words = ' '.join(m.group(1) for m in re.finditer(r'text="\[([^\]]*)\]', x)).split()
    lines, t = [], 0.3
    for i in range(0, len(words), 5):
        chunk = words[i:i + 5]
        lines.append({'t': round(t, 3), 'text': ' '.join(chunk)})
        t += len(chunk) * 60 / 155
    dur = round(t + 0.5, 3)
    (V / 'src' / 'data' / f'{name.lower()}_cues.json').write_text(json.dumps({'duration': dur, 'lines': lines, 'fake': True}, ensure_ascii=False), encoding='utf-8')
    subprocess.run([r'<FFMPEG_BIN>\ffmpeg.exe', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
                    '-t', str(dur), str(V / 'public' / f'{name.lower()}_narration.wav')], check=True)
    print(name, 'fake', dur, 's')
