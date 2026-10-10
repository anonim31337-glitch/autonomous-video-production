import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

// Light and air only: a haze where the horizon sits, film grain, vignette. Carries no data and draws no shapes.
export const Haze: React.FC<{y?: string; tint?: string}> = ({y = '60%', tint = '#0e2f38'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 38% at 50% ${y}, ${tint} 0%, #06101a 48%, #020407 100%)`}} />
);

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'screen'}}>
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 24} /></filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, #000000cc 100%)'}} />
    </AbsoluteFill>
  );
};
