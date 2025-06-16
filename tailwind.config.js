/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            animation: {
                'letter-reveal': 'letterReveal 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite, letterGlow 2s ease-in-out infinite',
            },
            keyframes: {
                letterReveal: {
                    '0%': { opacity: '0', transform: 'translateY(20px) scale(0.7)' },
                    '80%': { opacity: '1', transform: 'translateY(0) scale(1.1)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                letterGlow: {
                    '0%, 100%': { textShadow: '0 0 5px rgba(37, 99, 235, 0.5)' },
                    '50%': { textShadow: '0 0 10px rgba(37, 99, 235, 0.7)' },
                },
            }
        },
    },
    plugins: [],
};