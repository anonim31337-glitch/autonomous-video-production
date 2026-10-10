"""script.md -> Scrimba Explain markup, one file per explainer (each under the ~1,500-word limit).
One <item>/<say> pair per paragraph; the say text is the SPOKEN text (spoken_en for English, the V2 Polish lexicon + "ej-aj").
Writes 05_NARRATION/markup/<name>.xml and 05_NARRATION/plan.json (explainer -> section, paragraph display/spoken text).
usage: python make_markup.py
"""
import html, importlib.util, json, re
from pathlib import Path

ROOT = Path(r'<PROJECT_ROOT>')
OUT = ROOT / '05_NARRATION'
MAX_WORDS = 1350  # spoken words per explainer; the engine allows ~1,500
spec = importlib.util.spec_from_file_location('spoken_pl', r'<PROJECT_ROOT>\V2\tools\spoken.py')
spoken_pl = importlib.util.module_from_spec(spec); spec.loader.exec_module(spoken_pl)
import spoken_en  # same folder


def sections():
    src = re.sub(r'<!--.*?-->', '', (ROOT / '02_SCRIPT' / 'script.md').read_text(encoding='utf-8'), flags=re.S)
    for chunk in re.split(r'^## ', src, flags=re.M)[1:]:
        head, body = chunk.split('\n', 1)
        sid, lang, speed = [x.strip() for x in head.split('|')]
        yield sid.split()[0], sid, lang, float(speed), [p.strip() for p in body.split('\n\n') if p.strip()]


def say(text, lang):
    t = spoken_en.spoken(text) if lang == 'en' else re.sub(r'\bAI\b', 'ej-aj', spoken_pl.spoken(text))
    return re.sub(r'\s+', ' ', t.replace('"', '').replace('„', '').replace('”', '').replace('[', '').replace(']', '')).strip()


def main():
    groups = []  # [name, lang, speed, [para dicts]]
    for key, title, lang, speed, paras in sections():
        for p in paras:
            sp = say(p, lang)
            g = groups[-1] if groups else None
            new = (g is None or g[1] != lang or g[2] != speed or key in ('C0', 'HANDOFF', 'RETURN', 'C9')
                   and g[3][-1]['section'] != key or sum(len(x['spoken'].split()) for x in g[3]) + len(sp.split()) > MAX_WORDS)
            if new:
                groups.append([None, lang, speed, []])
            groups[-1][3].append({'section': key, 'title': title, 'display': p, 'spoken': sp})
    (OUT / 'markup').mkdir(parents=True, exist_ok=True)
    plan = []
    for i, (_, lang, speed, paras) in enumerate(groups):
        secs = sorted({p['section'] for p in paras}, key=[p['section'] for p in paras].index)
        name = f'AN{i:02d}_{secs[0]}' + (f'-{secs[-1]}' if len(secs) > 1 else '')
        xml = []
        for j, p in enumerate(paras):
            t = html.escape(p['title'], quote=True)
            xml.append(f'<item anchor="s{j}" title="{t}" text="."></item>')
            xml.append(f'<say lang="{"en-US" if lang == "en" else "pl-PL"}" title="{t}" text="[{html.escape(p["spoken"], quote=True)}](#s{j})"/>')
        (OUT / 'markup' / f'{name}.xml').write_text('\n'.join(xml) + '\n', encoding='utf-8')
        words = sum(len(p['spoken'].split()) for p in paras)
        assert words <= 1500 and len('\n'.join(xml).encode()) < 512_000, name
        plan.append({'name': name, 'lang': lang, 'speed': speed, 'sections': secs, 'spoken_words': words, 'paragraphs': paras})
        print(f'{name:22s} {lang} {speed}x  {words:5d} words  {len(paras):3d} paragraphs  ~{words / (142 if lang == "en" else 148):.1f} min @1.0')
    (OUT / 'plan.json').write_text(json.dumps(plan, ensure_ascii=False, indent=1), encoding='utf-8')


if __name__ == '__main__':
    main()
