"""Captions of the whole film from remotion/src/data/timeline.json, the same file the composition is chained from, so both
agree to the frame. Cue start = segment start + chapter card + line time; end = next start - 40 ms, at most 6 s; the last cue
of a segment ends inside that segment. Empty display lines (spoken overflow of a long path) extend the previous cue.
The outro's captions: 05_NARRATION/outro_captions.json. Asserts the manifest caption rules.
usage: python make_srt_an.py out.srt"""
import json, re, sys
from pathlib import Path

FPS = 30
ROOT = Path(r'<PROJECT_ROOT>')
PHON = ['Klod', 'Antropik', 'F F mpeg', 'ej-aj', 'dżi-pi-ti', 'Y U V', 'S R T', 'P C M', 'Y T D L P']


def ts(s):
    ms = round(s * 1000)
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


def main():
    tl = json.loads((ROOT / 'remotion' / 'src' / 'data' / 'timeline.json').read_text(encoding='utf-8'))
    rows = []
    for s in tl['segments']:
        start, seg_end = (s['start'] + s['card']) / FPS, (s['start'] + s['len']) / FPS
        if s['id'] == 'OUTRO':
            oc = json.loads((ROOT / '05_NARRATION' / 'outro_captions.json').read_text(encoding='utf-8'))['cues']
            rows += [(s['start'] / FPS + a, s['start'] / FPS + b, t) for a, b, t in oc]
            continue
        ls = [(start + l['t'], l['text']) for l in s['cues']['lines'] if l['text']]
        for i, (t, text) in enumerate(ls):
            nxt = ls[i + 1][0] - 0.04 if i + 1 < len(ls) else min(t + 3.0 - 0.04, seg_end)
            rows.append((t, min(nxt, t + 6.0), text))
    total = tl['total'] / FPS
    assert all(e > s for s, e, _ in rows), 'cue ends before it starts'
    assert all(rows[i][1] <= rows[i + 1][0] for i in range(len(rows) - 1)), 'overlap'
    assert rows[-1][1] <= total, 'last cue outside the film'
    body = re.sub(r'"[^"]*"|„[^”]*”', '', ' '.join(r[2] for r in rows))
    left = [p for p in PHON if re.search(rf'(?<!\w){re.escape(p)}(?!\w)', body)]
    assert not left, f'phonetic spelling outside quotes: {left}'
    out = Path(sys.argv[1])
    out.write_text(''.join(f'{i}\n{ts(s)} --> {ts(e)}\n{t}\n\n' for i, (s, e, t) in enumerate(rows, 1)), encoding='utf-8')
    print(out.name, len(rows), 'cues · film', tl['total'], 'frames =', round(total, 3), 's · last cue ends', round(rows[-1][1], 3))


if __name__ == '__main__':
    main()
