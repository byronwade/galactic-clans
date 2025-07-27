/**
 * @file galaxy-renderer-3d.tsx
 * @description Full-screen 3D galaxy renderer component
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

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

interface GalaxyRenderer3DProps {
	config: GalaxyConfig;
	isGenerating: boolean;
	onLoadingChange: (loading: boolean) => void;
	onGenerate: () => void;
}

// Dynamic import of the GalaxyRenderer to prevent SSR issues
const GalaxyRendererComponent = dynamic(() => import("@/components/GalaxyRenderer"), {
	ssr: false,
	loading: () => (
		<div className="absolute inset-0 flex items-center justify-center">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Loading Galaxy Renderer</h2>
					<p className="text-sm text-slate-300">Initializing cosmic visualization...</p>
				</div>
			</div>
		</div>
	),
});

export function GalaxyRenderer3D({ config, isGenerating, onLoadingChange, onGenerate }: GalaxyRenderer3DProps) {
	const mountRef = useRef<HTMLDivElement>(null);

	// Handle clear function
	const handleClear = () => {
		// Clear functionality will be handled by the GalaxyRenderer component
	};

	return (
		<div className="absolute inset-0 pt-16">
			<div ref={mountRef} className="w-full h-full">
				<GalaxyRendererComponent config={config} onGenerate={onGenerate} onClear={handleClear} />
			</div>
		</div>
	);
}
