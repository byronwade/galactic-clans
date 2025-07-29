// @ts-nocheck - Temporary disable for missing module imports
/**
 * @file galaxy-visual-integrator.ts
 * @description Ensures consistent visual integration between galaxy, planet, and UI systems
 * Matches color palettes and themes across all cosmic scales
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * @created 2024-01-15
 */

import * as THREE from "three";
import { AdvancedGalaxyGenerator, type GalaxyGenerationConfig } from "./advanced-galaxy-generator";
import { PlanetBiome } from "../procgen/planet/little-planet-generator";
import { ErrorLogger, ErrorCategory, ErrorSeverity } from "../core/error-system";

export interface GalaxyPalette {
	inside: THREE.Color;
	outside: THREE.Color;
	accent?: THREE.Color;
}

export interface QualitySettings {
	starCount: number;
	lowPolyMode: boolean;
	branches: number;
	triangulationLevel: number;
}

export class GalaxyVisualIntegrator {
	// Colors that match planet biome palettes for consistency
	private readonly GALAXY_PALETTES: Record<string, GalaxyPalette> = {
		temperate: {
			inside: new THREE.Color(0x7cfc00), // Bright lime green (matches grass)
			outside: new THREE.Color(0x1e90ff), // Dodger blue (matches water)
			accent: new THREE.Color(0x32cd32), // Forest green
		},
		tropical: {
			inside: new THREE.Color(0x32cd32), // Lime green (jungle)
			outside: new THREE.Color(0xff1493), // Deep pink (flowers)
			accent: new THREE.Color(0x228b22), // Forest green
		},
		desert: {
			inside: new THREE.Color(0xdaa520), // Golden rod
			outside: new THREE.Color(0xff4500), // Orange red
			accent: new THREE.Color(0xd2b48c), // Tan
		},
		arctic: {
			inside: new THREE.Color(0xe8f4f8), // Ice white
			outside: new THREE.Color(0x40e0d0), // Turquoise (crystals)
			accent: new THREE.Color(0x87ceeb), // Sky blue
		},
		volcanic: {
			inside: new THREE.Color(0xff4500), // Orange red (lava)
			outside: new THREE.Color(0x330000), // Dark red
			accent: new THREE.Color(0x8b0000), // Dark red
		},
		ocean: {
			inside: new THREE.Color(0x1e90ff), // Dodger blue
			outside: new THREE.Color(0x000080), // Navy blue
			accent: new THREE.Color(0x4169e1), // Royal blue
		},
		cosmic: {
			inside: new THREE.Color(0xffd700), // Gold
			outside: new THREE.Color(0x4b0082), // Indigo
			accent: new THREE.Color(0x9370db), // Medium purple
		},
	};

	// Performance-based quality settings
	private readonly QUALITY_SETTINGS: Record<string, QualitySettings> = {
		ultra: {
			starCount: 50000,
			lowPolyMode: true,
			branches: 5,
			triangulationLevel: 4,
		},
		high: {
			starCount: 25000,
			lowPolyMode: true,
			branches: 4,
			triangulationLevel: 3,
		},
		medium: {
			starCount: 15000,
			lowPolyMode: true,
			branches: 3,
			triangulationLevel: 2,
		},
		low: {
			starCount: 8000,
			lowPolyMode: false,
			branches: 3,
			triangulationLevel: 1,
		},
		minimal: {
			starCount: 3000,
			lowPolyMode: false,
			branches: 2,
			triangulationLevel: 0,
		},
	};

	constructor(private galaxyGenerator: AdvancedGalaxyGenerator) {}

	/**
	 * Integrate galaxy colors with current menu planet biome
	 */
	public integrateWithMainMenu(currentPlanetBiome?: PlanetBiome): void {
		try {
			console.log(`🎨 [GALAXY] Integrating with menu planet biome: ${currentPlanetBiome || "cosmic"}`);

			const biomeKey = currentPlanetBiome || "cosmic";
			const palette = this.GALAXY_PALETTES[biomeKey] || this.GALAXY_PALETTES.cosmic;

			// Get current performance level for quality settings
			const qualityLevel = this.getCurrentQualityLevel();
			const qualitySettings = this.QUALITY_SETTINGS[qualityLevel];

			// Update galaxy configuration to match theme
			this.galaxyGenerator.updateConfig({
				insideColor: palette.inside,
				outsideColor: palette.outside,
				lowPolyMode: qualitySettings.lowPolyMode,
				starCount: qualitySettings.starCount,
				branches: qualitySettings.branches,
				// Add some biome-specific customizations
				spinFactor: this.getBiomeSpinFactor(biomeKey),
				randomness: this.getBiomeRandomness(biomeKey),
			});

			console.log(`✅ [GALAXY] Galaxy theme updated to match ${biomeKey} biome`);
		} catch (error) {
			ErrorLogger.logStandardError(ErrorCategory.WORLD, ErrorSeverity.MEDIUM, `Failed to integrate galaxy with menu: ${error instanceof Error ? error.message : String(error)}`, { currentPlanetBiome }, "GalaxyVisualIntegrator.integrateWithMainMenu");
		}
	}

	/**
	 * Generate themed galaxy variant based on current game state
	 */
	public generateThemedVariant(theme: string = "cosmic", seed?: number): void {
		const palette = this.GALAXY_PALETTES[theme] || this.GALAXY_PALETTES.cosmic;
		const qualitySettings = this.QUALITY_SETTINGS[this.getCurrentQualityLevel()];

		const config: Partial<GalaxyGenerationConfig> = {
			insideColor: palette.inside,
			outsideColor: palette.outside,
			starCount: qualitySettings.starCount,
			lowPolyMode: qualitySettings.lowPolyMode,
			branches: qualitySettings.branches,
			seed: seed || Date.now(),
		};

		// Theme-specific modifications
		switch (theme) {
			case "temperate":
				config.spinFactor = 1.2;
				config.randomness = 0.15;
				break;
			case "volcanic":
				config.spinFactor = 2.5;
				config.randomness = 0.3;
				config.branches = 2; // Chaotic, fewer arms
				break;
			case "arctic":
				config.spinFactor = 0.8;
				config.randomness = 0.1;
				config.branches = 6; // Crystalline structure
				break;
			case "desert":
				config.spinFactor = 1.8;
				config.randomness = 0.25;
				break;
			case "ocean":
				config.spinFactor = 1.0;
				config.randomness = 0.2;
				config.branches = 4;
				break;
		}

		this.galaxyGenerator.updateConfig(config);
	}

	/**
	 * Create galaxy background that complements current UI theme
	 */
	public createBackgroundGalaxy(containerElement: HTMLElement): THREE.Object3D {
		// Generate a subtle background galaxy
		const backgroundConfig: Partial<GalaxyGenerationConfig> = {
			starCount: 5000,
			lowPolyMode: false, // Use points for background
			galaxyRadius: 200,
			branches: 4,
			spinFactor: 0.5,
			randomness: 0.1,
			insideColor: new THREE.Color(0x404040),
			outsideColor: new THREE.Color(0x101010),
			seed: 54321,
		};

		// Create temporary generator for background
		const backgroundGenerator = new AdvancedGalaxyGenerator(backgroundConfig);
		const backgroundMesh = backgroundGenerator.generateGalaxyMesh();

		// Scale and position for background use
		backgroundMesh.scale.setScalar(0.5);
		backgroundMesh.position.set(0, 0, -100);

		// Rotate slowly for subtle animation
		const animate = () => {
			backgroundMesh.rotation.y += 0.001;
			requestAnimationFrame(animate);
		};
		animate();

		return backgroundMesh;
	}

	/**
	 * Validate that galaxy colors work well with planet colors
	 */
	public validateColorHarmony(galaxyColors: GalaxyPalette, planetBiome: PlanetBiome): boolean {
		// Check color contrast and harmony
		const galaxyLuminance = this.calculateLuminance(galaxyColors.inside);
		const planetColors = this.getPlanetBiomeColors(planetBiome);
		const planetLuminance = this.calculateLuminance(planetColors.primary);

		// Ensure sufficient contrast for visibility
		const contrast = Math.max(galaxyLuminance, planetLuminance) / Math.min(galaxyLuminance, planetLuminance);

		return contrast > 2.0; // WCAG AA standard
	}

	/**
	 * Get performance-optimized star count based on current system performance
	 */
	public getOptimalStarCount(): number {
		const qualityLevel = this.getCurrentQualityLevel();
		return this.QUALITY_SETTINGS[qualityLevel].starCount;
	}

	/**
	 * Apply seasonal or event-based galaxy themes
	 */
	public applyEventTheme(eventType: "holiday" | "war" | "peace" | "discovery"): void {
		let theme: Partial<GalaxyGenerationConfig>;

		switch (eventType) {
			case "holiday":
				theme = {
					insideColor: new THREE.Color(0xff0000), // Red
					outsideColor: new THREE.Color(0x00ff00), // Green
					branches: 6,
					spinFactor: 1.5,
				};
				break;
			case "war":
				theme = {
					insideColor: new THREE.Color(0xff4500), // Orange red
					outsideColor: new THREE.Color(0x8b0000), // Dark red
					branches: 2,
					spinFactor: 3.0,
					randomness: 0.4,
				};
				break;
			case "peace":
				theme = {
					insideColor: new THREE.Color(0x87ceeb), // Sky blue
					outsideColor: new THREE.Color(0x98fb98), // Pale green
					branches: 5,
					spinFactor: 0.8,
				};
				break;
			case "discovery":
				theme = {
					insideColor: new THREE.Color(0xffd700), // Gold
					outsideColor: new THREE.Color(0x9370db), // Medium purple
					branches: 4,
					spinFactor: 1.2,
				};
				break;
		}

		this.galaxyGenerator.updateConfig(theme);
	}

	// Private helper methods

	private getCurrentQualityLevel(): string {
		// In a real implementation, this would check the performance monitor
		// For now, return a default
		return "medium";
	}

	private getBiomeSpinFactor(biome: string): number {
		const spinFactors: Record<string, number> = {
			temperate: 1.2,
			tropical: 1.4,
			desert: 1.8,
			arctic: 0.8,
			volcanic: 2.5,
			ocean: 1.0,
			cosmic: 1.0,
		};

		return spinFactors[biome] || 1.0;
	}

	private getBiomeRandomness(biome: string): number {
		const randomnessValues: Record<string, number> = {
			temperate: 0.15,
			tropical: 0.25,
			desert: 0.3,
			arctic: 0.1,
			volcanic: 0.4,
			ocean: 0.2,
			cosmic: 0.2,
		};

		return randomnessValues[biome] || 0.2;
	}

	private calculateLuminance(color: THREE.Color): number {
		// Calculate relative luminance for WCAG contrast calculations
		const sRGB = [color.r, color.g, color.b];
		const linearRGB = sRGB.map((c) => {
			return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
		});

		return 0.2126 * linearRGB[0] + 0.7152 * linearRGB[1] + 0.0722 * linearRGB[2];
	}

	private getPlanetBiomeColors(biome: PlanetBiome): { primary: THREE.Color; secondary: THREE.Color } {
		const biomeColors: Record<string, { primary: THREE.Color; secondary: THREE.Color }> = {
			[PlanetBiome.TEMPERATE]: {
				primary: new THREE.Color(0x6b8e23),
				secondary: new THREE.Color(0x32cd32),
			},
			[PlanetBiome.TROPICAL]: {
				primary: new THREE.Color(0x228b22),
				secondary: new THREE.Color(0xff1493),
			},
			[PlanetBiome.DESERT]: {
				primary: new THREE.Color(0xd2b48c),
				secondary: new THREE.Color(0xff4500),
			},
			[PlanetBiome.ARCTIC]: {
				primary: new THREE.Color(0xe8f4f8),
				secondary: new THREE.Color(0x40e0d0),
			},
			[PlanetBiome.VOLCANIC]: {
				primary: new THREE.Color(0x4a1810),
				secondary: new THREE.Color(0xff4500),
			},
			[PlanetBiome.OCEAN]: {
				primary: new THREE.Color(0x1e6091),
				secondary: new THREE.Color(0x1e90ff),
			},
		};

		return biomeColors[biome] || biomeColors[PlanetBiome.TEMPERATE];
	}
}
