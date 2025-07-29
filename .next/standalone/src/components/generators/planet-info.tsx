/**
 * @file planet-info.tsx
 * @description Planet generator info panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Info } from "lucide-react";
import type { PlanetTypeDefinition } from "@/shared/procgen/planet/planet-types";

interface PlanetInfoProps {
	planetType: PlanetTypeDefinition;
	onClose: () => void;
}

export function PlanetInfo({ planetType, onClose }: PlanetInfoProps) {
	return (
		<div className="absolute top-24 left-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-white font-bold flex items-center space-x-2">
					<Info className="w-4 h-4" />
					<span>Planet Info</span>
				</h3>
				<button onClick={onClose} className="text-slate-400 hover:text-white">
					×
				</button>
			</div>

			<div className="space-y-4">
				<div>
					<h4 className="text-blue-400 font-medium mb-1">{planetType.name}</h4>
					<p className="text-sm text-slate-300">{planetType.description}</p>
				</div>

				<div>
					<h4 className="text-green-400 font-medium mb-2">Properties</h4>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="text-slate-400">Mass Range:</div>
						<div className="text-slate-300">
							{planetType.massRange[0]}-{planetType.massRange[1]} M⊕
						</div>
						<div className="text-slate-400">Temperature:</div>
						<div className="text-slate-300">
							{planetType.temperatureRange[0]}-{planetType.temperatureRange[1]}K
						</div>
					</div>
				</div>

				<div>
					<h4 className="text-yellow-400 font-medium mb-2">Habitability</h4>
					<div className="space-y-1 text-sm">
						<div className="flex justify-between">
							<span className="text-slate-400">Overall Score:</span>
							<span className="text-yellow-400">{planetType.baseHabitability.overallScore}/100</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-400">Danger Level:</span>
							<span className="text-red-400">{planetType.dangerLevel}/10</span>
						</div>
					</div>
				</div>

				<div>
					<h4 className="text-purple-400 font-medium mb-2">Features</h4>
					<div className="grid grid-cols-2 gap-1 text-xs">
						{Object.entries(planetType.features)
							.slice(0, 8)
							.map(([feature, enabled]) => (
								<div key={feature} className="flex items-center space-x-1">
									<span className={`w-2 h-2 rounded-full ${enabled ? "bg-green-400" : "bg-red-400"}`} />
									<span className="text-slate-300 capitalize">{feature.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
