/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'registerPattern': "url('/public/pattern.svg')",
        'saveToBook': "url('/public/save_to_book.svg')",
        'cat1': "url('/public/cat1.jpg')",
      }
    },
    // fontFamily: {
    //  'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
    //  'poppins': ['Poppins', 'sans-serif'],
    //  'dmsans': ['DM Sans', 'sans-serif']
    // }
  },
  plugins: [],
}

