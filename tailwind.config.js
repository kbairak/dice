/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary purple theme
        primary: {
          DEFAULT: '#aa3bff',
          light: 'rgba(170, 59, 255, 0.1)',
          border: 'rgba(170, 59, 255, 0.5)',
        },
        // Dark mode purple
        'primary-dark': '#c084fc',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  darkMode: 'media', // Use prefers-color-scheme
  plugins: [],
};
