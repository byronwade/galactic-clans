/**
 * @file PlanetInfoCard3D.tsx
 * @description Immersive 3D planet information card for hover interactions
 * @version 2.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { PlanetTypeDefinition } from "@/shared/procgen/planet/planet-types";
import { Thermometer, Droplets, Wind, Mountain, Gauge, Globe, Atom, TreePine, Zap } from "lucide-react";

// Simple Badge component for 3D UI
const Badge = ({ children, variant = "default", className = "", ...props }: any) => (
	<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variant === "outline" ? "border border-current bg-transparent" : "bg-gray-800 text-gray-200"} ${className}`} {...props}>
		{children}
	</span>
);

interface PlanetInfoCard3DProps {
	planetType: PlanetTypeDefinition;
	position: [number, number, number];
	visible: boolean;
	onEnter?: () => void;
	onExit?: () => void;
	planetConfig?: {
		radius: number;
		treeCount?: number;
		enableVegetation?: boolean;
	};
}

export function PlanetInfoCard3D({ planetType, position, visible, onEnter, onExit, planetConfig }: PlanetInfoCard3DProps) {
	const groupRef = useRef<THREE.Group>(null);
	const htmlRef = useRef<any>(null);
	const [isHovered, setIsHovered] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [opacity, setOpacity] = useState(0);
	const [scale, setScale] = useState(0.8);
	const [offset, setOffset] = useState<[number, number, number]>([0, 0, 0]);
	const { camera, size } = useThree();

	// Debounced hover state to prevent flickering
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [debouncedHover, setDebouncedHover] = useState(false);

	// Generate atmospheric analysis
	const getAtmosphericData = useCallback(() => {
		const composition = planetType.atmosphereComposition.slice(0, 3);
		return composition.map((gas, index) => ({
			gas,
			percentage: index === 0 ? 60 + Math.random() * 20 : 10 + Math.random() * 15,
		}));
	}, [planetType.atmosphereComposition]);

	// Get threat assessment color
	const getThreatColor = useCallback(() => {
		const danger = planetType.dangerLevel;
		if (danger <= 3) return "text-green-400";
		if (danger <= 6) return "text-yellow-400";
		return "text-red-400";
	}, [planetType.dangerLevel]);

	// Get habitability assessment
	const getHabitabilityStatus = useCallback(() => {
		const score = planetType.baseHabitability.overallScore;
		if (score >= 80) return { status: "OPTIMAL", color: "text-green-400", icon: "🌍" };
		if (score >= 60) return { status: "HABITABLE", color: "text-blue-400", icon: "🌎" };
		if (score >= 40) return { status: "MARGINAL", color: "text-yellow-400", icon: "🌕" };
		return { status: "HOSTILE", color: "text-red-400", icon: "☠️" };
	}, [planetType.baseHabitability.overallScore]);

	// Calculate smart positioning based on camera and screen space
	const calculateSmartPosition = useCallback(() => {
		if (!groupRef.current) return [0, 0, 0];

		const planetPosition = new THREE.Vector3(...position);
		const cameraPosition = camera.position;
		const direction = new THREE.Vector3().subVectors(cameraPosition, planetPosition).normalize();

		// Calculate distance from camera
		const distance = cameraPosition.distanceTo(planetPosition);

		// Scale offset based on distance and planet radius
		const baseOffset = Math.max(planetConfig?.radius || 1, 2);
		const scaledOffset = baseOffset * (1 + distance * 0.1);

		// Calculate screen space position
		const screenPosition = planetPosition.clone().project(camera);

		// Determine offset direction based on screen position
		let offsetX = 0,
			offsetY = 0,
			offsetZ = 0;

		if (screenPosition.x > 0.3) {
			// Planet is on the right side, show card to the left
			offsetX = -scaledOffset;
		} else if (screenPosition.x < -0.3) {
			// Planet is on the left side, show card to the right
			offsetX = scaledOffset;
		} else {
			// Planet is in center, show card to the right
			offsetX = scaledOffset;
		}

		if (screenPosition.y > 0.2) {
			// Planet is in upper half, show card below
			offsetY = -scaledOffset * 0.5;
		} else {
			// Planet is in lower half, show card above
			offsetY = scaledOffset * 0.5;
		}

		// Add some forward offset to prevent z-fighting
		offsetZ = scaledOffset * 0.2;

		return [offsetX, offsetY, offsetZ] as [number, number, number];
	}, [position, camera, planetConfig?.radius]);

	// Handle hover with debouncing
	const handlePointerEnter = useCallback(() => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}

		setDebouncedHover(true);
		setIsHovered(true);
		onEnter?.();
	}, [onEnter]);

	const handlePointerLeave = useCallback(() => {
		hoverTimeoutRef.current = setTimeout(() => {
			setDebouncedHover(false);
			setIsHovered(false);
			onExit?.();
		}, 150); // 150ms delay to prevent flickering
	}, [onExit]);

	// Update visibility based on hover and external visible prop
	useEffect(() => {
		const shouldBeVisible = visible && (isHovered || debouncedHover);
		setIsVisible(shouldBeVisible);
	}, [visible, isHovered, debouncedHover]);

	// Animation frame updates
	useFrame(() => {
		if (!groupRef.current) return;

		// Calculate smart positioning
		const smartOffset = calculateSmartPosition();
		setOffset(smartOffset as [number, number, number]);

		// Update group position with offset
		if (groupRef.current) {
			groupRef.current.position.set(position[0] + (smartOffset[0] ?? 0), position[1] + (smartOffset[1] ?? 0), position[2] + (smartOffset[2] ?? 0));
		}

		// Make card always face camera
		if (groupRef.current) {
			groupRef.current.lookAt(camera.position);
		}

		// Calculate scale based on distance
		const distance = groupRef.current ? camera.position.distanceTo(groupRef.current.position) : 1;
		const baseScale = 0.8;
		const distanceScale = Math.max(0.5, Math.min(1.5, 1 / (distance * 0.1)));
		const targetScale = baseScale * distanceScale;
		setScale(targetScale);

		// Smooth opacity animation
		const targetOpacity = isVisible ? 1 : 0;
		const currentOpacity = opacity;
		const newOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, 0.15);
		setOpacity(newOpacity);

		// Update HTML element
		if (htmlRef.current && htmlRef.current.style) {
			htmlRef.current.style.opacity = newOpacity.toString();
			htmlRef.current.style.transform = `scale(${scale})`;

			// Handle visibility for performance
			if (newOpacity < 0.01) {
				htmlRef.current.style.pointerEvents = "none";
			} else {
				htmlRef.current.style.pointerEvents = "auto";
			}
		}
	});

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);

	const atmosphericData = getAtmosphericData();
	const habitabilityStatus = getHabitabilityStatus();

	return (
		<group ref={groupRef} position={position} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
			<Html
				ref={htmlRef}
				center
				transform
				sprite
				style={{
					pointerEvents: isVisible ? "auto" : "none",
					transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
					opacity: 0,
					transform: `scale(${scale})`,
				}}
			>
				<div className="w-96 min-h-32 bg-slate-900/95 border border-cyan-400/50 text-white backdrop-blur-xl shadow-2xl rounded-lg p-4 relative">
					{/* Holographic glow effect */}
					<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 rounded-lg pointer-events-none" />
					<div className="absolute inset-0 border border-cyan-400/30 rounded-lg pointer-events-none" />

					<div className="relative z-10 space-y-4">
						{/* Planet Classification */}
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Globe className="w-4 h-4 text-cyan-400" />
								<span className="text-sm text-slate-300">Classification</span>
							</div>
							<Badge variant="outline" className="bg-cyan-500/20 border-cyan-400/50 text-cyan-300">
								{planetType.class.replace("_", " ").toUpperCase()}
							</Badge>
						</div>

						{/* Habitability Status */}
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<span className="text-xl">{habitabilityStatus.icon}</span>
								<span className="text-sm text-slate-300">Habitability</span>
							</div>
							<div className="flex items-center space-x-2">
								<span className={`text-sm font-bold ${habitabilityStatus.color}`}>{habitabilityStatus.status}</span>
								<span className="text-xs text-slate-400">({planetType.baseHabitability.overallScore}%)</span>
							</div>
						</div>

						{/* Physical Properties */}
						<div className="grid grid-cols-2 gap-3 py-2 border-t border-slate-700/50">
							<div className="space-y-2">
								<div className="flex items-center space-x-2">
									<Gauge className="w-3 h-3 text-blue-400" />
									<span className="text-xs text-slate-400">Mass Range</span>
								</div>
								<span className="text-sm text-white font-mono">
									{planetType.massRange[0]}-{planetType.massRange[1]} M⊕
								</span>
							</div>

							<div className="space-y-2">
								<div className="flex items-center space-x-2">
									<Mountain className="w-3 h-3 text-orange-400" />
									<span className="text-xs text-slate-400">Radius Range</span>
								</div>
								<span className="text-sm text-white font-mono">
									{planetType.radiusRange[0]}-{planetType.radiusRange[1]} R⊕
								</span>
							</div>
						</div>

						{/* Temperature Range */}
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Thermometer className="w-4 h-4 text-red-400" />
								<span className="text-sm text-slate-300">Temperature</span>
							</div>
							<span className="text-sm text-white font-mono">
								{planetType.temperatureRange[0]}-{planetType.temperatureRange[1]}K
							</span>
						</div>

						{/* Atmospheric Composition */}
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Wind className="w-4 h-4 text-purple-400" />
								<span className="text-sm text-slate-300">Atmosphere</span>
							</div>
							<div className="space-y-1">
								{atmosphericData.map((component, index) => (
									<div key={index} className="flex justify-between items-center">
										<span className="text-xs text-slate-400 capitalize">{component.gas.replace("_", " ")}</span>
										<span className="text-xs text-cyan-300 font-mono">{component.percentage.toFixed(1)}%</span>
									</div>
								))}
							</div>
						</div>

						{/* Resources & Features */}
						<div className="space-y-2 border-t border-slate-700/50 pt-3">
							<div className="flex items-center space-x-2">
								<Atom className="w-4 h-4 text-green-400" />
								<span className="text-sm text-slate-300">Key Features</span>
							</div>
							<div className="flex flex-wrap gap-1">
								{planetType.features.forests && (
									<Badge variant="outline" className="text-xs bg-green-500/20 border-green-400/50 text-green-300">
										<TreePine className="w-3 h-3 mr-1" />
										Forests
									</Badge>
								)}
								{planetType.features.oceans && (
									<Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-400/50 text-blue-300">
										<Droplets className="w-3 h-3 mr-1" />
										Oceans
									</Badge>
								)}
								{planetType.features.atmosphericGlow && (
									<Badge variant="outline" className="text-xs bg-purple-500/20 border-purple-400/50 text-purple-300">
										<Zap className="w-3 h-3 mr-1" />
										Aurora
									</Badge>
								)}
							</div>
						</div>

						{/* Surface Details (if vegetation enabled) */}
						{planetConfig?.enableVegetation && planetConfig.treeCount && (
							<div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<TreePine className="w-4 h-4 text-green-400" />
										<span className="text-sm text-green-300 font-medium">Surface Vegetation</span>
									</div>
									<span className="text-xs text-green-400 font-mono">{planetConfig.treeCount.toLocaleString()} trees</span>
								</div>
								<p className="text-xs text-green-200 mt-1">Biome-specific flora detected. Biodiversity index: HIGH</p>
							</div>
						)}

						{/* Exploration Status */}
						<div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-3 mt-4">
							<div className="flex items-center justify-between">
								<span className="text-xs text-slate-400">Threat Level</span>
								<span className={`text-sm font-bold ${getThreatColor()}`}>{planetType.dangerLevel}/10</span>
							</div>
							<div className="flex items-center justify-between mt-1">
								<span className="text-xs text-slate-400">Scientific Value</span>
								<span className="text-sm text-cyan-400 font-bold">{planetType.scientificValue}/10</span>
							</div>
						</div>

						{/* Real World Example */}
						{planetType.realWorldExample && <div className="text-xs text-slate-500 italic border-t border-slate-700/30 pt-2">Similar to: {planetType.realWorldExample}</div>}
					</div>
				</div>
			</Html>
		</group>
	);
}
