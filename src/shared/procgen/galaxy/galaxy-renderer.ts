/**
 * @file galaxy-renderer.ts
 * @description Enhanced galaxy renderer with comprehensive galaxy type support
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Renders scientifically accurate galaxies using the comprehensive galaxy
 * classification system with enhanced visual features and performance optimizations.
 */

import * as THREE from "three";
import { GalaxyClass, GalaxyEvolutionStage, getGalaxyTypeByClass, getRandomGalaxyType, GALAXY_TYPES } from "./galaxy-types";
import type { GalaxyTypeDefinition } from "./galaxy-types";
import { EnhancedGalaxyGenerator } from "./enhanced-galaxy-generator";
import type { EnhancedGalaxyConfig, EnhancedGalaxyResult } from "./enhanced-galaxy-generator";

// Galaxy Rendering Configuration
export interface GalaxyRenderConfig {
	// Basic Properties
	galaxyClass?: GalaxyClass;
	stellarMass?: number; // Solar masses (log10)
	redshift?: number;
	seed?: number;

	// Morphological Properties
	armCount?: number;
	barStrength?: number;
	ellipticity?: number;

	// System Properties
	clusterEnvironment?: boolean;
	interactingSystem?: boolean;
	mergerStage?: number; // 0-1

	// Visual Quality
	detailLevel?: number;
	starDensity?: number;
	effectDensity?: number;
	renderDistance?: number;

	// Performance Options
	enableLOD?: boolean;
	maxStars?: number;
	maxEffects?: number;

	// Special Features
	enableSpiralArms?: boolean;
	enableDustLanes?: boolean;
	enableStarFormation?: boolean;
	enableActiveNucleus?: boolean;
	enableJets?: boolean;
	enableTidalFeatures?: boolean;

	// Lighting and Effects
	enableAdvancedLighting?: boolean;
	enableParticleEffects?: boolean;
	enableEnvironmentalEffects?: boolean;
	stellarWindIntensity?: number;
	dustExtinction?: number;
}

// Default configuration
const DEFAULT_CONFIG: GalaxyRenderConfig = {
	stellarMass: 11.0, // 10^11 solar masses
	redshift: 0.01,
	seed: Date.now(),
	armCount: 2,
	barStrength: 0.5,
	ellipticity: 0.3,
	clusterEnvironment: false,
	interactingSystem: false,
	mergerStage: 0,
	detailLevel: 3,
	starDensity: 0.7,
	effectDensity: 0.6,
	renderDistance: 1000,
	enableLOD: true,
	maxStars: 10000,
	maxEffects: 100,
	enableSpiralArms: true,
	enableDustLanes: true,
	enableStarFormation: true,
	enableActiveNucleus: true,
	enableJets: true,
	enableTidalFeatures: true,
	enableAdvancedLighting: true,
	enableParticleEffects: true,
	enableEnvironmentalEffects: true,
	stellarWindIntensity: 1.0,
	dustExtinction: 0.5,
};

// Galaxy Render Result
export interface GalaxyRenderResult {
	mesh: THREE.Group;
	config: EnhancedGalaxyConfig;
	galaxyType: GalaxyTypeDefinition;
	statistics: any;
	physics: any;
	metadata: GalaxyRenderMetadata;
}

// Render Metadata
export interface GalaxyRenderMetadata {
	renderTime: number;
	starCount: number;
	particleCount: number;
	effectCount: number;
	lightCount: number;
	memoryUsage: number;
	qualityLevel: string;
	astrophysicalFeatures: string[];
}

export class GalaxyRenderer {
	private generator: EnhancedGalaxyGenerator;
	private isDisposed: boolean = false;
	private renderCache: Map<string, THREE.Group> = new Map();
	private lastRenderTime: number = 0;

	constructor() {
		this.generator = new EnhancedGalaxyGenerator();
	}

	/**
	 * Render a galaxy with the specified configuration
	 */
	public async renderGalaxy(config: GalaxyRenderConfig = {}): Promise<GalaxyRenderResult> {
		if (this.isDisposed) {
			throw new Error("GalaxyRenderer has been disposed");
		}

		const startTime = performance.now();
		const finalConfig = { ...DEFAULT_CONFIG, ...config };

		try {
			// Generate cache key
			const cacheKey = this.generateCacheKey(finalConfig);

			// Check cache first
			const cachedMesh = this.renderCache.get(cacheKey);
			if (cachedMesh && finalConfig.enableLOD) {
				return this.createCachedResult(cachedMesh, finalConfig, startTime);
			}

			// Create new generator with seed
			this.generator = new EnhancedGalaxyGenerator(finalConfig.seed);

			// Generate galaxy
			const galaxyResult = this.generator.generateGalaxy(finalConfig.galaxyClass, finalConfig.redshift);

			// Apply render configuration overrides
			this.applyRenderConfigOverrides(galaxyResult.config, finalConfig);

			// Enhance the mesh with additional rendering features
			await this.enhanceMeshForRendering(galaxyResult.mesh, galaxyResult.config, galaxyResult.galaxyType, finalConfig);

			// Setup advanced lighting if enabled
			if (finalConfig.enableAdvancedLighting) {
				this.setupGalaxyLighting(galaxyResult.mesh, galaxyResult.config, finalConfig);
			}

			// Add galaxy-specific effects
			if (finalConfig.enableParticleEffects) {
				this.addParticleEffects(galaxyResult.mesh, galaxyResult.config, galaxyResult.galaxyType);
			}

			// Add environmental effects
			if (finalConfig.enableEnvironmentalEffects) {
				this.addEnvironmentalEffects(galaxyResult.mesh, galaxyResult.config, galaxyResult.galaxyType);
			}

			// Cache the result
			if (finalConfig.enableLOD) {
				this.renderCache.set(cacheKey, galaxyResult.mesh.clone());
				this.cleanupCache();
			}

			// Calculate render metadata
			const metadata = this.calculateRenderMetadata(galaxyResult.mesh, galaxyResult.galaxyType, startTime);

			this.lastRenderTime = performance.now() - startTime;

			return {
				mesh: galaxyResult.mesh,
				config: galaxyResult.config,
				galaxyType: galaxyResult.galaxyType,
				statistics: galaxyResult.statistics,
				physics: galaxyResult.physics,
				metadata,
			};
		} catch (error) {
			console.error("Galaxy rendering failed:", error);

			// Fallback to simple galaxy
			return this.renderFallbackGalaxy(finalConfig, startTime);
		}
	}

	/**
	 * Render a galaxy by specific type
	 */
	public async renderGalaxyByType(galaxyClass: GalaxyClass, config: GalaxyRenderConfig = {}): Promise<GalaxyRenderResult> {
		return this.renderGalaxy({ ...config, galaxyClass });
	}

	/**
	 * Render a galaxy cluster
	 */
	public async renderGalaxyCluster(centerClass?: GalaxyClass, memberCount: number = 50, config: GalaxyRenderConfig = {}): Promise<GalaxyRenderResult[]> {
		const clusterConfig = { ...config, clusterEnvironment: true };

		// Generate cluster
		const clusterGalaxies = this.generator.generateGalaxyCluster(centerClass, memberCount);

		const results: GalaxyRenderResult[] = [];
		for (const galaxy of clusterGalaxies) {
			// Apply render configuration
			this.applyRenderConfigOverrides(galaxy.config, clusterConfig);

			// Enhance meshes
			await this.enhanceMeshForRendering(galaxy.mesh, galaxy.config, galaxy.galaxyType, clusterConfig);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(galaxy.mesh, galaxy.galaxyType, performance.now());

			results.push({
				mesh: galaxy.mesh,
				config: galaxy.config,
				galaxyType: galaxy.galaxyType,
				statistics: galaxy.statistics,
				physics: galaxy.physics,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Render an interacting galaxy pair
	 */
	public async renderInteractingPair(primaryClass?: GalaxyClass, secondaryClass?: GalaxyClass, config: GalaxyRenderConfig = {}): Promise<GalaxyRenderResult[]> {
		const interactionConfig = {
			...config,
			interactingSystem: true,
			enableTidalFeatures: true,
		};

		// Generate interacting pair
		const interactingPair = this.generator.generateInteractingPair(primaryClass, secondaryClass);

		const results: GalaxyRenderResult[] = [];
		for (const galaxy of interactingPair) {
			// Apply render configuration
			this.applyRenderConfigOverrides(galaxy.config, interactionConfig);

			// Enhance meshes with interaction effects
			await this.enhanceMeshForRendering(galaxy.mesh, galaxy.config, galaxy.galaxyType, interactionConfig);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(galaxy.mesh, galaxy.galaxyType, performance.now());

			results.push({
				mesh: galaxy.mesh,
				config: galaxy.config,
				galaxyType: galaxy.galaxyType,
				statistics: galaxy.statistics,
				physics: galaxy.physics,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Render galaxy evolution sequence
	 */
	public async renderEvolutionSequence(initialMass: number, environment: string = "field"): Promise<GalaxyRenderResult[]> {
		const evolutionSequence = this.generator.generateEvolutionSequence(initialMass, environment);

		const results: GalaxyRenderResult[] = [];
		for (const galaxy of evolutionSequence) {
			// Apply render configuration
			this.applyRenderConfigOverrides(galaxy.config, DEFAULT_CONFIG);

			// Enhance meshes
			await this.enhanceMeshForRendering(galaxy.mesh, galaxy.config, galaxy.galaxyType, DEFAULT_CONFIG);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(galaxy.mesh, galaxy.galaxyType, performance.now());

			results.push({
				mesh: galaxy.mesh,
				config: galaxy.config,
				galaxyType: galaxy.galaxyType,
				statistics: galaxy.statistics,
				physics: galaxy.physics,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Get all available galaxy types
	 */
	public getAvailableGalaxyTypes(): GalaxyClass[] {
		return Array.from(GALAXY_TYPES.keys());
	}

	/**
	 * Get galaxy type information
	 */
	public getGalaxyTypeInfo(galaxyClass: GalaxyClass): GalaxyTypeDefinition | undefined {
		return getGalaxyTypeByClass(galaxyClass);
	}

	/**
	 * Update rendering quality based on performance
	 */
	public updateQuality(qualityLevel: number): void {
		// Quality level 0-5, where 5 is highest quality
		const quality = Math.max(0, Math.min(5, qualityLevel));

		// Update default configuration based on quality
		DEFAULT_CONFIG.detailLevel = Math.max(1, Math.floor(quality + 1));
		DEFAULT_CONFIG.starDensity = 0.3 + quality * 0.1;
		DEFAULT_CONFIG.effectDensity = 0.2 + quality * 0.1;
		DEFAULT_CONFIG.maxStars = 1000 + quality * 2000;
		DEFAULT_CONFIG.maxEffects = 20 + quality * 20;
		DEFAULT_CONFIG.enableParticleEffects = quality >= 3;
		DEFAULT_CONFIG.enableEnvironmentalEffects = quality >= 4;
		DEFAULT_CONFIG.enableAdvancedLighting = quality >= 2;
	}

	/**
	 * Dispose of resources
	 */
	public dispose(): void {
		if (this.isDisposed) return;

		// Clear cache and dispose meshes
		for (const mesh of this.renderCache.values()) {
			this.disposeMesh(mesh);
		}
		this.renderCache.clear();

		this.isDisposed = true;
	}

	// Private Methods

	private generateCacheKey(config: GalaxyRenderConfig): string {
		const keyParts = [config.galaxyClass || "random", config.seed || 0, config.stellarMass || 11, config.redshift || 0.01, config.detailLevel || 3, config.starDensity || 0.7];

		return keyParts.join("|");
	}

	private createCachedResult(mesh: THREE.Group, config: GalaxyRenderConfig, startTime: number): GalaxyRenderResult {
		const clonedMesh = mesh.clone();

		// Create minimal metadata for cached result
		const metadata: GalaxyRenderMetadata = {
			renderTime: performance.now() - startTime,
			starCount: this.calculateStarCount(clonedMesh),
			particleCount: this.calculateParticleCount(clonedMesh),
			effectCount: clonedMesh.children.length,
			lightCount: 1,
			memoryUsage: 0,
			qualityLevel: "cached",
			astrophysicalFeatures: [],
		};

		return {
			mesh: clonedMesh,
			config: {} as EnhancedGalaxyConfig,
			galaxyType: {} as GalaxyTypeDefinition,
			statistics: {},
			physics: {},
			metadata,
		};
	}

	private applyRenderConfigOverrides(galaxyConfig: EnhancedGalaxyConfig, renderConfig: GalaxyRenderConfig): void {
		if (renderConfig.stellarMass !== undefined) {
			galaxyConfig.stellarMass = Math.pow(10, renderConfig.stellarMass);
		}

		if (renderConfig.redshift !== undefined) {
			galaxyConfig.redshift = renderConfig.redshift;
		}

		if (renderConfig.armCount !== undefined) {
			galaxyConfig.armCount = renderConfig.armCount;
		}

		if (renderConfig.barStrength !== undefined) {
			galaxyConfig.barStrength = renderConfig.barStrength;
		}

		if (renderConfig.ellipticity !== undefined) {
			galaxyConfig.ellipticity = renderConfig.ellipticity;
		}

		// Override visual features based on render config
		if (renderConfig.enableSpiralArms !== undefined) {
			galaxyConfig.visualFeatures.spiralArms = renderConfig.enableSpiralArms;
		}

		if (renderConfig.enableDustLanes !== undefined) {
			galaxyConfig.visualFeatures.dustLanes = renderConfig.enableDustLanes;
		}

		if (renderConfig.enableStarFormation !== undefined) {
			galaxyConfig.visualFeatures.starFormingRegions = renderConfig.enableStarFormation;
		}

		if (renderConfig.enableActiveNucleus !== undefined) {
			galaxyConfig.visualFeatures.activeNucleus = renderConfig.enableActiveNucleus;
		}

		if (renderConfig.enableJets !== undefined) {
			galaxyConfig.visualFeatures.jetEmission = renderConfig.enableJets;
		}

		if (renderConfig.enableTidalFeatures !== undefined) {
			galaxyConfig.visualFeatures.tidalStreams = renderConfig.enableTidalFeatures;
		}
	}

	private async enhanceMeshForRendering(mesh: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition, renderConfig: GalaxyRenderConfig): Promise<void> {
		// Apply LOD if enabled
		if (renderConfig.enableLOD) {
			this.applyLOD(mesh, renderConfig.renderDistance || 1000);
		}

		// Limit stars and effects if necessary
		if (renderConfig.maxStars && this.calculateStarCount(mesh) > renderConfig.maxStars) {
			this.limitStars(mesh, renderConfig.maxStars);
		}

		if (renderConfig.maxEffects && mesh.children.length > renderConfig.maxEffects) {
			this.limitEffects(mesh, renderConfig.maxEffects);
		}

		// Add galaxy-specific optimizations
		this.optimizeMeshForPerformance(mesh, galaxyType);
	}

	private applyLOD(mesh: THREE.Group, renderDistance: number): void {
		mesh.children.forEach((child) => {
			if (child instanceof THREE.Mesh) {
				// Create LOD versions for complex galaxy objects
				const lod = new THREE.LOD();

				// High detail (close)
				lod.addLevel(child, 0);

				// Medium detail
				const mediumGeometry = this.simplifyGeometry(child.geometry as THREE.BufferGeometry, 0.7);
				const mediumMesh = new THREE.Mesh(mediumGeometry, child.material);
				lod.addLevel(mediumMesh, renderDistance * 0.3);

				// Low detail (far)
				const lowGeometry = this.simplifyGeometry(child.geometry as THREE.BufferGeometry, 0.4);
				const lowMesh = new THREE.Mesh(lowGeometry, child.material);
				lod.addLevel(lowMesh, renderDistance * 0.7);

				// Replace original mesh with LOD
				const parent = child.parent;
				if (parent) {
					parent.remove(child);
					parent.add(lod);
				}
			}
		});
	}

	private simplifyGeometry(geometry: THREE.BufferGeometry, factor: number): THREE.BufferGeometry {
		// Simple geometry simplification for galaxy objects
		const positions = geometry.attributes.position?.array;
		if (!positions) return geometry;

		const simplified = new Float32Array(Math.floor(positions.length * factor));

		for (let i = 0; i < simplified.length; i += 3) {
			const sourceIndex = Math.floor(i / factor) * 3;
			simplified[i] = positions[sourceIndex] || 0;
			simplified[i + 1] = positions[sourceIndex + 1] || 0;
			simplified[i + 2] = positions[sourceIndex + 2] || 0;
		}

		const simplifiedGeometry = new THREE.BufferGeometry();
		simplifiedGeometry.setAttribute("position", new THREE.BufferAttribute(simplified, 3));
		simplifiedGeometry.computeVertexNormals();

		return simplifiedGeometry;
	}

	private limitStars(mesh: THREE.Group, maxStars: number): void {
		// Count and limit particle systems representing stars
		let starCount = 0;
		const starSystems: THREE.Points[] = [];

		mesh.traverse((child) => {
			if (child instanceof THREE.Points) {
				starSystems.push(child);
				starCount += child.geometry.attributes.position?.count || 0;
			}
		});

		if (starCount > maxStars) {
			const reductionFactor = maxStars / starCount;
			starSystems.forEach((system) => {
				this.reduceParticleSystem(system, reductionFactor);
			});
		}
	}

	private limitEffects(mesh: THREE.Group, maxEffects: number): void {
		while (mesh.children.length > maxEffects) {
			const randomIndex = Math.floor(Math.random() * mesh.children.length);
			const child = mesh.children[randomIndex];
			mesh.remove(child);
			this.disposeMesh(child);
		}
	}

	private setupGalaxyLighting(mesh: THREE.Group, config: EnhancedGalaxyConfig, renderConfig: GalaxyRenderConfig): void {
		// Central galactic light
		const centralLight = new THREE.PointLight(0xffd700, config.stellarMass / 1e11, config.effectiveRadius * 10);
		centralLight.position.set(0, 0, 0);
		centralLight.castShadow = false; // Galaxies don't cast shadows on each other typically
		mesh.add(centralLight);

		// Spiral arm lighting
		if (config.visualFeatures.spiralArms && config.armCount > 0) {
			this.addSpiralArmLighting(mesh, config);
		}

		// Active galactic nucleus lighting
		if (config.hasActiveNucleus) {
			this.addAGNLighting(mesh, config);
		}

		// Star formation region lighting
		if (config.visualFeatures.starFormingRegions) {
			this.addStarFormationLighting(mesh, config);
		}

		// Special lighting for exotic galaxies
		switch (config.galaxyClass) {
			case GalaxyClass.QUASAR:
				this.addQuasarLighting(mesh, config);
				break;

			case GalaxyClass.STARBURST:
				this.addStarburstLighting(mesh, config);
				break;

			case GalaxyClass.RADIO_GALAXY:
				this.addRadioGalaxyLighting(mesh, config);
				break;
		}
	}

	private addSpiralArmLighting(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		const armCount = config.armCount;

		for (let arm = 0; arm < armCount; arm++) {
			// Place lights along spiral arms
			const lightCount = 5;
			for (let i = 0; i < lightCount; i++) {
				const radius = ((i + 1) * config.effectiveRadius) / lightCount;
				const angle = (arm * 2 * Math.PI) / armCount + Math.log(radius / 0.1) / Math.tan((15 * Math.PI) / 180);

				const armLight = new THREE.PointLight(0x4169e1, 0.3, radius * 2);
				armLight.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
				mesh.add(armLight);
			}
		}
	}

	private addAGNLighting(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Bright central AGN light
		const agnLight = new THREE.PointLight(0xffffff, config.eddingtonRatio * 2, 50);
		agnLight.position.set(0, 0, 0);
		mesh.add(agnLight);

		// Jet lighting
		if (config.jetPower > 0) {
			const jetLight1 = new THREE.SpotLight(0x00ffff, 1, 1000, Math.PI / 8);
			jetLight1.position.set(0, config.effectiveRadius * 5, 0);
			jetLight1.target.position.set(0, config.effectiveRadius * 20, 0);
			mesh.add(jetLight1);
			mesh.add(jetLight1.target);

			const jetLight2 = new THREE.SpotLight(0x00ffff, 1, 1000, Math.PI / 8);
			jetLight2.position.set(0, -config.effectiveRadius * 5, 0);
			jetLight2.target.position.set(0, -config.effectiveRadius * 20, 0);
			mesh.add(jetLight2);
			mesh.add(jetLight2.target);
		}
	}

	private addStarFormationLighting(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		const regionCount = Math.floor(config.starFormationRate * 5);

		for (let i = 0; i < regionCount; i++) {
			const sfLight = new THREE.PointLight(0xff69b4, 0.5, 10);

			// Random position in galaxy disk
			const radius = Math.random() * config.effectiveRadius * 2;
			const angle = Math.random() * Math.PI * 2;
			const height = (Math.random() - 0.5) * config.effectiveRadius * 0.2;

			sfLight.position.set(radius * Math.cos(angle), height, radius * Math.sin(angle));

			mesh.add(sfLight);
		}
	}

	private addQuasarLighting(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Extremely bright central light
		const quasarLight = new THREE.PointLight(0xffffff, 10, 2000);
		quasarLight.position.set(0, 0, 0);
		mesh.add(quasarLight);

		// Broad-line region glow
		const blrLight = new THREE.PointLight(0x87ceeb, 2, 100);
		blrLight.position.set(0, 0, 0);
		mesh.add(blrLight);
	}

	private addStarburstLighting(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Intense central starburst
		const starburstLight = new THREE.PointLight(0xff1493, 5, 50);
		starburstLight.position.set(0, 0, 0);
		mesh.add(starburstLight);

		// Multiple star formation knots
		for (let i = 0; i < 10; i++) {
			const knotLight = new THREE.PointLight(0x4169e1, 1, 20);
			const radius = Math.random() * config.effectiveRadius;
			const angle = Math.random() * Math.PI * 2;

			knotLight.position.set(radius * Math.cos(angle), (Math.random() - 0.5) * config.effectiveRadius * 0.3, radius * Math.sin(angle));

			mesh.add(knotLight);
		}
	}

	private addRadioGalaxyLighting(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Radio lobe illumination
		const lobeDistance = config.effectiveRadius * 15;

		for (let i = 0; i < 2; i++) {
			const lobeLight = new THREE.PointLight(0xff00ff, 0.8, 200);
			lobeLight.position.set(0, (i === 0 ? 1 : -1) * lobeDistance, 0);
			mesh.add(lobeLight);
		}
	}

	private addParticleEffects(mesh: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		switch (galaxyType.class) {
			case GalaxyClass.SPIRAL_SB:
			case GalaxyClass.BARRED_SBB:
				this.addSpiralGalaxyParticles(mesh, config);
				break;

			case GalaxyClass.STARBURST:
				this.addStarburstParticles(mesh, config);
				break;

			case GalaxyClass.ELLIPTICAL_E4:
				this.addEllipticalGalaxyParticles(mesh, config);
				break;

			case GalaxyClass.IRREGULAR_I:
				this.addIrregularGalaxyParticles(mesh, config);
				break;

			case GalaxyClass.QUASAR:
				this.addQuasarParticles(mesh, config);
				break;

			case GalaxyClass.DWARF_ELLIPTICAL:
				this.addDwarfGalaxyParticles(mesh, config);
				break;
		}
	}

	private addSpiralGalaxyParticles(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		const starCount = Math.floor(config.starCount * 0.1); // Reduce for performance
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			// Distribute stars in exponential disk with spiral structure
			const radius = this.randomExponentialDisk(config.effectiveRadius);
			const angle = Math.random() * Math.PI * 2;
			const height = this.randomGaussian() * config.effectiveRadius * 0.1;

			// Add spiral enhancement
			const spiralAngle = Math.log(radius / 0.1) / Math.tan((15 * Math.PI) / 180);
			const armStrength = this.calculateArmStrength(angle, spiralAngle, config.armCount);

			if (Math.random() < armStrength) {
				// Star in spiral arm - make bluer
				colors[i * 3] = 0.4 + Math.random() * 0.3; // R
				colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // G
				colors[i * 3 + 2] = 1.0; // B
			} else {
				// Disk star - yellower
				colors[i * 3] = 0.8 + Math.random() * 0.2; // R
				colors[i * 3 + 1] = 0.7 + Math.random() * 0.3; // G
				colors[i * 3 + 2] = 0.3 + Math.random() * 0.4; // B
			}

			positions[i * 3] = radius * Math.cos(angle);
			positions[i * 3 + 1] = height;
			positions[i * 3 + 2] = radius * Math.sin(angle);
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const particleMaterial = new THREE.PointsMaterial({
			size: 0.5,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
		});

		const starField = new THREE.Points(particles, particleMaterial);
		mesh.add(starField);
	}

	private addStarburstParticles(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		const starCount = Math.floor(config.starCount * 0.2);
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			// Concentrated in center with clumpy structure
			const radius = Math.random() * config.effectiveRadius;
			const angle = Math.random() * Math.PI * 2;
			const height = this.randomGaussian() * config.effectiveRadius * 0.2;

			// Very blue colors for young stars
			colors[i * 3] = 0.2 + Math.random() * 0.3; // R
			colors[i * 3 + 1] = 0.4 + Math.random() * 0.4; // G
			colors[i * 3 + 2] = 1.0; // B

			positions[i * 3] = radius * Math.cos(angle);
			positions[i * 3 + 1] = height;
			positions[i * 3 + 2] = radius * Math.sin(angle);
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const particleMaterial = new THREE.PointsMaterial({
			size: 0.8,
			vertexColors: true,
			transparent: true,
			opacity: 0.9,
		});

		const starField = new THREE.Points(particles, particleMaterial);
		mesh.add(starField);
	}

	private addEllipticalGalaxyParticles(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		const starCount = Math.floor(config.starCount * 0.05); // Lower density for performance
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			// Sersic profile distribution
			const radius = this.randomSersicProfile(config.effectiveRadius, 4);
			const theta = Math.random() * Math.PI;
			const phi = Math.random() * Math.PI * 2;

			// Apply ellipticity
			const x = radius * Math.sin(theta) * Math.cos(phi);
			const y = radius * Math.sin(theta) * Math.sin(phi) * (1 - config.ellipticity);
			const z = radius * Math.cos(theta);

			// Old, red stellar population
			colors[i * 3] = 0.8 + Math.random() * 0.2; // R
			colors[i * 3 + 1] = 0.6 + Math.random() * 0.2; // G
			colors[i * 3 + 2] = 0.3 + Math.random() * 0.2; // B

			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const particleMaterial = new THREE.PointsMaterial({
			size: 0.3,
			vertexColors: true,
			transparent: true,
			opacity: 0.7,
		});

		const starField = new THREE.Points(particles, particleMaterial);
		mesh.add(starField);
	}

	private addEnvironmentalEffects(mesh: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		// Add cluster effects if in cluster environment
		if (config.clusterMember) {
			this.addClusterEffects(mesh, config);
		}

		// Add interaction effects
		if (config.interactionPartners.length > 0) {
			this.addInteractionEffects(mesh, config);
		}

		// Add merger signatures
		if (config.visualFeatures.mergerSignatures) {
			this.addMergerEffects(mesh, config);
		}

		// Add tidal streams
		if (config.visualFeatures.tidalStreams) {
			this.addTidalStreamEffects(mesh, config);
		}
	}

	private addClusterEffects(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Ram pressure stripping
		if (config.galaxyClass === GalaxyClass.SPIRAL_SB || config.galaxyClass === GalaxyClass.BARRED_SBB) {
			this.addRamPressureStripping(mesh, config);
		}

		// X-ray halo for central galaxies
		if (config.stellarMass > 1e11) {
			this.addXRayHalo(mesh, config);
		}
	}

	private addRamPressureStripping(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Gas being stripped away
		const stripCount = 500;
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(stripCount * 3);

		for (let i = 0; i < stripCount; i++) {
			const radius = config.effectiveRadius * (1 + Math.random() * 3);
			const angle = Math.random() * Math.PI * 2;
			const height = (Math.random() - 0.5) * config.effectiveRadius * 0.5;

			// Trail behind galaxy
			positions[i * 3] = radius * Math.cos(angle) - config.effectiveRadius * 2;
			positions[i * 3 + 1] = height;
			positions[i * 3 + 2] = radius * Math.sin(angle);
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		const stripMaterial = new THREE.PointsMaterial({
			color: 0x00ffff,
			size: 0.2,
			transparent: true,
			opacity: 0.3,
		});

		const gasTrail = new THREE.Points(particles, stripMaterial);
		mesh.add(gasTrail);
	}

	private addXRayHalo(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		const haloGeometry = new THREE.SphereGeometry(config.effectiveRadius * 5, 32, 32);
		const haloMaterial = new THREE.MeshBasicMaterial({
			color: 0x4169e1,
			transparent: true,
			opacity: 0.05,
			side: THREE.BackSide,
		});

		const xrayHalo = new THREE.Mesh(haloGeometry, haloMaterial);
		mesh.add(xrayHalo);
	}

	private optimizeMeshForPerformance(mesh: THREE.Group, galaxyType: GalaxyTypeDefinition): void {
		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				// Enable frustum culling
				child.frustumCulled = true;

				// Optimize geometry
				if (child.geometry instanceof THREE.BufferGeometry) {
					child.geometry.computeBoundingSphere();
					child.geometry.computeBoundingBox();
				}

				// Optimize materials for galaxy objects
				if (child.material instanceof THREE.Material) {
					child.material.precision = "mediump";
				}
			}
		});
	}

	private renderFallbackGalaxy(config: GalaxyRenderConfig, startTime: number): GalaxyRenderResult {
		// Create a simple fallback galaxy
		const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
		const material = new THREE.MeshBasicMaterial({
			color: 0x4169e1,
			transparent: true,
			opacity: 0.7,
		});
		const mesh = new THREE.Mesh(geometry, material);

		const group = new THREE.Group();
		group.add(mesh);

		const metadata: GalaxyRenderMetadata = {
			renderTime: performance.now() - startTime,
			starCount: 0,
			particleCount: 0,
			effectCount: 1,
			lightCount: 0,
			memoryUsage: 0,
			qualityLevel: "fallback",
			astrophysicalFeatures: [],
		};

		return {
			mesh: group,
			config: {} as EnhancedGalaxyConfig,
			galaxyType: {} as GalaxyTypeDefinition,
			statistics: {},
			physics: {},
			metadata,
		};
	}

	private calculateRenderMetadata(mesh: THREE.Group, galaxyType: GalaxyTypeDefinition, startTime: number): GalaxyRenderMetadata {
		let starCount = 0;
		let particleCount = 0;
		let effectCount = 0;
		let lightCount = 0;
		let memoryUsage = 0;

		mesh.traverse((child) => {
			if (child instanceof THREE.Points) {
				const positions = child.geometry.attributes.position;
				if (positions) {
					const count = positions.count;
					starCount += count;
					particleCount += count;
				}
				memoryUsage += 4096; // Rough estimate for particle systems
			} else if (child instanceof THREE.Mesh) {
				effectCount++;
				memoryUsage += 2048; // Rough estimate for meshes
			} else if (child instanceof THREE.Light) {
				lightCount++;
			}
		});

		return {
			renderTime: performance.now() - startTime,
			starCount,
			particleCount,
			effectCount,
			lightCount,
			memoryUsage,
			qualityLevel: this.determineQualityLevel(starCount, effectCount),
			astrophysicalFeatures: galaxyType.astrophysicalProcesses || [],
		};
	}

	private determineQualityLevel(starCount: number, effectCount: number): string {
		if (starCount > 50000 || effectCount > 50) return "ultra";
		if (starCount > 20000 || effectCount > 30) return "high";
		if (starCount > 10000 || effectCount > 20) return "medium";
		if (starCount > 2000 || effectCount > 10) return "low";
		return "minimal";
	}

	private calculateStarCount(mesh: THREE.Group): number {
		let count = 0;
		mesh.traverse((child) => {
			if (child instanceof THREE.Points) {
				const positions = child.geometry.attributes.position;
				if (positions) {
					count += positions.count;
				}
			}
		});
		return count;
	}

	private calculateParticleCount(mesh: THREE.Group): number {
		return this.calculateStarCount(mesh); // Same calculation for now
	}

	private disposeMesh(object: THREE.Object3D): void {
		object.traverse((child) => {
			if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
				if (child.geometry) {
					child.geometry.dispose();
				}
				if (child.material) {
					if (Array.isArray(child.material)) {
						child.material.forEach((material) => material.dispose());
					} else {
						child.material.dispose();
					}
				}
			}
		});
	}

	private cleanupCache(): void {
		// Keep cache size reasonable
		if (this.renderCache.size > 20) {
			const firstKey = this.renderCache.keys().next().value;
			if (firstKey) {
				const mesh = this.renderCache.get(firstKey);
				if (mesh) {
					this.disposeMesh(mesh);
				}
				this.renderCache.delete(firstKey);
			}
		}
	}

	// Utility functions for particle distribution

	private randomExponentialDisk(scaleRadius: number): number {
		// Generate random radius following exponential disk profile
		return -scaleRadius * Math.log(1 - Math.random());
	}

	private randomSersicProfile(effectiveRadius: number, sersicIndex: number): number {
		// Approximate Sersic profile sampling
		const bn = 2 * sersicIndex - 1 / 3; // Approximation
		const u = Math.random();
		return effectiveRadius * Math.pow(-Math.log(1 - u) / bn, sersicIndex);
	}

	private randomGaussian(): number {
		// Box-Muller transform for Gaussian random numbers
		let u = 0,
			v = 0;
		while (u === 0) u = Math.random();
		while (v === 0) v = Math.random();
		return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	}

	private calculateArmStrength(angle: number, spiralAngle: number, armCount: number): number {
		const armWidth = Math.PI / (armCount * 2);
		let minDiff = Math.PI;

		for (let arm = 0; arm < armCount; arm++) {
			const armAngle = spiralAngle + (arm * 2 * Math.PI) / armCount;
			const diff = Math.abs(((angle - armAngle + Math.PI) % (2 * Math.PI)) - Math.PI);
			minDiff = Math.min(minDiff, diff);
		}

		return Math.exp((-minDiff * minDiff) / (armWidth * armWidth));
	}

	private reduceParticleSystem(system: THREE.Points, factor: number): void {
		const positions = system.geometry.attributes.position;
		if (!positions) return;

		const oldCount = positions.count;
		const newCount = Math.floor(oldCount * factor);
		const newPositions = new Float32Array(newCount * 3);

		for (let i = 0; i < newCount; i++) {
			const oldIndex = Math.floor(i / factor);
			newPositions[i * 3] = positions.array[oldIndex * 3];
			newPositions[i * 3 + 1] = positions.array[oldIndex * 3 + 1];
			newPositions[i * 3 + 2] = positions.array[oldIndex * 3 + 2];
		}

		system.geometry.setAttribute("position", new THREE.BufferAttribute(newPositions, 3));
	}

	// Additional helper functions for specific galaxy types

	private addIrregularGalaxyParticles(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Implementation for irregular galaxy particle distribution
		const starCount = Math.floor(config.starCount * 0.15);
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			// Clumpy, asymmetric distribution
			const clumpiness = config.morphology.clumpiness;
			const radius = Math.random() * config.effectiveRadius * (1 + clumpiness);
			const angle = Math.random() * Math.PI * 2;
			const height = (Math.random() - 0.5) * config.effectiveRadius * 0.5;

			// Mixed stellar population colors
			if (Math.random() < 0.7) {
				// Young blue stars
				colors[i * 3] = 0.3 + Math.random() * 0.3;
				colors[i * 3 + 1] = 0.5 + Math.random() * 0.4;
				colors[i * 3 + 2] = 1.0;
			} else {
				// Older stars
				colors[i * 3] = 0.8 + Math.random() * 0.2;
				colors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
				colors[i * 3 + 2] = 0.4 + Math.random() * 0.3;
			}

			positions[i * 3] = radius * Math.cos(angle);
			positions[i * 3 + 1] = height;
			positions[i * 3 + 2] = radius * Math.sin(angle);
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const particleMaterial = new THREE.PointsMaterial({
			size: 0.6,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
		});

		const starField = new THREE.Points(particles, particleMaterial);
		mesh.add(starField);
	}

	private addQuasarParticles(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Central bright core with surrounding host galaxy
		const starCount = Math.floor(config.starCount * 0.3);
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			if (i < starCount * 0.1) {
				// Central quasar core
				const radius = Math.random() * config.effectiveRadius * 0.1;
				const angle = Math.random() * Math.PI * 2;

				positions[i * 3] = radius * Math.cos(angle);
				positions[i * 3 + 1] = (Math.random() - 0.5) * radius;
				positions[i * 3 + 2] = radius * Math.sin(angle);

				// Extremely bright white core
				colors[i * 3] = 1.0;
				colors[i * 3 + 1] = 1.0;
				colors[i * 3 + 2] = 1.0;
			} else {
				// Host galaxy
				const radius = this.randomExponentialDisk(config.effectiveRadius);
				const angle = Math.random() * Math.PI * 2;
				const height = this.randomGaussian() * config.effectiveRadius * 0.1;

				positions[i * 3] = radius * Math.cos(angle);
				positions[i * 3 + 1] = height;
				positions[i * 3 + 2] = radius * Math.sin(angle);

				// Mixed population
				colors[i * 3] = 0.5 + Math.random() * 0.5;
				colors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
				colors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
			}
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const particleMaterial = new THREE.PointsMaterial({
			size: 0.7,
			vertexColors: true,
			transparent: true,
			opacity: 0.9,
		});

		const starField = new THREE.Points(particles, particleMaterial);
		mesh.add(starField);
	}

	private addDwarfGalaxyParticles(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Low density, old stellar population
		const starCount = Math.floor(config.starCount * 0.02); // Very low density
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			// Exponential profile
			const radius = this.randomExponentialDisk(config.effectiveRadius);
			const theta = Math.random() * Math.PI;
			const phi = Math.random() * Math.PI * 2;

			positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
			positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
			positions[i * 3 + 2] = radius * Math.cos(theta);

			// Very old, red stellar population
			colors[i * 3] = 0.9 + Math.random() * 0.1;
			colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
			colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const particleMaterial = new THREE.PointsMaterial({
			size: 0.2,
			vertexColors: true,
			transparent: true,
			opacity: 0.6,
		});

		const starField = new THREE.Points(particles, particleMaterial);
		mesh.add(starField);
	}

	// Additional environmental effects

	private addInteractionEffects(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Add tidal tails and bridges based on interaction partners
		config.interactionPartners.forEach((partnerClass, index) => {
			this.addTidalTail(mesh, config, index);
		});
	}

	private addTidalTail(mesh: THREE.Group, config: EnhancedGalaxyConfig, index: number): void {
		const tailLength = config.effectiveRadius * 3;
		const tailWidth = config.effectiveRadius * 0.2;

		// Create curved tail
		const tailPoints: THREE.Vector3[] = [];
		for (let i = 0; i <= 20; i++) {
			const t = i / 20;
			const distance = t * tailLength;
			const angle = index * Math.PI + t * Math.PI * 0.5;
			const width = tailWidth * (1 - t * 0.8);

			tailPoints.push(new THREE.Vector3(distance * Math.cos(angle) + (Math.random() - 0.5) * width, (Math.random() - 0.5) * width, distance * Math.sin(angle) + (Math.random() - 0.5) * width));
		}

		const tailCurve = new THREE.CatmullRomCurve3(tailPoints);
		const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, tailWidth * 0.1, 8, false);
		const tailMaterial = new THREE.MeshBasicMaterial({
			color: 0x87ceeb,
			transparent: true,
			opacity: 0.4,
		});

		const tail = new THREE.Mesh(tailGeometry, tailMaterial);
		mesh.add(tail);
	}

	private addMergerEffects(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Add shells, ripples, and asymmetric features
		this.addShellStructure(mesh, config);
		this.addAsymmetricDistortion(mesh, config);
	}

	private addShellStructure(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		const shellCount = 3;

		for (let i = 0; i < shellCount; i++) {
			const shellRadius = config.effectiveRadius * (2 + i * 0.5);
			const shellGeometry = new THREE.RingGeometry(shellRadius * 0.95, shellRadius * 1.05, 32);

			const shellMaterial = new THREE.MeshBasicMaterial({
				color: 0xffd700,
				transparent: true,
				opacity: 0.15,
				side: THREE.DoubleSide,
			});

			const shell = new THREE.Mesh(shellGeometry, shellMaterial);
			shell.rotation.x = Math.PI / 2;
			shell.rotation.z = Math.random() * Math.PI;

			mesh.add(shell);
		}
	}

	private addAsymmetricDistortion(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Add asymmetric envelope
		const distortionGeometry = new THREE.SphereGeometry(config.effectiveRadius * 1.5, 16, 16);

		// Distort the geometry
		const vertices = distortionGeometry.attributes.position.array;
		for (let i = 0; i < vertices.length; i += 3) {
			const x = vertices[i];
			const y = vertices[i + 1];
			const z = vertices[i + 2];

			// Apply asymmetric distortion
			const distortion = 1 + config.morphology.asymmetryIndex * (Math.random() - 0.5);
			vertices[i] *= distortion;
			vertices[i + 1] *= distortion;
			vertices[i + 2] *= distortion;
		}

		distortionGeometry.attributes.position.needsUpdate = true;
		distortionGeometry.computeVertexNormals();

		const distortionMaterial = new THREE.MeshBasicMaterial({
			color: 0x4169e1,
			transparent: true,
			opacity: 0.1,
			wireframe: true,
		});

		const distortion = new THREE.Mesh(distortionGeometry, distortionMaterial);
		mesh.add(distortion);
	}

	private addTidalStreamEffects(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Add stellar streams from satellite disruption
		const streamCount = 2;

		for (let stream = 0; stream < streamCount; stream++) {
			const streamParticles = new THREE.BufferGeometry();
			const particleCount = 200;
			const positions = new Float32Array(particleCount * 3);

			for (let i = 0; i < particleCount; i++) {
				const t = i / particleCount;
				const distance = config.effectiveRadius * (2 + t * 8);
				const angle = stream * Math.PI + t * Math.PI * 2;
				const width = config.effectiveRadius * 0.1 * (1 - t * 0.5);

				positions[i * 3] = distance * Math.cos(angle) + (Math.random() - 0.5) * width;
				positions[i * 3 + 1] = (Math.random() - 0.5) * width;
				positions[i * 3 + 2] = distance * Math.sin(angle) + (Math.random() - 0.5) * width;
			}

			streamParticles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

			const streamMaterial = new THREE.PointsMaterial({
				color: 0xffd700,
				size: 0.1,
				transparent: true,
				opacity: 0.5,
			});

			const tidalStream = new THREE.Points(streamParticles, streamMaterial);
			mesh.add(tidalStream);
		}
	}

	// Public utility methods

	/**
	 * Get performance statistics
	 */
	public getPerformanceStats(): { lastRenderTime: number; cacheSize: number } {
		return {
			lastRenderTime: this.lastRenderTime,
			cacheSize: this.renderCache.size,
		};
	}

	/**
	 * Clear render cache
	 */
	public clearCache(): void {
		for (const mesh of this.renderCache.values()) {
			this.disposeMesh(mesh);
		}
		this.renderCache.clear();
	}

	/**
	 * Preload common galaxy types
	 */
	public async preloadCommonTypes(): Promise<void> {
		const commonTypes = [GalaxyClass.SPIRAL_SB, GalaxyClass.BARRED_SBB, GalaxyClass.ELLIPTICAL_E4, GalaxyClass.IRREGULAR_I, GalaxyClass.DWARF_ELLIPTICAL];

		const promises = commonTypes.map((type) =>
			this.renderGalaxy({
				galaxyClass: type,
				detailLevel: 1,
				enableParticleEffects: false,
			})
		);

		await Promise.all(promises);
	}
}
