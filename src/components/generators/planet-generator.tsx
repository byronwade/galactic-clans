/**
 * @file planet-generator.tsx
 * @description Full-screen planet generator with modular components
 * @version 7.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { PlanetClass, getPlanetTypeByClass, PLANET_TYPES } from "@/shared/procgen/planet/planet-types";
import { Globe, Settings, Shuffle, RotateCcw, Info, Palette } from "lucide-react";

// Import modular components
import { PlanetRenderer3D } from "./planet-renderer-3d";
import { PlanetControls } from "./planet-controls";
import { PlanetSettings } from "./planet-settings";
import { PlanetInfo } from "./planet-info";
import { PlanetStats } from "./planet-stats";
import { ComponentErrorBoundary } from "@/components/ErrorBoundary";

// Simple planet configuration
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

export default function PlanetGenerator() {
	const [config, setConfig] = useState<SimplePlanetConfig>({
		planetClass: PlanetClass.TERRESTRIAL,
		radius: 2,
		color: "#4a7c59",
		hasRings: false,
		hasMoons: true,
		hasAtmosphere: true,
		enableVegetation: true,
		treeCount: 300,
		surfaceDetail: 0.8,
	});

	const [showSettings, setShowSettings] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Handle planet type change
	const handlePlanetTypeChange = useCallback((planetClass: PlanetClass) => {
		const planetType = getPlanetTypeByClass(planetClass);
		if (planetType && planetType.primaryColors && planetType.primaryColors.length > 0) {
			setConfig((prev) => ({
				...prev,
				planetClass,
				color: planetType.primaryColors[0] ? `#${planetType.primaryColors[0].getHexString()}` : "#4a7c59",
				hasRings: planetType.features.rings,
				hasMoons: planetType.features.moons > 0,
				hasAtmosphere: planetType.features.clouds,
			}));
		}
	}, []);

	// Get current planet type info
	const currentPlanetType = getPlanetTypeByClass(config.planetClass);
	const availablePlanetTypes = useCallback(() => Array.from(PLANET_TYPES.keys()), []);

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-black overflow-hidden">
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
							<Globe className="w-4 h-4 text-white" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-white">Planet Generator</h1>
							<p className="text-sm text-slate-300">{currentPlanetType?.name || "Unknown Planet"}</p>
						</div>
					</div>

					<PlanetControls config={config} availablePlanetTypes={availablePlanetTypes()} onPlanetTypeChange={handlePlanetTypeChange} showSettings={showSettings} showInfo={showInfo} onToggleSettings={() => setShowSettings(!showSettings)} onToggleInfo={() => setShowInfo(!showInfo)} onRegenerate={() => setIsLoading(true)} />
				</div>
			</div>

			{/* Loading Overlay */}
			{isLoading && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto" />
						<p className="text-white">Generating Planet...</p>
					</div>
				</div>
			)}

			{/* 3D Canvas - Full Screen */}
			<ComponentErrorBoundary name="Planet Renderer">
				<PlanetRenderer3D config={config} isLoading={isLoading} onLoadingChange={setIsLoading} />
			</ComponentErrorBoundary>

			{/* Settings Panel */}
			{showSettings && <PlanetSettings config={config} onConfigChange={setConfig} onClose={() => setShowSettings(false)} />}

			{/* Info Panel */}
			{showInfo && currentPlanetType && <PlanetInfo planetType={currentPlanetType} onClose={() => setShowInfo(false)} />}

			{/* Quick Stats */}
			<PlanetStats config={config} currentPlanetType={currentPlanetType} />
		</div>
	);
}
