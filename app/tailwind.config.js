/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lmu: {
          blue: '#0d3c6e',
          light: '#1a5fa8',
          gold: '#c8973e',
        }
      }
    },
  },
  plugins: [],
}

