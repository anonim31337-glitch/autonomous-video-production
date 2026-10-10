"""Polish captions for the v2 film from the Scrimba caption logs, mapped onto the film timeline (same segment math as Film.tsx),
with the TTS spellings turned back into normal text ("Klod Fejbl pięć kropka jeden" -> "Claude Fable 5.1").
-> V2/08_YOUTUBE/napisy_pl.srt ; asserts no phonetic spelling survives and cues never overlap or run past the film.
"""
import json, re
from pathlib import Path

V2 = Path(r'<PROJECT_ROOT>\V2')
DATA = V2 / 'remotion' / 'src' / 'data'
FPS, PRE, CARD, TAIL, OUTRO = 30, 3.4, 2.6, 1.0, round(32.9 * 30)
W = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć']
NUM = '|'.join(W)
SEP = '\u00a6'  # line boundary marker kept through the replacements

BACK = [  # spoken -> display; longer first. A space may also be a line boundary.
    (rf'\b({NUM}) kropka ({NUM})\b', lambda m: f'{W.index(m.group(1))}.{W.index(m.group(2))}'),
    (r'\bark ej-dżi-aj trzy\b', 'ARC-AGI-3'), (r'\bej-dżi-aj\b', 'AGI'),
    (r'\bczat dżi-pi-ti\b', 'ChatGPT'), (r'\bdżi-pi-ti (\d)\b(?!\.)', r'GPT-\1'), (r'\bdżi-pi-ti\b', 'GPT'),
    (r'\bOpen ej-aj\b', 'OpenAI'), (r'\biks ej-aj\b', 'xAI'), (r'\bKlod Kołd\b', 'Claude Code'), (r'\bKlod', 'Claude'),
    (r'\bFejbl[au]\b', 'Fable'), (r'\bFejbl', 'Fable'), (r'\bSonecie\b', 'Sonnecie'), (r'\bSonet', 'Sonnet'), (r'\bAntropik', 'Anthropic'), (r'\bOpen Klo\b', 'OpenClaw'),
    (r'\bKodeks', 'Codex'), (r'\bKursor', 'Cursor'), (r'\bDip Sik\b', 'DeepSeek'), (r'\bKłen', 'Qwen'), (r'\bka trzy\b', 'K3'),
    (r'\bwe cztery\b', 'V4'), (r'\bdżi-el-em\b', 'GLM'), (r'\bDżemini\b', 'Gemini'), (r'\bDżemm', 'Gemm'), (r'\bNotbuk el-em\b', 'NotebookLM'),
    (r'\bNotbuk\b', 'Notebook'), (r'\bSidens\b', 'Seedance'), (r'\bHigsfild\b', 'Higgsfield'), (r'\bBajtdens\b', 'ByteDance'),
    (r'\bMunszot\b', 'Moonshot'), (r'\bEnwidia\b', 'Nvidia'), (r'\bajfon\b', 'iPhone'), (r'\bajfon', 'iPhon'), (r'\bEpl\b', 'Apple'),
    (r'\bMak mini\b', 'Mac mini'), (r'\bem sześć\b', 'M6'), (r'\bHaging Fejs\b', 'Hugging Face'), (r'\bGithab', 'GitHub'),
    (r'\bJutub', 'YouTube'), (r'\bTiktok', 'TikTok'), (r'\bTek Łik\b', 'Tech Week'), (r'\bAfter Efekts\b', 'After Effects'),
    (r'\bTajp Sejf\b', 'TypeSafe'), (r'\bOltman', 'Altman'), (r'\bAmodej\b', 'Amodei'), (r'\bDżew\b', 'Jev'), (r'\bIksplejn\b', 'Explain'),
    (r'\bSkrimb', 'Scrimb'), (r'\bSzift\b', 'Shift'), (r'\bFlesz\b', 'Flash'), (r'\bŁebflip', 'Webflip'), (r'\bNet Gonet', 'NetGonet'),
    (r'\bha-te-em-el\b', 'HTML'), (r'\bej-pi-aj\b', 'API'), (r'\bJusejna\b', 'Usaina'),
    (r'\bdziewięćdziesiąt dziewięć i dziewięć dziesiątych procent\b', '99,9%'),
    (rf'\bOpus ({NUM}) ({NUM})\b', lambda m: f'Opus {W.index(m.group(1))}.{W.index(m.group(2))}'),  # pilot: 'Opus cztery osiem'
    (rf'\b(Fable|Opus|Sonnet|Gemma|Grok|Kimi) ({NUM})\b', lambda m: f'{m.group(1)} {W.index(m.group(2))}'),
]
LEFT = re.compile(r'\b(Klod|Fejbl|Antropik|dżi-pi-ti|ej-aj|Kodeks|Kursor|Kłen|Sidens|Łebflip|ej-pi-aj|ha-te-em-el|Jusejn|Dżemini|Epl|ajfon|Skrimb|Munszot)')


def display(lines):
    s = f' {SEP} '.join(lines)
    for pat, rep in BACK:
        rx = re.compile(pat.replace(' ', f'(?: {SEP})? '))
        def sub(m, rep=rep):
            out = rep(m) if callable(rep) else m.expand(rep)
            return out + (f' {SEP}' if SEP in m.group(0) else '')  # keep the line break after the joined name
        s = rx.sub(sub, s)
    s = re.sub(rf' ?{SEP} ?([,.;:!?]+)', rf'\1 {SEP} ', s)  # punctuation stays with the word before the break
    out = [x.strip() for x in s.split(SEP)]
    assert len(out) == len(lines), (len(out), len(lines))
    return out


def cues(name):
    return json.loads((DATA / f'{name}_cues.json').read_text(encoding='utf-8'))


def main():
    p1 = cues('p1')
    n = {i: cues(f'n{i}') for i in range(8)}
    # segment layout exactly as Film.tsx
    hist = next(l['t'] for l in p1['lines'] if l['text'].startswith('Historia wakacji'))
    cut = round((hist + PRE) * FPS) - 12
    pilot_frames = round((PRE + p1['duration'] + 1.6) * FPS)
    pilot_b = pilot_frames - round(1.6 * FPS) - cut + round(0.6 * FPS)
    lead = {0: 0.3, 1: 0.3, **{i: CARD for i in range(2, 8)}}
    ln = lambda i: round((lead[i] + n[i]['duration'] + TAIL) * FPS)
    segs = [cut, ln(0), pilot_b] + [ln(i) for i in range(1, 8)] + [OUTRO]
    starts = [sum(segs[:k]) / FPS for k in range(len(segs))]
    film_end = sum(segs) / FPS

    rows = []  # (start, text)
    pl = p1['lines']
    disp = display([l['text'] for l in pl])
    for l, d in zip(pl, disp):
        t = l['t'] + PRE
        rows.append((t if t * FPS < cut else starts[2] + t - cut / FPS, d))
    for i in range(8):
        seg = 1 if i == 0 else 2 + i
        disp = display([l['text'] for l in n[i]['lines']])
        rows += [(starts[seg] + lead[i] + l['t'], d) for l, d in zip(n[i]['lines'], disp)]
    rows.sort()
    ts = lambda s: f'{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round(s % 1 * 1000)) % 1000:03d}'
    out = []
    for k, (a, text) in enumerate(rows):
        nxt = rows[k + 1][0] if k + 1 < len(rows) else a + 3
        b = min(nxt - 0.04, a + 6, film_end - OUTRO / FPS)
        out.append(f'{k + 1}\n{ts(a)} --> {ts(b)}\n{text}\n')
        assert b > a, (a, b, text)
    srt = '\n'.join(out)
    left = sorted(set(LEFT.findall(srt)))
    assert not left, f'phonetic spelling left in captions: {left}'
    dst = V2 / '08_YOUTUBE' / 'napisy_pl.srt'
    dst.parent.mkdir(exist_ok=True)
    dst.write_text(srt, encoding='utf-8')
    json.dump({'segments_s': [round(x / FPS, 3) for x in segs], 'starts_s': [round(x, 3) for x in starts], 'film_s': round(film_end, 3)},
              open(V2 / '08_YOUTUBE' / 'timeline.json', 'w', encoding='utf-8'), indent=1)
    print('cues', len(rows), 'film', round(film_end, 1), 's')


if __name__ == '__main__':
    main()
