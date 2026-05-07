import React, { useEffect, useRef, useState } from 'react';
import timelineSvg from '../../assets/timeline.svg';
import RsvpForestAsset from './RsvpForestAsset';

const SNAP_H =
  'min-h-[calc(100dvh-3.5rem)] h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)]';

export default function RSVPTimeline({ language, isTextAnimating = false, inverted = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const langFade = isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in';

  return (
    <div
      ref={ref}
      className={`rsvp-scroll-section ${SNAP_H} w-full px-3 py-2 sm:px-4 sm:py-3 !items-stretch !justify-start overflow-hidden`}
    >
      <div
        className={`flex flex-col h-full min-h-0 w-full justify-between gap-2 transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2
          key={`timeline-title-${language}`}
          className={`shrink-0 font-title-cursive text-6xl sm:text-7xl md:text-5xl lg:text-6xl text-center leading-tight ${
          inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
        } ${langFade}`}
        >
          {language === 'en' ? 'The Day' : 'Програма'}
        </h2>

        <div className="flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden py-1">
          <div className="flex h-full w-full max-w-full items-center justify-center overflow-hidden">
            <RsvpForestAsset
              src={timelineSvg}
              inverted={inverted}
              invertedMode="filter"
              className="h-auto w-auto max-h-[min(76vh,920px)] max-w-[min(98vw,42rem)] object-contain object-center timeline-svg-scaled md:max-h-[min(86vh,1100px)] md:max-w-[min(92vw,88rem)]"
            />
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-4 pb-1 pt-0">
          <div className={`flex items-center gap-3 ${inverted ? 'text-[#f5f0e8]/80' : 'text-brand-forest/75'}`}>
            <span className={`block w-8 h-px ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
            <span
              key={`timeline-next-${language}`}
              className={`text-[11px] sm:text-sm font-bold font-sans tracking-widest uppercase ${langFade}`}
            >
              {language === 'en' ? 'Questions' : 'Въпроси'}
            </span>
            <span className={`block w-8 h-px ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
          </div>

          <div className="flex flex-col items-center gap-0.5 animate-bounce pt-0.5">
            <span className={`block w-0.5 h-5 rounded-full ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
            <span className={inverted ? 'text-[#f5f0e8]/75' : 'text-brand-forest/70'}>↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
