"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Headphones, Volume2, Music } from "lucide-react";
import { AudioDemo } from "@/components/AudioDemo";
import BackgroundMusicManager from "@/components/BackgroundMusicManager";

export default function AudioTestPage() {
	return (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
			{/* Header - Consistent 64px height */}
			<header className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/30">
				<div className="h-full px-6 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link href="/test" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-200 hover:text-white transition-all duration-200">
							<ArrowLeft className="w-4 h-4" />
							<span className="text-sm font-medium">Back to Tests</span>
						</Link>

						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
								<Headphones className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-white">Audio System Test</h1>
								<p className="text-sm text-slate-400">Complete audio library with background music</p>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-6">
						<div className="flex items-center space-x-2 text-slate-400">
							<Volume2 className="w-4 h-4" />
							<span className="text-sm">Interface Sounds</span>
						</div>
						<div className="flex items-center space-x-2 text-slate-400">
							<Music className="w-4 h-4" />
							<span className="text-sm">Background Music</span>
						</div>
						{/* Compact background music controls in header */}
						<div className="border-l border-slate-600 pl-6">
							<BackgroundMusicManager compact />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="pt-16 w-full h-full overflow-auto">
				<div className="container mx-auto px-6 py-8">
					<div className="max-w-6xl mx-auto space-y-6">
						{/* Description */}
						<div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/50">
							<h2 className="text-xl font-semibold text-white mb-3">Audio System Features</h2>
							<div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
								<div>
									<h3 className="font-medium text-white mb-2 flex items-center gap-2">
										<Volume2 className="w-4 h-4" />
										Interface Sounds
									</h3>
									<ul className="space-y-1 text-slate-400">
										<li>• Interface sounds (clicks, confirmations, errors)</li>
										<li>• Navigation sounds (back, open, close)</li>
										<li>• Interaction sounds (drop, select, toggle)</li>
										<li>• Feedback sounds (glass, glitch, programmatic)</li>
									</ul>
								</div>
								<div>
									<h3 className="font-medium text-white mb-2 flex items-center gap-2">
										<Music className="w-4 h-4" />
										Background Music
									</h3>
									<ul className="space-y-1 text-slate-400">
										<li>• Epic march & victory fanfare</li>
										<li>• Electronic tracks (Club Diver, Steel Rods)</li>
										<li>• Ambient space atmospheres (5 variants)</li>
										<li>• Sci-fi gaming soundtrack</li>
									</ul>
								</div>
								<div>
									<h3 className="font-medium text-white mb-2">⚡ System Capabilities</h3>
									<ul className="space-y-1 text-slate-400">
										<li>• Real-time volume control and muting</li>
										<li>• Background music looping and crossfading</li>
										<li>• Category-based random sound selection</li>
										<li>• Comprehensive error handling and fallbacks</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Background Music Manager */}
						<div className="grid lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2">
								<AudioDemo />
							</div>
							<div>
								<BackgroundMusicManager autoStart={false} initialTrack="space_ambient_improved" />
							</div>
						</div>

						{/* Background Music Info */}
						<div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30">
							<h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
								<Music className="w-5 h-5 text-purple-400" />
								Complete Music Library
							</h3>
							<div className="grid md:grid-cols-3 gap-6 text-sm">
								<div>
									<h4 className="font-medium text-purple-400 mb-2">Theme Music</h4>
									<div className="space-y-2 text-slate-300">
										<div className="flex justify-between">
											<span>Epic March</span>
											<span className="text-purple-400">Classic</span>
										</div>
										<div className="flex justify-between">
											<span>Victory Fanfare</span>
											<span className="text-purple-400">Cinematic</span>
										</div>
										<div className="flex justify-between">
											<span>Club Diver</span>
											<span className="text-purple-400">Electronic</span>
										</div>
										<div className="flex justify-between">
											<span>Steel Rods</span>
											<span className="text-purple-400">Industrial</span>
										</div>
										<div className="flex justify-between">
											<span>Space Game</span>
											<span className="text-purple-400">Sci-fi</span>
										</div>
									</div>
								</div>
								<div>
									<h4 className="font-medium text-blue-400 mb-2">Ambient Tracks</h4>
									<div className="space-y-2 text-slate-300">
										<div className="flex justify-between">
											<span>Mystic Plains</span>
											<span className="text-blue-400">Atmospheric</span>
										</div>
										<div className="flex justify-between">
											<span>Space Ambient (3 variants)</span>
											<span className="text-blue-400">Environmental</span>
										</div>
										<div className="flex justify-between">
											<span>Ice Flow</span>
											<span className="text-blue-400">Chill</span>
										</div>
										<div className="flex justify-between">
											<span>Space Goddess</span>
											<span className="text-blue-400">Ethereal</span>
										</div>
									</div>
								</div>
								<div>
									<h4 className="font-medium text-green-400 mb-2">Features</h4>
									<div className="space-y-2 text-slate-300">
										<div className="flex justify-between">
											<span>Total Tracks</span>
											<span className="text-green-400">11</span>
										</div>
										<div className="flex justify-between">
											<span>Auto-Loop</span>
											<span className="text-green-400">Enabled</span>
										</div>
										<div className="flex justify-between">
											<span>Volume Control</span>
											<span className="text-green-400">Per Track</span>
										</div>
										<div className="flex justify-between">
											<span>Crossfade</span>
											<span className="text-green-400">Smooth</span>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
								<p className="text-xs text-purple-200">🎵 Complete music library with 11 tracks featuring automatic looping, volume balancing, and seamless integration. Use the music player to explore all available tracks!</p>
							</div>
						</div>

						{/* Technical Info */}
						<div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/50">
							<h3 className="text-lg font-semibold text-white mb-3">Technical Implementation</h3>
							<div className="grid md:grid-cols-3 gap-4 text-sm">
								<div className="space-y-2">
									<h4 className="font-medium text-blue-400">Audio System</h4>
									<p className="text-slate-300">HTML5 Audio API with React integration</p>
									<p className="text-slate-300">Background music management with looping</p>
									<p className="text-slate-500">
										Based on industry best practices from
										<a href="https://edvins.io/integrating-sound-effects-in-react/" className="text-blue-400 hover:text-blue-300 ml-1" target="_blank" rel="noopener noreferrer">
											Edvins.io
										</a>
									</p>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium text-green-400">Sound Sources</h4>
									<p className="text-slate-300">Kenney Interface Sounds (CC0 License)</p>
									<p className="text-slate-300">Custom Programmatic UI Sounds</p>
									<p className="text-slate-300">11 Background Music Tracks</p>
									<p className="text-slate-300">Electronic & Ambient Music Library</p>
									<p className="text-slate-500">100+ high-quality audio files</p>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium text-purple-400">Features</h4>
									<p className="text-slate-300">Preloading, categorization, and volume control</p>
									<p className="text-slate-300">Background music with loop control</p>
									<p className="text-slate-300">React hook integration with cleanup</p>
									<p className="text-slate-500">Performance optimized for gaming</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
