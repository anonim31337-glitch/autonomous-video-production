# Sources, rights and exclusions

## Films (Laufer108, YouTube)
| Film | URL | Role |
|---|---|---|
| Review of 239 Polish AI videos, version 1 (Scrimba slides) | https://youtu.be/ZeXEvzVho5c | First production; its frozen script was reused by version 2 |
| Version 2, "Ten rerendering zrobił Opus 5.5" | https://youtu.be/MJ1yofszJZs | Reference implementation (35:25) |
| Version 2 trailer / pilot | https://youtu.be/B_utZbJFCOA | 110-second pilot reviewed before full production |
| "Jak stworzyć kanał AI? Nasz proces, błędy i lekcje" (2026-07-15) | https://youtu.be/lnKKQ4DF-Uo | Channel history: 15 failures in one production |
| "Czy AI kłamie? Spór o nasz kanał" (2026-07-26) | https://youtu.be/Z_uMw1ZlcCo | Channel history: automation stalled at green indicators |

## Data
- `examples/films.sample.json`: 10 rows of the reference data file. Fields are public YouTube metadata (identifier, channel, title, date, view count at download time, duration) and topic flags computed by the reference run. The full corpus of third-party captions was analyzed locally and is **not** included: captions belong to their creators.
- Numbers in the transcript about third-party videos are attributed to their creators and were checked against automatic captions, which misspell proper names.

## Not included, deliberately
- Music beds (the operator's own library; rights not transferable).
- The channel outro video and the narration audio of the films.
- Any OAuth token, API key, cookie, stream token, password or personal path. Private paths in `reference/` are replaced with placeholders (`reference/SANITIZED.md`).
- Captions or footage of third-party videos.

## Engines and services
- Scrimba Explain (narration): MCP endpoint `https://scrimba.com/explain/pr/mcp`. Playback was captured in a browser; compliance with the provider's terms is **unverified** and is the operator's decision.
- YouTube Data API v3 (upload, captions, thumbnails, read-back).
- OpenAI Whisper (local transcription for validation), Remotion, FFmpeg, yt-dlp, Chrome DevTools Protocol.
- Remotion has its own license: free for individuals and small teams, a company license is required above that size
  (https://www.remotion.dev/license). Check it before using the reference for a company.

## License
Code: MIT. Documentation, transcript and examples: CC BY 4.0. Attribution: Laufer108.
