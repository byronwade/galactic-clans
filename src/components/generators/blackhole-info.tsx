/**
 * @file blackhole-info.tsx
 * @description Info panel for the Black Hole Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Info, Zap, Target, Gauge, Thermometer, Magnet, Atom, Eye } from "lucide-react";
import type { BlackHoleConfig } from "./blackhole-generator";

interface BlackHoleInfoProps {
	config: BlackHoleConfig;
}

export function BlackHoleInfo({ config }: BlackHoleInfoProps) {
	const getBlackHoleCharacteristics = (type: string) => {
		switch (type) {
			case "stellar":
				return {
					formation: "Core collapse of massive stars (>20 M☉)",
					environment: "Binary systems, star clusters",
					behavior: "X-ray binaries, gamma-ray bursts",
					examples: "Cygnus X-1, V404 Cygni",
				};
			case "intermediate":
				return {
					formation: "Unknown - possibly mergers or direct collapse",
					environment: "Globular clusters, dwarf galaxies",
					behavior: "Ultraluminous X-ray sources",
					examples: "HLX-1, M82 X-1",
				};
			case "supermassive":
				return {
					formation: "Galaxy mergers, direct collapse, accretion",
					environment: "Galactic centers",
					behavior: "Active galactic nuclei, quasars",
					examples: "Sagittarius A*, M87*, TON 618",
				};
			default:
				return {
					formation: "Unknown formation mechanism",
					environment: "Various environments",
					behavior: "Diverse behaviors",
					examples: "Various examples",
				};
		}
	};

	const characteristics = getBlackHoleCharacteristics(config.type);

	return (
		<div className="absolute left-4 top-20 bottom-4 z-10 w-80">
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl overflow-hidden">
				<div className="px-4 py-3 bg-slate-800/50 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Info className="w-4 h-4 text-purple-400" />
						<span className="text-sm font-medium text-white">Black Hole Physics</span>
					</div>
				</div>
				<div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
					{/* Type Overview */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-white flex items-center gap-2">
							<Zap className="w-4 h-4 text-purple-400" />
							{config.type.charAt(0).toUpperCase() + config.type.slice(1)} Black Hole
						</h3>
						<div className="text-sm text-slate-300 space-y-2">
							<p>
								<strong>Formation:</strong> {characteristics.formation}
							</p>
							<p>
								<strong>Environment:</strong> {characteristics.environment}
							</p>
							<p>
								<strong>Behavior:</strong> {characteristics.behavior}
							</p>
							<p>
								<strong>Examples:</strong> {characteristics.examples}
							</p>
						</div>
					</div>

					{/* Relativistic Physics */}
					<div className="space-y-3">
						<h4 className="text-md font-semibold text-purple-400 flex items-center gap-2">
							<Atom className="w-4 h-4" />
							Relativistic Physics
						</h4>
						<div className="text-sm text-slate-300 space-y-2">
							<p>
								<strong>Event Horizon:</strong> {(2.95 * config.mass).toFixed(1)} km radius
							</p>
							<p>
								<strong>Schwarzschild Radius:</strong> {config.mass * 2.95} km
							</p>
							<p>
								<strong>Spin Parameter:</strong> {config.spin.toFixed(3)} (max: 0.998)
							</p>
							<p>
								<strong>Ergosphere:</strong> Present when a &gt; 0
							</p>
						</div>
					</div>

					{/* Accretion Physics */}
					<div className="space-y-3">
						<h4 className="text-md font-semibold text-blue-400 flex items-center gap-2">
							<Target className="w-4 h-4" />
							Accretion Physics
						</h4>
						<div className="text-sm text-slate-300 space-y-2">
							<p>
								<strong>Accretion Rate:</strong> {config.accretionRate.toFixed(4)} M☉/yr
							</p>
							<p>
								<strong>Disk Temperature:</strong> {config.temperature.toLocaleString()} K
							</p>
							<p>
								<strong>Corona Temperature:</strong> {(config.coronaTemperature / 1000000).toFixed(1)}M K
							</p>
							<p>
								<strong>Luminosity:</strong> ~{Math.round(config.accretionRate * config.mass * 0.1).toLocaleString()} L☉
							</p>
						</div>
					</div>

					{/* Magnetic Fields */}
					<div className="space-y-3">
						<h4 className="text-md font-semibold text-cyan-400 flex items-center gap-2">
							<Magnet className="w-4 h-4" />
							Magnetic Fields
						</h4>
						<div className="text-sm text-slate-300 space-y-2">
							<p>
								<strong>Field Strength:</strong> {config.magneticField.toLocaleString()} G
							</p>
							<p>
								<strong>Jet Power:</strong> {config.jetPower.toFixed(2)} (relative)
							</p>
							<p>
								<strong>Synchrotron Emission:</strong> {config.synchrotronEmission.toFixed(2)}
							</p>
							<p>
								<strong>Relativistic Beaming:</strong> {config.relativisticBeaming.toFixed(2)}
							</p>
						</div>
					</div>

					{/* Observational Properties */}
					<div className="space-y-3">
						<h4 className="text-md font-semibold text-green-400 flex items-center gap-2">
							<Eye className="w-4 h-4" />
							Observational Properties
						</h4>
						<div className="text-sm text-slate-300 space-y-2">
							<p>
								<strong>Inclination:</strong> {config.inclination}°
							</p>
							<p>
								<strong>Viewing Distance:</strong> {config.viewingDistance.toLocaleString()} AU
							</p>
							<p>
								<strong>Lensing Strength:</strong> {config.lensingStrength.toFixed(2)}
							</p>
							<p>
								<strong>Apparent Size:</strong> ~{(((2.95 * config.mass) / config.viewingDistance) * 206265).toFixed(2)} μas
							</p>
						</div>
					</div>

					{/* Scientific Notes */}
					<div className="space-y-3">
						<h4 className="text-md font-semibold text-yellow-400 flex items-center gap-2">
							<Gauge className="w-4 h-4" />
							Scientific Notes
						</h4>
						<div className="text-sm text-slate-300 space-y-2">
							<p>• Kerr metric describes rotating black holes</p>
							<p>• Accretion disks emit across electromagnetic spectrum</p>
							<p>• Relativistic jets can extend millions of light-years</p>
							<p>• Gravitational lensing distorts background objects</p>
							<p>• Hawking radiation (negligible for stellar+ black holes)</p>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Scrollbar Styles */}
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(30, 41, 59, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(148, 163, 184, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(148, 163, 184, 0.5);
				}
			`}</style>
		</div>
	);
}
