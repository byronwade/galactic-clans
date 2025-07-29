/**
 * @file planet-stats.tsx
 * @description Planet generator quick stats display
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import { Palette } from "lucide-react";
import { PlanetClass } from "@/shared/procgen/planet/planet-types";
import type { PlanetTypeDefinition } from "@/shared/procgen/planet/planet-types";

interface SimplePlanetConfig {
	planetClass: PlanetClass;
	radius: number;
	color: string;
	hasRings: boolean;
	hasMoons: boolean;
	hasAtmosphere: boolean;
}

interface PlanetStatsProps {
	config: SimplePlanetConfig;
	currentPlanetType: PlanetTypeDefinition | undefined;
}

export function PlanetStats({ config, currentPlanetType }: PlanetStatsProps) {
	return (
		<div className="absolute bottom-6 right-6 z-20 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-700/30">
			<h3 className="text-green-400 font-bold mb-2 flex items-center space-x-2">
				<Palette className="w-4 h-4" />
				<span>Quick Stats</span>
			</h3>
			<div className="space-y-1 text-sm">
				<div className="flex justify-between">
					<span className="text-slate-400">Type:</span>
					<span className="text-blue-400">{currentPlanetType?.name}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Radius:</span>
					<span className="text-green-400">{config.radius}x</span>
				</div>
				<div className="flex justify-between">
					<span className="text-slate-400">Features:</span>
					<span className="text-purple-400">{[config.hasAtmosphere && "Atm", config.hasRings && "Rings", config.hasMoons && "Moons"].filter(Boolean).join(", ") || "None"}</span>
				</div>
			</div>
		</div>
	);
}
