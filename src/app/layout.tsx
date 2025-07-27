import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Galactic Clans - Epic Space Strategy Game",
	description: "Build your galactic empire, explore procedurally generated worlds, and dominate the cosmos in this revolutionary space strategy game.",
	keywords: ["space game", "strategy", "galactic", "clans", "multiplayer", "procedural generation"],
	authors: [{ name: "Cosmic Gaming Development Team" }],
	creator: "Cosmic Gaming",
	publisher: "Cosmic Gaming",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},

	manifest: "/manifest.json",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				{/* Preserve existing game meta tags */}
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* WebGL and game-specific meta tags */}
				<meta name="webgl" content="required" />
				<meta name="renderer" content="three.js" />

				{/* Preload critical game resources */}
				<link rel="preload" href="/assets/audio/menu-ambient.ogg" as="audio" type="audio/ogg" />
				<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" />

				{/* Game-specific stylesheets */}
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

				{/* Tailwind CSS - will be optimized by Next.js */}
				<script src="https://cdn.tailwindcss.com"></script>

				{/* Three.js CDN for compatibility */}
				<script
					type="importmap"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							imports: {
								three: "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js",
								"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/",
							},
						}),
					}}
				/>
			</head>
			<body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
				{/* Game UI container - preserve existing structure */}
				<div id="game-ui">{children}</div>

				{/* Performance monitoring script */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
            // Performance monitoring for game
            if (typeof window !== 'undefined') {
              window.addEventListener('load', () => {
                console.log('🎮 [NEXTJS] Galactic Clans loaded with Next.js');
                console.log('📊 [PERFORMANCE] Page load time:', performance.now().toFixed(2) + 'ms');
              });
            }
          `,
					}}
				/>
			</body>
		</html>
	);
}
