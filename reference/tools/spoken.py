"""Spoken text for the Scrimba TTS: the v1 script (facts frozen) with versions written as words and English names spelled the
way a Polish speaker says them. Screen text and captions keep the normal spelling (see TO_TEXT for the way back).
usage: python spoken.py  -> V2/02_SCRIPTS/N*.xml (one plain slide per paragraph: the visuals come from Remotion, not Scrimba)
"""
import json, re
from pathlib import Path

V2 = Path(r'<PROJECT_ROOT>\V2')
DIG = {'0': 'zero', '1': 'jeden', '2': 'dwa', '3': 'trzy', '4': 'cztery', '5': 'pięć', '6': 'sześć', '7': 'siedem', '8': 'osiem', '9': 'dziewięć'}


def version(m):
    """'4.8' -> 'cztery kropka osiem', '5.5' -> 'pięć kropka pięć' (so creators say model versions)."""
    a, b = m.group(1), m.group(2)
    return f"{' '.join(DIG[c] for c in a) if len(a) == 1 else a} kropka {' '.join(DIG[c] for c in b)}"


# order matters: longer names first. (pattern, replacement); stems keep Polish endings, e.g. Codexa -> Kodeksa
LEX = [
    (r'\bARC-AGI-3\b', 'ark ej-dżi-aj trzy'), (r'\bAGI\b', 'ej-dżi-aj'),
    (r'\bClaude Code', 'Klod Kołd'), (r'\bClaude', 'Klod'), (r"\bFable'?", 'Fejbl'), (r'\bSonnecie', 'Sonecie'), (r'\bSonnet', 'Sonet'),
    (r'\bChatGPT', 'czat dżi-pi-ti'), (r'\bGPT[- ]?', 'dżi-pi-ti '), (r'\bOpenAI', 'Open ej-aj'), (r'\bxAI', 'iks ej-aj'),
    (r'\bAnthropic', 'Antropik'), (r'\bOpenClaw', 'Open Klo'), (r'\bCodex', 'Kodeks'), (r'\bCursor', 'Kursor'),
    (r'\bDeepSeek', 'Dip Sik'), (r'\bQwen', 'Kłen'), (r'\bKimi K3\b', 'Kimi ka trzy'), (r'\bK3\b', 'ka trzy'), (r'\bV4\b', 'we cztery'),
    (r'\bGLM\b', 'dżi-el-em'), (r'\bGemini', 'Dżemini'), (r'\bGemm', 'Dżemm'), (r'\bNotebookLM', 'Notbuk el-em'), (r'\bNotebook', 'Notbuk'),
    (r'\bSeedance', 'Sidens'), (r'\bHiggsfield', 'Higsfild'), (r'\bByteDance', 'Bajtdens'), (r'\bMoonshot', 'Munszot'), (r'\bNvidia', 'Enwidia'),
    (r'\biPhone\b', 'ajfon'), (r'\biPhon', 'ajfon'), (r'\bApple', 'Epl'), (r'\bMac mini', 'Mak mini'), (r'\bM6\b', 'em sześć'), (r'\bHugging Face', 'Haging Fejs'),
    (r'\bGitHub', 'Githab'), (r'\bYouTube', 'Jutub'), (r'\bTikTok', 'Tiktok'), (r'\bTech Week', 'Tek Łik'), (r'\bAfter Effects', 'After Efekts'),
    (r'\bTypeSafe', 'Tajp Sejf'), (r'\bAltman', 'Oltman'), (r'\bAmodei', 'Amodej'), (r'\bJev\b', 'Dżew'), (r'\bExplain', 'Iksplejn'),
    (r'\bScrimb', 'Skrimb'), (r'\bShift', 'Szift'), (r'\bFlash', 'Flesz'), (r'\bWebflip', 'Łebflip'), (r'\bNetGonet', 'Net Gonet'),
    (r'\bHTML\b', 'ha-te-em-el'), (r'\bAPI\b', 'ej-pi-aj'), (r'\bUsaina', 'Jusejna'), (r'\bBlenderze', 'Blenderze'), (r'\bPro\b', 'Pro'),
]
METHOD_V2 = ('Na koniec uczciwie o tym, jak powstała ta wersja. Pierwszy przegląd złożyła Scrimba Explain: slajdy, obrazy i głos. '
             'Scenariusz był dobry, ale obraz wyglądał jak prezentacja. Ten film to ten sam scenariusz, który model Claude Opus 5.5 '
             'potraktował jak szkic i zmontował od nowa. Każda grafika jest napisana kodem, a każda liczba na ekranie pochodzi z danych: '
             'ściana kafelków to prawdziwe dwieście trzydzieści dziewięć filmów, a zapalone kafelki to wynik przeszukania ich napisów. '
             'Zamiast fragmentów cudzych filmów są karty z krótkimi cytatami, tytułem i datą, więc każde zdanie da się sprawdzić u źródła. '
             'Głos to nadal syntezator, ale tekst dla niego jest pisany słownie i fonetycznie, a model rozpoznawania mowy sprawdził, '
             'czy nazwy brzmią poprawnie. <OPERATOR> zdecydował o tym, co ważne: temat, kanały, głos i to, czego nie pokazujemy. '
             'Resztę, od researchu po render, zrobił Opus. Automatyczne napisy przekręcają nazwy, więc jeśli któryś twórca powiedział coś '
             'inaczej, niż tu streściliśmy, napisz w komentarzu, a poprawimy opis.')
VERSION = re.compile(r'\b(\d{1,2})[.,](\d)\b')


def spoken(t: str) -> str:
    t = VERSION.sub(version, t)
    for p, r in LEX:
        t = re.sub(p, r, t)
    return re.sub(r'\s{2,}', ' ', t).replace(' ,', ',')


def to_xml(says):
    out = []
    for i, (title, text) in enumerate(says):
        a = f's{i}'
        out.append(f'<item anchor="{a}" title="{title}" text="."></item>')
        out.append(f'<say lang="pl-PL" title="{title}" text="[{spoken(text)}](#{a})"/>')
    return '\n'.join(out)


if __name__ == '__main__':
    d = json.loads((V2 / '02_SCRIPTS' / 'v1_says.json').read_text(encoding='utf-8'))
    # cold open + Fable intro were recorded in the pilot (P1); data chapter = v1 'Tematy' + 'Laby'; chapter 1 continues from 'Powrót'
    e1 = d['E1']
    k = next(i for i, (t, _) in enumerate(e1) if t == 'Powrót')
    parts = {'N0': [s for s in e1 if s[0] in ('Tematy', 'Laby w czasie')], 'N1': e1[k:]}
    parts.update({f'N{i}': d[f'E{i}'] for i in range(2, 8)})
    # v1 'Metoda' described the Scrimba slides; v2 says what actually changed and who decided what
    parts['N7'] = [(t, METHOD_V2 if t == 'Metoda' else s) for t, s in parts['N7']]
    left = set()
    for name, says in parts.items():
        x = to_xml(says)
        (V2 / '02_SCRIPTS' / f'{name}.xml').write_text(x, encoding='utf-8')
        body = ' '.join(spoken(t) for _, t in says)
        left |= set(re.findall(r"\b[A-Za-z][\w'-]*[A-Z0-9][\w'-]*\b|\b\d+[.,]\d+\b", body))
        print(name, len(says), 'says', len(body.split()), 'words')
    print('left for review:', ' '.join(sorted(left)))
