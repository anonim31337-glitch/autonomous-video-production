// segment: M6
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {at, Cues, FPS, tokens, words} from '../anchors';
import {C, MONO} from '../look';
import {Beats, Big, Code, Head, lit, Points, ramp, Stage} from '../kit';
import val from '../data/validator.json';

// Real data: word times of this chapter's own first caption lines (the same function the composition uses), V2 distinct
// anchor phrases per chapter from V2 tools/check_phrases.py (13+58+78+64+54+37+36+56 = 396), this film's validator output.
const V2 = [13, 58, 78, 64, 54, 37, 36, 56];

const WordTimes: React.FC<{cue: Cues}> = ({cue}) => {
  const f = useCurrentFrame();
  const t = at(cue, 'The capture log gives start times');
  const lines = cue.lines.slice(0, 4).filter((l) => tokens(l.text).length);
  const ws = words({...cue, lines: cue.lines.slice(0, 5)}).filter((w) => w.t < lines[lines.length - 1].t + 2);
  const t0 = lines[0].t, t1 = ws[ws.length - 1].t + 0.6, W = 1600;
  const x = (s: number) => ((s - t0) / (t1 - t0)) * W;
  return (
    <Stage>
      <Head tag="M6 · WORD TIMES" title="Line start from the log, words weighted by length + 1" y={80} />
      <div style={{position: 'absolute', left: 160, top: 360, width: W, height: 300}}>
        {lines.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: x(l.t), top: 0, width: 3, height: 230, background: C.data, opacity: lit(f, t + i * 6)}} />
        ))}
        {ws.map((w, i) => (
          <div key={i} style={{position: 'absolute', left: x(w.t), top: 90 + (i % 2) * 70, opacity: lit(f, t + 20 + i * 2)}}>
            <div style={{width: 2, height: 40, background: C.ink}} />
            <div style={{fontFamily: MONO, fontSize: 26, marginTop: 6, whiteSpace: 'nowrap'}}>{w.w}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, top: 260, fontFamily: MONO, fontSize: 24, color: C.muted}}>this chapter's first caption lines · {cue.speed}× · cyan = line start from the log</div>
      </div>
      <Points y={760} size={30} items={[['last line: assume 2.5 seconds', at(cue, 'For the last line')],
        ['lowercase, Unicode letters and digits, everything else a space', at(cue, 'Normalize text to lowercase')]]} />
    </Stage>
  );
};

const Constellation: React.FC<{cue: Cues}> = ({cue}) => {
  const f = useCurrentFrame();
  const t398 = at(cue, '398 anchor phrases were found');
  const t396 = at(cue, 'The final code of version two contains 396');
  return (
    <Stage>
      <Head tag="M6 · TWO STATES, KEPT SEPARATE" title="398 at validation · 396 in the final code" y={70} />
      <div style={{position: 'absolute', left: 160, top: 240, fontFamily: MONO, fontSize: 30, color: C.muted, opacity: lit(f, t398) * (1 - 0.6 * ramp(f, t396))}}>
        validation stage: 398 phrases found in the recordings, 0 missing
      </div>
      <div style={{position: 'absolute', left: 160, top: 300, fontFamily: MONO, fontSize: 30, color: C.human, opacity: ramp(f, at(cue, 'During QA two anchors were re-pointed'))}}>
        during QA: two anchors re-pointed to phrases already in use
      </div>
      <div style={{position: 'absolute', left: 160, top: 400}}>
        {V2.map((n, c) => (
          <div key={c} style={{display: 'flex', alignItems: 'center', gap: 24, height: 62, opacity: ramp(f, t396 + c * 4)}}>
            <div style={{width: 120, fontFamily: MONO, fontSize: 26, color: C.muted}}>Ch{c} {n}</div>
            <div style={{display: 'flex', gap: 6, flexWrap: 'nowrap'}}>
              {Array.from({length: n}, (_, k) => <div key={k} style={{width: 12, height: 12, borderRadius: 6, background: C.data, boxShadow: `0 0 8px ${C.data}`}} />)}
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 160, top: 600, fontSize: 160, fontWeight: 300, color: C.data, opacity: ramp(f, t396 + 40)}}>396</div>
      <div style={{position: 'absolute', left: 160, bottom: 60, fontFamily: MONO, fontSize: 22, color: C.muted}}>source: V2 tools/check_phrases.py on the final chapters, distinct phrases per chapter</div>
    </Stage>
  );
};

export const SceneM6: React.FC<{cue: Cues}> = ({cue}) => {
  const v = val as {found: number; missing: number; files: number};
  return (
    <AbsoluteFill>
      <Beats end={Math.round(cue.duration * FPS)} beats={[
        [0, <Stage><Big text="A visual changes when the narrator says the phrase it explains." sub="not on a guessed second" /></Stage>],
        [at(cue, 'The capture log gives start times'), <WordTimes cue={cue} />],
        [at(cue, 'Expose one function'), <Stage>
          <Head tag="M6 · ONE FUNCTION" title="at(phrase, offset, occurrence) → frame" />
          <Code y={330} size={30} lines={[['at(cue, "Expose one function")      // frame from the start of its segment', at(cue, 'It returns the frame')],
            ['Sequence(from = segment start)     // local frames become film frames', at(cue, 'The composition places each segment')],
            ['throw new Error("anchor not found") // never a default time', at(cue, 'If the phrase does not exist')]]} />
        </Stage>],
        [at(cue, 'Before every render, run the validator'), <Stage>
          <Head tag="M6 · VALIDATOR" title="Every phrase in the scene code, searched in the real narration" />
          <Code y={330} size={30} title="this film · tools/anchors.py (before the render)" lines={[[`scene files: ${v.files}`, at(cue, 'It extracts every anchor phrase')],
            [`phrases found: ${v.found}`, at(cue, 'Output per chapter')], [`phrases missing: ${v.missing}`, at(cue, 'Gate: zero missing')]]} />
        </Stage>],
        [at(cue, 'Two states, kept separate'), <Constellation cue={cue} />],
        [at(cue, 'Placeholders. Write scenes before'), <Stage>
          <Head tag="M6 · PLACEHOLDERS" title="Scenes first, against fake timings" />
          <Points y={330} items={[['five words per line at a nominal rate, silent audio, marked fake', at(cue, 'Generate placeholder timings')],
            ['reference: 155 wpm · measured Polish 148 · this English voice 142', at(cue, 'The reference run used 155 words per minute')],
            ['recording arrives → extraction overwrites → validator again', at(cue, 'When a recording arrives')],
            ['version two: zero missing with placeholders and with recordings', at(cue, 'In version two the placeholders'), C.pass]]} />
        </Stage>],
        [at(cue, 'Layout follows anchors'), <Stage><Big text="Layout follows anchors, never the reverse." sub="a visual that needs more time moves to an earlier phrase; the narration is never stretched" /></Stage>],
      ]} />
    </AbsoluteFill>
  );
};
