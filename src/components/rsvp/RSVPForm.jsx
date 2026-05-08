import React, { useEffect, useRef, useState } from 'react';

// Set VITE_GOOGLE_SHEET_URL in project-root .env (see .env.example + google-apps-script/AppendRSVP.gs).
const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;
function formatDateForSheet(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}


async function fetchGroup(name) {
  if (!SHEET_URL) {
    // Mock for local dev
    await new Promise((r) => setTimeout(r, 700));
    return {
      found: true,
      members: [
        { name: 'Симона', alreadyRsvpd: false },
        { name: 'Мартин', alreadyRsvpd: false },
      ],
    };
  }
  const url = `${SHEET_URL}?action=list&name=${encodeURIComponent(name)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export default function RSVPForm({ language, isTextAnimating = false, onSuccess, inverted = false }) {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const toastTimer = useRef(null);

  // Step 1 — name search
  const [nameInput, setNameInput] = useState('');
  const [groupState, setGroupState] = useState('idle'); // 'idle'|'searching'|'found'|'notfound'|'ambiguous'|'error'

  // Step 2 — group members: [{ name, attending, vegetarian: null|'yes'|'no', alreadyRsvpd }]
  const [groupMembers, setGroupMembers] = useState([]);

  // Step 3 — shared fields
  const [fields, setFields] = useState({ songs: '', message: '' });
  const [transport, setTransport] = useState(null); // 'car'|'taxi'|'other'|null

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(''), 6000);
  };

  const handleSearch = async () => {
    const name = nameInput.trim();
    if (!name) return;
    setGroupState('searching');
    setSubmitError(null);
    try {
      const data = await fetchGroup(name);
      if (!data.found) {
        setGroupState(data.reason === 'ambiguous' ? 'ambiguous' : 'notfound');
        return;
      }
      const members = data.members.map((m) => ({
        name: m.name,
        sheetName: m.sheetName,
        isPlus1: m.isPlus1 || false,
        guestName: '',
        attending: true,
        vegetarian: null,
        alreadyRsvpd: m.alreadyRsvpd,
      }));
      setGroupMembers(members);
      setGroupState('found');
      // Scroll inner container back to top so the title stays visible
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      });
      if (members.some((m) => m.alreadyRsvpd)) {
        showToast(
          language === 'en'
            ? `You've already RSVP'd, ${name.split(' ')[0]}! You can update your response below.`
            : `Вече си потвърдил/а, ${name.split(' ')[0]}! Можеш да актуализираш отговора си.`
        );
      }
    } catch {
      setGroupState('error');
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
  };

  const toggleAttending = (i) => {
    setGroupMembers((prev) =>
      prev.map((m, idx) =>
        idx === i ? { ...m, attending: !m.attending, vegetarian: m.attending ? null : m.vegetarian } : m
      )
    );
  };

  const setVegetarian = (i, val) => {
    setGroupMembers((prev) =>
      prev.map((m, idx) => idx === i ? { ...m, vegetarian: val } : m)
    );
  };

  const setGuestName = (i, val) => {
    setGroupMembers((prev) =>
      prev.map((m, idx) => idx === i ? { ...m, guestName: val } : m)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupMembers.length) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const membersPayload = groupMembers.map((m) => ({
        name: m.name,
        sheetName: m.sheetName,
        rsvp: m.attending ? 'Yes' : 'No',
        vegetarian: m.attending
          ? (m.vegetarian === 'yes' ? 'Yes' : m.vegetarian === 'no' ? 'No' : '')
          : '',
        guestName: m.isPlus1 ? m.guestName.trim() : '',
      }));
      const transportMap = { car: 'Кола', taxi: 'Такси', other: 'Друг транспорт' };
      const payload = {
        date: formatDateForSheet(),
        submitter: nameInput.trim(),
        songs: fields.songs.trim(),
        message: fields.message.trim(),
        transport: transport ? (transportMap[transport] || '') : '',
        members: JSON.stringify(membersPayload),
      };
      if (SHEET_URL) {
        const formData = new URLSearchParams(payload);
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
          mode: 'no-cors',
        });
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        console.info('[RSVP mock submission]', payload);
      }
      onSuccess(nameInput.trim());
    } catch {
      setSubmitError(
        language === 'en'
          ? 'Something went wrong. Please try again.'
          : 'Нещо се обърка. Моля, опитайте отново.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const L = {
    title:              language === 'en' ? 'RSVP' : 'Покана',
    deadline:           language === 'en' ? 'Deadline to RSVP: 1 June' : 'Краен срок за попълване: 1 Юни',
    nameLabel:          language === 'en' ? 'Your name' : 'Твоето Име',
    namePlaceholder:    language === 'en' ? 'First name (+ surname if needed)' : 'Имe (+ фамилия, ако е нужно)',
    searchBtn:          language === 'en' ? 'Find' : 'Намери',
    searching:          language === 'en' ? 'Searching…' : 'Търсене…',
    notFound:           language === 'en'
      ? 'Name not found. Check the spelling or contact us.'
      : 'Името не е намерено. Провери изписването или се свържи с нас.',
    ambiguous:          language === 'en'
      ? 'More than one person found with this name. Please add your surname.'
      : 'Намерени са повече от едно такива имена. Моля, добави фамилия.',
    searchError:        language === 'en' ? 'Could not connect. Please try again.' : 'Грешка при свързване. Опитай отново.',
    whosComing:         language === 'en' ? 'Who is coming?' : 'Кой ще дойде?',
    plus1Label:         language === 'en' ? '+1 Guest' : 'Гост +1',
    guestNameLabel:     language === 'en' ? "Guest's name" : 'Име на госта',
    guestNamePlaceholder: language === 'en' ? 'First and last name' : 'Име и фамилия',
    vegLabel:           (name) => language === 'en' ? `${name} - Vegetarian menu?` : `${name} - Вегетарианско меню?`,
    yes:                language === 'en' ? 'Yes' : 'Да',
    no:                 language === 'en' ? 'No' : 'Не',
    transportLabel:     language === 'en' ? 'How are you getting there?' : 'С какво превозно средство смятате да дойдете?',
    transportOpts:      language === 'en'
      ? [{ val: 'car', label: 'Car' }, { val: 'taxi', label: 'Taxi' }, { val: 'other', label: 'Other' }]
      : [{ val: 'car', label: 'Кола' }, { val: 'taxi', label: 'Такси' }, { val: 'other', label: 'Друг транспорт' }],
    songsLabel:         language === 'en' ? 'Song suggestions' : 'Предложения за песни',
    songsPlaceholder:   language === 'en'
      ? 'Songs that will get you on the dancefloor…'
      : groupMembers.filter((m) => m.attending).length > 1
        ? 'Песни, които искате да чуете 👀'
        : 'Песни, които искаш да чуеш 👀',
    messageLabel:       language === 'en'
      ? 'Anything else you want to tell us?'
      : groupMembers.filter((m) => m.attending).length > 1
        ? 'Искате ли да ни кажете още нещо?'
        : 'Искаш ли да ни кажеш още нещо?',
    messagePlaceholder: language === 'en' ? 'Wishes, thoughts, anything…' : 'Мисли, препоръки или нещо друго…',
    submit:             language === 'en' ? 'Send' : 'Изпрати',
    submitting:         language === 'en' ? 'Sending…' : 'Изпращане…',
  };

  const langFade   = isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in';
  const inputBase  = inverted ? 'form-input-inverted' : 'form-input';
  const labelClass = `block text-sm font-semibold tracking-wide ${inverted ? 'text-[#f5f0e8]/85' : 'text-brand-forest/80'} ${langFade}`;
  const pillActive = inverted
    ? 'bg-[#f5f0e8] text-[#003625] border-[#f5f0e8]'
    : 'bg-[#003625] text-[#f5f0e8] border-[#003625]';
  const pillIdle   = inverted
    ? 'bg-transparent text-[#f5f0e8]/70 border-[#f5f0e8]/40 hover:border-[#f5f0e8] hover:text-[#f5f0e8]'
    : 'bg-transparent text-[#003625]/60 border-[#003625]/30 hover:border-[#003625] hover:text-[#003625]';
  const pillRing   = inverted ? 'focus:ring-[#f5f0e8]/50' : 'focus:ring-[#003625]/30';
  const pillBase   = `flex-1 py-2.5 rounded-full text-sm font-bold tracking-wide border-2 transition-all duration-150 focus:outline-none focus:ring-2 ${pillRing}`;

  return (
    <div
      id="rsvp-form-panel"
      ref={ref}
      className="rsvp-scroll-section px-4 py-3 !items-stretch !justify-start w-full flex flex-col min-h-0"
    >
      <div
        ref={scrollRef}
        className={`w-full max-w-lg mx-auto min-h-0 flex-1 overflow-y-auto py-2 flex flex-col transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Toast */}
        <div
          aria-live="polite"
          className={`overflow-hidden transition-all duration-500 ease-out ${
            toast ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
            inverted
              ? 'bg-[#f5f0e8]/15 text-[#f5f0e8] border border-[#f5f0e8]/25'
              : 'bg-[#003625]/10 text-[#003625] border border-[#003625]/20'
          }`}>
            <span className="text-base shrink-0">✓</span>
            <span>{toast}</span>
          </div>
        </div>

        {/* Title */}
        <h2
          key={`form-title-${language}`}
          className={`font-title-cursive text-6xl sm:text-7xl md:text-5xl lg:text-6xl text-center leading-tight mb-4 ${
            inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
          } ${langFade}`}
        >
          {L.title}
        </h2>

        {/* Deadline */}
        <p
          key={`deadline-${language}`}
          className={`font-title-cursive text-center text-2xl sm:text-3xl leading-snug rounded-2xl px-5 py-3.5 mb-6 ${
            inverted
              ? 'bg-[#f5f0e8] text-[#003625] shadow-lg shadow-black/20'
              : 'bg-[#003625] text-[#f5f0e8] shadow-md'
          } ${langFade}`}
        >
          {L.deadline}
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* ── Name search ── */}
          <div className="space-y-1.5">
            <label className={labelClass}>{L.nameLabel}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (groupState !== 'idle') { setGroupState('idle'); setGroupMembers([]); setSubmitError(null); }
                }}
                onKeyDown={handleNameKeyDown}
                placeholder={L.namePlaceholder}
                autoComplete="name"
                className={`${inputBase} flex-1`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!nameInput.trim() || groupState === 'searching' || isSubmitting}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide border-2 transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-40 ${
                  inverted
                    ? 'border-[#f5f0e8] text-[#f5f0e8] hover:bg-[#f5f0e8]/15'
                    : 'border-[#003625] text-[#003625] hover:bg-[#003625]/10'
                } ${pillRing}`}
              >
                {groupState === 'searching' ? L.searching : L.searchBtn}
              </button>
            </div>
            {groupState === 'notfound' && (
              <p className="text-red-400 text-sm animate-fade-slide-in">{L.notFound}</p>
            )}
            {groupState === 'ambiguous' && (
              <p className="text-amber-500 text-sm animate-fade-slide-in">{L.ambiguous}</p>
            )}
            {groupState === 'error' && (
              <p className="text-red-400 text-sm animate-fade-slide-in">{L.searchError}</p>
            )}
          </div>

          {/* ── Group members ── */}
          {groupState === 'found' && groupMembers.length > 0 && (
            <div className="space-y-3 animate-fade-slide-in">
              <p className={labelClass}>{L.whosComing}</p>
              {groupMembers.map((member, i) => (
                <div key={member.name}>
                  {/* Checkbox row */}
                  <button
                    type="button"
                    onClick={() => toggleAttending(i)}
                    className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border-2 transition-all duration-150 text-left ${
                      member.attending
                        ? inverted
                          ? 'border-[#f5f0e8]/55 bg-[#f5f0e8]/8'
                          : 'border-[#003625]/45 bg-[#003625]/5'
                        : inverted
                          ? 'border-[#f5f0e8]/20 opacity-50'
                          : 'border-[#003625]/15 opacity-50'
                    }`}
                  >
                    {/* Custom checkbox */}
                    <span className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                      member.attending
                        ? inverted ? 'bg-[#f5f0e8] border-[#f5f0e8]' : 'bg-[#003625] border-[#003625]'
                        : inverted ? 'bg-transparent border-[#f5f0e8]/40' : 'bg-transparent border-[#003625]/30'
                    }`}>
                      {member.attending && (
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden>
                          <path
                            d="M2 6l3 3 5-5"
                            stroke={inverted ? '#003625' : '#f5f0e8'}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className={`font-sans font-bold text-base ${inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'}`}>
                      {member.isPlus1 ? member.name : member.name.split(' ')[0]}
                    </span>
                    {member.alreadyRsvpd && (
                      <span className={`ml-auto text-xs font-semibold ${inverted ? 'text-[#f5f0e8]/50' : 'text-brand-forest/45'}`}>
                        ✓
                      </span>
                    )}
                  </button>

                  {/* +1 guest name input */}
                  {member.isPlus1 && member.attending && (
                    <div className="mt-2 ml-4 space-y-1.5 animate-fade-slide-in">
                      <p className={`text-xs font-semibold tracking-wide ${inverted ? 'text-[#f5f0e8]/65' : 'text-brand-forest/60'}`}>
                        {L.guestNameLabel}
                      </p>
                      <input
                        type="text"
                        value={member.guestName}
                        onChange={(e) => setGuestName(i, e.target.value)}
                        placeholder={L.guestNamePlaceholder}
                        autoComplete="off"
                        className={inputBase}
                      />
                    </div>
                  )}

                  {/* Vegetarian toggle per attending member */}
                  {member.attending && (
                    <div className="mt-2 ml-4 space-y-1.5 animate-fade-slide-in">
                      <p className={`text-xs font-semibold tracking-wide ${inverted ? 'text-[#f5f0e8]/65' : 'text-brand-forest/60'}`}>
                        {L.vegLabel(member.isPlus1 ? (member.guestName.trim() || member.name) : member.name.split(' ')[0])}
                      </p>
                      <div className="flex gap-2">
                        {['yes', 'no'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setVegetarian(i, val)}
                            className={`${pillBase} ${member.vegetarian === val ? pillActive : pillIdle}`}
                          >
                            {val === 'yes' ? L.yes : L.no}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Songs + Message + Submit (once group is found) ── */}
          {groupState === 'found' && (
            <>
              {/* Transport — only when someone is attending */}
              {groupMembers.some((m) => m.attending) && (
                <div className="space-y-2 animate-fade-slide-in">
                  <label className={labelClass}>{L.transportLabel}</label>
                  <div className="flex gap-2 flex-wrap">
                    {L.transportOpts.map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setTransport(val)}
                        className={`${pillBase} ${transport === val ? pillActive : pillIdle}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className={labelClass}>{L.songsLabel}</label>
                <textarea
                  value={fields.songs}
                  onChange={(e) => setFields((p) => ({ ...p, songs: e.target.value }))}
                  placeholder={L.songsPlaceholder}
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>{L.messageLabel}</label>
                <textarea
                  value={fields.message}
                  onChange={(e) => setFields((p) => ({ ...p, message: e.target.value }))}
                  placeholder={L.messagePlaceholder}
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
              </div>

              {submitError && (
                <p className={`text-red-500 text-sm text-center animate-fade-slide-in ${langFade}`}>
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-8 rounded-full font-bold tracking-wide transition-[box-shadow,background-color,opacity] duration-200 ease-out shadow-md focus:outline-none focus:ring-2 ${
                  inverted
                    ? `border-2 border-[#f5f0e8] text-[#f5f0e8] bg-transparent focus:ring-[#f5f0e8] focus:ring-offset-2 focus:ring-offset-[#003625] ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#f5f0e8]/12 hover:shadow-lg active:bg-[#f5f0e8]/18'
                      }`
                    : `text-white bg-[#003625] focus:ring-[#003625] focus:ring-offset-2 focus:ring-offset-[#f5f0e8] ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:brightness-[1.03] active:brightness-[0.97]'
                      }`
                }`}
              >
                {isSubmitting ? (
                  <span className={`flex items-center justify-center gap-2 ${langFade}`}>
                    <span className={`inline-block w-4 h-4 border-2 rounded-full animate-spin ${
                      inverted ? 'border-[#f5f0e8]/30 border-t-[#f5f0e8]' : 'border-white/30 border-t-white'
                    }`} />
                    {L.submitting}
                  </span>
                ) : (
                  <span key={`submit-${language}`} className={langFade}>{L.submit}</span>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
