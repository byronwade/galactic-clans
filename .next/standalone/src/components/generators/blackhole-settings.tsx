/**
 * @file blackhole-settings.tsx
 * @description Settings panel for the Black Hole Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import type { BlackHoleConfig, BLACKHOLE_TYPES } from "./blackhole-generator";

interface BlackHoleSettingsProps {
	config: BlackHoleConfig;
	onConfigChange: (updates: Partial<BlackHoleConfig>) => void;
}

export function BlackHoleSettings({ config, onConfigChange }: BlackHoleSettingsProps) {
	const [isExpanded, setIsExpanded] = React.useState(true);

	return (
		<div className="absolute right-4 top-20 bottom-4 z-10 w-80 flex flex-col space-y-4">
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl overflow-hidden">
				<button onClick={() => setIsExpanded(!isExpanded)} className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 flex items-center justify-between text-white font-medium transition-colors">
					<div className="flex items-center space-x-2">
						<Settings2 className="w-4 h-4" />
						<span>Black Hole Controls</span>
					</div>
					{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
				</button>

				{isExpanded && (
					<div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
						{/* Black Hole Type */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Type</label>
							<select value={config.type} onChange={(e) => onConfigChange({ type: e.target.value as BlackHoleConfig["type"] })} className="w-full p-2 bg-slate-800/80 border border-slate-600/50 rounded-lg text-slate-200">
								<option value="stellar">Stellar Mass (3-50 M☉)</option>
								<option value="intermediate">Intermediate Mass (100-10K M☉)</option>
								<option value="supermassive">Supermassive (1M-100B M☉)</option>
							</select>
						</div>

						{/* Mass */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Mass (M☉)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="3" max="100000000" step="1" value={config.mass} onChange={(e) => onConfigChange({ mass: parseFloat(e.target.value) || 10 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-24">{config.mass.toLocaleString()}</span>
							</div>
						</div>

						{/* Spin */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Spin (Kerr Parameter)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="0" max="0.998" step="0.001" value={config.spin} onChange={(e) => onConfigChange({ spin: parseFloat(e.target.value) || 0.5 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-16">{config.spin.toFixed(3)}</span>
							</div>
						</div>

						{/* Inclination */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Inclination (°)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="0" max="90" step="1" value={config.inclination} onChange={(e) => onConfigChange({ inclination: parseInt(e.target.value) || 35 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-16">{config.inclination}°</span>
							</div>
						</div>

						{/* Accretion Rate */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Accretion Rate</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="0.001" max="1" step="0.001" value={config.accretionRate} onChange={(e) => onConfigChange({ accretionRate: parseFloat(e.target.value) || 0.1 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-16">{config.accretionRate.toFixed(3)}</span>
							</div>
						</div>

						{/* Jet Power */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Jet Power</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="0" max="0.5" step="0.01" value={config.jetPower} onChange={(e) => onConfigChange({ jetPower: parseFloat(e.target.value) || 0.1 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-16">{config.jetPower.toFixed(2)}</span>
							</div>
						</div>

						{/* Temperature */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Disk Temperature (K)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="10000" max="1000000" step="1000" value={config.temperature} onChange={(e) => onConfigChange({ temperature: parseInt(e.target.value) || 100000 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-20">{config.temperature.toLocaleString()}</span>
							</div>
						</div>

						{/* Magnetic Field */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Magnetic Field (G)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="100" max="10000" step="100" value={config.magneticField} onChange={(e) => onConfigChange({ magneticField: parseInt(e.target.value) || 1000 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-20">{config.magneticField.toLocaleString()}</span>
							</div>
						</div>

						{/* Corona Temperature */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Corona Temperature (K)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="1000000" max="10000000" step="100000" value={config.coronaTemperature} onChange={(e) => onConfigChange({ coronaTemperature: parseInt(e.target.value) || 2000000 })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-20">{(config.coronaTemperature / 1000000).toFixed(1)}M</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Custom Scrollbar Styles */}
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
