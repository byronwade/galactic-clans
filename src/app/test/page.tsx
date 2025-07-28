/**
 * @file page.tsx
 * @description Enhanced Test Suite with Controller Support and Input Detection
 * @version 5.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Gamepad2, User } from "lucide-react";
import { useGamepadController } from "@/hooks/useGamepadController";
import { InputMethodIndicator } from "@/components/InputMethodIndicator";

interface TestCard {
	title: string;
	description: string;
	href: string;
	category: string;
	status: "stable" | "beta" | "alpha";
	icon: string;
}

const testPages: TestCard[] = [
	{
		title: "Audio System Test",
		description: "Test the game's audio system with background music, sound effects, and 3D spatial audio",
		href: "/test/audio",
		category: "Audio",
		status: "stable",
		icon: "🎵",
	},
	{
		title: "Planet Generator",
		description: "Generate and explore procedural planets with realistic terrain, vegetation, and surface zoom",
		href: "/test/planet",
		category: "Generators",
		status: "stable",
		icon: "🌍",
	},
	{
		title: "Galaxy Generator",
		description: "Create massive procedural galaxies with spiral arms, star clusters, and cosmic structures",
		href: "/test/galaxy",
		category: "Generators",
		status: "stable",
		icon: "🌌",
	},
	{
		title: "Star Generator",
		description: "Generate realistic star systems with different stellar types and characteristics",
		href: "/test/star",
		category: "Generators",
		status: "stable",
		icon: "⭐",
	},
	{
		title: "Solar System Generator",
		description: "Create complete solar systems with planets, moons, asteroids, and orbital mechanics",
		href: "/test/solar-system",
		category: "Generators",
		status: "stable",
		icon: "🪐",
	},
	{
		title: "Black Hole Generator",
		description: "Simulate massive black holes with event horizons, accretion disks, and gravitational effects",
		href: "/test/blackhole",
		category: "Generators",
		status: "stable",
		icon: "⚫",
	},
	{
		title: "FPS Explorer",
		description: "AAA-quality first-person planetary exploration with realistic terrain and controls",
		href: "/test/fps-explorer",
		category: "Exploration",
		status: "beta",
		icon: "🎮",
	},
	{
		title: "Settings System Test",
		description: "Test the comprehensive settings system with graphics, audio, and control customization",
		href: "/test/settings",
		category: "UI Systems",
		status: "stable",
		icon: "⚙️",
	},
	{
		title: "Main Menu Demo",
		description: "Preview the main game menu with navigation, animations, and visual effects",
		href: "/test/menu",
		category: "UI Systems",
		status: "stable",
		icon: "📋",
	},
	{
		title: "Controller Test",
		description: "Test gamepad controller input, button mapping, and haptic feedback systems",
		href: "/test/controller",
		category: "Input",
		status: "stable",
		icon: "🎮",
	},
];

function TestCard({ test, onLaunch, isSelected = false }: { test: TestCard; onLaunch: (name: string, href: string) => void; isSelected?: boolean }) {
	const getStatusColor = () => {
		switch (test.status) {
			case "stable":
				return "bg-green-500/20 text-green-400 border-green-400/30";
			case "beta":
				return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
			case "alpha":
				return "bg-red-500/20 text-red-400 border-red-400/30";
			default:
				return "bg-gray-500/20 text-gray-400 border-gray-400/30";
		}
	};

	return (
		<div className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 ${isSelected ? "border-blue-500/50 bg-blue-500/10 ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/20" : "border-gray-800 bg-gray-900/50 hover:border-blue-500/20"} backdrop-blur-sm`}>
			<div className="p-6">
				<div className="flex items-start justify-between mb-3">
					<div className="text-3xl mb-2">{test.icon}</div>
					<div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>{test.status}</div>
				</div>

				<h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{test.title}</h3>

				<p className="text-gray-400 text-sm mb-4 leading-relaxed">{test.description}</p>

				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">{test.category}</span>

					{/* Simple button with direct navigation */}
					<button
						onClick={() => {
							console.log(`Launching ${test.title} -> ${test.href}`);
							onLaunch(test.title, test.href);
							window.location.href = test.href;
						}}
						className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
						style={{ pointerEvents: "auto" }}
					>
						<Play className="w-4 h-4 mr-2" />
						Launch
					</button>
				</div>
			</div>

			<div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
		</div>
	);
}

export default function TestSuitePage() {
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);
	const [showControllerHelp, setShowControllerHelp] = useState<boolean>(false);

	const categories = ["All", ...Array.from(new Set(testPages.map((test) => test.category)))];

	const filteredTests = selectedCategory === "All" ? testPages : testPages.filter((test) => test.category === selectedCategory);

	const handleTestLaunch = (name: string, href: string) => {
		console.log(`🚀 Launching test: ${name} at ${href}`);
	};

	// Enhanced controller support
	const { isConnected, controllerType, triggerHapticFeedback } = useGamepadController({
		actions: {
			onNavigateUp: () => {
				setSelectedTestIndex((prev) => Math.max(0, prev - 1));
				triggerHapticFeedback(0.3, 100);
			},
			onNavigateDown: () => {
				setSelectedTestIndex((prev) => Math.min(filteredTests.length - 1, prev + 1));
				triggerHapticFeedback(0.3, 100);
			},
			onNavigateLeft: () => {
				const currentIndex = categories.indexOf(selectedCategory);
				const newIndex = Math.max(0, currentIndex - 1);
				const newCategory = categories[newIndex];
				if (newCategory) {
					setSelectedCategory(newCategory);
					setSelectedTestIndex(0);
					triggerHapticFeedback(0.4, 150);
				}
			},
			onNavigateRight: () => {
				const currentIndex = categories.indexOf(selectedCategory);
				const newIndex = Math.min(categories.length - 1, currentIndex + 1);
				const newCategory = categories[newIndex];
				if (newCategory) {
					setSelectedCategory(newCategory);
					setSelectedTestIndex(0);
					triggerHapticFeedback(0.4, 150);
				}
			},
			onPrimaryAction: () => {
				const selectedTest = filteredTests[selectedTestIndex];
				if (selectedTest) {
					handleTestLaunch(selectedTest.title, selectedTest.href);
					window.location.href = selectedTest.href;
					triggerHapticFeedback(0.6, 200);
				}
			},
			onSecondaryAction: () => {
				window.history.back();
				triggerHapticFeedback(0.5, 150);
			},
			onMenuToggle: () => {
				setShowControllerHelp((prev) => !prev);
				triggerHapticFeedback(0.4, 100);
			},
		},
	});

	// Auto-show controller help when connected
	useEffect(() => {
		if (isConnected) {
			setShowControllerHelp(true);
			const timer = setTimeout(() => setShowControllerHelp(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [isConnected]);

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Controller Help Overlay */}
			{showControllerHelp && isConnected && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
					<div className="bg-slate-900 border border-blue-400/30 rounded-xl shadow-2xl p-8 max-w-2xl">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center space-x-3">
								<Gamepad2 className="w-8 h-8 text-blue-400" />
								<h2 className="text-2xl font-bold text-white">Controller Navigation</h2>
								<span className="text-sm text-blue-300 bg-blue-500/20 px-2 py-1 rounded">{controllerType}</span>
							</div>
							<button onClick={() => setShowControllerHelp(false)} className="text-slate-400 hover:text-white text-2xl">
								×
							</button>
						</div>

						<div className="grid grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-semibold text-blue-400 mb-3">Navigation</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-300">D-Pad Up/Down:</span>
										<span className="text-white">Select Test</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-300">D-Pad Left/Right:</span>
										<span className="text-white">Switch Category</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-300">A Button:</span>
										<span className="text-white">Launch Test</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold text-blue-400 mb-3">Controls</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-300">B Button:</span>
										<span className="text-white">Go Back</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-300">Start/Menu:</span>
										<span className="text-white">Toggle Help</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Header */}
			<header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-4">
							<Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
								<ArrowLeft className="w-5 h-5" />
								<span className="font-medium">Back to Home</span>
							</Link>
						</div>

						<div className="flex items-center space-x-4">
							<h1 className="text-xl font-bold">Cosmic Test Suite</h1>
							{isConnected && (
								<div className="flex items-center space-x-2 text-sm">
									<Gamepad2 className="w-4 h-4 text-green-400" />
									<span className="text-green-400">Controller Connected</span>
								</div>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<User className="w-5 h-5 text-gray-400" />
							<span className="text-sm text-gray-400">Developer Mode</span>
						</div>
					</div>
				</div>
			</header>

			{/* Category Filter */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-wrap gap-2 mb-8">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => {
								setSelectedCategory(category);
								setSelectedTestIndex(0);
							}}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"}`}
						>
							{category}
						</button>
					))}
				</div>

				{/* Test Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTests.map((test, index) => (
						<TestCard key={test.title} test={test} onLaunch={handleTestLaunch} isSelected={isConnected && index === selectedTestIndex} />
					))}
				</div>

				{/* Stats Footer */}
				<div className="mt-12 pt-8 border-t border-gray-800">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-blue-400">{testPages.length}</div>
							<div className="text-sm text-gray-400">Total Tests</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-400">{testPages.filter((t) => t.status === "stable").length}</div>
							<div className="text-sm text-gray-400">Stable</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-yellow-400">{testPages.filter((t) => t.status === "beta").length}</div>
							<div className="text-sm text-gray-400">Beta</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-red-400">{testPages.filter((t) => t.status === "alpha").length}</div>
							<div className="text-sm text-gray-400">Alpha</div>
						</div>
					</div>
				</div>
			</div>

			{/* Global Input Method Indicator */}
			<InputMethodIndicator position="bottom-left" size="md" showLabel={true} />
		</div>
	);
}
