/**
 * @file fps-info.tsx
 * @description FPS Explorer Information Panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Displays comprehensive information about:
 * - Exploration modes and features
 * - Control schemes and key bindings
 * - Current planet configuration
 * - Technical specifications
 */

"use client";

import React from "react";
import { X, Info, Gamepad2, Globe, Cpu, Key, Eye, Zap } from "lucide-react";
import type { FPSConfig } from "./fps-explorer-generator";

interface FPSInfoProps {
	config: FPSConfig;
	currentMode: { value: string; label: string; description: string };
	onClose: () => void;
}

export function FPSInfo({ config, currentMode, onClose }: FPSInfoProps) {
	return (
		<div className="fixed right-4 top-20 bottom-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-2xl z-50 overflow-hidden">
			{/* Header */}
			<div className="p-4 border-b border-green-400/20 bg-gradient-to-r from-green-900/50 to-emerald-900/50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Info className="w-5 h-5 text-green-400" />
						<h3 className="font-semibold text-white">Explorer Info</h3>
					</div>
					<button onClick={onClose} className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors">
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Info Content */}
			<div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
				{/* Current Mode */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-green-400 font-medium">
						<Eye className="w-4 h-4" />
						<span>Current Mode</span>
					</div>

					<div className="pl-6 space-y-2">
						<div className="p-3 bg-slate-800/50 rounded border border-green-400/20">
							<h4 className="font-medium text-white">{currentMode?.label || "Unknown"}</h4>
							<p className="text-sm text-slate-300 mt-1">{currentMode?.description || "No description available"}</p>
						</div>
					</div>
				</div>

				{/* Controls */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-green-400 font-medium">
						<Key className="w-4 h-4" />
						<span>Controls</span>
					</div>

					<div className="pl-6 space-y-2 text-sm">
						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Movement:</span>
									<span className="text-white font-mono">WASD</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Look:</span>
									<span className="text-white font-mono">Mouse</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Jump:</span>
									<span className="text-white font-mono">Space</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Crouch:</span>
									<span className="text-white font-mono">Ctrl</span>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Run:</span>
									<span className="text-white font-mono">Shift</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Interact:</span>
									<span className="text-white font-mono">E</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Scan:</span>
									<span className="text-white font-mono">F</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Menu:</span>
									<span className="text-white font-mono">Tab</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Planet Information */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-green-400 font-medium">
						<Globe className="w-4 h-4" />
						<span>Planet Environment</span>
					</div>

					<div className="pl-6 space-y-2">
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Class:</span>
									<span className="text-white">{config.environment.planetClass}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Radius:</span>
									<span className="text-white">{config.environment.planetRadius}km</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Gravity:</span>
									<span className="text-white">{config.environment.gravity.toFixed(1)}m/s²</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Atmosphere:</span>
									<span className="text-white">{config.environment.atmosphere ? "Yes" : "No"}</span>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Weather:</span>
									<span className="text-white">{config.environment.weatherType}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Vegetation:</span>
									<span className="text-white">{config.environment.enableVegetation ? "Yes" : "No"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Time:</span>
									<span className="text-white">{config.environment.timeOfDay.toFixed(1)}h</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Wind:</span>
									<span className="text-white">{(config.environment.windStrength * 100).toFixed(0)}%</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Player Configuration */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-green-400 font-medium">
						<Gamepad2 className="w-4 h-4" />
						<span>Player Configuration</span>
					</div>

					<div className="pl-6 space-y-2">
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Walk Speed:</span>
									<span className="text-white">{config.player.walkSpeed.toFixed(1)}m/s</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Run Speed:</span>
									<span className="text-white">{config.player.runSpeed.toFixed(1)}m/s</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Jump Height:</span>
									<span className="text-white">{config.player.jumpHeight.toFixed(1)}m</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">FOV:</span>
									<span className="text-white">{config.player.fov}°</span>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Mouse Sens:</span>
									<span className="text-white">{config.player.mouseSensitivity.toFixed(1)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Height:</span>
									<span className="text-white">{config.player.playerHeight.toFixed(1)}m</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">View Bob:</span>
									<span className="text-white">{config.player.viewBobbing ? "On" : "Off"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Breathing:</span>
									<span className="text-white">{config.player.breathingEffect ? "On" : "Off"}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Graphics Settings */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-green-400 font-medium">
						<Zap className="w-4 h-4" />
						<span>Graphics Configuration</span>
					</div>

					<div className="pl-6 space-y-2">
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Render Dist:</span>
									<span className="text-white">{config.gameplay.renderDistance}m</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">LOD Levels:</span>
									<span className="text-white">{config.gameplay.lodLevels}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Shadows:</span>
									<span className="text-white capitalize">{config.gameplay.shadowQuality}</span>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Textures:</span>
									<span className="text-white capitalize">{config.gameplay.textureQuality}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Crosshair:</span>
									<span className="text-white">{config.gameplay.showCrosshair ? "On" : "Off"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Minimap:</span>
									<span className="text-white">{config.gameplay.showMinimap ? "On" : "Off"}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Technical Specifications */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-green-400 font-medium">
						<Cpu className="w-4 h-4" />
						<span>Technical Specs</span>
					</div>

					<div className="pl-6 space-y-2">
						<div className="p-3 bg-slate-800/50 rounded border border-green-400/20 text-sm">
							<div className="grid grid-cols-2 gap-2">
								<div className="space-y-1">
									<div className="text-slate-400">Engine:</div>
									<div className="text-white">Three.js + R3F</div>

									<div className="text-slate-400 mt-2">Physics:</div>
									<div className="text-white">Custom Controller</div>
								</div>
								<div className="space-y-1">
									<div className="text-slate-400">Terrain:</div>
									<div className="text-white">Procedural LOD</div>

									<div className="text-slate-400 mt-2">Audio:</div>
									<div className="text-white">3D Spatial</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-green-400 font-medium">
						<Eye className="w-4 h-4" />
						<span>Available Features</span>
					</div>

					<div className="pl-6 space-y-2">
						<div className="grid grid-cols-1 gap-1 text-sm">
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${config.gameplay.enableScanning ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Environmental Scanning</span>
							</div>
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${config.gameplay.enableSampling ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Resource Sampling</span>
							</div>
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${config.environment.ambientSounds ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Ambient Audio</span>
							</div>
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${config.environment.weatherEnabled ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Dynamic Weather</span>
							</div>
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${config.player.viewBobbing ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Realistic Camera Movement</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-green-400" />
								<span className="text-slate-300">Physics-Based Movement</span>
							</div>
						</div>
					</div>
				</div>

				{/* Help */}
				<div className="space-y-3">
					<div className="p-3 bg-blue-900/20 border border-blue-400/30 rounded">
						<h4 className="font-medium text-blue-300 mb-2">💡 Tips</h4>
						<ul className="text-sm text-slate-300 space-y-1">
							<li>• Hold Shift to run (consumes stamina)</li>
							<li>• Use mouse wheel to adjust movement speed</li>
							<li>• F key for environmental scanning</li>
							<li>• Tab to access in-game menu</li>
							<li>• Adjust FOV for comfort and performance</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
