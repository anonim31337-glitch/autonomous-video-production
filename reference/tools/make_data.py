"""Real data for the v2 visuals: every one of the 239 films with channel, date, title and which stories it mentions.
-> V2/remotion/src/data/films.json. Topic patterns were checked by reading every hit in context (2026-10-06):
'bolt' alone also matched the taxi app, so it needs the sprinter's first name; 'medyczn' alone matched a generic remark.
"""
import json, re
from pathlib import Path

P = Path(r'<PROJECT_ROOT>')
C = P / '01_RESEARCH' / 'corpus'
OUT = P / 'V2' / 'remotion' / 'src' / 'data' / 'films.json'

CHANNELS = ['AI W Praktyce', 'Webflip AI', 'Michał Barczak - GeekWork', 'Mikołaj Abramczuk', 'AI bez jaj', 'Norbert Uselis',
            'Robert Szewczyk', 'NetGonet', 'Aleks Szach', 'Kuba Klawiter', 'Krzysztof Bohaczyk']
TOPICS = {
    'fable': r'\bfable|\bfejbl',
    'arc999': r'arc[- ]?agi ?3|ark wynikiem 99',
    'bolt': r'(jusin|hussein|usain|jusejn)\w*\s+bolt',
    'medical19': r'19 milion\w*.{0,80}medyczn|medyczn.{0,80}19 milion',
    'jev': r'\bjev\b|\bdżew',
    'astra': r'gpt[- ]?6\W{0,3}astr|\bastr[aąyęeo]\b|\bastrą\b|\bastrze\b',
    'opus55': r'opus\w*\s*5[.,]5',
}


def main():
    idx = json.loads((C / 'index.json').read_text(encoding='utf-8-sig'))
    films = []
    for v in idx:
        p = C / f"{v['id']}.txt"
        text = (v['title'] + ' ' + (p.read_text(encoding='utf-8', errors='ignore') if p.exists() else '')).lower()
        ch = v['channel'].replace('–', '-')
        films.append({'id': v['id'], 'ch': CHANNELS.index(ch), 'title': v['title'], 'date': (lambda d: f"{d[:4]}-{d[4:6]}-{d[6:8]}")(re.sub(r'\D', '', v['date'])),
                      'views': v.get('views', 0), 'dur': v.get('dur', 0),
                      't': [k for k, r in TOPICS.items() if re.search(r, text, re.S)]})
    films.sort(key=lambda f: (f['date'], f['ch']))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({'channels': CHANNELS, 'films': films}, ensure_ascii=False), encoding='utf-8')
    counts = {k: sum(k in f['t'] for f in films) for k in TOPICS}
    hours = sum(f['dur'] for f in films) / 3600
    print(len(films), 'films', round(hours, 1), 'h', counts)
    assert len(films) == 239 and counts['bolt'] == 2 and counts['jev'] == 4 and counts['astra'] == 35 and counts['opus55'] == 13


if __name__ == '__main__':
    main()
