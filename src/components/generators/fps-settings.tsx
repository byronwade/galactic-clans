/**
 * @file fps-settings.tsx
 * @description AAA-Quality Settings Panel for FPS Exploration
 * @version 2.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Field of View (FOV) adjustment
 * - Mouse sensitivity controls (X/Y separate)
 * - Graphics quality settings
 * - Audio settings
 * - Control customization
 * - Performance options
 */

"use client";

import React, { useState } from "react";
import { Settings, X, Eye, Mouse, Volume2, Gamepad2, Sliders, Monitor } from "lucide-react";
import type { FPSConfig } from "./fps-explorer-generator";

interface FPSSettingsProps {
	config: FPSConfig;
	isOpen: boolean;
	onClose: () => void;
	onConfigChange: (updates: Partial<FPSConfig>) => void;
}

export function FPSSettings({ config, isOpen, onClose, onConfigChange }: FPSSettingsProps) {
	const [activeTab, setActiveTab] = useState<"camera" | "controls" | "graphics" | "audio">("camera");

	if (!isOpen) return null;

	const updatePlayerConfig = (updates: any) => {
		onConfigChange({
			player: { ...config.player, ...updates },
		});
	};

	const updateEnvironmentConfig = (updates: any) => {
		onConfigChange({
			environment: { ...config.environment, ...updates },
		});
	};

	const updateGameplayConfig = (updates: any) => {
		onConfigChange({
			gameplay: { ...config.gameplay, ...updates },
		});
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
			<div className="bg-slate-900 border border-green-400/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-slate-700">
					<div className="flex items-center space-x-3">
						<Settings className="w-6 h-6 text-green-400" />
						<h2 className="text-2xl font-bold text-white">FPS Explorer Settings</h2>
					</div>
					<button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
						<X className="w-6 h-6" />
					</button>
				</div>

				<div className="flex">
					{/* Sidebar */}
					<div className="w-64 border-r border-slate-700 p-4">
						<nav className="space-y-2">
							{[
								{ id: "camera", label: "Camera & View", icon: Eye },
								{ id: "controls", label: "Controls", icon: Mouse },
								{ id: "graphics", label: "Graphics", icon: Monitor },
								{ id: "audio", label: "Audio", icon: Volume2 },
							].map((tab) => (
								<button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? "bg-green-500/20 text-green-400 border border-green-400/30" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>
									<tab.icon className="w-5 h-5" />
									<span>{tab.label}</span>
								</button>
							))}
						</nav>
					</div>

					{/* Content */}
					<div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
						{activeTab === "camera" && (
							<div className="space-y-6">
								<h3 className="text-xl font-semibold text-white mb-4">Camera & View Settings</h3>

								{/* Field of View */}
								<div className="space-y-3">
									<label className="block text-sm font-medium text-slate-300">Field of View (FOV)</label>
									<div className="flex items-center space-x-4">
										<input type="range" min="60" max="120" step="5" value={config.player.fov} onChange={(e) => updatePlayerConfig({ fov: parseInt(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
										<span className="text-white font-mono w-12 text-center">{config.player.fov}°</span>
									</div>
									<p className="text-xs text-slate-400">Higher FOV provides wider view but may cause fisheye effect. Default: 75°</p>
								</div>

								{/* Mouse Sensitivity */}
								<div className="space-y-3">
									<label className="block text-sm font-medium text-slate-300">Mouse Sensitivity</label>
									<div className="flex items-center space-x-4">
										<input type="range" min="0.1" max="5.0" step="0.1" value={config.player.mouseSensitivity} onChange={(e) => updatePlayerConfig({ mouseSensitivity: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
										<span className="text-white font-mono w-12 text-center">{config.player.mouseSensitivity.toFixed(1)}</span>
									</div>
								</div>

								{/* Head Bobbing */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<label className="text-sm font-medium text-slate-300">Head Bobbing</label>
										<input type="checkbox" checked={config.player.viewBobbing} onChange={(e) => updatePlayerConfig({ viewBobbing: e.target.checked })} className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded" />
									</div>
									{config.player.viewBobbing && (
										<div className="flex items-center space-x-4 ml-4">
											<span className="text-xs text-slate-400">Intensity:</span>
											<input type="range" min="0.1" max="2.0" step="0.1" value={config.player.headBobIntensity} onChange={(e) => updatePlayerConfig({ headBobIntensity: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
											<span className="text-white font-mono w-12 text-center">{config.player.headBobIntensity.toFixed(1)}</span>
										</div>
									)}
								</div>
							</div>
						)}

						{activeTab === "controls" && (
							<div className="space-y-6">
								<h3 className="text-xl font-semibold text-white mb-4">Control Settings</h3>

								{/* Movement Speeds */}
								<div className="grid grid-cols-2 gap-6">
									<div className="space-y-3">
										<label className="block text-sm font-medium text-slate-300">Walk Speed</label>
										<div className="flex items-center space-x-4">
											<input type="range" min="1" max="10" step="0.5" value={config.player.walkSpeed} onChange={(e) => updatePlayerConfig({ walkSpeed: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
											<span className="text-white font-mono w-12 text-center">{config.player.walkSpeed.toFixed(1)}</span>
										</div>
									</div>

									<div className="space-y-3">
										<label className="block text-sm font-medium text-slate-300">Run Speed</label>
										<div className="flex items-center space-x-4">
											<input type="range" min="5" max="20" step="0.5" value={config.player.runSpeed} onChange={(e) => updatePlayerConfig({ runSpeed: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
											<span className="text-white font-mono w-12 text-center">{config.player.runSpeed.toFixed(1)}</span>
										</div>
									</div>
								</div>

								{/* Jump Settings */}
								<div className="space-y-3">
									<label className="block text-sm font-medium text-slate-300">Jump Height</label>
									<div className="flex items-center space-x-4">
										<input type="range" min="0.5" max="3.0" step="0.1" value={config.player.jumpHeight} onChange={(e) => updatePlayerConfig({ jumpHeight: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
										<span className="text-white font-mono w-12 text-center">{config.player.jumpHeight.toFixed(1)}m</span>
									</div>
								</div>
							</div>
						)}

						{activeTab === "graphics" && (
							<div className="space-y-6">
								<h3 className="text-xl font-semibold text-white mb-4">Graphics Settings</h3>

								{/* Terrain Detail */}
								<div className="space-y-3">
									<label className="block text-sm font-medium text-slate-300">Terrain Detail</label>
									<div className="flex items-center space-x-4">
										<input type="range" min="0.5" max="2.0" step="0.1" value={config.environment.terrainDetail} onChange={(e) => updateEnvironmentConfig({ terrainDetail: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
										<span className="text-white font-mono w-12 text-center">{config.environment.terrainDetail.toFixed(1)}</span>
									</div>
								</div>

								{/* Vegetation */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<label className="text-sm font-medium text-slate-300">Enable Vegetation</label>
										<input type="checkbox" checked={config.environment.enableVegetation} onChange={(e) => updateEnvironmentConfig({ enableVegetation: e.target.checked })} className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded" />
									</div>
									{config.environment.enableVegetation && (
										<div className="flex items-center space-x-4 ml-4">
											<span className="text-xs text-slate-400">Density:</span>
											<input type="range" min="0.1" max="1.0" step="0.1" value={config.environment.vegetationDensity} onChange={(e) => updateEnvironmentConfig({ vegetationDensity: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
											<span className="text-white font-mono w-12 text-center">{config.environment.vegetationDensity.toFixed(1)}</span>
										</div>
									)}
								</div>

								{/* Lighting */}
								<div className="space-y-3">
									<label className="block text-sm font-medium text-slate-300">Sun Intensity</label>
									<div className="flex items-center space-x-4">
										<input type="range" min="0.1" max="3.0" step="0.1" value={config.environment.sunIntensity} onChange={(e) => updateEnvironmentConfig({ sunIntensity: parseFloat(e.target.value) })} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
										<span className="text-white font-mono w-12 text-center">{config.environment.sunIntensity.toFixed(1)}</span>
									</div>
								</div>
							</div>
						)}

						{activeTab === "audio" && (
							<div className="space-y-6">
								<h3 className="text-xl font-semibold text-white mb-4">Audio Settings</h3>

								{/* Ambient Sounds */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<label className="text-sm font-medium text-slate-300">Ambient Sounds</label>
										<input type="checkbox" checked={config.environment.ambientSounds} onChange={(e) => updateEnvironmentConfig({ ambientSounds: e.target.checked })} className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded" />
									</div>
								</div>

								{/* Wind Sounds */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<label className="text-sm font-medium text-slate-300">Wind Sounds</label>
										<input type="checkbox" checked={config.environment.windSounds} onChange={(e) => updateEnvironmentConfig({ windSounds: e.target.checked })} className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded" />
									</div>
								</div>

								{/* Echo Effect */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<label className="text-sm font-medium text-slate-300">Echo Effect</label>
										<input type="checkbox" checked={config.environment.echoEffect} onChange={(e) => updateEnvironmentConfig({ echoEffect: e.target.checked })} className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded" />
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="border-t border-slate-700 p-6 flex justify-between items-center">
					<div className="text-sm text-slate-400">Changes are applied immediately</div>
					<div className="flex space-x-3">
						<button
							onClick={() => {
								// Reset to defaults
								onConfigChange({
									player: {
										fov: 75,
										mouseSensitivity: 1.0,
										walkSpeed: 5,
										runSpeed: 10,
										jumpHeight: 1.5,
										viewBobbing: true,
										headBobIntensity: 1.0,
										crouchSpeed: 2,
										gravity: 20,
										playerHeight: 1.8,
										playerRadius: 0.3,
										stepHeight: 0.5,
										stamina: 100,
										breathingEffect: true,
									},
									environment: {
										terrainDetail: 1.0,
										enableVegetation: true,
										vegetationDensity: 0.5,
										sunIntensity: 1.2,
										ambientSounds: true,
										windSounds: true,
										echoEffect: false,
										planetClass: "TERRESTRIAL" as any,
										planetRadius: 6371,
										gravity: 9.81,
										atmosphere: true,
										terrainScale: 1.0,
										heightVariation: 20,
										treeTypes: ["oak", "pine"],
										weatherEnabled: false,
										weatherType: "clear",
										windStrength: 5,
										timeOfDay: 12,
										ambientLight: 0.4,
									},
									gameplay: {
										explorationMode: "free",
										showCrosshair: true,
										showMinimap: false,
										showCompass: true,
										showHealthBar: true,
										showStaminaBar: true,
										interactionRange: 2,
										enableScanning: true,
										enableSampling: true,
									},
								});
							}}
							className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
						>
							Reset to Defaults
						</button>
						<button onClick={onClose} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
							Done
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FPSSettings; 