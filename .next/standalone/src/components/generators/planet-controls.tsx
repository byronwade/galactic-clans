/**
 * @file planet-controls.tsx
 * @description Planet generator control buttons and selectors
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { PlanetClass, getPlanetTypeByClass } from "@/shared/procgen/planet/planet-types";
import { Settings, Shuffle, RotateCcw, Info } from "lucide-react";

interface SimplePlanetConfig {
	planetClass: PlanetClass;
	radius: number;
	color: string;
	hasRings: boolean;
	hasMoons: boolean;
	hasAtmosphere: boolean;
}

interface PlanetControlsProps {
	config: SimplePlanetConfig;
	availablePlanetTypes: PlanetClass[];
	onPlanetTypeChange: (planetClass: PlanetClass) => void;
	showSettings: boolean;
	showInfo: boolean;
	onToggleSettings: () => void;
	onToggleInfo: () => void;
	onRegenerate: () => void;
}

export function PlanetControls({ config, availablePlanetTypes, onPlanetTypeChange, showSettings, showInfo, onToggleSettings, onToggleInfo, onRegenerate }: PlanetControlsProps) {
	return (
		<div className="flex items-center space-x-3">
			{/* Planet Type Selector */}
			<select value={config.planetClass} onChange={(e) => onPlanetTypeChange(e.target.value as PlanetClass)} className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
				{availablePlanetTypes.map((planetClass) => {
					const planetType = getPlanetTypeByClass(planetClass);
					return (
						<option key={planetClass} value={planetClass}>
							{planetType?.name || planetClass}
						</option>
					);
				})}
			</select>

			{/* Random Planet Button */}
			<button
				onClick={() => {
					const randomType = availablePlanetTypes[Math.floor(Math.random() * availablePlanetTypes.length)];
					if (randomType) {
						onPlanetTypeChange(randomType);
					}
				}}
				className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
				title="Random Planet"
			>
				<Shuffle className="w-4 h-4" />
			</button>

			{/* Settings Button */}
			<button onClick={onToggleSettings} className={`p-2 rounded-lg transition-colors ${showSettings ? "bg-purple-600/50 text-purple-300" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Settings">
				<Settings className="w-4 h-4" />
			</button>

			{/* Info Button */}
			<button onClick={onToggleInfo} className={`p-2 rounded-lg transition-colors ${showInfo ? "bg-blue-600/50 text-blue-300" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Info">
				<Info className="w-4 h-4" />
			</button>

			{/* Regenerate Button */}
			<button onClick={onRegenerate} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors" title="Regenerate">
				<RotateCcw className="w-4 h-4" />
			</button>
		</div>
	);
}
