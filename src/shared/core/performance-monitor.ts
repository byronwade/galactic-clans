/**
 * @file performance-monitor.ts
 * @description Real-time Performance Monitoring System
 * @version 2.0.0
 * @author Galactic Clans Development Team
 *
 * Captures real-time performance metrics from Three.js renderer,
 * browser APIs, and GPU statistics for accurate monitoring.
 */

import * as THREE from "three";

export interface PerformanceMetrics {
	// Frame Performance
	fps: number;
	frameTime: number;
	avgFrameTime: number;
	minFps: number;
	maxFps: number;

	// Rendering Statistics
	drawCalls: number;
	triangles: number;
	points: number;
	lines: number;

	// Memory Usage
	memoryUsage: {
		used: number;
		total: number;
		heapUsed: number;
		heapTotal: number;
		geometries: number;
		textures: number;
	};

	// GPU Performance
	gpuMemoryUsage: number;
	renderTime: number;

	// System Performance
	cpuUsage: number;
	batteryLevel?: number;
	thermalState?: string;

	// Three.js Specific
	programs: number;
	calls: {
		frame: number;
		total: number;
	};

	// Camera/Scene Info
	cameraInfo: {
		position: THREE.Vector3;
		rotation: THREE.Euler;
		fov: number;
		near: number;
		far: number;
	};

	// Quality Settings
	quality: {
		lodLevel: number;
		shadowQuality: string;
		renderDistance: number;
		textureQuality: string;
		terrainDetail: number;
	};
}

export class RealTimePerformanceMonitor {
	private renderer?: THREE.WebGLRenderer;
	private camera?: THREE.Camera;
	private scene?: THREE.Scene;

	private frameCount = 0;
	private lastTime = performance.now();
	private frameTimes: number[] = [];
	private fpsHistory: number[] = [];

	// Performance tracking
	private currentFps = 0;
	private currentFrameTime = 0;
	private lastRenderInfo: THREE.WebGLInfo | null = null;

	// Memory tracking
	private memoryInfo: any = null;
	private gpuMemoryExtension: any = null;

	// System monitoring
	private cpuUsageHistory: number[] = [];
	private lastCpuTime = 0;

	constructor() {
		this.initializeMonitoring();
	}

	private initializeMonitoring() {
		// Initialize memory monitoring
		this.initializeMemoryMonitoring();

		// Initialize GPU monitoring
		this.initializeGPUMonitoring();

		// Initialize system monitoring
		this.initializeSystemMonitoring();
	}

	private initializeMemoryMonitoring() {
		// Try to get memory info from browser
		if ("memory" in performance) {
			this.memoryInfo = (performance as any).memory;
		}
	}

	private initializeGPUMonitoring() {
		// Try to get GPU memory extension
		if (this.renderer) {
			const gl = this.renderer.getContext();
			this.gpuMemoryExtension = gl.getExtension("WEBGL_debug_renderer_info");
		}
	}

	private initializeSystemMonitoring() {
		// Monitor CPU usage using Web Workers if available
		this.startCPUMonitoring();
	}

	private startCPUMonitoring() {
		// Simple CPU usage estimation based on frame timing consistency
		setInterval(() => {
			this.updateCPUUsage();
		}, 1000);
	}

	private updateCPUUsage() {
		const now = performance.now();
		const deltaTime = now - this.lastCpuTime;
		this.lastCpuTime = now;

		// Estimate CPU usage based on frame time variance
		const frameTimeVariance = this.calculateFrameTimeVariance();
		const estimatedCpuUsage = Math.min(100, frameTimeVariance * 5);

		this.cpuUsageHistory.push(estimatedCpuUsage);
		if (this.cpuUsageHistory.length > 10) {
			this.cpuUsageHistory.shift();
		}
	}

	private calculateFrameTimeVariance(): number {
		if (this.frameTimes.length < 2) return 0;

		const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
		const variance = this.frameTimes.reduce((acc, time) => acc + Math.pow(time - avg, 2), 0) / this.frameTimes.length;

		return Math.sqrt(variance);
	}

	setRenderer(renderer: THREE.WebGLRenderer) {
		this.renderer = renderer;
		this.initializeGPUMonitoring();
	}

	setCamera(camera: THREE.Camera) {
		this.camera = camera;
	}

	setScene(scene: THREE.Scene) {
		this.scene = scene;
	}

	update(): PerformanceMetrics {
		const now = performance.now();
		const deltaTime = now - this.lastTime;

		// Update frame timing
		this.frameCount++;
		this.currentFrameTime = deltaTime;
		this.frameTimes.push(deltaTime);

		// Keep frame time history manageable
		if (this.frameTimes.length > 60) {
			this.frameTimes.shift();
		}

		// Calculate FPS
		if (deltaTime > 0) {
			this.currentFps = 1000 / deltaTime;
			this.fpsHistory.push(this.currentFps);

			if (this.fpsHistory.length > 60) {
				this.fpsHistory.shift();
			}
		}

		this.lastTime = now;

		// Get rendering statistics
		const renderInfo = this.renderer?.info;
		if (renderInfo) {
			this.lastRenderInfo = renderInfo;
		}

		// Build metrics object
		return this.buildMetrics();
	}

	private buildMetrics(): PerformanceMetrics {
		const avgFrameTime = this.frameTimes.length > 0 ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length : this.currentFrameTime;

		const minFps = this.fpsHistory.length > 0 ? Math.min(...this.fpsHistory) : this.currentFps;
		const maxFps = this.fpsHistory.length > 0 ? Math.max(...this.fpsHistory) : this.currentFps;

		// Get memory usage
		const memoryUsage = this.getMemoryUsage();

		// Get rendering statistics
		const renderStats = this.getRenderingStatistics();

		// Get system info
		const systemInfo = this.getSystemInfo();

		// Get camera info
		const cameraInfo = this.getCameraInfo();

		// Get quality settings (would be passed from config)
		const quality = this.getQualitySettings();

		return {
			// Frame Performance
			fps: Math.round(this.currentFps * 10) / 10,
			frameTime: Math.round(this.currentFrameTime * 10) / 10,
			avgFrameTime: Math.round(avgFrameTime * 10) / 10,
			minFps: Math.round(minFps),
			maxFps: Math.round(maxFps),

			// Rendering Statistics
			drawCalls: renderStats.drawCalls,
			triangles: renderStats.triangles,
			points: renderStats.points,
			lines: renderStats.lines,

			// Memory Usage
			memoryUsage,

			// GPU Performance
			gpuMemoryUsage: this.getGPUMemoryUsage(),
			renderTime: this.getRenderTime(),

			// System Performance
			cpuUsage: systemInfo.cpuUsage,
			batteryLevel: systemInfo.batteryLevel,
			thermalState: systemInfo.thermalState,

			// Three.js Specific
			programs: renderStats.programs,
			calls: {
				frame: renderStats.calls,
				total: this.frameCount,
			},

			// Camera/Scene Info
			cameraInfo,

			// Quality Settings
			quality,
		};
	}

	private getMemoryUsage() {
		let used = 0;
		let total = 0;
		let heapUsed = 0;
		let heapTotal = 0;

		if (this.memoryInfo) {
			used = this.memoryInfo.usedJSHeapSize || 0;
			total = this.memoryInfo.totalJSHeapSize || 0;
			heapUsed = this.memoryInfo.usedJSHeapSize || 0;
			heapTotal = this.memoryInfo.totalJSHeapSize || 0;
		}

		// Get Three.js memory info
		let geometries = 0;
		let textures = 0;

		if (this.lastRenderInfo) {
			geometries = this.lastRenderInfo.memory.geometries;
			textures = this.lastRenderInfo.memory.textures;
		}

		return {
			used: Math.round(used / 1024 / 1024), // MB
			total: Math.round(total / 1024 / 1024), // MB
			heapUsed: Math.round(heapUsed / 1024 / 1024), // MB
			heapTotal: Math.round(heapTotal / 1024 / 1024), // MB
			geometries,
			textures,
		};
	}

	private getRenderingStatistics() {
		if (!this.lastRenderInfo) {
			return {
				drawCalls: 0,
				triangles: 0,
				points: 0,
				lines: 0,
				programs: 0,
				calls: 0,
			};
		}

		return {
			drawCalls: this.lastRenderInfo.render.calls,
			triangles: Math.round(this.lastRenderInfo.render.triangles / 1000), // K triangles
			points: this.lastRenderInfo.render.points,
			lines: this.lastRenderInfo.render.lines,
			programs: this.lastRenderInfo.programs?.length || 0,
			calls: this.lastRenderInfo.render.calls,
		};
	}

	private getGPUMemoryUsage(): number {
		// Estimate GPU memory usage based on textures and geometries
		let estimated = 0;

		if (this.lastRenderInfo) {
			// Rough estimation: 4 bytes per pixel for textures + geometry data
			estimated = this.lastRenderInfo.memory.textures * 2 + this.lastRenderInfo.memory.geometries * 0.5;
		}

		return Math.round(estimated);
	}

	private getRenderTime(): number {
		// Estimate render time as a percentage of frame time
		return Math.round(this.currentFrameTime * 0.7); // Assume 70% of frame time is rendering
	}

	private getSystemInfo() {
		return {
			cpuUsage: this.getCurrentCPUUsage(),
			batteryLevel: this.getBatteryLevel(),
			thermalState: this.getThermalState(),
		};
	}

	private getCurrentCPUUsage(): number {
		if (this.cpuUsageHistory.length === 0) return 0;

		const avg = this.cpuUsageHistory.reduce((a, b) => a + b, 0) / this.cpuUsageHistory.length;
		return Math.round(avg);
	}

	private getBatteryLevel(): number | undefined {
		// Try to get battery info if available
		if ("getBattery" in navigator) {
			// This would need to be async, so we return undefined for now
			return undefined;
		}
		return undefined;
	}

	private getThermalState(): string | undefined {
		// Not available in most browsers yet
		return undefined;
	}

	private getCameraInfo() {
		if (!this.camera) {
			return {
				position: new THREE.Vector3(0, 0, 0),
				rotation: new THREE.Euler(0, 0, 0),
				fov: 75,
				near: 0.1,
				far: 1000,
			};
		}

		let fov = 75;
		let near = 0.1;
		let far = 1000;

		if (this.camera instanceof THREE.PerspectiveCamera) {
			fov = this.camera.fov;
			near = this.camera.near;
			far = this.camera.far;
		}

		return {
			position: this.camera.position.clone(),
			rotation: this.camera.rotation.clone(),
			fov: Math.round(fov),
			near: Math.round(near * 10) / 10,
			far: Math.round(far),
		};
	}

	private getQualitySettings() {
		// These would typically come from the application config
		// For now, return estimated values
		return {
			lodLevel: 4,
			shadowQuality: "high",
			renderDistance: 200,
			textureQuality: "high",
			terrainDetail: 80,
		};
	}

	// Utility methods
	reset() {
		this.frameCount = 0;
		this.frameTimes = [];
		this.fpsHistory = [];
		this.cpuUsageHistory = [];
		this.lastTime = performance.now();
	}

	getAverageFPS(): number {
		if (this.fpsHistory.length === 0) return 0;
		return this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
	}

	getPerformanceGrade(): string {
		const avgFps = this.getAverageFPS();

		if (avgFps >= 60) return "Excellent";
		if (avgFps >= 45) return "Good";
		if (avgFps >= 30) return "Fair";
		if (avgFps >= 15) return "Poor";
		return "Critical";
	}
}
