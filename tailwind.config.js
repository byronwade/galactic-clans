/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// Game-specific color palette
				"game-primary": "#00ff88",
				"game-secondary": "#66ccff",
				"game-accent": "#ffc107",
				"game-dark": "#0a0a0a",
				"game-surface": "#1a1a1a",
				"game-surface-light": "#2d2d2d",
				"game-text": "#ffffff",
				"game-text-muted": "rgba(255, 255, 255, 0.7)",
				"game-border": "rgba(255, 255, 255, 0.2)",
				"game-border-bright": "rgba(0, 255, 136, 0.3)",
			},
			fontFamily: {
				game: ["Roboto", "sans-serif"],
			},
			animation: {
				"pulse-glow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"slide-in-top": "slideInFromTop 0.5s ease-out",
				"fade-in": "fadeIn 0.3s ease-in-out",
			},
			keyframes: {
				slideInFromTop: {
					from: { transform: "translateX(-50%) translateY(-100%)", opacity: "0" },
					to: { transform: "translateX(-50%) translateY(0)", opacity: "1" },
				},
				fadeIn: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			backdropBlur: {
				game: "15px",
			},
			boxShadow: {
				game: "0 4px 20px rgba(0, 0, 0, 0.3)",
				"game-glow": "0 0 8px rgba(0, 255, 136, 0.4)",
				"game-strong": "0 8px 32px rgba(0, 0, 0, 0.5)",
			},
		},
	},
	plugins: [],
};
