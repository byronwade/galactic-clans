/**
 * @file fps-explorer-generator.tsx
 * @description AAA-Quality First-Person Planetary Exploration System
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * This is our most advanced generator, implementing:
 * - Call of Duty style first-person controls
 * - Advanced physics and collision detection
 * - Procedural planetary terrain generation
 * - 3D spatial audio system
 * - Diegetic UI/HUD elements
 * - Performance optimization systems
 */

"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { FPSRenderer3D } from "./fps-renderer-3d";
import { FPSControls } from "./fps-controls";
import { FPSSettings } from "./fps-settings";
import { FPSInfo } from "./fps-info";
import { FPSStats } from "./fps-stats";
import { FPSInputManager } from "./fps-input-manager";
import { PlanetClass } from "@/shared/procgen/planet/planet-types";

// Core configuration interfaces
export interface FPSPlayerConfig {
	// Movement settings
	walkSpeed: number;
	runSpeed: number;
	crouchSpeed: number;
	jumpHeight: number;
	gravity: number;

	// Camera settings
	mouseSensitivity: number;
	fov: number;
	viewBobbing: boolean;

	// Physics settings
	playerHeight: number;
	playerRadius: number;
	stepHeight: number;

	// Advanced settings
	stamina: number;
	breathingEffect: boolean;
	headBobIntensity: number;
}

export interface FPSEnvironmentConfig {
	// Planet settings
	planetClass: PlanetClass;
	planetRadius: number;
	gravity: number;
	atmosphere: boolean;

	// Terrain generation
	terrainDetail: number;
	terrainScale: number;
	heightVariation: number;

	// Vegetation
	enableVegetation: boolean;
	vegetationDensity: number;
	treeTypes: string[];

	// Weather system
	weatherEnabled: boolean;
	weatherType: "clear" | "rain" | "storm" | "fog" | "snow";
	windStrength: number;

	// Lighting
	timeOfDay: number; // 0-24 hours
	sunIntensity: number;
	ambientLight: number;

	// Audio environment
	ambientSounds: boolean;
	echoEffect: boolean;
	windSounds: boolean;
}

export interface FPSGameplayConfig {
	// Exploration mode
	explorationMode: "free" | "guided" | "survival";

	// UI/HUD
	showCrosshair: boolean;
	showMinimap: boolean;
	showCompass: boolean;
	showHealthBar: boolean;
	showStaminaBar: boolean;

	// Interaction system
	interactionRange: number;
	enableScanning: boolean;
	enableSampling: boolean;

	// Performance
	renderDistance: number;
	lodLevels: number;
	shadowQuality: "low" | "medium" | "high" | "ultra";
	textureQuality: "low" | "medium" | "high" | "ultra";
}

export interface FPSConfig {
	player: FPSPlayerConfig;
	environment: FPSEnvironmentConfig;
	gameplay: FPSGameplayConfig;
}

// Performance monitoring interface
export interface FPSPerformanceMetrics {
	frameRate: number;
	frameTime: number;
	drawCalls: number;
	triangles: number;
	memoryUsage: number;
	cpuUsage: number;
}

// Planet presets for quick environment setup
const PLANET_PRESETS = [
	{
		name: "Earth-like",
		planetClass: "terrestrial" as const,
		atmosphere: true,
		weatherType: "clear" as const,
		vegetation: true,
	},
	{
		name: "Desert World",
		planetClass: "desert" as const,
		atmosphere: false,
		weatherType: "clear" as const,
		vegetation: false,
	},
	{
		name: "Jungle World",
		planetClass: "terrestrial" as const,
		atmosphere: true,
		weatherType: "rain" as const,
		vegetation: true,
	},
	{
		name: "Ice Planet",
		planetClass: "ice" as const,
		atmosphere: true,
		weatherType: "snow" as const,
		vegetation: false,
	},
	{
		name: "Volcanic World",
		planetClass: "volcanic" as const,
		atmosphere: true,
		weatherType: "storm" as const,
		vegetation: false,
	},
];

export default function FPSExplorerGenerator() {
	// Core state management
	const [config, setConfig] = useState<FPSConfig>({
		player: {
			walkSpeed: 5.0,
			runSpeed: 8.0,
			crouchSpeed: 2.5,
			jumpHeight: 1.2,
			gravity: 9.81,
			mouseSensitivity: 2.0,
			fov: 75,
			viewBobbing: true,
			playerHeight: 1.8,
			playerRadius: 0.3,
			stepHeight: 0.3,
			stamina: 100,
			breathingEffect: true,
			headBobIntensity: 1.0,
		},
		environment: {
			planetClass: PlanetClass.TERRESTRIAL,
			planetRadius: 100,
			gravity: 9.81,
			atmosphere: true,
			terrainDetail: 0.8,
			terrainScale: 50.0,
			heightVariation: 20.0,
			enableVegetation: true,
			vegetationDensity: 0.5,
			treeTypes: ["Oak", "Pine", "Birch"],
			weatherEnabled: true,
			weatherType: "clear",
			windStrength: 0.3,
			timeOfDay: 12.0,
			sunIntensity: 1.0,
			ambientLight: 0.4,
			ambientSounds: true,
			echoEffect: false,
			windSounds: true,
		},
		gameplay: {
			explorationMode: "free",
			showCrosshair: true,
			showMinimap: true,
			showCompass: true,
			showHealthBar: false,
			showStaminaBar: true,
			interactionRange: 3.0,
			enableScanning: true,
			enableSampling: true,
			renderDistance: 200,
			lodLevels: 4,
			shadowQuality: "high",
			textureQuality: "high",
		},
	});

	const [isLoading, setIsLoading] = useState(false);
	const [isExploring, setIsExploring] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [performanceMetrics, setPerformanceMetrics] = useState<FPSPerformanceMetrics>({
		frameRate: 60,
		frameTime: 16.67,
		drawCalls: 0,
		triangles: 0,
		memoryUsage: 0,
		cpuUsage: 0,
	});

	const inputManagerRef = useRef<any>(null);
	const rendererRef = useRef<any>(null);

	// Available exploration modes
	const EXPLORATION_MODES = [
		{ value: "free", label: "Free Exploration", description: "Explore freely without restrictions" },
		{ value: "guided", label: "Guided Tour", description: "Follow waypoints and objectives" },
		{ value: "survival", label: "Survival Mode", description: "Limited resources and challenging gameplay" },
	];

	// Configuration update handler
	const handleConfigChange = useCallback((updates: Partial<FPSConfig>) => {
		setConfig((prev) => ({ ...prev, ...updates }));
	}, []);

	// Get current exploration mode
	const currentMode = EXPLORATION_MODES.find((m) => m.value === config.gameplay.explorationMode) ?? {
		value: "free",
		label: "Free Exploration",
		description: "Explore freely without restrictions",
	};

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-black">
			{/* Loading State */}
			{isLoading && (
				<div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="text-center space-y-4">
						<div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto" />
						<h3 className="text-xl font-semibold text-white">Initializing FPS Explorer</h3>
						<p className="text-slate-300">Loading terrain, physics, and rendering systems...</p>
					</div>
				</div>
			)}

			{/* Main Content Area */}
			<div className="relative w-full h-full">
				{/* FPS Input Manager */}
				<FPSInputManager ref={inputManagerRef} config={config.player} enabled={isExploring} onConfigChange={(updates) => handleConfigChange({ player: { ...config.player, ...updates } })} />

				{/* Professional FPS Renderer */}
				<FPSRenderer3D ref={rendererRef} config={config} onPerformanceUpdate={setPerformanceMetrics} />

				{/* FPS Controls Header */}
				<FPSControls
					config={config}
					onConfigChange={handleConfigChange}
					isExploring={isExploring}
					isInitializing={isLoading}
					status={isLoading ? "loading" : isExploring ? "exploring" : "ready"}
					availableModes={EXPLORATION_MODES}
					planetPresets={PLANET_PRESETS}
					onStartExploration={() => {
						setIsExploring(true);
						setIsLoading(true);
						// Simulate initialization
						setTimeout(() => setIsLoading(false), 2000);
					}}
					onStopExploration={() => setIsExploring(false)}
					onApplyPreset={(preset) => {
						// Apply the planet preset to the config
						handleConfigChange({
							environment: {
								...config.environment,
								weatherType: preset.weatherType,
								enableVegetation: preset.vegetation,
							},
						});
					}}
					onToggleSettings={() => setShowSettings(!showSettings)}
					onToggleInfo={() => setShowInfo(!showInfo)}
					showSettings={showSettings}
					showInfo={showInfo}
				/>

				{/* Settings Panel */}
				{showSettings && <FPSSettings config={config} onConfigChange={handleConfigChange} onClose={() => setShowSettings(false)} availableModes={EXPLORATION_MODES} planetPresets={PLANET_PRESETS} />}

				{/* Info Panel */}
				{showInfo && <FPSInfo config={config} currentMode={currentMode} onClose={() => setShowInfo(false)} />}

				{/* Stats Panel */}
				<FPSStats config={config} performanceMetrics={performanceMetrics} isExploring={isExploring} currentMode={currentMode} />

				{/* FPS Crosshair */}
				{isExploring && config.gameplay.showCrosshair && (
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
						<div className="w-6 h-6 flex items-center justify-center">
							<div className="w-1 h-1 bg-white rounded-full opacity-80" />
							<div className="absolute w-4 h-px bg-white opacity-60" />
							<div className="absolute w-px h-4 bg-white opacity-60" />
						</div>
					</div>
				)}

				{/* Instructions Overlay */}
				{isExploring && !isLoading && (
					<div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-md">
						<h4 className="text-white font-semibold mb-2">FPS Controls</h4>
						<div className="text-sm text-slate-300 space-y-1">
							<p>
								<span className="text-green-400">WASD:</span> Move around
							</p>
							<p>
								<span className="text-green-400">Mouse:</span> Look around
							</p>
							<p>
								<span className="text-green-400">Shift:</span> Run
							</p>
							<p>
								<span className="text-green-400">Space:</span> Jump
							</p>
							<p>
								<span className="text-green-400">C:</span> Crouch
							</p>
							<p>
								<span className="text-green-400">ESC:</span> Exit
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
