"use client";

import React, { forwardRef } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";
import { AudioCategory } from "@/shared/audio/game-audio-system";
import type { LucideIcon } from "lucide-react";

interface AudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	icon?: LucideIcon;
	soundCategory?: AudioCategory;
	soundId?: string;
	enableHoverSound?: boolean;
	enableClickSound?: boolean;
	audioOptions?: {
		volume?: number;
		enabled?: boolean;
	};
}

export const AudioButton = forwardRef<HTMLButtonElement, AudioButtonProps>(({ children, variant = "secondary", size = "md", icon: Icon, soundCategory, soundId, enableHoverSound = true, enableClickSound = true, audioOptions, className = "", onClick, onMouseEnter, disabled, ...props }, ref) => {
	const { play, playRandom, isInitialized } = useGameAudio({
		autoInitialize: true,
	});

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled || !isInitialized) {
			onClick?.(e);
			return;
		}

		// Play click sound
		if (enableClickSound) {
			try {
				if (soundId) {
					await play(soundId, audioOptions);
				} else if (soundCategory) {
					await playRandom(soundCategory, audioOptions);
				} else {
					// Default click sounds based on variant
					const defaultSounds = {
						primary: "confirm_success",
						secondary: "click_sharp",
						danger: "error_alert",
						ghost: "click_soft",
					};
					await play(defaultSounds[variant], audioOptions);
				}
			} catch (error) {
				console.warn("Audio playback failed:", error);
			}
		}

		onClick?.(e);
	};

	const handleMouseEnter = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled || !isInitialized) {
			onMouseEnter?.(e);
			return;
		}

		// Play hover sound
		if (enableHoverSound) {
			try {
				await play("select_choose", { volume: (audioOptions?.volume ?? 0.7) * 0.5 });
			} catch (error) {
				console.warn("Audio playback failed:", error);
			}
		}

		onMouseEnter?.(e);
	};

	const getVariantClasses = () => {
		switch (variant) {
			case "primary":
				return "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 border-transparent";
			case "secondary":
				return "bg-slate-800/50 hover:bg-slate-700/50 border-slate-600 hover:border-slate-500 text-white backdrop-blur-sm";
			case "danger":
				return "bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 text-red-300 border-red-600/30";
			case "ghost":
				return "bg-transparent hover:bg-slate-800/30 border-transparent text-slate-400 hover:text-white";
			default:
				return "bg-slate-800/50 hover:bg-slate-700/50 border-slate-600 hover:border-slate-500 text-white";
		}
	};

	const getSizeClasses = () => {
		switch (size) {
			case "sm":
				return "px-3 py-1.5 text-sm";
			case "md":
				return "px-4 py-2 text-base";
			case "lg":
				return "px-6 py-3 text-lg";
			default:
				return "px-4 py-2 text-base";
		}
	};

	const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
	const variantClasses = getVariantClasses();
	const sizeClasses = getSizeClasses();
	const hoverClasses = disabled ? "" : "hover:scale-105 hover:shadow-xl";

	return (
		<button ref={ref} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${hoverClasses} ${className}`} onClick={handleClick} onMouseEnter={handleMouseEnter} disabled={disabled} {...props}>
			{Icon && <Icon className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}`} />}
			{children}
		</button>
	);
});

AudioButton.displayName = "AudioButton";
