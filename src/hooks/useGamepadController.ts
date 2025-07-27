/**
 * @file useGamepadController.ts
 * @description Universal Gamepad Controller Hook for All Test Pages
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * 
 * Provides consistent controller support across:
 * - Navigation between pages and UI elements
 * - Camera controls in 3D environments
 * - Settings and parameter adjustments
 * - Menu interactions and selections
 */

"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface GamepadState {
	connected: boolean;
	controllerType: string;
	leftStick: { x: number; y: number };
	rightStick: { x: number; y: number };
	buttons: {
		a: boolean;        // Primary action (A/X)
		b: boolean;        // Secondary action (B/Circle)
		x: boolean;        // Tertiary action (X/Square)
		y: boolean;        // Quaternary action (Y/Triangle)
		lb: boolean;       // Left bumper (L1)
		rb: boolean;       // Right bumper (R1)
		lt: number;        // Left trigger (L2) - analog
		rt: number;        // Right trigger (R2) - analog
		select: boolean;   // Back/Select
		start: boolean;    // Start/Options
		leftStickBtn: boolean;  // L3
		rightStickBtn: boolean; // R3
		dpadUp: boolean;
		dpadDown: boolean;
		dpadLeft: boolean;
		dpadRight: boolean;
	};
	axes: number[];
	timestamp: number;
}

export interface GamepadActions {
	// Navigation
	onNavigateUp?: () => void;
	onNavigateDown?: () => void;
	onNavigateLeft?: () => void;
	onNavigateRight?: () => void;
	
	// Actions
	onPrimaryAction?: () => void;    // A/X button
	onSecondaryAction?: () => void;  // B/Circle button
	onTertiaryAction?: () => void;   // X/Square button
	onQuaternaryAction?: () => void; // Y/Triangle button
	
	// System
	onMenuToggle?: () => void;       // Start/Options
	onBackAction?: () => void;       // Select/Back
	
	// Camera/3D controls
	onCameraRotate?: (deltaX: number, deltaY: number) => void;
	onCameraZoom?: (delta: number) => void;
	onCameraMove?: (x: number, y: number) => void;
	
	// Settings adjustment
	onValueIncrease?: () => void;    // Right bumper
	onValueDecrease?: () => void;    // Left bumper
	onFineTuneIncrease?: () => void; // Right trigger
	onFineTuneDecrease?: () => void; // Left trigger
}

export interface UseGamepadControllerOptions {
	deadzone?: number;
	sensitivity?: number;
	enableHaptics?: boolean;
	pollRate?: number;
	actions?: GamepadActions;
}

const DEFAULT_OPTIONS: Required<UseGamepadControllerOptions> = {
	deadzone: 0.15,
	sensitivity: 1.0,
	enableHaptics: true,
	pollRate: 16, // 60 FPS
	actions: {},
};

export function useGamepadController(options: UseGamepadControllerOptions = {}) {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const [gamepadState, setGamepadState] = useState<GamepadState>({
		connected: false,
		controllerType: "Unknown",
		leftStick: { x: 0, y: 0 },
		rightStick: { x: 0, y: 0 },
		buttons: {
			a: false, b: false, x: false, y: false,
			lb: false, rb: false, lt: 0, rt: 0,
			select: false, start: false,
			leftStickBtn: false, rightStickBtn: false,
			dpadUp: false, dpadDown: false, dpadLeft: false, dpadRight: false,
		},
		axes: [],
		timestamp: 0,
	});

	const previousStateRef = useRef<GamepadState>(gamepadState);
	const pollingRef = useRef<number>();
	const actionsRef = useRef<GamepadActions>(opts.actions);

	// Update actions ref when actions change
	useEffect(() => {
		actionsRef.current = opts.actions;
	}, [opts.actions]);

	const determineControllerType = useCallback((gamepad: Gamepad): string => {
		const id = gamepad.id.toLowerCase();
		if (id.includes("xbox") || id.includes("xinput")) return "Xbox";
		if (id.includes("playstation") || id.includes("dualshock") || id.includes("dualsense")) return "PlayStation";
		if (id.includes("nintendo") || id.includes("switch")) return "Nintendo";
		return "Generic";
	}, []);

	const applyDeadzone = useCallback((value: number): number => {
		return Math.abs(value) < opts.deadzone ? 0 : value;
	}, [opts.deadzone]);

	const handleButtonPress = useCallback((buttonName: keyof GamepadState['buttons'], isPressed: boolean, wasPressed: boolean) => {
		if (!isPressed || wasPressed) return; // Only trigger on button press, not hold

		const actions = actionsRef.current;
		
		switch (buttonName) {
			case 'a':
				actions.onPrimaryAction?.();
				break;
			case 'b':
				actions.onSecondaryAction?.();
				break;
			case 'x':
				actions.onTertiaryAction?.();
				break;
			case 'y':
				actions.onQuaternaryAction?.();
				break;
			case 'start':
				actions.onMenuToggle?.();
				break;
			case 'select':
				actions.onBackAction?.();
				break;
			case 'dpadUp':
				actions.onNavigateUp?.();
				break;
			case 'dpadDown':
				actions.onNavigateDown?.();
				break;
			case 'dpadLeft':
				actions.onNavigateLeft?.();
				break;
			case 'dpadRight':
				actions.onNavigateRight?.();
				break;
			case 'lb':
				actions.onValueDecrease?.();
				break;
			case 'rb':
				actions.onValueIncrease?.();
				break;
		}
	}, [actionsRef]);

	const handleAnalogInputs = useCallback((currentState: GamepadState, previousState: GamepadState) => {
		const actions = actionsRef.current;
		
		// Right stick camera rotation
		if (actions.onCameraRotate) {
			const deltaX = (currentState.rightStick.x - previousState.rightStick.x) * opts.sensitivity;
			const deltaY = (currentState.rightStick.y - previousState.rightStick.y) * opts.sensitivity;
			
			if (Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01) {
				actions.onCameraRotate(deltaX, deltaY);
			}
		}

		// Left stick camera movement
		if (actions.onCameraMove && (Math.abs(currentState.leftStick.x) > 0.01 || Math.abs(currentState.leftStick.y) > 0.01)) {
			actions.onCameraMove(currentState.leftStick.x * opts.sensitivity, currentState.leftStick.y * opts.sensitivity);
		}

		// Triggers for zoom/fine adjustment
		if (actions.onCameraZoom) {
			const zoomDelta = currentState.buttons.rt - currentState.buttons.lt;
			if (Math.abs(zoomDelta) > 0.01) {
				actions.onCameraZoom(zoomDelta * opts.sensitivity);
			}
		}

		// Fine tune adjustments
		if (actions.onFineTuneIncrease && currentState.buttons.rt > 0.1 && previousState.buttons.rt <= 0.1) {
			actions.onFineTuneIncrease();
		}
		if (actions.onFineTuneDecrease && currentState.buttons.lt > 0.1 && previousState.buttons.lt <= 0.1) {
			actions.onFineTuneDecrease();
		}
	}, [opts.sensitivity]);

	const pollGamepad = useCallback(() => {
		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[0]; // Use first connected gamepad

		if (!gamepad || !gamepad.connected) {
			if (gamepadState.connected) {
				setGamepadState(prev => ({ ...prev, connected: false, controllerType: "Unknown" }));
			}
			return;
		}

		const currentState: GamepadState = {
			connected: true,
			controllerType: determineControllerType(gamepad),
			leftStick: {
				x: applyDeadzone(gamepad.axes[0] || 0),
				y: applyDeadzone(-(gamepad.axes[1] || 0)), // Invert Y for intuitive controls
			},
			rightStick: {
				x: applyDeadzone(gamepad.axes[2] || 0),
				y: applyDeadzone(-(gamepad.axes[3] || 0)), // Invert Y for intuitive controls
			},
			buttons: {
				a: gamepad.buttons[0]?.pressed || false,
				b: gamepad.buttons[1]?.pressed || false,
				x: gamepad.buttons[2]?.pressed || false,
				y: gamepad.buttons[3]?.pressed || false,
				lb: gamepad.buttons[4]?.pressed || false,
				rb: gamepad.buttons[5]?.pressed || false,
				lt: gamepad.buttons[6]?.value || 0,
				rt: gamepad.buttons[7]?.value || 0,
				select: gamepad.buttons[8]?.pressed || false,
				start: gamepad.buttons[9]?.pressed || false,
				leftStickBtn: gamepad.buttons[10]?.pressed || false,
				rightStickBtn: gamepad.buttons[11]?.pressed || false,
				dpadUp: gamepad.buttons[12]?.pressed || false,
				dpadDown: gamepad.buttons[13]?.pressed || false,
				dpadLeft: gamepad.buttons[14]?.pressed || false,
				dpadRight: gamepad.buttons[15]?.pressed || false,
			},
			axes: Array.from(gamepad.axes),
			timestamp: gamepad.timestamp,
		};

		// Handle button press events
		const previousState = previousStateRef.current;
		Object.entries(currentState.buttons).forEach(([buttonName, isPressed]) => {
			if (typeof isPressed === 'boolean') {
				const wasPressed = (previousState.buttons as any)[buttonName];
				handleButtonPress(buttonName as keyof GamepadState['buttons'], isPressed, wasPressed);
			}
		});

		// Handle analog inputs
		handleAnalogInputs(currentState, previousState);

		// Update state
		setGamepadState(currentState);
		previousStateRef.current = currentState;
	}, [gamepadState.connected, determineControllerType, applyDeadzone, handleButtonPress, handleAnalogInputs]);

	// Haptic feedback function
	const triggerHapticFeedback = useCallback((intensity: number = 0.5, duration: number = 100) => {
		if (!opts.enableHaptics || !gamepadState.connected) return;

		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[0];
		
		if (gamepad && 'vibrationActuator' in gamepad && gamepad.vibrationActuator) {
			(gamepad.vibrationActuator as any).playEffect?.('dual-rumble', {
				duration,
				strongMagnitude: intensity,
				weakMagnitude: intensity * 0.7,
			}).catch(() => {
				// Vibration not supported, fail silently
			});
		}
	}, [opts.enableHaptics, gamepadState.connected]);

	// Initialize polling and event listeners
	useEffect(() => {
		const handleGamepadConnected = (event: GamepadEvent) => {
			console.log(`🎮 Controller connected: ${event.gamepad.id}`);
			if (opts.enableHaptics) {
				triggerHapticFeedback(0.3, 200); // Welcome vibration
			}
		};

		const handleGamepadDisconnected = (event: GamepadEvent) => {
			console.log(`🎮 Controller disconnected: ${event.gamepad.id}`);
		};

		// Start polling
		pollingRef.current = window.setInterval(pollGamepad, opts.pollRate);

		// Add event listeners
		window.addEventListener('gamepadconnected', handleGamepadConnected);
		window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

		return () => {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
			}
			window.removeEventListener('gamepadconnected', handleGamepadConnected);
			window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
		};
	}, [pollGamepad, opts.pollRate, opts.enableHaptics, triggerHapticFeedback]);

	return {
		gamepadState,
		triggerHapticFeedback,
		isConnected: gamepadState.connected,
		controllerType: gamepadState.controllerType,
	};
} 