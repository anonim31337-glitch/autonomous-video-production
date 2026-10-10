import {loadFont as inter} from '@remotion/google-fonts/Inter';
import {loadFont as mono} from '@remotion/google-fonts/JetBrainsMono';

// Every colour has one meaning in the whole film (visual bible): never decorative.
export const C = {
  bg: '#03060b',
  fog: '#0a1422',
  ink: '#e9f2f9',
  muted: '#7b8da3',
  data: '#5ef2e0', // a real data path / this film's own signal
  human: '#ffb347', // the biological operator
  fail: '#ff4d5e', // a real QA failure
  pass: '#4dff9a', // a gate that passed
};
export const SANS = inter('normal', {weights: ['300', '400', '600', '800'], subsets: ['latin', 'latin-ext']}).fontFamily;
export const MONO = mono('normal', {weights: ['400', '600'], subsets: ['latin', 'latin-ext']}).fontFamily;
