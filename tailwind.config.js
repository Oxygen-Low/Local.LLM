/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        // Dark theme palette
        dark: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f1f5f9",
        },
        slate: {
          950: "#020617",
        },
        // Accent colors
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        "gradient-dark": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      },
      boxShadow: {
        "lg-dark": "0 10px 25px rgba(0, 0, 0, 0.5)",
        "xl-dark": "0 20px 40px rgba(0, 0, 0, 0.6)",
      },
      transitionDuration: {
        250: "250ms",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in-from-top": "slideInFromTop 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
