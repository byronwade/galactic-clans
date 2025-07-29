"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Pause, Play, SkipForward, Star, Heart } from "lucide-react";

interface CreditItem {
	role: string;
	name: string;
	highlight?: boolean;
}

interface CreditSection {
	title: string;
	items: CreditItem[];
	spacing?: "small" | "medium" | "large";
	centered?: boolean;
}

export default function CreditsPage() {
	const [isPlaying, setIsPlaying] = useState(true);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [showControls, setShowControls] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<number | undefined>(undefined);
	const lastTimeRef = useRef<number>(0);

	// Cinematic credit sections like real AAA games
	const creditSections: CreditSection[] = [
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "A BYRON WADE PRODUCTION",
			items: [],
			spacing: "large",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "medium",
		},
		{
			title: "GALACTIC CLANS",
			items: [],
			spacing: "large",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "CREATED AND DIRECTED BY",
			items: [{ role: "", name: "BYRON WADE", highlight: true }],
			spacing: "large",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "medium",
		},
		{
			title: "AI DEVELOPMENT ASSISTANCE",
			items: [{ role: "", name: "CURSOR AI", highlight: true }],
			spacing: "medium",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "CORE DEVELOPMENT TEAM",
			items: [],
			spacing: "medium",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "small",
		},
		{
			title: "",
			items: [
				{ role: "Lead Developer", name: "Byron Wade" },
				{ role: "Game Design", name: "Byron Wade" },
				{ role: "Technical Architecture", name: "Byron Wade" },
				{ role: "3D Graphics Programming", name: "Byron Wade" },
				{ role: "UI/UX Design", name: "Byron Wade" },
				{ role: "AI Integration", name: "Cursor AI" },
				{ role: "Code Optimization", name: "Cursor AI" },
				{ role: "Technical Documentation", name: "Cursor AI" },
			],
			spacing: "medium",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "TECHNOLOGY PARTNERS",
			items: [],
			spacing: "medium",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "small",
		},
		{
			title: "",
			items: [
				{ role: "3D Rendering Engine", name: "Three.js" },
				{ role: "Physics Simulation", name: "Cannon-ES" },
				{ role: "Web Framework", name: "Next.js" },
				{ role: "Component Library", name: "React" },
				{ role: "Type Safety", name: "TypeScript" },
				{ role: "Package Manager", name: "Bun" },
				{ role: "Animation Library", name: "Framer Motion" },
				{ role: "Styling Framework", name: "Tailwind CSS" },
				{ role: "Icon Library", name: "Lucide React" },
				{ role: "UI Components", name: "Shadcn/ui" },
			],
			spacing: "medium",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "SCIENTIFIC DATA SOURCES",
			items: [],
			spacing: "medium",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "small",
		},
		{
			title: "",
			items: [
				{ role: "Astronomical Data", name: "NASA Jet Propulsion Laboratory" },
				{ role: "Planetary Data", name: "NASA Solar System Exploration" },
				{ role: "Stellar Classifications", name: "European Space Agency (ESA)" },
				{ role: "Galaxy Types", name: "Hubble Space Telescope Archive" },
				{ role: "Exoplanet Database", name: "NASA Exoplanet Archive" },
			],
			spacing: "medium",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "AUDIO RESOURCES",
			items: [],
			spacing: "medium",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "small",
		},
		{
			title: "",
			items: [
				{ role: "Sound Effects Library", name: "Freesound.org Community" },
				{ role: "Menu Audio", name: "Various Artists (CC Licensed)" },
				{ role: "Web Audio API", name: "W3C Web Audio Specification" },
			],
			spacing: "medium",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "3D ASSETS & GRAPHICS",
			items: [],
			spacing: "medium",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "small",
		},
		{
			title: "",
			items: [
				{ role: "Open Source Models", name: "OpenGameArt.org Community" },
				{ role: "Low-Poly Techniques", name: "Three.js Documentation" },
				{ role: "Procedural Generation", name: "Academic Research Papers" },
				{ role: "Shader Development", name: "WebGL Specification" },
			],
			spacing: "medium",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "SPECIAL THANKS",
			items: [],
			spacing: "medium",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "small",
		},
		{
			title: "",
			items: [
				{ role: "Open Source Community", name: "For Making This Possible" },
				{ role: "GitHub", name: "For Code Hosting" },
				{ role: "The JavaScript Community", name: "For Continuous Innovation" },
				{ role: "Mozilla & Chrome Teams", name: "For Web Standards" },
				{ role: "All Beta Testers", name: "For Their Valuable Feedback" },
			],
			spacing: "large",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "MADE WITH ❤️ FOR THE GALAXY",
			items: [],
			spacing: "large",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "© 2025 BYRON WADE",
			items: [],
			spacing: "medium",
			centered: true,
		},
		{
			title: "ALL RIGHTS RESERVED",
			items: [],
			spacing: "large",
			centered: true,
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
		{
			title: "",
			items: [],
			spacing: "large",
		},
	];

	// Auto-scroll animation
	useEffect(() => {
		if (!isPlaying || !containerRef.current || !contentRef.current) return;

		const animate = (currentTime: number) => {
			if (!lastTimeRef.current) lastTimeRef.current = currentTime;

			const deltaTime = currentTime - lastTimeRef.current;
			lastTimeRef.current = currentTime;

			// Scroll speed: 30 pixels per second (adjustable)
			const scrollSpeed = 30;
			const newPosition = scrollPosition + (scrollSpeed * deltaTime) / 1000;

			setScrollPosition(newPosition);

			// Check if we've reached the end
			const container = containerRef.current;
			const content = contentRef.current;
			if (container && content) {
				const maxScroll = content.scrollHeight - container.clientHeight;
				if (newPosition >= maxScroll + 200) {
					// Credits finished, pause
					setIsPlaying(false);
					return;
				}
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [isPlaying, scrollPosition]);

	// Apply scroll position
	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.style.transform = `translateY(-${scrollPosition}px)`;
		}
	}, [scrollPosition]);

	// Hide controls after inactivity
	useEffect(() => {
		let timeout: NodeJS.Timeout;

		const resetTimeout = () => {
			setShowControls(true);
			clearTimeout(timeout);
			timeout = setTimeout(() => setShowControls(false), 3000);
		};

		const handleMouseMove = () => resetTimeout();
		const handleKeyPress = () => resetTimeout();

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("keydown", handleKeyPress);

		resetTimeout(); // Initial timeout

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("keydown", handleKeyPress);
			clearTimeout(timeout);
		};
	}, []);

	// Keyboard controls
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			switch (e.code) {
				case "Space":
					e.preventDefault();
					setIsPlaying(!isPlaying);
					break;
				case "Escape":
					window.history.back();
					break;
				case "ArrowUp":
					e.preventDefault();
					setScrollPosition((prev) => Math.max(0, prev - 100));
					break;
				case "ArrowDown":
					e.preventDefault();
					setScrollPosition((prev) => prev + 100);
					break;
			}
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, [isPlaying]);

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
		if (!isPlaying) {
			lastTimeRef.current = 0; // Reset timing when resuming
		}
	};

	const handleSkip = () => {
		window.history.back();
	};

	const getSpacingClass = (spacing?: string) => {
		switch (spacing) {
			case "small":
				return "py-4";
			case "medium":
				return "py-8";
			case "large":
				return "py-16";
			default:
				return "py-6";
		}
	};

	return (
		<div className="fixed inset-0 bg-black text-white overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/20 to-black"></div>
				{/* Animated stars */}
				{[...Array(100)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-white rounded-full opacity-30"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animation: `twinkle ${2 + Math.random() * 3}s infinite`,
						}}
					/>
				))}
			</div>

			{/* Controls */}
			<div className={`absolute top-6 left-6 right-6 z-20 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
						<ArrowLeft className="w-5 h-5" />
						<span>Back to Game</span>
					</Link>

					<div className="flex items-center space-x-4">
						<button onClick={handlePlayPause} className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-black/50 transition-colors">
							{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
							<span>{isPlaying ? "Pause" : "Play"}</span>
						</button>

						<button onClick={handleSkip} className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-black/50 transition-colors">
							<SkipForward className="w-5 h-5" />
							<span>Skip</span>
						</button>
					</div>
				</div>
			</div>

			{/* Credits container */}
			<div ref={containerRef} className="relative h-full overflow-hidden pt-24">
				<div ref={contentRef} className="relative min-h-full" style={{ willChange: "transform" }}>
					{creditSections.map((section, sectionIndex) => (
						<div key={sectionIndex} className={`${getSpacingClass(section.spacing)} ${section.centered ? "text-center" : ""}`}>
							{section.title && <h2 className={`text-3xl md:text-4xl font-bold mb-8 tracking-widest ${section.title.includes("GALACTIC CLANS") ? "text-5xl md:text-6xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" : section.title.includes("BYRON WADE PRODUCTION") ? "text-4xl md:text-5xl text-slate-300" : "text-slate-200"}`}>{section.title}</h2>}

							{section.items.length > 0 && (
								<div className={`space-y-4 max-w-2xl ${section.centered ? "mx-auto" : ""}`}>
									{section.items.map((item, itemIndex) => (
										<div key={itemIndex} className="flex flex-col md:flex-row md:justify-between md:items-baseline space-y-1 md:space-y-0">
											<div className={`${item.highlight ? "text-xl font-semibold text-white flex items-center space-x-2" : "text-lg text-slate-300"}`}>
												{item.highlight && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
												<span>{item.name}</span>
											</div>
											{item.role && <div className="text-base text-slate-400 md:text-right">{item.role}</div>}
										</div>
									))}
								</div>
							)}
						</div>
					))}

					{/* Extra spacing at the end */}
					<div className="h-screen"></div>
				</div>
			</div>

			{/* Instructions */}
			<div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-slate-400 text-sm transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
				<p>SPACE to pause • ESC to exit • ↑↓ to scroll manually</p>
			</div>

			<style jsx>{`
				@keyframes twinkle {
					0%,
					100% {
						opacity: 0.3;
					}
					50% {
						opacity: 1;
					}
				}
			`}</style>
		</div>
	);
}
