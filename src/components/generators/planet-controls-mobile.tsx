/**
 * @file planet-controls-mobile.tsx
 * @description Mobile-optimized controls for the planet generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { PlanetClass, getPlanetTypeByClass } from "@/shared/procgen/planet/planet-types";
import { Settings, Shuffle, RotateCcw, Info, ChevronDown } from "lucide-react";

interface SimplePlanetConfig {
	planetClass: PlanetClass;
	radius: number;
	color: string;
	hasRings: boolean;
	hasMoons: boolean;
	hasAtmosphere: boolean;
}

interface PlanetControlsMobileProps {
	config: SimplePlanetConfig;
	availablePlanetTypes: PlanetClass[];
	onPlanetTypeChange: (planetClass: PlanetClass) => void;
	showSettings: boolean;
	showInfo: boolean;
	onToggleSettings: () => void;
	onToggleInfo: () => void;
	onRegenerate: () => void;
	isMobile?: boolean;
}

export function PlanetControlsMobile({ config, availablePlanetTypes, onPlanetTypeChange, showSettings, showInfo, onToggleSettings, onToggleInfo, onRegenerate, isMobile = false }: PlanetControlsMobileProps) {
	const currentPlanetType = getPlanetTypeByClass(config.planetClass);

	if (isMobile) {
		// Mobile layout - vertical stack with larger touch targets
		return (
			<div className="space-y-4">
				{/* Planet Type Selector */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-300">Planet Type</label>
					<div className="relative">
						<select value={config.planetClass} onChange={(e) => onPlanetTypeChange(e.target.value as PlanetClass)} className="w-full bg-slate-800/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
							{availablePlanetTypes.map((planetClass) => {
								const planetType = getPlanetTypeByClass(planetClass);
								return (
									<option key={planetClass} value={planetClass}>
										{planetType?.name || planetClass}
									</option>
								);
							})}
						</select>
						<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
					</div>
				</div>

				{/* Action Buttons */}
				<div className="grid grid-cols-2 gap-3">
					<button
						onClick={() => {
							const randomType = availablePlanetTypes[Math.floor(Math.random() * availablePlanetTypes.length)];
							if (randomType) {
								onPlanetTypeChange(randomType);
							}
						}}
						className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/30"
					>
						<Shuffle className="w-5 h-5" />
						<span className="font-medium">Random</span>
					</button>

					<button onClick={onRegenerate} className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 transition-colors border border-green-500/30">
						<RotateCcw className="w-5 h-5" />
						<span className="font-medium">Regenerate</span>
					</button>
				</div>

				{/* Panel Toggles */}
				<div className="grid grid-cols-2 gap-3">
					<button onClick={onToggleSettings} className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors border ${showSettings ? "bg-purple-600/30 text-purple-300 border-purple-500/50" : "bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white border-slate-600/50"}`}>
						<Settings className="w-5 h-5" />
						<span className="font-medium">Settings</span>
					</button>

					<button onClick={onToggleInfo} className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors border ${showInfo ? "bg-cyan-600/30 text-cyan-300 border-cyan-500/50" : "bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white border-slate-600/50"}`}>
						<Info className="w-5 h-5" />
						<span className="font-medium">Info</span>
					</button>
				</div>

				{/* Current Planet Type Info */}
				{currentPlanetType && (
					<div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
						<h3 className="text-lg font-semibold text-white mb-2">{currentPlanetType.name}</h3>
						<p className="text-sm text-slate-300">{currentPlanetType.description}</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{currentPlanetType.primaryComposition.length > 0 && <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">{currentPlanetType.primaryComposition[0]}</span>}
							<span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
								{Math.round(currentPlanetType.temperatureRange[0])}K - {Math.round(currentPlanetType.temperatureRange[1])}K
							</span>
							<span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{currentPlanetType.class}</span>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Desktop layout - horizontal with smaller controls
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

			{/* Regenerate Button */}
			<button onClick={onRegenerate} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors" title="Regenerate Planet">
				<RotateCcw className="w-4 h-4" />
			</button>

			{/* Settings Toggle */}
			<button onClick={onToggleSettings} className={`p-2 rounded-lg transition-colors ${showSettings ? "bg-purple-600/30 text-purple-400" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Settings">
				<Settings className="w-4 h-4" />
			</button>

			{/* Info Toggle */}
			<button onClick={onToggleInfo} className={`p-2 rounded-lg transition-colors ${showInfo ? "bg-cyan-600/30 text-cyan-400" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Information">
				<Info className="w-4 h-4" />
			</button>
		</div>
	);
}

export default PlanetControlsMobile;
