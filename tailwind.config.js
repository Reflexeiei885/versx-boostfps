/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matte: '#080a08',
        charcoal: '#121612',
        accent: '#aab4a6',
        'glow-green': '#63db00',
        'glow-blue': '#55aaff',
        'glow-red': '#ff4d4d',
        slate: '#8d988b'
      },
      boxShadow: {
        'green-glow': '0 0 24px rgba(99,219,0,.25)'
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(5px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'pulse-glow': { '0%,100%': { boxShadow: '0 0 0 rgba(99,219,0,0)' }, '50%': { boxShadow: '0 0 12px rgba(99,219,0,.7)' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } }
      },
      animation: {
        'fade-in': 'fade-in .35s ease-out',
        'pulse-glow': 'pulse-glow 1.8s ease-in-out infinite',
        'slide-up': 'slide-up .4s ease-out'
      }
    }
  },
  plugins: []
};
