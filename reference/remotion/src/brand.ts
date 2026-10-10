/**
 * Język obrazu wersji 2 bierze się z miniatury, którą widz już kliknął: granat, biała gruba
 * typografia, pomarańczowy akcent, żółta etykieta i ściana kafelków, gdzie jeden kafelek to jeden
 * prawdziwy film z korpusu. Nic tu nie jest ozdobą: kolor pomarańczowy znaczy „o tym mówi lektor”,
 * żółty znaczy „etykieta/źródło”, szary znaczy „tło danych”.
 */
import {interpolate, spring} from 'remotion';
import cuesData from './data/p1_cues.json';

export const C = {
  bg: '#0B0F17',
  panel: '#141A26',
  panel2: '#1C2433',
  line: '#2A3446',
  ink: '#F4F1EA',
  muted: '#8A93A6',
  orange: '#FF7A3D',
  yellow: '#FFD21F',
  green: '#3DDC97',
  red: '#FF5A5F',
} as const;

/** 11 kanałów, przygaszone barwy na granacie — rozróżnialne, ale nie krzyczą (kolejność = films.json). */
export const CHANNEL_COLORS = ['#4C8DFF', '#FF7A3D', '#2BB673', '#F2C230', '#E86AA6', '#8E7CFF',
  '#2EC4C4', '#E5533D', '#9BC53D', '#C08457', '#7A8BA6'];

export const FONT = "'Segoe UI', system-ui, sans-serif";
export const FONT_BLACK = "'Segoe UI Black', 'Segoe UI', system-ui, sans-serif";
export const FPS = 30;

/** Pre-roll przed narracją (wersja 1 → przewinięcie → tytuł), w sekundach. */
export const PRE = 3.4;

const lines = (cuesData as {duration: number; lines: {t: number; text: string}[]}).lines;
export const NARRATION_DURATION = (cuesData as {duration: number}).duration;

/**
 * Klatka filmu, w której lektor zaczyna wers zaczynający się od `prefix` (czasy z logu odtwarzacza
 * Scrimby). Rzuca błąd, gdy wersu nie ma — lepiej, żeby render padł, niż żeby grafika rozjechała się
 * z głosem po zmianie tekstu.
 */
export function at(prefix: string, offset = 0): number {
  const l = lines.find((x) => x.text.startsWith(prefix));
  if (!l) throw new Error(`no narration line starting with "${prefix}"`);
  return Math.round((l.t + PRE + offset) * FPS);
}

export const fade = (f: number, from: number, len = 12) =>
  interpolate(f, [from, from + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const fadeOut = (f: number, from: number, len = 10) =>
  interpolate(f, [from, from + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const pop = (f: number, from: number, fps = FPS) =>
  spring({frame: f - from, fps, config: {damping: 16, stiffness: 170, mass: 0.7}});

/** Jednoliterowy spójnik nigdy nie kończy wiersza. */
export const nbsp = (t: string) => t.replace(/(^|[\s(„])([aiouwzAIOUWZ]|na|po|od|do|za|ze|we)\s+/g, '$1$2 ');

export const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL').replace(/,/g, ' ');
