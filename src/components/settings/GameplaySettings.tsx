import React from "react";
import { Target, Eye, Map, MessageSquare, Save, Shield } from "lucide-react";

interface GameplaySettingsProps {
	settings: any;
	onChange: (setting: string, value: any) => void;
}

export default function GameplaySettings({ settings, onChange }: GameplaySettingsProps) {
	const difficulties = [
		{ value: "Easy", name: "Easy", description: "Relaxed gameplay" },
		{ value: "Normal", name: "Normal", description: "Balanced challenge" },
		{ value: "Hard", name: "Hard", description: "Increased difficulty" },
		{ value: "Extreme", name: "Extreme", description: "Maximum challenge" },
	];

	const checkpointFrequencies = [
		{ value: "Low", name: "Low", description: "Fewer checkpoints" },
		{ value: "Medium", name: "Medium", description: "Standard frequency" },
		{ value: "High", name: "High", description: "More checkpoints" },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
						<Target className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-white">Gameplay Settings</h2>
						<p className="text-sm text-slate-400">Configure game mechanics and behavior</p>
					</div>
				</div>
			</div>

			{/* Difficulty and Tutorial */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Shield className="w-5 h-5" />
						<span>Difficulty & Learning</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
							<select value={settings.difficulty} onChange={(e) => onChange("difficulty", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{difficulties.map((difficulty) => (
									<option key={difficulty.value} value={difficulty.value}>
										{difficulty.name} - {difficulty.description}
									</option>
								))}
							</select>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Tutorial Enabled</label>
							<button onClick={() => onChange("tutorialEnabled", !settings.tutorialEnabled)} className={`w-12 h-6 rounded-full transition-colors ${settings.tutorialEnabled ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.tutorialEnabled ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Hints Enabled</label>
							<button onClick={() => onChange("hintsEnabled", !settings.hintsEnabled)} className={`w-12 h-6 rounded-full transition-colors ${settings.hintsEnabled ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.hintsEnabled ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
					</div>
				</div>

				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Eye className="w-5 h-5" />
						<span>UI Elements</span>
					</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Objective Markers</label>
							<button onClick={() => onChange("objectiveMarkers", !settings.objectiveMarkers)} className={`w-12 h-6 rounded-full transition-colors ${settings.objectiveMarkers ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.objectiveMarkers ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Minimap</label>
							<button onClick={() => onChange("minimapEnabled", !settings.minimapEnabled)} className={`w-12 h-6 rounded-full transition-colors ${settings.minimapEnabled ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.minimapEnabled ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Damage Numbers</label>
							<button onClick={() => onChange("damageNumbers", !settings.damageNumbers)} className={`w-12 h-6 rounded-full transition-colors ${settings.damageNumbers ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.damageNumbers ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Kill Feed</label>
							<button onClick={() => onChange("killFeed", !settings.killFeed)} className={`w-12 h-6 rounded-full transition-colors ${settings.killFeed ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.killFeed ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Communication */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<MessageSquare className="w-5 h-5" />
					<span>Communication</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Chat Enabled</label>
						<button onClick={() => onChange("chatEnabled", !settings.chatEnabled)} className={`w-12 h-6 rounded-full transition-colors ${settings.chatEnabled ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.chatEnabled ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Profanity Filter</label>
						<button onClick={() => onChange("profanityFilter", !settings.profanityFilter)} className={`w-12 h-6 rounded-full transition-colors ${settings.profanityFilter ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.profanityFilter ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Save System */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Save className="w-5 h-5" />
					<span>Save System</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Auto Save</label>
						<button onClick={() => onChange("autoSave", !settings.autoSave)} className={`w-12 h-6 rounded-full transition-colors ${settings.autoSave ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.autoSave ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Quick Save</label>
						<button onClick={() => onChange("quickSave", !settings.quickSave)} className={`w-12 h-6 rounded-full transition-colors ${settings.quickSave ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.quickSave ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Checkpoint Frequency</label>
						<select value={settings.checkpointFrequency} onChange={(e) => onChange("checkpointFrequency", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
							{checkpointFrequencies.map((frequency) => (
								<option key={frequency.value} value={frequency.value}>
									{frequency.name} - {frequency.description}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Permadeath</label>
						<button onClick={() => onChange("permadeath", !settings.permadeath)} className={`w-12 h-6 rounded-full transition-colors ${settings.permadeath ? "bg-red-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.permadeath ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
