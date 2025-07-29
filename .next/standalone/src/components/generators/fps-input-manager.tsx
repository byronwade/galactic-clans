/**
 * @file fps-input-manager.tsx
 * @description Advanced Input Management System for FPS Exploration
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Implements:
 * - Mouse look with smooth interpolation
 * - WASD movement with momentum
 * - Gamepad support
 * - Customizable key bindings
 * - Input buffering and filtering
 */

"use client";

import React, { forwardRef, useImperativeHandle, useRef, useCallback, useEffect } from "react";
import type { FPSPlayerConfig } from "./fps-explorer-generator";

interface InputState {
	// Movement
	forward: boolean;
	backward: boolean;
	left: boolean;
	right: boolean;
	jump: boolean;
	crouch: boolean;
	run: boolean;

	// Mouse
	mouseX: number;
	mouseY: number;
	mouseDeltaX: number;
	mouseDeltaY: number;
	mousePressed: boolean;

	// Interaction
	interact: boolean;
	scan: boolean;
	sample: boolean;

	// UI
	menu: boolean;
	inventory: boolean;
}

interface KeyBindings {
	forward: string[];
	backward: string[];
	left: string[];
	right: string[];
	jump: string[];
	crouch: string[];
	run: string[];
	interact: string[];
	scan: string[];
	sample: string[];
	menu: string[];
	inventory: string[];
}

interface GamepadState {
	connected: boolean;
	leftStickX: number;
	leftStickY: number;
	rightStickX: number;
	rightStickY: number;
	buttons: boolean[];
}

export interface FPSInputManagerRef {
	enable: () => void;
	disable: () => void;
	getInputState: () => InputState;
	isGamepadConnected: () => boolean;
	setKeyBinding: (action: keyof KeyBindings, keys: string[]) => void;
	resetToDefaults: () => void;
}

interface FPSInputManagerProps {
	config: FPSPlayerConfig;
	enabled: boolean;
	onConfigChange: (updates: Partial<FPSPlayerConfig>) => void;
}

export const FPSInputManager = forwardRef<FPSInputManagerRef, FPSInputManagerProps>(({ config, enabled, onConfigChange }, ref) => {
	// State management
	const inputStateRef = useRef<InputState>({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false,
		crouch: false,
		run: false,
		mouseX: 0,
		mouseY: 0,
		mouseDeltaX: 0,
		mouseDeltaY: 0,
		mousePressed: false,
		interact: false,
		scan: false,
		sample: false,
		menu: false,
		inventory: false,
	});

	const keyBindingsRef = useRef<KeyBindings>({
		forward: ["KeyW", "ArrowUp"],
		backward: ["KeyS", "ArrowDown"],
		left: ["KeyA", "ArrowLeft"],
		right: ["KeyD", "ArrowRight"],
		jump: ["Space"],
		crouch: ["KeyC", "ControlLeft"],
		run: ["ShiftLeft"],
		interact: ["KeyE"],
		scan: ["KeyF"],
		sample: ["KeyR"],
		menu: ["Escape"],
		inventory: ["KeyI", "Tab"],
	});

	const gamepadStateRef = useRef<GamepadState>({
		connected: false,
		leftStickX: 0,
		leftStickY: 0,
		rightStickX: 0,
		rightStickY: 0,
		buttons: new Array(16).fill(false),
	});

	const enabledRef = useRef(enabled);
	const pointerLockedRef = useRef(false);
	const lastMouseXRef = useRef(0);
	const lastMouseYRef = useRef(0);

	// Input event handlers
	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (!enabledRef.current) return;

		const code = event.code;
		const bindings = keyBindingsRef.current;

		// Prevent default for game keys
		if (Object.values(bindings).flat().includes(code)) {
			event.preventDefault();
		}

		// Update input state
		Object.entries(bindings).forEach(([action, keys]) => {
			if (keys.includes(code)) {
				(inputStateRef.current as any)[action] = true;
			}
		});
	}, []);

	const handleKeyUp = useCallback((event: KeyboardEvent) => {
		if (!enabledRef.current) return;

		const code = event.code;
		const bindings = keyBindingsRef.current;

		// Update input state
		Object.entries(bindings).forEach(([action, keys]) => {
			if (keys.includes(code)) {
				(inputStateRef.current as any)[action] = false;
			}
		});
	}, []);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!enabledRef.current || !pointerLockedRef.current) return;

			const sensitivity = config.mouseSensitivity * 0.001;

			// Calculate mouse delta with sensitivity
			const deltaX = event.movementX * sensitivity;
			const deltaY = event.movementY * sensitivity;

			// Update input state
			inputStateRef.current.mouseDeltaX = deltaX;
			inputStateRef.current.mouseDeltaY = deltaY;
			inputStateRef.current.mouseX += deltaX;
			inputStateRef.current.mouseY += deltaY;

			// Clamp vertical look to prevent over-rotation
			inputStateRef.current.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, inputStateRef.current.mouseY));
		},
		[config.mouseSensitivity]
	);

	const handleMouseDown = useCallback((event: MouseEvent) => {
		if (!enabledRef.current) return;

		inputStateRef.current.mousePressed = true;

		// Request pointer lock on first click
		if (!pointerLockedRef.current) {
			document.body.requestPointerLock();
		}
	}, []);

	const handleMouseUp = useCallback((event: MouseEvent) => {
		if (!enabledRef.current) return;
		inputStateRef.current.mousePressed = false;
	}, []);

	const handlePointerLockChange = useCallback(() => {
		pointerLockedRef.current = document.pointerLockElement === document.body;
	}, []);

	const handleContextMenu = useCallback((event: Event) => {
		if (enabledRef.current) {
			event.preventDefault();
		}
	}, []);

	// Gamepad handling
	const updateGamepad = useCallback(() => {
		if (!enabledRef.current) return;

		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[0];

		if (gamepad) {
			const state = gamepadStateRef.current;
			state.connected = true;

			// Analog sticks with deadzone
			const deadzone = 0.1;
			state.leftStickX = Math.abs(gamepad.axes[0] || 0) > deadzone ? gamepad.axes[0] || 0 : 0;
			state.leftStickY = Math.abs(gamepad.axes[1] || 0) > deadzone ? -(gamepad.axes[1] || 0) : 0;
			state.rightStickX = Math.abs(gamepad.axes[2] || 0) > deadzone ? gamepad.axes[2] || 0 : 0;
			state.rightStickY = Math.abs(gamepad.axes[3] || 0) > deadzone ? -(gamepad.axes[3] || 0) : 0;

			// Buttons
			for (let i = 0; i < gamepad.buttons.length; i++) {
				state.buttons[i] = gamepad.buttons[i]?.pressed || false;
			}

			// Map gamepad inputs to movement
			const inputState = inputStateRef.current;

			// Movement (left stick)
			inputState.forward = state.leftStickY > 0.1 || state.buttons[12] || false; // DPad Up
			inputState.backward = state.leftStickY < -0.1 || state.buttons[13] || false; // DPad Down
			inputState.left = state.leftStickX < -0.1 || state.buttons[14] || false; // DPad Left
			inputState.right = state.leftStickX > 0.1 || state.buttons[15] || false; // DPad Right

			// Actions
			inputState.jump = state.buttons[0] || false; // A/X button
			inputState.crouch = state.buttons[1] || false; // B/Circle button
			inputState.run = state.buttons[7] || false; // Right trigger
			inputState.interact = state.buttons[2] || false; // X/Square button
			inputState.menu = state.buttons[9] || false; // Start/Options button

			// Mouse look (right stick)
			const lookSensitivity = config.mouseSensitivity * 0.05;
			inputState.mouseDeltaX = state.rightStickX * lookSensitivity;
			inputState.mouseDeltaY = state.rightStickY * lookSensitivity;
			inputState.mouseX += inputState.mouseDeltaX;
			inputState.mouseY += inputState.mouseDeltaY;

			// Clamp vertical look
			inputState.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, inputState.mouseY));
		} else {
			gamepadStateRef.current.connected = false;
		}
	}, [config.mouseSensitivity]);

	// Update enabled state
	useEffect(() => {
		enabledRef.current = enabled;
	}, [enabled]);

	// Enable/disable input
	const enable = useCallback(() => {
		enabledRef.current = true;

		// Add event listeners
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("pointerlockchange", handlePointerLockChange);
		document.addEventListener("contextmenu", handleContextMenu);

		// Request pointer lock
		document.body.requestPointerLock();

		console.log("🎮 [FPS] Input system enabled");
	}, [handleKeyDown, handleKeyUp, handleMouseMove, handleMouseDown, handleMouseUp, handlePointerLockChange, handleContextMenu]);

	const disable = useCallback(() => {
		enabledRef.current = false;

		// Remove event listeners
		document.removeEventListener("keydown", handleKeyDown);
		document.removeEventListener("keyup", handleKeyUp);
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mousedown", handleMouseDown);
		document.removeEventListener("mouseup", handleMouseUp);
		document.removeEventListener("pointerlockchange", handlePointerLockChange);
		document.removeEventListener("contextmenu", handleContextMenu);

		// Exit pointer lock
		if (document.pointerLockElement) {
			document.exitPointerLock();
		}

		// Reset input state
		Object.keys(inputStateRef.current).forEach((key) => {
			if (typeof (inputStateRef.current as any)[key] === "boolean") {
				(inputStateRef.current as any)[key] = false;
			}
		});

		console.log("🎮 [FPS] Input system disabled");
	}, [handleKeyDown, handleKeyUp, handleMouseMove, handleMouseDown, handleMouseUp, handlePointerLockChange, handleContextMenu]);

	// Gamepad polling
	useEffect(() => {
		if (!enabled) return;

		const interval = setInterval(updateGamepad, 16); // 60 FPS
		return () => clearInterval(interval);
	}, [enabled, updateGamepad]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			disable();
		};
	}, [disable]);

	// Expose ref methods
	useImperativeHandle(
		ref,
		() => ({
			enable,
			disable,
			getInputState: () => inputStateRef.current,
			isGamepadConnected: () => gamepadStateRef.current.connected,
			setKeyBinding: (action: keyof KeyBindings, keys: string[]) => {
				keyBindingsRef.current[action] = keys;
			},
			resetToDefaults: () => {
				keyBindingsRef.current = {
					forward: ["KeyW", "ArrowUp"],
					backward: ["KeyS", "ArrowDown"],
					left: ["KeyA", "ArrowLeft"],
					right: ["KeyD", "ArrowRight"],
					jump: ["Space"],
					crouch: ["KeyC", "ControlLeft"],
					run: ["ShiftLeft"],
					interact: ["KeyE"],
					scan: ["KeyF"],
					sample: ["KeyR"],
					menu: ["Escape"],
					inventory: ["KeyI", "Tab"],
				};
			},
		}),
		[enable, disable]
	);

	return null; // This component doesn't render anything
});
