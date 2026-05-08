import React, { useEffect, useState } from 'react';

/** Same snap height as intro / timeline so the panel fills the viewport */
const SNAP_H =
  'min-h-[calc(100dvh-3.5rem)] h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)]';

export default function RSVPSuccess({ id, language, isTextAnimating = false, submitterName, inverted = false }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(textTimer);
  }, []);

  const firstName = submitterName ? submitterName.split(' ')[0] : '';
  const langFade = isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in';

  return (
    <div
      id={id}
      className={`rsvp-scroll-section ${SNAP_H} px-6 py-8 text-center flex flex-col items-center justify-center min-h-0`}
    >
      <div
        className={`flex flex-col items-center gap-6 max-w-md mx-auto transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-7xl leading-none select-none" aria-hidden>
          ❤️
        </div>

        <h2
          key={`success-title-${language}`}
          className={`font-title-cursive text-4xl md:text-5xl ${
            inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
          } ${langFade}`}
        >
          {language === 'en' ? 'Thank you and see you there!' : 'Благодарим и до скоро!'}
        </h2>


        <p
          key={`success-body-${language}`}
          className={`text-base md:text-lg leading-relaxed ${
            inverted ? 'text-[#f5f0e8]/75' : 'text-brand-forest/70'
          } ${langFade}`}
        >
          {language === 'en'
            ? "We can't wait to celebrate with you. You'll hear from us soon!"
            : 'Нямаме търпение да отпразнуваме заедно!'}
        </p>

        <div className="flex gap-2 mt-1" aria-hidden>
          <span className="text-2xl leading-none">❤️</span>
          <span className="text-2xl leading-none">❤️</span>
          <span className="text-2xl leading-none">❤️</span>
        </div>

        <div
          className={`mt-2 border rounded-2xl px-8 py-5 backdrop-blur-sm space-y-1 ${
            inverted
              ? 'border-[#f5f0e8]/25 bg-[#f5f0e8]/10'
              : 'border-brand-forest/20 bg-white/50'
          }`}
        >
          <p
            className={`font-title-cursive text-3xl ${inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'}`}
          >
            10 July 2026
          </p>
          <p
            className={`text-sm font-semibold tracking-wide ${inverted ? 'text-[#f5f0e8]/65' : 'text-brand-forest/60'}`}
          >
            Pasarel Lake Club
          </p>
        </div>
      </div>
    </div>
  );
}
