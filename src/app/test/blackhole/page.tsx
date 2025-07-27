/**
 * @file page.tsx
 * @description Simple Black Hole Generator Test Page
 * @version 4.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import BlackHoleGenerator to avoid SSR issues
const BlackHoleGenerator = dynamic(() => import("@/components/generators/blackhole-generator").then((mod) => ({ default: mod.BlackHoleGenerator })), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black flex items-center justify-center z-50">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Loading Black Hole Generator</h2>
					<p className="text-sm text-slate-300">Initializing spacetime curvature and relativistic physics...</p>
				</div>
			</div>
		</div>
	),
});

export default function BlackHoleTestPage() {
	return (
		<div className="fixed inset-0">
			{/* Black Hole Generator - Full Screen */}
			<BlackHoleGenerator />

			{/* Simple Back Button */}
			<div className="absolute top-4 left-4 z-50">
				<Link className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-slate-700/50 text-slate-200 hover:text-white hover:bg-black/70 transition-all duration-200 text-sm" href="/test">
					<ArrowLeft className="w-4 h-4" />
					<span>Back</span>
				</Link>
			</div>
		</div>
	);
}
