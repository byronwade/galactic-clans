/**
 * @file useGlobalInputDetection.ts
 * @description Global Input Method Detection System
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Detects controller vs keyboard/mouse usage
 * - Shows temporary alerts when switching input methods
 * - Provides global input state across the application
 * - Automatic timeout for alert dismissal
 * - Smooth transitions between input methods
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type InputMethod = "keyboard_mouse" | "controller" | "unknown";

interface InputDetectionState {
	currentMethod: InputMethod;
	isControllerConnected: boolean;
	lastSwitchTime: number;
	showAlert: boolean;
	alertMessage: string;
	controllerType: string;
}

interface InputAlert {
	show: boolean;
	message: string;
	type: "switch_to_controller" | "switch_to_keyboard" | "controller_connected" | "controller_disconnected";
	timestamp: number;
}

const ALERT_DURATION = 3000; // 3 seconds
const SWITCH_DETECTION_COOLDOWN = 1000; // 1 second cooldown between switches

export function useGlobalInputDetection() {
	const [inputState, setInputState] = useState<InputDetectionState>({
		currentMethod: "unknown",
		isControllerConnected: false,
		lastSwitchTime: 0,
		showAlert: false,
		alertMessage: "",
		controllerType: "Unknown",
	});

	const [alert, setAlert] = useState<InputAlert>({
		show: false,
		message: "",
		type: "switch_to_keyboard",
		timestamp: 0,
	});

	const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastInputTime = useRef({ keyboard: 0, mouse: 0, controller: 0 });

	// Get controller type name
	const getControllerTypeName = useCallback((gamepad: Gamepad): string => {
		const id = gamepad.id.toLowerCase();
		if (id.includes("xbox")) return "Xbox Controller";
		if (id.includes("playstation") || id.includes("ps4") || id.includes("ps5")) return "PlayStation Controller";
		if (id.includes("nintendo") || id.includes("switch")) return "Nintendo Controller";
		if (id.includes("generic")) return "Generic Controller";
		return gamepad.id.split(" ").slice(0, 2).join(" ") || "Controller";
	}, []);

	// Show alert with auto-dismiss
	const showInputAlert = useCallback((message: string, type: InputAlert["type"]) => {
		const now = Date.now();

		setAlert({
			show: true,
			message,
			type,
			timestamp: now,
		});

		// Clear previous timeout
		if (alertTimeoutRef.current) {
			clearTimeout(alertTimeoutRef.current);
		}

		// Auto-dismiss after duration
		alertTimeoutRef.current = setTimeout(() => {
			setAlert((prev) => ({ ...prev, show: false }));
		}, ALERT_DURATION);
	}, []);

	// Detect controller connection/disconnection
	const checkControllerConnection = useCallback(() => {
		const gamepads = navigator.getGamepads();
		const connectedGamepad = Array.from(gamepads).find((gp) => gp !== null);
		const isConnected = !!connectedGamepad;

		if (isConnected !== inputState.isControllerConnected) {
			const controllerType = connectedGamepad ? getControllerTypeName(connectedGamepad) : "Unknown";

			setInputState((prev) => ({
				...prev,
				isControllerConnected: isConnected,
				controllerType,
			}));

			// Show connection/disconnection alert
			if (isConnected) {
				showInputAlert(`${controllerType} Connected`, "controller_connected");
			} else {
				showInputAlert("Controller Disconnected", "controller_disconnected");
				// Switch back to keyboard/mouse when controller disconnects
				setInputState((prev) => ({
					...prev,
					currentMethod: "keyboard_mouse",
					lastSwitchTime: Date.now(),
				}));
			}
		}
	}, [inputState.isControllerConnected, getControllerTypeName, showInputAlert]);

	// Detect input method switches
	const detectInputSwitch = useCallback(
		(newMethod: InputMethod) => {
			const now = Date.now();
			const timeSinceLastSwitch = now - inputState.lastSwitchTime;

			if (newMethod !== inputState.currentMethod && timeSinceLastSwitch > SWITCH_DETECTION_COOLDOWN) {
				const oldMethod = inputState.currentMethod;

				setInputState((prev) => ({
					...prev,
					currentMethod: newMethod,
					lastSwitchTime: now,
				}));

				// Show appropriate switch alert
				if (oldMethod !== "unknown") {
					if (newMethod === "controller") {
						showInputAlert(`Switched to ${inputState.controllerType}`, "switch_to_controller");
					} else if (newMethod === "keyboard_mouse") {
						showInputAlert("Switched to Keyboard & Mouse", "switch_to_keyboard");
					}
				}
			}
		},
		[inputState.currentMethod, inputState.lastSwitchTime, inputState.controllerType, showInputAlert]
	);

	// Keyboard event handlers
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const now = Date.now();
			lastInputTime.current.keyboard = now;

			// Detect keyboard input
			if (now - lastInputTime.current.controller > 500) {
				detectInputSwitch("keyboard_mouse");
			}
		},
		[detectInputSwitch]
	);

	// Mouse event handlers
	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			const now = Date.now();
			lastInputTime.current.mouse = now;

			// Only count significant mouse movement (not tiny jitter)
			if (Math.abs(event.movementX) > 2 || Math.abs(event.movementY) > 2) {
				if (now - lastInputTime.current.controller > 500) {
					detectInputSwitch("keyboard_mouse");
				}
			}
		},
		[detectInputSwitch]
	);

	const handleMouseClick = useCallback(() => {
		const now = Date.now();
		lastInputTime.current.mouse = now;

		if (now - lastInputTime.current.controller > 500) {
			detectInputSwitch("keyboard_mouse");
		}
	}, [detectInputSwitch]);

	// Controller input detection
	const checkControllerInput = useCallback(() => {
		if (!inputState.isControllerConnected) return;

		const gamepads = navigator.getGamepads();
		const gamepad = Array.from(gamepads).find((gp) => gp !== null);

		if (gamepad) {
			let hasInput = false;
			const now = Date.now();

			// Check buttons
			for (let i = 0; i < gamepad.buttons.length; i++) {
				if (gamepad.buttons[i]?.pressed) {
					hasInput = true;
					break;
				}
			}

			// Check analog sticks with deadzone
			const deadzone = 0.15;
			for (let i = 0; i < gamepad.axes.length; i++) {
				const axisValue = gamepad.axes[i] || 0;
				if (Math.abs(axisValue) > deadzone) {
					hasInput = true;
					break;
				}
			}

			if (hasInput) {
				lastInputTime.current.controller = now;

				// Switch to controller if we haven't had keyboard/mouse input recently
				const timeSinceKeyboard = now - lastInputTime.current.keyboard;
				const timeSinceMouse = now - lastInputTime.current.mouse;

				if (timeSinceKeyboard > 500 && timeSinceMouse > 500) {
					detectInputSwitch("controller");
				}
			}
		}
	}, [inputState.isControllerConnected, detectInputSwitch]);

	// Dismiss alert manually
	const dismissAlert = useCallback(() => {
		setAlert((prev) => ({ ...prev, show: false }));
		if (alertTimeoutRef.current) {
			clearTimeout(alertTimeoutRef.current);
		}
	}, []);

	// Setup event listeners and polling
	useEffect(() => {
		// Initial controller check
		checkControllerConnection();

		// Add event listeners
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mousedown", handleMouseClick);
		document.addEventListener("click", handleMouseClick);

		// Controller polling
		const controllerInterval = setInterval(() => {
			checkControllerConnection();
			checkControllerInput();
		}, 100); // 10 FPS polling for responsive detection

		return () => {
			// Cleanup
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mousedown", handleMouseClick);
			document.removeEventListener("click", handleMouseClick);
			clearInterval(controllerInterval);

			if (alertTimeoutRef.current) {
				clearTimeout(alertTimeoutRef.current);
			}
		};
	}, [handleKeyDown, handleMouseMove, handleMouseClick, checkControllerConnection, checkControllerInput]);

	return {
		// Current input state
		currentMethod: inputState.currentMethod,
		isControllerConnected: inputState.isControllerConnected,
		controllerType: inputState.controllerType,

		// Alert state
		showAlert: alert.show,
		alertMessage: alert.message,
		alertType: alert.type,

		// Manual controls
		dismissAlert,

		// Utility functions
		isUsingController: inputState.currentMethod === "controller",
		isUsingKeyboardMouse: inputState.currentMethod === "keyboard_mouse",
	};
}

export default useGlobalInputDetection;
