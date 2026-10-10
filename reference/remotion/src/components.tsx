import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, CHANNEL_COLORS, FONT, FONT_BLACK, fade, nbsp, pop} from './brand';
import {CHANNELS} from './Wall';

/** Żółta etykieta jak na miniaturze: krótka nazwa tego, na co patrzymy. */
export const Pill: React.FC<{text: string; from: number; style?: React.CSSProperties; color?: string}> = ({text, from, style, color = C.yellow}) => {
  const f = useCurrentFrame();
  const p = pop(f, from);
  return (
    <div style={{display: 'inline-block', background: color, color: C.bg, fontFamily: FONT, fontWeight: 800, fontSize: 30,
      letterSpacing: 1, padding: '8px 20px', borderRadius: 12, textTransform: 'uppercase', opacity: Math.min(1, p * 1.5),
      transform: `translateY(${(1 - p) * 18}px)`, ...style}}>{text}</div>
  );
};

/** Duża liczba z podpisem: jedna informacja na raz, czytelna na telefonie. */
export const Big: React.FC<{value: string; label?: string; from: number; color?: string; size?: number; style?: React.CSSProperties}> =
  ({value, label, from, color = C.ink, size = 150, style}) => {
    const f = useCurrentFrame();
    const p = pop(f, from);
    return (
      <div style={{opacity: Math.min(1, p * 1.4), transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: 'left center', ...style}}>
        <div style={{fontFamily: FONT_BLACK, fontWeight: 900, fontSize: size, lineHeight: 0.95, color, letterSpacing: -2}}>{value}</div>
        {label && <div style={{fontFamily: FONT, fontWeight: 600, fontSize: Math.max(30, size * 0.26), color: C.muted, marginTop: 12}}>{nbsp(label)}</div>}
      </div>
    );
  };

/** Kto to powiedział: kanał (kolor kanału ze ściany), tytuł filmu i data. */
export const Source: React.FC<{ch: string; title: string; date: string; from: number; style?: React.CSSProperties}> = ({ch, title, date, from, style}) => {
  const f = useCurrentFrame();
  const o = fade(f, from, 10);
  const col = CHANNEL_COLORS[CHANNELS.findIndex((c) => c.startsWith(ch))] ?? C.muted;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: o, fontFamily: FONT, ...style}}>
      <div style={{width: 14, height: 14, borderRadius: 4, background: col}} />
      <div style={{fontSize: 26, fontWeight: 700, color: C.ink}}>{ch}</div>
      <div style={{fontSize: 24, color: C.muted, maxWidth: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>„{title}” · {date}</div>
    </div>
  );
};

/** Karta cytatu: słowa twórcy z napisów jego filmu, krótko, z podpisem. Zastępuje fragment cudzego wideo. */
export const Quote: React.FC<{ch: string; title: string; date: string; quote: string; from: number; w?: number; highlight?: string}> =
  ({ch, title, date, quote, from, w = 760, highlight}) => {
    const f = useCurrentFrame();
    const p = pop(f, from);
    const col = CHANNEL_COLORS[CHANNELS.findIndex((c) => c.startsWith(ch))] ?? C.muted;
    const parts = highlight ? quote.split(highlight) : [quote];
    return (
      <div style={{width: w, background: C.panel, borderRadius: 18, padding: '30px 36px 26px', borderLeft: `8px solid ${col}`,
        opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)`, fontFamily: FONT, boxShadow: '0 20px 60px rgba(0,0,0,.35)'}}>
        <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>{ch}</div>
        <div style={{fontSize: 21, color: C.muted, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>„{title}” · {date}</div>
        <div style={{fontSize: 40, lineHeight: 1.25, color: C.ink, marginTop: 20, fontWeight: 500}}>
          „{parts[0]}{highlight && parts.length > 1 && <span style={{color: C.bg, background: C.yellow, padding: '0 8px', borderRadius: 6}}>{highlight}</span>}{parts[1] ?? ''}”
        </div>
        <div style={{fontSize: 18, color: C.muted, marginTop: 16, letterSpacing: 1, textTransform: 'uppercase'}}>cytat z napisów automatycznych</div>
      </div>
    );
  };

/** Poziomy pasek porównania z wartością. Długość = prawdziwa proporcja. */
export const Bar: React.FC<{label: string; value: number; max: number; text: string; from: number; color: string; w?: number}> =
  ({label, value, max, text, from, color, w = 900}) => {
    const f = useCurrentFrame();
    const p = interpolate(f, [from, from + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const ease = 1 - Math.pow(1 - p, 3);
    return (
      <div style={{fontFamily: FONT, opacity: fade(f, from, 6)}}>
        <div style={{fontSize: 28, color: C.muted, fontWeight: 600, marginBottom: 8}}>{label}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{width: (w * value / max) * ease, height: 56, background: color, borderRadius: 10}} />
          <div style={{fontFamily: FONT_BLACK, fontSize: 48, color: C.ink, opacity: fade(f, from + 12, 8)}}>{text}</div>
        </div>
      </div>
    );
  };

export const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%, #121a2a 0%, ${C.bg} 70%)`}}>{children}</div>
);
