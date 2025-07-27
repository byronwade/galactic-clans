/**
 * @file star-renderer.ts
 * @description Enhanced star renderer with comprehensive stellar type support
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Renders scientifically accurate stars using the comprehensive stellar
 * classification system with enhanced visual features and performance optimizations.
 */

import * as THREE from "three";
import { StellarClass, EvolutionStage, getStellarTypeByClass, getRandomStellarType, STELLAR_TYPES } from "./stellar-types";
import type { StellarTypeDefinition } from "./stellar-types";
import { EnhancedStarGenerator } from "./enhanced-star-generator";
import type { EnhancedStarConfig, EnhancedStarResult } from "./enhanced-star-generator";

// Star Rendering Configuration
export interface StarRenderConfig {
	// Basic Properties
	stellarClass?: StellarClass;
	mass?: number; // Solar masses
	age?: number; // Million years
	seed?: number;

	// System Properties
	binarySystem?: boolean;
	companionClass?: StellarClass;
	multipleSystem?: boolean;
	systemSize?: number;

	// Visual Quality
	detailLevel?: number;
	effectDensity?: number;
	animationIntensity?: number;

	// Performance Options
	enableLOD?: boolean;
	maxEffects?: number;
	renderDistance?: number;

	// Special Features
	enableCorona?: boolean;
	enableStellarWind?: boolean;
	enableMagnetosphere?: boolean;
	enableAccretionDisk?: boolean;
	enableJets?: boolean;

	// Lighting and Effects
	enableAdvancedLighting?: boolean;
	enableParticleEffects?: boolean;
	enableGravitationalEffects?: boolean;
	coronaIntensity?: number;
	windIntensity?: number;
}

// Default configuration
const DEFAULT_CONFIG: StarRenderConfig = {
	mass: 1.0,
	age: 5000, // 5 billion years (middle-aged)
	seed: Date.now(),
	binarySystem: false,
	multipleSystem: false,
	systemSize: 1,
	detailLevel: 3,
	effectDensity: 0.7,
	animationIntensity: 0.5,
	enableLOD: true,
	maxEffects: 100,
	renderDistance: 1000,
	enableCorona: true,
	enableStellarWind: true,
	enableMagnetosphere: true,
	enableAccretionDisk: true,
	enableJets: true,
	enableAdvancedLighting: true,
	enableParticleEffects: true,
	enableGravitationalEffects: true,
	coronaIntensity: 1.0,
	windIntensity: 1.0,
};

// Star Render Result
export interface StarRenderResult {
	mesh: THREE.Group;
	config: EnhancedStarConfig;
	stellarType: StellarTypeDefinition;
	statistics: any;
	physics: any;
	metadata: StarRenderMetadata;
}

// Render Metadata
export interface StarRenderMetadata {
	renderTime: number;
	vertexCount: number;
	effectCount: number;
	lightCount: number;
	memoryUsage: number;
	qualityLevel: string;
	stellarPhenomena: string[];
}

export class StarRenderer {
	private generator: EnhancedStarGenerator;
	private isDisposed: boolean = false;
	private renderCache: Map<string, THREE.Group> = new Map();
	private lastRenderTime: number = 0;

	constructor() {
		this.generator = new EnhancedStarGenerator();
	}

	/**
	 * Render a star with the specified configuration
	 */
	public async renderStar(config: StarRenderConfig = {}): Promise<StarRenderResult> {
		if (this.isDisposed) {
			throw new Error("StarRenderer has been disposed");
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
			this.generator = new EnhancedStarGenerator(finalConfig.seed);

			// Generate star
			const starResult = this.generator.generateStar(finalConfig.stellarClass, finalConfig.age);

			// Apply render configuration overrides
			this.applyRenderConfigOverrides(starResult.config, finalConfig);

			// Enhance the mesh with additional rendering features
			await this.enhanceMeshForRendering(starResult.mesh, starResult.config, starResult.stellarType, finalConfig);

			// Setup advanced lighting if enabled
			if (finalConfig.enableAdvancedLighting) {
				this.setupStellarLighting(starResult.mesh, starResult.config, finalConfig);
			}

			// Add stellar-specific effects
			if (finalConfig.enableParticleEffects) {
				this.addParticleEffects(starResult.mesh, starResult.config, starResult.stellarType);
			}

			// Add gravitational effects
			if (finalConfig.enableGravitationalEffects) {
				this.addGravitationalEffects(starResult.mesh, starResult.config, starResult.stellarType);
			}

			// Cache the result
			if (finalConfig.enableLOD) {
				this.renderCache.set(cacheKey, starResult.mesh.clone());
				this.cleanupCache();
			}

			// Calculate render metadata
			const metadata = this.calculateRenderMetadata(starResult.mesh, starResult.stellarType, startTime);

			this.lastRenderTime = performance.now() - startTime;

			return {
				mesh: starResult.mesh,
				config: starResult.config,
				stellarType: starResult.stellarType,
				statistics: starResult.statistics,
				physics: starResult.physics,
				metadata,
			};
		} catch (error) {
			console.error("Star rendering failed:", error);

			// Fallback to simple star
			return this.renderFallbackStar(finalConfig, startTime);
		}
	}

	/**
	 * Render a star by specific type
	 */
	public async renderStarByType(stellarClass: StellarClass, config: StarRenderConfig = {}): Promise<StarRenderResult> {
		return this.renderStar({ ...config, stellarClass });
	}

	/**
	 * Render a binary star system
	 */
	public async renderBinarySystem(primaryClass?: StellarClass, secondaryClass?: StellarClass, config: StarRenderConfig = {}): Promise<StarRenderResult[]> {
		const binaryConfig = { ...config, binarySystem: true };

		// Generate binary system
		const binaryStars = this.generator.generateBinarySystem(primaryClass, secondaryClass);

		const results: StarRenderResult[] = [];
		for (const star of binaryStars) {
			// Apply render configuration
			this.applyRenderConfigOverrides(star.config, binaryConfig);

			// Enhance meshes
			await this.enhanceMeshForRendering(star.mesh, star.config, star.stellarType, binaryConfig);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(star.mesh, star.stellarType, performance.now());

			results.push({
				mesh: star.mesh,
				config: star.config,
				stellarType: star.stellarType,
				statistics: star.statistics,
				physics: star.physics,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Render a multiple star system
	 */
	public async renderMultipleSystem(starCount: number = 3, config: StarRenderConfig = {}): Promise<StarRenderResult[]> {
		const multipleConfig = {
			...config,
			multipleSystem: true,
			systemSize: starCount,
		};

		// Generate multiple star system
		const stars = this.generator.generateStellarSystem(starCount);

		const results: StarRenderResult[] = [];
		for (const star of stars) {
			// Apply render configuration
			this.applyRenderConfigOverrides(star.config, multipleConfig);

			// Enhance meshes
			await this.enhanceMeshForRendering(star.mesh, star.config, star.stellarType, multipleConfig);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(star.mesh, star.stellarType, performance.now());

			results.push({
				mesh: star.mesh,
				config: star.config,
				stellarType: star.stellarType,
				statistics: star.statistics,
				physics: star.physics,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Render stars representing stellar evolution
	 */
	public async renderEvolutionSequence(initialMass: number): Promise<StarRenderResult[]> {
		const evolutionStages = [
			StellarClass.PROTOSTAR,
			StellarClass.G_TYPE, // Main sequence
			StellarClass.RED_GIANT,
			StellarClass.WHITE_DWARF,
		];

		if (initialMass > 8) {
			evolutionStages[2] = StellarClass.RED_SUPERGIANT;
			evolutionStages[3] = StellarClass.NEUTRON_STAR;
		}

		if (initialMass > 20) {
			evolutionStages[3] = StellarClass.BLACK_HOLE;
		}

		const results: StarRenderResult[] = [];
		let age = 0;

		for (const stage of evolutionStages) {
			const star = await this.renderStarByType(stage, {
				mass: initialMass,
				age: age,
				detailLevel: 4,
			});
			results.push(star);

			// Advance age for next stage
			age += star.statistics.lifespanInMillionYears * 0.8;
		}

		return results;
	}

	/**
	 * Get all available stellar types
	 */
	public getAvailableStellarTypes(): StellarClass[] {
		return Array.from(STELLAR_TYPES.keys());
	}

	/**
	 * Get stellar type information
	 */
	public getStellarTypeInfo(stellarClass: StellarClass): StellarTypeDefinition | undefined {
		return getStellarTypeByClass(stellarClass);
	}

	/**
	 * Update rendering quality based on performance
	 */
	public updateQuality(qualityLevel: number): void {
		// Quality level 0-5, where 5 is highest quality
		const quality = Math.max(0, Math.min(5, qualityLevel));

		// Update default configuration based on quality
		DEFAULT_CONFIG.detailLevel = Math.max(1, Math.floor(quality + 1));
		DEFAULT_CONFIG.effectDensity = 0.3 + quality * 0.1;
		DEFAULT_CONFIG.maxEffects = 20 + quality * 20;
		DEFAULT_CONFIG.enableParticleEffects = quality >= 3;
		DEFAULT_CONFIG.enableGravitationalEffects = quality >= 4;
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

	private generateCacheKey(config: StarRenderConfig): string {
		const keyParts = [config.stellarClass || "random", config.seed || 0, config.mass || 1, config.age || 5000, config.detailLevel || 3, config.effectDensity || 0.7];

		return keyParts.join("|");
	}

	private createCachedResult(mesh: THREE.Group, config: StarRenderConfig, startTime: number): StarRenderResult {
		const clonedMesh = mesh.clone();

		// Create minimal metadata for cached result
		const metadata: StarRenderMetadata = {
			renderTime: performance.now() - startTime,
			vertexCount: this.calculateVertexCount(clonedMesh),
			effectCount: clonedMesh.children.length,
			lightCount: 1,
			memoryUsage: 0,
			qualityLevel: "cached",
			stellarPhenomena: [],
		};

		return {
			mesh: clonedMesh,
			config: {} as EnhancedStarConfig,
			stellarType: {} as StellarTypeDefinition,
			statistics: {},
			physics: {},
			metadata,
		};
	}

	private applyRenderConfigOverrides(starConfig: EnhancedStarConfig, renderConfig: StarRenderConfig): void {
		if (renderConfig.mass !== undefined) {
			starConfig.mass = renderConfig.mass;
		}

		if (renderConfig.age !== undefined) {
			starConfig.age = renderConfig.age;
		}

		if (renderConfig.effectDensity !== undefined) {
			starConfig.effectDensity = renderConfig.effectDensity;
		}

		if (renderConfig.animationIntensity !== undefined) {
			starConfig.animationIntensity = renderConfig.animationIntensity;
		}

		// Override visual features based on render config
		if (renderConfig.enableCorona !== undefined) {
			starConfig.visualFeatures.coronaVisible = renderConfig.enableCorona;
		}

		if (renderConfig.enableStellarWind !== undefined) {
			starConfig.visualFeatures.stellarWind = renderConfig.enableStellarWind;
		}

		if (renderConfig.enableMagnetosphere !== undefined) {
			starConfig.visualFeatures.magnetosphere = renderConfig.enableMagnetosphere;
		}

		if (renderConfig.enableAccretionDisk !== undefined) {
			starConfig.visualFeatures.accretionDisk = renderConfig.enableAccretionDisk;
		}

		if (renderConfig.enableJets !== undefined) {
			starConfig.visualFeatures.jetStreams = renderConfig.enableJets;
		}
	}

	private async enhanceMeshForRendering(mesh: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition, renderConfig: StarRenderConfig): Promise<void> {
		// Apply LOD if enabled
		if (renderConfig.enableLOD) {
			this.applyLOD(mesh, renderConfig.renderDistance || 1000);
		}

		// Limit effects if necessary
		if (renderConfig.maxEffects && mesh.children.length > renderConfig.maxEffects) {
			this.limitEffects(mesh, renderConfig.maxEffects);
		}

		// Add stellar-specific optimizations
		this.optimizeMeshForPerformance(mesh, stellarType);
	}

	private applyLOD(mesh: THREE.Group, renderDistance: number): void {
		mesh.children.forEach((child) => {
			if (child instanceof THREE.Mesh) {
				// Create LOD versions for complex stellar objects
				const lod = new THREE.LOD();

				// High detail (close)
				lod.addLevel(child, 0);

				// Medium detail
				const mediumGeometry = this.simplifyGeometry(child.geometry as THREE.BufferGeometry, 0.6);
				const mediumMesh = new THREE.Mesh(mediumGeometry, child.material);
				lod.addLevel(mediumMesh, renderDistance * 0.3);

				// Low detail (far)
				const lowGeometry = this.simplifyGeometry(child.geometry as THREE.BufferGeometry, 0.3);
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
		// Simple geometry simplification for stellar objects
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

	private limitEffects(mesh: THREE.Group, maxEffects: number): void {
		while (mesh.children.length > maxEffects) {
			const randomIndex = Math.floor(Math.random() * mesh.children.length);
			const child = mesh.children[randomIndex];
			mesh.remove(child);
			this.disposeMesh(child);
		}
	}

	private setupStellarLighting(mesh: THREE.Group, config: EnhancedStarConfig, renderConfig: StarRenderConfig): void {
		// Stars are light sources themselves
		const stellarLight = new THREE.PointLight(0xffffff, config.luminosity * 0.1, config.radius * 100);
		stellarLight.position.set(0, 0, 0);
		stellarLight.castShadow = true;
		mesh.add(stellarLight);

		// Add atmospheric glow
		if (config.visualFeatures.coronaVisible) {
			const glowLight = new THREE.PointLight(0xffa500, config.luminosity * 0.05, config.radius * 50);
			glowLight.position.set(0, 0, 0);
			mesh.add(glowLight);
		}

		// Add special lighting for exotic objects
		switch (config.stellarClass) {
			case StellarClass.NEUTRON_STAR:
			case StellarClass.PULSAR:
				this.addPulsarLighting(mesh, config);
				break;

			case StellarClass.BLACK_HOLE:
				this.addAccretionDiskLighting(mesh, config);
				break;

			case StellarClass.WOLF_RAYET:
				this.addShockFrontLighting(mesh, config);
				break;
		}
	}

	private addPulsarLighting(mesh: THREE.Group, config: EnhancedStarConfig): void {
		// Rotating beam lights
		const beamLight1 = new THREE.SpotLight(0x00ffff, 2, 1000, Math.PI / 6);
		beamLight1.position.set(0, config.radius * 10, 0);
		beamLight1.target.position.set(0, config.radius * 100, 0);
		mesh.add(beamLight1);
		mesh.add(beamLight1.target);

		const beamLight2 = new THREE.SpotLight(0x00ffff, 2, 1000, Math.PI / 6);
		beamLight2.position.set(0, -config.radius * 10, 0);
		beamLight2.target.position.set(0, -config.radius * 100, 0);
		mesh.add(beamLight2);
		mesh.add(beamLight2.target);
	}

	private addAccretionDiskLighting(mesh: THREE.Group, config: EnhancedStarConfig): void {
		// Ring of lights around accretion disk
		const lightCount = 8;
		for (let i = 0; i < lightCount; i++) {
			const angle = (i / lightCount) * Math.PI * 2;
			const radius = config.radius * 5;

			const diskLight = new THREE.PointLight(0xff4500, 0.5, 50);
			diskLight.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
			mesh.add(diskLight);
		}
	}

	private addShockFrontLighting(mesh: THREE.Group, config: EnhancedStarConfig): void {
		// Expanding shock wave lighting
		const shockLight = new THREE.PointLight(0x87ceeb, 1, config.radius * 20);
		shockLight.position.set(0, 0, 0);
		mesh.add(shockLight);
	}

	private addParticleEffects(mesh: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		switch (stellarType.class) {
			case StellarClass.PROTOSTAR:
				this.addAccretionParticles(mesh, config);
				break;

			case StellarClass.RED_SUPERGIANT:
				this.addMassLossParticles(mesh, config);
				break;

			case StellarClass.WOLF_RAYET:
				// Use existing mass loss particles for stellar wind
				this.addMassLossParticles(mesh, config);
				break;

			case StellarClass.NEUTRON_STAR:
				// Use accretion particles for magnetic field effects
				this.addAccretionParticles(mesh, config);
				break;

			case StellarClass.BLACK_HOLE:
				// Use accretion particles for Hawking radiation
				this.addAccretionParticles(mesh, config);
				break;
		}
	}

	private addAccretionParticles(mesh: THREE.Group, config: EnhancedStarConfig): void {
		const particleCount = 500;
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			const radius = config.radius * (2 + Math.random() * 8);
			const angle = Math.random() * Math.PI * 2;
			const height = (Math.random() - 0.5) * config.radius;

			positions[i * 3] = Math.cos(angle) * radius;
			positions[i * 3 + 1] = height;
			positions[i * 3 + 2] = Math.sin(angle) * radius;
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		const particleMaterial = new THREE.PointsMaterial({
			color: 0xff4500,
			size: 0.1,
			transparent: true,
			opacity: 0.7,
		});

		const particleSystem = new THREE.Points(particles, particleMaterial);
		mesh.add(particleSystem);
	}

	private addMassLossParticles(mesh: THREE.Group, config: EnhancedStarConfig): void {
		const particleCount = 300;
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			const radius = config.radius * (1.5 + Math.random() * 5);
			const phi = Math.random() * Math.PI * 2;
			const theta = Math.random() * Math.PI;

			positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
			positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
			positions[i * 3 + 2] = radius * Math.cos(theta);
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		const particleMaterial = new THREE.PointsMaterial({
			color: 0x8b0000,
			size: 0.2,
			transparent: true,
			opacity: 0.5,
		});

		const particleSystem = new THREE.Points(particles, particleMaterial);
		mesh.add(particleSystem);
	}

	private addGravitationalEffects(mesh: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		// Add gravitational lensing effect for compact objects
		if (stellarType.class === StellarClass.BLACK_HOLE || stellarType.class === StellarClass.NEUTRON_STAR) {
			this.addGravitationalLensing(mesh, config);
		}

		// Add tidal distortion effects for binary systems
		if (config.binaryCompanion) {
			this.addTidalEffects(mesh, config);
		}
	}

	private addGravitationalLensing(mesh: THREE.Group, config: EnhancedStarConfig): void {
		// Create a subtle distortion ring to represent gravitational lensing
		const lensGeometry = new THREE.RingGeometry(config.radius * 3, config.radius * 5, 32);
		const lensMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.1,
			side: THREE.DoubleSide,
		});

		const lensRing = new THREE.Mesh(lensGeometry, lensMaterial);
		mesh.add(lensRing);
	}

	private addTidalEffects(mesh: THREE.Group, config: EnhancedStarConfig): void {
		// Add tidal bulge visualization using a scaled sphere
		const bulgeGeometry = new THREE.SphereGeometry(config.radius, 16, 16);
		bulgeGeometry.scale(1.1, 0.9, 1.0); // Create ellipsoid effect

		const bulgeMaterial = new THREE.MeshBasicMaterial({
			color: 0xffa500,
			transparent: true,
			opacity: 0.2,
		});

		const tidalBulge = new THREE.Mesh(bulgeGeometry, bulgeMaterial);
		mesh.add(tidalBulge);
	}

	private optimizeMeshForPerformance(mesh: THREE.Group, stellarType: StellarTypeDefinition): void {
		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				// Enable frustum culling
				child.frustumCulled = true;

				// Optimize geometry
				if (child.geometry instanceof THREE.BufferGeometry) {
					child.geometry.computeBoundingSphere();
					child.geometry.computeBoundingBox();
				}

				// Optimize materials for stellar objects
				if (child.material instanceof THREE.Material) {
					child.material.precision = stellarType.class === StellarClass.BLACK_HOLE ? "highp" : "mediump";
				}
			}
		});
	}

	private renderFallbackStar(config: StarRenderConfig, startTime: number): StarRenderResult {
		// Create a simple fallback star
		const geometry = new THREE.IcosahedronGeometry(config.mass || 1, 2);
		const material = new THREE.MeshBasicMaterial({
			color: 0xffd700,
		});
		const mesh = new THREE.Mesh(geometry, material);

		const group = new THREE.Group();
		group.add(mesh);

		const metadata: StarRenderMetadata = {
			renderTime: performance.now() - startTime,
			vertexCount: geometry.attributes.position?.count || 0,
			effectCount: 1,
			lightCount: 0,
			memoryUsage: 0,
			qualityLevel: "fallback",
			stellarPhenomena: [],
		};

		return {
			mesh: group,
			config: {} as EnhancedStarConfig,
			stellarType: {} as StellarTypeDefinition,
			statistics: {},
			physics: {},
			metadata,
		};
	}

	private calculateRenderMetadata(mesh: THREE.Group, stellarType: StellarTypeDefinition, startTime: number): StarRenderMetadata {
		let vertexCount = 0;
		let effectCount = 0;
		let lightCount = 0;
		let memoryUsage = 0;

		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				if (child.geometry instanceof THREE.BufferGeometry) {
					const positions = child.geometry.attributes.position;
					if (positions) {
						vertexCount += positions.count;
					}
				}
				effectCount++;
				memoryUsage += 2048; // Rough estimate
			} else if (child instanceof THREE.Light) {
				lightCount++;
			} else if (child instanceof THREE.Points) {
				effectCount++;
				memoryUsage += 1024; // Particle systems
			}
		});

		return {
			renderTime: performance.now() - startTime,
			vertexCount,
			effectCount,
			lightCount,
			memoryUsage,
			qualityLevel: this.determineQualityLevel(vertexCount, effectCount),
			stellarPhenomena: stellarType.stellarPhenomena || [],
		};
	}

	private determineQualityLevel(vertexCount: number, effectCount: number): string {
		if (vertexCount > 50000 || effectCount > 20) return "ultra";
		if (vertexCount > 20000 || effectCount > 15) return "high";
		if (vertexCount > 10000 || effectCount > 10) return "medium";
		if (vertexCount > 2000 || effectCount > 5) return "low";
		return "minimal";
	}

	private calculateVertexCount(mesh: THREE.Group): number {
		let count = 0;
		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
				const positions = child.geometry.attributes.position;
				if (positions) {
					count += positions.count;
				}
			}
		});
		return count;
	}

	private disposeMesh(object: THREE.Object3D): void {
		object.traverse((child) => {
			if (child instanceof THREE.Mesh) {
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
	 * Preload common stellar types
	 */
	public async preloadCommonTypes(): Promise<void> {
		const commonTypes = [StellarClass.G_TYPE, StellarClass.M_TYPE, StellarClass.K_TYPE, StellarClass.RED_GIANT, StellarClass.WHITE_DWARF];

		const promises = commonTypes.map((type) =>
			this.renderStar({
				stellarClass: type,
				detailLevel: 1,
				enableParticleEffects: false,
			})
		);

		await Promise.all(promises);
	}
}
