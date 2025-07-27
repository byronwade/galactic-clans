/**
 * @file PresetManager.tsx
 * @description Preset management system for generator configurations
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Save and load custom presets
 * - Predefined example presets
 * - Import/export functionality
 * - Preset categories and tags
 * - Local storage persistence
 * - Shareable preset URLs
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { Save, FolderOpen, Download, Upload, Star, Trash2, Copy, Check, Globe, User, Tag, Search } from "lucide-react";

interface Preset<T = any> {
	id: string;
	name: string;
	description: string;
	config: T;
	category: string;
	tags: string[];
	author: string;
	isOfficial: boolean;
	createdAt: string;
	updatedAt: string;
	usageCount: number;
	rating: number;
	thumbnail?: string;
}

interface PresetManagerProps<T> {
	generatorType: string;
	currentConfig: T;
	onConfigChange: (config: T) => void;
	presets?: Preset<T>[];
	categories?: string[];
	renderPreview?: (config: T) => ReactNode;
	configValidator?: (config: T) => boolean;
	className?: string;
}

interface PresetCategory {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}

const DEFAULT_CATEGORIES: PresetCategory[] = [
	{ id: "official", name: "Official", description: "Curated presets by the development team", icon: Star },
	{ id: "community", name: "Community", description: "User-generated presets", icon: Globe },
	{ id: "personal", name: "My Presets", description: "Your saved configurations", icon: User },
];

export function PresetManager<T>({ generatorType, currentConfig, onConfigChange, presets = [], categories = [], renderPreview, configValidator, className = "" }: PresetManagerProps<T>) {
	const [savedPresets, setSavedPresets] = useState<Preset<T>[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<"save" | "load" | "import">("load");
	const [copiedPresetId, setCopiedPresetId] = useState<string | null>(null);

	// Save preset form state
	const [presetName, setPresetName] = useState("");
	const [presetDescription, setPresetDescription] = useState("");
	const [presetCategory, setPresetCategory] = useState("personal");
	const [presetTags, setPresetTags] = useState<string[]>([]);

	// Load presets from localStorage
	useEffect(() => {
		const stored = localStorage.getItem(`presets-${generatorType}`);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setSavedPresets(parsed);
			} catch (error) {
				console.error("Failed to load presets:", error);
			}
		}
	}, [generatorType]);

	// Save presets to localStorage
	const savePresetsToStorage = useCallback(
		(presets: Preset<T>[]) => {
			localStorage.setItem(`presets-${generatorType}`, JSON.stringify(presets));
			setSavedPresets(presets);
		},
		[generatorType]
	);

	// Combine official and saved presets
	const allPresets = [...presets, ...savedPresets];

	// Filter presets by category and search
	const filteredPresets = allPresets.filter((preset) => {
		const matchesCategory = selectedCategory === "all" || preset.category === selectedCategory;
		const matchesSearch = !searchQuery || preset.name.toLowerCase().includes(searchQuery.toLowerCase()) || preset.description.toLowerCase().includes(searchQuery.toLowerCase()) || preset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

		return matchesCategory && matchesSearch;
	});

	// Save current configuration as preset
	const savePreset = useCallback(() => {
		if (!presetName.trim()) return;

		const newPreset: Preset<T> = {
			id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			name: presetName.trim(),
			description: presetDescription.trim(),
			config: currentConfig,
			category: presetCategory,
			tags: presetTags,
			author: "User",
			isOfficial: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			usageCount: 0,
			rating: 0,
		};

		const updatedPresets = [...savedPresets, newPreset];
		savePresetsToStorage(updatedPresets);

		// Reset form
		setPresetName("");
		setPresetDescription("");
		setPresetTags([]);
		setIsModalOpen(false);
	}, [presetName, presetDescription, presetCategory, presetTags, currentConfig, savedPresets, savePresetsToStorage]);

	// Load preset
	const loadPreset = useCallback(
		(preset: Preset<T>) => {
			if (configValidator && !configValidator(preset.config)) {
				alert("This preset is not compatible with the current generator version.");
				return;
			}

			onConfigChange(preset.config);

			// Update usage count for saved presets
			if (!preset.isOfficial) {
				const updatedPresets = savedPresets.map((p) => (p.id === preset.id ? { ...p, usageCount: p.usageCount + 1 } : p));
				savePresetsToStorage(updatedPresets);
			}

			setIsModalOpen(false);
		},
		[configValidator, onConfigChange, savedPresets, savePresetsToStorage]
	);

	// Delete preset
	const deletePreset = useCallback(
		(presetId: string) => {
			if (confirm("Are you sure you want to delete this preset?")) {
				const updatedPresets = savedPresets.filter((p) => p.id !== presetId);
				savePresetsToStorage(updatedPresets);
			}
		},
		[savedPresets, savePresetsToStorage]
	);

	// Export preset
	const exportPreset = useCallback((preset: Preset<T>) => {
		const dataStr = JSON.stringify(preset, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${preset.name.replace(/[^a-zA-Z0-9]/g, "_")}_preset.json`;
		link.click();
		URL.revokeObjectURL(url);
	}, []);

	// Import preset
	const importPreset = useCallback(
		(file: File) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const imported = JSON.parse(e.target?.result as string) as Preset<T>;

					// Validate and sanitize
					if (!imported.name || !imported.config) {
						throw new Error("Invalid preset file");
					}

					// Generate new ID to avoid conflicts
					imported.id = `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
					imported.isOfficial = false;
					imported.author = "Imported";
					imported.createdAt = new Date().toISOString();
					imported.updatedAt = new Date().toISOString();

					const updatedPresets = [...savedPresets, imported];
					savePresetsToStorage(updatedPresets);
				} catch (error) {
					alert("Failed to import preset. Please check the file format.");
				}
			};
			reader.readAsText(file);
		},
		[savedPresets, savePresetsToStorage]
	);

	// Copy preset URL to clipboard
	const copyPresetURL = useCallback(async (preset: Preset<T>) => {
		try {
			const url = `${window.location.origin}${window.location.pathname}?preset=${encodeURIComponent(JSON.stringify(preset.config))}`;
			await navigator.clipboard.writeText(url);
			setCopiedPresetId(preset.id);
			setTimeout(() => setCopiedPresetId(null), 2000);
		} catch (error) {
			console.error("Failed to copy URL:", error);
		}
	}, []);

	// Add tag
	const addTag = useCallback(
		(tag: string) => {
			if (tag.trim() && !presetTags.includes(tag.trim())) {
				setPresetTags([...presetTags, tag.trim()]);
			}
		},
		[presetTags]
	);

	// Remove tag
	const removeTag = useCallback(
		(tagToRemove: string) => {
			setPresetTags(presetTags.filter((tag) => tag !== tagToRemove));
		},
		[presetTags]
	);

	const allCategories = [
		...DEFAULT_CATEGORIES,
		...categories.map((cat) => ({
			id: cat,
			name: cat.charAt(0).toUpperCase() + cat.slice(1),
			description: `${cat} presets`,
			icon: Tag,
		})),
	];

	return (
		<div className={`preset-manager ${className}`}>
			{/* Preset Controls */}
			<div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
				<div className="flex items-center space-x-3">
					<h3 className="text-lg font-semibold text-white">Presets</h3>
					<span className="text-sm text-slate-400">{filteredPresets.length} available</span>
				</div>

				<div className="flex items-center space-x-2">
					<button
						onClick={() => {
							setModalMode("save");
							setIsModalOpen(true);
						}}
						className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/30"
						title="Save Current Configuration"
					>
						<Save className="w-4 h-4" />
						<span className="hidden sm:inline">Save</span>
					</button>

					<button
						onClick={() => {
							setModalMode("load");
							setIsModalOpen(true);
						}}
						className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 transition-colors border border-green-500/30"
						title="Load Preset"
					>
						<FolderOpen className="w-4 h-4" />
						<span className="hidden sm:inline">Load</span>
					</button>

					<label className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 cursor-pointer">
						<Upload className="w-4 h-4" />
						<span className="hidden sm:inline">Import</span>
						<input
							type="file"
							accept=".json"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) importPreset(file);
							}}
						/>
					</label>
				</div>
			</div>

			{/* Quick Preset Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
				{filteredPresets.slice(0, 8).map((preset) => (
					<div key={preset.id} className="relative group bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors cursor-pointer" onClick={() => loadPreset(preset)}>
						{/* Preset Preview */}
						<div className="aspect-video rounded-t-lg bg-slate-700/30 flex items-center justify-center">{renderPreview ? renderPreview(preset.config) : <div className="text-slate-500 text-xs">No Preview</div>}</div>

						{/* Preset Info */}
						<div className="p-3">
							<div className="flex items-center justify-between mb-1">
								<h4 className="text-sm font-medium text-white truncate">{preset.name}</h4>
								{preset.isOfficial && <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
							</div>
							<p className="text-xs text-slate-400 line-clamp-2">{preset.description}</p>

							{/* Tags */}
							{preset.tags.length > 0 && (
								<div className="flex flex-wrap gap-1 mt-2">
									{preset.tags.slice(0, 2).map((tag) => (
										<span key={tag} className="px-1.5 py-0.5 text-xs rounded bg-slate-700/50 text-slate-300">
											{tag}
										</span>
									))}
									{preset.tags.length > 2 && <span className="px-1.5 py-0.5 text-xs rounded bg-slate-700/50 text-slate-300">+{preset.tags.length - 2}</span>}
								</div>
							)}
						</div>

						{/* Hover Actions */}
						<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
							<button
								onClick={(e) => {
									e.stopPropagation();
									copyPresetURL(preset);
								}}
								className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
								title="Copy Shareable URL"
							>
								{copiedPresetId === preset.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
							</button>

							<button
								onClick={(e) => {
									e.stopPropagation();
									exportPreset(preset);
								}}
								className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
								title="Export Preset"
							>
								<Download className="w-3 h-3" />
							</button>

							{!preset.isOfficial && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										deletePreset(preset.id);
									}}
									className="p-1 rounded bg-slate-900/80 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
									title="Delete Preset"
								>
									<Trash2 className="w-3 h-3" />
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="bg-slate-900 rounded-xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-6 border-b border-slate-700/50">
							<h2 className="text-xl font-semibold text-white">{modalMode === "save" ? "Save Preset" : "Load Preset"}</h2>
							<button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
								<div className="w-5 h-5">✕</div>
							</button>
						</div>

						{/* Modal Content */}
						<div className="p-6">
							{modalMode === "save" ? (
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-2">Preset Name</label>
										<input type="text" value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="Enter preset name..." className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
										<textarea value={presetDescription} onChange={(e) => setPresetDescription(e.target.value)} placeholder="Describe this preset..." rows={3} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
										<select value={presetCategory} onChange={(e) => setPresetCategory(e.target.value)} className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
											{allCategories.map((cat) => (
												<option key={cat.id} value={cat.id}>
													{cat.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
										<div className="flex flex-wrap gap-2 mb-2">
											{presetTags.map((tag) => (
												<span key={tag} className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
													<span>{tag}</span>
													<button onClick={() => removeTag(tag)} className="hover:text-blue-300">
														✕
													</button>
												</span>
											))}
										</div>
										<input
											type="text"
											placeholder="Add tags..."
											className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
											onKeyDown={(e) => {
												if (e.key === "Enter" && e.currentTarget.value.trim()) {
													addTag(e.currentTarget.value.trim());
													e.currentTarget.value = "";
												}
											}}
										/>
									</div>

									<div className="flex justify-end space-x-3 pt-4">
										<button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
											Cancel
										</button>
										<button onClick={savePreset} disabled={!presetName.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
											Save Preset
										</button>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									{/* Search and Filter */}
									<div className="flex space-x-3">
										<div className="flex-1 relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
											<input type="text" placeholder="Search presets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
										</div>
										<select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
											<option value="all">All Categories</option>
											{allCategories.map((cat) => (
												<option key={cat.id} value={cat.id}>
													{cat.name}
												</option>
											))}
										</select>
									</div>

									{/* Preset List */}
									<div className="max-h-96 overflow-y-auto space-y-2">
										{filteredPresets.map((preset) => (
											<div key={preset.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors cursor-pointer" onClick={() => loadPreset(preset)}>
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-1">
														<h4 className="font-medium text-white">{preset.name}</h4>
														{preset.isOfficial && <Star className="w-4 h-4 text-yellow-400" />}
													</div>
													<p className="text-sm text-slate-400 mb-2">{preset.description}</p>
													{preset.tags.length > 0 && (
														<div className="flex flex-wrap gap-1">
															{preset.tags.map((tag) => (
																<span key={tag} className="px-1.5 py-0.5 text-xs rounded bg-slate-700/50 text-slate-300">
																	{tag}
																</span>
															))}
														</div>
													)}
												</div>
												<div className="flex items-center space-x-2 ml-4">
													<button
														onClick={(e) => {
															e.stopPropagation();
															copyPresetURL(preset);
														}}
														className="p-2 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
														title="Copy URL"
													>
														{copiedPresetId === preset.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															exportPreset(preset);
														}}
														className="p-2 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
														title="Export"
													>
														<Download className="w-4 h-4" />
													</button>
													{!preset.isOfficial && (
														<button
															onClick={(e) => {
																e.stopPropagation();
																deletePreset(preset.id);
															}}
															className="p-2 rounded hover:bg-red-600/50 text-slate-400 hover:text-white transition-colors"
															title="Delete"
														>
															<Trash2 className="w-4 h-4" />
														</button>
													)}
												</div>
											</div>
										))}

										{filteredPresets.length === 0 && (
											<div className="text-center py-12 text-slate-400">
												<FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
												<p>No presets found</p>
												<p className="text-sm">Try adjusting your search or category filter</p>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default PresetManager;
