"""Display text -> spoken text for the Scrimba en-US voice (and the Polish sections' few fixes).
The display text stays canonical (captions, transcript, repo); only the synthesizer gets this rendering.
Rules were checked with tools/speed_test.py (Whisper): spaced acronyms, "H dot two six four", "five point five".
usage: python spoken_en.py --demo        (prints a sample of conversions and asserts nothing technical is left raw)
"""
import re, sys

ACRONYMS = ['PCM', 'MKV', 'SRT', 'AAC', 'MCP', 'CSS', 'HTTP', 'API', 'URL', 'GOP', 'CPU', 'RMS', 'TTS', 'CDP', 'DOM', 'YAML',
            'MP4', 'WAV', 'JPEG', 'GPU', 'QA', 'SFX', 'IDs?', 'OAuth', 'npx', 'pip', 'VP9', 'MD', 'dBTP']
SPELL = {'OAuth': 'O auth', 'npx': 'N P X', 'pip': 'pip', 'VP9': 'V P nine', 'MD': 'M D', 'dBTP': 'decibels true peak',
         'JPEG': 'J peg', 'YAML': 'yamel', 'QA': 'Q A', 'MP4': 'M P four', 'IDs': 'I Ds', 'ID': 'I D'}
WORD = {  # exact tokens and phrases, longest first
    'Claude Opus 5.5': 'Claude Opus five point five', 'yuvj420p': 'Y U V J four two zero P', 'yuv420p': 'Y U V four two zero P',
    'H.264': 'H dot two six four', 'h264-mkv': 'H two six four dash M K V', 'libx264': 'lib X two six four', 'x264': 'X two six four',
    'yt-dlp': 'Y T D L P', 'FFmpeg': 'F F mpeg', 'ffmpeg': 'F F mpeg', 'ffprobe': 'F F probe', '1080p': 'ten eighty P',
    'blackdetect': 'black detect', 'silencedetect': 'silence detect', 'ebur128': 'E B U R one twenty-eight', 'loudnorm': 'loud norm',
    'atempo': 'A tempo', 'aresample': 'A resample', 'faststart': 'fast start', 'veryfast': 'very fast', 'difflib': 'diff lib',
    'SequenceMatcher': 'sequence matcher', 'renderStill': 'render still', 'getDisplayMedia': 'get display media',
    'MediaRecorder': 'media recorder', 'preferCurrentTab': 'prefer current tab', 'userGesture': 'user gesture',
    'Runtime.evaluate': 'runtime dot evaluate', 'Page.setDownloadBehavior': 'page dot set download behavior',
    'google-auth': 'google auth', 'openai-whisper': 'open A I whisper', 'download_root': 'download root',
    'Mcp-Session-Id': 'M C P session I D', 'MCP-Protocol-Version': 'M C P protocol version', 'User-Agent': 'user agent',
    'Content-Type': 'content type', 'JSON-RPC': 'JSON R P C', 'tools/call': 'tools slash call',
    'notifications/initialized': 'notifications slash initialized', 'text/event-stream': 'text slash event stream',
    'application/json': 'application slash JSON', 'categoryId': 'category I D', 'defaultLanguage': 'default language',
    'defaultAudioLanguage': 'default audio language', 'privacyStatus': 'privacy status', 'isDraft': 'is draft',
    'selfDeclaredMadeForKids': 'self declared made for kids', 'containsSyntheticMedia': 'contains synthetic media',
    'pl-PL': 'P L dash P L', 'en-US': 'E N dash U S', 'gyan.dev': 'gyan dot dev', 'scrimba.com': 'scrimba dot com',
    'films.json': 'films dot JSON', 'qa_history.json': 'Q A history dot JSON', 'SKILL.md': 'skill dot M D',
    '.claude/skills/autonomous-video-production/SKILL.md': 'dot claude, slash skills, slash autonomous video production, slash skill dot M D',
    '.claude/skills/autonomous-video-production': 'dot claude, slash skills, slash autonomous video production',
    'https://scrimba.com/explain/pr/mcp': 'scrimba dot com, slash explain, slash P R, slash M C P',
    'scrimba.com/explain/pr/mcp': 'scrimba dot com, slash explain, slash P R, slash M C P',
    'RENDER_COMPLETE': 'render complete', 'DELIVERY_READY': 'delivery ready',
}


def number_words(m):
    a, b = m.group(1), m.group(2)
    return f"{a} point {' '.join(b)}"


def spoken(text: str) -> str:
    t = text
    t = t.replace('−', 'minus ').replace('–', ' to ')
    t = re.sub(r'(?<!\w)\+(?=\w)', 'plus ', t)                                     # +faststart
    t = re.sub(r'=-(\d+)dB', r' equals minus \1 decibels', t)                    # noise=-50dB
    t = re.sub(r'--([a-z0-9-]+)', lambda m: 'dash dash ' + m.group(1).replace('x264', 'X two six four').replace('-', ' '), t)
    t = re.sub(r'(?<![\d-])(\d+)-(\d+)\b(?!-)', r'\1 to \2', t)                   # frame ranges 0-11418, not dates
    t = re.sub(r'(?<=\w)=(?=\s|$)', ' equals', t)                                     # frames= followed by the range
    for k in sorted(WORD, key=len, reverse=True):
        t = t.replace(k, WORD[k])
    t = re.sub(r'(\d{4})-(\d{2})-(\d{2})', lambda m: f"{m.group(1)}, {' '.join(m.group(2))}, {' '.join(m.group(3))}", t)
    t = re.sub(r'\b(\d+)\.(\d+)\.(\d+)\b', r'\1 dot \2 dot \3', t)                 # 4.0.416
    t = re.sub(r'\b(\d+)\.(\d+)\b', number_words, t)                                # 0.87 -> 0 point 8 7
    t = re.sub(r'\{(\d+)x(\d+)\}', r'brace \1 by \2 brace', t)
    t = re.sub(r'(\d),(\d+)\b(?=,| |$)', lambda m: m.group(0), t)
    t = re.sub(r'(?<=\w)=(?=[\w{])', ' equals ', t)
    for a in ACRONYMS:
        t = re.sub(rf'\b{a}\b', lambda m: SPELL.get(m.group(0), ' '.join(m.group(0))), t)
    t = re.sub(r'\b([a-z]+)_([a-z_]+)\b', lambda m: m.group(0).replace('_', ' '), t)   # stream_token -> stream token
    return re.sub(r'\s{2,}', ' ', t)


RAW = re.compile(r'--|_|=|\{|\}|\bH\.264\b|yuv\d|\bffmpeg\b|\d\.\d')

if __name__ == '__main__':
    import pathlib
    src = pathlib.Path(r'<PROJECT_ROOT>\02_SCRIPT\script.md').read_text(encoding='utf-8')
    src = re.sub(r'<!--.*?-->', '', src, flags=re.S)
    left = []
    for sec in re.split(r'^## ', src, flags=re.M)[1:]:
        head, body = sec.split('\n', 1)
        if '| en |' not in head:
            continue
        for para in [p for p in body.split('\n\n') if p.strip()]:
            sp = spoken(para.strip())
            left += [f'{head.split("|")[0].strip()}: ...{sp[max(0, m.start() - 30):m.end() + 30]}...' for m in RAW.finditer(sp)]
    if '--demo' in sys.argv:
        for s in ['--codec=h264-mkv --frames=0-11418', 'Pixel format yuv420p, limited range.', 'Version 4.0.416, similarity 0.87 to 0.93.',
                  'MCP-Protocol-Version 2025-06-18', '--screen-info={1920x1200}', 'Claude Opus 5.5, minus 14 LUFS, true peak −1.2']:
            print(s, ' -> ', spoken(s))
    print('raw technical tokens left:', len(left))
    for l in left[:40]:
        print('  ', l)
