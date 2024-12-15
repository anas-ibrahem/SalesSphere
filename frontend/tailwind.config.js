/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-accent": "var(--primary-accent)",
        "secondary-accent": "var(--secondary-accent)",
        "tertiary-accent": "var(--tertiary-accent)"
      },
    }
  },
  plugins: [],
}