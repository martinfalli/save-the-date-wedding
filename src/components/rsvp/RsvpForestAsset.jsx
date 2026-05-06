import React from 'react';
import { RSVP_INVERT_FOREST_TO_CREAM_FILTER } from '../../constants/rsvpPalette';

const MASK = (src) => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  WebkitMaskMode: 'alpha',
  maskMode: 'alpha',
});

/**
 * Forest SVG (#003625) in normal mode; inverted → #f5f0e8.
 * `mask` = exact cream via CSS mask; `filter` = tuned filter (needed for SVGs with text, where masks often fail).
 */
export default function RsvpForestAsset({ src, inverted, className = '', invertedMode = 'mask' }) {
  if (!inverted) {
    return <img src={src} alt="" className={className} />;
  }
  if (invertedMode === 'filter') {
    return (
      <img
        src={src}
        alt=""
        className={className}
        style={{ filter: RSVP_INVERT_FOREST_TO_CREAM_FILTER }}
      />
    );
  }
  return (
    <span className="relative block w-full max-h-full min-h-0 min-w-0">
      <img src={src} alt="" aria-hidden className={`block ${className} invisible`} />
      <span
        className="pointer-events-none absolute inset-0 bg-[#f5f0e8]"
        style={MASK(src)}
        aria-hidden
      />
    </span>
  );
}
