/**
 * @file galaxy-renderer-3d.tsx
 * @description Full-screen 3D galaxy renderer component
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// Galaxy configuration interface
interface GalaxyConfig {
	type: string;
	starCount: number;
	radius: number;
	arms: number;
	armSeparation: number;
	spin: number;
	randomness: number;
	power: number;
	insideColor: string;
	outsideColor: string;
	clusterness: number;
	spiralTightness: number;
	bulgeFactor: number;
	diskThickness: number;
}

interface GalaxyRenderer3DProps {
	config: GalaxyConfig;
	isGenerating: boolean;
	onLoadingChange: (loading: boolean) => void;
	onGenerate: () => void;
}

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense } from "react";

// Galaxy 3D Scene Component
function GalaxyScene({ config }: { config: GalaxyConfig }) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.2} />
			<pointLight position={[10, 10, 10]} intensity={0.5} />

			{/* Central Bulge */}
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[2, 32, 32]} />
				<meshLambertMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={0.3} />
			</mesh>

			{/* Galaxy Disk - simplified representation */}
			<mesh rotation={[Math.PI / 2, 0, 0]}>
				<ringGeometry args={[3, config.radius, 64]} />
				<meshLambertMaterial color={config.outsideColor} transparent opacity={0.6} emissive={config.insideColor} emissiveIntensity={0.2} />
			</mesh>

			{/* Background stars */}
			<Stars radius={100} depth={50} count={config.starCount / 10} factor={4} saturation={0} fade={true} />
		</>
	);
}

export function GalaxyRenderer3D({ config, isGenerating, onLoadingChange, onGenerate }: GalaxyRenderer3DProps) {
	const mountRef = useRef<HTMLDivElement>(null);

	return (
		<div className="absolute inset-0 pt-16 w-full h-full">
			<div ref={mountRef} className="w-full h-full relative">
				<Canvas camera={{ position: [0, 0, 30], fov: 75 }} style={{ width: "100%", height: "100%" }}>
					<Suspense fallback={null}>
						<GalaxyScene config={config} />
						<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={10} maxDistance={100} />
					</Suspense>
				</Canvas>
			</div>
		</div>
	);
}
