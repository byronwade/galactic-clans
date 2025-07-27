/**
 * @file page.tsx
 * @description Simple FPS Explorer Generator Test Page
 * @version 4.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
	return (
		<div className="fixed inset-0">
			{/* FPS Explorer Generator - Full Screen */}
			<FPSExplorerGenerator />

			{/* Simple Back Button */}
			<div className="absolute top-4 left-4 z-50">
				<Link className="flex items-center px-3 py-2 space-x-2 text-sm rounded-lg border backdrop-blur-sm transition-all duration-200 bg-black/50 border-slate-700/50 text-slate-200 hover:text-white hover:bg-black/70" href="/test">
					<ArrowLeft className="w-4 h-4" />
					<span>Back</span>
				</Link>
			</div>
		</div>
	);
}
