/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0F172A',
        },
        gold: {
          500: '#C5A47E',
          600: '#B08F69',
        }
      }
    },
  },
  plugins: [
    aspectRatio // Add the aspect-ratio plugin here
  ],
}