/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#262422',
        'orange-button': '#f76d1b',
        'customHover': '#3b3c5e',
        'custom-Red': '#e93448'
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