import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, CHANNEL_COLORS} from './brand';
import data from './data/films.json';

type Film = {id: string; ch: number; title: string; date: string; dur: number; views: number; t: string[]};
export const FILMS = (data as {films: Film[]}).films;
export const CHANNELS = (data as {channels: string[]}).channels;
export const count = (topic: string) => FILMS.filter((f) => f.t.includes(topic)).length;

const COLS = 20;
const TW = 72;
const TH = 40;
const GAP = 8;
export const WALL_W = COLS * (TW + GAP) - GAP;
export const WALL_H = Math.ceil(FILMS.length / COLS) * (TH + GAP) - GAP;

/**
 * Ściana 239 filmów w kolejności publikacji (wiersz po wierszu = czas płynie od czerwca do października).
 * `lit` zapala filmy, które mówiły o danej historii — to prawdziwy wynik przeszukania napisów, nie dekoracja.
 */
export const Wall: React.FC<{
  buildFrom?: number; // klatka, od której kafelki wskakują po kolei (domyślnie: ściana już stoi)
  buildTo?: number;
  lit?: string | null;
  litFrom?: number;
  dim?: number; // jasność kafelków niezapalonych, gdy coś jest zapalone
  chFrom?: number; // legenda: kanał po kanale zapala swoje filmy jego kolorem
}> = ({buildFrom, buildTo, lit = null, litFrom = 0, dim = 0.22, chFrom}) => {
  const f = useCurrentFrame();
  const litP = lit ? interpolate(f, [litFrom, litFrom + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  return (
    <svg width={WALL_W} height={WALL_H} viewBox={`0 0 ${WALL_W} ${WALL_H}`} style={{overflow: 'visible'}}>
      {FILMS.map((film, i) => {
        const x = (i % COLS) * (TW + GAP);
        const y = Math.floor(i / COLS) * (TH + GAP);
        const appear = buildFrom === undefined ? 1
          : interpolate(f, [buildFrom + (i / FILMS.length) * ((buildTo ?? buildFrom + 60) - buildFrom), buildFrom + (i / FILMS.length) * ((buildTo ?? buildFrom + 60) - buildFrom) + 6], [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (appear <= 0) return null;
        const isLit = lit !== null && film.t.includes(lit);
        // zapalone kafelki zapalają się w kolejności publikacji: widać, kiedy temat żył
        const myP = isLit ? interpolate(f, [litFrom + (i / FILMS.length) * 18, litFrom + (i / FILMS.length) * 18 + 8], [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
        const base = CHANNEL_COLORS[film.ch];
        const chOn = chFrom === undefined ? 0.55 : interpolate(f, [chFrom + film.ch * 6, chFrom + film.ch * 6 + 6], [0.12, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const opacity = appear * (isLit ? 1 : interpolate(litP, [0, 1], [chOn, dim]));
        return (
          <g key={film.id} opacity={opacity} transform={`translate(${x + TW / 2} ${y + TH / 2}) scale(${0.6 + 0.4 * appear}) translate(${-TW / 2} ${-TH / 2})`}>
            <rect width={TW} height={TH} rx={6} fill={isLit ? C.orange : base} fillOpacity={isLit ? 0.35 + 0.65 * myP : chFrom === undefined ? 0.55 : 0.9} />
            {isLit && myP > 0 && <rect x={-3} y={-3} width={TW + 6} height={TH + 6} rx={8} fill="none" stroke={C.orange} strokeOpacity={0.5 * myP} strokeWidth={2} />}
            <path d={`M ${TW / 2 - 6} ${TH / 2 - 8} L ${TW / 2 + 9} ${TH / 2} L ${TW / 2 - 6} ${TH / 2 + 8} Z`} fill={isLit && myP > 0.5 ? C.bg : C.ink} fillOpacity={isLit ? 0.9 : 0.35} />
          </g>
        );
      })}
    </svg>
  );
};
