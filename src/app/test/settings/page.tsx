"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Settings2, Monitor, Volume2, Gamepad2, Eye, Palette, Accessibility, Save, RotateCcw, CheckCircle, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Sun, Moon, Zap, Target, MousePointer, Keyboard, Headphones, Speaker, Mic, Wifi, WifiOff, Shield, BarChart3, Cpu, HardDrive, MemoryStick, Thermometer, RefreshCw, Download, Upload, Lock, Unlock, EyeOff, VolumeX, Volume1, Volume3, Settings, Sliders, Smartphone, Tablet, MonitorSmartphone, Laptop } from "lucide-react";

// Import settings components
import GraphicsSettings from "../../../components/settings/GraphicsSettings";
import AudioSettings from "../../../components/settings/AudioSettings";
import ControlsSettings from "../../../components/settings/ControlsSettings";
import AccessibilitySettings from "../../../components/settings/AccessibilitySettings";
import GameplaySettings from "../../../components/settings/GameplaySettings";
import NetworkSettings from "../../../components/settings/NetworkSettings";
import PerformanceSettings from "../../../components/settings/PerformanceSettings";

interface SettingsConfig {
	// Graphics Settings
	graphics: {
		quality: "Low" | "Medium" | "High" | "Ultra" | "Custom";
		resolution: string;
		refreshRate: number;
		vsync: boolean;
		antiAliasing: "Off" | "FXAA" | "SMAA" | "MSAA 2x" | "MSAA 4x" | "MSAA 8x";
		textureQuality: "Low" | "Medium" | "High" | "Ultra";
		shadowQuality: "Low" | "Medium" | "High" | "Ultra";
		particleQuality: "Low" | "Medium" | "High" | "Ultra";
		ambientOcclusion: boolean;
		motionBlur: boolean;
		depthOfField: boolean;
		rayTracing: boolean;
		dlss: boolean;
		fsr: boolean;
		fieldOfView: number;
		brightness: number;
		contrast: number;
		saturation: number;
	};

	// Audio Settings
	audio: {
		masterVolume: number;
		sfxVolume: number;
		musicVolume: number;
		voiceVolume: number;
		ambientVolume: number;
		voiceChatVolume: number;
		voiceChatEnabled: boolean;
		pushToTalk: boolean;
		voiceChatDevice: string;
		audioDevice: string;
		audioQuality: "Low" | "Medium" | "High" | "Ultra";
		spatialAudio: boolean;
		monoAudio: boolean;
		subtitleVolume: number;
	};

	// Controls Settings
	controls: {
		mouseSensitivity: number;
		mouseAcceleration: boolean;
		invertMouseY: boolean;
		gamepadSensitivity: number;
		gamepadDeadzone: number;
		keyboardLayout: "QWERTY" | "AZERTY" | "QWERTZ" | "Custom";
		keyBindings: Record<string, string>;
		gamepadBindings: Record<string, string>;
		aimAssist: boolean;
		aimAssistStrength: number;
		autoAim: boolean;
		recoilControl: boolean;
	};

	// Accessibility Settings
	accessibility: {
		colorBlindMode: "Off" | "Protanopia" | "Deuteranopia" | "Tritanopia" | "Monochromacy";
		highContrast: boolean;
		largeText: boolean;
		textScale: number;
		screenReader: boolean;
		subtitles: boolean;
		closedCaptions: boolean;
		subtitleSize: "Small" | "Medium" | "Large";
		subtitleColor: string;
		subtitleBackground: string;
		reducedMotion: boolean;
		reducedFlashing: boolean;
		oneHandedMode: boolean;
		voiceCommands: boolean;
		gestureControls: boolean;
		limitedKeysMode: boolean;
		remapKeys: boolean;
	};

	// Gameplay Settings
	gameplay: {
		difficulty: "Easy" | "Normal" | "Hard" | "Extreme";
		tutorialEnabled: boolean;
		hintsEnabled: boolean;
		objectiveMarkers: boolean;
		minimapEnabled: boolean;
		damageNumbers: boolean;
		killFeed: boolean;
		chatEnabled: boolean;
		profanityFilter: boolean;
		autoSave: boolean;
		quickSave: boolean;
		checkpointFrequency: "Low" | "Medium" | "High";
		permadeath: boolean;
	};

	// Network Settings
	network: {
		region: string;
		pingLimit: number;
		bandwidthLimit: number;
		packetLossThreshold: number;
		connectionType: "Auto" | "LAN" | "WiFi" | "Cellular";
		portForwarding: boolean;
		upnp: boolean;
		natType: "Open" | "Moderate" | "Strict";
		serverBrowser: boolean;
		crossPlay: boolean;
		crossSave: boolean;
	};

	// Performance Settings
	performance: {
		fpsLimit: number;
		fpsDisplay: boolean;
		performanceMode: "Quality" | "Balanced" | "Performance" | "Custom";
		gpuMemoryLimit: number;
		cpuPriority: "Low" | "Normal" | "High" | "Real-time";
		backgroundProcesses: boolean;
		powerSaving: boolean;
		thermalThrottling: boolean;
		overclocking: boolean;
		benchmarkMode: boolean;
	};
}

const defaultSettings: SettingsConfig = {
	graphics: {
		quality: "High",
		resolution: "1920x1080",
		refreshRate: 60,
		vsync: true,
		antiAliasing: "MSAA 4x",
		textureQuality: "High",
		shadowQuality: "High",
		particleQuality: "High",
		ambientOcclusion: true,
		motionBlur: true,
		depthOfField: true,
		rayTracing: false,
		dlss: false,
		fsr: false,
		fieldOfView: 90,
		brightness: 50,
		contrast: 50,
		saturation: 50,
	},
	audio: {
		masterVolume: 80,
		sfxVolume: 70,
		musicVolume: 60,
		voiceVolume: 80,
		ambientVolume: 50,
		voiceChatVolume: 75,
		voiceChatEnabled: true,
		pushToTalk: true,
		voiceChatDevice: "Default",
		audioDevice: "Default",
		audioQuality: "High",
		spatialAudio: true,
		monoAudio: false,
		subtitleVolume: 100,
	},
	controls: {
		mouseSensitivity: 50,
		mouseAcceleration: false,
		invertMouseY: false,
		gamepadSensitivity: 50,
		gamepadDeadzone: 10,
		keyboardLayout: "QWERTY",
		keyBindings: {},
		gamepadBindings: {},
		aimAssist: true,
		aimAssistStrength: 50,
		autoAim: false,
		recoilControl: false,
	},
	accessibility: {
		colorBlindMode: "Off",
		highContrast: false,
		largeText: false,
		textScale: 100,
		screenReader: false,
		subtitles: true,
		closedCaptions: false,
		subtitleSize: "Medium",
		subtitleColor: "#FFFFFF",
		subtitleBackground: "#000000",
		reducedMotion: false,
		reducedFlashing: false,
		oneHandedMode: false,
		voiceCommands: false,
		gestureControls: false,
		limitedKeysMode: false,
		remapKeys: false,
	},
	gameplay: {
		difficulty: "Normal",
		tutorialEnabled: true,
		hintsEnabled: true,
		objectiveMarkers: true,
		minimapEnabled: true,
		damageNumbers: true,
		killFeed: true,
		chatEnabled: true,
		profanityFilter: true,
		autoSave: true,
		quickSave: true,
		checkpointFrequency: "Medium",
		permadeath: false,
	},
	network: {
		region: "Auto",
		pingLimit: 100,
		bandwidthLimit: 0,
		packetLossThreshold: 5,
		connectionType: "Auto",
		portForwarding: false,
		upnp: true,
		natType: "Moderate",
		serverBrowser: true,
		crossPlay: true,
		crossSave: true,
	},
	performance: {
		fpsLimit: 60,
		fpsDisplay: false,
		performanceMode: "Balanced",
		gpuMemoryLimit: 0,
		cpuPriority: "Normal",
		backgroundProcesses: true,
		powerSaving: false,
		thermalThrottling: true,
		overclocking: false,
		benchmarkMode: false,
	},
};

export default function SettingsTestPage() {
	const [settings, setSettings] = useState<SettingsConfig>(defaultSettings);
	const [activeTab, setActiveTab] = useState<string>("graphics");
	const [isSaving, setIsSaving] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [showResetDialog, setShowResetDialog] = useState(false);
	const [showBenchmark, setShowBenchmark] = useState(false);
	const [benchmarkResults, setBenchmarkResults] = useState<any>(null);
	const [systemInfo, setSystemInfo] = useState<any>(null);

	// Detect system capabilities
	useEffect(() => {
		const detectSystem = async () => {
			const info = {
				gpu: "Unknown",
				cpu: "Unknown",
				ram: "Unknown",
				os: navigator.platform,
				browser: navigator.userAgent,
				webgl: false,
				webgl2: false,
				audioContext: false,
				gamepad: false,
			};

			// Check WebGL support
			try {
				const canvas = document.createElement("canvas");
				const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
				info.webgl = !!gl;

				const gl2 = canvas.getContext("webgl2");
				info.webgl2 = !!gl2;

				if (gl) {
					const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
					if (debugInfo) {
						info.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
					}
				}
			} catch (e) {
				console.log("WebGL detection failed:", e);
			}

			// Check Audio Context
			try {
				const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				info.audioContext = true;
				audioContext.close();
			} catch (e) {
				console.log("Audio Context detection failed:", e);
			}

			// Check Gamepad support
			info.gamepad = "getGamepads" in navigator;

			setSystemInfo(info);
		};

		detectSystem();
	}, []);

	const handleSettingChange = useCallback((category: keyof SettingsConfig, setting: string, value: any) => {
		setSettings((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[setting]: value,
			},
		}));
		setHasUnsavedChanges(true);
	}, []);

	const saveSettings = async () => {
		setIsSaving(true);
		try {
			// Simulate saving to server
			await new Promise((resolve) => setTimeout(resolve, 1000));
			localStorage.setItem("galactic-clans-settings", JSON.stringify(settings));
			setHasUnsavedChanges(false);
			console.log("Settings saved successfully");
		} catch (error) {
			console.error("Failed to save settings:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const resetSettings = () => {
		setSettings(defaultSettings);
		setHasUnsavedChanges(true);
		setShowResetDialog(false);
	};

	const runBenchmark = async () => {
		setShowBenchmark(true);
		setBenchmarkResults(null);

		try {
			// Simulate benchmark
			await new Promise((resolve) => setTimeout(resolve, 3000));

			const results = {
				fps: Math.floor(Math.random() * 60) + 40,
				gpuScore: Math.floor(Math.random() * 1000) + 500,
				cpuScore: Math.floor(Math.random() * 1000) + 500,
				ramScore: Math.floor(Math.random() * 1000) + 500,
				overallScore: Math.floor(Math.random() * 1000) + 500,
				recommendedQuality: ["Low", "Medium", "High", "Ultra"][Math.floor(Math.random() * 4)],
				timestamp: new Date().toISOString(),
			};

			setBenchmarkResults(results);
		} catch (error) {
			console.error("Benchmark failed:", error);
		}
	};

	const tabs = [
		{ id: "graphics", name: "Graphics", icon: Monitor, color: "from-blue-500 to-cyan-500" },
		{ id: "audio", name: "Audio", icon: Volume2, color: "from-green-500 to-emerald-500" },
		{ id: "controls", name: "Controls", icon: Gamepad2, color: "from-purple-500 to-pink-500" },
		{ id: "accessibility", name: "Accessibility", icon: Accessibility, color: "from-orange-500 to-red-500" },
		{ id: "gameplay", name: "Gameplay", icon: Target, color: "from-indigo-500 to-purple-500" },
		{ id: "network", name: "Network", icon: Wifi, color: "from-teal-500 to-blue-500" },
		{ id: "performance", name: "Performance", icon: Cpu, color: "from-yellow-500 to-orange-500" },
	];

	return (
		<div className="fixed inset-0 bg-black overflow-hidden">
			{/* Modern Header */}
			<header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/10 backdrop-blur-sm border-b border-slate-700/20">
				<div className="container mx-auto px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Link className="flex items-center space-x-2 px-2 py-1 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-200 hover:text-white transition-all duration-200 text-sm" href="/test">
								<ArrowLeft className="w-3 h-3" />
								<span className="text-xs font-medium">Back</span>
							</Link>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
									<Settings2 className="w-3 h-3 text-white" />
								</div>
								<div>
									<h1 className="text-sm font-semibold text-white">Game Settings</h1>
									<p className="text-xs text-slate-300">AAA-grade configuration system</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-1">
							<button onClick={runBenchmark} className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors" title="Run Benchmark">
								<BarChart3 className="w-3 h-3" />
							</button>
							<button onClick={() => setShowResetDialog(true)} className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors" title="Reset Settings">
								<RotateCcw className="w-3 h-3" />
							</button>
							<button onClick={saveSettings} disabled={!hasUnsavedChanges || isSaving} className={`p-1.5 rounded-md transition-colors ${hasUnsavedChanges && !isSaving ? "bg-green-600/30 hover:bg-green-600/50 text-green-400 hover:text-green-300" : "bg-slate-800/30 text-slate-500"}`} title="Save Settings">
								{isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : hasUnsavedChanges ? <Save className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="absolute inset-0 top-20 flex">
				{/* Sidebar */}
				<div className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-700/30 overflow-y-auto">
					<div className="p-4 space-y-2">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === tab.id ? "bg-gradient-to-r " + tab.color + " text-white shadow-lg" : "bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white"}`}>
									<Icon className="w-4 h-4" />
									<span className="text-sm font-medium">{tab.name}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Settings Panel */}
				<div className="flex-1 overflow-y-auto">
					<div className="p-6">
						{/* Graphics Settings */}
						{activeTab === "graphics" && <GraphicsSettings settings={settings.graphics} onChange={(setting, value) => handleSettingChange("graphics", setting, value)} systemInfo={systemInfo} />}

						{/* Audio Settings */}
						{activeTab === "audio" && <AudioSettings settings={settings.audio} onChange={(setting, value) => handleSettingChange("audio", setting, value)} />}

						{/* Controls Settings */}
						{activeTab === "controls" && <ControlsSettings settings={settings.controls} onChange={(setting, value) => handleSettingChange("controls", setting, value)} />}

						{/* Accessibility Settings */}
						{activeTab === "accessibility" && <AccessibilitySettings settings={settings.accessibility} onChange={(setting, value) => handleSettingChange("accessibility", setting, value)} />}

						{/* Gameplay Settings */}
						{activeTab === "gameplay" && <GameplaySettings settings={settings.gameplay} onChange={(setting, value) => handleSettingChange("gameplay", setting, value)} />}

						{/* Network Settings */}
						{activeTab === "network" && <NetworkSettings settings={settings.network} onChange={(setting, value) => handleSettingChange("network", setting, value)} />}

						{/* Performance Settings */}
						{activeTab === "performance" && <PerformanceSettings settings={settings.performance} onChange={(setting, value) => handleSettingChange("performance", setting, value)} benchmarkResults={benchmarkResults} showBenchmark={showBenchmark} />}
					</div>
				</div>
			</div>

			{/* Reset Dialog */}
			{showResetDialog && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 max-w-md w-full mx-4">
						<div className="flex items-center space-x-3 mb-4">
							<AlertTriangle className="w-6 h-6 text-yellow-500" />
							<h3 className="text-lg font-semibold text-white">Reset Settings</h3>
						</div>
						<p className="text-slate-300 mb-6">Are you sure you want to reset all settings to their default values? This action cannot be undone.</p>
						<div className="flex space-x-3">
							<button onClick={() => setShowResetDialog(false)} className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
								Cancel
							</button>
							<button onClick={resetSettings} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
								Reset All
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
