"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TestSuitePage() {
	const router = useRouter();

	const tests = [
		{ name: "Planet Generator", path: "/generators/planet" },
		{ name: "Galaxy Generator", path: "/generators/galaxy" },
		{ name: "Star Generator", path: "/generators/star" },
		{ name: "Black Hole Generator", path: "/generators/black-hole" },
		{ name: "Solar System Generator", path: "/generators/solar-system" },
		{ name: "Controller Test", path: "/generators/controller" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-white mb-8">🌌 Test Suite</h1>

				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
					<h2 className="text-2xl font-semibold text-white mb-4">Migration Status</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="text-green-400">✅ Next.js 14 Setup Complete</div>
							<div className="text-green-400">✅ React 18 Migration Complete</div>
							<div className="text-green-400">✅ Tailwind CSS Working</div>
							<div className="text-green-400">✅ TypeScript Configuration</div>
						</div>
						<div className="space-y-2">
							<div className="text-green-400">✅ Game State Management (React Context)</div>
							<div className="text-green-400">✅ Routing (App Router)</div>
							<div className="text-green-400">✅ UI Components Converted</div>
							<div className="text-green-400">✅ Assets Migrated</div>
						</div>
					</div>
				</div>

				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
					<h2 className="text-2xl font-semibold text-white mb-4">Available Generators</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{tests.map((test, index) => (
							<Button key={index} variant="outline" className="h-16 text-left justify-start" onClick={() => router.push(test.path)}>
								<div>
									<div className="font-semibold">{test.name}</div>
									<div className="text-sm text-muted-foreground">{test.path}</div>
								</div>
							</Button>
						))}
					</div>
				</div>

				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
					<h2 className="text-2xl font-semibold text-white mb-4">Next Steps</h2>
					<div className="space-y-2 text-gray-300">
						<p>🔧 Integrate Three.js for 3D rendering</p>
						<p>🎮 Add game control systems</p>
						<p>🔊 Integrate audio systems</p>
						<p>⚡ Add performance monitoring</p>
						<p>🛠 Setup Tauri integration</p>
					</div>
				</div>

				<div className="mt-8 text-center">
					<Button onClick={() => router.push("/")}>Back to Home</Button>
				</div>
			</div>
		</div>
	);
}
