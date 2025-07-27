"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Gamepad2, Globe, Telescope, Atom, Zap, Activity, Code2, Settings, ChevronRight, Sparkles, Sun, Moon, Star, Target, CheckCircle2, Clock, Wrench, Beaker, ExternalLink, Play, Pause, BarChart3, Cpu, Layers3, Palette, Share2, Download, Headphones } from "lucide-react";
import { useGamepadController } from "@/hooks/useGamepadController";

interface TestCard {
	title: string;
	description: string;
	features: string[];
	status: "Ready" | "Development" | "Experimental" | "Planned";
	href: string;
	icon: React.ReactNode;
	category: string;
	techStack: string[];
	lastUpdated: string;
}

const testPages: TestCard[] = [
	{
		title: "Planet Generator",
		description: "Advanced procedural planet generation with realistic biome systems, terrain deformation, and atmospheric effects.",
		features: ["Multiple Biomes", "Terrain Generation", "Water Systems", "Vegetation", "Real-time Parameters"],
		status: "Ready",
		href: "/test/planet",
		icon: <Globe className="w-6 h-6" />,
		category: "Procedural Generation",
		techStack: ["Three.js", "WebGL", "Noise Generation"],
		lastUpdated: "2025-01-10",
	},
	{
		title: "Solar System Generator",
		description: "Realistic solar system generation with NASA data, advanced orbital mechanics, and gravitational physics.",
		features: ["Realistic Physics", "Orbital Mechanics", "NASA Data", "Moon Systems", "Ring Systems"],
		status: "Ready",
		href: "/test/solar-system",
		icon: <Sun className="w-6 h-6" />,
		category: "Procedural Generation",
		techStack: ["Three.js", "Physics Engine", "Real Data"],
		lastUpdated: "2025-01-10",
	},
	{
		title: "Galaxy Generator",
		description: "Generate scientifically accurate galaxies using real astronomical data and density wave theory.",
		features: ["Scientific Accuracy", "Real Data", "Spiral Arms", "Star Formation", "Density Waves"],
		status: "Ready",
		href: "/test/galaxy",
		icon: <Sparkles className="w-6 h-6" />,
		category: "Procedural Generation",
		techStack: ["Three.js", "Astrophysics", "Data Visualization"],
		lastUpdated: "2025-01-10",
	},
	{
		title: "Controller Test Suite",
		description: "Professional gamepad testing suite with real-time visualization, calibration tools, and analytics.",
		features: ["Real-time Visualization", "Vibration Testing", "Calibration Tools", "Analytics", "Multi-Controller"],
		status: "Ready",
		href: "/test/controller",
		icon: <Gamepad2 className="w-6 h-6" />,
		category: "Input Systems",
		techStack: ["Gamepad API", "Canvas", "Real-time"],
		lastUpdated: "2025-01-10",
	},
	{
		title: "Audio System Test",
		description: "Comprehensive audio system with 100+ sound effects, categorized interface sounds, and real-time controls.",
		features: ["100+ Sound Effects", "21 Categories", "Real-time Controls", "Preloading", "Volume Management"],
		status: "Ready",
		href: "/test/audio",
		icon: <Headphones className="w-6 h-6" />,
		category: "Audio Systems",
		techStack: ["HTML5 Audio", "React Hooks", "Kenney Sounds"],
		lastUpdated: "2025-01-27",
	},
	{
		title: "AAA Game Menu",
		description: "Modern, professional game menu system with glassmorphism effects and smooth animations.",
		features: ["Modern Design", "Glassmorphism", "Smooth Animations", "3D Integration", "Professional UI"],
		status: "Ready",
		href: "/test/menu",
		icon: <Palette className="w-6 h-6" />,
		category: "UI Systems",
		techStack: ["React", "CSS3", "Animation"],
		lastUpdated: "2025-01-09",
	},
	{
		title: "Settings System Test",
		description: "Comprehensive game settings management with AAA-grade configuration system and real-time preview.",
		features: ["7 Settings Categories", "Real-time Preview", "Export/Import", "Performance Tuning", "Accessibility Options"],
		status: "Ready",
		href: "/test/settings",
		icon: <Settings className="w-6 h-6" />,
		category: "UI Systems",
		techStack: ["React", "Local Storage", "Performance API"],
		lastUpdated: "2025-01-27",
	},
	{
		title: "Star Generator",
		description: "Advanced stellar object generation with realistic physics, stellar evolution, and visual effects.",
		features: ["Stellar Physics", "Realistic Effects", "Multiple Types", "Advanced Shaders"],
		status: "Ready",
		href: "/test/star",
		icon: <Star className="w-6 h-6" />,
		category: "Procedural Generation",
		techStack: ["Three.js", "Shaders", "Physics"],
		lastUpdated: "2025-01-10",
	},
	{
		title: "Black Hole Generator",
		description: "Realistic black hole simulation with gravitational lensing and accretion effects.",
		features: ["Gravitational Lensing", "Accretion Disk", "Hawking Radiation", "Space-time Warping"],
		status: "Ready",
		href: "/test/blackhole",
		icon: <Atom className="w-6 h-6" />,
		category: "Procedural Generation",
		techStack: ["Three.js", "Physics", "Relativity"],
		lastUpdated: "2025-01-10",
	},
	{
		title: "FPS Explorer",
		description: "AAA-quality first-person planetary exploration with physics-based movement and immersive controls.",
		features: ["FPS Controls", "Physics Movement", "Procedural Terrain", "3D Audio", "Call of Duty Style"],
		status: "Ready",
		href: "/test/fps-explorer",
		icon: <Target className="w-6 h-6" />,
		category: "Game Systems",
		techStack: ["Three.js", "Physics", "FPS Controls", "Spatial Audio"],
		lastUpdated: "2025-01-27",
	},

	{
		title: "Performance Monitor",
		description: "Real-time performance monitoring and optimization tools for game development.",
		features: ["Real-time Metrics", "Performance Tracking", "Optimization Tools", "Analytics"],
		status: "Experimental",
		href: "#",
		icon: <BarChart3 className="w-6 h-6" />,
		category: "Debug Tools",
		techStack: ["Performance API", "Charts", "Metrics"],
		lastUpdated: "2025-01-06",
	},
	{
		title: "Error Handling Test",
		description: "Comprehensive error handling and recovery system testing and validation.",
		features: ["Error Recovery", "System Monitoring", "Detailed Logging", "Alert System"],
		status: "Planned",
		href: "#",
		icon: <Wrench className="w-6 h-6" />,
		category: "Debug Tools",
		techStack: ["Error Boundaries", "Logging", "Recovery"],
		lastUpdated: "2025-01-05",
	},
];

const statusConfig = {
	Ready: {
		color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
		icon: <CheckCircle2 className="w-3 h-3" />,
		description: "Fully functional and tested",
	},
	Development: {
		color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		icon: <Code2 className="w-3 h-3" />,
		description: "Currently in active development",
	},
	Experimental: {
		color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
		icon: <Beaker className="w-3 h-3" />,
		description: "Experimental features and testing",
	},
	Planned: {
		color: "bg-slate-500/10 text-slate-500 border-slate-500/20",
		icon: <Clock className="w-3 h-3" />,
		description: "Planned for future development",
	},
};

export default function TestSuitePage() {
	const [analytics, setAnalytics] = useState<Record<string, number>>({});
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedTestIndex, setSelectedTestIndex] = useState<number>(0);
	const [showControllerHelp, setShowControllerHelp] = useState<boolean>(false);

	const categories = ["All", ...new Set(testPages.map((test) => test.category))];
	const filteredTests = selectedCategory === "All" ? testPages : testPages.filter((test) => test.category === selectedCategory);

	// Controller support
	const { isConnected, controllerType, triggerHapticFeedback } = useGamepadController({
		actions: {
			onNavigateUp: () => {
				setSelectedTestIndex((prev) => {
					const newIndex = Math.max(0, prev - 1);
					if (newIndex !== prev) triggerHapticFeedback(0.2, 50);
					return newIndex;
				});
			},
			onNavigateDown: () => {
				setSelectedTestIndex((prev) => {
					const newIndex = Math.min(filteredTests.length - 1, prev + 1);
					if (newIndex !== prev) triggerHapticFeedback(0.2, 50);
					return newIndex;
				});
			},
			onNavigateLeft: () => {
				const currentCategoryIndex = categories.indexOf(selectedCategory);
				const newIndex = Math.max(0, currentCategoryIndex - 1);
				const newCategory = categories[newIndex];
				if (newCategory) {
					setSelectedCategory(newCategory);
					setSelectedTestIndex(0);
					triggerHapticFeedback(0.3, 75);
				}
			},
			onNavigateRight: () => {
				const currentCategoryIndex = categories.indexOf(selectedCategory);
				const newIndex = Math.min(categories.length - 1, currentCategoryIndex + 1);
				const newCategory = categories[newIndex];
				if (newCategory) {
					setSelectedCategory(newCategory);
					setSelectedTestIndex(0);
					triggerHapticFeedback(0.3, 75);
				}
			},
			onPrimaryAction: () => {
				const selectedTest = filteredTests[selectedTestIndex];
				if (selectedTest && selectedTest.href !== "#") {
					triggerHapticFeedback(0.5, 100);
					handleTestLaunch(selectedTest.title, selectedTest.href);
					window.location.href = selectedTest.href;
				}
			},
			onSecondaryAction: () => {
				triggerHapticFeedback(0.3, 75);
				window.history.back();
			},
			onMenuToggle: () => {
				setShowControllerHelp((prev) => !prev);
				triggerHapticFeedback(0.4, 100);
			},
		},
	});

	useEffect(() => {
		console.log("🧪 [TEST SUITE] Galactic Clans Test Suite Initialized");
		console.log("📊 [ANALYTICS] Tracking test page launches");

		// Show controller help for a few seconds when controller connects
		if (isConnected) {
			setShowControllerHelp(true);
			const timer = setTimeout(() => setShowControllerHelp(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [isConnected]);

	const handleTestLaunch = (testName: string, href: string) => {
		if (href === "#") {
			return;
		}

		setAnalytics((prev) => ({
			...prev,
			[testName]: (prev[testName] || 0) + 1,
		}));

		console.log(`🚀 [ANALYTICS] Launching test: ${testName}`);
	};

	const getStatusCount = (status: string) => {
		return testPages.filter((test) => test.status === status).length;
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Controller Help Overlay */}
			{showControllerHelp && isConnected && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
					<div className="bg-slate-900/95 border border-blue-500/30 rounded-xl p-8 max-w-md text-center space-y-4">
						<div className="flex items-center justify-center space-x-2 text-blue-400">
							<Gamepad2 className="w-8 h-8" />
							<h2 className="text-xl font-bold">{controllerType} Controller</h2>
						</div>
						<div className="space-y-2 text-sm text-slate-300">
							<p>
								<strong>D-Pad/Left Stick:</strong> Navigate tests and categories
							</p>
							<p>
								<strong>A/X Button:</strong> Launch selected test
							</p>
							<p>
								<strong>B/Circle:</strong> Go back
							</p>
							<p>
								<strong>Start/Options:</strong> Toggle this help
							</p>
						</div>
						<button onClick={() => setShowControllerHelp(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
							Got it!
						</button>
					</div>
				</div>
			)}

			{/* Modern Header */}
			<header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/10 backdrop-blur-sm border-b border-slate-700/20">
				<div className="container mx-auto px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<a className="flex items-center space-x-2 px-2 py-1 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-200 hover:text-white transition-all duration-200 text-sm" href="/">
								<ArrowLeft className="w-3 h-3" />
								<span className="text-xs font-medium">Back</span>
							</a>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
									<Layers3 className="w-3 h-3 text-white" />
								</div>
								<div>
									<h1 className="text-sm font-semibold text-white">Test Suite</h1>
									<p className="text-xs text-slate-300">Professional development & testing environment</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							{isConnected && (
								<div className="flex items-center space-x-2 px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-md">
									<Gamepad2 className="w-3 h-3 text-green-400" />
									<span className="text-xs text-green-300">{controllerType}</span>
								</div>
							)}
							<button className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
								<Share2 className="w-3 h-3" />
							</button>
							<button className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors">
								<Download className="w-3 h-3" />
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className="container max-w-7xl mx-auto px-6 py-8 pt-20">
				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{Object.entries(statusConfig).map(([status, config]) => (
						<div key={status} className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 hover:shadow-md transition-all duration-200">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium text-gray-400">{status}</p>
									<p className="text-2xl font-bold text-white">{getStatusCount(status)}</p>
									<p className="text-xs text-gray-500">{config.description}</p>
								</div>
								<div className={`p-2 rounded-lg ${config.color}`}>{config.icon}</div>
							</div>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
						</div>
					))}
				</div>

				{/* Category Filter */}
				<div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
					<p className="text-sm font-medium text-gray-400 whitespace-nowrap">Filter by category:</p>
					{categories.map((category, index) => (
						<button
							key={category}
							onClick={() => {
								setSelectedCategory(category);
								setSelectedTestIndex(0);
							}}
							className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50" : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"}`}
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

				{/* Footer Information */}
				<div className="mt-16 p-8 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-800/20 backdrop-blur-sm">
					<div className="text-center space-y-3">
						<div className="flex items-center justify-center space-x-2">
							<Cpu className="w-5 h-5 text-blue-500" />
							<h3 className="text-lg font-semibold text-white">Galactic Clans Test Suite</h3>
						</div>
						<p className="text-gray-400 max-w-2xl mx-auto">A comprehensive testing and development environment built with modern web technologies. Each test module is designed for maximum performance and scientific accuracy.</p>
						<div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
							<span>Next.js 15</span>
							<span>•</span>
							<span>Three.js</span>
							<span>•</span>
							<span>TypeScript</span>
							<span>•</span>
							<span>Tailwind CSS</span>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

function TestCard({ test, onLaunch, isSelected = false }: { test: TestCard; onLaunch: (name: string, href: string) => void; isSelected?: boolean }) {
	const isAvailable = test.status === "Ready";
	const statusConfig = {
		Ready: {
			color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
			icon: <CheckCircle2 className="w-3 h-3" />,
		},
		Development: {
			color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
			icon: <Code2 className="w-3 h-3" />,
		},
		Experimental: {
			color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
			icon: <Beaker className="w-3 h-3" />,
		},
		Planned: {
			color: "bg-slate-500/10 text-slate-500 border-slate-500/20",
			icon: <Clock className="w-3 h-3" />,
		},
	};

	const handleClick = () => {
		onLaunch(test.title, test.href);
	};

	return (
		<div className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 ${isSelected ? "border-blue-500/50 bg-blue-500/10 ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/20" : "border-gray-800 bg-gray-900/50 hover:border-blue-500/20"} backdrop-blur-sm`}>
			{/* Card Header */}
			<div className="p-6 space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">{test.icon}</div>
						<div>
							<h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{test.title}</h3>
							<p className="text-xs text-gray-400">{test.category}</p>
						</div>
					</div>
					<div className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium ${statusConfig[test.status].color}`}>
						{statusConfig[test.status].icon}
						<span>{test.status}</span>
					</div>
				</div>

				<p className="text-sm text-gray-300 leading-relaxed">{test.description}</p>

				{/* Features */}
				<div className="space-y-2">
					<p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Key Features</p>
					<div className="flex flex-wrap gap-1">
						{test.features.slice(0, 3).map((feature, index) => (
							<span key={index} className="px-2 py-1 text-xs rounded-md bg-gray-800/50 text-gray-300 hover:bg-gray-700 transition-colors">
								{feature}
							</span>
						))}
						{test.features.length > 3 && <span className="px-2 py-1 text-xs text-gray-400">+{test.features.length - 3} more</span>}
					</div>
				</div>

				{/* Tech Stack */}
				<div className="space-y-2">
					<p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Technology</p>
					<div className="flex flex-wrap gap-1">
						{test.techStack.map((tech, index) => (
							<span key={index} className="px-2 py-1 text-xs rounded-md border border-gray-700 bg-gray-800/50 text-white">
								{tech}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Card Footer */}
			<div className="px-6 pb-6 space-y-3">
				<div className="text-xs text-gray-500">Updated {test.lastUpdated}</div>

				{isAvailable ? (
					<Link href={test.href} onClick={handleClick} className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors group/button">
						<Play className="w-4 h-4 mr-2 group-hover/button:translate-x-0.5 transition-transform" />
						Launch Test
						<ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover/button:opacity-100 transition-opacity" />
					</Link>
				) : (
					<button onClick={handleClick} className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-400 font-medium text-sm cursor-not-allowed">
						<Pause className="w-4 h-4 mr-2" />
						Coming Soon
					</button>
				)}
			</div>

			{/* Hover Effect */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
		</div>
	);
}
