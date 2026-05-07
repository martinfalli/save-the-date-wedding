import React, { useState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import couplePhoto from '../../../images/IMG_3626.jpeg';
import graceImage from '../../../images/grace.png';
import graceGoldImage from '../../../images/grace_gold.png';

export default function SaveTheDateSection({
  language,
  isTextAnimating,
  isDarkMode,
  onReveal,
}) {
  const [isDateRevealed, setIsDateRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [graceClickCount, setGraceClickCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const [isPhotoPressed, setIsPhotoPressed] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState(null);
  const { width, height } = useWindowSize();

  const revealDate = () => {
    setIsDateRevealed(true);
    setShowConfetti(true);
    onReveal();
    setTimeout(() => setShowConfetti(false), 8000);
  };

  const handlePhotoClick = () => {
    const newClickCount = graceClickCount + 1;
    setGraceClickCount(newClickCount);
    if (newClickCount > 3) {
      setIsPopupClosing(false);
      setShowPopup(true);
      setTimeout(() => {
        setIsPopupClosing(true);
        setTimeout(() => setShowPopup(false), 400);
      }, 3000);
    }
  };

  const downloadCalendarInvite = () => {
    const event = {
      title: language === 'en' ? 'The Wedding of Simona & Martin' : 'Сватбата на Симона & Мартин',
      description: language === 'en' ? 'Vamooos!' : 'Айдеее!',
      location:
        language === 'en'
          ? 'Pasarel Lake Club - https://maps.app.goo.gl/6cpMAtGf2iUf2VXR6'
          : 'Пасарел Лейк Клъб - https://maps.app.goo.gl/6cpMAtGf2iUf2VXR6',
      startTime: '2026-07-10T00:00:00',
      endTime: '2026-07-10T23:59:59',
    };
    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      `SUMMARY:${event.title}`, `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `DTSTART:${event.startTime.replace(/-|:/g, '')}`,
      `DTEND:${event.endTime.replace(/-|:/g, '')}`,
      'END:VEVENT', 'END:VCALENDAR',
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
    <section
      id="save-the-date"
      className="min-h-full flex items-center justify-center p-4 font-sans animate-pageLoad transition-colors duration-500 relative"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDarkMode
              ? 'bg-gradient-to-br from-[#003625] via-[#002a1c] to-[#003625]'
              : 'bg-[#f5f0e8]'
          }`}
        />

        {isDarkMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#003625]/40 via-transparent to-[#002a1c]/40" />
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
            colors={['#f5f0e8', '#ebe4d8', '#dfd9ce', '#f5f0e8', '#e8e2d6']}
            style={{ position: 'fixed' }}
          />
        )}

        {/* Grace falling animation */}
        {[...Array(graceClickCount > 3 ? 3 : graceClickCount)].map((_, i) => (
          <div key={i} className="absolute w-full h-full pointer-events-none z-10">
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[10%] -translate-x-1/2 animate-fall-grace-slow-reverse" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[30%] -translate-x-1/2 animate-fall-grace-medium delay-1000" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[50%] -translate-x-1/2 animate-fall-grace-reverse" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[70%] -translate-x-1/2 animate-fall-grace-medium delay-1500" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[90%] -translate-x-1/2 animate-fall-grace-slow-reverse" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[20%] -translate-x-1/2 animate-fall-grace-very-slow delay-2000" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[40%] -translate-x-1/2 animate-fall-grace-slow-reverse" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[60%] -translate-x-1/2 animate-fall-grace-very-slow delay-500" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[80%] -translate-x-1/2 animate-fall-grace-slow-reverse" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[15%] -translate-x-1/2 animate-fall-grace-medium-reverse delay-2500" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[35%] -translate-x-1/2 animate-fall-grace" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[65%] -translate-x-1/2 animate-fall-grace-reverse delay-3000" />
            <img src={isDarkMode ? graceGoldImage : graceImage} alt="Grace" className="w-16 h-16 object-contain absolute left-[85%] -translate-x-1/2 animate-fall-grace-medium" />
          </div>
        ))}

        {/* Grace popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`relative transition-all duration-500 ease-in-out ${isPopupClosing ? 'animate-fadeOutScale' : 'animate-fadeInScale'}`}>
              <div className={`rounded-lg p-6 shadow-xl transform transition-colors duration-500 ${isDarkMode ? 'bg-[#002a1c]' : 'bg-white'}`}>
                <p className={`text-xl font-semibold font-sans transition-colors duration-500 ${isDarkMode ? 'text-[#f5f0e8]' : 'text-[#003625]'}`}>
                  {language === 'en' ? 'More Grace? At the wedding!' : 'Искате още Грейс - на сватбата!'}{' '}
                  <span className={isDarkMode ? 'text-xl' : ''}>😉</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disco lights — dark mode only */}
        {isDarkMode && (
          <div className="absolute inset-0 overflow-hidden blur-3xl opacity-75">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#003625] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-500" />
            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#002a1c] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-1500" />
            <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#003625] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-1000" />
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#002a1c] rounded-full animate-spin-slow animate-pulse-subtle animation-delay-2000" />
          </div>
        )}
      </div>

      {/* Card */}
      <div
        className={`relative z-10 transition-all duration-500 ease-in-out w-full ${
          isDarkMode
            ? 'rounded-lg h-[540px] md:h-[623px] max-w-3xl'
            : 'h-[460px] md:h-[513px] max-w-2xl'
        }`}
      >
        <div
          className={`rounded-lg shadow-lg text-center mx-auto transition-all duration-500 ease-in-out h-full ${
            isDarkMode
              ? 'bg-gradient-to-br from-[#003625]/95 to-[#002a1c]/95 p-6 md:p-12 lg:p-12'
              : 'bg-gradient-to-br from-white/90 to-stone-100/90 py-12 md:py-16 lg:py-16 px-6 md:px-12 lg:px-12'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full transition-all duration-500 ease-in-out">
            {/* Couple photo */}
            <div
              className={`inline-block transition-all duration-500 ease-in-out transform cursor-pointer rounded-full shadow-md ${
                isPhotoPressed ? 'scale-90' : 'lg:hover:scale-95'
              } ${
                isDarkMode
                  ? 'p-[3px] bg-[#f5f0e8] mb-10'
                  : 'border-4 border-[#003625] mb-8'
              }`}
              onClick={handlePhotoClick}
              onTouchStart={() => {
                if (touchTimeout) clearTimeout(touchTimeout);
                setIsPhotoPressed(true);
              }}
              onTouchEnd={() => {
                const timeout = setTimeout(() => setIsPhotoPressed(false), 150);
                setTouchTimeout(timeout);
              }}
              onMouseDown={() => setIsPhotoPressed(true)}
              onMouseUp={() => setIsPhotoPressed(false)}
              onMouseLeave={() => setIsPhotoPressed(false)}
            >
              <img
                src={couplePhoto}
                alt="Simona & Martin"
                className="block w-48 h-48 md:w-56 md:h-56 rounded-full object-cover"
                style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
                draggable={false}
              />
            </div>

            {/* Subtitle */}
            <p
              key={`subtitle-${language}`}
              className={`font-sans font-medium text-xs md:text-sm tracking-[0.2em] uppercase mb-2 px-4 transition-colors duration-500 ease-in-out whitespace-nowrap ${
                isDarkMode ? 'text-[#f5f0e8]/75 pt-1' : 'text-[#003625]/70'
              } ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}
            >
              {language === 'en' ? 'The Wedding of' : 'Сватбата на'}
            </p>

            {/* Names */}
            <h1
              key={`title-${language}`}
              className={`font-sans font-bold text-xl md:text-2xl lg:text-3xl mb-4 px-4 whitespace-nowrap tracking-wider uppercase transition-colors duration-500 ease-in-out ${
                isDarkMode ? 'text-[#f5f0e8] mb-3' : 'text-[#003625]'
              } ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}
            >
              {language === 'en' ? 'Simona & Martin' : 'Симона & Мартин'}
            </h1>

            {!isDateRevealed ? (
              <button
                onClick={revealDate}
                className={`text-white font-bold py-3 px-6 rounded-full mt-2 md:mt-0
                  bg-gradient-to-br from-[#003625] to-[#002a1c]
                  hover:from-[#003625] hover:to-[#002a1c]
                  transition-all duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#003625] focus:ring-opacity-50 shadow-lg
                  w-[170px] ${isButtonPressed ? 'scale-95' : 'hover:scale-105'}`}
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
                  className={`font-title-cursive text-5xl md:text-6xl transition-colors duration-500 ease-in-out hover:opacity-80 cursor-pointer ${
                    isDarkMode ? 'text-[#f5f0e8]' : 'text-[#003625]'
                  } ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}
                >
                  {language === 'en' ? '10 July 2026' : '10 Юли 2026'}
                </p>
                <p
                  className={`text-lg md:text-xl font-bold font-sans transition-colors duration-500 ease-in-out hover:opacity-80 ${
                    isDarkMode ? 'text-[#f5f0e8]' : 'text-gray-800'
                  } ${isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in'}`}
                >
                  <a
                    href="https://maps.app.goo.gl/6cpMAtGf2iUf2VXR6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {language === 'en' ? 'Pasarel Lake Club' : 'Пасарел Лейк Клуб'}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
