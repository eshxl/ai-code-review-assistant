/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#0d1117',      // GitHub Dark Background
          panel: '#161b22',   // Cards and panels
          border: '#30363d',  // Crisp borders
          text: '#c9d1d9',    // Primary text
          muted: '#8b949e'    // Secondary text
        },
        accent: {
          primary: '#2f81f7', // Professional Blue
          hover: '#1f6feb',
        },
        status: {
          critical: '#f85149', // Red
          warning: '#d29922',  // Yellow
          success: '#238636'   // Green
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}