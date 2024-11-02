import defaultTheme from "tailwindcss/defaultTheme";

/** @type{import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
