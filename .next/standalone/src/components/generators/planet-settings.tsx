/**
 * @file planet-settings.tsx
 * @description Planet generator settings panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Settings } from "lucide-react";
import { PlanetClass } from "@/shared/procgen/planet/planet-types";

interface SimplePlanetConfig {
	planetClass: PlanetClass;
	radius: number;
	color: string;
	hasRings: boolean;
	hasMoons: boolean;
	hasAtmosphere: boolean;
	// Surface Details (NEW)
	enableVegetation: boolean;
	treeCount: number;
	surfaceDetail: number;
}

interface PlanetSettingsProps {
	config: SimplePlanetConfig;
	onConfigChange: (config: SimplePlanetConfig) => void;
	onClose: () => void;
}

export function PlanetSettings({ config, onConfigChange, onClose }: PlanetSettingsProps) {
	const updateConfig = (updates: Partial<SimplePlanetConfig>) => {
		onConfigChange({ ...config, ...updates });
	};

	return (
		<div className="absolute top-24 right-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-white font-bold flex items-center space-x-2">
					<Settings className="w-4 h-4" />
					<span>Settings</span>
				</h3>
				<button onClick={onClose} className="text-slate-400 hover:text-white">
					×
				</button>
			</div>

			<div className="space-y-4">
				{/* Size */}
				<div>
					<label className="block text-sm text-slate-300 mb-2">Planet Size</label>
					<input type="range" min="1" max="4" step="0.5" value={config.radius} onChange={(e) => updateConfig({ radius: parseFloat(e.target.value) })} className="w-full accent-blue-500" />
					<div className="flex justify-between text-xs text-slate-500 mt-1">
						<span>Small</span>
						<span>Large</span>
					</div>
				</div>

				{/* Color */}
				<div>
					<label className="block text-sm text-slate-300 mb-2">Planet Color</label>
					<input type="color" value={config.color} onChange={(e) => updateConfig({ color: e.target.value })} className="w-full h-10 rounded border border-slate-600" />
				</div>

				{/* Features */}
				<div>
					<label className="block text-sm text-slate-300 mb-2">Features</label>
					<div className="space-y-2">
						<label className="flex items-center space-x-2 text-sm text-slate-300">
							<input type="checkbox" checked={config.hasAtmosphere} onChange={(e) => updateConfig({ hasAtmosphere: e.target.checked })} className="rounded" />
							<span>Atmosphere</span>
						</label>
						<label className="flex items-center space-x-2 text-sm text-slate-300">
							<input type="checkbox" checked={config.hasRings} onChange={(e) => updateConfig({ hasRings: e.target.checked })} className="rounded" />
							<span>Rings</span>
						</label>
						<label className="flex items-center space-x-2 text-sm text-slate-300">
							<input type="checkbox" checked={config.hasMoons} onChange={(e) => updateConfig({ hasMoons: e.target.checked })} className="rounded" />
							<span>Moons</span>
						</label>
					</div>
				</div>

				{/* Surface Details for Habitable Planets */}
				<div>
					<label className="block text-sm text-slate-300 mb-2">Surface Details</label>
					<div className="space-y-3">
						<label className="flex items-center space-x-2 text-sm text-slate-300">
							<input type="checkbox" checked={config.enableVegetation} onChange={(e) => updateConfig({ enableVegetation: e.target.checked })} className="rounded" />
							<span>Enable Vegetation (Trees)</span>
						</label>

						{config.enableVegetation && (
							<>
								<div>
									<label className="block text-xs text-slate-400 mb-1">Tree Count: {config.treeCount}</label>
									<input type="range" min="50" max="1000" step="50" value={config.treeCount} onChange={(e) => updateConfig({ treeCount: parseInt(e.target.value) })} className="w-full accent-green-500" />
									<div className="flex justify-between text-xs text-slate-500 mt-1">
										<span>Sparse</span>
										<span>Dense Forest</span>
									</div>
								</div>

								<div>
									<label className="block text-xs text-slate-400 mb-1">Surface Detail: {(config.surfaceDetail * 100).toFixed(0)}%</label>
									<input type="range" min="0.1" max="1.0" step="0.1" value={config.surfaceDetail} onChange={(e) => updateConfig({ surfaceDetail: parseFloat(e.target.value) })} className="w-full accent-green-500" />
									<div className="flex justify-between text-xs text-slate-500 mt-1">
										<span>Basic</span>
										<span>Ultra Detail</span>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
