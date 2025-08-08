import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { Analytics } from '@vercel/analytics/react';

// Import local image
import couplePhoto from '../images/IMG_3626.jpeg';
import graceImage from '../images/grace.png';
import graceGoldImage from '../images/grace_gold.png';

function App() {
  const [isDateRevealed, setIsDateRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('bg');
  const [graceClickCount, setGraceClickCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const [graceAnimationKey, setGraceAnimationKey] = useState(0);
  const [isTextAnimating, setIsTextAnimating] = useState(false);
  const [isPhotoPressed, setIsPhotoPressed] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState(null);
  const { width, height } = useWindowSize();

  // Effect to toggle dark class on html element and update theme color
  useEffect(() => {
    const root = window.document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    if (isDarkMode) {
      root.classList.add('dark');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#4a1123');
      }
    } else {
      root.classList.remove('dark');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#f4ede3');
      }
    }
  }, [isDarkMode]);

  const revealDate = () => {
    setIsDateRevealed(true);
    setShowConfetti(true);
    setIsDarkMode(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
  };

  const handlePhotoClick = () => {
    const newClickCount = graceClickCount + 1;
    setGraceClickCount(newClickCount);

    if (newClickCount <= 3) {
      setGraceAnimationKey(prevKey => prevKey + 1);
    } else {
      setIsPopupClosing(false);
      setShowPopup(true);
      setTimeout(() => {
        setIsPopupClosing(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 400);
      }, 3000);
    }
  };

  const toggleLanguage = () => {
    setIsTextAnimating(true);
    setTimeout(() => {
      setLanguage(prevLang => prevLang === 'en' ? 'bg' : 'en');
      setIsTextAnimating(false);
    }, 300);
  };

  const downloadCalendarInvite = () => {
    const event = {
      title: language === 'en' ? 'The Wedding of Simona & Martin' : 'Сватбата на Симона & Мартин',
      description: language === 'en' ? 'Vamooos!' : 'Айдеее!',
      location: language === 'en' ? 'Pasarel Lake Club - https://maps.app.goo.gl/6cpMAtGf2iUf2VXR6' : 'Пасарел Лейк Клъб - https://maps.app.goo.gl/6cpMAtGf2iUf2VXR6',
      startTime: '2026-07-10T00:00:00',
      endTime: '2026-07-10T23:59:59'
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `DTSTART:${event.startTime.replace(/-|:/g, '')}`,
      `DTEND:${event.endTime.replace(/-|:/g, '')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'simona-martin-wedding-invite.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans animate-pageLoad transition-colors duration-500 relative">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-[#1a0006] via-[#100004] to-[#1a0006]'
            : 'bg-[#f4ede3]'
        }`}></div>

        {/* Subtle gradient overlay - only visible in light mode */}
        {!isDarkMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#8a163a]/10 via-transparent to-[#8a163a]/10"></div>
        )}

        {/* Subtle gradient overlay - only visible in dark mode */}
        {isDarkMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#490b1e]/30 via-transparent to-[#490b1e]/30"></div>
        )}

        {showConfetti && (
          <Confetti 
            width={width} 
            height={height} 
            recycle={false} 
            numberOfPieces={400}
            gravity={0.3}
            wind={0.05}
            friction={0.99}
            opacity={0.8}
            colors={['#FFD700', '#daa520', '#B8860B', '#F0E68C']}
            style={{ position: 'fixed' }}
          />
        )}

        {/* Grace falling animation container - Rendered multiple times using key */}
        {[...Array(graceClickCount > 3 ? 3 : graceClickCount)].map((_, i) => (
           <div key={i} className="absolute w-full h-full pointer-events-none z-10">
             {/* Render the images inside each container instance */}
             {/* Row 1 */}
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[10%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[30%] -translate-x-1/2 animate-fall-grace-medium delay-1000"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[50%] -translate-x-1/2 animate-fall-grace-reverse"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[70%] -translate-x-1/2 animate-fall-grace-medium delay-1500"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[90%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />

             {/* Row 2 */}
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[20%] -translate-x-1/2 animate-fall-grace-very-slow delay-2000"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[40%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[60%] -translate-x-1/2 animate-fall-grace-very-slow delay-500"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[80%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />

             {/* Row 3 */}
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[15%] -translate-x-1/2 animate-fall-grace-medium-reverse delay-2500"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[35%] -translate-x-1/2 animate-fall-grace"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[65%] -translate-x-1/2 animate-fall-grace-reverse delay-3000"
             />
             <img 
               src={isDarkMode ? graceGoldImage : graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[85%] -translate-x-1/2 animate-fall-grace-medium"
             />
           </div>
         ))}

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Wrapper for Gradient Border - Removing gradient border in dark mode */}
            <div className={`relative transition-all duration-500 ease-in-out ${isDarkMode ? 'dark:rounded-lg' : ''} ${
              isPopupClosing ? 'animate-fadeOutScale' : 'animate-fadeInScale'
            }`}>
              {/* Inner container for background and content */}
              <div className={`rounded-lg p-6 shadow-xl transform transition-colors duration-500 ${
                isDarkMode 
                  ? 'bg-[#1f060e]' /* Match emoji button dark bg */
                  : 'bg-white' /* Remove light mode border */
              }`}>
                <p className={`text-xl font-semibold transition-colors duration-500 ${isDarkMode ? '' : 'text-[#7a1330]'}`}>
                  {isDarkMode ? (
                    <span className="dark:bg-gradient-to-br dark:from-[#f2cf52] dark:via-[#a68d33] dark:to-[#f2cf52] dark:bg-clip-text dark:text-transparent">
                      {language === 'en' ? 'More Grace? At the wedding!' : 'Искате още Грейс - на сватбата!'}
                    </span>
                  ) : (
                    language === 'en' ? 'More Grace? At the wedding!' : 'Искате още Грейс - на сватбата!'
                  )}
                  {' '}{/* Add space before emoji */}
                  <span className={isDarkMode ? 'text-xl' : ''}>😉</span> {/* Emoji outside the gradient span */}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disco Lights - only visible in dark mode */}
        {isDarkMode && (
          <div className="absolute inset-0 overflow-hidden blur-3xl opacity-75">
            {/* Top Left */}
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#3c1b1c] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-500"></div>
            {/* Top Right */}
            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#3c1b1c] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-1500"></div>
            {/* Bottom Left */}
            <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#3c1b1c] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-1000"></div>
            {/* Bottom Right */}
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#3c1b1c] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-2000"></div>
          </div>
        )}
      </div>
      
      {/* Main content Wrapper for Gradient Border */}
      <div className={`relative z-10 transition-all duration-500 ease-in-out w-full ${
        isDarkMode 
          ? 'dark:rounded-lg h-[540px] md:h-[623px] max-w-3xl' 
          : 'h-[460px] md:h-[513px] max-w-2xl'
      }`}>
        <div className={`rounded-lg shadow-lg text-center mx-auto transition-all duration-500 ease-in-out h-full ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#4a1123]/90 to-[#1f060e]/90 p-6 md:p-12 lg:p-12'
            : 'bg-gradient-to-br from-white/90 to-stone-100/90 py-12 md:py-16 lg:py-16 px-6 md:px-12 lg:px-12'
        }`}>
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-xl transform active:scale-95 bg-[#f4ede3] dark:bg-[#1f060e] dark:border-none transition-all duration-200 z-20 lg:hover:opacity-80"
            aria-label={language === 'en' ? 'Switch to Bulgarian' : 'Switch to English'}
            disabled={isTextAnimating}
          >
            <span className={`${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'} inline-block`}>
              {language === 'en' ? '🇧🇬' : '🇺🇸'}
            </span>
          </button>
          
          <div className="flex flex-col items-center justify-center h-full transition-all duration-500 ease-in-out">
            {/* Wrapper for Gradient/Solid Border */}
            <div 
              className={`inline-block transition-all duration-500 ease-in-out transform cursor-pointer rounded-full shadow-md ${
                isPhotoPressed ? 'scale-90' : 'lg:hover:scale-95'
              } ${
                isDarkMode 
                  ? 'p-[4px] bg-gradient-to-br from-[#f2cf52] via-[#a68d33] to-[#f2cf52] mb-10' 
                  : 'border-4 border-[#8a163a] mb-8'
              }`}
              onClick={handlePhotoClick}
              onTouchStart={() => {
                if (touchTimeout) {
                  clearTimeout(touchTimeout);
                }
                setIsPhotoPressed(true);
              }}
              onTouchEnd={() => {
                const timeout = setTimeout(() => {
                  setIsPhotoPressed(false);
                }, 150);
                setTouchTimeout(timeout);
              }}
              onMouseDown={() => setIsPhotoPressed(true)}
              onMouseUp={() => setIsPhotoPressed(false)}
              onMouseLeave={() => setIsPhotoPressed(false)}
            >
              <img 
                src={couplePhoto} 
                alt="Simona & Martin" 
                className={`block w-48 h-48 md:w-56 md:h-56 rounded-full object-cover`} 
                style={{
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none'
                }}
                draggable={false}
              />
            </div>

            {/* Subtitle */}
            <p 
              key={`subtitle-${language}`}
              className={`font-title-cursive text-2xl md:text-3xl lg:text-4xl mb-4 px-4 transition-colors duration-500 ease-in-out whitespace-nowrap ${isDarkMode ? 'dark:bg-gradient-to-br dark:from-[#f2cf52] dark:via-[#a68d33] dark:to-[#f2cf52] dark:bg-clip-text dark:text-transparent dark:pt-1 dark:mb-3' : 'text-[#8a163a]'} ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}
            >
              {language === 'en' ? 'The Wedding of' : 'Сватбата на'}
            </p>

            <h1 
              key={`title-${language}`}
              className={`font-title-cursive text-5xl md:text-6xl lg:text-7xl mb-4 px-4 whitespace-nowrap transition-colors duration-500 ease-in-out ${isDarkMode ? 'dark:bg-gradient-to-br dark:from-[#f2cf52] dark:via-[#a68d33] dark:to-[#f2cf52] dark:bg-clip-text dark:text-transparent dark:pt-2 dark:mb-2' : 'text-[#8a163a]'} ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}
            >
              {language === 'en' ? 'Simona & Martin' : 'Симона & Мартин'}
            </h1>

            {!isDateRevealed ? (
              <button
                onClick={revealDate}
                className={`text-white font-bold py-3 px-6 rounded-full 
                           mt-2 md:mt-0
                           bg-gradient-to-br from-[#8a163a] to-[#5d0e27]
                           hover:from-[#8a163a] hover:to-[#5d0e27]
                           transition-all duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#8a163a] focus:ring-opacity-50 shadow-lg
                           w-[170px] ${
                             isButtonPressed ? 'scale-95' : 'hover:scale-105'
                           }`}
                onTouchStart={() => setIsButtonPressed(true)}
                onTouchEnd={() => setIsButtonPressed(false)}
                onMouseDown={() => setIsButtonPressed(true)}
                onMouseUp={() => setIsButtonPressed(false)}
                onMouseLeave={() => setIsButtonPressed(false)}
              >
                <span 
                  key={`button-text-${language}`}
                  className={isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}
                >
                  {language === 'en' ? 'Save the Date' : 'Запази Датата'}
                </span>
              </button>
            ) : (
              <div className={`animate-fadeInScale space-y-3 transition-colors duration-500 ease-in-out ${isDarkMode ? 'mt-4 md:mt-6' : ''} md:-mt-[0.125rem]`}>
                <p 
                  onClick={downloadCalendarInvite}
                  className={`text-xl md:text-2xl font-semibold transition-colors duration-500 ease-in-out hover:opacity-80 cursor-pointer ${
                    isDarkMode ? 'dark:bg-gradient-to-br dark:from-[#f2cf52] dark:via-[#a68d33] dark:to-[#f2cf52] dark:bg-clip-text dark:text-transparent' : 'text-gray-800'
                  } ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}
                >
                  {language === 'en' ? '10 July 2026' : '10 Юли 2026'}
                </p>
                <p className={`text-lg md:text-xl transition-colors duration-500 ease-in-out hover:opacity-80 ${isDarkMode ? 'dark:bg-gradient-to-br dark:from-[#f2cf52] dark:via-[#a68d33] dark:to-[#f2cf52] dark:bg-clip-text dark:text-transparent' : 'text-gray-800'} ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}>
                  <a 
                    href="https://maps.app.goo.gl/6cpMAtGf2iUf2VXR6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {language === 'en' ? 'Pasarel Lake Club' : 'Пасарел Лейк Клуб'}
                  </a>
                </p>
                <p className={`text-sm md:text-base italic mt-4 transition-colors duration-500 ease-in-out ${isDarkMode ? 'dark:bg-gradient-to-br dark:from-[#f2cf52] dark:via-[#a68d33] dark:to-[#f2cf52] dark:bg-clip-text dark:text-transparent' : 'text-gray-800'} ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}>
                  {language === 'en' ? '(Invitation to follow)' : '(Ще последва покана)'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default App;