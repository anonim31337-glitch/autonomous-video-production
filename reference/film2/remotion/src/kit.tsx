import React from 'react';
import {AbsoluteFill, Easing, interpolate, Loop, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C, MONO, SANS} from './look';
import {Grain, Haze} from './Atmos';

// The scene system described in the transcript (M7): a chapter is a list of beats; a beat starts at an anchor and lasts
// until the next one; crossfade 10 frames. Skeleton rule: structure is visible (dim) from the beat start, values light at
// their own anchors. Colour: cyan = data path / the subject, amber = the human, red = a real failure, green = a real pass.
export const ramp = (f: number, a: number, len = 12) =>
  interpolate(f, [a, a + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0, 0, 1)});
export const DIM = 0.28;
export const lit = (f: number, a: number) => DIM + (1 - DIM) * ramp(f, a);

export const Beats: React.FC<{beats: [number, React.ReactNode][]; end: number}> = ({beats, end}) => {
  const f = useCurrentFrame();
  const sorted = [...beats].sort((a, b) => a[0] - b[0]);
  return (
    <AbsoluteFill>
      {sorted.map(([from, el], i) => {
        const to = i + 1 < sorted.length ? sorted[i + 1][0] : 1e9; // the last beat holds through the chapter tail (no black tail)
        if (f < from - 10 || f > to + 10) return null;
        const op = Math.min(ramp(f, from - 10, 10), 1 - ramp(f, to, 10));
        return <AbsoluteFill key={i} style={{opacity: op}}>{el}</AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{children: React.ReactNode; y?: string; tint?: string}> = ({children, y, tint}) => (
  <AbsoluteFill style={{background: C.bg, fontFamily: SANS, color: C.ink}}>
    <Haze y={y} tint={tint} />
    {children}
    <Grain />
  </AbsoluteFill>
);

/** Head: tag + title. Size from length, never wraps. */
export const Head: React.FC<{tag: string; title: string; y?: number}> = ({tag, title, y = 110}) => (
  <div style={{position: 'absolute', left: 140, right: 140, top: y}}>
    <div style={{fontFamily: MONO, fontSize: 26, color: C.data, letterSpacing: 4, marginBottom: 14}}>{tag}</div>
    <div style={{fontSize: Math.min(72, 2600 / Math.max(10, title.length)), fontWeight: 300, whiteSpace: 'nowrap', letterSpacing: 1}}>{title}</div>
  </div>
);

/** Flow: steps joined by a lit path; each step lights at its anchor, the path segment before it fills as it does. */
export const Flow: React.FC<{steps: [string, number, string?][]; y?: number; vertical?: boolean}> = ({steps, y = 470, vertical}) => {
  const f = useCurrentFrame();
  const n = steps.length;
  if (vertical) {
    return (
      <div style={{position: 'absolute', left: 180, top: y}}>
        {steps.map(([label, a, note], i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, height: 64, opacity: lit(f, a)}}>
            <div style={{width: 18, height: 18, borderRadius: 9, background: ramp(f, a) > 0.5 ? C.data : 'transparent', border: `2px solid ${C.data}`,
              boxShadow: ramp(f, a) > 0.5 ? `0 0 24px ${C.data}` : undefined}} />
            <div style={{fontFamily: MONO, fontSize: 34, whiteSpace: 'nowrap'}}>{label}</div>
            {note && <div style={{fontSize: 26, color: C.muted, whiteSpace: 'nowrap'}}>{note}</div>}
          </div>
        ))}
      </div>
    );
  }
  const w = 1640 / n;
  return (
    <div style={{position: 'absolute', left: 140, top: y, width: 1640, height: 220}}>
      {steps.map(([label, a, note], i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{position: 'absolute', left: (i - 1) * w + w - 40, top: 52, height: 3, width: 80 * ramp(f, a, 16),
            background: C.data, boxShadow: `0 0 14px ${C.data}`}} />}
          <div style={{position: 'absolute', left: i * w + 20, width: w - 60, top: 0, opacity: lit(f, a)}}>
            <div style={{height: 108, border: `1px solid ${C.data}${ramp(f, a) > 0.5 ? 'cc' : '44'}`, background: '#08131dcc', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: '0 14px', fontFamily: MONO, fontSize: Math.min(30, (w - 90) / Math.max(6, label.length) * 1.7),
              whiteSpace: 'nowrap', boxShadow: ramp(f, a) > 0.5 ? `0 0 40px ${C.data}33` : undefined}}>{label}</div>
            {note && <div style={{marginTop: 18, fontSize: 24, color: C.muted, textAlign: 'center', lineHeight: 1.3}}>{note}</div>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

/** Points: a list; the item being spoken is bright, earlier ones stay readable, later ones dim (skeleton). */
export const Points: React.FC<{items: [string, number, string?][]; y?: number; size?: number; cols?: number}> = ({items, y = 300, size = 38, cols = 1}) => {
  const f = useCurrentFrame();
  const cur = items.reduce((k, it, i) => (f >= it[1] ? i : k), -1);
  const per = Math.ceil(items.length / cols);
  return (
    <div style={{position: 'absolute', left: 160, right: 140, top: y, display: 'flex', gap: 80}}>
      {Array.from({length: cols}, (_, c) => (
        <div key={c} style={{flex: 1}}>
          {items.slice(c * per, (c + 1) * per).map(([t, a, color], j) => {
            const i = c * per + j;
            const on = i === cur;
            return (
              <div key={i} style={{display: 'flex', gap: 22, alignItems: 'baseline', marginBottom: size * 0.5, whiteSpace: 'nowrap',
                opacity: f < a ? DIM : on ? 1 : 0.62}}>
                <span style={{fontFamily: MONO, fontSize: size * 0.6, color: on ? C.data : C.muted, width: size}}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{fontSize: size, color: color ?? (on ? C.ink : C.ink), fontWeight: on ? 400 : 300}}>{t}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Bars: true proportions, value lights at its anchor; width capped at 880 px. */
export const Bars: React.FC<{rows: [string, number, string, number, string?][]; max: number; y?: number; unit?: string}> = ({rows, max, y = 330}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 160, top: y}}>
      {rows.map(([label, v, txt, a, color], i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, height: 78, opacity: lit(f, a)}}>
          <div style={{width: 360, textAlign: 'right', fontFamily: MONO, fontSize: 30, color: C.muted, whiteSpace: 'nowrap'}}>{label}</div>
          <div style={{width: 880, height: 30, background: '#0c1a26'}}>
            <div style={{width: (880 * v * ramp(f, a, 20)) / max, height: 30, background: color ?? C.data, boxShadow: `0 0 20px ${(color ?? C.data)}66`}} />
          </div>
          <div style={{fontFamily: MONO, fontSize: 32, whiteSpace: 'nowrap', color: color ?? C.ink, opacity: ramp(f, a + 8)}}>{txt}</div>
        </div>
      ))}
    </div>
  );
};

/** Code: a literal command or file, exactly as the transcript gives it. Lines light at their anchors. */
export const Code: React.FC<{lines: [string, number][]; title?: string; y?: number; size?: number}> = ({lines, title, y = 300, size = 30}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 160, right: 160, top: y, background: '#060d15ee', border: `1px solid ${C.data}44`, padding: '28px 40px',
      boxShadow: `0 0 80px ${C.data}14`}}>
      {title && <div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 18}}>{title}</div>}
      {lines.map(([l, a], i) => (
        <div key={i} style={{fontFamily: MONO, fontSize: size, lineHeight: 1.55, whiteSpace: 'pre', color: ramp(f, a) > 0.5 ? C.ink : C.muted,
          opacity: lit(f, a), textShadow: ramp(f, a) > 0.5 ? `0 0 18px ${C.data}55` : undefined}}>{l}</div>
      ))}
    </div>
  );
};

/** Big: one statement held still (≥ 3.5 s by the caller). */
export const Big: React.FC<{text: string; sub?: string; color?: string; size?: number}> = ({text, sub, color = C.ink, size = 84}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 120}}>
    <div style={{fontSize: size, fontWeight: 300, color, lineHeight: 1.2, letterSpacing: 1}}>{text}</div>
    {sub && <div style={{fontFamily: MONO, fontSize: 30, color: C.muted, marginTop: 40}}>{sub}</div>}
  </AbsoluteFill>
);

/** Source line: where a number comes from. */
export const By: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 160, bottom: 70, fontFamily: MONO, fontSize: 22, color: C.muted}}>source: {text}</div>
);

/** Hero: a generated cinematic shot (Google Flow / Veo). Never evidence: always labelled as a generated illustration. */
export const Hero: React.FC<{src: string; dim?: number; from?: number}> = ({src, dim = 0, from = 0}) => {
  return (
    <AbsoluteFill>
      <Loop durationInFrames={240}>
        <OffthreadVideo src={staticFile(src)} muted startFrom={from} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Loop>
      <AbsoluteFill style={{background: `rgba(3,6,11,${dim})`}} />
      <div style={{position: 'absolute', right: 40, bottom: 30, fontFamily: MONO, fontSize: 20, color: '#ffffff99'}}>generated illustration · Google Flow, Veo 3.1</div>
    </AbsoluteFill>
  );
};
