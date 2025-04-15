/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#2E7D32',
        'brand-pink': '#C2185B',
        'brand-neutral-light': '#F5F5F5',
        'brand-neutral-dark': '#424242',
        'brand-text': '#333333',
      },
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'cursive': ['Dancing Script', 'cursive'],
        'title-cursive': ['Great Vibes', 'cursive'],
      },
      keyframes: {
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeOutScale: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.98)' },
        },
        pageLoad: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fall: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(360deg)' },
        },
        fallSlow: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(720deg)' },
        },
        fallFast: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(180deg)' },
        },
        fallVerySlow: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(1080deg)' },
        },
        fallMedium: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(540deg)' },
        },
        fallReverse: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(-720deg)' },
        },
        fallSlowReverse: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(-720deg)' },
        },
        fallFastReverse: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(-180deg)' },
        },
        fallVerySlowReverse: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(-1080deg)' },
        },
        fallMediumReverse: {
          '0%': { top: '-100px', transform: 'translateX(-50%) rotate(0deg)' },
          '100%': { top: '100%', transform: 'translateX(-50%) rotate(-540deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
          '50%': { transform: 'scale(1.1)', opacity: 0.4 },
        },
        fadeTextOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeTextIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeInScale: 'fadeInScale 0.5s ease-out forwards',
        fadeOutScale: 'fadeOutScale 0.4s ease-out forwards',
        pageLoad: 'pageLoad 1s ease-in-out forwards',
        'fall-grace': 'fall 6.8s linear forwards',
        'fall-grace-slow': 'fallSlow 8.5s linear forwards',
        'fall-grace-fast': 'fallFast 5.1s linear forwards',
        'fall-grace-very-slow': 'fallVerySlow 10.2s linear forwards',
        'fall-grace-medium': 'fallMedium 7.65s linear forwards',
        'fall-grace-reverse': 'fallReverse 6.8s linear forwards',
        'fall-grace-slow-reverse': 'fallSlowReverse 8.5s linear forwards',
        'fall-grace-fast-reverse': 'fallFastReverse 5.1s linear forwards',
        'fall-grace-very-slow-reverse': 'fallVerySlowReverse 10.2s linear forwards',
        'fall-grace-medium-reverse': 'fallMediumReverse 7.65s linear forwards',
        'spin-slow': 'spinSlow 15s linear infinite',
        'pulse-subtle': 'pulseSubtle 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-text-out': 'fadeTextOut 0.3s ease-out forwards',
        'fade-text-in': 'fadeTextIn 0.3s ease-out forwards',
      },
      animationDelay: {
        '500': '500ms',
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
      }
    },
  },
  plugins: [],
} 