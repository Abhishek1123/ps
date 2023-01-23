/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },

      colors: {
        primary: 'rgb(254 44 85)',
        secondary: '#F51997',
      },
    },
  },
  plugins: [],
};
