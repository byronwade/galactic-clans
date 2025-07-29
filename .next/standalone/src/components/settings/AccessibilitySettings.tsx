import React, { useState } from "react";
import { Accessibility, Eye, EyeOff, Volume2, VolumeX, Palette, Zap } from "lucide-react";

interface AccessibilitySettingsProps {
	settings: any;
	onChange: (setting: string, value: any) => void;
}

export default function AccessibilitySettings({ settings, onChange }: AccessibilitySettingsProps) {
	const [showColorPreview, setShowColorPreview] = useState(false);

	const colorBlindModes = [
		{ value: "Off", name: "Normal Vision", description: "Standard color scheme" },
		{ value: "Protanopia", name: "Protanopia", description: "Red-green color blindness (red deficiency)" },
		{ value: "Deuteranopia", name: "Deuteranopia", description: "Red-green color blindness (green deficiency)" },
		{ value: "Tritanopia", name: "Tritanopia", description: "Blue-yellow color blindness" },
		{ value: "Monochromacy", name: "Monochromacy", description: "Complete color blindness" },
	];

	const subtitleSizes = [
		{ value: "Small", name: "Small", description: "Compact text" },
		{ value: "Medium", name: "Medium", description: "Standard size" },
		{ value: "Large", name: "Large", description: "Easy to read" },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
						<Accessibility className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-white">Accessibility Settings</h2>
						<p className="text-sm text-slate-400">Make the game accessible to all players</p>
					</div>
				</div>
			</div>

			{/* Visual Accessibility */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Color Blind Support */}
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Palette className="w-5 h-5" />
						<span>Color Blind Support</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Color Blind Mode</label>
							<select value={settings.colorBlindMode} onChange={(e) => onChange("colorBlindMode", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{colorBlindModes.map((mode) => (
									<option key={mode.value} value={mode.value}>
										{mode.name} - {mode.description}
									</option>
								))}
							</select>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">High Contrast Mode</label>
							<button onClick={() => onChange("highContrast", !settings.highContrast)} className={`w-12 h-6 rounded-full transition-colors ${settings.highContrast ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.highContrast ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Large Text</label>
							<button onClick={() => onChange("largeText", !settings.largeText)} className={`w-12 h-6 rounded-full transition-colors ${settings.largeText ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.largeText ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Text Scale</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="50" max="200" value={settings.textScale} onChange={(e) => onChange("textScale", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.textScale}%</span>
							</div>
						</div>
					</div>
				</div>

				{/* Audio Accessibility */}
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Volume2 className="w-5 h-5" />
						<span>Audio Accessibility</span>
					</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Screen Reader</label>
							<button onClick={() => onChange("screenReader", !settings.screenReader)} className={`w-12 h-6 rounded-full transition-colors ${settings.screenReader ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.screenReader ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Subtitles</label>
							<button onClick={() => onChange("subtitles", !settings.subtitles)} className={`w-12 h-6 rounded-full transition-colors ${settings.subtitles ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.subtitles ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Closed Captions</label>
							<button onClick={() => onChange("closedCaptions", !settings.closedCaptions)} className={`w-12 h-6 rounded-full transition-colors ${settings.closedCaptions ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.closedCaptions ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Subtitle Size</label>
							<select value={settings.subtitleSize} onChange={(e) => onChange("subtitleSize", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{subtitleSizes.map((size) => (
									<option key={size.value} value={size.value}>
										{size.name} - {size.description}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Motion and Flashing */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Zap className="w-5 h-5" />
					<span>Motion & Flashing</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Reduced Motion</label>
						<button onClick={() => onChange("reducedMotion", !settings.reducedMotion)} className={`w-12 h-6 rounded-full transition-colors ${settings.reducedMotion ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.reducedMotion ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Reduced Flashing</label>
						<button onClick={() => onChange("reducedFlashing", !settings.reducedFlashing)} className={`w-12 h-6 rounded-full transition-colors ${settings.reducedFlashing ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.reducedFlashing ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Input Accessibility */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Accessibility className="w-5 h-5" />
					<span>Input Accessibility</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">One Handed Mode</label>
						<button onClick={() => onChange("oneHandedMode", !settings.oneHandedMode)} className={`w-12 h-6 rounded-full transition-colors ${settings.oneHandedMode ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.oneHandedMode ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Voice Commands</label>
						<button onClick={() => onChange("voiceCommands", !settings.voiceCommands)} className={`w-12 h-6 rounded-full transition-colors ${settings.voiceCommands ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.voiceCommands ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Gesture Controls</label>
						<button onClick={() => onChange("gestureControls", !settings.gestureControls)} className={`w-12 h-6 rounded-full transition-colors ${settings.gestureControls ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.gestureControls ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Limited Keys Mode</label>
						<button onClick={() => onChange("limitedKeysMode", !settings.limitedKeysMode)} className={`w-12 h-6 rounded-full transition-colors ${settings.limitedKeysMode ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.limitedKeysMode ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Remap Keys</label>
						<button onClick={() => onChange("remapKeys", !settings.remapKeys)} className={`w-12 h-6 rounded-full transition-colors ${settings.remapKeys ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.remapKeys ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Subtitle Customization */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Eye className="w-5 h-5" />
					<span>Subtitle Customization</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Text Color</label>
						<input type="color" value={settings.subtitleColor} onChange={(e) => onChange("subtitleColor", e.target.value)} className="w-full h-12 bg-slate-800/80 border border-slate-600/50 rounded-lg cursor-pointer" />
					</div>
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Background Color</label>
						<input type="color" value={settings.subtitleBackground} onChange={(e) => onChange("subtitleBackground", e.target.value)} className="w-full h-12 bg-slate-800/80 border border-slate-600/50 rounded-lg cursor-pointer" />
					</div>
					<div className="col-span-2">
						<label className="text-sm font-medium text-slate-300 mb-2 block">Preview</label>
						<div
							className="p-4 rounded-lg text-center"
							style={{
								backgroundColor: settings.subtitleBackground,
								color: settings.subtitleColor,
								fontSize: settings.subtitleSize === "Large" ? "1.2rem" : settings.subtitleSize === "Small" ? "0.9rem" : "1rem",
							}}
						>
							Sample subtitle text
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
