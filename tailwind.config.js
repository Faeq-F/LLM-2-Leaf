import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  safelist: ["dark"],
  prefix: "",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',

  ],
  plugins: [animate, require("rippleui"), require('preline/plugin'), require('@tailwindcss/forms')],
};
