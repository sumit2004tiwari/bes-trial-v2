/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        countdownTitleEnter: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        countdownTitleInteractive: {
          "0%, 100%": {
            backgroundPosition: "100% 0",
            filter: "brightness(1)",
            textShadow: "0 0 0 rgba(34, 47, 218, 0)",
            transform: "translateY(0) scale(1)",
          },
          "50%": {
            backgroundPosition: "0 0",
            filter: "brightness(1.18)",
            textShadow:
              "0 3px 12px rgba(34, 47, 218, 0.28), 0 0 16px rgba(117, 194, 76, 0.22)",
            transform: "translateY(-2px) scale(1.025)",
          },
        },
      },
      animation: {
        "countdown-title-enter": "countdownTitleEnter 850ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "countdown-title-interactive": "countdownTitleInteractive 5.5s ease-in-out 1.1s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  important: false, // ensures Tailwind utilities don't override MUI
};
