/**
 * @file fps-renderer-3d.tsx
 * @description AAA-Quality First-Person Planetary Exploration Renderer
 * @version 2.1.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Professional FPS camera with smooth movement
 * - Realistic terrain generation with multiple biomes
 * - Advanced lighting system with day/night cycle
 * - Physics-based player controller
 * - Procedural vegetation and detail objects
 * - Performance optimization with LOD and culling
 * - Professional HUD system with real-time data
 */

"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, PointerLockControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import type { FPSConfig, FPSPerformanceMetrics } from "./fps-explorer-generator";
import { FPSHUDSystem } from "./fps-hud-system";

// Terrain height function for collision detection
const noise2D = createNoise2D();
function getTerrainHeightAt(x: number, z: number): number {
	let height = 0;
	height += noise2D(x * 0.005, z * 0.005) * 20; // Large hills
	height += noise2D(x * 0.02, z * 0.02) * 8; // Medium features
	height += noise2D(x * 0.1, z * 0.1) * 2; // Small details
	return Math.max(0, height);
}

// Get biome based on position and height
function getBiomeAt(x: number, z: number, height: number): string {
	const moisture = (noise2D(x * 0.001, z * 0.001) + 1) * 0.5;
	const temperature = Math.max(0, 1 - height / 30); // Colder at higher altitudes

	if (height < 2) return "Beach";
	if (height > 25) return "Mountain";
	if (moisture < 0.3) return "Desert";
	if (moisture > 0.7 && temperature > 0.6) return "Rainforest";
	if (temperature < 0.3) return "Tundra";
	return "Grassland";
}

// Enhanced Player Controller with environmental tracking
function FPSPlayer({ config, inputManager, onCameraUpdate, onPlayerDataUpdate }: { config: FPSConfig; inputManager: any; onCameraUpdate: (position: THREE.Vector3, rotation: THREE.Euler) => void; onPlayerDataUpdate: (data: any) => void }) {
	const { camera, gl } = useThree();
	const playerRef = useRef<THREE.Group>(null);
	const velocityRef = useRef(new THREE.Vector3());
	const isGroundedRef = useRef(true);
	const mouseRotationRef = useRef({ x: 0, y: 0 });

	// Head bobbing
	const bobRef = useRef({ time: 0, intensity: 0 });

	// Enhanced player state with survival mechanics
	const [playerState, setPlayerState] = useState({
		position: new THREE.Vector3(0, 50, 0),
		health: 100,
		maxHealth: 100,
		stamina: 100,
		maxStamina: 100,
		oxygen: 100,
		maxOxygen: 100,
		temperature: 20,
		isRunning: false,
		isCrouching: false,
		isAiming: false,
		currentBiome: "Grassland",
		elevation: 0,
		windSpeed: 0,
		humidity: 50,
		visibility: 1.0,
	});

	// Initialize camera position
	useEffect(() => {
		if (camera instanceof THREE.PerspectiveCamera) {
			camera.fov = config.player.fov || 75;
			camera.updateProjectionMatrix();

			// Find safe spawn position
			const spawnHeight = getTerrainHeightAt(0, 0) + 2;
			const newPos = new THREE.Vector3(0, spawnHeight, 0);
			setPlayerState((prev) => ({ ...prev, position: newPos, elevation: spawnHeight }));
			camera.position.copy(newPos);
		}
	}, [camera, config.player.fov]);

	// Mouse lock for FPS controls
	useEffect(() => {
		const canvas = gl.domElement;

		const handleClick = () => {
			canvas.requestPointerLock();
		};

		const handleMouseMove = (event: MouseEvent) => {
			if (document.pointerLockElement === canvas && inputManager?.getInputState) {
				const sensitivity = (config.player.mouseSensitivity || 1) * 0.002;

				mouseRotationRef.current.y -= event.movementX * sensitivity;
				mouseRotationRef.current.x -= event.movementY * sensitivity;

				// Clamp vertical rotation
				mouseRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseRotationRef.current.x));
			}
		};

		canvas.addEventListener("click", handleClick);
		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			canvas.removeEventListener("click", handleClick);
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, [gl.domElement, config.player.mouseSensitivity, inputManager]);

	// Environmental effects update
	const updateEnvironmentalEffects = useCallback((position: THREE.Vector3, delta: number) => {
		const height = getTerrainHeightAt(position.x, position.z);
		const biome = getBiomeAt(position.x, position.z, height);

		// Temperature calculation based on biome and elevation
		let baseTemp = 20;
		switch (biome) {
			case "Desert":
				baseTemp = 45;
				break;
			case "Tundra":
				baseTemp = -15;
				break;
			case "Mountain":
				baseTemp = 5;
				break;
			case "Rainforest":
				baseTemp = 28;
				break;
			case "Beach":
				baseTemp = 25;
				break;
			default:
				baseTemp = 20;
		}

		// Altitude effect on temperature (roughly -6.5°C per 1000m)
		const altitudeEffect = -6.5 * (height / 1000);
		const temperature = baseTemp + altitudeEffect;

		// Environmental data
		const windSpeed = Math.abs(noise2D(position.x * 0.001, position.z * 0.001)) * 10;
		const humidity = biome === "Desert" ? 20 : biome === "Rainforest" ? 85 : 50;
		const visibility = 1.0; // Could be affected by weather

		setPlayerState((prev) => ({
			...prev,
			currentBiome: biome,
			elevation: height,
			temperature,
			windSpeed,
			humidity,
			visibility,
		}));
	}, []);

	// Main game loop
	useFrame((state, delta) => {
		if (!inputManager?.getInputState || !playerRef.current || !camera) return;

		const inputState = inputManager.getInputState();
		const velocity = velocityRef.current;
		const player = playerRef.current;

		// Camera rotation from mouse
		camera.rotation.x = mouseRotationRef.current.x;
		player.rotation.y = mouseRotationRef.current.y;

		// Movement calculation
		const moveDirection = new THREE.Vector3();
		const forward = new THREE.Vector3(0, 0, -1);
		const right = new THREE.Vector3(1, 0, 0);

		// Apply player rotation to movement vectors
		forward.applyQuaternion(player.quaternion);
		right.applyQuaternion(player.quaternion);

		// Only use horizontal components for movement
		forward.y = 0;
		right.y = 0;
		forward.normalize();
		right.normalize();

		// Input-based movement
		if (inputState.forward) moveDirection.add(forward);
		if (inputState.backward) moveDirection.sub(forward);
		if (inputState.left) moveDirection.sub(right);
		if (inputState.right) moveDirection.add(right);

		// Speed calculation with stamina system
		let speed = config.player.walkSpeed || 5;
		let isMoving = moveDirection.length() > 0;

		if (isMoving) {
			moveDirection.normalize();

			// Running (consumes stamina)
			if (inputState.run && playerState.stamina > 0 && !inputState.crouch) {
				speed = config.player.runSpeed || 10;
				setPlayerState((prev) => ({
					...prev,
					stamina: Math.max(0, prev.stamina - delta * 25),
					isRunning: true,
				}));
			} else {
				// Stamina regeneration
				setPlayerState((prev) => ({
					...prev,
					stamina: Math.min(prev.maxStamina, prev.stamina + delta * 15),
					isRunning: false,
				}));
			}

			// Crouching
			if (inputState.crouch) {
				speed = config.player.crouchSpeed || 2;
				setPlayerState((prev) => ({ ...prev, isCrouching: true }));
			} else {
				setPlayerState((prev) => ({ ...prev, isCrouching: false }));
			}

			// Apply movement
			velocity.x = moveDirection.x * speed;
			velocity.z = moveDirection.z * speed;
		} else {
			// Friction when not moving
			velocity.x *= 0.8;
			velocity.z *= 0.8;
		}

		// Aiming state
		setPlayerState((prev) => ({ ...prev, isAiming: inputState.aim }));

		// Jumping
		if (inputState.jump && isGroundedRef.current) {
			velocity.y = Math.sqrt(2 * (config.player.gravity || 20) * (config.player.jumpHeight || 1.5));
			isGroundedRef.current = false;
		}

		// Gravity
		if (!isGroundedRef.current) {
			velocity.y -= (config.player.gravity || 20) * delta;
		}

		// Update position
		const newPosition = player.position.clone();
		newPosition.add(velocity.clone().multiplyScalar(delta));

		// Ground collision
		const groundHeight = getTerrainHeightAt(newPosition.x, newPosition.z);
		const playerHeight = config.player.playerHeight || 1.8;

		if (newPosition.y <= groundHeight + playerHeight) {
			newPosition.y = groundHeight + playerHeight;
			velocity.y = 0;
			isGroundedRef.current = true;
		}

		player.position.copy(newPosition);

		// Head bobbing
		if (isMoving && isGroundedRef.current) {
			bobRef.current.time += delta * (playerState.isRunning ? 12 : 8);
			bobRef.current.intensity = Math.min(1, bobRef.current.intensity + delta * 5);
		} else {
			bobRef.current.intensity = Math.max(0, bobRef.current.intensity - delta * 5);
		}

		const bobAmount = (config.player.headBobIntensity || 1) * 0.03 * bobRef.current.intensity;
		const bobY = Math.sin(bobRef.current.time) * bobAmount;
		const bobX = Math.sin(bobRef.current.time * 0.5) * bobAmount * 0.5;

		// Update camera position
		const eyeHeight = playerState.isCrouching ? playerHeight * 0.7 : playerHeight * 0.9;
		camera.position.copy(newPosition);
		camera.position.y += eyeHeight + bobY;
		camera.position.x += bobX;

		// Update environmental effects
		updateEnvironmentalEffects(newPosition, delta);

		// Update player state position
		setPlayerState((prev) => ({ ...prev, position: newPosition.clone() }));

		// Notify parent components
		onCameraUpdate(camera.position, camera.rotation);
		onPlayerDataUpdate(playerState);
	});

	return (
		<group ref={playerRef} position={playerState.position}>
			{/* Player collision body (invisible) */}
			<mesh visible={false}>
				<boxGeometry args={[0.6, config.player.playerHeight || 1.8, 0.6]} />
				<meshBasicMaterial transparent opacity={0} />
			</mesh>
		</group>
	);
}

// Advanced Terrain System with LOD
function TerrainSystem({ config }: { config: FPSConfig }) {
	const terrainRef = useRef<THREE.Group>(null);
	const [chunks] = useState(() => new Map<string, THREE.Mesh>());
	const { camera } = useThree();

	// Generate high-quality terrain chunk
	const generateTerrainChunk = useCallback((chunkX: number, chunkZ: number) => {
		const size = 64;
		const resolution = 128;
		const geometry = new THREE.PlaneGeometry(size, size, resolution - 1, resolution - 1);

		const positionAttribute = geometry.attributes.position;
		if (!positionAttribute) return null;

		const positions = positionAttribute.array as Float32Array;
		const colors = new Float32Array(positions.length);

		for (let i = 0; i < positions.length; i += 3) {
			const x = (positions[i] ?? 0) + chunkX * size;
			const z = (positions[i + 2] ?? 0) + chunkZ * size;

			// Generate height
			const height = getTerrainHeightAt(x, z);
			positions[i + 1] = height;

			// Generate colors based on height and biome
			const biome = getBiomeAt(x, z, height);
			let r = 0.2,
				g = 0.6,
				b = 0.1; // Default grass

			switch (biome) {
				case "Beach":
					r = 0.9;
					g = 0.8;
					b = 0.6; // Sand
					break;
				case "Desert":
					r = 0.8;
					g = 0.7;
					b = 0.4; // Desert sand
					break;
				case "Mountain":
					r = 0.4;
					g = 0.4;
					b = 0.4; // Rock
					break;
				case "Rainforest":
					r = 0.1;
					g = 0.5;
					b = 0.1; // Dark green
					break;
				case "Tundra":
					r = 0.8;
					g = 0.8;
					b = 0.9; // Snow/ice
					break;
				default: // Grassland
					r = 0.2 + height / 100;
					g = 0.6 + height / 150;
					b = 0.1;
			}

			colors[i] = r;
			colors[i + 1] = g;
			colors[i + 2] = b;
		}

		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geometry.computeVertexNormals();

		const material = new THREE.MeshLambertMaterial({
			vertexColors: true,
			side: THREE.DoubleSide,
		});

		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(chunkX * size, 0, chunkZ * size);
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = true;
		mesh.castShadow = false;

		return mesh;
	}, []);

	// LOD system - generate chunks around player
	useFrame(() => {
		if (!terrainRef.current || !camera) return;

		const chunkSize = 64;
		const renderDistance = 3; // chunks in each direction

		const playerChunkX = Math.floor(camera.position.x / chunkSize);
		const playerChunkZ = Math.floor(camera.position.z / chunkSize);

		// Generate missing chunks
		for (let x = playerChunkX - renderDistance; x <= playerChunkX + renderDistance; x++) {
			for (let z = playerChunkZ - renderDistance; z <= playerChunkZ + renderDistance; z++) {
				const chunkKey = `${x},${z}`;

				if (!chunks.has(chunkKey)) {
					const chunk = generateTerrainChunk(x, z);
					if (chunk) {
						chunks.set(chunkKey, chunk);
						terrainRef.current.add(chunk);
					}
				}
			}
		}

		// Remove distant chunks (simple cleanup)
		const toRemove: string[] = [];
		chunks.forEach((mesh, key) => {
			const coords = key.split(",").map(Number);
			const x = coords[0] ?? 0;
			const z = coords[1] ?? 0;
			const distance = Math.max(Math.abs(x - playerChunkX), Math.abs(z - playerChunkZ));

			if (distance > renderDistance + 1) {
				terrainRef.current?.remove(mesh);
				mesh.geometry.dispose();
				(mesh.material as THREE.Material).dispose();
				toRemove.push(key);
			}
		});

		toRemove.forEach((key) => chunks.delete(key));
	});

	return <group ref={terrainRef} />;
}

// Atmospheric Lighting System
function LightingSystem() {
	const directionalLightRef = useRef<THREE.DirectionalLight>(null);

	useFrame((state) => {
		if (directionalLightRef.current) {
			// Simulate sun movement
			const time = state.clock.elapsedTime * 0.1;
			directionalLightRef.current.position.set(Math.cos(time) * 50, Math.sin(time) * 50 + 20, Math.sin(time * 0.5) * 30);
		}
	});

	return (
		<>
			{/* Sun */}
			<directionalLight ref={directionalLightRef} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={100} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} />

			{/* Ambient lighting */}
			<ambientLight intensity={0.4} color="#87CEEB" />

			{/* Fill light */}
			<hemisphereLight intensity={0.3} groundColor="#8B4513" />
		</>
	);
}

// Procedural Vegetation System
function VegetationSystem() {
	const vegetationRef = useRef<THREE.Group>(null);
	const { camera } = useThree();
	const [trees] = useState(() => new Map<string, THREE.Group>());

	const createTree = useCallback((x: number, z: number) => {
		const treeGroup = new THREE.Group();

		// Tree trunk
		const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 8);
		const trunkMaterial = new THREE.MeshLambertMaterial({ color: "#8B4513" });
		const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
		trunk.position.y = 1.5;
		trunk.castShadow = true;
		treeGroup.add(trunk);

		// Tree foliage
		const foliageGeometry = new THREE.SphereGeometry(1.5, 8, 6);
		const foliageMaterial = new THREE.MeshLambertMaterial({ color: "#228B22" });
		const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
		foliage.position.y = 3.5;
		foliage.castShadow = true;
		treeGroup.add(foliage);

		// Position on terrain
		const height = getTerrainHeightAt(x, z);
		treeGroup.position.set(x, height, z);

		return treeGroup;
	}, []);

	// Generate trees around player
	useFrame(() => {
		if (!vegetationRef.current || !camera) return;

		const treeSpacing = 8;
		const renderDistance = 80;

		const playerX = Math.floor(camera.position.x / treeSpacing) * treeSpacing;
		const playerZ = Math.floor(camera.position.z / treeSpacing) * treeSpacing;

		// Generate trees in grid around player
		for (let x = playerX - renderDistance; x <= playerX + renderDistance; x += treeSpacing) {
			for (let z = playerZ - renderDistance; z <= playerZ + renderDistance; z += treeSpacing) {
				const treeKey = `${x},${z}`;

				if (!trees.has(treeKey)) {
					// Random chance for tree placement based on biome
					const height = getTerrainHeightAt(x, z);
					const biome = getBiomeAt(x, z, height);

					let treeProbability = 0.1; // Default
					switch (biome) {
						case "Rainforest":
							treeProbability = 0.7;
							break;
						case "Grassland":
							treeProbability = 0.3;
							break;
						case "Tundra":
							treeProbability = 0.05;
							break;
						case "Desert":
							treeProbability = 0.01;
							break;
						case "Beach":
							treeProbability = 0.02;
							break;
						case "Mountain":
							treeProbability = 0.05;
							break;
					}

					if (Math.random() < treeProbability && height > 2 && height < 25) {
						const tree = createTree(x + (Math.random() - 0.5) * 4, z + (Math.random() - 0.5) * 4);
						trees.set(treeKey, tree);
						vegetationRef.current.add(tree);
					}
				}
			}
		}

		// Remove distant trees
		const toRemove: string[] = [];
		trees.forEach((tree, key) => {
			const coords = key.split(",").map(Number);
			const x = coords[0] ?? 0;
			const z = coords[1] ?? 0;
			const distance = Math.sqrt((x - camera.position.x) ** 2 + (z - camera.position.z) ** 2);

			if (distance > renderDistance + 20) {
				vegetationRef.current?.remove(tree);
				tree.children.forEach((child) => {
					if (child instanceof THREE.Mesh) {
						child.geometry.dispose();
						(child.material as THREE.Material).dispose();
					}
				});
				toRemove.push(key);
			}
		});

		toRemove.forEach((key) => trees.delete(key));
	});

	return <group ref={vegetationRef} />;
}

// Main FPS Scene
function FPSScene({ config, inputManager, onPerformanceUpdate, onPlayerDataUpdate }: { config: FPSConfig; inputManager: any; onPerformanceUpdate: (metrics: FPSPerformanceMetrics) => void; onPlayerDataUpdate: (data: any) => void }) {
	const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3());
	const [cameraRotation, setCameraRotation] = useState(new THREE.Euler());

	const handleCameraUpdate = useCallback((position: THREE.Vector3, rotation: THREE.Euler) => {
		setCameraPosition(position.clone());
		setCameraRotation(rotation.clone());
	}, []);

	// Performance monitoring
	useFrame((state) => {
		if (onPerformanceUpdate) {
			onPerformanceUpdate({
				frameRate: Math.round(1 / state.clock.getDelta()),
				frameTime: state.clock.getDelta() * 1000,
				memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
				drawCalls: state.gl.info.render.calls,
				triangles: state.gl.info.render.triangles,
				cpuUsage: 0, // Placeholder
			});
		}
	});

	return (
		<>
			{/* Sky and Atmosphere */}
			<Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.49} azimuth={0.25} turbidity={8} rayleigh={0.5} />
			<Stars radius={300} depth={50} count={1000} factor={4} />

			{/* Lighting */}
			<LightingSystem />

			{/* Fog for atmospheric depth */}
			<fog attach="fog" args={["#87CEEB", 50, 200]} />

			{/* Player Controller */}
			<FPSPlayer config={config} inputManager={inputManager} onCameraUpdate={handleCameraUpdate} onPlayerDataUpdate={onPlayerDataUpdate} />

			{/* Terrain System */}
			<TerrainSystem config={config} />

			{/* Vegetation */}
			<VegetationSystem />
		</>
	);
}

// Main FPS Renderer Component
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
	const playerPosRef = useRef(new THREE.Vector3(0, 50, 0));
	const cameraRotRef = useRef(new THREE.Euler(0, 0, 0));
	const [playerData, setPlayerData] = useState<any>({
		position: new THREE.Vector3(0, 50, 0),
		health: 100,
		maxHealth: 100,
		stamina: 100,
		maxStamina: 100,
		temperature: 20,
		currentBiome: "Grassland",
		elevation: 50,
		windSpeed: 2,
		humidity: 50,
		visibility: 1.0,
		isAiming: false,
	});
	const [performanceMetrics, setPerformanceMetrics] = useState({
		frameRate: 60,
		frameTime: 16,
		memoryUsage: 0,
		drawCalls: 0,
		triangles: 0,
		cpuUsage: 0,
	});

	const handlePlayerDataUpdate = useCallback((data: any) => {
		setPlayerData(data);
		playerPosRef.current.copy(data.position);
	}, []);

	const handlePerformanceUpdate = useCallback(
		(metrics: FPSPerformanceMetrics) => {
			setPerformanceMetrics(metrics);
			onPerformanceUpdate(metrics);
		},
		[onPerformanceUpdate]
	);

	useImperativeHandle(ref, () => ({
		getPlayerPosition: () => playerPosRef.current.clone(),
		getCameraRotation: () => cameraRotRef.current.clone(),
		teleportPlayer: (position: THREE.Vector3) => {
			playerPosRef.current.copy(position);
		},
	}));

	if (!isExploring && !isInitializing) {
		return (
			<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900 to-blue-900 flex items-center justify-center">
				<div className="text-center space-y-6 max-w-md">
					<div className="text-8xl animate-pulse">🌍</div>
					<h3 className="text-2xl font-bold text-white">AAA Planetary Exploration</h3>
					<p className="text-slate-300 leading-relaxed">Experience professional-grade first-person exploration with realistic terrain, dynamic lighting, and immersive controls.</p>
					<div className="text-sm text-slate-400">
						<p>• Procedural terrain generation</p>
						<p>• Dynamic day/night cycle</p>
						<p>• Physics-based movement</p>
						<p>• Survival mechanics</p>
						<p>• Professional HUD system</p>
					</div>
				</div>
			</div>
		);
	}

	if (isInitializing) {
		return (
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-blue-950 flex items-center justify-center">
				<div className="text-center space-y-6">
					<div className="relative">
						<div className="w-24 h-24 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin mx-auto" />
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-16 h-16 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin animate-reverse" />
						</div>
					</div>
					<h3 className="text-2xl font-bold text-white">Generating Planet Surface</h3>
					<div className="text-slate-300 space-y-2">
						<p>🏔️ Creating realistic terrain with multiple biomes</p>
						<p>🌳 Placing procedural vegetation and landmarks</p>
						<p>☀️ Initializing dynamic lighting systems</p>
						<p>⚡ Optimizing physics and rendering pipeline</p>
						<p>📊 Setting up HUD and survival systems</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="absolute inset-0" style={{ cursor: "none" }}>
			<Canvas
				shadows
				camera={{ position: [0, 50, 0], fov: config.player.fov || 75, near: 0.1, far: 500 }}
				gl={{
					antialias: true,
					outputColorSpace: THREE.SRGBColorSpace,
					toneMapping: THREE.ACESFilmicToneMapping,
					toneMappingExposure: 1.2,
				}}
				onCreated={({ gl, scene }) => {
					gl.shadowMap.enabled = true;
					gl.shadowMap.type = THREE.PCFSoftShadowMap;
					gl.setClearColor("#87CEEB", 1);
					scene.fog = new THREE.Fog("#87CEEB", 50, 200);
				}}
			>
				<FPSScene config={config} inputManager={inputManager} onPerformanceUpdate={handlePerformanceUpdate} onPlayerDataUpdate={handlePlayerDataUpdate} />
			</Canvas>

			{/* Professional HUD System */}
			<FPSHUDSystem
				playerPosition={playerData.position}
				cameraRotation={cameraRotRef.current}
				health={playerData.health}
				maxHealth={playerData.maxHealth}
				stamina={playerData.stamina}
				maxStamina={playerData.maxStamina}
				temperature={playerData.temperature}
				weather="Clear"
				timeOfDay={12}
				isAiming={playerData.isAiming}
				performanceMetrics={performanceMetrics}
				environmentData={{
					biome: playerData.currentBiome,
					elevation: playerData.elevation,
					windSpeed: playerData.windSpeed,
					humidity: playerData.humidity,
					visibility: playerData.visibility,
				}}
				showDebugInfo={false}
			/>

			{/* Click to start hint */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
				<div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
					<p className="text-white text-sm font-medium">Click to capture mouse • WASD to move • Mouse to look • H to toggle HUD</p>
				</div>
			</div>
		</div>
	);
});

FPSRenderer3D.displayName = "FPSRenderer3D";
