/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#1263F1", // azul intenso del Figma
        lightBlue: "#E6F0FE", // azul muy suave para fondo
        darkText: "#1E293B", // texto oscuro
        softGray: "#F1F5F9", // gris claro de fondo
      },
      borderRadius: {
        xl: "1.25rem", // esquinas redondeadas
        "2xl": "2rem",
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"], // fuente Figma
      },
      boxShadow: {
        card: "0px 4px 12px rgba(0, 0, 0, 0.08)", // sombra suave Figma
      },
    },
  },
  plugins: [],
};
