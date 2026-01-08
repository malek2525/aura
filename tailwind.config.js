/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        // Primary coral colors
        coral: {
          DEFAULT: "#FF6B6B",
          light: "#FFE5E5",
          dark: "#E55555",
        },
        // Secondary orange
        orange: {
          DEFAULT: "#FF8E53",
        },
        // Accent gold
        gold: {
          DEFAULT: "#FFC857",
        },
        // Warm neutrals
        warm: {
          white: "#FFF9F5",
          gray: "#F0E6E0",
        },
        // Text colors
        text: {
          main: "#2D3436",
          sec: "#636E72",
          muted: "#B2BEC3",
        },
        // Success/teal
        success: "#4ECDC4",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(255, 107, 107, 0.1)",
        glow: "0 0 15px rgba(255, 107, 107, 0.3)",
        card: "0 2px 8px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 16px rgba(255, 107, 107, 0.1)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(255, 107, 107, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(255, 107, 107, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
