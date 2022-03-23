module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
        fontFamily: {
            kyokasho: ["Kyokasho"],
            simkai: ["Simkai"],
            cwtexqkai: ['"cwTex Q Kai"'],
            notosanssc: ['Noto Sans SC'],
            notoserifsc: ['Noto Serif SC'],
            notosanstc: ['Noto Sans TC'],
            notoseriftc: ['Noto Serif TC'],
            notosansjp: ['Noto Sans JP'],
            notoserifjp: ['Noto Serif JP'],
          },
    },
  },
  daisyui: {
    themes: ["light", "luxury"]
  },
  darkMode: 'class',
  plugins: [require('@tailwindcss/forms'), require("@tailwindcss/typography"), require("daisyui")], // require daisy ui after typography
}
