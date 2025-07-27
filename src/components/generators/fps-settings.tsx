/**
 * @file fps-settings.tsx
 * @description FPS Explorer Settings Panel
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * 
 * Comprehensive settings for FPS exploration including:
 * - Player movement and physics
 * - Camera and visual settings
 * - Graphics and performance options
 * - Audio and accessibility settings
 */

"use client";

import React from "react";
import { X, User, Camera, Settings, Gamepad2, Volume2, Eye, Zap } from "lucide-react";
import type { FPSConfig } from "./fps-explorer-generator";

interface FPSSettingsProps {
    config: FPSConfig;
    onConfigChange: (updates: Partial<FPSConfig>) => void;
    onClose: () => void;
    availableModes: Array<{ value: string; label: string; description: string }>;
    planetPresets: Array<{ name: string; planetClass: any; atmosphere: boolean; weatherType: string; vegetation: boolean }>;
}

export function FPSSettings({ config, onConfigChange, onClose, availableModes, planetPresets }: FPSSettingsProps) {
    const updatePlayerConfig = (updates: Partial<FPSConfig['player']>) => {
        onConfigChange({ player: { ...config.player, ...updates } });
    };

    const updateEnvironmentConfig = (updates: Partial<FPSConfig['environment']>) => {
        onConfigChange({ environment: { ...config.environment, ...updates } });
    };

    const updateGameplayConfig = (updates: Partial<FPSConfig['gameplay']>) => {
        onConfigChange({ gameplay: { ...config.gameplay, ...updates } });
    };

    return (
        <div className="fixed left-4 top-20 bottom-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-green-400/20 bg-gradient-to-r from-green-900/50 to-emerald-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-green-400" />
                        <h3 className="font-semibold text-white">FPS Explorer Settings</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Settings Content */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                
                {/* Player Movement Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                        <User className="w-4 h-4" />
                        <span>Player Movement</span>
                    </div>
                    
                    <div className="space-y-3 pl-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Walk Speed: {config.player.walkSpeed.toFixed(1)} m/s
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="10"
                                step="0.5"
                                value={config.player.walkSpeed}
                                onChange={(e) => updatePlayerConfig({ walkSpeed: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Run Speed: {config.player.runSpeed.toFixed(1)} m/s
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="15"
                                step="0.5"
                                value={config.player.runSpeed}
                                onChange={(e) => updatePlayerConfig({ runSpeed: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Jump Height: {config.player.jumpHeight.toFixed(1)} m
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.1"
                                value={config.player.jumpHeight}
                                onChange={(e) => updatePlayerConfig({ jumpHeight: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Mouse Sensitivity: {config.player.mouseSensitivity.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.1"
                                value={config.player.mouseSensitivity}
                                onChange={(e) => updatePlayerConfig({ mouseSensitivity: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Camera Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                        <Camera className="w-4 h-4" />
                        <span>Camera & Vision</span>
                    </div>
                    
                    <div className="space-y-3 pl-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Field of View: {config.player.fov}°
                            </label>
                            <input
                                type="range"
                                min="60"
                                max="120"
                                step="5"
                                value={config.player.fov}
                                onChange={(e) => updatePlayerConfig({ fov: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Head Bob Intensity: {(config.player.headBobIntensity * 100).toFixed(0)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.player.headBobIntensity}
                                onChange={(e) => updatePlayerConfig({ headBobIntensity: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="viewBobbing"
                                checked={config.player.viewBobbing}
                                onChange={(e) => updatePlayerConfig({ viewBobbing: e.target.checked })}
                                className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                            />
                            <label htmlFor="viewBobbing" className="text-sm text-slate-300">
                                Enable View Bobbing
                            </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="breathingEffect"
                                checked={config.player.breathingEffect}
                                onChange={(e) => updatePlayerConfig({ breathingEffect: e.target.checked })}
                                className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                            />
                            <label htmlFor="breathingEffect" className="text-sm text-slate-300">
                                Breathing Effect
                            </label>
                        </div>
                    </div>
                </div>

                {/* Environment Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                        <Eye className="w-4 h-4" />
                        <span>Environment</span>
                    </div>
                    
                    <div className="space-y-3 pl-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Terrain Detail: {(config.environment.terrainDetail * 100).toFixed(0)}%
                            </label>
                            <input
                                type="range"
                                min="0.2"
                                max="1"
                                step="0.1"
                                value={config.environment.terrainDetail}
                                onChange={(e) => updateEnvironmentConfig({ terrainDetail: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Vegetation Density: {(config.environment.vegetationDensity * 100).toFixed(0)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.environment.vegetationDensity}
                                onChange={(e) => updateEnvironmentConfig({ vegetationDensity: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Time of Day: {config.environment.timeOfDay.toFixed(1)}h
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="24"
                                step="0.5"
                                value={config.environment.timeOfDay}
                                onChange={(e) => updateEnvironmentConfig({ timeOfDay: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="enableVegetation"
                                checked={config.environment.enableVegetation}
                                onChange={(e) => updateEnvironmentConfig({ enableVegetation: e.target.checked })}
                                className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                            />
                            <label htmlFor="enableVegetation" className="text-sm text-slate-300">
                                Enable Vegetation
                            </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="weatherEnabled"
                                checked={config.environment.weatherEnabled}
                                onChange={(e) => updateEnvironmentConfig({ weatherEnabled: e.target.checked })}
                                className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                            />
                            <label htmlFor="weatherEnabled" className="text-sm text-slate-300">
                                Weather Effects
                            </label>
                        </div>
                    </div>
                </div>

                {/* Graphics Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                        <Zap className="w-4 h-4" />
                        <span>Graphics & Performance</span>
                    </div>
                    
                    <div className="space-y-3 pl-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Render Distance: {config.gameplay.renderDistance}m
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="500"
                                step="25"
                                value={config.gameplay.renderDistance}
                                onChange={(e) => updateGameplayConfig({ renderDistance: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                LOD Levels: {config.gameplay.lodLevels}
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="8"
                                step="1"
                                value={config.gameplay.lodLevels}
                                onChange={(e) => updateGameplayConfig({ lodLevels: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Shadow Quality</label>
                            <select
                                value={config.gameplay.shadowQuality}
                                onChange={(e) => updateGameplayConfig({ shadowQuality: e.target.value as any })}
                                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="ultra">Ultra</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Texture Quality</label>
                            <select
                                value={config.gameplay.textureQuality}
                                onChange={(e) => updateGameplayConfig({ textureQuality: e.target.value as any })}
                                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="ultra">Ultra</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Gameplay Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                        <Gamepad2 className="w-4 h-4" />
                        <span>Gameplay & UI</span>
                    </div>
                    
                    <div className="space-y-3 pl-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Exploration Mode</label>
                            <select
                                value={config.gameplay.explorationMode}
                                onChange={(e) => updateGameplayConfig({ explorationMode: e.target.value })}
                                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            >
                                {availableModes.map(mode => (
                                    <option key={mode.value} value={mode.value}>
                                        {mode.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Interaction Range: {config.gameplay.interactionRange.toFixed(1)}m
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.5"
                                value={config.gameplay.interactionRange}
                                onChange={(e) => updateGameplayConfig({ interactionRange: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showCrosshair"
                                    checked={config.gameplay.showCrosshair}
                                    onChange={(e) => updateGameplayConfig({ showCrosshair: e.target.checked })}
                                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                                />
                                <label htmlFor="showCrosshair" className="text-xs text-slate-300">
                                    Crosshair
                                </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showMinimap"
                                    checked={config.gameplay.showMinimap}
                                    onChange={(e) => updateGameplayConfig({ showMinimap: e.target.checked })}
                                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                                />
                                <label htmlFor="showMinimap" className="text-xs text-slate-300">
                                    Minimap
                                </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showCompass"
                                    checked={config.gameplay.showCompass}
                                    onChange={(e) => updateGameplayConfig({ showCompass: e.target.checked })}
                                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                                />
                                <label htmlFor="showCompass" className="text-xs text-slate-300">
                                    Compass
                                </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showStaminaBar"
                                    checked={config.gameplay.showStaminaBar}
                                    onChange={(e) => updateGameplayConfig({ showStaminaBar: e.target.checked })}
                                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                                />
                                <label htmlFor="showStaminaBar" className="text-xs text-slate-300">
                                    Stamina
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                        <Volume2 className="w-4 h-4" />
                        <span>Audio</span>
                    </div>
                    
                    <div className="space-y-3 pl-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="ambientSounds"
                                checked={config.environment.ambientSounds}
                                onChange={(e) => updateEnvironmentConfig({ ambientSounds: e.target.checked })}
                                className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                            />
                            <label htmlFor="ambientSounds" className="text-sm text-slate-300">
                                Ambient Sounds
                            </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="windSounds"
                                checked={config.environment.windSounds}
                                onChange={(e) => updateEnvironmentConfig({ windSounds: e.target.checked })}
                                className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                            />
                            <label htmlFor="windSounds" className="text-sm text-slate-300">
                                Wind Sounds
                            </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="echoEffect"
                                checked={config.environment.echoEffect}
                                onChange={(e) => updateEnvironmentConfig({ echoEffect: e.target.checked })}
                                className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                            />
                            <label htmlFor="echoEffect" className="text-sm text-slate-3 00">
                                Echo Effects
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 