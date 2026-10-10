"""Speed gate for the English machine section: time-compress the narration (pitch kept, ffmpeg atempo) and check
with Whisper whether the words and the technical terms survive. -> 01_AUDIT/speed_test.json
usage: python speed_test.py <narration.wav> <reference.txt> 1.0 1.7 1.8 1.9 2.0"""
import difflib, json, re, subprocess, sys
from pathlib import Path
import whisper

FF = r'<FFMPEG_BIN>\ffmpeg.exe'
OUT = Path(r'<PROJECT_ROOT>\01_AUDIT')
# term -> regex that accepts the ways an ASR may legitimately write it
TERMS = {'Remotion': r'remotion', 'ffmpeg': r'f\s*f\s*mpeg|ffmpeg', 'Whisper': r'whisper', 'yt-dlp': r'y\.?\s*t\.?[\s-]*d\.?\s*l\.?\s*p',
         'LUFS': r'lufs|loofs|l\.?\s*u\.?\s*f\.?\s*s', 'H.264': r'h\s*(dot|\.)?\s*(264|two six four|26 4)', 'PCM': r'p\.?\s*c\.?\s*m',
         'MKV': r'm\.?\s*k\.?\s*v', 'YUVJ420P': r'y\.?\s*u\.?\s*v\.?\s*j\.?\s*(420|four two zero|4 2 0)', 'YUV420P': r'y\.?\s*u\.?\s*v\.?\s*(420|four two zero|4 2 0)\s*p',
         'SRT': r's\.?\s*r\.?\s*t', 'JSON': r'json|jason', 'anchor misses': r'anchor misses', 'twenty-three': r'twenty[\s-]three|\b23\b',
         'Claude Code': r'cla?ude code', 'Opus 5.5': r'opus (five point five|5\.5)'}


def norm(s):
    return re.findall(r'[a-z0-9]+', s.lower())


def main():
    wav, ref = Path(sys.argv[1]), Path(sys.argv[2]).read_text(encoding='utf-8')
    model = whisper.load_model('medium', download_root=r'<WHISPER_MODELS>', device='cpu')
    res = {}
    for sp in sys.argv[3:]:
        out = OUT / f'speed_{sp}.wav'
        subprocess.run([FF, '-v', 'error', '-y', '-i', str(wav), '-af', f'atempo={sp}', str(out)], check=True)
        text = model.transcribe(str(out), language='en', fp16=False)['text']
        low = text.lower()
        hits = {t: bool(re.search(r, low)) for t, r in TERMS.items()}
        sim = difflib.SequenceMatcher(None, norm(ref), norm(text), autojunk=False).ratio()
        res[sp] = {'similarity': round(sim, 3), 'terms_hit': sum(hits.values()), 'terms_total': len(TERMS),
                   'missed': [t for t, h in hits.items() if not h], 'transcript': text.strip()}
        print(sp, res[sp]['similarity'], f"{res[sp]['terms_hit']}/{len(TERMS)}", res[sp]['missed'], flush=True)
    (OUT / 'speed_test.json').write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding='utf-8')


if __name__ == '__main__':
    main()
