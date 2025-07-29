/**
 * @file solar-system-controls.tsx
 * @description Header controls for the Solar System Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Shuffle, RotateCcw, Settings2, Info, Play, Sparkles } from "lucide-react";
import type { SolarSystemConfig } from "./solar-system-generator";

interface SolarSystemControlsProps {
	config: SolarSystemConfig;
	availableSystemTypes: Array<{ value: string; label: string; description: string }>;
	isGenerating: boolean;
	status: string;
	onSystemTypeChange: (type: string) => void;
	onGenerate: () => void;
	onRandomize: () => void;
	onClear: () => void;
	onToggleSettings: () => void;
	onToggleInfo: () => void;
	showSettings: boolean;
	showInfo: boolean;
}

export function SolarSystemControls({
	config,
	availableSystemTypes,
	isGenerating,
	status,
	onSystemTypeChange,
	onGenerate,
	onRandomize,
	onClear,
	onToggleSettings,
	onToggleInfo,
	showSettings,
	showInfo
}: SolarSystemControlsProps) {
	const currentSystemType = availableSystemTypes.find(t => t.value === config.starType) || availableSystemTypes[0];

	return (
		<>
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-xl border-b border-orange-400/30">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center space-x-4">
						<Link 
							href="/test" 
							className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200"
						>
							<ArrowLeft className="w-5 h-5" />
							<span className="font-medium">Back</span>
						</Link>
						
						<div className="w-px h-6 bg-slate-600" />
						
						<div className="flex items-center space-x-3">
							<Sun className="w-6 h-6 text-orange-400" />
							<h1 className="text-xl font-bold text-white">Solar System Generator</h1>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						{/* System Type Selector */}
						<div className="flex items-center space-x-2">
							<span className="text-sm text-slate-400">System Type:</span>
							<select
								value={config.starType}
								onChange={(e) => onSystemTypeChange(e.target.value)}
								className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 
										 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
							>
								{availableSystemTypes.map((type) => (
									<option key={type.value} value={type.value}>
										{type.label}
									</option>
								))}
							</select>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center space-x-2">
							<button
								onClick={onGenerate}
								disabled={isGenerating}
								className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 
										 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg 
										 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Play className="w-4 h-4" />
								<span>Generate</span>
							</button>

							<button
								onClick={onRandomize}
								className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 
										 text-slate-200 border border-slate-600 hover:border-slate-500 rounded-lg 
										 transition-all duration-200"
							>
								<Shuffle className="w-4 h-4" />
								<span>Random</span>
							</button>

							<button
								onClick={onClear}
								className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 
										 text-slate-200 border border-slate-600 hover:border-slate-500 rounded-lg 
										 transition-all duration-200"
							>
								<RotateCcw className="w-4 h-4" />
							</button>

							<div className="w-px h-6 bg-slate-600" />

							<button
								onClick={onToggleSettings}
								className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
									showSettings 
										? "bg-orange-500 text-white" 
										: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600"
								}`}
							>
								<Settings2 className="w-4 h-4" />
								<span>Settings</span>
							</button>

							<button
								onClick={onToggleInfo}
								className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
									showInfo 
										? "bg-orange-500 text-white" 
										: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600"
								}`}
							>
								<Info className="w-4 h-4" />
								<span>Info</span>
							</button>
						</div>
					</div>
				</div>

				{/* System Type Description */}
				<div className="px-6 pb-3">
					<div className="text-sm text-orange-200 bg-orange-500/10 border border-orange-400/20 rounded-lg px-3 py-2">
						{currentSystemType?.description || "Unknown system type"}
					</div>
				</div>
			</div>

			{/* Status Message */}
			<div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 
							bg-orange-500/10 backdrop-blur-sm border border-orange-400/30 rounded-lg px-4 py-2">
				<div className="flex items-center space-x-2 text-orange-400 text-sm">
					<Sparkles className="w-4 h-4" />
					<span>{status}</span>
				</div>
			</div>
		</>
	);
} 