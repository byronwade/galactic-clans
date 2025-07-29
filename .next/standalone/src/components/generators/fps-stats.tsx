/**
 * @file fps-stats.tsx
 * @description FPS Explorer Statistics Panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Real-time monitoring of:
 * - Performance metrics (FPS, frame time, memory)
 * - Player statistics (position, velocity, stamina)
 * - Rendering statistics (draw calls, triangles)
 * - System health indicators
 */

"use client";

import React from "react";
import { Activity, Cpu, Eye, Zap, MapPin, Timer, Gauge } from "lucide-react";
import type { FPSConfig, FPSPerformanceMetrics } from "./fps-explorer-generator";

interface FPSStatsProps {
	config: FPSConfig;
	currentMode: { value: string; label: string; description: string };
	performanceMetrics: FPSPerformanceMetrics;
	isExploring: boolean;
}

export function FPSStats({ config, currentMode, performanceMetrics, isExploring }: FPSStatsProps) {
	// Performance indicator colors
	const getPerformanceColor = (value: number, good: number, bad: number) => {
		if (value >= good) return "text-green-400";
		if (value <= bad) return "text-red-400";
		return "text-yellow-400";
	};

	const getFPSColor = () => getPerformanceColor(performanceMetrics.frameRate, 55, 30);
	const getMemoryColor = () => getPerformanceColor(1000 - performanceMetrics.memoryUsage, 700, 300);
	const getCPUColor = () => getPerformanceColor(100 - performanceMetrics.cpuUsage, 60, 20);

	return (
		<div className="fixed bottom-4 right-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-2xl z-40">
			{/* Header */}
			<div className="p-3 border-b border-green-400/20 bg-gradient-to-r from-green-900/50 to-emerald-900/50">
				<div className="flex items-center gap-2">
					<Activity className="w-4 h-4 text-green-400" />
					<h3 className="font-semibold text-white text-sm">Performance Monitor</h3>
					<div className={`ml-auto w-2 h-2 rounded-full animate-pulse ${isExploring ? "bg-green-400" : "bg-slate-500"}`} />
				</div>
			</div>

			{/* Stats Content */}
			<div className="p-3 space-y-4">
				{/* Performance Metrics */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-green-400 font-medium text-sm">
						<Zap className="w-3 h-3" />
						<span>Performance</span>
					</div>

					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="space-y-1">
							<div className="flex justify-between">
								<span className="text-slate-400">FPS:</span>
								<span className={`font-mono ${getFPSColor()}`}>{performanceMetrics.frameRate.toFixed(1)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Frame Time:</span>
								<span className="text-white font-mono">{performanceMetrics.frameTime.toFixed(1)}ms</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Draw Calls:</span>
								<span className="text-white font-mono">{performanceMetrics.drawCalls}</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex justify-between">
								<span className="text-slate-400">Triangles:</span>
								<span className="text-white font-mono">{(performanceMetrics.triangles / 1000).toFixed(0)}k</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Memory:</span>
								<span className={`font-mono ${getMemoryColor()}`}>{performanceMetrics.memoryUsage.toFixed(0)}MB</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">CPU:</span>
								<span className={`font-mono ${getCPUColor()}`}>{performanceMetrics.cpuUsage.toFixed(0)}%</span>
							</div>
						</div>
					</div>

					{/* Performance Bars */}
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="text-xs text-slate-400 w-12">FPS</span>
							<div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
								<div className={`h-full transition-all duration-300 ${getFPSColor().replace("text-", "bg-")}`} style={{ width: `${Math.min(100, (performanceMetrics.frameRate / 60) * 100)}%` }} />
							</div>
							<span className="text-xs text-slate-400 w-8">60</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-xs text-slate-400 w-12">MEM</span>
							<div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
								<div className={`h-full transition-all duration-300 ${getMemoryColor().replace("text-", "bg-")}`} style={{ width: `${Math.min(100, (performanceMetrics.memoryUsage / 1000) * 100)}%` }} />
							</div>
							<span className="text-xs text-slate-400 w-8">1GB</span>
						</div>
					</div>
				</div>

				{/* Player Statistics */}
				{isExploring && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-green-400 font-medium text-sm">
							<MapPin className="w-3 h-3" />
							<span>Player Stats</span>
						</div>

						<div className="grid grid-cols-2 gap-3 text-xs">
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Position X:</span>
									<span className="text-white font-mono">0.0</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Position Y:</span>
									<span className="text-white font-mono">2.0</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Position Z:</span>
									<span className="text-white font-mono">0.0</span>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-slate-400">Velocity:</span>
									<span className="text-white font-mono">0.0 m/s</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Stamina:</span>
									<span className="text-green-400 font-mono">100%</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-400">Ground:</span>
									<span className="text-green-400 font-mono">Yes</span>
								</div>
							</div>
						</div>

						{/* Stamina Bar */}
						<div className="flex items-center gap-2">
							<span className="text-xs text-slate-400 w-12">STA</span>
							<div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
								<div className="h-full bg-green-400 transition-all duration-300" style={{ width: `${(config.player.stamina / 100) * 100}%` }} />
							</div>
							<span className="text-xs text-slate-400 w-8">100</span>
						</div>
					</div>
				)}

				{/* Rendering Statistics */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-green-400 font-medium text-sm">
						<Eye className="w-3 h-3" />
						<span>Rendering</span>
					</div>

					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="space-y-1">
							<div className="flex justify-between">
								<span className="text-slate-400">FOV:</span>
								<span className="text-white font-mono">{config.player.fov}°</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">LOD:</span>
								<span className="text-white font-mono">{config.gameplay.lodLevels}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Shadows:</span>
								<span className="text-white capitalize">{config.gameplay.shadowQuality.slice(0, 3)}</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex justify-between">
								<span className="text-slate-400">Render Dist:</span>
								<span className="text-white font-mono">{config.gameplay.renderDistance}m</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Textures:</span>
								<span className="text-white capitalize">{config.gameplay.textureQuality.slice(0, 3)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-400">Terrain:</span>
								<span className="text-white font-mono">{(config.environment.terrainDetail * 100).toFixed(0)}%</span>
							</div>
						</div>
					</div>
				</div>

				{/* System Health */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-green-400 font-medium text-sm">
						<Cpu className="w-3 h-3" />
						<span>System Health</span>
					</div>

					<div className="grid grid-cols-3 gap-2">
						<div className="text-center p-2 bg-slate-800/50 rounded border border-green-400/20">
							<div className={`text-lg font-mono ${getFPSColor()}`}>{performanceMetrics.frameRate.toFixed(0)}</div>
							<div className="text-xs text-slate-400">FPS</div>
						</div>
						<div className="text-center p-2 bg-slate-800/50 rounded border border-green-400/20">
							<div className={`text-lg font-mono ${getMemoryColor()}`}>{(performanceMetrics.memoryUsage / 1024).toFixed(1)}</div>
							<div className="text-xs text-slate-400">GB</div>
						</div>
						<div className="text-center p-2 bg-slate-800/50 rounded border border-green-400/20">
							<div className={`text-lg font-mono ${getCPUColor()}`}>{performanceMetrics.cpuUsage.toFixed(0)}</div>
							<div className="text-xs text-slate-400">CPU%</div>
						</div>
					</div>
				</div>

				{/* Current Mode Info */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-green-400 font-medium text-sm">
						<Gauge className="w-3 h-3" />
						<span>Mode</span>
					</div>

					<div className="p-2 bg-slate-800/50 rounded border border-green-400/20">
						<div className="text-xs">
							<div className="font-medium text-white">{currentMode?.label || "Unknown"}</div>
							<div className="text-slate-400 mt-1">{currentMode?.description || "No description"}</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				{isExploring && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-green-400 font-medium text-sm">
							<Timer className="w-3 h-3" />
							<span>Actions</span>
						</div>

						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="flex items-center gap-1">
								<div className={`w-2 h-2 rounded-full ${config.gameplay.showCrosshair ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Crosshair</span>
							</div>
							<div className="flex items-center gap-1">
								<div className={`w-2 h-2 rounded-full ${config.gameplay.showMinimap ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Minimap</span>
							</div>
							<div className="flex items-center gap-1">
								<div className={`w-2 h-2 rounded-full ${config.gameplay.enableScanning ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Scanner</span>
							</div>
							<div className="flex items-center gap-1">
								<div className={`w-2 h-2 rounded-full ${config.environment.ambientSounds ? "bg-green-400" : "bg-slate-600"}`} />
								<span className="text-slate-300">Audio</span>
							</div>
						</div>
					</div>
				)}

				{/* Performance Warning */}
				{(performanceMetrics.frameRate < 30 || performanceMetrics.memoryUsage > 800) && (
					<div className="p-2 bg-red-900/20 border border-red-400/30 rounded">
						<div className="text-xs text-red-300">
							⚠️ Performance Warning
							{performanceMetrics.frameRate < 30 && <div className="text-red-400">Low FPS detected</div>}
							{performanceMetrics.memoryUsage > 800 && <div className="text-red-400">High memory usage</div>}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
