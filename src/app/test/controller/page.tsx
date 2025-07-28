"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Zap, Target, Activity, Settings2, Trash2, RotateCcw, Eye, EyeOff, Download, Share2, ChevronDown, ChevronUp, CircuitBoard, Gauge, Timer, MousePointer2, Wifi, WifiOff, Play, Pause } from "lucide-react";
import "gamepad.css/styles.min.css";

interface ControllerMetrics {
	latency: number;
	response: number;
	accuracy: number;
	sensitivity: number;
	performanceScore: number;
}

interface ButtonState {
	[key: string]: boolean;
}

interface AxesState {
	leftStick: { x: number; y: number };
	rightStick: { x: number; y: number };
	leftTrigger: number;
	rightTrigger: number;
}

export default function ControllerTestPage() {
	const [connectedGamepads, setConnectedGamepads] = useState<Map<number, Gamepad>>(new Map());
	const [controllerType, setControllerType] = useState<string>("Unknown");
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isControlsExpanded, setIsControlsExpanded] = useState(true);
	const [isStatsVisible, setIsStatsVisible] = useState(true);
	const [buttonStates, setButtonStates] = useState<ButtonState>({});
	const [axesStates, setAxesStates] = useState<AxesState>({
		leftStick: { x: 0, y: 0 },
		rightStick: { x: 0, y: 0 },
		leftTrigger: 0,
		rightTrigger: 0,
	});
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

	const gamepadPollingRef = useRef<number | undefined>(undefined);
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

	const getGamepadCSSClass = (type: string): string => {
		switch (type) {
			case "Xbox":
				return "xbox360";
			case "PlayStation":
				return "ps3";
			case "Nintendo":
				return "switch";
			default:
				return "xbox360"; // Default fallback
		}
	};

	const mapButtonToGamepadCSS = (buttonIndex: number, controllerType: string): string => {
		// Xbox/Generic mapping
		if (controllerType === "Xbox" || controllerType === "Generic") {
			const xboxMap: { [key: number]: string } = {
				0: "a", // A button
				1: "b", // B button
				2: "x", // X button
				3: "y", // Y button
				4: "lb", // Left bumper
				5: "rb", // Right bumper
				6: "lt", // Left trigger
				7: "rt", // Right trigger
				8: "select", // Back/Select
				9: "start", // Start/Menu
				10: "ls", // Left stick click
				11: "rs", // Right stick click
				12: "up", // D-pad up
				13: "down", // D-pad down
				14: "left", // D-pad left
				15: "right", // D-pad right
			};
			return xboxMap[buttonIndex] || "";
		}

		// PlayStation mapping
		if (controllerType === "PlayStation") {
			const psMap: { [key: number]: string } = {
				0: "cross", // Cross (X)
				1: "circle", // Circle
				2: "square", // Square
				3: "triangle", // Triangle
				4: "l1", // L1
				5: "r1", // R1
				6: "l2", // L2
				7: "r2", // R2
				8: "select", // Share
				9: "start", // Options
				10: "l3", // L3
				11: "r3", // R3
				12: "up", // D-pad up
				13: "down", // D-pad down
				14: "left", // D-pad left
				15: "right", // D-pad right
			};
			return psMap[buttonIndex] || "";
		}

		// Nintendo Switch mapping
		if (controllerType === "Nintendo") {
			const switchMap: { [key: number]: string } = {
				0: "a", // A button
				1: "b", // B button
				2: "x", // X button
				3: "y", // Y button
				4: "l", // L bumper
				5: "r", // R bumper
				6: "zl", // ZL trigger
				7: "zr", // ZR trigger
				8: "minus", // Minus
				9: "plus", // Plus
				10: "ls", // Left stick click
				11: "rs", // Right stick click
				12: "up", // D-pad up
				13: "down", // D-pad down
				14: "left", // D-pad left
				15: "right", // D-pad right
			};
			return switchMap[buttonIndex] || "";
		}

		return "";
	};

	const pollGamepads = () => {
		const gamepads = navigator.getGamepads();
		const currentGamepads = new Map<number, Gamepad>();
		const newButtonStates: ButtonState = {};
		const newAxesStates: AxesState = {
			leftStick: { x: 0, y: 0 },
			rightStick: { x: 0, y: 0 },
			leftTrigger: 0,
			rightTrigger: 0,
		};

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

				// Update button states
				gamepad.buttons.forEach((button, index) => {
					const buttonName = mapButtonToGamepadCSS(index, controllerType);
					if (buttonName) {
						newButtonStates[buttonName] = button.pressed;

						// Log button press events
						if (button.pressed && !buttonStates[buttonName]) {
							addEventLog(`Button ${buttonName.toUpperCase()} pressed`, "info");
						}
					}
				});

				// Update axes states
				if (gamepad.axes.length >= 4) {
					newAxesStates.leftStick = {
						x: gamepad.axes[0] || 0,
						y: gamepad.axes[1] || 0,
					};
					newAxesStates.rightStick = {
						x: gamepad.axes[2] || 0,
						y: gamepad.axes[3] || 0,
					};
				}

				// Handle triggers (varies by controller)
				if (gamepad.axes.length >= 6) {
					newAxesStates.leftTrigger = ((gamepad.axes[4] ?? 0) + 1) / 2; // Convert from -1..1 to 0..1
					newAxesStates.rightTrigger = ((gamepad.axes[5] ?? 0) + 1) / 2;
				} else {
					// Fallback to button-based triggers
					newAxesStates.leftTrigger = gamepad.buttons[6]?.value ?? 0;
					newAxesStates.rightTrigger = gamepad.buttons[7]?.value ?? 0;
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
		setButtonStates(newButtonStates);
		setAxesStates(newAxesStates);

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
		const leftTrigger = axesStates.leftTrigger;
		const rightTrigger = axesStates.rightTrigger;
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
	}, [buttonStates, controllerType]);

	// Render gamepad visualization using gamepad.css
	const renderGamepadVisualization = () => {
		const cssClass = getGamepadCSSClass(controllerType);

		return (
			<div className="gamepad-container flex justify-center items-center min-h-[400px]">
				<div className={`gamepad ${cssClass} scale-150 transform transition-all duration-200`}>
					{/* Face buttons */}
					{controllerType === "Xbox" || controllerType === "Generic" ? (
						<>
							<div className={`button a ${buttonStates.a ? "pressed" : ""}`}></div>
							<div className={`button b ${buttonStates.b ? "pressed" : ""}`}></div>
							<div className={`button x ${buttonStates.x ? "pressed" : ""}`}></div>
							<div className={`button y ${buttonStates.y ? "pressed" : ""}`}></div>
						</>
					) : controllerType === "PlayStation" ? (
						<>
							<div className={`button cross ${buttonStates.cross ? "pressed" : ""}`}></div>
							<div className={`button circle ${buttonStates.circle ? "pressed" : ""}`}></div>
							<div className={`button square ${buttonStates.square ? "pressed" : ""}`}></div>
							<div className={`button triangle ${buttonStates.triangle ? "pressed" : ""}`}></div>
						</>
					) : controllerType === "Nintendo" ? (
						<>
							<div className={`button a ${buttonStates.a ? "pressed" : ""}`}></div>
							<div className={`button b ${buttonStates.b ? "pressed" : ""}`}></div>
							<div className={`button x ${buttonStates.x ? "pressed" : ""}`}></div>
							<div className={`button y ${buttonStates.y ? "pressed" : ""}`}></div>
						</>
					) : null}

					{/* D-pad */}
					<div className={`dpad up ${buttonStates.up ? "pressed" : ""}`}></div>
					<div className={`dpad down ${buttonStates.down ? "pressed" : ""}`}></div>
					<div className={`dpad left ${buttonStates.left ? "pressed" : ""}`}></div>
					<div className={`dpad right ${buttonStates.right ? "pressed" : ""}`}></div>

					{/* Shoulder buttons */}
					{controllerType === "Xbox" || controllerType === "Generic" ? (
						<>
							<div className={`bumper lb ${buttonStates.lb ? "pressed" : ""}`}></div>
							<div className={`bumper rb ${buttonStates.rb ? "pressed" : ""}`}></div>
							<div className={`trigger lt ${axesStates.leftTrigger > 0.1 ? "pressed" : ""}`}></div>
							<div className={`trigger rt ${axesStates.rightTrigger > 0.1 ? "pressed" : ""}`}></div>
						</>
					) : controllerType === "PlayStation" ? (
						<>
							<div className={`bumper l1 ${buttonStates.l1 ? "pressed" : ""}`}></div>
							<div className={`bumper r1 ${buttonStates.r1 ? "pressed" : ""}`}></div>
							<div className={`trigger l2 ${axesStates.leftTrigger > 0.1 ? "pressed" : ""}`}></div>
							<div className={`trigger r2 ${axesStates.rightTrigger > 0.1 ? "pressed" : ""}`}></div>
						</>
					) : controllerType === "Nintendo" ? (
						<>
							<div className={`bumper l ${buttonStates.l ? "pressed" : ""}`}></div>
							<div className={`bumper r ${buttonStates.r ? "pressed" : ""}`}></div>
							<div className={`trigger zl ${buttonStates.zl ? "pressed" : ""}`}></div>
							<div className={`trigger zr ${buttonStates.zr ? "pressed" : ""}`}></div>
						</>
					) : null}

					{/* Control buttons */}
					<div className={`button start ${buttonStates.start ? "pressed" : ""}`}></div>
					<div className={`button select ${buttonStates.select ? "pressed" : ""}`}></div>

					{/* Analog sticks */}
					<div
						className={`stick left ${buttonStates.ls ? "pressed" : ""}`}
						style={{
							transform: `translate(${axesStates.leftStick.x * 10}px, ${axesStates.leftStick.y * 10}px)`,
						}}
					></div>
					<div
						className={`stick right ${buttonStates.rs ? "pressed" : ""}`}
						style={{
							transform: `translate(${axesStates.rightStick.x * 10}px, ${axesStates.rightStick.y * 10}px)`,
						}}
					></div>
				</div>
			</div>
		);
	};

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
									<p className="text-xs text-slate-300">Input validation with gamepad.css</p>
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

								{/* Controller Layout with gamepad.css */}
								<div className="relative bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-8 border border-slate-700/30 min-h-[500px] flex items-center justify-center">
									{isConnected ? (
										<div className="w-full">
											{renderGamepadVisualization()}

											{/* Real-time stick and trigger values */}
											<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
												<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
													<div className="flex items-center space-x-2 mb-2">
														<MousePointer2 className="w-4 h-4 text-blue-400" />
														<span className="text-blue-400 text-sm font-medium">Left Stick</span>
													</div>
													<div className="font-mono text-white text-sm">
														X: {axesStates.leftStick.x.toFixed(2)}
														<br />
														Y: {axesStates.leftStick.y.toFixed(2)}
													</div>
												</div>
												<div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
													<div className="flex items-center space-x-2 mb-2">
														<MousePointer2 className="w-4 h-4 text-green-400" />
														<span className="text-green-400 text-sm font-medium">Right Stick</span>
													</div>
													<div className="font-mono text-white text-sm">
														X: {axesStates.rightStick.x.toFixed(2)}
														<br />
														Y: {axesStates.rightStick.y.toFixed(2)}
													</div>
												</div>
												<div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
													<div className="flex items-center space-x-2 mb-2">
														<Zap className="w-4 h-4 text-purple-400" />
														<span className="text-purple-400 text-sm font-medium">Left Trigger</span>
													</div>
													<div className="font-mono text-white text-sm">
														{(axesStates.leftTrigger * 100).toFixed(0)}%
														<div className="w-full bg-slate-700 rounded-full h-2 mt-1">
															<div className="bg-purple-500 h-2 rounded-full transition-all duration-100" style={{ width: `${axesStates.leftTrigger * 100}%` }}></div>
														</div>
													</div>
												</div>
												<div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
													<div className="flex items-center space-x-2 mb-2">
														<Zap className="w-4 h-4 text-orange-400" />
														<span className="text-orange-400 text-sm font-medium">Right Trigger</span>
													</div>
													<div className="font-mono text-white text-sm">
														{(axesStates.rightTrigger * 100).toFixed(0)}%
														<div className="w-full bg-slate-700 rounded-full h-2 mt-1">
															<div className="bg-orange-500 h-2 rounded-full transition-all duration-100" style={{ width: `${axesStates.rightTrigger * 100}%` }}></div>
														</div>
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
												<p className="text-slate-600 text-sm mt-2">Supports Xbox, PlayStation, and Nintendo controllers</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Control Panel - keeping the existing functionality */}
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
									<div className="flex items-center justify-between">
										<span className="text-slate-400">Active Buttons:</span>
										<span className="text-white font-mono">{Object.values(buttonStates).filter(Boolean).length}</span>
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

			{/* Custom Scrollbar Styles + gamepad.css enhancements */}
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

				/* Enhanced gamepad.css styles */
				.gamepad {
					position: relative;
					transition: all 0.2s ease;
				}

				.gamepad .button.pressed,
				.gamepad .bumper.pressed,
				.gamepad .trigger.pressed,
				.gamepad .dpad.pressed {
					filter: brightness(1.5) saturate(1.2);
					transform: scale(0.95);
					box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
				}

				.gamepad .stick {
					transition: transform 0.05s ease;
				}

				.gamepad-container {
					background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
				}
			`}</style>
		</div>
	);
}
