"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Dynamic import to prevent SSR issues
const MainMenu = dynamic(() => import("@/components/MainMenu"), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 bg-black flex items-center justify-center">
			<div className="text-center">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<h3 className="text-2xl font-semibold text-white mb-2">GALACTIC CLANS</h3>
				<p className="text-slate-400">Loading game...</p>
			</div>
		</div>
	),
});

const SettingsSystem = dynamic(() => import("@/components/SettingsSystem"), {
	ssr: false,
});

export default function Home() {
	const [gameState, setGameState] = useState("loading");
	const [isLoading, setIsLoading] = useState(true);
	const [loadingPhase, setLoadingPhase] = useState(0);
	const [progress, setProgress] = useState(0);
	const [currentTask, setCurrentTask] = useState("");
	const [particlePositions, setParticlePositions] = useState<Array<{ x: number; y: number; z: number; speed: number }>>([]);
	const [constellationProgress, setConstellationProgress] = useState(0);
	const [shipPosition, setShipPosition] = useState({ x: 50, y: 50, rotation: 0 });
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [planetRotation, setPlanetRotation] = useState(0);
	const [warpEffect, setWarpEffect] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);
	const router = useRouter();

	// Interactive Loading Phases with storytelling
	const loadingPhases = [
		{ name: "🌌 Scanning cosmic coordinates...", duration: 800, story: "Deep space sensors detecting habitable systems" },
		{ name: "🚀 Initializing warp drive...", duration: 1000, story: "Quantum engines charging for faster-than-light travel" },
		{ name: "🌟 Mapping constellation routes...", duration: 1200, story: "Navigation computer plotting safest path through the void" },
		{ name: "🌍 Discovering planetary systems...", duration: 900, story: "Long-range scanners detecting resource-rich worlds" },
		{ name: "🛸 Establishing communication arrays...", duration: 700, story: "Quantum entanglement networks coming online" },
		{ name: "⚡ Calibrating energy shields...", duration: 600, story: "Defensive systems protecting against cosmic radiation" },
		{ name: "🌠 Synchronizing with galactic network...", duration: 800, story: "Connecting to the interstellar clan registry" },
		{ name: "✨ Welcome to the Galaxy, Commander!", duration: 500, story: "Your empire awaits your command" },
	];

	// Generate particles for space effect
	useEffect(() => {
		const particles = Array.from({ length: 200 }, (_, i) => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			z: Math.random() * 100,
			speed: 0.1 + Math.random() * 0.3,
		}));
		setParticlePositions(particles);
	}, []);

	// Mouse tracking for interactive elements
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: (e.clientX / window.innerWidth) * 100,
				y: (e.clientY / window.innerHeight) * 100,
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	// Animate particles and effects
	useEffect(() => {
		if (!isLoading) return;

		const animate = () => {
			// Update particle positions
			setParticlePositions((prev) =>
				prev.map((particle) => ({
					...particle,
					z: particle.z - particle.speed,
					...(particle.z <= 0 && { z: 100, x: Math.random() * 100, y: Math.random() * 100 }),
				}))
			);

			// Update planet rotation
			setPlanetRotation((prev) => (prev + 0.5) % 360);

			// Update constellation progress
			if (loadingPhase >= 2) {
				setConstellationProgress((prev) => Math.min(100, prev + 0.8));
			}

			// Ship movement based on mouse
			setShipPosition((prev) => ({
				x: prev.x + (mousePosition.x - prev.x) * 0.02,
				y: prev.y + (mousePosition.y - prev.y) * 0.02,
				rotation: (mousePosition.x - prev.x) * 0.1,
			}));

			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [isLoading, loadingPhase, mousePosition]);

	// Loading phase progression
	useEffect(() => {
		if (loadingPhase >= loadingPhases.length) {
			setWarpEffect(true);
			setTimeout(() => {
				setIsLoading(false);
				setGameState("menu");
			}, 1500);
			return;
		}

		const phase = loadingPhases[loadingPhase];
		if (!phase) return;

		setCurrentTask(phase.name);

		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				const newProgress = prev + 100 / (phase.duration / 50);
				if (newProgress >= 100) {
					clearInterval(progressInterval);
					setTimeout(() => {
						setLoadingPhase((prev) => prev + 1);
						setProgress(0);
					}, 200);
					return 100;
				}
				return newProgress;
			});
		}, 50);

		return () => clearInterval(progressInterval);
	}, [loadingPhase]);

	const currentPhase = loadingPhases[loadingPhase] || loadingPhases[loadingPhases.length - 1];
	const overallProgress = ((loadingPhase + progress / 100) / loadingPhases.length) * 100;

	const handleSettings = () => {
		console.log("Opening comprehensive settings...");
		setGameState("settings");
	};

	const handleCredits = () => {
		router.push("/credits");
	};

	if (gameState === "settings") {
		return (
			<div className="fixed inset-0 bg-black/95 z-50">
				<div className="h-full flex flex-col">
					<div className="flex items-center justify-between p-6 border-b border-slate-800">
						<h1 className="text-2xl font-bold text-white">Game Settings</h1>
						<button onClick={() => setGameState("menu")} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
							Back to Menu
						</button>
					</div>
					<div className="flex-1 overflow-auto">
						<SettingsSystem />
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-black text-white overflow-hidden">
				{/* Animated Starfield */}
				<div className="absolute inset-0">
					{particlePositions.map((particle, i) => {
						const size = (100 - particle.z) / 100;
						const opacity = Math.max(0.1, size);
						const perspective = 1 - particle.z / 100;

						return (
							<div
								key={i}
								className="absolute rounded-full"
								style={{
									left: `${particle.x}%`,
									top: `${particle.y}%`,
									width: `${Math.max(1, size * 4)}px`,
									height: `${Math.max(1, size * 4)}px`,
									backgroundColor: warpEffect ? "#60a5fa" : "#ffffff",
									opacity,
									transform: `translateZ(${particle.z}px) scale(${perspective})`,
									filter: warpEffect ? "blur(1px)" : "none",
									boxShadow: warpEffect ? "0 0 10px #60a5fa" : size > 0.8 ? "0 0 6px #ffffff" : "none",
								}}
							/>
						);
					})}
				</div>

				{/* Warp Effect Overlay */}
				{warpEffect && (
					<div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-500/20 to-blue-900/40 animate-pulse">
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-ping" />
					</div>
				)}

				{/* Central Loading Interface */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="relative w-96 h-96">
						{/* Rotating Planet/Station */}
						<div className="absolute inset-0 flex items-center justify-center">
							<div
								className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 shadow-2xl relative overflow-hidden"
								style={{
									transform: `rotate(${planetRotation}deg)`,
									boxShadow: "0 0 40px rgba(59, 130, 246, 0.6), inset 0 0 40px rgba(0, 0, 0, 0.3)",
								}}
							>
								{/* Planet surface details */}
								<div className="absolute inset-0 opacity-30">
									<div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full" />
									<div className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full" />
									<div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full" />
									<div className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full" />
								</div>

								{/* Atmospheric glow */}
								<div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20" />
							</div>
						</div>

						{/* Interactive Spaceship */}
						<div
							className="absolute w-8 h-8 transition-all duration-300"
							style={{
								left: `${shipPosition.x}%`,
								top: `${shipPosition.y}%`,
								transform: `translate(-50%, -50%) rotate(${shipPosition.rotation}deg)`,
							}}
						>
							<div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 transform rotate-45 rounded-sm shadow-lg">
								<div className="absolute inset-0 bg-white/30 rounded-sm" />
								{/* Engine trail */}
								<div className="absolute -bottom-2 left-1/2 w-1 h-4 bg-gradient-to-b from-orange-400 to-transparent transform -translate-x-1/2 opacity-80" />
							</div>
						</div>

						{/* Constellation Mapping */}
						{loadingPhase >= 2 && (
							<div className="absolute inset-0">
								{[...Array(8)].map((_, i) => {
									const angle = (i / 8) * 360;
									const radius = 120 + Math.sin(Date.now() * 0.001 + i) * 10;
									const x = 50 + (Math.cos((angle * Math.PI) / 180) * radius) / 4;
									const y = 50 + (Math.sin((angle * Math.PI) / 180) * radius) / 4;
									const opacity = Math.min(1, constellationProgress / 100);

									return (
										<div
											key={i}
											className="absolute w-2 h-2 bg-yellow-400 rounded-full"
											style={{
												left: `${x}%`,
												top: `${y}%`,
												opacity,
												boxShadow: "0 0 8px #fbbf24",
												animation: `pulse 2s infinite ${i * 0.25}s`,
											}}
										/>
									);
								})}
							</div>
						)}

						{/* Progress Ring */}
						<div className="absolute inset-0">
							<svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
								<circle cx="50" cy="50" r="45" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" />
								<circle cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${overallProgress * 2.827} 282.7`} className="transition-all duration-300" />
								<defs>
									<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" stopColor="#3b82f6" />
										<stop offset="50%" stopColor="#8b5cf6" />
										<stop offset="100%" stopColor="#06b6d4" />
									</linearGradient>
								</defs>
							</svg>
						</div>
					</div>
				</div>

				{/* Loading Information */}
				<div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center max-w-2xl">
					<div className="mb-6">
						<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{warpEffect ? "ENTERING WARP SPACE" : "GALACTIC CLANS"}</h1>
						<p className="text-lg text-slate-300 animate-pulse">{currentTask}</p>
					</div>

					{/* Story Text */}
					<div className="mb-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-slate-700/50">
						<p className="text-slate-300 italic">{currentPhase?.story}</p>
					</div>

					{/* Progress Stats */}
					<div className="flex justify-center space-x-8 text-sm text-slate-400">
						<div>
							<span className="text-blue-400">Phase:</span> {loadingPhase + 1}/{loadingPhases.length}
						</div>
						<div>
							<span className="text-green-400">Progress:</span> {Math.round(overallProgress)}%
						</div>
						<div>
							<span className="text-purple-400">Systems:</span> {Math.floor(overallProgress / 12.5)} Online
						</div>
					</div>

					{/* Click to Skip */}
					{loadingPhase > 1 && !warpEffect && (
						<div className="mt-6">
							<button
								onClick={() => {
									setWarpEffect(true);
									setTimeout(() => {
										setIsLoading(false);
										setGameState("menu");
									}, 1500);
								}}
								className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-slate-500"
							>
								⚡ Emergency Warp Jump
							</button>
						</div>
					)}
				</div>

				{/* Interactive Hint */}
				<div className="absolute top-8 right-8 text-slate-400 text-sm">
					<p>🖱️ Move your mouse to pilot the ship</p>
				</div>

				{/* CSS for additional effects */}
				<style jsx>{`
					@keyframes pulse {
						0%,
						100% {
							opacity: 0.6;
							transform: scale(1);
						}
						50% {
							opacity: 1;
							transform: scale(1.2);
						}
					}
					.bg-gradient-radial {
						background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
					}
				`}</style>
			</div>
		);
	}

	return (
		<div className="relative h-screen overflow-hidden bg-black">
			<MainMenu />
		</div>
	);
}
