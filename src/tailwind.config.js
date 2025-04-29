/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./carrinho.html",
      "./login.html",
      "./cadastro.html",
      "./script.js"
    ],
    theme: {
      extend: {
        colors: {
          'principal': '#7D0A0A',
          'principal-hover': '#610c0c',
          'branco': '#fff',
          'amarelo-destaque': '#EFB036',
          'background': '#7D0A0A',
          'sombra-contraste': '#f8f8f8',
        },
        fontFamily: {
          'sans': ['Roboto', 'sans-serif'], // 'sans' é a categoria de fonte padrão do Tailwind
        },
      },
    },
    plugins: [],
  }