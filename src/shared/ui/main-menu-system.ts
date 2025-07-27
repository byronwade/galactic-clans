/**
 * @file main-menu-system.ts
 * @description Main menu system with modern game UI features and error handling
 * @version 1.0.0
 * @author AstroGarden Development Team
 * @created 2024-01-15
 *
 * @purpose Manages main menu, game modes, settings, and user authentication
 * @dependencies error-system, UI components, audio system
 * @exports MainMenuSystem class with full menu functionality
 */

import { ErrorLogger, ErrorCategory, ErrorSeverity, GameError } from "../core/error-system";
import type { ErrorRecoverable, SystemHealth } from "../core/error-system";
import { withAsyncErrorHandling, ErrorRecoveryChain, ResourceCleanupManager } from "../core/error-handling-utils";
import * as THREE from "three";
import { PlanetRenderer, type PlanetRenderConfig, PlanetType, DetailLevel } from "../procgen/planet/planet-renderer";
import { PlanetBiome } from "../procgen/planet/little-planet-generator";

export enum MenuState {
	LOADING = "LOADING",
	MAIN_MENU = "MAIN_MENU",
	GAME_MODES = "GAME_MODES",
	SETTINGS = "SETTINGS",
	PROFILE = "PROFILE",
	ACHIEVEMENTS = "ACHIEVEMENTS",
	MATCHMAKING = "MATCHMAKING",
	TRANSITIONING = "TRANSITIONING",
}

export interface MenuTheme {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	text: string;
	hover: string;
	disabled: string;
	success: string;
	warning: string;
	error: string;
}

export interface AnimationSettings {
	fadeInDuration: number;
	fadeOutDuration: number;
	slideSpeed: number;
	hoverScale: number;
	clickScale: number;
	particleSpeed: number;
}

export interface PlayerProfile {
	username: string;
	level: number;
	experience: number;
	gamesPlayed: number;
	gamesWon: number;
	totalPlayTime: number;
	lastPlayed: Date;
	achievements: string[];
	customization: {
		avatar: string;
		banner: string;
		title: string;
	};
}

export class MainMenuSystem implements ErrorRecoverable {
	private recoveryChain: ErrorRecoveryChain;
	private cleanupManager: ResourceCleanupManager;

	// Menu state
	private currentState: MenuState = MenuState.LOADING;
	private previousState: MenuState = MenuState.MAIN_MENU;
	private stateHistory: MenuState[] = [];
	private isTransitioning = false;

	// UI elements
	private menuContainer!: HTMLElement;
	private backgroundVideo!: HTMLVideoElement;
	private particleCanvas!: HTMLCanvasElement;
	private particleContext!: CanvasRenderingContext2D;
	private audioContext?: AudioContext;

	// Three.js elements for little planet
	private threeScene?: THREE.Scene;
	private threeCamera?: THREE.PerspectiveCamera;
	private threeRenderer?: THREE.WebGLRenderer;
	private planetRenderer?: PlanetRenderer;
	private planetGroup?: THREE.Group;

	// Menu components
	private mainMenuButtons: Map<string, HTMLElement> = new Map();
	private settingsPanel!: HTMLElement;
	private profilePanel!: HTMLElement;
	private achievementsPanel!: HTMLElement;

	// Configuration
	private theme: MenuTheme;
	private animations: AnimationSettings;
	private playerProfile?: PlayerProfile;

	// Error tracking
	private errorHistory: GameError[] = [];
	private menuErrors = 0;
	private maxMenuErrors = 10;

	// Performance tracking
	private performanceMetrics = {
		menuLoadTime: 0,
		transitionTime: 0,
		renderTime: 0,
		lastFrameTime: 0,
		fps: 60,
	};

	constructor() {
		this.recoveryChain = new ErrorRecoveryChain();
		this.cleanupManager = new ResourceCleanupManager();

		this.theme = this.getDefaultTheme();
		this.animations = this.getDefaultAnimations();

		this.setupRecoveryStrategies();
		this.setupPerformanceMonitoring();
	}

	private setupRecoveryStrategies(): void {
		this.recoveryChain
			.addStrategy(
				"reloadMenuAssets",
				async () => {
					return await this.reloadMenuAssets();
				},
				3
			)
			.addStrategy(
				"resetToMainMenu",
				async () => {
					return await this.resetToMainMenu();
				},
				2
			)
			.addStrategy(
				"useBasicMenu",
				async () => {
					return await this.useBasicMenu();
				},
				2
			)
			.addStrategy(
				"emergencyMenuMode",
				async () => {
					return await this.emergencyMenuMode();
				},
				1
			);
	}

	public async initialize(): Promise<void> {
		const startTime = performance.now();

		try {
			console.log("🎮 [MENU:DEBUG] Initializing main menu system...");

			// Create menu container
			await this.createMenuContainer();

			// Load assets
			await this.loadMenuAssets();

			// Initialize components
			await this.initializeMenuComponents();

			// Setup event listeners
			this.setupEventListeners();

			// Initialize particle system
			await this.initializeParticleSystem();

			// Load player profile
			await this.loadPlayerProfile();

			// Start render loop
			this.startRenderLoop();

			// Transition to main menu
			await this.transitionToState(MenuState.MAIN_MENU);

			this.performanceMetrics.menuLoadTime = performance.now() - startTime;
			console.log(`🎮 [MENU:INFO] Main menu initialized in ${this.performanceMetrics.menuLoadTime.toFixed(2)}ms`);
		} catch (error) {
			this.handleInitializationError(error, startTime);
		}
	}

	private async createMenuContainer(): Promise<void> {
		this.menuContainer = document.createElement("div");
		this.menuContainer.id = "main-menu-container";
		this.menuContainer.className = "cosmic-main-menu";

		// Apply base styling
		Object.assign(this.menuContainer.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100vw",
			height: "100vh",
			backgroundColor: this.theme.background,
			color: this.theme.text,
			fontFamily: '"Orbitron", "Segoe UI", sans-serif',
			overflow: "hidden",
			zIndex: "1000",
		});

		// Add CSS to hide game UI elements
		const style = document.createElement("style");
		style.textContent = `
			#main-menu-container ~ #game-ui,
			#main-menu-container ~ * [class*="hud"],
			#main-menu-container ~ * [id*="hud"],
			#main-menu-container ~ * [class*="minimap"],
			#main-menu-container ~ * [id*="minimap"],
			#main-menu-container ~ * [class*="game-"],
			#main-menu-container ~ * [class*="resource"],
			#main-menu-container ~ * [class*="tactical"] {
				display: none !important;
				visibility: hidden !important;
				opacity: 0 !important;
				pointer-events: none !important;
			}
		`;
		document.head.appendChild(style);

		document.body.appendChild(this.menuContainer);

		// Hide game UI elements when main menu is active
		this.hideGameUI();
	}

	/**
	 * Hide all game UI elements during main menu
	 */
	private hideGameUI(): void {
		const gameUIElements = ["#game-ui", "#navigation-breadcrumb", "#detail-panel", "#resource-panel", "#panel-toggle", ".top-controls", ".game-speed-controls", "#help-overlay", ".minimap-container", ".hud-overlay", ".hud-top-bar", ".hud-bottom-bar", ".hud-left-panel", ".hud-right-panel"];

		gameUIElements.forEach((selector) => {
			const element = document.querySelector(selector) as HTMLElement;
			if (element) {
				element.style.display = "none";
			}
		});

		// More aggressive hiding - hide the entire game-ui container
		const gameUIContainer = document.querySelector("#game-ui") as HTMLElement;
		if (gameUIContainer) {
			gameUIContainer.style.display = "none";
			gameUIContainer.style.visibility = "hidden";
			gameUIContainer.style.opacity = "0";
			gameUIContainer.style.pointerEvents = "none";
		}

		// Hide any HUD elements that might be created dynamically
		const hudElements = document.querySelectorAll('[class*="hud"], [id*="hud"], [class*="minimap"], [id*="minimap"]');
		hudElements.forEach((element) => {
			(element as HTMLElement).style.display = "none";
		});

		// Hide any elements with game-related classes
		const gameElements = document.querySelectorAll('[class*="game-"], [class*="resource"], [class*="tactical"]');
		gameElements.forEach((element) => {
			(element as HTMLElement).style.display = "none";
		});

		console.log("🎮 [MENU] Game UI elements hidden aggressively");
	}

	/**
	 * Show game UI elements when exiting main menu
	 */
	public showGameUI(): void {
		const gameUIElements = ["#game-ui", "#navigation-breadcrumb", "#resource-panel", "#panel-toggle", ".top-controls", ".game-speed-controls"];

		gameUIElements.forEach((selector) => {
			const element = document.querySelector(selector) as HTMLElement;
			if (element) {
				element.style.display = "";
			}
		});

		console.log("🎮 [MENU] Game UI elements restored");
	}

	private async loadMenuAssets(): Promise<void> {
		const promises: Promise<void>[] = [];

		// Load background video
		promises.push(this.loadBackgroundVideo());

		// Load audio assets
		promises.push(this.loadAudioAssets());

		// Load fonts
		promises.push(this.loadFonts());

		// Load images
		promises.push(this.loadImages());

		await Promise.all(promises);
	}

	private async loadBackgroundVideo(): Promise<void> {
		try {
			this.backgroundVideo = document.createElement("video");
			this.backgroundVideo.className = "menu-background-video";

			Object.assign(this.backgroundVideo.style, {
				position: "absolute",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				objectFit: "cover",
				zIndex: "-1",
				opacity: "0.3",
			});

			this.backgroundVideo.autoplay = true;
			this.backgroundVideo.muted = true;
			this.backgroundVideo.loop = true;

			// Create fallback background if video fails
			const createFallbackBackground = () => {
				const fallbackDiv = document.createElement("div");
				fallbackDiv.className = "menu-background-fallback";
				Object.assign(fallbackDiv.style, {
					position: "absolute",
					top: "0",
					left: "0",
					width: "100%",
					height: "100%",
					background: "radial-gradient(ellipse at center, #001122 0%, #000011 50%, #000000 100%)",
					zIndex: "-1",
					opacity: "0.8",
				});
				this.menuContainer.appendChild(fallbackDiv);
			};

			// Try to load video, but don't fail if it doesn't exist
			const videoSources = [
				"/assets/videos/cosmic-background.mp4",
				"/assets/videos/menu-background.mp4",
				"assets/videos/cosmic-background.mp4", // Alternative path
			];

			let videoLoaded = false;
			for (const src of videoSources) {
				try {
					await new Promise<void>((resolve, reject) => {
						const tempVideo = document.createElement("video");
						tempVideo.addEventListener("loadeddata", () => {
							this.backgroundVideo.src = src;
							this.menuContainer.appendChild(this.backgroundVideo);
							videoLoaded = true;
							resolve();
						});
						tempVideo.addEventListener("error", () => reject());
						tempVideo.src = src;

						// Timeout after 2 seconds
						setTimeout(() => reject(new Error("Video load timeout")), 2000);
					});
					break; // If we get here, video loaded successfully
				} catch {
					// Continue to next video source
					continue;
				}
			}

			// If no video loaded, create fallback background
			if (!videoLoaded) {
				console.log("🎮 [MENU:INFO] Using fallback background (no video found)");
				createFallbackBackground();
			}
		} catch (error) {
			console.warn(`🎮 [MENU:WARNING] Video background failed, using fallback: ${error instanceof Error ? error.message : String(error)}`);
			// Create fallback background
			const fallbackDiv = document.createElement("div");
			fallbackDiv.className = "menu-background-fallback";
			Object.assign(fallbackDiv.style, {
				position: "absolute",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				background: "radial-gradient(ellipse at center, #001122 0%, #000011 50%, #000000 100%)",
				zIndex: "-1",
				opacity: "0.8",
			});
			this.menuContainer.appendChild(fallbackDiv);
		}
	}

	private async loadAudioAssets(): Promise<void> {
		try {
			// Skip audio loading if not supported or in development
			if (typeof window === "undefined" || (!window.AudioContext && !(window as any).webkitAudioContext)) {
				console.log("🎮 [MENU:INFO] Audio not supported, skipping audio asset loading");
				return;
			}

			this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

			// Load menu music and sound effects - only if they actually exist
			const audioAssets = ["/assets/audio/menu-ambient.ogg", "/assets/audio/menu-click.ogg", "/assets/audio/menu-hover.ogg", "/assets/audio/menu-transition.ogg"];

			let loadedCount = 0;
			const loadPromises = audioAssets.map(async (src) => {
				try {
					// First check if the file exists and is not empty
					const response = await fetch(src, { method: "HEAD" });
					if (!response.ok || response.headers.get("content-length") === "0") {
						console.log(`🎮 [MENU:INFO] Skipping empty/missing audio file: ${src}`);
						return;
					}

					// Now actually load the audio data
					const fullResponse = await fetch(src);
					const audioData = await fullResponse.arrayBuffer();

					if (audioData.byteLength === 0) {
						console.log(`🎮 [MENU:INFO] Skipping empty audio file: ${src}`);
						return;
					}

					await this.audioContext!.decodeAudioData(audioData);
					loadedCount++;
					console.log(`🎮 [MENU:DEBUG] Successfully loaded audio: ${src}`);
				} catch (error) {
					console.log(`🎮 [MENU:INFO] Failed to load audio (expected in development): ${src}`);
				}
			});

			await Promise.allSettled(loadPromises);
			console.log(`🎮 [MENU:INFO] Audio loading complete: ${loadedCount}/${audioAssets.length} files loaded`);
		} catch (error) {
			console.log(`🎮 [MENU:INFO] Audio system not available: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private async loadFonts(): Promise<void> {
		const fonts = ["Orbitron:400,700,900", "Exo+2:300,400,600"];

		for (const font of fonts) {
			const link = document.createElement("link");
			link.href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
			link.rel = "stylesheet";
			document.head.appendChild(link);
		}
	}

	private async loadImages(): Promise<void> {
		const images = ["/assets/images/logo.png", "/assets/images/menu-bg.jpg", "/assets/images/particles.png"];

		const loadPromises = images.map((src) => {
			return new Promise<void>((resolve) => {
				const img = new Image();
				img.onload = () => resolve();
				img.onerror = () => resolve(); // Continue even if image fails
				img.src = src;
			});
		});

		await Promise.all(loadPromises);
	}

	private async initializeMenuComponents(): Promise<void> {
		// Main menu buttons
		await this.createMainMenuButtons();

		// Settings panel
		await this.createSettingsPanel();

		// Profile panel
		await this.createProfilePanel();

		// Achievements panel
		await this.createAchievementsPanel();

		// Logo and title
		await this.createLogoAndTitle();

		// Version info
		await this.createVersionInfo();
	}

	private async createMainMenuButtons(): Promise<void> {
		const buttons = [
			{ id: "play", text: "PLAY GAME", icon: "🚀" },
			{ id: "multiplayer", text: "MULTIPLAYER", icon: "🌌" },
			{ id: "profile", text: "PROFILE", icon: "👤" },
			{ id: "achievements", text: "ACHIEVEMENTS", icon: "🏆" },
			{ id: "settings", text: "SETTINGS", icon: "⚙️" },
			{ id: "exit", text: "EXIT GAME", icon: "🚪" },
		];

		const buttonContainer = document.createElement("div");
		buttonContainer.className = "main-menu-buttons";

		Object.assign(buttonContainer.style, {
			position: "absolute",
			right: "15%",
			top: "50%",
			transform: "translateY(-50%)",
			display: "flex",
			flexDirection: "column",
			gap: "20px",
			zIndex: "10",
		});

		for (const buttonConfig of buttons) {
			const button = await this.createMenuButton(buttonConfig);
			this.mainMenuButtons.set(buttonConfig.id, button);
			buttonContainer.appendChild(button);
		}

		this.menuContainer.appendChild(buttonContainer);
	}

	private async createMenuButton(config: { id: string; text: string; icon: string }): Promise<HTMLElement> {
		const button = document.createElement("button");
		button.id = `menu-btn-${config.id}`;
		button.className = "cosmic-menu-button";

		// Button structure
		button.innerHTML = `
            <span class="button-icon">${config.icon}</span>
            <span class="button-text">${config.text}</span>
            <div class="button-glow"></div>
        `;

		// Styling
		Object.assign(button.style, {
			background: "linear-gradient(135deg, rgba(0, 150, 255, 0.1), rgba(100, 0, 255, 0.1))",
			border: `2px solid ${this.theme.primary}`,
			borderRadius: "8px",
			padding: "15px 30px",
			color: this.theme.text,
			fontSize: "18px",
			fontFamily: '"Orbitron", monospace',
			fontWeight: "600",
			cursor: "pointer",
			position: "relative",
			minWidth: "250px",
			textAlign: "left",
			display: "flex",
			alignItems: "center",
			gap: "15px",
			transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
			backdropFilter: "blur(10px)",
			overflow: "hidden",
		});

		// Event listeners with error handling
		button.addEventListener("click", async (e) => {
			e.preventDefault();
			await this.handleButtonClick(config.id);
		});

		button.addEventListener("mouseenter", () => {
			this.handleButtonHover(button, true);
		});

		button.addEventListener("mouseleave", () => {
			this.handleButtonHover(button, false);
		});

		return button;
	}

	private async createSettingsPanel(): Promise<void> {
		this.settingsPanel = document.createElement("div");
		this.settingsPanel.className = "settings-panel";
		this.settingsPanel.style.display = "none";

		this.settingsPanel.innerHTML = `
            <div class="settings-header">
                <h2>⚙️ GAME SETTINGS</h2>
                <button class="close-btn">✕</button>
            </div>
            
            <div class="settings-content">
                <div class="settings-section">
                    <h3>🎮 GAMEPLAY</h3>
                    <div class="setting-item">
                        <label>Game Difficulty</label>
                        <select id="difficulty">
                            <option value="easy">Easy</option>
                            <option value="normal" selected>Normal</option>
                            <option value="hard">Hard</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>Auto-Save</label>
                        <input type="checkbox" id="autosave" checked>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>🎨 GRAPHICS</h3>
                    <div class="setting-item">
                        <label>Quality Preset</label>
                        <select id="quality">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high" selected>High</option>
                            <option value="ultra">Ultra</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>VSync</label>
                        <input type="checkbox" id="vsync" checked>
                    </div>
                    <div class="setting-item">
                        <label>Particle Effects</label>
                        <input type="range" id="particles" min="0" max="100" value="80">
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>🔊 AUDIO</h3>
                    <div class="setting-item">
                        <label>Master Volume</label>
                        <input type="range" id="master-volume" min="0" max="100" value="70">
                    </div>
                    <div class="setting-item">
                        <label>Music Volume</label>
                        <input type="range" id="music-volume" min="0" max="100" value="60">
                    </div>
                    <div class="setting-item">
                        <label>SFX Volume</label>
                        <input type="range" id="sfx-volume" min="0" max="100" value="80">
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>🎯 CONTROLS</h3>
                    <div class="setting-item">
                        <label>Mouse Sensitivity</label>
                        <input type="range" id="sensitivity" min="1" max="10" value="5">
                    </div>
                    <div class="setting-item">
                        <label>Invert Y-Axis</label>
                        <input type="checkbox" id="invert-y">
                    </div>
                </div>
            </div>
            
            <div class="settings-footer">
                <button class="btn-secondary" id="reset-defaults">Reset to Defaults</button>
                <button class="btn-primary" id="apply-settings">Apply Changes</button>
            </div>
        `;

		this.applyPanelStyling(this.settingsPanel);
		this.menuContainer.appendChild(this.settingsPanel);
	}

	private async createProfilePanel(): Promise<void> {
		this.profilePanel = document.createElement("div");
		this.profilePanel.className = "profile-panel";
		this.profilePanel.style.display = "none";

		// Will be populated when player profile is loaded
		this.menuContainer.appendChild(this.profilePanel);
	}

	private async createAchievementsPanel(): Promise<void> {
		this.achievementsPanel = document.createElement("div");
		this.achievementsPanel.className = "achievements-panel";
		this.achievementsPanel.style.display = "none";

		this.achievementsPanel.innerHTML = `
            <div class="achievements-header">
                <h2>🏆 ACHIEVEMENTS</h2>
                <button class="close-btn">✕</button>
            </div>
            
            <div class="achievements-content">
                <div class="achievement-stats">
                    <div class="stat">
                        <span class="stat-value" id="achievements-unlocked">0</span>
                        <span class="stat-label">Unlocked</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value" id="achievements-total">50</span>
                        <span class="stat-label">Total</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value" id="completion-percent">0%</span>
                        <span class="stat-label">Complete</span>
                    </div>
                </div>
                
                <div class="achievements-grid" id="achievements-grid">
                    <!-- Achievement items will be populated here -->
                </div>
            </div>
        `;

		this.applyPanelStyling(this.achievementsPanel);
		this.menuContainer.appendChild(this.achievementsPanel);
	}

	private async createLogoAndTitle(): Promise<void> {
		const logoContainer = document.createElement("div");
		logoContainer.className = "logo-container";

		Object.assign(logoContainer.style, {
			position: "absolute",
			right: "10%",
			top: "20%",
			zIndex: "10",
		});

		logoContainer.innerHTML = `
            <div class="game-logo">
                <h1 class="game-title">COSMIC</h1>
                <p class="game-subtitle">Galactic Clans</p>
            </div>
        `;

		// Apply logo styling
		const title = logoContainer.querySelector(".game-title") as HTMLElement;
		if (title) {
			Object.assign(title.style, {
				fontSize: "72px",
				fontFamily: '"Orbitron", monospace',
				fontWeight: "900",
				background: `linear-gradient(45deg, ${this.theme.primary}, ${this.theme.accent})`,
				WebkitBackgroundClip: "text",
				WebkitTextFillColor: "transparent",
				backgroundClip: "text",
				textShadow: "0 0 30px rgba(0, 150, 255, 0.5)",
				margin: "0",
				letterSpacing: "5px",
			});
		}

		const subtitle = logoContainer.querySelector(".game-subtitle") as HTMLElement;
		if (subtitle) {
			Object.assign(subtitle.style, {
				fontSize: "24px",
				fontFamily: '"Exo 2", sans-serif',
				fontWeight: "300",
				color: this.theme.secondary,
				margin: "10px 0 0 0",
				letterSpacing: "3px",
				textTransform: "uppercase",
			});
		}

		this.menuContainer.appendChild(logoContainer);

		// Create rotating low-poly world visualization
		await this.createRotatingWorld();
	}

	/**
	 * Create a rotating low-poly world visualization for the main menu using the little planet system
	 */
	private async createRotatingWorld(): Promise<void> {
		const worldContainer = document.createElement("div");
		worldContainer.className = "rotating-world-container";

		Object.assign(worldContainer.style, {
			position: "absolute",
			left: "5%",
			top: "50%",
			transform: "translateY(-50%)",
			width: "600px",
			height: "600px",
			zIndex: "5",
		});

		// Create canvas for Three.js little planet
		const canvas = document.createElement("canvas");
		canvas.width = 600;
		canvas.height = 600;
		canvas.style.cssText = `
			width: 100%;
			height: 100%;
		`;

		worldContainer.appendChild(canvas);
		this.menuContainer.appendChild(worldContainer);

		// Initialize Three.js little planet
		await this.initializeLittlePlanet(canvas);
	}

	/**
	 * Initialize Three.js little planet for the main menu
	 */
	private async initializeLittlePlanet(canvas: HTMLCanvasElement): Promise<void> {
		try {
			// Initialize Three.js scene
			this.threeScene = new THREE.Scene();
			this.threeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
			this.threeRenderer = new THREE.WebGLRenderer({
				canvas,
				antialias: true,
				alpha: true,
			});

			this.threeRenderer.setSize(600, 600);
			this.threeRenderer.setClearColor(0x000000, 0);

			// Initialize planet renderer
			this.planetRenderer = new PlanetRenderer();

			// Setup lighting
			this.setupThreeLighting();

			// Create a random little planet for the menu
			await this.createMenuPlanet();

			// Position camera closer for bigger planet view
			this.threeCamera.position.set(0, 0, 5.5);
			this.threeCamera.lookAt(0, 0, 0);

			// Start render loop
			this.startThreeRenderLoop();

			console.log("🌍 [MENU] Little planet initialized for main menu");
		} catch (error) {
			console.error("❌ [MENU] Failed to initialize little planet:", error);
			// Fallback to simple animated background
			this.createFallbackBackground(canvas);
		}
	}

	/**
	 * Setup Three.js lighting for the menu planet
	 */
	private setupThreeLighting(): void {
		if (!this.threeScene) return;

		// Brighter ambient light for better color visibility
		const ambientLight = new THREE.AmbientLight(0x606060, 0.8);
		this.threeScene.add(ambientLight);

		// Main directional light - brighter and warmer
		const directionalLight = new THREE.DirectionalLight(0xfff8dc, 1.5);
		directionalLight.position.set(8, 8, 8);
		this.threeScene.add(directionalLight);

		// Secondary light for better feature visibility
		const fillLight = new THREE.DirectionalLight(0xe6f3ff, 0.6);
		fillLight.position.set(-5, 3, -5);
		this.threeScene.add(fillLight);
	}

	/**
	 * Create a beautiful little planet for the main menu
	 */
	private async createMenuPlanet(): Promise<void> {
		if (!this.planetRenderer) return;

		// Use Temperate biome for green grass and blue lakes visibility
		const planetConfig: PlanetRenderConfig = {
			id: "menu-planet",
			name: "Menu World",
			type: PlanetType.TERRESTRIAL,
			radius: 3.5, // Much bigger planet for better visibility
			biome: PlanetBiome.TEMPERATE, // Always use temperate for green/blue colors
			position: new THREE.Vector3(0, 0, 0),
			seed: 12345, // Fixed seed for consistent appearance
			detailLevel: DetailLevel.LITTLE_PLANET,
			atmosphere: false, // Remove atmosphere for clearer surface view
			rings: false,
			moons: 0, // No moons to focus attention on the planet
		};

		try {
			const planetResult = await this.planetRenderer.renderPlanet(planetConfig);
			this.planetGroup = planetResult.group;
			this.threeScene?.add(this.planetGroup);

			console.log(`🌍 [MENU] Created ${planetConfig.biome} planet with ${planetResult.features.length} features`);
		} catch (error) {
			console.error("❌ [MENU] Failed to create menu planet:", error);
		}
	}

	/**
	 * Start the Three.js render loop for the menu planet
	 */
	private startThreeRenderLoop(): void {
		if (!this.threeRenderer || !this.threeScene || !this.threeCamera) return;

		const animate = () => {
			// Gentle planet rotation
			if (this.planetGroup) {
				this.planetGroup.rotation.y += 0.005;

				// Subtle vertical bobbing
				const time = Date.now() * 0.001;
				this.planetGroup.position.y = Math.sin(time) * 0.1;
			}

			// Render the scene
			this.threeRenderer!.render(this.threeScene!, this.threeCamera!);

			requestAnimationFrame(animate);
		};

		animate();
	}

	/**
	 * Fallback to simple background if Three.js fails
	 */
	private createFallbackBackground(canvas: HTMLCanvasElement): void {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Simple animated gradient background
		const animate = () => {
			const time = Date.now() * 0.001;

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Animated gradient
			const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
			const alpha = 0.1 + Math.sin(time) * 0.05;
			gradient.addColorStop(0, `rgba(0, 150, 255, ${alpha})`);
			gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.3)");
			gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			requestAnimationFrame(animate);
		};

		animate();
	}

	private async createVersionInfo(): Promise<void> {
		const versionInfo = document.createElement("div");
		versionInfo.className = "version-info";

		Object.assign(versionInfo.style, {
			position: "absolute",
			bottom: "20px",
			left: "20px",
			fontSize: "12px",
			color: this.theme.secondary,
			fontFamily: '"Exo 2", monospace',
			opacity: "0.7",
		});

		versionInfo.innerHTML = `
            <div>Version 1.0.0-alpha</div>
            <div>Build 2024.01.15</div>
        `;

		this.menuContainer.appendChild(versionInfo);
	}

	private async initializeParticleSystem(): Promise<void> {
		this.particleCanvas = document.createElement("canvas");
		this.particleCanvas.className = "particle-canvas";

		Object.assign(this.particleCanvas.style, {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			zIndex: "1",
		});

		this.particleCanvas.width = window.innerWidth;
		this.particleCanvas.height = window.innerHeight;

		this.particleContext = this.particleCanvas.getContext("2d")!;
		this.menuContainer.appendChild(this.particleCanvas);

		// Initialize particle system
		this.startParticleAnimation();
	}

	private startParticleAnimation(): void {
		const particles: Array<{
			x: number;
			y: number;
			vx: number;
			vy: number;
			size: number;
			opacity: number;
			life: number;
		}> = [];

		const maxParticles = 50;

		const animate = () => {
			// Clear canvas
			this.particleContext.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);

			// Add new particles
			if (particles.length < maxParticles && Math.random() < 0.1) {
				particles.push({
					x: Math.random() * this.particleCanvas.width,
					y: this.particleCanvas.height + 10,
					vx: (Math.random() - 0.5) * 2,
					vy: -Math.random() * 3 - 1,
					size: Math.random() * 3 + 1,
					opacity: Math.random() * 0.5 + 0.2,
					life: 1.0,
				});
			}

			// Update and draw particles
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];

				p.x += p.vx;
				p.y += p.vy;
				p.life -= 0.01;
				p.opacity = p.life * 0.5;

				if (p.life <= 0 || p.y < -10) {
					particles.splice(i, 1);
					continue;
				}

				// Draw particle
				this.particleContext.save();
				this.particleContext.globalAlpha = p.opacity;
				this.particleContext.fillStyle = this.theme.primary;
				this.particleContext.beginPath();
				this.particleContext.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				this.particleContext.fill();
				this.particleContext.restore();
			}

			requestAnimationFrame(animate);
		};

		animate();
	}

	private setupEventListeners(): void {
		// Window resize handling
		window.addEventListener("resize", () => {
			this.handleResize();
		});

		// Keyboard shortcuts
		document.addEventListener("keydown", (e) => {
			this.handleKeyboardInput(e);
		});

		// Close panel buttons
		document.addEventListener("click", (e) => {
			if ((e.target as HTMLElement).classList.contains("close-btn")) {
				this.transitionToState(MenuState.MAIN_MENU);
			}
		});
	}

	private async handleButtonClick(buttonId: string): Promise<void> {
		try {
			this.playClickSound();

			switch (buttonId) {
				case "play":
					await this.startSinglePlayerGame();
					break;
				case "multiplayer":
					await this.transitionToState(MenuState.MATCHMAKING);
					break;
				case "profile":
					await this.transitionToState(MenuState.PROFILE);
					break;
				case "achievements":
					await this.transitionToState(MenuState.ACHIEVEMENTS);
					break;
				case "settings":
					await this.transitionToState(MenuState.SETTINGS);
					break;
				case "exit":
					await this.exitGame();
					break;
			}
		} catch (error) {
			this.handleButtonError(buttonId, error);
		}
	}

	private handleButtonHover(button: HTMLElement, isHovering: boolean): void {
		if (isHovering) {
			this.playHoverSound();
			Object.assign(button.style, {
				transform: `scale(${this.animations.hoverScale})`,
				boxShadow: `0 0 20px ${this.theme.primary}`,
				borderColor: this.theme.accent,
			});
		} else {
			Object.assign(button.style, {
				transform: "scale(1)",
				boxShadow: "none",
				borderColor: this.theme.primary,
			});
		}
	}

	public async transitionToState(newState: MenuState): Promise<void> {
		if (this.isTransitioning || this.currentState === newState) {
			return;
		}

		const startTime = performance.now();
		this.isTransitioning = true;
		this.stateHistory.push(this.currentState);

		try {
			console.log(`🎮 [MENU:DEBUG] Transitioning: ${this.currentState} → ${newState}`);

			// Hide current panels
			await this.hideCurrentPanels();

			// Update state
			this.previousState = this.currentState;
			this.currentState = newState;

			// Show new panels
			await this.showPanelsForState(newState);

			this.performanceMetrics.transitionTime = performance.now() - startTime;
			console.log(`🎮 [MENU:DEBUG] Transition completed in ${this.performanceMetrics.transitionTime.toFixed(2)}ms`);
		} catch (error) {
			this.handleTransitionError(newState, error, startTime);
		} finally {
			this.isTransitioning = false;
		}
	}

	private async hideCurrentPanels(): Promise<void> {
		const panels = [this.settingsPanel, this.profilePanel, this.achievementsPanel];

		for (const panel of panels) {
			if (panel && panel.style.display !== "none") {
				panel.style.opacity = "0";
				panel.style.transform = "translateY(-20px)";

				setTimeout(() => {
					panel.style.display = "none";
				}, this.animations.fadeOutDuration);
			}
		}

		await this.sleep(this.animations.fadeOutDuration);
	}

	private async showPanelsForState(state: MenuState): Promise<void> {
		let targetPanel: HTMLElement | null = null;

		switch (state) {
			case MenuState.SETTINGS:
				targetPanel = this.settingsPanel;
				break;
			case MenuState.PROFILE:
				targetPanel = this.profilePanel;
				await this.populateProfilePanel();
				break;
			case MenuState.ACHIEVEMENTS:
				targetPanel = this.achievementsPanel;
				await this.populateAchievementsPanel();
				break;
		}

		if (targetPanel) {
			targetPanel.style.display = "flex";
			targetPanel.style.opacity = "0";
			targetPanel.style.transform = "translateY(20px)";

			// Animate in
			requestAnimationFrame(() => {
				targetPanel!.style.transition = `all ${this.animations.fadeInDuration}ms ease-out`;
				targetPanel!.style.opacity = "1";
				targetPanel!.style.transform = "translateY(0)";
			});
		}
	}

	private async populateProfilePanel(): Promise<void> {
		if (!this.playerProfile) {
			await this.loadPlayerProfile();
		}

		const profile = this.playerProfile || this.getDefaultProfile();

		this.profilePanel.innerHTML = `
            <div class="profile-header">
                <h2>👤 PLAYER PROFILE</h2>
                <button class="close-btn">✕</button>
            </div>
            
            <div class="profile-content">
                <div class="profile-main">
                    <div class="profile-avatar">
                        <img src="${profile.customization.avatar}" alt="Avatar" />
                    </div>
                    <div class="profile-info">
                        <h3>${profile.username}</h3>
                        <p class="profile-title">${profile.customization.title}</p>
                        <div class="level-info">
                            <span class="level">Level ${profile.level}</span>
                            <div class="xp-bar">
                                <div class="xp-fill" style="width: ${(profile.experience % 1000) / 10}%"></div>
                            </div>
                            <span class="xp-text">${profile.experience} XP</span>
                        </div>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-card">
                        <span class="stat-value">${profile.gamesPlayed}</span>
                        <span class="stat-label">Games Played</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${profile.gamesWon}</span>
                        <span class="stat-label">Victories</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${Math.floor(profile.totalPlayTime / 3600)}h</span>
                        <span class="stat-label">Play Time</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${profile.achievements.length}</span>
                        <span class="stat-label">Achievements</span>
                    </div>
                </div>
            </div>
        `;

		this.applyPanelStyling(this.profilePanel);
	}

	private async populateAchievementsPanel(): Promise<void> {
		// Placeholder achievements data
		const achievements = [
			{ id: "first_game", name: "First Steps", description: "Play your first game", unlocked: true, icon: "🎮" },
			{ id: "first_win", name: "Victory", description: "Win your first match", unlocked: true, icon: "🏆" },
			{ id: "explorer", name: "Explorer", description: "Visit 10 different star systems", unlocked: false, icon: "🗺️" },
			{ id: "commander", name: "Commander", description: "Reach level 10", unlocked: false, icon: "⭐" },
			{ id: "strategist", name: "Strategist", description: "Win 50 matches", unlocked: false, icon: "🧠" },
		];

		const achievementsGrid = this.achievementsPanel.querySelector("#achievements-grid");
		if (achievementsGrid) {
			achievementsGrid.innerHTML = achievements
				.map(
					(achievement) => `
                <div class="achievement-item ${achievement.unlocked ? "unlocked" : "locked"}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                    <div class="achievement-status">
                        ${achievement.unlocked ? "✓" : "🔒"}
                    </div>
                </div>
            `
				)
				.join("");
		}

		// Update stats
		const unlockedCount = achievements.filter((a) => a.unlocked).length;
		const totalCount = achievements.length;
		const completionPercent = Math.round((unlockedCount / totalCount) * 100);

		const unlockedElement = this.achievementsPanel.querySelector("#achievements-unlocked");
		const totalElement = this.achievementsPanel.querySelector("#achievements-total");
		const percentElement = this.achievementsPanel.querySelector("#completion-percent");

		if (unlockedElement) unlockedElement.textContent = unlockedCount.toString();
		if (totalElement) totalElement.textContent = totalCount.toString();
		if (percentElement) percentElement.textContent = `${completionPercent}%`;
	}

	private applyPanelStyling(panel: HTMLElement): void {
		Object.assign(panel.style, {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			width: "800px",
			maxWidth: "90vw",
			maxHeight: "80vh",
			background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.9))",
			border: `2px solid ${this.theme.primary}`,
			borderRadius: "15px",
			padding: "30px",
			color: this.theme.text,
			backdropFilter: "blur(20px)",
			zIndex: "100",
			display: "flex",
			flexDirection: "column",
			gap: "20px",
			overflow: "auto",
		});
	}

	// Audio methods
	private playClickSound(): void {
		// Placeholder for audio implementation
		console.log("🔊 [MENU:AUDIO] Click sound");
	}

	private playHoverSound(): void {
		// Placeholder for audio implementation
		console.log("🔊 [MENU:AUDIO] Hover sound");
	}

	// Game actions
	private async startSinglePlayerGame(): Promise<void> {
		console.log("🎮 [MENU:ACTION] Starting single player game...");

		// Show game UI elements when starting the game
		this.showGameUI();

		// This would trigger the loading screen and game initialization
		this.dispatchEvent(new CustomEvent("startSinglePlayer"));
	}

	private async exitGame(): Promise<void> {
		console.log("🎮 [MENU:ACTION] Exiting game...");
		// Graceful shutdown
		this.dispose();
		window.close();
	}

	// Utility methods
	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private handleResize(): void {
		if (this.particleCanvas) {
			this.particleCanvas.width = window.innerWidth;
			this.particleCanvas.height = window.innerHeight;
		}
	}

	private handleKeyboardInput(e: KeyboardEvent): void {
		switch (e.key) {
			case "Escape":
				if (this.currentState !== MenuState.MAIN_MENU) {
					this.transitionToState(MenuState.MAIN_MENU);
				}
				break;
			case "Enter":
				if (this.currentState === MenuState.MAIN_MENU) {
					this.handleButtonClick("play");
				}
				break;
		}
	}

	private startRenderLoop(): void {
		const render = () => {
			const now = performance.now();
			const deltaTime = now - this.performanceMetrics.lastFrameTime;
			this.performanceMetrics.fps = 1000 / deltaTime;
			this.performanceMetrics.lastFrameTime = now;

			// Render performance updates could go here

			requestAnimationFrame(render);
		};

		render();
	}

	private setupPerformanceMonitoring(): void {
		const interval = setInterval(() => {
			this.monitorPerformance();
		}, 5000);

		this.cleanupManager.addInterval(interval);
	}

	private monitorPerformance(): void {
		if (this.performanceMetrics.fps < 30) {
			console.warn(`🎮 [MENU:PERFORMANCE] Low FPS detected: ${this.performanceMetrics.fps.toFixed(1)}`);
			// Could trigger quality reduction
		}
	}

	// Data methods
	private async loadPlayerProfile(): Promise<void> {
		try {
			// Placeholder - would load from storage/server
			const savedProfile = localStorage.getItem("cosmic_player_profile");
			if (savedProfile) {
				this.playerProfile = JSON.parse(savedProfile);
			} else {
				this.playerProfile = this.getDefaultProfile();
			}
		} catch (error) {
			console.warn(`🎮 [MENU:WARNING] Failed to load player profile: ${error instanceof Error ? error.message : String(error)}`);
			this.playerProfile = this.getDefaultProfile();
		}
	}

	private getDefaultProfile(): PlayerProfile {
		return {
			username: "Player",
			level: 1,
			experience: 0,
			gamesPlayed: 0,
			gamesWon: 0,
			totalPlayTime: 0,
			lastPlayed: new Date(),
			achievements: [],
			customization: {
				avatar: "/assets/images/default-avatar.png",
				banner: "/assets/images/default-banner.png",
				title: "Rookie Commander",
			},
		};
	}

	private getDefaultTheme(): MenuTheme {
		return {
			primary: "#0096FF",
			secondary: "#6420FF",
			accent: "#00FFFF",
			background: "#000011",
			text: "#FFFFFF",
			hover: "#0080DD",
			disabled: "#666666",
			success: "#00FF80",
			warning: "#FFAA00",
			error: "#FF4444",
		};
	}

	private getDefaultAnimations(): AnimationSettings {
		return {
			fadeInDuration: 300,
			fadeOutDuration: 200,
			slideSpeed: 250,
			hoverScale: 1.05,
			clickScale: 0.95,
			particleSpeed: 1.0,
		};
	}

	// Error handling methods
	private async reloadMenuAssets(): Promise<boolean> {
		try {
			await this.loadMenuAssets();
			return true;
		} catch (error) {
			return false;
		}
	}

	private async resetToMainMenu(): Promise<boolean> {
		try {
			await this.transitionToState(MenuState.MAIN_MENU);
			return true;
		} catch (error) {
			return false;
		}
	}

	private async useBasicMenu(): Promise<boolean> {
		try {
			// Create simplified menu
			this.menuContainer.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h1>COSMIC - Galactic Clans</h1>
                    <button onclick="location.reload()">Start Game</button>
                </div>
            `;
			return true;
		} catch (error) {
			return false;
		}
	}

	private async emergencyMenuMode(): Promise<boolean> {
		document.body.innerHTML = '<div style="padding: 20px;"><h1>Game Loading...</h1><p>Please wait...</p></div>';
		return true;
	}

	private handleInitializationError(error: any, startTime: number): void {
		this.menuErrors++;
		ErrorLogger.logStandardError(ErrorCategory.UI, ErrorSeverity.HIGH, `Menu initialization failed: ${error instanceof Error ? error.message : String(error)}`, { initTime: performance.now() - startTime, errorCount: this.menuErrors }, "MainMenuSystem.initialize");
	}

	private handleButtonError(buttonId: string, error: any): void {
		ErrorLogger.logStandardError(ErrorCategory.UI, ErrorSeverity.MEDIUM, `Button action failed: ${buttonId} - ${error instanceof Error ? error.message : String(error)}`, { buttonId }, "MainMenuSystem.handleButtonClick");
	}

	private handleTransitionError(newState: MenuState, error: any, startTime: number): void {
		this.isTransitioning = false;
		ErrorLogger.logStandardError(
			ErrorCategory.UI,
			ErrorSeverity.MEDIUM,
			`Menu transition failed: ${this.currentState} -> ${newState} - ${error instanceof Error ? error.message : String(error)}`,
			{
				fromState: this.currentState,
				toState: newState,
				transitionTime: performance.now() - startTime,
			},
			"MainMenuSystem.transitionToState"
		);
	}

	private dispatchEvent(event: CustomEvent): void {
		window.dispatchEvent(event);
	}

	// ErrorRecoverable interface implementation
	public async executeFallback(): Promise<boolean> {
		return await this.recoveryChain.execute(ErrorCategory.UI, {
			currentState: this.currentState,
			errorCount: this.menuErrors,
			timestamp: Date.now(),
		});
	}

	public getSystemState(): any {
		return {
			currentState: this.currentState,
			isTransitioning: this.isTransitioning,
			errorCount: this.menuErrors,
			performanceMetrics: this.performanceMetrics,
		};
	}

	public validateState(): boolean {
		return this.menuErrors < this.maxMenuErrors && this.currentState !== null && !this.isTransitioning;
	}

	public async resetToSafeState(): Promise<void> {
		this.isTransitioning = false;
		this.currentState = MenuState.MAIN_MENU;
		this.menuErrors = 0;
		await this.hideCurrentPanels();
	}

	public getHealthStatus(): SystemHealth {
		const issues: string[] = [];
		let status: SystemHealth["status"] = "healthy";

		if (this.menuErrors > 5) {
			issues.push(`High error count: ${this.menuErrors}`);
			status = "degraded";
		}

		if (this.performanceMetrics.fps < 30) {
			issues.push(`Low FPS: ${this.performanceMetrics.fps.toFixed(1)}`);
			status = status === "healthy" ? "degraded" : status;
		}

		const performance = Math.max(0, Math.min(100, (this.performanceMetrics.fps / 60) * 100));

		return {
			status,
			issues,
			performance,
			lastError: this.errorHistory[this.errorHistory.length - 1] || undefined,
			recoverySuggestions: issues.length > 0 ? ["Restart menu system", "Check browser performance"] : [],
		};
	}

	public dispose(): void {
		console.log("🎮 [MENU:DEBUG] Disposing main menu system...");

		// Show game UI elements when main menu is closed
		this.showGameUI();

		// Cleanup Three.js resources
		if (this.threeRenderer) {
			this.threeRenderer.dispose();
		}
		if (this.threeScene) {
			this.threeScene.clear();
		}

		this.cleanupManager.cleanupAll();

		if (this.menuContainer && this.menuContainer.parentNode) {
			this.menuContainer.parentNode.removeChild(this.menuContainer);
		}

		if (this.audioContext) {
			this.audioContext.close();
		}
	}
}
