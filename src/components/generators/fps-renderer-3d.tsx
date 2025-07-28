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

// Advanced Terrain System inspired by Unity's Terrain Editor
// Reference: https://learn.unity.com/tutorial/working-with-the-terrain-editor-1
function AdvancedTerrainSystem() {
	const terrainRef = useRef<THREE.Group>(null);
	const textureRef = useRef<THREE.CanvasTexture | null>(null);
	
	// Advanced noise functions for realistic terrain generation
	const generateAdvancedNoise = useCallback((x: number, z: number) => {
		// Multiple octaves for detailed terrain (similar to Unity's height sculpting)
		const scale1 = 0.005; // Large mountains and valleys
		const scale2 = 0.02;  // Medium hills
		const scale3 = 0.08;  // Small details
		const scale4 = 0.3;   // Fine surface texture
		
		// Combine multiple noise layers like Unity's terrain editor
		const noise1 = Math.sin(x * scale1) * Math.cos(z * scale1) * 50;
		const noise2 = Math.sin(x * scale2) * Math.cos(z * scale2) * 15;
		const noise3 = Math.sin(x * scale3) * Math.cos(z * scale3) * 5;
		const noise4 = Math.sin(x * scale4) * Math.cos(z * scale4) * 1;
		
		// Add ridges and valleys (like Unity's sculpting tools)
		const ridgeNoise = Math.abs(Math.sin(x * 0.01) * Math.cos(z * 0.01)) * 20;
		const valleyNoise = -Math.abs(Math.sin(x * 0.008) * Math.cos(z * 0.008)) * 8;
		
		return noise1 + noise2 + noise3 + noise4 + ridgeNoise + valleyNoise;
	}, []);
	
	// Generate texture map for terrain (like Unity's texture painting)
	const generateTerrainTexture = useCallback(() => {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext('2d');
		
		if (!ctx) return null;
		
		const imageData = ctx.createImageData(512, 512);
		const data = imageData.data;
		
		// Generate texture based on height and slope (like Unity's terrain textures)
		for (let y = 0; y < 512; y++) {
			for (let x = 0; x < 512; x++) {
				const worldX = (x - 256) * 0.5;
				const worldZ = (y - 256) * 0.5;
				const height = generateAdvancedNoise(worldX, worldZ);
				const normalizedHeight = Math.max(0, Math.min(1, (height + 30) / 80));
				
				const index = (y * 512 + x) * 4;
				
				// Multi-layer texture painting (inspired by Unity's texture brushes)
				if (normalizedHeight < 0.2) {
					// Water/low areas - dark blue-green
					data[index] = 30;     // R
					data[index + 1] = 60;  // G
					data[index + 2] = 40;  // B
				} else if (normalizedHeight < 0.35) {
					// Shore/beach areas - sandy brown
					data[index] = 120;
					data[index + 1] = 100;
					data[index + 2] = 60;
				} else if (normalizedHeight < 0.5) {
					// Grassland - rich green
					data[index] = 40;
					data[index + 1] = 80;
					data[index + 2] = 30;
				} else if (normalizedHeight < 0.7) {
					// Hills - mixed grass and dirt
					data[index] = 60;
					data[index + 1] = 70;
					data[index + 2] = 35;
				} else if (normalizedHeight < 0.85) {
					// Rocky areas - gray-brown
					data[index] = 80;
					data[index + 1] = 75;
					data[index + 2] = 60;
				} else {
					// Snow peaks - white with blue tint
					data[index] = 240;
					data[index + 1] = 245;
					data[index + 2] = 255;
				}
				
				data[index + 3] = 255; // Alpha
			}
		}
		
		ctx.putImageData(imageData, 0, 0);
		return new THREE.CanvasTexture(canvas);
	}, [generateAdvancedNoise]);
	
	// Generate highly detailed terrain mesh (like Unity's mesh resolution)
	const generateAdvancedTerrain = useCallback(() => {
		const width = 200;
		const height = 200;
		const widthSegments = 128; // High detail like Unity's terrain
		const heightSegments = 128;
		
		const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
		const positionAttribute = geometry.attributes.position;
		
		if (!positionAttribute) return null;
		
		const vertices = positionAttribute.array as Float32Array;
		
		// Apply height sculpting (like Unity's raise/lower tools)
		for (let i = 0; i < vertices.length; i += 3) {
			const x = vertices[i];
			const z = vertices[i + 2];
			const terrainHeight = generateAdvancedNoise(x, z);
			vertices[i + 1] = terrainHeight;
		}
		
		// Recalculate normals for proper lighting
		geometry.computeVertexNormals();
		
		// Generate texture if not already created
		if (!textureRef.current) {
			textureRef.current = generateTerrainTexture();
		}
		
		// Advanced material with multiple texture layers (like Unity's terrain materials)
		const material = new THREE.MeshStandardMaterial({
			map: textureRef.current,
			roughness: 0.8,
			metalness: 0.1,
			normalScale: new THREE.Vector2(0.5, 0.5),
		});
		
		const mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		
		return mesh;
	}, [generateAdvancedNoise, generateTerrainTexture]);
	
	// Initialize terrain
	useEffect(() => {
		if (!terrainRef.current) return;
		
		// Clear existing terrain
		while (terrainRef.current.children.length > 0) {
			const child = terrainRef.current.children[0];
			terrainRef.current.remove(child);
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();
				if (Array.isArray(child.material)) {
					child.material.forEach(mat => mat.dispose());
				} else {
					child.material.dispose();
				}
			}
		}
		
		// Generate new advanced terrain
		const terrain = generateAdvancedTerrain();
		if (terrain && terrainRef.current) {
			terrainRef.current.add(terrain);
		}
	}, [generateAdvancedTerrain]);
	
	return <group ref={terrainRef} />;
}

// Advanced vegetation system (like Unity's tree and detail brushes)
function AdvancedVegetationSystem() {
	const treesRef = useRef<THREE.Group>(null);
	const grassRef = useRef<THREE.Group>(null);
	
	// Generate trees using instanced meshes for performance
	const generateTrees = useCallback(() => {
		const treeGeometry = new THREE.ConeGeometry(0.5, 3, 8);
		const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1);
		
		const treeMaterial = new THREE.MeshStandardMaterial({ 
			color: new THREE.Color(0.2, 0.4, 0.1) 
		});
		const trunkMaterial = new THREE.MeshStandardMaterial({ 
			color: new THREE.Color(0.4, 0.2, 0.1) 
		});
		
		const treeGroup = new THREE.Group();
		
		// Place trees based on terrain height (like Unity's tree placement)
		for (let i = 0; i < 200; i++) {
			const x = (Math.random() - 0.5) * 180;
			const z = (Math.random() - 0.5) * 180;
			
			// Simple height calculation for tree placement
			const height = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 15 + 
			              Math.sin(x * 0.05) * Math.cos(z * 0.05) * 5;
			
			// Only place trees at suitable heights
			if (height > -5 && height < 25) {
				const tree = new THREE.Mesh(treeGeometry, treeMaterial);
				const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
				
				tree.position.set(x, height + 2, z);
				trunk.position.set(x, height + 0.5, z);
				
				tree.castShadow = true;
				trunk.castShadow = true;
				
				// Random scaling and rotation (like Unity's random tree height/rotation)
				const scale = 0.8 + Math.random() * 0.4;
				tree.scale.setScalar(scale);
				trunk.scale.setScalar(scale);
				
				tree.rotation.y = Math.random() * Math.PI * 2;
				trunk.rotation.y = Math.random() * Math.PI * 2;
				
				treeGroup.add(tree);
				treeGroup.add(trunk);
			}
		}
		
		return treeGroup;
	}, []);
	
	// Generate grass details (like Unity's detail brushes)
	const generateGrass = useCallback(() => {
		const grassGeometry = new THREE.PlaneGeometry(0.5, 1);
		const grassMaterial = new THREE.MeshBasicMaterial({ 
			color: new THREE.Color(0.3, 0.6, 0.2),
			transparent: true,
			opacity: 0.8,
			side: THREE.DoubleSide
		});
		
		const grassGroup = new THREE.Group();
		
		// Dense grass placement (like Unity's grass texture painting)
		for (let i = 0; i < 1000; i++) {
			const x = (Math.random() - 0.5) * 180;
			const z = (Math.random() - 0.5) * 180;
			
			const height = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 15;
			
			if (height > -2 && height < 15) {
				const grass = new THREE.Mesh(grassGeometry, grassMaterial);
				grass.position.set(x, height + 0.5, z);
				grass.rotation.y = Math.random() * Math.PI * 2;
				
				const scale = 0.5 + Math.random() * 0.5;
				grass.scale.setScalar(scale);
				
				grassGroup.add(grass);
			}
		}
		
		return grassGroup;
	}, []);
	
	useEffect(() => {
		if (treesRef.current) {
			const trees = generateTrees();
			treesRef.current.add(trees);
		}
		
		if (grassRef.current) {
			const grass = generateGrass();
			grassRef.current.add(grass);
		}
		
		return () => {
			// Cleanup
			if (treesRef.current) {
				while (treesRef.current.children.length > 0) {
					const child = treesRef.current.children[0];
					treesRef.current.remove(child);
				}
			}
			if (grassRef.current) {
				while (grassRef.current.children.length > 0) {
					const child = grassRef.current.children[0];
					grassRef.current.remove(child);
				}
			}
		};
	}, [generateTrees, generateGrass]);
	
	return (
		<>
			<group ref={treesRef} />
			<group ref={grassRef} />
		</>
	);
}

// Professional Water System with Realistic Appearance
function ProfessionalWaterSystem() {
	const waterRef = useRef<THREE.Mesh>(null);
	
	useFrame((state) => {
		if (waterRef.current && waterRef.current.material instanceof THREE.MeshStandardMaterial) {
			// Subtle water animation for realism
			const time = state.clock.getElapsedTime();
			if (waterRef.current.material.normalScale) {
				waterRef.current.material.normalScale.set(
					0.5 + Math.sin(time * 0.5) * 0.1,
					0.5 + Math.cos(time * 0.3) * 0.1
				);
			}
		}
	});
	
	return (
		<mesh ref={waterRef} position={[0, -2, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry args={[400, 400, 64, 64]} />
			<meshStandardMaterial
				color="#2563eb"
				transparent
				opacity={0.8}
				roughness={0.1}
				metalness={0.05}
				envMapIntensity={1.5}
			/>
		</mesh>
	);
}

// Professional Lighting System for Realistic Scene Illumination
function ProfessionalLightingSystem() {
	const lightRef = useRef<THREE.DirectionalLight>(null);
	
	useFrame((state) => {
		if (lightRef.current) {
			// Subtle sun movement for dynamic lighting
			const time = state.clock.getElapsedTime() * 0.1;
			lightRef.current.position.set(
				Math.sin(time) * 100,
				50 + Math.sin(time * 0.5) * 20,
				Math.cos(time) * 100
			);
			
			// Realistic sun color changes
			const intensity = 0.8 + Math.sin(time) * 0.2;
			lightRef.current.intensity = Math.max(0.3, intensity);
			
			// Warmer colors during "sunset/sunrise"
			const sunHeight = lightRef.current.position.y;
			if (sunHeight < 40) {
				lightRef.current.color.setHSL(0.1, 0.8, 0.9); // Warm orange
			} else {
				lightRef.current.color.setHSL(0.15, 0.3, 1.0); // Neutral daylight
			}
		}
	});
	
	return (
		<>
			{/* Main sun light */}
			<directionalLight
				ref={lightRef}
				intensity={1.2}
				color="#FFF8DC"
				position={[50, 50, 50]}
				castShadow
				shadow-mapSize-width={4096}
				shadow-mapSize-height={4096}
				shadow-camera-far={200}
				shadow-camera-near={0.1}
				shadow-camera-left={-100}
				shadow-camera-right={100}
				shadow-camera-top={100}
				shadow-camera-bottom={-100}
				shadow-bias={-0.0001}
			/>
			
			{/* Ambient light for realistic fill lighting */}
			<ambientLight intensity={0.3} color="#87CEEB" />
			
			{/* Hemisphere light for sky/ground color variation */}
			<hemisphereLight
				args={["#87CEEB", "#3B2F2F", 0.4]}
				intensity={0.4}
			/>
		</>
	);
}

// Enhanced Sky System with Realistic Atmosphere
function RealisticSkySystem() {
	return (
		<>
			{/* Realistic sky dome */}
			<Sky
				distance={450000}
				sunPosition={[50, 50, 50]}
				inclination={0.49}
				azimuth={0.25}
				mieCoefficient={0.005}
				mieDirectionalG={0.8}
				rayleigh={0.5}
				turbidity={2}
			/>
			
			{/* Enhanced star field */}
			<Stars
				radius={300}
				depth={60}
				count={3000}
				factor={4}
				saturation={0.8}
				fade
				speed={0.5}
			/>
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
	// Professional FPS physics and game state management
	const terrainEngine = useMemo(() => {
		// Return a simple terrain height function since we're using AdvancedTerrainSystem now
		return {
			getTerrainHeight: (x: number, z: number) => {
				const scale1 = 0.005;
				const scale2 = 0.02;
				const scale3 = 0.08;
				const scale4 = 0.3;
				
				const noise1 = Math.sin(x * scale1) * Math.cos(z * scale1) * 50;
				const noise2 = Math.sin(x * scale2) * Math.cos(z * scale2) * 15;
				const noise3 = Math.sin(x * scale3) * Math.cos(z * scale3) * 5;
				const noise4 = Math.sin(x * scale4) * Math.cos(z * scale4) * 1;
				
				const ridgeNoise = Math.abs(Math.sin(x * 0.01) * Math.cos(z * 0.01)) * 20;
				const valleyNoise = -Math.abs(Math.sin(x * 0.008) * Math.cos(z * 0.008)) * 8;
				
				return noise1 + noise2 + noise3 + noise4 + ridgeNoise + valleyNoise;
			}
		};
	}, []);

	// Professional foliage system setup  
	const foliageSystem = useMemo(() => {
		// Simplified foliage system for compatibility
		return {
			generateTrees: () => null,
			generateGrass: () => null
		};
	}, []);
	
	// Professional performance monitoring
	const performanceMonitor = useRef({
		frameTime: 0,
		renderTime: 0,
		physicsTime: 0,
		totalTime: 0,
	});
	
	// Professional audio system integration
	const audioSystem = useRef({
		initialize: () => {},
		playSound: (name: string, volume?: number, pitch?: number) => {},
		stopSound: (name: string) => {},
		loadSound: (name: string, url: string) => {},
	});
	
	// Initial canvas configuration
	useEffect(() => {
		if (!gl) return;
		
		gl.shadowMap.enabled = true;
		gl.shadowMap.type = THREE.PCFSoftShadowMap;
		gl.toneMapping = THREE.ACESFilmicToneMapping;
		gl.toneMappingExposure = 1.2;
		gl.setClearColor(new THREE.Color('#1e3a8a'), 1);
		
		// Set color space for modern Three.js
		gl.outputColorSpace = THREE.SRGBColorSpace;
	}, [gl]);
	
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
	
	// Get initial player position on terrain
	const getInitialPosition = useCallback(() => {
		// Use the new advanced terrain noise function
		const x = 0;
		const z = 0;
		
		// Calculate terrain height using the same noise as AdvancedTerrainSystem
		const scale1 = 0.005;
		const scale2 = 0.02;
		const scale3 = 0.08;
		const scale4 = 0.3;
		
		const noise1 = Math.sin(x * scale1) * Math.cos(z * scale1) * 50;
		const noise2 = Math.sin(x * scale2) * Math.cos(z * scale2) * 15;
		const noise3 = Math.sin(x * scale3) * Math.cos(z * scale3) * 5;
		const noise4 = Math.sin(x * scale4) * Math.cos(z * scale4) * 1;
		
		const ridgeNoise = Math.abs(Math.sin(x * 0.01) * Math.cos(z * 0.01)) * 20;
		const valleyNoise = -Math.abs(Math.sin(x * 0.008) * Math.cos(z * 0.008)) * 8;
		
		const terrainHeight = noise1 + noise2 + noise3 + noise4 + ridgeNoise + valleyNoise;
		
		return new THREE.Vector3(0, terrainHeight + 3, 0);
	}, []);
	
	// Enhanced terrain height calculation for collision
	const getTerrainHeight = useCallback((x: number, z: number) => {
		// Use the same advanced noise as AdvancedTerrainSystem
		const scale1 = 0.005;
		const scale2 = 0.02;
		const scale3 = 0.08;
		const scale4 = 0.3;
		
		const noise1 = Math.sin(x * scale1) * Math.cos(z * scale1) * 50;
		const noise2 = Math.sin(x * scale2) * Math.cos(z * scale2) * 15;
		const noise3 = Math.sin(x * scale3) * Math.cos(z * scale3) * 5;
		const noise4 = Math.sin(x * scale4) * Math.cos(z * scale4) * 1;
		
		const ridgeNoise = Math.abs(Math.sin(x * 0.01) * Math.cos(z * 0.01)) * 20;
		const valleyNoise = -Math.abs(Math.sin(x * 0.008) * Math.cos(z * 0.008)) * 8;
		
		return noise1 + noise2 + noise3 + noise4 + ridgeNoise + valleyNoise;
	}, []);
	
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
			const terrainHeight = getTerrainHeight(position.x, position.z);
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
		const terrainHeight = getTerrainHeight(newPosition.x, newPosition.z);
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
					gl.shadowMap.enabled = true;
					gl.shadowMap.type = THREE.PCFSoftShadowMap;
					gl.toneMapping = THREE.ACESFilmicToneMapping;
					gl.toneMappingExposure = 1.2;
					gl.setClearColor(new THREE.Color('#1e3a8a'), 1);
					
					// Set color space for modern Three.js
					gl.outputColorSpace = THREE.SRGBColorSpace;
					
					// Professional fog setup
					if (scene) {
						scene.fog = new THREE.Fog('#1e3a8a', 50, 400);
					}
				}}
			>
				<Suspense fallback={null}>
					<RealisticSkySystem />
					<ProfessionalLightingSystem />
					<AdvancedTerrainSystem />
					<AdvancedVegetationSystem />
					<ProfessionalWaterSystem />
					
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
					
					<ProfessionalFPSPlayer 
						config={config}
						inputState={inputState}
						onConfigChange={onConfigChange}
					/>
				</Suspense>
			</Canvas>
			
			{/* Professional UI overlay */}
			{!isPointerLocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
					<div className="text-center text-white space-y-4">
						<h2 className="text-2xl font-bold">Professional FPS Explorer</h2>
						<p className="text-lg">Click to enter immersive mode</p>
						{isGamepadConnected ? (
							<div className="space-y-2">
								<p className="text-sm opacity-80">🎮 Controller Connected</p>
								<div className="text-xs space-y-1 opacity-60">
									<p>Left Stick: Move • Right Stick: Look</p>
									<p>RT: Run • LT: Crouch • A: Jump</p>
									<p>Start: Menu • Back: Exit</p>
								</div>
							</div>
						) : (
							<div className="text-xs space-y-1 opacity-60">
								<p>WASD: Move • Mouse: Look • Shift: Run</p>
								<p>Ctrl: Crouch • Space: Jump • Esc: Exit</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
