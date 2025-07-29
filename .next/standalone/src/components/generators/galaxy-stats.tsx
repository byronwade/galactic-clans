/**
 * @file galaxy-stats.tsx
 * @description Galaxy generator quick stats display
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Sparkles } from "lucide-react";

// Galaxy configuration interface
interface GalaxyConfig {
	type: string;
	starCount: number;
	radius: number;
	arms: number;
	armSeparation: number;
	spin: number;
	randomness: number;
	power: number;
	insideColor: string;
	outsideColor: string;
	clusterness: number;
	spiralTightness: number;
	bulgeFactor: number;
	diskThickness: number;
}

interface GalaxyType {
	value: string;
	label: string;
	description: string;
}

interface GalaxyStatsProps {
	config: GalaxyConfig;
	currentGalaxyType: GalaxyType | undefined;
}

export function GalaxyStats({ config, currentGalaxyType }: GalaxyStatsProps) {
	// Calculate estimated mass based on star count and type
	const getEstimatedMass = () => {
		const baseStarMass = 1; // Solar masses per star (average)
		const stellarMass = config.starCount * baseStarMass;

		// Add dark matter and gas (roughly 10x stellar mass for spiral, 5x for elliptical)
		const multiplier = config.type.startsWith("E") ? 5 : 10;
		const totalMass = stellarMass * multiplier;

		if (totalMass >= 1e12) {
			return `${(totalMass / 1e12).toFixed(1)}T M☉`;
		} else if (totalMass >= 1e9) {
			return `${(totalMass / 1e9).toFixed(1)}B M☉`;
		} else {
			return `${(totalMass / 1e6).toFixed(1)}M M☉`;
		}
	};

	// Calculate galaxy classification
	const getClassification = () => {
		if (config.type.startsWith("E")) return "Elliptical";
		if (config.type.includes("Irr")) return "Irregular";
		if (config.type.includes("SB")) return "Barred Spiral";
		return "Spiral";
	};

	return (
		<div className="absolute bottom-6 right-6 z-20 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-700/30">
			<h3 className="text-purple-400 font-bold mb-2 flex items-center space-x-2">
				<Sparkles className="w-4 h-4" />
				<span>Galaxy Stats</span>
			</h3>
			<div className="space-y-1 text-sm">
				<div className="flex justify-between">
					<span className="text-slate-400">Type:</span>
					<span className="text-purple-400">{currentGalaxyType?.value || "Unknown"}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Classification:</span>
					<span className="text-blue-400">{getClassification()}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Stars:</span>
					<span className="text-green-400">{config.starCount.toLocaleString()}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Radius:</span>
					<span className="text-yellow-400">{config.radius.toFixed(1)} kly</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Arms:</span>
					<span className="text-cyan-400">{config.arms}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Est. Mass:</span>
					<span className="text-orange-400">{getEstimatedMass()}</span>
				</div>
			</div>
		</div>
	);
}
