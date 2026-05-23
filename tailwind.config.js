/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        linen: "#f5f0e8",
        oat: "#ded2ba",
        stonegreen: "#677269",
        ink: "#171614",
        clay: "#b9aa94",
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(23, 22, 20, 0.12)",
      },
    },
  },
  plugins: [],
};
