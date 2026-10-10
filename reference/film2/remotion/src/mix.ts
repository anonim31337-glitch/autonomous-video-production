import {interpolate} from 'remotion';

// Bed volume, linear gain, exactly as the transcript (M8): 0→0.42 over 12 frames, 0.42 through the card,
// →0.08 over 20 frames when the voice starts, →0 over the last 30 frames of the segment.
export const bedVolume = (f: number, card: number, len: number) => {
  const up = interpolate(f, [0, 12], [0, 0.42], {extrapolateRight: 'clamp'});
  const duck = card > 0 ? interpolate(f, [card, card + 20], [0.42, 0.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0.08;
  const out = interpolate(f, [len - 30, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return Math.min(up, duck) * out;
};

