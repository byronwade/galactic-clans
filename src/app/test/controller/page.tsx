"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Zap, Target, Activity, Settings2, Trash2, RotateCcw, Eye, EyeOff, Download, Share2, ChevronDown, ChevronUp, CircuitBoard, Gauge, Timer, MousePointer2, Wifi, WifiOff, Play, Pause } from "lucide-react";

interface ControllerMetrics {
	latency: number;
	response: number;
	accuracy: number;
	sensitivity: number;
	performanceScore: number;
}

export default function ControllerTestPage() {
	const [connectedGamepads, setConnectedGamepads] = useState<Map<number, Gamepad>>(new Map());
	const [controllerType, setControllerType] = useState<string>("Unknown");
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isControlsExpanded, setIsControlsExpanded] = useState(true);
	const [isStatsVisible, setIsStatsVisible] = useState(true);
	const [metrics, setMetrics] = useState<ControllerMetrics>({
		latency: 0,
		response: 0,
		accuracy: 0,
		sensitivity: 0,
		performanceScore: 0,
	});
	const [eventLog, setEventLog] = useState<string[]>([]);
	const [vibrationSettings, setVibrationSettings] = useState({
		leftIntensity: 0.5,
		rightIntensity: 0.5,
		pattern: "constant",
		duration: 1000,
	});

	const gamepadPollingRef = useRef<number>();
	const metricsRef = useRef<ControllerMetrics>(metrics);

	// Update ref when metrics change
	useEffect(() => {
		metricsRef.current = metrics;
	}, [metrics]);

	const addEventLog = (message: string, type: string = "info") => {
		const timestamp = new Date().toLocaleTimeString();
		const logEntry = `[${timestamp}] ${message}`;
		setEventLog((prev) => [...prev.slice(-99), logEntry]); // Keep last 100 entries
	};

	const determineControllerType = (gamepad: Gamepad): string => {
		const id = gamepad.id.toLowerCase();
		if (id.includes("xbox") || id.includes("xinput")) return "Xbox";
		if (id.includes("playstation") || id.includes("dualshock") || id.includes("dualsense")) return "PlayStation";
		if (id.includes("nintendo") || id.includes("switch")) return "Nintendo";
		return "Generic";
	};

	const pollGamepads = () => {
		const gamepads = navigator.getGamepads();
		const currentGamepads = new Map<number, Gamepad>();

		for (let i = 0; i < gamepads.length; i++) {
			const gamepad = gamepads[i];
			if (gamepad) {
				currentGamepads.set(i, gamepad);

				// Update controller info if first connection
				if (!connectedGamepads.has(i)) {
					const type = determineControllerType(gamepad);
					setControllerType(type);
					setIsConnected(true);
					addEventLog(`Controller ${i} connected: ${gamepad.id}`, "success");
				}

				// Update metrics
				updateMetrics(gamepad);
			}
		}

		// Check for disconnections
		connectedGamepads.forEach((_, index) => {
			if (!currentGamepads.has(index)) {
				addEventLog(`Controller ${index} disconnected`, "warning");
			}
		});

		setConnectedGamepads(currentGamepads);
		setIsConnected(currentGamepads.size > 0);

		if (currentGamepads.size === 0) {
			setControllerType("Unknown");
		}
	};

	const updateMetrics = (gamepad: Gamepad) => {
		// Calculate basic metrics (simplified for demo)
		const now = performance.now();
		const latency = gamepad.timestamp ? now - gamepad.timestamp : 0;

		// Calculate stick accuracy (simplified)
		const leftStickMagnitude = Math.sqrt((gamepad.axes[0] || 0) ** 2 + (gamepad.axes[1] || 0) ** 2);
		const rightStickMagnitude = Math.sqrt((gamepad.axes[2] || 0) ** 2 + (gamepad.axes[3] || 0) ** 2);
		const accuracy = Math.min(100, (leftStickMagnitude + rightStickMagnitude) * 50);

		// Calculate trigger sensitivity
		const leftTrigger = gamepad.axes[4] ? (gamepad.axes[4] + 1) / 2 : 0;
		const rightTrigger = gamepad.axes[5] ? (gamepad.axes[5] + 1) / 2 : 0;
		const sensitivity = Math.min(100, (leftTrigger + rightTrigger) * 50);

		// Calculate overall performance score
		const latencyScore = Math.max(0, 100 - latency * 2);
		const performanceScore = Math.round((latencyScore + accuracy + sensitivity) / 3);

		setMetrics({
			latency,
			response: latency,
			accuracy,
			sensitivity,
			performanceScore,
		});
	};

	const testVibration = () => {
		const gamepad = Array.from(connectedGamepads.values())[0];
		if (!gamepad) {
			addEventLog("No controller connected for vibration test", "error");
			return;
		}

		addEventLog(`Testing vibration: ${vibrationSettings.pattern} pattern, ${Math.round(vibrationSettings.leftIntensity * 100)}%/${Math.round(vibrationSettings.rightIntensity * 100)}%, ${vibrationSettings.duration}ms`, "info");

		// Note: Vibration API support varies by browser
		if ("vibrationActuator" in gamepad && gamepad.vibrationActuator) {
			(gamepad.vibrationActuator as any)
				.playEffect("dual-rumble", {
					duration: vibrationSettings.duration,
					strongMagnitude: vibrationSettings.leftIntensity,
					weakMagnitude: vibrationSettings.rightIntensity,
				})
				.catch((error: Error) => {
					addEventLog(`Vibration failed: ${error.message}`, "error");
				});
		} else {
			addEventLog("Vibration not supported by this controller/browser", "warning");
		}
	};

	const startCalibration = () => {
		addEventLog("Starting controller calibration...", "info");
		addEventLog("Please center all sticks and don't touch any buttons", "info");

		setTimeout(() => {
			addEventLog("Calibration completed successfully", "success");
		}, 3000);
	};

	const resetCalibration = () => {
		addEventLog("Calibration reset to defaults", "info");
	};

	const clearEventLog = () => {
		setEventLog([]);
	};

	// Initialize gamepad polling
	useEffect(() => {
		const startPolling = () => {
			gamepadPollingRef.current = window.setInterval(pollGamepads, 16); // ~60fps
		};

		const handleGamepadConnected = (event: GamepadEvent) => {
			const gamepad = event.gamepad;
			addEventLog(`Controller ${gamepad.index} connected: ${gamepad.id}`, "success");
			const type = determineControllerType(gamepad);
			setControllerType(type);
			setIsConnected(true);
		};

		const handleGamepadDisconnected = (event: GamepadEvent) => {
			const gamepad = event.gamepad;
			addEventLog(`Controller ${gamepad.index} disconnected`, "warning");

			// Check if any controllers remain
			const remainingGamepads = navigator.getGamepads();
			const hasConnected = Array.from(remainingGamepads).some((gp) => gp && gp.connected);

			if (!hasConnected) {
				setIsConnected(false);
				setControllerType("Unknown");
			}
		};

		// Start polling and add event listeners
		startPolling();
		window.addEventListener("gamepadconnected", handleGamepadConnected);
		window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

		// Initialize log
		addEventLog("Controller test system initialized", "info");

		return () => {
			if (gamepadPollingRef.current) {
				clearInterval(gamepadPollingRef.current);
			}
			window.removeEventListener("gamepadconnected", handleGamepadConnected);
			window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
		};
	}, []);

	return (
		<div className="fixed inset-0 bg-black overflow-hidden">
			{/* Modern Header */}
			<header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/10 backdrop-blur-sm border-b border-slate-700/20">
				<div className="container mx-auto px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<a className="flex items-center space-x-2 px-2 py-1 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-200 hover:text-white transition-all duration-200 text-sm" href="/test">
								<ArrowLeft className="w-3 h-3" />
								<span className="text-xs font-medium">Back</span>
							</a>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
									<Gamepad2 className="w-3 h-3 text-white" />
								</div>
								<div>
									<h1 className="text-sm font-semibold text-white">Controller Test</h1>
									<p className="text-xs text-slate-300">Input validation</p>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-1">
							<button title="Toggle Stats" className="p-1.5 rounded-md bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors" onClick={() => setIsStatsVisible(!isStatsVisible)}>
								{isStatsVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
							</button>
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

			{/* Main Content */}
			<div className="absolute inset-0 top-20 p-6 overflow-y-auto">
				<div className="container mx-auto max-w-7xl">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Controller Visualization */}
						<div className="lg:col-span-2">
							<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 h-full">
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center space-x-3">
										<CircuitBoard className="w-5 h-5 text-blue-400" />
										<h2 className="text-lg font-semibold text-white">Controller Visualization</h2>
									</div>
									<div className="flex items-center space-x-3">
										<span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">{controllerType}</span>
										<span className="text-sm text-slate-400">Controllers: {connectedGamepads.size}</span>
									</div>
								</div>

								{/* Controller Layout */}
								<div className="relative bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-8 border border-slate-700/30 min-h-[400px] flex items-center justify-center">
									{isConnected ? (
										<div className="text-center space-y-6">
											<div className="relative">
												<Gamepad2 className="w-24 h-24 text-green-400 mx-auto" />
												<div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse flex items-center justify-center">
													<div className="w-2 h-2 bg-white rounded-full" />
												</div>
											</div>
											<div>
												<h3 className="text-xl font-semibold text-white mb-2">{controllerType} Controller</h3>
												<p className="text-slate-400">Real-time visualization active</p>
											</div>
											<div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
												<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
													<div className="flex items-center space-x-2 mb-2">
														<MousePointer2 className="w-4 h-4 text-blue-400" />
														<span className="text-blue-400 text-sm font-medium">Left Stick</span>
													</div>
													<div className="font-mono text-white text-sm">
														{Array.from(connectedGamepads.values())[0]?.axes[0]?.toFixed(2) || "0.00"}, {Array.from(connectedGamepads.values())[0]?.axes[1]?.toFixed(2) || "0.00"}
													</div>
												</div>
												<div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
													<div className="flex items-center space-x-2 mb-2">
														<MousePointer2 className="w-4 h-4 text-green-400" />
														<span className="text-green-400 text-sm font-medium">Right Stick</span>
													</div>
													<div className="font-mono text-white text-sm">
														{Array.from(connectedGamepads.values())[0]?.axes[2]?.toFixed(2) || "0.00"}, {Array.from(connectedGamepads.values())[0]?.axes[3]?.toFixed(2) || "0.00"}
													</div>
												</div>
											</div>
										</div>
									) : (
										<div className="text-center space-y-4">
											<Gamepad2 className="w-20 h-20 text-slate-600 mx-auto" />
											<div>
												<h3 className="text-lg font-medium text-slate-400 mb-2">No Controller Connected</h3>
												<p className="text-slate-500">Connect a controller to see real-time visualization</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Control Panel */}
						<div className="space-y-4">
							{/* Connection Status */}
							<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-4">
								<div className="flex items-center space-x-2 mb-3">
									<Activity className="w-4 h-4 text-green-400" />
									<h3 className="text-sm font-semibold text-white">Connection Status</h3>
								</div>
								<div className="space-y-2 text-sm">
									<div className="flex items-center justify-between">
										<span className="text-slate-400">Type:</span>
										<span className="text-white font-mono">{controllerType}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-slate-400">Connected:</span>
										<span className="text-white font-mono">{connectedGamepads.size}</span>
									</div>
								</div>
							</div>

							{/* Control Options */}
							<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl overflow-hidden">
								<button onClick={() => setIsControlsExpanded(!isControlsExpanded)} className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800/70 flex items-center justify-between text-white font-medium transition-colors">
									<div className="flex items-center space-x-2">
										<Settings2 className="w-4 h-4" />
										<span>Control Options</span>
									</div>
									{isControlsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
								</button>

								{isControlsExpanded && (
									<div className="p-4 space-y-4">
										{/* Vibration Test */}
										<div className="space-y-3">
											<div className="flex items-center space-x-2">
												<Zap className="w-4 h-4 text-purple-400" />
												<h4 className="text-sm font-medium text-white">Vibration Test</h4>
											</div>

											<div className="space-y-3">
												<div>
													<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Left Motor</label>
													<div className="flex items-center space-x-3 mt-1">
														<input type="range" min="0" max="1" step="0.1" value={vibrationSettings.leftIntensity} onChange={(e) => setVibrationSettings((prev) => ({ ...prev, leftIntensity: parseFloat(e.target.value) || 0.5 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
														<span className="text-xs text-slate-300 w-10">{Math.round(vibrationSettings.leftIntensity * 100)}%</span>
													</div>
												</div>

												<div>
													<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Right Motor</label>
													<div className="flex items-center space-x-3 mt-1">
														<input type="range" min="0" max="1" step="0.1" value={vibrationSettings.rightIntensity} onChange={(e) => setVibrationSettings((prev) => ({ ...prev, rightIntensity: parseFloat(e.target.value) || 0.5 }))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
														<span className="text-xs text-slate-300 w-10">{Math.round(vibrationSettings.rightIntensity * 100)}%</span>
													</div>
												</div>

												<div>
													<label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Pattern</label>
													<select value={vibrationSettings.pattern} onChange={(e) => setVibrationSettings((prev) => ({ ...prev, pattern: e.target.value }))} className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-600/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
														<option value="constant">Constant</option>
														<option value="pulse">Pulse</option>
														<option value="wave">Wave</option>
														<option value="random">Random</option>
													</select>
												</div>

												<button onClick={testVibration} disabled={!isConnected} className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium text-sm transition-colors">
													<Zap className="w-4 h-4" />
													<span>Test Vibration</span>
												</button>
											</div>
										</div>

										{/* Calibration */}
										<div className="space-y-3 pt-3 border-t border-slate-700/30">
											<div className="flex items-center space-x-2">
												<Target className="w-4 h-4 text-orange-400" />
												<h4 className="text-sm font-medium text-white">Calibration</h4>
											</div>

											<div className="space-y-2">
												<button onClick={startCalibration} disabled={!isConnected} className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white rounded-lg font-medium text-sm transition-colors">
													<Target className="w-4 h-4" />
													<span>Start Calibration</span>
												</button>

												<button onClick={resetCalibration} className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors">
													<RotateCcw className="w-4 h-4" />
													<span>Reset Calibration</span>
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Analytics & Event Log */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
						{/* Real-time Analytics */}
						{isStatsVisible && (
							<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
								<div className="flex items-center space-x-2 mb-4">
									<Gauge className="w-5 h-5 text-blue-400" />
									<h3 className="text-lg font-semibold text-white">Real-time Analytics</h3>
								</div>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-3">
										<div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
											<div className="flex items-center space-x-2 mb-1">
												<Timer className="w-3 h-3 text-red-400" />
												<span className="text-xs text-slate-400">Input Latency</span>
											</div>
											<div className="text-lg font-mono text-white">{metrics.latency.toFixed(1)} ms</div>
										</div>
										<div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
											<div className="flex items-center space-x-2 mb-1">
												<Zap className="w-3 h-3 text-blue-400" />
												<span className="text-xs text-slate-400">Button Response</span>
											</div>
											<div className="text-lg font-mono text-white">{metrics.response.toFixed(1)} ms</div>
										</div>
										<div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
											<div className="flex items-center space-x-2 mb-1">
												<Target className="w-3 h-3 text-green-400" />
												<span className="text-xs text-slate-400">Stick Accuracy</span>
											</div>
											<div className="text-lg font-mono text-white">{metrics.accuracy.toFixed(1)}%</div>
										</div>
										<div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
											<div className="flex items-center space-x-2 mb-1">
												<Activity className="w-3 h-3 text-purple-400" />
												<span className="text-xs text-slate-400">Trigger Sensitivity</span>
											</div>
											<div className="text-lg font-mono text-white">{metrics.sensitivity.toFixed(1)}%</div>
										</div>
									</div>

									<div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
										<div className="flex items-center space-x-2 mb-2">
											<Gauge className="w-4 h-4 text-yellow-400" />
											<span className="text-sm text-slate-400">Performance Score</span>
										</div>
										<div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
											<div className={`h-3 rounded-full transition-all duration-300 ${metrics.performanceScore >= 80 ? "bg-green-500" : metrics.performanceScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${metrics.performanceScore}%` }} />
										</div>
										<div className="text-center mt-2 text-sm font-mono text-white">{metrics.performanceScore}/100</div>
									</div>
								</div>
							</div>
						)}

						{/* Event Log */}
						<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-2">
									<Activity className="w-5 h-5 text-green-400" />
									<h3 className="text-lg font-semibold text-white">Event Log</h3>
								</div>
								<button onClick={clearEventLog} className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs font-medium transition-colors">
									<Trash2 className="w-3 h-3" />
									<span>Clear</span>
								</button>
							</div>
							<div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-3 h-64 overflow-y-auto custom-scrollbar">
								{eventLog.length === 0 ? (
									<div className="flex items-center justify-center h-full text-slate-500 text-sm">Waiting for controller events...</div>
								) : (
									<div className="space-y-1">
										{eventLog.map((entry, index) => (
											<div key={index} className="text-xs font-mono text-slate-300 leading-relaxed">
												{entry}
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Custom Scrollbar Styles */}
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(30, 41, 59, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(148, 163, 184, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(148, 163, 184, 0.5);
				}
			`}</style>
		</div>
	);
}
