/**
 * @file planet-renderer-3d.tsx
 * @description Enhanced planet renderer with React Three Fiber and 3D UI
 * @version 2.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { PlanetClass, getPlanetTypeByClass } from "@/shared/procgen/planet/planet-types";
import { PlanetInfoCard3D } from "@/components/ui/PlanetInfoCard3D";
import { HolographicStyle } from "@/components/ui/Card3D";

interface SimplePlanetConfig {
	planetClass: PlanetClass;
	radius: number;
	color: string;
	hasRings: boolean;
	hasMoons: boolean;
	hasAtmosphere: boolean;
	// Surface Details (NEW)
	enableVegetation: boolean;
	treeCount: number;
	surfaceDetail: number;
}

interface PlanetRenderer3DProps {
	config: SimplePlanetConfig;
	isLoading: boolean;
	onLoadingChange: (loading: boolean) => void;
}

// Planet Mesh Component with hover interactions
function PlanetMesh({ config, onHover, onHoverExit }: { config: SimplePlanetConfig; onHover: (event: any) => void; onHoverExit: () => void }) {
	const meshRef = useRef<THREE.Group>(null);
	const [planetMesh, setPlanetMesh] = useState<THREE.Group | null>(null);

	// Generate planet using enhanced renderer
	useEffect(() => {
		const generatePlanet = async () => {
			try {
				// Import the enhanced planet renderer
				const { PlanetRenderer } = await import("@/shared/procgen/planet/planet-renderer");
				const renderer = new PlanetRenderer();

				// Convert simple config to enhanced config
				const enhancedConfig = {
					planetClass: config.planetClass,
					radius: config.radius,
					enableAtmosphere: config.hasAtmosphere,
					enableRings: config.hasRings,
					enableMoons: config.hasMoons,
					enableSurfaceDetails: config.enableVegetation,
					enableVegetation: config.enableVegetation,
					treeCount: config.treeCount,
					terrainDetail: config.surfaceDetail,
				};

				// Generate planet with enhanced renderer
				const result = await renderer.renderPlanetByType(config.planetClass, enhancedConfig);

				if (result && result.mesh) {
					setPlanetMesh(result.mesh);
					console.log("🌍 [PLANET] Generated with vegetation:", result.metadata);
				} else {
					// Fallback to basic generation
					console.warn("🌍 [PLANET] Using fallback generation");
					generateBasicPlanet();
				}
			} catch (error) {
				console.error("🌍 [PLANET] Error generating planet:", error);
				generateBasicPlanet();
			}
		};

		const generateBasicPlanet = () => {
			const planetGroup = new THREE.Group();

			// Main planet
			const geometry = new THREE.SphereGeometry(config.radius, 64, 64);
			const material = new THREE.MeshLambertMaterial({ color: config.color });
			const planet = new THREE.Mesh(geometry, material);
			planet.castShadow = true;
			planet.receiveShadow = true;
			planetGroup.add(planet);

			// Add atmosphere
			if (config.hasAtmosphere) {
				const atmosphereGeometry = new THREE.SphereGeometry(config.radius * 1.05, 32, 32);
				const atmosphereMaterial = new THREE.MeshBasicMaterial({
					color: 0x87ceeb,
					transparent: true,
					opacity: 0.2,
					side: THREE.BackSide,
				});
				const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
				planetGroup.add(atmosphere);
			}

			setPlanetMesh(planetGroup);
		};

		generatePlanet();
	}, [config]);

	// Add the planet mesh to the scene
	useEffect(() => {
		if (meshRef.current && planetMesh) {
			// Clear existing children
			while (meshRef.current.children.length > 0) {
				const child = meshRef.current.children[0];
				if (child) {
					meshRef.current.remove(child);
				}
			}
			// Add the new planet mesh
			meshRef.current.add(planetMesh);
		}
	}, [planetMesh]);

	// Rotation animation
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.005;
		}
	});

	return <group ref={meshRef} onPointerEnter={onHover} onPointerLeave={onHoverExit} />;
}

// Scene Component
function PlanetScene({ config }: { config: SimplePlanetConfig }) {
	const [isHovering, setIsHovering] = useState(false);
	const [hoverPosition, setHoverPosition] = useState<[number, number, number]>([0, 0, 0]);

	const handleHover = (event: any) => {
		setIsHovering(true);
		// Position the info card above the planet
		setHoverPosition([config.radius + 2, config.radius + 1, 0]);
	};

	const handleHoverExit = () => {
		setIsHovering(false);
	};

	// Get planet type for info card
	const planetType = getPlanetTypeByClass(config.planetClass);

	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.4} />
			<directionalLight position={[5, 5, 5]} intensity={1} castShadow />

			{/* Planet with hover interactions */}
			<PlanetMesh config={config} onHover={handleHover} onHoverExit={handleHoverExit} />

			{/* 3D Info Card - shows on hover */}
			{planetType && (
				<PlanetInfoCard3D
					planetType={planetType}
					position={hoverPosition}
					visible={isHovering}
					planetConfig={{
						radius: config.radius,
						treeCount: config.enableVegetation ? config.treeCount : undefined,
						enableVegetation: config.enableVegetation,
					}}
				/>
			)}

			{/* Background stars */}
			<Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade={true} />
		</>
	);
}

export function PlanetRenderer3D({ config, isLoading, onLoadingChange }: PlanetRenderer3DProps) {
	useEffect(() => {
		// Simulate loading
		onLoadingChange(true);
		const timer = setTimeout(() => {
			onLoadingChange(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, [config, onLoadingChange]);

	return (
		<div className="absolute inset-0 pt-16" style={{ position: "relative" }}>
			<HolographicStyle />
			<Canvas
				camera={{ position: [0, 0, 8], fov: 75 }}
				shadows
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
				}}
			>
				<Suspense fallback={null}>
					<PlanetScene config={config} />
					<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={20} />
				</Suspense>
			</Canvas>
		</div>
	);
}
