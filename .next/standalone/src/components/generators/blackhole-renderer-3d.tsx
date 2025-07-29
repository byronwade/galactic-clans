/**
 * @file blackhole-renderer-3d.tsx
 * @description 3D renderer for the Black Hole Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { BlackHoleConfig } from "./blackhole-generator";

// Black Hole 3D Scene Component
function BlackHoleScene({ config }: { config: BlackHoleConfig }) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.1} />
			<pointLight position={[10, 10, 10]} intensity={0.5} />
			
			{/* Black Hole Sphere (Event Horizon) */}
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[2, 32, 32]} />
				<meshBasicMaterial color="#000000" />
			</mesh>
			
			{/* Accretion Disk */}
			<mesh rotation={[Math.PI / 2, 0, 0]}>
				<ringGeometry args={[3, 8, 64]} />
				<meshLambertMaterial 
					color="#ff6600" 
					transparent 
					opacity={0.7}
					emissive="#ff3300"
					emissiveIntensity={0.3}
				/>
			</mesh>
			
			{/* Relativistic Jets */}
			<mesh position={[0, 15, 0]}>
				<cylinderGeometry args={[0.2, 0.5, 20, 16]} />
				<meshLambertMaterial 
					color="#00ffff" 
					transparent 
					opacity={0.8}
					emissive="#0088ff"
					emissiveIntensity={0.5}
				/>
			</mesh>
			<mesh position={[0, -15, 0]}>
				<cylinderGeometry args={[0.2, 0.5, 20, 16]} />
				<meshLambertMaterial 
					color="#00ffff" 
					transparent 
					opacity={0.8}
					emissive="#0088ff"
					emissiveIntensity={0.5}
				/>
			</mesh>
		</>
	);
}

interface BlackHoleRenderer3DProps {
	config: BlackHoleConfig;
	onGenerate: () => void;
	onClear: () => void;
	isGenerating: boolean;
}

export function BlackHoleRenderer3D({ config, onGenerate, onClear, isGenerating }: BlackHoleRenderer3DProps) {
	return (
		<div className="absolute inset-0 pt-16 w-full h-full">
			<div className="w-full h-full relative">
				<Canvas camera={{ position: [0, 0, 20], fov: 75 }} style={{ width: "100%", height: "100%" }}>
					<Suspense fallback={null}>
						<BlackHoleScene config={config} />
						<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={50} />
					</Suspense>
				</Canvas>
			</div>
		</div>
	);
} 