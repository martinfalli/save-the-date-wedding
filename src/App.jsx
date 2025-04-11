import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

// Import local image
import couplePhoto from '../images/IMG_3626.jpeg';
import graceImage from '../images/grace.png';

function App() {
  const [isDateRevealed, setIsDateRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [graceClickCount, setGraceClickCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const [graceAnimationKey, setGraceAnimationKey] = useState(0);
  const { width, height } = useWindowSize();

  // Effect to toggle dark class on html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
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
    setLanguage(prevLang => prevLang === 'en' ? 'bg' : 'en');
  };

  const downloadCalendarInvite = () => {
    const event = {
      title: language === 'en' ? 'Wedding of Simona & Martin' : 'Сватба на Симона & Мартин',
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
            ? 'bg-gradient-to-br from-black via-black to-black'
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
            style={{ position: 'fixed' }}
          />
        )}

        {/* Grace falling animation container - Rendered multiple times using key */} 
        {[...Array(graceClickCount > 3 ? 3 : graceClickCount)].map((_, i) => (
           <div key={i} className="absolute w-full h-full pointer-events-none">
             {/* Render the images inside each container instance */}
             {/* Row 1 */}
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[10%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[30%] -translate-x-1/2 animate-fall-grace-medium delay-1000"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[50%] -translate-x-1/2 animate-fall-grace-reverse"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[70%] -translate-x-1/2 animate-fall-grace-medium delay-1500"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[90%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />

             {/* Row 2 */}
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[20%] -translate-x-1/2 animate-fall-grace-very-slow delay-2000"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[40%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[60%] -translate-x-1/2 animate-fall-grace-very-slow delay-500"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[80%] -translate-x-1/2 animate-fall-grace-slow-reverse"
             />

             {/* Row 3 */}
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[15%] -translate-x-1/2 animate-fall-grace-medium-reverse delay-2500"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[35%] -translate-x-1/2 animate-fall-grace"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[65%] -translate-x-1/2 animate-fall-grace-reverse delay-3000"
             />
             <img 
               src={graceImage} 
               alt="Grace" 
               className="w-16 h-16 object-contain absolute left-[85%] -translate-x-1/2 animate-fall-grace-medium"
             />
           </div>
         ))}

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl transform transition-all duration-500 border border-transparent dark:border-gray-600 ${
              isPopupClosing ? 'animate-fadeOutScale' : 'animate-fadeInScale'
            }`}>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {language === 'en' ? 'More Grace? At the wedding! 😉' : 'Искате още Грейс - на сватбата! 😉'}
              </p>
            </div>
          </div>
        )}

        {/* Disco Lights - only visible in dark mode */}
        {isDarkMode && (
          <div className="absolute inset-0 overflow-hidden blur-3xl opacity-75">
            {/* Top Left */}
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#5d0e27] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-500"></div>
            {/* Top Right */}
            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#5d0e27] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-1500"></div>
            {/* Bottom Left */}
            <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#5d0e27] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-1000"></div>
            {/* Bottom Right */}
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#5d0e27] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-2000"></div>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className={`rounded-lg shadow-lg text-center w-full mx-auto relative z-10 transition-all duration-500 ease-in-out border ${
        isDarkMode 
          ? 'h-[540px] md:h-[600px] bg-gradient-to-br from-[#370a18]/90 to-[#260610]/90 border-[#f5ede3] max-w-2xl p-6 md:p-12 lg:p-12'
          : 'h-[450px] md:h-[495px] bg-gradient-to-br from-white/90 to-stone-100/90 border-stone-300 max-w-xl py-12 md:py-16 lg:py-16 px-6 md:px-12 lg:px-12'
      }`}>
        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-xl transform active:scale-95 bg-[#f4ede3] dark:bg-pink-900/30 transition-all duration-200 z-20 lg:hover:opacity-80"
          aria-label={language === 'en' ? 'Switch to Bulgarian' : 'Switch to English'}
        >
          {language === 'en' ? '🇧🇬' : '🇺🇸'}
        </button>
        
        <div className="flex flex-col items-center justify-center h-full transition-all duration-500 ease-in-out">
          <img 
            src={couplePhoto} 
            alt="Simona & Martin" 
            className={`w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-[#8a163a] dark:border-[#f5ede3] shadow-md transition-all duration-500 ease-in-out transform active:scale-90 lg:hover:scale-95 cursor-pointer ${
              isDarkMode ? 'mb-12' : 'mb-8'
            }`}
            onClick={handlePhotoClick}
          />

          {/* Subtitle */}
          <p className="font-title-cursive text-2xl md:text-3xl lg:text-4xl mb-2 text-[#8a163a] dark:text-[#f5ede3] transition-all duration-500 ease-in-out">
            {language === 'en' ? 'The Wedding of' : 'Сватбата на'}
          </p>

          <h1 className="font-title-cursive text-5xl md:text-6xl lg:text-7xl mb-4 whitespace-nowrap text-[#8a163a] dark:text-[#f5ede3] transition-all duration-500 ease-in-out">
            {language === 'en' ? 'Simona & Martin' : 'Симона & Мартин'}
          </h1>

          {!isDateRevealed ? (
            <button
              onClick={revealDate}
              className="text-white font-bold py-3 px-6 rounded-full 
                         mt-2 md:mt-0
                         bg-gradient-to-br from-[#8a163a] to-[#5d0e27]
                         hover:from-[#8a163a] hover:to-[#5d0e27]
                         transition-all duration-500 ease-in-out transform hover:scale-105 
                         focus:outline-none focus:ring-2 focus:ring-[#8a163a] focus:ring-opacity-50 shadow-lg"
            >
              {language === 'en' ? 'Save the Date' : 'Запази Датата'}
            </button>
          ) : (
            <div className={`animate-fadeInScale space-y-3 transition-all duration-500 ease-in-out ${isDarkMode ? 'mt-4' : ''}`}>
              <p 
                onClick={downloadCalendarInvite}
                className={`text-xl md:text-2xl font-semibold transition-all duration-500 ease-in-out hover:opacity-80 cursor-pointer ${
                  isDarkMode ? 'text-[#f6eee5]' : 'text-gray-800'
                }`}
              >
                {language === 'en' ? '10 July 2026' : '10 Юли 2026'}
              </p>
              <p className={`text-lg md:text-xl transition-all duration-500 ease-in-out hover:opacity-80 ${isDarkMode ? 'text-[#f6eee5]' : 'text-gray-800'}`}>
                <a 
                  href="https://maps.app.goo.gl/6cpMAtGf2iUf2VXR6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {language === 'en' ? 'Pasarel Lake Club' : 'Пасарел Лейк Клуб'}
                </a>
              </p>
              <p className={`text-sm md:text-base italic mt-4 transition-all duration-500 ease-in-out ${isDarkMode ? 'text-[#f6eee5]' : 'text-gray-800'}`}>
                {language === 'en' ? '(Invitation to follow)' : '(Ще последва покана)'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 