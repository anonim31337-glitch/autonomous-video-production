"""Push markup chunks to an open Scrimba stream, optionally finish.
usage: python scrimba_push.py <name> <chunk.xml> [<chunk2.xml> ...] [--finish]
Reads the stream_token from 03_SCRIMBA_RAW/streams/<name>/start_result.txt.
"""
import re, sys, json
from pathlib import Path
from scrimba_mcp import MCP

name = sys.argv[1]
d = Path(r'<PROJECT_ROOT>\03_SCRIMBA_RAW\streams') / name
token = re.search(r'stream_token: (\S+)', (d / 'start_result.txt').read_text(encoding='utf-8')).group(1)
m = MCP()
log = d / 'push_log.txt'
for f in [a for a in sys.argv[2:] if not a.startswith('--')]:
    markup = Path(f).read_text(encoding='utf-8-sig')
    text, err = m.call('append_explainer_chunk', {'stream_token': token, 'markup': markup})
    line = f"{'ERROR' if err else 'OK'} {Path(f).name} ({len(markup.encode())} B): {text}"
    print(line)
    with log.open('a', encoding='utf-8') as fh:
        fh.write(line + '\n')
    if err:
        sys.exit(1)
if '--finish' in sys.argv:
    text, err = m.call('finish_explainer_stream', {'stream_token': token})
    print('FINISH', 'ERROR' if err else 'OK', text)
    with log.open('a', encoding='utf-8') as fh:
        fh.write(f'FINISH {text}\n')
