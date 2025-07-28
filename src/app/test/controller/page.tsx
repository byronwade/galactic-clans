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
		if (controllerType === "Xbox" || controllerType === "Generic") {
			return (
				<div className="gamepad-container flex justify-center items-center min-h-[400px]">
					<div className="relative">
						{/* Xbox Controller Layout */}
						<div className="bg-gray-800 rounded-3xl p-8 relative w-80 h-48">
							{/* Face Buttons (Right side) */}
							<div className="absolute right-8 top-12 grid grid-cols-3 gap-1 w-16 h-16">
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--y ${buttonStates.y ? "pressed" : ""}`}>Y</i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--x ${buttonStates.x ? "pressed" : ""}`}>X</i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--b ${buttonStates.b ? "pressed" : ""}`}>B</i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--a ${buttonStates.a ? "pressed" : ""}`}>A</i>
								</div>
								<div></div>
							</div>

							{/* D-Pad (Left side) */}
							<div className="absolute left-8 top-12 grid grid-cols-3 gap-1 w-16 h-16">
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-up ${buttonStates.up ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-left ${buttonStates.left ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-right ${buttonStates.right ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-down ${buttonStates.down ? "pressed" : ""}`}></i>
								</div>
								<div></div>
							</div>

							{/* Shoulder Buttons */}
							<div className="absolute left-6 -top-2">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--lb ${buttonStates.lb ? "pressed" : ""}`}>LB</i>
								</div>
							</div>
							<div className="absolute right-6 -top-2">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--rb ${buttonStates.rb ? "pressed" : ""}`}>RB</i>
								</div>
							</div>

							{/* Triggers */}
							<div className="absolute left-8 -top-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--lt ${axesStates.leftTrigger > 0.1 ? "pressed" : ""}`}>LT</i>
								</div>
							</div>
							<div className="absolute right-8 -top-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--rt ${axesStates.rightTrigger > 0.1 ? "pressed" : ""}`}>RT</i>
								</div>
							</div>

							{/* Analog Sticks */}
							<div className="absolute left-12 bottom-4">
								<div className="gamepad-button-wrapper">
									<i
										className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--l3 ${buttonStates.ls ? "pressed" : ""}`}
										style={{
											transform: `translate(${axesStates.leftStick.x * 3}px, ${axesStates.leftStick.y * 3}px)`,
										}}
									>
										L3
									</i>
								</div>
							</div>
							<div className="absolute right-12 bottom-4">
								<div className="gamepad-button-wrapper">
									<i
										className={`gamepad-button gamepad-button-xbox gamepad-button-xbox--r3 ${buttonStates.rs ? "pressed" : ""}`}
										style={{
											transform: `translate(${axesStates.rightStick.x * 3}px, ${axesStates.rightStick.y * 3}px)`,
										}}
									>
										R3
									</i>
								</div>
							</div>

							{/* Center Buttons */}
							<div className="absolute left-1/2 top-6 transform -translate-x-1/2 flex space-x-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--size-small ${buttonStates.select ? "pressed" : ""}`}>⊞</i>
								</div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--size-small ${buttonStates.start ? "pressed" : ""}`}>☰</i>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		} else if (controllerType === "PlayStation") {
			return (
				<div className="gamepad-container flex justify-center items-center min-h-[400px]">
					<div className="relative">
						{/* PlayStation Controller Layout */}
						<div className="bg-gray-800 rounded-3xl p-8 relative w-80 h-48">
							{/* Face Buttons (Right side) */}
							<div className="absolute right-8 top-12 grid grid-cols-3 gap-1 w-16 h-16">
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--triangle ${buttonStates.triangle ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--square ${buttonStates.square ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--circle ${buttonStates.circle ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--cross ${buttonStates.cross ? "pressed" : ""}`}></i>
								</div>
								<div></div>
							</div>

							{/* D-Pad (Left side) */}
							<div className="absolute left-8 top-12 grid grid-cols-3 gap-1 w-16 h-16">
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-up ${buttonStates.up ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-left ${buttonStates.left ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-right ${buttonStates.right ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--arrow gamepad-button--arrow-down ${buttonStates.down ? "pressed" : ""}`}></i>
								</div>
								<div></div>
							</div>

							{/* Shoulder Buttons */}
							<div className="absolute left-6 -top-2">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--l1 ${buttonStates.l1 ? "pressed" : ""}`}>L1</i>
								</div>
							</div>
							<div className="absolute right-6 -top-2">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--r1 ${buttonStates.r1 ? "pressed" : ""}`}>R1</i>
								</div>
							</div>

							{/* Triggers */}
							<div className="absolute left-8 -top-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--l2 ${axesStates.leftTrigger > 0.1 ? "pressed" : ""}`}>L2</i>
								</div>
							</div>
							<div className="absolute right-8 -top-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--r2 ${axesStates.rightTrigger > 0.1 ? "pressed" : ""}`}>R2</i>
								</div>
							</div>

							{/* Analog Sticks */}
							<div className="absolute left-12 bottom-4">
								<div className="gamepad-button-wrapper">
									<i
										className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--l3 ${buttonStates.l3 ? "pressed" : ""}`}
										style={{
											transform: `translate(${axesStates.leftStick.x * 3}px, ${axesStates.leftStick.y * 3}px)`,
										}}
									>
										L3
									</i>
								</div>
							</div>
							<div className="absolute right-12 bottom-4">
								<div className="gamepad-button-wrapper">
									<i
										className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--r3 ${buttonStates.rs ? "pressed" : ""}`}
										style={{
											transform: `translate(${axesStates.rightStick.x * 3}px, ${axesStates.rightStick.y * 3}px)`,
										}}
									>
										R3
									</i>
								</div>
							</div>

							{/* Center Buttons */}
							<div className="absolute left-1/2 top-6 transform -translate-x-1/2 flex space-x-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--select ${buttonStates.select ? "pressed" : ""}`}>SELECT</i>
								</div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-playstation gamepad-button-playstation--start ${buttonStates.start ? "pressed" : ""}`}>START</i>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		} else if (controllerType === "Nintendo") {
			return (
				<div className="gamepad-container flex justify-center items-center min-h-[400px]">
					<div className="relative">
						{/* Nintendo Switch Controller Layout */}
						<div className="bg-gray-800 rounded-3xl p-8 relative w-80 h-48">
							{/* Face Buttons (Right side) */}
							<div className="absolute right-8 top-12 grid grid-cols-3 gap-1 w-16 h-16">
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--x ${buttonStates.x ? "pressed" : ""}`}>X</i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--y ${buttonStates.y ? "pressed" : ""}`}>Y</i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--a ${buttonStates.a ? "pressed" : ""}`}>A</i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--b ${buttonStates.b ? "pressed" : ""}`}>B</i>
								</div>
								<div></div>
							</div>

							{/* D-Pad (Left side) - Switch style circular buttons */}
							<div className="absolute left-8 top-12 grid grid-cols-3 gap-1 w-16 h-16">
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--variant-switch gamepad-button--arrow gamepad-button--arrow-up ${buttonStates.up ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--variant-switch gamepad-button--arrow gamepad-button--arrow-left ${buttonStates.left ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--variant-switch gamepad-button--arrow gamepad-button--arrow-right ${buttonStates.right ? "pressed" : ""}`}></i>
								</div>
								<div></div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--variant-switch gamepad-button--arrow gamepad-button--arrow-down ${buttonStates.down ? "pressed" : ""}`}></i>
								</div>
								<div></div>
							</div>

							{/* Shoulder Buttons */}
							<div className="absolute left-6 -top-2">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--l ${buttonStates.l ? "pressed" : ""}`}>L</i>
								</div>
							</div>
							<div className="absolute right-6 -top-2">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--r ${buttonStates.r ? "pressed" : ""}`}>R</i>
								</div>
							</div>

							{/* Triggers */}
							<div className="absolute left-8 -top-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--zl ${buttonStates.zl ? "pressed" : ""}`}>ZL</i>
								</div>
							</div>
							<div className="absolute right-8 -top-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button-nintendo gamepad-button-nintendo--zr ${buttonStates.zr ? "pressed" : ""}`}>ZR</i>
								</div>
							</div>

							{/* Center Buttons */}
							<div className="absolute left-1/2 top-6 transform -translate-x-1/2 flex space-x-8">
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--size-small ${buttonStates.minus ? "pressed" : ""}`}>-</i>
								</div>
								<div className="gamepad-button-wrapper">
									<i className={`gamepad-button gamepad-button--size-small ${buttonStates.plus ? "pressed" : ""}`}>+</i>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// Fallback for unknown controller types
		return (
			<div className="gamepad-container flex justify-center items-center min-h-[400px]">
				<div className="text-center space-y-4">
					<Gamepad2 className="w-20 h-20 text-slate-600 mx-auto" />
					<div>
						<h3 className="text-lg font-medium text-slate-400 mb-2">Controller Connected</h3>
						<p className="text-slate-500">Basic controller support active</p>
						<p className="text-slate-600 text-sm mt-2">Gamepad.css visualization not available for this controller type</p>
					</div>
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
				.gamepad-container {
					background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
				}

				/* Pressed button effects */
				.gamepad-button.pressed,
				.gamepad-button-wrapper:has(.pressed) .gamepad-button {
					filter: brightness(1.4) saturate(1.3) drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
					transform: scale(0.95) translateY(1px);
					transition: all 0.1s ease;
				}

				/* Enhanced button glow effects */
				.gamepad-button-xbox--a.pressed {
					box-shadow: 0 0 15px #a3e82d;
				}
				.gamepad-button-xbox--b.pressed {
					box-shadow: 0 0 15px #ff613e;
				}
				.gamepad-button-xbox--x.pressed {
					box-shadow: 0 0 15px #1d9aff;
				}
				.gamepad-button-xbox--y.pressed {
					box-shadow: 0 0 15px #ffde30;
				}

				.gamepad-button-playstation--cross.pressed {
					box-shadow: 0 0 15px #9da5d5;
				}
				.gamepad-button-playstation--circle.pressed {
					box-shadow: 0 0 15px #e94b0e;
				}
				.gamepad-button-playstation--square.pressed {
					box-shadow: 0 0 15px #d592bd;
				}
				.gamepad-button-playstation--triangle.pressed {
					box-shadow: 0 0 15px #20af93;
				}

				/* Analog stick movement enhancements */
				.gamepad-button-xbox--l3,
				.gamepad-button-xbox--r3,
				.gamepad-button-playstation--l3,
				.gamepad-button-playstation--r3 {
					transition: transform 0.05s ease !important;
				}

				/* D-pad pressed effects */
				.gamepad-button--arrow.pressed {
					filter: brightness(1.6) drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
				}

				/* Trigger and bumper effects */
				.gamepad-button-xbox--lb.pressed,
				.gamepad-button-xbox--rb.pressed,
				.gamepad-button-xbox--lt.pressed,
				.gamepad-button-xbox--rt.pressed,
				.gamepad-button-playstation--l1.pressed,
				.gamepad-button-playstation--r1.pressed,
				.gamepad-button-playstation--l2.pressed,
				.gamepad-button-playstation--r2.pressed,
				.gamepad-button-nintendo--l.pressed,
				.gamepad-button-nintendo--r.pressed,
				.gamepad-button-nintendo--zl.pressed,
				.gamepad-button-nintendo--zr.pressed {
					filter: brightness(1.4) drop-shadow(0 0 8px rgba(255, 165, 0, 0.8));
				}

				/* Controller background styling */
				.gamepad-container > div > div {
					box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
					border: 2px solid rgba(255, 255, 255, 0.1);
				}

				/* Enhanced gamepad.css button press animations */
				.gamepad .button.pressed,
				.gamepad .bumper.pressed,
				.gamepad .trigger.pressed,
				.gamepad .dpad.pressed {
					transform: scale(0.95);
					box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3);
					background: radial-gradient(circle at center, rgba(59, 130, 246, 0.8), transparent 50%);
					animation: buttonPulse 0.2s ease-out;
				}

				/* Enhanced middle button animations with modern design */
				.gamepad .start.pressed,
				.gamepad .select.pressed,
				.gamepad .home.pressed {
					transform: scale(0.92) rotate(5deg);
					box-shadow: inset 0 3px 12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(34, 197, 94, 0.8), 0 0 50px rgba(34, 197, 94, 0.4), 0 0 75px rgba(34, 197, 94, 0.2);
					background: linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.8) 50%, rgba(5, 150, 105, 0.7) 100%);
					border: 2px solid rgba(34, 197, 94, 0.6);
					animation: premiumPulse 0.6s ease-in-out;
				}

				/* Special home button enhancement */
				.gamepad .home.pressed {
					background: linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(126, 34, 206, 0.8) 50%, rgba(107, 33, 168, 0.7) 100%);
					box-shadow: inset 0 3px 12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(147, 51, 234, 0.8), 0 0 50px rgba(147, 51, 234, 0.4), 0 0 75px rgba(147, 51, 234, 0.2);
					border: 2px solid rgba(147, 51, 234, 0.6);
					transform: scale(0.88) rotate(-3deg);
				}

				/* Smooth stick movements */
				.gamepad .stick.pressed {
					transform: scale(1.1);
					box-shadow: 0 0 15px rgba(236, 72, 153, 0.7), 0 0 30px rgba(236, 72, 153, 0.3);
					background: radial-gradient(circle at center, rgba(236, 72, 153, 0.8) 0%, rgba(219, 39, 119, 0.6) 50%, transparent 70%);
					animation: stickGlow 0.4s ease-out;
				}

				/* Enhanced keyframe animations */
				@keyframes buttonPulse {
					0% {
						transform: scale(1);
						box-shadow: none;
					}
					50% {
						transform: scale(0.92);
						box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.8);
					}
					100% {
						transform: scale(0.95);
						box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.6);
					}
				}

				@keyframes premiumPulse {
					0% {
						transform: scale(1) rotate(0deg);
						box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
					}
					25% {
						transform: scale(0.88) rotate(3deg);
						box-shadow: 0 0 35px rgba(34, 197, 94, 1), 0 0 70px rgba(34, 197, 94, 0.6);
					}
					50% {
						transform: scale(0.85) rotate(8deg);
						box-shadow: inset 0 4px 16px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.9), 0 0 80px rgba(34, 197, 94, 0.5);
					}
					75% {
						transform: scale(0.88) rotate(6deg);
						box-shadow: 0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4);
					}
					100% {
						transform: scale(0.92) rotate(5deg);
						box-shadow: inset 0 3px 12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(34, 197, 94, 0.8);
					}
				}

				@keyframes stickGlow {
					0% {
						transform: scale(1);
						box-shadow: none;
					}
					50% {
						transform: scale(1.15);
						box-shadow: 0 0 25px rgba(236, 72, 153, 0.9), 0 0 50px rgba(236, 72, 153, 0.5);
					}
					100% {
						transform: scale(1.1);
						box-shadow: 0 0 15px rgba(236, 72, 153, 0.7), 0 0 30px rgba(236, 72, 153, 0.3);
					}
				}

				/* Enhanced button design improvements */
				.gamepad .button,
				.gamepad .bumper,
				.gamepad .trigger,
				.gamepad .dpad {
					transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
					border-radius: 50%;
					position: relative;
					overflow: hidden;
				}

				.gamepad .start,
				.gamepad .select,
				.gamepad .home {
					transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
					border-radius: 8px;
					position: relative;
					overflow: hidden;
					background: linear-gradient(135deg, rgba(71, 85, 105, 0.8) 0%, rgba(51, 65, 85, 0.9) 100%);
					border: 1px solid rgba(148, 163, 184, 0.3);
				}

				/* Ripple effect for premium buttons */
				.gamepad .start::before,
				.gamepad .select::before,
				.gamepad .home::before {
					content: "";
					position: absolute;
					top: 50%;
					left: 50%;
					width: 0;
					height: 0;
					background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 70%);
					border-radius: 50%;
					transform: translate(-50%, -50%);
					transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
					opacity: 0;
				}

				.gamepad .start.pressed::before,
				.gamepad .select.pressed::before,
				.gamepad .home.pressed::before {
					width: 200%;
					height: 200%;
					opacity: 1;
					animation: rippleEffect 0.6s ease-out;
				}

				@keyframes rippleEffect {
					0% {
						width: 0;
						height: 0;
						opacity: 1;
					}
					50% {
						width: 150%;
						height: 150%;
						opacity: 0.8;
					}
					100% {
						width: 200%;
						height: 200%;
						opacity: 0;
					}
				}

				/* Enhanced visual feedback */
				.gamepad .button:not(.pressed):hover,
				.gamepad .bumper:not(.pressed):hover,
				.gamepad .trigger:not(.pressed):hover,
				.gamepad .dpad:not(.pressed):hover {
					transform: scale(1.05);
					box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
				}

				.gamepad .start:not(.pressed):hover,
				.gamepad .select:not(.pressed):hover,
				.gamepad .home:not(.pressed):hover {
					transform: scale(1.02);
					box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
					background: linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(51, 65, 85, 1) 100%);
				}
			`}</style>
		</div>
	);
}
