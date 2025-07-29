/**
 * @file galaxy-generator.tsx
 * @description Full-screen galaxy generator with modular components
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";

// Import modular components
import { GalaxyRenderer3D } from "./galaxy-renderer-3d";
import { GalaxyControls } from "./galaxy-controls";
import { GalaxySettings } from "./galaxy-settings";
import { GalaxyInfo } from "./galaxy-info";
import { GalaxyStats } from "./galaxy-stats";

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

// Galaxy types data
export const GALAXY_TYPES = [
	// Spiral Galaxies
	{ value: "Sa", label: "Sa - Spiral Early Type", description: "Tight spiral arms, large central bulge, smooth appearance" },
	{ value: "Sb", label: "Sb - Spiral Intermediate", description: "Moderate spiral arms, balanced bulge-to-disk ratio" },
	{ value: "Sc", label: "Sc - Spiral Late Type", description: "Open spiral arms, small bulge, prominent star formation" },
	{ value: "Sd", label: "Sd - Spiral Very Late", description: "Very open arms, minimal bulge, active star formation" },
	// Barred Spiral Galaxies
	{ value: "SBa", label: "SBa - Barred Spiral Early", description: "Central bar structure with tight spiral arms" },
	{ value: "SBb", label: "SBb - Barred Spiral Intermediate", description: "Prominent bar with moderate spiral pattern" },
	{ value: "SBc", label: "SBc - Barred Spiral Late", description: "Strong bar with open spiral arms, active star formation" },
	// Elliptical Galaxies
	{ value: "E0", label: "E0 - Elliptical Round", description: "Spherical shape, old stellar population, minimal star formation" },
	{ value: "E3", label: "E3 - Elliptical Moderate", description: "Moderately flattened elliptical galaxy" },
	{ value: "E7", label: "E7 - Elliptical Flattened", description: "Highly flattened elliptical, fast rotation" },
	// Irregular Galaxies
	{ value: "Irr", label: "Irr - Irregular", description: "Chaotic structure, ongoing star formation, no spiral pattern" },
	{ value: "dE", label: "dE - Dwarf Elliptical", description: "Small, faint elliptical galaxy with old stars" },
	// Peculiar Galaxies
	{ value: "Pec", label: "Pec - Peculiar", description: "Distorted by gravitational interactions" },
	{ value: "Ring", label: "Ring Galaxy", description: "Distinctive ring structure, often from galactic collision" },
	{ value: "Starburst", label: "Starburst Galaxy", description: "Extremely high rate of star formation" },
];

export default function GalaxyGenerator() {
	const [config, setConfig] = useState<GalaxyConfig>({
		type: "Sc",
		starCount: 50000,
		radius: 15,
		arms: 4,
		armSeparation: 0.5,
		spin: 1.0,
		randomness: 0.3,
		power: 2.5,
		insideColor: "#ff6030",
		outsideColor: "#1b3984",
		clusterness: 2.0,
		spiralTightness: 0.8,
		bulgeFactor: 0.3,
		diskThickness: 0.2,
	});

	const [showSettings, setShowSettings] = useState(true);
	const [showInfo, setShowInfo] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [status, setStatus] = useState("Galaxy generator ready! Explore cosmic structure formation and stellar evolution.");

	// Generate random galaxy
	const generateRandomGalaxy = useCallback(() => {
		const randomType = GALAXY_TYPES[Math.floor(Math.random() * GALAXY_TYPES.length)];
		if (!randomType) return;

		// Generate parameters based on galaxy type
		let starCount = 50000;
		let arms = 4;
		let spin = 1.0;
		let randomness = 0.3;
		let power = 2.5;
		let bulgeFactor = 0.3;

		// Adjust parameters by galaxy type
		if (randomType.value.startsWith("E")) {
			// Elliptical galaxies
			starCount = Math.floor(Math.random() * 100000) + 50000;
			arms = 0;
			randomness = 0.8;
			bulgeFactor = 0.9;
		} else if (randomType.value.includes("Irr")) {
			// Irregular galaxies
			starCount = Math.floor(Math.random() * 30000) + 20000;
			arms = Math.floor(Math.random() * 3) + 1;
			randomness = 0.8;
			spin = Math.random() * 0.5;
		} else {
			// Spiral galaxies
			starCount = Math.floor(Math.random() * 80000) + 40000;
			arms = Math.floor(Math.random() * 4) + 2;
			if (randomType.value === "Sa" || randomType.value === "SBa") {
				bulgeFactor = 0.5 + Math.random() * 0.3;
			} else if (randomType.value === "Sc" || randomType.value === "SBc") {
				bulgeFactor = 0.1 + Math.random() * 0.2;
			}
		}

		setConfig({
			type: randomType.value,
			starCount: starCount,
			radius: 10 + Math.random() * 15,
			arms: arms,
			armSeparation: 0.3 + Math.random() * 0.4,
			spin: spin,
			randomness: randomness,
			power: 1.5 + Math.random() * 2,
			insideColor: `hsl(${Math.floor(Math.random() * 60) + 10}, ${50 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`,
			outsideColor: `hsl(${Math.floor(Math.random() * 240) + 200}, ${40 + Math.random() * 40}%, ${20 + Math.random() * 30}%)`,
			clusterness: 1 + Math.random() * 2,
			spiralTightness: 0.3 + Math.random() * 0.8,
			bulgeFactor: bulgeFactor,
			diskThickness: 0.1 + Math.random() * 0.3,
		});

		setStatus(`Generated ${randomType.label}: ${randomType.description}`);
	}, []);

	// Handle generation
	const handleGenerate = () => {
		setIsGenerating(true);
		setStatus("Generating galaxy structure...");
		setTimeout(() => {
			setIsGenerating(false);
			const galaxyType = GALAXY_TYPES.find((t) => t.value === config.type);
			setStatus(`Generated ${galaxyType?.label || config.type} with ${config.starCount.toLocaleString()} stars`);
		}, 1000);
	};

	// Get current galaxy type info
	const currentGalaxyType = GALAXY_TYPES.find((t) => t.value === config.type);

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black overflow-hidden">
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
							<Sparkles className="w-4 h-4 text-white" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-white">Galaxy Generator</h1>
							<p className="text-sm text-slate-300">{currentGalaxyType?.label || "Unknown Galaxy"}</p>
						</div>
					</div>

					<GalaxyControls config={config} availableGalaxyTypes={GALAXY_TYPES} onGalaxyTypeChange={(type: string) => setConfig((prev) => ({ ...prev, type }))} showSettings={showSettings} showInfo={showInfo} onToggleSettings={() => setShowSettings(!showSettings)} onToggleInfo={() => setShowInfo(!showInfo)} onRandomize={generateRandomGalaxy} onGenerate={handleGenerate} isGenerating={isGenerating} />
				</div>
			</div>

			{/* Status Message */}
			{status && (
				<div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 bg-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-lg px-4 py-2">
					<div className="flex items-center space-x-2 text-purple-400 text-sm">
						<Sparkles className="w-4 h-4" />
						<span>{status}</span>
					</div>
				</div>
			)}

			{/* Loading Overlay */}
			{isGenerating && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
						<p className="text-white">Generating Galaxy Structure...</p>
					</div>
				</div>
			)}

			{/* 3D Canvas - Full Screen */}
			<GalaxyRenderer3D config={config} isGenerating={isGenerating} onLoadingChange={setIsGenerating} onGenerate={handleGenerate} />

			{/* Settings Panel */}
			{showSettings && <GalaxySettings config={config} onConfigChange={setConfig} onClose={() => setShowSettings(false)} availableGalaxyTypes={GALAXY_TYPES} />}

			{/* Info Panel */}
			{showInfo && currentGalaxyType && <GalaxyInfo galaxyType={currentGalaxyType} config={config} onClose={() => setShowInfo(false)} />}

			{/* Quick Stats */}
			<GalaxyStats config={config} currentGalaxyType={currentGalaxyType} />
		</div>
	);
}
