"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Play, Settings, Trophy, Users, HelpCircle, Star, Home, Gamepad2 } from "lucide-react";
import { useGameAudio } from "@/hooks/useGameAudio";

// Dynamic import to prevent SSR issues
const BackgroundPlanet = dynamic(() => import("@/components/BackgroundPlanet"), {
	ssr: false,
	loading: () => (
		<div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
			<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
		</div>
	),
});

export const MainMenu: React.FC = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const { play, isInitialized } = useGameAudio({
		preloadSounds: ["click_sharp", "select_choose", "confirm_success", "open_reveal"],
		autoInitialize: true,
	});

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const handleButtonClick = async (soundType: "click" | "select" | "confirm" = "click") => {
		if (!isInitialized) return;

		try {
			switch (soundType) {
				case "click":
					await play("click_sharp");
					break;
				case "select":
					await play("select_choose");
					break;
				case "confirm":
					await play("confirm_success");
					break;
			}
		} catch (error) {
			console.warn("Audio playback failed:", error);
		}
	};

	const handleNavigation = async (href: string) => {
		await handleButtonClick("confirm");
		// Add a small delay to let the sound play before navigation
		setTimeout(() => {
			window.location.href = href;
		}, 100);
	};

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white overflow-hidden relative">
			{/* Background Planet */}
			<div className="absolute right-0 top-0 w-1/2 h-full">
				<BackgroundPlanet />
			</div>

			{/* Main Content */}
			<div className="relative z-10 min-h-screen flex items-center">
				<div className="container mx-auto px-8">
					<div className="max-w-2xl">
						{/* Title Section */}
						<div className="mb-12">
							<h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Galactic Clans</h1>
							<p className="text-xl text-slate-300 mb-2">Conquer the cosmos, build your empire</p>
							<p className="text-slate-400">Explore infinite worlds, forge powerful alliances, and dominate the galaxy in this epic space strategy game.</p>
						</div>

						{/* Main Menu Buttons */}
						<div className="space-y-4 mb-8">
							<button onClick={() => handleNavigation("/game")} onMouseEnter={() => handleButtonClick("select")} className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25">
								<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
								<div className="relative flex items-center justify-center space-x-3">
									<Play className="w-6 h-6" />
									<span className="text-lg">Start Game</span>
								</div>
							</button>

							<div className="grid grid-cols-2 gap-4">
								<button onClick={() => handleNavigation("/multiplayer")} onMouseEnter={() => handleButtonClick("select")} className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm">
									<div className="flex items-center justify-center space-x-2">
										<Users className="w-5 h-5 text-green-400" />
										<span>Multiplayer</span>
									</div>
								</button>

								<button onClick={() => handleNavigation("/settings")} onMouseEnter={() => handleButtonClick("select")} className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm">
									<div className="flex items-center justify-center space-x-2">
										<Settings className="w-5 h-5 text-blue-400" />
										<span>Settings</span>
									</div>
								</button>

								<button onClick={() => handleNavigation("/achievements")} onMouseEnter={() => handleButtonClick("select")} className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm">
									<div className="flex items-center justify-center space-x-2">
										<Trophy className="w-5 h-5 text-yellow-400" />
										<span>Achievements</span>
									</div>
								</button>

								<button onClick={() => handleNavigation("/credits")} onMouseEnter={() => handleButtonClick("select")} className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm">
									<div className="flex items-center justify-center space-x-2">
										<Star className="w-5 h-5 text-purple-400" />
										<span>Credits</span>
									</div>
								</button>
							</div>
						</div>

						{/* Quick Access */}
						<div className="flex items-center justify-between">
							<div className="flex space-x-4">
								<Link href="/test" onClick={() => handleButtonClick("click")} onMouseEnter={() => handleButtonClick("select")} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200">
									<Gamepad2 className="w-4 h-4" />
									<span className="text-sm">Test Suite</span>
								</Link>

								<button onClick={() => handleNavigation("/help")} onMouseEnter={() => handleButtonClick("select")} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200">
									<HelpCircle className="w-4 h-4" />
									<span className="text-sm">Help</span>
								</button>
							</div>

							{/* Audio Status Indicator */}
							{isInitialized && (
								<div className="flex items-center space-x-1 text-xs text-slate-500">
									<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
									<span>Audio Ready</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
