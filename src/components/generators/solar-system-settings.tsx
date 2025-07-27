/**
 * @file solar-system-settings.tsx
 * @description Settings panel for the Solar System Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { X, Sun, Globe } from "lucide-react";
import type { SolarSystemConfig } from "./solar-system-generator";

interface SolarSystemSettingsProps {
	config: SolarSystemConfig;
	onConfigChange: (updates: Partial<SolarSystemConfig>) => void;
	onClose: () => void;
	availableSystemTypes: Array<{ value: string; label: string; description: string }>;
}

export function SolarSystemSettings({
	config,
	onConfigChange,
	onClose,
	availableSystemTypes
}: SolarSystemSettingsProps) {
	const updateConfig = (updates: Partial<SolarSystemConfig>) => {
		onConfigChange(updates);
	};

	return (
		<div className="absolute top-32 left-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-orange-400/30 rounded-lg shadow-2xl z-30 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
			<div className="p-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold text-white flex items-center space-x-2">
						<Sun className="w-5 h-5 text-orange-400" />
						<span>System Settings</span>
					</h3>
					<button onClick={onClose} className="text-slate-400 hover:text-white transition-colors duration-200">
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="space-y-4">
					{/* System Name */}
					<div>
						<label className="block text-sm text-slate-300 mb-2">System Name</label>
						<input
							type="text"
							value={config.systemName}
							onChange={(e) => updateConfig({ systemName: e.target.value })}
							className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
									 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
						/>
					</div>

					{/* System Type */}
					<div>
						<label className="block text-sm text-slate-300 mb-2">System Type</label>
						<select
							value={config.starType}
							onChange={(e) => updateConfig({ starType: e.target.value })}
							className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
									 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
						>
							{availableSystemTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					{/* Star Properties */}
					<div className="space-y-3">
						<h4 className="text-sm font-semibold text-orange-400 flex items-center space-x-2">
							<Sun className="w-4 h-4" />
							<span>Star Properties</span>
						</h4>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Star Mass: {config.starMass.toFixed(2)} M☉</label>
							<input type="range" min="0.1" max="3.0" step="0.1" value={config.starMass} onChange={(e) => updateConfig({ starMass: parseFloat(e.target.value) })} className="w-full accent-orange-500" />
							<div className="flex justify-between text-xs text-slate-500 mt-1">
								<span>Red Dwarf</span>
								<span>Blue Giant</span>
							</div>
						</div>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Star Radius: {config.starRadius.toFixed(2)} R☉</label>
							<input type="range" min="0.1" max="3.0" step="0.1" value={config.starRadius} onChange={(e) => updateConfig({ starRadius: parseFloat(e.target.value) })} className="w-full accent-orange-500" />
						</div>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Temperature: {config.starTemperature.toFixed(0)} K</label>
							<input type="range" min="2500" max="10000" step="100" value={config.starTemperature} onChange={(e) => updateConfig({ starTemperature: parseInt(e.target.value) })} className="w-full accent-orange-500" />
						</div>
					</div>

					{/* System Composition */}
					<div className="space-y-3">
						<h4 className="text-sm font-semibold text-orange-400 flex items-center space-x-2">
							<Globe className="w-4 h-4" />
							<span>System Composition</span>
						</h4>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Planet Count: {config.planetCount}</label>
							<input type="range" min="1" max="15" step="1" value={config.planetCount} onChange={(e) => updateConfig({ planetCount: parseInt(e.target.value) })} className="w-full accent-orange-500" />
						</div>

						<div className="space-y-2">
							<label className="flex items-center space-x-2 text-sm text-slate-300">
								<input type="checkbox" checked={config.hasTerrestrialPlanets} onChange={(e) => updateConfig({ hasTerrestrialPlanets: e.target.checked })} className="rounded" />
								<span>Terrestrial Planets</span>
							</label>

							<label className="flex items-center space-x-2 text-sm text-slate-300">
								<input type="checkbox" checked={config.hasGasGiants} onChange={(e) => updateConfig({ hasGasGiants: e.target.checked })} className="rounded" />
								<span>Gas Giants</span>
							</label>

							<label className="flex items-center space-x-2 text-sm text-slate-300">
								<input type="checkbox" checked={config.asteroidBelt} onChange={(e) => updateConfig({ asteroidBelt: e.target.checked })} className="rounded" />
								<span>Asteroid Belt</span>
							</label>

							<label className="flex items-center space-x-2 text-sm text-slate-300">
								<input type="checkbox" checked={config.hasRoguePlanets} onChange={(e) => updateConfig({ hasRoguePlanets: e.target.checked })} className="rounded" />
								<span>Rogue Planets</span>
							</label>
						</div>
					</div>

					{/* System Age & Metallicity */}
					<div className="space-y-3">
						<h4 className="text-sm font-semibold text-orange-400">System Properties</h4>

						<div>
							<label className="block text-xs text-slate-400 mb-1">System Age: {config.systemAge.toFixed(1)} Gyr</label>
							<input type="range" min="0.1" max="13.8" step="0.1" value={config.systemAge} onChange={(e) => updateConfig({ systemAge: parseFloat(e.target.value) })} className="w-full accent-orange-500" />
						</div>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Metallicity: {(config.metalicity * 100).toFixed(2)}%</label>
							<input type="range" min="0" max="0.05" step="0.001" value={config.metalicity} onChange={(e) => updateConfig({ metalicity: parseFloat(e.target.value) })} className="w-full accent-orange-500" />
						</div>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Comet Count: {config.cometCount}</label>
							<input type="range" min="0" max="200" step="10" value={config.cometCount} onChange={(e) => updateConfig({ cometCount: parseInt(e.target.value) })} className="w-full accent-orange-500" />
						</div>
					</div>

					{/* Habitable Zone */}
					<div className="space-y-3">
						<h4 className="text-sm font-semibold text-orange-400">Habitable Zone</h4>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Inner Edge: {config.habitableZone.inner.toFixed(2)} AU</label>
							<input
								type="range"
								min="0.1"
								max="2.0"
								step="0.01"
								value={config.habitableZone.inner}
								onChange={(e) =>
									updateConfig({
										habitableZone: {
											...config.habitableZone,
											inner: parseFloat(e.target.value),
										},
									})
								}
								className="w-full accent-green-500"
							/>
						</div>

						<div>
							<label className="block text-xs text-slate-400 mb-1">Outer Edge: {config.habitableZone.outer.toFixed(2)} AU</label>
							<input
								type="range"
								min="1.0"
								max="5.0"
								step="0.01"
								value={config.habitableZone.outer}
								onChange={(e) =>
									updateConfig({
										habitableZone: {
											...config.habitableZone,
											outer: parseFloat(e.target.value),
										},
									})
								}
								className="w-full accent-green-500"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Scrollbar */}
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(30, 41, 59, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(148, 163, 184, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(148, 163, 184, 0.5);
				}
			`}</style>
		</div>
	);
} 