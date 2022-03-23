module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
        fontFamily: {
            kyokasho: ["Kyokasho"],
            simkai: ["Simkai"],
            cwtexqkai: ['"cwTex Q Kai"'],
          },
    },
  },
  daisyui: {
    themes: ["light", "luxury"]
  },
  darkMode: 'class',
  plugins: [require('@tailwindcss/forms'), require("@tailwindcss/typography"), require("daisyui")], // require daisy ui after typography
}
