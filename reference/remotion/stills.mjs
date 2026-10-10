// Visual QA without a full render: bundle once, render one still every N seconds of the chosen compositions.
// usage: node stills.mjs <outDir> <everySec> <scale> Ch1 Ch2 ...
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, every = '6', scale = '0.4', ...ids] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = await getCompositions(serveUrl);
for (const id of ids) {
  const comp = comps.find((c) => c.id === id);
  if (!comp) throw new Error(`no composition ${id}`);
  for (let fr = 15; fr < comp.durationInFrames; fr += Math.round(Number(every) * comp.fps)) {
    await renderStill({composition: comp, serveUrl, frame: fr, scale: Number(scale), imageFormat: 'jpeg', jpegQuality: 80,
      output: path.join(outDir, `${id}_${String(fr).padStart(6, '0')}.jpg`)});
  }
  console.log(id, 'done');
}
