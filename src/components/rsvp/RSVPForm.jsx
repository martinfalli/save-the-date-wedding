import React, { useEffect, useRef, useState } from 'react';

// Set VITE_GOOGLE_SHEET_URL in project-root .env (see .env.example + google-apps-script/AppendRSVP.gs).
const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;
const LS_KEY = 'rsvp_submitted_names';

function lsHasName(name) {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    return stored.includes(name.toLowerCase().trim());
  } catch { return false; }
}

function lsSaveName(name) {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    stored.push(name.toLowerCase().trim());
    localStorage.setItem(LS_KEY, JSON.stringify(stored));
  } catch {}
}

/** Calls doGet?action=check&name=… on the same GAS URL. Times out after 4 s. */
async function remoteHasName(name) {
  if (!SHEET_URL) return false;
  try {
    const url = `${SHEET_URL}?action=check&name=${encodeURIComponent(name)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    const data = await res.json();
    return data.exists === true;
  } catch { return false; }
}

/** Local time for the sheet, e.g. 2026-03-31 22:50:24 */
function formatDateForSheet(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function RSVPForm({ language, isTextAnimating = false, onSuccess, inverted = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [fields, setFields] = useState({ name: '', songs: '', message: '' });
  const [rsvp, setRsvp] = useState(null);       // 'yes' | 'no' | null
  const [vegetarian, setVegetarian] = useState(null); // 'yes' | 'no' | null
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const validate = (values, currentRsvp) => {
    const errs = {};
    if (!values.name.trim()) {
      errs.name = language === 'en' ? 'Name is required' : 'Името е задължително';
    }
    if (!currentRsvp) {
      errs.rsvp = language === 'en' ? 'Please select Yes or No' : 'Моля, изберете Да или Не';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...fields, [name]: value }, rsvp);
      setErrors(errs);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate({ ...fields, [name]: e.target.value }, rsvp);
    setErrors(errs);
  };

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(''), 5000);
  };

  const handleRsvp = (value) => {
    setRsvp(value);
    if (value === 'no') setVegetarian(null);
    setTouched((prev) => ({ ...prev, rsvp: true }));
    const errs = validate(fields, value);
    setErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, songs: true, message: true, rsvp: true });
    const errs = validate(fields, rsvp);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const trimmedName = fields.name.trim();

    // Duplicate check — localStorage first (instant), then remote sheet
    if (lsHasName(trimmedName) || await remoteHasName(trimmedName)) {
      showToast(
        language === 'en'
          ? `You've already RSVP'd, ${trimmedName.split(' ')[0]}!`
          : `Вече сте потвърдили присъствието си, ${trimmedName.split(' ')[0]}!`
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        date: formatDateForSheet(),
        name: trimmedName,
        songs: fields.songs.trim(),
        message: fields.message.trim(),
        rsvp: rsvp === 'yes' ? 'Yes' : 'No',
        vegetarian: rsvp === 'yes' ? (vegetarian === 'yes' ? 'Yes' : vegetarian === 'no' ? 'No' : '') : '',
      };

      if (SHEET_URL) {
        // Send as URL-encoded form data for Google Apps Script compatibility
        const formData = new URLSearchParams(payload);
        await fetch(SHEET_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
          mode: 'no-cors', // Google Apps Script requires no-cors
        });
      } else {
        // Mock delay when no endpoint is configured
        await new Promise((resolve) => setTimeout(resolve, 1200));
        console.info('[RSVP mock submission]', payload);
      }

      lsSaveName(trimmedName);
      onSuccess(trimmedName);
    } catch (err) {
      setSubmitError(
        language === 'en'
          ? 'Something went wrong. Please try again.'
          : 'Нещо се обърка. Моля, опитайте отново.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const labels = {
    title: language === 'en' ? 'RSVP' : 'Ще дойдете ли?',
    namePlaceholder: language === 'en' ? 'Your name' : 'Име и фамилия',
    nameLabel: language === 'en' ? 'Name' : 'Име',
    rsvpLabel: language === 'en' ? 'Will you attend?' : 'Ще присъствате ли?',
    rsvpYes: language === 'en' ? 'Yes' : 'Да',
    rsvpNo: language === 'en' ? 'No' : 'Не',
    vegetarianLabel: language === 'en' ? 'Would you like a vegetarian menu?' : 'Искате ли вегетарианско меню?',
    songsLabel: language === 'en' ? 'Song suggestions' : 'Предложения за песни',
    songsPlaceholder:
      language === 'en'
        ? 'Songs that will get you on the dancefloor...'
        : 'Песни, които искаш да чуеш 👀',
    messageLabel: language === 'en' ? 'Anything else you want to tell us?' : 'Искате ли да ни кажете още нещо?',
    messagePlaceholder:
      language === 'en'
        ? 'Wishes, thoughts, anything...'
        : 'Мисли, препоръки или нещо друго...',
    submit: language === 'en' ? 'Send' : 'Изпрати',
    submitting: language === 'en' ? 'Sending...' : 'Изпращане...',
  };

  const langFade = isTextAnimating ? 'animate-fade-text-out' : 'animate-fade-text-in';

  const inputClass = (hasError) =>
    `${inverted ? 'form-input-inverted' : 'form-input'} ${hasError ? 'error' : ''}`;

  return (
    <div
      ref={ref}
      className="rsvp-scroll-section px-4 py-3 !items-stretch !justify-start w-full flex flex-col min-h-0"
    >
      <div
        className={`w-full max-w-lg mx-auto min-h-0 flex-1 overflow-y-auto py-2 flex flex-col transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Duplicate RSVP toast */}
        <div
          aria-live="polite"
          className={`overflow-hidden transition-all duration-500 ease-out ${
            toast ? 'max-h-20 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
              inverted
                ? 'bg-[#f5f0e8]/15 text-[#f5f0e8] border border-[#f5f0e8]/25'
                : 'bg-[#003625]/10 text-[#003625] border border-[#003625]/20'
            }`}
          >
            <span className="text-base">✓</span>
            {toast}
          </div>
        </div>

        <h2
          key={`form-title-${language}`}
          className={`font-title-cursive text-6xl sm:text-7xl md:text-5xl lg:text-6xl text-center leading-tight mb-6 ${
            inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'
          } ${langFade}`}
        >
          {labels.title}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              key={`label-name-${language}`}
              className={`block text-sm font-semibold tracking-wide ${
                inverted ? 'text-[#f5f0e8]/85' : 'text-brand-forest/80'
              } ${langFade}`}
            >
              {labels.nameLabel}{' '}
              <span className={inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={fields.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={labels.namePlaceholder}
              autoComplete="name"
              className={inputClass(touched.name && errors.name)}
            />
            {touched.name && errors.name && (
              <p className={`text-red-500 text-sm animate-fade-slide-in ${langFade}`}>{errors.name}</p>
            )}
          </div>

          {/* RSVP yes/no */}
          <div className="space-y-2">
            <label
              key={`label-rsvp-${language}`}
              className={`block text-sm font-semibold tracking-wide ${
                inverted ? 'text-[#f5f0e8]/85' : 'text-brand-forest/80'
              } ${langFade}`}
            >
              {labels.rsvpLabel}{' '}
              <span className={inverted ? 'text-[#f5f0e8]' : 'text-brand-forest'}>*</span>
            </label>
            <div className="flex gap-3">
              {['yes', 'no'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleRsvp(val)}
                  className={`flex-1 py-2.5 rounded-full text-sm font-bold tracking-wide border-2 transition-all duration-150 focus:outline-none focus:ring-2 ${
                    inverted
                      ? rsvp === val
                        ? 'bg-[#f5f0e8] text-[#003625] border-[#f5f0e8]'
                        : 'bg-transparent text-[#f5f0e8]/70 border-[#f5f0e8]/40 hover:border-[#f5f0e8] hover:text-[#f5f0e8]'
                      : rsvp === val
                        ? 'bg-[#003625] text-[#f5f0e8] border-[#003625]'
                        : 'bg-transparent text-[#003625]/60 border-[#003625]/30 hover:border-[#003625] hover:text-[#003625]'
                  } ${inverted ? 'focus:ring-[#f5f0e8]/50' : 'focus:ring-[#003625]/30'}`}
                >
                  {val === 'yes' ? labels.rsvpYes : labels.rsvpNo}
                </button>
              ))}
            </div>
            {touched.rsvp && errors.rsvp && (
              <p className={`text-red-400 text-sm animate-fade-slide-in`}>{errors.rsvp}</p>
            )}
          </div>

          {/* Vegetarian — only if attending */}
          {rsvp === 'yes' && (
            <div className="space-y-2 animate-fade-slide-in">
              <label
                key={`label-veg-${language}`}
                className={`block text-sm font-semibold tracking-wide ${
                  inverted ? 'text-[#f5f0e8]/85' : 'text-brand-forest/80'
                } ${langFade}`}
              >
                {labels.vegetarianLabel}
              </label>
              <div className="flex gap-3">
                {['yes', 'no'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setVegetarian(val)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-bold tracking-wide border-2 transition-all duration-150 focus:outline-none focus:ring-2 ${
                      inverted
                        ? vegetarian === val
                          ? 'bg-[#f5f0e8] text-[#003625] border-[#f5f0e8]'
                          : 'bg-transparent text-[#f5f0e8]/70 border-[#f5f0e8]/40 hover:border-[#f5f0e8] hover:text-[#f5f0e8]'
                        : vegetarian === val
                          ? 'bg-[#003625] text-[#f5f0e8] border-[#003625]'
                          : 'bg-transparent text-[#003625]/60 border-[#003625]/30 hover:border-[#003625] hover:text-[#003625]'
                    } ${inverted ? 'focus:ring-[#f5f0e8]/50' : 'focus:ring-[#003625]/30'}`}
                  >
                    {val === 'yes' ? labels.rsvpYes : labels.rsvpNo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Songs */}
          <div className="space-y-1.5">
            <label
              key={`label-songs-${language}`}
              className={`block text-sm font-semibold tracking-wide ${
                inverted ? 'text-[#f5f0e8]/85' : 'text-brand-forest/80'
              } ${langFade}`}
            >
              {labels.songsLabel}
            </label>
            <textarea
              name="songs"
              value={fields.songs}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={labels.songsPlaceholder}
              rows={3}
              className={`${inputClass(false)} resize-none`}
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label
              key={`label-message-${language}`}
              className={`block text-sm font-semibold tracking-wide ${
                inverted ? 'text-[#f5f0e8]/85' : 'text-brand-forest/80'
              } ${langFade}`}
            >
              {labels.messageLabel}
            </label>
            <textarea
              name="message"
              value={fields.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={labels.messagePlaceholder}
              rows={4}
              className={`${inputClass(false)} resize-none`}
            />
          </div>

          {/* Error */}
          {submitError && (
            <p className={`text-red-500 text-sm text-center animate-fade-slide-in ${langFade}`}>
              {submitError}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-8 rounded-full font-bold tracking-wide transition-[box-shadow,background-color,opacity] duration-200 ease-out shadow-md focus:outline-none focus:ring-2
              ${
                inverted
                  ? `border-2 border-[#f5f0e8] text-[#f5f0e8] bg-transparent focus:ring-[#f5f0e8] focus:ring-offset-2 focus:ring-offset-[#003625] ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-[#f5f0e8]/12 hover:shadow-lg active:bg-[#f5f0e8]/18'
                    }`
                  : `text-white bg-[#003625] focus:ring-[#003625] focus:ring-offset-2 focus:ring-offset-[#f5f0e8] ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-xl hover:brightness-[1.03] active:brightness-[0.97]'
                    }`
              }`}
          >
            {isSubmitting ? (
              <span className={`flex items-center justify-center gap-2 ${langFade}`}>
                <span
                  className={`inline-block w-4 h-4 border-2 rounded-full animate-spin ${
                    inverted
                      ? 'border-[#f5f0e8]/30 border-t-[#f5f0e8]'
                      : 'border-white/30 border-t-white'
                  }`}
                />
                {labels.submitting}
              </span>
            ) : (
              <span key={`submit-${language}`} className={langFade}>
                {labels.submit}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
