/**
 * Cały film v2: cold open (pilot) → blok danych → rozdział 1 (pilot: Fable) → rozdziały 1–7 → outro z awatarem <OPERATOR>.
 * Każdy segment ma swój lektor (nagranie Scrimby) i swoje czasy fraz; muzyka zmienia się co rozdział i schodzi pod głos.
 */
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, Series, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FPS, at as pilotAt} from './brand';
import {Cues, makeAt} from './cues';
import {Pilot, PILOT_FRAMES} from './Pilot';
import {Ch0} from './chapters/Ch0';
import {Ch1} from './chapters/Ch1';
import {Ch2} from './chapters/Ch2';
import {Ch3} from './chapters/Ch3';
import {Ch4} from './chapters/Ch4';
import {Ch5} from './chapters/Ch5';
import {Ch6} from './chapters/Ch6';
import {Ch7} from './chapters/Ch7';
import n0 from './data/n0_cues.json';
import n1 from './data/n1_cues.json';
import n2 from './data/n2_cues.json';
import n3 from './data/n3_cues.json';
import n4 from './data/n4_cues.json';
import n5 from './data/n5_cues.json';
import n6 from './data/n6_cues.json';
import n7 from './data/n7_cues.json';

const CARD = 2.6; // sekundy planszy rozdziału przed pierwszym słowem lektora (rozdziały 2–7)
const TAIL = 1.0; // oddech po ostatnim słowie
const OUTRO = Math.round(32.9 * FPS);

type Ch = React.FC<{at: ReturnType<typeof makeAt>; end: number}>;
const CHAPTERS: {name: string; cues: Cues; C: Ch; lead: number; bed?: string}[] = [
  {name: 'n0', cues: n0 as Cues, C: Ch0, lead: 0.3},
  {name: 'n1', cues: n1 as Cues, C: Ch1, lead: 0.3},
  {name: 'n2', cues: n2 as Cues, C: Ch2, lead: CARD, bed: 'bed_neon_static_b.mp3'},
  {name: 'n3', cues: n3 as Cues, C: Ch3, lead: CARD, bed: 'bed_perlowy_puls_b.mp3'},
  {name: 'n4', cues: n4 as Cues, C: Ch4, lead: CARD, bed: 'bed_neon_static.mp3'},
  {name: 'n5', cues: n5 as Cues, C: Ch5, lead: CARD, bed: 'bed_perlowy_puls_a.mp3'},
  {name: 'n6', cues: n6 as Cues, C: Ch6, lead: CARD, bed: 'bed_neon_static_b.mp3'},
  {name: 'n7', cues: n7 as Cues, C: Ch7, lead: CARD, bed: 'bed_perlowy_puls_b.mp3'},
];
const len = (c: {cues: Cues; lead: number}) => Math.round((c.lead + c.cues.duration + TAIL) * FPS);

// pilot dzielimy tuż przed „Historia wakacji…” (początek rozdziału 1), żeby wstawić blok danych
const CUT = pilotAt('Historia wakacji') - 12;
const PILOT_B = PILOT_FRAMES - Math.round(1.6 * FPS) - CUT + Math.round(0.6 * FPS);

export const SEGMENTS = [CUT, len(CHAPTERS[0]), PILOT_B, ...CHAPTERS.slice(1).map(len), OUTRO];
export const FILM_FRAMES = SEGMENTS.reduce((s, x) => s + x, 0);
export const SEGMENT_STARTS = SEGMENTS.map((_, i) => SEGMENTS.slice(0, i).reduce((s, x) => s + x, 0));

/** Podkład: głośniej na planszy, ~11 dB pod lektorem, wyciszenie na końcu utworu albo segmentu. */
const Bed: React.FC<{src: string; dur: number; trackSec: number; loudUntil: number}> = ({src, dur, trackSec, loudUntil}) => {
  // w pętli przez cały segment: bez dziur w muzyce między rozdziałami; wyciszenie w ostatniej sekundzie
  const v = (f: number) => interpolate(f, [0, 12, loudUntil, loudUntil + 20, dur - 30, dur], [0, 0.42, 0.42, 0.08, 0.08, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Audio src={staticFile(src)} volume={v} loop />;
};
const TRACK_SEC: Record<string, number> = {'bed_neon_static.mp3': 233.8, 'bed_neon_static_b.mp3': 146.6, 'bed_perlowy_puls_a.mp3': 207.4, 'bed_perlowy_puls_b.mp3': 178.6};

const Chapter: React.FC<{c: typeof CHAPTERS[number]; dur: number}> = ({c, dur}) => {
  const lead = Math.round(c.lead * FPS);
  const at = makeAt(c.cues, c.lead);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sequence from={lead}><Audio src={staticFile(`${c.name}_narration.wav`)} /></Sequence>
      {c.bed && <Bed src={c.bed} dur={dur} trackSec={TRACK_SEC[c.bed]} loudUntil={lead} />}
      {c.bed && <Sequence from={0} durationInFrames={30}><Audio src={staticFile('sfx_hit.wav')} volume={0.5} /></Sequence>}
      <c.C at={at} end={dur} />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const [a, d0, b] = SEGMENTS;
  const s = SEGMENT_STARTS;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* muzyka ciągła przez cold open i blok danych, potem przez rozdział 1 (pilot B + N1) */}
      <Sequence from={0} durationInFrames={a + d0}>
        <Bed src="bed_neon_static.mp3" dur={a + d0} trackSec={233.8} loudUntil={Math.round(3.2 * FPS)} />
      </Sequence>
      <Sequence from={s[2]} durationInFrames={b + SEGMENTS[3]}>
        <Bed src="bed_perlowy_puls_a.mp3" dur={b + SEGMENTS[3]} trackSec={207.4} loudUntil={Math.round(2.6 * FPS)} />
      </Sequence>
      <Series>
        <Series.Sequence durationInFrames={a}><Pilot film /></Series.Sequence>
        <Series.Sequence durationInFrames={d0}><Chapter c={CHAPTERS[0]} dur={d0} /></Series.Sequence>
        <Series.Sequence durationInFrames={b}><Sequence from={-CUT}><Pilot film /></Sequence></Series.Sequence>
        {CHAPTERS.slice(1).map((c, i) => (
          <Series.Sequence key={c.name} durationInFrames={SEGMENTS[3 + i]}><Chapter c={c} dur={SEGMENTS[3 + i]} /></Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={OUTRO}>
          <OffthreadVideo src={staticFile('outro.mp4')} volume={0.55} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

/** Rozdziały do podglądu pojedynczo (Studio / render próbny). */
export const ChapterPreview: React.FC<{i: number}> = ({i}) => <Chapter c={CHAPTERS[i]} dur={len(CHAPTERS[i])} />;
export const chapterLen = (i: number) => len(CHAPTERS[i]);
