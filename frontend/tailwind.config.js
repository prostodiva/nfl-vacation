/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#262422',
        'orange-button': '#f76d1b',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.font-stretch-condensed': {
          'font-stretch': 'condensed',
        },
      })
    },
  ],
};