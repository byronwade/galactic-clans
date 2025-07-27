/**
 * @file blackhole-controls.tsx
 * @description Header controls for the Black Hole Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Shuffle, Settings2, Info, Eye, EyeOff, Download, Share2, Zap, Sparkles } from "lucide-react";
import type { BlackHoleConfig, BlackHoleType } from "./blackhole-generator";

interface BlackHoleControlsProps {
	config: BlackHoleConfig;
	status: string;
	isGenerating: boolean;
	showSettings: boolean;
	showInfo: boolean;
	onGenerate: () => void;
	onClear: () => void;
	onRandomize: () => void;
	onToggleSettings: () => void;
	onToggleInfo: () => void;
}

export function BlackHoleControls({ config, status, isGenerating, showSettings, showInfo, onGenerate, onClear, onRandomize, onToggleSettings, onToggleInfo }: BlackHoleControlsProps) {
	const getTypeDescription = (type: BlackHoleType) => {
		switch (type) {
			case "stellar":
				return "3-50 M☉ - Formed from massive star collapse";
			case "intermediate":
				return "100-10K M☉ - Mysterious formation process";
			case "supermassive":
				return "1M-100B M☉ - Galactic center behemoths";
			default:
				return "Unknown type";
		}
	};

	return (
		<>
			{/* Modern Header */}
			<header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/10 backdrop-blur-sm border-b border-slate-700/20">
				<div className="container mx-auto px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Link className="flex items-center space-x-2 px-2 py-1 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-200 hover:text-white transition-all duration-200 text-sm" href="/test">
								<ArrowLeft className="w-3 h-3" />
								<span className="text-xs font-medium">Back</span>
							</Link>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-black flex items-center justify-center">
									<Zap className="w-3 h-3 text-white" />
								</div>
								<div>
									<h1 className="text-sm font-semibold text-white">Black Hole Generator</h1>
									<p className="text-xs text-slate-300">Relativistic physics simulation</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-1">
							<button title="Toggle Info" className={`p-1.5 rounded-md transition-colors ${showInfo ? "bg-purple-500/30 text-purple-300" : "bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white"}`} onClick={onToggleInfo}>
								<Info className="w-3 h-3" />
							</button>
							<button title="Toggle Settings" className={`p-1.5 rounded-md transition-colors ${showSettings ? "bg-purple-500/30 text-purple-300" : "bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white"}`} onClick={onToggleSettings}>
								<Settings2 className="w-3 h-3" />
							</button>
							<button className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
								<Share2 className="w-3 h-3" />
							</button>
							<button className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
								<Download className="w-3 h-3" />
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Status Message */}
			<div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-lg px-4 py-2">
				<div className="flex items-center space-x-2 text-purple-400 text-sm">
					<Sparkles className="w-4 h-4" />
					<span>{status}</span>
				</div>
			</div>

			{/* Floating Action Buttons */}
			<div className="absolute bottom-4 left-4 z-10 flex space-x-3">
				<button onClick={onGenerate} disabled={isGenerating} className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-black hover:from-purple-600 hover:to-gray-900 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
					<Play className="w-4 h-4" />
					<span>Generate Black Hole</span>
				</button>
				<button onClick={onRandomize} className="flex items-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200">
					<Shuffle className="w-4 h-4" />
					<span>Randomize</span>
				</button>
				<button onClick={onClear} className="flex items-center space-x-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200">
					<RotateCcw className="w-4 h-4" />
					<span>Clear</span>
				</button>
			</div>
		</>
	);
}
