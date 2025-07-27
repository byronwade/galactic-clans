/**
 * @file star-controls.tsx
 * @description Star generator control buttons and selectors
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Settings, Shuffle, Info, Play, RotateCcw } from "lucide-react";

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

interface StarControlsProps {
	config: StarConfig;
	availableStarTypes: StarType[];
	onStarTypeChange: (type: string) => void;
	showSettings: boolean;
	showInfo: boolean;
	onToggleSettings: () => void;
	onToggleInfo: () => void;
	onRandomize: () => void;
	onGenerate: () => void;
	isGenerating: boolean;
}

export function StarControls({ config, availableStarTypes, onStarTypeChange, showSettings, showInfo, onToggleSettings, onToggleInfo, onRandomize, onGenerate, isGenerating }: StarControlsProps) {
	return (
		<div className="flex items-center space-x-3">
			{/* Star Type Selector */}
			<select value={config.type} onChange={(e) => onStarTypeChange(e.target.value)} className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
				{availableStarTypes.map((starType) => (
					<option key={starType.value} value={starType.value}>
						{starType.label}
					</option>
				))}
			</select>

			{/* Generate Button */}
			<button onClick={onGenerate} disabled={isGenerating} className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Generate Star">
				<Play className="w-4 h-4" />
				<span className="text-sm">Generate</span>
			</button>

			{/* Random Star Button */}
			<button onClick={onRandomize} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors" title="Random Star">
				<Shuffle className="w-4 h-4" />
			</button>

			{/* Settings Button */}
			<button onClick={onToggleSettings} className={`p-2 rounded-lg transition-colors ${showSettings ? "bg-yellow-600/50 text-yellow-300" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Settings">
				<Settings className="w-4 h-4" />
			</button>

			{/* Info Button */}
			<button onClick={onToggleInfo} className={`p-2 rounded-lg transition-colors ${showInfo ? "bg-blue-600/50 text-blue-300" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white"}`} title="Star Info">
				<Info className="w-4 h-4" />
			</button>

			{/* Clear Button */}
			<button
				onClick={() => {
					/* Clear will be handled by renderer */
				}}
				className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
				title="Clear Star"
			>
				<RotateCcw className="w-4 h-4" />
			</button>
		</div>
	);
}
