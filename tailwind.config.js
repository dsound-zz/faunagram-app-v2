/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Urban Animal Theme Colors
        primary: {
          DEFAULT: '#00C853',
          dark: '#00A043',
          light: '#4CAF50',
        },
        secondary: {
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
          light: '#FF9800',
        },
        accent: {
          blue: '#00B4DB',
          purple: '#9C27B0',
        },
        urban: {
          gray: '#2C2C2C',
          light: '#F5F5F5',
        },
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#FF5252',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Bungee', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

