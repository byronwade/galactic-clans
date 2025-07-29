/**
 * @file blackhole-stats.tsx
 * @description Stats panel for the Black Hole Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Gauge, Zap, Target, Eye } from "lucide-react";
import type { BlackHoleConfig } from "./blackhole-generator";

interface BlackHoleStatsProps {
	config: BlackHoleConfig;
}

export function BlackHoleStats({ config }: BlackHoleStatsProps) {
	const getClassification = (type: string) => {
		switch (type) {
			case "stellar":
				return "Stellar Mass";
			case "intermediate":
				return "Intermediate Mass";
			case "supermassive":
				return "Supermassive";
			default:
				return "Unknown";
		}
	};

	const getEventHorizonRadius = (mass: number) => {
		return (2.95 * mass).toFixed(1);
	};

	const getSchwarzschildRadius = (mass: number) => {
		return (mass * 2.95).toFixed(1);
	};

	const getEstimatedLuminosity = (mass: number, accretionRate: number) => {
		return Math.round(accretionRate * mass * 0.1).toLocaleString();
	};

	return (
		<div className="absolute right-4 top-20 bottom-4 z-10 w-80 flex flex-col space-y-4">
			{/* Stats Panel */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl overflow-hidden">
				<div className="px-4 py-3 bg-slate-800/50 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Gauge className="w-4 h-4 text-purple-400" />
						<span className="text-sm font-medium text-white">Black Hole Properties</span>
					</div>
				</div>
				<div className="p-4 space-y-3">
					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Type</div>
							<div className="text-white font-medium capitalize">{getClassification(config.type)}</div>
						</div>
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Mass</div>
							<div className="text-white font-medium">{config.mass.toLocaleString()} M☉</div>
						</div>
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Spin</div>
							<div className="text-white font-medium">{config.spin.toFixed(3)}</div>
						</div>
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Inclination</div>
							<div className="text-white font-medium">{config.inclination}°</div>
						</div>
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Accretion Rate</div>
							<div className="text-white font-medium">{config.accretionRate.toFixed(3)}</div>
						</div>
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Jet Power</div>
							<div className="text-white font-medium">{config.jetPower.toFixed(2)}</div>
						</div>
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Temperature</div>
							<div className="text-white font-medium">{config.temperature.toLocaleString()} K</div>
						</div>
						<div className="bg-slate-800/50 rounded-lg p-3">
							<div className="text-slate-400">Event Horizon</div>
							<div className="text-white font-medium">{getEventHorizonRadius(config.mass)} km</div>
						</div>
					</div>

					{/* Detailed Properties */}
					<div className="space-y-3 mt-4">
						<h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
							<Zap className="w-3 h-3" />
							Relativistic Properties
						</h4>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="bg-purple-500/10 rounded p-2">
								<div className="text-purple-300">Schwarzschild Radius</div>
								<div className="text-white font-medium">{getSchwarzschildRadius(config.mass)} km</div>
							</div>
							<div className="bg-purple-500/10 rounded p-2">
								<div className="text-purple-300">Ergosphere</div>
								<div className="text-white font-medium">{config.spin > 0 ? "Present" : "None"}</div>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
							<Target className="w-3 h-3" />
							Accretion Properties
						</h4>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="bg-blue-500/10 rounded p-2">
								<div className="text-blue-300">Luminosity</div>
								<div className="text-white font-medium">~{getEstimatedLuminosity(config.mass, config.accretionRate)} L☉</div>
							</div>
							<div className="bg-blue-500/10 rounded p-2">
								<div className="text-blue-300">Corona Temp</div>
								<div className="text-white font-medium">{(config.coronaTemperature / 1000000).toFixed(1)}M K</div>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
							<Eye className="w-3 h-3" />
							Observational
						</h4>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="bg-cyan-500/10 rounded p-2">
								<div className="text-cyan-300">Magnetic Field</div>
								<div className="text-white font-medium">{config.magneticField.toLocaleString()} G</div>
							</div>
							<div className="bg-cyan-500/10 rounded p-2">
								<div className="text-cyan-300">Lensing Strength</div>
								<div className="text-white font-medium">{config.lensingStrength.toFixed(2)}</div>
							</div>
						</div>
					</div>

					{/* Feature Badges */}
					<div className="space-y-2 mt-4">
						<h4 className="text-sm font-semibold text-green-400">Features</h4>
						<div className="flex flex-wrap gap-2">
							<span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">Accretion Disk</span>
							<span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">Relativistic Jets</span>
							<span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">Gravitational Lensing</span>
							{config.spin > 0 && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">Frame Dragging</span>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
