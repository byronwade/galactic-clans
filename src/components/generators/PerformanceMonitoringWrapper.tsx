/**
 * @file PerformanceMonitoringWrapper.tsx
 * @description Performance monitoring wrapper for generator components
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Real-time FPS monitoring
 * - Memory usage tracking
 * - Frame time analysis
 * - Performance warnings
 * - Quality adjustment suggestions
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { Activity, AlertTriangle, CheckCircle, Zap, Monitor, TrendingUp } from "lucide-react";

interface PerformanceMetrics {
	fps: number;
	frameTime: number;
	memoryUsage: number;
	memoryPercentage: number;
	cpuUsage: number;
	drawCalls: number;
	performanceScore: number;
	warnings: string[];
}

interface PerformanceMonitoringWrapperProps {
	children: ReactNode;
	generatorName: string;
	enabled?: boolean;
	position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
	showDetailed?: boolean;
	warningThreshold?: {
		fps: number;
		memory: number;
		frameTime: number;
	};
}

export function PerformanceMonitoringWrapper({
	children,
	generatorName,
	enabled = true,
	position = "top-right",
	showDetailed = false,
	warningThreshold = {
		fps: 45,
		memory: 85,
		frameTime: 20,
	},
}: PerformanceMonitoringWrapperProps) {
	const [metrics, setMetrics] = useState<PerformanceMetrics>({
		fps: 0,
		frameTime: 0,
		memoryUsage: 0,
		memoryPercentage: 0,
		cpuUsage: 0,
		drawCalls: 0,
		performanceScore: 100,
		warnings: [],
	});

	const [isExpanded, setIsExpanded] = useState(false);
	const frameCountRef = useRef(0);
	const lastTimeRef = useRef(performance.now());
	const fpsBufferRef = useRef<number[]>([]);
	const frameTimeBufferRef = useRef<number[]>([]);
	const animationFrameRef = useRef<number>();

	// Calculate FPS and frame time
	const updatePerformanceMetrics = useCallback(() => {
		const now = performance.now();
		const deltaTime = now - lastTimeRef.current;
		lastTimeRef.current = now;

		frameCountRef.current++;

		// Calculate instantaneous FPS
		const instantFPS = 1000 / deltaTime;

		// Buffer for smoothing
		fpsBufferRef.current.push(instantFPS);
		frameTimeBufferRef.current.push(deltaTime);

		const bufferSize = 60; // Average over 60 frames
		if (fpsBufferRef.current.length > bufferSize) {
			fpsBufferRef.current.shift();
			frameTimeBufferRef.current.shift();
		}

		// Calculate averages
		const avgFPS = fpsBufferRef.current.reduce((a, b) => a + b, 0) / fpsBufferRef.current.length;
		const avgFrameTime = frameTimeBufferRef.current.reduce((a, b) => a + b, 0) / frameTimeBufferRef.current.length;

		// Get memory info if available
		let memoryUsage = 0;
		let memoryPercentage = 0;

		if ("memory" in performance && (performance as any).memory) {
			const memoryInfo = (performance as any).memory;
			memoryUsage = memoryInfo.usedJSHeapSize / (1024 * 1024); // MB
			memoryPercentage = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
		}

		// Calculate CPU usage approximation
		const cpuUsage = Math.min(100, (avgFrameTime / 16.67) * 100); // Percentage of target frame time

		// Generate warnings
		const warnings: string[] = [];
		if (avgFPS < warningThreshold.fps) {
			warnings.push(`Low FPS: ${avgFPS.toFixed(1)}`);
		}
		if (memoryPercentage > warningThreshold.memory) {
			warnings.push(`High Memory: ${memoryPercentage.toFixed(1)}%`);
		}
		if (avgFrameTime > warningThreshold.frameTime) {
			warnings.push(`High Frame Time: ${avgFrameTime.toFixed(1)}ms`);
		}

		// Calculate performance score
		const fpsScore = Math.min(100, (avgFPS / 60) * 100);
		const memoryScore = Math.max(0, 100 - memoryPercentage);
		const frameTimeScore = Math.max(0, 100 - (avgFrameTime / 16.67) * 100);
		const performanceScore = (fpsScore + memoryScore + frameTimeScore) / 3;

		setMetrics({
			fps: avgFPS,
			frameTime: avgFrameTime,
			memoryUsage,
			memoryPercentage,
			cpuUsage,
			drawCalls: 0, // Would need WebGL context to measure
			performanceScore,
			warnings,
		});

		if (enabled) {
			animationFrameRef.current = requestAnimationFrame(updatePerformanceMetrics);
		}
	}, [enabled, warningThreshold]);

	// Start/stop monitoring
	useEffect(() => {
		if (enabled) {
			lastTimeRef.current = performance.now();
			animationFrameRef.current = requestAnimationFrame(updatePerformanceMetrics);
		} else {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [enabled, updatePerformanceMetrics]);

	if (!enabled) {
		return <>{children}</>;
	}

	// Position classes
	const positionClasses = {
		"top-right": "top-20 right-4",
		"top-left": "top-20 left-4",
		"bottom-right": "bottom-4 right-4",
		"bottom-left": "bottom-4 left-4",
	};

	// Performance status
	const getPerformanceStatus = () => {
		if (metrics.performanceScore >= 80) return { color: "text-green-400", icon: CheckCircle };
		if (metrics.performanceScore >= 60) return { color: "text-yellow-400", icon: AlertTriangle };
		return { color: "text-red-400", icon: AlertTriangle };
	};

	const status = getPerformanceStatus();
	const StatusIcon = status.icon;

	return (
		<>
			{children}

			{/* Performance Monitor */}
			<div className={`fixed ${positionClasses[position]} z-30`}>
				<div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden">
					{/* Header */}
					<button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
						<div className="flex items-center space-x-2">
							<Activity className="w-4 h-4 text-blue-400" />
							<span className="text-sm font-medium text-white">Performance</span>
						</div>
						<div className="flex items-center space-x-2">
							<span className={`text-xs font-mono ${status.color}`}>{metrics.fps.toFixed(0)} FPS</span>
							<StatusIcon className={`w-4 h-4 ${status.color}`} />
						</div>
					</button>

					{/* Expanded Details */}
					{isExpanded && (
						<div className="p-3 border-t border-slate-700/50 space-y-3">
							{/* Key Metrics */}
							<div className="grid grid-cols-2 gap-3 text-xs">
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="text-slate-400">FPS:</span>
										<span className={metrics.fps < warningThreshold.fps ? "text-red-400" : "text-green-400"}>{metrics.fps.toFixed(1)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Frame Time:</span>
										<span className={metrics.frameTime > warningThreshold.frameTime ? "text-red-400" : "text-green-400"}>{metrics.frameTime.toFixed(1)}ms</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Score:</span>
										<span className={status.color}>{metrics.performanceScore.toFixed(0)}%</span>
									</div>
								</div>
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="text-slate-400">Memory:</span>
										<span className={metrics.memoryPercentage > warningThreshold.memory ? "text-red-400" : "text-green-400"}>{metrics.memoryUsage.toFixed(0)}MB</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Usage:</span>
										<span className={metrics.memoryPercentage > warningThreshold.memory ? "text-red-400" : "text-green-400"}>{metrics.memoryPercentage.toFixed(1)}%</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">CPU:</span>
										<span className={metrics.cpuUsage > 80 ? "text-red-400" : "text-green-400"}>{metrics.cpuUsage.toFixed(0)}%</span>
									</div>
								</div>
							</div>

							{/* Performance Bar */}
							<div className="space-y-1">
								<div className="flex justify-between text-xs">
									<span className="text-slate-400">Performance</span>
									<span className={status.color}>{metrics.performanceScore.toFixed(0)}%</span>
								</div>
								<div className="w-full bg-slate-700 rounded-full h-2">
									<div className={`h-2 rounded-full transition-all duration-300 ${metrics.performanceScore >= 80 ? "bg-green-500" : metrics.performanceScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${Math.max(0, Math.min(100, metrics.performanceScore))}%` }} />
								</div>
							</div>

							{/* Warnings */}
							{metrics.warnings.length > 0 && (
								<div className="space-y-1">
									<div className="flex items-center space-x-1 text-xs text-yellow-400">
										<AlertTriangle className="w-3 h-3" />
										<span>Warnings:</span>
									</div>
									{metrics.warnings.map((warning, index) => (
										<div key={index} className="text-xs text-red-400 pl-4">
											• {warning}
										</div>
									))}
								</div>
							)}

							{/* Tips */}
							{metrics.performanceScore < 80 && (
								<div className="space-y-1">
									<div className="flex items-center space-x-1 text-xs text-blue-400">
										<Zap className="w-3 h-3" />
										<span>Tips:</span>
									</div>
									<div className="text-xs text-slate-400 pl-4 space-y-1">
										{metrics.fps < warningThreshold.fps && <div>• Reduce complexity or close other applications</div>}
										{metrics.memoryPercentage > warningThreshold.memory && <div>• Clear browser cache or restart application</div>}
										{metrics.frameTime > warningThreshold.frameTime && <div>• Lower graphics settings for better performance</div>}
									</div>
								</div>
							)}

							{/* Generator Info */}
							<div className="pt-2 border-t border-slate-700/50 text-xs text-slate-500">Monitoring: {generatorName}</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default PerformanceMonitoringWrapper;
