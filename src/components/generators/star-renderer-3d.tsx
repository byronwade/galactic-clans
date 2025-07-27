/**
 * @file star-renderer-3d.tsx
 * @description Full-screen 3D star renderer component
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// Star configuration interface
interface StarConfig {
	type: string;
	mass: number;
	temperature: number;
	luminosity: number;
	radius: number;
	age: number;
	evolutionStage: string;
	hasCompanion: boolean;
	companionType: string;
	companionDistance: number;
	metalicity: number;
	rotationPeriod: number;
	magneticField: number;
}

interface StarRenderer3DProps {
	config: StarConfig;
	isGenerating: boolean;
	onLoadingChange: (loading: boolean) => void;
	onGenerate: () => void;
}

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense } from "react";

// Star Scene Component
function StarScene({ config }: { config: StarConfig }) {
	const getStarColor = () => {
		if (config.temperature > 30000) return "#9bb0ff"; // O-type
		if (config.temperature > 10000) return "#aabfff"; // B-type
		if (config.temperature > 7500) return "#cad7ff"; // A-type
		if (config.temperature > 6000) return "#f8f7ff"; // F-type
		if (config.temperature > 5200) return "#fff4ea"; // G-type
		if (config.temperature > 3700) return "#ffd2a1"; // K-type
		return "#ffad51"; // M-type
	};

	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.3} />

			{/* Main Star */}
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[config.radius, 32, 32]} />
				<meshLambertMaterial color={getStarColor()} emissive={getStarColor()} emissiveIntensity={0.6} />
			</mesh>

			{/* Companion Star (if binary) */}
			{config.hasCompanion && (
				<mesh position={[config.companionDistance, 0, 0]}>
					<sphereGeometry args={[config.radius * 0.7, 32, 32]} />
					<meshLambertMaterial color="#ff8c00" emissive="#ff6600" emissiveIntensity={0.5} />
				</mesh>
			)}

			{/* Habitable Zone Ring */}
			<mesh rotation={[Math.PI / 2, 0, 0]}>
				<ringGeometry args={[config.radius * 3, config.radius * 5, 64]} />
				<meshBasicMaterial color="#00ff88" transparent opacity={0.2} side={2} />
			</mesh>

			{/* Background stars */}
			<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
		</>
	);
}

export function StarRenderer3D({ config, isGenerating, onLoadingChange, onGenerate }: StarRenderer3DProps) {
	const mountRef = useRef<HTMLDivElement>(null);

	return (
		<div className="absolute inset-0 pt-16 w-full h-full">
			<div ref={mountRef} className="w-full h-full relative">
				<Canvas camera={{ position: [0, 0, 20], fov: 75 }} style={{ width: "100%", height: "100%" }}>
					<Suspense fallback={null}>
						<StarScene config={config} />
						<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={50} />
					</Suspense>
				</Canvas>
			</div>
		</div>
	);
}
