# CANON — <project name>

Source of truth for this production. It outranks the chat and earlier prompts. The artifacts it names outrank it:
if they disagree, correct this file. Unverifiable facts are marked `unverified`.

## Terminal state (write before any asset exists)
- Deliverable: <format, e.g. 1920×1080, 30 fps, narrated long-form video + SRT + metadata package>
- Runtime limit: <hard limit, e.g. 39:30> — enforced as an assertion in the composition
- Delivery: private upload to <channel>, verified by read-back. Public release: operator only.

## Bootstrap answers (ask once, record verbatim with a date)
| Question | Answer | Date |
|---|---|---|
| Topic and sources | | |
| Channels + cutoff date (review films) | | |
| Narration language(s) | | |
| Voice engine; operator decision on its terms of use | | |
| Rights-cleared music (paths, instrumental confirmed by) | | |
| Target channel id; OAuth token file location | | |
| Runtime limit | | |
| Must not be shown | | |

## Gates (copy from manifest.json, delete what does not apply and write why)
- Build: anchors 0 missing · runtime < limit · contact sheets reviewed · caption assertions · Whisper gate
- Delivery: see manifest.json `gates.delivery`

## Frozen facts
- <fact> — source: <file path or URL>

## Human decisions
- <date> — <decision, verbatim>

## Known limitations
- <limitation> — status: verified | unverified
