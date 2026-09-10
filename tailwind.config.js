/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3BAE6D",
        lightgreen: "#49D185",
        lightergreen: "#87EBB3",
        accentgreen: "#80C89F",
        darkgreen: "#06291E",
        meddarkgreen: "#114B2A",
        medgreen: "#227D4A",
        darker: "#051A13",
        bgdark: "#161616",
        bgdarker: "#444444",
        textgray: "rgba(255, 255, 255, 0.75)",
        surface: "#0d1a13",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
        playfair: ["Playfair Display", "serif"],
      },
      boxShadow: {
        green: "0 0 27px rgba(48, 126, 82, 0.33)",
        'green-strong': "0 0 27px rgba(48, 126, 82, 0.43)",
        glow: "0 0 7.6px rgba(48, 126, 82, 1)",
        button: "0 -1px 13.6px rgba(108, 184, 141, 0.43)",
        hero: "0 6px 69.3px rgba(3, 56, 26, 0.52), 0 1px 16.7px rgba(255, 255, 255, 0.15)",
        modal: "0 16px 48px rgba(0, 0, 0, 0.75), 0 0 24px rgba(73, 209, 133, 0.25)",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "60px",
        full: "137px",
      },
      backgroundImage: {
        'btn-gradient': "linear-gradient(180deg, #87EBB3 0%, #23824C 100%)",
        'card-gradient': "linear-gradient(180deg, #80C89F 0%, #114B2A 52%, #06291E 100%)",
        'footer-gradient': "linear-gradient(180deg, #06291E 25%, #3DA86C 88%)",
        'divider-glow': "linear-gradient(90deg, #06291E, #000000)",
      }
    },
  },
  plugins: [],
};
