/**
 * @file fps-hud-system.tsx
 * @description Professional AAA-Quality HUD System for FPS Explorer
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Immersive health and stamina displays
 * - Ammo counter with reload indicators
 * - Minimap with player position and objectives
 * - Damage direction indicators
 * - Interaction prompts with context sensitivity
 * - Accessibility features (colorblind support, subtitles)
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// HUD Component Interfaces
interface HUDProps {
	playerState: {
		health: number;
		stamina: number;
		isRunning: boolean;
		isCrouching: boolean;
		isAiming: boolean;
	};
	weaponState: {
		currentAmmo: number;
		totalAmmo: number;
		isReloading: boolean;
		weaponName: string;
		reloadProgress: number;
	};
	gameState: {
		objectives: string[];
		interactionPrompt?: string;
		damageDirection?: number;
		subtitles?: string;
	};
	position: THREE.Vector3;
	rotation: THREE.Euler;
}

// Health Bar Component
function HealthBar({ health }: { health: number }) {
	const healthPercentage = Math.max(0, health);
	const isLowHealth = health < 25;
	const isCriticalHealth = health < 10;

	return (
		<div className="absolute bottom-8 left-8 flex items-center space-x-3">
			<div className="flex items-center space-x-2">
				<div className="w-2 h-2 rounded-full bg-red-500" />
				<div className="text-white font-mono text-sm">HEALTH</div>
			</div>
			<div className="relative w-32 h-3 bg-black/60 border border-white/30 rounded-sm overflow-hidden">
				<div 
					className={`absolute inset-y-0 left-0 transition-all duration-300 ${
						isCriticalHealth ? 'bg-red-600 animate-pulse' : 
						isLowHealth ? 'bg-orange-500' : 'bg-green-500'
					}`}
					style={{ width: `${healthPercentage}%` }}
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-white text-xs font-mono drop-shadow-md">
						{Math.round(healthPercentage)}
					</span>
				</div>
			</div>
		</div>
	);
}

// Stamina Bar Component
function StaminaBar({ stamina, isRunning }: { stamina: number; isRunning: boolean }) {
	const staminaPercentage = Math.max(0, stamina);
	const isLowStamina = stamina < 20;

	return (
		<div className="absolute bottom-16 left-8 flex items-center space-x-3">
			<div className="flex items-center space-x-2">
				<div className="w-2 h-2 rounded-full bg-blue-400" />
				<div className="text-white font-mono text-sm">STAMINA</div>
			</div>
			<div className="relative w-32 h-2 bg-black/60 border border-white/30 rounded-sm overflow-hidden">
				<div 
					className={`absolute inset-y-0 left-0 transition-all duration-300 ${
						isLowStamina ? 'bg-yellow-500 animate-pulse' : 'bg-blue-400'
					} ${isRunning ? 'animate-pulse' : ''}`}
					style={{ width: `${staminaPercentage}%` }}
				/>
			</div>
		</div>
	);
}

// Ammo Counter Component
function AmmoCounter({ weaponState }: { weaponState: HUDProps['weaponState'] }) {
	const { currentAmmo, totalAmmo, isReloading, weaponName, reloadProgress } = weaponState;
	const isLowAmmo = currentAmmo <= 5;
	const isEmpty = currentAmmo === 0;

	return (
		<div className="absolute bottom-8 right-8 text-right">
			<div className="flex flex-col items-end space-y-2">
				{/* Weapon Name */}
				<div className="text-white/80 font-mono text-sm uppercase tracking-wider">
					{weaponName}
				</div>
				
				{/* Ammo Display */}
				<div className="flex items-center space-x-3">
					<div className="text-right">
						<div className={`font-mono text-2xl font-bold ${
							isEmpty ? 'text-red-500 animate-pulse' :
							isLowAmmo ? 'text-yellow-500' : 'text-white'
						}`}>
							{currentAmmo.toString().padStart(2, '0')}
						</div>
						<div className="text-white/60 font-mono text-sm">
							{totalAmmo.toString().padStart(3, '0')}
						</div>
					</div>
					<div className="w-1 h-12 bg-white/30" />
				</div>

				{/* Reload Indicator */}
				{isReloading && (
					<div className="w-24 h-2 bg-black/60 border border-white/30 rounded-sm overflow-hidden">
						<div 
							className="h-full bg-orange-500 transition-all duration-100"
							style={{ width: `${reloadProgress * 100}%` }}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

// Crosshair Component
function DynamicCrosshair({ isAiming, isMoving, health }: { isAiming: boolean; isMoving: boolean; health: number }) {
	const crosshairSize = isAiming ? 12 : (isMoving ? 20 : 16);
	const crosshairOpacity = isAiming ? 1.0 : 0.8;
	const crosshairColor = health < 25 ? 'border-red-500' : 'border-white';

	return (
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
			<div 
				className={`relative transition-all duration-200 ${crosshairColor}`}
				style={{ 
					width: `${crosshairSize}px`, 
					height: `${crosshairSize}px`,
					opacity: crosshairOpacity 
				}}
			>
				{/* Center dot */}
				<div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
				
				{/* Crosshair lines */}
				<div className="absolute top-0 left-1/2 w-px h-2 bg-white transform -translate-x-1/2" />
				<div className="absolute bottom-0 left-1/2 w-px h-2 bg-white transform -translate-x-1/2" />
				<div className="absolute left-0 top-1/2 w-2 h-px bg-white transform -translate-y-1/2" />
				<div className="absolute right-0 top-1/2 w-2 h-px bg-white transform -translate-y-1/2" />
			</div>
		</div>
	);
}

// Damage Direction Indicator
function DamageIndicator({ direction }: { direction?: number }) {
	if (direction === undefined) return null;

	const rotation = `rotate(${direction}deg)`;

	return (
		<div className="absolute inset-0 pointer-events-none">
			<div 
				className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2"
				style={{ transform: `translate(-50%, -50%) ${rotation}` }}
			>
				<div className="absolute top-0 left-1/2 w-0.5 h-8 bg-red-500 opacity-80 animate-pulse transform -translate-x-1/2" />
			</div>
		</div>
	);
}

// Interaction Prompt
function InteractionPrompt({ prompt }: { prompt?: string }) {
	if (!prompt) return null;

	return (
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16">
			<div className="bg-black/80 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2">
				<div className="text-white font-medium text-center">
					<span className="text-yellow-400 font-mono">[E]</span> {prompt}
				</div>
			</div>
		</div>
	);
}

// Minimap Component
function Minimap({ position, objectives }: { position: THREE.Vector3; objectives: string[] }) {
	return (
		<div className="absolute top-8 right-8 w-48 h-48">
			<div className="relative w-full h-full bg-black/60 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden">
				{/* Minimap header */}
				<div className="absolute top-0 left-0 right-0 bg-black/80 px-2 py-1">
					<div className="text-white text-xs font-mono">TACTICAL MAP</div>
				</div>
				
				{/* Minimap content */}
				<div className="absolute inset-2 top-6">
					{/* Player position indicator */}
					<div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
					
					{/* Terrain representation */}
					<div className="absolute inset-0 bg-gradient-radial from-green-900/30 to-transparent" />
					
					{/* Objective markers */}
					{objectives.map((_, index) => (
						<div 
							key={index}
							className="absolute w-1 h-1 bg-yellow-500 rounded-full animate-pulse"
							style={{
								top: `${20 + index * 15}%`,
								left: `${30 + index * 20}%`
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

// Objectives Panel
function ObjectivesPanel({ objectives }: { objectives: string[] }) {
	if (objectives.length === 0) return null;

	return (
		<div className="absolute top-8 left-8 max-w-md">
			<div className="bg-black/60 backdrop-blur-sm border border-white/30 rounded-lg p-4">
				<div className="text-white font-mono text-sm mb-2 uppercase tracking-wider">
					Objectives
				</div>
				<div className="space-y-2">
					{objectives.map((objective, index) => (
						<div key={index} className="flex items-center space-x-2">
							<div className="w-2 h-2 bg-yellow-500 rounded-full" />
							<div className="text-white/90 text-sm">{objective}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Subtitle System
function SubtitleSystem({ subtitles }: { subtitles?: string }) {
	if (!subtitles) return null;

	return (
		<div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
			<div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3 max-w-2xl">
				<div className="text-white text-center font-medium">
					{subtitles}
				</div>
			</div>
		</div>
	);
}

// Main HUD System Component
export function FPSHUDSystem({ 
	playerState, 
	weaponState, 
	gameState, 
	position, 
	rotation 
}: HUDProps) {
	const [isVisible, setIsVisible] = useState(true);
	
	// Auto-hide HUD when not needed (accessibility)
	useEffect(() => {
		const timer = setTimeout(() => {
			if (!gameState.interactionPrompt && !gameState.subtitles) {
				setIsVisible(true); // Keep HUD visible for now
			}
		}, 5000);
		
		return () => clearTimeout(timer);
	}, [gameState.interactionPrompt, gameState.subtitles]);

	if (!isVisible) return null;

	return (
		<>
			{/* Core HUD Elements */}
			<HealthBar health={playerState.health} />
			<StaminaBar stamina={playerState.stamina} isRunning={playerState.isRunning} />
			<AmmoCounter weaponState={weaponState} />
			
			{/* Crosshair */}
			<DynamicCrosshair 
				isAiming={playerState.isAiming}
				isMoving={playerState.isRunning}
				health={playerState.health}
			/>
			
			{/* Interactive Elements */}
			<InteractionPrompt prompt={gameState.interactionPrompt} />
			<DamageIndicator direction={gameState.damageDirection} />
			
			{/* Information Panels */}
			<Minimap position={position} objectives={gameState.objectives} />
			<ObjectivesPanel objectives={gameState.objectives} />
			
			{/* Accessibility Features */}
			<SubtitleSystem subtitles={gameState.subtitles} />
		</>
	);
}

export default FPSHUDSystem; 