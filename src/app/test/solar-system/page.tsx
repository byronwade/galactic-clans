/**
 * @file page.tsx
 * @description Simple Solar System Generator Test Page
 * @version 4.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import SolarSystemGenerator to avoid SSR issues
const SolarSystemGenerator = dynamic(() => import("@/components/generators/solar-system-generator"), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-orange-950 to-black flex items-center justify-center z-50">
			<div className="text-center space-y-4">
				<div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto" />
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-white">Loading Solar System Generator</h2>
					<p className="text-sm text-slate-300">Initializing orbital mechanics and celestial bodies...</p>
				</div>
			</div>
		</div>
	),
});

export default function SolarSystemTestPage() {
	return (
		<div className="fixed inset-0">
			{/* Solar System Generator - Full Screen */}
			<SolarSystemGenerator />

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
