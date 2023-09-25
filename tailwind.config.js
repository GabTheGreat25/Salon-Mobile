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
          default: "#FDA7DF",
          variant: "#FDB9E5",
          accent: "#F78FB3",
          t2: "#FECAEC",
          t3: "#FED3EF",
          t4: "#FEDCF2",
          t5: "#FEE9F7",
        },
        secondary: {
          primary: "#E056FD",
          variant: "#E678FD",
          accent: "#BE2EDD",
          t2: "#EC9AFE",
          t3: "#F0ABFE",
          t4: "#F3BBFE",
          t5: "#F9DDFF",
        },
        neutral: {
          light: "#ffffff",
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
