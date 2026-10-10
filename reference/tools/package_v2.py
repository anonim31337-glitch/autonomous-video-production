"""YouTube package for v2 ("Ten rerendering zrobił Opus 5.5"): metadata.json for the uploader + YOUTUBE_PACKAGE.md.
Chapters come from 08_YOUTUBE/timeline.json (written by make_srt.py from the same segment math as Film.tsx)."""
import ast, json, re
from pathlib import Path

P = Path(r'<PROJECT_ROOT>')
OUT = P / 'V2' / '08_YOUTUBE'
CARD = 2.6

# channel ids and the most-cited films are the same as in v1: read them from make_package.py without running it
src = (P / '00_PROJECT' / 'tools' / 'make_package.py').read_text(encoding='utf-8')
consts = {n.targets[0].id: ast.literal_eval(n.value) for n in ast.parse(src).body
          if isinstance(n, ast.Assign) and isinstance(n.targets[0], ast.Name) and n.targets[0].id in ('CH', 'KEY')}
CH, KEY = consts['CH'], consts['KEY']

TITLE = 'Ten rerendering zrobił Opus 5.5 | Co się wydarzyło w AI? 239 polskich filmów'
ALTERNATIVES = [
    'Opus 5.5 zmontował ten film od nowa. Przegląd AI z 239 polskich filmów',
    'Claude Opus 5.5 jako montażysta: przegląd AI czerwiec–październik 2026',
    'Ten sam scenariusz, nowy montaż od AI. 239 polskich filmów o AI w 35 minut',
    'Czy AI zmontuje film lepiej niż szablon? Przegląd AI w wersji Opus 5.5',
    'GPT-6 Astra, Opus 5.5, roboty i AI Act: przegląd zmontowany przez Opus 5.5',
]
TAGS = ['AI', 'sztuczna inteligencja', 'przegląd AI', 'montaż AI', 'Claude Opus 5.5', 'Remotion', 'nowości AI', 'AI 2026',
        'GPT-6 Astra', 'Claude Fable 5', 'Kimi K3', 'agenci AI', 'Hermes agent', 'Claude Code', 'Seedance 2.5', 'AI Act',
        'roboty humanoidalne', 'polski YouTube AI', 'Laufer 108']


def ts(s):
    s = int(s)
    return f'{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}' if s >= 3600 else f'{s // 60}:{s % 60:02d}'


def chapters():
    tl = json.loads((OUT / 'timeline.json').read_text(encoding='utf-8'))
    st = tl['starts_s']
    n7 = json.loads((P / 'V2' / 'remotion' / 'src' / 'data' / 'n7_cues.json').read_text(encoding='utf-8'))
    L = n7['lines']  # the phrase may straddle two caption lines
    metoda = next(L[i]['t'] for i in range(len(L)) if 'koniec uczciwie' in ' '.join(x['text'] for x in L[i:i + 2]).lower())
    return [(0, 'Cztery miesiące AI: pięć historii na start'), (st[1], 'Skąd dane: o czym mówił polski YouTube'),
            (st[2], 'Wakacyjny wyścig modeli: Fable 5, Sonnet 5, Sol, Opus 5'), (st[4], 'Wrzesień: GPT-6 Astra kontra Opus 5.5'),
            (st[5], 'Agenci AI: Hermes, OpenClaw, Claude Code, Grok Bot'), (st[6], 'Chiny, AI na laptopie i wideo z AI'),
            (st[7], 'Roboty, iPhone i wyciek danych medycznych'), (st[8], 'AI Act, ceny AI i praca'),
            (st[9], 'Pięć wniosków i kogo oglądać'), (st[9] + CARD + metoda, 'Jak powstała ta wersja (Opus 5.5)'),
            (st[10], 'Outro Laufer 108')]


def description(ch):
    lines = [
        'To ten sam przegląd co pierwsza wersja, ale zmontowany od nowa przez model AI Claude Opus 5.5. Scenariusz i fakty zostały, '
        'obraz powstał od zera: każda grafika jest napisana kodem, a każda liczba na ekranie pochodzi z danych.', '',
        'Od czerwca do października 2026 jedenaście polskich kanałów o AI i technologii opublikowało 239 filmów, prawie 86 godzin. '
        'Przeszliśmy przez napisy wszystkich z nich i ułożyliśmy jedną historię: modele, agenci, wideo z AI, roboty, prawo i pieniądze.', '',
        'Co zrobił Opus 5.5:',
        '• ściana 239 kafelków: jeden kafelek to jeden prawdziwy film; zapalone to te, w których pada dany temat (przeszukanie napisów),',
        '• karty cytatów zamiast fragmentów cudzych filmów: kanał, tytuł, data i krótki cytat z napisów,',
        '• wykresy z prawdziwych liczb, oś czasu dzień po dniu, porównania „cennik kontra praktyka”,',
        '• tekst dla lektora pisany słownie i fonetycznie, wymowa sprawdzona modelem rozpoznawania mowy,',
        '• muzyka z biblioteki kanału, ciszej pod głosem, i efekty dźwiękowe tylko przy odsłonach informacji.',
        '<OPERATOR> zdecydował o temacie, kanałach, głosie i o tym, czego nie pokazujemy. Resztę, od researchu po render, zrobił Opus.', '',
        'Rozdziały:']
    lines += [f'{ts(t)} {name}' for t, name in ch]
    lines += ['', 'Pierwsza wersja (slajdy Scrimba Explain): https://youtu.be/ZeXEvzVho5c', '',
              'Kanały z przeglądu (warto je śledzić):']
    lines += [f'{c}: https://www.youtube.com/channel/{cid}' for c, cid in CH.items()]
    lines += ['', 'Najważniejsze cytowane filmy:']
    lines += [f'{t}: https://youtu.be/{v}' for t, v in KEY]
    lines += ['', 'Głos lektora jest syntetyczny (Scrimba Explain). Automatyczne napisy przekręcają nazwy, więc jeśli któryś twórca '
              'powiedział coś inaczej, niż tu streściliśmy, napisz w komentarzu, a poprawimy opis.', '',
              '#AI #SztucznaInteligencja #ClaudeOpus']
    return '\n'.join(lines)


if __name__ == '__main__':
    ch = chapters()
    desc = description(ch)
    assert len(TITLE) <= 100 and all(len(t) <= 100 for t in ALTERNATIVES), len(TITLE)
    assert len(desc.encode('utf-8')) <= 5000 and '<' not in desc and '>' not in desc, len(desc.encode('utf-8'))
    assert ch[0][0] == 0 and all(b[0] - a[0] >= 10 for a, b in zip(ch, ch[1:])), 'chapters: start at 0:00, >= 10 s each'
    assert sum(len(t) + 2 for t in TAGS) <= 480
    (OUT / 'metadata.json').write_text(json.dumps({'title': TITLE, 'description': desc, 'tags': TAGS}, ensure_ascii=False, indent=1), encoding='utf-8')
    md = ['# Pakiet YouTube — wersja 2', '', f'## Tytuł\n\n{TITLE}', '', '## Alternatywy', ''] + [f'- {t}' for t in ALTERNATIVES]
    md += ['', '## Opis', '', '```', desc, '```', '', '## Tagi', '', ', '.join(TAGS)]
    (OUT / 'YOUTUBE_PACKAGE.md').write_text('\n'.join(md), encoding='utf-8')
    print('title', len(TITLE), 'desc bytes', len(desc.encode('utf-8')), 'chapters', [(ts(t), n) for t, n in ch])
