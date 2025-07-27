import React, { useState } from "react";
import { Cpu, BarChart3, Thermometer, Zap, HardDrive, MemoryStick } from "lucide-react";

interface PerformanceSettingsProps {
	settings: any;
	onChange: (setting: string, value: any) => void;
	benchmarkResults: any;
	showBenchmark: boolean;
}

export default function PerformanceSettings({ settings, onChange, benchmarkResults, showBenchmark }: PerformanceSettingsProps) {
	const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);

	const performanceModes = [
		{ value: "Quality", name: "Quality", description: "Maximum visual fidelity" },
		{ value: "Balanced", name: "Balanced", description: "Optimal performance/quality" },
		{ value: "Performance", name: "Performance", description: "Maximum frame rate" },
		{ value: "Custom", name: "Custom", description: "Manual configuration" },
	];

	const cpuPriorities = [
		{ value: "Low", name: "Low", description: "Background priority" },
		{ value: "Normal", name: "Normal", description: "Standard priority" },
		{ value: "High", name: "High", description: "High priority" },
		{ value: "Real-time", name: "Real-time", description: "Maximum priority" },
	];

	const runBenchmark = async () => {
		setIsRunningBenchmark(true);
		// Simulate benchmark
		await new Promise((resolve) => setTimeout(resolve, 3000));
		setIsRunningBenchmark(false);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
						<Cpu className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-white">Performance Settings</h2>
						<p className="text-sm text-slate-400">Optimize game performance and system resources</p>
					</div>
				</div>
			</div>

			{/* Performance Mode */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Zap className="w-5 h-5" />
						<span>Performance Mode</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Performance Mode</label>
							<select value={settings.performanceMode} onChange={(e) => onChange("performanceMode", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{performanceModes.map((mode) => (
									<option key={mode.value} value={mode.value}>
										{mode.name} - {mode.description}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">FPS Limit</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="30" max="240" step="30" value={settings.fpsLimit} onChange={(e) => onChange("fpsLimit", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.fpsLimit} FPS</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">FPS Display</label>
							<button onClick={() => onChange("fpsDisplay", !settings.fpsDisplay)} className={`w-12 h-6 rounded-full transition-colors ${settings.fpsDisplay ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.fpsDisplay ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
					</div>
				</div>

				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Thermometer className="w-5 h-5" />
						<span>System Resources</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">GPU Memory Limit (GB)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="0" max="16" value={settings.gpuMemoryLimit} onChange={(e) => onChange("gpuMemoryLimit", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.gpuMemoryLimit === 0 ? "Unlimited" : `${settings.gpuMemoryLimit}GB`}</span>
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">CPU Priority</label>
							<select value={settings.cpuPriority} onChange={(e) => onChange("cpuPriority", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{cpuPriorities.map((priority) => (
									<option key={priority.value} value={priority.value}>
										{priority.name} - {priority.description}
									</option>
								))}
							</select>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Background Processes</label>
							<button onClick={() => onChange("backgroundProcesses", !settings.backgroundProcesses)} className={`w-12 h-6 rounded-full transition-colors ${settings.backgroundProcesses ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.backgroundProcesses ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Power Management */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Zap className="w-5 h-5" />
					<span>Power Management</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Power Saving</label>
						<button onClick={() => onChange("powerSaving", !settings.powerSaving)} className={`w-12 h-6 rounded-full transition-colors ${settings.powerSaving ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.powerSaving ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Thermal Throttling</label>
						<button onClick={() => onChange("thermalThrottling", !settings.thermalThrottling)} className={`w-12 h-6 rounded-full transition-colors ${settings.thermalThrottling ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.thermalThrottling ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Overclocking</label>
						<button onClick={() => onChange("overclocking", !settings.overclocking)} className={`w-12 h-6 rounded-full transition-colors ${settings.overclocking ? "bg-red-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.overclocking ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Benchmark Results */}
			{showBenchmark && (
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<BarChart3 className="w-5 h-5" />
						<span>Performance Benchmark</span>
					</h3>
					{isRunningBenchmark ? (
						<div className="text-center py-8">
							<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
							<p className="text-white font-medium">Running benchmark...</p>
							<p className="text-slate-400 text-sm">This may take a few minutes</p>
						</div>
					) : benchmarkResults ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="bg-slate-800/30 rounded-lg p-4">
								<div className="flex items-center space-x-2 mb-2">
									<Cpu className="w-4 h-4 text-blue-400" />
									<span className="text-sm font-medium text-slate-300">CPU Score</span>
								</div>
								<p className="text-2xl font-bold text-white">{benchmarkResults.cpuScore}</p>
							</div>
							<div className="bg-slate-800/30 rounded-lg p-4">
								<div className="flex items-center space-x-2 mb-2">
									<HardDrive className="w-4 h-4 text-green-400" />
									<span className="text-sm font-medium text-slate-300">GPU Score</span>
								</div>
								<p className="text-2xl font-bold text-white">{benchmarkResults.gpuScore}</p>
							</div>
							<div className="bg-slate-800/30 rounded-lg p-4">
								<div className="flex items-center space-x-2 mb-2">
									<MemoryStick className="w-4 h-4 text-purple-400" />
									<span className="text-sm font-medium text-slate-300">RAM Score</span>
								</div>
								<p className="text-2xl font-bold text-white">{benchmarkResults.ramScore}</p>
							</div>
							<div className="bg-slate-800/30 rounded-lg p-4">
								<div className="flex items-center space-x-2 mb-2">
									<BarChart3 className="w-4 h-4 text-yellow-400" />
									<span className="text-sm font-medium text-slate-300">Overall Score</span>
								</div>
								<p className="text-2xl font-bold text-white">{benchmarkResults.overallScore}</p>
							</div>
							<div className="bg-slate-800/30 rounded-lg p-4">
								<div className="flex items-center space-x-2 mb-2">
									<Zap className="w-4 h-4 text-orange-400" />
									<span className="text-sm font-medium text-slate-300">FPS</span>
								</div>
								<p className="text-2xl font-bold text-white">{benchmarkResults.fps}</p>
							</div>
							<div className="bg-slate-800/30 rounded-lg p-4">
								<div className="flex items-center space-x-2 mb-2">
									<Thermometer className="w-4 h-4 text-red-400" />
									<span className="text-sm font-medium text-slate-300">Recommended</span>
								</div>
								<p className="text-lg font-bold text-white">{benchmarkResults.recommendedQuality}</p>
							</div>
						</div>
					) : (
						<div className="text-center py-8">
							<button onClick={runBenchmark} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
								Run Benchmark
							</button>
							<p className="text-slate-400 text-sm mt-2">Test your system performance</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
