/**
 * @file page.tsx
 * @description Enhanced Galaxy Generator Test Page with Controller Support
 * @version 5.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ControllerIndicator from "@/components/ControllerIndicator";
import dynamic from "next/dynamic";

// Dynamically import GalaxyGenerator to avoid SSR issues
const GalaxyGenerator = dynamic(() => import("@/components/generators/galaxy-generator"), {
	ssr: false,
	loading: () => (
		<div className="flex fixed inset-0 z-50 justify-center items-center bg-gradient-to-br to-black from-slate-950 via-purple-950">
			<div className="space-y-4 text-center">
				<div className="mx-auto w-16 h-16 rounded-full border-4 animate-spin border-purple-400/30 border-t-purple-400" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Loading Galaxy Generator</h2>
					<p className="text-sm text-slate-300">Initializing galactic visualization...</p>
				</div>
			</div>
		</div>
	),
});

export default function GalaxyGeneratorTestPage() {
	// Controller configuration for galaxy exploration
	const controllerActions = {
		onSecondaryAction: () => {
			window.history.back();
		},
		onBackAction: () => {
			window.history.back();
		},
	};

	const galaxyControllerHelp = [
		{ control: "Right Stick", action: "Rotate galaxy view", category: "3D Navigation" as const },
		{ control: "Left Stick", action: "Pan around galaxy", category: "3D Navigation" as const },
		{ control: "Triggers", action: "Zoom in/out", category: "3D Navigation" as const },
		{ control: "A/X Button", action: "Generate new galaxy", category: "Actions" as const },
		{ control: "X/Square", action: "Galaxy settings", category: "UI Controls" as const },
		{ control: "Y/Triangle", action: "Galaxy information", category: "UI Controls" as const },
		{ control: "B/Circle", action: "Back to test suite", category: "Actions" as const },
		{ control: "Start/Options", action: "Toggle help", category: "System" as const },
		{ control: "Bumpers", action: "Switch galaxy type", category: "Actions" as const },
	];

	return (
		<div className="fixed inset-0">
			{/* Galaxy Generator - Full Screen */}
			<GalaxyGenerator />

			{/* Universal Controller Support */}
			<ControllerIndicator
				position="top-right"
				accentColor="purple"
				pageTitle="Galaxy Generator"
				actions={controllerActions}
				helpItems={galaxyControllerHelp}
				controllerOptions={{
					sensitivity: 0.8,
					deadzone: 0.15,
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
