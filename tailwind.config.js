/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ===== Background =====
        background: "#08090d",
        backgroundSoft: "#0d0f15",
        backgroundMuted: "#10121a",

        // ===== Surfaces =====
        surface: "#11131a",
        surfaceSoft: "#171923",
        surfaceHard: "#0a0b10",
        surfaceMuted: "#1b1e28",
        surfaceElevated: "#20232e",

        // ===== Text =====
        textPrimary: "#f5f7fa",
        textSecondary: "#c4c9d4",
        textMuted: "#8b91a1",
        textDisabled: "#555b69",
        textDark: "#08090d",

        // ===== Primary Brand =====
        primary: "#ffb800",
        primarySoft: "#ffd666",
        primaryHover: "#e5a600",
        primaryMuted: "#6b4d00",

        // ===== Secondary Brand =====
        secondary: "#6366f1",
        secondarySoft: "#818cf8",
        secondaryHover: "#4f46e5",
        secondaryMuted: "#312e81",

        // ===== UI =====
        hover: "#1d202a",
        active: "#252936",
        border: "#292d38",
        borderSoft: "#20232c",
        divider: "#1b1e26",
        overlay: "#000000",

        // ===== Status =====
        success: "#22c55e",
        successSoft: "#14532d",

        warning: "#f59e0b",
        warningSoft: "#78350f",

        error: "#ef4444",
        errorSoft: "#7f1d1d",

        info: "#38bdf8",
        infoSoft: "#0c4a6e",

        // ===== Gaming / Accent =====
        blue: "#3b82f6",
        purple: "#a855f7",
        pink: "#ec4899",

        // ===== Shadow =====
        shadow: "#000000",
      },
    },
  },
  plugins: [],
};
