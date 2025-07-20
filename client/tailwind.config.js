/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5',
          light: '#a5b4fc',
        },
        accent: '#06b6d4', // cyan-500
        background: '#f8fafc', // slate-50
        surface: '#fff',
        muted: '#e0e7ef',
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#f59e42',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
} 