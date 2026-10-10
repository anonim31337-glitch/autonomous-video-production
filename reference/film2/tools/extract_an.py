"""Narration audio + line cues for this film, from the Scrimba recordings (same cut rules as V2 extract_narration.py).
Each caption line of the player log is spoken text; it is mapped back to the DISPLAY text of its paragraph (plan.json) by token
alignment, so captions and anchors use canonical text ("FFmpeg", "5.5"), never the respelling. Then the section speed is applied
(ffmpeg atempo, pitch kept) and every time is divided by it.
-> remotion/public/an/<name>.wav, remotion/src/data/<name>_cues.json {duration, speed, lines:[{t, text, spoken, p}]}
usage: python extract_an.py AN02_M0-M3 [...] [--speed 1.8]   (--speed overrides plan speed for sections planned above 1.0)
"""
import difflib, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(r'<PROJECT_ROOT>')
REC = Path(r'<PROJECT_ROOT>\03_SCRIMBA_RAW\recordings')
FF = r'<FFMPEG_BIN>\ffmpeg.exe'
PLAN = {g['name']: g for g in json.loads((ROOT / '05_NARRATION' / 'plan.json').read_text(encoding='utf-8'))}


def key(w):
    return re.sub(r'[^a-z0-9ąćęłńóśźż]', '', w.lower())


def to_display(lines, paras):
    """lines: spoken caption strings in order; paras: plan paragraphs. Returns [(para_index, display_text)] per line."""
    sp = [(pi, wi, key(w)) for pi, p in enumerate(paras) for wi, w in enumerate(p['spoken'].split())]
    ln = [(li, key(w)) for li, l in enumerate(lines) for w in l.split()]
    m = difflib.SequenceMatcher(None, [k for *_, k in ln], [k for *_, k in sp], autojunk=False)
    first = {}  # line -> first aligned spoken token index
    for a, b, size in m.get_matching_blocks():
        for j in range(size):
            first.setdefault(ln[a + j][0], b + j)
    starts, last = [], 0
    for li in range(len(lines)):
        last = first.get(li, last)
        starts.append(last)
    out = []
    for li, s in enumerate(starts):
        pi, wi, _ = sp[s]
        nxt = [sp[t][1] for t in starts[li + 1:] if sp[t][0] == pi]
        out.append((pi, wi, nxt[0] if nxt else None))
    res = []
    for pi, a, b in out:
        disp, spk = paras[pi]['display'].split(), paras[pi]['spoken'].split()
        mm = difflib.SequenceMatcher(None, [key(w) for w in spk], [key(w) for w in disp], autojunk=False)

        def s2d(i):
            for tag, i1, i2, j1, j2 in mm.get_opcodes():
                if i1 <= i < i2 or (i == i2 == len(spk) and tag != 'insert'):
                    return j1 + (i - i1) if tag == 'equal' else j1 + round((i - i1) * (j2 - j1) / max(1, i2 - i1))
            return len(disp)
        res.append((pi, ' '.join(disp[s2d(a):s2d(b) if b is not None else len(disp)])))
    return res


def extract(name, speed_override=None):
    g = PLAN[name]
    speed = speed_override if speed_override and g['speed'] > 1 else g['speed']
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
    out_wav = ROOT / 'remotion' / 'public' / 'an' / f'{name}.wav'
    out_wav.parent.mkdir(parents=True, exist_ok=True)
    af = f"aselect='{sel}',asetpts=N/SR/TB" + (f',atempo={speed}' if speed != 1 else '')
    subprocess.run([FF, '-v', 'error', '-y', '-i', str(REC / f'{name}.webm'), '-vn', '-af', af, '-ac', '2', '-ar', '48000', str(out_wav)], check=True)

    def out(t):
        acc = 0.0
        for a, b in keep:
            if t < b:
                return acc + max(0.0, t - a)
            acc += b - a
        return acc
    disp = to_display([e['v'] for e in lines], g['paragraphs'])
    cues = {'duration': round(sum(b - a for a, b in keep) / speed, 3), 'speed': speed,
            'lines': [{'t': round(out(e['t']) / speed, 3), 'text': d, 'spoken': e['v'], 'p': pi} for e, (pi, d) in zip(lines, disp)]}
    joined = ' '.join(c['text'] for c in cues['lines']).split()
    want = ' '.join(p['display'] for p in g['paragraphs']).split()
    assert joined == want, f'{name}: display text not reproduced exactly ({len(joined)} vs {len(want)} words)'
    (ROOT / 'remotion' / 'src' / 'data').mkdir(parents=True, exist_ok=True)
    (ROOT / 'remotion' / 'src' / 'data' / f'{name}_cues.json').write_text(json.dumps(cues, ensure_ascii=False, indent=0), encoding='utf-8')
    print(name, 'speed', speed, 'duration', cues['duration'], 'lines', len(lines), 'nag cuts', len(cuts))


if __name__ == '__main__':
    args = sys.argv[1:]
    sp = float(args[args.index('--speed') + 1]) if '--speed' in args else None
    for n in [a for a in args if a.startswith('AN')]:
        extract(n, sp)
