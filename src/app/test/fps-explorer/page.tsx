/**
 * @file page.tsx
 * @description Enhanced FPS Explorer Test Page with Controller Support
 * @version 2.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ControllerIndicator from "@/components/ControllerIndicator";
import dynamic from "next/dynamic";

// Dynamically import FPSExplorerGenerator to avoid SSR issues
const FPSExplorerGenerator = dynamic(() => import("@/components/generators/fps-explorer-generator"), {
	ssr: false,
	loading: () => (
		<div className="flex fixed inset-0 z-50 justify-center items-center bg-gradient-to-br to-black from-slate-950 via-green-950">
			<div className="space-y-4 text-center">
				<div className="mx-auto w-16 h-16 rounded-full border-4 animate-spin border-green-400/30 border-t-green-400" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Loading FPS Explorer</h2>
					<p className="text-sm text-slate-300">Initializing first-person planetary exploration...</p>
				</div>
			</div>
		</div>
	),
});

export default function FPSExplorerTestPage() {
	// Controller configuration for FPS exploration
	const controllerActions = {
		onSecondaryAction: () => {
			window.history.back();
		},
		onBackAction: () => {
			window.history.back();
		},
	};

	const fpsControllerHelp = [
		{ control: "Left Stick", action: "Move around (WASD)", category: "3D Navigation" as const },
		{ control: "Right Stick", action: "Look around (Mouse)", category: "3D Navigation" as const },
		{ control: "A/X Button", action: "Jump (Space)", category: "Actions" as const },
		{ control: "Right Trigger", action: "Run (Shift)", category: "Actions" as const },
		{ control: "Left Trigger", action: "Crouch (C)", category: "Actions" as const },
		{ control: "X/Square", action: "Interact (E)", category: "Actions" as const },
		{ control: "Y/Triangle", action: "Scan (F)", category: "Actions" as const },
		{ control: "B/Circle", action: "Exit exploration", category: "Actions" as const },
		{ control: "Start/Options", action: "Toggle help", category: "System" as const },
		{ control: "Select/Back", action: "Menu", category: "System" as const },
	];

	return (
		<div className="fixed inset-0">
			{/* FPS Explorer Generator - Full Screen */}
			<FPSExplorerGenerator />

			{/* Universal Controller Support */}
			<ControllerIndicator
				position="bottom-right"
				accentColor="green"
				pageTitle="FPS Explorer"
				actions={controllerActions}
				helpItems={fpsControllerHelp}
				controllerOptions={{
					sensitivity: 2.0, // Higher sensitivity for FPS
					deadzone: 0.1,    // Lower deadzone for precise control
					enableHaptics: true,
				}}
				autoHideDelay={5000} // Show help longer for FPS
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
