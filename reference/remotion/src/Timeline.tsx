import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, FONT_BLACK, fade} from './brand';

/**
 * Czerwiec–lipiec 2026 dzień po dniu: kiedy Claude Fable 5 dało się używać.
 * Premiera 9 VI (Uselis) albo 12 VI (Barczak) — pokazana jako przedział ze znakiem zapytania, bo twórcy
 * się różnią. Wyłączenie „kilka dni po premierze”, powrót 1 VII, „prawie 18 dni” (Barczak) — stąd 13 VI.
 */
const X0 = 160;
const W = 1600;
const DAYS = 61; // 1 VI .. 31 VII
const dx = (day: number) => X0 + (day / DAYS) * W; // day = 0 dla 1 czerwca

export const FableTimeline: React.FC<{from: number; offFrom: number; emphasize?: number; top?: number}> = ({from, offFrom, emphasize, top = 560}) => {
  const f = useCurrentFrame();
  const o = fade(f, from, 12);
  const grow = interpolate(f, [from, from + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const off = interpolate(f, [offFrom, offFrom + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const emph = emphasize === undefined ? 0 : interpolate(f, [emphasize, emphasize + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = 120;
  return (
    <svg width={1920} height={360} style={{position: 'absolute', left: 0, top, opacity: o, fontFamily: FONT}}>
      {/* oś dni */}
      <line x1={X0} y1={y} x2={X0 + W * grow} y2={y} stroke={C.line} strokeWidth={4} />
      {Array.from({length: DAYS + 1}, (_, d) => d).filter((d) => d % 5 === 0 || d === 30).map((d) => (
        <line key={d} x1={dx(d)} y1={y - 8} x2={dx(d)} y2={y + 8} stroke={C.line} strokeWidth={2} opacity={grow > d / DAYS ? 1 : 0} />
      ))}
      <text x={dx(0)} y={y + 52} fill={C.muted} fontSize={26} fontWeight={600}>czerwiec</text>
      <text x={dx(30)} y={y + 52} fill={C.muted} fontSize={26} fontWeight={600}>lipiec</text>

      {/* dostępny: od premiery do wyłączenia i od 1 VII */}
      <rect x={dx(8)} y={y - 22} width={(dx(12) - dx(8)) * grow} height={44} rx={8} fill={C.green} opacity={0.9} />
      <rect x={dx(30)} y={y - 22} width={(dx(DAYS) - dx(30)) * grow} height={44} rx={8} fill={C.green} opacity={0.9} />
      {/* niedostępny */}
      <rect x={dx(12)} y={y - 22} width={(dx(30) - dx(12)) * off} height={44} rx={8} fill={C.red} opacity={0.35 + 0.55 * off} />
      <g opacity={off}>
        <text x={(dx(12) + dx(30)) / 2} y={y + 10} textAnchor="middle" fill={C.ink} fontSize={30} fontFamily={FONT_BLACK}>
          ≈ 18 dni bez modelu
        </text>
      </g>
      {/* premiera: 9 albo 12 czerwca */}
      <g opacity={fade(f, from + 10, 10)}>
        <line x1={dx(8)} y1={y - 40} x2={dx(8)} y2={y - 64} stroke={C.yellow} strokeWidth={3} />
        <line x1={dx(11)} y1={y - 40} x2={dx(11)} y2={y - 64} stroke={C.yellow} strokeWidth={3} />
        <line x1={dx(8)} y1={y - 64} x2={dx(11)} y2={y - 64} stroke={C.yellow} strokeWidth={3} />
        <text x={(dx(8) + dx(11)) / 2} y={y - 78} textAnchor="middle" fill={C.yellow} fontSize={26} fontWeight={700}>premiera: 9 czy 12 VI?</text>
      </g>
      <g opacity={off}>
        <line x1={dx(30)} y1={y - 40} x2={dx(30)} y2={y - 64} stroke={C.green} strokeWidth={3} />
        <text x={dx(30)} y={y - 78} textAnchor="middle" fill={C.green} fontSize={26} fontWeight={700}>powrót 1 VII</text>
      </g>
      {emph > 0 && <rect x={dx(12) - 10} y={y - 34} width={dx(30) - dx(12) + 20} height={68} rx={12} fill="none" stroke={C.yellow} strokeWidth={4} opacity={emph} />}
    </svg>
  );
};
