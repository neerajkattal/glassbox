/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', "Nunito", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        // "Glass box" palette: lab-notebook paper, ink-navy structure, and the
        // amber of a firing neuron as the one accent colour.
        paper: "#faf7f0",
        ink: "#182033",
        brand: {
          50: "#eef1f6",
          100: "#dde3ee",
          400: "#6e7fa6",
          500: "#3e5080",
          600: "#22315a",
          700: "#172240",
        },
        bulb: {
          off: "#e5e7eb",
          on: "#fbbf24",
          glow: "#fde68a",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px rgb(23 34 64 / 0.08)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-6deg)" },
          "75%": { transform: "rotate(6deg)" },
        },
      },
      animation: {
        pop: "pop 220ms ease-out",
        wiggle: "wiggle 400ms ease-in-out 2",
      },
    },
  },
  plugins: [],
};
