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
        // Calm sage / eucalyptus greens — primary
        sage: {
          50: '#f3f7f4',
          100: '#e3ede5',
          200: '#c7dccc',
          300: '#a0c4a8',
          400: '#74a782',
          500: '#548a66',
          600: '#3f6e4f',
          700: '#345840',
          800: '#2b4734',
          900: '#243a2c',
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
