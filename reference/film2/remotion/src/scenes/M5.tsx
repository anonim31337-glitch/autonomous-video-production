// segment: M5
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {at, Cues, FPS} from '../anchors';
import {C, MONO} from '../look';
import {Bars, Beats, Big, Code, Flow, Head, lit, Points, ramp, Stage} from '../kit';
import pick from '../data/speed_pick.json';

// Real values: server replies of this film's own streams (ids, claims and tokens removed), V2 Whisper report per chapter
// (out/asr/REPORT.txt), this film's speed pick on module AN02 (05_NARRATION/speed_pick.json).
const V2ASR: [string, number][] = [['N0', 0.871], ['N1', 0.902], ['N2', 0.902], ['N3', 0.905], ['N4', 0.883], ['N5', 0.903], ['N6', 0.916], ['N7', 0.928]];

const Gate: React.FC<{cue: Cues}> = ({cue}) => {
  const f = useCurrentFrame();
  const t = at(cue, 'Reference values: 0.87 to 0.93');
  const tThis = at(cue, "This film's English narration scored");
  const W = 1200, lo = 0.75, hi = 1.0;
  const x = (v: number) => ((v - lo) / (hi - lo)) * W;
  const rows: [string, number, string, number][] = [
    ...V2ASR.map(([n, v], i) => [`V2 ${n} · pl`, v, C.data, t + i * 3] as [string, number, string, number]),
    ['this film · vs spoken text', 0.811, C.fail, tThis], ['this film · vs display 1.0×', 0.986, C.pass, tThis + 20], ['this film · vs display 1.8×', 0.972, C.pass, tThis + 30],
  ];
  return (
    <Stage>
      <Head tag="M5 · WHISPER GATE" title="Similarity against the display text ≥ 0.85" y={70} />
      <div style={{position: 'absolute', left: 520, top: 290, width: W, height: rows.length * 56}}>
        <div style={{position: 'absolute', left: x(0.85), top: -10, bottom: -10, width: 3, background: C.ink, opacity: lit(f, at(cue, 'Gate for this project'))}} />
        <div style={{position: 'absolute', left: x(0.85) + 10, top: -40, fontFamily: MONO, fontSize: 26}}>0.85</div>
      </div>
      {rows.map(([label, v, color, a], i) => (
        <div key={label} style={{position: 'absolute', left: 160, top: 290 + i * 56, display: 'flex', alignItems: 'center', gap: 20, opacity: lit(f, a)}}>
          <div style={{width: 340, textAlign: 'right', fontFamily: MONO, fontSize: 24, color: C.muted}}>{label}</div>
          <div style={{width: x(v) * ramp(f, a, 16), height: 26, background: color, boxShadow: `0 0 16px ${color}66`}} />
          <div style={{fontFamily: MONO, fontSize: 26, color}}>{v.toFixed(3)}</div>
        </div>
      ))}
    </Stage>
  );
};

const Speed: React.FC<{cue: Cues}> = ({cue}) => {
  const p = pick as {speeds: Record<string, {ratio_vs_display: number; terms_missed: string[]}>; terms: string[]};
  const tReal = at(cue, 'The target is 1.8');
  return (
    <Stage>
      <Head tag="M5 · SPEED" title="Only the machine section is accelerated" y={70} />
      <Bars y={250} max={1} rows={[
        ['earlier test · 1.0, 1.7', 1, '16 / 16 terms', at(cue, 'At 1.0 and 1.7')],
        ['earlier test · 1.8–2.0', 15 / 16, '15 / 16 · "clawed"', at(cue, 'At 1.8, 1.9 and 2.0'), C.human],
        ...Object.entries(p.speeds).map(([s, v], i) => [`real module · ${s}×`, v.ratio_vs_display, `${v.ratio_vs_display.toFixed(3)} · ${p.terms.length - v.terms_missed.length}/${p.terms.length}`,
          tReal + i * 6, s === '1.8' ? C.pass : C.data] as [string, number, string, number, string]),
      ]} />
      <div style={{position: 'absolute', left: 160, bottom: 90, fontFamily: MONO, fontSize: 28, color: C.pass}}>chosen: 1.8× · ffmpeg atempo keeps the pitch · timestamps ÷ 1.8 before anchors</div>
    </Stage>
  );
};

export const SceneM5: React.FC<{cue: Cues}> = ({cue}) => (
  <AbsoluteFill>
    <Beats end={Math.round(cue.duration * FPS)} beats={[
      [0, <Stage>
        <Head tag="M5 · NARRATION" title="The engine is replaceable. The timing contract is not." />
        <Code y={360} size={32} title="cues file, one per module (schemas/cues.schema.json)" lines={[
          ['{"duration": 579.015,', at(cue, 'Any synthesizer that returns audio')],
          [' "lines": [{"t": 1.5, "text": "Agent."}, {"t": 3.4, "text": "This video is an executable"}, …]}', at(cue, 'Any synthesizer that returns audio', 1)]]} />
      </Stage>],
      [at(cue, 'Terms of use'), <Stage>
        <Head tag="M5 · TERMS OF USE" title="The operator owns the decision" />
        <Points y={300} size={32} items={[['unlisted explainers, playback captured in a browser', at(cue, 'The reference run generated unlisted')],
          ['compliance with the provider terms: not verified', at(cue, 'Whether this capture complies'), C.human],
          ['show the terms, record the decision in the canon', at(cue, 'Before capturing, show the operator')],
          ['never ask for a password', at(cue, 'Never ask for a password')], ['no fallback engine tested', at(cue, 'No fallback engine was tested')],
          ['if anything breaks: stop, write it down, report', at(cue, 'If the endpoint, the markup contract'), C.human]]} />
      </Stage>],
      [at(cue, 'Protocol. The endpoint is'), <Stage>
        <Head tag="M5 · PROTOCOL" title="MCP over streamable HTTP, JSON-RPC 2.0" y={70} />
        <Code y={230} size={27} lines={[['POST https://scrimba.com/explain/pr/mcp', at(cue, 'The endpoint is')],
          ['Content-Type: application/json', at(cue, 'the headers Content-Type')], ['Accept: application/json, text/event-stream', at(cue, 'Accept application/json and text')],
          ['MCP-Protocol-Version: 2025-06-18', at(cue, 'MCP-Protocol-Version 2025-06-18')], ['User-Agent: <yours>          # without it: HTTP 403', at(cue, 'Without a User-Agent')]]} />
        <Flow y={680} steps={[['initialize', at(cue, 'Send initialize')], ['notifications/initialized', at(cue, 'then the notification')],
          ['Mcp-Session-Id', at(cue, 'Keep the Mcp-Session-Id')], ['last data event', at(cue, 'take the last data event')]]} />
      </Stage>],
      [at(cue, 'Tools. Call tools/call'), <Stage>
        <Head tag="M5 · TOOLS" title="Three calls per explainer" y={70} />
        <Flow y={240} steps={[['start_explainer_stream', at(cue, 'with the name start_explainer_stream'), 'title · description · mode=landscape'],
          ['append_explainer_chunk', at(cue, 'Call append_explainer_chunk'), 'stream_token · markup'], ['finish_explainer_stream', at(cue, 'Call finish_explainer_stream'), 'stream_token']]} />
        <Code y={560} size={24} title="this film · real replies (link, claim and token removed)" lines={[
          ['Stream open. … https://scrimba.com/explain/<id>?claim=<…>  stream_token: <secret>  + 64,000-character contract', at(cue, 'The reply text starts with Stream open')],
          ['Appended. 60 entries, 30 says, about 8:24 of 10:00 narration, 500769 bytes remaining.', at(cue, 'The reply reads Appended')],
          ['Explainer finished: https://scrimba.com/explain/<id> (60 entries, 30 says).', at(cue, 'The reply reads Explainer finished')]]} />
      </Stage>],
      [at(cue, 'Markup. A flat sequence'), <Stage>
        <Head tag="M5 · MARKUP" title="One item and one say per narration block" />
        <Code y={330} size={30} lines={[['<item anchor="s0" title="Contract" text="."></item>', at(cue, 'Literally: an item element')],
          ['<say lang="en-US" title="Contract" text="[narration](#s0)"/>', at(cue, 'Then a self-closing say element')]]} />
        <Points y={650} size={30} items={[['the dot: slides are discarded', at(cue, 'The single dot is there')], ['voice = lang only: pl-PL or en-US', at(cue, 'The voice is chosen by the lang')],
          ['< 10 minutes and < 512 KB per explainer', at(cue, 'One module per explainer')]]} />
      </Stage>],
      [at(cue, 'Capture. The video of the capture'), <Stage><Big text="Only the audio and the timing log are kept." sub="all visuals come from your own code" /></Stage>],
      [at(cue, 'Launch Chrome with exactly the flags'), <Stage>
        <Head tag="M5 · CHROME" title="Exactly the flags of the reference run" y={60} />
        <Code y={200} size={24} lines={[['--headless=new  --remote-debugging-port=9350  --user-data-dir=<data drive>', at(cue, 'headless=new')],
          ['--no-first-run  --window-size=1938,1232  --force-device-scale-factor=1', at(cue, 'no-first-run')],
          ['--screen-info={1920x1200}  --hide-scrollbars  --autoplay-policy=no-user-gesture-required', at(cue, 'screen-info')],
          ['--auto-accept-this-tab-capture  --auto-select-tab-capture-source-by-title=YouTube', at(cue, 'auto-accept-this-tab-capture')],
          ['--disable-backgrounding-occluded-windows  --disable-renderer-backgrounding', at(cue, 'disable-backgrounding-occluded-windows')],
          ['--disable-background-timer-throttling', at(cue, 'disable-background-timer-throttling')]]} />
        <div style={{position: 'absolute', left: 160, top: 760, fontSize: 30, color: C.human}}>tab-capture-by-title: carried over, probably no effect · a smaller set was not tested</div>
      </Stage>],
      [at(cue, 'For every recording. Clear the site storage'), <Stage>
        <Head tag="M5 · EVERY RECORDING" title="Clear, allow, navigate, capture, log" y={70} />
        <Flow vertical y={240} steps={[['Storage.clearDataForOrigin', at(cue, 'Clear the site storage'), 'v1: a take started at 41 s'],
          ['Page.setDownloadBehavior', at(cue, 'Allow downloads')], ['navigate, wait 10 s', at(cue, 'Wait ten seconds')],
          ['getDisplayMedia · preferCurrentTab', at(cue, 'Call getDisplayMedia with preferCurrentTab')], ['MediaRecorder · VP9 + Opus', at(cue, 'Record with MediaRecorder')],
          ['timer every 50 ms', at(cue, 'Start a timer')], ['log caption line · active slide · nag', at(cue, 'The timer logs three things')],
          ['play click with userGesture=true', at(cue, 'Run getDisplayMedia and the play click')], ['poll the clock every 2 s until x / x', at(cue, 'Poll voice-over-control')],
          ['stop · blob · download · log', at(cue, 'Stop the recorder')]]} />
      </Stage>],
      [at(cue, 'Extraction. Cut the audio'), <Stage>
        <Head tag="M5 · EXTRACTION" title="play − 0.15 s → last line + 1.8 s, pauses removed" />
        <Points y={340} items={[['start: play time minus 0.15 seconds', at(cue, 'from play time minus 0.15')], ['end: last caption line plus 1.8 seconds', at(cue, 'the start of the last caption line plus')],
          ['remove logged pauses (sign-up dialog)', at(cue, 'Remove logged pauses')], ['shift every timestamp by the removed duration', at(cue, 'Shift every timestamp')]]} />
      </Stage>],
      [at(cue, 'Phonetics. Synthesizers misread'), <Stage>
        <Head tag="M5 · PHONETICS · POLISH VOICE" title="Read the spoken text before recording" />
        <Points y={330} items={[['Opus 4.8 → "Opus cztery kropka osiem"', at(cue, 'Opus 4.8 is spoken')], ['Claude → "Klod" · Anthropic → "Antropik"', at(cue, 'English names are respelled')],
          ['iPhone → "ajfone": caught by reading, one module regenerated', at(cue, 'In version two the lexicon turned iPhone'), C.fail]]} />
      </Stage>],
      [at(cue, 'English voice of this film'), <Stage>
        <Head tag="M5 · PHONETICS · ENGLISH VOICE" title="Scrimba en-US · 142 words per minute" />
        <Points y={330} items={[['ffmpeg → "F F mpeg"', at(cue, 'ffmpeg as')], ['yt-dlp → "Y T D L P"', at(cue, 'yt-dlp as')], ['H.264 → "H dot two six four"', at(cue, 'H.264 is spoken')],
          ['5.5 → "five point five"', at(cue, 'Versions as')]]} />
      </Stage>],
      [at(cue, 'Validation. Install openai-whisper'), <Stage>
        <Head tag="M5 · VALIDATION" title="Whisper medium on every final narration file" />
        <Flow y={360} steps={[['pip install openai-whisper', at(cue, 'Install openai-whisper')], ['ffmpeg on PATH', at(cue, 'Put ffmpeg on the PATH')],
          ['medium · data drive', at(cue, 'Load the model medium')], ['language + product names', at(cue, 'Transcribe every final narration')], ['word by word', at(cue, 'Compare with the display text')]]} />
        <div style={{position: 'absolute', left: 160, top: 700, fontSize: 30, color: C.fail, opacity: lit(useCurrentFrame(), at(cue, 'The reference run failed once'))}}>the reference run failed once: ffmpeg was not on the PATH</div>
      </Stage>],
      [at(cue, 'Similarity is the ratio'), <Gate cue={cue} />],
      [at(cue, 'Speed. Only machine-instruction sections'), <Speed cue={cue} />],
    ]} />
  </AbsoluteFill>
);
