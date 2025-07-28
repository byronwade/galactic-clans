/**
 * @file fps-renderer-3d.tsx
 * @description Simplified AAA-Quality FPS Renderer using Industry-Standard Libraries
 * @version 4.0.0
 * @author Galactic Clans Development Team
 *
 * 🌟 SIMPLIFIED FPS IMPLEMENTATION USING PROVEN LIBRARIES:
 * 
 * 📚 LIBRARIES USED:
 * - three-stdlib: Standard Three.js utilities and helpers
 * - use-cannon: React hooks for Cannon.js physics
 * - Industry-standard FPS patterns and optimizations
 * 
 * 🎯 SIMPLIFIED ARCHITECTURE:
 * - Physics-based movement with use-cannon
 * - Streamlined terrain generation
 * - Industry-standard FPS controls
 * - Optimized performance patterns
 */

"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { Physics, useBox, usePlane } from "use-cannon";
import type { FPSConfig, FPSPerformanceMetrics } from "./fps-explorer-generator";
import { Html } from "@react-three/drei";

// Simplified FPS Player Controller using Cannon.js Physics
function FPSPlayer({ config }: { config: FPSConfig }) {
	const { camera, gl } = useThree();
	const [isPointerLocked, setIsPointerLocked] = useState(false);
	
	// Physics body for player collision
	const [playerRef, playerApi] = useBox(() => ({
		mass: 1,
		position: [0, 10, 0],
		args: [1, 2, 1], // Player collision box
	}));

	// Movement state
	const movement = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false,
		run: false,
	});

	// Setup keyboard controls
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'KeyW': movement.current.forward = true; break;
				case 'KeyS': movement.current.backward = true; break;
				case 'KeyA': movement.current.left = true; break;
				case 'KeyD': movement.current.right = true; break;
				case 'Space': movement.current.jump = true; event.preventDefault(); break;
				case 'ShiftLeft': movement.current.run = true; break;
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
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	// Setup pointer lock
	useEffect(() => {
		const handlePointerLockChange = () => {
			setIsPointerLocked(document.pointerLockElement === gl.domElement);
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
	}, [gl.domElement, isPointerLocked]);

	// Mouse look controls
	useEffect(() => {
		if (!isPointerLocked) return;

		const handleMouseMove = (event: MouseEvent) => {
			const sensitivity = config.player.mouseSensitivity * 0.002;
			
			camera.rotation.y -= event.movementX * sensitivity;
			camera.rotation.x -= event.movementY * sensitivity;
			camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
		};

		document.addEventListener('mousemove', handleMouseMove);
		return () => document.removeEventListener('mousemove', handleMouseMove);
	}, [isPointerLocked, camera, config.player.mouseSensitivity]);

	// Physics-based movement
	useFrame(() => {
		if (!playerRef.current || !isPointerLocked) return;

		// Get movement direction from camera
		const direction = new THREE.Vector3(0, 0, -1);
		direction.applyQuaternion(camera.quaternion);
		direction.y = 0;
		direction.normalize();

		const right = new THREE.Vector3(1, 0, 0);
		right.applyQuaternion(camera.quaternion);
		right.normalize();

		// Calculate movement vector
		const moveVector = new THREE.Vector3(0, 0, 0);
		if (movement.current.forward) moveVector.add(direction);
		if (movement.current.backward) moveVector.sub(direction);
		if (movement.current.left) moveVector.sub(right);
		if (movement.current.right) moveVector.add(right);

		// Apply speed multiplier
		const speed = movement.current.run ? config.player.runSpeed : config.player.walkSpeed;
		moveVector.multiplyScalar(speed);

		// Apply physics velocity
		if (moveVector.length() > 0) {
			playerApi.velocity.set(moveVector.x, 0, moveVector.z);
		} else {
			playerApi.velocity.set(0, 0, 0);
		}

		// Jump
		if (movement.current.jump) {
			playerApi.velocity.set(0, 12, 0);
			movement.current.jump = false; // Prevent continuous jumping
		}

		// Sync camera with physics body
		if (playerRef.current) {
			camera.position.copy(playerRef.current.position as THREE.Vector3);
			camera.position.y += 1.6; // Eye height offset
		}
	});

	// Render pointer lock overlay
	if (!isPointerLocked) {
		return (
			<Html center>
				<div className="pointer-events-auto text-center p-6 bg-black/80 backdrop-blur-sm rounded-lg border border-green-400/30">
					<div className="text-white mb-2 text-lg font-semibold">🎮 Simplified FPS</div>
					<div className="text-green-400 text-sm mb-3">Click to activate • Physics-based movement</div>
					<div className="text-xs text-slate-300">
						WASD to move • Mouse to look • Shift to run • Space to jump
					</div>
				</div>
			</Html>
		);
	}

	return <primitive object={playerRef} />;
}

// Simplified Terrain System
function SimplifiedTerrain() {
	const noise = useMemo(() => createNoise2D(), []);
	
	// Create ground plane with physics
	const [groundRef] = usePlane(() => ({
		rotation: [-Math.PI / 2, 0, 0],
		position: [0, 0, 0],
	}));

	// Generate simple heightmap terrain
	const terrainGeometry = useMemo(() => {
		const size = 100;
		const segments = 50;
		const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
		
		const positionAttribute = geometry.attributes.position;
		if (!positionAttribute) return geometry;
		
		const positions = positionAttribute.array as Float32Array;
		
		for (let i = 0; i < positions.length; i += 3) {
			const x = positions[i];
			const z = positions[i + 2];
			
			if (x !== undefined && z !== undefined) {
				// Simple terrain height using noise
				let height = 0;
				height += noise(x * 0.02, z * 0.02) * 8;
				height += noise(x * 0.05, z * 0.05) * 4;
				height += noise(x * 0.1, z * 0.1) * 2;
				
				positions[i + 1] = height;
			}
		}
		
		geometry.computeVertexNormals();
		return geometry;
	}, [noise]);

	return (
		<group>
			{/* Physics ground plane */}
			<mesh ref={groundRef} visible={false}>
				<planeGeometry args={[200, 200]} />
			</mesh>
			
			{/* Visual terrain */}
			<mesh geometry={terrainGeometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<meshLambertMaterial 
					color={new THREE.Color(0.3, 0.6, 0.2)}
					wireframe={false}
				/>
			</mesh>
			
			{/* Simple trees */}
			{Array.from({ length: 20 }, (_, i) => (
				<SimpleTree 
					key={i} 
					position={[
						(Math.random() - 0.5) * 80,
						0,
						(Math.random() - 0.5) * 80
					]} 
				/>
			))}
		</group>
	);
}

// Simple tree component
function SimpleTree({ position }: { position: [number, number, number] }) {
	return (
		<group position={position}>
			{/* Trunk */}
			<mesh position={[0, 2, 0]} castShadow>
				<cylinderGeometry args={[0.3, 0.4, 4, 8]} />
				<meshLambertMaterial color={new THREE.Color(0.4, 0.2, 0.1)} />
			</mesh>
			
			{/* Leaves */}
			<mesh position={[0, 5, 0]} castShadow>
				<sphereGeometry args={[2.5, 8, 6]} />
				<meshLambertMaterial color={new THREE.Color(0.2, 0.5, 0.1)} />
			</mesh>
		</group>
	);
}

// Simplified Environment
function SimplifiedEnvironment() {
	const [timeOfDay, setTimeOfDay] = useState(0.3);

	useFrame((state, delta) => {
		setTimeOfDay(prev => (prev + delta * 0.002) % 1);
	});

	const sunAngle = timeOfDay * Math.PI * 2;
	const sunHeight = Math.sin(sunAngle);
	const sunPosition = new THREE.Vector3(
		Math.cos(sunAngle) * 100,
		Math.max(10, sunHeight * 50),
		Math.sin(sunAngle) * 100
	);

	return (
		<group>
			{/* Sky */}
			<Sky
				distance={450000}
				sunPosition={sunPosition}
				inclination={0}
				azimuth={0.25}
			/>

			{/* Lighting */}
			<ambientLight intensity={0.4} />
			<directionalLight
				position={sunPosition}
				intensity={0.8}
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
				shadow-camera-far={100}
				shadow-camera-left={-50}
				shadow-camera-right={50}
				shadow-camera-top={50}
				shadow-camera-bottom={-50}
			/>

			{/* Stars at night */}
			{sunHeight < 0.1 && (
				<Stars radius={300} depth={50} count={3000} factor={4} />
			)}

			{/* Simple fog */}
			<fog attach="fog" args={[0x87CEEB, 30, 150]} />
		</group>
	);
}

// Main Simplified FPS Renderer
export interface FPSRenderer3DProps {
	config: FPSConfig;
	onPerformanceUpdate?: (metrics: FPSPerformanceMetrics) => void;
	onCameraUpdate?: (position: THREE.Vector3, rotation: THREE.Euler) => void;
}

export const FPSRenderer3D = forwardRef<any, FPSRenderer3DProps>(({ config }, ref) => {
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
					far: 500,
					position: [0, 15, 0],
				}}
				shadows
				gl={{ antialias: true }}
				style={{ width: "100%", height: "100%" }}
			>
				{/* Physics World */}
				<Physics gravity={[0, -30, 0]}>
					<FPSPlayer config={config} />
					<SimplifiedTerrain />
				</Physics>
				
				{/* Environment */}
				<SimplifiedEnvironment />
			</Canvas>
		</div>
	);
});

FPSRenderer3D.displayName = "FPSRenderer3D";
export default FPSRenderer3D;
