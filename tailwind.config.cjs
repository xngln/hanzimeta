module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "luxury"]
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")], // require daisy ui after typography
}
