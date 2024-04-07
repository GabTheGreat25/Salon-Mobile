/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  prefix: "",
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/**/**.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#FFB6C1",
          variant: "#FFC0CB",
          accent: "#FF7086",
          t2: "#FFCDD5",
          t3: "#FFD1D7",
          t4: "#FFDBE0",
          t5: "#FFE5E9",
        },
        secondary: {
          default: "#FF45AA",
          variant: "#FF7AC2",
          accent: "#FF1493",
          t2: "#FF9FD3",
          t3: "#FFAFDB",
          t4: "#FFC1E3",
          t5: "#FFDBEF",
        },
        neutral: {
          light: "#e5e5e5",
          dark: "#000000",
          primary: "#212B36",
          secondary: "#5E738A",
          800: "#333F4D",
          700: "#425263",
          600: "#516579",
          300: "#8D9DAE",
          200: "#ADB9C6",
          100: "#CCD5DE",
          50: "#F4F6F8",
        },
      },
    },
  },
  plugins: [],
};
