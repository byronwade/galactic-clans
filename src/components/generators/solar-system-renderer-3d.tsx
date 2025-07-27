/**
 * @file solar-system-renderer-3d.tsx
 * @description 3D renderer for the Solar System Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import type { SolarSystemConfig } from "./solar-system-generator";

// Dynamic import to prevent SSR issues
const SolarSystemRenderer = dynamic(() => import("@/components/SolarSystemRenderer"), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-orange-950 to-black flex items-center justify-center z-10">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Initializing Solar System</h2>
					<p className="text-sm text-slate-300">Loading orbital mechanics and celestial bodies...</p>
				</div>
			</div>
		</div>
	),
});

interface SolarSystemRenderer3DProps {
	config: SolarSystemConfig;
	isLoading: boolean;
	onLoadingChange: (loading: boolean) => void;
}

export function SolarSystemRenderer3D({ config, isLoading, onLoadingChange }: SolarSystemRenderer3DProps) {
	useEffect(() => {
		// Simulate loading when config changes
		onLoadingChange(true);
		const timer = setTimeout(() => {
			onLoadingChange(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, [config, onLoadingChange]);

	return (
		<div className="absolute inset-0 pt-32">
			<SolarSystemRenderer />
		</div>
	);
} 