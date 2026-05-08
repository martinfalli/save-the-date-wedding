import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import NavBar from './components/NavBar';
import SaveTheDateSection from './components/sections/SaveTheDateSection';
import RSVPSection from './components/sections/RSVPSection';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('bg');
  const [isTextAnimating, setIsTextAnimating] = useState(false);
  const [showSaveTheDate, setShowSaveTheDate] = useState(false);
  const [isClosingSaveTheDate, setIsClosingSaveTheDate] = useState(false);
  const [rsvpInverted, setRsvpInverted] = useState(false);

  const saveTheDateLightOpen =
    (showSaveTheDate || isClosingSaveTheDate) && !isDarkMode;

  // Remove + re-insert forces Safari to re-read the theme-color value
  const setThemeColor = (color) => {
    const existing = document.querySelector('meta[name="theme-color"]');
    if (existing) existing.remove();
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('rsvp-inverted');
      setThemeColor('#003625');
    } else {
      root.classList.remove('dark');
      const forestChrome = rsvpInverted && !saveTheDateLightOpen;
      if (forestChrome) {
        root.classList.add('rsvp-inverted');
      } else {
        root.classList.remove('rsvp-inverted');
      }
      setThemeColor(forestChrome ? '#003625' : '#f5f0e8');
    }
  }, [isDarkMode, rsvpInverted, saveTheDateLightOpen]);

  const handleToggleLanguage = () => {
    setIsTextAnimating(true);
    setTimeout(() => {
      setLanguage((prev) => (prev === 'en' ? 'bg' : 'en'));
      setIsTextAnimating(false);
    }, 300);
  };

  // Fade-out then unmount
  const handleDismissSaveTheDate = () => {
    if (!showSaveTheDate || isClosingSaveTheDate) return;
    setIsClosingSaveTheDate(true);
    setTimeout(() => {
      setShowSaveTheDate(false);
      setIsClosingSaveTheDate(false);
      setIsDarkMode(false);
    }, 400);
  };

  return (
    <>
      <NavBar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isDarkMode={isDarkMode}
        rsvpInverted={rsvpInverted}
        onToggleInverted={() => setRsvpInverted((v) => !v)}
        saveTheDateOpen={showSaveTheDate || isClosingSaveTheDate}
        onSaveTheDateClick={() => {
          if (showSaveTheDate) {
            handleDismissSaveTheDate();
          } else {
            setShowSaveTheDate(true);
          }
        }}
        onNavItemClick={handleDismissSaveTheDate}
      />

      {/* RSVP is the landing content */}
      <main style={{ paddingTop: 'var(--nav-h)' }}>
        <RSVPSection
          language={language}
          isTextAnimating={isTextAnimating}
          inverted={rsvpInverted}
          onToggleInverted={() => setRsvpInverted((v) => !v)}
        />
      </main>

      {/* Save the Date overlay — sits below the sticky navbar */}
      {(showSaveTheDate || isClosingSaveTheDate) && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 ${
            isClosingSaveTheDate ? 'animate-fadeOutScale' : 'animate-fadeInScale'
          }`}
          style={{ top: 'var(--nav-h)' }}
        >
          <SaveTheDateSection
            language={language}
            isTextAnimating={isTextAnimating}
            isDarkMode={isDarkMode}
            onReveal={() => setIsDarkMode(true)}
          />
        </div>
      )}

      <Analytics />
    </>
  );
}

export default App;
