import React from "react";
import { Wifi, WifiOff, Globe, Shield, Server } from "lucide-react";

interface NetworkSettingsProps {
	settings: any;
	onChange: (setting: string, value: any) => void;
}

export default function NetworkSettings({ settings, onChange }: NetworkSettingsProps) {
	const regions = [
		{ value: "Auto", name: "Auto", description: "Automatic selection" },
		{ value: "US-East", name: "US East", description: "New York, NY" },
		{ value: "US-West", name: "US West", description: "Los Angeles, CA" },
		{ value: "Europe", name: "Europe", description: "Frankfurt, DE" },
		{ value: "Asia", name: "Asia", description: "Tokyo, JP" },
		{ value: "Oceania", name: "Oceania", description: "Sydney, AU" },
	];

	const connectionTypes = [
		{ value: "Auto", name: "Auto", description: "Automatic detection" },
		{ value: "LAN", name: "LAN", description: "Local network" },
		{ value: "WiFi", name: "WiFi", description: "Wireless network" },
		{ value: "Cellular", name: "Cellular", description: "Mobile data" },
	];

	const natTypes = [
		{ value: "Open", name: "Open", description: "Best connectivity" },
		{ value: "Moderate", name: "Moderate", description: "Limited connectivity" },
		{ value: "Strict", name: "Strict", description: "Restricted connectivity" },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
						<Wifi className="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-white">Network Settings</h2>
						<p className="text-sm text-slate-400">Configure multiplayer and connectivity</p>
					</div>
				</div>
			</div>

			{/* Server Settings */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Server className="w-5 h-5" />
						<span>Server Configuration</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Region</label>
							<select value={settings.region} onChange={(e) => onChange("region", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{regions.map((region) => (
									<option key={region.value} value={region.value}>
										{region.name} - {region.description}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Connection Type</label>
							<select value={settings.connectionType} onChange={(e) => onChange("connectionType", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{connectionTypes.map((type) => (
									<option key={type.value} value={type.value}>
										{type.name} - {type.description}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">NAT Type</label>
							<select value={settings.natType} onChange={(e) => onChange("natType", e.target.value)} className="w-full p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg text-white">
								{natTypes.map((nat) => (
									<option key={nat.value} value={nat.value}>
										{nat.name} - {nat.description}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
						<Globe className="w-5 h-5" />
						<span>Performance Limits</span>
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Ping Limit (ms)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="50" max="200" value={settings.pingLimit} onChange={(e) => onChange("pingLimit", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.pingLimit}ms</span>
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Bandwidth Limit (Mbps)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="0" max="100" value={settings.bandwidthLimit} onChange={(e) => onChange("bandwidthLimit", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.bandwidthLimit === 0 ? "Unlimited" : `${settings.bandwidthLimit}Mbps`}</span>
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-300 mb-2 block">Packet Loss Threshold (%)</label>
							<div className="flex items-center space-x-3">
								<input type="range" min="1" max="20" value={settings.packetLossThreshold} onChange={(e) => onChange("packetLossThreshold", parseInt(e.target.value))} className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
								<span className="text-sm font-medium text-slate-300 w-12">{settings.packetLossThreshold}%</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Network Features */}
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
					<Shield className="w-5 h-5" />
					<span>Network Features</span>
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Port Forwarding</label>
						<button onClick={() => onChange("portForwarding", !settings.portForwarding)} className={`w-12 h-6 rounded-full transition-colors ${settings.portForwarding ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.portForwarding ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">UPnP</label>
						<button onClick={() => onChange("upnp", !settings.upnp)} className={`w-12 h-6 rounded-full transition-colors ${settings.upnp ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.upnp ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Server Browser</label>
						<button onClick={() => onChange("serverBrowser", !settings.serverBrowser)} className={`w-12 h-6 rounded-full transition-colors ${settings.serverBrowser ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.serverBrowser ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Cross-Play</label>
						<button onClick={() => onChange("crossPlay", !settings.crossPlay)} className={`w-12 h-6 rounded-full transition-colors ${settings.crossPlay ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.crossPlay ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-slate-300">Cross-Save</label>
						<button onClick={() => onChange("crossSave", !settings.crossSave)} className={`w-12 h-6 rounded-full transition-colors ${settings.crossSave ? "bg-blue-500" : "bg-slate-700"}`}>
							<div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.crossSave ? "transform translate-x-6" : "transform translate-x-1"}`} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
