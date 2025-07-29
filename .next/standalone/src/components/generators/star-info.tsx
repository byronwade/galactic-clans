/**
 * @file star-info.tsx
 * @description Star generator info panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Info, Star, Zap } from "lucide-react";

// Star configuration interface
interface StarConfig {
	type: string;
	mass: number;
	temperature: number;
	luminosity: number;
	radius: number;
	age: number;
	evolutionStage: string;
	hasCompanion: boolean;
	companionType: string;
	companionDistance: number;
	metalicity: number;
	rotationPeriod: number;
	magneticField: number;
}

interface StarType {
	value: string;
	label: string;
	description: string;
}

interface StarInfoProps {
	starType: StarType;
	config: StarConfig;
	onClose: () => void;
}

export function StarInfo({ starType, config, onClose }: StarInfoProps) {
	// Get star characteristics based on type
	const getStarCharacteristics = () => {
		if (starType.value.includes("Giant") || starType.value === "Supergiant") {
			return {
				classification: "Evolved Star",
				lifespan: "10 million - 1 billion years",
				formation: "Post main-sequence evolution",
				endFate: "Planetary nebula or supernova",
				habitableZone: "Very distant due to high luminosity",
			};
		} else if (["WhiteDwarf", "NeutronStar", "Pulsar"].includes(starType.value)) {
			return {
				classification: "Stellar Remnant",
				lifespan: "Billions to trillions of years",
				formation: "Stellar death and collapse",
				endFate: "Slow cooling or accretion",
				habitableZone: "None - extreme conditions",
			};
		} else if (starType.value.includes("Variable")) {
			return {
				classification: "Variable Star",
				lifespan: "1 million - 10 billion years",
				formation: "Pulsational instability",
				endFate: "Depends on mass and type",
				habitableZone: "Unstable due to brightness changes",
			};
		} else {
			return {
				classification: "Main Sequence",
				lifespan: "10 million - 100 billion years",
				formation: "Stellar nucleosynthesis",
				endFate: "White dwarf or neutron star",
				habitableZone: "Stable zone for planets",
			};
		}
	};

	const characteristics = getStarCharacteristics();

	// Calculate HR diagram position
	const getHRPosition = () => {
		const logL = Math.log10(config.luminosity);
		const logT = Math.log10(config.temperature);
		return {
			spectralClass: config.type.charAt(0),
			luminosityClass: config.evolutionStage.includes("Giant") ? "III" : "V",
			position: `Log L: ${logL.toFixed(2)}, Log T: ${logT.toFixed(2)}`,
		};
	};

	const hrPosition = getHRPosition();

	return (
		<div className="absolute top-24 left-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-white font-bold flex items-center space-x-2">
					<Info className="w-4 h-4" />
					<span>Star Info</span>
				</h3>
				<button onClick={onClose} className="text-slate-400 hover:text-white">
					×
				</button>
			</div>

			<div className="space-y-4">
				<div>
					<h4 className="text-yellow-400 font-medium mb-1">{starType.label}</h4>
					<p className="text-sm text-slate-300">{starType.description}</p>
				</div>

				<div>
					<h4 className="text-blue-400 font-medium mb-2 flex items-center space-x-1">
						<Star className="w-3 h-3" />
						<span>Physical Properties</span>
					</h4>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="text-slate-400">Mass:</div>
						<div className="text-slate-300">{config.mass.toFixed(2)} M☉</div>
						<div className="text-slate-400">Temperature:</div>
						<div className="text-slate-300">{config.temperature.toLocaleString()} K</div>
						<div className="text-slate-400">Radius:</div>
						<div className="text-slate-300">{config.radius.toFixed(2)} R☉</div>
						<div className="text-slate-400">Luminosity:</div>
						<div className="text-slate-300">{config.luminosity.toFixed(4)} L☉</div>
					</div>
				</div>

				<div>
					<h4 className="text-green-400 font-medium mb-2">Stellar Evolution</h4>
					<div className="space-y-1 text-sm">
						<div className="flex justify-between">
							<span className="text-slate-400">Stage:</span>
							<span className="text-slate-300">{config.evolutionStage}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Age:</span>
							<span className="text-slate-300">{config.age.toFixed(1)} Gyr</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Classification:</span>
							<span className="text-slate-300">{characteristics.classification}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Lifespan:</span>
							<span className="text-slate-300">{characteristics.lifespan}</span>
						</div>
					</div>
				</div>

				<div>
					<h4 className="text-orange-400 font-medium mb-2 flex items-center space-x-1">
						<Zap className="w-3 h-3" />
						<span>HR Diagram</span>
					</h4>
					<div className="grid grid-cols-2 gap-1 text-xs">
						<div className="flex justify-between">
							<span className="text-slate-400">Spectral:</span>
							<span className="text-slate-300">{hrPosition.spectralClass}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Luminosity:</span>
							<span className="text-slate-300">{hrPosition.luminosityClass}</span>
						</div>
						<div className="col-span-2 text-slate-400 text-xs">{hrPosition.position}</div>
					</div>
				</div>

				{config.hasCompanion && (
					<div>
						<h4 className="text-purple-400 font-medium mb-2">Binary System</h4>
						<div className="text-xs text-slate-300 space-y-1">
							<div>
								<strong>Companion:</strong> {config.companionType}
							</div>
							<div>
								<strong>Separation:</strong> {config.companionDistance.toFixed(1)} AU
							</div>
							<div>
								<strong>Period:</strong> ~{Math.sqrt(Math.pow(config.companionDistance, 3) / (config.mass + 1)).toFixed(1)} years
							</div>
						</div>
					</div>
				)}

				<div>
					<h4 className="text-cyan-400 font-medium mb-2">Advanced Properties</h4>
					<div className="text-xs text-slate-300 space-y-1">
						<div>
							<strong>Metallicity:</strong> {config.metalicity.toFixed(4)} (Z/Z☉: {(config.metalicity / 0.0122).toFixed(2)})
						</div>
						<div>
							<strong>Rotation:</strong> {config.rotationPeriod.toFixed(1)} days
						</div>
						<div>
							<strong>Magnetic Field:</strong> {config.magneticField.toFixed(1)}× Solar
						</div>
						<div>
							<strong>Surface Gravity:</strong> {(config.mass / Math.pow(config.radius, 2)).toFixed(2)} (log g)
						</div>
					</div>
				</div>

				<div className="border-t border-slate-700/50 pt-3">
					<div className="text-xs text-slate-400">
						<div>
							<strong>End State:</strong> {characteristics.endFate}
						</div>
						<div>
							<strong>Habitable Zone:</strong> {characteristics.habitableZone}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
