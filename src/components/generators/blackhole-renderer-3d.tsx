/**
 * @file blackhole-renderer-3d.tsx
 * @description 3D renderer for the Black Hole Generator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { BlackHoleConfig } from "./blackhole-generator";

// Dynamic import to prevent SSR issues
const BlackHoleRenderer = dynamic(() => import("@/components/BlackHoleRenderer"), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black flex items-center justify-center z-50">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Initializing Black Hole Generator</h2>
					<p className="text-sm text-slate-300">Loading spacetime curvature and relativistic physics...</p>
				</div>
			</div>
		</div>
	),
});

interface BlackHoleRenderer3DProps {
	config: BlackHoleConfig;
	onGenerate: () => void;
	onClear: () => void;
	isGenerating: boolean;
}

export function BlackHoleRenderer3D({ config, onGenerate, onClear, isGenerating }: BlackHoleRenderer3DProps) {
	return (
		<div className="absolute inset-0">
			<BlackHoleRenderer 
				config={config} 
				onGenerate={onGenerate} 
				onClear={onClear}
			/>
		</div>
	);
} 