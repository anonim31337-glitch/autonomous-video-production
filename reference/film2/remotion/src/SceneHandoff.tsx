// segment: HANDOFF
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {at, Cues, FPS} from './anchors';
import {C, MONO, SANS} from './look';
import {Grain, Haze} from './Atmos';

const ramp = (f: number, a: number, len = 14) =>
  interpolate(f, [a, a + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0, 0, 1)});

// The only full-screen typographic card of the film. Each field appears when it is spoken; the same words are in the SRT.
export const SceneHandoff: React.FC<{cue: Cues; speed: number}> = ({cue, speed}) => {
  const f = useCurrentFrame();
  const rows: [string, string, string][] = [
    ['', 'HUMAN HANDOFF COMPLETE', 'Human handoff complete'],
    ['TARGET', 'Claude Code · Claude Opus 5.5', 'Target'],
    ['LANGUAGE', 'English', 'Language'],
    ['MODE', 'operational instruction', 'Mode'],
    ['PLAYBACK', 'high density', 'Playback'],
  ];
  return (
    <AbsoluteFill style={{background: C.bg, justifyContent: 'center', paddingLeft: 240, fontFamily: SANS}}>
      <Haze y="50%" tint="#0b2129" />
      <div style={{position: 'absolute', left: 240, top: 0, bottom: 0, width: 2, background: `linear-gradient(${C.human}00, ${C.human}, ${C.human}00)`,
        opacity: 1 - ramp(f, at(cue, 'Human handoff complete', 1.2), 30)}} />
      {rows.map(([k, v, phrase], i) => {
        const p = ramp(f, at(cue, phrase));
        return (
          <div key={k + v} style={{display: 'flex', alignItems: 'baseline', gap: 40, marginBottom: i === 0 ? 70 : 26, paddingLeft: 60, opacity: p,
            transform: `translateX(${(1 - p) * 40}px)`}}>
            {k && <div style={{width: 260, fontFamily: MONO, fontSize: 30, color: C.muted, letterSpacing: 4}}>{k}</div>}
            <div style={{fontSize: i === 0 ? 96 : 54, fontWeight: i === 0 ? 300 : 400, letterSpacing: i === 0 ? 6 : 1, color: i === 0 ? C.data : C.ink}}>{v}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', right: 120, bottom: 90, fontFamily: MONO, fontSize: 24, color: C.muted, opacity: ramp(f, at(cue, 'Playback'))}}>
        next: {speed}× · English · operational
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// M0 opening: the river of this film's real caption lines. Above the horizon the transcript; below, its reflection —
// "the visuals repeat it, they never extend it" made literal.
export const River: React.FC<{cue: Cues; reflectFrom: number}> = ({cue: raw, reflectFrom}) => {
  const f = useCurrentFrame();
  const cue = {...raw, lines: raw.lines.filter((l) => l.text)}; // spoken overflow of a long path has no display text
  const t = f / FPS;
  const cur = Math.max(0, cue.lines.findIndex((l, i) => t >= l.t && (i + 1 === cue.lines.length || t < cue.lines[i + 1].t)));
  const lines = cue.lines.slice(Math.max(0, cur - 6), cur + 3);
  const base = Math.max(0, cur - 6);
  const block = (mirror: boolean) => (
    <div style={{position: 'absolute', left: 0, right: 0, top: mirror ? 560 : undefined, bottom: mirror ? undefined : 520,
      transform: mirror ? 'scaleY(-1)' : undefined, opacity: mirror ? 0.22 * ramp(f, reflectFrom, 30) : 1,
      WebkitMaskImage: mirror ? 'linear-gradient(0deg, transparent 10%, black 100%)' : undefined}}>
      {lines.map((l, k) => {
        const d = base + k - cur;
        return (
          <div key={base + k} style={{textAlign: 'center', fontFamily: d === 0 ? SANS : MONO, fontSize: d === 0 ? 76 : 36,
            fontWeight: d === 0 ? 400 : 300, color: d === 0 ? C.ink : d < 0 ? C.data : C.muted,
            opacity: d === 0 ? 1 : d < 0 ? Math.max(0.12, 0.7 + d * 0.1) : 0.25, marginTop: 14,
            filter: d < -3 ? `blur(${(-d - 3) * 1.2}px)` : undefined}}>{l.text}</div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Haze y="51%" tint="#0b2630" />
      {block(false)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 552, height: 2, background: `linear-gradient(90deg, transparent, ${C.data}, transparent)`, opacity: 0.6}} />
      {block(true)}
      <div style={{position: 'absolute', left: 80, bottom: 50, fontFamily: MONO, fontSize: 20, color: C.muted}}>
        line {cur + 1} / {cue.lines.length} · {cue.speed}× · these are this film's captions
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
