import React from 'react';
import {Cues} from '../anchors';
import type {Seg} from '../Film';
import {SceneC0} from '../SceneC0';
import {SceneHandoff} from '../SceneHandoff';
import {SceneM0Full} from './M0';
import {SceneM1} from './M1';
import {SceneM2} from './M2';
import {SceneM3} from './M3';
import {SceneM4} from './M4';
import {SceneM5} from './M5';
import {SceneM6} from './M6';
import {SceneM7} from './M7';
import {SceneM8} from './M8';
import {SceneM9} from './M9';
import {SceneM10} from './M10';
import {SceneM11} from './M11';
import {SceneM12} from './M12';
import {SceneM13} from './M13';
import {SceneM14} from './M14';
import {SceneC9, SceneReturn} from './Return';
import rms0 from '../data/rms_AN00_C0.json';
import tl from '../data/timeline.json';

type P = {cue: Cues; seg: Seg};
const TLD = tl as {total: number; segments: {id: string; start: number; len: number; card: number; speed?: number}[]};
const SPEED = TLD.segments.find((s) => s.id === 'M0')!.speed!;

// One scene per timeline segment. A missing entry throws in Film.tsx.
export const SCENES: Record<string, React.FC<P>> = {
  C0: ({cue}) => <SceneC0 cue={cue} rms={rms0 as number[]} speed={SPEED} />,
  HANDOFF: ({cue}) => <SceneHandoff cue={cue} speed={SPEED} />,
  M0: ({cue}) => <SceneM0Full cue={cue} />,
  M1: ({cue}) => <SceneM1 cue={cue} total={TLD.total} />,
  M2: ({cue}) => <SceneM2 cue={cue} />,
  M3: ({cue}) => <SceneM3 cue={cue} />,
  M4: ({cue}) => <SceneM4 cue={cue} />,
  M5: ({cue}) => <SceneM5 cue={cue} />,
  M6: ({cue}) => <SceneM6 cue={cue} />,
  M7: ({cue}) => <SceneM7 cue={cue} tl={TLD} />,
  M8: ({cue}) => <SceneM8 cue={cue} />,
  M9: ({cue}) => <SceneM9 cue={cue} />,
  M10: ({cue}) => <SceneM10 cue={cue} total={TLD.total} />,
  M11: ({cue}) => <SceneM11 cue={cue} />,
  M12: ({cue}) => <SceneM12 cue={cue} />,
  M13: ({cue}) => <SceneM13 cue={cue} />,
  M14: ({cue}) => <SceneM14 cue={cue} />,
  RETURN: ({cue}) => <SceneReturn cue={cue} />,
  C9: ({cue}) => <SceneC9 cue={cue} />,
};
