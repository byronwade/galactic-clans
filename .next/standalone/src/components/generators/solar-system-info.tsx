/**
 * @file solar-system-info.tsx
 * @description Info panel for the Solar System Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { X, Info, Sun, Globe, Zap } from "lucide-react";
import type { SolarSystemConfig } from "./solar-system-generator";

interface SolarSystemInfoProps {
	systemType: string;
	config: SolarSystemConfig;
	onClose: () => void;
}

export function SolarSystemInfo({ systemType, config, onClose }: SolarSystemInfoProps) {
	const getSystemCharacteristics = (type: string) => {
		const characteristics = {
			solar_analog: {
				description: "A planetary system similar to our own Solar System, with a Sun-like star and diverse planetary types.",
				formation: "Formed from a collapsing molecular cloud about 4.6 billion years ago.",
				stability: "Highly stable with well-defined orbital resonances.",
				habitability: "Contains multiple planets within or near the habitable zone."
			},
			red_dwarf_system: {
				description: "System around a small, cool, long-lived red dwarf star.",
				formation: "Red dwarfs are the most common stars and can live for trillions of years.",
				stability: "Very stable but planets may be tidally locked.",
				habitability: "Habitable zone is very close to the star."
			},
			binary_system: {
				description: "System with two stars orbiting around their common center of mass.",
				formation: "About half of all star systems are binary or multiple systems.",
				stability: "Complex gravitational dynamics can create unstable orbits.",
				habitability: "Planets may have extreme temperature variations."
			},
			giant_star_system: {
				description: "System around a massive, luminous giant star.",
				formation: "Massive stars evolve quickly and have short lifespans.",
				stability: "System will be disrupted when the star goes supernova.",
				habitability: "Intense radiation makes habitability unlikely."
			},
			young_system: {
				description: "A recently formed planetary system still in early evolution.",
				formation: "Heavy bombardment period with frequent impacts.",
				stability: "Orbits are still settling into stable configurations.",
				habitability: "Too chaotic for complex life to develop."
			},
			ancient_system: {
				description: "An old, evolved system that has had billions of years to develop.",
				formation: "Formed in the early universe with low metallicity.",
				stability: "Extremely stable with well-settled orbits.",
				habitability: "May harbor ancient civilizations if life developed."
			}
		};
		
		return characteristics[type as keyof typeof characteristics] || characteristics.solar_analog;
	};

	const characteristics = getSystemCharacteristics(systemType);

	return (
		<div className="absolute top-32 right-4 w-96 bg-slate-900/95 backdrop-blur-xl border border-orange-400/30 rounded-lg shadow-2xl z-30 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
			<div className="p-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold text-white flex items-center space-x-2">
						<Info className="w-5 h-5 text-orange-400" />
						<span>System Information</span>
					</h3>
					<button onClick={onClose} className="text-slate-400 hover:text-white transition-colors duration-200">
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="space-y-4">
					{/* System Overview */}
					<div>
						<h4 className="text-sm font-semibold text-orange-400 mb-2">System Overview</h4>
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<h5 className="font-medium text-white mb-1">{config.systemName}</h5>
							<p className="text-sm text-slate-300">{characteristics.description}</p>
						</div>
					</div>

					{/* Formation & Evolution */}
					<div>
						<h4 className="text-sm font-semibold text-orange-400 mb-2">Formation & Evolution</h4>
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<p className="text-sm text-slate-300">{characteristics.formation}</p>
						</div>
					</div>

					{/* Stability */}
					<div>
						<h4 className="text-sm font-semibold text-orange-400 mb-2">Orbital Stability</h4>
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<p className="text-sm text-slate-300">{characteristics.stability}</p>
						</div>
					</div>

					{/* Habitability */}
					<div>
						<h4 className="text-sm font-semibold text-orange-400 mb-2">Habitability Assessment</h4>
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<p className="text-sm text-slate-300">{characteristics.habitability}</p>
							<div className="mt-2 text-xs text-green-400">
								Habitable Zone: {config.habitableZone.inner.toFixed(2)} - {config.habitableZone.outer.toFixed(2)} AU
							</div>
						</div>
					</div>

					{/* Physical Properties */}
					<div>
						<h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center space-x-1">
							<Sun className="w-4 h-4" />
							<span>Stellar Properties</span>
						</h4>
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Mass:</span>
								<span className="text-white font-mono">{config.starMass.toFixed(2)} M☉</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Radius:</span>
								<span className="text-white font-mono">{config.starRadius.toFixed(2)} R☉</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Temperature:</span>
								<span className="text-white font-mono">{config.starTemperature.toFixed(0)} K</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Age:</span>
								<span className="text-white font-mono">{config.systemAge.toFixed(1)} Gyr</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Metallicity:</span>
								<span className="text-white font-mono">{(config.metalicity * 100).toFixed(2)}%</span>
							</div>
						</div>
					</div>

					{/* System Composition */}
					<div>
						<h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center space-x-1">
							<Globe className="w-4 h-4" />
							<span>System Composition</span>
						</h4>
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Planets:</span>
								<span className="text-white font-mono">{config.planetCount}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Comets:</span>
								<span className="text-white font-mono">{config.cometCount}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Asteroid Belt:</span>
								<span className="text-white">{config.asteroidBelt ? "Present" : "Absent"}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Gas Giants:</span>
								<span className="text-white">{config.hasGasGiants ? "Present" : "Absent"}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-slate-400">Terrestrials:</span>
								<span className="text-white">{config.hasTerrestrialPlanets ? "Present" : "Absent"}</span>
							</div>
						</div>
					</div>

					{/* Real World Examples */}
					<div>
						<h4 className="text-sm font-semibold text-orange-400 mb-2">Real World Examples</h4>
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<div className="text-sm text-slate-300">
								{systemType === "solar_analog" && "Solar System, Tau Ceti system"}
								{systemType === "red_dwarf_system" && "Proxima Centauri system, TRAPPIST-1"}
								{systemType === "binary_system" && "Alpha Centauri AB, Kepler-16"}
								{systemType === "giant_star_system" && "Aldebaran system, Pollux system"}
								{systemType === "young_system" && "HL Tauri, TW Hydrae"}
								{systemType === "ancient_system" && "Kapteyn's Star system, HD 140283"}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Scrollbar */}
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(30, 41, 59, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(148, 163, 184, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(148, 163, 184, 0.5);
				}
			`}</style>
		</div>
	);
} 