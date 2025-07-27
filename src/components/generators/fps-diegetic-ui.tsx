/**
 * @file fps-diegetic-ui.tsx
 * @description Diegetic UI/HUD System for FPS Exploration
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * 
 * Immersive UI elements including:
 * - In-world holographic displays
 * - Environmental scanner interface
 * - Health and stamina indicators
 * - Interaction prompts and tooltips
 * - Compass and navigation aids
 * - Resource and sample information
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { 
    Crosshair, 
    Compass, 
    Activity, 
    Zap, 
    Eye, 
    Package, 
    MapPin, 
    Target,
    Scan,
    Hand
} from "lucide-react";
import type { FPSConfig } from "./fps-explorer-generator";

interface DiegeticUIProps {
    config: FPSConfig;
    isExploring: boolean;
    playerPosition: THREE.Vector3;
    playerRotation: THREE.Euler;
    stamina: number;
    health: number;
    isScanning: boolean;
    scanTarget?: {
        name: string;
        type: string;
        distance: number;
        position: THREE.Vector3;
        properties: Record<string, any>;
    };
    interactables: Array<{
        id: string;
        name: string;
        position: THREE.Vector3;
        distance: number;
        type: 'resource' | 'artifact' | 'sample' | 'structure';
    }>;
}

export function DiegeticUI({
    config,
    isExploring,
    playerPosition,
    playerRotation,
    stamina,
    health,
    isScanning,
    scanTarget,
    interactables
}: DiegeticUIProps) {
    const [compassHeading, setCompassHeading] = useState(0);
    const [nearestInteractable, setNearestInteractable] = useState<any>(null);
    
    // Update compass heading based on player rotation
    useEffect(() => {
        const heading = ((playerRotation.y * 180 / Math.PI) + 360) % 360;
        setCompassHeading(heading);
    }, [playerRotation]);

    // Find nearest interactable
    useEffect(() => {
        if (interactables.length === 0) {
            setNearestInteractable(null);
            return;
        }

        const nearest = interactables
            .filter(item => item.distance <= config.gameplay.interactionRange)
            .sort((a, b) => a.distance - b.distance)[0];
        
        setNearestInteractable(nearest);
    }, [interactables, config.gameplay.interactionRange]);

    if (!isExploring) return null;

    return (
        <group>
            {/* Crosshair HUD */}
            {config.gameplay.showCrosshair && (
                <Html center className="pointer-events-none">
                    <div className="relative">
                        {/* Main crosshair */}
                        <div className="flex items-center justify-center w-8 h-8">
                            <div className="w-1 h-1 bg-green-400 rounded-full opacity-80" />
                        </div>
                        
                        {/* Crosshair arms */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="absolute -top-3 left-1/2 w-0.5 h-2 bg-green-400/60 transform -translate-x-1/2" />
                            <div className="absolute -bottom-3 left-1/2 w-0.5 h-2 bg-green-400/60 transform -translate-x-1/2" />
                            <div className="absolute top-1/2 -left-3 w-2 h-0.5 bg-green-400/60 transform -translate-y-1/2" />
                            <div className="absolute top-1/2 -right-3 w-2 h-0.5 bg-green-400/60 transform -translate-y-1/2" />
                        </div>
                        
                        {/* Hit indicator (when scanning) */}
                        {isScanning && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-6 h-6 border-2 border-cyan-400 rounded-full animate-ping" />
                            </div>
                        )}
                    </div>
                </Html>
            )}

            {/* Compass HUD */}
            {config.gameplay.showCompass && (
                <Html 
                    position={[0, 2, 0]} 
                    center 
                    className="pointer-events-none"
                    transform
                    sprite
                >
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-green-400/40 rounded-lg p-3 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <Compass className="w-5 h-5 text-green-400" />
                            <div className="text-white">
                                <div className="text-xs text-slate-300">Heading</div>
                                <div className="font-mono text-lg">{compassHeading.toFixed(0)}°</div>
                            </div>
                            <div className="text-white">
                                <div className="text-xs text-slate-300">Elevation</div>
                                <div className="font-mono text-lg">{playerPosition.y.toFixed(1)}m</div>
                            </div>
                        </div>
                        
                        {/* Compass rose */}
                        <div className="relative w-16 h-16 mt-2 mx-auto">
                            <div className="absolute inset-0 border border-green-400/30 rounded-full" />
                            <div 
                                className="absolute top-0 left-1/2 w-0.5 h-3 bg-red-400 transform -translate-x-1/2"
                                style={{ transformOrigin: '50% 32px', transform: `translateX(-50%) rotate(${compassHeading}deg)` }}
                            />
                            <div className="absolute top-1 left-1/2 text-xs text-white font-bold transform -translate-x-1/2">N</div>
                        </div>
                    </div>
                </Html>
            )}

            {/* Health and Stamina HUD */}
            {(config.gameplay.showHealthBar || config.gameplay.showStaminaBar) && (
                <Html 
                    position={[-3, 1, 0]} 
                    center 
                    className="pointer-events-none"
                    transform
                    sprite
                >
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-green-400/40 rounded-lg p-3 shadow-2xl">
                        <div className="space-y-2">
                            {config.gameplay.showHealthBar && (
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-red-400" />
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-300 mb-1">Health</div>
                                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300"
                                                style={{ width: `${health}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-white font-mono text-sm">{health}%</span>
                                </div>
                            )}
                            
                            {config.gameplay.showStaminaBar && (
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-300 mb-1">Stamina</div>
                                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-300"
                                                style={{ width: `${stamina}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-white font-mono text-sm">{stamina.toFixed(0)}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Html>
            )}

            {/* Scanner Interface */}
            {isScanning && scanTarget && (
                <Html 
                    position={[3, 0, 0]} 
                    center 
                    className="pointer-events-none"
                    transform
                    sprite
                >
                    <div className="bg-cyan-900/90 backdrop-blur-sm border border-cyan-400/60 rounded-lg p-4 shadow-2xl max-w-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <Scan className="w-5 h-5 text-cyan-400 animate-pulse" />
                            <h3 className="text-cyan-300 font-semibold">Environmental Scan</h3>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-cyan-400">Target: </span>
                                <span className="text-white">{scanTarget.name}</span>
                            </div>
                            <div>
                                <span className="text-cyan-400">Type: </span>
                                <span className="text-white capitalize">{scanTarget.type}</span>
                            </div>
                            <div>
                                <span className="text-cyan-400">Distance: </span>
                                <span className="text-white font-mono">{scanTarget.distance.toFixed(1)}m</span>
                            </div>
                            
                            {/* Scan progress */}
                            <div className="mt-3">
                                <div className="text-xs text-cyan-400 mb-1">Analyzing...</div>
                                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400 rounded-full animate-pulse" style={{ width: '75%' }} />
                                </div>
                            </div>
                            
                            {/* Properties */}
                            {Object.entries(scanTarget.properties).length > 0 && (
                                <div className="mt-3 pt-2 border-t border-cyan-400/30">
                                    <div className="text-xs text-cyan-400 mb-1">Properties:</div>
                                    {Object.entries(scanTarget.properties).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs">
                                            <span className="text-slate-300">{key}:</span>
                                            <span className="text-white">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Html>
            )}

            {/* Interaction Prompt */}
            {nearestInteractable && (
                <Html 
                    position={[0, -1, 0]} 
                    center 
                    className="pointer-events-none"
                    transform
                    sprite
                >
                    <div className="bg-slate-900/90 backdrop-blur-sm border border-green-400/50 rounded-lg p-3 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {nearestInteractable.type === 'resource' && <Package className="w-4 h-4 text-green-400" />}
                                {nearestInteractable.type === 'artifact' && <Eye className="w-4 h-4 text-purple-400" />}
                                {nearestInteractable.type === 'sample' && <Target className="w-4 h-4 text-blue-400" />}
                                {nearestInteractable.type === 'structure' && <MapPin className="w-4 h-4 text-orange-400" />}
                                
                                <div className="text-white">
                                    <div className="font-medium">{nearestInteractable.name}</div>
                                    <div className="text-xs text-slate-300">
                                        {nearestInteractable.distance.toFixed(1)}m away
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-400/20 border border-green-400/40 rounded">
                                <Hand className="w-3 h-3 text-green-400" />
                                <span className="text-green-400 text-xs font-mono">E</span>
                            </div>
                        </div>
                    </div>
                </Html>
            )}

            {/* Minimap */}
            {config.gameplay.showMinimap && (
                <Html 
                    position={[3, 2, 0]} 
                    center 
                    className="pointer-events-none"
                    transform
                    sprite
                >
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-green-400/40 rounded-lg p-3 shadow-2xl">
                        <div className="text-xs text-green-400 mb-2 font-semibold">Local Map</div>
                        
                        {/* Simple minimap representation */}
                        <div className="relative w-24 h-24 bg-slate-800 border border-slate-600 rounded">
                            {/* Player indicator */}
                            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                            
                            {/* Player direction indicator */}
                            <div 
                                className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-green-400 transform -translate-x-1/2 -translate-y-1/2 origin-left"
                                style={{ transform: `translate(-50%, -50%) rotate(${compassHeading}deg)` }}
                            />
                            
                            {/* Interactables on minimap */}
                            {interactables.slice(0, 5).map((item, index) => {
                                const mapX = (item.position.x - playerPosition.x) * 2 + 48;
                                const mapY = (item.position.z - playerPosition.z) * 2 + 48;
                                
                                if (mapX < 0 || mapX > 96 || mapY < 0 || mapY > 96) return null;
                                
                                return (
                                    <div
                                        key={item.id}
                                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                        style={{ left: mapX, top: mapY }}
                                    />
                                );
                            })}
                        </div>
                        
                        <div className="text-xs text-slate-300 mt-2 text-center">
                            {playerPosition.x.toFixed(0)}, {playerPosition.z.toFixed(0)}
                        </div>
                    </div>
                </Html>
            )}

            {/* Environmental Information Panel */}
            <Html 
                position={[-3, -1, 0]} 
                center 
                className="pointer-events-none"
                transform
                sprite
            >
                <div className="bg-slate-900/80 backdrop-blur-sm border border-green-400/40 rounded-lg p-3 shadow-2xl">
                    <div className="text-xs text-green-400 mb-2 font-semibold">Environment</div>
                    
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-300">Gravity:</span>
                            <span className="text-white font-mono">{config.environment.gravity.toFixed(1)} m/s²</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-300">Atmosphere:</span>
                            <span className="text-white">{config.environment.atmosphere ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-300">Weather:</span>
                            <span className="text-white capitalize">{config.environment.weatherType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-300">Time:</span>
                            <span className="text-white font-mono">{config.environment.timeOfDay.toFixed(1)}h</span>
                        </div>
                    </div>
                    
                    {/* Environmental hazards warning */}
                    {(!config.environment.atmosphere || config.environment.weatherType === 'storm') && (
                        <div className="mt-2 pt-2 border-t border-red-400/30">
                            <div className="text-xs text-red-400 flex items-center gap-1">
                                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
                                <span>Environmental Hazard</span>
                            </div>
                        </div>
                    )}
                </div>
            </Html>
        </group>
    );
} 