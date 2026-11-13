/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './index.tsx', './src/**/*.{ts,tsx}'],
  // Same as the Tailwind CDN default the site was built against.
  darkMode: 'media',
  theme: { extend: {} },
  plugins: [],
};
