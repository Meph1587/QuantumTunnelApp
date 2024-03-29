module.exports = {
    mode: "jit",
    purge: [
      "pages/**/*.{tsx,ts}",
      "views/**/*.{tsx,ts}",
      "components/**/*.{tsx,ts}",
    ],
    darkMode: false,
    theme: {
      extend: {
        backgroundImage: {
          'map': "url('/frwcMap.png')",
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('tailwind-scrollbar'),
    ],
  };