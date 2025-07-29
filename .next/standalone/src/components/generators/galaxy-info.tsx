/**
 * @file galaxy-info.tsx
 * @description Galaxy generator info panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Info, Star, Sparkles } from "lucide-react";

// Galaxy configuration interface
interface GalaxyConfig {
	type: string;
	starCount: number;
	radius: number;
	arms: number;
	armSeparation: number;
	spin: number;
	randomness: number;
	power: number;
	insideColor: string;
	outsideColor: string;
	clusterness: number;
	spiralTightness: number;
	bulgeFactor: number;
	diskThickness: number;
}

interface GalaxyType {
	value: string;
	label: string;
	description: string;
}

interface GalaxyInfoProps {
	galaxyType: GalaxyType;
	config: GalaxyConfig;
	onClose: () => void;
}

export function GalaxyInfo({ galaxyType, config, onClose }: GalaxyInfoProps) {
	// Get galaxy characteristics based on type
	const getGalaxyCharacteristics = () => {
		if (galaxyType.value.startsWith("E")) {
			return {
				population: "Old stellar population",
				starFormation: "Minimal to none",
				structure: "Smooth, featureless",
				mass: "10¹⁰ - 10¹³ M☉",
				age: "10-13 billion years",
			};
		} else if (galaxyType.value.includes("Irr")) {
			return {
				population: "Mixed stellar population",
				starFormation: "Active, ongoing",
				structure: "Chaotic, no pattern",
				mass: "10⁸ - 10¹⁰ M☉",
				age: "Variable, 1-10 billion years",
			};
		} else {
			return {
				population: "Mixed stellar population",
				starFormation: "Active in spiral arms",
				structure: "Organized spiral pattern",
				mass: "10¹⁰ - 10¹² M☉",
				age: "8-12 billion years",
			};
		}
	};

	const characteristics = getGalaxyCharacteristics();

	return (
		<div className="absolute top-24 left-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-white font-bold flex items-center space-x-2">
					<Info className="w-4 h-4" />
					<span>Galaxy Info</span>
				</h3>
				<button onClick={onClose} className="text-slate-400 hover:text-white">
					×
				</button>
			</div>

			<div className="space-y-4">
				<div>
					<h4 className="text-purple-400 font-medium mb-1">{galaxyType.label}</h4>
					<p className="text-sm text-slate-300">{galaxyType.description}</p>
				</div>

				<div>
					<h4 className="text-blue-400 font-medium mb-2 flex items-center space-x-1">
						<Star className="w-3 h-3" />
						<span>Physical Properties</span>
					</h4>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="text-slate-400">Star Count:</div>
						<div className="text-slate-300">{config.starCount.toLocaleString()}</div>
						<div className="text-slate-400">Radius:</div>
						<div className="text-slate-300">{config.radius.toFixed(1)} kly</div>
						<div className="text-slate-400">Arms:</div>
						<div className="text-slate-300">{config.arms}</div>
						<div className="text-slate-400">Mass:</div>
						<div className="text-slate-300">{characteristics.mass}</div>
					</div>
				</div>

				<div>
					<h4 className="text-green-400 font-medium mb-2">Astrophysical Data</h4>
					<div className="space-y-1 text-sm">
						<div className="flex justify-between">
							<span className="text-slate-400">Population:</span>
							<span className="text-slate-300">{characteristics.population}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Star Formation:</span>
							<span className="text-slate-300">{characteristics.starFormation}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Structure:</span>
							<span className="text-slate-300">{characteristics.structure}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Age:</span>
							<span className="text-slate-300">{characteristics.age}</span>
						</div>
					</div>
				</div>

				<div>
					<h4 className="text-yellow-400 font-medium mb-2 flex items-center space-x-1">
						<Sparkles className="w-3 h-3" />
						<span>Generation Parameters</span>
					</h4>
					<div className="grid grid-cols-2 gap-1 text-xs">
						<div className="flex justify-between">
							<span className="text-slate-400">Spin:</span>
							<span className="text-slate-300">{config.spin.toFixed(2)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Randomness:</span>
							<span className="text-slate-300">{config.randomness.toFixed(2)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Bulge:</span>
							<span className="text-slate-300">{config.bulgeFactor.toFixed(2)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Tightness:</span>
							<span className="text-slate-300">{config.spiralTightness.toFixed(2)}</span>
						</div>
					</div>
				</div>

				<div>
					<h4 className="text-orange-400 font-medium mb-2">Classification</h4>
					<div className="text-xs text-slate-300 space-y-1">
						<div>
							<strong>Hubble Type:</strong> {galaxyType.value}
						</div>
						<div>
							<strong>Morphology:</strong> {galaxyType.label.split(" - ")[1]}
						</div>
						{galaxyType.value.includes("SB") && (
							<div>
								<strong>Bar Structure:</strong> Present
							</div>
						)}
						{galaxyType.value.startsWith("E") && (
							<div>
								<strong>Ellipticity:</strong> E{galaxyType.value.slice(1) || "0"}
							</div>
						)}
					</div>
				</div>

				<div className="border-t border-slate-700/50 pt-3">
					<div className="text-xs text-slate-400">
						<div>
							<strong>Real Examples:</strong>
						</div>
						{galaxyType.value === "Sc" && <div>• Milky Way Galaxy</div>}
						{galaxyType.value === "Sb" && <div>• Andromeda Galaxy (M31)</div>}
						{galaxyType.value === "E0" && <div>• M87 (Virgo A)</div>}
						{galaxyType.value === "Irr" && <div>• Large Magellanic Cloud</div>}
						{!["Sc", "Sb", "E0", "Irr"].includes(galaxyType.value) && <div>• Various observed galaxies</div>}
					</div>
				</div>
			</div>
		</div>
	);
}
