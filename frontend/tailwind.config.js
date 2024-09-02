/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0.5rem 1rem 3rem hsl(0, 0%, 0%, 0.3)',
      },
    },
  },
  plugins: [],
}

