/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        edu: {
          bg: "var(--edu-bg)",
          surface1: "var(--edu-surface1)",
          surface2: "var(--edu-surface2)",
          border: "var(--edu-border)",
          divider: "var(--edu-divider)",
          primary: "var(--edu-primary)",
          primaryHover: "var(--edu-primaryHover)",
          xp: "var(--edu-xp)",
          streak: "var(--edu-streak)",
          error: "var(--edu-error)",
          success: "var(--edu-success)",
          codeHighlight: "var(--edu-codeHighlight)",
          textPrimary: "var(--edu-textPrimary)",
          textSecondary: "var(--edu-textSecondary)",
          textMuted: "var(--edu-textMuted)",
          codeBg: "var(--edu-codeBg)",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      }
    }
  },
  plugins: [],
};
