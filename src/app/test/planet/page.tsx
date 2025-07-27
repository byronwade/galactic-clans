/**
 * @file page.tsx
 * @description Enhanced Planet Generator Test Page with Controller Support
 * @version 5.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ControllerIndicator from "@/components/ControllerIndicator";
import dynamic from "next/dynamic";

// Dynamically import PlanetGenerator to avoid SSR issues
const PlanetGenerator = dynamic(() => import("@/components/generators/planet-generator"), {
	ssr: false,
	loading: () => (
		<div className="flex fixed inset-0 z-50 justify-center items-center bg-gradient-to-br to-black from-slate-950 via-blue-950">
			<div className="space-y-4 text-center">
				<div className="mx-auto w-16 h-16 rounded-full border-4 animate-spin border-blue-400/30 border-t-blue-400" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Loading Planet Generator</h2>
					<p className="text-sm text-slate-300">Initializing 3D planetary system...</p>
				</div>
			</div>
		</div>
	),
});

export default function PlanetGeneratorTestPage() {
	// Controller configuration for planet generation
	const controllerActions = {
		onSecondaryAction: () => {
			window.history.back();
		},
		onBackAction: () => {
			window.history.back();
		},
	};

	const planetControllerHelp = [
		{ control: "Right Stick", action: "Rotate planet view", category: "3D Navigation" as const },
		{ control: "Left Stick", action: "Move camera around", category: "3D Navigation" as const },
		{ control: "Triggers", action: "Zoom in/out", category: "3D Navigation" as const },
		{ control: "A/X Button", action: "Regenerate planet", category: "Actions" as const },
		{ control: "X/Square", action: "Toggle settings panel", category: "UI Controls" as const },
		{ control: "Y/Triangle", action: "Toggle info panel", category: "UI Controls" as const },
		{ control: "B/Circle", action: "Go back to tests", category: "Actions" as const },
		{ control: "Start/Options", action: "Toggle this help", category: "System" as const },
	];

	return (
		<div className="fixed inset-0">
			{/* Planet Generator - Full Screen */}
			<PlanetGenerator />

			{/* Universal Controller Support */}
			<ControllerIndicator
				position="top-right"
				accentColor="green"
				pageTitle="Planet Generator"
				actions={controllerActions}
				helpItems={planetControllerHelp}
				controllerOptions={{
					sensitivity: 1.2,
					deadzone: 0.12,
					enableHaptics: true,
				}}
			/>

			{/* Back Button */}
			<div className="absolute top-4 left-4 z-50">
				<Link className="flex items-center px-3 py-2 space-x-2 text-sm rounded-lg border backdrop-blur-sm transition-all duration-200 bg-black/50 border-slate-700/50 text-slate-200 hover:text-white hover:bg-black/70" href="/test">
					<ArrowLeft className="w-4 h-4" />
					<span>Back to Tests</span>
				</Link>
			</div>
		</div>
	);
}
