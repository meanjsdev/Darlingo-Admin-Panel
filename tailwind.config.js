module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        darlingoRed: '#8b1e2e',
        darlingoMid: '#b23a4d',
        darlingoLight: '#f8dede',
      },
      backgroundImage: {
        'darlingo-gradient': 'conic-gradient(from 180deg at 50% 50%, #8b1e2e, #b23a4d, #f8dede)'
      },
    },
  },
  plugins: [],
}
