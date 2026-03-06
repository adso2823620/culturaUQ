/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F47920',
          navy:   '#1E2B5C',
          blue:   '#3B82F6',
        },
      },
    },
  },
  plugins: [],
};