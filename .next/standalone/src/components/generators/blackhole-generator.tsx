/**
 * @file blackhole-generator.tsx
 * @description Main orchestrator for the modular Black Hole Generator architecture
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { BlackHoleRenderer3D } from "./blackhole-renderer-3d";
import { BlackHoleControls } from "./blackhole-controls";
import { BlackHoleSettings } from "./blackhole-settings";
import { BlackHoleInfo } from "./blackhole-info";
import { BlackHoleStats } from "./blackhole-stats";

// Black Hole Types
export const BLACKHOLE_TYPES = [
	{ value: "stellar", label: "Stellar Mass", description: "3-50 M☉ - Formed from massive star collapse" },
	{ value: "intermediate", label: "Intermediate Mass", description: "100-10K M☉ - Mysterious formation process" },
	{ value: "supermassive", label: "Supermassive", description: "1M-100B M☉ - Galactic center behemoths" },
] as const;

export type BlackHoleType = typeof BLACKHOLE_TYPES[number]["value"];

// Configuration interface
export interface BlackHoleConfig {
	type: BlackHoleType;
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
}

// Default configuration
const DEFAULT_CONFIG: BlackHoleConfig = {
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
};

interface BlackHoleGeneratorProps {
	className?: string;
}

export function BlackHoleGenerator({ className = "" }: BlackHoleGeneratorProps) {
	const [config, setConfig] = useState<BlackHoleConfig>(DEFAULT_CONFIG);
	const [status, setStatus] = useState("Black hole generator ready! Explore spacetime curvature and relativistic effects.");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showInfo, setShowInfo] = useState(false);

	// Generation handlers
	const handleGenerate = useCallback(() => {
		setIsGenerating(true);
		setStatus("Generating black hole with relativistic physics...");
		
		setTimeout(() => {
			setStatus("Black hole generated! Explore spacetime curvature and gravitational lensing.");
			setIsGenerating(false);
		}, 1000);
	}, []);

	const handleClear = useCallback(() => {
		setConfig(DEFAULT_CONFIG);
		setStatus("Black hole cleared - ready to generate");
	}, []);

	const handleRandomize = useCallback(() => {
		const types = BLACKHOLE_TYPES.map(t => t.value);
		const randomType = types[Math.floor(Math.random() * types.length)] as BlackHoleType;

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
	}, []);

	// Configuration update handler
	const handleConfigChange = useCallback((updates: Partial<BlackHoleConfig>) => {
		setConfig(prev => ({ ...prev, ...updates }));
	}, []);

	return (
		<div className={`fixed inset-0 bg-black overflow-hidden ${className}`}>
			{/* 3D Renderer */}
			<BlackHoleRenderer3D 
				config={config} 
				onGenerate={handleGenerate} 
				onClear={handleClear}
				isGenerating={isGenerating}
			/>

			{/* Header Controls */}
			<BlackHoleControls
				config={config}
				status={status}
				isGenerating={isGenerating}
				showSettings={showSettings}
				showInfo={showInfo}
				onGenerate={handleGenerate}
				onClear={handleClear}
				onRandomize={handleRandomize}
				onToggleSettings={() => setShowSettings(!showSettings)}
				onToggleInfo={() => setShowInfo(!showInfo)}
			/>

			{/* Settings Panel */}
			{showSettings && (
				<BlackHoleSettings
					config={config}
					onConfigChange={handleConfigChange}
				/>
			)}

			{/* Info Panel */}
			{showInfo && (
				<BlackHoleInfo 
					config={config}
				/>
			)}

			{/* Stats Panel */}
			<BlackHoleStats 
				config={config}
			/>
		</div>
	);
} 