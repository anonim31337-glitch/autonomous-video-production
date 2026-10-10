# -*- coding: utf-8 -*-
"""PRIVATE upload to Laufer108 only, with read-back. Package dir holds metadata.json:
{"title", "description", "tags": [...], "language": "en", "audio_language": "en", "captions": [{"file", "language", "name"}],
 "thumbnail": "miniatura.jpg" (optional)}
Stops on a wrong channel. Never writes the token file (refresh stays in memory). Writes UPLOAD_RECEIPT.json with the read-back.
usage: python upload_an.py --video FILM.mp4 --pkg DIR [--dry-run]"""
import json, sys
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CHANNEL_ID = '<CHANNEL_ID>'
TOKEN = Path(r'<OAUTH_TOKEN_FILE>')
SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.force-ssl']


def main():
    video = Path(sys.argv[sys.argv.index('--video') + 1]); pkg = Path(sys.argv[sys.argv.index('--pkg') + 1])
    meta = json.loads((pkg / 'metadata.json').read_text(encoding='utf-8'))
    assert len(meta['title']) <= 100, 'title > 100 chars'
    assert len(meta['description'].encode('utf-8')) <= 5000, 'description > 5000 bytes'
    assert sum(len(t) + 2 for t in meta['tags']) <= 480, 'tags over the 480 margin (YouTube limit 500)'
    assert '<' not in meta['description'] and '>' not in meta['description'], 'angle brackets are rejected by YouTube'
    thumb = pkg / meta['thumbnail'] if meta.get('thumbnail') else None
    for f in [video, TOKEN] + [pkg / c['file'] for c in meta['captions']] + ([thumb] if thumb else []):
        assert f.exists(), f'missing {f}'

    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES)
    if not creds.valid:
        creds.refresh(Request())
    yt = build('youtube', 'v3', credentials=creds, cache_discovery=False)
    ch = yt.channels().list(part='snippet', mine=True).execute()['items']
    if len(ch) != 1 or ch[0]['id'] != CHANNEL_ID:
        raise SystemExit(f'STOP wrong channel: {[(c["id"], c["snippet"]["title"]) for c in ch]}')
    print('FIREWALL_OK', ch[0]['snippet']['title'])
    if '--dry-run' in sys.argv:
        print('DRY RUN OK', meta['title'], video.stat().st_size)
        return

    status = {'privacyStatus': 'private', 'selfDeclaredMadeForKids': False, 'embeddable': True, 'containsSyntheticMedia': True}
    body = {'snippet': {'title': meta['title'], 'description': meta['description'], 'tags': meta['tags'], 'categoryId': '28',
                        'defaultLanguage': meta.get('language', 'en'), 'defaultAudioLanguage': meta.get('audio_language', 'en')}, 'status': status}
    req = yt.videos().insert(part='snippet,status', body=body,
                             media_body=MediaFileUpload(str(video), mimetype='video/mp4', resumable=True, chunksize=16 * 1024 * 1024))
    resp = None
    while resp is None:
        st, resp = req.next_chunk()
        if st:
            print(f'UP {int(st.progress() * 100)}%', flush=True)
    vid = resp['id']
    if resp['snippet']['channelId'] != CHANNEL_ID or resp['status']['privacyStatus'] != 'private':
        raise SystemExit(f'STOP unexpected result {resp["snippet"]["channelId"]} {resp["status"]["privacyStatus"]}')
    upd = yt.videos().update(part='status', body={'id': vid, 'status': status}).execute()
    out = {'video_id': vid, 'url': f'https://youtu.be/{vid}', 'channel': CHANNEL_ID, 'title': meta['title'],
           'update_response_containsSyntheticMedia': upd['status'].get('containsSyntheticMedia')}
    if thumb:
        try:
            yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(thumb), mimetype='image/jpeg')).execute()
            out['thumbnail'] = 'OK'
        except Exception as e:
            out['thumbnail'] = f'FAIL {type(e).__name__}: {str(e)[:200]}'
    out['captions'] = []
    for c in meta['captions']:
        try:
            yt.captions().insert(part='snippet', body={'snippet': {'videoId': vid, 'language': c['language'], 'name': c['name'], 'isDraft': False}},
                                 media_body=MediaFileUpload(str(pkg / c['file']), mimetype='application/octet-stream')).execute()
            out['captions'].append(f"OK {c['language']}")
        except Exception as e:
            out['captions'].append(f"FAIL {c['language']} {type(e).__name__}: {str(e)[:200]}")
    # read-back: what YouTube actually stored
    v = yt.videos().list(part='snippet,status,contentDetails', id=vid).execute()['items'][0]
    caps = yt.captions().list(part='snippet', videoId=vid).execute()['items']
    out['read_back'] = {'channel_ok': v['snippet']['channelId'] == CHANNEL_ID, 'privacy': v['status']['privacyStatus'],
                        'title_ok': v['snippet']['title'] == meta['title'], 'duration': v['contentDetails']['duration'],
                        'containsSyntheticMedia': v['status'].get('containsSyntheticMedia'), 'upload_status': v['status']['uploadStatus'],
                        'captions': [(x['snippet']['language'], x['snippet']['name'], x['snippet'].get('status')) for x in caps]}
    out['verified'] = out['read_back']['channel_ok'] and out['read_back']['privacy'] == 'private' and out['read_back']['title_ok'] \
        and len(caps) >= len(meta['captions'])
    (pkg / 'UPLOAD_RECEIPT.json').write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(out, ensure_ascii=False, indent=2))
    raise SystemExit(0 if out['verified'] else 1)


if __name__ == '__main__':
    main()
