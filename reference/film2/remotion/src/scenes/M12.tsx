// segment: M12
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {at, Cues, FPS} from '../anchors';
import {C, MONO} from '../look';
import {Beats, Big, Code, Head, Hero, lit, Points, ramp, Stage} from '../kit';
import qa from '../data/qa_history.json';

// Everything here is the real QA history of version two (qa_history.json, 09_QA/black, 09_QA/black2). H3 is generated.
const R = (qa as any).renders;
const L = 2125.9;
const FRAMES = ['162', '262', '455.5', '647', '700', '840', '890', '966', '1018', '1056', '1127', '1302', '1378', '1461', '1512', '1671', '1705', '1735', '1775', '1802', '1827', '1962', '1991'];

const Lane: React.FC<{label: string; blacks: number[][]; sil?: number[]; t: number; stagger?: boolean; color?: string}> = ({label, blacks, sil = [], t, stagger, color}) => {
  const f = useCurrentFrame();
  const W = 1500;
  return (
    <div style={{position: 'relative', height: 120, opacity: lit(f, t)}}>
      <div style={{position: 'absolute', left: 0, top: 30, width: 200, fontFamily: MONO, fontSize: 30}}>{label}</div>
      <div style={{position: 'absolute', left: 220, top: 0, width: W, height: 80, background: `${color ?? C.data}26`, border: `1px solid ${color ?? C.data}66`}}>
        {blacks.map(([a, b], i) => (
          <div key={i} style={{position: 'absolute', left: (a / L) * W, width: Math.max(4, ((b - a) / L) * W), height: 80, background: C.fail,
            opacity: stagger ? ramp(f, t + 10 + i * 2, 6) : 1, boxShadow: `0 0 14px ${C.fail}`}} />
        ))}
        {sil.map((s, i) => <div key={i} style={{position: 'absolute', left: (s / L) * W - 3, top: 84, width: 6, height: 22, background: C.fail}} />)}
      </div>
    </div>
  );
};

const Grid: React.FC<{t: number}> = ({t}) => { // skeleton rule: all 23 frames dim from the beat start, lit at the anchor
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 160, top: 220, width: 1600, display: 'flex', flexWrap: 'wrap', gap: 10}}>
      {FRAMES.map((n, i) => (
        <div key={n} style={{width: 300, opacity: lit(f, t + i * 3)}}>
          <Img src={staticFile(`ev/b_${n}.png`)} style={{width: 300, border: `1px solid ${C.fail}88`}} />
          <div style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>{n} s</div>
        </div>
      ))}
    </div>
  );
};

const Chunks3: React.FC<{t: number}> = ({t}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 160, top: 420, display: 'flex', gap: 20}}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{width: 380, height: 120, border: `2px solid ${i === 2 ? C.muted : C.data}`, opacity: lit(f, t + i * 6),
          background: i === 2 ? '#0c1a26' : `${C.data}33`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 34}}>part{i}</div>
          <div style={{fontFamily: MONO, fontSize: 22, color: i === 2 ? C.muted : C.data}}>{i === 2 ? 'unchanged · reused' : 're-rendered'}</div>
        </div>
      ))}
    </div>
  );
};

export const SceneM12: React.FC<{cue: Cues}> = ({cue}) => {
  const t1 = at(cue, 'Render one of version two');
  return (
    <AbsoluteFill>
      <Beats end={Math.round(cue.duration * FPS)} beats={[
        [0, <Stage><Big text="QA decides delivery." /></Stage>],
        [at(cue, 'Run the automated gates on the final file'), <AbsoluteFill>
          <Hero src="flow/h3.mp4" dim={0.35} />
          <Code y={640} size={26} lines={[['ffprobe -show_streams -show_format -of json', at(cue, 'ffprobe, show streams')],
            ['ffmpeg -vf blackdetect=d=0.5:pix_th=0.08 -af silencedetect=noise=-50dB:d=2,ebur128=peak=true -f null -', at(cue, 'One ffmpeg pass with three filters')]]} />
        </AbsoluteFill>],
        [t1, <Stage>
          <Head tag="M12 · RENDER 1 · FULL" title="Exit code 0. Ignore that." y={80} />
          <div style={{position: 'absolute', left: 160, top: 300}}><Lane label="render 1" blacks={R[0].black_segments} sil={R[0].silences_over_2s_start} t={t1} stagger /></div>
          <Points y={520} size={34} items={[['35:25 · −14.3 LUFS · true peak −1.2 · pass', at(cue, 'Duration 35 minutes 25 seconds'), C.pass],
            ['black segments: 23', at(cue, 'Black segments: twenty-three'), C.fail], ['silences: 3', at(cue, 'Silences: three'), C.fail], ['pixel format: yuvj420p', at(cue, 'Pixel format: yuvj420p'), C.fail]]} />
        </Stage>],
        [at(cue, 'Classify before you fix'), <Stage>
          <Head tag="M12 · CLASSIFY · ONE FRAME FROM EVERY INTERVAL" title="Look at all of them" y={60} />
          <Grid t={at(cue, 'Extract one frame from every interval')} />
        </Stage>],
        [at(cue, 'Result: twenty-three of twenty-three'), <Stage>
          <Head tag="M12 · RESULT" title="23 of 23 real · 0 false positives" y={60} />
          <Grid t={0} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 700, bottom: 0, background: `linear-gradient(transparent, ${C.bg} 25%)`}} />
          <Points y={800} size={30} items={[['every frame: a headline only; the body waited for a later phrase', at(cue, 'Every frame showed only a headline')],
            ['3 silences: beds shorter than their chapters', at(cue, 'The three silences were real')], ['yuvj420p: JPEG capture → full range; the Remotion setting did not reach the stream', at(cue, 'The pixel format was real')]]} />
        </Stage>],
        [at(cue, 'Do not patch the final file'), <Stage>
          <Head tag="M12 · FIX UPSTREAM" title="The defects are in the system that made the file" />
          <Points y={330} items={[['skeleton rule in every component', at(cue, 'Add the skeleton rule')], ['loop the music beds', at(cue, 'Loop the music beds')],
            ['fix the overlapping bars and labels', at(cue, 'Fix the overlapping bars')]]} />
        </Stage>],
        [at(cue, 'Render two'), <Stage>
          <Head tag="M12 · RENDER 2 · FULL" title="4 · 0 · still yuvj420p" y={80} />
          <div style={{position: 'absolute', left: 160, top: 260}}>
            <Lane label="render 1" blacks={R[0].black_segments} t={0} />
            <Lane label="render 2" blacks={R[1].black_segments} t={at(cue, 'Black segments: four')} />
          </div>
          <Img src={staticFile('ev/black2_sheet.jpg')} style={{position: 'absolute', left: 380, top: 560, height: 380, opacity: ramp(useCurrentFrame(), at(cue, 'Inspect the four frames'))}} />
        </Stage>],
        [at(cue, 'Render three. Partial'), <Stage>
          <Head tag="M12 · RENDER 3 · PARTIAL" title="Only the changed chunks" />
          <Chunks3 t={at(cue, 'Only chunks zero, one and three')} />
          <Points y={640} size={32} items={[['assemble', at(cue, 'Assemble.')], ['normalize loudness', at(cue, 'Normalize loudness')], ['convert color range', at(cue, 'Convert color range')]]} />
        </Stage>],
        [at(cue, 'QA three'), <Stage>
          <Head tag="M12 · QA 3" title="PASS" y={80} />
          <div style={{position: 'absolute', left: 160, top: 260}}>
            <Lane label="render 1" blacks={R[0].black_segments} t={0} />
            <Lane label="render 2" blacks={R[1].black_segments} t={0} />
            <Lane label="render 3" blacks={R[2].black_segments} t={0} color={C.pass} />
          </div>
          <div style={{position: 'absolute', left: 160, top: 680, fontFamily: MONO, fontSize: 36, color: C.pass}}>0 black · 0 silences · yuv420p · −14.3 LUFS · TP −1.2</div>
        </Stage>],
        [at(cue, 'One gate still reported fail'), <Stage>
          <Head tag="M12 · A GATE THAT DID NOT BELONG" title="32–35 min, inherited from version one" />
          <Points y={330} items={[['runtime window 32–35 min: FAIL (35:25)', at(cue, 'One gate still reported fail'), C.fail], ['version two had no such requirement', at(cue, 'Version two had no such requirement')],
            ['write down why it does not apply', at(cue, 'Write down why it does not apply')], ['every gate belongs to the current project', at(cue, 'make every gate belong')]]} />
        </Stage>],
        [at(cue, 'Recovery rules'), <Stage>
          <Head tag="M12 · RECOVERY RULES" title="Six rules" y={80} />
          <Points y={260} size={34} items={[['do not patch the final video manually unless unavoidable', at(cue, 'One: do not patch')], ['identify the deterministic upstream cause', at(cue, 'Two: identify')],
            ['change composition, timing, asset logic or pipeline', at(cue, 'Three: change')], ['re-render only the affected ranges', at(cue, 'Four: re-render')],
            ['re-run the relevant QA on the new final file', at(cue, 'Five: re-run')], ['never infer success from render completion', at(cue, 'Six: never infer')]]} />
        </Stage>],
        [at(cue, 'Render complete does not equal delivery ready', 0, 0), <Stage><Big text="RENDER_COMPLETE ≠ DELIVERY_READY" size={68} /></Stage>],
      ]} />
    </AbsoluteFill>
  );
};
