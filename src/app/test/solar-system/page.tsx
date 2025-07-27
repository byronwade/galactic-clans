"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Sun, Shuffle, RotateCcw, Settings2, ChevronDown, ChevronUp, Sparkles, Eye, EyeOff, Download, Share2, Play, Orbit } from "lucide-react";

// Dynamic import to prevent SSR issues
const SolarSystemRenderer = dynamic(() => import("@/components/SolarSystemRenderer"), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-orange-950 to-black flex items-center justify-center z-50">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Initializing Solar System Generator</h2>
					<p className="text-sm text-slate-300">Loading orbital mechanics and celestial bodies...</p>
				</div>
			</div>
		</div>
	),
});

interface SolarSystemConfig {
	starType: string;
	starMass: number;
	starRadius: number;
	starTemperature: number;
	planetCount: number;
	asteroidBelt: boolean;
	cometCount: number;
	systemAge: number;
	metalicity: number;
	habitableZone: { inner: number; outer: number };
	systemName: string;
	hasGasGiants: boolean;
	hasTerrestrialPlanets: boolean;
	hasRoguePlanets: boolean;
}

const SYSTEM_TYPES = [
	{ value: "solar_analog", label: "Solar Analog", description: "Similar to our Solar System" },
	{ value: "red_dwarf_system", label: "Red Dwarf System", description: "System around a red dwarf star" },
	{ value: "binary_system", label: "Binary Star System", description: "Two stars orbiting each other" },
	{ value: "giant_star_system", label: "Giant Star System", description: "System around a giant star" },
	{ value: "young_system", label: "Young System", description: "Recently formed planetary system" },
	{ value: "ancient_system", label: "Ancient System", description: "Very old, evolved system" },
	{ value: "compact_system", label: "Compact System", description: "Planets very close to the star" },
	{ value: "extended_system", label: "Extended System", description: "Planets spread over large distances" },
	{ value: "hot_jupiter_system", label: "Hot Jupiter System", description: "Gas giant very close to star" },
	{ value: "super_earth_system", label: "Super-Earth System", description: "Multiple large rocky planets" },
	{ value: "mini_neptune_system", label: "Mini-Neptune System", description: "Small ice/gas giant planets" },
	{ value: "circumbinary_system", label: "Circumbinary System", description: "Planets orbiting both stars in binary" },
	{ value: "rogue_planet_system", label: "Rogue Planet System", description: "Free-floating planets" },
	{ value: "pulsar_system", label: "Pulsar System", description: "Planets around a neutron star" },
	{ value: "white_dwarf_system", label: "White Dwarf System", description: "Planets around stellar remnant" },
];

export default function SolarSystemTestPage() {
	const [status, setStatus] = useState("Solar system generator ready! Explore planetary formation and orbital dynamics.");
	const [isControlsExpanded, setIsControlsExpanded] = useState(true);
	const [isStatsVisible, setIsStatsVisible] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);

	const [config, setConfig] = useState<SolarSystemConfig>({
		starType: "G-type",
		starMass: 1.0,
		starRadius: 1.0,
		starTemperature: 5778,
		planetCount: 8,
		asteroidBelt: true,
		cometCount: 50,
		systemAge: 4.6,
		metalicity: 0.0122,
		habitableZone: { inner: 0.95, outer: 1.37 },
		systemName: "Solar System Analog",
		hasGasGiants: true,
		hasTerrestrialPlanets: true,
		hasRoguePlanets: false,
	});

	const generateRandomSystemConfig = useCallback((): SolarSystemConfig => {
		const randomType = SYSTEM_TYPES[Math.floor(Math.random() * SYSTEM_TYPES.length)];

		let starType = "G-type";
		let starMass = 1.0;
		let starRadius = 1.0;
		let starTemperature = 5778;
		let planetCount = 8;
		let asteroidBelt = true;
		let cometCount = 50;
		let systemAge = 4.6;
		let metalicity = 0.0122;
		let habitableZone = { inner: 0.95, outer: 1.37 };
		let hasGasGiants = true;
		let hasTerrestrialPlanets = true;
		let hasRoguePlanets = false;

		// Generate parameters based on system type
		switch (randomType?.value) {
			case "solar_analog":
				starType = "G-type";
				starMass = 0.9 + Math.random() * 0.2; // 0.9-1.1 M☉
				planetCount = 6 + Math.floor(Math.random() * 6); // 6-11 planets
				systemAge = 3 + Math.random() * 6; // 3-9 Gyr
				break;
			case "red_dwarf_system":
				starType = "M-type";
				starMass = 0.1 + Math.random() * 0.4; // 0.1-0.5 M☉
				starTemperature = 2500 + Math.random() * 1500;
				planetCount = 3 + Math.floor(Math.random() * 5); // 3-7 planets
				systemAge = 10 + Math.random() * 40; // 10-50 Gyr
				hasGasGiants = Math.random() > 0.7; // Less likely
				break;
			case "binary_system":
				starMass = 0.8 + Math.random() * 1.5; // 0.8-2.3 M☉
				planetCount = 2 + Math.floor(Math.random() * 8); // 2-9 planets
				systemAge = 1 + Math.random() * 8; // 1-9 Gyr
				break;
			case "giant_star_system":
				starType = "K-type";
				starMass = 1.5 + Math.random() * 2.5; // 1.5-4 M☉
				starRadius = 10 + Math.random() * 40; // 10-50 R☉
				starTemperature = 4000 + Math.random() * 1500;
				planetCount = 1 + Math.floor(Math.random() * 4); // 1-4 planets
				systemAge = 0.5 + Math.random() * 2; // 0.5-2.5 Gyr
				break;
			case "young_system":
				systemAge = 0.01 + Math.random() * 0.5; // 0.01-0.5 Gyr
				planetCount = 2 + Math.floor(Math.random() * 6); // 2-7 planets
				asteroidBelt = Math.random() > 0.3; // More likely
				cometCount = 100 + Math.floor(Math.random() * 400); // 100-500
				break;
			case "ancient_system":
				systemAge = 8 + Math.random() * 5; // 8-13 Gyr
				planetCount = 1 + Math.floor(Math.random() * 5); // 1-5 planets (some lost)
				hasGasGiants = Math.random() > 0.5; // 50/50 chance
				break;
			case "compact_system":
				planetCount = 4 + Math.floor(Math.random() * 4); // 4-7 planets
				hasGasGiants = false; // Unlikely in compact systems
				hasTerrestrialPlanets = true;
				break;
			case "hot_jupiter_system":
				planetCount = 1 + Math.floor(Math.random() * 4); // 1-4 planets
				hasGasGiants = true;
				hasTerrestrialPlanets = Math.random() > 0.5;
				break;
			case "rogue_planet_system":
				planetCount = 1 + Math.floor(Math.random() * 3); // 1-3 rogue planets
				hasRoguePlanets = true;
				hasGasGiants = Math.random() > 0.5;
				hasTerrestrialPlanets = Math.random() > 0.3;
				asteroidBelt = false;
				break;
			case "pulsar_system":
				starType = "Neutron Star";
				starMass = 1.4 + Math.random() * 0.6; // 1.4-2.0 M☉
				starRadius = 0.00001; // Very small
				starTemperature = 600000 + Math.random() * 400000;
				planetCount = 1 + Math.floor(Math.random() * 3); // 1-3 planets
				systemAge = 1 + Math.random() * 10; // 1-11 Gyr
				hasGasGiants = false; // Destroyed in supernova
				break;
		}

		// Calculate habitable zone based on star properties
		const luminosity = Math.pow(starRadius, 2) * Math.pow(starTemperature / 5778, 4);
		const innerHZ = Math.sqrt(luminosity / 1.1);
		const outerHZ = Math.sqrt(luminosity / 0.53);
		habitableZone = { inner: innerHZ, outer: outerHZ };

		// Random metalicity
		metalicity = 0.001 + Math.random() * 0.03; // 0.001-0.031

		return {
			starType,
			starMass: parseFloat(starMass.toFixed(2)),
			starRadius: parseFloat(starRadius.toFixed(2)),
			starTemperature: Math.round(starTemperature),
			planetCount,
			asteroidBelt,
			cometCount,
			systemAge: parseFloat(systemAge.toFixed(2)),
			metalicity: parseFloat(metalicity.toFixed(4)),
			habitableZone: {
				inner: parseFloat(innerHZ.toFixed(2)),
				outer: parseFloat(outerHZ.toFixed(2)),
			},
			systemName: randomType?.label || "Solar System Analog",
			hasGasGiants,
			hasTerrestrialPlanets,
			hasRoguePlanets,
		};
	}, []);

	const handleGenerate = () => {
		setIsGenerating(true);
		setTimeout(() => {
			setStatus("Solar system generated! Explore orbital mechanics and planetary formation.");
			setIsGenerating(false);
		}, 1000);
	};

	const handleClear = () => {
		setStatus("Solar system cleared - ready to generate");
	};

	const handleRandomize = () => {
		const randomConfig = generateRandomSystemConfig();
		setConfig(randomConfig);
		setStatus("Random solar system configuration generated!");
	};

	return (
		<div className="fixed inset-0 bg-black overflow-hidden">
			{/* Solar System Renderer */}
			<SolarSystemRenderer config={config} />

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
								<div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
									<Sun className="w-3 h-3 text-white" />
								</div>
								<div>
									<h1 className="text-sm font-semibold text-white">Solar System Generator</h1>
									<p className="text-xs text-slate-300">Orbital mechanics simulation</p>
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
							<span>System Controls</span>
						</div>
						{isControlsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
					</button>

					{isControlsExpanded && (
						<div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
							{/* System Type */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">System Type</label>
								<select
									value={config.systemName}
									onChange={(e) => {
										const selectedType = SYSTEM_TYPES.find((t) => t.label === e.target.value);
										if (selectedType) {
											const newConfig = generateRandomSystemConfig();
											setConfig({ ...newConfig, systemName: selectedType.label });
										}
									}}
									className="w-full p-2 bg-slate-800/80 border border-slate-600/50 rounded-lg text-slate-200"
								>
									{SYSTEM_TYPES.map((type) => (
										<option key={type.value} value={type.label}>
											{type.label}
										</option>
									))}
								</select>
								<p className="text-xs text-slate-400">{SYSTEM_TYPES.find((t) => t.label === config.systemName)?.description}</p>
							</div>

							{/* Star Mass */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Star Mass (M☉)</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0.08" max="10" step="0.01" value={config.starMass} onChange={(e) => setConfig((prev) => ({ ...prev, starMass: parseFloat(e.target.value) || 1.0 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-20">{config.starMass.toFixed(2)}</span>
								</div>
							</div>

							{/* Planet Count */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Planet Count</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="1" max="20" step="1" value={config.planetCount} onChange={(e) => setConfig((prev) => ({ ...prev, planetCount: parseInt(e.target.value) || 8 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-16">{config.planetCount}</span>
								</div>
							</div>

							{/* System Age */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">System Age (Gyr)</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0.01" max="15" step="0.1" value={config.systemAge} onChange={(e) => setConfig((prev) => ({ ...prev, systemAge: parseFloat(e.target.value) || 4.6 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-16">{config.systemAge.toFixed(2)}</span>
								</div>
							</div>

							{/* Comet Count */}
							<div className="space-y-2">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Comet Count</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0" max="1000" step="10" value={config.cometCount} onChange={(e) => setConfig((prev) => ({ ...prev, cometCount: parseInt(e.target.value) || 50 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
									<span className="text-sm font-medium text-slate-300 w-16">{config.cometCount}</span>
								</div>
							</div>

							{/* System Features */}
							<div className="space-y-3">
								<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">System Features</label>

								<div className="flex items-center space-x-2">
									<input type="checkbox" checked={config.asteroidBelt} onChange={(e) => setConfig((prev) => ({ ...prev, asteroidBelt: e.target.checked }))} className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500" />
									<span className="text-sm text-slate-300">Asteroid belt</span>
								</div>

								<div className="flex items-center space-x-2">
									<input type="checkbox" checked={config.hasGasGiants} onChange={(e) => setConfig((prev) => ({ ...prev, hasGasGiants: e.target.checked }))} className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500" />
									<span className="text-sm text-slate-300">Gas giants</span>
								</div>

								<div className="flex items-center space-x-2">
									<input type="checkbox" checked={config.hasTerrestrialPlanets} onChange={(e) => setConfig((prev) => ({ ...prev, hasTerrestrialPlanets: e.target.checked }))} className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500" />
									<span className="text-sm text-slate-300">Terrestrial planets</span>
								</div>

								<div className="flex items-center space-x-2">
									<input type="checkbox" checked={config.hasRoguePlanets} onChange={(e) => setConfig((prev) => ({ ...prev, hasRoguePlanets: e.target.checked }))} className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500" />
									<span className="text-sm text-slate-300">Rogue planets</span>
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
								<Orbit className="w-4 h-4 text-orange-400" />
								<span className="text-sm font-medium text-white">System Properties</span>
							</div>
						</div>
						<div className="p-4 space-y-3">
							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Type</div>
									<div className="text-white font-medium">{config.systemName}</div>
								</div>
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Star Mass</div>
									<div className="text-white font-medium">{config.starMass.toFixed(2)} M☉</div>
								</div>
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Planets</div>
									<div className="text-white font-medium">{config.planetCount}</div>
								</div>
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Age</div>
									<div className="text-white font-medium">{config.systemAge.toFixed(2)} Gyr</div>
								</div>
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Habitable Zone</div>
									<div className="text-white font-medium">
										{config.habitableZone.inner.toFixed(2)}-{config.habitableZone.outer.toFixed(2)} AU
									</div>
								</div>
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Comets</div>
									<div className="text-white font-medium">{config.cometCount}</div>
								</div>
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Asteroid Belt</div>
									<div className="text-white font-medium">{config.asteroidBelt ? "Yes" : "No"}</div>
								</div>
								<div className="bg-slate-800/50 rounded-lg p-3">
									<div className="text-slate-400">Gas Giants</div>
									<div className="text-white font-medium">{config.hasGasGiants ? "Yes" : "No"}</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Floating Action Buttons */}
			<div className="absolute bottom-4 left-4 z-10 flex space-x-3">
				<button onClick={handleGenerate} disabled={isGenerating} className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
					<Play className="w-4 h-4" />
					<span>Generate System</span>
				</button>
				<button onClick={handleRandomize} className="flex items-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200">
					<Shuffle className="w-4 h-4" />
					<span>Randomize</span>
				</button>
				<button onClick={handleClear} className="flex items-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200">
					<RotateCcw className="w-4 h-4" />
					<span>Clear</span>
				</button>
			</div>

			{/* Status Message */}
			<div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 bg-orange-500/10 backdrop-blur-sm border border-orange-400/30 rounded-lg px-4 py-2">
				<div className="flex items-center space-x-2 text-orange-400 text-sm">
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
