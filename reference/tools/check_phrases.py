"""Every at('…') phrase in chapters/ChN.tsx must occur in the narration of that chapter (same normalisation as cues.ts).
Run after each new recording: Scrimba's caption log can split or spell words differently from the script.
usage: python check_phrases.py   -> lists missing phrases, exit 1 if any"""
import json, re, sys
from pathlib import Path

V = Path(r'<PROJECT_ROOT>\V2\remotion\src')
norm = lambda s: ' '.join(re.findall(r'[^\W_]+', s.lower()))
bad = 0
for i in range(8):
    cues = json.loads((V / 'data' / f'n{i}_cues.json').read_text(encoding='utf-8'))
    text = ' ' + norm(' '.join(l['text'] for l in cues['lines'])) + ' '
    src = (V / 'chapters' / f'Ch{i}.tsx').read_text(encoding='utf-8')
    phrases = set(re.findall(r"\bat\('([^']+)'", src))
    missing = [p for p in sorted(phrases) if f' {norm(p)} ' not in text]
    tag = 'FAKE' if cues.get('fake') else 'REAL'
    print(f'Ch{i} [{tag}] {len(phrases)} phrases, missing {len(missing)}: {missing}')
    bad += len(missing)
sys.exit(1 if bad else 0)
