export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2A2A2A', // Charcoal for text/accents
        secondary: '#E5E5E5', // Light gray background
        accent: '#D4A373', // Gold/Bronze accent
        surface: '#F9F9F9', // Very light gray surface
        muted: '#8D8D8D', // Muted text
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop')", // Placeholder hero
      }
    },
  },
  plugins: [],
}

