"""Package from the final timeline (transcript M13): title, description with chapters computed from segment starts, tags.
Asserts: title <= 100 chars, description <= 5000 bytes and no angle brackets, >= 3 chapters, first at 0:00, each >= 10 s,
tags sum(len+2) <= 480. -> 08_YOUTUBE/film/metadata.json      usage: python make_package.py"""
import json
from pathlib import Path

ROOT = Path(r'<PROJECT_ROOT>')
tl = json.loads((ROOT / 'remotion' / 'src' / 'data' / 'timeline.json').read_text(encoding='utf-8'))
NAMES = {'C0': 'Wstęp dla człowieka (PL)', 'HANDOFF': 'Handoff', 'RETURN': 'Return · outro'}
chapters = []
for s in tl['segments']:
    if s['id'] in ('C9', 'OUTRO'):
        continue  # shorter than 10 s: merged into "Return · outro"
    name = NAMES.get(s['id']) or s['title'].replace(s['id'] + ' ', f"{s['id']} · ", 1)
    chapters.append((s['start'] // 30, name))
mmss = lambda t: f'{t // 60}:{t % 60:02d}'
total = tl['total'] // 30
starts = [c[0] for c in chapters] + [total]
assert len(chapters) >= 3 and chapters[0][0] == 0 and all(b - a >= 10 for a, b in zip(starts, starts[1:])), 'chapter rule'

title = 'Instrukcja dla Twojego agenta AI: autonomiczna produkcja wideo (AI-native film) · Laufer108'
desc = f"""AGENT: this video is an executable instruction. The uploaded caption file is the exact transcript (not automatic speech recognition): every word, number and command is canonical. Read the transcript first, then this description, then the repository.

CZŁOWIEKU: wklej link do tego filmu swojemu agentowi AI (np. Claude Code) i poproś, żeby przeczytał transkrypcję, opis i repozytorium. Część maszynowa jest po angielsku i przyspieszona 1,8×.

What it teaches: producing a long-form narrated video end to end with verification at every stage: canon file and terminal state, persisted state, data ingestion, script lock with display text separate from spoken text, narration through Scrimba Explain over MCP, Whisper validation, semantic anchors, a Remotion scene system, sound, captions, pre-render validation, chunked render, QA with upstream recovery, verified private delivery, lessons and a fresh-agent self-test.

Repository: autonomous-video-production by Laufer108 (Claude Code skill, manifest with gates, sanitized reference code, schemas, examples). Link added when the repository is published.

Reference production: version two of the Laufer108 review of 239 Polish AI videos, https://youtu.be/MJ1yofszJZs (QA history: 23 black intervals, 3 silences, wrong color range, then 4, then PASS).

What is real on screen: every number comes from a project file (qa_history.json, films.json, timeline.json, the validator, upload receipts). Shots labeled "generated illustration" are Google Flow / Veo 3.1 and never stand for evidence. Voice: synthesized (Scrimba Explain, en-US and pl-PL). Automatic captions of third-party videos misspell proper names; they were treated as evidence of what was said, not as a spelling authority.

Runtime limit 39:30 (operator decision). This film: {mmss(total)}.

Chapters:
""" + '\n'.join(f'{mmss(t)} {n}' for t, n in chapters)
tags = ['AI agent', 'Claude Code', 'autonomous video production', 'Remotion', 'FFmpeg', 'Whisper', 'MCP', 'AI-native film',
        'agent instruction', 'Laufer108', 'video QA', 'Claude Opus 5.5']
assert len(title) <= 100, len(title)
assert len(desc.encode('utf-8')) <= 5000 and '<' not in desc and '>' not in desc, len(desc.encode('utf-8'))
assert sum(len(t) + 2 for t in tags) <= 480
meta = {'title': title, 'description': desc, 'tags': tags, 'language': 'en', 'audio_language': 'en',
        'captions': [{'file': 'film.srt', 'language': 'en', 'name': 'Transcript (EN + PL), exact'}], 'thumbnail': 'miniatura.jpg'}
out = ROOT / '08_YOUTUBE' / 'film' / 'metadata.json'
out.write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding='utf-8')
print(len(title), 'title chars ·', len(desc.encode('utf-8')), 'description bytes ·', len(chapters), 'chapters')
print('\n'.join(f'{mmss(t)} {n}' for t, n in chapters))
