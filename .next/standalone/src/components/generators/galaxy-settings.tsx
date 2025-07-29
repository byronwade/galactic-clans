/**
 * @file galaxy-settings.tsx
 * @description Galaxy generator settings panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Settings } from "lucide-react";

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

interface GalaxySettingsProps {
	config: GalaxyConfig;
	onConfigChange: (config: GalaxyConfig) => void;
	onClose: () => void;
	availableGalaxyTypes: GalaxyType[];
}

export function GalaxySettings({ config, onConfigChange, onClose, availableGalaxyTypes }: GalaxySettingsProps) {
	const updateConfig = (updates: Partial<GalaxyConfig>) => {
		onConfigChange({ ...config, ...updates });
	};

	return (
		<div className="absolute top-24 right-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80 max-h-[calc(100vh-120px)] overflow-y-auto">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-white font-bold flex items-center space-x-2">
					<Settings className="w-4 h-4" />
					<span>Galaxy Settings</span>
				</h3>
				<button onClick={onClose} className="text-slate-400 hover:text-white">
					×
				</button>
			</div>

			<div className="space-y-4">
				{/* Galaxy Type */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Galaxy Type</label>
					<select value={config.type} onChange={(e) => updateConfig({ type: e.target.value })} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
						{availableGalaxyTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
					<p className="text-xs text-slate-400 mt-1">{availableGalaxyTypes.find((t) => t.value === config.type)?.description}</p>
				</div>

				{/* Star Count */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Star Count: {config.starCount.toLocaleString()}</label>
					<input type="range" min="10000" max="200000" step="5000" value={config.starCount} onChange={(e) => updateConfig({ starCount: parseInt(e.target.value) })} className="w-full accent-purple-500" />
					<div className="flex justify-between text-xs text-slate-500 mt-1">
						<span>10K</span>
						<span>200K</span>
					</div>
				</div>

				{/* Galaxy Radius */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Galaxy Radius: {config.radius.toFixed(1)}</label>
					<input type="range" min="5" max="30" step="0.5" value={config.radius} onChange={(e) => updateConfig({ radius: parseFloat(e.target.value) })} className="w-full accent-purple-500" />
				</div>

				{/* Spiral Arms */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Spiral Arms: {config.arms}</label>
					<input type="range" min="1" max="8" step="1" value={config.arms} onChange={(e) => updateConfig({ arms: parseInt(e.target.value) })} className="w-full accent-purple-500" />
				</div>

				{/* Arm Separation */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Arm Separation: {config.armSeparation.toFixed(2)}</label>
					<input type="range" min="0.1" max="1.0" step="0.05" value={config.armSeparation} onChange={(e) => updateConfig({ armSeparation: parseFloat(e.target.value) })} className="w-full accent-purple-500" />
				</div>

				{/* Spin */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Spin: {config.spin.toFixed(2)}</label>
					<input type="range" min="0.1" max="2.0" step="0.1" value={config.spin} onChange={(e) => updateConfig({ spin: parseFloat(e.target.value) })} className="w-full accent-purple-500" />
				</div>

				{/* Randomness */}
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">Randomness: {config.randomness.toFixed(2)}</label>
					<input type="range" min="0.1" max="1.0" step="0.05" value={config.randomness} onChange={(e) => updateConfig({ randomness: parseFloat(e.target.value) })} className="w-full accent-purple-500" />
				</div>

				{/* Colors */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm text-slate-300 mb-2">Inner Color</label>
						<input type="color" value={config.insideColor} onChange={(e) => updateConfig({ insideColor: e.target.value })} className="w-full h-10 rounded border border-slate-600" />
					</div>
					<div>
						<label className="block text-sm text-slate-300 mb-2">Outer Color</label>
						<input type="color" value={config.outsideColor} onChange={(e) => updateConfig({ outsideColor: e.target.value })} className="w-full h-10 rounded border border-slate-600" />
					</div>
				</div>

				{/* Advanced Settings */}
				<div className="border-t border-slate-700/50 pt-4">
					<h4 className="text-slate-300 font-medium mb-3">Advanced Settings</h4>

					{/* Bulge Factor */}
					<div className="mb-3">
						<label className="block text-sm text-slate-300 mb-1">Bulge Factor: {config.bulgeFactor.toFixed(2)}</label>
						<input type="range" min="0.1" max="1.0" step="0.05" value={config.bulgeFactor} onChange={(e) => updateConfig({ bulgeFactor: parseFloat(e.target.value) })} className="w-full accent-purple-500" />
					</div>

					{/* Spiral Tightness */}
					<div className="mb-3">
						<label className="block text-sm text-slate-300 mb-1">Spiral Tightness: {config.spiralTightness.toFixed(2)}</label>
						<input type="range" min="0.1" max="2.0" step="0.1" value={config.spiralTightness} onChange={(e) => updateConfig({ spiralTightness: parseFloat(e.target.value) })} className="w-full accent-purple-500" />
					</div>

					{/* Disk Thickness */}
					<div>
						<label className="block text-sm text-slate-300 mb-1">Disk Thickness: {config.diskThickness.toFixed(2)}</label>
						<input type="range" min="0.1" max="0.5" step="0.05" value={config.diskThickness} onChange={(e) => updateConfig({ diskThickness: parseFloat(e.target.value) })} className="w-full accent-purple-500" />
					</div>
				</div>
			</div>
		</div>
	);
}
