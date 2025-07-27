/**
 * @file star-stats.tsx
 * @description Star generator quick stats display
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Star } from "lucide-react";

// Star configuration interface
interface StarConfig {
	type: string;
	mass: number;
	temperature: number;
	luminosity: number;
	radius: number;
	age: number;
	evolutionStage: string;
	hasCompanion: boolean;
	companionType: string;
	companionDistance: number;
	metalicity: number;
	rotationPeriod: number;
	magneticField: number;
}

interface StarType {
	value: string;
	label: string;
	description: string;
}

interface StarStatsProps {
	config: StarConfig;
	currentStarType: StarType | undefined;
}

export function StarStats({ config, currentStarType }: StarStatsProps) {
	// Calculate spectral class
	const getSpectralClass = () => {
		const temp = config.temperature;
		if (temp >= 30000) return "O";
		if (temp >= 10000) return "B";
		if (temp >= 7500) return "A";
		if (temp >= 6000) return "F";
		if (temp >= 5200) return "G";
		if (temp >= 3700) return "K";
		return "M";
	};

	// Calculate absolute magnitude
	const getAbsoluteMagnitude = () => {
		return (4.83 - 2.5 * Math.log10(config.luminosity)).toFixed(2);
	};

	// Calculate stellar classification
	const getClassification = () => {
		if (config.type.includes("Giant")) return "Giant";
		if (config.type.includes("Dwarf")) return "Dwarf";
		if (config.type.includes("Variable")) return "Variable";
		if (config.type.includes("Binary")) return "Binary";
		return "Main Sequence";
	};

	// Calculate habitable zone
	const getHabitableZone = () => {
		const innerEdge = Math.sqrt(config.luminosity / 1.1);
		const outerEdge = Math.sqrt(config.luminosity / 0.53);
		return `${innerEdge.toFixed(2)} - ${outerEdge.toFixed(2)} AU`;
	};

	return (
		<div className="absolute bottom-6 right-6 z-20 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-700/30">
			<h3 className="text-yellow-400 font-bold mb-2 flex items-center space-x-2">
				<Star className="w-4 h-4" />
				<span>Star Stats</span>
			</h3>
			<div className="space-y-1 text-sm">
				<div className="flex justify-between">
					<span className="text-slate-400">Type:</span>
					<span className="text-yellow-400">{currentStarType?.value || "Unknown"}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Class:</span>
					<span className="text-blue-400">
						{getSpectralClass()}
						{config.evolutionStage.includes("Giant") ? "III" : "V"}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Classification:</span>
					<span className="text-purple-400">{getClassification()}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Mass:</span>
					<span className="text-green-400">{config.mass.toFixed(2)} M☉</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Temperature:</span>
					<span className="text-orange-400">{config.temperature.toLocaleString()} K</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Luminosity:</span>
					<span className="text-cyan-400">{config.luminosity.toFixed(4)} L☉</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Abs. Mag:</span>
					<span className="text-pink-400">{getAbsoluteMagnitude()}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Habitable Zone:</span>
					<span className="text-emerald-400">{getHabitableZone()}</span>
				</div>
				{config.hasCompanion && (
					<div className="flex justify-between">
						<span className="text-slate-400">Binary:</span>
						<span className="text-red-400">Yes ({config.companionDistance.toFixed(1)} AU)</span>
					</div>
				)}
			</div>
		</div>
	);
}
