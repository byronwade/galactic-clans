/**
 * @file enhanced-galaxy-generator.ts
 * @description Advanced galaxy generator utilizing the comprehensive galaxy classification system
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Generates scientifically accurate, visually diverse galaxies using the complete
 * galaxy type classification system with low-poly aesthetics and realistic physics.
 */

import * as THREE from "three";
import { GalaxyClass, GalaxyTypeDefinition, GalaxyEvolutionStage, StellarPopulation, GalaxyPhysics, GalaxyMorphology, GalaxyVisualFeatures, getGalaxyTypeByClass, getRandomGalaxyType, calculateGalaxyLuminosity, calculateGalaxySize, classifyGalaxyByMass, getGalaxyEvolutionPath, generateGalaxyResources, calculateGalaxyInteractionStrength, predictGalaxyMergerOutcome, GALAXY_TYPES } from "./galaxy-types";

// Enhanced Galaxy Configuration
export interface EnhancedGalaxyConfig {
	// Core Properties
	galaxyClass: GalaxyClass;
	seed: number;
	stellarMass: number; // Solar masses
	totalMass: number; // Including dark matter
	effectiveRadius: number; // kpc

	// Morphological Properties
	hubbleType: string;
	morphology: GalaxyMorphology;
	ellipticity: number;
	armCount: number;
	barStrength: number;

	// Physical Properties
	starFormationRate: number; // Solar masses per year
	metallicity: number; // [Fe/H]
	age: number; // Gyr
	redshift: number;

	// Stellar Population
	dominantPopulation: StellarPopulation;
	populationFractions: Map<StellarPopulation, number>;

	// Environmental Properties
	environmentalDensity: number;
	clusterMember: boolean;
	interactionPartners: GalaxyClass[];

	// Active Galactic Nucleus
	hasActiveNucleus: boolean;
	blackHoleMass: number; // Solar masses
	eddingtonRatio: number;
	jetPower: number; // erg/s

	// Visual Properties
	visualFeatures: GalaxyVisualFeatures;

	// Generation Parameters
	starCount: number;
	gasCloudCount: number;
	effectDensity: number;
	renderDistance: number;

	// Special Properties
	uniqueFeatures: string[];
	astrophysicalProcesses: string[];
	explorationDifficulty: number;
	scientificValue: number;
}

// Galaxy Generation Result
export interface EnhancedGalaxyResult {
	mesh: THREE.Group;
	config: EnhancedGalaxyConfig;
	galaxyType: GalaxyTypeDefinition;
	statistics: GalaxyStatistics;
	physics: GalaxyPhysics;
}

// Detailed Galaxy Statistics
export interface GalaxyStatistics {
	// Physical Data
	stellarMassInSolarMasses: number;
	totalMassInSolarMasses: number;
	darkMatterFraction: number;
	effectiveRadiusInKpc: number;
	scaleHeightInKpc: number;

	// Kinematic Data
	rotationVelocity: number; // km/s
	velocityDispersion: number; // km/s
	dynamicalMass: number; // Solar masses
	angularMomentum: number;

	// Star Formation Data
	starFormationRateInSolarMassesPerYear: number;
	starFormationEfficiency: number;
	gasDepletion: number; // Gyr
	specificStarFormationRate: number; // per Gyr

	// Stellar Population Data
	averageAge: number; // Gyr
	averageMetallicity: number; // [Fe/H]
	colorIndex: number; // B-V
	massToLightRatio: number;

	// Structure Data
	concentrationIndex: number;
	asymmetryIndex: number;
	smoothnessIndex: number;
	giniCoefficient: number;

	// Environmental Data
	localDensity: number; // galaxies per Mpc³
	nearestNeighborDistance: number; // Mpc
	clusterVelocityDispersion: number; // km/s

	// Observational Data
	apparentMagnitude: number;
	absoluteMagnitude: number;
	surfaceBrightness: number; // mag/arcsec²
	angularSize: number; // arcmin

	// Multi-wavelength Data
	bvColor: number;
	uvLuminosity: number; // erg/s
	infraredLuminosity: number; // erg/s
	xrayLuminosity: number; // erg/s
	radioLuminosity: number; // erg/s

	// Generation Data
	vertices: number;
	particles: number;
	effects: number;
	generationTime: number; // ms
}

export class EnhancedGalaxyGenerator {
	private seed: number;
	private random: () => number;

	constructor(seed: number = Date.now()) {
		this.seed = seed;
		this.random = this.seededRandom(seed);
	}

	// Seeded random number generator
	private seededRandom(seed: number): () => number {
		let s = seed % 2147483647;
		if (s <= 0) s += 2147483646;

		return function () {
			s = (s * 16807) % 2147483647;
			return (s - 1) / 2147483646;
		};
	}

	// Generate a complete galaxy with specified type
	public generateGalaxy(galaxyClass?: GalaxyClass, redshift?: number): EnhancedGalaxyResult {
		const startTime = performance.now();

		// Get galaxy type definition
		const galaxyType = galaxyClass ? getGalaxyTypeByClass(galaxyClass) : getRandomGalaxyType();
		if (!galaxyType) {
			throw new Error(`Invalid galaxy class: ${galaxyClass}`);
		}

		// Generate galaxy configuration
		const config = this.generateGalaxyConfig(galaxyType, redshift);

		// Create 3D mesh based on galaxy type
		const mesh = this.createGalaxyMesh(config, galaxyType);

		// Calculate physics
		const physics = this.calculateGalaxyPhysics(config, galaxyType);

		// Calculate statistics
		const statistics = this.calculateStatistics(config, galaxyType, physics, performance.now() - startTime);

		return {
			mesh,
			config,
			galaxyType,
			statistics,
			physics,
		};
	}

	// Generate galaxy cluster
	public generateGalaxyCluster(centerGalaxyClass?: GalaxyClass, memberCount: number = 50): EnhancedGalaxyResult[] {
		const cluster: EnhancedGalaxyResult[] = [];

		// Generate central galaxy (usually massive elliptical)
		const centralClass = centerGalaxyClass || GalaxyClass.ELLIPTICAL_E4;
		const centralGalaxy = this.generateGalaxy(centralClass, 0.05);
		cluster.push(centralGalaxy);

		// Generate cluster members
		for (let i = 1; i < memberCount; i++) {
			const distance = this.randomInRange(0.1, 5.0); // Mpc from center
			const redshift = 0.05 + distance * 0.01; // Approximate redshift

			// Choose galaxy type based on cluster environment
			const memberClass = this.selectClusterMemberType(distance);
			const member = this.generateGalaxy(memberClass, redshift);

			// Position around central galaxy
			const angle = this.random() * Math.PI * 2;
			const height = (this.random() - 0.5) * distance * 0.3;

			member.mesh.position.set(
				distance * Math.cos(angle) * 100, // Scale for visualization
				height * 100,
				distance * Math.sin(angle) * 100
			);

			cluster.push(member);
		}

		return cluster;
	}

	// Generate interacting galaxy pair
	public generateInteractingPair(primaryClass?: GalaxyClass, secondaryClass?: GalaxyClass): EnhancedGalaxyResult[] {
		const primary = this.generateGalaxy(primaryClass);
		const secondary = this.generateGalaxy(secondaryClass);

		// Set up interaction
		const separation = this.randomInRange(20, 100); // kpc
		const interactionStrength = calculateGalaxyInteractionStrength(primary.galaxyType, secondary.galaxyType, separation);

		// Position galaxies
		secondary.mesh.position.set(separation, 0, 0);

		// Add tidal features if interaction is strong
		if (interactionStrength > 0.1) {
			this.addTidalFeatures(primary.mesh, secondary.mesh, interactionStrength);
		}

		// Update configurations for interaction
		primary.config.interactionPartners = [secondary.config.galaxyClass];
		secondary.config.interactionPartners = [primary.config.galaxyClass];

		return [primary, secondary];
	}

	// Generate galaxy merger sequence
	public generateMergerSequence(primaryClass: GalaxyClass, secondaryClass: GalaxyClass): EnhancedGalaxyResult[] {
		const sequence: EnhancedGalaxyResult[] = [];

		// Pre-merger phase
		const preMerger = this.generateInteractingPair(primaryClass, secondaryClass);
		sequence.push(...preMerger);

		// Merger remnant
		const remnantClass = predictGalaxyMergerOutcome(preMerger[0].galaxyType, preMerger[1].galaxyType);
		const remnant = this.generateGalaxy(remnantClass);

		// Position remnant at interaction center
		const midpoint = new THREE.Vector3().addVectors(preMerger[0].mesh.position, preMerger[1].mesh.position).multiplyScalar(0.5);
		remnant.mesh.position.copy(midpoint);

		// Add merger signatures
		this.addMergerSignatures(remnant.mesh, remnant.config);

		sequence.push(remnant);

		return sequence;
	}

	// Generate galaxy evolution sequence
	public generateEvolutionSequence(initialMass: number, environment: string = "field"): EnhancedGalaxyResult[] {
		const evolutionPath = getGalaxyEvolutionPath(initialMass, environment);
		const sequence: EnhancedGalaxyResult[] = [];

		let currentRedshift = 6.0; // Start at high redshift

		for (const stage of evolutionPath) {
			const galaxyClass = this.selectGalaxyClassForStage(stage, initialMass, environment);
			const galaxy = this.generateGalaxy(galaxyClass, currentRedshift);

			// Modify properties based on evolution stage
			this.applyEvolutionStage(galaxy.config, stage, currentRedshift);

			sequence.push(galaxy);

			// Advance time
			currentRedshift = Math.max(0, currentRedshift - 1.0);
		}

		return sequence;
	}

	// Get all available galaxy types
	public getAvailableGalaxyTypes(): GalaxyClass[] {
		return Array.from(GALAXY_TYPES.keys());
	}

	// Generate galaxy configuration from type definition
	private generateGalaxyConfig(galaxyType: GalaxyTypeDefinition, redshift?: number): EnhancedGalaxyConfig {
		// Physical properties
		const stellarMass = Math.pow(10, this.randomInRange(galaxyType.massRange[0], galaxyType.massRange[1]));
		const effectiveRadius = this.randomInRange(galaxyType.sizeRange[0], galaxyType.sizeRange[1]);
		const starFormationRate = this.randomInRange(galaxyType.starFormationRange[0], galaxyType.starFormationRange[1]);
		const metallicity = this.randomInRange(galaxyType.metallicityRange[0], galaxyType.metallicityRange[1]);
		const age = this.randomInRange(galaxyType.ageRange[0], galaxyType.ageRange[1]);

		// Calculate total mass including dark matter
		const totalMass = stellarMass / (1 - galaxyType.galaxyPhysics.darkMatterFraction);

		// Morphological properties
		const morphology = this.generateMorphology(galaxyType);
		const ellipticity = morphology.ellipticity;
		const armCount = morphology.armCount;
		const barStrength = morphology.barStrength;

		// Active galactic nucleus properties
		const hasActiveNucleus = morphology.hasActiveNucleus;
		const blackHoleMass = this.generateBlackHoleMass(stellarMass, galaxyType);
		const eddingtonRatio = hasActiveNucleus ? this.randomInRange(0.01, 1.0) : 0.001;
		const jetPower = hasActiveNucleus ? morphology.jetPower : 0;

		// Environmental properties
		const environmentalDensity = galaxyType.galaxyPhysics.environmentalDensity;
		const clusterMember = galaxyType.galaxyPhysics.clusterMembership;

		// Visual features
		const visualFeatures = this.generateVisualFeatures(galaxyType, morphology);

		// Generation parameters
		const starCount = this.calculateStarCount(stellarMass, galaxyType);
		const gasCloudCount = this.calculateGasCloudCount(starFormationRate, galaxyType);

		return {
			galaxyClass: galaxyType.class,
			seed: this.seed,
			stellarMass,
			totalMass,
			effectiveRadius,
			hubbleType: galaxyType.hubbleType,
			morphology,
			ellipticity,
			armCount,
			barStrength,
			starFormationRate,
			metallicity,
			age,
			redshift: redshift !== undefined ? redshift : this.calculateRedshift(age),
			dominantPopulation: galaxyType.dominantPopulation,
			populationFractions: galaxyType.populationMix,
			environmentalDensity,
			clusterMember,
			interactionPartners: [],
			hasActiveNucleus,
			blackHoleMass,
			eddingtonRatio,
			jetPower,
			visualFeatures,
			starCount,
			gasCloudCount,
			effectDensity: galaxyType.effectDensity,
			renderDistance: 1000,
			uniqueFeatures: galaxyType.uniqueFeatures,
			astrophysicalProcesses: galaxyType.astrophysicalProcesses,
			explorationDifficulty: galaxyType.explorationDifficulty,
			scientificValue: galaxyType.scientificValue,
		};
	}

	// Create 3D mesh based on galaxy configuration
	private createGalaxyMesh(config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): THREE.Group {
		const galaxyGroup = new THREE.Group();

		// Create base galaxy structure
		const baseMesh = this.createBaseGalaxy(config, galaxyType);
		galaxyGroup.add(baseMesh);

		// Add morphological features based on type
		this.addMorphologicalFeatures(galaxyGroup, config, galaxyType);

		// Add stellar populations
		if (config.visualFeatures.starFormingRegions) {
			this.addStarFormingRegions(galaxyGroup, config, galaxyType);
		}

		// Add dust lanes
		if (config.visualFeatures.dustLanes) {
			this.addDustLanes(galaxyGroup, config, galaxyType);
		}

		// Add active galactic nucleus
		if (config.hasActiveNucleus) {
			this.addActiveGalacticNucleus(galaxyGroup, config, galaxyType);
		}

		// Add environmental features
		if (config.visualFeatures.satelliteGalaxies) {
			this.addSatelliteGalaxies(galaxyGroup, config, galaxyType);
		}

		// Add tidal features
		if (config.visualFeatures.tidalStreams) {
			this.addTidalStreams(galaxyGroup, config, galaxyType);
		}

		// Add special effects based on galaxy type
		this.addSpecialEffects(galaxyGroup, config, galaxyType);

		return galaxyGroup;
	}

	// Create base galaxy geometry
	private createBaseGalaxy(config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): THREE.Mesh {
		let geometry: THREE.BufferGeometry;
		let material: THREE.Material;

		// Create geometry based on galaxy type
		switch (galaxyType.class) {
			case GalaxyClass.SPIRAL_SB:
			case GalaxyClass.BARRED_SBB:
				// Spiral disk with exponential profile
				geometry = this.createSpiralDiskGeometry(config);
				material = this.createSpiralMaterial(config, galaxyType);
				break;

			case GalaxyClass.ELLIPTICAL_E4:
				// Elliptical with Sersic profile
				geometry = this.createEllipticalGeometry(config);
				material = this.createEllipticalMaterial(config, galaxyType);
				break;

			case GalaxyClass.IRREGULAR_I:
				// Irregular, clumpy structure
				geometry = this.createIrregularGeometry(config);
				material = this.createIrregularMaterial(config, galaxyType);
				break;

			case GalaxyClass.DWARF_ELLIPTICAL:
				// Small, smooth elliptical
				geometry = this.createDwarfGeometry(config);
				material = this.createDwarfMaterial(config, galaxyType);
				break;

			case GalaxyClass.STARBURST:
				// Compact, bright core
				geometry = this.createStarburstGeometry(config);
				material = this.createStarburstMaterial(config, galaxyType);
				break;

			case GalaxyClass.QUASAR:
				// Point-like core with broad-line region
				geometry = this.createQuasarGeometry(config);
				material = this.createQuasarMaterial(config, galaxyType);
				break;

			default:
				// Default spiral galaxy
				geometry = this.createSpiralDiskGeometry(config);
				material = this.createSpiralMaterial(config, galaxyType);
				break;
		}

		const mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = false; // Galaxies are light sources
		mesh.receiveShadow = false;

		return mesh;
	}

	// Create spiral disk geometry
	private createSpiralDiskGeometry(config: EnhancedGalaxyConfig): THREE.BufferGeometry {
		const geometry = new THREE.PlaneGeometry(config.effectiveRadius * 4, config.effectiveRadius * 4, 64, 64);

		// Apply exponential disk profile
		const vertices = geometry.attributes.position.array;
		const vertexCount = vertices.length / 3;

		for (let i = 0; i < vertexCount; i++) {
			const index = i * 3;
			const x = vertices[index];
			const y = vertices[index + 1];
			const radius = Math.sqrt(x * x + y * y);

			// Exponential disk profile
			const scaleRadius = config.effectiveRadius / 1.678; // Convert to scale length
			const surfaceDensity = Math.exp(-radius / scaleRadius);

			// Add spiral structure
			if (config.armCount > 0) {
				const angle = Math.atan2(y, x);
				const spiralAngle = this.calculateSpiralAngle(radius, config);
				const armStrength = this.calculateArmStrength(angle, spiralAngle, config);
				vertices[index + 2] = surfaceDensity * (1 + armStrength * 0.5) * 0.1;
			} else {
				vertices[index + 2] = surfaceDensity * 0.1;
			}
		}

		geometry.attributes.position.needsUpdate = true;
		geometry.computeVertexNormals();

		return geometry;
	}

	// Create elliptical geometry
	private createEllipticalGeometry(config: EnhancedGalaxyConfig): THREE.BufferGeometry {
		const geometry = new THREE.SphereGeometry(config.effectiveRadius, 32, 32);

		// Apply ellipticity
		geometry.scale(1.0, 1.0 - config.ellipticity, 1.0);

		// Apply Sersic profile
		const vertices = geometry.attributes.position.array;
		const vertexCount = vertices.length / 3;

		for (let i = 0; i < vertexCount; i++) {
			const index = i * 3;
			const x = vertices[index];
			const y = vertices[index + 1];
			const z = vertices[index + 2];
			const radius = Math.sqrt(x * x + y * y + z * z);

			// Sersic profile (n=4 for ellipticals)
			const sersicIndex = 4;
			const effectiveRadius = config.effectiveRadius;
			const bn = 7.67; // Approximation for n=4
			const surfaceBrightness = Math.exp(-bn * (Math.pow(radius / effectiveRadius, 1 / sersicIndex) - 1));

			// Scale vertex position
			const scale = 1.0 + surfaceBrightness * 0.2;
			vertices[index] *= scale;
			vertices[index + 1] *= scale;
			vertices[index + 2] *= scale;
		}

		geometry.attributes.position.needsUpdate = true;
		geometry.computeVertexNormals();

		return geometry;
	}

	// Create irregular geometry
	private createIrregularGeometry(config: EnhancedGalaxyConfig): THREE.BufferGeometry {
		const geometry = new THREE.DodecahedronGeometry(config.effectiveRadius, 2);

		// Add asymmetry and clumpiness
		const vertices = geometry.attributes.position.array;
		const vertexCount = vertices.length / 3;

		for (let i = 0; i < vertexCount; i++) {
			const index = i * 3;
			const x = vertices[index];
			const y = vertices[index + 1];
			const z = vertices[index + 2];

			// Add random perturbations
			const noise = this.simplexNoise3D(x * 0.1, y * 0.1, z * 0.1);
			const clumpiness = config.morphology.clumpiness;

			const scale = 1.0 + noise * clumpiness * 0.5;
			vertices[index] *= scale;
			vertices[index + 1] *= scale;
			vertices[index + 2] *= scale;
		}

		geometry.attributes.position.needsUpdate = true;
		geometry.computeVertexNormals();

		return geometry;
	}

	// Create materials for different galaxy types
	private createSpiralMaterial(config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): THREE.Material {
		const baseColor = this.interpolatePopulationColors(config.populationFractions, galaxyType);

		return new THREE.MeshPhongMaterial({
			color: baseColor,
			emissive: baseColor.clone().multiplyScalar(0.3),
			transparent: true,
			opacity: 0.8,
			side: THREE.DoubleSide,
		});
	}

	private createEllipticalMaterial(config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): THREE.Material {
		const baseColor = galaxyType.primaryColors[0];

		return new THREE.MeshPhongMaterial({
			color: baseColor,
			emissive: baseColor.clone().multiplyScalar(0.2),
			transparent: true,
			opacity: 0.9,
			shininess: 30,
		});
	}

	private createStarburstMaterial(config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): THREE.Material {
		const baseColor = galaxyType.primaryColors[0];

		return new THREE.MeshPhongMaterial({
			color: baseColor,
			emissive: baseColor.clone().multiplyScalar(0.6),
			transparent: true,
			opacity: 0.7,
		});
	}

	// Add morphological features
	private addMorphologicalFeatures(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		// Add central bulge
		if (config.morphology.hasBulge) {
			this.addCentralBulge(galaxyGroup, config, galaxyType);
		}

		// Add spiral arms
		if (config.morphology.armCount > 0) {
			this.addSpiralArms(galaxyGroup, config, galaxyType);
		}

		// Add central bar
		if (config.morphology.hasBar) {
			this.addCentralBar(galaxyGroup, config, galaxyType);
		}

		// Add stellar halo
		if (config.visualFeatures.stellarHalo) {
			this.addStellarHalo(galaxyGroup, config, galaxyType);
		}
	}

	// Add spiral arms
	private addSpiralArms(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		const armCount = config.armCount;
		const armColor = galaxyType.secondaryColors[0];

		for (let arm = 0; arm < armCount; arm++) {
			const armGeometry = this.createSpiralArmGeometry(config, arm);
			const armMaterial = new THREE.MeshPhongMaterial({
				color: armColor,
				emissive: armColor.clone().multiplyScalar(0.4),
				transparent: true,
				opacity: 0.6,
			});

			const armMesh = new THREE.Mesh(armGeometry, armMaterial);
			galaxyGroup.add(armMesh);
		}
	}

	// Add central bar
	private addCentralBar(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		const barLength = config.morphology.barLength;
		const barGeometry = new THREE.BoxGeometry(barLength, barLength * 0.3, barLength * 0.1);
		const barMaterial = new THREE.MeshPhongMaterial({
			color: galaxyType.primaryColors[1],
			emissive: galaxyType.primaryColors[1].clone().multiplyScalar(0.3),
			transparent: true,
			opacity: 0.7,
		});

		const bar = new THREE.Mesh(barGeometry, barMaterial);
		galaxyGroup.add(bar);
	}

	// Add active galactic nucleus
	private addActiveGalacticNucleus(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		// Central accretion disk
		const diskGeometry = new THREE.RingGeometry(0.1, 2, 32);
		const diskMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			emissive: new THREE.Color(0x4169e1).multiplyScalar(0.8),
			transparent: true,
			opacity: 0.9,
			side: THREE.DoubleSide,
		});

		const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
		accretionDisk.rotation.x = Math.PI / 2;
		galaxyGroup.add(accretionDisk);

		// Relativistic jets
		if (config.jetPower > 0) {
			this.addRelativisticJets(galaxyGroup, config, galaxyType);
		}

		// Central point source
		const nucleusGeometry = new THREE.SphereGeometry(0.5, 16, 16);
		const nucleusMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			emissive: new THREE.Color(0xffffff).multiplyScalar(0.9),
		});

		const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
		galaxyGroup.add(nucleus);
	}

	// Add relativistic jets
	private addRelativisticJets(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		const jetLength = config.effectiveRadius * 10;

		for (let i = 0; i < 2; i++) {
			const jetGeometry = new THREE.CylinderGeometry(0.2, 0.05, jetLength, 16);
			const jetMaterial = new THREE.MeshBasicMaterial({
				color: 0x00ffff,
				emissive: new THREE.Color(0x0088ff).multiplyScalar(0.7),
				transparent: true,
				opacity: 0.8,
			});

			const jet = new THREE.Mesh(jetGeometry, jetMaterial);
			jet.position.y = (i === 0 ? 1 : -1) * jetLength * 0.5;

			galaxyGroup.add(jet);
		}
	}

	// Add star forming regions
	private addStarFormingRegions(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		const regionCount = Math.floor(config.starFormationRate * 10);

		for (let i = 0; i < regionCount; i++) {
			const regionGeometry = new THREE.SphereGeometry(0.5, 8, 8);
			const regionMaterial = new THREE.MeshBasicMaterial({
				color: 0xff1493,
				emissive: new THREE.Color(0xff69b4).multiplyScalar(0.6),
				transparent: true,
				opacity: 0.7,
			});

			const region = new THREE.Mesh(regionGeometry, regionMaterial);

			// Position in spiral arms or randomly
			const position = this.getStarFormingRegionPosition(config, i);
			region.position.copy(position);

			galaxyGroup.add(region);
		}
	}

	// Helper functions

	private calculateSpiralAngle(radius: number, config: EnhancedGalaxyConfig): number {
		const pitchAngle = (config.morphology.armTightness * Math.PI) / 180;
		return Math.log(radius / 0.1) / Math.tan(pitchAngle);
	}

	private calculateArmStrength(angle: number, spiralAngle: number, config: EnhancedGalaxyConfig): number {
		const armWidth = Math.PI / (config.armCount * 2);
		let minDiff = Math.PI;

		for (let arm = 0; arm < config.armCount; arm++) {
			const armAngle = spiralAngle + (arm * 2 * Math.PI) / config.armCount;
			const diff = Math.abs(((angle - armAngle + Math.PI) % (2 * Math.PI)) - Math.PI);
			minDiff = Math.min(minDiff, diff);
		}

		return Math.exp((-minDiff * minDiff) / (armWidth * armWidth));
	}

	private interpolatePopulationColors(populations: Map<StellarPopulation, number>, galaxyType: GalaxyTypeDefinition): THREE.Color {
		let resultColor = new THREE.Color(0x000000);
		let totalWeight = 0;

		populations.forEach((fraction, population) => {
			let popColor = new THREE.Color();

			switch (population) {
				case StellarPopulation.POPULATION_I:
					popColor = new THREE.Color(0x4169e1); // Blue
					break;
				case StellarPopulation.POPULATION_II:
					popColor = new THREE.Color(0xffd700); // Yellow
					break;
				case StellarPopulation.STARBURST:
					popColor = new THREE.Color(0xff1493); // Pink
					break;
				default:
					popColor = galaxyType.primaryColors[0];
			}

			resultColor.add(popColor.multiplyScalar(fraction));
			totalWeight += fraction;
		});

		if (totalWeight > 0) {
			resultColor.multiplyScalar(1 / totalWeight);
		}

		return resultColor;
	}

	private generateMorphology(galaxyType: GalaxyTypeDefinition): GalaxyMorphology {
		// Create morphology with some random variations
		const morphology = { ...galaxyType.morphology };

		// Add random variations
		morphology.ellipticity += (this.random() - 0.5) * 0.2;
		morphology.ellipticity = Math.max(0, Math.min(1, morphology.ellipticity));

		if (morphology.armCount > 0) {
			morphology.armTightness += (this.random() - 0.5) * 5;
			morphology.armSymmetry += (this.random() - 0.5) * 0.2;
			morphology.armSymmetry = Math.max(0, Math.min(1, morphology.armSymmetry));
		}

		return morphology;
	}

	private generateVisualFeatures(galaxyType: GalaxyTypeDefinition, morphology: GalaxyMorphology): GalaxyVisualFeatures {
		const features = { ...galaxyType.visualFeatures };

		// Modify features based on morphology
		if (morphology.hasActiveNucleus) {
			features.activeNucleus = true;
			features.accretionDisk = true;
			features.jetEmission = morphology.jetPower > 0;
		}

		return features;
	}

	private calculateStarCount(stellarMass: number, galaxyType: GalaxyTypeDefinition): number {
		// Scale star count based on mass and type
		const baseDensity = galaxyType.starDensity;
		return Math.floor((stellarMass / 1e8) * baseDensity * 1000);
	}

	private calculateGasCloudCount(starFormationRate: number, galaxyType: GalaxyTypeDefinition): number {
		return Math.floor(starFormationRate * 100);
	}

	private generateBlackHoleMass(stellarMass: number, galaxyType: GalaxyTypeDefinition): number {
		// M_BH - M_bulge relation
		const bulgeMass = stellarMass * 0.1; // Approximate bulge fraction
		return bulgeMass * 0.001; // ~0.1% of bulge mass
	}

	private calculateRedshift(age: number): number {
		// Simple age-redshift relation (approximate)
		const hubbleTime = 13.8; // Gyr
		const lookbackTime = hubbleTime - age;
		return Math.max(0, lookbackTime / 5.0); // Rough approximation
	}

	private selectClusterMemberType(distance: number): GalaxyClass {
		// Galaxy types based on distance from cluster center
		if (distance < 0.5) {
			return GalaxyClass.ELLIPTICAL_E4;
		} else if (distance < 2.0) {
			return this.random() < 0.5 ? GalaxyClass.LENTICULAR_S0 : GalaxyClass.DWARF_ELLIPTICAL;
		} else {
			return this.random() < 0.3 ? GalaxyClass.SPIRAL_SB : GalaxyClass.IRREGULAR_I;
		}
	}

	private selectGalaxyClassForStage(stage: GalaxyEvolutionStage, mass: number, environment: string): GalaxyClass {
		switch (stage) {
			case GalaxyEvolutionStage.PRIMORDIAL:
				return GalaxyClass.IRREGULAR_I;
			case GalaxyEvolutionStage.FORMATION:
				return mass > 1e10 ? GalaxyClass.STARBURST : GalaxyClass.DWARF_IRREGULAR;
			case GalaxyEvolutionStage.MATURE:
				return mass > 1e11 ? GalaxyClass.SPIRAL_SB : GalaxyClass.DWARF_ELLIPTICAL;
			case GalaxyEvolutionStage.QUENCHED:
				return GalaxyClass.ELLIPTICAL_E4;
			default:
				return GalaxyClass.SPIRAL_SB;
		}
	}

	private applyEvolutionStage(config: EnhancedGalaxyConfig, stage: GalaxyEvolutionStage, redshift: number): void {
		config.redshift = redshift;

		switch (stage) {
			case GalaxyEvolutionStage.FORMATION:
				config.starFormationRate *= 5; // Enhanced star formation
				config.morphology.asymmetryIndex = 0.5;
				break;
			case GalaxyEvolutionStage.MATURE:
				config.starFormationRate *= 1; // Normal star formation
				break;
			case GalaxyEvolutionStage.QUENCHED:
				config.starFormationRate *= 0.1; // Suppressed star formation
				break;
		}
	}

	private addTidalFeatures(primary: THREE.Group, secondary: THREE.Group, strength: number): void {
		// Add tidal tails and bridges
		const tailCount = Math.floor(strength * 10);

		for (let i = 0; i < tailCount; i++) {
			const tailGeometry = new THREE.TubeGeometry(this.createTidalCurve(primary.position, secondary.position, i), 20, 0.1, 8, false);

			const tailMaterial = new THREE.MeshBasicMaterial({
				color: 0x87ceeb,
				transparent: true,
				opacity: 0.3,
			});

			const tail = new THREE.Mesh(tailGeometry, tailMaterial);
			primary.add(tail);
		}
	}

	private createTidalCurve(pos1: THREE.Vector3, pos2: THREE.Vector3, index: number): THREE.Curve<THREE.Vector3> {
		const midpoint = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
		const offset = new THREE.Vector3((this.random() - 0.5) * 50, (this.random() - 0.5) * 20, (this.random() - 0.5) * 50);

		return new THREE.QuadraticBezierCurve3(pos1, midpoint.add(offset), pos2);
	}

	private addMergerSignatures(mesh: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Add shells, ripples, and other merger signatures
		config.morphology.asymmetryIndex = 0.3;
		config.visualFeatures.mergerSignatures = true;

		// Add shell structure for ellipticals
		if (config.galaxyClass === GalaxyClass.ELLIPTICAL_E4) {
			this.addShellStructure(mesh, config);
		}
	}

	private addShellStructure(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig): void {
		const shellCount = 3;

		for (let i = 0; i < shellCount; i++) {
			const shellRadius = config.effectiveRadius * (2 + i);
			const shellGeometry = new THREE.RingGeometry(shellRadius * 0.9, shellRadius * 1.1, 32);

			const shellMaterial = new THREE.MeshBasicMaterial({
				color: 0xffd700,
				transparent: true,
				opacity: 0.1,
				side: THREE.DoubleSide,
			});

			const shell = new THREE.Mesh(shellGeometry, shellMaterial);
			shell.rotation.x = Math.PI / 2;
			shell.rotation.z = this.random() * Math.PI;

			galaxyGroup.add(shell);
		}
	}

	private addSpecialEffects(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): void {
		// Add type-specific special effects
		switch (galaxyType.class) {
			case GalaxyClass.QUASAR:
				this.addQuasarEffects(galaxyGroup, config);
				break;
			case GalaxyClass.STARBURST:
				this.addStarburstEffects(galaxyGroup, config);
				break;
			case GalaxyClass.RADIO_GALAXY:
				this.addRadioLobes(galaxyGroup, config);
				break;
		}
	}

	private addQuasarEffects(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Add broad-line region
		const blrGeometry = new THREE.SphereGeometry(5, 16, 16);
		const blrMaterial = new THREE.MeshBasicMaterial({
			color: 0x00ffff,
			transparent: true,
			opacity: 0.3,
		});

		const blr = new THREE.Mesh(blrGeometry, blrMaterial);
		galaxyGroup.add(blr);
	}

	private addStarburstEffects(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig): void {
		// Add galactic wind
		const windGeometry = new THREE.ConeGeometry(config.effectiveRadius * 2, config.effectiveRadius * 4, 8);

		const windMaterial = new THREE.MeshBasicMaterial({
			color: 0xff4500,
			transparent: true,
			opacity: 0.2,
		});

		const wind = new THREE.Mesh(windGeometry, windMaterial);
		wind.position.y = config.effectiveRadius * 2;
		galaxyGroup.add(wind);
	}

	private addRadioLobes(galaxyGroup: THREE.Group, config: EnhancedGalaxyConfig): void {
		const lobeDistance = config.effectiveRadius * 20;

		for (let i = 0; i < 2; i++) {
			const lobeGeometry = new THREE.SphereGeometry(config.effectiveRadius * 5, 16, 16);

			const lobeMaterial = new THREE.MeshBasicMaterial({
				color: 0xff00ff,
				transparent: true,
				opacity: 0.3,
			});

			const lobe = new THREE.Mesh(lobeGeometry, lobeMaterial);
			lobe.position.y = (i === 0 ? 1 : -1) * lobeDistance;

			galaxyGroup.add(lobe);
		}
	}

	// Utility functions
	private randomInRange(min: number, max: number): number {
		return min + this.random() * (max - min);
	}

	private simplexNoise3D(x: number, y: number, z: number): number {
		const seed = this.seed;
		const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed) * 43758.5453;
		return 2.0 * (n - Math.floor(n)) - 1.0;
	}

	private getStarFormingRegionPosition(config: EnhancedGalaxyConfig, index: number): THREE.Vector3 {
		const radius = this.randomInRange(1, config.effectiveRadius * 2);
		const angle = this.random() * Math.PI * 2;
		const height = (this.random() - 0.5) * config.effectiveRadius * 0.1;

		return new THREE.Vector3(radius * Math.cos(angle), height, radius * Math.sin(angle));
	}

	private createSpiralArmGeometry(config: EnhancedGalaxyConfig, armIndex: number): THREE.BufferGeometry {
		const points: THREE.Vector3[] = [];
		const armOffset = (armIndex * 2 * Math.PI) / config.armCount;

		for (let i = 0; i <= 100; i++) {
			const t = i / 100;
			const radius = t * config.effectiveRadius * 2;
			const angle = armOffset + this.calculateSpiralAngle(radius, config);

			points.push(new THREE.Vector3(radius * Math.cos(angle), (this.random() - 0.5) * config.effectiveRadius * 0.1, radius * Math.sin(angle)));
		}

		return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 50, config.effectiveRadius * 0.1, 8, false);
	}

	// Calculate galaxy physics
	private calculateGalaxyPhysics(config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition): GalaxyPhysics {
		return {
			stellarMass: config.stellarMass,
			totalMass: config.totalMass,
			darkMatterFraction: galaxyType.galaxyPhysics.darkMatterFraction,
			gasMass: galaxyType.galaxyPhysics.gasMass,
			effectiveRadius: config.effectiveRadius,
			scaleLength: galaxyType.galaxyPhysics.scaleLength,
			scaleHeight: galaxyType.galaxyPhysics.scaleHeight,
			rotationVelocity: galaxyType.galaxyPhysics.rotationVelocity,
			velocityDispersion: galaxyType.galaxyPhysics.velocityDispersion,
			angularMomentum: galaxyType.galaxyPhysics.angularMomentum,
			starFormationRate: config.starFormationRate,
			starFormationEfficiency: galaxyType.galaxyPhysics.starFormationEfficiency,
			gasDepletion: galaxyType.galaxyPhysics.gasDepletion,
			centralBlackHoleMass: config.blackHoleMass,
			blackHoleAccretionRate: galaxyType.galaxyPhysics.blackHoleAccretionRate,
			eddingtonRatio: config.eddingtonRatio,
			environmentalDensity: config.environmentalDensity,
			clusterMembership: config.clusterMember,
			satelliteCount: galaxyType.galaxyPhysics.satelliteCount,
			metallicity: config.metallicity,
			oxygenAbundance: galaxyType.galaxyPhysics.oxygenAbundance,
			alphaEnhancement: galaxyType.galaxyPhysics.alphaEnhancement,
		};
	}

	// Calculate detailed statistics
	private calculateStatistics(config: EnhancedGalaxyConfig, galaxyType: GalaxyTypeDefinition, physics: GalaxyPhysics, generationTime: number): GalaxyStatistics {
		// Calculate derived quantities
		const massToLightRatio = this.calculateMassToLightRatio(config.dominantPopulation, config.age);
		const luminosity = config.stellarMass / massToLightRatio;
		const colorIndex = this.calculateColorIndex(config.dominantPopulation, config.metallicity);
		const specificStarFormationRate = (config.starFormationRate / config.stellarMass) * 1e9; // per Gyr

		// Structural parameters
		const concentrationIndex = this.calculateConcentrationIndex(galaxyType.class);
		const asymmetryIndex = config.morphology.asymmetryIndex;
		const smoothnessIndex = this.calculateSmoothnessIndex(galaxyType.class);
		const giniCoefficient = this.calculateGiniCoefficient(galaxyType.class);

		return {
			// Physical Data
			stellarMassInSolarMasses: config.stellarMass,
			totalMassInSolarMasses: config.totalMass,
			darkMatterFraction: physics.darkMatterFraction,
			effectiveRadiusInKpc: config.effectiveRadius,
			scaleHeightInKpc: physics.scaleHeight,

			// Kinematic Data
			rotationVelocity: physics.rotationVelocity,
			velocityDispersion: physics.velocityDispersion,
			dynamicalMass: this.calculateDynamicalMass(config.effectiveRadius, physics.velocityDispersion),
			angularMomentum: physics.angularMomentum,

			// Star Formation Data
			starFormationRateInSolarMassesPerYear: config.starFormationRate,
			starFormationEfficiency: physics.starFormationEfficiency,
			gasDepletion: physics.gasDepletion,
			specificStarFormationRate,

			// Stellar Population Data
			averageAge: config.age,
			averageMetallicity: config.metallicity,
			colorIndex,
			massToLightRatio,

			// Structure Data
			concentrationIndex,
			asymmetryIndex,
			smoothnessIndex,
			giniCoefficient,

			// Environmental Data
			localDensity: config.environmentalDensity,
			nearestNeighborDistance: 1.0, // Mpc (placeholder)
			clusterVelocityDispersion: config.clusterMember ? 1000 : 0,

			// Observational Data
			apparentMagnitude: this.calculateApparentMagnitude(luminosity, config.redshift),
			absoluteMagnitude: this.calculateAbsoluteMagnitude(luminosity),
			surfaceBrightness: this.calculateSurfaceBrightness(luminosity, config.effectiveRadius),
			angularSize: this.calculateAngularSize(config.effectiveRadius, config.redshift),

			// Multi-wavelength Data
			bvColor: colorIndex,
			uvLuminosity: this.calculateUVLuminosity(config.starFormationRate),
			infraredLuminosity: this.calculateIRLuminosity(config.starFormationRate),
			xrayLuminosity: this.calculateXRayLuminosity(config.blackHoleMass, config.eddingtonRatio),
			radioLuminosity: this.calculateRadioLuminosity(config.jetPower),

			// Generation Data
			vertices: 0, // Will be calculated after mesh creation
			particles: config.starCount,
			effects: Math.floor(config.effectDensity * 20),
			generationTime,
		};
	}

	// Utility calculation functions
	private calculateMassToLightRatio(population: StellarPopulation, age: number): number {
		switch (population) {
			case StellarPopulation.POPULATION_I:
				return 2.0 + age * 0.5;
			case StellarPopulation.POPULATION_II:
				return 5.0 + age * 1.0;
			case StellarPopulation.STARBURST:
				return 0.5;
			default:
				return 3.0;
		}
	}

	private calculateColorIndex(population: StellarPopulation, metallicity: number): number {
		let baseColor = 0.6; // Solar

		switch (population) {
			case StellarPopulation.POPULATION_I:
				baseColor = 0.4;
				break;
			case StellarPopulation.POPULATION_II:
				baseColor = 0.8;
				break;
			case StellarPopulation.STARBURST:
				baseColor = 0.2;
				break;
		}

		return baseColor + metallicity * 0.2;
	}

	private calculateConcentrationIndex(galaxyClass: GalaxyClass): number {
		switch (galaxyClass) {
			case GalaxyClass.ELLIPTICAL_E4:
				return 4.5;
			case GalaxyClass.SPIRAL_SB:
				return 2.8;
			case GalaxyClass.IRREGULAR_I:
				return 1.5;
			case GalaxyClass.DWARF_ELLIPTICAL:
				return 2.0;
			default:
				return 3.0;
		}
	}

	private calculateSmoothnessIndex(galaxyClass: GalaxyClass): number {
		switch (galaxyClass) {
			case GalaxyClass.ELLIPTICAL_E4:
				return 0.9;
			case GalaxyClass.SPIRAL_SB:
				return 0.6;
			case GalaxyClass.IRREGULAR_I:
				return 0.2;
			case GalaxyClass.STARBURST:
				return 0.1;
			default:
				return 0.5;
		}
	}

	private calculateGiniCoefficient(galaxyClass: GalaxyClass): number {
		switch (galaxyClass) {
			case GalaxyClass.ELLIPTICAL_E4:
				return 0.7;
			case GalaxyClass.SPIRAL_SB:
				return 0.5;
			case GalaxyClass.IRREGULAR_I:
				return 0.3;
			case GalaxyClass.DWARF_ELLIPTICAL:
				return 0.4;
			default:
				return 0.5;
		}
	}

	private calculateDynamicalMass(radius: number, velocity: number): number {
		// Virial mass estimate
		const G = 4.3e-6; // kpc solar_mass^-1 (km/s)^2
		return (velocity * velocity * radius) / G;
	}

	private calculateApparentMagnitude(luminosity: number, redshift: number): number {
		const absoluteMag = this.calculateAbsoluteMagnitude(luminosity);
		const distanceModulus = 5 * Math.log10((((redshift * 3e5) / 70) * 1e6) / 10); // Rough approximation
		return absoluteMag + distanceModulus;
	}

	private calculateAbsoluteMagnitude(luminosity: number): number {
		// Solar absolute magnitude is 4.74
		return 4.74 - 2.5 * Math.log10(luminosity);
	}

	private calculateSurfaceBrightness(luminosity: number, radius: number): number {
		const area = Math.PI * radius * radius; // kpc²
		return -2.5 * Math.log10(luminosity / area) + 26.4; // mag/arcsec²
	}

	private calculateAngularSize(radius: number, redshift: number): number {
		// Angular diameter distance approximation
		const distance = (redshift * 3e5) / 70; // Mpc
		return (((2 * radius) / distance) * 206265) / 60; // arcmin
	}

	private calculateUVLuminosity(starFormationRate: number): number {
		return starFormationRate * 1.4e28; // erg/s per solar mass/year
	}

	private calculateIRLuminosity(starFormationRate: number): number {
		return starFormationRate * 3e28; // erg/s per solar mass/year
	}

	private calculateXRayLuminosity(blackHoleMass: number, eddingtonRatio: number): number {
		const eddingtonLuminosity = (1.3e38 * blackHoleMass) / 1e8; // erg/s
		return eddingtonRatio * eddingtonLuminosity * 0.1; // X-ray fraction
	}

	private calculateRadioLuminosity(jetPower: number): number {
		return jetPower * 0.01; // ~1% of jet power in radio
	}
}
