import React, { useEffect, useRef, useState } from 'react';

/** Renders a text string, replacing {colors} with swatches and link text with <a> elements. */
function renderLine(str, { links = [], colors = [], linkClass = '' } = {}) {
  // Split on {colors} first, then apply link replacements to each text segment
  const colorSwatches = colors.length
    ? <span key="swatches" className="inline-flex items-center gap-1.5 align-middle mx-1">
        {colors.map(({ hex, label }) => (
          <span
            key={hex}
            title={label}
            style={{ backgroundColor: hex }}
            className="inline-block w-4 h-4 rounded-full border border-black/15 shadow-sm"
          />
        ))}
      </span>
    : null;

  const applyLinks = (segment) => {
    if (!links.length) return segment;
    const parts = [];
    let remaining = segment;
    links.forEach(({ text, href }) => {
      const idx = remaining.indexOf(text);
      if (idx === -1) return;
      if (idx > 0) parts.push(remaining.slice(0, idx));
      parts.push(
        <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {text}
        </a>
      );
      remaining = remaining.slice(idx + text.length);
    });
    if (remaining) parts.push(remaining);
    return parts.length ? parts : segment;
  };

  if (!colorSwatches || !str.includes('{colors}')) return applyLinks(str);

  const [before, after] = str.split('{colors}');
  return [applyLinks(before), colorSwatches, applyLinks(after ?? '')];
}

const SNAP_H =
  'min-h-[calc(100dvh-3.5rem)] h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)]';

const SparkleGlyph = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-3 0 24 24"
    fill="currentColor"
    className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 opacity-90"
    aria-hidden
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5z"
    />
  </svg>
);

const INFO_ITEMS = [
  {
    type: 'names',
    labelBg: 'Кумове',
    labelEn: 'Maid of Honor & Best Man',
    linesBg: ['Росица Попова', 'Васил Андреев'],
    linesEn: ['Rositsa Popova', 'Vasil Andreev'],
  },
  {
    type: 'text',
    labelBg: 'Дрескод',
    labelEn: 'Dress Code',
    linesBg: [
      'Нямаме строго определен дрескод - искаме най-вече да се чувствате удобно и да се насладите на празника с нас.',
      'За тези от вас, които биха искали да се вдъхновят от темата на сватбата, тя е „горска", а цветовете, които са ни фаворити, са: {colors}',
    ],
    linesEn: [
      "There is no strict dress code — we simply want you to feel comfortable and enjoy the celebration with us.",
      "If you'd like to be inspired by our wedding theme, it's \"forest\", and our favourite colours are: {colors}",
    ],
    colors: [
      { hex: '#2F4F3A', label: 'Forest Green' },
      { hex: '#A8B5A2', label: 'Sage Green' },
      { hex: '#243447', label: 'Dark Navy' },
      { hex: '#DCCDB8', label: 'Beige' },
      { hex: '#EFE6D8', label: 'Champagne' },
    ],
  },
  {
    type: 'text',
    labelBg: 'Транспорт',
    labelEn: 'Getting There',
    linesBg: [
      'Pasarel Lake Club се намира на ул. Самоковско шосе (посока Самоков) на 15 км. от гр. София. Разполага с безплатен паркинг. Достъпен е чрез следните начини на транспорт:',
    ],
    linesEn: [
      'Pasarel Lake Club is located on Samokovsko Shose (towards Samokov), 15 km from Sofia. Free parking is available. You can get there by:',
    ],
    bulletsBg: ['Yellow Taxi', 'Volt Premium Taxi', 'Lucky Drink & Drive', 'Градски транспорт: автобус № 3'],
    bulletsEn: ['Yellow Taxi', 'Volt Premium Taxi', 'Lucky Drink & Drive', 'Public transport: bus No. 3'],
    links: [{ text: 'Pasarel Lake Club', href: 'https://maps.app.goo.gl/QwuB5yKzioKHXkTx7' }],
  },
  {
    type: 'text',
    labelBg: 'Цветя',
    labelEn: 'Flowers & Gifts',
    linesBg: [
      'Молим ви да не носите цветя, тъй като ние не сме предвидили достатъчно място за тях. Ако все пак желаете да ни направите подарък, бихме се радвали да ни помогнете да попълним нашата семейна библиотека с книги. Любима ваша история, книга, която ви напомня за нас, или такава, която смятате, че ще обикнем - всичко, избрано от сърце, ще намери място сред рафтовете ни. :)',
    ],
    linesEn: [
      "Please do not bring flowers, as we have already taken care of them. If you'd still like to give us a gift, we'd love your help building our family library. A favourite story, a book that reminds you of us, or one you think we'd love — anything chosen from the heart will find a place on our shelves. :)",
    ],
  },
];

export default function RSVPInfo({ language, isTextAnimating = false, inverted = false }) {
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

  const fadeUp = `transition-all duration-700 ease-out ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`;
  const langFade = isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in';

  return (
    <div
      ref={ref}
      className={`rsvp-scroll-section ${SNAP_H} w-full px-6 py-4 sm:px-8 !items-stretch !justify-start overflow-hidden`}
    >
      <div className="flex h-full min-h-0 w-full max-w-lg mx-auto flex-col gap-3">

        {/* Title */}
        <h2
          key={`info-title-${language}`}
          className={`shrink-0 font-title-cursive text-6xl sm:text-7xl md:text-5xl lg:text-6xl text-center leading-tight ${fadeUp} ${
            inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
          } ${langFade}`}
        >
          {language === 'en' ? 'Information' : 'Информация'}
        </h2>

        {/* Info items */}
        <div
          className={`flex-1 min-h-0 flex flex-col justify-start gap-8 pt-4 ${fadeUp}`}
          style={{ transitionDelay: visible ? '80ms' : '0ms' }}
        >
          {INFO_ITEMS.map((item, i) => (
            <div key={i} className="space-y-1.5">
              <p
                className={`font-sans font-bold text-xs tracking-[0.18em] uppercase ${
                  inverted ? 'text-[#f5f0e8]/60' : 'text-brand-forest/55'
                } ${langFade}`}
              >
                {language === 'en' ? item.labelEn : item.labelBg}
              </p>
              {item.type === 'names'
                ? (language === 'en' ? item.linesEn : item.linesBg).map((line, j) => (
                    <p
                      key={j}
                      className={`flex flex-wrap items-center justify-start gap-x-2.5 gap-y-1 text-left font-sans font-bold text-base sm:text-lg ${
                        inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
                      } ${langFade}`}
                    >
                      <SparkleGlyph />
                      <span>{line}</span>
                      <SparkleGlyph />
                    </p>
                  ))
                : <>
                    {(language === 'en' ? item.linesEn : item.linesBg).map((line, j) => {
                      const linkClass = inverted
                        ? 'underline underline-offset-2 hover:opacity-80'
                        : 'underline underline-offset-2 hover:opacity-70';
                      return (
                        <p
                          key={j}
                          className={`font-sans font-bold text-sm sm:text-base leading-relaxed ${
                            inverted ? 'text-[#f5f0e8]/90' : 'text-brand-forest/90'
                          } ${langFade}`}
                        >
                          {renderLine(line, { links: item.links || [], colors: item.colors || [], linkClass })}
                        </p>
                      );
                    })}
                    {(() => {
                      const bullets = language === 'en' ? item.bulletsEn : item.bulletsBg;
                      return bullets?.length
                        ? <p className={`font-sans font-bold text-sm sm:text-base leading-relaxed ${
                            inverted ? 'text-[#f5f0e8]/90' : 'text-brand-forest/90'
                          } ${langFade}`}>
                            {bullets.join(', ')}
                          </p>
                        : null;
                    })()}
                  </>
              }
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className={`shrink-0 flex flex-col items-center gap-4 pb-0.5 ${fadeUp}`}
          style={{ transitionDelay: visible ? '160ms' : '0ms' }}
        >
          <div className={`flex items-center gap-2 sm:gap-3 ${
            inverted ? 'text-[#f5f0e8]/80' : 'text-brand-forest/75'
          }`}>
            <span className={`block w-6 sm:w-8 h-px ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
            <span
              key={`info-next-${language}`}
              className={`text-[11px] sm:text-sm font-bold font-sans tracking-widest uppercase ${langFade}`}
            >
              {language === 'en' ? 'RSVP' : 'Покана'}
            </span>
            <span className={`block w-6 sm:w-8 h-px ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
          </div>
          <div className="flex flex-col items-center gap-0.5 animate-bounce pt-0.5">
            <span className={`block w-0.5 h-3 sm:h-4 rounded-full ${inverted ? 'bg-[#f5f0e8]/60' : 'bg-brand-forest/55'}`} />
            <span className={inverted ? 'text-[#f5f0e8]/75 text-xs sm:text-sm' : 'text-brand-forest/70 text-xs sm:text-sm'}>↓</span>
          </div>
        </div>

      </div>
    </div>
  );
}
