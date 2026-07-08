/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm sand / cream neutrals
        sand: {
          50: '#fbf8f4',
          100: '#f5efe6',
          200: '#ebe0cf',
          300: '#dcc9ad',
          400: '#c8ad88',
          500: '#b8966c',
          600: '#a87f57',
          700: '#8a6748',
          800: '#6f533b',
          900: '#5a4431',
        },
        // Deep rose / wine accent
        sage: {
          50: '#fbf4f6',
          100: '#f7e7ec',
          200: '#efcfda',
          300: '#e2a8ba',
          400: '#cd7893',
          500: '#a94463',
          600: '#7F2D45',
          700: '#6d253b',
          800: '#5a2133',
          900: '#4c1f2d',
        },
        // Soft terracotta / clay — accent
        clay: {
          50: '#fbf4f1',
          100: '#f5e6df',
          200: '#e9c9bb',
          300: '#d9a48d',
          400: '#c87d5f',
          500: '#b8623f',
          600: '#9d4e30',
          700: '#7f3e27',
          800: '#653322',
          900: '#522b1e',
        },
        // Warm ink / charcoal neutrals
        ink: {
          50: '#f7f6f4',
          100: '#eeece8',
          200: '#dad7d0',
          300: '#bbb6ab',
          400: '#948e80',
          500: '#736d60',
          600: '#5b564c',
          700: '#46423a',
          800: '#2f2c26',
          900: '#1c1a16',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        soft: '0 2px 20px -8px rgba(47, 44, 38, 0.12)',
        card: '0 8px 30px -12px rgba(47, 44, 38, 0.18)',
        lift: '0 20px 50px -20px rgba(47, 44, 38, 0.28)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'soft-pulse': 'soft-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
