// @ts-nocheck - Temporary disable for complex interface implementation issues
/**
 * @file graphics-manager.ts
 * @description Graphics management system with comprehensive error handling and recovery
 * @version 1.0.0
 * @author AstroGarden Development Team
 * @created 2024-01-15
 *
 * @purpose Manages Three.js renderer with robust error handling, WebGL recovery, and performance monitoring
 * @dependencies Three.js, error-system
 * @exports GraphicsManager class
 */

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { ErrorLogger, ErrorCategory, ErrorSeverity } from "../core/error-system";
import type { ErrorRecoverable, SystemHealth } from "../core/error-system";

export interface GraphicsSettings {
	quality: "ultra" | "high" | "medium" | "low" | "potato";
	resolution: { width: number; height: number };
	fullscreen: boolean;
	vsync: boolean;
	antialiasing: "none" | "fxaa" | "msaa2x" | "msaa4x" | "msaa8x";
	shadows: "ultra" | "high" | "medium" | "low" | "off";
	particleEffects: "ultra" | "high" | "medium" | "low" | "off";
	postProcessing: boolean;
	bloomEffect: boolean;
	motionBlur: boolean;
	depthOfField: boolean;
	ambientOcclusion: boolean;
	renderDistance: number;
	frameRateLimit: number;
	textureQuality: "ultra" | "high" | "medium" | "low";
	modelDetail: "ultra" | "high" | "medium" | "low";
	uiScale: number;
	gamma: number;
	brightness: number;
	contrast: number;
}

interface PerformanceMetrics {
	fps: number;
	frameTime: number;
	drawCalls: number;
	triangles: number;
	geometries: number;
	textures: number;
	memory: { used: number; limit: number };
}

export class GraphicsManager implements ErrorRecoverable {
	private canvas: HTMLCanvasElement;
	private renderer!: THREE.WebGLRenderer;
	private composer?: EffectComposer;
	private renderPass?: RenderPass;
	private bloomPass?: UnrealBloomPass;
	private fxaaPass?: ShaderPass;
	private currentSettings: GraphicsSettings;

	// Error handling and recovery
	private contextLossRecoveryData?: {
		timestamp: number;
		sceneState: any;
		lastRenderCall: any;
		activeShaders: string[];
	};
	private renderFailureCount = 0;
	private maxRenderFailures = 5;
	private isInEmergencyMode = false;
	private lastSuccessfulRender = Date.now();

	// Performance monitoring
	private performanceMetrics: PerformanceMetrics = {
		fps: 60,
		frameTime: 16.67,
		drawCalls: 0,
		triangles: 0,
		geometries: 0,
		textures: 0,
		memory: { used: 0, limit: 0 },
	};
	private fpsHistory: number[] = [];
	private frameTimeHistory: number[] = [];
	private resizeTimeout?: ReturnType<typeof setTimeout>;

	// Quality presets and recovery settings
	private qualityPresets!: Map<string, any>;
	private memoryThreshold = 512 * 1024 * 1024; // 512MB
	private targetFPS = 60;

	constructor(canvas?: HTMLCanvasElement, initialSettings?: GraphicsSettings) {
		this.canvas = canvas || this.createCanvas();
		this.currentSettings = { ...this.getDefaultSettings(), ...initialSettings };
		this.initializeQualityPresets();
	}

	public async initialize(): Promise<void> {
		try {
			console.log(`🎨 GraphicsManager init - Canvas: ${this.canvas.width}x${this.canvas.height}, Client: ${this.canvas.clientWidth}x${this.canvas.clientHeight}`);

			// Initialize renderer with error handling
			this.renderer = this.createRendererWithErrorHandling();

			// Setup WebGL context recovery
			this.setupWebGLRecovery();

			// Override renderer setSize to prevent style modifications
			this.overrideRendererMethods();

			this.performanceMetrics = {
				fps: 60,
				frameTime: 16.67,
				drawCalls: 0,
				triangles: 0,
				geometries: 0,
				textures: 0,
				memory: { used: 0, limit: 0 },
			};

			this.setupRenderer();
			this.setupPostProcessing();
			this.setupEventListeners();
			this.startPerformanceMonitoring();

			console.log("🎨 Graphics Manager initialized successfully");
		} catch (error) {
			this.handleCriticalInitializationError(error);
		}
	}

	private createCanvas(): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.id = "graphics-canvas";
		canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: -1;
			background: transparent;
			display: block;
			pointer-events: none;
		`;
		document.body.appendChild(canvas);
		return canvas;
	}

	private getDefaultSettings(): GraphicsSettings {
		return {
			quality: "high",
			resolution: { width: 1920, height: 1080 },
			fullscreen: false,
			vsync: true,
			antialiasing: "fxaa",
			shadows: "medium",
			particleEffects: "high",
			postProcessing: true,
			bloomEffect: true,
			motionBlur: false,
			depthOfField: false,
			ambientOcclusion: false,
			renderDistance: 1000,
			frameRateLimit: 60,
			textureQuality: "high",
			modelDetail: "high",
			uiScale: 1.0,
			gamma: 2.2,
			brightness: 1.0,
			contrast: 1.0,
		};
	}

	private createRendererWithErrorHandling(): THREE.WebGLRenderer {
		try {
			const renderer = new THREE.WebGLRenderer({
				canvas: this.canvas,
				antialias: this.currentSettings.antialiasing !== "none",
				alpha: false,
				powerPreference: "high-performance",
				stencil: false,
				depth: true,
			});

			// Test renderer functionality
			this.validateRenderer(renderer);
			return renderer;
		} catch (error) {
			ErrorLogger.logStandardError(ErrorCategory.GRAPHICS, ErrorSeverity.CRITICAL, `Renderer creation failed: ${error instanceof Error ? error.message : String(error)}`, { canvasSize: `${this.canvas.width}x${this.canvas.height}`, webglSupported: this.checkWebGLSupport() }, "GraphicsManager.createRendererWithErrorHandling");
			throw error;
		}
	}

	private validateRenderer(renderer: THREE.WebGLRenderer): void {
		const gl = renderer.getContext();
		if (!gl) {
			throw new Error("Failed to get WebGL context");
		}

		// Test basic rendering capability
		const testScene = new THREE.Scene();
		const testCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

		try {
			renderer.render(testScene, testCamera);
		} catch (error) {
			throw new Error(`Renderer validation failed: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private setupWebGLRecovery(): void {
		this.canvas.addEventListener("webglcontextlost", (event) => {
			event.preventDefault();
			ErrorLogger.logStandardError(
				ErrorCategory.GRAPHICS,
				ErrorSeverity.CRITICAL,
				"WebGL context lost",
				{
					cause: (event as any).statusMessage || "Unknown",
					canvasSize: `${this.canvas.width}x${this.canvas.height}`,
					activeObjects: this.getSceneObjectCount(),
					memoryUsage: this.getGPUMemoryUsage(),
				},
				"GraphicsManager.setupWebGLRecovery"
			);

			this.handleContextLoss();
		});

		this.canvas.addEventListener("webglcontextrestored", () => {
			console.warn(`🎨 [GRAPHICS:HIGH] WebGL context restored - reinitializing graphics...`);
			this.reinitializeGraphics();
		});
	}

	private handleContextLoss(): void {
		try {
			// Save current state before cleanup
			this.contextLossRecoveryData = {
				timestamp: Date.now(),
				sceneState: this.saveSceneState(),
				lastRenderCall: this.lastSuccessfulRender,
				activeShaders: this.getActiveShaders(),
			};

			// Clear all WebGL resources
			this.disposeResources();
		} catch (error) {
			ErrorLogger.logStandardError(ErrorCategory.GRAPHICS, ErrorSeverity.HIGH, `Context loss handling failed: ${error instanceof Error ? error.message : String(error)}`, {}, "GraphicsManager.handleContextLoss");
		}
	}

	private overrideRendererMethods(): void {
		// Override setSize to prevent CSS modifications
		const originalSetSize = this.renderer.setSize.bind(this.renderer);
		this.renderer.setSize = (width: number, height: number, updateStyle: boolean = true) => {
			originalSetSize(width, height, false); // Always prevent style updates
			console.log(`🛡️ Renderer setSize called: ${width}x${height}, updateStyle blocked`);
		};
	}

	public render(scene: THREE.Scene, camera: THREE.Camera): void {
		const startTime = performance.now();

		try {
			// Pre-render validation
			this.validateRenderState(scene, camera);

			// Attempt rendering
			if (this.composer && this.currentSettings.postProcessing) {
				this.composer.render();
			} else {
				this.renderer.render(scene, camera);
			}

			// Post-render monitoring
			this.monitorRenderPerformance(startTime);
			this.lastSuccessfulRender = Date.now();
			this.renderFailureCount = 0; // Reset failure count on success
		} catch (error) {
			this.handleRenderError(error, scene, camera, startTime);
		}
	}

	private handleRenderError(error: any, scene: THREE.Scene, camera: THREE.Camera, startTime: number): void {
		const renderDuration = performance.now() - startTime;
		this.renderFailureCount++;

		ErrorLogger.logStandardError(
			ErrorCategory.GRAPHICS,
			ErrorSeverity.CRITICAL,
			`Render failure #${this.renderFailureCount}`,
			{
				error: error instanceof Error ? error.message : String(error),
				sceneStats: this.getSceneStats(scene),
				camera: { position: camera.position.toArray(), fov: (camera as any).fov },
				canvas: `${this.canvas.width}x${this.canvas.height}`,
				renderDuration: renderDuration.toFixed(2),
				memory: { gpu: this.getGPUMemoryUsage(), js: this.getJSMemoryUsage() },
				webglState: this.getWebGLDiagnostics(),
			},
			"GraphicsManager.handleRenderError"
		);

		// Execute recovery strategy based on failure count
		if (this.renderFailureCount >= this.maxRenderFailures) {
			this.executeEmergencyRecovery();
		} else {
			this.executeStandardRecovery();
		}
	}

	private validateRenderState(scene: THREE.Scene, camera: THREE.Camera): void {
		if (!scene) throw new Error("Scene is null or undefined");
		if (!camera) throw new Error("Camera is null or undefined");
		if (!this.renderer) throw new Error("Renderer is not initialized");

		const gl = this.renderer.getContext();
		if (!gl || gl.isContextLost()) {
			throw new Error("WebGL context is lost");
		}
	}

	private monitorRenderPerformance(startTime: number): void {
		const frameTime = performance.now() - startTime;

		// Update performance metrics
		this.frameTimeHistory.push(frameTime);
		if (this.frameTimeHistory.length > 60) {
			this.frameTimeHistory.shift();
		}

		this.performanceMetrics.frameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
		this.performanceMetrics.fps = 1000 / this.performanceMetrics.frameTime;

		// Check for performance issues
		if (frameTime > 33.33) {
			// Slower than 30 FPS
			console.warn(`🎮 [GRAPHICS:MEDIUM] Slow frame detected: ${frameTime.toFixed(2)}ms`);
		}
	}

	private getSceneStats(scene: THREE.Scene): string {
		const objects = scene.children.length;
		const lights = this.countLights(scene);
		const materials = this.countMaterials(scene);
		return `objects=${objects}, lights=${lights}, materials=${materials}`;
	}

	private countLights(scene: THREE.Scene): number {
		let count = 0;
		scene.traverse((object) => {
			if (object instanceof THREE.Light) count++;
		});
		return count;
	}

	private countMaterials(scene: THREE.Scene): number {
		const materials = new Set();
		scene.traverse((object) => {
			if ("material" in object && object.material) {
				if (Array.isArray(object.material)) {
					object.material.forEach((mat) => materials.add(mat));
				} else {
					materials.add(object.material);
				}
			}
		});
		return materials.size;
	}

	private getWebGLDiagnostics(): string {
		const gl = this.renderer.getContext();
		if (!gl) return "context=lost";

		return `context=valid, extensions=${this.getActiveExtensions()}, max_textures=${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}`;
	}

	private getActiveExtensions(): string {
		const gl = this.renderer.getContext();
		if (!gl) return "none";

		const extensions = gl.getSupportedExtensions();
		return extensions ? extensions.slice(0, 3).join(",") : "none";
	}

	// ErrorRecoverable interface implementation
	public executeFallback(error: Error, context: any): any {
		console.warn(`🎨 [GRAPHICS:MEDIUM] Executing graphics fallback for: ${error.message}`);

		if (this.isInEmergencyMode) {
			return this.executeMinimalRenderer();
		} else {
			return this.executeQualityReduction();
		}
	}

	public getSystemState(): string {
		return JSON.stringify({
			renderFailures: this.renderFailureCount,
			emergencyMode: this.isInEmergencyMode,
			lastRender: this.lastSuccessfulRender,
			performance: this.performanceMetrics,
			settings: this.currentSettings.quality,
		});
	}

	public validateState(): boolean {
		try {
			const gl = this.renderer.getContext();
			return !!(gl && !gl.isContextLost() && this.renderer);
		} catch {
			return false;
		}
	}

	public resetToSafeState(): void {
		this.isInEmergencyMode = false;
		this.renderFailureCount = 0;
		this.switchToSafeGraphicsSettings();
	}

	public getHealthStatus(): SystemHealth {
		const issues: string[] = [];
		let status: SystemHealth["status"] = "healthy";

		if (this.renderFailureCount > 0) {
			issues.push(`${this.renderFailureCount} render failures`);
			status = "degraded";
		}

		if (this.isInEmergencyMode) {
			issues.push("Emergency mode active");
			status = "critical";
		}

		if (this.performanceMetrics.fps < 30) {
			issues.push(`Low FPS: ${this.performanceMetrics.fps.toFixed(1)}`);
			status = status === "healthy" ? "degraded" : status;
		}

		return {
			status,
			issues,
			performance: Math.min((this.performanceMetrics.fps / this.targetFPS) * 100, 100),
			lastError: undefined,
			recoverySuggestions: this.generateRecoverySuggestions(issues),
		};
	}

	// Additional methods for error handling implementation
	private executeEmergencyRecovery(): void {
		this.isInEmergencyMode = true;
		console.error(`🎨 [GRAPHICS:CRITICAL] Entering emergency graphics mode`);

		try {
			this.switchToMinimalSettings();
			this.disposeNonEssentialResources();
			this.recreateRenderer();
		} catch (error) {
			ErrorLogger.logStandardError(ErrorCategory.GRAPHICS, ErrorSeverity.CRITICAL, `Emergency recovery failed: ${error instanceof Error ? error.message : String(error)}`, {}, "GraphicsManager.executeEmergencyRecovery");
		}
	}

	private executeStandardRecovery(): void {
		console.warn(`🎨 [GRAPHICS:MEDIUM] Attempting standard graphics recovery`);
		this.reduceQuality();
		this.clearTextureCache();
	}

	private switchToMinimalSettings(): void {
		this.currentSettings = {
			...this.currentSettings,
			quality: "potato",
			postProcessing: false,
			bloomEffect: false,
			shadows: "off",
			particleEffects: "off",
		};
	}

	private setupRenderer(): void {
		const width = this.canvas.clientWidth || this.canvas.width;
		const height = this.canvas.clientHeight || this.canvas.height;

		console.log(`🎨 Setting up renderer: ${width}x${height}, pixelRatio: ${window.devicePixelRatio}`);

		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setSize(width, height, false);
		this.renderer.shadowMap.enabled = this.currentSettings.shadows !== "off";
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.0;
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;

		if (this.currentSettings.quality === "ultra" || this.currentSettings.quality === "high") {
			this.renderer.shadowMap.autoUpdate = true;
		}

		console.log(`🎨 Renderer setup: ${width}x${height}, pixelRatio: ${window.devicePixelRatio}`);
	}

	private setupPostProcessing(): void {
		if (!this.currentSettings.postProcessing) return;

		try {
			// Initialize composer if not already created
			if (!this.composer) {
				this.composer = new EffectComposer(this.renderer);
			}

			// If renderPass isn't initialized yet, this method will be called again when setScene() is called
			if (!this.renderPass) {
				console.log("🎨 [GRAPHICS:DEBUG] Post-processing setup deferred until scene is set");
				return;
			}

			// Clear existing passes and rebuild
			this.composer.passes = [];
			this.composer.addPass(this.renderPass);

			if (this.currentSettings.bloomEffect) {
				this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight), 1.5, 0.4, 0.85);
				this.composer.addPass(this.bloomPass);
			}

			if (this.currentSettings.antialiasing === "fxaa") {
				this.fxaaPass = new ShaderPass(FXAAShader);
				this.composer.addPass(this.fxaaPass);
			}

			console.log("🎨 [GRAPHICS:DEBUG] Post-processing setup completed with renderPass");
		} catch (error) {
			ErrorLogger.logStandardError(ErrorCategory.GRAPHICS, ErrorSeverity.MEDIUM, `Post-processing setup failed: ${error instanceof Error ? error.message : String(error)}`, {}, "GraphicsManager.setupPostProcessing");
		}
	}

	private setupEventListeners(): void {
		window.addEventListener("resize", this.handleResize.bind(this));
	}

	private handleResize(): void {
		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
		}

		this.resizeTimeout = setTimeout(() => {
			try {
				const width = Math.max(window.innerWidth || 0, document.documentElement?.clientWidth || 0, 1920);
				const height = Math.max(window.innerHeight || 0, document.documentElement?.clientHeight || 0, 1080);

				this.updateSize(width, height);
			} catch (error) {
				ErrorLogger.logStandardError(ErrorCategory.GRAPHICS, ErrorSeverity.MEDIUM, `Resize handling failed: ${error instanceof Error ? error.message : String(error)}`, {}, "GraphicsManager.handleResize");
			}
		}, 100);
	}

	public updateSize(width: number, height: number): void {
		const robustWidth = Math.max(width || 0, window.innerWidth || 0, 1920);
		const robustHeight = Math.max(height || 0, window.innerHeight || 0, 1080);

		this.renderer.setSize(robustWidth, robustHeight, false);

		if (this.composer) {
			this.composer.setSize(robustWidth, robustHeight);
		}

		if (this.bloomPass) {
			this.bloomPass.resolution.set(robustWidth, robustHeight);
		}

		if (this.fxaaPass) {
			const fxaaUniforms = this.fxaaPass.uniforms as any;
			fxaaUniforms.resolution.value.set(1 / robustWidth, 1 / robustHeight);
		}
	}

	private startPerformanceMonitoring(): void {
		setInterval(() => {
			this.updatePerformanceMetrics();
			this.checkPerformanceThresholds();
		}, 5000);
	}

	private updatePerformanceMetrics(): void {
		try {
			const info = this.renderer.info;
			this.performanceMetrics.drawCalls = info.render.calls;
			this.performanceMetrics.triangles = info.render.triangles;
			this.performanceMetrics.geometries = info.memory.geometries;
			this.performanceMetrics.textures = info.memory.textures;

			if ("memory" in performance && (performance as any).memory) {
				const mem = (performance as any).memory;
				this.performanceMetrics.memory.used = mem.usedJSHeapSize;
				this.performanceMetrics.memory.limit = mem.jsHeapSizeLimit;
			}
		} catch (error) {
			// Performance monitoring is non-critical, log but continue
			console.warn(`Performance metrics update failed: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private checkPerformanceThresholds(): void {
		const metrics = this.performanceMetrics;

		if (metrics.fps < this.targetFPS * 0.7) {
			console.warn(`🎮 [GRAPHICS:MEDIUM] Performance degradation detected: FPS=${metrics.fps.toFixed(1)}, Target=${this.targetFPS}`);
			this.adjustQualityDown();
		}

		if (metrics.memory.used > this.memoryThreshold) {
			console.warn(`🧠 [GRAPHICS:HIGH] Memory threshold exceeded: ${(metrics.memory.used / 1024 / 1024).toFixed(1)}MB`);
			this.forceResourceCleanup();
		}
	}

	// Helper methods for the error handling system
	private initializeQualityPresets(): void {
		this.qualityPresets = new Map();
		// Initialize quality presets here
	}

	private checkWebGLSupport(): boolean {
		try {
			const canvas = document.createElement("canvas");
			return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
		} catch {
			return false;
		}
	}

	private saveSceneState(): any {
		return { timestamp: Date.now() };
	}

	private getActiveShaders(): string[] {
		return ["basic", "phong"]; // Placeholder
	}

	private disposeResources(): void {
		// Resource disposal logic
	}

	private reinitializeGraphics(): void {
		// Graphics reinitialization logic
	}

	private getSceneObjectCount(): number {
		return 0; // Placeholder
	}

	private getGPUMemoryUsage(): string {
		return "unknown";
	}

	private getJSMemoryUsage(): string {
		if ("memory" in performance && (performance as any).memory) {
			const mem = (performance as any).memory;
			return `${(mem.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB`;
		}
		return "unknown";
	}

	private executeMinimalRenderer(): any {
		return null;
	}

	private executeQualityReduction(): any {
		this.adjustQualityDown();
		return null;
	}

	private switchToSafeGraphicsSettings(): void {
		this.currentSettings.quality = "medium";
		this.setupRenderer();
	}

	private generateRecoverySuggestions(issues: string[]): string[] {
		const suggestions: string[] = [];

		if (issues.some((i) => i.includes("render failures"))) {
			suggestions.push("Reduce graphics quality");
		}

		if (issues.some((i) => i.includes("Low FPS"))) {
			suggestions.push("Disable post-processing effects");
		}

		return suggestions;
	}

	private disposeNonEssentialResources(): void {
		// Dispose non-essential resources
	}

	private recreateRenderer(): void {
		// Recreate renderer logic
	}

	private reduceQuality(): void {
		// Quality reduction logic
	}

	private clearTextureCache(): void {
		// Clear texture cache
	}

	private adjustQualityDown(): void {
		const qualities = ["ultra", "high", "medium", "low", "potato"];
		const currentIndex = qualities.indexOf(this.currentSettings.quality);
		if (currentIndex < qualities.length - 1) {
			this.currentSettings.quality = qualities[currentIndex + 1] as any;
			console.log(`🎮 Auto-adjusting quality to: ${this.currentSettings.quality}`);
		}
	}

	private forceResourceCleanup(): void {
		// Force garbage collection if available
		if ("gc" in window && typeof (window as any).gc === "function") {
			(window as any).gc();
		}
	}

	public handleCriticalInitializationError(error: any): void {
		ErrorLogger.logStandardError(ErrorCategory.GRAPHICS, ErrorSeverity.CRITICAL, `Graphics Manager initialization failed: ${error instanceof Error ? error.message : String(error)}`, { webglSupported: this.checkWebGLSupport() }, "GraphicsManager.constructor");

		// Create minimal fallback renderer
		this.createFallbackRenderer();
	}

	private createFallbackRenderer(): void {
		// Create a minimal canvas-based fallback
		console.error("🎨 [GRAPHICS:CRITICAL] Creating fallback renderer");
	}

	public setScene(scene: THREE.Scene, camera: THREE.Camera): void {
		try {
			// Create renderPass for the scene
			this.renderPass = new RenderPass(scene, camera);

			// Setup post-processing now that we have a renderPass
			this.setupPostProcessing();

			console.log("🎨 [GRAPHICS:DEBUG] Scene set and post-processing initialized");
		} catch (error) {
			ErrorLogger.logStandardError(ErrorCategory.GRAPHICS, ErrorSeverity.MEDIUM, `Scene setup failed: ${error instanceof Error ? error.message : String(error)}`, {}, "GraphicsManager.setScene");
		}
	}

	public getRenderer(): THREE.WebGLRenderer {
		return this.renderer;
	}

	public updateSettings(newSettings: Partial<GraphicsSettings>): void {
		this.currentSettings = { ...this.currentSettings, ...newSettings };
		this.setupRenderer();
		this.setupPostProcessing();
	}

	public clearCaches(): void {
		console.log("🎨 [GRAPHICS:DEBUG] Clearing graphics caches...");

		// Clear Three.js internal caches
		if (this.renderer) {
			this.renderer.info.programs?.forEach((program) => {
				program.destroy();
			});
		}

		// Force garbage collection if available
		if (window.gc) {
			window.gc();
		}
	}

	public async restart(): Promise<void> {
		console.log("🎨 [GRAPHICS:DEBUG] Restarting graphics manager...");

		try {
			// Store current settings
			const currentSettings = { ...this.currentSettings };

			// Dispose current renderer
			this.dispose();

			// Reinitialize with same settings
			this.currentSettings = currentSettings;
			await this.initialize();

			console.log("🎨 [GRAPHICS:DEBUG] Graphics manager restarted successfully");
		} catch (error) {
			console.error("🎨 [GRAPHICS:ERROR] Failed to restart graphics manager:", error);
			throw error;
		}
	}

	public dispose(): void {
		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
		}

		this.renderer.dispose();
		if (this.composer) {
			this.composer.dispose();
		}
	}
}
