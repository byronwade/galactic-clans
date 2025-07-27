/**
 * @file solar-system-stats.tsx
 * @description Stats panel for the Solar System Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { BarChart3, Sun, Globe, Orbit, Zap, Clock } from "lucide-react";
import type { SolarSystemConfig } from "./solar-system-generator";

interface SolarSystemStatsProps {
	config: SolarSystemConfig;
	currentSystemType: { value: string; label: string; description: string };
}

export function SolarSystemStats({ config, currentSystemType }: SolarSystemStatsProps) {
	// Calculate derived properties
	const getLuminosity = () => {
		// L ∝ M^3.5 for main sequence stars
		return Math.pow(config.starMass, 3.5);
	};

	const getHabitableZoneWidth = () => {
		return config.habitableZone.outer - config.habitableZone.inner;
	};

	const getSystemDensity = () => {
		// Simple approximation based on planet count and system age
		return config.planetCount / (config.systemAge + 1);
	};

	const getStabilityIndex = () => {
		// Higher for older systems with fewer planets
		const ageScore = Math.min(config.systemAge / 13.8, 1) * 50;
		const countScore = Math.max(0, (15 - config.planetCount) / 15) * 30;
		const typeScore = config.starType === "solar_analog" ? 20 : 
						config.starType === "red_dwarf_system" ? 15 :
						config.starType === "binary_system" ? 5 : 10;
		return Math.min(100, ageScore + countScore + typeScore);
	};

	return (
		<div className="absolute bottom-4 right-4 w-72 bg-slate-900/95 backdrop-blur-xl border border-orange-400/30 rounded-lg shadow-2xl z-20">
			<div className="p-4">
				{/* Header */}
				<div className="flex items-center space-x-2 mb-3">
					<BarChart3 className="w-5 h-5 text-orange-400" />
					<h3 className="text-lg font-bold text-white">System Statistics</h3>
				</div>

				<div className="space-y-3">
					{/* Quick Stats Grid */}
					<div className="grid grid-cols-2 gap-3">
						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Sun className="w-4 h-4 text-orange-400" />
									<span className="text-xs text-slate-400">Type</span>
								</div>
								<span className="text-sm font-bold text-white">{currentSystemType.label}</span>
							</div>
						</div>

						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Globe className="w-4 h-4 text-blue-400" />
									<span className="text-xs text-slate-400">Planets</span>
								</div>
								<span className="text-sm font-bold text-white">{config.planetCount}</span>
							</div>
						</div>

						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Zap className="w-4 h-4 text-yellow-400" />
									<span className="text-xs text-slate-400">Mass</span>
								</div>
								<span className="text-sm font-bold text-white font-mono">{config.starMass.toFixed(1)} M☉</span>
							</div>
						</div>

						<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Clock className="w-4 h-4 text-purple-400" />
									<span className="text-xs text-slate-400">Age</span>
								</div>
								<span className="text-sm font-bold text-white font-mono">{config.systemAge.toFixed(1)} Gyr</span>
							</div>
						</div>
					</div>

					{/* Detailed Properties */}
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-xs text-slate-400">Luminosity</span>
							<span className="text-sm text-orange-300 font-mono">{getLuminosity().toFixed(2)} L☉</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-xs text-slate-400">Temperature</span>
							<span className="text-sm text-red-300 font-mono">{config.starTemperature.toFixed(0)} K</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-xs text-slate-400">HZ Width</span>
							<span className="text-sm text-green-300 font-mono">{getHabitableZoneWidth().toFixed(2)} AU</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-xs text-slate-400">Metallicity</span>
							<span className="text-sm text-blue-300 font-mono">{(config.metalicity * 100).toFixed(2)}%</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-xs text-slate-400">Stability Index</span>
							<span className="text-sm text-cyan-300 font-mono">{getStabilityIndex().toFixed(0)}/100</span>
						</div>
					</div>

					{/* System Features */}
					<div className="pt-2 border-t border-slate-700/50">
						<div className="text-xs text-slate-400 mb-2">System Features</div>
						<div className="flex flex-wrap gap-1">
							{config.hasGasGiants && <div className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-xs text-blue-300">Gas Giants</div>}
							{config.hasTerrestrialPlanets && <div className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded text-xs text-green-300">Terrestrial</div>}
							{config.asteroidBelt && <div className="px-2 py-1 bg-gray-500/20 border border-gray-400/30 rounded text-xs text-gray-300">Asteroids</div>}
							{config.hasRoguePlanets && <div className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 rounded text-xs text-purple-300">Rogues</div>}
							{config.cometCount > 50 && <div className="px-2 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded text-xs text-cyan-300">Rich Comets</div>}
						</div>
					</div>

					{/* Habitability Assessment */}
					<div className="pt-2 border-t border-slate-700/50">
						<div className="text-xs text-slate-400 mb-2">Habitability Assessment</div>
						<div className="space-y-1">
							<div className="flex justify-between text-xs">
								<span className="text-slate-400">Zone Position</span>
								<span className={`font-mono ${config.habitableZone.inner < 1.5 && config.habitableZone.outer > 0.8 ? "text-green-400" : "text-yellow-400"}`}>{config.habitableZone.inner < 1.5 && config.habitableZone.outer > 0.8 ? "Optimal" : "Marginal"}</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-slate-400">Star Stability</span>
								<span className={`font-mono ${config.starMass < 1.5 ? "text-green-400" : "text-red-400"}`}>{config.starMass < 1.5 ? "Stable" : "Variable"}</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-slate-400">System Age</span>
								<span className={`font-mono ${config.systemAge > 1.0 && config.systemAge < 10.0 ? "text-green-400" : "text-yellow-400"}`}>{config.systemAge > 1.0 && config.systemAge < 10.0 ? "Mature" : config.systemAge <= 1.0 ? "Young" : "Ancient"}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 