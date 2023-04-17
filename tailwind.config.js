/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src*.{vue,js}", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      margin: (() => {
        let obj = {};
        for (let i = 0; i <= 20; i++) {
          obj[i] = i + "px"
        }
        return obj;
      })(),
      padding: (() => {
        let obj = {};
        for (let i = 0; i <= 20; i++) {
          obj[i] = i + "px"
        }
        return obj;
      })(),
      colors: {
        primaryColor: '#409eff',
      }
    },
  },
  plugins: [],
}
