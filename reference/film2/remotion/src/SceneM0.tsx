import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {at, Cues, FPS} from './anchors';
import {C, MONO, SANS} from './look';
import {River} from './SceneHandoff';
import {Grain, Haze} from './Atmos';

const ramp = (f: number, a: number, len = 14) =>
  interpolate(f, [a, a + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0, 0, 1)});
const HOLD = Math.round(3.5 * FPS); // anything an agent must read stays still at least 3.5 s

// Source authority: the files on disk outweigh the chat scroll. The file names are this project's real source-of-truth files.
export const Authority: React.FC<{t: number}> = ({t}) => {
  const f = useCurrentFrame();
  const tilt = interpolate(f, [t + 10, t + 40], [0, 7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  // each pan stands on its end of the beam: pivot at x=960, ends 400 px away, the heavier (disk) side goes down
  const dy = 400 * Math.sin((tilt * Math.PI) / 180);
  const pan = (x: number, title: string, items: string[], color: string, d: number) => (
    <div style={{position: 'absolute', left: x, top: 636 + d, width: 520, transform: 'translateY(-100%)'}}>
      <div style={{fontFamily: SANS, fontSize: 30, color: C.muted, textAlign: 'center', marginBottom: 12}}>{title}</div>
      {items.map((i) => <div key={i} style={{fontFamily: MONO, fontSize: 28, color, padding: '10px 18px', margin: 8, border: `1px solid ${color}66`, background: '#08111ccc', boxShadow: `0 0 30px ${color}22`}}>{i}</div>)}
    </div>
  );
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Haze y="62%" tint="#0d2a33" />
      <div style={{position: 'absolute', left: 260, right: 260, top: 640, height: 3, background: C.muted, transform: `rotate(${-tilt}deg)`}} />
      <div style={{position: 'absolute', left: 950, top: 640, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderBottom: `40px solid ${C.muted}`}} />
      {pan(300, 'artifacts on disk', ['CANON.md', 'qa_history.json', 'manifest.json', 'films.json'], C.data, dy)}
      {pan(1100, 'chat history · earlier prompts', ['earlier prompt', 'chat message'], C.muted, -dy)}
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: SANS, fontSize: 64, fontWeight: 300, color: C.ink}}>Source authority</div>
      <Grain />
    </AbsoluteFill>
  );
};

export const Zero: React.FC<{t: number}> = ({t}) => {
  const f = useCurrentFrame();
  return (
  <AbsoluteFill style={{background: C.bg, justifyContent: 'center', alignItems: 'center', fontFamily: MONO}}>
    <Haze y="50%" tint="#0b2129" />
    <div style={{fontSize: 44, color: C.muted, marginBottom: 50, opacity: ramp(f, t)}}>render exit code 0</div>
    <div style={{fontSize: 92, color: C.ink, letterSpacing: 2, opacity: ramp(f, t + 12)}}>
      RENDER_COMPLETE <span style={{color: C.fail}}>≠</span> DELIVERY_READY
    </div>
    <div style={{fontSize: 30, color: C.muted, marginTop: 50, opacity: ramp(f, t + 24)}}>delivery = the final file, its captions and the uploaded video pass every gate</div>
    <Grain />
  </AbsoluteFill>
  );
};

