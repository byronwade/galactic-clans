/**
 * @file planet-renderer-3d.tsx
 * @description Enhanced planet renderer with React Three Fiber, 3D UI, and surface zoom
 * @version 3.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { PlanetClass, getPlanetTypeByClass } from "@/shared/procgen/planet/planet-types";
import { PlanetInfoCard3D } from "@/components/ui/PlanetInfoCard3D";

interface SimplePlanetConfig {
	planetClass: PlanetClass;
	radius: number;
	color: string;
	hasRings: boolean;
	hasMoons: boolean;
	hasAtmosphere: boolean;
	// Surface Details
	enableVegetation: boolean;
	treeCount: number;
	surfaceDetail: number;
}

interface PlanetRenderer3DProps {
	config: SimplePlanetConfig;
	isLoading: boolean;
	onLoadingChange: (loading: boolean) => void;
}

// Enhanced Planet Mesh Component with zoom capabilities
function PlanetMesh({ config, onHover, onHoverExit, onSurfaceClick }: { config: SimplePlanetConfig; onHover: (event: any) => void; onHoverExit: () => void; onSurfaceClick: (event: any) => void }) {
	const meshRef = useRef<THREE.Group>(null);
	const [planetMesh, setPlanetMesh] = useState<THREE.Group | null>(null);

	console.log("🌍 [PLANET] PlanetMesh component rendered with config:", config);

	// Generate planet using enhanced renderer
	useEffect(() => {
		console.log("🌍 [PLANET] Starting planet generation with config:", config);

		const generatePlanet = async () => {
			try {
				// Import the enhanced planet renderer
				console.log("🌍 [PLANET] Importing enhanced renderer...");
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
					surfaceZoomLevel: 1.0, // Enable detailed surface rendering
				};

				console.log("🌍 [PLANET] Calling enhanced renderer with config:", enhancedConfig);

				// Generate planet with enhanced renderer
				const result = await renderer.renderPlanetByType(config.planetClass, enhancedConfig);

				if (result && result.mesh) {
					console.log("🌍 [PLANET] Enhanced generation successful!");
					setPlanetMesh(result.mesh);
					console.log("🌍 [PLANET] Generated with vegetation:", result.metadata);
				} else {
					// Fallback to basic generation
					console.warn("🌍 [PLANET] Enhanced generation failed, using fallback");
					generateBasicPlanet();
				}
			} catch (error) {
				console.error("🌍 [PLANET] Error generating planet:", error);
				console.warn("🌍 [PLANET] Using basic fallback generation");
				generateBasicPlanet();
			}
		};

		const generateBasicPlanet = () => {
			console.log("🌍 [PLANET] Generating basic planet...");
			const planetGroup = new THREE.Group();

			// Create a simple test cube first to verify Three.js is working
			const testGeometry = new THREE.BoxGeometry(1, 1, 1);
			const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
			const testCube = new THREE.Mesh(testGeometry, testMaterial);
			testCube.position.set(-3, 0, 0);
			planetGroup.add(testCube);

			// Main planet with enhanced detail
			const geometry = new THREE.SphereGeometry(config.radius, 64, 64); // Reduced detail for performance
			const material = new THREE.MeshLambertMaterial({
				color: config.color,
			});
			const planet = new THREE.Mesh(geometry, material);
			planet.castShadow = true;
			planet.receiveShadow = true;
			planetGroup.add(planet);

			// Add surface noise for detail
			const positions = geometry.attributes.position;
			if (positions) {
				for (let i = 0; i < positions.count; i++) {
					const vertex = new THREE.Vector3();
					vertex.fromBufferAttribute(positions, i);
					const noise = (Math.random() - 0.5) * 0.05 * config.surfaceDetail;
					vertex.normalize().multiplyScalar(config.radius + noise);
					positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
				}
				geometry.computeVertexNormals();
			}

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

			console.log("🌍 [PLANET] Basic planet generated successfully");
			setPlanetMesh(planetGroup);
		};

		// Always try basic generation first to ensure something shows up
		generateBasicPlanet();

		// Then try enhanced generation
		// generatePlanet();
	}, [config]);

	// Add the planet mesh to the scene
	useEffect(() => {
		console.log("🌍 [PLANET] Mesh effect triggered, meshRef:", !!meshRef.current, "planetMesh:", !!planetMesh);
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
			console.log("🌍 [PLANET] Planet mesh added to scene, children count:", meshRef.current.children.length);
		}
	}, [planetMesh]);

	// Rotation animation
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.005;
		}
	});

	return (
		<group ref={meshRef} onPointerEnter={onHover} onPointerLeave={onHoverExit} onClick={onSurfaceClick}>
			{/* Always render a simple sphere for hover detection */}
			<mesh visible={!planetMesh}>
				<sphereGeometry args={[config.radius, 32, 32]} />
				<meshLambertMaterial color={0x44aa44} wireframe={false} />
			</mesh>

			{/* Add invisible sphere for hover detection when planet mesh is present */}
			{planetMesh && (
				<mesh visible={false}>
					<sphereGeometry args={[config.radius, 32, 32]} />
					<meshBasicMaterial transparent opacity={0} />
				</mesh>
			)}
		</group>
	);
}

// Surface Zoom Controls Component
function SurfaceZoomControls({ isZoomed, onZoomToSurface, onZoomOut, config }: { isZoomed: boolean; onZoomToSurface: () => void; onZoomOut: () => void; config: SimplePlanetConfig }) {
	if (!config.enableVegetation) return null;

	return (
		<div className="absolute top-20 left-4 z-50 space-y-2">
			<div className="bg-slate-900/90 border border-cyan-400/50 rounded-lg p-3 backdrop-blur-xl">
				<h3 className="text-cyan-400 text-sm font-bold mb-2 flex items-center">
					<div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></div>
					Surface Analysis
				</h3>

				{!isZoomed ? (
					<button
						onClick={onZoomToSurface}
						className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 
								 text-green-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
								 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
					>
						🌲 Zoom to Surface
					</button>
				) : (
					<div className="space-y-2">
						<div className="text-xs text-green-300 bg-green-500/10 border border-green-400/30 rounded p-2">
							<div className="flex items-center justify-between">
								<span>Surface Detail Active</span>
								<span className="text-green-400 font-mono">{config.treeCount}</span>
							</div>
							<div className="text-green-200 mt-1">Viewing biome-specific vegetation</div>
						</div>
						<button
							onClick={onZoomOut}
							className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 
									 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
						>
							🌍 Return to Orbit
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

// Enhanced Scene Component with zoom functionality
function PlanetScene({ config }: { config: SimplePlanetConfig }) {
	const [isHovering, setIsHovering] = useState(false);
	const [hoverPosition, setHoverPosition] = useState<[number, number, number]>([0, 0, 0]);
	const [isZoomedToSurface, setIsZoomedToSurface] = useState(false);
	const { camera, controls } = useThree();
	const cameraRef = useRef<THREE.PerspectiveCamera>(null);

	console.log("🌍 [PLANET] PlanetScene rendered");

	// Store original camera position
	useEffect(() => {
		cameraRef.current = camera as THREE.PerspectiveCamera;
	}, [camera]);

	const handleHover = (event: any) => {
		console.log("🌍 [HOVER] Planet hover detected!", event);
		setIsHovering(true);
		// Position the info card above the planet
		setHoverPosition([config.radius + 2, config.radius + 1, 0]);
	};

	const handleHoverExit = () => {
		console.log("🌍 [HOVER] Planet hover exit!");
		setIsHovering(false);
	};

	const handleSurfaceClick = (event: any) => {
		if (!config.enableVegetation) return;

		// Get click point in world space
		const intersection = event.intersections[0];
		if (intersection) {
			zoomToSurface(intersection.point);
		}
	};

	const zoomToSurface = (targetPoint: THREE.Vector3) => {
		if (!cameraRef.current || !controls) return;

		// Calculate surface position (slightly above the surface)
		const surfacePosition = targetPoint
			.clone()
			.normalize()
			.multiplyScalar(config.radius + 0.5);

		// Smooth camera transition
		const startPosition = cameraRef.current.position.clone();
		const targetPosition = surfacePosition;

		let progress = 0;
		const animateZoom = () => {
			progress += 0.02;
			if (progress >= 1) {
				progress = 1;
				setIsZoomedToSurface(true);
			}

			// Smooth interpolation
			const currentPosition = startPosition.lerp(targetPosition, progress);
			cameraRef.current!.position.copy(currentPosition);
			cameraRef.current!.lookAt(targetPoint);

			if (progress < 1) {
				requestAnimationFrame(animateZoom);
			}
		};

		animateZoom();
	};

	const zoomOut = () => {
		if (!cameraRef.current || !controls) return;

		// Return to orbital view
		const startPosition = cameraRef.current.position.clone();
		const targetPosition = new THREE.Vector3(0, 0, 8);

		let progress = 0;
		const animateZoomOut = () => {
			progress += 0.02;
			if (progress >= 1) {
				progress = 1;
				setIsZoomedToSurface(false);
			}

			const currentPosition = startPosition.lerp(targetPosition, progress);
			cameraRef.current!.position.copy(currentPosition);
			cameraRef.current!.lookAt(0, 0, 0);

			if (progress < 1) {
				requestAnimationFrame(animateZoomOut);
			}
		};

		animateZoomOut();
	};

	// Get planet type for info card
	const planetType = getPlanetTypeByClass(config.planetClass);
	console.log("🌍 [DEBUG] Planet type lookup:", {
		planetClass: config.planetClass,
		planetType: planetType?.name || "NOT FOUND",
	});

	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.4} />
			<directionalLight position={[5, 5, 5]} intensity={1} castShadow />

			{/* Planet with hover and click interactions */}
			<PlanetMesh config={config} onHover={handleHover} onHoverExit={handleHoverExit} onSurfaceClick={handleSurfaceClick} />

			{/* 3D Info Card - shows on hover */}
			{planetType && !isZoomedToSurface && (
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

			{/* Debug: Show info card state */}
			{console.log("🌍 [DEBUG] Info card state:", {
				planetType: !!planetType,
				isZoomedToSurface,
				isHovering,
				hoverPosition,
			})}

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
		<div className="absolute inset-0 pt-16 w-full h-full">
			{/* Surface Zoom Controls - Outside Canvas */}
			<SurfaceZoomControls
				isZoomed={false}
				onZoomToSurface={() => {
					// This will be handled by the 3D scene
					console.log("🌍 [PLANET] Surface zoom requested");
				}}
				onZoomOut={() => {
					// This will be handled by the 3D scene
					console.log("🌍 [PLANET] Zoom out requested");
				}}
				config={config}
			/>

			<div className="w-full h-full relative">
				<Canvas
					camera={{ position: [0, 0, 8], fov: 75 }}
					shadows
					style={{
						width: "100%",
						height: "100%",
					}}
				>
					<Suspense fallback={null}>
						<PlanetScene config={config} />
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
							minDistance={0.5} // Allow very close zoom
							maxDistance={20}
						/>
					</Suspense>
				</Canvas>
			</div>
		</div>
	);
}
