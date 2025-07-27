"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Zap, Thermometer, Droplets, Wind, Mountain, Users, Shield } from "lucide-react";

interface PlanetData {
	name: string;
	type: string;
	biome: string;
	radius: number;
	mass: string;
	temperature: string;
	atmosphere: string;
	habitability: string;
	distance: string;
	moons: number;
	resources: string[];
	population?: string;
	threat_level?: string;
	coordinates?: string;
}

interface DivisionStyleCardProps {
	planetData: PlanetData;
	position: { x: number; y: number };
	isVisible: boolean;
	onClose?: () => void;
}

export const DivisionStyleCard: React.FC<DivisionStyleCardProps> = ({ planetData, position, isVisible, onClose }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [glitchActive, setGlitchActive] = useState(false);

	useEffect(() => {
		if (isVisible) {
			setIsAnimating(true);
			// Random glitch effect
			const glitchInterval = setInterval(() => {
				if (Math.random() < 0.1) {
					setGlitchActive(true);
					setTimeout(() => setGlitchActive(false), 150);
				}
			}, 2000);

			return () => clearInterval(glitchInterval);
		} else {
			setIsAnimating(false);
		}
	}, [isVisible]);

	if (!isVisible) return null;

	const getBiomeColor = (biome: string) => {
		const colors: Record<string, string> = {
			temperate: "from-green-500/20 to-blue-500/20",
			desert: "from-orange-500/20 to-yellow-500/20",
			arctic: "from-cyan-500/20 to-blue-300/20",
			tropical: "from-green-400/20 to-emerald-500/20",
			volcanic: "from-red-500/20 to-orange-600/20",
			ocean: "from-blue-500/20 to-teal-500/20",
			barren: "from-gray-500/20 to-stone-600/20",
		};
		return colors[biome] || colors.temperate;
	};

	const getThreatColor = (threat: string) => {
		const colors: Record<string, string> = {
			low: "text-green-400",
			medium: "text-yellow-400",
			high: "text-orange-400",
			critical: "text-red-400",
		};
		return colors[threat] || "text-green-400";
	};

	return (
		<>
			{/* Background Overlay */}
			<div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{ background: "radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, transparent 70%)" }} onClick={onClose} />

			{/* Division-Style Card */}
			<div
				ref={cardRef}
				className={`fixed z-50 transition-all duration-500 ease-out transform-gpu ${isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"} ${glitchActive ? "animate-pulse" : ""}`}
				style={{
					left: Math.min(position.x + 20, window.innerWidth - 400),
					top: Math.min(position.y - 10, window.innerHeight - 500),
					width: "380px",
					filter: glitchActive ? "hue-rotate(45deg) saturate(150%)" : "none",
				}}
			>
				{/* Holographic Glow */}
				<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 blur-sm" />

				{/* Main Card Container */}
				<div className={`relative bg-gradient-to-br ${getBiomeColor(planetData.biome)} backdrop-blur-xl border border-cyan-400/30 rounded-xl overflow-hidden shadow-2xl`}>
					{/* Scanline Effects */}
					<div className="absolute inset-0 opacity-20">
						<div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse" />
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="absolute w-full h-px bg-cyan-400/20" style={{ top: `${15 + i * 15}%` }} />
						))}
					</div>

					{/* Header */}
					<div className="relative p-4 border-b border-cyan-400/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
								<div>
									<h3 className="text-lg font-bold text-white font-mono tracking-wider">{planetData.name}</h3>
									<p className="text-xs text-cyan-300 uppercase tracking-widest">
										{planetData.type} • {planetData.biome}
									</p>
								</div>
							</div>
							<button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group">
								<X className="w-4 h-4 text-red-400 group-hover:text-red-300" />
							</button>
						</div>

						{/* Coordinates */}
						{planetData.coordinates && <div className="mt-2 text-xs text-cyan-400 font-mono">COORDS: {planetData.coordinates}</div>}
					</div>

					{/* Content Grid */}
					<div className="p-4 space-y-4">
						{/* Primary Stats */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-3">
								<StatItem icon={<Mountain className="w-4 h-4" />} label="RADIUS" value={`${planetData.radius} units`} glitch={glitchActive} />
								<StatItem icon={<Thermometer className="w-4 h-4" />} label="TEMP" value={planetData.temperature} glitch={glitchActive} />
								<StatItem icon={<Wind className="w-4 h-4" />} label="ATMOSPHERE" value={planetData.atmosphere} glitch={glitchActive} />
							</div>
							<div className="space-y-3">
								<StatItem icon={<Zap className="w-4 h-4" />} label="MASS" value={planetData.mass} glitch={glitchActive} />
								<StatItem icon={<Droplets className="w-4 h-4" />} label="HABITABILITY" value={planetData.habitability} valueColor={planetData.habitability === "High" ? "text-green-400" : planetData.habitability === "Medium" ? "text-yellow-400" : "text-red-400"} glitch={glitchActive} />
								<StatItem icon={<Users className="w-4 h-4" />} label="MOONS" value={planetData.moons.toString()} glitch={glitchActive} />
							</div>
						</div>

						{/* Distance */}
						<div className="border-t border-cyan-400/20 pt-3">
							<StatItem icon={<Shield className="w-4 h-4" />} label="DISTANCE FROM STAR" value={planetData.distance} glitch={glitchActive} />
						</div>

						{/* Resources */}
						{planetData.resources && planetData.resources.length > 0 && (
							<div className="border-t border-cyan-400/20 pt-3">
								<div className="mb-2">
									<span className="text-xs text-cyan-400 uppercase tracking-widest font-mono">RESOURCES DETECTED</span>
								</div>
								<div className="flex flex-wrap gap-2">
									{planetData.resources.map((resource, index) => (
										<span key={index} className={`px-2 py-1 text-xs rounded-md border font-mono ${glitchActive ? "bg-red-500/20 border-red-400/30 text-red-300" : "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"}`}>
											{resource}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Threat Level */}
						{planetData.threat_level && (
							<div className="border-t border-cyan-400/20 pt-3">
								<div className="flex items-center justify-between">
									<span className="text-xs text-cyan-400 uppercase tracking-widest font-mono">THREAT ASSESSMENT</span>
									<span className={`text-sm font-bold uppercase tracking-wider ${getThreatColor(planetData.threat_level)}`}>{planetData.threat_level}</span>
								</div>
							</div>
						)}

						{/* Population */}
						{planetData.population && (
							<div className="border-t border-cyan-400/20 pt-3">
								<StatItem icon={<Users className="w-4 h-4" />} label="POPULATION" value={planetData.population} glitch={glitchActive} />
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="p-3 border-t border-cyan-400/20 bg-black/20">
						<div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
							<span>INTEL • CLASSIFIED</span>
							<span>{new Date().toISOString().split("T")[0]}</span>
						</div>
					</div>

					{/* Corner Brackets */}
					<div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/60" />
					<div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/60" />
					<div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/60" />
					<div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/60" />
				</div>

				{/* Data Stream Animation */}
				<div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
				<div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
			</div>
		</>
	);
};

interface StatItemProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	valueColor?: string;
	glitch?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, valueColor = "text-white", glitch = false }) => (
	<div className="flex items-center gap-2">
		<div className={`text-cyan-400 ${glitch ? "text-red-400" : ""}`}>{icon}</div>
		<div className="flex-1 min-w-0">
			<div className="text-xs text-cyan-400 uppercase tracking-widest font-mono opacity-80">{label}</div>
			<div className={`text-sm font-bold font-mono ${glitch ? "text-red-300" : valueColor}`}>{value}</div>
		</div>
	</div>
);
