/**
 * @file fps-spatial-audio.tsx
 * @description 3D Spatial Audio System for FPS Exploration
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Advanced spatial audio featuring:
 * - 3D positional audio with Web Audio API
 * - Environmental reverb and echo effects
 * - Realistic footstep sounds based on terrain
 * - Ambient atmospheric sounds
 * - Dynamic wind and weather audio
 * - Distance-based attenuation
 */

"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";
import { useGameAudio } from "@/hooks/useGameAudio";
import type { FPSConfig } from "./fps-explorer-generator";

interface SpatialAudioSystemProps {
	config: FPSConfig;
	isExploring: boolean;
	playerPosition: THREE.Vector3;
	playerVelocity: THREE.Vector3;
	cameraRotation: THREE.Euler;
	isGrounded: boolean;
	terrainType: string;
}

interface AudioSource {
	id: string;
	position: THREE.Vector3;
	sound: HTMLAudioElement;
	panner: PannerNode;
	gain: GainNode;
	type: "ambient" | "environmental" | "dynamic" | "footstep";
	isPlaying: boolean;
	maxDistance: number;
}

export function SpatialAudioSystem({ config, isExploring, playerPosition, playerVelocity, cameraRotation, isGrounded, terrainType }: SpatialAudioSystemProps) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const listenerRef = useRef<AudioListener | null>(null);
	const audioSourcesRef = useRef<Map<string, AudioSource>>(new Map());
	const footstepTimerRef = useRef<number>(0);
	const lastFootstepTimeRef = useRef<number>(0);

	const [isInitialized, setIsInitialized] = useState(false);
	const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true);

	 const { play: playSound } = useGameAudio();

		// Initialize Web Audio API
		useEffect(() => {
			if (!isExploring || !spatialAudioEnabled) return;

			const initAudioContext = async () => {
				try {
					// Create AudioContext
					audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

					// Resume context if suspended
					if (audioContextRef.current.state === "suspended") {
						await audioContextRef.current.resume();
					}

					// Create listener
					listenerRef.current = audioContextRef.current.listener;

					// Set up listener orientation
					if (listenerRef.current.forwardX) {
						// Modern Web Audio API
						listenerRef.current.forwardX.value = 0;
						listenerRef.current.forwardY.value = 0;
						listenerRef.current.forwardZ.value = -1;
						listenerRef.current.upX.value = 0;
						listenerRef.current.upY.value = 1;
						listenerRef.current.upZ.value = 0;
					} else if (listenerRef.current.setOrientation) {
						// Legacy Web Audio API
						listenerRef.current.setOrientation(0, 0, -1, 0, 1, 0);
					}

					console.log("Spatial audio system initialized");
					setIsInitialized(true);

					// Start ambient audio
					initializeAmbientAudio();
				} catch (error) {
					console.error("Failed to initialize spatial audio:", error);
					setSpatialAudioEnabled(false);
				}
			};

			initAudioContext();

			return () => {
				// Cleanup
				audioSourcesRef.current.forEach((source) => {
					source.sound.pause();
					source.sound.src = "";
				});
				audioSourcesRef.current.clear();

				if (audioContextRef.current) {
					audioContextRef.current.close();
				}
			};
		}, [isExploring, spatialAudioEnabled]);

		// Initialize ambient environmental audio
		const initializeAmbientAudio = useCallback(() => {
			if (!audioContextRef.current || !config.environment.ambientSounds) return;

			// Add wind sounds
			if (config.environment.windSounds) {
				createAmbientAudioSource({
					id: "wind",
					audioFile: "/audio/ambient/wind.wav", // Placeholder
					position: new THREE.Vector3(0, 5, 0),
					maxDistance: 100,
					loop: true,
					volume: config.environment.windStrength * 0.3,
				});
			}

			// Add atmospheric sounds based on planet type
			if (config.environment.atmosphere) {
				createAmbientAudioSource({
					id: "atmosphere",
					audioFile: "/audio/space_ambient_improved.wav",
					position: new THREE.Vector3(0, 0, 0),
					maxDistance: 200,
					loop: true,
					volume: 0.2,
				});
			}

			// Add environmental sounds based on vegetation
			if (config.environment.enableVegetation) {
				createAmbientAudioSource({
					id: "nature",
					audioFile: "/audio/ambient/forest.wav", // Placeholder
					position: new THREE.Vector3(0, 1, 0),
					maxDistance: 50,
					loop: true,
					volume: config.environment.vegetationDensity * 0.25,
				});
			}
		}, [config.environment]);

		// Create a spatial audio source
		const createAmbientAudioSource = useCallback(({ id, audioFile, position, maxDistance, loop = false, volume = 1.0 }: { id: string; audioFile: string; position: THREE.Vector3; maxDistance: number; loop?: boolean; volume?: number }) => {
			if (!audioContextRef.current) return;

			try {
				// Create audio element
				const audio = new Audio(audioFile);
				audio.crossOrigin = "anonymous";
				audio.loop = loop;
				audio.volume = 0; // Will be controlled by gain node

				// Create audio nodes
				const source = audioContextRef.current.createMediaElementSource(audio);
				const panner = audioContextRef.current.createPanner();
				const gain = audioContextRef.current.createGain();

				// Configure panner
				panner.panningModel = "HRTF";
				panner.distanceModel = "inverse";
				panner.refDistance = 1;
				panner.maxDistance = maxDistance;
				panner.rolloffFactor = 1;

				// Set position
				if (panner.positionX) {
					panner.positionX.value = position.x;
					panner.positionY.value = position.y;
					panner.positionZ.value = position.z;
				} else if (panner.setPosition) {
					panner.setPosition(position.x, position.y, position.z);
				}

				// Configure gain
				gain.gain.value = volume;

				// Connect audio graph
				source.connect(panner);
				panner.connect(gain);
				gain.connect(audioContextRef.current.destination);

				// Store audio source
				const audioSource: AudioSource = {
					id,
					position: position.clone(),
					sound: audio,
					panner,
					gain,
					type: "ambient",
					isPlaying: false,
					maxDistance,
				};

				audioSourcesRef.current.set(id, audioSource);

				// Start playing
				audio
					.play()
					.then(() => {
						audioSource.isPlaying = true;
						console.log(`Started spatial audio: ${id}`);
					})
					.catch((error) => {
						console.warn(`Failed to play spatial audio ${id}:`, error);
					});
			} catch (error) {
				console.error(`Failed to create spatial audio source ${id}:`, error);
			}
		}, []);

		// Update listener position and orientation
		useEffect(() => {
			if (!listenerRef.current || !isInitialized) return;

			// Update listener position
			if (listenerRef.current.positionX) {
				listenerRef.current.positionX.value = playerPosition.x;
				listenerRef.current.positionY.value = playerPosition.y;
				listenerRef.current.positionZ.value = playerPosition.z;
			} else if (listenerRef.current.setPosition) {
				listenerRef.current.setPosition(playerPosition.x, playerPosition.y, playerPosition.z);
			}

			// Update listener orientation based on camera rotation
			const forward = new THREE.Vector3(0, 0, -1);
			const up = new THREE.Vector3(0, 1, 0);

			forward.applyEuler(cameraRotation);
			up.applyEuler(cameraRotation);

			if (listenerRef.current.forwardX) {
				listenerRef.current.forwardX.value = forward.x;
				listenerRef.current.forwardY.value = forward.y;
				listenerRef.current.forwardZ.value = forward.z;
				listenerRef.current.upX.value = up.x;
				listenerRef.current.upY.value = up.y;
				listenerRef.current.upZ.value = up.z;
			} else if (listenerRef.current.setOrientation) {
				listenerRef.current.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
			}
		}, [playerPosition, cameraRotation, isInitialized]);

		// Handle footstep audio
		useEffect(() => {
			if (!isGrounded || !isInitialized) return;

			const speed = playerVelocity.length();
			if (speed < 0.5) return; // Not moving enough for footsteps

			const now = Date.now();
			const footstepInterval = speed > 5 ? 300 : 500; // Faster footsteps when running

			if (now - lastFootstepTimeRef.current > footstepInterval) {
				playFootstepSound(terrainType, speed > 5);
				lastFootstepTimeRef.current = now;
			}
		}, [playerVelocity, isGrounded, terrainType, isInitialized]);

		// Play footstep sound based on terrain
		const playFootstepSound = useCallback(
			(terrain: string, isRunning: boolean) => {
				const soundMap: Record<string, string[]> = {
					grass: ["footstep_grass_01", "footstep_grass_02", "footstep_grass_03"],
					rock: ["footstep_rock_01", "footstep_rock_02", "footstep_rock_03"],
					sand: ["footstep_sand_01", "footstep_sand_02", "footstep_sand_03"],
					metal: ["footstep_metal_01", "footstep_metal_02", "footstep_metal_03"],
					dirt: ["footstep_dirt_01", "footstep_dirt_02", "footstep_dirt_03"],
				};

				const sounds = soundMap[terrain] || soundMap.dirt;
				if (!sounds || sounds.length === 0) return;
				const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
				if (!randomSound) return;

				// Adjust volume based on movement speed
				const volume = isRunning ? 0.8 : 0.5;

				try {
					playSound(randomSound, { volume });
				} catch {
					// Fallback to basic click sound if footstep sounds aren't available
					playSound("click_001", { volume: volume * 0.3 });
				}
			},
			[playSound]
		);

	// Update wind audio based on weather
	useEffect(() => {
		const windSource = audioSourcesRef.current.get("wind");
		if (windSource && windSource.gain) {
			const targetVolume = config.environment.windSounds ? config.environment.windStrength * 0.4 : 0;

			// Smooth volume transition
			if (audioContextRef.current) {
				windSource.gain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetVolume), audioContextRef.current.currentTime + 0.5);
			}
		}
	}, [config.environment.windSounds, config.environment.windStrength]);

	// Environmental reverb effects
	useEffect(() => {
		if (!audioContextRef.current || !config.environment.echoEffect) return;

		// Add reverb based on environment
		// This would be implemented with ConvolverNode for realistic reverb
		// For now, we'll just adjust the ambient audio
	}, [config.environment.echoEffect]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (footstepTimerRef.current) {
				clearTimeout(footstepTimerRef.current);
			}
		};
	}, []);

	// Debug audio system (only render in development)
	const renderDebugInfo = () => {
		if (process.env.NODE_ENV !== "development") return null;

		return (
			<div className="fixed top-20 left-4 bg-black/80 text-white p-3 rounded text-xs font-mono z-50">
				<div>Audio Context: {isInitialized ? "Ready" : "Not Ready"}</div>
				<div>Sources: {audioSourcesRef.current.size}</div>
				<div>
					Position: ({playerPosition.x.toFixed(1)}, {playerPosition.y.toFixed(1)}, {playerPosition.z.toFixed(1)})
				</div>
				<div>Velocity: {playerVelocity.length().toFixed(2)} m/s</div>
				<div>Terrain: {terrainType}</div>
				<div>Grounded: {isGrounded ? "Yes" : "No"}</div>
			</div>
		);
	};

	return (
		<>
			{renderDebugInfo()}

			{/* Audio controls UI (optional) */}
			{isExploring && (
				<div className="fixed bottom-20 left-4 bg-slate-900/90 backdrop-blur-sm border border-green-400/30 rounded p-2 z-40">
					<div className="flex items-center gap-2 text-xs">
						<div className={`w-2 h-2 rounded-full ${isInitialized ? "bg-green-400" : "bg-red-400"}`} />
						<span className="text-white">3D Audio</span>
						<button onClick={() => setSpatialAudioEnabled(!spatialAudioEnabled)} className="text-green-400 hover:text-green-300 transition-colors">
							{spatialAudioEnabled ? "ON" : "OFF"}
						</button>
					</div>
				</div>
			)}
		</>
	);
}
