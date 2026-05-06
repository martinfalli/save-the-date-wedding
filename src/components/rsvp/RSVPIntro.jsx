import React, { useEffect, useRef, useState } from 'react';
import logoSvg from '../../assets/logo.svg';
import RsvpForestAsset from './RsvpForestAsset';

const SNAP_H = 'min-h-[calc(100dvh-3.5rem)] h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)]';

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
      <div className="flex h-full min-h-0 w-full max-w-3xl mx-auto flex-col gap-1.5 sm:gap-2 md:gap-3">

        {/* Logo — click toggles cream ↔ forest */}
        <div
          className={`flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden py-0.5 ${fadeUp}`}
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

        {/* Headline + body */}
        <div
          className={`shrink-0 space-y-1 sm:space-y-1.5 md:space-y-2 px-1 ${fadeUp}`}
          style={{ transitionDelay: visible ? '80ms' : '0ms' }}
        >
          <h2
            key={`invite-${language}`}
            className={`font-title-cursive text-6xl sm:text-7xl md:text-5xl lg:text-6xl leading-tight ${
            inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
          } ${langFade}`}
          >
            {language === 'en' ? "You're Invited" : 'Покана'}
          </h2>
          <p
            key={`invite-body-${language}`}
            className={`text-sm sm:text-base md:text-xl leading-snug sm:leading-relaxed font-sans ${
            inverted ? 'text-[#f5f0e8]/80' : 'text-brand-forest/80'
          } ${langFade}`}
          >
            {language === 'en'
              ? "We'd love to celebrate with you. Please let us know you'll be there."
              : 'Искаме да отпразнуваме заедно с вас! Кажете ни, дали ще дойдете.'}
          </p>
        </div>

        {/* Scroll hint */}
        <div
          className={`shrink-0 flex flex-col items-center gap-4 pb-0.5 ${fadeUp}`}
          style={{ transitionDelay: visible ? '160ms' : '0ms' }}
        >
          <div className={`flex items-center gap-2 sm:gap-3 ${
            inverted ? 'text-[#f5f0e8]/45' : 'text-brand-forest/40'
          }`}>
            <span className={`block w-6 sm:w-8 h-px ${inverted ? 'bg-[#f5f0e8]/30' : 'bg-brand-forest/30'}`} />
            <span
              key={`scroll-hint-${language}`}
              className={`text-[11px] sm:text-sm font-bold font-sans tracking-widest uppercase ${langFade}`}
            >
              {language === 'en' ? 'The Day' : 'Програма'}
            </span>
            <span className={`block w-6 sm:w-8 h-px ${inverted ? 'bg-[#f5f0e8]/30' : 'bg-brand-forest/30'}`} />
          </div>
          <div className="flex flex-col items-center gap-0.5 animate-bounce pt-0.5">
            <span className={`block w-0.5 h-3 sm:h-4 rounded-full ${inverted ? 'bg-[#f5f0e8]/30' : 'bg-brand-forest/30'}`} />
            <span className={inverted ? 'text-[#f5f0e8]/40 text-xs sm:text-sm' : 'text-brand-forest/40 text-xs sm:text-sm'}>↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
