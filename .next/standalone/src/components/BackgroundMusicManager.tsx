"use client";

import React, { useState, useEffect } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";
import { AudioCategory } from "@/shared/audio/game-audio-system";
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from "lucide-react";

interface BackgroundMusicManagerProps {
	autoStart?: boolean;
	initialTrack?: string;
	className?: string;
	compact?: boolean;
}

const BACKGROUND_TRACKS = [
	"epic_march",
	"mystic_plains",
	"space_ambient_2",
	"space_ambient_3",
	"space_ambient_improved",
	"victory_fanfare",
	// New Music Tracks from /audio/music/
	"club_diver",
	"steel_rods",
	"ice_flow",
	"space_goddess",
	"space_game",
];

const BackgroundMusicManager: React.FC<BackgroundMusicManagerProps> = ({ autoStart = false, initialTrack = "space_ambient_improved", className = "", compact = false }) => {
	const { play, stop, isInitialized, isEnabled, setEnabled, volume, setVolume, soundEffects } = useGameAudio({
		preloadSounds: BACKGROUND_TRACKS,
		autoInitialize: true,
	});

	const [currentTrack, setCurrentTrack] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

	// Auto-start background music if requested
	useEffect(() => {
		if (autoStart && isInitialized && isEnabled && !currentTrack) {
			playTrack(initialTrack);
		}
	}, [autoStart, isInitialized, isEnabled, initialTrack, currentTrack]);

	const playTrack = async (trackId: string) => {
		if (!isInitialized || !isEnabled) return;

		try {
			// Stop current track if playing
			if (currentTrack) {
				stop(currentTrack);
			}

			await play(trackId, { loop: true });
			setCurrentTrack(trackId);
			setIsPlaying(true);

			// Update track index
			const index = BACKGROUND_TRACKS.indexOf(trackId);
			if (index !== -1) {
				setCurrentTrackIndex(index);
			}

			console.log(`🎵 [BGM] Started playing: ${trackId}`);
		} catch (error) {
			console.error(`🎵 [BGM] Failed to play track: ${trackId}`, error);
		}
	};

	const pauseTrack = () => {
		if (currentTrack) {
			stop(currentTrack);
			setIsPlaying(false);
		}
	};

	const resumeTrack = () => {
		if (currentTrack && currentTrack.length > 0) {
			playTrack(currentTrack);
		}
	};

	const nextTrack = () => {
		const nextIndex = (currentTrackIndex + 1) % BACKGROUND_TRACKS.length;
		const nextTrackId = BACKGROUND_TRACKS[nextIndex];
		if (nextTrackId) {
			playTrack(nextTrackId);
		}
	};

	const previousTrack = () => {
		const prevIndex = currentTrackIndex === 0 ? BACKGROUND_TRACKS.length - 1 : currentTrackIndex - 1;
		const prevTrackId = BACKGROUND_TRACKS[prevIndex];
		if (prevTrackId) {
			playTrack(prevTrackId);
		}
	};

	const getCurrentTrackInfo = () => {
		if (!currentTrack) return null;
		return soundEffects[currentTrack];
	};

	if (!isInitialized) {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				<div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
				<span className="text-xs text-slate-400">Loading audio...</span>
			</div>
		);
	}

	if (compact) {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				<button onClick={() => setEnabled(!isEnabled)} className={`p-1.5 rounded-md transition-colors ${isEnabled ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`} title={isEnabled ? "Mute Background Music" : "Enable Background Music"}>
					{isEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
				</button>

				{isEnabled && (
					<button onClick={isPlaying ? pauseTrack : resumeTrack} className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-white transition-colors" title={isPlaying ? "Pause Music" : "Play Music"}>
						{isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
					</button>
				)}
			</div>
		);
	}

	return (
		<div className={`bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 ${className}`}>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Music className="w-5 h-5 text-purple-400" />
					<h3 className="text-white font-medium">Background Music</h3>
				</div>

				<button onClick={() => setEnabled(!isEnabled)} className={`p-2 rounded-lg transition-colors ${isEnabled ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`} title={isEnabled ? "Disable Background Music" : "Enable Background Music"}>
					{isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
				</button>
			</div>

			{/* Current Track Info */}
			{currentTrack && (
				<div className="mb-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-white font-medium text-sm">Now Playing</h4>
							<p className="text-purple-200 text-xs">{getCurrentTrackInfo()?.description}</p>
						</div>
						<div className="flex items-center gap-1">
							{BACKGROUND_TRACKS.map((_, index) => (
								<div key={index} className={`w-1.5 h-1.5 rounded-full ${index === currentTrackIndex ? "bg-purple-400" : "bg-slate-600"}`} />
							))}
						</div>
					</div>
				</div>
			)}

			{/* Controls */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<button onClick={previousTrack} disabled={!isEnabled} className={`p-2 rounded-lg transition-colors ${isEnabled ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`} title="Previous Track">
						<SkipBack className="w-4 h-4" />
					</button>

					<button onClick={isPlaying ? pauseTrack : resumeTrack} disabled={!isEnabled} className={`p-2 rounded-lg transition-colors ${isEnabled ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`} title={isPlaying ? "Pause" : "Play"}>
						{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
					</button>

					<button onClick={nextTrack} disabled={!isEnabled} className={`p-2 rounded-lg transition-colors ${isEnabled ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`} title="Next Track">
						<SkipForward className="w-4 h-4" />
					</button>
				</div>

				{/* Volume Control */}
				<div className="flex items-center gap-2">
					<span className="text-slate-400 text-xs">Volume:</span>
					<input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} disabled={!isEnabled} className="w-16 accent-purple-500 disabled:opacity-50" />
					<span className="text-slate-300 text-xs w-8">{Math.round(volume * 100)}%</span>
				</div>
			</div>

			{/* Track Selection */}
			<div className="space-y-2">
				<h4 className="text-slate-300 text-sm font-medium">Select Track:</h4>
				<div className="grid grid-cols-2 gap-2">
					{BACKGROUND_TRACKS.map((trackId) => {
						const track = soundEffects[trackId];
						if (!track) return null;

						return (
							<button key={trackId} onClick={() => playTrack(trackId)} disabled={!isEnabled} className={`p-2 rounded-md text-left transition-colors text-xs ${currentTrack === trackId ? "bg-purple-600 text-white" : isEnabled ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`} title={track.description}>
								<div className="font-medium truncate">{track.id}</div>
								<div className="text-xs opacity-75 truncate">{track.category}</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default BackgroundMusicManager;
