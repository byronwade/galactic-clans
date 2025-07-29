/**
 * @file star-settings.tsx
 * @description Star generator settings panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Settings } from "lucide-react";

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

interface StarSettingsProps {
	config: StarConfig;
	onConfigChange: (config: StarConfig) => void;
	onClose: () => void;
	availableStarTypes: StarType[];
}

export function StarSettings({ config, onConfigChange, onClose, availableStarTypes }: StarSettingsProps) {
	const updateConfig = (updates: Partial<StarConfig>) => {
		onConfigChange({ ...config, ...updates });
	};

	return (
		<div className="absolute top-24 right-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80 max-h-[calc(100vh-120px)] overflow-y-auto">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-white font-bold flex items-center space-x-2">
					<Settings className="w-4 h-4" />
					<span>Star Settings</span>
				</h3>
				<button onClick={onClose} className="text-slate-400 hover:text-white">
					×
				</button>
			</div>

			<div className="space-y-4">
				{/* Star Type */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Star Type</label>
					<select value={config.type} onChange={(e) => updateConfig({ type: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
						{availableStarTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
					<p className="text-xs text-slate-400 mt-1">{availableStarTypes.find((t) => t.value === config.type)?.description}</p>
				</div>

				{/* Mass */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Mass: {config.mass.toFixed(2)} M☉</label>
					<input type="range" min="0.08" max="50" step="0.1" value={config.mass} onChange={(e) => updateConfig({ mass: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
					<div className="flex justify-between text-xs text-slate-500 mt-1">
						<span>0.08</span>
						<span>50 M☉</span>
					</div>
				</div>

				{/* Temperature */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Temperature: {config.temperature.toLocaleString()} K</label>
					<input type="range" min="2000" max="50000" step="100" value={config.temperature} onChange={(e) => updateConfig({ temperature: parseInt(e.target.value) })} className="w-full accent-yellow-500" />
					<div className="flex justify-between text-xs text-slate-500 mt-1">
						<span>2,000K</span>
						<span>50,000K</span>
					</div>
				</div>

				{/* Luminosity */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Luminosity: {config.luminosity.toFixed(4)} L☉</label>
					<input type="range" min="0.0001" max="1000000" step="0.0001" value={config.luminosity} onChange={(e) => updateConfig({ luminosity: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
				</div>

				{/* Radius */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Radius: {config.radius.toFixed(2)} R☉</label>
					<input type="range" min="0.005" max="1000" step="0.1" value={config.radius} onChange={(e) => updateConfig({ radius: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
				</div>

				{/* Age */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Age: {config.age.toFixed(1)} Gyr</label>
					<input type="range" min="0.01" max="13.8" step="0.1" value={config.age} onChange={(e) => updateConfig({ age: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
				</div>

				{/* Binary System */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Binary System</label>
					<div className="flex items-center space-x-2">
						<input type="checkbox" checked={config.hasCompanion} onChange={(e) => updateConfig({ hasCompanion: e.target.checked })} className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
						<span className="text-slate-300 text-sm">Has companion star</span>
					</div>
				</div>

				{/* Companion Distance (if binary) */}
				{config.hasCompanion && (
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">Companion Distance: {config.companionDistance.toFixed(1)} AU</label>
						<input type="range" min="0.1" max="1000" step="0.1" value={config.companionDistance} onChange={(e) => updateConfig({ companionDistance: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
					</div>
				)}

				{/* Advanced Settings */}
				<div className="border-t border-slate-700/50 pt-4">
					<h4 className="text-slate-300 font-medium mb-3">Advanced Properties</h4>

					{/* Metallicity */}
					<div className="mb-3">
						<label className="block text-sm text-slate-300 mb-1">Metallicity: {config.metalicity.toFixed(4)}</label>
						<input type="range" min="0.0001" max="0.05" step="0.0001" value={config.metalicity} onChange={(e) => updateConfig({ metalicity: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
					</div>

					{/* Rotation Period */}
					<div className="mb-3">
						<label className="block text-sm text-slate-300 mb-1">Rotation Period: {config.rotationPeriod.toFixed(1)} days</label>
						<input type="range" min="0.1" max="100" step="0.1" value={config.rotationPeriod} onChange={(e) => updateConfig({ rotationPeriod: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
					</div>

					{/* Magnetic Field */}
					<div>
						<label className="block text-sm text-slate-300 mb-1">Magnetic Field: {config.magneticField.toFixed(1)}× Solar</label>
						<input type="range" min="0.1" max="100" step="0.1" value={config.magneticField} onChange={(e) => updateConfig({ magneticField: parseFloat(e.target.value) })} className="w-full accent-yellow-500" />
					</div>
				</div>
			</div>
		</div>
	);
}
