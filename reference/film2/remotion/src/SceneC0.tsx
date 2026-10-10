// segment: C0
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {at, Cues, FPS} from './anchors';
import {C, MONO, SANS} from './look';
import {Hall} from './Hall';
import {Grain, Haze} from './Atmos';
import {Hero} from './kit';
import qa from './data/qa_history.json';

const ramp = (f: number, a: number, len = 18) =>
  interpolate(f, [a, a + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0, 0, 1)});
const win = (f: number, a: number, b: number, len = 18) => Math.min(ramp(f, a, len), 1 - ramp(f, b - len, len));

// Beat C: the July run. Indicators stayed green while four episodes had no captions (source: Z_uMw1ZlcCo, 26.07.2026).
const July: React.FC<{f: number; cue: Cues}> = ({f, cue}) => {
  const tCap = at(cue, 'cztery odcinki nie miały napisów');
  const t27 = at(cue, 'dwadzieścia siedem sekund bełkotu');
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: SANS}}>
      <div style={{display: 'flex', gap: 90}}>
        {[0, 1, 2, 3].map((i) => {
          const flip = ramp(f, tCap + i * 6, 10);
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
              <div style={{width: 74, height: 74, borderRadius: 37, background: C.pass, boxShadow: `0 0 60px ${C.pass}, 0 0 140px ${C.pass}55`}} />
              <div style={{fontFamily: MONO, fontSize: 32, color: C.muted, letterSpacing: 2}}>ODCINEK {i + 1}</div>
              <div style={{fontFamily: MONO, fontSize: 40, height: 52, color: flip > 0.5 ? C.fail : C.pass, opacity: 0.4 + 0.6 * Math.abs(flip * 2 - 1)}}>
                {flip > 0.5 ? 'napisy: 0' : 'status: OK'}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 110, width: 1300, opacity: ramp(f, t27)}}>
        <div style={{position: 'relative', height: 24, borderBottom: `1px solid ${C.muted}66`}}>
          {Array.from({length: 61}, (_, s) => (
            <div key={s} style={{position: 'absolute', left: (s / 60) * 1300, bottom: 0, width: 1, height: s % 10 ? 8 : 18, background: C.muted}} />
          ))}
          <div style={{position: 'absolute', left: 0, bottom: 2, height: 16, width: (27 / 60) * 1300 * ramp(f, t27 + 6, 30), background: C.fail, boxShadow: `0 0 30px ${C.fail}`}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 24, color: C.muted, marginTop: 14}}>
          <span style={{color: C.fail}}>27 s bełkotu · najczęściej oglądany film</span><span>skala: 60 s</span>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 60, fontFamily: MONO, fontSize: 20, color: C.muted}}>
        źródło: „Czy AI kłamie? Spór o nasz kanał”, Laufer108, 26.07.2026
      </div>
    </AbsoluteFill>
  );
};

// Beat D: the real QA history of version 2 (qa_history.json). Every red mark is a real failure at its real position.
const L = 2125.9; // render 1 duration in seconds
const Strip: React.FC<{f: number; cue: Cues}> = ({f, cue}) => {
  const t0 = at(cue, 'Szóstego października');
  const tBlack = at(cue, 'dwadzieścia trzy puste fragmenty');
  const tSil = at(cue, 'trzy dziury w dźwięku');
  const tCol = at(cue, 'zły zakres kolorów');
  const tFix = at(cue, 'sprawdził jeszcze dwa razy');
  const tZero = at(cue, 'dopiero przy zerze');
  const W = 1560;
  const [r1, r2, r3] = qa.renders as any[];
  const lane = (label: string, blacks: number[][], show: number, i: number, sil: number[] = []) => (
    <div key={label} style={{position: 'relative', height: 92, marginBottom: 34, opacity: show}}>
      <div style={{position: 'absolute', left: -190, top: 26, width: 170, textAlign: 'right', fontFamily: MONO, fontSize: 30, color: C.ink}}>{label}</div>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 70, background: `linear-gradient(90deg, ${C.data}22, ${C.data}10)`, border: `1px solid ${C.data}55`}} />
      {blacks.map(([a, b], k) => (
        <div key={k} style={{position: 'absolute', left: (a / L) * W, top: 0, width: Math.max(4, ((b - a) / L) * W), height: 70, background: C.fail,
          opacity: i === 0 ? ramp(f, tBlack + k * 2, 6) : 1, boxShadow: `0 0 18px ${C.fail}`}} />
      ))}
      {sil.map((s, k) => (
        <div key={k} style={{position: 'absolute', left: (s / L) * W - 2, top: 74, width: 4, height: 18, background: C.fail, opacity: ramp(f, tSil + k * 8, 6)}} />
      ))}
    </div>
  );
  const zero = ramp(f, tZero);
  return (
    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 260, fontFamily: SANS}}>
      <div style={{fontFamily: MONO, fontSize: 32, color: C.ink, marginBottom: 44, opacity: ramp(f, t0)}}>
        wersja 2 · 35:25 · render 1 → render 3 · źródło: qa_history.json
      </div>
      {lane('render 1', r1.black_segments, ramp(f, t0), 0, r1.silences_over_2s_start)}
      {lane('render 2', r2.black_segments, ramp(f, tFix), 1)}
      {lane('render 3', r3.black_segments, ramp(f, tFix + 40), 2)}
      <div style={{display: 'flex', gap: 70, marginTop: 30, fontFamily: MONO, fontSize: 40}}>
        <span style={{color: C.fail, opacity: ramp(f, tBlack)}}>23 × czarny ekran &gt; 0,5 s</span>
        <span style={{color: C.fail, opacity: ramp(f, tSil)}}>3 × cisza &gt; 2 s</span>
        <span style={{color: zero > 0.5 ? C.pass : C.fail, opacity: ramp(f, tCol)}}>{zero > 0.5 ? 'yuv420p · zakres TV' : 'yuvj420p · pełny zakres'}</span>
      </div>
      <div style={{position: 'absolute', right: 120, top: 150, fontSize: 210, fontWeight: 300, color: C.pass, opacity: zero, textShadow: `0 0 80px ${C.pass}88`}}>0</div>
    </AbsoluteFill>
  );
};

// Beat B: what the human should copy and where the agent should read.
const Reading: React.FC<{f: number; cue: Cues}> = ({f, cue}) => {
  const tLink = at(cue, 'Skopiuj link');
  const items: [string, string, string[]][] = [
    ['transkrypcję', 'TRANSCRIPT.md', ['Agent. This video is an executable', 'instruction. Treat the transcript as', 'the primary source…']],
    ['opis', 'opis filmu', ['link do repozytorium', 'rozdziały', 'źródła']],
    ['repozytorium', 'autonomous-video-production/', ['README.md', 'CLAUDE.md', '.claude/skills/…/SKILL.md', 'manifest.json', 'docs/  reference/']],
  ];
  return (
    <AbsoluteFill style={{fontFamily: SANS, perspective: 1400}}>
      <div style={{position: 'absolute', left: 140, top: 470, fontFamily: MONO, fontSize: 30, color: C.human, opacity: ramp(f, tLink)}}>link do filmu</div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {items.map(([word], i) => {
          const p = ramp(f, at(cue, word), 24);
          const x2 = 760 + i * 380;
          return <path key={i} d={`M 380 486 C 560 486, ${x2 - 160} 300, ${x2 + 120} 300`} fill="none" stroke={C.data} strokeWidth={3}
            strokeDasharray={1400} strokeDashoffset={1400 * (1 - p)} opacity={0.9} style={{filter: `drop-shadow(0 0 8px ${C.data})`}} />;
        })}
      </svg>
      {items.map(([word, title, lines], i) => {
        const p = ramp(f, at(cue, word), 24);
        return (
          <div key={i} style={{position: 'absolute', left: 760 + i * 380, top: 300, width: 300, height: 560, opacity: p,
            transform: `translateY(${(1 - p) * 120}px) rotateY(-14deg)`, background: 'linear-gradient(180deg, #0d1a28, #050a12)',
            border: `1px solid ${C.data}66`, boxShadow: `0 0 90px ${C.data}22`, padding: 26}}>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.data, marginBottom: 26}}>{title}</div>
            {lines.map((l) => <div key={l} style={{fontFamily: MONO, fontSize: 18, color: C.muted, lineHeight: '30px'}}>{l}</div>)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const SceneC0: React.FC<{cue: Cues; rms: number[]; speed: number}> = ({cue, rms, speed}) => {
  const f = useCurrentFrame();
  const tHuman = at(cue, 'jako człowiek');
  const tMistake = at(cue, 'zaszła pomyłka');
  const tAgent = at(cue, 'Ten materiał nie powstał');
  const tForget = at(cue, 'zapomnij o montażu');
  const tJuly = at(cue, 'W lipcu');
  const tOct = at(cue, 'Szóstego października');
  const tFast = at(cue, 'Za chwilę przejdę');
  const tSpeed = at(cue, 'przyspieszę prawie dwa razy');
  const squeeze = interpolate(f, [tSpeed, tSpeed + 40], [1, 1 / speed], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const busy = Math.max(0.45 * win(f, tAgent + 30, tJuly + 10), win(f, tJuly, tOct + 10), win(f, tOct, tFast + 10)); // the voice stays visible while the reading beat builds
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Haze />
      <Hall rms={rms} spokenSec={f / FPS} squeeze={squeeze} dim={busy} camZ={interpolate(f, [0, tAgent], [19, 15], {extrapolateRight: 'clamp'})}
        human={ramp(f, tHuman, 12) * (1 - 0.6 * ramp(f, tMistake)) * (1 - ramp(f, tForget, 30))} />
      <AbsoluteFill style={{opacity: 1 - ramp(f, tAgent, 24)}}><Hero src="flow/h1.mp4" dim={0.1} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: win(f, tAgent + 20, tJuly)}}><Reading f={f} cue={cue} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: win(f, tJuly - 10, tOct) * 0.55}}><Hero src="flow/h2.mp4" dim={0.4} from={0} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: win(f, tJuly, tOct)}}><July f={f} cue={cue} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: win(f, tOct, tFast)}}><Strip f={f} cue={cue} /></AbsoluteFill>
      <div style={{position: 'absolute', right: 140, top: 200, fontFamily: MONO, fontSize: 64, color: C.data, opacity: ramp(f, tSpeed + 30)}}>{speed.toFixed(1).replace('.', ',')}×</div>
      <Grain />
    </AbsoluteFill>
  );
};
