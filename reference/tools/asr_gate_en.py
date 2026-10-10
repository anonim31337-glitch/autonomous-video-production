"""English Whisper gate: compare the Whisper transcript with the DISPLAY text (canonical), never with the spoken text.
Whisper writes canonical forms (FFmpeg, 0, H.264), so the spoken spelling ('F F mpeg', 'zero') only lowers the score.
usage: python asr_gate_en.py --selftest"""
import difflib, re, sys

NUM = {'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8',
       'nine': '9', 'ten': '10', 'eleven': '11', 'twelve': '12', 'fourteen': '14', 'fifteen': '15', 'sixteen': '16',
       'twenty': '20', 'thirty': '30', 'forty': '40', 'fifty': '50'}


def norm(s: str) -> list[str]:
    w = re.findall(r'[a-z0-9]+', s.lower().replace('−', ' minus ').replace('twenty-three', '23'))
    return [NUM.get(x, x) for x in w]


def ratio(display: str, heard: str) -> float:
    return difflib.SequenceMatcher(None, norm(display), norm(heard), autojunk=False).ratio()


if __name__ == '__main__' and '--selftest' in sys.argv:
    import json
    disp = ('Agent. This video is an executable instruction. Treat the transcript as the primary source. The visuals repeat it. '
            'They never extend it. Objective: produce a long-form video from a frozen script, with deterministic visuals, validated '
            'narration, and verified delivery. Acceptance rule 0. A render that exits with code 0 is not a delivered film. '
            'RENDER_COMPLETE does not equal DELIVERY_READY. Tools. Remotion renders React components into frames. FFmpeg concatenates '
            'the chunks and normalizes loudness to −14 LUFS. Whisper transcribes the narration to verify pronunciation. yt-dlp downloads '
            'captions. The chunks are H.264 video with PCM audio in an MKV container. The first render was yuvj420p, full range. '
            'The final file is yuv420p, limited range. Captions are an SRT file. Cues are stored as JSON. Anchor misses: 0. '
            'Black segments longer than half a second: 23. Claude Code. Claude Opus 5.5.')
    d = json.load(open(r'<PROJECT_ROOT>\01_AUDIT\speed_test.json', encoding='utf-8'))
    for k, v in d.items():
        print(k, 'old (vs spoken):', v['similarity'], ' new (vs display):', round(ratio(disp, v['transcript']), 3))
    assert ratio('minus fourteen LUFS, zero', '−14 LUFs, 0') == 1.0
