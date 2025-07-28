/**
 * @file fps-renderer-3d.tsx
 * @description Professional AAA-Quality FPS Renderer 
 * @version 4.0.0 - High-End Gaming Quality
 * @author Galactic Clans Development Team
 * 
 * @features
 * - Advanced multi-octave terrain generation
 * - Professional lighting with high-quality shadows
 * - Instanced foliage system for performance
 * - Realistic water simulation
 * - Enhanced FPS controls with smooth movement
 * - Professional visual effects
 */

'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Sky, Stars } from "@react-three/drei";
import { EffectComposer, SSAO, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { createNoise2D, createNoise3D } from "simplex-noise";
import { useGamepadController } from "@/hooks/useGamepadController";

// FPS Config interface
interface FPSConfig {
	player: {
		mouseSensitivity: number;
		walkSpeed: number;
		runSpeed: number;
		jumpHeight: number;
		playerRadius: number;
		playerHeight: number;
		fov: number;
	};
	environment: {
		gravity: number;
	};
}

// Advanced terrain generation engine
class ProfessionalTerrainEngine {
	private noise2D: (x: number, y: number) => number;
	private noise3D: (x: number, y: number, z: number) => number;
	private ridgeNoise: (x: number, y: number) => number;
	private erosionNoise: (x: number, y: number) => number;
	
	constructor() {
		this.noise2D = createNoise2D();
		this.noise3D = createNoise3D();
		this.ridgeNoise = createNoise2D();
		this.erosionNoise = createNoise2D();
	}
	
	// Multi-octave terrain height with geological realism
	getTerrainHeight(x: number, z: number): number {
		const scale = 0.01;
		const amplitude = 20;
		
		// Base terrain with multiple octaves for detail
		let height = 0;
		let currentAmplitude = amplitude;
		let currentScale = scale;
		
		// 8 octaves for highly detailed terrain
		for (let i = 0; i < 8; i++) {
			height += this.noise2D(x * currentScale, z * currentScale) * currentAmplitude;
			currentAmplitude *= 0.5;
			currentScale *= 2.1;
		}
		
		// Ridge features for mountain ranges
		const ridges = Math.abs(this.ridgeNoise(x * 0.003, z * 0.003)) * 12;
		height += ridges;
		
		// Erosion effects for realistic valleys
		const erosion = this.erosionNoise(x * 0.015, z * 0.015) * 3;
		height = Math.max(height - Math.abs(erosion), -1.5);
		
		return height;
	}
	
	// Determine biome for realistic coloring
	getBiome(x: number, z: number): string {
		const height = this.getTerrainHeight(x, z);
		const moisture = this.noise2D(x * 0.002, z * 0.002);
		const temperature = this.noise2D(x * 0.001, z * 0.001);
		
		if (height < 0) return 'water';
		if (height < 3) return moisture > 0.2 ? 'swamp' : 'beach';
		if (height < 8) {
			if (temperature > 0.3) return moisture > 0 ? 'forest' : 'grassland';
			return 'tundra';
		}
		if (height < 18) return temperature > 0 ? 'mountain' : 'snow';
		return 'snow';
	}
}

// Professional water simulation with realistic waves
function ProfessionalWaterSystem() {
	const waterRef = useRef<THREE.Mesh>(null);
	
	useFrame((state) => {
		if (!waterRef.current) return;
		
		const time = state.clock.elapsedTime;
		const geometry = waterRef.current.geometry as THREE.PlaneGeometry;
		const positions = geometry.attributes.position.array as Float32Array;
		
		// Create realistic wave motion
		for (let i = 0; i < positions.length; i += 3) {
			const x = positions[i];
			const z = positions[i + 2];
			positions[i + 1] = 
				Math.sin(time * 0.8 + x * 0.02) * 0.15 + 
				Math.cos(time * 1.2 + z * 0.025) * 0.1 +
				Math.sin(time * 0.5 + (x + z) * 0.01) * 0.05;
		}
		
		geometry.attributes.position.needsUpdate = true;
		geometry.computeVertexNormals();
	});
	
	return (
		<mesh ref={waterRef} position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
			<planeGeometry args={[800, 800, 128, 128]} />
			<meshStandardMaterial
				color="#1e40af"
				transparent
				opacity={0.7}
				roughness={0.05}
				metalness={0.1}
				envMapIntensity={2}
			/>
		</mesh>
	);
}

// Advanced terrain system with LOD and biome coloring
function ProfessionalTerrainSystem({ terrainEngine }: { terrainEngine: ProfessionalTerrainEngine }) {
	const { camera } = useThree();
	const [chunks, setChunks] = useState<Map<string, THREE.BufferGeometry>>(new Map());
	
	// Professional terrain material
	const terrainMaterial = useMemo(() => {
		return new THREE.MeshStandardMaterial({
			vertexColors: true,
			roughness: 0.85,
			metalness: 0.05,
		});
	}, []);
	
	// Generate highly detailed terrain chunk
	const generateTerrainChunk = useCallback((chunkX: number, chunkZ: number, detail: number = 96) => {
		const size = 40;
		const geometry = new THREE.PlaneGeometry(size, size, detail, detail);
		const positions = geometry.attributes.position.array as Float32Array;
		const colors = new Float32Array(positions.length);
		
		// Generate heightmap with biome-based coloring
		for (let i = 0; i < positions.length; i += 3) {
			const localX = positions[i];
			const localZ = positions[i + 2];
			const worldX = chunkX * size + localX;
			const worldZ = chunkZ * size + localZ;
			
			// Set realistic height
			positions[i + 1] = terrainEngine.getTerrainHeight(worldX, worldZ);
			
			// Professional biome coloring
			const biome = terrainEngine.getBiome(worldX, worldZ);
			let r = 0.4, g = 0.6, b = 0.3; // Default grassland
			
			switch (biome) {
				case 'water': r = 0.1; g = 0.2; b = 0.8; break;
				case 'beach': r = 0.9; g = 0.8; b = 0.6; break;
				case 'swamp': r = 0.2; g = 0.4; b = 0.2; break;
				case 'forest': r = 0.15; g = 0.5; b = 0.15; break;
				case 'mountain': r = 0.5; g = 0.4; b = 0.3; break;
				case 'tundra': r = 0.6; g = 0.6; b = 0.5; break;
				case 'snow': r = 0.95; g = 0.95; b = 0.95; break;
			}
			
			// Add height-based variation
			const heightFactor = Math.max(0, positions[i + 1]) * 0.02;
			colors[i] = Math.min(1, r + heightFactor);
			colors[i + 1] = Math.min(1, g + heightFactor);
			colors[i + 2] = Math.min(1, b + heightFactor);
		}
		
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		geometry.computeVertexNormals();
		geometry.rotateX(-Math.PI / 2);
		
		return geometry;
	}, [terrainEngine]);
	
	// Intelligent LOD management
	useFrame(() => {
		const cameraPos = camera.position;
		const renderDistance = 6;
		const newChunks = new Map();
		
		for (let x = -renderDistance; x <= renderDistance; x++) {
			for (let z = -renderDistance; z <= renderDistance; z++) {
				const chunkX = Math.floor(cameraPos.x / 40) + x;
				const chunkZ = Math.floor(cameraPos.z / 40) + z;
				const key = `${chunkX},${chunkZ}`;
				
				if (!chunks.has(key)) {
					const distance = Math.sqrt(x * x + z * z);
					const detail = distance < 2 ? 96 : distance < 4 ? 64 : 32;
					const geometry = generateTerrainChunk(chunkX, chunkZ, detail);
					newChunks.set(key, geometry);
				} else {
					newChunks.set(key, chunks.get(key)!);
				}
			}
		}
		
		// Clean up distant chunks
		chunks.forEach((geometry, key) => {
			if (!newChunks.has(key)) {
				geometry.dispose();
			}
		});
		
		setChunks(newChunks);
	});
	
	return (
		<>
			{Array.from(chunks.entries()).map(([key, geometry]) => {
				const [chunkX, chunkZ] = key.split(',').map(Number);
				return (
					<mesh
						key={key}
						geometry={geometry}
						material={terrainMaterial}
						position={[chunkX * 40, 0, chunkZ * 40]}
						castShadow
						receiveShadow
					/>
				);
			})}
		</>
	);
}

// Professional foliage system with instancing
function ProfessionalFoliageSystem({ terrainEngine }: { terrainEngine: ProfessionalTerrainEngine }) {
	const instancedTreesRef = useRef<THREE.InstancedMesh>(null);
	const instancedGrassRef = useRef<THREE.InstancedMesh>(null);
	
	useEffect(() => {
		if (!instancedTreesRef.current || !instancedGrassRef.current) return;
		
		const treeCount = 800;
		const grassCount = 2000;
		const matrix = new THREE.Matrix4();
		const color = new THREE.Color();
		
		// Generate realistic trees
		for (let i = 0; i < treeCount; i++) {
			const x = (Math.random() - 0.5) * 300;
			const z = (Math.random() - 0.5) * 300;
			const y = terrainEngine.getTerrainHeight(x, z);
			const biome = terrainEngine.getBiome(x, z);
			
			if ((biome === 'forest' || biome === 'grassland') && y > 0) {
				const scale = 0.8 + Math.random() * 2.0;
				matrix.compose(
					new THREE.Vector3(x, y + scale * 0.8, z),
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2),
					new THREE.Vector3(scale, scale, scale)
				);
				instancedTreesRef.current.setMatrixAt(i, matrix);
				
				color.setHSL(0.3 + Math.random() * 0.1, 0.7, 0.2 + Math.random() * 0.3);
				instancedTreesRef.current.setColorAt(i, color);
			}
		}
		
		// Generate realistic grass
		for (let i = 0; i < grassCount; i++) {
			const x = (Math.random() - 0.5) * 400;
			const z = (Math.random() - 0.5) * 400;
			const y = terrainEngine.getTerrainHeight(x, z);
			const biome = terrainEngine.getBiome(x, z);
			
			if ((biome === 'grassland' || biome === 'forest') && y > 0) {
				const scale = 0.3 + Math.random() * 0.4;
				matrix.compose(
					new THREE.Vector3(x, y, z),
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2),
					new THREE.Vector3(scale, scale + Math.random() * 0.8, scale)
				);
				instancedGrassRef.current.setMatrixAt(i, matrix);
				
				color.setHSL(0.28, 0.8, 0.25 + Math.random() * 0.4);
				instancedGrassRef.current.setColorAt(i, color);
			}
		}
		
		instancedTreesRef.current.instanceMatrix.needsUpdate = true;
		if (instancedTreesRef.current.instanceColor) instancedTreesRef.current.instanceColor.needsUpdate = true;
		instancedGrassRef.current.instanceMatrix.needsUpdate = true;
		if (instancedGrassRef.current.instanceColor) instancedGrassRef.current.instanceColor.needsUpdate = true;
	}, [terrainEngine]);
	
	return (
		<>
			<instancedMesh ref={instancedTreesRef} args={[undefined, undefined, 800]} castShadow>
				<cylinderGeometry args={[0.15, 0.25, 3]} />
				<meshStandardMaterial roughness={0.9} />
			</instancedMesh>
			
			<instancedMesh ref={instancedGrassRef} args={[undefined, undefined, 2000]}>
				<planeGeometry args={[0.15, 0.8]} />
				<meshStandardMaterial
					transparent
					alphaTest={0.6}
					roughness={0.95}
					side={THREE.DoubleSide}
				/>
			</instancedMesh>
		</>
	);
}

// Professional lighting system
function ProfessionalLightingSystem() {
	const sunRef = useRef<THREE.DirectionalLight>(null);
	const [timeOfDay, setTimeOfDay] = useState(0.3);
	
	useFrame((state, delta) => {
		if (!sunRef.current) return;
		
		// Dynamic day/night cycle
		setTimeOfDay(prev => (prev + delta * 0.01) % 1);
		
		const sunAngle = timeOfDay * Math.PI * 2;
		const sunPosition = new THREE.Vector3(
			Math.cos(sunAngle) * 100,
			Math.sin(sunAngle) * 80 + 20,
			Math.sin(sunAngle) * 100
		);
		
		sunRef.current.position.copy(sunPosition);
		sunRef.current.target.position.set(0, 0, 0);
		
		// Dynamic intensity and color
		const dayIntensity = Math.max(0.2, Math.sin(sunAngle) * 0.8 + 0.5);
		sunRef.current.intensity = dayIntensity;
		
		const sunColor = new THREE.Color().setHSL(0.08, 0.3, 0.8 + dayIntensity * 0.2);
		sunRef.current.color = sunColor;
	});
	
	return (
		<>
			<directionalLight
				ref={sunRef}
				intensity={1}
				castShadow
				shadow-mapSize={[8192, 8192]}
				shadow-camera-far={400}
				shadow-camera-left={-100}
				shadow-camera-right={100}
				shadow-camera-top={100}
				shadow-camera-bottom={-100}
				shadow-bias={-0.0002}
				shadow-normalBias={0.02}
			/>
			
			<ambientLight color="#4A90E2" intensity={0.25} />
			
			<hemisphereLight
				skyColor="#87CEEB"
				groundColor="#2F4F2F"
				intensity={0.4}
			/>
		</>
	);
}

// Enhanced FPS Arms with professional animation
function ProfessionalFPSArms({ 
	position, 
	cameraRotation, 
	isMoving, 
	isRunning, 
	isCrouching 
}: { 
	position: THREE.Vector3;
	cameraRotation: { pitch: number; yaw: number };
	isMoving: boolean;
	isRunning: boolean;
	isCrouching: boolean;
}) {
	const armsRef = useRef<THREE.Group>(null);
	const { camera } = useThree();
	
	useFrame((state, delta) => {
		if (!armsRef.current) return;
		
		// Arms should follow camera position exactly
		const cameraPosition = camera.position.clone();
		armsRef.current.position.copy(cameraPosition);
		
		// Arms should match camera rotation exactly
		armsRef.current.rotation.order = 'YXZ';
		armsRef.current.rotation.y = cameraRotation.yaw;
		armsRef.current.rotation.x = cameraRotation.pitch;
		armsRef.current.rotation.z = 0;
		
		const time = state.clock.elapsedTime;
		
		// Professional movement animation with offset from camera
		if (isMoving) {
			const speed = isRunning ? 12 : 8;
			const intensity = isRunning ? 0.012 : 0.008;
			
			const walkBob = Math.sin(time * speed) * intensity;
			const walkSway = Math.cos(time * speed * 0.5) * intensity * 0.5;
			
			// Apply movement animation as offset from camera position
			armsRef.current.position.y += walkBob;
			armsRef.current.position.x += walkSway;
			armsRef.current.rotation.z += walkSway * 2;
		} else {
			// Breathing animation
			const breathingIntensity = 0.002;
			const breathingOffset = Math.sin(time * 1.2) * breathingIntensity;
			armsRef.current.position.y += breathingOffset;
		}
		
		// Slight offset for crouch
		if (isCrouching) {
			armsRef.current.position.y -= 0.3;
		}
	});
	
	return (
		<group ref={armsRef}>
			{/* Left Arm - positioned relative to camera view */}
			<group position={[-0.4, -0.3, 0.2]}>
				<mesh position={[0, -0.15, 0]} castShadow>
					<cylinderGeometry args={[0.05, 0.06, 0.35]} />
					<meshStandardMaterial color="#F5DEB3" roughness={0.8} />
				</mesh>
				<mesh position={[0, -0.4, 0.15]} castShadow>
					<cylinderGeometry args={[0.04, 0.05, 0.28]} />
					<meshStandardMaterial color="#F5DEB3" roughness={0.8} />
				</mesh>
				<mesh position={[0, -0.55, 0.25]} castShadow>
					<boxGeometry args={[0.08, 0.1, 0.15]} />
					<meshStandardMaterial color="#F5DEB3" roughness={0.9} />
				</mesh>
			</group>
			
			{/* Right Arm - positioned relative to camera view */}
			<group position={[0.4, -0.3, 0.2]}>
				<mesh position={[0, -0.15, 0]} castShadow>
					<cylinderGeometry args={[0.05, 0.06, 0.35]} />
					<meshStandardMaterial color="#F5DEB3" roughness={0.8} />
				</mesh>
				<mesh position={[0, -0.4, 0.15]} castShadow>
					<cylinderGeometry args={[0.04, 0.05, 0.28]} />
					<meshStandardMaterial color="#F5DEB3" roughness={0.8} />
				</mesh>
				<mesh position={[0, -0.55, 0.25]} castShadow>
					<boxGeometry args={[0.08, 0.1, 0.15]} />
					<meshStandardMaterial color="#F5DEB3" roughness={0.9} />
				</mesh>
			</group>
		</group>
	);
}

// Professional FPS Player Controller
function ProfessionalFPSPlayer({ config }: { config: FPSConfig }) {
	const playerRef = useRef<THREE.Group>(null);
	const { camera, gl } = useThree();
	const [isPointerLocked, setIsPointerLocked] = useState(false);
	const terrainEngine = useMemo(() => new ProfessionalTerrainEngine(), []);
	
	// Professional FPS camera rotation state
	const cameraRotation = useRef({
		yaw: 0,
		pitch: 0,
		targetYaw: 0,
		targetPitch: 0,
	});
	
	const movement = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false,
		run: false,
		crouch: false,
		forwardAmount: 0,
		backwardAmount: 0,
		leftAmount: 0,
		rightAmount: 0,
	});
	
	const { gamepadState, isConnected: isGamepadConnected } = useGamepadController({
		deadzone: 0.2,
		enableHaptics: true,
		actions: {
			onPrimaryAction: () => movement.current.jump = true,
			onSecondaryAction: () => movement.current.run = !movement.current.run,
			onBackAction: () => {
				if (document.pointerLockElement) {
					document.exitPointerLock();
				}
			}
		}
	});
	
	// Professional FPS camera positioning - matches industry standards
	const getInitialPosition = useCallback(() => {
		const terrainHeight = terrainEngine.getTerrainHeight(0, 0);
		const groundLevel = Math.max(terrainHeight + 1.75, 1.75); // Standard player height
		return new THREE.Vector3(0, groundLevel, 0);
	}, [terrainEngine]);
	
	const [position, setPosition] = useState<THREE.Vector3>(getInitialPosition());
	const [velocity, setVelocity] = useState<THREE.Vector3>(new THREE.Vector3());
	const [horizontalVelocity, setHorizontalVelocity] = useState<THREE.Vector3>(new THREE.Vector3());
	const [isMoving, setIsMoving] = useState(false);
	
	// Initialize professional FPS camera settings
	useEffect(() => {
		if (camera) {
			// Professional FPS camera settings (industry standard)
			camera.fov = 90; // Standard FPS FOV (Call of Duty, Counter-Strike style)
			camera.near = 0.01; // Very close near plane for weapon visibility
			camera.far = 1000; // Reasonable far plane for performance
			camera.position.copy(getInitialPosition());
			
			// Professional FPS camera positioning
			const eyeHeight = 1.62; // Standard eye height (5'4" person)
			camera.position.y += eyeHeight;
			
			// Look straight ahead initially (industry standard)
			camera.rotation.set(0, 0, 0);
			camera.updateProjectionMatrix();
			
			// Initialize camera rotation state
			cameraRotation.current.yaw = 0;
			cameraRotation.current.pitch = 0;
			cameraRotation.current.targetYaw = 0;
			cameraRotation.current.targetPitch = 0;
		}
	}, [camera]); // Only depend on camera, getInitialPosition is stable
	
	// Professional keyboard controls
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'KeyW': movement.current.forward = true; break;
				case 'KeyS': movement.current.backward = true; break;
				case 'KeyA': movement.current.left = true; break;
				case 'KeyD': movement.current.right = true; break;
				case 'Space': movement.current.jump = true; event.preventDefault(); break;
				case 'ShiftLeft': movement.current.run = true; break;
				case 'ControlLeft': movement.current.crouch = true; break;
				case 'Escape':
					if (document.pointerLockElement) {
						document.exitPointerLock();
					}
					break;
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'KeyW': movement.current.forward = false; break;
				case 'KeyS': movement.current.backward = false; break;
				case 'KeyA': movement.current.left = false; break;
				case 'KeyD': movement.current.right = false; break;
				case 'Space': movement.current.jump = false; break;
				case 'ShiftLeft': movement.current.run = false; break;
				case 'ControlLeft': movement.current.crouch = false; break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []); // Empty dependency array - event handlers don't depend on props
	
	// Professional pointer lock setup
	useEffect(() => {
		const handlePointerLockChange = () => {
			const isLocked = document.pointerLockElement === gl.domElement;
			setIsPointerLocked(isLocked);
		};

		const handleClick = () => {
			if (!isPointerLocked) {
				gl.domElement.requestPointerLock();
			}
		};

		document.addEventListener('pointerlockchange', handlePointerLockChange);
		gl.domElement.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('pointerlockchange', handlePointerLockChange);
			gl.domElement.removeEventListener('click', handleClick);
		};
	}, [gl.domElement, isPointerLocked]); // Consistent dependency array
	
	// Professional mouse look with industry-standard sensitivity
	useEffect(() => {
		if (!isPointerLocked) return;

		const handleMouseMove = (event: MouseEvent) => {
			// Professional FPS sensitivity (matches CS:GO/Call of Duty standards)
			const sensitivity = config.player.mouseSensitivity * 0.002;
			
			cameraRotation.current.targetYaw -= event.movementX * sensitivity;
			cameraRotation.current.targetPitch -= event.movementY * sensitivity;
			
			// Industry standard pitch limits (90 degrees up/down)
			cameraRotation.current.targetPitch = Math.max(
				-Math.PI / 2 + 0.01,
				Math.min(Math.PI / 2 - 0.01, cameraRotation.current.targetPitch)
			);
		};

		document.addEventListener('mousemove', handleMouseMove);
		return () => document.removeEventListener('mousemove', handleMouseMove);
	}, [isPointerLocked, config.player.mouseSensitivity]); // Consistent dependency array
	
	// Professional physics and movement
	useFrame((state, delta) => {
		if (!playerRef.current) return;
		
		// Professional camera smoothing (responsive but stable)
		const cameraSmoothing = 25; // Industry standard responsiveness
		
		cameraRotation.current.yaw = THREE.MathUtils.lerp(
			cameraRotation.current.yaw,
			cameraRotation.current.targetYaw,
			cameraSmoothing * delta
		);
		cameraRotation.current.pitch = THREE.MathUtils.lerp(
			cameraRotation.current.pitch,
			cameraRotation.current.targetPitch,
			cameraSmoothing * delta
		);
		
		// Apply professional FPS camera rotation
		camera.rotation.order = 'YXZ';
		camera.rotation.y = cameraRotation.current.yaw;
		camera.rotation.x = cameraRotation.current.pitch;
		camera.rotation.z = 0;
		
		// Professional movement system
		const baseSpeed = movement.current.run ? config.player.runSpeed * 1.5 : config.player.walkSpeed;
		const crouchMultiplier = movement.current.crouch ? 0.4 : 1.0;
		const maxSpeed = baseSpeed * crouchMultiplier;
		
		const acceleration = 20;
		const deceleration = 18;
		const smoothingSpeed = 12;
		
		// Input smoothing
		const targetForward = movement.current.forward ? 1 : 0;
		const targetBackward = movement.current.backward ? 1 : 0;
		const targetLeft = movement.current.left ? 1 : 0;
		const targetRight = movement.current.right ? 1 : 0;
		
		movement.current.forwardAmount = THREE.MathUtils.lerp(movement.current.forwardAmount, targetForward, smoothingSpeed * delta);
		movement.current.backwardAmount = THREE.MathUtils.lerp(movement.current.backwardAmount, targetBackward, smoothingSpeed * delta);
		movement.current.leftAmount = THREE.MathUtils.lerp(movement.current.leftAmount, targetLeft, smoothingSpeed * delta);
		movement.current.rightAmount = THREE.MathUtils.lerp(movement.current.rightAmount, targetRight, smoothingSpeed * delta);
		
		const movementIntensity = movement.current.forwardAmount + movement.current.backwardAmount + 
		                         movement.current.leftAmount + movement.current.rightAmount;
		setIsMoving(movementIntensity > 0.1);
		
		// Professional movement calculation
		if (isPointerLocked || isGamepadConnected) {
			const forward = new THREE.Vector3(0, 0, -1);
			forward.applyQuaternion(camera.quaternion);
			forward.y = 0;
			forward.normalize();

			const right = new THREE.Vector3(1, 0, 0);
			right.applyQuaternion(camera.quaternion);
			right.normalize();

			let inputVector = new THREE.Vector3(0, 0, 0);
			
			inputVector.add(forward.clone().multiplyScalar(movement.current.forwardAmount - movement.current.backwardAmount));
			inputVector.add(right.clone().multiplyScalar(movement.current.rightAmount - movement.current.leftAmount));
			
			if (isGamepadConnected && gamepadState) {
				const leftStickX = gamepadState.leftStick.x || 0;
				const leftStickY = gamepadState.leftStick.y || 0;
				
				inputVector.add(forward.clone().multiplyScalar(-leftStickY));
				inputVector.add(right.clone().multiplyScalar(leftStickX));
			}
			
			if (inputVector.length() > 1) {
				inputVector.normalize();
			}
			
			const targetVelocity = inputVector.multiplyScalar(maxSpeed);
			const currentHorizontalVel = horizontalVelocity.clone();
			const velDiff = targetVelocity.clone().sub(currentHorizontalVel);
			const accelRate = velDiff.length() > 0.1 ? acceleration : deceleration;
			
			const newHorizontalVel = currentHorizontalVel.add(velDiff.multiplyScalar(accelRate * delta));
			
			if (newHorizontalVel.length() > maxSpeed) {
				newHorizontalVel.normalize().multiplyScalar(maxSpeed);
			}
			
			setHorizontalVelocity(newHorizontalVel);
			
			// Gamepad camera with professional sensitivity
			if (isGamepadConnected && gamepadState && isPointerLocked) {
				const rightStickX = gamepadState.rightStick.x || 0;
				const rightStickY = gamepadState.rightStick.y || 0;
				
				const gamepadSensitivity = config.player.mouseSensitivity * 0.04;
				
				cameraRotation.current.targetYaw -= rightStickX * gamepadSensitivity * delta;
				cameraRotation.current.targetPitch -= rightStickY * gamepadSensitivity * delta;
				
				cameraRotation.current.targetPitch = Math.max(
					-Math.PI / 2 + 0.01,
					Math.min(Math.PI / 2 - 0.01, cameraRotation.current.targetPitch)
				);
			}
		} else {
			const newHorizontalVel = horizontalVelocity.clone().multiplyScalar(Math.pow(0.02, delta));
			setHorizontalVelocity(newHorizontalVel);
		}
		
		// Professional gravity and jumping
		const newVelocity = velocity.clone();
		newVelocity.y -= config.environment.gravity * delta;
		
		if (movement.current.jump) {
			const terrainHeight = terrainEngine.getTerrainHeight(position.x, position.z);
			const groundLevel = terrainHeight + 1.75; // Standard player height
			
			if (Math.abs(position.y - groundLevel) < 0.4) {
				newVelocity.y = config.player.jumpHeight * 1.2;
				movement.current.jump = false;
			}
		}
		
		const finalVelocity = new THREE.Vector3(
			horizontalVelocity.x,
			newVelocity.y,
			horizontalVelocity.z
		);
		
		const newPosition = position.clone().add(finalVelocity.clone().multiplyScalar(delta));
		
		// Professional terrain collision
		const terrainHeight = terrainEngine.getTerrainHeight(newPosition.x, newPosition.z);
		const groundLevel = terrainHeight + 1.75; // Standard player height
		
		if (newPosition.y < groundLevel) {
			newPosition.y = groundLevel;
			newVelocity.y = 0;
		}
		
		setPosition(newPosition);
		setVelocity(newVelocity);
		
		// Professional FPS camera positioning (industry standard)
		const eyeHeight = movement.current.crouch ? 1.2 : 1.62; // 5'4" eye height standard
		const cameraPosition = newPosition.clone();
		cameraPosition.y += eyeHeight;
		
		// Instant camera following for professional responsiveness
		camera.position.copy(cameraPosition);
	});
	
	if (!isPointerLocked) {
		return (
			<Html center>
				<div className="pointer-events-auto text-center p-10 bg-gradient-to-br from-black/95 to-slate-900/95 backdrop-blur-lg rounded-2xl border border-cyan-400/50 shadow-2xl">
					<div className="text-white mb-4 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
						🎮 Professional FPS
					</div>
					<div className="text-cyan-300 text-lg mb-6 font-medium">Click to enter FPS mode</div>
					<div className="text-sm text-slate-300 space-y-3 max-w-md leading-relaxed">
						{isGamepadConnected ? (
							<>
								<div className="font-bold text-cyan-400">🎮 Controller Ready:</div>
								<div>Left Stick: Move • Right Stick: Look</div>
								<div>A: Jump • B: Run • Select: Exit</div>
								<div className="mt-4 font-bold text-blue-400">⌨️ Keyboard Available:</div>
								<div>WASD: Move • Mouse: Look • Shift: Run</div>
								<div>Ctrl: Crouch • Space: Jump • ESC: Exit</div>
							</>
						) : (
							<>
								<div className="font-bold text-cyan-400">⌨️ Professional FPS Controls:</div>
								<div>WASD: Move • Mouse: Look around</div>
								<div>Shift: Run • Ctrl: Crouch • Space: Jump</div>
								<div>ESC: Exit FPS mode</div>
								<div className="text-xs text-cyan-200 mt-2">90° FOV • Professional sensitivity</div>
							</>
						)}
					</div>
				</div>
			</Html>
		);
	}
	
	return (
		<>
			<group ref={playerRef} position={[position.x, position.y, position.z]}>
				<mesh visible={false}>
					<capsuleGeometry args={[config.player.playerRadius, config.player.playerHeight]} />
					<meshBasicMaterial />
				</mesh>
			</group>
			
			<ProfessionalFPSArms 
				position={position} 
				cameraRotation={{
					pitch: cameraRotation.current.pitch,
					yaw: cameraRotation.current.yaw
				}}
				isMoving={isMoving}
				isRunning={movement.current.run}
				isCrouching={movement.current.crouch}
			/>
		</>
	);
}

// Main Professional FPS Renderer
export function FPSRenderer3D({ 
	config, 
	onPerformanceUpdate 
}: { 
	config: FPSConfig;
	onPerformanceUpdate?: (metrics: any) => void;
}) {
	const terrainEngine = useMemo(() => new ProfessionalTerrainEngine(), []);
	
	return (
		<div className="w-full h-full relative bg-gradient-to-b from-blue-900 to-slate-900">
			<Canvas
				camera={{ 
					fov: 90,        // Industry standard FPS FOV (Call of Duty, Counter-Strike)
					near: 0.01,     // Very close near plane for weapon/arm visibility
					far: 1000,      // Optimized far plane for performance
					position: [0, 5, 0]  // Will be overridden by FPS player positioning
				}}
				shadows="percentage"
				gl={{ 
					antialias: true,
					powerPreference: "high-performance",
					alpha: false,
					depth: true,
					stencil: false,
					preserveDrawingBuffer: false
				}}
				onCreated={({ gl, scene }) => {
					gl.setClearColor(new THREE.Color('#1e3a8a'), 1);
					gl.shadowMap.enabled = true;
					gl.shadowMap.type = THREE.PCFSoftShadowMap;
					gl.toneMapping = THREE.ACESFilmicToneMapping;
					gl.toneMappingExposure = 1.2;
					gl.outputEncoding = THREE.sRGBEncoding;
					
					scene.fog = new THREE.Fog('#1e3a8a', 100, 800);
				}}
			>
				<Suspense fallback={null}>
					<Sky
						distance={450000}
						sunPosition={[100, 30, 100]}
						inclination={0}
						azimuth={0.25}
						mieCoefficient={0.003}
						mieDirectionalG={0.85}
						rayleigh={0.8}
						turbidity={0.5}
					/>
					
					<ProfessionalLightingSystem />
					<ProfessionalTerrainSystem terrainEngine={terrainEngine} />
					<ProfessionalWaterSystem />
					<ProfessionalFoliageSystem terrainEngine={terrainEngine} />
					
					<Stars radius={500} depth={80} count={2000} factor={6} saturation={0} fade speed={1} />
					
					<EffectComposer>
						<SSAO
							intensity={0.3}
							radius={0.5}
							lumInfluence={0.4}
							bias={0.025}
							samples={16}
							rings={4}
						/>
						<Bloom
							intensity={0.4}
							luminanceThreshold={0.85}
							luminanceSmoothing={0.025}
						/>
						<Vignette
							eskil={false}
							offset={0.1}
							darkness={0.5}
						/>
						<ChromaticAberration
							offset={[0.0005, 0.0012]}
						/>
					</EffectComposer>
					
					<ProfessionalFPSPlayer config={config} />
				</Suspense>
			</Canvas>
		</div>
	);
}
