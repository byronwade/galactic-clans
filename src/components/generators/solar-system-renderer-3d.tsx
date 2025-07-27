/**
 * @file solar-system-renderer-3d.tsx
 * @description 3D renderer for the Solar System Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import type { SolarSystemConfig } from "./solar-system-generator";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

// Animated Planet Component
function Planet({ position, size, color, speed }: { position: [number, number, number]; size: number; color: string; speed: number }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (meshRef.current) {
			meshRef.current.position.x = Math.cos(state.clock.elapsedTime * speed) * position[0];
			meshRef.current.position.z = Math.sin(state.clock.elapsedTime * speed) * position[0];
		}
	});

	return (
		<mesh ref={meshRef} position={position}>
			<sphereGeometry args={[size, 16, 16]} />
			<meshLambertMaterial color={color} />
		</mesh>
	);
}

// Solar System Scene Component
function SolarSystemScene({ config }: { config: SolarSystemConfig }) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.3} />
			<pointLight position={[0, 0, 0]} intensity={2} />

			{/* Sun */}
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[2, 32, 32]} />
				<meshLambertMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={0.8} />
			</mesh>

			{/* Planets */}
			<Planet position={[8, 0, 0]} size={0.3} color="#8c7853" speed={0.8} />
			<Planet position={[12, 0, 0]} size={0.5} color="#ffc649" speed={0.6} />
			<Planet position={[16, 0, 0]} size={0.6} color="#4f94cd" speed={0.4} />
			<Planet position={[20, 0, 0]} size={0.4} color="#cd5c5c" speed={0.3} />
			<Planet position={[28, 0, 0]} size={1.2} color="#d2691e" speed={0.2} />
			<Planet position={[36, 0, 0]} size={1.0} color="#fad5a5" speed={0.15} />

			{/* Background stars */}
			<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
		</>
	);
}

interface SolarSystemRenderer3DProps {
	config: SolarSystemConfig;
	isLoading: boolean;
	onLoadingChange: (loading: boolean) => void;
}

export function SolarSystemRenderer3D({ config, isLoading, onLoadingChange }: SolarSystemRenderer3DProps) {
	useEffect(() => {
		// Simulate loading when config changes
		onLoadingChange(true);
		const timer = setTimeout(() => {
			onLoadingChange(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, [config, onLoadingChange]);

	return (
		<div className="absolute inset-0 pt-16 w-full h-full">
			<div className="w-full h-full relative">
				<Canvas camera={{ position: [0, 10, 50], fov: 75 }} style={{ width: "100%", height: "100%" }}>
					<Suspense fallback={null}>
						<SolarSystemScene config={config} />
						<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={20} maxDistance={200} />
					</Suspense>
				</Canvas>
			</div>
		</div>
	);
} 