import React, { useState, useEffect, useRef } from 'react';

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const NAV_ITEMS = [
  { id: 'rsvp', labelEn: 'RSVP', labelBg: 'Покана', disabled: false },
  { id: 'save-the-date', labelEn: 'Save the Date', labelBg: 'Save the Date', disabled: false },
  { id: 'photos', labelEn: 'Photos', labelBg: 'Снимки', disabled: true },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Item stagger-out (~410ms) then strip max-width + opacity (~280ms delay + 300ms) */
const MOBILE_CLOSE_MS = 600;

export default function NavBar({
  language,
  onToggleLanguage,
  isDarkMode,
  rsvpInverted = false,
  onToggleInverted,
  /** When Save the Date overlay is visible (including close animation), light mode uses cream chrome */
  saveTheDateOpen = false,
  onSaveTheDateClick,
  onNavItemClick,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileClosing) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMobileOpen(false);
      setMobileClosing(false);
      closeTimerRef.current = null;
    }, MOBILE_CLOSE_MS);
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [mobileClosing]);

  const openMobileMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMobileClosing(false);
    setMobileOpen(true);
  };

  const startMobileMenuClose = () => {
    if (!mobileOpen) return;
    setMobileClosing(true);
  };

  const handleNavClick = (item) => {
    if (item.disabled) return;
    startMobileMenuClose();
    if (item.id === 'save-the-date') {
      onSaveTheDateClick?.();
    } else {
      onNavItemClick?.();
      scrollToSection(item.id);
    }
  };

  const closeMenu = () => startMobileMenuClose();

  const panelContentIn = mobileOpen && !mobileClosing;

  const navRsvpInvert = rsvpInverted && !isDarkMode && !saveTheDateOpen;

  /** Save-the-date dark + RSVP invert (when not viewing light Save the Date) share forest toolbar */
  const forestToolbar = isDarkMode || navRsvpInvert;

  const navBg = forestToolbar
    ? scrolled
      ? 'bg-[#003625]/95 border-b border-[#f5f0e8]/15 shadow-sm'
      : 'bg-[#003625] border-b border-transparent'
    : scrolled
      ? 'bg-[#f5f0e8]/95 border-b border-brand-forest/10 shadow-sm'
      : 'bg-[#f5f0e8]/80 border-b border-transparent';

  const textColor = forestToolbar ? 'text-[#f5f0e8]' : 'text-brand-forest';
  const pillClass = forestToolbar ? 'nav-link-pill-rsvp-inverted' : 'nav-link-pill';

  const barStroke = forestToolbar ? 'bg-[#f5f0e8]' : 'bg-brand-forest';
  const hamburgerHover = forestToolbar
    ? 'hover:bg-[#f5f0e8]/10'
    : 'hover:bg-brand-forest/10';
  const langBtn = forestToolbar ? 'nav-lang-btn-rsvp-inverted' : 'bg-brand-forest/10 text-brand-forest hover:bg-brand-forest/20';

  const disabledNav = forestToolbar ? 'text-[#f5f0e8]/45' : 'text-brand-forest/55';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        forestToolbar ? '' : 'backdrop-blur-sm'
      } ${navBg}`}
      aria-label="Main navigation"
    >
      <div className="relative max-w-5xl mx-auto h-14 min-w-0 pl-3 pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-4 md:px-8 overflow-x-hidden">
        {/* Mobile: 4-col grid — hamburger | nav items | dark mode | language */}
        <div className="grid md:hidden grid-cols-[2.5rem_minmax(0,1fr)_2.5rem_2.5rem] items-center h-full w-full min-w-0 gap-x-1">
          <button
            type="button"
            onClick={mobileOpen && !mobileClosing ? closeMenu : openMobileMenu}
            className={`relative w-10 h-10 rounded-md transition-colors duration-200 justify-self-start ${hamburgerHover}`}
            aria-label={mobileOpen && !mobileClosing ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen && !mobileClosing}
          >
            {/* Hamburger — visible when closed or while menu is closing */}
            <span
              className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ease-out ${
                !mobileOpen || mobileClosing
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'pointer-events-none opacity-0 scale-75 rotate-90'
              }`}
              aria-hidden={mobileOpen && !mobileClosing}
            >
              <span className={`block w-5 h-0.5 rounded-full ${barStroke}`} />
              <span className={`block w-5 h-0.5 rounded-full ${barStroke}`} />
              <span className={`block w-5 h-0.5 rounded-full ${barStroke}`} />
            </span>
            {/* Close — same stroke/size as hamburger bars (w-5 × h-0.5) */}
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${
                mobileOpen && !mobileClosing
                  ? 'opacity-100 scale-100 rotate-0'
                  : 'pointer-events-none opacity-0 scale-75 -rotate-90'
              }`}
              aria-hidden={!mobileOpen || mobileClosing}
            >
              <span className={`absolute block w-5 h-0.5 rounded-full rotate-45 ${barStroke}`} />
              <span className={`absolute block w-5 h-0.5 rounded-full -rotate-45 ${barStroke}`} />
            </span>
          </button>

          <div
            className={`min-w-0 overflow-hidden justify-self-stretch ease-out motion-reduce:transition-none ${
              mobileOpen && !mobileClosing
                ? 'max-w-[min(72vw,18rem)] opacity-100 transition-[max-width,opacity] duration-300'
                : ''
            } ${
              !mobileOpen
                ? 'max-w-0 opacity-0 transition-[max-width,opacity] duration-300'
                : ''
            } ${
              mobileOpen && mobileClosing
                ? 'max-w-0 opacity-0 transition-[max-width,opacity] duration-300'
                : ''
            }`}
            style={mobileOpen && mobileClosing ? { transitionDelay: '280ms' } : undefined}
            aria-hidden={!mobileOpen}
          >
            <ul className="flex flex-row flex-nowrap items-center justify-end gap-1 py-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {NAV_ITEMS.map((item, i) => {
                const last = NAV_ITEMS.length - 1;
                const openDelay = `${50 + i * 40}ms`;
                const closeDelay = `${(last - i) * 55}ms`;
                return (
                  <li
                    key={item.id}
                    className={`shrink-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                      panelContentIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                    style={{
                      transitionDelay: panelContentIn ? openDelay : mobileClosing ? closeDelay : '0ms',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      disabled={item.disabled}
                      title={item.disabled ? 'Coming soon' : undefined}
                      className={`whitespace-nowrap text-xs font-semibold tracking-wide rounded-full px-2.5 py-1.5 ${
                        item.disabled
                          ? `${pillClass} cursor-not-allowed ${disabledNav}`
                          : `${pillClass} ${textColor}`
                      }`}
                    >
                      {language === 'en' ? item.labelEn : item.labelBg}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            onClick={onToggleInverted}
            className={`relative z-20 w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 justify-self-end ${langBtn}`}
            aria-label={rsvpInverted ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {rsvpInverted ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            onClick={onToggleLanguage}
            className={`relative z-20 w-10 h-10 flex items-center justify-center rounded-md text-sm font-bold tracking-wider transition-colors duration-200 justify-self-end ${langBtn}`}
            aria-label={language === 'en' ? 'Switch to Bulgarian' : 'Switch to English'}
          >
            {language === 'en' ? 'BG' : 'EN'}
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-end h-full relative">
          <ul className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1 lg:gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  disabled={item.disabled}
                  title={item.disabled ? 'Coming soon' : undefined}
                  className={`${pillClass} ${
                    item.disabled ? `cursor-not-allowed ${disabledNav}` : textColor
                  }`}
                >
                  {language === 'en' ? item.labelEn : item.labelBg}
                </button>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleInverted}
              className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-200 ${langBtn}`}
              aria-label={rsvpInverted ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {rsvpInverted ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-bold tracking-wider transition-colors duration-200 ${langBtn}`}
              aria-label={language === 'en' ? 'Switch to Bulgarian' : 'Switch to English'}
            >
              {language === 'en' ? 'BG' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
