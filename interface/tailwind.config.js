/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                white: '#F6F8FF',
                black: '#02040F',
                orange: '#FF602C',
                gray: {
                    200: '#676C79',
                    DEFAULT: '#2F3137',
                    600: '#2f3136',
                },
            },
        },
    },
    plugins: [],
};
