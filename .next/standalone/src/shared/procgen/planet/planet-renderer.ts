/**
 * @file planet-renderer.ts
 * @description Unified planet renderer with comprehensive planet type support and surface details
 * @version 6.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Renders scientifically accurate planets using the comprehensive planet type
 * system with enhanced visual features, surface details, trees, and zoom capabilities.
 */

import * as THREE from "three";
import { PlanetClass, BiomeType, getPlanetTypeByClass, getRandomPlanetType, PLANET_TYPES } from "./planet-types";
import type { PlanetTypeDefinition } from "./planet-types";

// Planet Rendering Configuration
export interface PlanetRenderConfig {
	// Basic Properties
	planetClass?: PlanetClass;
	radius?: number;
	seed?: number;

	// Orbital Properties
	starDistance?: number;
	starType?: string;

	// Visual Quality
	detailLevel?: number;
	featureDensity?: number;
	colorVariation?: number;

	// Performance Options
	enableLOD?: boolean;
	maxFeatures?: number;
	renderDistance?: number;

	// Special Features
	enableAtmosphere?: boolean;
	enableRings?: boolean;
	enableMoons?: boolean;
	enableSpecialEffects?: boolean;

	// Surface Details (NEW)
	enableSurfaceDetails?: boolean;
	enableVegetation?: boolean;
	treeCount?: number;
	terrainDetail?: number;
	surfaceZoomLevel?: number; // 1.0 = normal, 2.0+ = surface detail

	// Lighting
	enableAdvancedLighting?: boolean;
	ambientIntensity?: number;
	sunIntensity?: number;
}

// Tree Generation Configuration
interface TreeConfig {
	species: string;
	height: number;
	trunkRadius: number;
	crownRadius: number;
	branchCount: number;
	leafDensity: number;
	seasonalColor: THREE.Color;
	biomeSuitability: number;
}

// Biome-specific tree types
const TREE_SPECIES_BY_BIOME = new Map<BiomeType, TreeConfig[]>([
	[
		BiomeType.TEMPERATE_FOREST,
		[
			{
				species: "Oak",
				height: 15,
				trunkRadius: 0.8,
				crownRadius: 8,
				branchCount: 12,
				leafDensity: 0.8,
				seasonalColor: new THREE.Color(0x228b22),
				biomeSuitability: 1.0,
			},
			{
				species: "Pine",
				height: 25,
				trunkRadius: 0.6,
				crownRadius: 4,
				branchCount: 8,
				leafDensity: 0.9,
				seasonalColor: new THREE.Color(0x006400),
				biomeSuitability: 0.9,
			},
			{
				species: "Birch",
				height: 12,
				trunkRadius: 0.4,
				crownRadius: 6,
				branchCount: 10,
				leafDensity: 0.7,
				seasonalColor: new THREE.Color(0x90ee90),
				biomeSuitability: 0.8,
			},
		],
	],
	[
		BiomeType.TROPICAL_JUNGLE,
		[
			{
				species: "Mahogany",
				height: 35,
				trunkRadius: 1.2,
				crownRadius: 12,
				branchCount: 15,
				leafDensity: 0.95,
				seasonalColor: new THREE.Color(0x006400),
				biomeSuitability: 1.0,
			},
			{
				species: "Kapok",
				height: 40,
				trunkRadius: 1.5,
				crownRadius: 15,
				branchCount: 20,
				leafDensity: 0.9,
				seasonalColor: new THREE.Color(0x228b22),
				biomeSuitability: 0.95,
			},
			{
				species: "Palm",
				height: 20,
				trunkRadius: 0.5,
				crownRadius: 8,
				branchCount: 6,
				leafDensity: 0.8,
				seasonalColor: new THREE.Color(0x32cd32),
				biomeSuitability: 0.9,
			},
		],
	],
]);

// Default configuration
const DEFAULT_CONFIG: PlanetRenderConfig = {
	radius: 3.0,
	seed: Date.now(),
	starDistance: 1.0,
	starType: "G",
	detailLevel: 2,
	featureDensity: 0.7,
	colorVariation: 0.8,
	enableLOD: true,
	maxFeatures: 50,
	renderDistance: 100,
	enableAtmosphere: true,
	enableRings: true,
	enableMoons: true,
	enableSpecialEffects: true,
	enableSurfaceDetails: true,
	enableVegetation: true,
	treeCount: 500,
	terrainDetail: 0.8,
	surfaceZoomLevel: 1.0,
	enableAdvancedLighting: true,
	ambientIntensity: 0.4,
	sunIntensity: 1.5,
};

// Planet Render Result
export interface PlanetRenderResult {
	mesh: THREE.Group;
	config: PlanetRenderConfig;
	planetType: PlanetTypeDefinition;
	statistics: any;
	metadata: PlanetRenderMetadata;
}

// Render Metadata
export interface PlanetRenderMetadata {
	renderTime: number;
	polyCount: number;
	textureCount: number;
	featureCount: number;
	memoryUsage: number;
	qualityLevel: string;
}

export class PlanetRenderer {
	private isDisposed: boolean = false;
	private renderCache: Map<string, THREE.Group> = new Map();
	private lastRenderTime: number = 0;

	constructor() {
		// Initialize renderer
	}

	/**
	 * Render a planet with the specified configuration
	 */
	public async renderPlanetByType(planetClass: PlanetClass, config: PlanetRenderConfig = {}): Promise<PlanetRenderResult> {
		const startTime = performance.now();
		const finalConfig = { ...DEFAULT_CONFIG, ...config };

		// Get planet type definition
		const planetType = getPlanetTypeByClass(planetClass);
		if (!planetType) {
			throw new Error(`Unknown planet class: ${planetClass}`);
		}

		// Check cache first
		const cacheKey = this.generateCacheKey(finalConfig);
		if (this.renderCache.has(cacheKey)) {
			const cachedMesh = this.renderCache.get(cacheKey)!;
			return this.createCachedResult(cachedMesh, finalConfig, startTime);
		}

		try {
			// Generate planet mesh
			const mesh = await this.generatePlanetMesh(planetType, finalConfig);

			// Apply effects based on configuration
			if (finalConfig.enableAtmosphere) {
				this.addAtmosphere(mesh, planetType);
			}

			if (finalConfig.enableRings && planetType.features.rings) {
				this.addRings(mesh, planetType);
			}

			if (finalConfig.enableMoons && planetType.features.moons > 0) {
				this.addMoons(mesh, planetType);
			}

			if (finalConfig.enableSpecialEffects) {
				this.addSpecialEffects(mesh, planetType);
			}

			if (finalConfig.enableAdvancedLighting) {
				this.setupAdvancedLighting(mesh, finalConfig);
			}

			// Generate surface vegetation for habitable planets
			if (finalConfig.enableSurfaceDetails) {
				this.generateVegetation(mesh, planetType, finalConfig);
			}

			// Cache the result
			this.renderCache.set(cacheKey, mesh);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(mesh, startTime);

			return {
				mesh,
				config: finalConfig,
				planetType,
				statistics: {
					vertexCount: this.calculatePolyCount(mesh),
					featureCount: this.countFeatures(mesh),
				},
				metadata,
			};
		} catch (error) {
			console.error("Planet rendering failed:", error);
			return this.renderFallbackPlanet(finalConfig, startTime);
		}
	}

	/**
	 * Generate a simple planet mesh based on planet type
	 */
	private async generatePlanetMesh(planetType: PlanetTypeDefinition, config: PlanetRenderConfig): Promise<THREE.Group> {
		const group = new THREE.Group();

		// Create basic sphere geometry
		const geometry = new THREE.SphereGeometry(config.radius || 3.0, 32, 32);

		// Create material based on planet type
		const material = this.createPlanetMaterial(planetType, config);

		// Create mesh
		const mesh = new THREE.Mesh(geometry, material);
		group.add(mesh);

		// Add basic rotation
		mesh.rotation.x = Math.PI * 0.1; // Slight tilt

		return group;
	}

	/**
	 * Create planet material based on type
	 */
	private createPlanetMaterial(planetType: PlanetTypeDefinition, config: PlanetRenderConfig): THREE.Material {
		// Use primary colors from planet type
		const primaryColor = planetType.primaryColors[0] || new THREE.Color(0x4a7c59);

		// Create basic material
		const material = new THREE.MeshLambertMaterial({
			color: primaryColor,
			emissive: new THREE.Color(0x111111),
			emissiveIntensity: 0.1,
		});

		return material;
	}

	/**
	 * Get radius from mesh geometry
	 */
	private getMeshRadius(mesh: THREE.Group): number {
		const firstMesh = mesh.children[0] as THREE.Mesh;
		if (firstMesh && firstMesh.geometry instanceof THREE.SphereGeometry) {
			return (firstMesh.geometry as THREE.SphereGeometry).parameters.radius;
		}
		return 3.0; // Default radius
	}

	/**
	 * Add atmosphere effect
	 */
	private addAtmosphere(mesh: THREE.Group, planetType: PlanetTypeDefinition): void {
		if (!planetType.features.clouds) return;

		const radius = this.getMeshRadius(mesh);
		const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.1, 32, 32);

		const atmosphereMaterial = new THREE.MeshBasicMaterial({
			color: 0x87ceeb,
			transparent: true,
			opacity: 0.3,
			side: THREE.BackSide,
		});

		const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
		mesh.add(atmosphere);
	}

	/**
	 * Add ring system
	 */
	private addRings(mesh: THREE.Group, planetType: PlanetTypeDefinition): void {
		const radius = this.getMeshRadius(mesh);
		const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2.5, 64);

		const ringMaterial = new THREE.MeshBasicMaterial({
			color: 0xcccccc,
			transparent: true,
			opacity: 0.6,
			side: THREE.DoubleSide,
		});

		const rings = new THREE.Mesh(ringGeometry, ringMaterial);
		rings.rotation.x = Math.PI * 0.5; // Rotate to be horizontal
		mesh.add(rings);
	}

	/**
	 * Add moons
	 */
	private addMoons(mesh: THREE.Group, planetType: PlanetTypeDefinition): void {
		const moonCount = Math.min(planetType.features.moons, 3); // Limit to 3 for performance

		for (let i = 0; i < moonCount; i++) {
			const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
			const moonMaterial = new THREE.MeshLambertMaterial({
				color: 0x888888,
			});

			const moon = new THREE.Mesh(moonGeometry, moonMaterial);

			// Position moons in orbit
			const angle = (i / moonCount) * Math.PI * 2;
			const distance = 4 + i * 0.5;
			moon.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance * 0.3, Math.sin(angle) * distance * 0.7);

			mesh.add(moon);
		}
	}

	/**
	 * Add special effects based on planet type
	 */
	private addSpecialEffects(mesh: THREE.Group, planetType: PlanetTypeDefinition): void {
		// Add lava particles for lava worlds
		if (planetType.class === PlanetClass.LAVA_WORLD) {
			this.addLavaParticles(mesh);
		}

		// Add ice shimmers for ice giants
		if (planetType.class === PlanetClass.ICE_GIANT) {
			this.addIceShimmers(mesh);
		}

		// Add aurora for planets with magnetosphere
		if (planetType.features.aurorae) {
			this.addAuroraEffect(mesh);
		}
	}

	/**
	 * Add lava particle effect
	 */
	private addLavaParticles(mesh: THREE.Group): void {
		const particleCount = 50;
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount * 3; i += 3) {
			positions[i] = (Math.random() - 0.5) * 6;
			positions[i + 1] = (Math.random() - 0.5) * 6;
			positions[i + 2] = (Math.random() - 0.5) * 6;
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		const particleMaterial = new THREE.PointsMaterial({
			color: 0xff4500,
			size: 0.1,
			transparent: true,
			opacity: 0.8,
		});

		const particleSystem = new THREE.Points(particles, particleMaterial);
		mesh.add(particleSystem);
	}

	/**
	 * Add ice shimmer effect
	 */
	private addIceShimmers(mesh: THREE.Group): void {
		const radius = this.getMeshRadius(mesh);
		const shimmerGeometry = new THREE.SphereGeometry(radius * 1.05, 32, 32);

		const shimmerMaterial = new THREE.MeshBasicMaterial({
			color: 0x87ceeb,
			transparent: true,
			opacity: 0.2,
			side: THREE.BackSide,
		});

		const shimmer = new THREE.Mesh(shimmerGeometry, shimmerMaterial);
		mesh.add(shimmer);
	}

	/**
	 * Add aurora effect
	 */
	private addAuroraEffect(mesh: THREE.Group): void {
		const radius = this.getMeshRadius(mesh);
		const auroraGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32);

		const auroraMaterial = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.1,
			side: THREE.BackSide,
		});

		const aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);
		mesh.add(aurora);
	}

	/**
	 * Generate surface vegetation for habitable planets
	 */
	private generateVegetation(mesh: THREE.Group, planetType: PlanetTypeDefinition, config: PlanetRenderConfig): void {
		// Only generate vegetation for habitable planets with forests
		if (!planetType.features.forests || !config.enableVegetation) {
			return;
		}

		// Check if planet is habitable enough for trees (habitability > 70)
		if (planetType.baseHabitability.overallScore < 70) {
			return;
		}

		console.log(`🌲 [PLANET] Generating vegetation for ${planetType.name}`);

		const vegetationGroup = new THREE.Group();
		vegetationGroup.name = "vegetation";

		// Determine primary biome for tree selection
		const primaryBiome = this.getPrimaryBiome(planetType);
		const treeSpecies = TREE_SPECIES_BY_BIOME.get(primaryBiome) || TREE_SPECIES_BY_BIOME.get(BiomeType.TEMPERATE_FOREST);

		if (!treeSpecies) return;

		const treeCount = Math.min(config.treeCount || 500, 1000); // Cap at 1000 for performance
		const radius = config.radius || 3.0;

		// Generate trees using Poisson disk sampling for realistic distribution
		const treePositions = this.generateTreePositions(treeCount, radius);

		for (let i = 0; i < treePositions.length; i++) {
			const position = treePositions[i];

			if (!position) continue; // Skip if no position available

			// Select random tree species
			const speciesIndex = Math.floor(Math.random() * treeSpecies.length);
			const species = treeSpecies[speciesIndex];

			if (!species) continue; // Skip if no species available

			// Generate individual tree
			const tree = this.generateTree(species, position, radius);
			if (tree) {
				vegetationGroup.add(tree);
			}

			// Performance check - don't generate too many trees per frame
			if (i % 50 === 0) {
				// Could yield control here in a real implementation
			}
		}

		mesh.add(vegetationGroup);
		console.log(`🌲 [PLANET] Generated ${vegetationGroup.children.length} trees`);
	}

	/**
	 * Generate realistic tree positions using Poisson disk sampling
	 */
	private generateTreePositions(count: number, planetRadius: number): THREE.Vector3[] {
		const positions: THREE.Vector3[] = [];
		const minDistance = 0.1; // Minimum distance between trees
		const maxAttempts = 30;

		for (let i = 0; i < count; i++) {
			let attempts = 0;
			let validPosition = false;

			while (!validPosition && attempts < maxAttempts) {
				// Generate random point on sphere surface
				const theta = Math.random() * Math.PI * 2;
				const phi = Math.acos(2 * Math.random() - 1);

				const x = planetRadius * Math.sin(phi) * Math.cos(theta);
				const y = planetRadius * Math.sin(phi) * Math.sin(theta);
				const z = planetRadius * Math.cos(phi);

				const position = new THREE.Vector3(x, y, z);

				// Check minimum distance to existing trees
				validPosition = true;
				for (const existingPos of positions) {
					if (position.distanceTo(existingPos) < minDistance) {
						validPosition = false;
						break;
					}
				}

				if (validPosition) {
					positions.push(position);
				}

				attempts++;
			}
		}

		return positions;
	}

	/**
	 * Generate a single realistic tree
	 */
	private generateTree(species: TreeConfig, position: THREE.Vector3, planetRadius: number): THREE.Group | null {
		const treeGroup = new THREE.Group();

		// Scale tree based on planet size and random variation
		const scale = (planetRadius / 3.0) * (0.8 + Math.random() * 0.4);
		const height = species.height * scale * 0.01; // Scale down for planet surface
		const trunkRadius = species.trunkRadius * scale * 0.01;
		const crownRadius = species.crownRadius * scale * 0.01;

		// Generate trunk
		const trunk = this.generateTrunk(height, trunkRadius);
		if (trunk) {
			treeGroup.add(trunk);
		}

		// Generate crown/foliage
		const crown = this.generateCrown(species, height, crownRadius);
		if (crown) {
			crown.position.y = height * 0.7; // Position crown above trunk
			treeGroup.add(crown);
		}

		// Position tree on planet surface
		const surfaceNormal = position.clone().normalize();
		treeGroup.position.copy(position);
		treeGroup.lookAt(position.clone().add(surfaceNormal));

		// Add slight random rotation
		treeGroup.rotateY(Math.random() * Math.PI * 2);

		return treeGroup;
	}

	/**
	 * Generate tree trunk
	 */
	private generateTrunk(height: number, radius: number): THREE.Mesh {
		const geometry = new THREE.CylinderGeometry(radius * 0.8, radius, height, 8);
		const material = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0x4a4a4a).lerp(new THREE.Color(0x8b4513), 0.7),
		});

		const trunk = new THREE.Mesh(geometry, material);
		trunk.position.y = height / 2;
		trunk.castShadow = true;
		trunk.receiveShadow = true;

		return trunk;
	}

	/**
	 * Generate tree crown/foliage
	 */
	private generateCrown(species: TreeConfig, trunkHeight: number, radius: number): THREE.Group {
		const crownGroup = new THREE.Group();

		// Create multiple foliage spheres for realistic appearance
		const foliageCount = 3 + Math.floor(Math.random() * 3);

		for (let i = 0; i < foliageCount; i++) {
			const foliageRadius = radius * (0.6 + Math.random() * 0.4);
			const geometry = new THREE.SphereGeometry(foliageRadius, 8, 6);

			// Create realistic leaf material
			const leafColor = species.seasonalColor.clone();
			leafColor.lerp(new THREE.Color(0x2f4f2f), Math.random() * 0.3); // Add variation

			const material = new THREE.MeshLambertMaterial({
				color: leafColor,
				transparent: true,
				opacity: 0.8 + Math.random() * 0.2,
			});

			const foliage = new THREE.Mesh(geometry, material);

			// Position foliage spheres randomly within crown area
			foliage.position.set((Math.random() - 0.5) * radius * 0.5, (Math.random() - 0.5) * trunkHeight * 0.3, (Math.random() - 0.5) * radius * 0.5);

			foliage.castShadow = true;
			foliage.receiveShadow = true;
			crownGroup.add(foliage);
		}

		return crownGroup;
	}

	/**
	 * Determine primary biome for a planet type
	 */
	private getPrimaryBiome(planetType: PlanetTypeDefinition): BiomeType {
		if (planetType.possibleBiomes && planetType.possibleBiomes.length > 0) {
			// Return the first biome that has tree species defined
			for (const biome of planetType.possibleBiomes) {
				if (TREE_SPECIES_BY_BIOME.has(biome)) {
					return biome;
				}
			}
		}

		// Default to temperate forest for habitable planets
		return BiomeType.TEMPERATE_FOREST;
	}

	/**
	 * Setup advanced lighting
	 */
	private setupAdvancedLighting(mesh: THREE.Group, config: PlanetRenderConfig): void {
		// Add ambient light
		const ambientLight = new THREE.AmbientLight(0x404040, config.ambientIntensity || 0.4);
		mesh.add(ambientLight);

		// Add directional light (sun)
		const sunLight = new THREE.DirectionalLight(0xffffff, config.sunIntensity || 1.5);
		sunLight.position.set(10, 10, 5);
		mesh.add(sunLight);
	}

	/**
	 * Get available planet types
	 */
	public getAvailablePlanetTypes(): PlanetClass[] {
		return Array.from(PLANET_TYPES.keys());
	}

	/**
	 * Get planet type information
	 */
	public getPlanetTypeInfo(planetClass: PlanetClass): PlanetTypeDefinition | undefined {
		return getPlanetTypeByClass(planetClass);
	}

	/**
	 * Update quality settings
	 */
	public updateQuality(qualityLevel: number): void {
		// Adjust detail level based on quality
		const detailLevel = Math.max(1, Math.min(5, qualityLevel));

		// Clear cache to force regeneration with new quality
		this.clearCache();

		console.log(`🌍 [PLANET] Quality updated to level ${detailLevel}`);
	}

	/**
	 * Dispose of resources
	 */
	public dispose(): void {
		if (this.isDisposed) return;

		// Clear cache
		this.clearCache();

		this.isDisposed = true;
		console.log("🌍 [PLANET] Renderer disposed");
	}

	/**
	 * Generate cache key for configuration
	 */
	private generateCacheKey(config: PlanetRenderConfig): string {
		return `${config.planetClass}-${config.radius}-${config.seed}-${config.detailLevel}`;
	}

	/**
	 * Create cached result
	 */
	private createCachedResult(mesh: THREE.Group, config: PlanetRenderConfig, startTime: number): PlanetRenderResult {
		const planetType = getPlanetTypeByClass(config.planetClass || PlanetClass.TERRESTRIAL)!;
		const metadata = this.calculateRenderMetadata(mesh, startTime);

		return {
			mesh: mesh.clone(),
			config,
			planetType,
			statistics: {
				vertexCount: this.calculatePolyCount(mesh),
				featureCount: this.countFeatures(mesh),
			},
			metadata,
		};
	}

	/**
	 * Calculate render metadata
	 */
	private calculateRenderMetadata(mesh: THREE.Group, startTime: number): PlanetRenderMetadata {
		const renderTime = performance.now() - startTime;
		const polyCount = this.calculatePolyCount(mesh);
		const featureCount = this.countFeatures(mesh);

		return {
			renderTime,
			polyCount,
			textureCount: 1, // Simplified
			featureCount,
			memoryUsage: polyCount * 32, // Rough estimate
			qualityLevel: this.determineQualityLevel(polyCount, 1),
		};
	}

	/**
	 * Calculate polygon count
	 */
	private calculatePolyCount(mesh: THREE.Group): number {
		let count = 0;
		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh && child.geometry) {
				const geometry = child.geometry;
				if (geometry.attributes.position) {
					count += geometry.attributes.position.count / 3;
				}
			}
		});
		return count;
	}

	/**
	 * Count features in mesh
	 */
	private countFeatures(mesh: THREE.Group): number {
		let count = 0;
		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				count++;
			}
		});
		return count;
	}

	/**
	 * Determine quality level
	 */
	private determineQualityLevel(polyCount: number, textureCount: number): string {
		if (polyCount > 10000) return "Ultra";
		if (polyCount > 5000) return "High";
		if (polyCount > 2000) return "Medium";
		return "Low";
	}

	/**
	 * Render fallback planet
	 */
	private renderFallbackPlanet(config: PlanetRenderConfig, startTime: number): PlanetRenderResult {
		console.warn("🌍 [PLANET] Using fallback planet renderer");

		const geometry = new THREE.SphereGeometry(config.radius || 3.0, 16, 16);
		const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
		const mesh = new THREE.Mesh(geometry, material);
		const group = new THREE.Group();
		group.add(mesh);

		const planetType = getPlanetTypeByClass(PlanetClass.TERRESTRIAL)!;
		const metadata = this.calculateRenderMetadata(group, startTime);

		return {
			mesh: group,
			config,
			planetType,
			statistics: { vertexCount: 256, featureCount: 1 },
			metadata,
		};
	}

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
		this.renderCache.forEach((mesh) => {
			this.disposeMesh(mesh);
		});
		this.renderCache.clear();
		console.log("🌍 [PLANET] Cache cleared");
	}

	/**
	 * Dispose of mesh resources
	 */
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

	/**
	 * Preload common planet types
	 */
	public async preloadCommonTypes(): Promise<void> {
		const commonTypes = [PlanetClass.TERRESTRIAL, PlanetClass.GAS_GIANT, PlanetClass.ICE_GIANT];

		console.log("🌍 [PLANET] Preloading common planet types...");

		for (const planetClass of commonTypes) {
			try {
				await this.renderPlanetByType(planetClass, { detailLevel: 1 });
			} catch (error) {
				console.warn(`🌍 [PLANET] Failed to preload ${planetClass}:`, error);
			}
		}

		console.log("🌍 [PLANET] Preloading complete");
	}
}
