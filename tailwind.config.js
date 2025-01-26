/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-once": {
          "0%, 100%": {
            transform: "translateY(-5%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        "bounce-once": "bounce-once 3s ease-in-out",
      },
      colors: {
        map: {
          background: "#e3f2fd", // Lightest sky blue
          border: "#90caf9", // Slate gray for borders
          fill: "#bbdefb", // Muted sky blue for country fill
          accent1: "#26a69a", // Deep sky blue
          accent2: "#ff7043", // Rich slate blue
        },
        primary: {
          DEFAULT: "#7daea3",
        },
        background: {
          DEFAULT: "#282828",
          light: "#3D4445",
          lighter: "#4A4A4A",
        },
        accent: {
          DEFAULT: "#D3869B",
          alt: "#DDC7A1",
        },
        green: {
          DEFAULT: "rgb(169, 182, 101)",
        },
        white: {
          DEFAULT: "#EDEDED",
        },
      },
    },
  },
  plugins: [],
};
