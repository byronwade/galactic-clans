import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CriticalErrorBoundary } from "@/components/ErrorBoundary";
import { GlobalInputAlert } from "@/components/GlobalInputAlert";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Cosmic - Galactic Clans Universe Explorer",
	description: "Explore procedurally generated galaxies, planets, and cosmic phenomena in this immersive 3D universe.",
	keywords: ["space", "galaxy", "procedural", "3D", "exploration", "cosmic", "universe"],
	authors: [{ name: "Galactic Clans Development Team" }],
	openGraph: {
		title: "Cosmic - Galactic Clans Universe Explorer",
		description: "Explore procedurally generated galaxies, planets, and cosmic phenomena in this immersive 3D universe.",
		type: "website",
		images: [
			{
				url: "/favicon.png",
				width: 512,
				height: 512,
				alt: "Cosmic Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Cosmic - Galactic Clans Universe Explorer",
		description: "Explore procedurally generated galaxies, planets, and cosmic phenomena in this immersive 3D universe.",
		images: ["/favicon.png"],
	},
	robots: "index, follow",
	manifest: "/manifest.json",
	metadataBase: new URL("http://localhost:5173"),
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				{/* Additional SEO and performance optimization */}
				<meta name="theme-color" content="#000000" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<link rel="icon" type="image/png" href="/favicon.png" />
				<link rel="apple-touch-icon" href="/favicon.png" />

				{/* JSON-LD Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebApplication",
							name: "Cosmic - Galactic Clans Universe Explorer",
							description: "Explore procedurally generated galaxies, planets, and cosmic phenomena in this immersive 3D universe.",
							url: "https://cosmic.galacticclans.com",
							applicationCategory: "Game",
							operatingSystem: "Web Browser",
							offers: {
								"@type": "Offer",
								price: "0",
								priceCurrency: "USD",
							},
							creator: {
								"@type": "Organization",
								name: "Galactic Clans Development Team",
							},
						}),
					}}
				/>
			</head>
			<body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
				<div id="game-ui">
					<CriticalErrorBoundary>{children}</CriticalErrorBoundary>

					{/* Global Input Detection and Alert System */}
					<GlobalInputAlert />
				</div>

				{/* Service Worker Registration */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							if ('serviceWorker' in navigator) {
								window.addEventListener('load', function() {
									navigator.serviceWorker.register('/sw.js')
										.then(function(registration) {
											console.log('SW registered: ', registration);
										})
										.catch(function(registrationError) {
											console.log('SW registration failed: ', registrationError);
										});
								});
							}
						`,
					}}
				/>
			</body>
		</html>
	);
}
