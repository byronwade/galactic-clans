import React, { useState } from "react";
import { Monitor, Zap, Eye, Palette, Thermometer, HardDrive, MemoryStick, Cpu, BarChart3 } from "lucide-react";

interface GraphicsSettingsProps {
	settings: any;
	onChange: (setting: string, value: any) => void;
	systemInfo: any;
}

export default function GraphicsSettings({ settings, onChange, systemInfo }: GraphicsSettingsProps) {
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [showPresets, setShowPresets] = useState(false);

	const presets = [
		{ name: "Low", description: "Minimum requirements", icon: "🔴" },
		{ name: "Medium", description: "Balanced performance", icon: "🟡" },
		{ name: "High", description: "Recommended", icon: "🟢" },
		{ name: "Ultra", description: "Maximum quality", icon: "🔵" },
		{ name: "Custom", description: "Manual configuration", icon: "⚙️" },
	];

	const resolutions = ["1920x1080", "2560x1440", "3840x2160", "1280x720", "1600x900"];

	const refreshRates = [60, 75, 90, 120, 144, 165, 240];

	const qualityOptions = ["Low", "Medium", "High", "Ultra"];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-3">
					<div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
						<Monitor className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-white">Graphics Settings</h2>
						<p className="text-sm text-slate-400">Configure visual quality and performance</p>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<button onClick={() => setShowPresets(!showPresets)} className="px-4 py-2 text-sm text-white rounded-lg transition-colors bg-slate-800/50 hover:bg-slate-800/70">
						Presets
					</button>
					<button onClick={() => setShowAdvanced(!showAdvanced)} className="px-4 py-2 text-sm text-white rounded-lg transition-colors bg-slate-800/50 hover:bg-slate-800/70">
						{showAdvanced ? "Basic" : "Advanced"}
					</button>
				</div>
			</div>

			{/* Presets Panel */}
			{showPresets && (
				<div className="p-6 rounded-xl border backdrop-blur-xl bg-slate-900/40 border-slate-700/30">
					<h3 className="mb-4 text-lg font-semibold text-white">Quality Presets</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{presets.map((preset) => (
							<button
								key={preset.name}
								onClick={() => {
									onChange("quality", preset.name);
									setShowPresets(false);
								}}
								className={`p-4 rounded-lg border transition-all duration-200 text-left ${settings.quality === preset.name ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/50"}`}
							>
								<div className="flex items-center space-x-3">
									<span className="text-2xl">{preset.icon}</span>
									<div>
										<h4 className="font-semibold text-white">{preset.name}</h4>
										<p className="text-sm text-slate-400">{preset.description}</p>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{/* System Information */}
			{systemInfo && (
				<div className="p-6 rounded-xl border backdrop-blur-xl bg-slate-900/40 border-slate-700/30">
					<h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold text-white">
						<Cpu className="w-5 h-5" />
						<span>System Information</span>
					</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="space-y-2">
							<p className="text-sm text-slate-400">GPU</p>
							<p className="font-mono text-sm text-white">{systemInfo.gpu}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm text-slate-400">WebGL Support</p>
							<p className="font-mono text-sm text-white">{systemInfo.webgl2 ? "WebGL 2.0" : systemInfo.webgl ? "WebGL 1.0" : "Not Supported"}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm text-slate-400">Platform</p>
							<p className="font-mono text-sm text-white">{systemInfo.os}</p>
						</div>
					</div>
				</div>
			)}

			{/* Basic Settings */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Display Settings */}
				<div className="p-6 rounded-xl border backdrop-blur-xl bg-slate-900/40 border-slate-700/30">
					<h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold text-white">
						<Monitor className="w-5 h-5" />
						<span>Display</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="block mb-2 text-sm font-medium text-slate-300">Resolution</label>
							<select value={settings.resolution} onChange={(e) => onChange("resolution", e.target.value)} className="p-3 w-full text-white rounded-lg border bg-slate-800/80 border-slate-600/50">
								{resolutions.map((res) => (
									<option key={res} value={res}>
										{res}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-slate-300">Refresh Rate</label>
							<select value={settings.refreshRate} onChange={(e) => onChange("refreshRate", parseInt(e.target.value))} className="p-3 w-full text-white rounded-lg border bg-slate-800/80 border-slate-600/50">
								{refreshRates.map((rate) => (
									<option key={rate} value={rate}>
										{rate} Hz
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-slate-300">Field of View</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="60" max="120" value={settings.fieldOfView} onChange={(e) => onChange("fieldOfView", parseInt(e.target.value))} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-700" />
								<span className="w-12 text-sm font-medium text-slate-300">{settings.fieldOfView}°</span>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<label className="text-sm font-medium text-slate-300">V-Sync</label>
							<button onClick={() => onChange("vsync", !settings.vsync)} className={`w-12 h-6 rounded-full transition-colors ${settings.vsync ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.vsync ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
					</div>
				</div>

				{/* Quality Settings */}
				<div className="p-6 rounded-xl border backdrop-blur-xl bg-slate-900/40 border-slate-700/30">
					<h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold text-white">
						<Palette className="w-5 h-5" />
						<span>Quality</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="block mb-2 text-sm font-medium text-slate-300">Anti-Aliasing</label>
							<select value={settings.antiAliasing} onChange={(e) => onChange("antiAliasing", e.target.value)} className="p-3 w-full text-white rounded-lg border bg-slate-800/80 border-slate-600/50">
								<option value="Off">Off</option>
								<option value="FXAA">FXAA</option>
								<option value="SMAA">SMAA</option>
								<option value="MSAA 2x">MSAA 2x</option>
								<option value="MSAA 4x">MSAA 4x</option>
								<option value="MSAA 8x">MSAA 8x</option>
							</select>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-slate-300">Texture Quality</label>
							<select value={settings.textureQuality} onChange={(e) => onChange("textureQuality", e.target.value)} className="p-3 w-full text-white rounded-lg border bg-slate-800/80 border-slate-600/50">
								{qualityOptions.map((quality) => (
									<option key={quality} value={quality}>
										{quality}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-slate-300">Shadow Quality</label>
							<select value={settings.shadowQuality} onChange={(e) => onChange("shadowQuality", e.target.value)} className="p-3 w-full text-white rounded-lg border bg-slate-800/80 border-slate-600/50">
								{qualityOptions.map((quality) => (
									<option key={quality} value={quality}>
										{quality}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-slate-300">Particle Quality</label>
							<select value={settings.particleQuality} onChange={(e) => onChange("particleQuality", e.target.value)} className="p-3 w-full text-white rounded-lg border bg-slate-800/80 border-slate-600/50">
								{qualityOptions.map((quality) => (
									<option key={quality} value={quality}>
										{quality}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Advanced Settings */}
			{showAdvanced && (
				<div className="p-6 rounded-xl border backdrop-blur-xl bg-slate-900/40 border-slate-700/30">
					<h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold text-white">
						<Zap className="w-5 h-5" />
						<span>Advanced Graphics</span>
					</h3>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<label className="text-sm font-medium text-slate-300">Ambient Occlusion</label>
								<button onClick={() => onChange("ambientOcclusion", !settings.ambientOcclusion)} className={`w-12 h-6 rounded-full transition-colors ${settings.ambientOcclusion ? "bg-blue-500" : "bg-slate-700"}`}>
									<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.ambientOcclusion ? "transform translate-x-6" : "transform translate-x-1"}`} />
								</button>
							</div>
							<div className="flex justify-between items-center">
								<label className="text-sm font-medium text-slate-300">Motion Blur</label>
								<button onClick={() => onChange("motionBlur", !settings.motionBlur)} className={`w-12 h-6 rounded-full transition-colors ${settings.motionBlur ? "bg-blue-500" : "bg-slate-700"}`}>
									<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.motionBlur ? "transform translate-x-6" : "transform translate-x-1"}`} />
								</button>
							</div>
							<div className="flex justify-between items-center">
								<label className="text-sm font-medium text-slate-300">Depth of Field</label>
								<button onClick={() => onChange("depthOfField", !settings.depthOfField)} className={`w-12 h-6 rounded-full transition-colors ${settings.depthOfField ? "bg-blue-500" : "bg-slate-700"}`}>
									<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.depthOfField ? "transform translate-x-6" : "transform translate-x-1"}`} />
								</button>
							</div>
							<div className="flex justify-between items-center">
								<label className="text-sm font-medium text-slate-300">Ray Tracing</label>
								<button onClick={() => onChange("rayTracing", !settings.rayTracing)} className={`w-12 h-6 rounded-full transition-colors ${settings.rayTracing ? "bg-blue-500" : "bg-slate-700"}`}>
									<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.rayTracing ? "transform translate-x-6" : "transform translate-x-1"}`} />
								</button>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<label className="text-sm font-medium text-slate-300">DLSS</label>
								<button onClick={() => onChange("dlss", !settings.dlss)} className={`w-12 h-6 rounded-full transition-colors ${settings.dlss ? "bg-blue-500" : "bg-slate-700"}`}>
									<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.dlss ? "transform translate-x-6" : "transform translate-x-1"}`} />
								</button>
							</div>
							<div className="flex justify-between items-center">
								<label className="text-sm font-medium text-slate-300">FSR</label>
								<button onClick={() => onChange("fsr", !settings.fsr)} className={`w-12 h-6 rounded-full transition-colors ${settings.fsr ? "bg-blue-500" : "bg-slate-700"}`}>
									<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.fsr ? "transform translate-x-6" : "transform translate-x-1"}`} />
								</button>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-slate-300">Brightness</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0" max="100" value={settings.brightness} onChange={(e) => onChange("brightness", parseInt(e.target.value))} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-700" />
									<span className="w-12 text-sm font-medium text-slate-300">{settings.brightness}%</span>
								</div>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-slate-300">Contrast</label>
								<div className="flex items-center space-x-3">
									<input type="range" min="0" max="100" value={settings.contrast} onChange={(e) => onChange("contrast", parseInt(e.target.value))} className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-700" />
									<span className="w-12 text-sm font-medium text-slate-300">{settings.contrast}%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
