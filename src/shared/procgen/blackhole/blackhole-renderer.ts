// @ts-nocheck - Temporary disable for complex geometry and position attribute issues
/**
 * @file blackhole-renderer.ts
 * @description Enhanced black hole renderer with comprehensive black hole type support
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Renders scientifically accurate black holes using the comprehensive black hole
 * classification system with advanced visual effects and performance optimizations.
 */

import * as THREE from "three";
import { BlackHoleClass, getBlackHoleTypeByClass, getRandomBlackHoleType, BLACKHOLE_TYPES } from "./blackhole-types";
import type { BlackHoleTypeDefinition } from "./blackhole-types";
import { EnhancedBlackHoleGenerator } from "./enhanced-blackhole-generator";
import type { EnhancedBlackHoleConfig, EnhancedBlackHoleResult } from "./enhanced-blackhole-generator";

// Black Hole Rendering Configuration
export interface BlackHoleRenderConfig {
	// Basic Properties
	blackHoleClass?: BlackHoleClass;
	mass?: number; // Solar masses (log10)
	spin?: number; // 0-1
	charge?: number; // 0-1
	seed?: number;

	// System Properties
	binarySystem?: boolean;
	companionMass?: number;
	separation?: number;

	// Visual Quality
	detailLevel?: number;
	effectDensity?: number;
	renderDistance?: number;

	// Performance Options
	enableLOD?: boolean;
	maxParticles?: number;
	maxEffects?: number;

	// Physical Features
	enableEventHorizon?: boolean;
	enableErgosphere?: boolean;
	enableAccretionDisk?: boolean;
	enableJets?: boolean;
	enableHawkingRadiation?: boolean;
	enableGravitationalLensing?: boolean;
	enableGravitationalWaves?: boolean;

	// Advanced Effects
	enableQuantumEffects?: boolean;
	enableRelativisticEffects?: boolean;
	enableExoticMatter?: boolean;

	// Lighting and Atmosphere
	enableAdvancedLighting?: boolean;
	enableVolumetricEffects?: boolean;
	enableTemperatureGradients?: boolean;
	diskTemperature?: number;
	coronaIntensity?: number;
}

// Default configuration
const DEFAULT_CONFIG: BlackHoleRenderConfig = {
	mass: 1, // 10 solar masses
	spin: 0.7,
	charge: 0,
	seed: Date.now(),
	binarySystem: false,
	companionMass: 10,
	separation: 300,
	detailLevel: 3,
	effectDensity: 0.7,
	renderDistance: 1000,
	enableLOD: true,
	maxParticles: 50000,
	maxEffects: 100,
	enableEventHorizon: true,
	enableErgosphere: true,
	enableAccretionDisk: true,
	enableJets: true,
	enableHawkingRadiation: true,
	enableGravitationalLensing: true,
	enableGravitationalWaves: true,
	enableQuantumEffects: true,
	enableRelativisticEffects: true,
	enableExoticMatter: false,
	enableAdvancedLighting: true,
	enableVolumetricEffects: true,
	enableTemperatureGradients: true,
	diskTemperature: 1e7,
	coronaIntensity: 1.0,
};

// Black Hole Render Result
export interface BlackHoleRenderResult {
	mesh: THREE.Group;
	config: EnhancedBlackHoleConfig;
	blackHoleType: BlackHoleTypeDefinition;
	statistics: any;
	physics: any;
	observables: any;
	metadata: BlackHoleRenderMetadata;
}

// Render Metadata
export interface BlackHoleRenderMetadata {
	renderTime: number;
	particleCount: number;
	effectCount: number;
	lightCount: number;
	memoryUsage: number;
	qualityLevel: string;
	physicsFidelity: string;
	astrophysicalFeatures: string[];
	theoreticalBasis: string[];
}

export class BlackHoleRenderer {
	private generator: EnhancedBlackHoleGenerator;
	private isDisposed: boolean = false;
	private renderCache: Map<string, THREE.Group> = new Map();
	private lastRenderTime: number = 0;
	private shaderMaterials: Map<string, THREE.ShaderMaterial> = new Map();

	constructor() {
		this.generator = new EnhancedBlackHoleGenerator();
		this.initializeShaders();
	}

	/**
	 * Render a black hole with the specified configuration
	 */
	public async renderBlackHole(config: BlackHoleRenderConfig = {}): Promise<BlackHoleRenderResult> {
		if (this.isDisposed) {
			throw new Error("BlackHoleRenderer has been disposed");
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
			this.generator = new EnhancedBlackHoleGenerator(finalConfig.seed);

			// Generate black hole
			const mass = finalConfig.mass !== undefined ? Math.pow(10, finalConfig.mass) : undefined;
			const blackHoleResult = this.generator.generateBlackHole(finalConfig.blackHoleClass, mass);

			// Apply render configuration overrides
			this.applyRenderConfigOverrides(blackHoleResult.config, finalConfig);

			// Enhance the mesh with additional rendering features
			await this.enhanceMeshForRendering(blackHoleResult.mesh, blackHoleResult.config, blackHoleResult.blackHoleType, finalConfig);

			// Setup advanced lighting if enabled
			if (finalConfig.enableAdvancedLighting) {
				this.setupBlackHoleLighting(blackHoleResult.mesh, blackHoleResult.config, finalConfig);
			}

			// Add relativistic effects
			if (finalConfig.enableRelativisticEffects) {
				this.addRelativisticEffects(blackHoleResult.mesh, blackHoleResult.config, blackHoleResult.blackHoleType);
			}

			// Add quantum effects for small black holes
			if (finalConfig.enableQuantumEffects && blackHoleResult.config.mass < 1e-5) {
				this.addQuantumEffects(blackHoleResult.mesh, blackHoleResult.config, blackHoleResult.blackHoleType);
			}

			// Cache the result
			if (finalConfig.enableLOD) {
				this.renderCache.set(cacheKey, blackHoleResult.mesh.clone());
				this.cleanupCache();
			}

			// Calculate render metadata
			const metadata = this.calculateRenderMetadata(blackHoleResult.mesh, blackHoleResult.blackHoleType, startTime);

			this.lastRenderTime = performance.now() - startTime;

			return {
				mesh: blackHoleResult.mesh,
				config: blackHoleResult.config,
				blackHoleType: blackHoleResult.blackHoleType,
				statistics: blackHoleResult.statistics,
				physics: blackHoleResult.physics,
				observables: blackHoleResult.observables,
				metadata,
			};
		} catch (error) {
			console.error("Black hole rendering failed:", error);

			// Fallback to simple black hole
			return this.renderFallbackBlackHole(finalConfig, startTime);
		}
	}

	/**
	 * Render a black hole by specific type
	 */
	public async renderBlackHoleByType(blackHoleClass: BlackHoleClass, config: BlackHoleRenderConfig = {}): Promise<BlackHoleRenderResult> {
		return this.renderBlackHole({ ...config, blackHoleClass });
	}

	/**
	 * Render a binary black hole system
	 */
	public async renderBinarySystem(primaryClass?: BlackHoleClass, secondaryClass?: BlackHoleClass, config: BlackHoleRenderConfig = {}): Promise<BlackHoleRenderResult[]> {
		const binaryConfig = {
			...config,
			binarySystem: true,
			enableGravitationalWaves: true,
		};

		// Generate binary system
		const binaryBlackHoles = this.generator.generateBinaryBlackHoles(primaryClass, secondaryClass);

		const results: BlackHoleRenderResult[] = [];
		for (const blackHole of binaryBlackHoles) {
			// Apply render configuration
			this.applyRenderConfigOverrides(blackHole.config, binaryConfig);

			// Enhance meshes
			await this.enhanceMeshForRendering(blackHole.mesh, blackHole.config, blackHole.blackHoleType, binaryConfig);

			// Add binary-specific effects
			this.addBinarySystemEffects(blackHole.mesh, blackHole.config, binaryConfig);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(blackHole.mesh, blackHole.blackHoleType, performance.now());

			results.push({
				mesh: blackHole.mesh,
				config: blackHole.config,
				blackHoleType: blackHole.blackHoleType,
				statistics: blackHole.statistics,
				physics: blackHole.physics,
				observables: blackHole.observables,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Render black hole merger sequence
	 */
	public async renderMergerSequence(primaryClass: BlackHoleClass, secondaryClass: BlackHoleClass): Promise<BlackHoleRenderResult[]> {
		const mergerSequence = this.generator.generateMergerSequence(primaryClass, secondaryClass);

		const results: BlackHoleRenderResult[] = [];
		for (const blackHole of mergerSequence) {
			// Apply render configuration
			this.applyRenderConfigOverrides(blackHole.config, DEFAULT_CONFIG);

			// Enhance meshes with merger effects
			await this.enhanceMeshForRendering(blackHole.mesh, blackHole.config, blackHole.blackHoleType, DEFAULT_CONFIG);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(blackHole.mesh, blackHole.blackHoleType, performance.now());

			results.push({
				mesh: blackHole.mesh,
				config: blackHole.config,
				blackHoleType: blackHole.blackHoleType,
				statistics: blackHole.statistics,
				physics: blackHole.physics,
				observables: blackHole.observables,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Render primordial black hole population
	 */
	public async renderPrimordialPopulation(massFunction: "monochromatic" | "power-law" | "lognormal", count: number = 50): Promise<BlackHoleRenderResult[]> {
		const population = this.generator.generatePrimordialPopulation(massFunction, count);

		const results: BlackHoleRenderResult[] = [];
		for (const pbh of population) {
			// Apply minimal rendering for performance
			const pbhConfig = {
				...DEFAULT_CONFIG,
				detailLevel: 1,
				effectDensity: 0.3,
				enableHawkingRadiation: true,
			};

			this.applyRenderConfigOverrides(pbh.config, pbhConfig);

			// Enhance meshes
			await this.enhanceMeshForRendering(pbh.mesh, pbh.config, pbh.blackHoleType, pbhConfig);

			// Calculate metadata
			const metadata = this.calculateRenderMetadata(pbh.mesh, pbh.blackHoleType, performance.now());

			results.push({
				mesh: pbh.mesh,
				config: pbh.config,
				blackHoleType: pbh.blackHoleType,
				statistics: pbh.statistics,
				physics: pbh.physics,
				observables: pbh.observables,
				metadata,
			});
		}

		return results;
	}

	/**
	 * Get all available black hole types
	 */
	public getAvailableBlackHoleTypes(): BlackHoleClass[] {
		return Array.from(BLACKHOLE_TYPES.keys());
	}

	/**
	 * Get black hole type information
	 */
	public getBlackHoleTypeInfo(blackHoleClass: BlackHoleClass): BlackHoleTypeDefinition | undefined {
		return getBlackHoleTypeByClass(blackHoleClass);
	}

	/**
	 * Update rendering quality based on performance
	 */
	public updateQuality(qualityLevel: number): void {
		// Quality level 0-5, where 5 is highest quality
		const quality = Math.max(0, Math.min(5, qualityLevel));

		// Update default configuration based on quality
		DEFAULT_CONFIG.detailLevel = Math.max(1, Math.floor(quality + 1));
		DEFAULT_CONFIG.effectDensity = 0.3 + quality * 0.08;
		DEFAULT_CONFIG.maxParticles = 5000 + quality * 9000;
		DEFAULT_CONFIG.maxEffects = 20 + quality * 16;
		DEFAULT_CONFIG.enableQuantumEffects = quality >= 3;
		DEFAULT_CONFIG.enableVolumetricEffects = quality >= 4;
		DEFAULT_CONFIG.enableAdvancedLighting = quality >= 2;
		DEFAULT_CONFIG.enableRelativisticEffects = quality >= 3;
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

		// Dispose shader materials
		for (const material of this.shaderMaterials.values()) {
			material.dispose();
		}
		this.shaderMaterials.clear();

		this.isDisposed = true;
	}

	// Private Methods

	private initializeShaders(): void {
		// Event horizon shader
		this.shaderMaterials.set("event_horizon", this.createEventHorizonShader());

		// Accretion disk shader
		this.shaderMaterials.set("accretion_disk", this.createAccretionDiskShader());

		// Gravitational lensing shader
		this.shaderMaterials.set("lensing", this.createLensingShader());

		// Hawking radiation shader
		this.shaderMaterials.set("hawking_radiation", this.createHawkingRadiationShader());
	}

	private createEventHorizonShader(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				spin: { value: 0.5 },
				mass: { value: 10 },
			},
			vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                uniform float time;
                uniform float spin;
                uniform float mass;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    // Event horizon effect
                    float distortion = sin(time * 2.0 + length(vPosition) * 10.0) * 0.1;
                    float opacity = 0.9 + distortion * spin;
                    
                    gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);
                }
            `,
			transparent: true,
			side: THREE.BackSide,
		});
	}

	private createAccretionDiskShader(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				innerRadius: { value: 1 },
				outerRadius: { value: 10 },
				temperature: { value: 1e7 },
			},
			vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                uniform float time;
                uniform float innerRadius;
                uniform float outerRadius;
                uniform float temperature;
                
                varying vec2 vUv;
                varying vec3 vPosition;
                
                vec3 blackbody(float temp) {
                    // Simplified blackbody spectrum
                    float t = temp / 10000.0;
                    return vec3(
                        min(1.0, t * 1.5),
                        min(1.0, t),
                        min(1.0, t * 0.5)
                    );
                }
                
                void main() {
                    float radius = length(vPosition.xz);
                    float normalizedRadius = (radius - innerRadius) / (outerRadius - innerRadius);
                    
                    // Temperature decreases with radius
                    float localTemp = temperature * pow(innerRadius / radius, 0.75);
                    
                    // Spiral structure
                    float angle = atan(vPosition.z, vPosition.x);
                    float spiral = sin(angle * 2.0 + log(radius) * 3.0 - time * 2.0) * 0.5 + 0.5;
                    
                    vec3 color = blackbody(localTemp) * (0.8 + spiral * 0.4);
                    float alpha = 1.0 - normalizedRadius;
                    
                    gl_FragColor = vec4(color, alpha * 0.8);
                }
            `,
			transparent: true,
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
		});
	}

	private createLensingShader(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				mass: { value: 10 },
			},
			vertexShader: `
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                uniform float time;
                uniform float mass;
                
                varying vec3 vPosition;
                
                void main() {
                    float radius = length(vPosition);
                    float lensing = 1.0 / (1.0 + radius * radius / (mass * mass));
                    
                    vec3 color = vec3(0.5, 0.8, 1.0) * lensing;
                    float alpha = lensing * 0.3;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
			transparent: true,
			blending: THREE.AdditiveBlending,
		});
	}

	private createHawkingRadiationShader(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				temperature: { value: 1e12 },
			},
			vertexShader: `
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                uniform float time;
                uniform float temperature;
                
                varying vec3 vPosition;
                
                void main() {
                    // High-energy radiation visualization
                    float energy = temperature / 1e12;
                    vec3 color = vec3(energy, energy * 0.7, 1.0);
                    
                    float flicker = sin(time * 10.0 + length(vPosition) * 50.0) * 0.5 + 0.5;
                    color *= flicker;
                    
                    gl_FragColor = vec4(color, 0.8);
                }
            `,
			transparent: true,
			blending: THREE.AdditiveBlending,
		});
	}

	private generateCacheKey(config: BlackHoleRenderConfig): string {
		const keyParts = [config.blackHoleClass || "random", config.seed || 0, config.mass || 1, config.spin || 0.7, config.detailLevel || 3, config.effectDensity || 0.7];

		return keyParts.join("|");
	}

	private createCachedResult(mesh: THREE.Group, config: BlackHoleRenderConfig, startTime: number): BlackHoleRenderResult {
		const clonedMesh = mesh.clone();

		// Create minimal metadata for cached result
		const metadata: BlackHoleRenderMetadata = {
			renderTime: performance.now() - startTime,
			particleCount: this.calculateParticleCount(clonedMesh),
			effectCount: clonedMesh.children.length,
			lightCount: 1,
			memoryUsage: 0,
			qualityLevel: "cached",
			physicsFidelity: "standard",
			astrophysicalFeatures: [],
			theoreticalBasis: [],
		};

		return {
			mesh: clonedMesh,
			config: {} as EnhancedBlackHoleConfig,
			blackHoleType: {} as BlackHoleTypeDefinition,
			statistics: {},
			physics: {},
			observables: {},
			metadata,
		};
	}

	private applyRenderConfigOverrides(blackHoleConfig: EnhancedBlackHoleConfig, renderConfig: BlackHoleRenderConfig): void {
		if (renderConfig.mass !== undefined) {
			blackHoleConfig.mass = Math.pow(10, renderConfig.mass);
		}

		if (renderConfig.spin !== undefined) {
			blackHoleConfig.spin = renderConfig.spin;
		}

		if (renderConfig.charge !== undefined) {
			blackHoleConfig.charge = renderConfig.charge;
		}

		if (renderConfig.binarySystem !== undefined) {
			blackHoleConfig.isBinary = renderConfig.binarySystem;
		}

		// Override visual features based on render config
		if (renderConfig.enableEventHorizon !== undefined) {
			blackHoleConfig.visualFeatures.eventHorizon = renderConfig.enableEventHorizon;
		}

		if (renderConfig.enableErgosphere !== undefined) {
			blackHoleConfig.visualFeatures.ergosphere = renderConfig.enableErgosphere;
		}

		if (renderConfig.enableAccretionDisk !== undefined) {
			blackHoleConfig.visualFeatures.accretionDisk = renderConfig.enableAccretionDisk;
		}

		if (renderConfig.enableJets !== undefined) {
			blackHoleConfig.visualFeatures.jetStructure = renderConfig.enableJets;
		}

		if (renderConfig.enableGravitationalLensing !== undefined) {
			blackHoleConfig.visualFeatures.gravitationalLensing = renderConfig.enableGravitationalLensing;
		}

		if (renderConfig.enableGravitationalWaves !== undefined) {
			blackHoleConfig.visualFeatures.gravitationalWaves = renderConfig.enableGravitationalWaves;
		}
	}

	private async enhanceMeshForRendering(mesh: THREE.Group, config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition, renderConfig: BlackHoleRenderConfig): Promise<void> {
		// Apply LOD if enabled
		if (renderConfig.enableLOD) {
			this.applyLOD(mesh, renderConfig.renderDistance || 1000);
		}

		// Limit particles if necessary
		if (renderConfig.maxParticles && this.calculateParticleCount(mesh) > renderConfig.maxParticles) {
			this.limitParticles(mesh, renderConfig.maxParticles);
		}

		// Apply advanced shaders
		this.applyAdvancedShaders(mesh, config, blackHoleType);

		// Add performance optimizations
		this.optimizeMeshForPerformance(mesh, blackHoleType);
	}

	private applyLOD(mesh: THREE.Group, renderDistance: number): void {
		mesh.children.forEach((child) => {
			if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
				// Create LOD versions for black hole components
				const lod = new THREE.LOD();

				// High detail (close)
				lod.addLevel(child, 0);

				// Medium detail
				const mediumMesh = this.createSimplifiedVersion(child, 0.7);
				if (mediumMesh) {
					lod.addLevel(mediumMesh, renderDistance * 0.3);
				}

				// Low detail (far)
				const lowMesh = this.createSimplifiedVersion(child, 0.4);
				if (lowMesh) {
					lod.addLevel(lowMesh, renderDistance * 0.7);
				}

				// Replace original with LOD
				const parent = child.parent;
				if (parent) {
					parent.remove(child);
					parent.add(lod);
				}
			}
		});
	}

	private createSimplifiedVersion(object: THREE.Object3D, factor: number): THREE.Object3D | null {
		if (object instanceof THREE.Points) {
			const originalGeometry = object.geometry as THREE.BufferGeometry;
			const positions = originalGeometry.attributes.position?.array;
			if (!positions) return null;

			const newCount = Math.floor((positions.length / 3) * factor);
			const newPositions = new Float32Array(newCount * 3);

			for (let i = 0; i < newCount; i++) {
				const sourceIndex = Math.floor(i / factor) * 3;
				newPositions[i * 3] = positions[sourceIndex] || 0;
				newPositions[i * 3 + 1] = positions[sourceIndex + 1] || 0;
				newPositions[i * 3 + 2] = positions[sourceIndex + 2] || 0;
			}

			const newGeometry = new THREE.BufferGeometry();
			newGeometry.setAttribute("position", new THREE.BufferAttribute(newPositions, 3));

			return new THREE.Points(newGeometry, object.material);
		}

		return object.clone();
	}

	private limitParticles(mesh: THREE.Group, maxParticles: number): void {
		let totalParticles = 0;
		const particleSystems: THREE.Points[] = [];

		mesh.traverse((child) => {
			if (child instanceof THREE.Points) {
				particleSystems.push(child);
				totalParticles += child.geometry.attributes.position?.count || 0;
			}
		});

		if (totalParticles > maxParticles) {
			const reductionFactor = maxParticles / totalParticles;
			particleSystems.forEach((system) => {
				this.reduceParticleSystem(system, reductionFactor);
			});
		}
	}

	private applyAdvancedShaders(mesh: THREE.Group, config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): void {
		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				switch (child.name) {
					case "event_horizon":
						const horizonShader = this.shaderMaterials.get("event_horizon")?.clone();
						if (horizonShader) {
							if (horizonShader.uniforms.spin) horizonShader.uniforms.spin.value = config.spin;
							if (horizonShader.uniforms.mass) horizonShader.uniforms.mass.value = config.mass;
							child.material = horizonShader;
						}
						break;

					case "accretion_disk":
						const diskShader = this.shaderMaterials.get("accretion_disk")?.clone();
						if (diskShader) {
							if (diskShader.uniforms.temperature) diskShader.uniforms.temperature.value = config.mass > 100 ? 1e6 : 1e7;
							child.material = diskShader;
						}
						break;
				}
			} else if (child instanceof THREE.Points && child.name === "hawking_radiation") {
				const hawkingShader = this.shaderMaterials.get("hawking_radiation")?.clone();
				if (hawkingShader) {
					if (hawkingShader.uniforms.temperature) hawkingShader.uniforms.temperature.value = 1.2e12 / config.mass;
					child.material = hawkingShader;
				}
			}
		});
	}

	private setupBlackHoleLighting(mesh: THREE.Group, config: EnhancedBlackHoleConfig, renderConfig: BlackHoleRenderConfig): void {
		// Accretion disk lighting
		if (config.visualFeatures.accretionDisk) {
			const diskLight = new THREE.PointLight(0xff6600, 2, config.mass * 10);
			diskLight.position.set(0, 0, 0);
			mesh.add(diskLight);
		}

		// Jet lighting
		if (config.visualFeatures.jetStructure) {
			this.addJetLighting(mesh, config);
		}

		// Hawking radiation glow for micro black holes
		if (config.mass < 1e-10 && config.visualFeatures.quantumFuzz) {
			const hawkingLight = new THREE.PointLight(0x9966ff, 0.5, config.mass * 1e15);
			hawkingLight.position.set(0, 0, 0);
			mesh.add(hawkingLight);
		}

		// Special lighting for exotic objects
		switch (config.blackHoleClass) {
			case BlackHoleClass.WHITE_HOLE:
				this.addWhiteHoleLighting(mesh, config);
				break;
			case BlackHoleClass.WORMHOLE:
				this.addWormholeLighting(mesh, config);
				break;
			// case BlackHoleClass.QUASAR: // QUASAR not defined in BlackHoleClass enum
			// 	this.addQuasarLighting(mesh, config);
			// 	break;
		}
	}

	private addJetLighting(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		const jetLength = config.mass * 10;

		for (let i = 0; i < 2; i++) {
			const jetLight = new THREE.SpotLight(0x00ffff, 1, jetLength, Math.PI / 16);
			jetLight.position.set(0, (i === 0 ? 1 : -1) * jetLength * 0.3, 0);
			jetLight.target.position.set(0, (i === 0 ? 1 : -1) * jetLength, 0);
			mesh.add(jetLight);
			mesh.add(jetLight.target);
		}
	}

	private addWhiteHoleLighting(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Bright emission from white hole
		const emissionLight = new THREE.PointLight(0xffffff, 5, config.mass * 50);
		emissionLight.position.set(0, 0, 0);
		mesh.add(emissionLight);

		// Directional emission streams
		for (let i = 0; i < 8; i++) {
			const angle = (i / 8) * Math.PI * 2;
			const streamLight = new THREE.SpotLight(0xffd700, 2, config.mass * 20, Math.PI / 8);
			streamLight.position.set(Math.cos(angle) * config.mass * 0.5, 0, Math.sin(angle) * config.mass * 0.5);
			mesh.add(streamLight);
		}
	}

	private addWormholeLighting(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Exotic matter glow
		const exoticLight = new THREE.PointLight(0x9966ff, 1, config.mass * 5);
		exoticLight.position.set(0, 0, 0);
		mesh.add(exoticLight);

		// Throat illumination
		const throatLight = new THREE.RingGeometry(config.mass * 0.3, config.mass * 0.7, 16);
		const throatMaterial = new THREE.MeshStandardMaterial({
			color: 0x00ffff,
			emissive: new THREE.Color(0x006666),
			transparent: true,
			opacity: 0.5,
		});

		const throatGlow = new THREE.Mesh(throatLight, throatMaterial);
		mesh.add(throatGlow);
	}

	private addQuasarLighting(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Extremely bright central emission
		const quasarLight = new THREE.PointLight(0xffffff, 10, config.mass * 100);
		quasarLight.position.set(0, 0, 0);
		mesh.add(quasarLight);

		// Broad-line region glow
		const blrLight = new THREE.PointLight(0x4169e1, 3, config.mass * 30);
		blrLight.position.set(0, 0, 0);
		mesh.add(blrLight);
	}

	private addRelativisticEffects(mesh: THREE.Group, config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): void {
		// Frame dragging visualization for Kerr black holes
		if (config.spin > 0.1) {
			this.addFrameDraggingEffect(mesh, config);
		}

		// Time dilation effects
		if (config.mass > 1e6) {
			this.addTimeDilationEffect(mesh, config);
		}

		// Gravitational redshift gradient
		this.addRedshiftGradient(mesh, config);
	}

	private addFrameDraggingEffect(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Rotating spacetime visualization
		const dragGeometry = new THREE.TorusGeometry(config.mass * 2, config.mass * 0.1, 8, 32);
		const dragMaterial = new THREE.MeshBasicMaterial({
			color: 0x00ffff,
			transparent: true,
			opacity: 0.3,
			wireframe: true,
		});

		const frameDrag = new THREE.Mesh(dragGeometry, dragMaterial);
		frameDrag.name = "frame_dragging";
		mesh.add(frameDrag);
	}

	private addTimeDilationEffect(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Time dilation field visualization
		const dilationGeometry = new THREE.SphereGeometry(config.mass * 5, 16, 16);
		const dilationMaterial = new THREE.MeshBasicMaterial({
			color: 0xff6600,
			transparent: true,
			opacity: 0.1,
			side: THREE.BackSide,
		});

		const timeDilation = new THREE.Mesh(dilationGeometry, dilationMaterial);
		timeDilation.name = "time_dilation";
		mesh.add(timeDilation);
	}

	private addRedshiftGradient(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Gravitational redshift visualization around photon sphere
		const photonSphereRadius = 1.5 * config.mass * 3; // Schwarzschild radii
		const redshiftGeometry = new THREE.RingGeometry(photonSphereRadius * 0.9, photonSphereRadius * 1.1, 32);
		const redshiftMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			transparent: true,
			opacity: 0.2,
			side: THREE.DoubleSide,
		});

		const redshift = new THREE.Mesh(redshiftGeometry, redshiftMaterial);
		redshift.name = "redshift_gradient";
		mesh.add(redshift);
	}

	private addQuantumEffects(mesh: THREE.Group, config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): void {
		// Quantum fluctuations near the horizon
		if (config.mass < 1e-15) {
			this.addQuantumFluctuations(mesh, config);
		}

		// Virtual particle pairs
		this.addVirtualParticles(mesh, config);

		// Information scrambling
		if (blackHoleType.class === BlackHoleClass.FUZZBALL) {
			this.addInformationScrambling(mesh, config);
		}
	}

	private addQuantumFluctuations(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		const fluctuationCount = 500;
		const fluctuationGeometry = new THREE.BufferGeometry();
		const positions = new Float32Array(fluctuationCount * 3);
		const colors = new Float32Array(fluctuationCount * 3);

		for (let i = 0; i < fluctuationCount; i++) {
			const radius = config.mass * 1.1; // Just outside horizon
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.random() * Math.PI;

			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = radius * Math.cos(phi);
			positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

			// Quantum energy colors
			colors[i * 3] = Math.random();
			colors[i * 3 + 1] = Math.random();
			colors[i * 3 + 2] = 1.0;
		}

		fluctuationGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		fluctuationGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const fluctuationMaterial = new THREE.PointsMaterial({
			size: 0.01,
			vertexColors: true,
			transparent: true,
			opacity: 0.6,
			blending: THREE.AdditiveBlending,
		});

		const fluctuations = new THREE.Points(fluctuationGeometry, fluctuationMaterial);
		fluctuations.name = "quantum_fluctuations";
		mesh.add(fluctuations);
	}

	private addVirtualParticles(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Virtual particle-antiparticle pairs
		const pairCount = 100;

		for (let i = 0; i < pairCount; i++) {
			const radius = config.mass * (1.01 + Math.random() * 0.5);
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.random() * Math.PI;

			// Particle
			const particleGeometry = new THREE.SphereGeometry(0.01, 4, 4);
			const particleMaterial = new THREE.MeshStandardMaterial({
				color: 0x00ff00,
				emissive: new THREE.Color(0x004400),
			});
			const particle = new THREE.Mesh(particleGeometry, particleMaterial);

			// Antiparticle
			const antiparticleGeometry = new THREE.SphereGeometry(0.01, 4, 4);
			const antiparticleMaterial = new THREE.MeshStandardMaterial({
				color: 0xff0000,
				emissive: new THREE.Color(0x440000),
			});
			const antiparticle = new THREE.Mesh(antiparticleGeometry, antiparticleMaterial);

			// Position near horizon
			const basePosition = new THREE.Vector3(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));

			particle.position.copy(basePosition).add(new THREE.Vector3(0.02, 0, 0));
			antiparticle.position.copy(basePosition).add(new THREE.Vector3(-0.02, 0, 0));

			mesh.add(particle);
			mesh.add(antiparticle);
		}
	}

	private addInformationScrambling(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Information scrambling visualization for fuzzballs
		const scramblingGeometry = new THREE.IcosahedronGeometry(config.mass * 1.2, 2);
		const scramblingMaterial = new THREE.MeshBasicMaterial({
			color: 0xff00ff,
			transparent: true,
			opacity: 0.4,
			wireframe: true,
		});

		const scrambling = new THREE.Mesh(scramblingGeometry, scramblingMaterial);
		scrambling.name = "information_scrambling";
		mesh.add(scrambling);
	}

	private addBinarySystemEffects(mesh: THREE.Group, config: EnhancedBlackHoleConfig, renderConfig: BlackHoleRenderConfig): void {
		if (!config.isBinary) return;

		// Gravitational wave ripples
		this.addGravitationalWaveRipples(mesh, config);

		// Tidal deformation
		this.addTidalDeformation(mesh, config);

		// Common envelope if close
		if (config.orbitalSeparation < config.mass * 10) {
			this.addCommonEnvelope(mesh, config);
		}
	}

	private addGravitationalWaveRipples(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		const rippleCount = 8;

		for (let i = 0; i < rippleCount; i++) {
			const rippleRadius = config.orbitalSeparation * (1 + i * 0.3);
			const rippleGeometry = new THREE.RingGeometry(rippleRadius * 0.98, rippleRadius * 1.02, 32);

			const rippleMaterial = new THREE.MeshBasicMaterial({
				color: 0x00ffff,
				transparent: true,
				opacity: 0.1 / (i + 1),
				side: THREE.DoubleSide,
			});

			const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
			ripple.name = `gw_ripple_${i}`;
			ripple.rotation.x = Math.PI / 2;
			mesh.add(ripple);
		}
	}

	private addTidalDeformation(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Tidal bulges on event horizons
		const horizonMesh = mesh.getObjectByName("event_horizon") as THREE.Mesh;
		if (horizonMesh && horizonMesh.geometry instanceof THREE.SphereGeometry) {
			// Slightly deform the horizon geometry
			const positions = horizonMesh.geometry.attributes.position.array;

			for (let i = 0; i < positions.length; i += 3) {
				const x = positions[i];
				const y = positions[i + 1];
				const z = positions[i + 2];

				// Tidal deformation towards companion
				const deformation = 1 + 0.1 * (x / Math.sqrt(x * x + y * y + z * z));
				positions[i] *= deformation;
				positions[i + 1] *= deformation;
				positions[i + 2] *= deformation;
			}

			horizonMesh.geometry.attributes.position.needsUpdate = true;
			horizonMesh.geometry.computeVertexNormals();
		}
	}

	private addCommonEnvelope(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Common envelope around close binary
		const envelopeGeometry = new THREE.SphereGeometry(config.orbitalSeparation * 0.8, 32, 32);
		const envelopeMaterial = new THREE.MeshBasicMaterial({
			color: 0xff6600,
			transparent: true,
			opacity: 0.2,
			side: THREE.BackSide,
		});

		const envelope = new THREE.Mesh(envelopeGeometry, envelopeMaterial);
		envelope.name = "common_envelope";
		mesh.add(envelope);
	}

	private optimizeMeshForPerformance(mesh: THREE.Group, blackHoleType: BlackHoleTypeDefinition): void {
		mesh.traverse((child) => {
			if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
				// Enable frustum culling
				child.frustumCulled = true;

				// Optimize geometry
				if (child.geometry instanceof THREE.BufferGeometry) {
					child.geometry.computeBoundingSphere();
					child.geometry.computeBoundingBox();
				}

				// Optimize materials
				if (child.material instanceof THREE.Material) {
					child.material.precision = "mediump";
				}
			}
		});
	}

	private renderFallbackBlackHole(config: BlackHoleRenderConfig, startTime: number): BlackHoleRenderResult {
		// Create a simple fallback black hole
		const geometry = new THREE.SphereGeometry(1, 16, 16);
		const material = new THREE.MeshBasicMaterial({
			color: 0x000000,
			transparent: true,
			opacity: 0.9,
		});
		const mesh = new THREE.Mesh(geometry, material);

		const group = new THREE.Group();
		group.add(mesh);

		const metadata: BlackHoleRenderMetadata = {
			renderTime: performance.now() - startTime,
			particleCount: 0,
			effectCount: 1,
			lightCount: 0,
			memoryUsage: 0,
			qualityLevel: "fallback",
			physicsFidelity: "minimal",
			astrophysicalFeatures: [],
			theoreticalBasis: [],
		};

		return {
			mesh: group,
			config: {} as EnhancedBlackHoleConfig,
			blackHoleType: {} as BlackHoleTypeDefinition,
			statistics: {},
			physics: {},
			observables: {},
			metadata,
		};
	}

	private calculateRenderMetadata(mesh: THREE.Group, blackHoleType: BlackHoleTypeDefinition, startTime: number): BlackHoleRenderMetadata {
		let particleCount = 0;
		let effectCount = 0;
		let lightCount = 0;
		let memoryUsage = 0;

		mesh.traverse((child) => {
			if (child instanceof THREE.Points) {
				const positions = child.geometry.attributes.position;
				if (positions) {
					particleCount += positions.count;
				}
				memoryUsage += 4096; // Rough estimate
			} else if (child instanceof THREE.Mesh) {
				effectCount++;
				memoryUsage += 2048; // Rough estimate
			} else if (child instanceof THREE.Light) {
				lightCount++;
			}
		});

		return {
			renderTime: performance.now() - startTime,
			particleCount,
			effectCount,
			lightCount,
			memoryUsage,
			qualityLevel: this.determineQualityLevel(particleCount, effectCount),
			physicsFidelity: this.determinePhysicsFidelity(blackHoleType),
			astrophysicalFeatures: blackHoleType.astrophysicalProcesses || [],
			theoreticalBasis: blackHoleType.theoreticalBasis || [],
		};
	}

	private determineQualityLevel(particleCount: number, effectCount: number): string {
		if (particleCount > 20000 || effectCount > 50) return "ultra";
		if (particleCount > 10000 || effectCount > 30) return "high";
		if (particleCount > 5000 || effectCount > 20) return "medium";
		if (particleCount > 1000 || effectCount > 10) return "low";
		return "minimal";
	}

	private determinePhysicsFidelity(blackHoleType: BlackHoleTypeDefinition): string {
		if (blackHoleType.observationalStatus === "confirmed") return "observational";
		if (blackHoleType.observationalStatus === "probable") return "theoretical";
		if (blackHoleType.observationalStatus === "theoretical") return "speculative";
		return "exotic";
	}

	private calculateParticleCount(mesh: THREE.Group): number {
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
	 * Preload common black hole types
	 */
	public async preloadCommonTypes(): Promise<void> {
		const commonTypes = [BlackHoleClass.STELLAR_MASS, BlackHoleClass.SUPERMASSIVE, BlackHoleClass.KERR, BlackHoleClass.BINARY_STELLAR];

		const promises = commonTypes.map((type) =>
			this.renderBlackHole({
				blackHoleClass: type,
				detailLevel: 1,
				effectDensity: 0.3,
			})
		);

		await Promise.all(promises);
	}

	/**
	 * Update shader uniforms (for animation)
	 */
	public updateShaderUniforms(time: number): void {
		for (const material of this.shaderMaterials.values()) {
			if (material.uniforms.time) {
				material.uniforms.time.value = time;
			}
		}
	}
}
