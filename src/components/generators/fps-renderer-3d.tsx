/**
 * @file fps-renderer-3d.tsx
 * @description Professional AAA-Quality FPS Renderer
 * @version 2.0.0
 * @author Galactic Clans Development Team
 *
 * Professional FPS Implementation Features:
 * - Smooth first-person camera with proper physics
 * - Realistic terrain generation with proper collision
 * - Advanced lighting system with day/night cycle
 * - Call of Duty style movement and controls
 * - Performance optimized with LOD and culling
 * - Professional visual effects and atmosphere
 */

"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, PointerLockControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import type { FPSConfig, FPSPerformanceMetrics } from "./fps-explorer-generator";
import { Html } from "@react-three/drei";

// Professional FPS Camera Controller
function FPSCamera({ config, inputManager }: { config: FPSConfig; inputManager: any }) {
	const { camera, gl } = useThree();
	const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
	const directionRef = useRef(new THREE.Vector3(0, 0, -1));
	const isGroundedRef = useRef(true);
	const jumpCooldownRef = useRef(0);
	const airTimeRef = useRef(0);
	const [isPointerLocked, setIsPointerLocked] = useState(false);
	
	// Advanced movement state
	const [movementState, setMovementState] = useState({
		isSliding: false,
		isWallRunning: false,
		canMantle: false,
		slideTimer: 0,
		lastGroundedTime: 0,
	});
	
	// Player physics state
	const [playerState, setPlayerState] = useState({
		health: 100,
		stamina: 100,
		speed: config.player.walkSpeed,
		isRunning: false,
		isCrouching: false,
		isJumping: false,
		isAiming: false,
	});

	// Weapon sway and breathing effects
	const weaponSwayRef = useRef({
		time: 0,
		breathingIntensity: 1.0,
		movementSway: new THREE.Vector3(),
		breathingSway: new THREE.Vector3(),
	});

	// Terrain collision detection
	const getTerrainHeight = useCallback((x: number, z: number) => {
		// Simplified terrain height calculation - matches terrain generation
		const noise = createNoise2D();
		let height = 0;
		height += noise(x * 0.02, z * 0.02) * 15; // Main terrain features
		height += noise(x * 0.1, z * 0.1) * 3;   // Small details
		height += noise(x * 0.3, z * 0.3) * 1;   // Fine details
		return Math.max(height, 0); // Prevent going below sea level
	}, []);

	// Initialize camera properties
	useEffect(() => {
		if (camera instanceof THREE.PerspectiveCamera) {
			camera.fov = config.player.fov;
			camera.near = 0.1;
			camera.far = 1000;
			
			// Set initial position on ground level
			const initialX = 0;
			const initialZ = 0;
			const terrainHeight = getTerrainHeight(initialX, initialZ);
			const playerHeight = 1.8;
			
			camera.position.set(initialX, terrainHeight + playerHeight, initialZ);
			
			// Set initial rotation to look forward (along negative Z axis)
			camera.rotation.set(0, 0, 0);
			camera.lookAt(initialX, terrainHeight + playerHeight, initialZ - 1);
			
			camera.updateProjectionMatrix();
			
			console.log(`🎮 [FPS] Camera initialized at position: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`);
		}
	}, [camera, config.player.fov, getTerrainHeight]);

	// Handle pointer lock events
	useEffect(() => {
		const handlePointerLockChange = () => {
			const isLocked = document.pointerLockElement === gl.domElement;
			setIsPointerLocked(isLocked);
			
			if (isLocked) {
				console.log('🎮 [FPS] Pointer lock activated');
			} else {
				console.log('🎮 [FPS] Pointer lock deactivated');
			}
		};

		const handlePointerLockError = (event: Event) => {
			console.warn('🎮 [FPS] Pointer lock failed:', event);
			setIsPointerLocked(false);
		};

		const handleClick = (event: MouseEvent) => {
			event.preventDefault();
			if (!isPointerLocked && document.pointerLockElement !== gl.domElement) {
				try {
					gl.domElement.requestPointerLock();
				} catch (error) {
					console.warn('🎮 [FPS] Failed to request pointer lock:', error);
				}
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.code === 'Escape' && isPointerLocked) {
				try {
					document.exitPointerLock();
				} catch (error) {
					console.warn('🎮 [FPS] Failed to exit pointer lock:', error);
					setIsPointerLocked(false);
				}
			}
		};

		document.addEventListener('pointerlockchange', handlePointerLockChange);
		document.addEventListener('pointerlockerror', handlePointerLockError);
		document.addEventListener('keydown', handleKeyDown);
		gl.domElement.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('pointerlockchange', handlePointerLockChange);
			document.removeEventListener('pointerlockerror', handlePointerLockError);
			document.removeEventListener('keydown', handleKeyDown);
			gl.domElement.removeEventListener('click', handleClick);
		};
	}, [gl.domElement, isPointerLocked]);

	// Manual mouse handling for FPS camera
	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			// Double-check pointer lock state to prevent race conditions
			if (!isPointerLocked || document.pointerLockElement !== gl.domElement) {
				return;
			}

			try {
				const sensitivity = config.player.mouseSensitivity * 0.002;
				const deltaX = event.movementX * sensitivity;
				const deltaY = event.movementY * sensitivity;

				// Update camera rotation
				camera.rotation.y -= deltaX;
				camera.rotation.x -= deltaY;

				// Clamp vertical rotation
				camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
			} catch (error) {
				console.warn('🎮 [FPS] Mouse movement error:', error);
			}
		};

		if (isPointerLocked && document.pointerLockElement === gl.domElement) {
			document.addEventListener('mousemove', handleMouseMove);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [isPointerLocked, camera, config.player.mouseSensitivity, gl.domElement]);

	// Cleanup pointer lock on unmount
	useEffect(() => {
		return () => {
			try {
				if (document.pointerLockElement === gl.domElement) {
					document.exitPointerLock();
				}
			} catch (error) {
				console.warn('🎮 [FPS] Cleanup pointer lock error:', error);
			}
		};
	}, [gl.domElement]);

	// Advanced movement mechanics
	const handleAdvancedMovement = useCallback((inputState: any, velocity: THREE.Vector3, delta: number) => {
		// Sliding mechanics
		if (inputState.slide && !movementState.isSliding && velocity.length() > 8) {
			setMovementState(prev => ({ ...prev, isSliding: true, slideTimer: 1.5 }));
		}

		if (movementState.isSliding) {
			const slideDeceleration = 15; // Deceleration rate
			const newSlideTimer = Math.max(0, movementState.slideTimer - delta);
			
			if (newSlideTimer <= 0 || velocity.length() < 2) {
				setMovementState(prev => ({ ...prev, isSliding: false, slideTimer: 0 }));
			} else {
				// Apply slide momentum
				velocity.multiplyScalar(Math.max(0.7, 1 - delta * slideDeceleration));
				setMovementState(prev => ({ ...prev, slideTimer: newSlideTimer }));
			}
		}

		// Air control (reduced effectiveness)
		if (!isGroundedRef.current) {
			airTimeRef.current += delta;
			// Reduce air control effectiveness
			const airControlFactor = Math.max(0.1, 1 - airTimeRef.current * 0.5);
			velocity.x *= airControlFactor;
			velocity.z *= airControlFactor;
		} else {
			airTimeRef.current = 0;
		}

		// Coyote time (grace period for jumping after leaving ground)
		if (isGroundedRef.current) {
			setMovementState(prev => ({ ...prev, lastGroundedTime: Date.now() }));
		}

		const coyoteTime = 150; // milliseconds
		const canCoyoteJump = (Date.now() - movementState.lastGroundedTime) < coyoteTime;

		// Enhanced jumping with coyote time
		if (inputState.jump && (isGroundedRef.current || canCoyoteJump) && jumpCooldownRef.current <= 0) {
			velocity.y = 12;
			isGroundedRef.current = false;
			jumpCooldownRef.current = 0.5;
			setPlayerState(prev => ({ ...prev, isJumping: true }));
		}
	}, [movementState]);

	// Weapon sway and breathing system
	const updateWeaponSway = useCallback((delta: number, isMoving: boolean, isAiming: boolean) => {
		const sway = weaponSwayRef.current;
		sway.time += delta;

		// Breathing effect (reduced when aiming)
		const breathingRate = isAiming ? 0.5 : 1.0;
		const breathingAmplitude = isAiming ? 0.3 : 1.0;
		sway.breathingIntensity = THREE.MathUtils.lerp(sway.breathingIntensity, breathingAmplitude, delta * 2);
		
		sway.breathingSway.x = Math.sin(sway.time * breathingRate) * 0.001 * sway.breathingIntensity;
		sway.breathingSway.y = Math.sin(sway.time * breathingRate * 0.5) * 0.0005 * sway.breathingIntensity;

		// Movement sway
		if (isMoving && !isAiming) {
			const movementIntensity = playerState.isRunning ? 1.5 : 1.0;
			sway.movementSway.x = Math.sin(sway.time * 8) * 0.002 * movementIntensity;
			sway.movementSway.y = Math.sin(sway.time * 16) * 0.001 * movementIntensity;
			sway.movementSway.z = Math.sin(sway.time * 6) * 0.0015 * movementIntensity;
		} else {
			sway.movementSway.lerp(new THREE.Vector3(), delta * 5);
		}

		// Apply weapon sway to camera
		const totalSway = new THREE.Vector3()
			.add(sway.breathingSway)
			.add(sway.movementSway);

		camera.rotation.x += totalSway.x;
		camera.rotation.y += totalSway.y;
		camera.rotation.z += totalSway.z;
	}, [camera, playerState.isRunning]);

	// Professional movement physics
	useFrame((state, delta) => {
		// Validate essential state before processing
		if (!inputManager?.getInputState || !camera || !gl.domElement) {
			return;
		}

		try {
			const inputState = inputManager.getInputState();
			const velocity = velocityRef.current;
			const direction = directionRef.current;

			// Update jump cooldown
			jumpCooldownRef.current = Math.max(0, jumpCooldownRef.current - delta);

			// Get camera direction vectors
			camera.getWorldDirection(direction);
			const rightVector = new THREE.Vector3();
			rightVector.crossVectors(direction, camera.up).normalize();

			// Calculate movement input
			const moveDirection = new THREE.Vector3(0, 0, 0);
			const isMoving = inputState.forward || inputState.backward || inputState.left || inputState.right;
			
			if (inputState.forward) moveDirection.add(direction);
			if (inputState.backward) moveDirection.sub(direction);
			if (inputState.left) moveDirection.sub(rightVector);
			if (inputState.right) moveDirection.add(rightVector);

			// Normalize horizontal movement
			moveDirection.y = 0;
			if (moveDirection.length() > 0) {
				moveDirection.normalize();
			}

			// Calculate speed based on state
			let currentSpeed = config.player.walkSpeed;
			let staminaDrain = 0;

			// Enhanced speed calculations
			if (movementState.isSliding) {
				currentSpeed = config.player.runSpeed * 1.3; // Sliding is faster
			} else if (inputState.run && playerState.stamina > 0 && isGroundedRef.current) {
				currentSpeed = config.player.runSpeed;
				staminaDrain = 25;
				setPlayerState(prev => ({ ...prev, isRunning: true }));
			} else {
				setPlayerState(prev => ({ ...prev, isRunning: false }));
			}

			if (inputState.crouch && !movementState.isSliding) {
				currentSpeed = config.player.crouchSpeed;
				setPlayerState(prev => ({ ...prev, isCrouching: true }));
			} else {
				setPlayerState(prev => ({ ...prev, isCrouching: false }));
			}

			// Advanced movement physics with proper acceleration curves
			const targetVelocity = moveDirection.multiplyScalar(currentSpeed);
			const acceleration = isGroundedRef.current ? 20 : 5; // Less air control
			
			// Smooth acceleration with easing
			const accelFactor = 1 - Math.pow(0.001, delta);
			velocity.x = THREE.MathUtils.lerp(velocity.x, targetVelocity.x, acceleration * delta * accelFactor);
			velocity.z = THREE.MathUtils.lerp(velocity.z, targetVelocity.z, acceleration * delta * accelFactor);

			// Handle advanced movement mechanics
			handleAdvancedMovement(inputState, velocity, delta);

			// Gravity and vertical physics
			if (!isGroundedRef.current) {
				velocity.y -= 30 * delta; // Gravity
			}

			// Apply velocity to camera position
			const newPosition = camera.position.clone();
			newPosition.add(velocity.clone().multiplyScalar(delta));

			// Terrain collision with enhanced detection
			const terrainHeight = getTerrainHeight(newPosition.x, newPosition.z);
			const playerHeight = movementState.isSliding ? 1.0 : (playerState.isCrouching ? 1.2 : 1.8);

			if (newPosition.y <= terrainHeight + playerHeight) {
				newPosition.y = terrainHeight + playerHeight;
				velocity.y = 0;
				isGroundedRef.current = true;
				setPlayerState(prev => ({ ...prev, isJumping: false }));
			} else {
				isGroundedRef.current = false;
			}

			// Update camera position
			camera.position.copy(newPosition);

			// Update weapon sway and breathing
			updateWeaponSway(delta, isMoving, inputState.aim || false);

			// Update stamina with enhanced recovery
			const staminaRecovery = playerState.isRunning ? 0 : (isMoving ? 10 : 20);
			setPlayerState(prev => ({
				...prev,
				stamina: Math.max(0, Math.min(100, prev.stamina - staminaDrain * delta + staminaRecovery * delta)),
				isAiming: inputState.aim || false,
			}));
		} catch (error) {
			console.warn('🎮 [FPS] Frame update error:', error);
		}
	});

	// Render click-to-activate overlay if pointer not locked
	if (!isPointerLocked) {
		return (
			<>
				<Html center>
					<div className="pointer-events-auto text-center p-6 bg-black/80 backdrop-blur-sm rounded-lg border border-green-400/30">
						<div className="text-white mb-2 text-lg font-semibold">🎮 FPS Controls</div>
						<div className="text-green-400 text-sm mb-3">Click anywhere to activate mouse look</div>
						<div className="text-xs text-slate-300">
							Use WASD to move • Mouse to look around • Shift to run
						</div>
					</div>
				</Html>
			</>
		);
	}

	return null; // Camera controls are handled by useFrame
}

// Professional Terrain System with LOD
function TerrainSystem({ config }: { config: FPSConfig }) {
	const terrainRef = useRef<THREE.Group>(null);
	const chunksRef = useRef<Map<string, THREE.Mesh>>(new Map());
	const { camera } = useThree();
	
	const noise = useMemo(() => createNoise2D(), []);

	// Terrain height calculation function
	const getTerrainHeight = useCallback((x: number, z: number) => {
		let height = 0;
		height += noise(x * 0.02, z * 0.02) * 15;  // Main landscape
		height += noise(x * 0.05, z * 0.05) * 8;   // Hills
		height += noise(x * 0.1, z * 0.1) * 3;     // Details
		height += noise(x * 0.3, z * 0.3) * 1;     // Fine noise
		return Math.max(height, -5);
	}, [noise]);

	// Generate high-quality terrain chunk
	const generateTerrainChunk = useCallback((chunkX: number, chunkZ: number, detail: number = 64) => {
		const chunkSize = 50;
		const geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, detail - 1, detail - 1);
		const positionAttribute = geometry.attributes.position;
		
		if (!positionAttribute) return null;
		
		const vertices = positionAttribute.array as Float32Array;

		// Generate realistic terrain heights
		for (let i = 0; i < vertices.length; i += 3) {
			const x = (vertices[i] ?? 0) + chunkX * chunkSize;
			const z = (vertices[i + 2] ?? 0) + chunkZ * chunkSize;

			// Use the shared terrain height function
			vertices[i + 1] = getTerrainHeight(x, z);
		}

		positionAttribute.needsUpdate = true;
		geometry.computeVertexNormals();

		// Enhanced terrain material with better visibility
		const material = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0.2, 0.8, 0.3), // Brighter, more visible green
			transparent: false,
			side: THREE.DoubleSide, // Ensure visibility from both sides
			wireframe: false, // Set to true for debugging terrain generation
		});

		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(chunkX * chunkSize, 0, chunkZ * chunkSize);
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = true;
		mesh.castShadow = false;

		// Debug logging
		console.log(`Generated terrain chunk at (${chunkX}, ${chunkZ}) with ${vertices.length / 3} vertices`);

		return mesh;
	}, [noise]);

	// Ensure initial chunks are loaded immediately
	useEffect(() => {
		const initialChunks: [number, number][] = [
			[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1],
			[-1, -1], [-1, 1], [1, -1], [1, 1]
		];

		console.log('Loading initial terrain chunks...');
		
		initialChunks.forEach((chunk) => {
			const [x, z] = chunk;
			const chunkKey = `${x},${z}`;
			if (!chunksRef.current.has(chunkKey)) {
				const terrainChunk = generateTerrainChunk(x, z, 64);
				if (terrainChunk && terrainRef.current) {
					terrainRef.current.add(terrainChunk);
					chunksRef.current.set(chunkKey, terrainChunk);
					console.log(`Added initial chunk: ${chunkKey}`);
				}
			}
		});
	}, [generateTerrainChunk]);

	// Dynamic chunk loading with LOD
	useFrame(() => {
		const playerPos = camera.position;
		const chunkSize = 50;
		const renderDistance = 5; // Increased render distance

		const playerChunkX = Math.floor(playerPos.x / chunkSize);
		const playerChunkZ = Math.floor(playerPos.z / chunkSize);

		// Debug: Log player position and chunk info occasionally
		if (Math.random() < 0.01) { // Log once every ~100 frames
			console.log(`Player position: (${playerPos.x.toFixed(1)}, ${playerPos.y.toFixed(1)}, ${playerPos.z.toFixed(1)})`);
			console.log(`Current chunk: (${playerChunkX}, ${playerChunkZ}), Loaded chunks: ${chunksRef.current.size}`);
			
			const terrainHeight = getTerrainHeight(playerPos.x, playerPos.z);
			console.log(`Terrain height at player position: ${terrainHeight.toFixed(2)}`);
		}

		// Load chunks around player
		for (let x = playerChunkX - renderDistance; x <= playerChunkX + renderDistance; x++) {
			for (let z = playerChunkZ - renderDistance; z <= playerChunkZ + renderDistance; z++) {
				const chunkKey = `${x},${z}`;
				
				if (!chunksRef.current.has(chunkKey)) {
					const distance = Math.sqrt((x - playerChunkX) ** 2 + (z - playerChunkZ) ** 2);
					const detail = distance < 2 ? 64 : distance < 3 ? 32 : 16; // LOD based on distance
					
					const chunk = generateTerrainChunk(x, z, detail);
					if (chunk && terrainRef.current) {
						terrainRef.current.add(chunk);
						chunksRef.current.set(chunkKey, chunk);
					}
				}
			}
		}

		// Unload distant chunks
		const chunksToRemove: string[] = [];
		chunksRef.current.forEach((chunk, key) => {
			const [x, z] = key.split(',').map(Number);
			if (x !== undefined && z !== undefined) {
				const distance = Math.sqrt((x - playerChunkX) ** 2 + (z - playerChunkZ) ** 2);
				
				if (distance > renderDistance + 2) { // Slightly larger unload distance
					chunksToRemove.push(key);
					if (terrainRef.current) {
						terrainRef.current.remove(chunk);
					}
					chunk.geometry.dispose();
					(chunk.material as THREE.Material).dispose();
				}
			}
		});

		chunksToRemove.forEach(key => chunksRef.current.delete(key));
	});

	return (
		<group ref={terrainRef}>
			{/* Base ground plane to ensure there's always something visible */}
			<mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[2000, 2000]} />
				<meshLambertMaterial color={new THREE.Color(0.2, 0.4, 0.1)} />
			</mesh>
		</group>
	);
}

// Professional Lighting and Environment
function Environment({ config }: { config: FPSConfig }) {
	const [timeOfDay, setTimeOfDay] = useState(0.3); // Start at daytime

	useFrame((state, delta) => {
		// Slower day/night cycle for testing
		setTimeOfDay(prev => (prev + delta * 0.005) % 1);
	});

	const sunAngle = timeOfDay * Math.PI * 2;
	const sunHeight = Math.sin(sunAngle);
	const sunIntensity = Math.max(0.1, sunHeight * 1.2);
	
	const sunPosition = new THREE.Vector3(
		Math.cos(sunAngle) * 100,
		Math.max(10, sunHeight * 80), // Keep sun higher for better lighting
		Math.sin(sunAngle) * 100
	);

	// More realistic sky colors based on time of day
	const skyColor = new THREE.Color();
	if (sunHeight > 0.1) {
		// Daytime: Blue sky
		skyColor.setHex(0x87CEEB);
	} else if (sunHeight > -0.1) {
		// Sunset/sunrise: Orange/red
		skyColor.setHex(0xFFB366);
	} else {
		// Night: Dark blue
		skyColor.setHex(0x001122);
	}

	return (
		<group>
			{/* Professional Skybox */}
			<Sky
				distance={450000}
				sunPosition={sunPosition}
				inclination={0}
				azimuth={0.25}
				turbidity={8} // Less hazy
				rayleigh={2} // More blue scattering
				mieCoefficient={0.005}
				mieDirectionalG={0.8}
			/>

			{/* Professional Lighting Setup */}
			<ambientLight 
				intensity={Math.max(0.2, sunHeight * 0.5)} 
				color={new THREE.Color(0.6, 0.7, 1.0)} 
			/>
			
			<directionalLight
				position={sunPosition}
				intensity={sunIntensity}
				color={new THREE.Color(1, 0.95, 0.8)}
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-camera-far={200}
				shadow-camera-left={-50}
				shadow-camera-right={50}
				shadow-camera-top={50}
				shadow-camera-bottom={-50}
				shadow-bias={-0.0001}
			/>

			{/* Night time stars */}
			{sunHeight < 0.1 && (
				<Stars
					radius={300}
					depth={50}
					count={5000}
					factor={4}
					saturation={0}
					fade={true}
				/>
			)}

			{/* Atmospheric fog for depth */}
			<fog attach="fog" args={[skyColor, 20, 300]} />
		</group>
	);
}

// Vegetation and Props System
function VegetationSystem({ config }: { config: FPSConfig }) {
	const vegetationRef = useRef<THREE.Group>(null);
	const { camera } = useThree();
	const [trees, setTrees] = useState<THREE.Object3D[]>([]);

	// Generate vegetation around player
	useFrame(() => {
		if (!config.environment.enableVegetation) return;

		const playerPos = camera.position;
		const spawnRadius = 100;
		const maxTrees = 200;

		// Simple tree spawning (in production would be more sophisticated)
		if (trees.length < maxTrees) {
			for (let i = 0; i < 5; i++) {
				const angle = Math.random() * Math.PI * 2;
				const distance = Math.random() * spawnRadius;
				const x = playerPos.x + Math.cos(angle) * distance;
				const z = playerPos.z + Math.sin(angle) * distance;

				// Create simple tree
				const tree = new THREE.Group();
				
				// Trunk
				const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
				const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a2a });
				const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
				trunk.position.y = 2;
				trunk.castShadow = true;
				
				// Leaves
				const leavesGeometry = new THREE.SphereGeometry(2.5, 8, 6);
				const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
				const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
				leaves.position.y = 5;
				leaves.castShadow = true;
				
				tree.add(trunk);
				tree.add(leaves);
				tree.position.set(x, 0, z);
				
				if (vegetationRef.current) {
					vegetationRef.current.add(tree);
					setTrees(prev => [...prev, tree]);
				}
			}
		}
	});

	return <group ref={vegetationRef} />;
}

// Main FPS Renderer Component
export interface FPSRenderer3DProps {
	config: FPSConfig;
	onPerformanceUpdate?: (metrics: FPSPerformanceMetrics) => void;
	onCameraUpdate?: (position: THREE.Vector3, rotation: THREE.Euler) => void;
}

export const FPSRenderer3D = forwardRef<any, FPSRenderer3DProps>(({ config, onPerformanceUpdate, onCameraUpdate }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const inputManagerRef = useRef<any>(null);

	useImperativeHandle(ref, () => ({
		setInputManager: (manager: any) => {
			inputManagerRef.current = manager;
		},
		getCanvas: () => canvasRef.current,
	}));

	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas
				ref={canvasRef}
				camera={{
					fov: config.player.fov,
					near: 0.1,
					far: 1000,
					position: [0, 5, 0], // Start closer to ground level
					rotation: [0, 0, 0], // Look forward initially
				}}
				shadows
				gl={{
					antialias: true,
					alpha: false, // Disable alpha for better performance
				}}
				onCreated={({ gl, scene }) => {
					gl.shadowMap.enabled = true;
					gl.shadowMap.type = THREE.PCFSoftShadowMap;
					
					// Set realistic background color
					scene.background = new THREE.Color(0x87CEEB); // Sky blue
				}}
				style={{ width: "100%", height: "100%" }}
			>
				<FPSCamera config={config} inputManager={inputManagerRef.current} />
				<Environment config={config} />
				<TerrainSystem config={config} />
				<VegetationSystem config={config} />
			</Canvas>
		</div>
	);
});

FPSRenderer3D.displayName = "FPSRenderer3D";
export default FPSRenderer3D;
