/**
 * @file performance-monitor.ts
 * @description Central performance monitoring system for Galactic Clans
 * @version 1.0.0
 * @author Cosmic Gaming Development Team
 * @created 2024-01-15
 *
 * @purpose Extreme performance monitoring and optimization system
 * @dependencies error-system, error-handling-utils
 * @exports PerformanceMonitor, MemoryMonitor, CPUMonitor, and related classes
 */

import { ErrorRecoverable, SystemHealth, ErrorSeverity, ErrorCategory, GameError, ErrorLogger } from "./error-system";
import { ErrorRecoveryChain, ResourceCleanupManager } from "./error-handling-utils";

// =============================================================================
// PERFORMANCE INTERFACES & TYPES
// =============================================================================

export interface SystemPerformanceMetrics {
	// Timing Metrics
	averageFrameTime: number; // milliseconds
	worstFrameTime: number; // milliseconds
	frameTimeVariance: number; // consistency metric
	currentFPS: number; // frames per second

	// Memory Metrics
	memoryUsage: number; // bytes
	memoryGrowthRate: number; // bytes per second
	garbageCollectionFrequency: number; // collections per minute
	memoryPressure: number; // 0-1 scale

	// CPU Metrics
	cpuUsagePercentage: number; // 0-100%
	taskExecutionTimes: Map<string, number>; // task name -> avg time
	mainThreadBlocked: number; // percentage of time blocked

	// GPU Metrics (if available)
	drawCalls: number; // per frame
	trianglesRendered: number; // per frame
	textureMemoryUsage: number; // bytes
	shaderCompilationTime: number; // milliseconds

	// Network Metrics
	latency: number; // milliseconds
	bandwidthUsage: number; // bytes per second
	packetLoss: number; // percentage
	connectionStability: number; // 0-1 scale

	// Quality Metrics
	currentQualityLevel: number; // 0-10 scale
	qualityAdjustments: number; // automatic adjustments made
	adaptiveQualityActive: boolean; // whether auto-adjustment is active

	// System State
	timestamp: number; // when metrics were collected
	systemLoad: number; // overall system load 0-1
	performanceScore: number; // overall performance score 0-100
}

export interface PerformanceAlert {
	severity: "info" | "warning" | "critical" | "emergency";
	category: string;
	message: string;
	timestamp: number;
	metrics?: Partial<SystemPerformanceMetrics>;
	suggestedActions: string[];
}

export interface MemoryInfo {
	used: number;
	total: number;
	limit: number;
	percentage: number;
}

export interface QualityLevel {
	name: string;
	particles: number;
	shadows: boolean;
	antialiasing: number;
	textureQuality: number;
	renderDistance: number;
	effectsQuality: number;
	targetFPS: number;
}

// =============================================================================
// PERFORMANCE MONITOR (Main Class)
// =============================================================================

export class PerformanceMonitor implements ErrorRecoverable {
	private static instance: PerformanceMonitor;

	private readonly errorLogger: ErrorLogger;
	private readonly recoveryChain: ErrorRecoveryChain;
	private readonly cleanupManager: ResourceCleanupManager;

	// Core Monitoring Components
	private frameMonitor: FrameRateMonitor;
	private memoryMonitor: MemoryMonitor;
	private cpuMonitor: CPUMonitor;
	private qualityManager: QualityManager;
	private alertManager: AlertManager;

	// Performance State
	private isMonitoring = false;
	private metricsHistory: SystemPerformanceMetrics[] = [];
	private currentMetrics!: SystemPerformanceMetrics;
	private performanceTargets: PerformanceTargets;
	private startTime: number | null = null;

	// Configuration
	private readonly config = {
		targetFPS: 60,
		criticalFPS: 45,
		maxMemoryUsage: 512 * 1024 * 1024, // 512MB
		maxFrameTime: 16.67, // 60 FPS
		metricsHistorySize: 3600, // 1 hour at 1 sample/second
		alertCooldown: 5000, // 5 seconds between similar alerts
		autoQualityAdjustment: true,
		performanceRecoveryEnabled: true,
	};

	private constructor() {
		this.errorLogger = ErrorLogger.getInstance();
		this.recoveryChain = new ErrorRecoveryChain();
		this.cleanupManager = new ResourceCleanupManager();

		this.performanceTargets = {
			targetFPS: this.config.targetFPS,
			criticalFPS: this.config.criticalFPS,
			maxMemoryPercentage: 0.85,
			maxFrameTime: this.config.maxFrameTime,
			maxLatency: 100,
			minPerformanceScore: 70,
		};

		this.initializeMonitors();
		this.setupRecoveryStrategies();

		this.errorLogger.logInfo("PerformanceMonitor", "Performance monitoring system initialized");
	}

	public static getInstance(): PerformanceMonitor {
		if (!PerformanceMonitor.instance) {
			PerformanceMonitor.instance = new PerformanceMonitor();
		}
		return PerformanceMonitor.instance;
	}

	// =============================================================================
	// MONITORING CONTROL
	// =============================================================================

	public async startMonitoring(): Promise<void> {
		try {
			if (this.isMonitoring) {
				this.errorLogger.logWarning("PerformanceMonitor", "Monitoring already started");
				return;
			}

			this.isMonitoring = true;
			this.startTime = Date.now();

			// Start all monitoring subsystems
			await this.frameMonitor.start();
			await this.memoryMonitor.start();
			await this.cpuMonitor.start();
			await this.qualityManager.initialize();

			// Start continuous monitoring loop
			this.startMonitoringLoop();

			this.errorLogger.logInfo("PerformanceMonitor", "Performance monitoring started");
		} catch (error) {
			await this.executeFallback(error, "startMonitoring");
			throw new GameError("Failed to start performance monitoring", ErrorSeverity.HIGH, ErrorCategory.PERFORMANCE, { originalError: error });
		}
	}

	public async stopMonitoring(): Promise<void> {
		try {
			if (!this.isMonitoring) return;

			this.isMonitoring = false;

			// Stop all monitoring subsystems
			this.frameMonitor.stop();
			this.memoryMonitor.stop();
			this.cpuMonitor.stop();

			// Cleanup resources
			this.cleanupManager.cleanupAll();

			this.errorLogger.logInfo("PerformanceMonitor", "Performance monitoring stopped");
		} catch (error) {
			this.errorLogger.logError("PerformanceMonitor", "Error stopping monitoring", error);
		}
	}

	// =============================================================================
	// METRICS COLLECTION
	// =============================================================================

	public getCurrentMetrics(): SystemPerformanceMetrics {
		return { ...this.currentMetrics };
	}

	public getMetricsHistory(duration?: number): SystemPerformanceMetrics[] {
		if (!duration) return [...this.metricsHistory];

		const cutoffTime = Date.now() - duration;
		return this.metricsHistory.filter((m) => m.timestamp >= cutoffTime);
	}

	public getPerformanceScore(): number {
		if (!this.currentMetrics) return 0;

		let score = 100;

		// FPS score (40% weight)
		const fpsScore = Math.min(100, (this.currentMetrics.currentFPS / this.config.targetFPS) * 100);
		score = score * 0.4 + fpsScore * 0.4;

		// Memory score (30% weight)
		const memoryScore = Math.max(0, 100 - this.currentMetrics.memoryPressure * 100);
		score = score * 0.7 + memoryScore * 0.3;

		// CPU score (20% weight)
		const cpuScore = Math.max(0, 100 - this.currentMetrics.cpuUsagePercentage);
		score = score * 0.8 + cpuScore * 0.2;

		// Network score (10% weight)
		const networkScore = Math.max(0, 100 - this.currentMetrics.latency / 10);
		score = score * 0.9 + networkScore * 0.1;

		return Math.round(score);
	}

	// =============================================================================
	// PERFORMANCE MEASUREMENT UTILITIES
	// =============================================================================

	public measureTask<T>(taskName: string, task: () => T): T {
		return this.cpuMonitor.measureTask(taskName, task);
	}

	public async measureAsyncTask<T>(taskName: string, task: () => Promise<T>): Promise<T> {
		return await this.cpuMonitor.measureAsyncTask(taskName, task);
	}

	public startMeasurement(name: string): string {
		return this.cpuMonitor.startMeasurement(name);
	}

	public endMeasurement(measurementId: string): number {
		return this.cpuMonitor.endMeasurement(measurementId);
	}

	// =============================================================================
	// QUALITY MANAGEMENT
	// =============================================================================

	public adjustQuality(direction: "up" | "down" | "auto"): void {
		this.qualityManager.adjustQuality(direction, this.currentMetrics);
	}

	public setQualityLevel(level: number): void {
		this.qualityManager.setQualityLevel(level);
	}

	public getCurrentQuality(): QualityLevel {
		return this.qualityManager.getCurrentQuality();
	}

	// =============================================================================
	// ALERT SYSTEM
	// =============================================================================

	public getActiveAlerts(): PerformanceAlert[] {
		return this.alertManager.getActiveAlerts();
	}

	public clearAlerts(): void {
		this.alertManager.clearAlerts();
	}

	// =============================================================================
	// PRIVATE IMPLEMENTATION
	// =============================================================================

	private initializeMonitors(): void {
		this.frameMonitor = new FrameRateMonitor(this.config);
		this.memoryMonitor = new MemoryMonitor(this.config);
		this.cpuMonitor = new CPUMonitor(this.config);
		this.qualityManager = new QualityManager(this.config);
		this.alertManager = new AlertManager(this.config);

		this.currentMetrics = this.createEmptyMetrics();
	}

	private setupRecoveryStrategies(): void {
		// Primary Recovery: Reduce quality and clear caches
		this.recoveryChain.addStrategy("qualityReduction", async () => {
			this.qualityManager.adjustQuality("down", this.currentMetrics);
			await this.memoryMonitor.clearCaches();
			return true;
		});

		// Secondary Recovery: Restart monitoring systems
		this.recoveryChain.addStrategy("restartMonitoring", async () => {
			await this.stopMonitoring();
			await this.startMonitoring();
			return true;
		});

		// Emergency Recovery: Minimal performance mode
		this.recoveryChain.addStrategy("emergencyMode", async () => {
			this.qualityManager.setEmergencyMode();
			await this.memoryMonitor.emergencyCleanup();
			return true;
		});
	}

	private startMonitoringLoop(): void {
		const monitoringInterval = setInterval(() => {
			if (!this.isMonitoring) {
				clearInterval(monitoringInterval);
				return;
			}

			this.collectMetrics();
			this.analyzePerformance();
			this.updateQualityIfNeeded();
		}, 1000); // Collect metrics every second

		this.cleanupManager.addInterval(monitoringInterval);

		// High-frequency FPS monitoring
		const fpsInterval = setInterval(() => {
			if (!this.isMonitoring) {
				clearInterval(fpsInterval);
				return;
			}

			this.frameMonitor.measureFPS();
		}, 16); // Monitor FPS every frame (~60 FPS)

		this.cleanupManager.addInterval(fpsInterval);
	}

	private collectMetrics(): void {
		try {
			this.currentMetrics = {
				// Timing Metrics
				averageFrameTime: this.frameMonitor.getAverageFrameTime(),
				worstFrameTime: this.frameMonitor.getWorstFrameTime(),
				frameTimeVariance: this.frameMonitor.getFrameTimeVariance(),
				currentFPS: this.frameMonitor.getCurrentFPS(),

				// Memory Metrics
				memoryUsage: this.memoryMonitor.getCurrentUsage(),
				memoryGrowthRate: this.memoryMonitor.getGrowthRate(),
				garbageCollectionFrequency: this.memoryMonitor.getGCFrequency(),
				memoryPressure: this.memoryMonitor.getMemoryPressure(),

				// CPU Metrics
				cpuUsagePercentage: this.cpuMonitor.getCPUUsage(),
				taskExecutionTimes: this.cpuMonitor.getTaskTimes(),
				mainThreadBlocked: this.cpuMonitor.getMainThreadBlockedPercentage(),

				// GPU Metrics (placeholder - requires WebGL context)
				drawCalls: 0,
				trianglesRendered: 0,
				textureMemoryUsage: 0,
				shaderCompilationTime: 0,

				// Network Metrics (placeholder - requires network monitoring)
				latency: 0,
				bandwidthUsage: 0,
				packetLoss: 0,
				connectionStability: 1.0,

				// Quality Metrics
				currentQualityLevel: this.qualityManager.getCurrentLevel(),
				qualityAdjustments: this.qualityManager.getAdjustmentCount(),
				adaptiveQualityActive: this.qualityManager.isAdaptiveActive(),

				// System State
				timestamp: Date.now(),
				systemLoad: this.calculateSystemLoad(),
				performanceScore: 0, // Will be calculated after metrics are set
			};

			this.currentMetrics.performanceScore = this.getPerformanceScore();

			// Add to history
			this.metricsHistory.push({ ...this.currentMetrics });

			// Limit history size
			if (this.metricsHistory.length > this.config.metricsHistorySize) {
				this.metricsHistory.shift();
			}
		} catch (error) {
			this.errorLogger.logError("PerformanceMonitor", "Error collecting metrics", error);
		}
	}

	private analyzePerformance(): void {
		try {
			// Skip alerts during startup grace period
			const currentTime = Date.now();
			if (this.startTime && currentTime - this.startTime < 10000) {
				// 10 seconds grace period
				return;
			}

			const alerts: PerformanceAlert[] = [];

			// Check FPS
			if (this.currentMetrics.currentFPS < this.performanceTargets.criticalFPS) {
				alerts.push({
					severity: "critical",
					category: "fps",
					message: `Critical FPS drop: ${this.currentMetrics.currentFPS.toFixed(1)} FPS`,
					timestamp: Date.now(),
					metrics: { currentFPS: this.currentMetrics.currentFPS },
					suggestedActions: ["Reduce quality settings", "Close background applications", "Restart game"],
				});
			} else if (this.currentMetrics.currentFPS < this.performanceTargets.targetFPS * 0.8) {
				alerts.push({
					severity: "warning",
					category: "fps",
					message: `Low FPS detected: ${this.currentMetrics.currentFPS.toFixed(1)} FPS`,
					timestamp: Date.now(),
					metrics: { currentFPS: this.currentMetrics.currentFPS },
					suggestedActions: ["Consider reducing quality settings"],
				});
			}

			// Check Memory
			if (this.currentMetrics.memoryPressure > 0.9) {
				alerts.push({
					severity: "emergency",
					category: "memory",
					message: `Critical memory usage: ${(this.currentMetrics.memoryPressure * 100).toFixed(1)}%`,
					timestamp: Date.now(),
					metrics: { memoryPressure: this.currentMetrics.memoryPressure },
					suggestedActions: ["Force garbage collection", "Clear asset caches", "Emergency mode"],
				});
			} else if (this.currentMetrics.memoryPressure > 0.8) {
				alerts.push({
					severity: "critical",
					category: "memory",
					message: `High memory usage: ${(this.currentMetrics.memoryPressure * 100).toFixed(1)}%`,
					timestamp: Date.now(),
					metrics: { memoryPressure: this.currentMetrics.memoryPressure },
					suggestedActions: ["Clear caches", "Unload unused assets"],
				});
			}

			// Check Frame Time Variance (frame consistency) - Increased threshold for development
			if (this.currentMetrics.frameTimeVariance > 50.0) {
				alerts.push({
					severity: "warning",
					category: "performance",
					message: `Inconsistent frame times: ${this.currentMetrics.frameTimeVariance.toFixed(2)}ms variance`,
					timestamp: Date.now(),
					metrics: { frameTimeVariance: this.currentMetrics.frameTimeVariance },
					suggestedActions: ["Check for background processes", "Reduce quality settings"],
				});
			}

			// Send alerts to alert manager
			alerts.forEach((alert) => this.alertManager.addAlert(alert));
		} catch (error) {
			this.errorLogger.logError("PerformanceMonitor", "Error analyzing performance", error);
		}
	}

	private updateQualityIfNeeded(): void {
		if (!this.config.autoQualityAdjustment) return;

		try {
			this.qualityManager.adjustQuality("auto", this.currentMetrics);
		} catch (error) {
			this.errorLogger.logError("PerformanceMonitor", "Error updating quality", error);
		}
	}

	private calculateSystemLoad(): number {
		// Combine multiple metrics to get overall system load
		const fpsLoad = Math.max(0, 1 - this.currentMetrics.currentFPS / this.config.targetFPS);
		const memoryLoad = this.currentMetrics.memoryPressure;
		const cpuLoad = this.currentMetrics.cpuUsagePercentage / 100;

		return Math.min(1, fpsLoad * 0.4 + memoryLoad * 0.4 + cpuLoad * 0.2);
	}

	private createEmptyMetrics(): SystemPerformanceMetrics {
		return {
			averageFrameTime: 16.67,
			worstFrameTime: 16.67,
			frameTimeVariance: 0,
			currentFPS: 60,
			memoryUsage: 0,
			memoryGrowthRate: 0,
			garbageCollectionFrequency: 0,
			memoryPressure: 0,
			cpuUsagePercentage: 0,
			taskExecutionTimes: new Map(),
			mainThreadBlocked: 0,
			drawCalls: 0,
			trianglesRendered: 0,
			textureMemoryUsage: 0,
			shaderCompilationTime: 0,
			latency: 0,
			bandwidthUsage: 0,
			packetLoss: 0,
			connectionStability: 1.0,
			currentQualityLevel: 5,
			qualityAdjustments: 0,
			adaptiveQualityActive: true,
			timestamp: Date.now(),
			systemLoad: 0,
			performanceScore: 100,
		};
	}

	// =============================================================================
	// ERROR HANDLING INTERFACE IMPLEMENTATION
	// =============================================================================

	public async executeFallback(error: Error, context?: any): Promise<boolean> {
		try {
			this.errorLogger.logError("PerformanceMonitor", "Executing fallback strategy", error, context);

			return await this.recoveryChain.execute();
		} catch (fallbackError) {
			this.errorLogger.logError("PerformanceMonitor", "Fallback execution failed", fallbackError);
			return false;
		}
	}

	public getSystemState(): any {
		return {
			isMonitoring: this.isMonitoring,
			currentMetrics: this.currentMetrics,
			metricsHistorySize: this.metricsHistory.length,
			performanceScore: this.getPerformanceScore(),
			activeAlerts: this.alertManager.getActiveAlerts().length,
			qualityLevel: this.qualityManager.getCurrentLevel(),
			config: this.config,
		};
	}

	public validateState(): boolean {
		try {
			// Check if monitoring subsystems are healthy
			if (!this.frameMonitor || !this.memoryMonitor || !this.cpuMonitor) {
				return false;
			}

			// Check if metrics are being collected
			if (this.isMonitoring && !this.currentMetrics) {
				return false;
			}

			// Check if performance is within acceptable range
			if (this.currentMetrics && this.currentMetrics.performanceScore < 10) {
				return false;
			}

			return true;
		} catch (error) {
			this.errorLogger.logError("PerformanceMonitor", "State validation failed", error);
			return false;
		}
	}

	public async resetToSafeState(): Promise<void> {
		try {
			this.errorLogger.logWarning("PerformanceMonitor", "Resetting to safe state");

			// Stop monitoring
			await this.stopMonitoring();

			// Reset quality to safe level
			this.qualityManager.setSafeQuality();

			// Clear caches and force cleanup
			await this.memoryMonitor.emergencyCleanup();

			// Clear alerts
			this.alertManager.clearAlerts();

			// Reset metrics
			this.currentMetrics = this.createEmptyMetrics();
			this.metricsHistory = [];

			// Restart monitoring
			await this.startMonitoring();
		} catch (error) {
			this.errorLogger.logError("PerformanceMonitor", "Failed to reset to safe state", error);
		}
	}

	public getHealthStatus(): SystemHealth {
		try {
			const issues: string[] = [];
			let performance = 100;

			if (!this.isMonitoring) {
				issues.push("Performance monitoring not active");
				performance -= 50;
			}

			if (this.currentMetrics) {
				if (this.currentMetrics.currentFPS < this.performanceTargets.criticalFPS) {
					issues.push(`Critical FPS: ${this.currentMetrics.currentFPS.toFixed(1)}`);
					performance -= 30;
				}

				if (this.currentMetrics.memoryPressure > 0.9) {
					issues.push(`Critical memory usage: ${(this.currentMetrics.memoryPressure * 100).toFixed(1)}%`);
					performance -= 40;
				}

				if (this.currentMetrics.performanceScore < 50) {
					issues.push(`Low performance score: ${this.currentMetrics.performanceScore}`);
					performance -= 20;
				}
			}

			const activeAlerts = this.alertManager.getActiveAlerts();
			if (activeAlerts.length > 0) {
				issues.push(`${activeAlerts.length} active performance alerts`);
				performance -= activeAlerts.length * 5;
			}

			let status: "healthy" | "degraded" | "critical" | "failed";
			if (performance >= 80) status = "healthy";
			else if (performance >= 50) status = "degraded";
			else if (performance >= 20) status = "critical";
			else status = "failed";

			return {
				status,
				issues,
				performance: Math.max(0, performance),
				recoverySuggestions: this.generateRecoverySuggestions(issues),
			};
		} catch (error) {
			this.errorLogger.logError("PerformanceMonitor", "Error getting health status", error);
			return {
				status: "failed",
				issues: ["Health check failed"],
				performance: 0,
				recoverySuggestions: ["Restart performance monitoring"],
			};
		}
	}

	private generateRecoverySuggestions(issues: string[]): string[] {
		const suggestions: string[] = [];

		if (issues.some((i) => i.includes("monitoring not active"))) {
			suggestions.push("Start performance monitoring");
		}

		if (issues.some((i) => i.includes("Critical FPS"))) {
			suggestions.push("Reduce graphics quality");
			suggestions.push("Close background applications");
		}

		if (issues.some((i) => i.includes("memory usage"))) {
			suggestions.push("Clear asset caches");
			suggestions.push("Force garbage collection");
		}

		if (issues.some((i) => i.includes("performance score"))) {
			suggestions.push("Enable adaptive quality");
			suggestions.push("Restart game in safe mode");
		}

		return suggestions;
	}
}

// =============================================================================
// FRAME RATE MONITOR
// =============================================================================

class FrameRateMonitor {
	private frameCount = 0;
	private lastTime = performance.now();
	private fps = 60;
	private fpsHistory: number[] = [];
	private frameTimes: number[] = [];
	private isActive = false;

	constructor(private config: any) {}

	public async start(): Promise<void> {
		this.isActive = true;
		this.frameCount = 0;
		this.lastTime = performance.now();
	}

	public stop(): void {
		this.isActive = false;
	}

	public measureFPS(): number {
		if (!this.isActive) return this.fps;

		const currentTime = performance.now();
		const frameTime = currentTime - this.lastTime;

		this.frameCount++;
		this.frameTimes.push(frameTime);

		// Keep only last 60 frame times (1 second at 60 FPS)
		if (this.frameTimes.length > 60) {
			this.frameTimes.shift();
		}

		// Calculate FPS every second
		if (currentTime - this.lastTime >= 1000) {
			this.fps = this.frameCount;
			this.fpsHistory.push(this.fps);

			// Keep only last 60 seconds of FPS data
			if (this.fpsHistory.length > 60) {
				this.fpsHistory.shift();
			}

			// Alert if FPS drops below threshold
			if (this.fps < this.config.criticalFPS) {
				console.warn(`🚨 [PERFORMANCE:CRITICAL] FPS dropped to ${this.fps}`);
			}

			this.frameCount = 0;
			this.lastTime = currentTime;
		}

		return this.fps;
	}

	public getCurrentFPS(): number {
		return this.fps;
	}

	public getAverageFrameTime(): number {
		if (this.frameTimes.length === 0) return 16.67;

		const sum = this.frameTimes.reduce((a, b) => a + b, 0);
		return sum / this.frameTimes.length;
	}

	public getWorstFrameTime(): number {
		if (this.frameTimes.length === 0) return 16.67;

		return Math.max(...this.frameTimes);
	}

	public getFrameTimeVariance(): number {
		if (this.frameTimes.length < 2) return 0;

		const avg = this.getAverageFrameTime();
		const variance = this.frameTimes.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / this.frameTimes.length;
		return Math.sqrt(variance);
	}
}

// =============================================================================
// MEMORY MONITOR
// =============================================================================

class MemoryMonitor {
	private memoryHistory: MemoryInfo[] = [];
	private lastGCTime = Date.now();
	private gcCount = 0;
	private isActive = false;

	constructor(private config: any) {}

	public async start(): Promise<void> {
		this.isActive = true;
		this.memoryHistory = [];
	}

	public stop(): void {
		this.isActive = false;
	}

	public getCurrentUsage(): number {
		const memory = this.getMemoryInfo();
		return memory.used;
	}

	public getMemoryPressure(): number {
		const memory = this.getMemoryInfo();
		return memory.percentage;
	}

	public getGrowthRate(): number {
		if (this.memoryHistory.length < 2) return 0;

		const recent = this.memoryHistory.slice(-10); // Last 10 samples
		if (recent.length < 2) return 0;

		const timeDiff = recent[recent.length - 1].limit - recent[0].limit; // timestamp difference
		const memDiff = recent[recent.length - 1].used - recent[0].used;

		return timeDiff > 0 ? (memDiff / timeDiff) * 1000 : 0; // bytes per second
	}

	public getGCFrequency(): number {
		const timeDiff = Date.now() - this.lastGCTime;
		return timeDiff > 0 ? (this.gcCount / timeDiff) * 60000 : 0; // GCs per minute
	}

	public async clearCaches(): Promise<void> {
		// Clear various game caches
		if ("caches" in window) {
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map((name) => caches.delete(name)));
		}

		// Force garbage collection if available
		if (window.gc) {
			window.gc();
			this.gcCount++;
		}
	}

	public async emergencyCleanup(): Promise<void> {
		console.warn("🚨 [MEMORY:EMERGENCY] Performing emergency cleanup");

		// Clear all caches
		await this.clearCaches();

		// Force multiple GC cycles
		for (let i = 0; i < 3; i++) {
			if (window.gc) {
				window.gc();
				this.gcCount++;
			}
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		// Clear memory history to free up space
		this.memoryHistory.splice(0, this.memoryHistory.length - 10);
	}

	private getMemoryInfo(): MemoryInfo {
		const memory = (performance as any).memory;
		if (memory) {
			const info = {
				used: memory.usedJSHeapSize,
				total: memory.totalJSHeapSize,
				limit: memory.jsHeapSizeLimit,
				percentage: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
			};

			this.memoryHistory.push(info);

			// Keep only last 300 samples (5 minutes at 1 sample/second)
			if (this.memoryHistory.length > 300) {
				this.memoryHistory.shift();
			}

			return info;
		}

		// Fallback for browsers without memory API
		return {
			used: 0,
			total: 0,
			limit: 512 * 1024 * 1024, // 512MB estimate
			percentage: 0,
		};
	}
}

// =============================================================================
// CPU MONITOR
// =============================================================================

class CPUMonitor {
	private taskTimes = new Map<string, number[]>();
	private activeMeasurements = new Map<string, number>();
	private mainThreadBlocked = 0;
	private totalTaskTime = 0;
	private measurementCount = 0;
	private isActive = false;

	constructor(private config: any) {}

	public async start(): Promise<void> {
		this.isActive = true;
		this.taskTimes.clear();
		this.activeMeasurements.clear();
	}

	public stop(): void {
		this.isActive = false;
	}

	public measureTask<T>(taskName: string, task: () => T): T {
		if (!this.isActive) return task();

		const startTime = performance.now();

		try {
			const result = task();
			const duration = performance.now() - startTime;

			this.recordTaskTime(taskName, duration);

			if (duration > this.config.maxFrameTime) {
				console.warn(`⏱️ [CPU:SLOW] ${taskName} took ${duration.toFixed(2)}ms (> ${this.config.maxFrameTime}ms)`);
			}

			return result;
		} catch (error) {
			const duration = performance.now() - startTime;
			console.error(`💥 [CPU:ERROR] ${taskName} failed after ${duration.toFixed(2)}ms`, error);
			throw error;
		}
	}

	public async measureAsyncTask<T>(taskName: string, task: () => Promise<T>): Promise<T> {
		if (!this.isActive) return await task();

		const startTime = performance.now();

		try {
			const result = await task();
			const duration = performance.now() - startTime;

			this.recordTaskTime(taskName, duration);

			if (duration > 100) {
				// Async tasks should complete within 100ms
				console.warn(`⏱️ [ASYNC:SLOW] ${taskName} took ${duration.toFixed(2)}ms`);
			}

			return result;
		} catch (error) {
			const duration = performance.now() - startTime;
			console.error(`💥 [ASYNC:ERROR] ${taskName} failed after ${duration.toFixed(2)}ms`, error);
			throw error;
		}
	}

	public startMeasurement(name: string): string {
		const id = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		this.activeMeasurements.set(id, performance.now());
		return id;
	}

	public endMeasurement(measurementId: string): number {
		const startTime = this.activeMeasurements.get(measurementId);
		if (!startTime) return 0;

		const duration = performance.now() - startTime;
		this.activeMeasurements.delete(measurementId);

		return duration;
	}

	public getCPUUsage(): number {
		// Estimate CPU usage based on task execution times
		if (this.measurementCount === 0) return 0;

		const avgTaskTime = this.totalTaskTime / this.measurementCount;
		const frameTime = 1000 / 60; // 16.67ms for 60 FPS

		return Math.min(100, (avgTaskTime / frameTime) * 100);
	}

	public getTaskTimes(): Map<string, number> {
		const averages = new Map<string, number>();

		for (const [taskName, times] of this.taskTimes) {
			const avg = times.reduce((a, b) => a + b, 0) / times.length;
			averages.set(taskName, avg);
		}

		return averages;
	}

	public getMainThreadBlockedPercentage(): number {
		return this.mainThreadBlocked;
	}

	private recordTaskTime(taskName: string, duration: number): void {
		if (!this.taskTimes.has(taskName)) {
			this.taskTimes.set(taskName, []);
		}

		const times = this.taskTimes.get(taskName)!;
		times.push(duration);

		// Keep only last 100 measurements per task
		if (times.length > 100) {
			times.shift();
		}

		// Update overall statistics
		this.totalTaskTime += duration;
		this.measurementCount++;

		// Update main thread blocked percentage
		if (duration > this.config.maxFrameTime) {
			this.mainThreadBlocked = Math.min(100, this.mainThreadBlocked + 1);
		} else {
			this.mainThreadBlocked = Math.max(0, this.mainThreadBlocked - 0.1);
		}
	}
}

// =============================================================================
// QUALITY MANAGER
// =============================================================================

class QualityManager {
	private qualityLevels: QualityLevel[] = [
		{ name: "Ultra", particles: 1000, shadows: true, antialiasing: 4, textureQuality: 1.0, renderDistance: 1.0, effectsQuality: 1.0, targetFPS: 60 },
		{ name: "High", particles: 500, shadows: true, antialiasing: 2, textureQuality: 0.8, renderDistance: 0.9, effectsQuality: 0.8, targetFPS: 60 },
		{ name: "Medium", particles: 250, shadows: false, antialiasing: 1, textureQuality: 0.6, renderDistance: 0.8, effectsQuality: 0.6, targetFPS: 45 },
		{ name: "Low", particles: 100, shadows: false, antialiasing: 0, textureQuality: 0.4, renderDistance: 0.6, effectsQuality: 0.4, targetFPS: 30 },
		{ name: "Minimal", particles: 50, shadows: false, antialiasing: 0, textureQuality: 0.2, renderDistance: 0.4, effectsQuality: 0.2, targetFPS: 30 },
	];

	private currentLevel = 1; // Start at High quality
	private adjustmentCount = 0;
	private lastAdjustment = 0;
	private stableFramesCount = 0;
	private adaptiveActive = true;

	constructor(private config: any) {}

	public async initialize(): Promise<void> {
		this.currentLevel = 1; // High quality
		this.adjustmentCount = 0;
		console.log(`🎨 [QUALITY] Initialized at ${this.qualityLevels[this.currentLevel].name} quality`);
	}

	public adjustQuality(direction: "up" | "down" | "auto", metrics?: SystemPerformanceMetrics): void {
		const now = Date.now();

		// Prevent too frequent adjustments
		if (now - this.lastAdjustment < 5000) return;

		let targetLevel = this.currentLevel;

		if (direction === "auto" && metrics) {
			// Automatic quality adjustment based on performance
			if (metrics.currentFPS < this.qualityLevels[this.currentLevel].targetFPS * 0.8 || metrics.memoryPressure > 0.85) {
				targetLevel = Math.max(0, this.currentLevel - 1);
				this.stableFramesCount = 0;
			} else if (metrics.currentFPS > this.qualityLevels[this.currentLevel].targetFPS && metrics.memoryPressure < 0.6) {
				this.stableFramesCount++;

				// Only increase quality after stable performance for 30 seconds
				if (this.stableFramesCount > 30) {
					targetLevel = Math.min(this.qualityLevels.length - 1, this.currentLevel + 1);
					this.stableFramesCount = 0;
				}
			}
		} else if (direction === "down") {
			targetLevel = Math.max(0, this.currentLevel - 1);
		} else if (direction === "up") {
			targetLevel = Math.min(this.qualityLevels.length - 1, this.currentLevel + 1);
		}

		if (targetLevel !== this.currentLevel) {
			this.setQualityLevel(targetLevel);
		}
	}

	public setQualityLevel(level: number): void {
		if (level === this.currentLevel) return;

		const oldLevel = this.qualityLevels[this.currentLevel];
		const newLevel = this.qualityLevels[level];

		this.currentLevel = level;
		this.lastAdjustment = Date.now();
		this.adjustmentCount++;

		// Only log significant quality changes (not every minor adjustment)
		const levelDifference = Math.abs(level - this.qualityLevels.findIndex((q) => q.name === oldLevel.name));
		if (levelDifference > 1 || level === 0 || level === this.qualityLevels.length - 1) {
			console.log(`🎨 [QUALITY] ${oldLevel.name} → ${newLevel.name} (${levelDifference > 1 ? "significant " : ""}change)`);
		}

		// Apply quality settings
		this.applyQualitySettings(newLevel);

		// Notify listeners
		window.dispatchEvent(
			new CustomEvent("qualityChanged", {
				detail: { oldLevel: oldLevel.name, newLevel: newLevel.name, level },
			})
		);
	}

	public getCurrentLevel(): number {
		return this.currentLevel;
	}

	public getCurrentQuality(): QualityLevel {
		return this.qualityLevels[this.currentLevel];
	}

	public getAdjustmentCount(): number {
		return this.adjustmentCount;
	}

	public isAdaptiveActive(): boolean {
		return this.adaptiveActive;
	}

	public setAdaptiveActive(active: boolean): void {
		this.adaptiveActive = active;
	}

	public setSafeQuality(): void {
		this.setQualityLevel(3); // Low quality
	}

	public setEmergencyMode(): void {
		this.setQualityLevel(4); // Minimal quality
		console.warn("🚨 [QUALITY] Emergency mode activated - minimal quality");
	}

	private applyQualitySettings(quality: QualityLevel): void {
		// Emit event for game systems to adjust their settings
		window.dispatchEvent(
			new CustomEvent("qualityChange", {
				detail: quality,
			})
		);

		// TODO: Apply settings to specific game systems
		// - Particle system: quality.particles
		// - Shadow system: quality.shadows
		// - Antialiasing: quality.antialiasing
		// - Texture quality: quality.textureQuality
		// - Render distance: quality.renderDistance
		// - Effects quality: quality.effectsQuality
	}
}

// =============================================================================
// ALERT MANAGER
// =============================================================================

class AlertManager {
	private activeAlerts: PerformanceAlert[] = [];
	private alertHistory: PerformanceAlert[] = [];
	private lastAlertTimes = new Map<string, number>();

	constructor(private config: any) {}

	public addAlert(alert: PerformanceAlert): void {
		const alertKey = `${alert.category}_${alert.severity}`;
		const lastTime = this.lastAlertTimes.get(alertKey) || 0;

		// Prevent spam alerts
		if (Date.now() - lastTime < this.config.alertCooldown) {
			return;
		}

		this.activeAlerts.push(alert);
		this.alertHistory.push(alert);
		this.lastAlertTimes.set(alertKey, Date.now());

		// Keep only last 100 alerts in history
		if (this.alertHistory.length > 100) {
			this.alertHistory.shift();
		}

		// Log alert based on severity
		switch (alert.severity) {
			case "emergency":
				console.error(`🚨 [ALERT:EMERGENCY] ${alert.message}`);
				break;
			case "critical":
				console.error(`❗ [ALERT:CRITICAL] ${alert.message}`);
				break;
			case "warning":
				console.warn(`⚠️ [ALERT:WARNING] ${alert.message}`);
				break;
			case "info":
				console.info(`ℹ️ [ALERT:INFO] ${alert.message}`);
				break;
		}

		// Auto-clear old alerts (older than 5 minutes)
		this.clearOldAlerts();
	}

	public getActiveAlerts(): PerformanceAlert[] {
		return [...this.activeAlerts];
	}

	public clearAlerts(): void {
		this.activeAlerts = [];
	}

	public getAlertHistory(): PerformanceAlert[] {
		return [...this.alertHistory];
	}

	private clearOldAlerts(): void {
		const cutoffTime = Date.now() - 300000; // 5 minutes
		this.activeAlerts = this.activeAlerts.filter((alert) => alert.timestamp > cutoffTime);
	}
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

interface PerformanceTargets {
	targetFPS: number;
	criticalFPS: number;
	maxMemoryPercentage: number;
	maxFrameTime: number;
	maxLatency: number;
	minPerformanceScore: number;
}

// =============================================================================
// PERFORMANCE PROFILING UTILITIES
// =============================================================================

/**
 * Wrapper function for profiling regular functions
 */
export function profiledFunction<T extends any[], R>(name: string, fn: (...args: T) => R): (...args: T) => R {
	return (...args: T): R => {
		const monitor = PerformanceMonitor.getInstance();
		return monitor.measureTask(name, () => fn(...args));
	};
}

/**
 * Wrapper function for profiling async functions
 */
export function profiledAsyncFunction<T extends any[], R>(name: string, fn: (...args: T) => Promise<R>): (...args: T) => Promise<R> {
	return async (...args: T): Promise<R> => {
		const monitor = PerformanceMonitor.getInstance();
		return await monitor.measureAsyncTask(name, () => fn(...args));
	};
}

/**
 * Performance measurement decorator for class methods
 */
export function measurePerformance(taskName?: string) {
	return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
		const method = descriptor.value;
		const name = taskName || `${target.constructor.name}.${propertyName}`;

		descriptor.value = function (...args: any[]) {
			const monitor = PerformanceMonitor.getInstance();
			return monitor.measureTask(name, () => method.apply(this, args));
		};

		return descriptor;
	};
}

/**
 * Global performance dashboard for UI integration
 */
export class PerformanceDashboard {
	public static reportMetrics(systemName: string, metrics: SystemPerformanceMetrics): void {
		const monitor = PerformanceMonitor.getInstance();

		// Update dashboard display
		window.dispatchEvent(
			new CustomEvent("performanceUpdate", {
				detail: { systemName, metrics },
			})
		);

		// Check for alerts
		PerformanceDashboard.checkAlerts(systemName, metrics);
	}

	private static checkAlerts(systemName: string, metrics: SystemPerformanceMetrics): void {
		const alerts: string[] = [];

		if (metrics.averageFrameTime > 16.67) {
			alerts.push(`${systemName}: Frame time too high (${metrics.averageFrameTime.toFixed(2)}ms)`);
		}

		if (metrics.memoryUsage > 512 * 1024 * 1024) {
			alerts.push(`${systemName}: Memory usage too high (${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB)`);
		}

		if (metrics.currentFPS < 45) {
			alerts.push(`${systemName}: Critical FPS drop (${metrics.currentFPS.toFixed(1)} FPS)`);
		}

		if (alerts.length > 0) {
			console.warn(`🚨 [ALERTS:${systemName}]`, alerts);
		}
	}
}

export default PerformanceMonitor;
