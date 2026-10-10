"""Pronunciation check: Whisper (medium, local, on D) transcribes each narration wav; the transcript is compared word by word
with the display text of the captions. Differences around names/numbers = places where the TTS may have misread.
-> V2/out/asr/<name>.json + V2/out/asr/REPORT.txt
usage: python asr_check_all.py n0 n1 ...  (wav + cues from remotion/)"""
import difflib, json, re, sys
from pathlib import Path
import whisper
sys.path.insert(0, str(Path(__file__).parent))
from make_srt import display

V = Path(r'<PROJECT_ROOT>\V2')
OUT = V / 'out' / 'asr'
OUT.mkdir(parents=True, exist_ok=True)
norm = lambda s: re.findall(r'[^\W_]+', s.lower())
model = whisper.load_model('medium', download_root=r'<WHISPER_MODELS>', device='cpu')
report = []
for name in sys.argv[1:]:
    cues = json.loads((V / 'remotion' / 'src' / 'data' / f'{name}_cues.json').read_text(encoding='utf-8'))
    ref = norm(' '.join(display([l['text'] for l in cues['lines']])))
    r = model.transcribe(str(V / 'remotion' / 'public' / f'{name}_narration.wav'), language='pl', fp16=False,
                         condition_on_previous_text=False, initial_prompt='Claude, Fable, Opus, Sonnet, GPT, OpenAI, Anthropic, Codex, Kimi, Qwen, Gemini, API')
    (OUT / f'{name}.json').write_text(json.dumps(r['segments'], ensure_ascii=False), encoding='utf-8')
    hyp = norm(' '.join(s['text'] for s in r['segments']))
    sm = difflib.SequenceMatcher(None, ref, hyp, autojunk=False)
    diffs = [f"  {t:7} ref: {' '.join(ref[a0:a1])!r:40} asr: {' '.join(hyp[b0:b1])!r}"
             for t, a0, a1, b0, b1 in sm.get_opcodes() if t != 'equal']
    report.append(f'== {name}: similarity {sm.ratio():.3f}, {len(diffs)} differences\n' + '\n'.join(diffs))
    (OUT / 'REPORT.txt').write_text('\n\n'.join(report), encoding='utf-8')
    print(name, round(sm.ratio(), 3), len(diffs), flush=True)
