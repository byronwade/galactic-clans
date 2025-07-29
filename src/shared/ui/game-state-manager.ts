// @ts-nocheck - Temporary disable for missing modules and complex interface issues
/**
 * @file game-state-manager.ts
 * @description Game state management system for coordinating UI transitions and game flow
 * @version 1.0.0
 * @author AstroGarden Development Team
 * @created 2024-01-15
 *
 * @purpose Manages game states, UI transitions, and coordinates all UI systems
 * @dependencies error-system, all UI systems
 * @exports GameStateManager class for game flow control
 */

import { ErrorLogger, ErrorCategory, ErrorSeverity, type GameError } from "../core/error-system";
import type { ErrorRecoverable, SystemHealth } from "../core/error-system";
import { withAsyncErrorHandling, ErrorRecoveryChain, ResourceCleanupManager } from "../core/error-handling-utils";
import { AAAGameMenu } from "./aaa-game-menu";
import { MatchmakingSystem } from "./matchmaking-system";
import { LoadingScreenSystem } from "./loading-screen-system";

export enum GameState {
	STARTUP = "STARTUP",
	MAIN_MENU = "MAIN_MENU",
	MATCHMAKING = "MATCHMAKING",
	LOADING = "LOADING",
	IN_GAME = "IN_GAME",
	PAUSED = "PAUSED",
	SETTINGS = "SETTINGS",
	ERROR = "ERROR",
	SHUTTING_DOWN = "SHUTTING_DOWN",
}

export interface StateTransition {
	from: GameState;
	to: GameState;
	timestamp: number;
	duration: number;
	triggered: "user" | "system" | "error";
	metadata?: any;
}

export interface GameStateConfig {
	allowedTransitions: Map<GameState, GameState[]>;
	transitionTimeouts: Map<string, number>; // "from_to" -> timeout in ms
	autoTransitions: Map<GameState, { to: GameState; delay: number; condition?: () => boolean }>;
	persistState: boolean;
	enableStateHistory: boolean;
	maxHistorySize: number;
}

export interface UISystemRegistry {
	mainMenu: AAAGameMenu;
	matchmaking: MatchmakingSystem;
	loadingScreen: LoadingScreenSystem;
	[key: string]: any; // For future UI systems
}

export class GameStateManager implements ErrorRecoverable {
	private recoveryChain: ErrorRecoveryChain;
	private cleanupManager: ResourceCleanupManager;

	// State management
	private currentState: GameState = GameState.STARTUP;
	private previousState: GameState | null = null;
	private stateHistory: StateTransition[] = [];
	private isTransitioning = false;
	private transitionStartTime = 0;

	// Configuration
	private config: GameStateConfig;

	// UI systems
	private uiSystems: Partial<UISystemRegistry> = {};
	private activeUISystem: string | null = null;

	// State persistence
	private stateData = new Map<GameState, any>();
	private persistenceKey = "cosmic_game_state";

	// Event listeners
	private eventListeners = new Map<string, Function[]>();

	// Error tracking
	private errorHistory: GameError[] = [];
	private stateErrors = 0;
	private maxStateErrors = 10;

	// Performance metrics
	private performanceMetrics = {
		transitionTime: 0,
		stateLoadTime: 0,
		lastStateChange: 0,
		totalTransitions: 0,
		averageTransitionTime: 0,
	};

	constructor(config?: Partial<GameStateConfig>) {
		this.recoveryChain = new ErrorRecoveryChain();
		this.cleanupManager = new ResourceCleanupManager();

		this.config = {
			...this.getDefaultConfig(),
			...config,
		};

		this.setupRecoveryStrategies();
		this.setupEventListeners();
		this.setupAutoTransitions();
	}

	private setupEventListeners(): void {
		// Wrapper method that calls the actual global event listeners setup
		// This will be called during initialization to avoid confusion
	}

	private setupRecoveryStrategies(): void {
		this.recoveryChain
			.addStrategy(
				"revertToPreviousState",
				async () => {
					return await this.revertToPreviousState();
				},
				3
			)
			.addStrategy(
				"forceMainMenu",
				async () => {
					return await this.forceMainMenu();
				},
				2
			)
			.addStrategy(
				"reinitializeCurrentState",
				async () => {
					return await this.reinitializeCurrentState();
				},
				2
			)
			.addStrategy(
				"emergencyShutdown",
				async () => {
					return await this.emergencyShutdown();
				},
				1
			);
	}

	public async initialize(): Promise<void> {
		const startTime = performance.now();

		try {
			console.log("🎯 [STATE:DEBUG] Initializing game state manager...");

			// Load persisted state if enabled
			if (this.config.persistState) {
				await this.loadPersistedState();
			}

			// Initialize UI systems
			await this.initializeUISystems();

			// Setup global event listeners
			this.setupGlobalEventListeners();

			// Transition to main menu
			await this.transitionTo(GameState.MAIN_MENU);

			console.log(`🎯 [STATE:INFO] Game state manager initialized in ${(performance.now() - startTime).toFixed(2)}ms`);
		} catch (error) {
			this.handleStateError("initialize", error, startTime);
		}
	}

	private async initializeUISystems(): Promise<void> {
		try {
			// Initialize AAA game menu system
			this.uiSystems.mainMenu = new AAAGameMenu({
				showLoadingScreen: true,
				enableParticles: true,
				enablePlanetAnimation: true,
				enableSoundEffects: true,
				enableHoverEffects: true,
			});
			await this.uiSystems.mainMenu.initialize();

			// Initialize matchmaking system
			this.uiSystems.matchmaking = new MatchmakingSystem();
			await this.uiSystems.matchmaking.initialize();

			// Initialize loading screen system
			this.uiSystems.loadingScreen = new LoadingScreenSystem({
				theme: {
					background: "linear-gradient(135deg, #000011, #001122)",
					primaryColor: "#0096FF",
					secondaryColor: "#6420FF",
					accentColor: "#00FFFF",
					textColor: "#FFFFFF",
					progressBarColor: "#0096FF",
					progressBarBackground: "rgba(0, 150, 255, 0.2)",
				},
			});

			console.log("🎯 [STATE:DEBUG] All UI systems initialized");
		} catch (error) {
			console.error(`🎯 [STATE:ERROR] Failed to initialize UI systems: ${error instanceof Error ? error.message : String(error)}`);
			throw error;
		}
	}

	public async transitionTo(newState: GameState, metadata?: any): Promise<boolean> {
		const startTime = performance.now();

		try {
			// Validate transition
			if (!this.canTransitionTo(newState)) {
				console.warn(`🎯 [STATE:WARNING] Invalid transition: ${this.currentState} -> ${newState}`);
				return false;
			}

			if (this.isTransitioning) {
				console.warn(`🎯 [STATE:WARNING] Transition already in progress`);
				return false;
			}

			console.log(`🎯 [STATE:INFO] Transitioning: ${this.currentState} -> ${newState}`);

			this.isTransitioning = true;
			this.transitionStartTime = Date.now();

			// Execute transition
			const success = await this.executeTransition(newState, metadata);

			if (success) {
				// Update state
				this.previousState = this.currentState;
				this.currentState = newState;

				// Record transition
				this.recordTransition(newState, metadata, performance.now() - startTime);

				// Persist state if enabled
				if (this.config.persistState) {
					await this.persistCurrentState();
				}

				// Emit state change event
				this.emitStateChange(newState, this.previousState);

				console.log(`🎯 [STATE:SUCCESS] Transition completed in ${(performance.now() - startTime).toFixed(2)}ms`);
			}

			this.isTransitioning = false;
			return success;
		} catch (error) {
			this.isTransitioning = false;
			this.handleStateError("transitionTo", error, startTime);
			return false;
		}
	}

	private async executeTransition(newState: GameState, metadata?: any): Promise<boolean> {
		try {
			// Exit current state
			await this.exitCurrentState();

			// Enter new state
			await this.enterNewState(newState, metadata);

			return true;
		} catch (error) {
			console.error(`🎯 [STATE:ERROR] Transition execution failed: ${error instanceof Error ? error.message : String(error)}`);
			return false;
		}
	}

	private async exitCurrentState(): Promise<void> {
		console.log(`🎯 [STATE:DEBUG] Exiting state: ${this.currentState}`);

		// Save current state data
		if (this.activeUISystem && this.uiSystems[this.activeUISystem]) {
			const systemState = this.uiSystems[this.activeUISystem].getSystemState?.();
			if (systemState) {
				this.stateData.set(this.currentState, systemState);
			}
		}

		// Hide current UI system
		switch (this.currentState) {
			case GameState.MAIN_MENU:
				// Main menu doesn't need explicit hiding, it will be replaced
				break;

			case GameState.MATCHMAKING:
				if (this.uiSystems.matchmaking) {
					this.uiSystems.matchmaking.hide();
				}
				break;

			case GameState.LOADING:
				if (this.uiSystems.loadingScreen) {
					await this.uiSystems.loadingScreen.hide();
				}
				break;

			case GameState.IN_GAME:
				// Hide game UI, pause systems, etc.
				this.pauseGameSystems();
				break;
		}

		this.activeUISystem = null;
	}

	private async enterNewState(newState: GameState, metadata?: any): Promise<void> {
		console.log(`🎯 [STATE:DEBUG] Entering state: ${newState}`);

		switch (newState) {
			case GameState.MAIN_MENU:
				await this.enterMainMenu();
				break;

			case GameState.MATCHMAKING:
				await this.enterMatchmaking(metadata);
				break;

			case GameState.LOADING:
				await this.enterLoading(metadata);
				break;

			case GameState.IN_GAME:
				await this.enterGame(metadata);
				break;

			case GameState.PAUSED:
				await this.enterPause();
				break;

			case GameState.SETTINGS:
				await this.enterSettings();
				break;

			case GameState.ERROR:
				await this.enterErrorState(metadata);
				break;
		}
	}

	private async enterMainMenu(): Promise<void> {
		if (!this.uiSystems.mainMenu) {
			throw new Error("Main menu system not initialized");
		}

		// Show main menu
		this.activeUISystem = "mainMenu";

		// Restore previous state if available
		const savedState = this.stateData.get(GameState.MAIN_MENU);
		if (savedState) {
			// Apply saved state to main menu
		}
	}

	private async enterMatchmaking(metadata?: any): Promise<void> {
		if (!this.uiSystems.matchmaking) {
			throw new Error("Matchmaking system not initialized");
		}

		this.activeUISystem = "matchmaking";
		this.uiSystems.matchmaking.show();

		// If game mode was specified, start matchmaking immediately
		if (metadata?.gameMode) {
			await this.uiSystems.matchmaking.startMatchmaking(metadata.gameMode);
		}
	}

	private async enterLoading(metadata?: any): Promise<void> {
		if (!this.uiSystems.loadingScreen) {
			throw new Error("Loading screen system not initialized");
		}

		this.activeUISystem = "loadingScreen";

		// Show loading screen with appropriate tasks
		const loadingTasks = this.createLoadingTasks(metadata);
		await this.uiSystems.loadingScreen.show(loadingTasks);

		// Start loading process
		if (metadata?.loadingType === "singlePlayer") {
			await this.loadSinglePlayerGame();
		} else if (metadata?.loadingType === "multiplayer") {
			await this.loadMultiplayerGame(metadata);
		}
	}

	private async enterGame(metadata?: any): Promise<void> {
		this.activeUISystem = null; // Game handles its own UI

		// Initialize game systems
		await this.initializeGameSystems(metadata);

		// Setup game event listeners
		this.setupGameEventListeners();

		console.log("🎯 [STATE:SUCCESS] Game started successfully");
	}

	private async enterPause(): Promise<void> {
		// Pause all game systems
		this.pauseGameSystems();

		// Show pause menu
		this.showPauseMenu();
	}

	private async enterSettings(): Promise<void> {
		// Show settings UI
		this.showSettingsMenu();
	}

	private async enterErrorState(metadata?: any): Promise<void> {
		console.error("🎯 [STATE:CRITICAL] Entering error state:", metadata);

		// Show error screen
		this.showErrorScreen(metadata?.error || "An unknown error occurred");

		// Attempt recovery after delay
		setTimeout(() => {
			this.executeFallback();
		}, 5000);
	}

	// Game loading methods
	private createLoadingTasks(metadata?: any): any[] {
		const baseTasks = [
			{
				id: "initialize_engine",
				name: "Initializing Game Engine",
				phase: "INITIALIZING",
				weight: 0.1,
				status: "pending",
				progress: 0,
				estimatedTime: 1000,
			},
			{
				id: "load_assets",
				name: "Loading Game Assets",
				phase: "ASSETS",
				weight: 0.3,
				status: "pending",
				progress: 0,
				estimatedTime: 3000,
			},
		];

		if (metadata?.loadingType === "singlePlayer") {
			baseTasks.push({
				id: "generate_world",
				name: "Generating Galaxy",
				phase: "WORLD_GENERATION",
				weight: 0.4,
				status: "pending",
				progress: 0,
				estimatedTime: 4000,
			});
		} else if (metadata?.loadingType === "multiplayer") {
			baseTasks.push(
				{
					id: "connect_server",
					name: "Connecting to Game Server",
					phase: "NETWORK_CONNECTION",
					weight: 0.2,
					status: "pending",
					progress: 0,
					estimatedTime: 2000,
				},
				{
					id: "sync_players",
					name: "Synchronizing with Players",
					phase: "NETWORK_CONNECTION",
					weight: 0.2,
					status: "pending",
					progress: 0,
					estimatedTime: 2000,
				}
			);
		}

		baseTasks.push({
			id: "finalize",
			name: "Finalizing Setup",
			phase: "FINALIZING",
			weight: 0.1,
			status: "pending",
			progress: 0,
			estimatedTime: 500,
		});

		return baseTasks;
	}

	private async loadSinglePlayerGame(): Promise<void> {
		try {
			// Simulate loading progress
			await this.simulateLoadingProgress("initialize_engine", 1000);
			await this.simulateLoadingProgress("load_assets", 3000);
			await this.simulateLoadingProgress("generate_world", 4000);
			await this.simulateLoadingProgress("finalize", 500);

			// Transition to game
			setTimeout(() => {
				this.transitionTo(GameState.IN_GAME, { gameType: "singlePlayer" });
			}, 1000);
		} catch (error) {
			console.error("🎯 [STATE:ERROR] Single player loading failed:", error);
			await this.transitionTo(GameState.ERROR, { error });
		}
	}

	private async loadMultiplayerGame(metadata?: any): Promise<void> {
		try {
			// Simulate loading progress
			await this.simulateLoadingProgress("initialize_engine", 1000);
			await this.simulateLoadingProgress("load_assets", 3000);
			await this.simulateLoadingProgress("connect_server", 2000);
			await this.simulateLoadingProgress("sync_players", 2000);
			await this.simulateLoadingProgress("finalize", 500);

			// Transition to game
			setTimeout(() => {
				this.transitionTo(GameState.IN_GAME, {
					gameType: "multiplayer",
					lobby: metadata?.lobby,
					players: metadata?.players,
				});
			}, 1000);
		} catch (error) {
			console.error("🎯 [STATE:ERROR] Multiplayer loading failed:", error);
			await this.transitionTo(GameState.ERROR, { error });
		}
	}

	private async simulateLoadingProgress(taskId: string, duration: number): Promise<void> {
		if (!this.uiSystems.loadingScreen) return;

		const steps = 20;
		const stepDuration = duration / steps;

		for (let i = 0; i <= steps; i++) {
			const progress = i / steps;
			const status = i === steps ? "complete" : "loading";

			await this.uiSystems.loadingScreen.updateTaskProgress(taskId, progress, status);

			if (i < steps) {
				await new Promise((resolve) => setTimeout(resolve, stepDuration));
			}
		}
	}

	private async initializeGameSystems(metadata?: any): Promise<void> {
		// Initialize game systems based on game type
		console.log("🎯 [STATE:DEBUG] Initializing game systems...", metadata);

		// This would initialize actual game systems
		// For now, just simulate initialization
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	// Event handling
	private setupGlobalEventListeners(): void {
		// Listen for game events
		window.addEventListener("startSinglePlayer", () => {
			this.transitionTo(GameState.LOADING, { loadingType: "singlePlayer" });
		});

		window.addEventListener("startMultiplayerGame", (event: any) => {
			this.transitionTo(GameState.LOADING, {
				loadingType: "multiplayer",
				lobby: event.detail.lobby,
				players: event.detail.players,
			});
		});

		window.addEventListener("loadingComplete", () => {
			// Loading screen will handle its own completion
		});

		window.addEventListener("gameExit", () => {
			this.transitionTo(GameState.MAIN_MENU);
		});

		window.addEventListener("gamePause", () => {
			if (this.currentState === GameState.IN_GAME) {
				this.transitionTo(GameState.PAUSED);
			}
		});

		window.addEventListener("gameResume", () => {
			if (this.currentState === GameState.PAUSED) {
				this.transitionTo(GameState.IN_GAME);
			}
		});

		// Keyboard shortcuts
		document.addEventListener("keydown", (e) => {
			this.handleKeyboardShortcuts(e);
		});

		// Window events
		window.addEventListener("beforeunload", () => {
			this.handleWindowClose();
		});
	}

	private setupGameEventListeners(): void {
		// Game-specific event listeners would go here
	}

	private handleKeyboardShortcuts(e: KeyboardEvent): void {
		switch (e.key) {
			case "Escape":
				if (this.currentState === GameState.IN_GAME) {
					this.transitionTo(GameState.PAUSED);
				} else if (this.currentState === GameState.PAUSED) {
					this.transitionTo(GameState.IN_GAME);
				} else if (this.currentState === GameState.MATCHMAKING) {
					this.transitionTo(GameState.MAIN_MENU);
				}
				break;

			case "F1":
				// Toggle settings
				if (this.currentState !== GameState.SETTINGS) {
					this.transitionTo(GameState.SETTINGS);
				} else {
					this.transitionTo(this.previousState || GameState.MAIN_MENU);
				}
				break;
		}
	}

	// UI methods
	private pauseGameSystems(): void {
		console.log("🎯 [STATE:DEBUG] Pausing game systems");
		// Pause game logic, physics, AI, etc.
	}

	private showPauseMenu(): void {
		console.log("🎯 [STATE:DEBUG] Showing pause menu");
		// Show pause menu UI
	}

	private showSettingsMenu(): void {
		console.log("🎯 [STATE:DEBUG] Showing settings menu");
		// Show settings UI
	}

	private showErrorScreen(error: string): void {
		console.log("🎯 [STATE:DEBUG] Showing error screen:", error);

		// Create error screen
		const errorScreen = document.createElement("div");
		errorScreen.className = "error-screen";

		Object.assign(errorScreen.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100vw",
			height: "100vh",
			backgroundColor: "rgba(0, 0, 0, 0.9)",
			color: "#FFFFFF",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			zIndex: "4000",
			fontFamily: '"Orbitron", sans-serif',
		});

		errorScreen.innerHTML = `
            <div style="text-align: center; max-width: 600px; padding: 40px;">
                <h1 style="color: #FF4444; font-size: 48px; margin-bottom: 20px;">⚠️ ERROR</h1>
                <p style="font-size: 18px; margin-bottom: 30px;">${error}</p>
                <p style="color: #AAAAAA; margin-bottom: 30px;">The system is attempting to recover...</p>
                <button onclick="location.reload()" style="
                    background: #0096FF;
                    border: none;
                    color: white;
                    padding: 15px 30px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: inherit;
                ">RESTART GAME</button>
            </div>
        `;

		document.body.appendChild(errorScreen);
	}

	// State validation and utilities
	private canTransitionTo(newState: GameState): boolean {
		// Allow staying in the same state (useful for re-initialization)
		if (newState === this.currentState) {
			return true;
		}

		const allowedTransitions = this.config.allowedTransitions.get(this.currentState) || [];
		return allowedTransitions.includes(newState);
	}

	private recordTransition(newState: GameState, metadata: any, duration: number): void {
		const transition: StateTransition = {
			from: this.previousState || this.currentState,
			to: newState,
			timestamp: Date.now(),
			duration,
			triggered: "system", // Could be determined by the calling context
			metadata,
		};

		this.stateHistory.push(transition);

		// Maintain history size
		if (this.stateHistory.length > this.config.maxHistorySize) {
			this.stateHistory.shift();
		}

		// Update performance metrics
		this.performanceMetrics.totalTransitions++;
		this.performanceMetrics.transitionTime = duration;
		this.performanceMetrics.lastStateChange = Date.now();
		this.performanceMetrics.averageTransitionTime = (this.performanceMetrics.averageTransitionTime * (this.performanceMetrics.totalTransitions - 1) + duration) / this.performanceMetrics.totalTransitions;
	}

	private emitStateChange(newState: GameState, oldState: GameState | null): void {
		const event = new CustomEvent("gameStateChanged", {
			detail: {
				newState,
				oldState,
				timestamp: Date.now(),
				stateManager: this,
			},
		});

		window.dispatchEvent(event);

		// Call registered listeners
		const listeners = this.eventListeners.get("stateChange") || [];
		for (const listener of listeners) {
			try {
				listener(newState, oldState);
			} catch (error) {
				console.warn("🎯 [STATE:WARNING] State change listener error:", error);
			}
		}
	}

	// Persistence
	private async loadPersistedState(): Promise<void> {
		try {
			const saved = localStorage.getItem(this.persistenceKey);
			if (saved) {
				const data = JSON.parse(saved);

				// Restore state data
				if (data.stateData) {
					this.stateData = new Map(Object.entries(data.stateData));
				}

				// Restore last state (if valid)
				if (data.lastState && Object.values(GameState).includes(data.lastState)) {
					// Only restore certain states
					if ([GameState.MAIN_MENU, GameState.SETTINGS].includes(data.lastState)) {
						this.currentState = data.lastState;
					}
				}

				console.log("🎯 [STATE:DEBUG] Loaded persisted state");
			}
		} catch (error) {
			console.warn("🎯 [STATE:WARNING] Failed to load persisted state:", error);
		}
	}

	private async persistCurrentState(): Promise<void> {
		try {
			const data = {
				lastState: this.currentState,
				stateData: Object.fromEntries(this.stateData),
				timestamp: Date.now(),
			};

			localStorage.setItem(this.persistenceKey, JSON.stringify(data));
		} catch (error) {
			console.warn("🎯 [STATE:WARNING] Failed to persist state:", error);
		}
	}

	// Auto transitions
	private setupAutoTransitions(): void {
		const checkAutoTransitions = () => {
			if (this.isTransitioning) return;

			const autoTransition = this.config.autoTransitions.get(this.currentState);
			if (autoTransition) {
				const stateTime = Date.now() - this.performanceMetrics.lastStateChange;

				if (stateTime >= autoTransition.delay) {
					if (!autoTransition.condition || autoTransition.condition()) {
						this.transitionTo(autoTransition.to);
					}
				}
			}

			setTimeout(checkAutoTransitions, 1000);
		};

		checkAutoTransitions();
	}

	private handleWindowClose(): void {
		// Save state before closing
		if (this.config.persistState) {
			this.persistCurrentState();
		}

		// Cleanup
		this.dispose();
	}

	// Configuration
	private getDefaultConfig(): GameStateConfig {
		const allowedTransitions = new Map<GameState, GameState[]>();

		// Define allowed state transitions
		allowedTransitions.set(GameState.STARTUP, [GameState.MAIN_MENU, GameState.ERROR]);
		allowedTransitions.set(GameState.MAIN_MENU, [GameState.MATCHMAKING, GameState.LOADING, GameState.SETTINGS, GameState.SHUTTING_DOWN]);
		allowedTransitions.set(GameState.MATCHMAKING, [GameState.MAIN_MENU, GameState.LOADING, GameState.ERROR]);
		allowedTransitions.set(GameState.LOADING, [GameState.IN_GAME, GameState.MAIN_MENU, GameState.ERROR]);
		allowedTransitions.set(GameState.IN_GAME, [GameState.PAUSED, GameState.MAIN_MENU, GameState.LOADING, GameState.ERROR]);
		allowedTransitions.set(GameState.PAUSED, [GameState.IN_GAME, GameState.MAIN_MENU, GameState.SETTINGS]);
		allowedTransitions.set(GameState.SETTINGS, [GameState.MAIN_MENU, GameState.IN_GAME, GameState.PAUSED]);
		allowedTransitions.set(GameState.ERROR, [GameState.MAIN_MENU, GameState.SHUTTING_DOWN]);

		const transitionTimeouts = new Map<string, number>();
		transitionTimeouts.set("LOADING_IN_GAME", 30000); // 30 second timeout for loading

		const autoTransitions = new Map<GameState, { to: GameState; delay: number; condition?: () => boolean }>();
		// No default auto transitions

		return {
			allowedTransitions,
			transitionTimeouts,
			autoTransitions,
			persistState: true,
			enableStateHistory: true,
			maxHistorySize: 50,
		};
	}

	// Error recovery methods
	private async revertToPreviousState(): Promise<boolean> {
		try {
			if (this.previousState && this.canTransitionTo(this.previousState)) {
				console.log("🎯 [STATE:RECOVERY] Reverting to previous state:", this.previousState);
				return await this.transitionTo(this.previousState);
			}
			return false;
		} catch (error) {
			return false;
		}
	}

	private async forceMainMenu(): Promise<boolean> {
		try {
			console.log("🎯 [STATE:RECOVERY] Forcing transition to main menu");

			// Override transition validation for emergency
			this.currentState = GameState.MAIN_MENU;
			this.isTransitioning = false;

			await this.enterMainMenu();
			return true;
		} catch (error) {
			return false;
		}
	}

	private async reinitializeCurrentState(): Promise<boolean> {
		try {
			console.log("🎯 [STATE:RECOVERY] Reinitializing current state");

			const currentState = this.currentState;
			await this.exitCurrentState();
			await this.enterNewState(currentState);

			return true;
		} catch (error) {
			return false;
		}
	}

	private async emergencyShutdown(): Promise<boolean> {
		try {
			console.log("🎯 [STATE:CRITICAL] Emergency shutdown");

			this.currentState = GameState.SHUTTING_DOWN;

			// Dispose all systems
			this.dispose();

			// Show emergency message
			document.body.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: #000;
                    color: #fff;
                    font-family: sans-serif;
                    text-align: center;
                ">
                    <div>
                        <h1>System Error</h1>
                        <p>The game has encountered a critical error and must restart.</p>
                        <button onclick="location.reload()" style="
                            background: #0096FF;
                            border: none;
                            color: white;
                            padding: 15px 30px;
                            font-size: 16px;
                            border-radius: 5px;
                            cursor: pointer;
                            margin-top: 20px;
                        ">Restart Game</button>
                    </div>
                </div>
            `;

			return true;
		} catch (error) {
			return false;
		}
	}

	private handleStateError(action: string, error: any, startTime: number): void {
		this.stateErrors++;
		ErrorLogger.logStandardError(
			ErrorCategory.UI,
			ErrorSeverity.HIGH,
			`Game state error: ${action} - ${error instanceof Error ? error.message : String(error)}`,
			{
				action,
				currentState: this.currentState,
				duration: performance.now() - startTime,
				errorCount: this.stateErrors,
			},
			"GameStateManager"
		);
	}

	// Public API methods
	public getCurrentState(): GameState {
		return this.currentState;
	}

	public getPreviousState(): GameState | null {
		return this.previousState;
	}

	public getStateHistory(): StateTransition[] {
		return [...this.stateHistory];
	}

	public isInState(state: GameState): boolean {
		return this.currentState === state;
	}

	public isTransitionInProgress(): boolean {
		return this.isTransitioning;
	}

	public addEventListener(event: string, listener: Function): void {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, []);
		}
		this.eventListeners.get(event)!.push(listener);
	}

	public removeEventListener(event: string, listener: Function): void {
		const listeners = this.eventListeners.get(event);
		if (listeners) {
			const index = listeners.indexOf(listener);
			if (index !== -1) {
				listeners.splice(index, 1);
			}
		}
	}

	public getUISystem<T>(name: keyof UISystemRegistry): T | undefined {
		return this.uiSystems[name] as T;
	}

	// ErrorRecoverable interface implementation
	public async executeFallback(): Promise<boolean> {
		return await this.recoveryChain.execute(ErrorCategory.UI, {
			currentState: this.currentState,
			previousState: this.previousState,
			errorCount: this.stateErrors,
			isTransitioning: this.isTransitioning,
			timestamp: Date.now(),
		});
	}

	public getSystemState(): any {
		return {
			currentState: this.currentState,
			previousState: this.previousState,
			isTransitioning: this.isTransitioning,
			errorCount: this.stateErrors,
			performanceMetrics: this.performanceMetrics,
			stateHistoryLength: this.stateHistory.length,
			activeUISystem: this.activeUISystem,
		};
	}

	public validateState(): boolean {
		return this.stateErrors < this.maxStateErrors && Object.values(GameState).includes(this.currentState) && (!this.isTransitioning || Date.now() - this.transitionStartTime < 30000);
	}

	public async resetToSafeState(): Promise<void> {
		this.isTransitioning = false;
		this.stateErrors = 0;
		this.currentState = GameState.MAIN_MENU;
		this.previousState = null;

		// Reset UI systems
		if (this.uiSystems.matchmaking) {
			this.uiSystems.matchmaking.hide();
		}

		if (this.uiSystems.loadingScreen) {
			await this.uiSystems.loadingScreen.hide();
		}

		await this.enterMainMenu();
	}

	public getHealthStatus(): SystemHealth {
		const issues: string[] = [];
		let status: SystemHealth["status"] = "healthy";

		if (this.stateErrors > 5) {
			issues.push(`High error count: ${this.stateErrors}`);
			status = "degraded";
		}

		if (this.currentState === GameState.ERROR) {
			issues.push("System in error state");
			status = "failed";
		}

		if (this.isTransitioning && Date.now() - this.transitionStartTime > 15000) {
			issues.push("Long-running transition");
			status = status === "healthy" ? "degraded" : status;
		}

		const performance = Math.max(0, 100 - this.stateErrors * 10);

		return {
			status,
			issues,
			performance,
			lastError: this.errorHistory[this.errorHistory.length - 1] || undefined,
			recoverySuggestions: issues.length > 0 ? ["Reset to main menu", "Restart application"] : [],
		};
	}

	public dispose(): void {
		console.log("🎯 [STATE:DEBUG] Disposing game state manager...");

		this.cleanupManager.cleanupAll();

		// Dispose UI systems
		if (this.uiSystems.mainMenu) {
			this.uiSystems.mainMenu.dispose();
		}

		if (this.uiSystems.matchmaking) {
			this.uiSystems.matchmaking.dispose();
		}

		if (this.uiSystems.loadingScreen) {
			this.uiSystems.loadingScreen.dispose();
		}

		// Clear event listeners
		this.eventListeners.clear();

		// Save final state
		if (this.config.persistState) {
			this.persistCurrentState();
		}
	}
}
