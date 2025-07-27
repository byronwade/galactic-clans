/**
 * @file ConfigurationManager.tsx
 * @description Configuration export/import system for all generators
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Export configurations to JSON files
 * - Import configurations from files or URLs
 * - Configuration validation and migration
 * - Preset management and sharing
 * - Version control for configurations
 */

"use client";

import React, { useState, useCallback, useRef } from "react";
import { Download, Upload, Save, FileText, Copy, Share, Check, X, AlertTriangle, Info, Bookmark, Trash2, Edit3 } from "lucide-react";

interface Configuration {
	id: string;
	name: string;
	description?: string;
	type: "planet" | "galaxy" | "star" | "solar-system" | "black-hole" | "fps-explorer";
	version: string;
	timestamp: string;
	data: any;
	metadata: {
		author?: string;
		tags?: string[];
		category?: string;
		difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
	};
}

interface ConfigurationManagerProps {
	currentConfig: any;
	configType: Configuration["type"];
	onConfigurationLoad: (config: any) => void;
	onError?: (error: string) => void;
}

export function ConfigurationManager({ currentConfig, configType, onConfigurationLoad, onError }: ConfigurationManagerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [savedConfigs, setSavedConfigs] = useState<Configuration[]>([]);
	const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle");
	const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
	const [shareUrl, setShareUrl] = useState<string>("");
	const [isEditing, setIsEditing] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Load saved configurations from localStorage
	React.useEffect(() => {
		try {
			const saved = localStorage.getItem("galactic-clans-configurations");
			if (saved) {
				const configs = JSON.parse(saved);
				setSavedConfigs(configs.filter((c: Configuration) => c.type === configType));
			}
		} catch (error) {
			console.warn("Failed to load saved configurations:", error);
		}
	}, [configType]);

	// Save configuration to localStorage
	const saveToStorage = useCallback(
		(configs: Configuration[]) => {
			try {
				const allConfigs = localStorage.getItem("galactic-clans-configurations");
				const existing = allConfigs ? JSON.parse(allConfigs) : [];

				// Remove existing configs of this type
				const filtered = existing.filter((c: Configuration) => c.type !== configType);

				// Add new configs
				const updated = [...filtered, ...configs];

				localStorage.setItem("galactic-clans-configurations", JSON.stringify(updated));
				setSavedConfigs(configs);
			} catch (error) {
				console.error("Failed to save configurations:", error);
				onError?.("Failed to save configuration to local storage");
			}
		},
		[configType, onError]
	);

	// Generate configuration object
	const generateConfiguration = useCallback(
		(name: string, description?: string, metadata?: Partial<Configuration["metadata"]>): Configuration => {
			return {
				id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				name,
				description,
				type: configType,
				version: "1.0.0",
				timestamp: new Date().toISOString(),
				data: currentConfig,
				metadata: {
					author: "User",
					tags: [],
					category: "custom",
					difficulty: "intermediate",
					...metadata,
				},
			};
		},
		[currentConfig, configType]
	);

	// Export configuration as JSON file
	const exportConfiguration = useCallback(() => {
		try {
			const config = generateConfiguration(`${configType}-config-${Date.now()}`, `Exported ${configType} configuration`);

			const dataStr = JSON.stringify(config, null, 2);
			const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

			const exportFileDefaultName = `${config.name}.json`;

			const linkElement = document.createElement("a");
			linkElement.setAttribute("href", dataUri);
			linkElement.setAttribute("download", exportFileDefaultName);
			linkElement.click();

			setExportStatus("success");
			setTimeout(() => setExportStatus("idle"), 3000);
		} catch (error) {
			console.error("Export failed:", error);
			setExportStatus("error");
			onError?.("Failed to export configuration");
			setTimeout(() => setExportStatus("idle"), 3000);
		}
	}, [generateConfiguration, configType, onError]);

	// Import configuration from file
	const importConfiguration = useCallback(
		(file: File) => {
			const reader = new FileReader();

			reader.onload = (event) => {
				try {
					const config = JSON.parse(event.target?.result as string) as Configuration;

					// Validate configuration
					if (!config.type || config.type !== configType) {
						throw new Error(`Invalid configuration type. Expected ${configType}, got ${config.type}`);
					}

					if (!config.data) {
						throw new Error("Configuration data is missing");
					}

					// Load configuration
					onConfigurationLoad(config.data);
					setImportStatus("success");
					setTimeout(() => setImportStatus("idle"), 3000);
				} catch (error) {
					console.error("Import failed:", error);
					setImportStatus("error");
					onError?.(`Failed to import configuration: ${error}`);
					setTimeout(() => setImportStatus("idle"), 3000);
				}
			};

			reader.readAsText(file);
		},
		[configType, onConfigurationLoad, onError]
	);

	// Handle file input change
	const handleFileInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				importConfiguration(file);
			}
			// Reset input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[importConfiguration]
	);

	// Save current configuration as preset
	const saveAsPreset = useCallback(
		(name: string, description?: string) => {
			const config = generateConfiguration(name, description);
			const updated = [...savedConfigs, config];
			saveToStorage(updated);
		},
		[generateConfiguration, savedConfigs, saveToStorage]
	);

	// Load preset configuration
	const loadPreset = useCallback(
		(config: Configuration) => {
			onConfigurationLoad(config.data);
		},
		[onConfigurationLoad]
	);

	// Delete preset
	const deletePreset = useCallback(
		(id: string) => {
			const updated = savedConfigs.filter((c) => c.id !== id);
			saveToStorage(updated);
		},
		[savedConfigs, saveToStorage]
	);

	// Generate shareable URL
	const generateShareUrl = useCallback(() => {
		try {
			const config = generateConfiguration(`Shared ${configType} configuration`, "Shared configuration via URL");

			const encoded = btoa(JSON.stringify(config));
			const url = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
			setShareUrl(url);

			// Copy to clipboard
			navigator.clipboard
				.writeText(url)
				.then(() => {
					// URL copied successfully
				})
				.catch(() => {
					// Fallback for older browsers
					const textarea = document.createElement("textarea");
					textarea.value = url;
					document.body.appendChild(textarea);
					textarea.select();
					document.execCommand("copy");
					document.body.removeChild(textarea);
				});
		} catch (error) {
			console.error("Failed to generate share URL:", error);
			onError?.("Failed to generate shareable URL");
		}
	}, [generateConfiguration, configType, onError]);

	// Save preset form
	const [presetForm, setPresetForm] = useState({ name: "", description: "" });
	const [showSaveForm, setShowSaveForm] = useState(false);

	const handleSavePreset = useCallback(() => {
		if (presetForm.name.trim()) {
			saveAsPreset(presetForm.name.trim(), presetForm.description.trim() || undefined);
			setPresetForm({ name: "", description: "" });
			setShowSaveForm(false);
		}
	}, [presetForm, saveAsPreset]);

	if (!isOpen) {
		return (
			<button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm" title="Configuration Manager">
				<FileText className="w-4 h-4" />
				<span className="hidden sm:inline">Config</span>
			</button>
		);
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-slate-900 border border-slate-600 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-slate-600">
					<div className="flex items-center gap-2">
						<FileText className="w-5 h-5 text-green-400" />
						<h2 className="text-lg font-semibold text-white">Configuration Manager</h2>
						<span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 capitalize">{configType}</span>
					</div>
					<button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
					{/* Quick Actions */}
					<div className="space-y-3">
						<h3 className="font-semibold text-white">Quick Actions</h3>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
							<button onClick={exportConfiguration} className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${exportStatus === "success" ? "bg-green-600" : exportStatus === "error" ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}>
								{exportStatus === "success" ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
								<span className="text-sm">Export</span>
							</button>

							<button onClick={() => fileInputRef.current?.click()} className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${importStatus === "success" ? "bg-green-600" : importStatus === "error" ? "bg-red-600" : "bg-purple-600 hover:bg-purple-700"}`}>
								{importStatus === "success" ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
								<span className="text-sm">Import</span>
							</button>

							<button onClick={() => setShowSaveForm(true)} className="flex items-center justify-center gap-2 p-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
								<Save className="w-4 h-4" />
								<span className="text-sm">Save</span>
							</button>

							<button onClick={generateShareUrl} className="flex items-center justify-center gap-2 p-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
								<Share className="w-4 h-4" />
								<span className="text-sm">Share</span>
							</button>
						</div>
					</div>

					{/* Save Preset Form */}
					{showSaveForm && (
						<div className="bg-slate-800 border border-slate-600 rounded-lg p-4 space-y-3">
							<h4 className="font-medium text-white">Save as Preset</h4>
							<div className="space-y-2">
								<input type="text" placeholder="Preset name" value={presetForm.name} onChange={(e) => setPresetForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400" />
								<input type="text" placeholder="Description (optional)" value={presetForm.description} onChange={(e) => setPresetForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400" />
								<div className="flex gap-2">
									<button onClick={handleSavePreset} disabled={!presetForm.name.trim()} className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:opacity-50 text-white rounded transition-colors">
										Save Preset
									</button>
									<button onClick={() => setShowSaveForm(false)} className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors">
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Share URL */}
					{shareUrl && (
						<div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
							<h4 className="font-medium text-white mb-2">Shareable URL</h4>
							<div className="flex gap-2">
								<input type="text" value={shareUrl} readOnly className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm" />
								<button onClick={() => navigator.clipboard.writeText(shareUrl)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" title="Copy to clipboard">
									<Copy className="w-4 h-4" />
								</button>
							</div>
						</div>
					)}

					{/* Saved Presets */}
					<div className="space-y-3">
						<h3 className="font-semibold text-white">Saved Presets</h3>
						{savedConfigs.length === 0 ? (
							<div className="text-center py-8 text-slate-400">
								<Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
								<p>No saved presets yet</p>
								<p className="text-sm">Save your current configuration to create your first preset</p>
							</div>
						) : (
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{savedConfigs.map((config) => (
									<div key={config.id} className="bg-slate-800 border border-slate-600 rounded-lg p-3">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="font-medium text-white">{config.name}</h4>
												{config.description && <p className="text-sm text-slate-400">{config.description}</p>}
												<div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
													<span>{new Date(config.timestamp).toLocaleDateString()}</span>
													{config.metadata.difficulty && <span className="bg-slate-700 px-2 py-0.5 rounded">{config.metadata.difficulty}</span>}
												</div>
											</div>
											<div className="flex gap-1">
												<button onClick={() => loadPreset(config)} className="p-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors" title="Load preset">
													<Download className="w-3 h-3" />
												</button>
												<button onClick={() => deletePreset(config.id)} className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" title="Delete preset">
													<Trash2 className="w-3 h-3" />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Hidden file input */}
				<input ref={fileInputRef} type="file" accept=".json" onChange={handleFileInput} className="hidden" />
			</div>
		</div>
	);
}

export default ConfigurationManager;
