import React from 'react';
import {Composition} from 'remotion';
import {Film, TL} from './Film';

export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={TL.total} fps={30} width={1920} height={1080} />
);
