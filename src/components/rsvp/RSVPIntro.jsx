import React, { useEffect, useRef, useState } from 'react';
import logoSvg from '../../assets/logo.svg';
import RsvpForestAsset from './RsvpForestAsset';

const SNAP_H = 'min-h-[calc(100dvh-var(--nav-h))] h-[calc(100dvh-var(--nav-h))] max-h-[calc(100dvh-var(--nav-h))]';

export default function RSVPIntro({ language, isTextAnimating = false, inverted = false, onToggleInverted = () => {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const fadeUp = `transition-all duration-700 ease-out ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`;

  const langFade = isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in';

  return (
    <div
      ref={ref}
      className={`rsvp-scroll-section ${SNAP_H} px-3 py-2 sm:px-4 sm:py-3 md:py-4 text-center w-full flex flex-col min-h-0 !items-stretch !justify-start overflow-hidden`}
    >
      <div className="flex h-full min-h-0 w-full max-w-3xl mx-auto flex-col gap-2 sm:gap-3">

        {/* Logo — click toggles cream ↔ forest */}
        <div
          className={`shrink-0 flex w-full items-center justify-center overflow-hidden max-h-[52dvh] sm:max-h-[55dvh] ${fadeUp}`}
        >
          <button
            type="button"
            onClick={onToggleInverted}
            aria-pressed={inverted}
            aria-label={
              language === 'en'
                ? (inverted ? 'Reset to light background' : 'Switch to dark background')
                : (inverted ? 'Светъл фон' : 'Тъмен фон')
            }
            className={`flex min-h-0 flex-1 w-full max-w-full items-center justify-center overflow-hidden rounded-2xl border-0 bg-transparent p-0 cursor-pointer origin-center scale-[1.3] md:scale-[1.2] transition-transform duration-200 ease-out hover:scale-[1.365] md:hover:scale-[1.26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
              inverted ? 'focus-visible:outline-[#f5f0e8]/40' : 'focus-visible:outline-brand-forest/50'
            }`}
          >
            <RsvpForestAsset
              src={logoSvg}
              inverted={inverted}
              className="max-h-full max-w-full w-full object-contain object-center h-auto"
            />
          </button>
        </div>

        {/* Headline: wedding identity */}
        <div
          className={`shrink-0 flex flex-col items-center gap-0.5 px-1 -mt-1 ${fadeUp}`}
          style={{ transitionDelay: visible ? '80ms' : '0ms' }}
        >
          <p
            key={`wedding-of-${language}`}
            className={`font-sans font-bold text-sm sm:text-base tracking-[0.22em] ${
              inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
            } ${langFade}`}
          >
            {language === 'en' ? 'the wedding of' : 'сватбата на'}
          </p>
          <p
            key={`wedding-names-${language}`}
            className={`font-sans font-bold text-lg sm:text-xl md:text-2xl tracking-widest uppercase leading-tight ${
              inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
            } ${langFade}`}
          >
            {language === 'en' ? 'Simona & Martin' : 'Симона & Мартин'}
          </p>
          <p
            key={`wedding-date-${language}`}
            className={`font-title-cursive text-6xl sm:text-7xl leading-tight pt-6 pb-1 ${
              inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
            } ${langFade}`}
          >
            {language === 'en' ? '10 July 2026' : '10 Юли 2026'}
          </p>
        </div>

        {/* Spacer — keeps scroll hint pinned to bottom */}
        <div className="flex-1 min-h-0" />

        {/* Scroll hint */}
        <button
          type="button"
          onClick={() => document.getElementById('rsvp-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className={`shrink-0 flex flex-col items-center gap-4 pb-0.5 focus:outline-none ${fadeUp}`}
          style={{ transitionDelay: visible ? '160ms' : '0ms' }}
          aria-label={language === 'en' ? 'Go to The Day' : 'Към Програма'}
        >
          <div className={`flex items-center gap-2 sm:gap-3 ${
            inverted ? 'text-[#f5f0e8]/80' : 'text-brand-forest/75'
          }`}>
            <span className={`block w-6 sm:w-8 h-px ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
            <span
              key={`scroll-hint-${language}`}
              className={`text-[11px] sm:text-sm font-bold font-sans tracking-widest uppercase ${langFade}`}
            >
              {language === 'en' ? 'The Day' : 'Програма'}
            </span>
            <span className={`block w-6 sm:w-8 h-px ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
          </div>
          <div className="flex flex-col items-center gap-0.5 animate-bounce pt-0.5">
            <span className={`block w-0.5 h-3 sm:h-4 rounded-full ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
            <span className={inverted ? 'text-[#f5f0e8]/75 text-xs sm:text-sm' : 'text-brand-forest/70 text-xs sm:text-sm'}>↓</span>
          </div>
        </button>
      </div>
    </div>
  );
}
