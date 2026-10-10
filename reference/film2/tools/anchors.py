"""Python twin of remotion/src/anchors.ts (transcript M6): word times weighted by length + 1, last line 2.5 s,
Unicode letters and digits kept, everything else a space. Also the anchor validator:
python anchors.py            -> every at(cue, 'phrase') in the scene code, searched in the real narration of its segment.
Gate: zero missing. Phrases are matched per scene file through the segment map below."""
import json, re, sys
from pathlib import Path

FPS = 30
R = Path(r'<PROJECT_ROOT>\remotion\src')


def tokens(s):
    return re.sub(r'[^\w]|_', ' ', s.lower()).split()  # \w = Unicode letters, digits (and _, removed)


def words(c):
    out, L = [], c['lines']
    for i, l in enumerate(L):
        ws = tokens(l['text'])
        if not ws:
            continue
        end = L[i + 1]['t'] if i + 1 < len(L) else l['t'] + 2.5
        total, acc = sum(len(w) + 1 for w in ws), 0
        for w in ws:
            out.append((w, l['t'] + (end - l['t']) * acc / total))
            acc += len(w) + 1
    return out


def at(c, phrase, off=0.0, n=0):
    ws, p, seen = words(c), tokens(phrase), 0
    for i in range(len(ws) - len(p) + 1):
        if all(ws[i + k][0] == p[k] for k in range(len(p))):
            if seen == n:
                return round((ws[i][1] + off) * FPS)
            seen += 1
    raise KeyError(f'anchor not found: "{phrase}" (#{n})')


def validate():
    tl = json.loads((R / 'data' / 'timeline.json').read_text(encoding='utf-8'))
    cues = {s['id']: s['cues'] for s in tl['segments'] if s.get('cues')}
    total_found = total_missing = 0
    for f in sorted(R.rglob('*.tsx')):
        src = f.read_text(encoding='utf-8')
        seg = re.search(r'// segment: (\S+)', src)
        if not seg:
            continue
        c = cues[seg.group(1)]
        found, missing = 0, []
        for ph in re.findall(r"\bat\(\s*cue\s*,\s*'([^']+)'", src):
            try:
                at(c, ph); found += 1
            except KeyError:
                missing.append(ph)
        total_found += found; total_missing += len(missing)
        print(f'{f.name:22s} {seg.group(1):10s} found {found:3d}  missing {len(missing)}', missing or '')
    print('TOTAL found', total_found, 'missing', total_missing)
    files = len([f for f in sorted(R.rglob('*.tsx')) if '// segment: ' in f.read_text(encoding='utf-8')])
    (R / 'data' / 'validator.json').write_text(json.dumps({'files': files, 'found': total_found, 'missing': total_missing}), encoding='utf-8')
    return total_missing


if __name__ == '__main__':
    sys.exit(1 if validate() else 0)
