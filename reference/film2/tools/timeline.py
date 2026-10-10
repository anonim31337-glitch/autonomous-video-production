"""Single source of time for the film. Splits the extracted module recordings into script sections, adds the chapter card
(2.6 s before the first word) and the 1 s tail of every machine chapter, computes frames, asserts the runtime limit.
Remotion (Film.tsx) and the caption builder (make_srt_an.py) both read the output, so they agree to the frame.
-> remotion/src/data/timeline.json     usage: python timeline.py [--partial]   (--partial: skip modules not yet extracted)"""
import json, subprocess, sys
from pathlib import Path

FPS, CARD, TAIL, LIMIT = 30, 78, 30, (39 * 60 + 30) * 30
ROOT = Path(r'<PROJECT_ROOT>')
D = ROOT / 'remotion' / 'src' / 'data'
OUTRO = r'<OUTRO_FILE>'
PLAN = json.loads((ROOT / '05_NARRATION' / 'plan.json').read_text(encoding='utf-8'))
LEAD = 0.25  # seconds of room kept before a section's first line


def main():
    secs = []  # [{id, title, lang, speed, parts:[{wav, audio_from, audio_frames}], lines}]
    for g in PLAN:
        f = D / f"{g['name']}_cues.json"
        if not f.exists():
            if '--partial' in sys.argv:
                continue
            raise SystemExit(f'missing {f.name}: extract it first')
        c = json.loads(f.read_text(encoding='utf-8'))
        sec_of = [p['section'] for p in g['paragraphs']]
        firsts = {}
        for l in c['lines']:
            firsts.setdefault(sec_of[l['p']], l['t'])
        order = list(dict.fromkeys(sec_of))
        for k, sid in enumerate(order):
            a = 0.0 if k == 0 else firsts[sid] - LEAD
            b = c['duration'] if k + 1 == len(order) else firsts[order[k + 1]] - LEAD
            part = {'wav': f"an/{g['name']}.wav", 'audio_from': round(a * FPS), 'audio_frames': round((b - a) * FPS)}
            if secs and secs[-1]['id'] == sid:  # the section continues in the next recording: same chapter, one card
                s0 = secs[-1]
                off = sum(x['audio_frames'] for x in s0['parts']) / FPS
                s0['parts'].append(part)
            else:
                title = next(p['title'] for p in g['paragraphs'] if p['section'] == sid)
                s0 = {'id': sid, 'title': title, 'lang': g['lang'], 'speed': c['speed'], 'parts': [part], 'lines': []}
                secs.append(s0)
                off = 0.0
            s0['lines'] += [{**l, 't': round(l['t'] - a + off, 3)} for l in c['lines'] if a <= l['t'] < b]
    segs, start = [], 0
    for s0 in secs:
        n = sum(x['audio_frames'] for x in s0['parts'])
        card = CARD if s0['id'].startswith('M') else 0
        seg = {k: s0[k] for k in ('id', 'title', 'lang', 'speed', 'parts')}
        seg.update({'card': card, 'tail': TAIL, 'start': start, 'len': card + n + TAIL,
                    'cues': {'duration': round(n / FPS, 3), 'speed': s0['speed'], 'lines': s0['lines']}})
        segs.append(seg)
        start += seg['len']
    dur = float(subprocess.run([r'<FFMPEG_BIN>\ffprobe.exe', '-v', 'error', '-show_entries', 'format=duration',
                                '-of', 'csv=p=0', OUTRO], capture_output=True, text=True).stdout)
    segs.append({'id': 'OUTRO', 'title': 'Outro', 'start': start, 'len': round(dur * FPS), 'card': 0, 'tail': 0, 'video': 'outro.mp4'})
    total = start + segs[-1]['len']
    assert total <= LIMIT, f'runtime {total / FPS:.1f} s above the limit 39:30'
    (D / 'timeline.json').write_text(json.dumps({'fps': FPS, 'total': total, 'segments': segs}, ensure_ascii=False), encoding='utf-8')
    for s in segs:
        print(f"{s['id']:8s} start {s['start'] / FPS:7.1f}s  len {s['len'] / FPS:6.1f}s")
    print(f'TOTAL {total} frames = {total // FPS // 60}:{total // FPS % 60:02d} (limit 39:30)')


if __name__ == '__main__':
    main()
