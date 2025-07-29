/**
 * @file galaxy-controls.tsx
 * @description Galaxy generator control buttons and selectors
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Settings, Shuffle, Info, Play, RotateCcw } from "lucide-react";

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

interface GalaxyControlsProps {
	config: GalaxyConfig;
	availableGalaxyTypes: GalaxyType[];
	onGalaxyTypeChange: (type: string) => void;
	showSettings: boolean;
	showInfo: boolean;
	onToggleSettings: () => void;
	onToggleInfo: () => void;
	onRandomize: () => void;
	onGenerate: () => void;
	isGenerating: boolean;
}

export function GalaxyControls({ config, availableGalaxyTypes, onGalaxyTypeChange, showSettings, showInfo, onToggleSettings, onToggleInfo, onRandomize, onGenerate, isGenerating }: GalaxyControlsProps) {
	return (
		<div className="flex items-center space-x-3">
			{/* Galaxy Type Selector */}
			<select value={config.type} onChange={(e) => onGalaxyTypeChange(e.target.value)} className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
				{availableGalaxyTypes.map((galaxyType) => (
					<option key={galaxyType.value} value={galaxyType.value}>
						{galaxyType.label}
					</option>
				))}
			</select>

			{/* Generate Button */}
			<button onClick={onGenerate} disabled={isGenerating} className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Generate Galaxy">
				<Play className="w-4 h-4" />
				<span className="text-sm">Generate</span>
			</button>

			{/* Random Galaxy Button */}
			<button onClick={onRandomize} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors" title="Random Galaxy">
				<Shuffle className="w-4 h-4" />
			</button>

			{/* Settings Button */}
			<button onClick={onToggleSettings} className={`p-2 rounded-lg transition-colors ${showSettings ? "bg-purple-600/50 text-purple-300" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Settings">
				<Settings className="w-4 h-4" />
			</button>

			{/* Info Button */}
			<button onClick={onToggleInfo} className={`p-2 rounded-lg transition-colors ${showInfo ? "bg-blue-600/50 text-blue-300" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Galaxy Info">
				<Info className="w-4 h-4" />
			</button>

			{/* Clear Button */}
			<button
				onClick={() => {
					/* Clear will be handled by renderer */
				}}
				className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
				title="Clear Galaxy"
			>
				<RotateCcw className="w-4 h-4" />
			</button>
		</div>
	);
}
