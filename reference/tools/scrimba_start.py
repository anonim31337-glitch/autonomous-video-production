"""Open a Scrimba explainer stream and persist url/token/contract.
usage: python scrimba_start.py <name> "<title>" "<description>"
"""
import json, sys
from pathlib import Path
from scrimba_mcp import MCP

name, title, desc = sys.argv[1], sys.argv[2], sys.argv[3]
out = Path(r'<PROJECT_ROOT>\03_SCRIMBA_RAW\streams') / name
out.mkdir(parents=True, exist_ok=True)
m = MCP()
text, err = m.call('start_explainer_stream', {'title': title, 'description': desc, 'mode': 'landscape'})
(out / 'start_result.txt').write_text(text, encoding='utf-8')
print('ERROR' if err else 'OK', len(text), 'chars')
print(text[:1500])
