"""Minimal streamable-HTTP MCP client for Scrimba Explain (PR/CI endpoint: no auth, unlisted).
usage: python scrimba_mcp.py tools
       python scrimba_mcp.py call <tool> <args.json>
"""
import json, sys, urllib.request

URL = 'https://scrimba.com/explain/pr/mcp'


class MCP:
    def __init__(self, url=URL):
        self.url, self.sid, self.n = url, None, 0
        self.rpc('initialize', {'protocolVersion': '2025-06-18', 'capabilities': {},
                                'clientInfo': {'name': 'laufer108-opus', 'version': '1.0'}})
        self.notify('notifications/initialized')

    def _post(self, payload):
        h = {'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream',
             'User-Agent': 'claude-code/2.1 (laufer108)', 'MCP-Protocol-Version': '2025-06-18'}
        if self.sid:
            h['Mcp-Session-Id'] = self.sid
        req = urllib.request.Request(self.url, json.dumps(payload).encode(), h)
        try:
            r = urllib.request.urlopen(req, timeout=300)
        except urllib.error.HTTPError as e:
            raise RuntimeError(f'HTTP {e.code}: {e.read().decode("utf-8", "replace")[:800]}')
        with r:
            self.sid = r.headers.get('Mcp-Session-Id') or self.sid
            body = r.read().decode('utf-8')
            ctype = r.headers.get('Content-Type', '')
        if not body.strip():
            return None
        if 'event-stream' in ctype:  # take the last JSON data event
            datas = [l[5:].strip() for l in body.splitlines() if l.startswith('data:')]
            return json.loads(datas[-1]) if datas else None
        return json.loads(body)

    def rpc(self, method, params=None):
        self.n += 1
        res = self._post({'jsonrpc': '2.0', 'id': self.n, 'method': method, 'params': params or {}})
        if res and 'error' in res:
            raise RuntimeError(res['error'])
        return res['result'] if res else None

    def notify(self, method, params=None):
        self._post({'jsonrpc': '2.0', 'method': method, 'params': params or {}})

    def call(self, tool, args):
        r = self.rpc('tools/call', {'name': tool, 'arguments': args})
        return '\n'.join(c.get('text', '') for c in r.get('content', [])), r.get('isError')


if __name__ == '__main__':
    m = MCP()
    if sys.argv[1] == 'tools':
        for t in m.rpc('tools/list')['tools']:
            print('=' * 80, '\n', t['name'], '\n', t.get('description', ''), '\n', json.dumps(t.get('inputSchema'), indent=1, ensure_ascii=False))
    elif sys.argv[1] == 'call':
        args = json.loads(open(sys.argv[3], encoding='utf-8-sig').read())
        text, err = m.call(sys.argv[2], args)
        print('ERROR' if err else 'OK', text)
