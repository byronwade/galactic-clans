/**
 * @file BackgroundPlanet.tsx
 * @description Simple background planet for the main menu
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// Simple rotating planet for background
function SimplePlanet() {
	const meshRef = React.useRef<THREE.Mesh>(null);

	React.useFrame((state) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.005;
		}
	});

	return (
		<mesh ref={meshRef}>
			<sphereGeometry args={[2, 32, 32]} />
			<meshStandardMaterial color="#4a7c59" roughness={0.8} metalness={0.2} />
		</mesh>
	);
}

export default function BackgroundPlanet() {
	return (
		<div className="w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 8], fov: 75 }}
				style={{
					width: "100%",
					height: "100%",
				}}
			>
				<Suspense fallback={null}>
					<ambientLight intensity={0.3} />
					<pointLight position={[10, 10, 10]} intensity={1} />
					<SimplePlanet />
					<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
					<OrbitControls enablePan={false} enableZoom={false} enableRotate={true} autoRotate autoRotateSpeed={0.5} />
				</Suspense>
			</Canvas>
		</div>
	);
}
