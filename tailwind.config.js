/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#4E6D5E",
        ink: "#24211F",
        muted: "#6F6A63",
        cream: "#FBF8F2",
        warm: "#F2EFE9",
        beige: "#DFD3BD",
        white: "#FFFFFF",
        softborder: "#D7D0C6",
        linen: "#FBF8F2",
        oat: "#DFD3BD",
        stonegreen: "#4E6D5E",
        clay: "#D7D0C6",
      },
      fontFamily: {
        sans: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Newsreader"', "Georgia", "serif"],
      },
      maxWidth: {
        site: "1280px",
      },
      spacing: {
        18: "4.5rem",
        24: "6rem",
        32: "8rem",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(36, 33, 31, 0.12)",
      },
    },
  },
  plugins: [],
};
