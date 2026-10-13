/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      fontFamily: {
        sans: ['Figtree', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cobalt: {
          DEFAULT: '#2347F5',
          dark: '#1635D6',
          light: '#E8ECFE',
        },
        oxblood: {
          DEFAULT: '#7A2E3A',
          dark: '#5C1D27',
          light: '#F4E6E8',
        },
        paper: '#F6F7F9',
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        ink: {
          50: '#F7F8FA',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#15171C',
          950: '#0B0F14',
        },
      },
      maxWidth: {
        page: '1280px',
      },
    },
  },
  plugins: [],
};
