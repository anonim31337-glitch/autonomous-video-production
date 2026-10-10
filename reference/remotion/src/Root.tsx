import React from 'react';
import {Composition} from 'remotion';
import {Pilot, PILOT_FRAMES} from './Pilot';
import {Film, FILM_FRAMES, ChapterPreview, chapterLen} from './Film';
import {FPS} from './brand';

export const Root: React.FC = () => (
  <>
    <Composition id="Pilot" component={Pilot} durationInFrames={PILOT_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Film" component={Film} durationInFrames={FILM_FRAMES} fps={FPS} width={1920} height={1080} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <Composition key={i} id={`Ch${i}`} component={ChapterPreview} defaultProps={{i}} durationInFrames={chapterLen(i)} fps={FPS} width={1920} height={1080} />
    ))}
  </>
);
