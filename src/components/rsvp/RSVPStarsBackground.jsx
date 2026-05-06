import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';

/** Shown on all breakpoints */
const MOBILE_STAR_CAP = 18;
/** Extra sparkles from md breakpoint upward */
const DESKTOP_STAR_TOTAL = 32;
const DESKTOP_SIZE_MUL = 1.22;
const GRID_COLS = 10;
const GRID_ROWS = 8;
/** Logo exclusion in % — cells that overlap this rect are unused */
const LOGO = { l: 23, r: 77, t: 20, b: 74 };

/** Heroicons-style 4-point sparkle (filled) — viewBox 0 0 24 24 */
const SPARKLE_MAIN =
  'M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5z';

function cellIntersectsLogo(lm, lM, tm, tM) {
  const clear = lM < LOGO.l || lm > LOGO.r || tM < LOGO.t || tm > LOGO.b;
  return !clear;
}

function pointInLogoZone(left, top) {
  return left >= LOGO.l && left <= LOGO.r && top >= LOGO.t && top <= LOGO.b;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One sparkle per shuffled grid cell (logo cells removed), jitter inside cell for organic look */
function buildStars(count) {
  const cells = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const lm = (col / GRID_COLS) * 100;
      const lM = ((col + 1) / GRID_COLS) * 100;
      const tm = (row / GRID_ROWS) * 100;
      const tM = ((row + 1) / GRID_ROWS) * 100;
      if (cellIntersectsLogo(lm, lM, tm, tM)) continue;
      cells.push({ lm, lM, tm, tM });
    }
  }

  const picked = shuffle(cells).slice(0, count);
  const out = [];

  const pad = 0.22;
  for (const cell of picked) {
    const w = cell.lM - cell.lm;
    const h = cell.tM - cell.tm;
    const left = cell.lm + w * (pad + Math.random() * (1 - 2 * pad));
    const top = cell.tm + h * (pad + Math.random() * (1 - 2 * pad));
    out.push({
      left: Math.min(96, Math.max(4, left)),
      top: Math.min(94, Math.max(4, top)),
      size: 9 + Math.random() * 15,
      opacity: 0.18 + Math.random() * 0.28,
      delay: Math.random() * 7,
      dur: 6.5 + Math.random() * 7,
      variant: Math.random() > 0.5 ? 'a' : 'b',
      rotation: Math.random() * 360,
      glow: Math.random() > 0.78,
    });
  }

  let guard = 0;
  while (out.length < count && guard++ < 200) {
    const left = Math.random() * 86 + 7;
    const top = Math.random() * 78 + 8;
    if (pointInLogoZone(left, top)) continue;
    out.push({
      left,
      top,
      size: 9 + Math.random() * 15,
      opacity: 0.18 + Math.random() * 0.28,
      delay: Math.random() * 7,
      dur: 6.5 + Math.random() * 7,
      variant: Math.random() > 0.5 ? 'a' : 'b',
      rotation: Math.random() * 360,
      glow: Math.random() > 0.78,
    });
  }

  return out;
}

/**
 * Cream sparkles on forest RSVP mode only — float + scroll parallax.
 */
export default function RSVPStarsBackground({ scrollContainerRef, inverted = false }) {
  const stars = useMemo(() => buildStars(DESKTOP_STAR_TOTAL), []);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mdUp, setMdUp] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setMdUp(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = el.scrollTop;
        if (reduceMotion) {
          setParallax({ x: 0, y: 0 });
          return;
        }
        /* Vertical drift with scroll */
        setParallax({ x: 0, y: t * 0.11 });
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
    };
  }, [scrollContainerRef, reduceMotion]);

  if (!inverted) return null;

  const sizeMul = mdUp ? DESKTOP_SIZE_MUL : 1;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        transform:
          reduceMotion ? 'none' : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        willChange: reduceMotion ? 'auto' : 'transform',
      }}
      aria-hidden
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className={`absolute flex items-center justify-center ${i >= MOBILE_STAR_CAP ? 'max-md:hidden' : ''}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, transform: 'translate(-50%, -50%)' }}
        >
          <span
            className={`block text-[#f5f0e8] ${
              reduceMotion ? '' : s.variant === 'a' ? 'rsvp-star-float-a' : 'rsvp-star-float-b'
            }`}
            style={{
              width: s.size * sizeMul,
              height: s.size * sizeMul,
              opacity: s.opacity,
              animationDelay: reduceMotion ? undefined : `${s.delay}s`,
              animationDuration: reduceMotion ? undefined : `${s.dur}s`,
              filter: s.glow ? 'drop-shadow(0 0 5px rgba(245,240,232,0.22))' : undefined,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-full w-full"
              fill="currentColor"
              aria-hidden
              style={{ transform: `rotate(${s.rotation}deg)` }}
            >
              <path fillRule="evenodd" clipRule="evenodd" d={SPARKLE_MAIN} />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
