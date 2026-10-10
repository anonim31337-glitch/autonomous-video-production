/**
 * Ujęcia wielokrotnego użytku dla rozdziałów 1–7. Każde ujęcie odpowiada na jedno pytanie widza i pokazuje coś,
 * czego lektor nie mówi dosłownie: proporcję, różnicę, kolejność, źródło. Rozdział to lista ujęć przypiętych do fraz.
 */
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, CHANNEL_COLORS, FONT, FONT_BLACK, fade, fadeOut, nbsp, pop} from './brand';
import {CHANNELS, WALL_H, WALL_W, Wall, count} from './Wall';

export type Beat = {from: number; el: React.ReactNode};

/** Początek bieżącego ujęcia: szkielet (karty, etykiety, kroki) widać od razu, wartości wchodzą przy swojej frazie. */
const BeatStart = createContext(0);
const early = (from: number, bs: number) => Math.min(from, bs + 6);

/** Ujęcie trwa od swojej frazy do frazy następnego ujęcia; przenikanie 10 klatek. */
export const Beats: React.FC<{beats: Beat[]; end: number}> = ({beats, end}) => {
  const f = useCurrentFrame();
  const sorted = [...beats].sort((a, b) => a.from - b.from);
  return (
    <>
      {sorted.map((b, i) => {
        const to = i + 1 < sorted.length ? sorted[i + 1].from : end;
        if ((i > 0 && f < b.from - 2) || f > to + 12) return null;
        const o = Math.min(i === 0 ? 1 : fade(f, b.from, 10), fadeOut(f, to, 10)); // pierwsze ujęcie widać od pierwszej klatki
        return <AbsoluteFill key={i} style={{opacity: o}}><BeatStart.Provider value={i === 0 ? 0 : b.from}>{b.el}</BeatStart.Provider></AbsoluteFill>;
      })}
    </>
  );
};

export const chColor = (ch: string) => CHANNEL_COLORS[CHANNELS.findIndex((c) => c.startsWith(ch))] ?? C.muted;

export const ChapterCard: React.FC<{num: number; title: string; sub: string; from: number}> = ({num, title, sub, from}) => {
  const f = useCurrentFrame();
  const p = pop(f, from);
  return (
    <AbsoluteFill style={{background: C.bg, justifyContent: 'center', paddingLeft: 170}}>
      <div style={{fontFamily: FONT_BLACK, fontSize: 220, color: C.orange, lineHeight: 0.9, transform: `translateY(${(1 - p) * 40}px)`}}>
        {String(num).padStart(2, '0')}
      </div>
      <div style={{fontFamily: FONT_BLACK, fontSize: 96, color: C.ink, marginTop: 10, opacity: fade(f, from + 4, 10)}}>{title}</div>
      <div style={{fontFamily: FONT, fontSize: 36, color: C.muted, marginTop: 14, opacity: fade(f, from + 10, 10)}}>{sub}</div>
    </AbsoluteFill>
  );
};

/** Nagłówek ujęcia: żółta etykieta + tytuł. */
export const Head: React.FC<{tag?: string; title: string; from: number}> = ({tag, title, from: at0}) => {
  const f = useCurrentFrame();
  const from = early(at0, useContext(BeatStart));
  const p = pop(f, from);
  return (
    <div style={{position: 'absolute', left: 150, top: 90, opacity: Math.min(1, p * 1.4)}}>
      {tag && <div style={{display: 'inline-block', background: C.yellow, color: C.bg, fontFamily: FONT, fontWeight: 800, fontSize: 28,
        letterSpacing: 1, padding: '6px 18px', borderRadius: 10, textTransform: 'uppercase', marginBottom: 18}}>{tag}</div>}
      <div style={{fontFamily: FONT_BLACK, fontSize: title.length > 40 ? 56 : title.length > 32 ? 66 : 78, color: C.ink, lineHeight: 1.05, maxWidth: 1640, whiteSpace: 'nowrap'}}>{nbsp(title)}</div>
    </div>
  );
};

export type Row = {label: string; value: number; text: string; color?: string; at?: number; note?: string};

/** Poziome słupki z prawdziwymi wartościami; słupki wchodzą razem z frazą, która je wymienia (`at`). */
export const Bars: React.FC<{rows: Row[]; max: number; from: number; top?: number; w?: number; source?: string; lowerBetter?: string}> =
  ({rows, max, from, top = 300, w = 880, source, lowerBetter}) => {
    const f = useCurrentFrame();
    const bs = useContext(BeatStart);
    return (
      <div style={{position: 'absolute', left: 150, top, fontFamily: FONT}}>
        {rows.map((r, i) => {
          const s = r.at ?? from + i * 8;
          const p = interpolate(f, [s, s + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const e = 1 - Math.pow(1 - p, 3);
          return (
            <div key={r.label} style={{display: 'flex', alignItems: 'center', height: rows.length > 5 ? 96 : 120, opacity: fade(f, early(s, bs), 8) * (f >= s ? 1 : 0.4)}}>
              <div style={{width: 470, fontSize: rows.length > 5 ? 34 : 44, fontWeight: 700, color: C.ink, textAlign: 'right', paddingRight: 30, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{r.label}</div>
              <div style={{width: Math.max(6, (w * r.value) / max) * e, height: rows.length > 5 ? 62 : 80, background: r.color ?? C.orange, borderRadius: 12}} />
              <div style={{fontFamily: FONT_BLACK, fontSize: rows.length > 5 ? 48 : 60, color: C.ink, marginLeft: 24, whiteSpace: 'nowrap', opacity: fade(f, s + 10, 8)}}>{r.text}</div>
              {r.note && <div style={{fontSize: 28, color: C.muted, marginLeft: 18, whiteSpace: 'nowrap', opacity: fade(f, s + 14, 8)}}>{r.note}</div>}
            </div>
          );
        })}
        {(source || lowerBetter) && (
          <div style={{fontSize: 26, color: C.muted, marginTop: 30, marginLeft: 470, opacity: fade(f, from + 20, 10)}}>
            {lowerBetter && <span style={{color: C.yellow, fontWeight: 700}}>{lowerBetter} · </span>}{source}
          </div>
        )}
      </div>
    );
  };

/** Dwie kolumny: ta sama miara dla dwóch rzeczy. */
export const Versus: React.FC<{items: {name: string; lines: {k: string; v: string; at: number; good?: boolean}[]}[]; from: number; top?: number; h?: number}> =
  ({items, from, top = 300, h = 560}) => {
    const f = useCurrentFrame();
    const bs = useContext(BeatStart);
    return (
      <div style={{position: 'absolute', left: 150, right: 150, top, display: 'flex', gap: 60, fontFamily: FONT}}>
        {items.map((it, i) => (
          <div key={it.name} style={{flex: 1, minHeight: h, background: C.panel, borderRadius: 24, padding: '40px 46px', opacity: fade(f, early(from, bs) + i * 6, 10)}}>
            <div style={{fontFamily: FONT_BLACK, fontSize: items.length > 3 ? 52 : 64, color: C.ink}}>{it.name}</div>
            {it.lines.map((l) => (
              <div key={l.k + l.v} style={{marginTop: 38, opacity: fade(f, l.at, 8)}}>
                <div style={{fontSize: 32, color: C.muted, fontWeight: 600}}>{l.k}</div>
                <div style={{fontFamily: FONT_BLACK, fontSize: items.length > 3 ? 50 : 80, lineHeight: 1.05, color: l.good === undefined ? C.ink : l.good ? C.green : C.red}}>{l.v}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

/** Schemat: kroki pojawiają się dokładnie wtedy, kiedy lektor je wymienia; strzałka pokazuje kierunek. */
export const Flow: React.FC<{steps: {text: string; at: number; color?: string}[]; top?: number; note?: {text: string; at: number}}> =
  ({steps, top = 420, note}) => {
    const f = useCurrentFrame();
    const bs = useContext(BeatStart);
    const w = (1920 - 300 - (steps.length - 1) * 70) / steps.length;
    return (
      <div style={{position: 'absolute', left: 150, top, width: 1620, fontFamily: FONT}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          {steps.map((s, i) => {
            const p = pop(f, s.at);
            return (
              <React.Fragment key={s.text}>
                {i > 0 && <div style={{width: 70, textAlign: 'center', fontSize: 54, color: C.muted, opacity: fade(f, s.at - 4, 8)}}>→</div>}
                <div style={{width: w, minHeight: 300, background: C.panel, borderRadius: 22, borderTop: `8px solid ${s.color ?? C.orange}`,
                  padding: '30px 28px', fontSize: steps.length > 4 ? 40 : 46, fontWeight: 800, color: C.ink, lineHeight: 1.2, display: 'flex', alignItems: 'center',
                  opacity: f >= s.at ? Math.min(1, 0.3 + p * 1.4) : 0.3 * fade(f, early(s.at, bs) + i * 4, 8), transform: `translateY(${(1 - p) * 26}px)`}}>{nbsp(s.text)}</div>
              </React.Fragment>
            );
          })}
        </div>
        {note && <div style={{marginTop: 60, fontSize: 46, color: C.yellow, fontWeight: 700, opacity: fade(f, note.at, 10)}}>{nbsp(note.text)}</div>}
      </div>
    );
  };

/** Lista punktów (wnioski, kroki porady): bieżący punkt jasny, poprzednie przygaszone — widz wie, gdzie jest. */
export const Points: React.FC<{items: {text: string; sub?: string; at: number}[]; top?: number; numbered?: boolean}> = ({items, top = 290, numbered = true}) => {
  const f = useCurrentFrame();
  const bs = useContext(BeatStart);
  const cur = items.reduce((k, it, i) => (f >= it.at ? i : k), -1);
  return (
    <div style={{position: 'absolute', left: 150, top, width: 1620, fontFamily: FONT}}>
      {items.map((it, i) => (
        <div key={it.text} style={{display: 'flex', gap: 34, marginBottom: items.length > 3 ? 34 : 54, opacity: fade(f, early(it.at, bs) + i * 4, 10) * (f < it.at ? 0.22 : i === cur ? 1 : 0.45)}}>
          {numbered && <div style={{fontFamily: FONT_BLACK, fontSize: 80, color: C.orange, width: 80, lineHeight: 1}}>{i + 1}</div>}
          <div>
            <div style={{fontSize: items.length > 3 ? 54 : 64, fontWeight: 800, color: C.ink, lineHeight: 1.1}}>{nbsp(it.text)}</div>
            {it.sub && <div style={{fontSize: items.length > 3 ? 32 : 38, color: C.muted, marginTop: 10}}>{nbsp(it.sub)}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Jedno źródło pod ujęciem: kanał + co zrobił. Używać zawsze, gdy liczba ma autora. */
export const By: React.FC<{ch: string; text: string; at: number; top?: number}> = ({ch, text, at, top = 960}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 150, top, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, opacity: fade(f, at, 10)}}>
      <div style={{width: 16, height: 16, borderRadius: 4, background: chColor(ch)}} />
      <div style={{fontSize: 32, fontWeight: 700, color: C.ink}}>{ch}</div>
      <div style={{fontSize: 32, color: C.muted}}>{text}</div>
    </div>
  );
};

/** Ściana 239 filmów z zapalonym tematem: ile filmów o tym mówiło i kiedy (kolejność = data publikacji). */
export const WallTopic: React.FC<{topic: string; at: number; title: string; top?: number}> = ({topic, at, title, top = 330}) => {
  const f = useCurrentFrame();
  const n = count(topic);
  const scale = 0.82;
  return (
    <>
      <div style={{position: 'absolute', left: (1920 - WALL_W * scale) / 2, top, width: WALL_W, height: WALL_H, transform: `scale(${scale})`, transformOrigin: '0 0'}}>
        <Wall lit={topic} litFrom={at} />
      </div>
      <div style={{position: 'absolute', left: (1920 - WALL_W * scale) / 2, top: top + WALL_H * scale + 26, fontFamily: FONT, fontSize: 38,
        fontWeight: 800, color: C.orange, opacity: fade(f, at + 10, 10)}}>{n} z 239 filmów — {title}</div>
    </>
  );
};