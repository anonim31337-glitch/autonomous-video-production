// Semantic anchors, exactly as the transcript (M6) instructs: word times inside each caption line are distributed in
// proportion to word length plus one; the last line is assumed to last 2.5 s; text is lowercased, Unicode letters and
// digits are kept, everything else becomes a space. A missing phrase throws: a render never falls back to a guess.
// Python twin: tools/anchors.py (validator). Both must give the same frames.
export const FPS = 30;
export type Line = {t: number; text: string; spoken?: string; p?: number};
export type Cues = {duration: number; speed: number; lines: Line[]};

export const tokens = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(' ').filter(Boolean);

export const words = (c: Cues) => {
  const out: {w: string; t: number}[] = [];
  c.lines.forEach((l, i) => {
    const ws = tokens(l.text);
    if (!ws.length) return;
    const end = i + 1 < c.lines.length ? c.lines[i + 1].t : l.t + 2.5;
    const total = ws.reduce((a, w) => a + w.length + 1, 0);
    let acc = 0;
    ws.forEach((w) => {
      out.push({w, t: l.t + ((end - l.t) * acc) / total});
      acc += w.length + 1;
    });
  });
  return out;
};

const cache = new WeakMap<Cues, {w: string; t: number}[]>();

/** frame (relative to the segment start) where `phrase` begins; `off` = seconds, `n` = occurrence index */
export const at = (c: Cues, phrase: string, off = 0, n = 0): number => {
  if (!cache.has(c)) cache.set(c, words(c));
  const ws = cache.get(c)!;
  const p = tokens(phrase);
  let seen = 0;
  for (let i = 0; i + p.length <= ws.length; i++) {
    if (p.every((x, k) => ws[i + k].w === x)) {
      if (seen++ === n) return Math.round((ws[i].t + off) * FPS);
    }
  }
  throw new Error(`anchor not found: "${phrase}" (#${n})`);
};

export const frames = (c: Cues) => Math.round(c.duration * FPS);
