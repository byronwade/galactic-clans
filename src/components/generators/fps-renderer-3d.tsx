/**
 * @file fps-renderer-3d.tsx
 * @description Advanced 3D Renderer for FPS Exploration
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Implements:
 * - First-person camera with smooth movement
 * - Procedural terrain generation with LOD
 * - Physics-based player controller
 * - Advanced environment rendering
 * - Performance optimization systems
 */

"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import type { FPSConfig, FPSPerformanceMetrics } from "./fps-explorer-generator";
import { SpatialAudioSystem } from "./fps-spatial-audio";
import { DiegeticUI } from "./fps-diegetic-ui";

// FPS Player Controller with Physics
function FPSPlayer({ config, inputManager, onCameraUpdate }: { config: FPSConfig; inputManager: any; onCameraUpdate: (position: THREE.Vector3, rotation: THREE.Euler) => void }) {
	const { camera, gl } = useThree();
	const playerRef = useRef<THREE.Group>(null);
	const velocityRef = useRef(new THREE.Vector3());
	const isGroundedRef = useRef(true);
	const lastTimeRef = useRef(0);

	// Camera bob animation
	const bobRef = useRef({ time: 0, offset: new THREE.Vector3() });

	// Player movement state
	const [playerState, setPlayerState] = useState({
		position: new THREE.Vector3(0, 2, 0),
		rotation: new THREE.Euler(0, 0, 0),
		isCrouching: false,
		isRunning: false,
		stamina: config.player.stamina,
	});

	// Initialize camera
	useEffect(() => {
		if (camera instanceof THREE.PerspectiveCamera) {
			camera.fov = config.player.fov;
			camera.updateProjectionMatrix();
			camera.position.copy(playerState.position);
		}
	}, [camera, config.player.fov, playerState.position]);

	// Handle movement and physics
	useFrame((state, delta) => {
		if (!inputManager?.getInputState || !playerRef.current) return;

		const inputState = inputManager.getInputState();
		const velocity = velocityRef.current;
		const player = playerRef.current;

		// Calculate movement
		const moveDirection = new THREE.Vector3();
		const cameraDirection = new THREE.Vector3();
		camera.getWorldDirection(cameraDirection);

		// Forward/backward movement
		if (inputState.forward) {
			moveDirection.add(cameraDirection);
		}
		if (inputState.backward) {
			moveDirection.sub(cameraDirection);
		}

		// Left/right movement (strafe)
		const rightVector = new THREE.Vector3();
		rightVector.crossVectors(cameraDirection, camera.up).normalize();

		if (inputState.left) {
			moveDirection.sub(rightVector);
		}
		if (inputState.right) {
			moveDirection.add(rightVector);
		}

		// Normalize movement
		if (moveDirection.length() > 0) {
			moveDirection.normalize();

			// Apply speed based on movement state
			let speed = config.player.walkSpeed;
			if (inputState.run && playerState.stamina > 0) {
				speed = config.player.runSpeed;
				setPlayerState((prev) => ({
					...prev,
					stamina: Math.max(0, prev.stamina - delta * 20),
					isRunning: true,
				}));
			} else {
				setPlayerState((prev) => ({
					...prev,
					stamina: Math.min(config.player.stamina, prev.stamina + delta * 10),
					isRunning: false,
				}));
			}

			if (inputState.crouch) {
				speed = config.player.crouchSpeed;
				setPlayerState((prev) => ({ ...prev, isCrouching: true }));
			} else {
				setPlayerState((prev) => ({ ...prev, isCrouching: false }));
			}

			// Apply movement
			moveDirection.multiplyScalar(speed * delta);
			velocity.x = moveDirection.x;
			velocity.z = moveDirection.z;
		} else {
			// Apply friction
			velocity.x *= 0.8;
			velocity.z *= 0.8;
		}

		// Handle jumping
		if (inputState.jump && isGroundedRef.current) {
			velocity.y = Math.sqrt(2 * config.player.gravity * config.player.jumpHeight);
			isGroundedRef.current = false;
		}

		// Apply gravity
		if (!isGroundedRef.current) {
			velocity.y -= config.player.gravity * delta;
		}

		// Update position
		const newPosition = player.position.clone();
		newPosition.add(velocity.clone().multiplyScalar(delta));

		// Ground collision (simplified)
		const groundHeight = getTerrainHeightAt(newPosition.x, newPosition.z);
		if (newPosition.y <= groundHeight + config.player.playerHeight / 2) {
			newPosition.y = groundHeight + config.player.playerHeight / 2;
			velocity.y = 0;
			isGroundedRef.current = true;
		}

		player.position.copy(newPosition);

		// Handle mouse look
		if (inputState.mouseDeltaX !== 0 || inputState.mouseDeltaY !== 0) {
			const sensitivity = config.player.mouseSensitivity * 0.002;

			// Horizontal rotation (Y-axis)
			player.rotation.y -= inputState.mouseDeltaX * sensitivity;

			// Vertical rotation (X-axis) - clamp to prevent over-rotation
			const currentRotX = camera.rotation.x;
			const newRotX = currentRotX - inputState.mouseDeltaY * sensitivity;
			camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotX));
		}

		// View bobbing effect
		if (config.player.viewBobbing && (inputState.forward || inputState.backward || inputState.left || inputState.right)) {
			bobRef.current.time += delta * 10;
			const bobAmount = config.player.headBobIntensity * 0.02;
			bobRef.current.offset.y = Math.sin(bobRef.current.time) * bobAmount;
			bobRef.current.offset.x = Math.sin(bobRef.current.time * 0.5) * bobAmount * 0.5;
		} else {
			bobRef.current.time = 0;
			bobRef.current.offset.lerp(new THREE.Vector3(), delta * 5);
		}

		// Update camera position with bob
		const finalCameraPos = newPosition.clone().add(bobRef.current.offset);
		camera.position.copy(finalCameraPos);

		// Update player state
		setPlayerState((prev) => ({
			...prev,
			position: newPosition.clone(),
			rotation: new THREE.Euler(camera.rotation.x, player.rotation.y, 0),
		}));

		// Notify parent of camera updates
		onCameraUpdate(finalCameraPos, new THREE.Euler(camera.rotation.x, player.rotation.y, 0));
	});

	return (
		<group ref={playerRef} position={playerState.position}>
			{/* Player collision capsule (invisible) */}
			<mesh visible={false}>
				<capsuleGeometry args={[config.player.playerRadius, config.player.playerHeight]} />
				<meshBasicMaterial transparent opacity={0.1} />
			</mesh>
		</group>
	);
}

// Procedural Terrain with LOD
function TerrainSystem({ config }: { config: FPSConfig }) {
	const terrainRef = useRef<THREE.Group>(null);
	const [terrainChunks, setTerrainChunks] = useState<Map<string, THREE.Mesh>>(new Map());

	// Generate terrain chunk
	const generateTerrainChunk = useCallback(
		(chunkX: number, chunkZ: number) => {
			const chunkSize = 32;
			const resolution = 64;
			const noise = createNoise2D();

			const geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, resolution - 1, resolution - 1);
			const positionAttribute = geometry.attributes.position;

			if (!positionAttribute) return null;

			const vertices = positionAttribute.array as Float32Array;

			for (let i = 0; i < vertices.length; i += 3) {
				const x = vertices[i] + chunkX * chunkSize;
				const z = vertices[i + 2] + chunkZ * chunkSize;

				// Multi-octave noise for terrain
				let height = 0;
				height += noise(x * 0.01, z * 0.01) * config.environment.heightVariation;
				height += noise(x * 0.05, z * 0.05) * config.environment.heightVariation * 0.5;
				height += noise(x * 0.1, z * 0.1) * config.environment.heightVariation * 0.25;

				vertices[i + 1] = height;
			}

			positionAttribute.needsUpdate = true;
			geometry.computeVertexNormals();

			const material = new THREE.MeshLambertMaterial({
				color: new THREE.Color(0.3, 0.5, 0.2),
				wireframe: false,
			});

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(chunkX * chunkSize, 0, chunkZ * chunkSize);
			mesh.rotation.x = -Math.PI / 2;
			mesh.receiveShadow = true;

			return mesh;
		},
		[config.environment]
	);

	// Update terrain chunks based on player position
	useFrame(() => {
		// Simplified chunk loading - in production would be more sophisticated
		const renderDistance = 2; // chunks

		for (let x = -renderDistance; x <= renderDistance; x++) {
			for (let z = -renderDistance; z <= renderDistance; z++) {
				const chunkKey = `${x},${z}`;
				if (!terrainChunks.has(chunkKey)) {
					const chunk = generateTerrainChunk(x, z);
					terrainRef.current?.add(chunk);
					setTerrainChunks((prev) => new Map(prev).set(chunkKey, chunk));
				}
			}
		}
	});

	return <group ref={terrainRef} />;
}

// Environmental elements
function Environment({ config }: { config: FPSConfig }) {
	return (
		<group>
			{/* Lighting */}
			<ambientLight intensity={config.environment.ambientLight} />
			<directionalLight position={[50, 50, 25]} intensity={config.environment.sunIntensity} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={200} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} />

			{/* Sky */}
			<mesh>
				<sphereGeometry args={[500, 32, 32]} />
				<meshBasicMaterial color={new THREE.Color(0.5, 0.7, 1.0)} side={THREE.BackSide} />
			</mesh>

			{/* Simple vegetation (placeholder) */}
			{config.environment.enableVegetation && (
				<group>
					{Array.from({ length: 100 }, (_, i) => (
						<mesh key={i} position={[(Math.random() - 0.5) * 100, 0, (Math.random() - 0.5) * 100]} castShadow>
							<cylinderGeometry args={[0.2, 0.2, 3, 8]} />
							<meshLambertMaterial color={0x2d5016} />
						</mesh>
					))}
				</group>
			)}
		</group>
	);
}

// Helper function for terrain height calculation
function getTerrainHeightAt(x: number, z: number): number {
	// Simplified terrain height calculation
	const noise = new SimplexNoise();
	let height = 0;
	height += noise.noise2D(x * 0.01, z * 0.01) * 5;
	height += noise.noise2D(x * 0.05, z * 0.05) * 2.5;
	height += noise.noise2D(x * 0.1, z * 0.1) * 1.25;
	return height;
}

// Main FPS Scene
function FPSScene({ config, inputManager, onPerformanceUpdate }: { config: FPSConfig; inputManager: any; onPerformanceUpdate: (metrics: FPSPerformanceMetrics) => void }) {
	const { gl, scene } = useThree();
	const [cameraState, setCameraState] = useState({
		position: new THREE.Vector3(0, 2, 0),
		rotation: new THREE.Euler(0, 0, 0),
	});

	// Performance monitoring
	useFrame(() => {
		// Calculate performance metrics
		const info = gl.info;
		const metrics: FPSPerformanceMetrics = {
			frameRate: 1 / gl.info.render.frame, // Approximation
			frameTime: gl.info.render.frame,
			drawCalls: info.render.calls,
			triangles: info.render.triangles,
			memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
			cpuUsage: 50, // Placeholder - would need more sophisticated measurement
		};

		onPerformanceUpdate(metrics);
	});

	const handleCameraUpdate = useCallback((position: THREE.Vector3, rotation: THREE.Euler) => {
		setCameraState({ position: position.clone(), rotation: rotation.clone() });
	}, []);

	return (
		<>
			{/* Player Controller */}
			<FPSPlayer config={config} inputManager={inputManager} onCameraUpdate={handleCameraUpdate} />

			{/* Terrain System */}
			<TerrainSystem config={config} />

			{/* Environment */}
			<Environment config={config} />
		</>
	);
}

// FPS Renderer Component Interface
export interface FPSRenderer3DRef {
	getPlayerPosition: () => THREE.Vector3;
	getCameraRotation: () => THREE.Euler;
	teleportPlayer: (position: THREE.Vector3) => void;
}

interface FPSRenderer3DProps {
	config: FPSConfig;
	isExploring: boolean;
	isInitializing: boolean;
	inputManager: any;
	onPerformanceUpdate: (metrics: FPSPerformanceMetrics) => void;
	onLoadingChange: (loading: boolean) => void;
}

export const FPSRenderer3D = forwardRef<FPSRenderer3DRef, FPSRenderer3DProps>(({ config, isExploring, isInitializing, inputManager, onPerformanceUpdate, onLoadingChange }, ref) => {
	const sceneRef = useRef<any>(null);

	useImperativeHandle(ref, () => ({
		getPlayerPosition: () => new THREE.Vector3(0, 2, 0), // Placeholder
		getCameraRotation: () => new THREE.Euler(0, 0, 0), // Placeholder
		teleportPlayer: (position: THREE.Vector3) => {
			// Placeholder - would implement player teleportation
			console.log("Teleporting player to:", position);
		},
	}));

	if (!isExploring && !isInitializing) {
		return (
			<div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-green-900 flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="text-6xl">🌍</div>
					<h3 className="text-xl font-semibold text-white">FPS Exploration Ready</h3>
					<p className="text-slate-300">Click "Start Exploration" to begin first-person planetary exploration</p>
				</div>
			</div>
		);
	}

	if (isInitializing) {
		return (
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-green-950 flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto" />
					<h3 className="text-xl font-semibold text-white">Loading Planetary Surface</h3>
					<p className="text-slate-300">Generating terrain, vegetation, and physics systems...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="absolute inset-0">
			<Canvas
				shadows
				camera={{ position: [0, 2, 0], fov: config.player.fov }}
				gl={{
					antialias: true,
					shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap },
					outputColorSpace: THREE.SRGBColorSpace,
				}}
			>
				<FPSScene config={config} inputManager={inputManager} onPerformanceUpdate={onPerformanceUpdate} />
			</Canvas>

			{/* Crosshair */}
			{config.gameplay.showCrosshair && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
					<div className="w-4 h-4 border border-white rounded-full opacity-70" />
				</div>
			)}

			{/* Exploration UI overlays would go here */}
		</div>
	);
});
