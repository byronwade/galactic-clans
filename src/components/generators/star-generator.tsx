/**
 * @file star-generator.tsx
 * @description Full-screen star generator with modular components
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useState, useCallback } from "react";
import { Star } from "lucide-react";

// Import modular components
import { StarRenderer3D } from "./star-renderer-3d";
import { StarControls } from "./star-controls";
import { StarSettings } from "./star-settings";
import { StarInfo } from "./star-info";
import { StarStats } from "./star-stats";

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

// Star types data
export const STAR_TYPES = [
	// Main Sequence Stars
	{ value: "O-type", label: "O-type Main Sequence", description: "Massive, hot blue stars with short lifespans" },
	{ value: "B-type", label: "B-type Main Sequence", description: "Hot blue-white stars, very luminous" },
	{ value: "A-type", label: "A-type Main Sequence", description: "White stars with strong hydrogen lines" },
	{ value: "F-type", label: "F-type Main Sequence", description: "Yellow-white stars, slightly hotter than the Sun" },
	{ value: "G-type", label: "G-type Main Sequence", description: "Yellow stars like our Sun" },
	{ value: "K-type", label: "K-type Main Sequence", description: "Orange stars, cooler and smaller than the Sun" },
	{ value: "M-type", label: "M-type Main Sequence", description: "Red dwarf stars, most common in the galaxy" },
	// Giant Stars
	{ value: "RedGiant", label: "Red Giant", description: "Evolved star with expanded outer layers" },
	{ value: "BlueGiant", label: "Blue Giant", description: "Massive, luminous blue star" },
	{ value: "YellowGiant", label: "Yellow Giant", description: "Intermediate mass giant star" },
	{ value: "Supergiant", label: "Red Supergiant", description: "Extremely large and luminous evolved star" },
	{ value: "BlueSupergiant", label: "Blue Supergiant", description: "Massive, hot supergiant near end of life" },
	// Exotic Stars
	{ value: "WhiteDwarf", label: "White Dwarf", description: "Dense stellar remnant, end stage of solar-mass stars" },
	{ value: "NeutronStar", label: "Neutron Star", description: "Ultra-dense stellar remnant from supernova" },
	{ value: "Pulsar", label: "Pulsar", description: "Rapidly rotating neutron star with radio beams" },
	{ value: "Magnetar", label: "Magnetar", description: "Neutron star with extremely strong magnetic field" },
	{ value: "WolfRayet", label: "Wolf-Rayet Star", description: "Hot, massive star shedding outer layers rapidly" },
	{ value: "CarbonStar", label: "Carbon Star", description: "Cool giant star with carbon-rich atmosphere" },
	{ value: "BrownDwarf", label: "Brown Dwarf", description: "Failed star, not massive enough for fusion" },
	// Variable Stars
	{ value: "Cepheid", label: "Cepheid Variable", description: "Pulsating star used as standard candle" },
	{ value: "RRLyrae", label: "RR Lyrae Variable", description: "Old, pulsating variable star" },
	{ value: "Mira", label: "Mira Variable", description: "Long-period pulsating giant star" },
	{ value: "TauriVariable", label: "T Tauri Variable", description: "Young, pre-main sequence star" },
	// Binary Systems
	{ value: "EclipsingBinary", label: "Eclipsing Binary", description: "Binary star system with orbital eclipses" },
	{ value: "ContactBinary", label: "Contact Binary", description: "Binary stars sharing outer envelope" },
	{ value: "CataclysmicVariable", label: "Cataclysmic Variable", description: "White dwarf accreting from companion" },
	{ value: "Symbiotic", label: "Symbiotic Star", description: "White dwarf and red giant binary system" },
];

export default function StarGenerator() {
	const [config, setConfig] = useState<StarConfig>({
		type: "G-type",
		mass: 1.0,
		temperature: 5778,
		luminosity: 1.0,
		radius: 1.0,
		age: 4.6,
		evolutionStage: "Main Sequence",
		hasCompanion: false,
		companionType: "None",
		companionDistance: 0,
		metalicity: 0.0122,
		rotationPeriod: 25.4,
		magneticField: 1.0,
	});

	const [showSettings, setShowSettings] = useState(true);
	const [showInfo, setShowInfo] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [status, setStatus] = useState("Star generator ready! Explore stellar evolution and physics.");

	// Generate random star
	const generateRandomStar = useCallback(() => {
		const randomType = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];
		if (!randomType) return;

		let mass = 1.0;
		let temperature = 5778;
		let luminosity = 1.0;
		let radius = 1.0;
		let age = 4.6;
		let evolutionStage = "Main Sequence";
		let metalicity = 0.0122;
		let rotationPeriod = 25.4;
		let magneticField = 1.0;

		// Adjust parameters by star type
		switch (randomType.value) {
			case "O-type":
				mass = 15 + Math.random() * 30;
				temperature = 30000 + Math.random() * 20000;
				luminosity = 90000 + Math.random() * 500000;
				radius = 6.6 + Math.random() * 10;
				age = 0.1 + Math.random() * 2;
				break;
			case "B-type":
				mass = 2.1 + Math.random() * 13;
				temperature = 10000 + Math.random() * 20000;
				luminosity = 25 + Math.random() * 30000;
				radius = 1.8 + Math.random() * 5;
				age = 1 + Math.random() * 100;
				break;
			case "G-type":
				mass = 0.8 + Math.random() * 0.4;
				temperature = 5200 + Math.random() * 1000;
				luminosity = 0.6 + Math.random() * 1.0;
				radius = 0.7 + Math.random() * 0.6;
				age = 1 + Math.random() * 10;
				break;
			case "M-type":
				mass = 0.08 + Math.random() * 0.42;
				temperature = 2400 + Math.random() * 1300;
				luminosity = 0.0001 + Math.random() * 0.05;
				radius = 0.2 + Math.random() * 0.5;
				age = 1 + Math.random() * 100;
				break;
			case "RedGiant":
				mass = 0.5 + Math.random() * 3;
				temperature = 3000 + Math.random() * 2000;
				luminosity = 10 + Math.random() * 1000;
				radius = 10 + Math.random() * 100;
				age = 8 + Math.random() * 4;
				evolutionStage = "Red Giant Branch";
				break;
			case "WhiteDwarf":
				mass = 0.5 + Math.random() * 0.9;
				temperature = 5000 + Math.random() * 50000;
				luminosity = 0.0001 + Math.random() * 0.1;
				radius = 0.008 + Math.random() * 0.02;
				age = 1 + Math.random() * 10;
				evolutionStage = "White Dwarf";
				break;
		}

		const hasCompanion = Math.random() < 0.3;

		setConfig({
			type: randomType.value,
			mass: parseFloat(mass.toFixed(2)),
			temperature: Math.floor(temperature),
			luminosity: parseFloat(luminosity.toFixed(4)),
			radius: parseFloat(radius.toFixed(2)),
			age: parseFloat(age.toFixed(1)),
			evolutionStage,
			hasCompanion,
			companionType: hasCompanion ? STAR_TYPES[Math.floor(Math.random() * 7)].value : "None",
			companionDistance: hasCompanion ? 0.1 + Math.random() * 100 : 0,
			metalicity: parseFloat((0.001 + Math.random() * 0.03).toFixed(4)),
			rotationPeriod: parseFloat((0.5 + Math.random() * 100).toFixed(1)),
			magneticField: parseFloat((0.1 + Math.random() * 10).toFixed(1)),
		});

		setStatus(`Generated ${randomType.label}: ${randomType.description}`);
	}, []);

	// Handle generation
	const handleGenerate = () => {
		setIsGenerating(true);
		setStatus("Generating stellar parameters...");
		setTimeout(() => {
			setIsGenerating(false);
			const starType = STAR_TYPES.find((t) => t.value === config.type);
			setStatus(`Generated ${starType?.label || config.type} with ${config.mass}M☉ mass`);
		}, 1000);
	};

	// Get current star type info
	const currentStarType = STAR_TYPES.find((t) => t.value === config.type);

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-yellow-950 to-black overflow-hidden">
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
							<Star className="w-4 h-4 text-white" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-white">Star Generator</h1>
							<p className="text-sm text-slate-300">{currentStarType?.label || "Unknown Star"}</p>
						</div>
					</div>

					<StarControls config={config} availableStarTypes={STAR_TYPES} onStarTypeChange={(type: string) => setConfig((prev) => ({ ...prev, type }))} showSettings={showSettings} showInfo={showInfo} onToggleSettings={() => setShowSettings(!showSettings)} onToggleInfo={() => setShowInfo(!showInfo)} onRandomize={generateRandomStar} onGenerate={handleGenerate} isGenerating={isGenerating} />
				</div>
			</div>

			{/* Status Message */}
			{status && (
				<div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-lg px-4 py-2">
					<div className="flex items-center space-x-2 text-yellow-400 text-sm">
						<Star className="w-4 h-4" />
						<span>{status}</span>
					</div>
				</div>
			)}

			{/* Loading Overlay */}
			{isGenerating && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto" />
						<p className="text-white">Generating Stellar Parameters...</p>
					</div>
				</div>
			)}

			{/* 3D Canvas - Full Screen */}
			<StarRenderer3D config={config} isGenerating={isGenerating} onLoadingChange={setIsGenerating} onGenerate={handleGenerate} />

			{/* Settings Panel */}
			{showSettings && <StarSettings config={config} onConfigChange={setConfig} onClose={() => setShowSettings(false)} availableStarTypes={STAR_TYPES} />}

			{/* Info Panel */}
			{showInfo && currentStarType && <StarInfo starType={currentStarType} config={config} onClose={() => setShowInfo(false)} />}

			{/* Quick Stats */}
			<StarStats config={config} currentStarType={currentStarType} />
		</div>
	);
}
