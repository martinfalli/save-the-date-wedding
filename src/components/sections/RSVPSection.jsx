import React, { useState, useRef } from 'react';
import { scrollRsvpTo } from '../../utils/scrollRsvp';
import RSVPIntro from '../rsvp/RSVPIntro';
import RSVPTimeline from '../rsvp/RSVPTimeline';
import RSVPForm from '../rsvp/RSVPForm';
import RSVPSuccess from '../rsvp/RSVPSuccess';
import RSVPInfo from '../rsvp/RSVPInfo';
import RSVPStarsBackground from '../rsvp/RSVPStarsBackground';

export default function RSVPSection({ language, isTextAnimating, inverted, onToggleInverted }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitterName, setSubmitterName] = useState('');
  const rsvpScrollRef = useRef(null);

  const handleSuccess = (name) => {
    setSubmitterName(name);
    setSubmitted(true);
    setTimeout(() => scrollRsvpTo('rsvp-success'), 100);
  };

  const handleEdit = () => {
    setSubmitted(false);
    setTimeout(() => scrollRsvpTo('rsvp-form-panel'), 50);
  };

  return (
    <section
      id="rsvp"
      className={`relative min-h-0 flex flex-col transition-colors duration-300 ${
        inverted ? 'bg-[#003625]' : 'bg-[#f5f0e8]'
      }`}
      style={{ height: 'calc(100dvh - var(--nav-h))' }}
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
        <RSVPInfo language={language} isTextAnimating={isTextAnimating} inverted={inverted} />

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
            onEdit={handleEdit}
          />
        )}
      </div>
    </section>
  );
}
