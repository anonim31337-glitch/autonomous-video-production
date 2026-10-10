// Pre-render review (transcript M10): bundle once, one still every 7 s of every segment at 1/3 scale -> out/sheets/<seg>_<frame>.jpg
// Tiling with frame numbers: tools/tile_sheets.py
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';
const tl = JSON.parse(fs.readFileSync('src/data/timeline.json', 'utf8'));
const only = process.argv.slice(2);
fs.mkdirSync('out/sheets', {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Film'});
for (const s of tl.segments) {
  if (only.length && !only.includes(s.id)) continue;
  for (let fr = s.start + 15; fr < s.start + s.len; fr += 210) {
    await renderStill({serveUrl, composition, frame: fr, output: `out/sheets/${s.id}_${fr}.jpg`, imageFormat: 'jpeg', jpegQuality: 80, scale: 1 / 3, chromiumOptions: {gl: 'angle'}});
  }
  console.log('sheet', s.id);
}
