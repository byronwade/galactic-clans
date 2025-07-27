/**
 * @file solar-system-generator.tsx
 * @description Main orchestrator for the modular Solar System Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useState, useCallback } from "react";
import { SolarSystemRenderer3D } from "./solar-system-renderer-3d";
import { SolarSystemControls } from "./solar-system-controls";
import { SolarSystemSettings } from "./solar-system-settings";
import { SolarSystemInfo } from "./solar-system-info";
import { SolarSystemStats } from "./solar-system-stats";

export interface SolarSystemConfig {
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

export const SYSTEM_TYPES = [
	{ value: "solar_analog", label: "Solar Analog", description: "Similar to our Solar System" },
	{ value: "red_dwarf_system", label: "Red Dwarf System", description: "System around a red dwarf star" },
	{ value: "binary_system", label: "Binary Star System", description: "Two stars orbiting each other" },
	{ value: "giant_star_system", label: "Giant Star System", description: "System around a giant star" },
	{ value: "young_system", label: "Young System", description: "Recently formed planetary system" },
	{ value: "ancient_system", label: "Ancient System", description: "Very old, evolved system" },
	{ value: "compact_system", label: "Compact System", description: "Planets very close to the star" },
	{ value: "extended_system", label: "Extended System", description: "Planets spread over large distances" },
	{ value: "hot_jupiter_system", label: "Hot Jupiter System", description: "Gas giant very close to star" },
	{ value: "eccentric_system", label: "Eccentric System", description: "Highly elliptical orbits" }
];

export default function SolarSystemGenerator() {
	// Core state
	const [config, setConfig] = useState<SolarSystemConfig>({
		starType: "solar_analog",
		starMass: 1.0,
		starRadius: 1.0,
		starTemperature: 5778,
		planetCount: 8,
		asteroidBelt: true,
		cometCount: 50,
		systemAge: 4.6,
		metalicity: 0.0122,
		habitableZone: { inner: 0.95, outer: 1.37 },
		systemName: "Sol System",
		hasGasGiants: true,
		hasTerrestrialPlanets: true,
		hasRoguePlanets: false
	});

	// UI state
	const [showSettings, setShowSettings] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [status, setStatus] = useState("Ready to generate solar system");

	// Event handlers
	const generateRandomSystem = useCallback((): SolarSystemConfig => {
		const randomType = SYSTEM_TYPES[Math.floor(Math.random() * SYSTEM_TYPES.length)];
		if (!randomType) {
			throw new Error("No system types available");
		}
		
		return {
			starType: randomType.value,
			starMass: 0.1 + Math.random() * 2.0,
			starRadius: 0.5 + Math.random() * 1.5,
			starTemperature: 2500 + Math.random() * 8000,
			planetCount: Math.floor(Math.random() * 12) + 1,
			asteroidBelt: Math.random() > 0.3,
			cometCount: Math.floor(Math.random() * 100) + 10,
			systemAge: Math.random() * 13.8,
			metalicity: Math.random() * 0.05,
			habitableZone: {
				inner: 0.5 + Math.random() * 1.0,
				outer: 1.0 + Math.random() * 2.0
			},
			systemName: `System ${Math.floor(Math.random() * 10000)}`,
			hasGasGiants: Math.random() > 0.2,
			hasTerrestrialPlanets: Math.random() > 0.1,
			hasRoguePlanets: Math.random() > 0.8
		};
	}, []);

	const handleGenerate = useCallback(() => {
		setIsGenerating(true);
		setStatus("Generating orbital mechanics...");
		
		setTimeout(() => {
			setStatus("Placing celestial bodies...");
			setTimeout(() => {
				setStatus("Solar system generated successfully!");
				setIsGenerating(false);
			}, 800);
		}, 500);
	}, []);

	const handleRandomize = useCallback(() => {
		const randomConfig = generateRandomSystem();
		setConfig(randomConfig);
		setStatus(`Generated ${randomConfig.systemName}`);
	}, [generateRandomSystem]);

	const handleClear = useCallback(() => {
		setStatus("System cleared");
	}, []);

	const handleSystemTypeChange = useCallback((type: string) => {
		setConfig(prev => ({ ...prev, starType: type }));
	}, []);

	const handleConfigChange = useCallback((updates: Partial<SolarSystemConfig>) => {
		setConfig(prev => ({ ...prev, ...updates }));
	}, []);

	// Get current system type
	const currentSystemType = SYSTEM_TYPES.find(t => t.value === config.starType) || SYSTEM_TYPES[0];

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-orange-950 to-black overflow-hidden">
			{/* Header Controls */}
			<SolarSystemControls
				config={config}
				availableSystemTypes={SYSTEM_TYPES}
				isGenerating={isGenerating}
				status={status}
				onSystemTypeChange={handleSystemTypeChange}
				onGenerate={handleGenerate}
				onRandomize={handleRandomize}
				onClear={handleClear}
				onToggleSettings={() => setShowSettings(!showSettings)}
				onToggleInfo={() => setShowInfo(!showInfo)}
				showSettings={showSettings}
				showInfo={showInfo}
			/>

			{/* 3D Renderer */}
			<SolarSystemRenderer3D
				config={config}
				isLoading={isGenerating}
				onLoadingChange={setIsGenerating}
			/>

			{/* Settings Panel */}
			{showSettings && (
				<SolarSystemSettings
					config={config}
					onConfigChange={handleConfigChange}
					onClose={() => setShowSettings(false)}
					availableSystemTypes={SYSTEM_TYPES}
				/>
			)}

			{/* Info Panel */}
			{showInfo && (
				<SolarSystemInfo
					systemType={config.starType}
					config={config}
					onClose={() => setShowInfo(false)}
				/>
			)}

			{/* Stats Panel */}
			<SolarSystemStats
				config={config}
				currentSystemType={currentSystemType}
			/>
		</div>
	);
} 