import React from 'react';
import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Cues, FPS} from './anchors';
import {C, MONO, SANS} from './look';
import {Grain, Haze} from './Atmos';
import {SCENES} from './scenes';
import {bedVolume} from './mix';
import tl from './data/timeline.json';

// The whole film is chained from data/timeline.json, the single source of time (tools/timeline.py). The caption builder
// reads the same file, so captions and picture agree to the frame. Runtime limit asserted in timeline.py and here.
export type Seg = {id: string; title: string; lang?: string; speed?: number; start: number; len: number; card: number; tail: number;
  parts?: {wav: string; audio_from: number; audio_frames: number}[]; cues?: Cues; video?: string};
export const TL = tl as {fps: number; total: number; segments: Seg[]};
if (TL.total > (39 * 60 + 30) * FPS) throw new Error(`runtime ${TL.total} frames above the 39:30 limit`);

const Card: React.FC<{seg: Seg; n: number}> = ({seg, n}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const out = interpolate(f, [seg.card - 12, seg.card], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.bg, opacity: out}}>
      <Haze y="58%" />
      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 200, fontFamily: SANS}}>
        <div style={{fontFamily: MONO, fontSize: 34, color: C.data, letterSpacing: 8, opacity: p}}>{seg.id} · {String(n).padStart(2, '0')} / 15</div>
        <div style={{fontSize: 130, fontWeight: 300, color: C.ink, letterSpacing: 2, marginTop: 20, opacity: p,
          transform: `translateY(${(1 - p) * 30}px)`}}>{seg.title.replace(/^M\d+\s+/, '')}</div>
        <div style={{width: 1520 * p, height: 2, marginTop: 50, background: `linear-gradient(90deg, ${C.data}, transparent)`}} />
        <div style={{fontFamily: MONO, fontSize: 26, color: C.muted, marginTop: 24, opacity: p}}>
          {seg.cues!.lines.length} caption lines · {seg.cues!.duration.toFixed(1)} s at {seg.speed}×
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

const Segment: React.FC<{seg: Seg; n: number}> = ({seg, n}) => {
  const Scene = SCENES[seg.id];
  if (!Scene) throw new Error(`no scene for ${seg.id}`);
  let off = seg.card;
  return (
    <AbsoluteFill>
      {seg.card > 0 && (
        <Sequence durationInFrames={seg.card}>
          <Card seg={seg} n={n} />
          <Audio src={staticFile('sfx_hit.wav')} volume={0.55} />
        </Sequence>
      )}
      <Sequence from={seg.card} durationInFrames={seg.len - seg.card}>
        <Scene cue={seg.cues!} seg={seg} />
      </Sequence>
      {seg.parts!.map((p, i) => {
        const el = (
          <Sequence key={i} from={off} durationInFrames={p.audio_frames}>
            <Audio src={staticFile(p.wav)} startFrom={p.audio_from} endAt={p.audio_from + p.audio_frames} />
          </Sequence>
        );
        off += p.audio_frames;
        return el;
      })}
      <Audio src={staticFile('bed.wav')} loop volume={(f) => bedVolume(f, seg.card, seg.len)} />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  let n = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {TL.segments.map((seg) => (
        <Sequence key={seg.id} from={seg.start} durationInFrames={seg.len}>
          {seg.video ? <OffthreadVideo src={staticFile(seg.video)} /> : <Segment seg={seg} n={seg.card ? ++n : n} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
