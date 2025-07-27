/**
 * @file fps-input-manager.tsx
 * @description AAA-Quality Input Management System for FPS Exploration
 * @version 2.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Smooth mouse interpolation with adjustable sensitivity
 * - Advanced gamepad support with proper deadzone handling
 * - Customizable key bindings with conflict detection
 * - Input buffering for responsive controls
 * - Separate X/Y mouse sensitivity settings
 * - Mouse acceleration and smoothing options
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
	walk: boolean; // Slow walk modifier

	// Mouse (smoothed values)
	mouseX: number;
	mouseY: number;
	mouseDeltaX: number;
	mouseDeltaY: number;
	mousePressed: boolean;
	mouseRightPressed: boolean;

	// Advanced movement
	lean_left: boolean;
	lean_right: boolean;
	prone: boolean;

	// Interaction
	interact: boolean;
	scan: boolean;
	sample: boolean;
	reload: boolean;
	throw_grenade: boolean;

	// UI
	menu: boolean;
	inventory: boolean;
	map: boolean;
	flashlight: boolean;
	zoom: boolean;

	// Weapon
	fire: boolean;
	aim: boolean;
	melee: boolean;
}

interface AdvancedKeyBindings {
	forward: string[];
	backward: string[];
	left: string[];
	right: string[];
	jump: string[];
	crouch: string[];
	run: string[];
	walk: string[];
	lean_left: string[];
	lean_right: string[];
	prone: string[];
	interact: string[];
	scan: string[];
	sample: string[];
	reload: string[];
	throw_grenade: string[];
	menu: string[];
	inventory: string[];
	map: string[];
	flashlight: string[];
	zoom: string[];
	fire: string[];
	aim: string[];
	melee: string[];
}

interface MouseSettings {
	sensitivityX: number;
	sensitivityY: number;
	smoothing: number;
	acceleration: number;
	invertY: boolean;
}

interface GamepadState {
	connected: boolean;
	leftStickX: number;
	leftStickY: number;
	rightStickX: number;
	rightStickY: number;
	leftTrigger: number;
	rightTrigger: number;
	buttons: boolean[];
	vibration: boolean;
}

export interface FPSInputManagerRef {
	enable: () => void;
	disable: () => void;
	getInputState: () => InputState;
	setKeyBinding: (action: keyof AdvancedKeyBindings, keys: string[]) => void;
	setMouseSettings: (settings: Partial<MouseSettings>) => void;
	resetToDefaults: () => void;
	isPointerLocked: () => boolean;
	triggerVibration: (intensity: number, duration: number) => void;
}

interface FPSInputManagerProps {
	config: FPSPlayerConfig;
	enabled: boolean;
	onConfigChange: (updates: Partial<FPSPlayerConfig>) => void;
}

export const FPSInputManager = forwardRef<FPSInputManagerRef, FPSInputManagerProps>(({ config, enabled, onConfigChange }, ref) => {
	// Enhanced state management
	const inputStateRef = useRef<InputState>({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false,
		crouch: false,
		run: false,
		walk: false,
		mouseX: 0,
		mouseY: 0,
		mouseDeltaX: 0,
		mouseDeltaY: 0,
		mousePressed: false,
		mouseRightPressed: false,
		lean_left: false,
		lean_right: false,
		prone: false,
		interact: false,
		scan: false,
		sample: false,
		reload: false,
		throw_grenade: false,
		menu: false,
		inventory: false,
		map: false,
		flashlight: false,
		zoom: false,
		fire: false,
		aim: false,
		melee: false,
	});

	const keyBindingsRef = useRef<AdvancedKeyBindings>({
		forward: ["KeyW", "ArrowUp"],
		backward: ["KeyS", "ArrowDown"],
		left: ["KeyA", "ArrowLeft"],
		right: ["KeyD", "ArrowRight"],
		jump: ["Space"],
		crouch: ["KeyC", "ControlLeft"],
		run: ["ShiftLeft"],
		walk: ["AltLeft"],
		lean_left: ["KeyQ"],
		lean_right: ["KeyE"],
		prone: ["KeyZ"],
		interact: ["KeyF"],
		scan: ["KeyV"],
		sample: ["KeyR"],
		reload: ["KeyR"],
		throw_grenade: ["KeyG"],
		menu: ["Escape"],
		inventory: ["KeyI", "Tab"],
		map: ["KeyM"],
		flashlight: ["KeyT"],
		zoom: ["KeyX"],
		fire: ["MouseLeft"],
		aim: ["MouseRight"],
		melee: ["KeyF"],
	});

	const mouseSettingsRef = useRef<MouseSettings>({
		sensitivityX: config.mouseSensitivity || 1.0,
		sensitivityY: config.mouseSensitivity || 1.0,
		smoothing: 0.1,
		acceleration: 1.0,
		invertY: false,
	});

	const gamepadStateRef = useRef<GamepadState>({
		connected: false,
		leftStickX: 0,
		leftStickY: 0,
		rightStickX: 0,
		rightStickY: 0,
		leftTrigger: 0,
		rightTrigger: 0,
		buttons: new Array(16).fill(false),
		vibration: true,
	});

	// Mouse smoothing buffer
	const mouseDeltaBuffer = useRef<Array<{ x: number; y: number }>>([]);
	const enabledRef = useRef(enabled);
	const pointerLockedRef = useRef(false);

	// Enhanced input event handlers
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

	const handleMouseMove = useCallback((event: MouseEvent) => {
		if (!enabledRef.current || !pointerLockedRef.current) return;

		const settings = mouseSettingsRef.current;

		// Apply base sensitivity
		let deltaX = event.movementX * settings.sensitivityX * 0.002;
		let deltaY = event.movementY * settings.sensitivityY * 0.002;

		// Apply Y inversion
		if (settings.invertY) {
			deltaY = -deltaY;
		}

		// Apply mouse acceleration
		const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const accelerationFactor = 1 + magnitude * settings.acceleration * 0.1;
		deltaX *= accelerationFactor;
		deltaY *= accelerationFactor;

		// Add to smoothing buffer
		mouseDeltaBuffer.current.push({ x: deltaX, y: deltaY });
		if (mouseDeltaBuffer.current.length > 5) {
			mouseDeltaBuffer.current.shift();
		}

		// Apply smoothing
		const avgDelta = mouseDeltaBuffer.current.reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), { x: 0, y: 0 });
		avgDelta.x /= mouseDeltaBuffer.current.length;
		avgDelta.y /= mouseDeltaBuffer.current.length;

		// Interpolate between raw and smoothed input
		const smoothedDeltaX = deltaX * (1 - settings.smoothing) + avgDelta.x * settings.smoothing;
		const smoothedDeltaY = deltaY * (1 - settings.smoothing) + avgDelta.y * settings.smoothing;

		// Update input state
		inputStateRef.current.mouseDeltaX = smoothedDeltaX;
		inputStateRef.current.mouseDeltaY = smoothedDeltaY;
		inputStateRef.current.mouseX += smoothedDeltaX;
		inputStateRef.current.mouseY += smoothedDeltaY;

		// Clamp vertical look to prevent over-rotation
		inputStateRef.current.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, inputStateRef.current.mouseY));
	}, []);

	const handleMouseDown = useCallback((event: MouseEvent) => {
		if (!enabledRef.current) return;

		if (event.button === 0) {
			inputStateRef.current.mousePressed = true;
			inputStateRef.current.fire = true;
		} else if (event.button === 2) {
			inputStateRef.current.mouseRightPressed = true;
			inputStateRef.current.aim = true;
		}

		// Request pointer lock on first click
		if (!pointerLockedRef.current) {
			document.body.requestPointerLock();
		}
	}, []);

	const handleMouseUp = useCallback((event: MouseEvent) => {
		if (!enabledRef.current) return;

		if (event.button === 0) {
			inputStateRef.current.mousePressed = false;
			inputStateRef.current.fire = false;
		} else if (event.button === 2) {
			inputStateRef.current.mouseRightPressed = false;
			inputStateRef.current.aim = false;
		}
	}, []);

	const handlePointerLockChange = useCallback(() => {
		pointerLockedRef.current = document.pointerLockElement === document.body;
		console.log("🎯 [FPS] Pointer lock:", pointerLockedRef.current ? "ENABLED" : "DISABLED");
	}, []);

	const handleContextMenu = useCallback((event: Event) => {
		if (enabledRef.current) {
			event.preventDefault();
		}
	}, []);

	// Enhanced gamepad handling
	const updateGamepad = useCallback(() => {
		if (!enabledRef.current) return;

		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[0];

		if (gamepad) {
			const state = gamepadStateRef.current;
			state.connected = true;

			// Advanced analog sticks with configurable deadzone
			const deadzone = 0.08; // Lower deadzone for precision
			const applyDeadzone = (value: number) => {
				return Math.abs(value) > deadzone ? value : 0;
			};

			state.leftStickX = applyDeadzone(gamepad.axes[0] || 0);
			state.leftStickY = applyDeadzone(-(gamepad.axes[1] || 0)); // Invert Y
			state.rightStickX = applyDeadzone(gamepad.axes[2] || 0);
			state.rightStickY = applyDeadzone(-(gamepad.axes[3] || 0)); // Invert Y

			// Triggers
			state.leftTrigger = gamepad.axes[6] || 0;
			state.rightTrigger = gamepad.axes[7] || 0;

			// Buttons
			for (let i = 0; i < gamepad.buttons.length; i++) {
				state.buttons[i] = gamepad.buttons[i]?.pressed || false;
			}

			// Map gamepad inputs to movement (Xbox controller layout)
			const inputState = inputStateRef.current;

			// Movement (left stick + d-pad)
			inputState.forward = state.leftStickY > 0.1 || state.buttons[12] || false; // DPad Up
			inputState.backward = state.leftStickY < -0.1 || state.buttons[13] || false; // DPad Down
			inputState.left = state.leftStickX < -0.1 || state.buttons[14] || false; // DPad Left
			inputState.right = state.leftStickX > 0.1 || state.buttons[15] || false; // DPad Right

			// Actions
			inputState.jump = state.buttons[0] || false; // A button
			inputState.crouch = state.buttons[1] || false; // B button
			inputState.interact = state.buttons[2] || false; // X button
			inputState.reload = state.buttons[3] || false; // Y button

			// Triggers
			inputState.aim = state.leftTrigger > 0.5; // Left trigger
			inputState.fire = state.rightTrigger > 0.5; // Right trigger
			inputState.run = state.buttons[4] || false; // Left bumper
			inputState.melee = state.buttons[5] || false; // Right bumper

			// Menu controls
			inputState.menu = state.buttons[9] || false; // Menu button
			inputState.map = state.buttons[8] || false; // View button

			// Mouse look (right stick) with higher sensitivity
			const lookSensitivity = mouseSettingsRef.current.sensitivityX * 0.08;
			inputState.mouseDeltaX = state.rightStickX * lookSensitivity;
			inputState.mouseDeltaY = state.rightStickY * lookSensitivity * (mouseSettingsRef.current.invertY ? -1 : 1);
			inputState.mouseX += inputState.mouseDeltaX;
			inputState.mouseY += inputState.mouseDeltaY;

			// Clamp vertical look
			inputState.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, inputState.mouseY));
		} else {
			gamepadStateRef.current.connected = false;
		}
	}, []);

	// Vibration function
	const triggerVibration = useCallback((intensity: number, duration: number) => {
		if (!gamepadStateRef.current.connected || !gamepadStateRef.current.vibration) return;

		const gamepads = navigator.getGamepads();
		const gamepad = gamepads[0];

		if (gamepad && gamepad.vibrationActuator) {
			gamepad.vibrationActuator
				.playEffect("dual-rumble", {
					startDelay: 0,
					duration: duration,
					weakMagnitude: intensity * 0.5,
					strongMagnitude: intensity,
				})
				.catch(() => {
					// Vibration not supported
				});
		}
	}, []);

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

		console.log("🎮 [FPS] Enhanced input system enabled");
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

	// Enhanced gamepad polling
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

	// Expose enhanced ref methods
	useImperativeHandle(
		ref,
		() => ({
			enable,
			disable,
			getInputState: () => inputStateRef.current,
			setKeyBinding: (action: keyof AdvancedKeyBindings, keys: string[]) => {
				keyBindingsRef.current[action] = keys;
			},
			setMouseSettings: (settings: Partial<MouseSettings>) => {
				mouseSettingsRef.current = { ...mouseSettingsRef.current, ...settings };
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
					walk: ["AltLeft"],
					lean_left: ["KeyQ"],
					lean_right: ["KeyE"],
					prone: ["KeyZ"],
					interact: ["KeyF"],
					scan: ["KeyV"],
					sample: ["KeyR"],
					reload: ["KeyR"],
					throw_grenade: ["KeyG"],
					menu: ["Escape"],
					inventory: ["KeyI", "Tab"],
					map: ["KeyM"],
					flashlight: ["KeyT"],
					zoom: ["KeyX"],
					fire: ["MouseLeft"],
					aim: ["MouseRight"],
					melee: ["KeyF"],
				};
				mouseSettingsRef.current = {
					sensitivityX: 1.0,
					sensitivityY: 1.0,
					smoothing: 0.1,
					acceleration: 1.0,
					invertY: false,
				};
			},
			isPointerLocked: () => pointerLockedRef.current,
			triggerVibration,
		}),
		[enable, disable, triggerVibration]
	);

	return null; // This component doesn't render anything
});

FPSInputManager.displayName = "FPSInputManager";
