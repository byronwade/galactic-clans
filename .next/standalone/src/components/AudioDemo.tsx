"use client";

import React, { useState } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";
import { AudioCategory } from "@/shared/audio/game-audio-system";
import { Play, Volume2, VolumeX, RotateCcw, Shuffle, Settings, Music, Pause, SkipForward } from "lucide-react";

export const AudioDemo: React.FC = () => {
	const { play, playRandom, stop, isInitialized, isEnabled, setEnabled, volume, setVolume, categories, soundEffects } = useGameAudio({
		preloadSounds: ["click_sharp", "confirm_success", "error_alert", "select_choose", "epic_march", "space_ambient_improved"],
		autoInitialize: true,
	});

	const [selectedCategory, setSelectedCategory] = useState<AudioCategory>(AudioCategory.CLICK);
	const [isPlaying, setIsPlaying] = useState<string | null>(null);
	const [currentBackgroundMusic, setCurrentBackgroundMusic] = useState<string | null>(null);

	const handlePlaySound = async (soundId: string) => {
		if (!isInitialized) return;

		setIsPlaying(soundId);
		try {
			await play(soundId);

			// Track background music
			const sound = soundEffects[soundId];
			if (sound && (sound.category === AudioCategory.MUSIC || sound.category === AudioCategory.AMBIENT)) {
				setCurrentBackgroundMusic(soundId);
			}
		} catch (error) {
			console.error("Failed to play sound:", error);
		} finally {
			// Clear playing state after a short delay (except for background music)
			const sound = soundEffects[soundId];
			if (!sound || (sound.category !== AudioCategory.MUSIC && sound.category !== AudioCategory.AMBIENT)) {
				setTimeout(() => setIsPlaying(null), 500);
			}
		}
	};

	const handlePlayRandomFromCategory = async (category: AudioCategory) => {
		if (!isInitialized) return;

		setIsPlaying(`random_${category}`);
		try {
			await playRandom(category);
		} catch (error) {
			console.error("Failed to play random sound:", error);
		} finally {
			setTimeout(() => setIsPlaying(null), 500);
		}
	};

	const handleStopBackgroundMusic = () => {
		if (currentBackgroundMusic) {
			stop(currentBackgroundMusic);
			setCurrentBackgroundMusic(null);
			setIsPlaying(null);
		}
	};

	const getSoundsForCategory = (category: AudioCategory) => {
		return Object.entries(soundEffects).filter(([, sound]) => sound.category === category);
	};

	const getCategoryDisplayName = (category: AudioCategory): string => {
		return category
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const getCategoryDescription = (category: AudioCategory): string => {
		const descriptions = {
			[AudioCategory.BACK]: "Navigation and return sounds",
			[AudioCategory.CLICK]: "Button and interaction clicks",
			[AudioCategory.CLOSE]: "Closing and dismissal sounds",
			[AudioCategory.CONFIRMATION]: "Success and completion sounds",
			[AudioCategory.DROP]: "Drag and drop interaction sounds",
			[AudioCategory.ERROR]: "Warning and error notifications",
			[AudioCategory.GLASS]: "Crystal and glass-like chimes",
			[AudioCategory.GLITCH]: "Digital distortion and static",
			[AudioCategory.MAXIMIZE]: "Expansion and growth sounds",
			[AudioCategory.MINIMIZE]: "Collapse and shrinking sounds",
			[AudioCategory.OPEN]: "Opening and revealing sounds",
			[AudioCategory.PLUCK]: "String and harp-like sounds",
			[AudioCategory.QUESTION]: "Inquiry and prompt sounds",
			[AudioCategory.SCRATCH]: "Friction and scraping sounds",
			[AudioCategory.SCROLL]: "List and page navigation sounds",
			[AudioCategory.SELECT]: "Selection and targeting sounds",
			[AudioCategory.SWITCH]: "Mode and view changing sounds",
			[AudioCategory.TICK]: "Timing and rhythm sounds",
			[AudioCategory.TOGGLE]: "Enable/disable state sounds",
			[AudioCategory.BONG]: "Bell and resonant sounds",
			[AudioCategory.PROGRAMMATIC]: "Synthesized electronic sounds",
			[AudioCategory.MUSIC]: "Background music and themes",
			[AudioCategory.AMBIENT]: "Atmospheric and environmental sounds",
			[AudioCategory.CINEMATIC]: "Dramatic and story moments",
			// Game-Specific Categories
			[AudioCategory.COMBAT]: "Battle and fighting sounds",
			[AudioCategory.WEAPONS]: "Weapon firing and impact sounds",
			[AudioCategory.EXPLOSIONS]: "Explosive and destructive sounds",
			[AudioCategory.MECHANICAL]: "Machinery and technology sounds",
			[AudioCategory.NATURE]: "Environmental and weather sounds",
			[AudioCategory.SPACE]: "Sci-fi and space-themed sounds",
			[AudioCategory.ALIEN]: "Extraterrestrial and otherworldly sounds",
			[AudioCategory.VEHICLE]: "Transportation and engine sounds",
			[AudioCategory.FOOTSTEPS]: "Character movement sounds",
			[AudioCategory.VOICE]: "Character voices and speech",
			[AudioCategory.POWER_UPS]: "Collectible and enhancement sounds",
			[AudioCategory.NOTIFICATIONS]: "Alert and notification sounds",
		};
		return descriptions[category] || "Game sound effects";
	};

	const getCategoryIcon = (category: AudioCategory) => {
		switch (category) {
			case AudioCategory.MUSIC:
			case AudioCategory.AMBIENT:
			case AudioCategory.CINEMATIC:
				return <Music className="w-4 h-4" />;
			default:
				return <Volume2 className="w-4 h-4" />;
		}
	};

	const isBackgroundMusicCategory = (category: AudioCategory) => {
		return category === AudioCategory.MUSIC || category === AudioCategory.AMBIENT || category === AudioCategory.CINEMATIC;
	};

	if (!isInitialized) {
		return (
			<div className="flex items-center justify-center p-8 bg-slate-900/50 rounded-lg border border-slate-700/50">
				<div className="text-center space-y-2">
					<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
					<p className="text-slate-300">Initializing Audio System...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-white flex items-center gap-2">
						<Volume2 className="w-6 h-6 text-blue-400" />
						Galactic Clans Audio System
					</h2>
					<p className="text-slate-400 mt-1">
						{Object.keys(soundEffects).length} sound effects across {categories.length} categories
					</p>
				</div>

				{/* Global Controls */}
				<div className="flex items-center gap-3">
					<button onClick={() => setEnabled(!isEnabled)} className={`p-2 rounded-lg transition-colors ${isEnabled ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`} title={isEnabled ? "Disable Audio" : "Enable Audio"}>
						{isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
					</button>

					<div className="flex items-center gap-2">
						<span className="text-slate-400 text-sm">Volume:</span>
						<input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-20 accent-blue-500" />
						<span className="text-slate-300 text-sm w-8">{Math.round(volume * 100)}%</span>
					</div>
				</div>
			</div>

			{/* Background Music Controls */}
			{currentBackgroundMusic && (
				<div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Music className="w-5 h-5 text-purple-400" />
							<div>
								<h3 className="text-white font-medium">Now Playing</h3>
								<p className="text-slate-300 text-sm">{soundEffects[currentBackgroundMusic]?.description}</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button onClick={handleStopBackgroundMusic} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors" title="Stop Background Music">
								<Pause className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Category Selector */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<Settings className="w-4 h-4 text-slate-400" />
					<label className="text-slate-300 font-medium">Sound Category:</label>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
					{categories.map((category) => (
						<button key={category} onClick={() => setSelectedCategory(category)} className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${selectedCategory === category ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"} ${isBackgroundMusicCategory(category) ? "border border-purple-500/30" : ""}`}>
							{getCategoryIcon(category)}
							<span className="truncate">{getCategoryDisplayName(category)}</span>
						</button>
					))}
				</div>
			</div>

			{/* Category Info & Random Play */}
			<div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
				<div className="flex items-center justify-between mb-3">
					<div>
						<h3 className="text-lg font-semibold text-white flex items-center gap-2">
							{getCategoryIcon(selectedCategory)}
							{getCategoryDisplayName(selectedCategory)}
						</h3>
						<p className="text-slate-400 text-sm">{getCategoryDescription(selectedCategory)}</p>
					</div>

					<button onClick={() => handlePlayRandomFromCategory(selectedCategory)} disabled={!isEnabled} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isEnabled ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20" : "bg-slate-700 text-slate-500 cursor-not-allowed"} ${isPlaying === `random_${selectedCategory}` ? "animate-pulse" : ""}`}>
						<Shuffle className="w-4 h-4" />
						Play Random
					</button>
				</div>

				<div className="text-sm text-slate-500">{getSoundsForCategory(selectedCategory).length} sounds available</div>
			</div>

			{/* Sound Effects Grid */}
			<div className="space-y-3">
				<h4 className="text-lg font-medium text-white flex items-center gap-2">
					<Play className="w-4 h-4 text-green-400" />
					{getCategoryDisplayName(selectedCategory)} Sounds
				</h4>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{getSoundsForCategory(selectedCategory).map(([soundId, sound]) => (
						<div key={soundId} className={`bg-slate-800/70 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all group ${isBackgroundMusicCategory(sound.category) ? "border-purple-500/30 bg-purple-900/10" : ""}`}>
							<div className="flex items-center justify-between mb-2">
								<div>
									<h5 className="font-medium text-white text-sm flex items-center gap-2">
										{isBackgroundMusicCategory(sound.category) && <Music className="w-3 h-3 text-purple-400" />}
										{sound.id}
									</h5>
									<p className="text-slate-400 text-xs">{sound.description}</p>
									{sound.loop && <span className="text-purple-400 text-xs">• Loops</span>}
								</div>

								<button
									onClick={() => handlePlaySound(soundId)}
									disabled={!isEnabled}
									className={`p-2 rounded-lg transition-all ${isEnabled ? `${isBackgroundMusicCategory(sound.category) ? "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20" : "bg-green-600 hover:bg-green-700 shadow-green-500/20"} text-white shadow-lg group-hover:scale-110` : "bg-slate-700 text-slate-500 cursor-not-allowed"} ${isPlaying === soundId ? "animate-pulse scale-110" : ""}`}
									title={`Play ${sound.description}`}
								>
									<Play className="w-3 h-3" />
								</button>
							</div>

							<div className="text-xs text-slate-500 font-mono">{sound.path.split("/").pop()}</div>
						</div>
					))}
				</div>
			</div>

			{/* Stop All Button */}
			<div className="flex justify-center pt-4 border-t border-slate-700/50">
				<button onClick={() => stop()} disabled={!isEnabled} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${isEnabled ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
					<RotateCcw className="w-4 h-4" />
					Stop All Sounds
				</button>
			</div>
		</div>
	);
};
