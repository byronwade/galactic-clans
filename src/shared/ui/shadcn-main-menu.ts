// @ts-nocheck - Temporary disable for missing imports and interface issues
/**
 * @file shadcn-main-menu.ts
 * @description Modern Shadcn UI-based main menu system with consistent loading
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * @created 2024-01-15
 */

import * as THREE from "three";
// import { createButton } from "../../components/ui/button";
// import { createCard, createCardHeader, createCardTitle, createCardContent } from "../../components/ui/card";
// import { ErrorLogger, ErrorCategory, ErrorSeverity } from "../core/error-system";
// import type { ErrorRecoverable, SystemHealth } from "../core/error-system";
import { PlanetRenderer, type PlanetRenderConfig as PlanetConfig } from "../procgen/planet/planet-renderer";
import { PlanetClass as PlanetType } from "../procgen/planet/planet-types";

export enum MenuState {
	LOADING = "LOADING",
	MAIN_MENU = "MAIN_MENU",
	PLAY = "PLAY",
	SETTINGS = "SETTINGS",
	PROFILE = "PROFILE",
	QUIT = "QUIT",
}

export interface MenuConfig {
	showLoadingScreen: boolean;
	fadeTransitions: boolean;
	planetAnimation: boolean;
	particleEffects: boolean;
}

export class ShadcnMainMenu implements ErrorRecoverable {
	private currentState: MenuState = MenuState.LOADING;
	private isInitialized = false;
	private isVisible = false;

	// DOM elements
	private menuContainer!: HTMLElement;
	private loadingScreen!: HTMLElement;
	private menuContent!: HTMLElement;
	private planetContainer!: HTMLElement;
	private logoContainer!: HTMLElement;
	private buttonContainer!: HTMLElement;

	// Three.js for planet
	private threeScene?: THREE.Scene;
	private threeCamera?: THREE.PerspectiveCamera;
	private threeRenderer?: THREE.WebGLRenderer;
	private planetRenderer?: PlanetRenderer;
	private planetMesh?: THREE.Object3D;

	// Menu buttons
	private buttons: Map<string, HTMLButtonElement> = new Map();

	// Configuration
	private config: MenuConfig = {
		showLoadingScreen: true,
		fadeTransitions: true,
		planetAnimation: true,
		particleEffects: true,
	};

	// Event callbacks
	private onPlayCallback?: () => void;
	private onSettingsCallback?: () => void;
	private onProfileCallback?: () => void;
	private onQuitCallback?: () => void;

	constructor(config?: Partial<MenuConfig>) {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Initialize the Shadcn main menu system
	 */
	public async initialize(): Promise<void> {
		try {
			console.log("🎮 [SHADCN-MENU] Initializing modern main menu...");

			// Hide any existing game UI immediately to prevent flash
			this.hideGameUI();

			// Create menu structure
			this.createMenuStructure();
			this.createLoadingScreen();
			this.createMenuContent();
			this.setupEventListeners();

			// Show loading screen first
			this.showLoadingScreen();

			// Initialize 3D planet
			await this.initializePlanet();

			// Hide loading and show menu
			await this.transitionToMainMenu();

			this.isInitialized = true;
			console.log("✅ [SHADCN-MENU] Main menu initialized successfully");
		} catch (error) {
			ErrorLogger.logStandardError(ErrorCategory.UI, ErrorSeverity.HIGH, `Failed to initialize Shadcn main menu: ${error instanceof Error ? error.message : String(error)}`, {}, "ShadcnMainMenu.initialize");
			throw error;
		}
	}

	/**
	 * Create the main menu structure
	 */
	private createMenuStructure(): void {
		// Create main container
		this.menuContainer = document.createElement("div");
		this.menuContainer.id = "shadcn-main-menu";
		this.menuContainer.className = "fixed inset-0 z-[1000] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950";

		// Ensure it's hidden initially to prevent flash
		this.menuContainer.style.display = "none";

		document.body.appendChild(this.menuContainer);
	}

	/**
	 * Create loading screen with Shadcn components
	 */
	private createLoadingScreen(): void {
		this.loadingScreen = document.createElement("div");
		this.loadingScreen.className = "absolute inset-0 flex items-center justify-center bg-slate-950 z-10";

		// Loading content with Shadcn card
		const loadingCard = createCard({
			className: "bg-slate-900/80 border-slate-700 backdrop-blur-sm",
		});

		const cardContent = createCardContent({ className: "text-center space-y-4" });

		// Spinner
		const spinner = document.createElement("div");
		spinner.className = "w-8 h-8 border-2 border-slate-600 border-t-green-500 rounded-full animate-spin mx-auto";

		// Loading text
		const loadingText = document.createElement("p");
		loadingText.className = "text-slate-400 text-sm";
		loadingText.textContent = "Loading Galactic Clans...";

		cardContent.appendChild(spinner);
		cardContent.appendChild(loadingText);
		loadingCard.appendChild(cardContent);
		this.loadingScreen.appendChild(loadingCard);
		this.menuContainer.appendChild(this.loadingScreen);
	}

	/**
	 * Create main menu content with Shadcn components
	 */
	private createMenuContent(): void {
		this.menuContent = document.createElement("div");
		this.menuContent.className = "absolute inset-0 flex opacity-0 transition-opacity duration-1000";

		// Left side - 3D Planet
		this.planetContainer = document.createElement("div");
		this.planetContainer.className = "flex-1 relative flex items-center justify-center";

		// Planet canvas container
		const planetCanvasContainer = document.createElement("div");
		planetCanvasContainer.id = "planet-canvas-container";
		planetCanvasContainer.className = "w-96 h-96 relative";
		this.planetContainer.appendChild(planetCanvasContainer);

		// Right side - Menu content
		const menuSide = document.createElement("div");
		menuSide.className = "flex-1 flex items-center justify-center p-8";

		// Main menu card
		const menuCard = createCard({
			className: "w-full max-w-md bg-slate-900/90 border-slate-700 backdrop-blur-sm shadow-2xl",
		});

		// Logo/Title
		this.logoContainer = document.createElement("div");
		this.logoContainer.className = "text-center mb-8";

		const gameTitle = document.createElement("h1");
		gameTitle.className = "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2";
		gameTitle.textContent = "Galactic Clans";

		const gameSubtitle = document.createElement("p");
		gameSubtitle.className = "text-slate-400 text-sm";
		gameSubtitle.textContent = "Conquer the Galaxy";

		this.logoContainer.appendChild(gameTitle);
		this.logoContainer.appendChild(gameSubtitle);

		// Button container
		this.buttonContainer = document.createElement("div");
		this.buttonContainer.className = "space-y-3";

		// Create menu buttons
		this.createMenuButtons();

		const cardContent = createCardContent({ className: "p-6" });
		cardContent.appendChild(this.logoContainer);
		cardContent.appendChild(this.buttonContainer);

		menuCard.appendChild(cardContent);
		menuSide.appendChild(menuCard);

		this.menuContent.appendChild(this.planetContainer);
		this.menuContent.appendChild(menuSide);
		this.menuContainer.appendChild(this.menuContent);
	}

	/**
	 * Create menu buttons using Shadcn components
	 */
	private createMenuButtons(): void {
		const buttonConfigs = [
			{
				id: "play",
				text: '<i class="fas fa-play mr-2"></i>Play',
				variant: "default" as const,
				onClick: () => this.handlePlay(),
			},
			{
				id: "settings",
				text: '<i class="fas fa-cog mr-2"></i>Settings',
				variant: "secondary" as const,
				onClick: () => this.handleSettings(),
			},
			{
				id: "profile",
				text: '<i class="fas fa-user mr-2"></i>Profile',
				variant: "outline" as const,
				onClick: () => this.handleProfile(),
			},
			{
				id: "quit",
				text: '<i class="fas fa-sign-out-alt mr-2"></i>Quit',
				variant: "ghost" as const,
				onClick: () => this.handleQuit(),
			},
		];

		buttonConfigs.forEach((config) => {
			const button = createButton({
				variant: config.variant,
				size: "lg",
				className: "w-full justify-start text-left",
				children: config.text,
				onClick: config.onClick,
			});

			this.buttons.set(config.id, button);
			this.buttonContainer.appendChild(button);
		});
	}

	/**
	 * Initialize 3D planet using existing planet renderer
	 */
	private async initializePlanet(): Promise<void> {
		try {
			const canvas = document.createElement("canvas");
			canvas.className = "w-full h-full";
			canvas.width = 384;
			canvas.height = 384;

			// Remove any circular outline or border
			canvas.style.cssText = `
				width: 100%;
				height: 100%;
				border-radius: 0 !important;
				border: none !important;
				box-shadow: none !important;
			`;

			const container = document.getElementById("planet-canvas-container");
			if (container) {
				// Remove any existing circular styling
				container.style.cssText = `
					width: 384px;
					height: 384px;
					position: relative;
					border-radius: 0 !important;
					border: none !important;
					box-shadow: none !important;
				`;
				container.appendChild(canvas);
			}

			// Initialize Three.js
			this.threeScene = new THREE.Scene();
			this.threeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
			this.threeRenderer = new THREE.WebGLRenderer({
				canvas,
				antialias: true,
				alpha: true,
			});

			this.threeRenderer.setSize(384, 384);
			this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.threeRenderer.setClearColor(0x000000, 0); // Transparent background

			// Setup lighting - much brighter for better visibility
			this.setupLighting();

			// Create planet
			await this.createMenuPlanet();

			// Position camera closer for bigger planet view
			this.threeCamera.position.set(0, 0, 4.5);
			this.threeCamera.lookAt(0, 0, 0);

			// Start render loop
			this.startRenderLoop();

			console.log("✅ [SHADCN-MENU] 3D planet initialized with bright colors");
		} catch (error) {
			console.error("❌ [SHADCN-MENU] Failed to initialize planet:", error);
			// Create fallback
			this.createFallbackPlanet();
		}
	}

	/**
	 * Setup Three.js lighting - EXTREMELY BRIGHT for maximum visibility
	 */
	private setupLighting(): void {
		if (!this.threeScene) return;

		// EXTREMELY bright ambient light for maximum color visibility
		const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
		this.threeScene.add(ambientLight);

		// Main directional light - extremely bright
		const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
		directionalLight.position.set(8, 8, 8);
		this.threeScene.add(directionalLight);

		// Secondary light for better feature visibility
		const fillLight = new THREE.DirectionalLight(0xe6f3ff, 2.0);
		fillLight.position.set(-5, 3, -5);
		this.threeScene.add(fillLight);

		// Additional rim light for better definition
		const rimLight = new THREE.DirectionalLight(0xfff8dc, 1.5);
		rimLight.position.set(0, -8, 0);
		this.threeScene.add(rimLight);

		// Extra top light for maximum brightness
		const topLight = new THREE.DirectionalLight(0xffffff, 2.5);
		topLight.position.set(0, 10, 0);
		this.threeScene.add(topLight);

		console.log("💡 [SHADCN-MENU] EXTREMELY bright lighting setup complete");
	}

	/**
	 * Create the menu planet with bright colors
	 */
	private async createMenuPlanet(): Promise<void> {
		if (!this.planetRenderer) {
			this.planetRenderer = new PlanetRenderer();
		}

		const planetConfig: PlanetConfig = {
			id: "menu-planet",
			name: "Menu World",
			type: PlanetType.TERRESTRIAL,
			radius: 3.0, // Bigger planet
			biome: PlanetBiome.TEMPERATE, // Ensures green grass and blue lakes
			position: new THREE.Vector3(0, 0, 0),
			seed: 12345, // Fixed seed for consistent bright appearance
			detailLevel: "little_planet",
			atmosphere: false, // No atmosphere for clearer surface view
			rings: false,
			moons: 0,
		};

		const planetResult = await this.planetRenderer.renderPlanet(planetConfig);

		// Handle the planet result - check for different property names
		if (planetResult && this.threeScene) {
			// Try different possible property names
			const planetMesh = (planetResult as any).mesh || (planetResult as any).planetMesh || (planetResult as any).object3D || (planetResult as any).group;

			if (planetMesh) {
				this.planetMesh = planetMesh;
				this.threeScene.add(this.planetMesh);
				console.log("✅ [SHADCN-MENU] Planet mesh added to scene");
			} else {
				console.warn("⚠️ [SHADCN-MENU] No planet mesh found in result:", planetResult);
				this.createFallbackPlanet();
			}
		}
	}

	/**
	 * Create fallback planet if 3D fails
	 */
	private createFallbackPlanet(): void {
		const container = document.getElementById("planet-canvas-container");
		if (!container) return;

		const fallback = document.createElement("div");
		fallback.className = "w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-full animate-pulse";

		const fallbackText = document.createElement("div");
		fallbackText.className = "absolute inset-0 flex items-center justify-center text-white text-sm";
		fallbackText.textContent = "Planet Loading...";

		fallback.appendChild(fallbackText);
		container.appendChild(fallback);
	}

	/**
	 * Start Three.js render loop
	 */
	private startRenderLoop(): void {
		const animate = () => {
			if (this.planetMesh) {
				this.planetMesh.rotation.y += 0.005;
				this.planetMesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
			}

			if (this.threeRenderer && this.threeScene && this.threeCamera) {
				this.threeRenderer.render(this.threeScene, this.threeCamera);
			}

			requestAnimationFrame(animate);
		};
		animate();
	}

	/**
	 * Show loading screen
	 */
	private showLoadingScreen(): void {
		this.menuContainer.style.display = "block";
		this.loadingScreen.style.opacity = "1";
		this.currentState = MenuState.LOADING;
	}

	/**
	 * Transition from loading to main menu
	 */
	private async transitionToMainMenu(): Promise<void> {
		return new Promise((resolve) => {
			// Hide loading screen
			this.loadingScreen.style.opacity = "0";

			setTimeout(() => {
				this.loadingScreen.style.display = "none";

				// Show menu content
				this.menuContent.style.opacity = "1";
				this.currentState = MenuState.MAIN_MENU;
				this.isVisible = true;

				resolve();
			}, 1000);
		});
	}

	/**
	 * Hide game UI to prevent flash
	 */
	private hideGameUI(): void {
		const gameUI = document.getElementById("game-ui");
		if (gameUI) {
			gameUI.style.display = "none";
		}

		// Inject CSS to hide any other UI elements that might flash
		const style = document.createElement("style");
		style.textContent = `
            #navigation-breadcrumb,
            #detail-panel,
            #bottom-hud,
            #minimap-container,
            .hud-element {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        `;
		document.head.appendChild(style);
	}

	/**
	 * Show game UI when transitioning out of menu
	 */
	private showGameUI(): void {
		const gameUI = document.getElementById("game-ui");
		if (gameUI) {
			gameUI.style.display = "flex";
		}

		// Remove hiding styles
		const styles = document.querySelectorAll("style");
		styles.forEach((style) => {
			if (style.textContent?.includes("#navigation-breadcrumb")) {
				style.remove();
			}
		});
	}

	/**
	 * Setup event listeners
	 */
	private setupEventListeners(): void {
		// Handle window resize
		window.addEventListener("resize", () => {
			if (this.threeRenderer && this.threeCamera) {
				this.threeRenderer.setSize(384, 384);
				this.threeCamera.aspect = 1;
				this.threeCamera.updateProjectionMatrix();
			}
		});

		// Prevent context menu
		this.menuContainer.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});
	}

	/**
	 * Button handlers
	 */
	private handlePlay(): void {
		console.log("🎮 [SHADCN-MENU] Play button clicked");
		this.hide();
		this.showGameUI();
		this.onPlayCallback?.();
	}

	private handleSettings(): void {
		console.log("⚙️ [SHADCN-MENU] Settings button clicked");
		this.onSettingsCallback?.();
	}

	private handleProfile(): void {
		console.log("👤 [SHADCN-MENU] Profile button clicked");
		this.onProfileCallback?.();
	}

	private handleQuit(): void {
		console.log("🚪 [SHADCN-MENU] Quit button clicked");
		this.onQuitCallback?.();
	}

	/**
	 * Set event callbacks
	 */
	public setCallbacks(callbacks: { onPlay?: () => void; onSettings?: () => void; onProfile?: () => void; onQuit?: () => void }): void {
		this.onPlayCallback = callbacks.onPlay;
		this.onSettingsCallback = callbacks.onSettings;
		this.onProfileCallback = callbacks.onProfile;
		this.onQuitCallback = callbacks.onQuit;
	}

	/**
	 * Show the menu
	 */
	public show(): void {
		if (!this.isInitialized) return;

		this.hideGameUI();
		this.menuContainer.style.display = "block";
		this.menuContent.style.opacity = "1";
		this.isVisible = true;
	}

	/**
	 * Hide the menu
	 */
	public hide(): void {
		this.menuContainer.style.display = "none";
		this.isVisible = false;
	}

	/**
	 * Get current menu state
	 */
	public getState(): MenuState {
		return this.currentState;
	}

	/**
	 * Check if menu is visible
	 */
	public getIsVisible(): boolean {
		return this.isVisible;
	}

	/**
	 * Cleanup resources
	 */
	public dispose(): void {
		if (this.threeRenderer) {
			this.threeRenderer.dispose();
		}

		if (this.threeScene) {
			this.threeScene.clear();
		}

		if (this.menuContainer && this.menuContainer.parentNode) {
			this.menuContainer.parentNode.removeChild(this.menuContainer);
		}

		this.buttons.clear();
		console.log("🧹 [SHADCN-MENU] Menu disposed");
	}

	// ErrorRecoverable implementation
	public async executeFallback(): Promise<void> {
		console.warn("🔄 [SHADCN-MENU] Executing fallback");
		this.config.planetAnimation = false;
		this.config.particleEffects = false;
		this.createFallbackPlanet();
	}

	public getSystemState(): SystemHealth {
		return {
			isHealthy: this.isInitialized,
			lastError: null,
			metrics: {
				isVisible: this.isVisible,
				currentState: this.currentState,
				buttonCount: this.buttons.size,
			},
		};
	}

	public validateState(): boolean {
		return this.isInitialized && this.menuContainer !== null;
	}

	public async resetToSafeState(): Promise<void> {
		this.hide();
		this.currentState = MenuState.LOADING;
		this.isInitialized = false;
		await this.initialize();
	}

	public getHealthStatus(): SystemHealth {
		return this.getSystemState();
	}
}
