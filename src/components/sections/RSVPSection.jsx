import React, { useState, useRef } from 'react';
import RSVPIntro from '../rsvp/RSVPIntro';
import RSVPTimeline from '../rsvp/RSVPTimeline';
import RSVPForm from '../rsvp/RSVPForm';
import RSVPSuccess from '../rsvp/RSVPSuccess';
import RSVPStarsBackground from '../rsvp/RSVPStarsBackground';

export default function RSVPSection({ language, isTextAnimating, inverted, onToggleInverted }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitterName, setSubmitterName] = useState('');
  const rsvpScrollRef = useRef(null);

  const handleSuccess = (name) => {
    setSubmitterName(name);
    setSubmitted(true);
    setTimeout(() => {
      const el = document.getElementById('rsvp-success');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section
      id="rsvp"
      className={`relative h-[calc(100dvh-3.5rem)] min-h-0 flex flex-col transition-colors duration-300 ${
        inverted ? 'bg-[#003625]' : 'bg-[#f5f0e8]'
      }`}
    >
      <RSVPStarsBackground scrollContainerRef={rsvpScrollRef} inverted={inverted} />
      <div ref={rsvpScrollRef} className="rsvp-scroll-container relative z-10 flex-1 min-h-0">
        <RSVPIntro
          language={language}
          isTextAnimating={isTextAnimating}
          inverted={inverted}
          onToggleInverted={onToggleInverted}
        />
        <RSVPTimeline language={language} isTextAnimating={isTextAnimating} inverted={inverted} />

        {!submitted ? (
          <RSVPForm
            language={language}
            isTextAnimating={isTextAnimating}
            onSuccess={handleSuccess}
            inverted={inverted}
          />
        ) : (
          <RSVPSuccess
            id="rsvp-success"
            language={language}
            isTextAnimating={isTextAnimating}
            submitterName={submitterName}
            inverted={inverted}
          />
        )}
      </div>
    </section>
  );
}
