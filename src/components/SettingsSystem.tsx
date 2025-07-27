"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Settings2, Monitor, Volume2, Gamepad2, Eye, Palette, Accessibility, Save, RotateCcw, CheckCircle, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Sun, Moon, Zap, Target, MousePointer, Keyboard, Headphones, Speaker, Mic, Wifi, Shield, BarChart3, Cpu, HardDrive, MemoryStick, Thermometer, RefreshCw, Download, Upload, Lock, Unlock, EyeOff, VolumeX, Volume1, Settings, Sliders, Smartphone, Tablet, MonitorSmartphone, Laptop } from "lucide-react";

// Import settings components
import GraphicsSettings from "./settings/GraphicsSettings";
import AudioSettings from "./settings/AudioSettings";
import ControlsSettings from "./settings/ControlsSettings";
import AccessibilitySettings from "./settings/AccessibilitySettings";
import GameplaySettings from "./settings/GameplaySettings";
import NetworkSettings from "./settings/NetworkSettings";
import PerformanceSettings from "./settings/PerformanceSettings";

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

interface SystemInfo {
	gpu: string;
	webgl: string;
	os: string;
	ram: string;
	cpu: string;
	storage: string;
}

export default function SettingsSystem() {
	const [activeTab, setActiveTab] = useState("graphics");
	const [settings, setSettings] = useState<SettingsConfig>({
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
			depthOfField: false,
			rayTracing: false,
			dlss: false,
			fsr: false,
			fieldOfView: 90,
			brightness: 50,
			contrast: 50,
			saturation: 50,
		},
		audio: {
			masterVolume: 100,
			sfxVolume: 80,
			musicVolume: 70,
			voiceVolume: 90,
			ambientVolume: 60,
			voiceChatVolume: 100,
			voiceChatEnabled: true,
			pushToTalk: false,
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
			recoilControl: true,
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
			gpuMemoryLimit: 4096,
			cpuPriority: "Normal",
			backgroundProcesses: true,
			powerSaving: false,
			thermalThrottling: false,
			overclocking: false,
			benchmarkMode: false,
		},
	});

	const [systemInfo, setSystemInfo] = useState<SystemInfo>({
		gpu: "Unknown",
		webgl: "Unknown",
		os: "Unknown",
		ram: "Unknown",
		cpu: "Unknown",
		storage: "Unknown",
	});

	const [isLoading, setIsLoading] = useState(true);
	const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

	// Load settings from localStorage
	useEffect(() => {
		const loadSettings = () => {
			try {
				const saved = localStorage.getItem("galacticClansSettings");
				if (saved) {
					const parsed = JSON.parse(saved);
					setSettings(parsed);
				}
			} catch (error) {
				console.error("Failed to load settings:", error);
			}
		};

		const detectSystem = async () => {
			try {
				// Detect GPU
				const canvas = document.createElement("canvas");
				const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
				const gpuInfo = gl?.getParameter(gl.RENDERER) || "Unknown";
				setSystemInfo((prev) => ({ ...prev, gpu: gpuInfo }));

				// Detect WebGL version
				const webglVersion = gl ? (gl instanceof WebGL2RenderingContext ? "WebGL 2.0" : "WebGL 1.0") : "Not Supported";
				setSystemInfo((prev) => ({ ...prev, webgl: webglVersion }));

				// Detect OS
				const os = navigator.platform || "Unknown";
				setSystemInfo((prev) => ({ ...prev, os }));

				// Detect RAM (approximate)
				const ram = navigator.deviceMemory ? `${navigator.deviceMemory * 2}GB` : "Unknown";
				setSystemInfo((prev) => ({ ...prev, ram }));

				// Detect CPU cores
				const cpu = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : "Unknown";
				setSystemInfo((prev) => ({ ...prev, cpu }));

				// Storage info (if available)
				if ("storage" in navigator && "estimate" in navigator.storage) {
					try {
						const estimate = await navigator.storage.estimate();
						const storage = estimate.quota ? `${Math.round(estimate.quota / 1024 / 1024 / 1024)}GB` : "Unknown";
						setSystemInfo((prev) => ({ ...prev, storage }));
					} catch (error) {
						setSystemInfo((prev) => ({ ...prev, storage: "Unknown" }));
					}
				}
			} catch (error) {
				console.error("Failed to detect system:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadSettings();
		detectSystem();
	}, []);

	const saveSettings = async () => {
		setSaveStatus("saving");
		try {
			localStorage.setItem("galacticClansSettings", JSON.stringify(settings));
			setSaveStatus("saved");
			setTimeout(() => setSaveStatus("idle"), 2000);
		} catch (error) {
			console.error("Failed to save settings:", error);
			setSaveStatus("error");
			setTimeout(() => setSaveStatus("idle"), 3000);
		}
	};

	const resetSettings = () => {
		if (confirm("Are you sure you want to reset all settings to default?")) {
			window.location.reload();
		}
	};

	const runBenchmark = async () => {
		// Placeholder for benchmark functionality
		alert("Benchmark feature coming soon!");
	};

	const handleSettingChange = (category: keyof SettingsConfig, setting: string, value: any) => {
		setSettings((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[setting]: value,
			},
		}));
	};

	const tabs = [
		{ id: "graphics", name: "Graphics", icon: Monitor, color: "from-blue-500 to-cyan-500" },
		{ id: "audio", name: "Audio", icon: Volume2, color: "from-green-500 to-emerald-500" },
		{ id: "controls", name: "Controls", icon: Gamepad2, color: "from-purple-500 to-pink-500" },
		{ id: "accessibility", name: "Accessibility", icon: Accessibility, color: "from-orange-500 to-red-500" },
		{ id: "gameplay", name: "Gameplay", icon: Target, color: "from-indigo-500 to-purple-500" },
		{ id: "network", name: "Network", icon: Wifi, color: "from-teal-500 to-blue-500" },
		{ id: "performance", name: "Performance", icon: Zap, color: "from-yellow-500 to-orange-500" },
	];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
					<div className="space-y-2">
						<h2 className="text-xl font-semibold text-white">Loading Settings</h2>
						<p className="text-sm text-slate-300">Detecting system capabilities...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-slate-950">
			{/* Header */}
			<div className="flex-shrink-0 p-6 border-b border-slate-800">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-white">Game Settings</h1>
						<p className="text-slate-400 mt-1">Configure your Galactic Clans experience</p>
					</div>
					<div className="flex items-center gap-3">
						{/* Save Status */}
						{saveStatus === "saving" && (
							<div className="flex items-center gap-2 text-yellow-400">
								<div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
								<span className="text-sm">Saving...</span>
							</div>
						)}
						{saveStatus === "saved" && (
							<div className="flex items-center gap-2 text-green-400">
								<CheckCircle className="w-4 h-4" />
								<span className="text-sm">Saved!</span>
							</div>
						)}
						{saveStatus === "error" && (
							<div className="flex items-center gap-2 text-red-400">
								<XCircle className="w-4 h-4" />
								<span className="text-sm">Save Failed</span>
							</div>
						)}

						{/* Action Buttons */}
						<button onClick={saveSettings} disabled={saveStatus === "saving"} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors">
							<Save className="w-4 h-4" />
							Save
						</button>
						<button onClick={resetSettings} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
							<RotateCcw className="w-4 h-4" />
							Reset
						</button>
						<button onClick={runBenchmark} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
							<BarChart3 className="w-4 h-4" />
							Benchmark
						</button>
					</div>
				</div>
			</div>

			{/* System Info */}
			<div className="flex-shrink-0 p-4 bg-slate-900/50 border-b border-slate-800">
				<div className="grid grid-cols-6 gap-4 text-sm">
					<div className="flex items-center gap-2">
						<Cpu className="w-4 h-4 text-blue-400" />
						<span className="text-slate-300">CPU:</span>
						<span className="text-white">{systemInfo.cpu}</span>
					</div>
					<div className="flex items-center gap-2">
						<Monitor className="w-4 h-4 text-green-400" />
						<span className="text-slate-300">GPU:</span>
						<span className="text-white">{systemInfo.gpu}</span>
					</div>
					<div className="flex items-center gap-2">
						<MemoryStick className="w-4 h-4 text-purple-400" />
						<span className="text-slate-300">RAM:</span>
						<span className="text-white">{systemInfo.ram}</span>
					</div>
					<div className="flex items-center gap-2">
						<HardDrive className="w-4 h-4 text-orange-400" />
						<span className="text-slate-300">Storage:</span>
						<span className="text-white">{systemInfo.storage}</span>
					</div>
					<div className="flex items-center gap-2">
						<Zap className="w-4 h-4 text-yellow-400" />
						<span className="text-slate-300">WebGL:</span>
						<span className="text-white">{systemInfo.webgl}</span>
					</div>
					<div className="flex items-center gap-2">
						<Smartphone className="w-4 h-4 text-teal-400" />
						<span className="text-slate-300">OS:</span>
						<span className="text-white">{systemInfo.os}</span>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 flex overflow-hidden">
				{/* Sidebar */}
				<div className="w-64 bg-slate-900/50 border-r border-slate-800 p-4">
					<nav className="space-y-2">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`
										w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
										${isActive ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` : "text-slate-300 hover:text-white hover:bg-slate-800/50"}
									`}
								>
									<Icon className="w-5 h-5" />
									<span className="font-medium">{tab.name}</span>
								</button>
							);
						})}
					</nav>
				</div>

				{/* Main Content */}
				<div className="flex-1 overflow-y-auto p-6">
					{activeTab === "graphics" && <GraphicsSettings settings={settings.graphics} onChange={(setting, value) => handleSettingChange("graphics", setting, value)} />}
					{activeTab === "audio" && <AudioSettings settings={settings.audio} onChange={(setting, value) => handleSettingChange("audio", setting, value)} />}
					{activeTab === "controls" && <ControlsSettings settings={settings.controls} onChange={(setting, value) => handleSettingChange("controls", setting, value)} />}
					{activeTab === "accessibility" && <AccessibilitySettings settings={settings.accessibility} onChange={(setting, value) => handleSettingChange("accessibility", setting, value)} />}
					{activeTab === "gameplay" && <GameplaySettings settings={settings.gameplay} onChange={(setting, value) => handleSettingChange("gameplay", setting, value)} />}
					{activeTab === "network" && <NetworkSettings settings={settings.network} onChange={(setting, value) => handleSettingChange("network", setting, value)} />}
					{activeTab === "performance" && <PerformanceSettings settings={settings.performance} onChange={(setting, value) => handleSettingChange("performance", setting, value)} />}
				</div>
			</div>
		</div>
	);
}
