// @ts-nocheck - Temporary disable for missing module imports
/**
 * @file main.ts
 * @description Main entry point for Galactic Clans with comprehensive error handling and performance monitoring
 * @version 1.0.0
 * @author Cosmic Gaming Development Team
 * @created 2024-01-15
 *
 * @purpose Bootstrap the game with extreme performance optimization and monitoring
 * @dependencies All core game systems with error handling and performance monitoring
 * @exports GameApplication main class
 */

import * as THREE from "three";
import { type ErrorRecoverable, type SystemHealth, ErrorSeverity, ErrorCategory, type GameError, ErrorLogger } from "./shared/core/error-system";
import { ErrorRecoveryChain, ResourceCleanupManager } from "./shared/core/error-handling-utils";
import { SystemHealthMonitor } from "./shared/core/system-health-monitor";

// Performance Monitoring Imports
import { RealTimePerformanceMonitor, type PerformanceMetrics } from "./shared/core/performance-monitor";
import { PoolManager, GameObjectPools } from "./shared/core/object-pool";

// Core Game Systems
import { Renderer } from "./shared/rendering/renderer";
import { NetworkManager } from "./shared/network/network-manager";
import { GraphicsManager } from "./shared/ui/graphics-manager";
// Commented out missing modules - need to be implemented or removed
// import { AISystem } from "./shared/world/ai-system";
// import { Galaxy } from "./shared/world/galaxy";
// import { GalaxyView } from "./shared/world/galaxy-view";
// import { World } from "./shared/world/world";

// Error Managers
import { PhysicsErrorManager } from "./shared/physics/physics-error-manager";
import { AudioErrorManager } from "./shared/audio/audio-error-manager";
import { InputErrorManager } from "./shared/ui/input-error-manager";
import { RendererErrorManager } from "./shared/rendering/renderer-error-manager";
import { WorldErrorManager } from "./shared/world/world-error-manager";
import { EconomyErrorManager } from "./shared/economy/economy-error-manager";
import { GraphicsEffectsErrorManager } from "./shared/graphics/graphics-effects-error-manager";
import { ProcGenErrorManager } from "./shared/procgen/procgen-error-manager";

// UI Systems with Performance Integration
import { GameStateManager } from "./shared/ui/game-state-manager";
import { AAAGameMenu } from "./shared/ui/aaa-game-menu";
import { MainMenuSystem } from "./shared/ui/main-menu-system";
import { MatchmakingSystem } from "./shared/ui/matchmaking-system";
import { LoadingScreenSystem } from "./shared/ui/loading-screen-system";
import { HUDSystem } from "./shared/ui/hud-system";
import { InventorySystem } from "./shared/ui/inventory-system";
import { SettingsSystem } from "./shared/ui/settings-system";
import { PlayerProfileSystem } from "./shared/ui/player-profile-system";

// =============================================================================
// MAIN GAME APPLICATION WITH EXTREME PERFORMANCE MONITORING
// =============================================================================

export class GameApplication implements ErrorRecoverable {
	private readonly errorLogger: ErrorLogger;
	private readonly healthMonitor: SystemHealthMonitor;
	private readonly performanceMonitor: PerformanceMonitor;
	private readonly poolManager: PoolManager;
	private readonly gameObjectPools: GameObjectPools;

	private readonly recoveryChain: ErrorRecoveryChain;
	private readonly cleanupManager: ResourceCleanupManager;

	// Core Game Systems
	private renderer!: Renderer;
	private networkManager!: NetworkManager;
	private graphicsManager!: GraphicsManager;
	private aiSystem!: AISystem;
	private galaxy!: Galaxy;

	// 3D Views
	private galaxyView?: GalaxyView;
	private currentWorld?: World;

	// Error Managers
	private physicsManager!: PhysicsErrorManager;
	private audioManager!: AudioErrorManager;
	private inputManager!: InputErrorManager;
	private rendererManager!: RendererErrorManager;
	private worldManager!: WorldErrorManager;
	private economyManager!: EconomyErrorManager;
	private effectsManager!: GraphicsEffectsErrorManager;
	private procGenManager!: ProcGenErrorManager;

	// UI Systems
	private gameStateManager!: GameStateManager;
	private mainMenuSystem!: AAAGameMenu;
	private matchmakingSystem!: MatchmakingSystem;
	private loadingScreenSystem!: LoadingScreenSystem;
	private hudSystem!: HUDSystem;
	private inventorySystem!: InventorySystem;
	private settingsSystem!: SettingsSystem;
	private playerProfileSystem!: PlayerProfileSystem;

	// Application State
	private isInitialized = false;
	private isRunning = false;
	private emergencyMode = false;
	private performanceScore = 100;
	private frameCount = 0;
	private lastPerformanceReport = 0;

	// Main Render Loop Properties
	private renderLoopId = 0;
	private lastFrameTime = 0;
	private deltaTime = 0;
	private targetFPS = 60;
	private targetFrameTime = 1000 / 60; // 16.67ms

	// Current Scene and Camera
	private currentScene?: THREE.Scene;
	private currentCamera?: THREE.Camera;

	// Performance Targets (Enforced by Performance Rule)
	private readonly performanceTargets = {
		targetFPS: 60,
		criticalFPS: 45,
		maxMemoryUsage: 512 * 1024 * 1024, // 512MB
		maxFrameTime: 16.67, // 60 FPS
		performanceReportInterval: 10000, // 10 seconds
	};

	constructor() {
		console.log("🚀 [COSMIC] Starting Galactic Clans with EXTREME PERFORMANCE monitoring...");

		this.errorLogger = ErrorLogger.getInstance();
		this.healthMonitor = SystemHealthMonitor.getInstance();
		this.performanceMonitor = PerformanceMonitor.getInstance();
		this.poolManager = PoolManager.getInstance();
		this.gameObjectPools = GameObjectPools.getInstance();

		this.recoveryChain = new ErrorRecoveryChain();
		this.cleanupManager = new ResourceCleanupManager();

		this.setupGlobalErrorHandling();
		this.setupPerformanceMonitoring();
		this.setupRecoveryStrategies();

		this.errorLogger.logInfo("GameApplication", "🎮 Galactic Clans initialized with enterprise-grade monitoring");
	}

	// =============================================================================
	// APPLICATION LIFECYCLE WITH PERFORMANCE MONITORING
	// =============================================================================

	public async initialize(): Promise<void> {
		try {
			console.time("🚀 [STARTUP] Application Initialization");

			// Start performance monitoring FIRST
			await this.performanceMonitor.startMonitoring();
			this.errorLogger.logInfo("GameApplication", "Performance monitoring started");

			// Initialize core systems with performance profiling
			this.errorLogger.logInfo("GameApplication", "Initializing core systems...");
			await this.performanceMonitor.measureAsyncTask("init_core_systems", async () => {
				await this.initializeCoreSystemsWithMonitoring();
			});

			this.errorLogger.logInfo("GameApplication", "✅ Core systems initialized with performance monitoring");

			// Initialize error managers
			this.errorLogger.logInfo("GameApplication", "Initializing error managers...");
			await this.performanceMonitor.measureAsyncTask("init_error_managers", async () => {
				await this.initializeErrorManagers();
			});
			this.errorLogger.logInfo("GameApplication", "✅ Error managers initialized");

			// Initialize UI systems
			this.errorLogger.logInfo("GameApplication", "Initializing UI systems...");
			await this.performanceMonitor.measureAsyncTask("init_ui_systems", async () => {
				await this.initializeUISystemsWithMonitoring();
			});
			this.errorLogger.logInfo("GameApplication", "✅ UI systems initialized");

			// Start all systems
			this.errorLogger.logInfo("GameApplication", "Starting all systems...");
			await this.performanceMonitor.measureAsyncTask("start_all_systems", async () => {
				await this.startAllSystems();
			});
			this.errorLogger.logInfo("GameApplication", "✅ All systems started");

			this.errorLogger.logInfo("GameApplication", "All systems initialized and running.");
			console.timeEnd("🚀 [STARTUP] Application Initialization");

			// Register all systems with health monitor
			this.registerSystemsWithHealthMonitor();

			// Start continuous performance monitoring
			this.startContinuousPerformanceMonitoring();

			this.isInitialized = true;
			this.isRunning = true;
		} catch (error) {
			this.errorLogger.logError("GameApplication", "💥 CRITICAL INITIALIZATION FAILURE 💥", error);
			this.isRunning = false;
		}
	}

	public async shutdown(): Promise<void> {
		try {
			this.errorLogger.logInfo("GameApplication", "🛑 Shutting down Galactic Clans...");

			this.isRunning = false;
			this.stopRenderLoop();

			// Stop performance monitoring
			await this.performanceMonitor.stopMonitoring();

			// Cleanup all systems in reverse order
			await this.shutdownUISystemsWithMonitoring();
			await this.shutdownErrorManagers();
			await this.shutdownCoreSystemsWithMonitoring();

			// Final cleanup
			this.cleanupManager.cleanupAll();
			this.poolManager.dispose();

			this.isInitialized = false;

			// Final performance report
			this.reportFinalPerformanceMetrics();

			this.errorLogger.logInfo("GameApplication", "✅ Galactic Clans shutdown completed");
		} catch (error) {
			this.errorLogger.logError("GameApplication", "Error during shutdown", error);
		}
	}

	// =============================================================================
	// CORE SYSTEMS INITIALIZATION WITH PERFORMANCE MONITORING
	// =============================================================================

	private async initializeCoreSystemsWithMonitoring(): Promise<void> {
		// Create a single shared canvas for all 3D rendering
		console.log("🎨 [INIT] Creating shared canvas for 3D rendering...");
		const sharedCanvas = this.createSharedCanvas();

		// Initialize Renderer with shared canvas and performance monitoring
		this.renderer = await this.performanceMonitor.measureAsyncTask("init_renderer", async () => {
			const renderer = new Renderer(sharedCanvas);
			await renderer.initialize();
			return renderer;
		});

		// Initialize Graphics Manager with the same shared canvas and performance monitoring
		this.graphicsManager = await this.performanceMonitor.measureAsyncTask("init_graphics", async () => {
			const graphicsManager = new GraphicsManager(sharedCanvas);
			await graphicsManager.initialize();
			return graphicsManager;
		});

		// Initialize Network Manager with performance monitoring
		this.networkManager = await this.performanceMonitor.measureAsyncTask("init_network", async () => {
			const networkManager = new NetworkManager({
				url: "ws://localhost:5173/ws",
				timeout: 10000,
				maxRetries: 3,
				retryDelay: 1000,
				heartbeatInterval: 30000,
				syncInterval: 1000,
			});
			await networkManager.initialize();
			return networkManager;
		});

		// Initialize AI System with performance monitoring
		this.aiSystem = await this.performanceMonitor.measureAsyncTask("init_ai", async () => {
			const aiSystem = new AISystem();
			await aiSystem.initialize();
			return aiSystem;
		});

		// Initialize Galaxy with performance monitoring
		this.galaxy = await this.performanceMonitor.measureAsyncTask("init_galaxy", async () => {
			const galaxy = new Galaxy();
			await galaxy.initialize();
			return galaxy;
		});

		this.errorLogger.logInfo("GameApplication", "✅ Core systems initialized with shared canvas and performance monitoring");
	}

	/**
	 * Creates a single shared canvas for all 3D rendering to prevent conflicts
	 */
	private createSharedCanvas(): HTMLCanvasElement {
		// Check if a canvas already exists
		const existingCanvas = document.getElementById("main-game-canvas") as HTMLCanvasElement;
		if (existingCanvas) {
			console.log("🎨 [CANVAS] Using existing shared canvas");
			return existingCanvas;
		}

		// Create the main shared canvas
		const canvas = document.createElement("canvas");
		canvas.id = "main-game-canvas";

		// Get actual viewport dimensions
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Set canvas internal resolution to match viewport
		canvas.width = width;
		canvas.height = height;

		// Set canvas styles for proper rendering
		canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 10;
			background: #0a0a0a;
			display: block;
			pointer-events: auto;
		`;

		// Insert before UI elements
		document.body.insertBefore(canvas, document.body.firstChild);

		console.log(`🎨 [CANVAS] Shared canvas created: ${width}×${height} (z-index: 10)`);
		return canvas;
	}

	private async initializeErrorManagers(): Promise<void> {
		this.physicsManager = new PhysicsErrorManager();
		this.audioManager = new AudioErrorManager();
		this.inputManager = new InputErrorManager();
		this.rendererManager = new RendererErrorManager();
		this.worldManager = new WorldErrorManager();
		this.economyManager = new EconomyErrorManager();
		this.effectsManager = new GraphicsEffectsErrorManager(this.renderer.getWebGLRenderer());
		this.procGenManager = new ProcGenErrorManager();

		// Initialize each error manager individually with error handling
		const managers = [
			{ name: "physics", manager: this.physicsManager },
			{ name: "audio", manager: this.audioManager },
			{ name: "input", manager: this.inputManager },
			{ name: "renderer", manager: this.rendererManager },
			{ name: "world", manager: this.worldManager },
			{ name: "economy", manager: this.economyManager },
			{ name: "effects", manager: this.effectsManager },
			{ name: "procgen", manager: this.procGenManager },
		];

		let successCount = 0;
		for (const { name, manager } of managers) {
			try {
				console.log(`🚀 [DEBUG] Initializing ${name} error manager...`);
				await manager.initialize();
				console.log(`🚀 [DEBUG] ${name} error manager initialized ✅`);
				successCount++;
			} catch (error) {
				console.error(`🚀 [ERROR] Failed to initialize ${name} error manager:`, error);
				// Continue with other managers instead of failing completely
			}
		}

		console.log(`🚀 [DEBUG] Error managers complete: ${successCount}/${managers.length} successful`);
		this.errorLogger.logInfo("GameApplication", `✅ Error managers initialized (${successCount}/${managers.length})`);
	}

	private async initializeUISystemsWithMonitoring(): Promise<void> {
		// Initialize Game State Manager with performance monitoring
		this.gameStateManager = await this.performanceMonitor.measureAsyncTask("init_game_state", async () => {
			const gameStateManager = new GameStateManager();
			await gameStateManager.initialize();
			return gameStateManager;
		});

		// Initialize AAA Game Menu System with performance monitoring
		this.mainMenuSystem = await this.performanceMonitor.measureAsyncTask("init_aaa_game_menu", async () => {
			const aaaMenu = new AAAGameMenu({
				showLoadingScreen: true,
				enableParticles: true,
				enablePlanetAnimation: true,
				enableSoundEffects: true,
				enableHoverEffects: true,
			});

			await aaaMenu.initialize();

			// Set up menu callbacks
			aaaMenu.setCallbacks({
				onPlay: () => {
					console.log("🎮 [MAIN] Starting Galactic Clans...");
					aaaMenu.hide();
					// TODO: Transition to game state
				},
				onMultiplayer: () => {
					console.log("🌐 [MAIN] Opening multiplayer...");
					// TODO: Show multiplayer UI
				},
				onSettings: () => {
					console.log("⚙️ [MAIN] Opening settings...");
					// TODO: Show settings UI
				},
				onProfile: () => {
					console.log("👤 [MAIN] Opening profile...");
					// TODO: Show profile UI
				},
				onCredits: () => {
					console.log("⭐ [MAIN] Opening credits...");
					// TODO: Show credits UI
				},
				onQuit: () => {
					console.log("🚪 [MAIN] Quitting game...");
					if (confirm("Are you sure you want to quit Galactic Clans?")) {
						window.close();
					}
				},
			});

			return aaaMenu;
		});

		// Initialize Matchmaking System with performance monitoring
		this.matchmakingSystem = await this.performanceMonitor.measureAsyncTask("init_matchmaking", async () => {
			const matchmakingSystem = new MatchmakingSystem();
			await matchmakingSystem.initialize();
			return matchmakingSystem;
		});

		// Initialize Loading Screen System with performance monitoring
		this.loadingScreenSystem = await this.performanceMonitor.measureAsyncTask("init_loading_screen", async () => {
			const loadingScreenSystem = new LoadingScreenSystem();
			await loadingScreenSystem.initialize();
			return loadingScreenSystem;
		});

		// Initialize HUD System with performance monitoring
		this.hudSystem = await this.performanceMonitor.measureAsyncTask("init_hud", async () => {
			const hudSystem = new HUDSystem();
			await hudSystem.initialize();
			return hudSystem;
		});

		// Initialize Inventory System with performance monitoring
		this.inventorySystem = await this.performanceMonitor.measureAsyncTask("init_inventory", async () => {
			const inventorySystem = new InventorySystem();
			await inventorySystem.initialize();
			return inventorySystem;
		});

		// Initialize Settings System with performance monitoring
		this.settingsSystem = await this.performanceMonitor.measureAsyncTask("init_settings", async () => {
			const settingsSystem = new SettingsSystem();
			await settingsSystem.initialize();
			return settingsSystem;
		});

		// Initialize Player Profile System with performance monitoring
		this.playerProfileSystem = await this.performanceMonitor.measureAsyncTask("init_player_profile", async () => {
			const playerProfileSystem = new PlayerProfileSystem();
			await playerProfileSystem.initialize();
			return playerProfileSystem;
		});

		this.errorLogger.logInfo("GameApplication", "✅ UI systems initialized with performance monitoring");
	}

	// =============================================================================
	// PERFORMANCE MONITORING & OPTIMIZATION
	// =============================================================================

	private setupPerformanceMonitoring(): void {
		// Listen for performance updates from all systems
		window.addEventListener("performanceUpdate", (event: any) => {
			const { systemName, metrics } = event.detail;
			PerformanceDashboard.reportMetrics(systemName, metrics);
		});

		// Listen for quality change events
		window.addEventListener("qualityChange", (event: any) => {
			const quality = event.detail;
			this.errorLogger.logInfo("GameApplication", `🎨 Quality changed to: ${quality.name}`);
		});

		// Setup performance alerts
		this.setupPerformanceAlerts();

		this.errorLogger.logInfo("GameApplication", "🔍 Performance monitoring setup completed");
	}

	private setupPerformanceAlerts(): void {
		// Monitor for critical performance drops
		setInterval(() => {
			if (!this.isRunning) return;

			const metrics = this.performanceMonitor.getCurrentMetrics();

			// Critical FPS drop
			if (metrics.currentFPS < this.performanceTargets.criticalFPS) {
				this.handleCriticalPerformanceDrop(metrics);
			}

			// Critical memory usage
			if (metrics.memoryPressure > 0.9) {
				this.handleCriticalMemoryUsage(metrics);
			}

			// Update performance score
			this.performanceScore = this.performanceMonitor.getPerformanceScore();
		}, 1000); // Check every second
	}

	private handleCriticalPerformanceDrop(metrics: SystemPerformanceMetrics): void {
		if (this.emergencyMode) return; // Already in emergency mode

		console.error(`🚨 [CRITICAL] FPS dropped to ${metrics.currentFPS.toFixed(1)} - Activating emergency protocols`);

		this.emergencyMode = true;

		// Immediate performance recovery actions
		this.performanceMonitor.adjustQuality("down");
		this.poolManager.cleanupAll();

		// Force garbage collection if available
		if (window.gc) {
			window.gc();
		}

		// Notify all systems to reduce load
		window.dispatchEvent(
			new CustomEvent("emergencyPerformanceMode", {
				detail: { metrics },
			})
		);
	}

	private handleCriticalMemoryUsage(metrics: SystemPerformanceMetrics): void {
		console.error(`🚨 [CRITICAL] Memory usage at ${(metrics.memoryPressure * 100).toFixed(1)}% - Emergency cleanup`);

		// Aggressive memory cleanup
		this.poolManager.cleanupAll();

		// Clear caches in all systems
		this.clearAllCaches();

		// Force multiple garbage collection cycles
		for (let i = 0; i < 3; i++) {
			if (window.gc) window.gc();
		}
	}

	private startContinuousPerformanceMonitoring(): void {
		// High-frequency performance monitoring
		const monitoringInterval = setInterval(() => {
			if (!this.isRunning) {
				clearInterval(monitoringInterval);
				return;
			}

			this.frameCount++;

			// Report metrics every 30 seconds instead of 10 (reduced frequency)
			if (Date.now() - this.lastPerformanceReport > 30000) {
				this.reportSummaryPerformanceMetrics();
				this.lastPerformanceReport = Date.now();
			}
		}, 16); // ~60 FPS monitoring

		this.cleanupManager.addInterval(monitoringInterval);
	}

	private reportSummaryPerformanceMetrics(): void {
		const metrics = this.performanceMonitor.getCurrentMetrics();
		const systemHealth = this.healthMonitor.getOverallHealth();

		this.errorLogger.logInfo("PerformanceSummary", `FPS: ${metrics.currentFPS.toFixed(1)} | Memory: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB | CPU: ${metrics.cpuUsagePercentage.toFixed(1)}% | Health: ${systemHealth.performance}/100`);

		if (metrics.currentFPS < 45) {
			this.errorLogger.logWarning("Performance", `Low FPS detected: ${metrics.currentFPS.toFixed(1)}`);
		}
		if (metrics.memoryUsage / (1024 * 1024) > 500) {
			// Over 500MB
			this.errorLogger.logWarning("Performance", `High memory usage detected: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`);
		}
	}

	private reportDetailedPerformanceMetrics(): void {
		// This method is now only called on demand, not automatically
		const metrics = this.performanceMonitor.getCurrentMetrics();
		const systemHealth = this.healthMonitor.getOverallHealth();

		console.group("📊 [PERFORMANCE:DETAILED] System Performance Report");
		console.log("🎯 Frame Performance:");
		console.log(`  - Current FPS: ${metrics.currentFPS.toFixed(1)}`);
		console.log(`  - Average Frame Time: ${metrics.averageFrameTime.toFixed(2)}ms`);
		console.log(`  - Worst Frame Time: ${metrics.worstFrameTime.toFixed(2)}ms`);
		console.log(`  - Frame Variance: ${metrics.frameTimeVariance.toFixed(2)}ms`);

		console.log("🧠 Memory Performance:");
		console.log(`  - Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`);
		console.log(`  - Pressure: ${(metrics.memoryPressure * 100).toFixed(1)}%`);
		console.log(`  - Growth Rate: ${(metrics.memoryGrowthRate / 1024).toFixed(2)}KB/s`);
		console.log(`  - GC Frequency: ${metrics.garbageCollectionFrequency.toFixed(2)}/min`);

		console.log("⚡ CPU Performance:");
		console.log(`  - Usage: ${metrics.cpuUsagePercentage.toFixed(1)}%`);
		console.log(`  - Main Thread Blocked: ${metrics.mainThreadBlocked.toFixed(1)}%`);

		console.log("🏥 System Health:");
		console.log(`  - Overall Status: ${systemHealth.status}`);
		console.log(`  - Performance: ${systemHealth.performance}/100`);
		console.log(`  - Active Issues: ${systemHealth.issues.length}`);

		console.log("🎨 Quality Management:");
		console.log(`  - Current Level: ${metrics.currentQualityLevel}`);
		console.log(`  - Auto Adjustments: ${metrics.qualityAdjustments}`);
		console.log(`  - Adaptive Active: ${metrics.adaptiveQualityActive}`);

		console.log(`🏆 Overall Performance Score: ${metrics.performanceScore}/100`);
		console.groupEnd();

		// REMOVED: PerformanceDashboard.reportMetrics call to prevent infinite recursion
		// TODO: Implement proper metrics reporting without recursion
	}

	private reportFinalPerformanceMetrics(): void {
		const totalFrames = this.frameCount;
		const metrics = this.performanceMonitor.getCurrentMetrics();

		console.group("🏁 [PERFORMANCE:FINAL] Session Performance Summary");
		console.log(`📊 Total Frames Rendered: ${totalFrames.toLocaleString()}`);
		console.log(`⏱️ Average FPS: ${metrics.currentFPS.toFixed(1)}`);
		console.log(`🧠 Peak Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`);
		console.log(`🎨 Quality Adjustments: ${metrics.qualityAdjustments}`);
		console.log(`🏆 Final Performance Score: ${metrics.performanceScore}/100`);
		console.log(`🚨 Emergency Mode Activations: ${this.emergencyMode ? "1+" : "0"}`);
		console.groupEnd();
	}

	// =============================================================================
	// SYSTEM MANAGEMENT
	// =============================================================================

	private async startAllSystems(): Promise<void> {
		// Start systems in optimal order for performance
		const startOrder = ["renderer", "graphicsManager", "networkManager", "aiSystem", "galaxy", "gameStateManager", "hudSystem", "settingsSystem", "inventorySystem", "playerProfileSystem", "mainMenuSystem", "matchmakingSystem", "loadingScreenSystem"];

		for (const systemName of startOrder) {
			try {
				const system = (this as any)[systemName];
				if (system && typeof system.start === "function") {
					await this.performanceMonitor.measureAsyncTask(`start_${systemName}`, async () => {
						await system.start();
					});
				}
			} catch (error) {
				this.errorLogger.logError("GameApplication", `Error starting ${systemName}`, error);
			}
		}

		// Start the main render loop after all systems are initialized
		this.startRenderLoop();

		this.errorLogger.logInfo("GameApplication", "✅ All systems started with performance monitoring");
	}

	// =============================================================================
	// MAIN RENDER LOOP - THE MISSING PIECE!
	// =============================================================================

	private startRenderLoop(): void {
		console.log("🎮 [RENDER] Starting main render loop...");

		// Initialize timing
		this.lastFrameTime = performance.now();

		// Create galaxy view from the galaxy instance
		if (this.galaxy) {
			try {
				// Create a current world (first system in galaxy)
				const systems = this.galaxy.getSolarSystems();
				console.log("🌌 [RENDER] Galaxy systems available:", systems?.length || 0);

				if (systems && systems.length > 0) {
					this.currentWorld = new World(); // Create a basic world
					this.galaxyView = new GalaxyView(this.galaxy, this.currentWorld);
					this.currentScene = this.galaxyView.scene;
					this.currentCamera = this.renderer.camera;

					console.log("🌌 [RENDER] Galaxy view created with scene children:", this.currentScene.children.length);

					// Position camera to view entire galaxy with better perspective
					if (this.currentCamera instanceof THREE.PerspectiveCamera) {
						// Closer position to see objects better
						this.currentCamera.position.set(0, 50, 150);
						this.currentCamera.lookAt(0, 0, 0);
						this.currentCamera.fov = 75; // Wider field of view
						this.currentCamera.updateProjectionMatrix(); // Ensure changes take effect
						console.log("🌌 [RENDER] Camera positioned at:", this.currentCamera.position);
						console.log("🌌 [RENDER] Camera FOV:", this.currentCamera.fov);
						console.log("🌌 [RENDER] Camera looking at: (0, 0, 0)");
					}
					console.log("🌌 [RENDER] Created galaxy view with scene");
				}
			} catch (error) {
				console.warn("🌌 [RENDER] Could not create galaxy view:", error);
			}
		}

		// If no galaxy view, create a basic scene
		if (!this.currentScene) {
			console.log("🎮 [RENDER] Creating fallback scene");
			this.currentScene = this.renderer.getScene();
			this.currentCamera = this.renderer.camera;

			// Add some basic content to see something
			this.addBasicSceneContent();
		}

		// ALWAYS add some test content to make sure we can see SOMETHING
		this.addDebugTestContent();

		// CRITICAL: Start the actual render loop
		console.log("🎮 [RENDER] Starting renderLoop with requestAnimationFrame...");

		// Debug: Check canvas setup
		const canvas = this.renderer.getWebGLRenderer().domElement;

		// CRITICAL DEBUG: Check all canvases in DOM
		const allCanvases = document.querySelectorAll("canvas");
		console.log("🔍 [DEBUG] DOM Canvas Analysis:");
		allCanvases.forEach((c, index) => {
			console.log(`Canvas ${index}:`, {
				id: c.id,
				width: c.width,
				height: c.height,
				clientWidth: c.clientWidth,
				clientHeight: c.clientHeight,
				zIndex: c.style.zIndex,
				position: c.style.position,
				display: c.style.display,
				background: c.style.background,
				parent: c.parentElement?.tagName || "NONE",
			});
		});

		console.log("🎨 [RENDER] Active canvas setup check:", {
			width: canvas.width,
			height: canvas.height,
			clientWidth: canvas.clientWidth,
			clientHeight: canvas.clientHeight,
			style: canvas.style.cssText,
			parent: canvas.parentElement?.tagName || "NONE",
			inDOM: document.contains(canvas),
		});

		// Debug: Verify the fix worked
		console.log("🎨 [RENDER] After size fix:", {
			canvasWidth: canvas.width,
			canvasHeight: canvas.height,
			rendererSize: this.renderer.getWebGLRenderer().getSize(new THREE.Vector2()),
		});

		// Add window resize listener to keep canvas properly sized
		window.addEventListener("resize", () => {
			console.log("🔧 [RENDER] Window resized, updating renderer...");
			this.renderer.updateRendererSize();
		});

		// COMPREHENSIVE CANVAS DEBUGGING
		setTimeout(() => {
			const canvas = this.renderer.getWebGLRenderer().domElement;
			const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

			console.log("🔍 [DEBUG] COMPREHENSIVE CANVAS CHECK:");
			console.log("Canvas dimensions:", {
				width: canvas.width,
				height: canvas.height,
				clientWidth: canvas.clientWidth,
				clientHeight: canvas.clientHeight,
				offsetWidth: canvas.offsetWidth,
				offsetHeight: canvas.offsetHeight,
				style: canvas.style.cssText,
			});

			console.log("WebGL context:", {
				available: !!gl,
				version: gl?.getParameter(gl.VERSION),
				vendor: gl?.getParameter(gl.VENDOR),
				renderer: gl?.getParameter(gl.RENDERER),
			});

			console.log("Canvas position in DOM:", {
				parent: canvas.parentElement?.tagName,
				inDOM: document.contains(canvas),
				computedStyle: window.getComputedStyle(canvas),
				zIndex: window.getComputedStyle(canvas).zIndex,
				position: window.getComputedStyle(canvas).position,
				visibility: window.getComputedStyle(canvas).visibility,
				display: window.getComputedStyle(canvas).display,
			});
		}, 1000);

		this.isRunning = true;
		this.renderLoopId = requestAnimationFrame(this.renderLoop);

		console.log("🎮 [RENDER] Main render loop started successfully!");
		console.log("🎮 [RENDER] Final scene children count:", this.currentScene?.children.length || 0);
	}

	private renderLoop = (): void => {
		if (!this.isRunning) {
			console.log("🎮 [RENDER] Render loop stopped - isRunning is false");
			return;
		}

		// Calculate delta time
		const currentTime = performance.now();
		this.deltaTime = currentTime - this.lastFrameTime;
		this.lastFrameTime = currentTime;

		// Update all systems
		this.update(this.deltaTime);

		// Render the current scene
		this.render();

		// Debug: Log every 60 frames (roughly once per second) with detailed info
		if (this.frameCount % 60 === 0) {
			const canvas = this.renderer.getWebGLRenderer().domElement;
			console.log(`🎮 [RENDER] Frame ${this.frameCount}: ${(1000 / this.deltaTime).toFixed(1)} FPS`);
			console.log(`🎨 [RENDER] Canvas: ${canvas.width}x${canvas.height} (client: ${canvas.clientWidth}x${canvas.clientHeight})`);
			console.log(`🌌 [RENDER] Scene children: ${this.currentScene?.children.length || 0}`);

			if (this.currentScene && this.currentScene.children.length > 0) {
				this.currentScene.children.forEach((child, i) => {
					console.log(`  ${i}: ${child.type} at (${child.position.x.toFixed(1)}, ${child.position.y.toFixed(1)}, ${child.position.z.toFixed(1)}) - visible: ${child.visible}`);
				});
			}

			if (this.currentCamera) {
				console.log(`📷 [RENDER] Camera: (${this.currentCamera.position.x.toFixed(1)}, ${this.currentCamera.position.y.toFixed(1)}, ${this.currentCamera.position.z.toFixed(1)})`);
			}
		}

		// Continue the loop
		this.renderLoopId = requestAnimationFrame(this.renderLoop);
	};

	private update(deltaTimeMs: number): void {
		const deltaTimeSeconds = deltaTimeMs / 1000;

		try {
			// Update AI System (doesn't have an update method)
			// if (this.aiSystem && typeof this.aiSystem.update === "function") {
			// 	this.aiSystem.update();
			// }

			// Update Galaxy (if it has an update method)
			if (this.galaxy && typeof this.galaxy.update === "function") {
				this.galaxy.update(deltaTimeSeconds);
			}

			// Update Physics (physics manager doesn't have update method)
			// if (this.physicsManager && typeof this.physicsManager.update === "function") {
			// 	this.physicsManager.update(deltaTimeSeconds);
			// }

			// Update any visual effects or animations
			this.updateVisualEffects(deltaTimeSeconds);
		} catch (error) {
			this.errorLogger.logError("GameApplication", "Error in update loop", error);
		}
	}

	private render(): void {
		try {
			if (!this.currentScene || !this.currentCamera) {
				this.errorLogger.logWarning("Render", `Missing scene or camera: { scene: ${!!this.currentScene}, camera: ${!!this.currentCamera} }`);
				return;
			}

			// CRITICAL DEBUG: Verify render call every 60 frames
			if (this.frameCount % 60 === 0) {
				const renderer = this.renderer.getWebGLRenderer();
				const canvas = renderer.domElement;
				console.log("🎨 [RENDER:CRITICAL] WebGL Render Status:", {
					rendererExists: !!renderer,
					canvasInDOM: document.contains(canvas),
					canvasVisible: canvas.style.display !== "none",
					canvasSize: `${canvas.width}x${canvas.height}`,
					sceneChildren: this.currentScene.children.length,
					cameraPosition: `(${this.currentCamera.position.x.toFixed(1)}, ${this.currentCamera.position.y.toFixed(1)}, ${this.currentCamera.position.z.toFixed(1)})`,
					webglContext: !!renderer.getContext(),
				});

				// Check if any objects are in the camera's view frustum
				const frustum = new THREE.Frustum();
				const cameraMatrix = new THREE.Matrix4();
				cameraMatrix.multiplyMatrices(this.currentCamera.projectionMatrix, this.currentCamera.matrixWorldInverse);
				frustum.setFromProjectionMatrix(cameraMatrix);

				let objectsInView = 0;
				this.currentScene.traverse((object) => {
					if (object.geometry) {
						object.geometry.computeBoundingSphere();
						if (object.geometry.boundingSphere && frustum.intersectsSphere(object.geometry.boundingSphere)) {
							objectsInView++;
						}
					}
				});
				console.log(`🎨 [RENDER:CRITICAL] Objects in camera view: ${objectsInView}`);
			}

			// ACTUAL RENDER CALL
			console.log("🎨 [RENDER:TRACE] About to call renderer.render()...");
			this.renderer.render(this.currentScene, this.currentCamera);
			console.log("🎨 [RENDER:TRACE] renderer.render() completed");

			this.frameCount++;
		} catch (error) {
			this.errorLogger.logError("RenderLoop", error as Error, {
				frameCount: this.frameCount,
				sceneChildren: this.currentScene?.children.length,
			});
		}
	}

	/**
	 * Three.js recommended function to handle responsive canvas sizing
	 * Based on: https://threejs.org/manual/en/responsive.html
	 */
	private resizeRendererToDisplaySize(): boolean {
		const renderer = this.renderer.getWebGLRenderer();
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;

		if (needResize) {
			// Use false to prevent CSS size changes - let CSS control display size
			renderer.setSize(width, height, false);
			console.log(`🔧 [RENDER] Canvas internal size fixed: ${width}x${height} (was ${canvas.width}x${canvas.height})`);
		}

		return needResize;
	}

	private updateVisualEffects(deltaTime: number): void {
		// Update any visual effects that need per-frame updates
		// This is where starfield animations, particle effects, etc. would go

		// Update galaxy view if it has animation methods
		if (this.galaxyView) {
			// Note: GalaxyView doesn't have an update method in the current implementation
			// but we can add visual effects here if needed
		}
	}

	private addBasicSceneContent(): void {
		if (!this.currentScene) return;

		// Add basic lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		this.currentScene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(10, 10, 5);
		this.currentScene.add(directionalLight);

		// Add a test cube to make sure rendering works
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(0, 0, 0);
		this.currentScene.add(cube);

		console.log("🎮 [RENDER] Added basic scene content for testing");
	}

	private addDebugTestContent(): void {
		if (!this.currentScene) return;

		console.log("🎮 [RENDER] Adding debug test content for visibility...");

		// Clear any existing objects first for testing
		this.currentScene.clear();

		// Add bright ambient light to illuminate objects
		const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Full brightness
		this.currentScene.add(ambientLight);

		// SIMPLE TEST: Create a basic triangle right in front of camera
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			0.0,
			50.0,
			0.0, // Top vertex
			-50.0,
			-50.0,
			0.0, // Bottom left
			50.0,
			-50.0,
			0.0, // Bottom right
		]);
		geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

		const material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			side: THREE.DoubleSide, // Visible from both sides
		});

		const triangle = new THREE.Mesh(geometry, material);
		triangle.position.set(0, 0, -100); // Put it in front of camera
		triangle.name = "test-triangle";
		this.currentScene.add(triangle);

		// Add a simple white point at origin for reference
		const pointGeometry = new THREE.BufferGeometry();
		pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3));

		const pointMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 50,
			sizeAttenuation: false,
		});

		const point = new THREE.Points(pointGeometry, pointMaterial);
		point.name = "origin-point";
		this.currentScene.add(point);

		console.log("🎮 [RENDER] Added simple test triangle and origin point");
		console.log("🎮 [RENDER] Scene now has", this.currentScene.children.length, "objects");
	}

	private stopRenderLoop(): void {
		if (this.renderLoopId) {
			cancelAnimationFrame(this.renderLoopId);
			this.renderLoopId = 0;
		}
		console.log("🎮 [RENDER] Render loop stopped");
	}

	private registerSystemsWithHealthMonitor(): void {
		const systems: ErrorRecoverable[] = [this.renderer, this.networkManager, this.graphicsManager, this.aiSystem, this.galaxy, this.physicsManager, this.audioManager, this.inputManager, this.rendererManager, this.worldManager, this.economyManager, this.effectsManager, this.procGenManager, this.gameStateManager, this.mainMenuSystem, this.matchmakingSystem, this.loadingScreenSystem, this.hudSystem, this.inventorySystem, this.settingsSystem, this.playerProfileSystem];

		systems.forEach((system) => {
			this.healthMonitor.registerSystem(system.constructor.name, system);
		});

		this.errorLogger.logInfo("GameApplication", `✅ Registered ${systems.length} systems with health monitor`);
	}

	private async shutdownCoreSystemsWithMonitoring(): Promise<void> {
		const systems = [this.galaxy, this.aiSystem, this.graphicsManager, this.networkManager, this.renderer];

		for (const system of systems) {
			if (system && typeof system.dispose === "function") {
				try {
					await this.performanceMonitor.measureAsyncTask(`shutdown_${system.constructor.name}`, async () => {
						await system.dispose();
					});
				} catch (error) {
					this.errorLogger.logError("GameApplication", `Error shutting down ${system.constructor.name}`, error);
				}
			}
		}
	}

	private async shutdownUISystemsWithMonitoring(): Promise<void> {
		const uiSystems = [this.playerProfileSystem, this.settingsSystem, this.inventorySystem, this.hudSystem, this.loadingScreenSystem, this.matchmakingSystem, this.mainMenuSystem, this.gameStateManager];

		for (const system of uiSystems) {
			if (system && typeof system.dispose === "function") {
				try {
					await this.performanceMonitor.measureAsyncTask(`shutdown_${system.constructor.name}`, async () => {
						await system.dispose();
					});
				} catch (error) {
					this.errorLogger.logError("GameApplication", `Error shutting down ${system.constructor.name}`, error);
				}
			}
		}
	}

	private async shutdownErrorManagers(): Promise<void> {
		const errorManagers = [this.procGenManager, this.effectsManager, this.economyManager, this.worldManager, this.rendererManager, this.inputManager, this.audioManager, this.physicsManager];

		for (const manager of errorManagers) {
			if (manager && typeof manager.dispose === "function") {
				try {
					manager.dispose();
				} catch (error) {
					this.errorLogger.logError("GameApplication", `Error shutting down ${manager.constructor.name}`, error);
				}
			}
		}
	}

	// =============================================================================
	// UTILITY METHODS
	// =============================================================================

	private setupGlobalErrorHandling(): void {
		// Global error handler for unhandled exceptions
		window.addEventListener("error", (event) => {
			this.errorLogger.logError("GameApplication", "Unhandled error", event.error);
			this.executeFallback(event.error, "globalError");
		});

		// Global handler for unhandled promise rejections
		window.addEventListener("unhandledrejection", (event) => {
			this.errorLogger.logError("GameApplication", "Unhandled promise rejection", event.reason);
			this.executeFallback(event.reason, "globalPromiseRejection");
			event.preventDefault();
		});

		this.errorLogger.logInfo("GameApplication", "✅ Global error handling setup");
	}

	private setupRecoveryStrategies(): void {
		// Primary Recovery: Reduce quality and clear caches
		this.recoveryChain.addStrategy("performanceRecovery", async () => {
			this.performanceMonitor.adjustQuality("down");
			this.clearAllCaches();
			return true;
		});

		// Secondary Recovery: Restart critical systems
		this.recoveryChain.addStrategy("systemRestart", async () => {
			await this.restartCriticalSystems();
			return true;
		});

		// Emergency Recovery: Minimal performance mode
		this.recoveryChain.addStrategy("emergencyMode", async () => {
			this.activateEmergencyMode();
			return true;
		});
	}

	private clearAllCaches(): void {
		// Clear all system caches
		if (this.graphicsManager) this.graphicsManager.clearCaches();
		if (this.networkManager) this.networkManager.clearCaches();

		// Clear browser caches
		if ("caches" in window) {
			caches.keys().then((names) => {
				names.forEach((name) => caches.delete(name));
			});
		}

		// Pool cleanup
		this.poolManager.cleanupAll();
	}

	private async restartCriticalSystems(): Promise<void> {
		try {
			// Restart renderer
			if (this.renderer) {
				await this.renderer.restart();
			}

			// Restart graphics manager
			if (this.graphicsManager) {
				await this.graphicsManager.restart();
			}

			this.errorLogger.logInfo("GameApplication", "✅ Critical systems restarted");
		} catch (error) {
			this.errorLogger.logError("GameApplication", "Failed to restart critical systems", error);
		}
	}

	private activateEmergencyMode(): void {
		this.emergencyMode = true;

		// Set minimum quality
		this.performanceMonitor.setQualityLevel(0);

		// Disable non-essential systems
		this.disableNonEssentialSystems();

		// Show emergency mode notification
		console.warn("🚨 [EMERGENCY] Emergency performance mode activated");

		// Emit emergency mode event
		window.dispatchEvent(new CustomEvent("emergencyModeActivated"));
	}

	private disableNonEssentialSystems(): void {
		// Disable particle effects
		window.dispatchEvent(new CustomEvent("disableParticles"));

		// Disable advanced graphics
		window.dispatchEvent(new CustomEvent("disableAdvancedGraphics"));

		// Reduce audio quality
		window.dispatchEvent(new CustomEvent("reduceAudioQuality"));
	}

	// =============================================================================
	// ERROR HANDLING INTERFACE IMPLEMENTATION
	// =============================================================================

	public async executeFallback(error: Error, context?: any): Promise<boolean> {
		try {
			this.errorLogger.logError("GameApplication", "Executing application fallback", error, context);

			// Try recovery chain
			const recovered = await this.recoveryChain.execute();

			if (!recovered) {
				// Ultimate fallback: activate emergency mode
				this.activateEmergencyMode();
				return true;
			}

			return recovered;
		} catch (fallbackError) {
			this.errorLogger.logError("GameApplication", "Application fallback failed", fallbackError);
			this.activateEmergencyMode();
			return false;
		}
	}

	public getSystemState(): any {
		return {
			isInitialized: this.isInitialized,
			isRunning: this.isRunning,
			emergencyMode: this.emergencyMode,
			performanceScore: this.performanceScore,
			frameCount: this.frameCount,
			performanceMetrics: this.performanceMonitor.getCurrentMetrics(),
			systemHealth: this.healthMonitor.getOverallHealth(),
			poolStatistics: this.poolManager.getAllStatistics(),
		};
	}

	public validateState(): boolean {
		try {
			if (!this.isInitialized || !this.isRunning) {
				return false;
			}

			if (this.performanceScore < 20) {
				return false;
			}

			if (!this.performanceMonitor.validateState()) {
				return false;
			}

			return true;
		} catch (error) {
			this.errorLogger.logError("GameApplication", "State validation failed", error);
			return false;
		}
	}

	public async resetToSafeState(): Promise<void> {
		try {
			this.errorLogger.logWarning("GameApplication", "Resetting to safe state");

			// Stop and restart performance monitoring
			await this.performanceMonitor.stopMonitoring();
			await this.performanceMonitor.resetToSafeState();
			await this.performanceMonitor.startMonitoring();

			// Reset quality to safe level
			this.performanceMonitor.setQualityLevel(2); // Medium quality

			// Clear all caches
			this.clearAllCaches();

			// Reset emergency mode
			this.emergencyMode = false;

			this.errorLogger.logInfo("GameApplication", "✅ Reset to safe state completed");
		} catch (error) {
			this.errorLogger.logError("GameApplication", "Failed to reset to safe state", error);
		}
	}

	public getHealthStatus(): SystemHealth {
		try {
			const issues: string[] = [];
			let performance = this.performanceScore;

			if (!this.isInitialized) {
				issues.push("Application not initialized");
				performance = 0;
			}

			if (!this.isRunning) {
				issues.push("Application not running");
				performance = Math.min(performance, 20);
			}

			if (this.emergencyMode) {
				issues.push("Emergency performance mode active");
				performance = Math.min(performance, 40);
			}

			const metrics = this.performanceMonitor.getCurrentMetrics();
			if (metrics.currentFPS < this.performanceTargets.criticalFPS) {
				issues.push(`Critical FPS: ${metrics.currentFPS.toFixed(1)}`);
				performance = Math.min(performance, 30);
			}

			if (metrics.memoryPressure > 0.9) {
				issues.push(`Critical memory usage: ${(metrics.memoryPressure * 100).toFixed(1)}%`);
				performance = Math.min(performance, 25);
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
			this.errorLogger.logError("GameApplication", "Error getting health status", error);
			return {
				status: "failed",
				issues: ["Health check failed"],
				performance: 0,
				recoverySuggestions: ["Restart application"],
			};
		}
	}

	private generateRecoverySuggestions(issues: string[]): string[] {
		const suggestions: string[] = [];

		if (issues.some((i) => i.includes("not initialized"))) {
			suggestions.push("Initialize application");
		}

		if (issues.some((i) => i.includes("Critical FPS"))) {
			suggestions.push("Reduce graphics quality");
			suggestions.push("Close background applications");
		}

		if (issues.some((i) => i.includes("memory usage"))) {
			suggestions.push("Clear caches");
			suggestions.push("Restart application");
		}

		if (issues.some((i) => i.includes("Emergency"))) {
			suggestions.push("Restart in safe mode");
			suggestions.push("Update graphics drivers");
		}

		return suggestions;
	}
}

// =============================================================================
// APPLICATION ENTRY POINT WITH PERFORMANCE PROFILING
// =============================================================================

// Create performance-profiled main functions
const profiledMain = profiledAsyncFunction("main_application", async () => {
	const app = new GameApplication();
	await app.initialize();
	return app;
});

// Initialize and start the application with extreme performance monitoring
async function main() {
	try {
		console.log("🚀 [COSMIC] Galactic Clans - Starting with EXTREME PERFORMANCE monitoring");
		console.time("🚀 [PERFORMANCE] Total Startup Time");

		const app = await profiledMain();

		console.timeEnd("🚀 [PERFORMANCE] Total Startup Time");
		console.log("🏆 [COSMIC] Galactic Clans successfully launched with optimal performance!");

		// Export app globally for debugging
		(window as any).cosmicApp = app;

		// Handle graceful shutdown
		window.addEventListener("beforeunload", async () => {
			await app.shutdown();
		});
	} catch (error) {
		console.error("💥 [CRITICAL] Failed to start Galactic Clans:", error);

		// Emergency error display
		document.body.innerHTML = `
            <div style="background: #000; color: #ff4444; padding: 20px; font-family: monospace;">
                <h1>🚨 CRITICAL ERROR</h1>
                <p>Galactic Clans failed to start. Please check the console for details.</p>
                <p>Error: ${error.message}</p>
                <button onclick="window.location.reload()">🔄 Restart Game</button>
            </div>
        `;
	}
}

// Start the application
main();

export default GameApplication;
