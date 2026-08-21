/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#063023",
        primaryAccent: "#254F42",
        secondary: "#DBAA68",

        white: "#F2F2F2",
        black: "#000000",

        background: "#F8F7F3",
        surface: "#FFFFFF",
        surfaceDark: "#0B211A",

        text: "#17211D",
        textSecondary: "#5F6B65",
        textMuted: "#8A948F",

        border: "#D9DED9",

        success: "#2E7D5B",
        warning: "#C58A32",
        error: "#B94A48",
        info: "#3F7185",

        green: {
          50: "#F0F6F3",
          100: "#DCEBE5",
          200: "#B9D6C9",
          300: "#8EB9A8",
          400: "#629985",
          500: "#3F7964",
          600: "#2E5F4D",
          700: "#254F42",
          800: "#123D30",
          900: "#063023",
        },

        gold: {
          50: "#FCF8F1",
          100: "#F8EEDC",
          200: "#F0D9B5",
          300: "#E7C48E",
          400: "#DBAA68",
          500: "#C9944F",
          600: "#AD783C",
          700: "#8C5D2F",
          800: "#684421",
          900: "#472D17",
        },
      },
    },
  },

  plugins: [],
};
