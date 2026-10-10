# Sanitized copy of the V2 reference code

Copied from the real production (2026-10-06). Private paths, the operator name and unlisted explainer ids were replaced
with placeholders in angle brackets; bug fixes are listed per file. Nothing else was changed.
**This is an excerpt and does not build**: chapters, data files, recordings, music and the outro are not published.
Use it to read how each step was done. `film2/` is the complete code of the AI-native film (it built and rendered,
runtime limit asserted in Film.tsx and timeline.py); its narration, cues, generated shots and outro are not published.

- `remotion/src/kit.tsx` ← `V2/remotion/src/kit.tsx`: unchanged
- `remotion/src/cues.ts` ← `V2/remotion/src/cues.ts`: unchanged
- `remotion/src/Film.tsx` ← `V2/remotion/src/Film.tsx`: <OPERATOR> ×1
- `remotion/src/Wall.tsx` ← `V2/remotion/src/Wall.tsx`: unchanged
- `remotion/src/Timeline.tsx` ← `V2/remotion/src/Timeline.tsx`: unchanged
- `remotion/src/brand.ts` ← `V2/remotion/src/brand.ts`: unchanged
- `remotion/src/components.tsx` ← `V2/remotion/src/components.tsx`: unchanged
- `remotion/src/chapters/Ch2.tsx` ← `V2/remotion/src/chapters/Ch2.tsx`: <EXPLAINER_ID> ×1
- `remotion/src/Root.tsx` ← `V2/remotion/src/Root.tsx`: unchanged
- `remotion/src/index.ts` ← `V2/remotion/src/index.ts`: unchanged
- `remotion/remotion.config.ts` ← `V2/remotion/remotion.config.ts`: unchanged
- `remotion/package.json` ← `V2/remotion/package.json`: unchanged
- `remotion/stills.mjs` ← `V2/remotion/stills.mjs`: unchanged
- `tools/make_data.py` ← `V2/tools/make_data.py`: <PROJECT_ROOT> ×1, date fix: the corpus index mixes 20260706 and 2026-07-06; the original slicing turned the second form into 2026--0-7-06 and sorted 17 of 239 films out of publication order on the V2 wall
- `tools/spoken.py` ← `V2/tools/spoken.py`: <PROJECT_ROOT> ×1, <OPERATOR> ×1
- `tools/fake_cues.py` ← `V2/tools/fake_cues.py`: <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1
- `tools/extract_narration.py` ← `V2/tools/extract_narration.py`: <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1
- `tools/check_phrases.py` ← `V2/tools/check_phrases.py`: <PROJECT_ROOT> ×1
- `tools/asr_check_all.py` ← `V2/tools/asr_check_all.py`: <PROJECT_ROOT> ×1, <WHISPER_MODELS> ×1
- `tools/make_srt.py` ← `V2/tools/make_srt.py`: <PROJECT_ROOT> ×1
- `tools/render_film.sh` ← `V2/tools/render_film.sh`: <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1, <NODE_DIR> ×1, <TEMP_DIR> ×2
- `tools/sheets.py` ← `V2/tools/sheets.py`: unchanged
- `tools/package_v2.py` ← `V2/tools/package_v2.py`: <PROJECT_ROOT> ×1, <OPERATOR> ×1
- `tools/thumbnail_v2.py` ← `V2/tools/thumbnail_v2.py`: <PROJECT_ROOT> ×1
- `tools/qa.py` ← `00_PROJECT/tools/qa.py`: <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1
- `tools/scrimba_mcp.py` ← `00_PROJECT/tools/scrimba_mcp.py`: unchanged
- `tools/scrimba_start.py` ← `00_PROJECT/tools/scrimba_start.py`: <PROJECT_ROOT> ×1
- `tools/scrimba_push.py` ← `00_PROJECT/tools/scrimba_push.py`: <PROJECT_ROOT> ×1
- `tools/record.js` ← `00_PROJECT/tools/record.js`: <PROJECT_ROOT> ×1
- `tools/record_explainer.ps1` ← `00_PROJECT/tools/record_explainer.ps1`: <PROJECT_ROOT> ×2, <FFMPEG_BIN> ×1
- `tools/start_recorder.ps1` ← `00_PROJECT/tools/start_recorder.ps1`: <CHROME_PROFILE> ×1, <CHROME_EXE> ×1, <CHROME_PROFILE_NAME> ×1
- `tools/upload_private.py` ← `08_YOUTUBE_PACKAGE/upload_private_laufer108.py`: <PROJECT_ROOT> ×1, <OAUTH_TOKEN_FILE> ×1, <CHANNEL_ID> ×1, <OPERATOR> ×1
- `tools/speed_test.py` ← `AI_NATIVE_FILM/tools/speed_test.py`: <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1, <WHISPER_MODELS> ×1
- `tools/spoken_en.py` ← `AI_NATIVE_FILM/tools/spoken_en.py`: <PROJECT_ROOT> ×1
- `tools/asr_gate_en.py` ← `AI_NATIVE_FILM/tools/asr_gate_en.py`: <PROJECT_ROOT> ×1
- `tools/make_markup.py` ← `AI_NATIVE_FILM/tools/make_markup.py`: <PROJECT_ROOT> ×1, <PROJECT_ROOT> ×1
- `film2/remotion/src/anchors.ts` ← `AI_NATIVE_FILM/tools/anchors.ts`: unchanged
- `film2/remotion/src/kit.tsx` ← `AI_NATIVE_FILM/tools/kit.tsx`: unchanged
- `film2/remotion/src/look.ts` ← `AI_NATIVE_FILM/tools/look.ts`: unchanged
- `film2/remotion/src/Atmos.tsx` ← `AI_NATIVE_FILM/tools/Atmos.tsx`: unchanged
- `film2/remotion/src/mix.ts` ← `AI_NATIVE_FILM/tools/mix.ts`: unchanged
- `film2/remotion/src/Film.tsx` ← `AI_NATIVE_FILM/tools/Film.tsx`: unchanged
- `film2/remotion/src/Root.tsx` ← `AI_NATIVE_FILM/tools/Root.tsx`: unchanged
- `film2/remotion/src/Hall.tsx` ← `AI_NATIVE_FILM/tools/Hall.tsx`: unchanged
- `film2/remotion/src/SceneC0.tsx` ← `AI_NATIVE_FILM/tools/SceneC0.tsx`: unchanged
- `film2/remotion/src/SceneHandoff.tsx` ← `AI_NATIVE_FILM/tools/SceneHandoff.tsx`: unchanged
- `film2/remotion/src/SceneM0.tsx` ← `AI_NATIVE_FILM/tools/SceneM0.tsx`: unchanged
- `film2/remotion/src/scenes/index.tsx` ← `AI_NATIVE_FILM/tools/index.tsx`: unchanged
- `film2/remotion/src/scenes/M5.tsx` ← `AI_NATIVE_FILM/tools/M5.tsx`: unchanged
- `film2/remotion/src/scenes/M6.tsx` ← `AI_NATIVE_FILM/tools/M6.tsx`: unchanged
- `film2/remotion/src/scenes/M12.tsx` ← `AI_NATIVE_FILM/tools/M12.tsx`: unchanged
- `film2/remotion/package.json` ← `AI_NATIVE_FILM/tools/package.json`: unchanged
- `film2/remotion/remotion.config.ts` ← `AI_NATIVE_FILM/tools/remotion.config.ts`: unchanged
- `film2/remotion/sheets.mjs` ← `AI_NATIVE_FILM/tools/sheets.mjs`: unchanged
- `film2/tools/timeline.py` ← `AI_NATIVE_FILM/tools/timeline.py`: <OUTRO_FILE> ×1, <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1
- `film2/tools/extract_an.py` ← `AI_NATIVE_FILM/tools/extract_an.py`: <PROJECT_ROOT> ×1, <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1
- `film2/tools/make_srt_an.py` ← `AI_NATIVE_FILM/tools/make_srt_an.py`: <PROJECT_ROOT> ×1
- `film2/tools/qa_film.py` ← `AI_NATIVE_FILM/tools/qa_film.py`: <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1
- `film2/tools/upload_an.py` ← `AI_NATIVE_FILM/tools/upload_an.py`: <OAUTH_TOKEN_FILE> ×1, <CHANNEL_ID> ×1
- `film2/tools/make_sound.py` ← `AI_NATIVE_FILM/tools/make_sound.py`: <PROJECT_ROOT> ×1
- `film2/tools/make_package.py` ← `AI_NATIVE_FILM/tools/make_package.py`: <PROJECT_ROOT> ×1
- `film2/tools/render_film.sh` ← `AI_NATIVE_FILM/tools/render_film.sh`: <PROJECT_ROOT> ×1, <FFMPEG_BIN> ×1, <NODE_DIR> ×1
- `film2/tools/anchors.py` ← `AI_NATIVE_FILM/tools/anchors.py`: <PROJECT_ROOT> ×1
- `film2/tools/tile_sheets.py` ← `AI_NATIVE_FILM/tools/tile_sheets.py`: <PROJECT_ROOT> ×2
- `film2/tools/record_some.ps1` ← `AI_NATIVE_FILM/tools/record_some.ps1`: <PROJECT_ROOT> ×2, <PROJECT_ROOT> ×2
