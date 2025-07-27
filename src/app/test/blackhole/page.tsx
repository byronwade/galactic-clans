"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Play, RotateCcw, Shuffle, ChevronDown, ChevronUp, Settings2, Zap, Sparkles, Eye, EyeOff, Download, Share2, RefreshCw, Activity, Gauge } from "lucide-react";

// Dynamic import to prevent SSR issues
const BlackHoleRenderer = dynamic(() => import("@/components/BlackHoleRenderer"), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black flex items-center justify-center z-50">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Initializing Black Hole Generator</h2>
					<p className="text-sm text-slate-300">Loading spacetime curvature and relativistic physics...</p>
				</div>
			</div>
		</div>
	),
});

export default function BlackHoleTestPage() {
	const [status, setStatus] = useState("Black hole generator ready! Explore spacetime curvature and relativistic effects.");
	const [isControlsExpanded, setIsControlsExpanded] = useState(true);
	const [isStatsVisible, setIsStatsVisible] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);

	const [config, setConfig] = useState<{
		type: "stellar" | "intermediate" | "supermassive";
		mass: number;
		spin: number;
		inclination: number;
		diskInnerRadius: number;
		diskOuterRadius: number;
		temperature: number;
		accretionRate: number;
		magneticField: number;
		coronaTemperature: number;
		jetPower: number;
		viewingDistance: number;
		lensingStrength: number;
		volumetricDensity: number;
		plasmaDensity: number;
		synchrotronEmission: number;
		relativisticBeaming: number;
	}>({
		type: "stellar",
		mass: 10,
		spin: 0.5,
		inclination: 35,
		diskInnerRadius: 6,
		diskOuterRadius: 100,
		temperature: 100000,
		accretionRate: 0.1,
		magneticField: 1000,
		coronaTemperature: 2000000,
		jetPower: 0.1,
		viewingDistance: 1000,
		lensingStrength: 1.0,
		volumetricDensity: 0.8,
		plasmaDensity: 0.6,
		synchrotronEmission: 0.9,
		relativisticBeaming: 0.7,
	});

	const handleGenerate = () => {
		setIsGenerating(true);
		setTimeout(() => {
			setStatus("Black hole generated! Explore spacetime curvature and gravitational lensing.");
			setIsGenerating(false);
		}, 1000);
	};

	const handleClear = () => {
		setStatus("Black hole cleared - ready to generate");
	};

	const handleRandomize = () => {
		const types = ["stellar", "intermediate", "supermassive"] as const;
		const randomType = types[Math.floor(Math.random() * types.length)];

		let mass = 10;
		let temperature = 100000;
		let accretionRate = 0.1;

		switch (randomType) {
			case "stellar":
				mass = 3 + Math.random() * 47; // 3-50 M☉
				temperature = 50000 + Math.random() * 150000;
				accretionRate = 0.01 + Math.random() * 0.3;
				break;
			case "intermediate":
				mass = 100 + Math.random() * 9900; // 100-10,000 M☉
				temperature = 30000 + Math.random() * 100000;
				accretionRate = 0.001 + Math.random() * 0.1;
				break;
			case "supermassive":
				mass = 1000000 + Math.random() * 99000000; // 1M-100M M☉
				temperature = 10000 + Math.random() * 50000;
				accretionRate = 0.0001 + Math.random() * 0.01;
				break;
		}

		setConfig((prev) => ({
			...prev,
			type: randomType,
			mass: parseFloat(mass.toFixed(2)),
			temperature: Math.round(temperature),
			accretionRate: parseFloat(accretionRate.toFixed(4)),
			spin: parseFloat((Math.random() * 0.998).toFixed(3)), // Up to 0.998 (near extremal)
			inclination: Math.round(Math.random() * 90),
			jetPower: parseFloat((Math.random() * 0.5).toFixed(2)),
		}));

		setStatus("Random black hole configuration generated!");
	};

	return (
		<div className="fixed inset-0 bg-black overflow-hidden">
			{/* Black Hole Renderer */}
			<BlackHoleRenderer config={config} onGenerate={handleGenerate} onClear={handleClear} />

			{/* Modern Header */}
			<header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/10 backdrop-blur-sm border-b border-slate-700/20">
				<div className="container mx-auto px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Link className="flex items-center space-x-2 px-2 py-1 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-200 hover:text-white transition-all duration-200 text-sm" href="/test">
								<ArrowLeft className="w-3 h-3" />
								<span className="text-xs font-medium">Back</span>
							</Link>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-black flex items-center justify-center">
									<Zap className="w-3 h-3 text-white" />
								</div>
								<div>
									<h1 className="text-sm font-semibold text-white">Black Hole Generator</h1>
									<p className="text-xs text-slate-300">Relativistic physics simulation</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-1">
							<button title="Toggle Stats" className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors" onClick={() => setIsStatsVisible(!isStatsVisible)}>
								{isStatsVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
							</button>
							<button className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
								<Share2 className="w-3 h-3" />
							</button>
							<button className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
								<Download className="w-3 h-3" />
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Control Panel */}
			<div className="absolute right-4 top-20 bottom-4 z-10 w-80 flex flex-col space-y-4">
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl overflow-hidden">
					<button onClick={() => setIsControlsExpanded(!isControlsExpanded)} className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 flex items-center justify-between text-white font-medium transition-colors">
						<div className="flex items-center space-x-2">
							<Settings2 className="w-4 h-4" />
							<span>Black Hole Controls</span>
						</div>
						{isControlsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
					</button>

					{isControlsExpanded && (
						<div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
							{/* Black Hole Type */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Type</label>
								<select value={config.type} onChange={(e) => setConfig((prev) => ({ ...prev, type: e.target.value as "stellar" | "intermediate" | "supermassive" }))} className="w-full p-2 bg-slate-800/80 border border-slate-600/50 rounded-lg text-slate-200">
									<option value="stellar">Stellar Mass (3-50 M☉)</option>
									<option value="intermediate">Intermediate Mass (100-10K M☉)</option>
									<option value="supermassive">Supermassive (1M-100B M☉)</option>
								</select>
							</div>

							{/* Mass */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Mass (M☉)</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="3" max="100000000" step="1" value={config.mass} onChange={(e) => setConfig((prev) => ({ ...prev, mass: parseFloat(e.target.value) || 10 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-24">{config.mass.toLocaleString()}</span>
								</div>
							</div>

							{/* Spin */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Spin (Kerr Parameter)</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0" max="0.998" step="0.001" value={config.spin} onChange={(e) => setConfig((prev) => ({ ...prev, spin: parseFloat(e.target.value) || 0.5 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-16">{config.spin.toFixed(3)}</span>
								</div>
							</div>

							{/* Inclination */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Inclination (°)</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0" max="90" step="1" value={config.inclination} onChange={(e) => setConfig((prev) => ({ ...prev, inclination: parseInt(e.target.value) || 35 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-16">{config.inclination}°</span>
								</div>
							</div>

							{/* Accretion Rate */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Accretion Rate</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0.001" max="1" step="0.001" value={config.accretionRate} onChange={(e) => setConfig((prev) => ({ ...prev, accretionRate: parseFloat(e.target.value) || 0.1 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-16">{config.accretionRate.toFixed(3)}</span>
								</div>
							</div>

							{/* Jet Power */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Jet Power</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0" max="0.5" step="0.01" value={config.jetPower} onChange={(e) => setConfig((prev) => ({ ...prev, jetPower: parseFloat(e.target.value) || 0.1 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-16">{config.jetPower.toFixed(2)}</span>
								</div>
							</div>

							{/* Temperature */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Disk Temperature (K)</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="10000" max="1000000" step="1000" value={config.temperature} onChange={(e) => setConfig((prev) => ({ ...prev, temperature: parseInt(e.target.value) || 100000 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-20">{config.temperature.toLocaleString()}</span>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Stats Panel */}
				{isStatsVisible && (
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
									<div className="text-white font-medium capitalize">{config.type}</div>
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
									<div className="text-white font-medium">{(2.95 * config.mass).toFixed(1)} km</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Floating Action Buttons */}
			<div className="absolute bottom-4 left-4 z-10 flex space-x-3">
				<button onClick={handleGenerate} disabled={isGenerating} className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-black hover:from-purple-600 hover:to-gray-900 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
					<Play className="w-4 h-4" />
					<span>Generate Black Hole</span>
				</button>
				<button onClick={handleRandomize} className="flex items-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200">
					<Shuffle className="w-4 h-4" />
					<span>Randomize</span>
				</button>
			</div>

			{/* Status Message */}
			<div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 bg-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-lg px-4 py-2">
				<div className="flex items-center space-x-2 text-purple-400 text-sm">
					<Sparkles className="w-4 h-4" />
					<span>{status}</span>
				</div>
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
