import React, { useState, useEffect } from "react";
import { Gamepad2, MousePointer, Keyboard, Target, Zap } from "lucide-react";

interface ControlsSettingsProps {
	settings: any;
	onChange: (setting: string, value: any) => void;
}

export default function ControlsSettings({ settings, onChange }: ControlsSettingsProps) {
	const [isListening, setIsListening] = useState<string | null>(null);
	const [gamepadConnected, setGamepadConnected] = useState(false);
	const [gamepadInfo, setGamepadInfo] = useState<any>(null);

	useEffect(() => {
		const checkGamepad = () => {
			const gamepads = navigator.getGamepads();
			const connected = gamepads.some((gp) => gp !== null);
			setGamepadConnected(connected);

			if (connected) {
				const gamepad = gamepads.find((gp) => gp !== null);
				if (gamepad) {
					setGamepadInfo({
						id: gamepad.id,
						axes: gamepad.axes.length,
						buttons: gamepad.buttons.length,
						mapping: gamepad.mapping,
					});
				}
			}
		};

		checkGamepad();
		const interval = setInterval(checkGamepad, 1000);
		return () => clearInterval(interval);
	}, []);

	const startListening = (key: string) => {
		setIsListening(key);
		// In a real implementation, you would set up event listeners here
		setTimeout(() => setIsListening(null), 3000); // Simulate listening
	};

	const keyBindings = [
		{ key: "moveForward", name: "Move Forward", default: "W" },
		{ key: "moveBackward", name: "Move Backward", default: "S" },
		{ key: "moveLeft", name: "Move Left", default: "A" },
		{ key: "moveRight", name: "Move Right", default: "D" },
		{ key: "jump", name: "Jump", default: "Space" },
		{ key: "crouch", name: "Crouch", default: "C" },
		{ key: "sprint", name: "Sprint", default: "Shift" },
		{ key: "interact", name: "Interact", default: "E" },
		{ key: "reload", name: "Reload", default: "R" },
		{ key: "fire", name: "Fire", default: "Mouse1" },
		{ key: "aim", name: "Aim", default: "Mouse2" },
		{ key: "melee", name: "Melee", default: "V" },
		{ key: "grenade", name: "Grenade", default: "G" },
		{ key: "map", name: "Map", default: "M" },
		{ key: "inventory", name: "Inventory", default: "I" },
		{ key: "pause", name: "Pause", default: "Escape" },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
						<Gamepad2 className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-white">Controls Settings</h2>
						<p className="text-sm text-slate-400">Configure input devices and key bindings</p>
					</div>
				</div>
			</div>

			{/* Gamepad Status */}
			{gamepadConnected && gamepadInfo && (
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Gamepad2 className="w-5 h-5 text-green-500" />
						<span>Gamepad Connected</span>
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<p className="text-sm text-slate-400">Device</p>
							<p className="text-white font-mono text-sm">{gamepadInfo.id}</p>
						</div>
						<div>
							<p className="text-sm text-slate-400">Axes</p>
							<p className="text-white font-mono text-sm">{gamepadInfo.axes}</p>
						</div>
						<div>
							<p className="text-sm text-slate-400">Buttons</p>
							<p className="text-white font-mono text-sm">{gamepadInfo.buttons}</p>
						</div>
						<div>
							<p className="text-sm text-slate-400">Mapping</p>
							<p className="text-white font-mono text-sm">{gamepadInfo.mapping || "Standard"}</p>
						</div>
					</div>
				</div>
			)}

			{/* Mouse Settings */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<MousePointer className="w-5 h-5" />
						<span>Mouse Settings</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Sensitivity</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="1" max="100" value={settings.mouseSensitivity} onChange={(e) => onChange("mouseSensitivity", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.mouseSensitivity}</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Mouse Acceleration</label>
							<button onClick={() => onChange("mouseAcceleration", !settings.mouseAcceleration)} className={`w-12 h-6 rounded-full transition-colors ${settings.mouseAcceleration ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.mouseAcceleration ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Invert Y-Axis</label>
							<button onClick={() => onChange("invertMouseY", !settings.invertMouseY)} className={`w-12 h-6 rounded-full transition-colors ${settings.invertMouseY ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.invertMouseY ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
					</div>
				</div>

				{/* Gamepad Settings */}
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Gamepad2 className="w-5 h-5" />
						<span>Gamepad Settings</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Sensitivity</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="1" max="100" value={settings.gamepadSensitivity} onChange={(e) => onChange("gamepadSensitivity", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.gamepadSensitivity}</span>
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Deadzone</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="0" max="50" value={settings.gamepadDeadzone} onChange={(e) => onChange("gamepadDeadzone", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.gamepadDeadzone}%</span>
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Keyboard Layout</label>
							<select value={settings.keyboardLayout} onChange={(e) => onChange("keyboardLayout", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								<option value="QWERTY">QWERTY</option>
								<option value="AZERTY">AZERTY</option>
								<option value="QWERTZ">QWERTZ</option>
								<option value="Custom">Custom</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Aim Assist Settings */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Target className="w-5 h-5" />
					<span>Aim Assist</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Enable Aim Assist</label>
						<button onClick={() => onChange("aimAssist", !settings.aimAssist)} className={`w-12 h-6 rounded-full transition-colors ${settings.aimAssist ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.aimAssist ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Aim Assist Strength</label>
						<div className="flex items-center space-x-3">
							<input type="range" min="0" max="100" value={settings.aimAssistStrength} onChange={(e) => onChange("aimAssistStrength", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
							<span className="text-sm font-medium text-slate-300 w-12">{settings.aimAssistStrength}%</span>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Auto Aim</label>
						<button onClick={() => onChange("autoAim", !settings.autoAim)} className={`w-12 h-6 rounded-full transition-colors ${settings.autoAim ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.autoAim ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Recoil Control</label>
						<button onClick={() => onChange("recoilControl", !settings.recoilControl)} className={`w-12 h-6 rounded-full transition-colors ${settings.recoilControl ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.recoilControl ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Key Bindings */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Keyboard className="w-5 h-5" />
					<span>Key Bindings</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{keyBindings.map((binding) => (
						<div key={binding.key} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
							<div>
								<p className="text-sm font-medium text-white">{binding.name}</p>
								<p className="text-xs text-slate-400">Default: {binding.default}</p>
							</div>
							<button onClick={() => startListening(binding.key)} className={`px-3 py-1 rounded text-sm font-medium transition-colors ${isListening === binding.key ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
								{isListening === binding.key ? "Press Key..." : settings.keyBindings[binding.key] || binding.default}
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
