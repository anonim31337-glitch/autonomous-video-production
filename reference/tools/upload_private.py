# -*- coding: utf-8 -*-
"""PRIVATE upload of the finished film to Laufer108 only (<OPERATOR>'s explicit instruction, 2026-10-05).
Reads everything from 08_YOUTUBE_PACKAGE; refuses any channel other than Laufer108; writes UPLOAD_RECEIPT.json.
usage: python upload_private_laufer108.py [--dry-run] [--video FILE.mp4 --pkg DIR]   (pkg holds metadata.json, miniatura.jpg, napisy_pl.srt)
"""
import json, sys
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CHANNEL_ID = '<CHANNEL_ID>'
TOKEN = Path(r'<OAUTH_TOKEN_FILE>')
P = Path(r'<PROJECT_ROOT>')
PKG = P / '08_YOUTUBE_PACKAGE'
VIDEO = P / '07_EXPORT' / 'LAUFER108_PRZEGLAD_AI_FINAL.mp4'
THUMB = PKG / 'miniatura.jpg'
SRT = PKG / 'napisy_pl.srt'
META = PKG / 'metadata.json'      # {"title","description","tags":[...]}
RECEIPT = PKG / 'UPLOAD_RECEIPT.json'
if '--pkg' in sys.argv:   # same firewall, other film (e.g. a private preview)
    PKG = Path(sys.argv[sys.argv.index('--pkg') + 1])
    VIDEO = Path(sys.argv[sys.argv.index('--video') + 1])
    THUMB, SRT, META, RECEIPT = PKG / 'miniatura.jpg', PKG / 'napisy_pl.srt', PKG / 'metadata.json', PKG / 'UPLOAD_RECEIPT.json'
SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.force-ssl']


def main():
    dry = '--dry-run' in sys.argv
    meta = json.loads(META.read_text(encoding='utf-8'))
    assert len(meta['title']) <= 100, 'title > 100 chars'
    assert len(meta['description'].encode('utf-8')) <= 5000, 'description > 5000 bytes'
    assert sum(len(t) + 2 for t in meta['tags']) <= 480, 'tags > 500 chars'
    assert '<' not in meta['description'] and '>' not in meta['description'], 'angle brackets are rejected by YouTube'
    for f in (VIDEO, THUMB, SRT, TOKEN):
        assert f.exists(), f'missing {f}'
    assert THUMB.stat().st_size < 2 * 1024 * 1024, 'thumbnail must be < 2 MB'

    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES)
    if not creds.valid:
        creds.refresh(Request())
        TOKEN.write_text(creds.to_json(), encoding='utf-8')
    yt = build('youtube', 'v3', credentials=creds, cache_discovery=False)
    ch = yt.channels().list(part='snippet', mine=True).execute()['items']
    if len(ch) != 1 or ch[0]['id'] != CHANNEL_ID:
        raise SystemExit(f'STOP wrong channel: {[(c["id"], c["snippet"]["title"]) for c in ch]}')
    print('FIREWALL_OK', ch[0]['snippet']['title'], CHANNEL_ID)
    if dry:
        print('DRY RUN OK', meta['title'], VIDEO.stat().st_size)
        return

    body = {'snippet': {'title': meta['title'], 'description': meta['description'], 'tags': meta['tags'],
                        'categoryId': '28', 'defaultLanguage': 'pl', 'defaultAudioLanguage': 'pl'},
            'status': {'privacyStatus': 'private', 'selfDeclaredMadeForKids': False, 'embeddable': True,
                       'containsSyntheticMedia': True}}  # narration + images are AI-generated: disclose
    req = yt.videos().insert(part='snippet,status', body=body,
                             media_body=MediaFileUpload(str(VIDEO), mimetype='video/mp4', resumable=True, chunksize=16 * 1024 * 1024))
    resp = None
    while resp is None:
        st, resp = req.next_chunk()
        if st:
            print(f'UP {int(st.progress() * 100)}%', flush=True)
    vid = resp['id']
    if resp['snippet']['channelId'] != CHANNEL_ID or resp['status']['privacyStatus'] != 'private':
        raise SystemExit(f'STOP unexpected result {resp["snippet"]["channelId"]} {resp["status"]["privacyStatus"]}')
    print('VIDEO', vid)
    # insert does not always keep the AI-content flag: set it again explicitly
    yt.videos().update(part='status', body={'id': vid, 'status': {'privacyStatus': 'private', 'selfDeclaredMadeForKids': False,
                                                                'embeddable': True, 'containsSyntheticMedia': True}}).execute()

    out = {'video_id': vid, 'url': f'https://youtu.be/{vid}', 'studio': f'https://studio.youtube.com/video/{vid}/edit',
           'channel': CHANNEL_ID, 'privacy': 'private', 'title': meta['title']}
    try:
        yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(THUMB), mimetype='image/jpeg')).execute()
        out['thumbnail'] = 'OK'
    except Exception as e:
        out['thumbnail'] = f'FAIL {type(e).__name__}: {str(e)[:200]}'
    try:
        yt.captions().insert(part='snippet', body={'snippet': {'videoId': vid, 'language': 'pl', 'name': 'Polski', 'isDraft': False}},
                             media_body=MediaFileUpload(str(SRT), mimetype='application/octet-stream')).execute()
        out['captions'] = 'OK'
    except Exception as e:
        out['captions'] = f'FAIL {type(e).__name__}: {str(e)[:200]}'
    RECEIPT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
