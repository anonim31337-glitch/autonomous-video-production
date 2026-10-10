---
name: autonomous-video-production
description: Produce a long-form narrated video end to end (script lock, TTS with phonetic preprocessing, Whisper validation, phrase-anchored Remotion scenes, chunked render, ffmpeg assembly, automated QA with upstream repair, verified private YouTube upload). Use when an operator asks an agent to make, re-edit or deliver a long-form explainer or review video. Reference implementation by Laufer108.
---

# Autonomous video production

Reference implementation: Laufer108 review film, version 2 (35:25, delivered privately 2026-10-06). Real code: `reference/`.
Real artifacts: `examples/`. Full narrated instruction: `TRANSCRIPT.md`. Detailed chapters: `docs/`.

**Rule zero: RENDER_COMPLETE != DELIVERY_READY.** An encoder exiting with code 0 proves the encoder finished, nothing more.
Delivery happens only after every delivery gate passes on the final artifacts.

## 0. Source authority
1. Artifacts on disk > canon file > earlier prompts > chat. If the canon contradicts the artifacts it names, fix the canon.
2. Unverifiable facts are marked `unverified`. Never add facts for narrative effect.
3. Persist state: canon file, work log, append-only `qa_history.json`, lessons file. Never rely on chat memory.

## 1. Bootstrap (ask the operator once, record answers with a date in the canon)
Topic and sources · channels + cutoff date (review films) · narration language · voice engine and the operator's decision on its terms of use · rights-cleared music · target channel id + OAuth token file · runtime limit · what must not be shown. Copy `templates/canon.md` and fill it. Everything else: decide and verify yourself. Defaults when unspecified: human-facing sections at 1.0×; `categoryId` 28 (Science & Technology); a fact without an operator source is labeled "general knowledge" on screen and in the description. Never request passwords; never publish publicly.

## 2. Order of work
1. Canon (terminal state: deliverable, runtime limit, gates) **before** any asset. Write the intro last, when the destination is known.
2. Data (data-driven films only): one generator → one data file with asserted counts. Read every regex hit in context.
3. Script in modules below the TTS limit (Scrimba Explain: ~10 min / ~1,500 words per explainer). Every number has an author (creator, video, date); disagreements show both sides. Freeze it.
4. Instructional films: a fresh agent that sees only the script must be able to build a pilot. Its questions are defects.
5. Display text (canonical) → spoken text via a deterministic lexicon (`reference/tools/spoken.py`) + its reverse (`make_srt.py`). Read the spoken output before recording.
6. Scenes against placeholder timings (`fake_cues.py`: nominal rate, 5 words/line, silent wav, marked fake).
7. Narration: record each module; extract audio + cues (`extract_narration.py`); Whisper gate; anchor validator again.
8. Pre-render review: stills every 7 s → contact sheets (`stills.mjs`, `sheets.py`). Fix layout here.
9. Chunked render → assembly → QA → classify → upstream fix → partial re-render → QA again → package → private upload → read-back verification → report + lessons.

## 3. Narration (reference engine: Scrimba Explain MCP, `https://scrimba.com/explain/pr/mcp`)
- MCP over streamable HTTP, JSON-RPC 2.0. Headers: `Content-Type: application/json`, `Accept: application/json, text/event-stream`, `MCP-Protocol-Version: 2025-06-18`, a `User-Agent` (without it: HTTP 403). `initialize` → `notifications/initialized` → keep `Mcp-Session-Id`. Event-stream reply: take the last `data:` event.
- `start_explainer_stream {title, description, mode:"landscape"}` → reply: link, `stream_token: …`, ~64k-char markup contract (read it). `append_explainer_chunk {stream_token, markup}`. `finish_explainer_stream {stream_token}`. Stream tokens are secrets.
- Markup per block: `<item anchor="s0" title="T" text="."></item>` + `<say lang="en-US" title="T" text="[narration](#s0)"/>`. Voice = `lang` only (`pl-PL`, `en-US`).
- Download needs login + claim → the reference run captured playback (audio + timing log only; video discarded). Terms-of-use compliance: **unverified**; the operator decides. Any replacement engine must output: one audio file per module + cues `{duration, lines:[{t, text}]}` (`schemas/cues.schema.json`). **If the endpoint, the markup contract or the capture breaks: stop, write the failure into the canon and report to the operator.** Switching the voice engine is the operator's decision.
- Capture: Chrome flags in `reference/tools/start_recorder.ps1`; clear site storage first (the player remembers position); `getDisplayMedia` with `preferCurrentTab` and audio processing off; 50 ms log of `guide-captions .caption-line`, `section.guide-slide.active`, sign-up nag (`Continue watching`: click, log on/off); play via `.guide-big-play` with `userGesture:true`; end when `voice-over-control .time` reads `x / x`.
- Extract: play − 0.15 s → start of last line + 1.8 s; remove nag pauses; shift times.
- Phonetics: decimals as words; foreign names respelled; English acronyms spaced ("F F mpeg", "Y T D L P"), "H dot two six four", "five point five". Measured en-US rate: 142 wpm. Polish: 148 wpm.
- Whisper: `pip install openai-whisper`, **ffmpeg on PATH**, model `medium` with `download_root` on a data drive, initial prompt with product names. Gate: all listed names recognized + difflib ratio ≥ 0.85 between the Whisper text and the **display** text (lowercase words, digits for numbers; `reference/tools/asr_gate_en.py`). Never compare with the spoken text: the same English recording scored 0.81 against it and 0.97–0.99 against the display text. On a fail, fix the display text or re-record; never lower the threshold.
- Speed (machine sections only): `atempo` on the extracted wav, divide cue times by the factor, then compute anchors. Measured: 16/16 terms at 1.7×, 15/16 at 1.8–2.0× (miss = homophone). Target 1.8×; choose from a real module.

## 4. Anchors
`at(phrase, offsetSec=0, nth=0)` → frame relative to the segment; word times interpolated inside each caption line by (word length + 1); last line 2.5 s; normalization: lowercase, Unicode letters/digits kept. Missing phrase → **throw**. Validator (`check_phrases.py`) before every render: gate 0 missing. Never stretch narration to fit a visual; anchor the visual earlier.

## 5. Scenes (Remotion 4.0.416, 1920×1080, 30 fps)
- Chapter = list of beats `{from: at(phrase), el}`; a beat lasts until the next; 10-frame crossfade. Reuse a kit: Head, Bars (true proportion, value width ≤ 880 px, no wrapping), Versus, Flow, Points, By (source line), Wall (one tile per real item from the data file).
- **Skeleton rule:** a beat shows its structure (cards, labels, steps, dimmed list items) from its first frame; values light at their anchors. Its absence caused 23 empty intervals in the reference run.
- Color is semantic: one accent for the current topic, one for labels/sources, red only for real failures, green only for real passes. Nothing moves without data.
- Titles sized by length, no wrapping. Every number from the data file or an attributed source.
- Composition computes duration from the cues; the caption builder repeats the formula in Python; frame counts must match exactly. Runtime limit asserted in the composition.

## 6. Sound
Voice + rights-cleared music bed + generated effects, mixed in Remotion with linear gains. Bed: 0→0.42 over 12 frames, 0.42 on chapter cards, →0.08 over 20 frames under the voice, →0 over the last 30 frames; **loop** the bed for the whole segment (a one-shot bed left 3 silences > 2 s). A bed is mandatory: 2.6 s card + 1 s tail = 3.6 s without voice. Effects (tick, whoosh, hit) only at information reveals, 0.3–0.7.

## 7. Captions (canonical transcript)
SRT, one cue per caption line, mapped with the composition's segment formula; end = next start − 40 ms, ≤ 6 s; last cue lasts 3 s − 40 ms and ends inside the film. Reverse lexicon over lines joined with `¦` (patterns accept the marker between words; keep the marker after a replacement; punctuation before it). Assert: same line count; no phonetic spelling outside quotation marks; end > start; no overlap; last cue inside the film. Freeze per-segment offsets (an advancing offset once shifted every caption block by its chapter length).

## 8. Render and assembly
Chunks at chapter boundaries: `npx remotion render <entry> <comp> partN.mkv --codec=h264-mkv --frames=A-B --concurrency=4 --x264-preset=veryfast --crf=18` (H.264 + PCM: gapless joins). Skip existing chunks; archive instead of deleting. Assembly: concat demuxer `-c copy` → `loudnorm` measure (print_format=json) → one pass: `-vf scale=in_range=full:out_range=tv,format=yuv420p -c:v libx264 -preset veryfast -crf 17 -g 60 -color_range tv -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_*=…:linear=true,aresample=48000 -c:a aac -b:a 256k -movflags +faststart`. JPEG frame capture yields full range; the Remotion pixel-format setting did not fix it; the final pass does. Reference cost: ~1 h per 35 min of 1080p on a 4-thread laptop CPU.

## 9. QA gates
**Build:** 0 anchor misses · runtime ≤ limit · contact sheets reviewed · caption assertions · Whisper gate.
**Delivery (final artifacts):** runtime ≤ limit · 1920×1080 · 30 fps · 48 kHz · −14 ±1 LUFS · true peak ≤ −1 dBTP · no black > 0.5 s (`blackdetect=d=0.5:pix_th=0.08`) · no silence > 2 s (`silencedetect=noise=-50dB:d=2`) · 0 decode errors · captions inside the film, no phonetics · yuv420p limited range · frames reviewed (1 per minute + 1 per detector interval) · upload verified by read-back.
Tool: `reference/tools/qa.py`. History: append to `qa_history.json` (`schemas/qa.schema.json`, `examples/qa_history.json`).

## 10. Failure recovery
1. Do not patch the final video manually unless unavoidable.
2. Classify: extract a frame per reported interval and look. (Reference run: 23/23 black intervals were real header-only frames; 0 false positives.)
3. Find the deterministic upstream cause; change composition, timing, asset logic or pipeline.
4. Re-render only affected chunks when possible (reference: render 1 full → render 2 full → render 3 chunks 0, 1, 3 + assembly).
5. Re-run QA on the new final file. 6. Never infer success from render completion.
A gate that does not belong to the project (e.g. an inherited runtime window) is documented as not applicable, never silently ignored.

## 11. Delivery
Package from the final timeline: title ≤ 100 chars · description ≤ 5000 bytes, no `<` `>` · ≥ 3 chapters, first at 0:00, each ≥ 10 s (only when the film has ≥ 3 such segments; a single-segment pilot has none) · tags: Σ(len + 2) ≤ 480 (YouTube allows 500; 480 is the margin the reference used) · thumbnail 1280×720 legible at 320×180.
Upload (YouTube Data API v3, scopes `youtube.upload` + `youtube.force-ssl`, operator-provided authorized-user token): `channels.list(part=snippet, mine=true)` must equal the expected channel id, else stop → resumable `videos.insert` (snippet: title, description, tags, `categoryId`, `defaultLanguage`, `defaultAudioLanguage`; status: `privacyStatus=private`, `selfDeclaredMadeForKids=false`, `embeddable=true`, `containsSyntheticMedia=true`) → `videos.update(part=status)` re-setting the flag (read-back after insert did not show it) → `thumbnails.set` (needs a verified channel; record failure) → `captions.insert` (language, name, `isDraft=false`) → receipt → `videos.list` + `captions.list` read-back. Previews for the operator are private uploads. **Public release is the operator's decision only.**

## 12. Close the loop
Report with numbers. Lessons: symptom, cause, fix, evidence, canon yes/no. Self-test with a fresh agent (transcript + description + repo only) building a 60–120 s pilot that passes every gate.
