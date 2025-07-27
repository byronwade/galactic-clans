/**
 * @file star-renderer-3d.tsx
 * @description Full-screen 3D star renderer component
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

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

interface StarRenderer3DProps {
	config: StarConfig;
	isGenerating: boolean;
	onLoadingChange: (loading: boolean) => void;
	onGenerate: () => void;
}

// Dynamic import of the StarRenderer to prevent SSR issues
const StarRendererComponent = dynamic(() => import("@/components/StarRenderer"), {
	ssr: false,
	loading: () => (
		<div className="absolute inset-0 flex items-center justify-center">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Loading Star Renderer</h2>
					<p className="text-sm text-slate-300">Initializing stellar visualization...</p>
				</div>
			</div>
		</div>
	),
});

export function StarRenderer3D({ config, isGenerating, onLoadingChange, onGenerate }: StarRenderer3DProps) {
	const mountRef = useRef<HTMLDivElement>(null);

	return (
		<div className="absolute inset-0 pt-16">
			<div ref={mountRef} className="w-full h-full" style={{ position: "relative" }}>
				<StarRendererComponent config={config} />
			</div>
		</div>
	);
}
