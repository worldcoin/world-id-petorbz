const mirrorHexColors = (colors) =>
  Object.fromEntries(
    colors.map((color, index) => {
      if (!/#[a-f0-9]{6}/.test(color)) {
        throw new Error(
          'All colors should be lowercase hexadecimal strings 7 characters long with "#" sign at the beginning'
        );
      }

      if (colors.indexOf(color) !== index) {
        throw new Error("Colors should be unique");
      }

      if (colors[index - 1] > color) {
        throw new Error("Colors should be sorted alphabetically");
      }

      return [color.substring(1), color];
    })
  );

module.exports = {
  content: ["./src/**/*.tsx"],

  plugins: [
    ({ addUtilities }) =>
      addUtilities({
        ".text-gradient-pink": {
          backgroundImage:
            "linear-gradient(82.2deg, #ffffff 0%, #f4b4b6 101.39%)",
        },
        ".text-gradient-purple": {
          backgroundImage:
            "linear-gradient(257.03deg, #F66651 -13.93%, #6448E7 119.81%)",
        },
        ".text-gradient-dark": {
          backgroundImage:
            "linear-gradient(180deg, #ffffff 0%, #1b0f2c 81.61%)",
        },
        ".border-gradient": {
          '-webkit-mask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          webkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }
      }),
  ],

  theme: {
    extend: {
      colors: {
        ...mirrorHexColors([
          "#000000",
          "#08955a",
          "#105f48",
          "#1b0f2c",
          "#1d102f",
          "#1e1e23",
          "#20b078",
          "#217237",
          "#21725a",
          "#5e54ff",
          "#61577c",
          "#641e82",
          "#6448e7",
          "#977cc0",
          "#b954f5",
          "#c2a4e5",
          "#ca74fe",
          "#df57bc",
          "#f4b4b6",
          "#f66651",
          "#ffffff",
        ]),
      },

      fontFamily: {
        main: ["Inter", "san-serif"],
        sans: ["DM Sans", "sans-serif"],
        serif: ["Berlingske", "serif"],
      },

      fontSize: {
        13: ["calc(13 * 1rem / 16)", { lineHeight: "calc(16 * 1rem / 16)" }],
        20: ["calc(20 * 1rem / 16)", { lineHeight: "calc(24 * 1rem / 16)" }],
        22: ["calc(22 * 1rem / 16)", { lineHeight: "calc(27 * 1rem / 16)" }],
        32: ["calc(32 * 1rem / 16)", { lineHeight: "calc(35 * 1rem / 16)" }],
        40: [
          "calc(40 * 1rem / 16)",
          { lineHeight: "calc(44 * 1rem / 16)", letterSpacing: "-0.02em" },
        ],
        72: [
          "calc(72 * 1rem / 16)",
          { lineHeight: "calc(79 * 1rem / 16)", letterSpacing: "-0.02em" },
        ],
        280: ["calc(280 * 1rem / 16)", { lineHeight: "calc(280 * 1rem / 16)" }],
      },

      gridTemplateColumns: {
        "1fr/auto": "1fr auto",
        "1fr/minmax(0/360)/1fr": "1fr minmax(0, calc(360 * .25rem)) 1fr",
        "auto/1fr": "auto 1fr",
        "auto/1fr/auto": "auto 1fr auto",
        "auto/auto/1fr": "auto auto 1fr",
      },

      gridTemplateRows: {
        "1fr/auto": "1fr auto",
        "auto/1fr": "auto 1fr",
        "auto/1fr/auto": "auto 1fr auto",
      },

      spacing: {
        29.5: "calc(29.5 * 1rem / 4)",
        37: "calc(37 * 1rem / 4)",
        50: "calc(50 * 1rem / 4)",
        360: "calc(360 * 1rem / 4)",
      },

      dropShadow: {
        img: [
          "4px 8px 16px rgba(25, 0, 70, 0.42)",
          "60px 60px 80px rgba(27, 0, 70, 0.35)",
        ],
      },

      backdropBlur: {
        32: "32px",
      },
    },
  },
};
