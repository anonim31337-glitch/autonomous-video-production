# autonomous-video-production

**AI agent entry point.** A Claude Code skill and reference implementation for producing a long-form narrated video end to end, by an agent, with verification at every stage. By **Laufer108**.

- Skill: [`.claude/skills/autonomous-video-production/SKILL.md`](.claude/skills/autonomous-video-production/SKILL.md) — works as soon as the repository is cloned into a project.
- Transcript of the companion film (the full instruction, word for word): [`TRANSCRIPT.md`](TRANSCRIPT.md)
- Machine-readable metadata, tested toolchain, gates: [`manifest.json`](manifest.json)
- Chapters: [`docs/`](docs) · real code that ran: [`reference/`](reference) · real artifacts: [`examples/`](examples) · canon template: [`templates/canon.md`](templates/canon.md)
- Sources, rights and what is deliberately not included: [`SOURCES.md`](SOURCES.md)

## What this is

Laufer108 is a Polish YouTube channel run as an experiment: can AI run a YouTube channel? In July 2026 the automation stalled, with green indicators while episodes lacked captions. In October 2026 an agent (Claude Code, Claude Opus 5.5) produced a 35-minute review film, rejected its own first render despite exit code 0, found 23 empty intervals, 3 audio gaps and a wrong color range, fixed the causes upstream, re-rendered, and delivered only after every gate passed.

This repository turns that run into a reusable procedure. The companion film is made for agents: a short Polish introduction for humans, then an English instruction at high density. Its transcript is the instruction; the visuals repeat it.

## How an agent should use it

1. Read `SKILL.md`. Read `TRANSCRIPT.md` for the full reasoning and real numbers.
2. Copy `templates/canon.md` into your project and ask the operator the bootstrap questions it lists.
3. Build against the gates in `manifest.json`. Use `reference/` as working examples, not as a package: it expects the recordings, data and assets of its own project, which are not published.
4. Never publish publicly on your own. Previews are private uploads.

## Status

Version 1.0.0 (2026-10). Tested on one machine (Windows 10, 4-thread laptop CPU). Known limitations are listed in `manifest.json`.

## License

Code: MIT. Documentation and transcript: CC BY 4.0. See [`LICENSE`](LICENSE).
