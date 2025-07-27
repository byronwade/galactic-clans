import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Volume1, Headphones, Speaker, Mic, Wifi } from "lucide-react";

interface AudioSettingsProps {
	settings: any;
	onChange: (setting: string, value: any) => void;
}

export default function AudioSettings({ settings, onChange }: AudioSettingsProps) {
	const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
	const [isTestingAudio, setIsTestingAudio] = useState(false);
	const [availableDevices, setAvailableDevices] = useState<any[]>([]);

	useEffect(() => {
		// Initialize audio context
		const initAudio = async () => {
			try {
				const context = new (window.AudioContext || (window as any).webkitAudioContext)();
				setAudioContext(context);
			} catch (error) {
				console.log("Audio context not supported");
			}
		};

		initAudio();

		// Get available audio devices
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					const audioDevices = devices.filter((device) => device.kind === "audioinput" || device.kind === "audiooutput");
					setAvailableDevices(audioDevices);
				})
				.catch((error) => console.log("Error getting devices:", error));
		}
	}, []);

	const testAudio = async (type: string) => {
		if (!audioContext) return;

		setIsTestingAudio(true);
		try {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			// Set frequency based on audio type
			switch (type) {
				case "master":
					oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
					break;
				case "sfx":
					oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
					break;
				case "music":
					oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
					break;
				case "voice":
					oscillator.frequency.setValueAtTime(660, audioContext.currentTime); // E5 note
					break;
				default:
					oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
			}

			// Set volume based on settings
			const volume = settings[`${type}Volume`] / 100;
			gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

			oscillator.start();
			setTimeout(() => {
				oscillator.stop();
				setIsTestingAudio(false);
			}, 1000);
		} catch (error) {
			console.error("Audio test failed:", error);
			setIsTestingAudio(false);
		}
	};

	const getVolumeIcon = (volume: number) => {
		if (volume === 0) return <VolumeX className="w-4 h-4" />;
		if (volume < 33) return <Volume1 className="w-4 h-4" />;
		if (volume < 66) return <Volume2 className="w-4 h-4" />;
		return <Volume2 className="w-4 h-4" />;
	};

	const audioTypes = [
		{ key: "master", name: "Master Volume", icon: Volume2, color: "from-green-500 to-emerald-500" },
		{ key: "sfx", name: "Sound Effects", icon: Speaker, color: "from-blue-500 to-cyan-500" },
		{ key: "music", name: "Music", icon: Headphones, color: "from-purple-500 to-pink-500" },
		{ key: "voice", name: "Voice", icon: Mic, color: "from-orange-500 to-red-500" },
		{ key: "ambient", name: "Ambient", icon: Volume1, color: "from-teal-500 to-blue-500" },
		{ key: "voiceChat", name: "Voice Chat", icon: Wifi, color: "from-indigo-500 to-purple-500" },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
						<Volume2 className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-white">Audio Settings</h2>
						<p className="text-sm text-slate-400">Configure sound and voice chat</p>
					</div>
				</div>
			</div>

			{/* Volume Controls */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{audioTypes.map((audioType) => {
					const Icon = audioType.icon;
					return (
						<div key={audioType.key} className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-3">
									<div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${audioType.color} flex items-center justify-center`}>
										<Icon className="w-4 h-4 text-white" />
									</div>
									<div>
										<h3 className="font-semibold text-white">{audioType.name}</h3>
										<p className="text-sm text-slate-400">{settings[`${audioType.key}Volume`]}%</p>
									</div>
								</div>
								<button onClick={() => testAudio(audioType.key)} disabled={isTestingAudio || !audioContext} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors disabled:opacity-50" title="Test Audio">
									{isTestingAudio ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : getVolumeIcon(settings[`${audioType.key}Volume`])}
								</button>
							</div>
							<div className="flex items-center space-x-3">
								<input type="range" min="0" max="100" value={settings[`${audioType.key}Volume`]} onChange={(e) => onChange(`${audioType.key}Volume`, parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings[`${audioType.key}Volume`]}%</span>
							</div>
						</div>
					);
				})}
			</div>

			{/* Audio Configuration */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Audio Devices */}
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Speaker className="w-5 h-5" />
						<span>Audio Devices</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Output Device</label>
							<select value={settings.audioDevice} onChange={(e) => onChange("audioDevice", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								<option value="Default">Default</option>
								{availableDevices
									.filter((device) => device.kind === "audiooutput")
									.map((device, index) => (
										<option key={index} value={device.deviceId}>
											{device.label || `Audio Output ${index + 1}`}
										</option>
									))}
							</select>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Voice Chat Device</label>
							<select value={settings.voiceChatDevice} onChange={(e) => onChange("voiceChatDevice", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								<option value="Default">Default</option>
								{availableDevices
									.filter((device) => device.kind === "audioinput")
									.map((device, index) => (
										<option key={index} value={device.deviceId}>
											{device.label || `Microphone ${index + 1}`}
										</option>
									))}
							</select>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Audio Quality</label>
							<select value={settings.audioQuality} onChange={(e) => onChange("audioQuality", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								<option value="Low">Low (22kHz)</option>
								<option value="Medium">Medium (44kHz)</option>
								<option value="High">High (48kHz)</option>
								<option value="Ultra">Ultra (96kHz)</option>
							</select>
						</div>
					</div>
				</div>

				{/* Voice Chat Settings */}
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Mic className="w-5 h-5" />
						<span>Voice Chat</span>
					</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Enable Voice Chat</label>
							<button onClick={() => onChange("voiceChatEnabled", !settings.voiceChatEnabled)} className={`w-12 h-6 rounded-full transition-colors ${settings.voiceChatEnabled ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.voiceChatEnabled ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Push to Talk</label>
							<button onClick={() => onChange("pushToTalk", !settings.pushToTalk)} className={`w-12 h-6 rounded-full transition-colors ${settings.pushToTalk ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.pushToTalk ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Spatial Audio</label>
							<button onClick={() => onChange("spatialAudio", !settings.spatialAudio)} className={`w-12 h-6 rounded-full transition-colors ${settings.spatialAudio ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.spatialAudio ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-300">Mono Audio</label>
							<button onClick={() => onChange("monoAudio", !settings.monoAudio)} className={`w-12 h-6 rounded-full transition-colors ${settings.monoAudio ? "bg-blue-500" : "bg-slate-700"}`}>
								<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.monoAudio ? "transform translate-x-6" : "transform translate-x-1"}`} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Subtitle Settings */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Volume1 className="w-5 h-5" />
					<span>Subtitle Settings</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Subtitle Size</label>
						<select value={settings.subtitleSize} onChange={(e) => onChange("subtitleSize", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
							<option value="Small">Small</option>
							<option value="Medium">Medium</option>
							<option value="Large">Large</option>
						</select>
					</div>
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Text Color</label>
						<input type="color" value={settings.subtitleColor} onChange={(e) => onChange("subtitleColor", e.target.value)} className="w-full h-12 bg-slate-800/80 border border-slate-600/50 rounded-lg cursor-pointer" />
					</div>
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Background Color</label>
						<input type="color" value={settings.subtitleBackground} onChange={(e) => onChange("subtitleBackground", e.target.value)} className="w-full h-12 bg-slate-800/80 border border-slate-600/50 rounded-lg cursor-pointer" />
					</div>
					<div>
						<label className="text-sm font-medium text-slate-300 mb-2 block">Subtitle Volume</label>
						<div className="flex items-center space-x-3">
							<input type="range" min="0" max="100" value={settings.subtitleVolume} onChange={(e) => onChange("subtitleVolume", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
							<span className="text-sm font-medium text-slate-300 w-12">{settings.subtitleVolume}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
