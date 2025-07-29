/**
 * @file fps-controls.tsx
 * @description Header controls for the FPS Explorer - AAA Game Style
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Play, Square, Settings2, Info, Gamepad2, Eye, Crosshair, Target, Compass, Activity, Zap } from "lucide-react";
import type { FPSConfig } from "./fps-explorer-generator";

interface FPSControlsProps {
	config: FPSConfig;
	isExploring: boolean;
	isInitializing: boolean;
	status: string;
	availableModes: Array<{ value: string; label: string; description: string }>;
	planetPresets: Array<{ name: string; planetClass: any; atmosphere: boolean; weatherType: string; vegetation: boolean }>;
	onStartExploration: () => void;
	onStopExploration: () => void;
	onConfigChange: (updates: Partial<FPSConfig>) => void;
	onApplyPreset: (preset: any) => void;
	onToggleSettings: () => void;
	onToggleInfo: () => void;
	showSettings: boolean;
	showInfo: boolean;
}

export function FPSControls({ config, isExploring, isInitializing, status, availableModes = [], planetPresets = [], onStartExploration, onStopExploration, onConfigChange, onApplyPreset, onToggleSettings, onToggleInfo, showSettings, showInfo }: FPSControlsProps) {
	const currentMode = availableModes?.find((m) => m.value === config.gameplay.explorationMode) || availableModes[0];

	return (
		<>
			{/* Main Header */}
			<div
				className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-green-900/95 to-slate-900/95 
							backdrop-blur-xl border-b border-green-400/30 shadow-2xl"
			>
				<div className="flex items-center justify-between px-6 py-4">
					{/* Left Section */}
					<div className="flex items-center space-x-4">
						<Link
							href="/test"
							className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200
									 px-3 py-2 rounded-lg hover:bg-green-500/10"
						>
							<ArrowLeft className="w-5 h-5" />
							<span className="font-medium">Back</span>
						</Link>

						<div className="w-px h-6 bg-slate-600" />

						<div className="flex items-center space-x-3">
							<div
								className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 
											flex items-center justify-center shadow-lg"
							>
								<Eye className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-white">First-Person Explorer</h1>
								<p className="text-sm text-green-300">AAA Planetary Surface Exploration</p>
							</div>
						</div>
					</div>

					{/* Center Section - Quick Mode Selection */}
					{!isExploring && (
						<div className="flex items-center space-x-2">
							<span className="text-sm text-slate-400">Mode:</span>
							<select
								value={config.gameplay.explorationMode}
								onChange={(e) =>
									onConfigChange({
										gameplay: { ...config.gameplay, explorationMode: e.target.value as any },
									})
								}
								className="bg-slate-800/80 border border-green-500/30 text-white text-sm rounded-lg px-3 py-2 
										 focus:ring-2 focus:ring-green-400 focus:border-transparent"
							>
								{availableModes.map((mode) => (
									<option key={mode.value} value={mode.value}>
										{mode.label}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Right Section */}
					<div className="flex items-center space-x-3">
						{/* Planet Preset Selector */}
						{!isExploring && (
							<div className="flex items-center space-x-2">
								<span className="text-sm text-slate-400">Planet:</span>
								<select
									onChange={(e) => {
										const preset = planetPresets.find((p) => p.name === e.target.value);
										if (preset) onApplyPreset(preset);
									}}
									className="bg-slate-800/80 border border-green-500/30 text-white text-sm rounded-lg px-3 py-2 
											 focus:ring-2 focus:ring-green-400 focus:border-transparent"
								>
									<option value="">Select Preset...</option>
									{planetPresets.map((preset) => (
										<option key={preset.name} value={preset.name}>
											{preset.name}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Main Action Button */}
						{!isExploring ? (
							<button
								onClick={onStartExploration}
								disabled={isInitializing}
								className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
										 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg 
										 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 
										 disabled:cursor-not-allowed transform hover:scale-105"
							>
								<Play className="w-5 h-5" />
								<span>{isInitializing ? "Initializing..." : "Start Exploration"}</span>
							</button>
						) : (
							<button
								onClick={onStopExploration}
								className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
										 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg 
										 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
							>
								<Square className="w-5 h-5" />
								<span>Stop Exploration</span>
							</button>
						)}

						{/* Settings & Info Buttons (only when not exploring) */}
						{!isExploring && (
							<>
								<div className="w-px h-6 bg-slate-600" />

								<button onClick={onToggleSettings} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${showSettings ? "bg-green-500 text-white shadow-lg" : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-green-500/30"}`}>
									<Settings2 className="w-4 h-4" />
									<span>Settings</span>
								</button>

								<button onClick={onToggleInfo} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${showInfo ? "bg-green-500 text-white shadow-lg" : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-green-500/30"}`}>
									<Info className="w-4 h-4" />
									<span>Info</span>
								</button>
							</>
						)}
					</div>
				</div>

				{/* Mode Description */}
				{!isExploring && (
					<div className="px-6 pb-3">
						<div className="text-sm text-green-200 bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-2">
							<span className="font-medium">{currentMode?.label || "Unknown"}:</span> {currentMode?.description || "No description available"}
						</div>
					</div>
				)}
			</div>

			{/* Status Message */}
			<div
				className="absolute top-28 left-1/2 transform -translate-x-1/2 z-40 
							bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 
							backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-2 shadow-lg"
			>
				<div className="flex items-center space-x-2 text-green-400 text-sm">
					<Activity className="w-4 h-4 animate-pulse" />
					<span>{status}</span>
				</div>
			</div>

			{/* In-Game HUD (only when exploring) */}
			{isExploring && (
				<>
					{/* HUD Elements */}
					<div className="absolute top-6 left-6 z-40 space-y-2">
						{/* Crosshair toggle */}
						{config.gameplay.showCrosshair && (
							<div className="bg-slate-900/70 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2">
								<div className="flex items-center space-x-2 text-green-400 text-sm">
									<Crosshair className="w-4 h-4" />
									<span>Crosshair Active</span>
								</div>
							</div>
						)}

						{/* Compass */}
						{config.gameplay.showCompass && (
							<div className="bg-slate-900/70 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2">
								<div className="flex items-center space-x-2 text-green-400 text-sm">
									<Compass className="w-4 h-4" />
									<span>N 0°</span>
								</div>
							</div>
						)}
					</div>

					{/* Movement Instructions */}
					<div
						className="absolute bottom-6 left-6 z-40 bg-slate-900/70 backdrop-blur-sm 
									border border-green-400/30 rounded-lg px-4 py-3"
					>
						<div className="text-green-400 text-sm space-y-1">
							<div className="font-medium mb-2">Controls:</div>
							<div>WASD - Move</div>
							<div>Mouse - Look Around</div>
							<div>Shift - Run</div>
							<div>Space - Jump</div>
							<div>C - Crouch</div>
							<div>E - Interact</div>
							<div>ESC - Exit Exploration</div>
						</div>
					</div>

					{/* Performance Mode Indicator */}
					<div
						className="absolute top-6 right-6 z-40 bg-slate-900/70 backdrop-blur-sm 
									border border-green-400/30 rounded-lg px-3 py-2"
					>
						<div className="flex items-center space-x-2 text-green-400 text-sm">
							<Zap className="w-4 h-4" />
							<span>Performance: {config.gameplay.textureQuality.toUpperCase()}</span>
						</div>
					</div>

					{/* Stamina Bar */}
					{config.gameplay.showStaminaBar && (
						<div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40">
							<div className="bg-slate-900/70 backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-2">
								<div className="flex items-center space-x-2">
									<Activity className="w-4 h-4 text-green-400" />
									<div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
										<div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300" style={{ width: `${config.player.stamina}%` }} />
									</div>
									<span className="text-green-400 text-sm font-mono">{config.player.stamina}%</span>
								</div>
							</div>
						</div>
					)}

					{/* Center Crosshair */}
					{config.gameplay.showCrosshair && (
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
							<div className="w-6 h-6 relative">
								<div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
								<div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-green-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
								<div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-green-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}
