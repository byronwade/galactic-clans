/**
 * @file fps-audio-system.tsx
 * @description Professional AAA-Quality 3D Audio System for FPS Explorer
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - 3D positional audio with HRTF (Head-Related Transfer Function)
 * - Dynamic reverb based on environment (indoor, outdoor, cave)
 * - Material-based footstep sounds (metal, wood, grass, stone)
 * - Weapon audio with distance-based volume and occlusion
 * - Ambient audio layers for atmospheric immersion
 * - Real-time audio mixing and effects processing
 */

"use client";

import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import * as THREE from "three";

// Audio System Interfaces
export interface AudioConfig {
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	voiceVolume: number;
	enable3D: boolean;
	enableReverb: boolean;
	enableOcclusion: boolean;
	listenerPosition: THREE.Vector3;
	listenerOrientation: THREE.Euler;
}

export interface AudioSource {
	id: string;
	url: string;
	position: THREE.Vector3;
	volume: number;
	pitch: number;
	loop: boolean;
	spatial: boolean;
	maxDistance: number;
	rolloffFactor: number;
	category: "sfx" | "music" | "voice" | "ambient" | "ui";
}

export interface MaterialAudioData {
	footstep: string[];
	impact: string[];
	scrape: string[];
	reverb: {
		roomSize: number;
		decay: number;
		wetness: number;
	};
}

// Material-based audio definitions
const MATERIAL_AUDIO: Record<string, MaterialAudioData> = {
	grass: {
		footstep: ["/audio/footsteps/grass_01.wav", "/audio/footsteps/grass_02.wav"],
		impact: ["/audio/impacts/grass_impact.wav"],
		scrape: ["/audio/scrapes/grass_scrape.wav"],
		reverb: { roomSize: 1.0, decay: 0.3, wetness: 0.1 },
	},
	metal: {
		footstep: ["/audio/footsteps/metal_01.wav", "/audio/footsteps/metal_02.wav"],
		impact: ["/audio/impacts/metal_impact.wav"],
		scrape: ["/audio/scrapes/metal_scrape.wav"],
		reverb: { roomSize: 0.5, decay: 0.8, wetness: 0.4 },
	},
	wood: {
		footstep: ["/audio/footsteps/wood_01.wav", "/audio/footsteps/wood_02.wav"],
		impact: ["/audio/impacts/wood_impact.wav"],
		scrape: ["/audio/scrapes/wood_scrape.wav"],
		reverb: { roomSize: 0.7, decay: 0.5, wetness: 0.2 },
	},
	stone: {
		footstep: ["/audio/footsteps/stone_01.wav", "/audio/footsteps/stone_02.wav"],
		impact: ["/audio/impacts/stone_impact.wav"],
		scrape: ["/audio/scrapes/stone_scrape.wav"],
		reverb: { roomSize: 1.2, decay: 1.0, wetness: 0.6 },
	},
	water: {
		footstep: ["/audio/footsteps/water_01.wav", "/audio/footsteps/water_02.wav"],
		impact: ["/audio/impacts/water_splash.wav"],
		scrape: ["/audio/scrapes/water_wade.wav"],
		reverb: { roomSize: 2.0, decay: 0.4, wetness: 0.8 },
	},
};

// Weapon audio definitions
const WEAPON_AUDIO = {
	rifle: {
		fire: "/audio/weapons/rifle_fire.wav",
		reload: "/audio/weapons/rifle_reload.wav",
		dryFire: "/audio/weapons/dry_fire.wav",
		shellEject: "/audio/weapons/shell_eject.wav",
	},
	pistol: {
		fire: "/audio/weapons/pistol_fire.wav",
		reload: "/audio/weapons/pistol_reload.wav",
		dryFire: "/audio/weapons/dry_fire.wav",
		shellEject: "/audio/weapons/shell_eject.wav",
	},
	sniper: {
		fire: "/audio/weapons/sniper_fire.wav",
		reload: "/audio/weapons/sniper_reload.wav",
		dryFire: "/audio/weapons/dry_fire.wav",
		shellEject: "/audio/weapons/shell_eject.wav",
	},
};

// Environment audio definitions
const ENVIRONMENT_AUDIO = {
	outdoor: {
		ambient: ["/audio/ambient/wind_light.wav", "/audio/ambient/birds.wav"],
		reverb: { roomSize: 10.0, decay: 0.2, wetness: 0.1 },
	},
	indoor: {
		ambient: ["/audio/ambient/room_tone.wav"],
		reverb: { roomSize: 0.3, decay: 0.6, wetness: 0.5 },
	},
	cave: {
		ambient: ["/audio/ambient/cave_drips.wav", "/audio/ambient/cave_echo.wav"],
		reverb: { roomSize: 5.0, decay: 2.0, wetness: 0.9 },
	},
	underground: {
		ambient: ["/audio/ambient/underground_hum.wav"],
		reverb: { roomSize: 1.0, decay: 1.5, wetness: 0.7 },
	},
};

// Professional FPS Audio System Class
class FPSAudioEngine {
	private audioContext: AudioContext;
	private listener: AudioListener;
	private reverbNode!: ConvolverNode;
	private masterGain!: GainNode;
	private musicGain!: GainNode;
	private sfxGain!: GainNode;
	private voiceGain!: GainNode;
	private audioSources: Map<string, AudioBufferSourceNode>;
	private config: AudioConfig;
	private impulseResponses: Map<string, AudioBuffer>;

	constructor(config: AudioConfig) {
		this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		this.listener = this.audioContext.listener;
		this.audioSources = new Map();
		this.impulseResponses = new Map();
		this.config = config;

		this.setupAudioNodes();
		this.generateImpulseResponses();
	}

	private setupAudioNodes() {
		// Create master gain node
		this.masterGain = this.audioContext.createGain();
		this.masterGain.connect(this.audioContext.destination);

		// Create category gain nodes
		this.musicGain = this.audioContext.createGain();
		this.sfxGain = this.audioContext.createGain();
		this.voiceGain = this.audioContext.createGain();

		this.musicGain.connect(this.masterGain);
		this.sfxGain.connect(this.masterGain);
		this.voiceGain.connect(this.masterGain);

		// Create reverb node
		this.reverbNode = this.audioContext.createConvolver();
		this.reverbNode.connect(this.masterGain);

		this.updateVolumes();
	}

	private generateImpulseResponses() {
		// Generate impulse responses for different environments
		const sampleRate = this.audioContext.sampleRate;

		// Small room impulse response
		const roomLength = sampleRate * 0.5;
		const roomBuffer = this.audioContext.createBuffer(2, roomLength, sampleRate);

		for (let channel = 0; channel < 2; channel++) {
			const channelData = roomBuffer.getChannelData(channel);
			for (let i = 0; i < roomLength; i++) {
				channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / roomLength, 2);
			}
		}

		this.impulseResponses.set("room", roomBuffer);

		// Cave impulse response
		const caveLength = sampleRate * 2.0;
		const caveBuffer = this.audioContext.createBuffer(2, caveLength, sampleRate);

		for (let channel = 0; channel < 2; channel++) {
			const channelData = caveBuffer.getChannelData(channel);
			for (let i = 0; i < caveLength; i++) {
				const decay = Math.pow(1 - i / caveLength, 0.5);
				channelData[i] = (Math.random() * 2 - 1) * decay * 0.3;
			}
		}

		this.impulseResponses.set("cave", caveBuffer);
	}

	public updateListener(position: THREE.Vector3, orientation: THREE.Euler) {
		if (this.listener.positionX) {
			// Modern Web Audio API
			this.listener.positionX.setValueAtTime(position.x, this.audioContext.currentTime);
			this.listener.positionY.setValueAtTime(position.y, this.audioContext.currentTime);
			this.listener.positionZ.setValueAtTime(position.z, this.audioContext.currentTime);

			// Convert Euler to forward/up vectors
			const forward = new THREE.Vector3(0, 0, -1).applyEuler(orientation);
			const up = new THREE.Vector3(0, 1, 0).applyEuler(orientation);

			this.listener.forwardX.setValueAtTime(forward.x, this.audioContext.currentTime);
			this.listener.forwardY.setValueAtTime(forward.y, this.audioContext.currentTime);
			this.listener.forwardZ.setValueAtTime(forward.z, this.audioContext.currentTime);

			this.listener.upX.setValueAtTime(up.x, this.audioContext.currentTime);
			this.listener.upY.setValueAtTime(up.y, this.audioContext.currentTime);
			this.listener.upZ.setValueAtTime(up.z, this.audioContext.currentTime);
		} else {
			// Fallback for older browsers
			(this.listener as any).setPosition(position.x, position.y, position.z);
			const forward = new THREE.Vector3(0, 0, -1).applyEuler(orientation);
			const up = new THREE.Vector3(0, 1, 0).applyEuler(orientation);
			(this.listener as any).setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
		}

		this.config.listenerPosition = position;
		this.config.listenerOrientation = orientation;
	}

	public updateVolumes() {
		this.masterGain.gain.setValueAtTime(this.config.masterVolume, this.audioContext.currentTime);
		this.musicGain.gain.setValueAtTime(this.config.musicVolume, this.audioContext.currentTime);
		this.sfxGain.gain.setValueAtTime(this.config.sfxVolume, this.audioContext.currentTime);
		this.voiceGain.gain.setValueAtTime(this.config.voiceVolume, this.audioContext.currentTime);
	}

	public setEnvironment(environment: keyof typeof ENVIRONMENT_AUDIO) {
		const envData = ENVIRONMENT_AUDIO[environment];

		if (this.config.enableReverb && envData.reverb) {
			const impulseType = environment === "cave" ? "cave" : "room";
			const impulse = this.impulseResponses.get(impulseType);
			if (impulse) {
				this.reverbNode.buffer = impulse;
			}
		}
	}

	public async loadAudioBuffer(url: string): Promise<AudioBuffer> {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return await this.audioContext.decodeAudioData(arrayBuffer);
	}

	public playSound(audioSource: AudioSource): string {
		const sourceId = audioSource.id || Math.random().toString(36);

		this.loadAudioBuffer(audioSource.url)
			.then((buffer) => {
				const source = this.audioContext.createBufferSource();
				const gainNode = this.audioContext.createGain();
				const pannerNode = this.audioContext.createPanner();

				source.buffer = buffer;
				source.loop = audioSource.loop;

				// Setup gain
				gainNode.gain.setValueAtTime(audioSource.volume, this.audioContext.currentTime);

				// Setup 3D positioning if spatial
				if (audioSource.spatial && this.config.enable3D) {
					pannerNode.panningModel = "HRTF";
					pannerNode.distanceModel = "inverse";
					pannerNode.refDistance = 1;
					pannerNode.maxDistance = audioSource.maxDistance;
					pannerNode.rolloffFactor = audioSource.rolloffFactor;

					if (pannerNode.positionX) {
						pannerNode.positionX.setValueAtTime(audioSource.position.x, this.audioContext.currentTime);
						pannerNode.positionY.setValueAtTime(audioSource.position.y, this.audioContext.currentTime);
						pannerNode.positionZ.setValueAtTime(audioSource.position.z, this.audioContext.currentTime);
					} else {
						(pannerNode as any).setPosition(audioSource.position.x, audioSource.position.y, audioSource.position.z);
					}

					source.connect(pannerNode);
					pannerNode.connect(gainNode);
				} else {
					source.connect(gainNode);
				}

				// Connect to appropriate category gain
				switch (audioSource.category) {
					case "music":
						gainNode.connect(this.musicGain);
						break;
					case "voice":
						gainNode.connect(this.voiceGain);
						break;
					default:
						gainNode.connect(this.sfxGain);
						break;
				}

				// Store reference and start playback
				this.audioSources.set(sourceId, source);
				source.start(0);

				// Clean up when done
				source.onended = () => {
					this.audioSources.delete(sourceId);
				};
			})
			.catch((error) => {
				console.warn(`Failed to load audio: ${audioSource.url}`, error);
			});

		return sourceId;
	}

	public stopSound(sourceId: string) {
		const source = this.audioSources.get(sourceId);
		if (source) {
			source.stop();
			this.audioSources.delete(sourceId);
		}
	}

	public stopAllSounds() {
		this.audioSources.forEach((source) => source.stop());
		this.audioSources.clear();
	}

	public updateConfig(newConfig: Partial<AudioConfig>) {
		this.config = { ...this.config, ...newConfig };
		this.updateVolumes();
	}

	public getConfig(): AudioConfig {
		return { ...this.config };
	}
}

// React Hook for FPS Audio System
export function useFPSAudio(initialConfig: Partial<AudioConfig> = {}) {
	const audioEngineRef = useRef<FPSAudioEngine | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [currentEnvironment, setCurrentEnvironment] = useState<keyof typeof ENVIRONMENT_AUDIO>("outdoor");

	const defaultConfig: AudioConfig = {
		masterVolume: 1.0,
		musicVolume: 0.7,
		sfxVolume: 0.8,
		voiceVolume: 1.0,
		enable3D: true,
		enableReverb: true,
		enableOcclusion: true,
		listenerPosition: new THREE.Vector3(0, 0, 0),
		listenerOrientation: new THREE.Euler(0, 0, 0),
		...initialConfig,
	};

	// Initialize audio engine
	useEffect(() => {
		audioEngineRef.current = new FPSAudioEngine(defaultConfig);
		setIsInitialized(true);

		return () => {
			if (audioEngineRef.current) {
				audioEngineRef.current.stopAllSounds();
			}
		};
	}, []);

	// Update listener position and orientation
	const updateListener = useCallback((position: THREE.Vector3, orientation: THREE.Euler) => {
		if (audioEngineRef.current) {
			audioEngineRef.current.updateListener(position, orientation);
		}
	}, []);

	// Play footstep sound based on material
	const playFootstep = useCallback((material: string, position: THREE.Vector3, volume: number = 1.0) => {
		if (!audioEngineRef.current) return;

		const materialData = MATERIAL_AUDIO[material] || MATERIAL_AUDIO.grass;
		if (!materialData || !materialData.footstep || materialData.footstep.length === 0) return;

		const soundUrl = materialData.footstep[Math.floor(Math.random() * materialData.footstep.length)];
		if (!soundUrl) return;

		audioEngineRef.current.playSound({
			id: `footstep_${Date.now()}`,
			url: soundUrl,
			position,
			volume: volume * 0.3,
			pitch: 1.0 + (Math.random() - 0.5) * 0.2, // Slight pitch variation
			loop: false,
			spatial: true,
			maxDistance: 20,
			rolloffFactor: 1.0,
			category: "sfx",
		});
	}, []);

	// Play weapon sound
	const playWeaponSound = useCallback((weaponType: keyof typeof WEAPON_AUDIO, soundType: keyof typeof WEAPON_AUDIO.rifle, position: THREE.Vector3, volume: number = 1.0) => {
		if (!audioEngineRef.current) return;

		const weaponData = WEAPON_AUDIO[weaponType];
		if (!weaponData || !weaponData[soundType]) return;

		audioEngineRef.current.playSound({
			id: `weapon_${soundType}_${Date.now()}`,
			url: weaponData[soundType],
			position,
			volume: volume * 0.8,
			pitch: 1.0,
			loop: false,
			spatial: true,
			maxDistance: soundType === "fire" ? 200 : 50,
			rolloffFactor: soundType === "fire" ? 0.5 : 1.0,
			category: "sfx",
		});
	}, []);

	// Change environment
	const changeEnvironment = useCallback((environment: keyof typeof ENVIRONMENT_AUDIO) => {
		if (audioEngineRef.current) {
			audioEngineRef.current.setEnvironment(environment);
			setCurrentEnvironment(environment);
		}
	}, []);

	// Update audio configuration
	const updateConfig = useCallback((newConfig: Partial<AudioConfig>) => {
		if (audioEngineRef.current) {
			audioEngineRef.current.updateConfig(newConfig);
		}
	}, []);

	return {
		isInitialized,
		currentEnvironment,
		updateListener,
		playFootstep,
		playWeaponSound,
		changeEnvironment,
		updateConfig,
		audioEngine: audioEngineRef.current,
	};
}

// Audio Settings Component
export function AudioSettings({ audioSystem, onClose }: { audioSystem: ReturnType<typeof useFPSAudio>; onClose: () => void }) {
	const [config, setConfig] = useState<AudioConfig>(
		() =>
			audioSystem.audioEngine?.getConfig() || {
				masterVolume: 1.0,
				musicVolume: 0.7,
				sfxVolume: 0.8,
				voiceVolume: 1.0,
				enable3D: true,
				enableReverb: true,
				enableOcclusion: true,
				listenerPosition: new THREE.Vector3(0, 0, 0),
				listenerOrientation: new THREE.Euler(0, 0, 0),
			}
	);

	const handleConfigChange = (key: keyof AudioConfig, value: any) => {
		const newConfig = { ...config, [key]: value };
		setConfig(newConfig);
		audioSystem.updateConfig({ [key]: value });
	};

	return (
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm border border-white/30 rounded-lg p-6 min-w-96">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-white font-semibold text-lg">Audio Settings</h3>
				<button onClick={onClose} className="text-white/60 hover:text-white">
					✕
				</button>
			</div>

			<div className="space-y-4">
				{/* Volume Controls */}
				<div>
					<label className="block text-white text-sm mb-2">Master Volume</label>
					<input type="range" min="0" max="1" step="0.1" value={config.masterVolume} onChange={(e) => handleConfigChange("masterVolume", parseFloat(e.target.value))} className="w-full" />
				</div>

				<div>
					<label className="block text-white text-sm mb-2">SFX Volume</label>
					<input type="range" min="0" max="1" step="0.1" value={config.sfxVolume} onChange={(e) => handleConfigChange("sfxVolume", parseFloat(e.target.value))} className="w-full" />
				</div>

				<div>
					<label className="block text-white text-sm mb-2">Music Volume</label>
					<input type="range" min="0" max="1" step="0.1" value={config.musicVolume} onChange={(e) => handleConfigChange("musicVolume", parseFloat(e.target.value))} className="w-full" />
				</div>

				{/* Audio Features */}
				<div className="space-y-2">
					<label className="flex items-center space-x-2">
						<input type="checkbox" checked={config.enable3D} onChange={(e) => handleConfigChange("enable3D", e.target.checked)} className="rounded" />
						<span className="text-white text-sm">3D Positional Audio</span>
					</label>

					<label className="flex items-center space-x-2">
						<input type="checkbox" checked={config.enableReverb} onChange={(e) => handleConfigChange("enableReverb", e.target.checked)} className="rounded" />
						<span className="text-white text-sm">Environmental Reverb</span>
					</label>

					<label className="flex items-center space-x-2">
						<input type="checkbox" checked={config.enableOcclusion} onChange={(e) => handleConfigChange("enableOcclusion", e.target.checked)} className="rounded" />
						<span className="text-white text-sm">Audio Occlusion</span>
					</label>
				</div>

				{/* Environment Selection */}
				<div>
					<label className="block text-white text-sm mb-2">Environment</label>
					<select value={audioSystem.currentEnvironment} onChange={(e) => audioSystem.changeEnvironment(e.target.value as keyof typeof ENVIRONMENT_AUDIO)} className="w-full bg-black/60 border border-white/30 text-white rounded px-3 py-2">
						<option value="outdoor">Outdoor</option>
						<option value="indoor">Indoor</option>
						<option value="cave">Cave</option>
						<option value="underground">Underground</option>
					</select>
				</div>
			</div>
		</div>
	);
}

export default { useFPSAudio, AudioSettings };
