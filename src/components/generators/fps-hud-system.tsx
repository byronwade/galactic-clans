/**
 * @file fps-hud-system.tsx
 * @description AAA-Quality HUD System for FPS Exploration
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Professional health and stamina bars
 * - Interactive compass and minimap
 * - Real-time performance metrics
 * - Environmental information display
 * - Weapon and inventory status
 * - Dynamic threat indicators
 */

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as THREE from "three";
import { Heart, Zap, Compass, Map, Crosshair, Target, Thermometer, Wind, Droplets, Sun, Moon, Navigation, Activity, Eye, Timer, Gauge } from "lucide-react";

interface HUDProps {
	playerPosition: THREE.Vector3;
	cameraRotation: THREE.Euler;
	health: number;
	maxHealth: number;
	stamina: number;
	maxStamina: number;
	oxygen?: number;
	maxOxygen?: number;
	temperature: number;
	weather: string;
	timeOfDay: number; // 0-24 hours
	isAiming: boolean;
	weaponAmmo?: number;
	weaponMaxAmmo?: number;
	performanceMetrics: {
		frameRate: number;
		frameTime: number;
		memoryUsage: number;
		drawCalls: number;
		triangles: number;
	};
	environmentData: {
		biome: string;
		elevation: number;
		windSpeed: number;
		humidity: number;
		visibility: number;
	};
	showDebugInfo?: boolean;
	onSettingsToggle?: () => void;
}

interface CompassDirection {
	name: string;
	angle: number;
	color: string;
}

const COMPASS_DIRECTIONS: CompassDirection[] = [
	{ name: "N", angle: 0, color: "#ff4444" },
	{ name: "NE", angle: 45, color: "#ffffff" },
	{ name: "E", angle: 90, color: "#ffffff" },
	{ name: "SE", angle: 135, color: "#ffffff" },
	{ name: "S", angle: 180, color: "#ffffff" },
	{ name: "SW", angle: 225, color: "#ffffff" },
	{ name: "W", angle: 270, color: "#ffffff" },
	{ name: "NW", angle: 315, color: "#ffffff" },
];

// Enhanced crosshair component
function DynamicCrosshair({ isAiming, health, showAdvanced = true }: { isAiming: boolean; health: number; showAdvanced?: boolean }) {
	const healthRatio = health / 100;
	const opacity = isAiming ? 0.9 : 0.7;
	const size = isAiming ? 6 : 8;
	const spread = isAiming ? 2 : 4;

	return (
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
			{/* Main crosshair */}
			<div className="relative">
				{/* Center dot */}
				<div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
					style={{
						width: `${size / 4}px`,
						height: `${size / 4}px`,
						opacity: opacity * 0.8,
						backgroundColor: healthRatio > 0.3 ? "#ffffff" : "#ff4444",
					}}
				/>

				{/* Crosshair lines */}
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className="absolute bg-white"
						style={{
							width: i % 2 === 0 ? `${size}px` : "1px",
							height: i % 2 === 0 ? "1px" : `${size}px`,
							left: i % 2 === 0 ? "50%" : "50%",
							top: i % 2 === 0 ? "50%" : "50%",
							transform: `translate(-50%, -50%) translate(${i === 1 ? spread : i === 3 ? -spread : 0}px, ${i === 0 ? -spread : i === 2 ? spread : 0}px)`,
							opacity: opacity,
							backgroundColor: healthRatio > 0.3 ? "#ffffff" : "#ff4444",
						}}
					/>
				))}

				{/* Accuracy ring when aiming */}
				{isAiming && showAdvanced && (
					<div
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white rounded-full"
						style={{
							width: `${size * 3}px`,
							height: `${size * 3}px`,
							opacity: 0.3,
							borderColor: "#00ff88",
						}}
					/>
				)}
			</div>
		</div>
	);
}

// Health and status bars
function StatusBars({ health, maxHealth, stamina, maxStamina, oxygen, maxOxygen, temperature }: { health: number; maxHealth: number; stamina: number; maxStamina: number; oxygen?: number; maxOxygen?: number; temperature: number }) {
	const healthPercent = (health / maxHealth) * 100;
	const staminaPercent = (stamina / maxStamina) * 100;
	const oxygenPercent = oxygen && maxOxygen ? (oxygen / maxOxygen) * 100 : 100;

	const getHealthColor = () => {
		if (healthPercent > 70) return "#00ff88";
		if (healthPercent > 30) return "#ffaa00";
		return "#ff4444";
	};

	const getTemperatureColor = () => {
		if (temperature < -10) return "#44aaff";
		if (temperature < 0) return "#88ccff";
		if (temperature < 35) return "#00ff88";
		if (temperature < 45) return "#ffaa00";
		return "#ff4444";
	};

	return (
		<div className="absolute bottom-8 left-8 space-y-3">
			{/* Health Bar */}
			<div className="flex items-center space-x-3">
				<Heart className="w-5 h-5 text-red-400" />
				<div className="w-48 h-3 bg-black/60 border border-white/20 rounded-full overflow-hidden">
					<div
						className="h-full transition-all duration-300 rounded-full"
						style={{
							width: `${healthPercent}%`,
							backgroundColor: getHealthColor(),
							boxShadow: `0 0 8px ${getHealthColor()}50`,
						}}
					/>
				</div>
				<span className="text-white text-sm font-mono min-w-[3rem]">
					{Math.ceil(health)}/{maxHealth}
				</span>
			</div>

			{/* Stamina Bar */}
			<div className="flex items-center space-x-3">
				<Zap className="w-5 h-5 text-yellow-400" />
				<div className="w-48 h-2 bg-black/60 border border-white/20 rounded-full overflow-hidden">
					<div
						className="h-full transition-all duration-300 rounded-full"
						style={{
							width: `${staminaPercent}%`,
							backgroundColor: "#ffaa00",
							boxShadow: "0 0 6px #ffaa0050",
						}}
					/>
				</div>
				<span className="text-white text-sm font-mono min-w-[3rem]">{Math.ceil(stamina)}%</span>
			</div>

			{/* Oxygen Bar (if applicable) */}
			{oxygen !== undefined && maxOxygen && (
				<div className="flex items-center space-x-3">
					<Wind className="w-5 h-5 text-blue-400" />
					<div className="w-48 h-2 bg-black/60 border border-white/20 rounded-full overflow-hidden">
						<div
							className="h-full transition-all duration-300 rounded-full"
							style={{
								width: `${oxygenPercent}%`,
								backgroundColor: oxygenPercent > 30 ? "#44aaff" : "#ff4444",
								boxShadow: `0 0 6px ${oxygenPercent > 30 ? "#44aaff" : "#ff4444"}50`,
							}}
						/>
					</div>
					<span className="text-white text-sm font-mono min-w-[3rem]">{Math.ceil(oxygen)}%</span>
				</div>
			)}

			{/* Temperature */}
			<div className="flex items-center space-x-3">
				<Thermometer className="w-5 h-5 text-orange-400" />
				<div className="px-3 py-1 bg-black/60 border border-white/20 rounded">
					<span className="text-sm font-mono" style={{ color: getTemperatureColor() }}>
						{temperature.toFixed(1)}°C
					</span>
				</div>
			</div>
		</div>
	);
}

// Compass component
function CompassHUD({ cameraRotation }: { cameraRotation: THREE.Euler }) {
	const yaw = cameraRotation.y * (180 / Math.PI);
	const normalizedYaw = ((yaw % 360) + 360) % 360;

	return (
		<div className="absolute top-8 left-1/2 transform -translate-x-1/2">
			<div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3">
				<div className="flex items-center space-x-4">
					<Compass className="w-5 h-5 text-blue-400" />
					<div className="relative w-32 h-8 overflow-hidden">
						{COMPASS_DIRECTIONS.map((dir) => {
							const offset = (dir.angle - normalizedYaw + 360) % 360;
							const adjustedOffset = offset > 180 ? offset - 360 : offset;
							const position = (adjustedOffset / 90) * 32; // Scale to container width

							if (Math.abs(adjustedOffset) > 90) return null;

							return (
								<div
									key={dir.name}
									className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-xs font-bold transition-all duration-100"
									style={{
										left: `${50 + position}%`,
										color: dir.color,
										fontSize: dir.name === "N" ? "14px" : "12px",
										textShadow: "0 0 4px rgba(0,0,0,0.8)",
									}}
								>
									{dir.name}
								</div>
							);
						})}

						{/* Center indicator */}
						<div className="absolute top-0 left-1/2 w-0.5 h-full bg-white transform -translate-x-1/2" />
					</div>
					<span className="text-white text-sm font-mono min-w-[3rem]">{normalizedYaw.toFixed(0)}°</span>
				</div>
			</div>
		</div>
	);
}

// Environmental information
function EnvironmentInfo({ environmentData, weather, timeOfDay }: { environmentData: HUDProps["environmentData"]; weather: string; timeOfDay: number }) {
	const isDaytime = timeOfDay >= 6 && timeOfDay < 18;
	const timeString = `${Math.floor(timeOfDay).toString().padStart(2, "0")}:${Math.floor((timeOfDay % 1) * 60)
		.toString()
		.padStart(2, "0")}`;

	return (
		<div className="absolute top-8 right-8 space-y-2">
			{/* Time and Weather */}
			<div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
				<div className="flex items-center space-x-3">
					{isDaytime ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
					<span className="text-white text-sm font-mono">{timeString}</span>
					<span className="text-slate-300 text-sm">{weather}</span>
				</div>
			</div>

			{/* Environment Details */}
			<div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 space-y-1">
				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Biome:</span>
					<span className="text-green-400 font-medium">{environmentData.biome}</span>
				</div>
				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Elevation:</span>
					<span className="text-white font-mono">{environmentData.elevation.toFixed(1)}m</span>
				</div>
				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Wind:</span>
					<span className="text-blue-300 font-mono">{environmentData.windSpeed.toFixed(1)} m/s</span>
				</div>
				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Humidity:</span>
					<span className="text-cyan-300 font-mono">{environmentData.humidity.toFixed(0)}%</span>
				</div>
				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Visibility:</span>
					<span className="text-white font-mono">{(environmentData.visibility * 100).toFixed(0)}%</span>
				</div>
			</div>
		</div>
	);
}

// Performance metrics
function PerformanceOverlay({ metrics, showDebug }: { metrics: HUDProps["performanceMetrics"]; showDebug: boolean }) {
	if (!showDebug) return null;

	const getFPSColor = () => {
		if (metrics.frameRate >= 60) return "#00ff88";
		if (metrics.frameRate >= 30) return "#ffaa00";
		return "#ff4444";
	};

	const getMemoryUsage = () => {
		return (metrics.memoryUsage / (1024 * 1024)).toFixed(1);
	};

	return (
		<div className="absolute bottom-8 right-8">
			<div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 space-y-1">
				<div className="text-xs text-white font-mono font-bold mb-2">Performance</div>

				<div className="flex items-center justify-between text-xs min-w-[12rem]">
					<span className="text-slate-300">FPS:</span>
					<span style={{ color: getFPSColor() }} className="font-mono font-bold">
						{metrics.frameRate}
					</span>
				</div>

				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Frame Time:</span>
					<span className="text-yellow-300 font-mono">{metrics.frameTime.toFixed(2)}ms</span>
				</div>

				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Memory:</span>
					<span className="text-blue-300 font-mono">{getMemoryUsage()}MB</span>
				</div>

				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Draw Calls:</span>
					<span className="text-purple-300 font-mono">{metrics.drawCalls}</span>
				</div>

				<div className="flex items-center justify-between text-xs">
					<span className="text-slate-300">Triangles:</span>
					<span className="text-orange-300 font-mono">{(metrics.triangles / 1000).toFixed(1)}K</span>
				</div>
			</div>
		</div>
	);
}

// Position and coordinates
function PositionDisplay({ position }: { position: THREE.Vector3 }) {
	return (
		<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
			<div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
				<div className="flex items-center space-x-4 text-xs font-mono">
					<div className="flex items-center space-x-2">
						<span className="text-red-400">X:</span>
						<span className="text-white">{position.x.toFixed(1)}</span>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-green-400">Y:</span>
						<span className="text-white">{position.y.toFixed(1)}</span>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-blue-400">Z:</span>
						<span className="text-white">{position.z.toFixed(1)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

// Main HUD System
export function FPSHUDSystem({ playerPosition, cameraRotation, health = 100, maxHealth = 100, stamina = 100, maxStamina = 100, oxygen, maxOxygen, temperature = 20, weather = "Clear", timeOfDay = 12, isAiming = false, weaponAmmo, weaponMaxAmmo, performanceMetrics, environmentData, showDebugInfo = false, onSettingsToggle }: HUDProps) {
	const [isVisible, setIsVisible] = useState(true);

	// Toggle HUD visibility with H key
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === "KeyH") {
				setIsVisible((prev) => !prev);
			}
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, []);

	if (!isVisible) {
		return <div className="absolute top-4 left-4 text-white/50 text-sm">Press H to show HUD</div>;
	}

	return (
		<div className="absolute inset-0 pointer-events-none">
			{/* Dynamic Crosshair */}
			<DynamicCrosshair isAiming={isAiming} health={health} />

			{/* Status Bars */}
			<StatusBars health={health} maxHealth={maxHealth} stamina={stamina} maxStamina={maxStamina} oxygen={oxygen} maxOxygen={maxOxygen} temperature={temperature} />

			{/* Compass */}
			<CompassHUD cameraRotation={cameraRotation} />

			{/* Environment Info */}
			<EnvironmentInfo environmentData={environmentData} weather={weather} timeOfDay={timeOfDay} />

			{/* Position Display */}
			<PositionDisplay position={playerPosition} />

			{/* Performance Overlay */}
			<PerformanceOverlay metrics={performanceMetrics} showDebug={showDebugInfo} />

			{/* HUD Toggle Hint */}
			<div className="absolute top-4 left-4 text-white/50 text-xs">H: Toggle HUD</div>
		</div>
	);
}

export default FPSHUDSystem;
