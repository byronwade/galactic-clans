/**
 * @file useGameAudio.ts
 * @description React hook for managing game audio with automatic initialization and cleanup
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * @created 2025-01-27
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { GameAudioSystem, AudioCategory, SOUND_EFFECTS } from "@/shared/audio/game-audio-system";
import type { AudioConfig } from "@/shared/audio/game-audio-system";

interface UseGameAudioOptions {
	preloadSounds?: string[];
	autoInitialize?: boolean;
	config?: Partial<AudioConfig>;
}

interface UseGameAudioReturn {
	play: (soundId: string, options?: Partial<AudioConfig>) => Promise<void>;
	playRandom: (category: AudioCategory, options?: Partial<AudioConfig>) => Promise<void>;
	stop: (soundId?: string) => void;
	updateConfig: (config: Partial<AudioConfig>) => void;
	isInitialized: boolean;
	isEnabled: boolean;
	setEnabled: (enabled: boolean) => void;
	volume: number;
	setVolume: (volume: number) => void;
	categories: AudioCategory[];
	soundEffects: typeof SOUND_EFFECTS;
}

export const useGameAudio = (options: UseGameAudioOptions = {}): UseGameAudioReturn => {
	const { preloadSounds = [], autoInitialize = true, config = {} } = options;

	const audioSystemRef = useRef<GameAudioSystem | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [isEnabled, setIsEnabled] = useState(config.enabled ?? true);
	const [volume, setVolume] = useState(config.volume ?? 0.7);

	// Initialize audio system
	useEffect(() => {
		if (!autoInitialize || audioSystemRef.current) return;

		const initializeAudio = async () => {
			try {
				const audioConfig = {
					enabled: isEnabled,
					volume,
					preload: true,
					...config,
				};

				audioSystemRef.current = new GameAudioSystem(audioConfig);
				await audioSystemRef.current.initialize(preloadSounds);
				setIsInitialized(true);

				console.log("🎵 [HOOK] Game audio initialized with preloaded sounds:", preloadSounds);
			} catch (error) {
				console.error("🎵 [HOOK] Failed to initialize game audio:", error);
			}
		};

		initializeAudio();

		// Cleanup on unmount
		return () => {
			if (audioSystemRef.current) {
				audioSystemRef.current.dispose();
				audioSystemRef.current = null;
				setIsInitialized(false);
			}
		};
	}, [autoInitialize]); // Remove unstable JSON.stringify dependency

	// Update audio config when state changes
	useEffect(() => {
		if (audioSystemRef.current) {
			audioSystemRef.current.updateConfig({
				enabled: isEnabled,
				volume,
			});
		}
	}, [isEnabled, volume]);

	const play = useCallback(async (soundId: string, playOptions?: Partial<AudioConfig>) => {
		if (!audioSystemRef.current) {
			console.warn("🎵 [HOOK] Audio system not initialized");
			return;
		}

		await audioSystemRef.current.play(soundId, playOptions);
	}, []);

	const playRandom = useCallback(async (category: AudioCategory, playOptions?: Partial<AudioConfig>) => {
		if (!audioSystemRef.current) {
			console.warn("🎵 [HOOK] Audio system not initialized");
			return;
		}

		await audioSystemRef.current.playRandom(category, playOptions);
	}, []);

	const stop = useCallback((soundId?: string) => {
		if (!audioSystemRef.current) return;
		audioSystemRef.current.stop(soundId);
	}, []);

	const updateConfig = useCallback((newConfig: Partial<AudioConfig>) => {
		if (!audioSystemRef.current) return;
		audioSystemRef.current.updateConfig(newConfig);

		// Update local state
		if (newConfig.enabled !== undefined) setIsEnabled(newConfig.enabled);
		if (newConfig.volume !== undefined) setVolume(newConfig.volume);
	}, []);

	const handleSetEnabled = useCallback((enabled: boolean) => {
		setIsEnabled(enabled);
		if (audioSystemRef.current) {
			audioSystemRef.current.updateConfig({ enabled });
		}
	}, []);

	const handleSetVolume = useCallback((newVolume: number) => {
		const clampedVolume = Math.max(0, Math.min(1, newVolume));
		setVolume(clampedVolume);
		if (audioSystemRef.current) {
			audioSystemRef.current.updateConfig({ volume: clampedVolume });
		}
	}, []);

	return {
		play,
		playRandom,
		stop,
		updateConfig,
		isInitialized,
		isEnabled,
		setEnabled: handleSetEnabled,
		volume,
		setVolume: handleSetVolume,
		categories: Object.values(AudioCategory),
		soundEffects: SOUND_EFFECTS,
	};
};
