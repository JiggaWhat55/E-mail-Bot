/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lcars: {
          orange: '#FF9900',
          'light-orange': '#FFCC99',
          purple: '#CC99CC',
          'light-purple': '#EEDDFF',
          blue: '#9999FF',
          'light-blue': '#CCCCFF',
          red: '#CC0000',
          yellow: '#FFFF99',
          'pale-yellow': '#FFFFCC',
          gray: '#999999',
          black: '#000000',
        }
      },
      fontFamily: {
        lcars: ['"Antonio"', '"Arial Narrow"', 'sans-serif'],
        mono: ['"Inconsolata"', 'monospace'],
      },
    },
  },
  plugins: [],
}
