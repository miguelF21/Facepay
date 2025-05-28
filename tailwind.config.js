// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Usa directamente las variables CSS sin hsl()
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // Gradientes usando variables CSS directamente
        'gradient-blue': 'var(--primary)',
        'gradient-red': 'var(--destructive)',
        'gradient-purple': 'var(--chart-2)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Añade estas extensiones para soportar las utilidades personalizadas
      fontSize: {
        'xxs': ['0.65rem', '1rem'],
        'xxxs': ['0.55rem', '0.75rem'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'enhanced-bounce': 'enhanced-bounce 1.5s ease infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
        'enhanced-bounce': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
          '60%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [
    // Plugin para añadir utilidades de transform 3D
    function ({ addUtilities }) {
      const newUtilities = {
        '.rotate-hover': {
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(6deg)',
          }
        },
        '.smooth-transition': {
          transition: 'all 0.3s ease-out',
        }
      }
      addUtilities(newUtilities)
    }
  ],
};