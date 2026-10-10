# Working in this repository

- The procedure is in `.claude/skills/autonomous-video-production/SKILL.md`. The full instruction with real numbers is `TRANSCRIPT.md`.
- `docs/` and `TRANSCRIPT.md` are generated from the film's canonical script. Do not edit them by hand; propose changes to the script.
- `reference/` is the real code of the reference production. Placeholders in angle brackets (`<PROJECT_ROOT>`, `<FFMPEG_BIN>`, …) replace private paths; `reference/SANITIZED.md` lists every replacement. Keep the code otherwise unchanged.
- Never add secrets, tokens, cookies, personal paths, third-party captions or copyrighted media. Check `SOURCES.md` before adding any file.
- When you use this skill for a production: artifacts on disk outrank the chat; persist state; RENDER_COMPLETE != DELIVERY_READY; uploads are private; public release belongs to the human operator.
