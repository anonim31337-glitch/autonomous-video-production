/**
 * Czasy słów lektora. Log odtwarzacza Scrimby daje czas pojawienia się każdego wersu (kilka słów); w obrębie wersu
 * czas rozkładamy proporcjonalnie do długości słów. Dzięki temu grafikę przypinamy do dowolnej frazy, nie tylko do
 * początku wersu, a po ponownym nagraniu lektora wszystko przesuwa się samo.
 */
export type Cues = {duration: number; lines: {t: number; text: string}[]};

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export function makeAt(c: Cues, offsetSec: number, fps = 30) {
  const words: {w: string; t: number}[] = [];
  c.lines.forEach((l, i) => {
    const end = i + 1 < c.lines.length ? c.lines[i + 1].t : l.t + 2.5;
    const ws = norm(l.text).split(' ').filter(Boolean);
    const total = ws.reduce((s, w) => s + w.length + 1, 0);
    let acc = 0;
    for (const w of ws) {
      words.push({w, t: l.t + ((end - l.t) * acc) / total});
      acc += w.length + 1;
    }
  });
  /** Klatka (w skali rozdziału), w której pada `phrase`; `nth` wybiera kolejne wystąpienie. Brak frazy = błąd renderu. */
  return (phrase: string, offset = 0, nth = 0): number => {
    const q = norm(phrase).split(' ');
    let seen = 0;
    for (let i = 0; i + q.length <= words.length; i++) {
      if (q.every((w, j) => words[i + j].w === w)) {
        if (seen++ === nth) return Math.round((words[i].t + offsetSec + offset) * fps);
      }
    }
    throw new Error(`phrase not in narration: "${phrase}"`);
  };
}

export type At = ReturnType<typeof makeAt>;
