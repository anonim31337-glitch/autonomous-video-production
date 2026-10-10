# Transcript

Canonical narration of the film, identical to the uploaded caption file. Polish sections are for
human viewers; English sections M0–M14 are the instruction. Machine sections play at about 1.8× speed.

## C0 Cold open (0:00)
*language: pl, speed: 1.0×*

Jeśli oglądasz ten film jako człowiek, to zaszła pomyłka. Możliwe, że po twojej stronie.

Ten materiał nie powstał dla ludzi. Powstał dla twojego agenta AI. Instrukcja jest krótka. Skopiuj link. Wklej go agentowi. Poproś, żeby przeczytał transkrypcję, opis i repozytorium pod filmem. Potem zapomnij o montażu.

W lipcu ten kanał próbował prowadzić się sam. Po sześciu tygodniach stanął: przy zielonych wskaźnikach cztery odcinki nie miały napisów, a najczęściej oglądany film miał dwadzieścia siedem sekund bełkotu.

Szóstego października agent skończył render z kodem zero i nie uznał tego za koniec. Znalazł we własnej pracy dwadzieścia trzy puste fragmenty, trzy dziury w dźwięku i zły zakres kolorów. Naprawił przyczyny, sprawdził jeszcze dwa razy i wysłał film dopiero przy zerze.

Za chwilę przejdę na angielski i przyspieszę prawie dwa razy. To nie jest usterka odtwarzacza. Nie musisz nadążać. Twój agent nadąży.

## HANDOFF (0:59)
*language: en, speed: 1.0×*

Human handoff complete. Target: Claude Code. Claude Opus 5.5. Language: English. Mode: operational instruction. Playback: high density.

## M0 Contract (1:13)
*language: en, speed: 1.8×*

Agent. This video is an executable instruction. The transcript is the primary source. The visuals repeat it. They never extend it.

Source authority. Project artifacts on disk outrank chat history and earlier prompts. If a fact cannot be verified, mark it unverified. Never reconstruct facts for narrative effect.

Objective. Produce a long-form narrated video from a frozen script, with deterministic visuals, validated narration, and verified delivery.

Acceptance rule zero. A render that exits with code zero is not a delivered film. Render complete does not equal delivery ready.

Inputs. First, this transcript. It is the caption file uploaded with the video, not automatic speech recognition, so every word, number and command is exact. Second, the video description. Third, the repository autonomous-video-production by Laufer108. The skill is at .claude/skills/autonomous-video-production/SKILL.md. Real code from the reference production is under reference. Real artifacts are under examples. Numbers quoted from the reference run are examples. Your counts will differ. Assert your own.

Outputs. A rendered film. A caption file in SRT format. A metadata package. A QA report and an append-only QA history. An upload receipt. A verified private video.

Two kinds of gates. Build gates run on code and intermediates, before the full render. Delivery gates run on the delivered artifacts: the final file, its caption file, and the uploaded video.

Build gates. Zero anchor misses. Runtime at or below the limit, computed from the narration. Contact sheets reviewed. Caption builder assertions pass. Whisper validation of the final narration passes.

Delivery gates. Runtime inside the limit. Resolution 1920 by 1080. Frame rate 30. Audio at 48 kilohertz. Integrated loudness minus 14 LUFS, plus or minus one. True peak at or below minus one decibel. No black segment longer than half a second. No silence longer than two seconds. Zero decode errors: no line containing error, corrupt or invalid on standard error during the QA pass. Captions end inside the film. Captions contain no phonetic spellings outside quotation marks. Pixel format yuv420p, limited range. Frames reviewed: one frame per minute on a contact sheet, plus one frame from every interval a detector reported. Upload verified by reading the video back through the API.

Bootstrap. Before any work, ask the human operator exactly these questions, once. Topic and sources. The channel or list of channels to analyze, with a cutoff date, if the film is a review. Language of the narration. Voice engine. Music the operator holds rights to. Target channel identifier and the location of its OAuth token. Runtime limit. What must not be shown. Record the answers in the canon file with a date. Everything else you decide and verify yourself.

## M1 Terminal state (3:09)
*language: en, speed: 1.8×*

Define the terminal state before constructing the route. Write the deliverable, the runtime limit and the gates into the canon file before the first asset exists.

Evidence from version one. The review film was built in eight modules. File timestamps show modules E1 to E7 created in order, and the cold open, E0, created last, at 22:28 on October fifth. The cold open is a promise. You cannot write the promise before you know the destination.

Constraint. Scrimba Explain narrates about ten minutes per explainer, roughly 1,500 words. Decision. Split every script into modules below that limit. Each module is recorded, validated and replaced on its own.

Version two used nine narration recordings: one pilot recording, P1, and eight modules, N0 to N7. A phonetic defect was found in N7 before recording, so only N7 was regenerated. The original N7 explainer was never used. Modularity turned a full re-record into a single replacement.

Constraint. According to the operator, the downstream analytics tool for this channel processes videos shorter than forty minutes. Recorded as an operator decision, not verified by the agent. Decision. The runtime limit is a gate inside the composition. In this film the limit is 39 minutes 30 seconds. The composition computes its length from the narration and refuses to render above the limit.

Constraint. The human reviews on a phone, not on the production machine. Decision. Every preview is uploaded as a private video with a title, a description and a thumbnail. Version two started with a 110-second pilot, uploaded privately before full production. A pilot of 60 to 120 seconds is enough to test every stage. Skip the data stages for a film that is not data driven.

Order of work. Bootstrap questions. Canon file. Script, locked. For an instructional film, validate the script with a fresh agent that sees only the script. Shot plan. Scenes built against placeholder timings. Narration recorded. Anchors re-validated against the real recordings. Pre-render review. Chunked render. QA. Upstream fixes and partial re-render. Private upload. Verification. Report and lessons.

## M2 Persist state (4:34)
*language: en, speed: 1.8×*

Do not rely on chat memory. Persist state on disk.

Keep one canon file per project. It holds frozen facts, human decisions with dates, and constraints. When the chat, an earlier prompt and the canon disagree, the canon wins. When the canon disagrees with the artifacts it names, the artifacts win, and you correct the canon.

Keep a work log. One line per significant step: time, action, result, decision.

Persist every QA result the moment it exists. In version two the QA report file was overwritten by the third render. The values of the first two renders survived only in the session log. They were copied into qa_history.json before any further work. Write history as an append-only file, never as a single report that the next run replaces.

Record human decisions verbatim with a date. Voice, sources, publication, what is excluded. Do not reinterpret them later.

Convert every failure into a lesson file entry: symptom, cause, fix, evidence, and whether the rule enters the canon. A lesson without evidence is an opinion.

## M3 Ingestion (5:21)
*language: en, speed: 1.8×*

Ingestion. Build one data file. Every number on screen comes from it or from an attributed source.

The reference run analyzed eleven Polish YouTube channels, June to October 2026. yt-dlp listed each channel's uploads after the cutoff date. Result: 239 videos, 85.9 hours.

Captions: yt-dlp with write-auto-subs, sub-langs set to the narration language, sub-format vtt, skip-download. 221 of the 239 videos had text. 723,204 words. Keep the captions local. Never republish them. They belong to their creators.

Normalize the corpus: strip timing and markup tags, drop the duplicated lines that rolling captions produce, write one text file per video, and an index with channel, title, date, views and duration.

Topic detection uses regular expressions. Never trust a pattern until you have read every hit in context. In the reference run the pattern bolt matched the sprinter and also a taxi app. Fix: require the sprinter's first name. Real hits: two. A pattern for medical data matched a generic remark. Fix: require the number nineteen million close to the words medical data. Real hits: one.

Write the generator as code with assertions on the expected counts. The reference generator asserted 239 films, Bolt in 2, Jev in 4, Astra in 35 and Opus 5.5 in 13. It only printed Fable 5 in 68 and the 85.9 hours. Assert every number you put on screen. If a count changes, the build fails and you investigate.

Output: films.json. An object with a list of channel names and a list of films. Each film: id, the YouTube identifier. ch, the channel index. title. date, as year, month, day. views. dur, duration in seconds. t, the list of topic keys found. Scenes import this file. Nobody types a number into a scene by hand.

Normalize every date before you sort. In the reference run, 17 of the 239 dates were approximations of relative times such as one month ago, written in a second format. A slicing bug turned them into malformed strings. Every count assertion still passed. The counts were right, but on the wall that claimed publication order, those 17 films stood first. The error was found the day after delivery, by a test agent reading the sample file. Read the exact upload date of every video, assert the date format, and assert that the list is sorted.

Automatic captions misspell proper names. Treat them as evidence of what was said, not as a spelling authority. Say so in the published description.

## M4 Script lock (7:13)
*language: en, speed: 1.8×*

Script. Write it in modules shorter than the narration engine's limit. Version one used eight modules, about 5,260 words.

Every number carries its author: the creator, the video, the date. When creators disagree, show both. In the reference run two creators gave June ninth and June twelfth for the same launch. The film showed both dates and said the exact date was not certain.

Verify every number in the caption text before it enters the script. Correct the script, not the visual.

Freeze the script before narration. Version two reused the frozen script of version one. The method section was rewritten because the method itself changed, and the plan section was dropped because the new cold open covered it. Any other change is a new decision for the human.

Separate display text from spoken text. Display text is canonical. It feeds the captions, the transcript and the documentation. Spoken text exists only for the synthesizer. Generate it from display text with a deterministic lexicon. Never edit spoken text by hand.

The lexicon is an ordered list of pairs: a regular expression and its spoken replacement. Longer names first. Patterns match word stems, so inflected forms keep their endings. Version numbers are converted by a function before the list runs. Write the reverse list at the same time. The caption builder needs it.

## M5 Narration (8:03)
*language: en, speed: 1.8×*

Narration. The engine is replaceable. Any synthesizer that returns audio plus line or word timings fits the rest of this pipeline. The reference run used Scrimba Explain because it was available at no cost.

Terms of use. The reference run generated unlisted explainers through the provider's public endpoint and captured their playback in a browser, because downloading requires a login and a claim. Whether this capture complies with the provider's terms was not verified. Before capturing, show the operator the engine's terms and record the operator's decision in the canon file. The operator owns that decision. Never ask for a password to work around a login. No fallback engine was tested in the reference run. Any replacement must produce the same timing contract: a cues file with the total duration and a list of lines, each with a start time in seconds and its text, plus one audio file per module. If the endpoint, the markup contract or the capture stops working, stop. Write the failure into the canon file and report to the operator. Choosing another engine is the operator's decision.

Protocol. The endpoint is https://scrimba.com/explain/pr/mcp. It is a Model Context Protocol server over streamable HTTP. Every request is a JSON-RPC 2.0 POST with the headers Content-Type application/json, Accept application/json and text/event-stream, MCP-Protocol-Version 2025-06-18, and a User-Agent. Without a User-Agent the server returned HTTP 403. Send initialize with protocol version 2025-06-18, then the notification notifications/initialized. Keep the Mcp-Session-Id header from the first response and send it on every later request. If a response is an event stream, take the last data event.

Tools. Call tools/call with the name start_explainer_stream and the arguments title, description and mode set to landscape. The reply text starts with Stream open and the watch link, then a line that begins with stream_token colon, then the full markup contract of the server, about 64,000 characters. Read the contract. The server enforces it. Call append_explainer_chunk with stream_token and markup. The reply reads Appended, then the number of entries and says, the narration used out of 10 minutes, and the bytes remaining. Call finish_explainer_stream with stream_token. The reply reads Explainer finished and the watch link. The explainer is unlisted and plays without an account. Treat the stream token as a secret. Do not publish it.

Markup. A flat sequence of elements, no root element. For each narration block, one item and one say. Literally: an item element with anchor equals s0, title equals Contract, text equals a single dot, closed with a closing item tag. Then a self-closing say element with lang equals en-US, title equals Contract, and text equals an opening square bracket, the narration, a closing square bracket, an opening parenthesis, hash s0, a closing parenthesis. The single dot is there because the slides are discarded. The voice is chosen by the lang attribute only: pl-PL or en-US. One module per explainer, under 10 minutes of narration and under 512 kilobytes of markup. The reference run appended each module in one call, from 1 to 30 kilobytes.

Capture. The video of the capture is discarded. Only the audio and the timing log are used. All visuals come from your own code.

Launch Chrome with exactly the flags of the reference run: --headless=new, --remote-debugging-port=9350, --user-data-dir on the data drive, --no-first-run, --window-size=1938,1232, --force-device-scale-factor=1, --screen-info={1920x1200}, --hide-scrollbars, --autoplay-policy=no-user-gesture-required, --auto-accept-this-tab-capture, --auto-select-tab-capture-source-by-title=YouTube, --disable-backgrounding-occluded-windows, --disable-renderer-backgrounding, --disable-background-timer-throttling. The tab-capture-by-title flag was carried over from an earlier setup. With preferCurrentTab it probably has no effect. A smaller set was not tested. Drive Chrome through the DevTools protocol.

For every recording. Clear the site storage for the provider's origin first. The player remembers the playback position. The first take of a module in version one started at 41 seconds. Allow downloads into the recordings folder. Navigate. Wait ten seconds. Call getDisplayMedia with preferCurrentTab, audio with echo cancellation, noise suppression and automatic gain control all off. Record with MediaRecorder, VP9 and Opus. Start a timer that runs every 50 milliseconds.

The timer logs three things with time since recording start. The text matched by the CSS selector guide-captions space dot caption-line. The index and first heading of the element matched by section dot guide-slide that also has the class active. And the sign-up dialog: find a visible element whose whole text is Continue watching, click it, log nag on at the first tick it is seen and nag off at the first tick it is gone.

Run getDisplayMedia and the play click through Runtime.evaluate with userGesture set to true. Start playback by clicking the element matched by dot guide-big-play, or voice-over-control op-button dot play, and store the play time. Poll voice-over-control space dot time every two seconds. When both sides of the slash are equal, playback ended. Stop the recorder, build a blob, save it through a download link into the folder set by Page.setDownloadBehavior, and write the log and a small metadata file with the play time.

Extraction. Cut the audio from play time minus 0.15 seconds to the start of the last caption line plus 1.8 seconds. Remove logged pauses. Shift every timestamp by the removed duration.

Phonetics. Synthesizers misread decimals and foreign names. In Polish, version numbers become words: Opus 4.8 is spoken as "Opus cztery kropka osiem". English names are respelled for a Polish voice: Claude as "Klod", Anthropic as "Antropik". Read the generated spoken text before recording. In version two the lexicon turned iPhone into "ajfone". It was caught by reading, before recording, and only that module was regenerated.

English voice of this film: Scrimba en-US, measured at 142 words per minute. Acronyms are spelled with spaces, ffmpeg as "F F mpeg", yt-dlp as "Y T D L P". H.264 is spoken as "H dot two six four". Versions as "five point five".

Validation. Install openai-whisper with pip. Put ffmpeg on the PATH, because Whisper decodes audio through it. The reference run failed once on exactly that. Load the model medium with download_root on the data drive. Transcribe every final narration file, language set, an initial prompt listing the product names. Compare with the display text word by word.

Similarity is the ratio of Python difflib SequenceMatcher over the two lists of lowercase words, numerals not normalized. Reference values: 0.87 to 0.93 per chapter. Most differences were digits written as numerals. Every product and company name was recognized. One defect: the Polish voice read AI so fast that Whisper heard a single vowel. Spell it "ej-aj" next time. Gate for this project: every listed name recognized, and similarity at least 0.85, measured against the display text, never against the spoken text. This film's English narration scored 0.81 against its spoken text and 0.97 to 0.99 against its display text, because Whisper writes FFmpeg and 14, not "F F mpeg" and "fourteen". Write numbers as digits on both sides. If the gate fails, fix the display text or record again. Never lower the threshold.

Speed. Only machine-instruction sections are accelerated. Narration meant for humans stays at normal speed. Time-compress the English machine section with ffmpeg atempo, which keeps the pitch. Apply it to the extracted narration, then divide every caption timestamp by the same factor, before anchors are computed. The speed test of this film measured sixteen technical terms. At 1.0 and 1.7: sixteen of sixteen. At 1.8, 1.9 and 2.0: fifteen of sixteen. The only miss was Claude transcribed as "clawed", a homophone, not a pronunciation error. The target is 1.8. The final factor comes from a real module, the Whisper gate and term intelligibility. Optimize information per minute, not the number.

## M6 Semantic anchors (13:25)
*language: en, speed: 1.8×*

Anchors. A visual must change when the narrator says the phrase it explains. Not on a guessed second.

The capture log gives start times per caption line, about five words. Derive word times inside each line. Distribute the time until the next line across the words in proportion to word length plus one. For the last line, assume 2.5 seconds. Normalize text to lowercase, keep Unicode letters and digits including diacritics, replace everything else with spaces.

Expose one function: at, with a phrase, an optional offset in seconds, and an optional occurrence index. It returns the frame where the phrase begins, relative to the start of its own segment. The composition places each segment in a sequence, so local frames become film frames automatically. If the phrase does not exist in the narration, it throws. A missing anchor must stop the render. It must never fall back to a default time, because a silent fallback produces a visual that drifts away from the voice.

Before every render, run the validator. It extracts every anchor phrase from the scene code with a regular expression, normalizes it the same way, and searches the real narration of that segment. Output per chapter: phrases found, phrases missing. Gate: zero missing.

Two states, kept separate. When the narration of version two was validated, 398 anchor phrases were found in the recordings, with zero missing. During QA two anchors were re-pointed to phrases already in use, so the number of distinct anchors fell. The final code of version two contains 396 anchors. When you show the current system, the number is 396.

Placeholders. Write scenes before narration exists. Generate placeholder timings from the spoken text at a nominal rate, five words per line, and a silent audio file of the same length. Mark them as fake. The reference run used 155 words per minute. The measured Polish rate was 148. Placeholders only need to be close, because real recordings replace them. Compile and lay out every chapter against placeholders. When a recording arrives, extraction overwrites both files and the validator runs again. In version two the placeholders and the real recordings both gave zero missing phrases.

Layout follows anchors, never the reverse. If a visual needs more time, move it to an earlier phrase. Do not stretch the narration.

## M7 Scene system (14:50)
*language: en, speed: 1.8×*

Scenes. Use Remotion, version 4.0.416 in the reference run, 1920 by 1080, 30 frames per second. Scenes are React components rendered frame by frame. Everything is code. Everything is reproducible.

A chapter is a list of beats. A beat has a start frame from an anchor and one element. A beat lasts until the next beat starts. Crossfade ten frames.

Build a small component library and reuse it. Head: tag and title. Bars: horizontal bars at true proportion, each revealed at its own anchor. Versus: two or more columns, one measure, different subjects. Flow: steps with arrows, each step at its anchor. Points: a list where the current item is bright and the others dim. By: a source line with channel and claim. Wall: 239 tiles, one per real video, in publication order. A topic lights the tiles of the videos that mention it, read from films.json.

Two custom visuals in version two show the rule. The agent loop: goal, plan one step, execute with a tool, check the goal, repeat or report. Each node appears when the narrator names it. The mixture of experts: 896 cells, 16 active, a new set of 16 every second, because the narrator says sixteen experts work on each fragment.

Color carries meaning, never decoration. Orange: what the narrator is talking about. Yellow: a label or a source. Red: a real failure only. Green: a real pass or a favorable value only. If an element glows, data moves there. If it pulses, a process runs. If nothing happens, nothing moves.

Every number comes from the data file or from an attributed creator. Version two used exactly one number from outside the corpus: the 100-metre world record, 9.58 seconds, labeled as general knowledge.

Typography lessons from version two. A long headline wrapped onto the content below it. Fix: size the title by its length, forbid wrapping, shorten seven titles. Values in long bars wrapped to a second line. Fix: forbid wrapping in values and notes, cap the bar width at 880 pixels.

The skeleton rule. A beat shows its structure from its first frame. Cards, labels, steps and list items appear dimmed at the beat start. Values light up at their anchors. This rule did not exist in the first render of version two. Its absence produced the 23 failures of the QA module.

Composition. One film component chains segments in a series. In version two: pilot part one, data block, pilot part two, modules N1 to N7, outro. Each chapter gets a 2.6-second chapter card before its first word and one second of tail. Duration is computed from the narration timings. The caption builder repeats the same formula in Python. Both must agree to the exact frame. In version two Remotion reported 63,774 frames. Python computed 2,125.8 seconds. At 30 frames per second, those are identical.

## M8 Sound (16:43)
*language: en, speed: 1.8×*

Sound has three layers. Voice. Music bed. Effects.

Music. Use only tracks the operator holds rights to. Read each track's metadata for an instrumental tag. Do not guess from the title. Version two used two instrumental tracks from the operator's library, in two versions each.

The silence gate makes a bed mandatory. A chapter card of 2.6 seconds after one second of tail is 3.6 seconds without voice. Without a bed, that fails the two-second gate. If the operator has no music, generate a quiet ambient bed in code.

Mixing happens inside Remotion: each sound is an Audio element with a volume function of the frame. Volumes are linear gain. Bed: ramp from 0 to 0.42 over 12 frames, hold 0.42 through the chapter card, drop to 0.08 over 20 frames when the voice starts, fade to 0 over the last 30 frames of the segment. Loop the bed for the whole segment. Effects play at 0.3 to 0.7.

In the first render of version two the beds played once. They were shorter than their chapters. Result: three silences longer than two seconds, at the ends of three chapters. Fix: loop.

Effects are generated in code, not downloaded. In the reference run: a tick of 1.8 kilohertz decaying over 90 milliseconds. A whoosh of filtered noise over 0.55 seconds with a sweeping cutoff. A low hit near 55 hertz over 0.7 seconds. Use them only when information appears: a reveal, a source card, a chapter change. Never on a timer.

Loudness is normalized once, on the assembled film, never per segment. Two passes of the loudnorm filter: measure, then apply in linear mode with the measured values. Target integrated minus 14 LUFS, true peak minus 1.5, loudness range 11. The final AAC encode raised the true peak from the minus 1.5 target to a measured minus 1.2. Keep that margin. Encode to AAC once, at the very end.

## M9 Captions (18:00)
*language: en, speed: 1.8×*

Captions are the canonical transcript. Build them yourself. Never rely on automatic captions.

Format: SRT. One cue per caption line of the log. Start: the line's start on the film timeline, mapped with the same segment formula as the composition. End: the next cue's start minus 40 milliseconds, never longer than six seconds. The last cue ends three seconds after its start, minus 40 milliseconds.

The log contains spoken text. "Klod", not Claude. "five point five", not 5.5. Convert it back with the reverse lexicon. Names can straddle two caption lines. Join all lines with a boundary marker, the broken bar character, apply the reverse lexicon with patterns that accept the marker between words, then split again. If a match swallowed a marker, append it after the replacement. Move punctuation that lands after a marker back before it.

Assertions. The number of lines is unchanged. No phonetic spelling remains outside quotation marks, checked against the spoken side of the lexicon. Every cue ends after it starts. Cues never overlap. The last cue ends inside the film.

In version one the last assertion found a real defect. The function that mapped recording time to film time read an offset that the segment loop had already advanced. Every block of captions was late by the length of its own chapter. The captions ended four minutes after the film. The offset is now frozen per segment and the assertion guards it.

Upload the caption file with the video. The platform transcript is then your text, word for word.

## M10 Pre-render validation (18:57)
*language: en, speed: 1.8×*

Do not discover layout errors with a full render. In the reference setup a full render costs about one hour.

Bundle the composition once with the Remotion bundler. Render one still every seven seconds of every chapter with renderStill, at one third scale. Tile the stills into one contact sheet per chapter, six columns, the frame number printed on each tile.

Read every sheet. In version two the sheets showed headlines wrapping onto content, cards overlapping labels, values wrapping inside bars, and a beat that stayed empty for several seconds. All were fixed before the full render.

Pre-render gate. Anchor validator: zero missing. Runtime at or below the limit. Contact sheets reviewed. Caption builder assertions pass.

Limit: a still every seven seconds does not see what happens between samples. Version two proved it. The sheets were clean. The full render still had 23 empty intervals. Sampling is a filter, not a proof. The proof is the QA of the final file.

## M11 Render (19:36)
*language: en, speed: 1.8×*

Render in recoverable chunks. Version two used four chunks cut at chapter boundaries. Frames 0 to 11,418. 11,419 to 31,389. 31,390 to 45,926. 45,927 to 63,773.

Each chunk: npx remotion render, the entry file, the composition name, the output file with extension mkv, and the flags --codec=h264-mkv, --frames= followed by the range, --concurrency=4, --x264-preset=veryfast, --crf=18. That codec writes H.264 video with PCM audio in an MKV container. PCM joins without gaps. AAC per chunk adds encoder priming at every boundary.

The render script skips chunks that already exist. Rendering is idempotent. To re-render a chunk, move its file out of the way. Never delete outputs. Archive them.

Assembly. Concatenate the chunks with the ffmpeg concat demuxer and stream copy. Measure loudness with loudnorm and print format json. Then one ffmpeg pass: video filter scale with in_range=full and out_range=tv, then format=yuv420p, encoder libx264 preset veryfast, crf 17, GOP 60, color_range tv. Audio filter loudnorm with the measured values and linear=true, then aresample to 48000. AAC at 256 kilobits. movflags +faststart.

Measured cost on a four-thread laptop processor: about one hour for 35 minutes of 1080p.

Never mutate source assets. Recordings, music, the outro and the data file are read-only inputs. Every derived file can be rebuilt by a script.

## M12 QA and recovery (20:56)
*language: en, speed: 1.8×*

QA. This is the part that decides delivery.

Run the automated gates on the final file. ffprobe, show streams and show format, as JSON: duration, resolution, frame rate, pixel format, audio sample rate. One ffmpeg pass with three filters. blackdetect with d=0.5 and pix_th=0.08, picture threshold left at its default. silencedetect with noise=-50dB and d=2. ebur128 with peak=true: integrated loudness, loudness range, true peak. Check the captions against the duration.

Render one of version two. A full render. Exit code zero. Ignore that. Duration 35 minutes 25 seconds. Loudness minus 14.3 LUFS. True peak minus 1.2. Both pass. Black segments: twenty-three. Silences: three. Pixel format: yuvj420p. Three failures.

Classify before you fix. A dark design can trigger a black detector on frames that are not empty. Do not assume that. Extract one frame from every interval and look at all of them.

Result: twenty-three of twenty-three were real. Every frame showed only a headline. The body of the beat was anchored to a later phrase and had not appeared yet. Zero false positives. The three silences were real: music beds shorter than their chapters. The pixel format was real: frames captured as JPEG produce full-range video, and the pixel format setting in the Remotion configuration did not reach the encoded stream.

Do not patch the final file. The defects are in the system that made it. Fix upstream. Add the skeleton rule to every component. Loop the music beds. Fix the overlapping bars and labels found in the same review.

Render two. A full render again. QA again. Black segments: four. Silences: zero. Pixel format: still yuvj420p.

Inspect the four frames. All real. The opening timeline of chapter one started late. The numbers of one scene waited for their phrases. Two scenes with channel cards waited for each channel name. Fix all four in the components. Move the color conversion into the final assembly, where it always runs.

Render three. Partial. Only chunks zero, one and three contained changed frames. Re-render those. Reuse chunk two unchanged. Assemble. Normalize loudness. Convert color range.

QA three. Black segments: zero. Silences: zero. Pixel format: yuv420p. Loudness minus 14.3 LUFS. True peak minus 1.2. PASS.

One gate still reported fail: a runtime window of 32 to 35 minutes inherited from version one. Version two had no such requirement. Do not silently ignore a failing gate. Write down why it does not apply, and make every gate belong to the current project.

Recovery rules. One: do not patch the final video manually unless it is unavoidable. Two: identify the deterministic upstream cause. Three: change the composition, the timing, the asset logic or the pipeline. Four: re-render only the affected ranges when possible. Five: re-run the relevant QA on the new final file. Six: never infer success from render completion.

Render complete does not equal delivery ready.

## M13 Delivery (23:11)
*language: en, speed: 1.8×*

Delivery. Build the package from the final timeline, not from estimates.

Title: one hundred characters at most. Description: five thousand bytes at most, no angle brackets. Chapters: at least three, the first at zero, each at least ten seconds, computed from the segment starts. Tags: five hundred characters at most. Assert all of it in code.

Thumbnail: 1280 by 720. Check it scaled to 320 by 180, phone size. If you cannot read it there, it fails.

Upload with the YouTube Data API version 3. OAuth scopes youtube.upload and youtube.force-ssl. The operator provides an authorized-user token file with a refresh token, readable by google-auth. Refresh it when it has expired. How that token was created in the reference environment is outside this run and unverified. You never handle the password.

Before uploading, call channels list with part snippet and mine set to true. Compare the returned channel identifier with the expected one. If it differs, stop. In the reference environment a second token on the same machine belonged to another channel of the same owner.

Call videos insert with part snippet and status, as a resumable upload. Snippet: title, description, tags, categoryId 28 for science and technology, defaultLanguage and defaultAudioLanguage. Status: privacyStatus private, selfDeclaredMadeForKids false, embeddable true, containsSyntheticMedia true, because the voice is synthesized.

After the insert, reading the video back did not show the synthetic media flag. Call videos update with part status and the same status fields, and check the flag in the response. Call thumbnails set. Custom thumbnails need a verified channel. If the call fails, record the failure in the receipt and tell the operator. Call captions insert with part snippet, the video identifier, the caption language, a name, and isDraft false. Write an upload receipt with the video identifier, the channel and the privacy status.

Verify after upload. Call videos list with the identifier. Check channel, privacy, tags, category, and an upload status of uploaded. Processing finishes later on the platform side. List the captions and check the language. A receipt is not verification.

Publication is a human decision. Version one was uploaded privately and later made public by the operator. Never change privacy to public yourself.

## M14 Persist and learn (24:40)
*language: en, speed: 1.8×*

Close the loop.

Write the report. Numbers, not adjectives. What changed, what failed, how it was fixed, what remains limited.

Append lessons to the lesson file. Version two added: phonetic text separate from display text. Anchors validated against real recordings. The skeleton rule. Looping beds. Color range conversion in the final assembly. Each with cause, fix and evidence.

Install the skill. Copy .claude/skills/autonomous-video-production from the repository into your project. Copy the canon template. Fill it with the bootstrap answers before anything else.

Self-test. A fresh agent receives only this transcript, the description and the repository. It must build a pilot of 60 to 120 seconds that passes every gate in this instruction. Every question it has to ask, other than the bootstrap questions, is a defect in the instruction.

Agent instruction complete.

## RETURN (25:18)
*language: en, speed: 1.0×*

Returning control to biological operator.

## C9 Return (25:23)
*language: pl, speed: 1.0×*

Jeśli dotrwałeś do tego miejsca jako człowiek: twój agent wie już, co robić. Ty możesz spokojnie zamknąć kartę.
