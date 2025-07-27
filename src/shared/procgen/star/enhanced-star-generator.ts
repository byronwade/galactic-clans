/**
 * @file enhanced-star-generator.ts
 * @description Advanced stellar generator utilizing the comprehensive stellar classification system
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Generates scientifically accurate, visually diverse stars using the complete
 * stellar type classification system with low-poly aesthetics and realistic physics.
 */

import * as THREE from "three";
import { StellarClass, StellarTypeDefinition, EvolutionStage, StellarPhysics, StellarVisualFeatures, getStellarTypeByClass, getRandomStellarType, calculateStellarHabitableZone, calculateStellarLifespan, getStellarEvolutionPath, classifyStellarType, generateStellarResources, STELLAR_TYPES } from "./stellar-types";

// Enhanced Star Configuration
export interface EnhancedStarConfig {
	// Core Properties
	stellarClass: StellarClass;
	seed: number;
	mass: number; // Solar masses
	radius: number; // Solar radii
	temperature: number; // Kelvin
	luminosity: number; // Solar luminosities

	// Evolutionary Properties
	age: number; // Million years
	evolutionStage: EvolutionStage;
	lifespan: number; // Million years

	// Physical Properties
	rotationPeriod: number; // hours
	magneticField: number; // Tesla
	stellarWind: number; // km/s
	massLossRate: number; // Solar masses/year

	// System Properties
	metallicity: number; // [Fe/H]
	binaryCompanion: boolean;
	companionClass?: StellarClass;
	orbitalPeriod?: number; // days

	// Habitable Zone
	habitableZoneInner: number; // AU
	habitableZoneOuter: number; // AU

	// Visual Properties
	visualFeatures: StellarVisualFeatures;

	// Generation Parameters
	geometryComplexity: number;
	effectDensity: number;
	animationIntensity: number;

	// Special Properties
	uniqueTraits: string[];
	stellarPhenomena: string[];
	dangerLevel: number;
	scientificValue: number;
}

// Star Generation Result
export interface EnhancedStarResult {
	mesh: THREE.Group;
	config: EnhancedStarConfig;
	stellarType: StellarTypeDefinition;
	statistics: StellarStatistics;
	physics: StellarPhysics;
}

// Detailed Stellar Statistics
export interface StellarStatistics {
	// Physical Data
	massInSolarMasses: number;
	radiusInSolarRadii: number;
	luminosityInSolarLuminosities: number;
	surfaceAreaInSolarAreas: number;
	volumeInSolarVolumes: number;
	density: number; // kg/m³

	// Energy Data
	energyOutput: number; // Watts
	surfaceTemperature: number; // Kelvin
	coreTemperature: number; // Kelvin
	fusionRate: number; // Reactions per second

	// Evolutionary Data
	ageInMillionYears: number;
	lifespanInMillionYears: number;
	evolutionaryStage: string;
	timeToNextStage: number; // Million years

	// System Data
	habitableZoneRange: [number, number]; // AU
	tidalLockingRadius: number; // AU
	stellarWindVelocity: number; // km/s
	magnetosphereRadius: number; // Solar radii

	// Observational Data
	apparentMagnitude: number;
	absoluteMagnitude: number;
	colorIndex: number;
	spectralClass: string;

	// Resource Data
	energyHarvestPotential: number;
	scientificResearchValue: number;
	explorationRisk: number;

	// Generation Data
	vertices: number;
	faces: number;
	effects: number;
	generationTime: number; // ms
}

export class EnhancedStarGenerator {
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

	// Generate a complete star with specified type
	public generateStar(stellarClass?: StellarClass, age?: number): EnhancedStarResult {
		const startTime = performance.now();

		// Get stellar type definition
		const stellarType = stellarClass ? getStellarTypeByClass(stellarClass) : getRandomStellarType();
		if (!stellarType) {
			throw new Error(`Invalid stellar class: ${stellarClass}`);
		}

		// Generate star configuration
		const config = this.generateStarConfig(stellarType, age);

		// Create 3D mesh based on stellar type
		const mesh = this.createStarMesh(config, stellarType);

		// Calculate physics
		const physics = this.calculateStellarPhysics(config, stellarType);

		// Calculate statistics
		const statistics = this.calculateStatistics(config, stellarType, physics, performance.now() - startTime);

		return {
			mesh,
			config,
			stellarType,
			statistics,
			physics,
		};
	}

	// Generate binary star system
	public generateBinarySystem(primaryClass?: StellarClass, secondaryClass?: StellarClass): EnhancedStarResult[] {
		const primary = this.generateStar(primaryClass);
		const secondary = this.generateStar(secondaryClass);

		// Adjust secondary star properties for binary orbit
		const orbitalPeriod = this.calculateBinaryPeriod(primary.config.mass, secondary.config.mass);
		const separation = this.calculateBinarySeparation(primary.config.mass, secondary.config.mass, orbitalPeriod);

		// Position secondary star
		secondary.mesh.position.set(separation, 0, 0);

		// Update configurations
		primary.config.binaryCompanion = true;
		primary.config.companionClass = secondary.config.stellarClass;
		primary.config.orbitalPeriod = orbitalPeriod;

		secondary.config.binaryCompanion = true;
		secondary.config.companionClass = primary.config.stellarClass;
		secondary.config.orbitalPeriod = orbitalPeriod;

		return [primary, secondary];
	}

	// Generate star system with multiple components
	public generateStellarSystem(starCount: number = 1): EnhancedStarResult[] {
		const stars: EnhancedStarResult[] = [];

		if (starCount === 1) {
			stars.push(this.generateStar());
		} else if (starCount === 2) {
			stars.push(...this.generateBinarySystem());
		} else {
			// Multiple star system
			const primary = this.generateStar();
			stars.push(primary);

			for (let i = 1; i < starCount; i++) {
				const companion = this.generateStar();
				const distance = 10 * Math.pow(i, 1.5); // AU

				companion.mesh.position.set(distance * Math.cos((i * Math.PI * 2) / starCount), 0, distance * Math.sin((i * Math.PI * 2) / starCount));

				stars.push(companion);
			}
		}

		return stars;
	}

	// Generate star configuration from type definition
	private generateStarConfig(stellarType: StellarTypeDefinition, age?: number): EnhancedStarConfig {
		// Physical properties
		const mass = this.randomInRange(stellarType.massRange[0], stellarType.massRange[1]);
		const radius = this.randomInRange(stellarType.radiusRange[0], stellarType.radiusRange[1]);
		const temperature = this.randomInRange(stellarType.temperatureRange[0], stellarType.temperatureRange[1]);
		const luminosity = this.randomInRange(stellarType.luminosityRange[0], stellarType.luminosityRange[1]);

		// Evolutionary properties
		const lifespan = calculateStellarLifespan(mass);
		const stellarAge = age !== undefined ? age : this.random() * lifespan * 0.8; // Usually not at end of life

		// Determine current evolution stage
		const evolutionStage = this.determineEvolutionStage(stellarAge, lifespan, stellarType);

		// Physical properties based on evolution
		const rotationPeriod = this.generateRotationPeriod(stellarType, stellarAge);
		const magneticField = this.generateMagneticField(stellarType, mass, stellarAge);
		const stellarWind = this.generateStellarWind(stellarType, evolutionStage);
		const massLossRate = this.generateMassLossRate(stellarType, evolutionStage);

		// System properties
		const metallicity = this.generateMetallicity(stellarType);
		const binaryCompanion = this.random() < 0.3; // 30% binary probability

		// Habitable zone calculation
		const [habitableZoneInner, habitableZoneOuter] = calculateStellarHabitableZone(stellarType);

		// Visual features
		const visualFeatures = this.generateVisualFeatures(stellarType, evolutionStage);

		return {
			stellarClass: stellarType.class,
			seed: this.seed,
			mass,
			radius,
			temperature,
			luminosity,
			age: stellarAge,
			evolutionStage,
			lifespan,
			rotationPeriod,
			magneticField,
			stellarWind,
			massLossRate,
			metallicity,
			binaryCompanion,
			habitableZoneInner,
			habitableZoneOuter,
			visualFeatures,
			geometryComplexity: stellarType.geometryComplexity,
			effectDensity: stellarType.effectDensity,
			animationIntensity: stellarType.animationIntensity,
			uniqueTraits: stellarType.uniqueTraits,
			stellarPhenomena: stellarType.stellarPhenomena,
			dangerLevel: stellarType.dangerLevel,
			scientificValue: stellarType.scientificValue,
		};
	}

	// Create 3D mesh based on star configuration
	private createStarMesh(config: EnhancedStarConfig, stellarType: StellarTypeDefinition): THREE.Group {
		const starGroup = new THREE.Group();

		// Create base star geometry
		const starMesh = this.createBaseStar(config, stellarType);
		starGroup.add(starMesh);

		// Add stellar features based on type
		this.addStellarFeatures(starGroup, config, stellarType);

		// Add atmospheric effects
		if (config.visualFeatures.coronaVisible) {
			this.addCorona(starGroup, config, stellarType);
		}

		// Add stellar wind effects
		if (config.visualFeatures.stellarWind) {
			this.addStellarWind(starGroup, config, stellarType);
		}

		// Add magnetic field effects
		if (config.visualFeatures.magnetosphere) {
			this.addMagnetosphere(starGroup, config, stellarType);
		}

		// Add accretion disk for certain types
		if (config.visualFeatures.accretionDisk) {
			this.addAccretionDisk(starGroup, config, stellarType);
		}

		// Add jets for compact objects
		if (config.visualFeatures.jetStreams) {
			this.addRelativisticJets(starGroup, config, stellarType);
		}

		// Add special effects based on stellar type
		this.addSpecialEffects(starGroup, config, stellarType);

		return starGroup;
	}

	// Create base star geometry
	private createBaseStar(config: EnhancedStarConfig, stellarType: StellarTypeDefinition): THREE.Mesh {
		let geometry: THREE.BufferGeometry;
		let material: THREE.Material;

		// Create geometry based on stellar type
		switch (stellarType.class) {
			case StellarClass.BLACK_HOLE:
				// Black hole event horizon
				geometry = new THREE.SphereGeometry(config.radius * 0.1, 32, 32);
				material = new THREE.MeshBasicMaterial({
					color: 0x000000,
					transparent: true,
					opacity: 0.9,
				});
				break;

			case StellarClass.NEUTRON_STAR:
			case StellarClass.PULSAR:
				// Dense, small sphere
				geometry = new THREE.IcosahedronGeometry(config.radius * 0.001, 4);
				material = new THREE.MeshPhongMaterial({
					color: stellarType.primaryColors[0],
					emissive: stellarType.primaryColors[0].clone().multiplyScalar(0.5),
					shininess: 100,
				});
				break;

			case StellarClass.WHITE_DWARF:
				// Small, dense, hot
				geometry = new THREE.IcosahedronGeometry(config.radius * 0.01, 3);
				material = new THREE.MeshPhongMaterial({
					color: stellarType.primaryColors[0],
					emissive: stellarType.primaryColors[0].clone().multiplyScalar(0.3),
					shininess: 80,
				});
				break;

			case StellarClass.RED_SUPERGIANT:
				// Very large, diffuse
				geometry = new THREE.SphereGeometry(config.radius * 10, 64, 64);
				material = new THREE.MeshPhongMaterial({
					color: stellarType.primaryColors[0],
					emissive: stellarType.primaryColors[0].clone().multiplyScalar(0.2),
					transparent: true,
					opacity: 0.8,
				});
				break;

			case StellarClass.PROTOSTAR:
				// Irregular, still forming
				geometry = new THREE.DodecahedronGeometry(config.radius * 2);
				material = new THREE.MeshPhongMaterial({
					color: stellarType.primaryColors[0],
					emissive: stellarType.primaryColors[0].clone().multiplyScalar(0.4),
					transparent: true,
					opacity: 0.7,
				});
				break;

			default:
				// Standard star
				const segments = Math.max(16, config.geometryComplexity * 16);
				geometry = new THREE.IcosahedronGeometry(config.radius, segments);
				material = new THREE.MeshPhongMaterial({
					color: stellarType.primaryColors[0],
					emissive: stellarType.primaryColors[0].clone().multiplyScalar(0.3),
					shininess: 50,
				});
				break;
		}

		// Apply stellar-specific deformation
		this.deformStellarGeometry(geometry, config, stellarType);

		const mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = false; // Stars don't cast shadows, they emit light
		mesh.receiveShadow = false;

		return mesh;
	}

	// Apply stellar-type specific geometry deformation
	private deformStellarGeometry(geometry: THREE.BufferGeometry, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		if (stellarType.class === StellarClass.BLACK_HOLE) {
			// No deformation for black holes
			return;
		}

		const vertices = geometry.attributes.position.array;
		const vertexCount = vertices.length / 3;

		for (let i = 0; i < vertexCount; i++) {
			const index = i * 3;
			const x = vertices[index];
			const y = vertices[index + 1];
			const z = vertices[index + 2];

			// Calculate noise based on stellar type
			let heightVariation = 0;

			switch (stellarType.class) {
				case StellarClass.RED_SUPERGIANT:
					// Convective cells and atmospheric turbulence
					heightVariation = this.generateConvectionNoise(x, y, z, config) * 0.1;
					break;

				case StellarClass.PROTOSTAR:
					// Irregular accretion and formation
					heightVariation = this.generateAccretionNoise(x, y, z, config) * 0.2;
					break;

				case StellarClass.WOLF_RAYET:
					// Stellar wind mass loss
					heightVariation = this.generateWindNoise(x, y, z, config) * 0.05;
					break;

				case StellarClass.NEUTRON_STAR:
					// Magnetic field distortion
					heightVariation = this.generateMagneticNoise(x, y, z, config) * 0.001;
					break;

				default:
					// Standard stellar granulation
					heightVariation = this.generateGranulationNoise(x, y, z, config) * 0.02;
					break;
			}

			// Apply height variation
			const length = Math.sqrt(x * x + y * y + z * z);
			const scale = (length + heightVariation) / length;

			vertices[index] *= scale;
			vertices[index + 1] *= scale;
			vertices[index + 2] *= scale;
		}

		geometry.attributes.position.needsUpdate = true;
		geometry.computeVertexNormals();
	}

	// Add stellar features based on type
	private addStellarFeatures(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		const features = config.visualFeatures;

		if (features.sunspots && stellarType.class !== StellarClass.BLACK_HOLE) {
			this.addSunspots(starGroup, config, stellarType);
		}

		if (features.stellarFlares) {
			this.addStellarFlares(starGroup, config, stellarType);
		}

		if (features.granulation) {
			this.addGranulation(starGroup, config, stellarType);
		}

		if (features.pulsation) {
			this.addPulsationEffect(starGroup, config, stellarType);
		}

		if (features.gravitationalLensing) {
			this.addGravitationalLensing(starGroup, config, stellarType);
		}
	}

	// Add corona effect
	private addCorona(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		const coronaGeometry = new THREE.SphereGeometry(config.radius * 2, 32, 32);
		const coronaColor = stellarType.secondaryColors[0].clone();

		const coronaMaterial = new THREE.MeshBasicMaterial({
			color: coronaColor,
			transparent: true,
			opacity: 0.1,
			side: THREE.BackSide,
		});

		const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
		starGroup.add(corona);
	}

	// Add stellar wind visualization
	private addStellarWind(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		const particleCount = Math.floor(config.effectDensity * 1000);
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);
		const velocities = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount; i++) {
			const radius = config.radius * (1.5 + Math.random() * 10);
			const phi = Math.random() * Math.PI * 2;
			const theta = Math.random() * Math.PI;

			positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
			positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
			positions[i * 3 + 2] = radius * Math.cos(theta);

			velocities[i * 3] = (Math.random() - 0.5) * config.stellarWind * 0.01;
			velocities[i * 3 + 1] = (Math.random() - 0.5) * config.stellarWind * 0.01;
			velocities[i * 3 + 2] = (Math.random() - 0.5) * config.stellarWind * 0.01;
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

		const particleMaterial = new THREE.PointsMaterial({
			color: stellarType.secondaryColors[0],
			size: 0.1,
			transparent: true,
			opacity: 0.6,
		});

		const stellarWindSystem = new THREE.Points(particles, particleMaterial);
		starGroup.add(stellarWindSystem);
	}

	// Add magnetosphere
	private addMagnetosphere(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		if (config.magneticField < 0.1) return; // No significant magnetic field

		// Create magnetic field lines
		const fieldLines = new THREE.Group();
		const lineCount = Math.floor(config.magneticField * 10);

		for (let i = 0; i < lineCount; i++) {
			const curve = new THREE.EllipseCurve(0, 0, config.radius * 2, config.radius * 4, 0, Math.PI * 2, false, 0);

			const points = curve.getPoints(50);
			const geometry = new THREE.BufferGeometry().setFromPoints(points);

			const material = new THREE.LineBasicMaterial({
				color: 0x00ffff,
				transparent: true,
				opacity: 0.3,
			});

			const line = new THREE.Line(geometry, material);
			line.rotation.y = (i / lineCount) * Math.PI * 2;
			line.rotation.x = Math.PI / 2;

			fieldLines.add(line);
		}

		starGroup.add(fieldLines);
	}

	// Add accretion disk
	private addAccretionDisk(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		const innerRadius = config.radius * 2;
		const outerRadius = config.radius * 10;

		for (let i = 0; i < 5; i++) {
			const diskGeometry = new THREE.RingGeometry(innerRadius + i * 0.5, outerRadius - i * 1.0, 64);

			const diskMaterial = new THREE.MeshBasicMaterial({
				color: stellarType.secondaryColors[i % stellarType.secondaryColors.length],
				transparent: true,
				opacity: 0.4 - i * 0.05,
				side: THREE.DoubleSide,
			});

			const disk = new THREE.Mesh(diskGeometry, diskMaterial);
			disk.rotation.x = Math.PI / 2;
			starGroup.add(disk);
		}
	}

	// Add relativistic jets
	private addRelativisticJets(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		// Create two jets along the rotation axis
		for (let i = 0; i < 2; i++) {
			const jetGeometry = new THREE.CylinderGeometry(0.2, 0.05, config.radius * 20, 16);
			const jetMaterial = new THREE.MeshBasicMaterial({
				color: 0x00ffff,
				emissive: new THREE.Color(0x0088ff).multiplyScalar(0.5),
				transparent: true,
				opacity: 0.7,
			});

			const jet = new THREE.Mesh(jetGeometry, jetMaterial);
			jet.position.y = (i === 0 ? 1 : -1) * config.radius * 10;

			starGroup.add(jet);
		}
	}

	// Add special effects based on stellar type
	private addSpecialEffects(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		switch (stellarType.class) {
			case StellarClass.BLACK_HOLE:
				this.addEventHorizon(starGroup, config);
				this.addGravitationalLensing(starGroup, config, stellarType);
				break;

			case StellarClass.PULSAR:
				this.addPulsarBeams(starGroup, config);
				break;

			case StellarClass.WOLF_RAYET:
				this.addStellarWindBubble(starGroup, config);
				break;

			case StellarClass.CARBON_STAR:
				this.addCarbonDust(starGroup, config);
				break;

			case StellarClass.PROTOSTAR:
				this.addBipolarOutflow(starGroup, config);
				break;
		}
	}

	// Noise generation functions for different stellar phenomena
	private generateConvectionNoise(x: number, y: number, z: number, config: EnhancedStarConfig): number {
		return this.simplexNoise3D(x * 0.5, y * 0.5, z * 0.5) * 0.7 + this.simplexNoise3D(x * 1, y * 1, z * 1) * 0.3;
	}

	private generateAccretionNoise(x: number, y: number, z: number, config: EnhancedStarConfig): number {
		return Math.abs(this.simplexNoise3D(x * 2, y * 2, z * 2)) * 0.6 + this.simplexNoise3D(x * 4, y * 4, z * 4) * 0.4;
	}

	private generateWindNoise(x: number, y: number, z: number, config: EnhancedStarConfig): number {
		return this.simplexNoise3D(x * 3, y * 3, z * 3) * 0.8;
	}

	private generateMagneticNoise(x: number, y: number, z: number, config: EnhancedStarConfig): number {
		const base = this.simplexNoise3D(x * 10, y * 10, z * 10);
		return Math.abs(base) > 0.5 ? Math.sign(base) * 0.3 : base * 0.1;
	}

	private generateGranulationNoise(x: number, y: number, z: number, config: EnhancedStarConfig): number {
		return this.simplexNoise3D(x * 8, y * 8, z * 8) * 0.3 + this.simplexNoise3D(x * 16, y * 16, z * 16) * 0.2;
	}

	// Simplified 3D simplex noise implementation
	private simplexNoise3D(x: number, y: number, z: number): number {
		const seed = this.seed;
		const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed) * 43758.5453;
		return 2.0 * (n - Math.floor(n)) - 1.0;
	}

	// Helper functions for specific stellar features
	private addSunspots(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		const spotCount = Math.floor(this.random() * 10);

		for (let i = 0; i < spotCount; i++) {
			const spotGeometry = new THREE.CircleGeometry(config.radius * 0.1, 16);
			const spotMaterial = new THREE.MeshBasicMaterial({
				color: stellarType.primaryColors[0].clone().multiplyScalar(0.3),
				transparent: true,
				opacity: 0.8,
			});

			const spot = new THREE.Mesh(spotGeometry, spotMaterial);

			// Position on star surface
			const position = this.getRandomSurfacePosition(config.radius * 1.01);
			spot.position.copy(position);
			spot.lookAt(position.clone().multiplyScalar(2));

			starGroup.add(spot);
		}
	}

	private addStellarFlares(starGroup: THREE.Group, config: EnhancedStarConfig, stellarType: StellarTypeDefinition): void {
		if (this.random() < 0.3) {
			// 30% chance of active flare
			const flareGeometry = new THREE.ConeGeometry(config.radius * 0.2, config.radius * 2, 8);
			const flareMaterial = new THREE.MeshBasicMaterial({
				color: stellarType.secondaryColors[0],
				emissive: stellarType.secondaryColors[0].clone().multiplyScalar(0.8),
				transparent: true,
				opacity: 0.7,
			});

			const flare = new THREE.Mesh(flareGeometry, flareMaterial);
			const position = this.getRandomSurfacePosition(config.radius * 1.5);
			flare.position.copy(position);
			flare.lookAt(new THREE.Vector3(0, 0, 0));

			starGroup.add(flare);
		}
	}

	private addEventHorizon(starGroup: THREE.Group, config: EnhancedStarConfig): void {
		const horizonGeometry = new THREE.SphereGeometry(config.radius * 2, 32, 32);
		const horizonMaterial = new THREE.MeshBasicMaterial({
			color: 0x000000,
			transparent: true,
			opacity: 0.95,
		});

		const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
		starGroup.add(eventHorizon);
	}

	private addPulsarBeams(starGroup: THREE.Group, config: EnhancedStarConfig): void {
		// Create two lighthouse-like beams
		for (let i = 0; i < 2; i++) {
			const beamGeometry = new THREE.CylinderGeometry(0.1, 1, config.radius * 50, 16);
			const beamMaterial = new THREE.MeshBasicMaterial({
				color: 0x00ffff,
				emissive: new THREE.Color(0x00ffff).multiplyScalar(0.8),
				transparent: true,
				opacity: 0.5,
			});

			const beam = new THREE.Mesh(beamGeometry, beamMaterial);
			beam.rotation.x = i * Math.PI;
			beam.position.y = (i === 0 ? 1 : -1) * config.radius * 25;

			starGroup.add(beam);
		}
	}

	// Utility functions
	private getRandomSurfacePosition(radius: number): THREE.Vector3 {
		const phi = this.random() * Math.PI * 2;
		const theta = this.random() * Math.PI;

		return new THREE.Vector3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
	}

	private randomInRange(min: number, max: number): number {
		return min + this.random() * (max - min);
	}

	// Calculate stellar physics
	private calculateStellarPhysics(config: EnhancedStarConfig, stellarType: StellarTypeDefinition): StellarPhysics {
		return {
			coreTemperature: stellarType.stellarPhysics.coreTemperature,
			corePressure: stellarType.stellarPhysics.corePressure,
			coreDensity: stellarType.stellarPhysics.coreDensity,
			fusionRate: stellarType.stellarPhysics.fusionRate * config.mass,
			surfaceTemperature: config.temperature,
			surfaceGravity: stellarType.stellarPhysics.surfaceGravity,
			escapeVelocity: stellarType.stellarPhysics.escapeVelocity,
			rotationPeriod: config.rotationPeriod,
			magneticFieldStrength: config.magneticField,
			stellarWindSpeed: config.stellarWind,
			massLossRate: config.massLossRate,
			bolometricLuminosity: config.luminosity * 3.8e26,
			surfaceBrightness: stellarType.stellarPhysics.surfaceBrightness,
			effectiveTemperature: config.temperature,
		};
	}

	// Generate various star properties
	private determineEvolutionStage(age: number, lifespan: number, stellarType: StellarTypeDefinition): EvolutionStage {
		const ageRatio = age / lifespan;

		if (ageRatio < 0.1) return EvolutionStage.PRE_MAIN_SEQUENCE;
		if (ageRatio < 0.9) return EvolutionStage.MAIN_SEQUENCE;
		if (ageRatio < 0.95) return EvolutionStage.SUBGIANT;
		if (ageRatio < 0.99) return EvolutionStage.GIANT;
		return EvolutionStage.SUPERNOVA;
	}

	private generateRotationPeriod(stellarType: StellarTypeDefinition, age: number): number {
		let basePeriod = 600; // hours (like the Sun)

		switch (stellarType.class) {
			case StellarClass.NEUTRON_STAR:
			case StellarClass.PULSAR:
				basePeriod = 0.001; // milliseconds
				break;
			case StellarClass.WHITE_DWARF:
				basePeriod = 1; // 1 hour
				break;
			case StellarClass.O_TYPE:
			case StellarClass.B_TYPE:
				basePeriod = 24; // Fast rotation
				break;
			case StellarClass.RED_SUPERGIANT:
				basePeriod = 8760; // Very slow rotation
				break;
		}

		// Rotation slows down with age (magnetic braking)
		const ageFactor = 1 + age / 1000; // Slow down over billions of years
		return basePeriod * ageFactor;
	}

	private generateMagneticField(stellarType: StellarTypeDefinition, mass: number, age: number): number {
		let baseMagnetism = mass * 1e-4; // Tesla

		switch (stellarType.class) {
			case StellarClass.NEUTRON_STAR:
			case StellarClass.PULSAR:
			case StellarClass.MAGNETAR:
				baseMagnetism = 1e8; // Extremely strong
				break;
			case StellarClass.WHITE_DWARF:
				baseMagnetism = 1e4; // Very strong
				break;
			case StellarClass.M_TYPE:
				baseMagnetism *= 10; // Active magnetic dynamos
				break;
		}

		return baseMagnetism * (1 + this.random() * 0.5);
	}

	private generateStellarWind(stellarType: StellarTypeDefinition, evolutionStage: EvolutionStage): number {
		let baseWind = 400; // km/s (like the Sun)

		switch (stellarType.class) {
			case StellarClass.O_TYPE:
			case StellarClass.WOLF_RAYET:
				baseWind = 3000;
				break;
			case StellarClass.RED_SUPERGIANT:
				baseWind = 30;
				break;
			case StellarClass.WHITE_DWARF:
				baseWind = 0; // No stellar wind
				break;
		}

		if (evolutionStage === EvolutionStage.GIANT) {
			baseWind *= 2; // Enhanced mass loss in giant phase
		}

		return baseWind;
	}

	private generateMassLossRate(stellarType: StellarTypeDefinition, evolutionStage: EvolutionStage): number {
		let baseLossRate = 2e-14; // Solar masses per year (like the Sun)

		switch (stellarType.class) {
			case StellarClass.WOLF_RAYET:
				baseLossRate = 1e-5;
				break;
			case StellarClass.RED_SUPERGIANT:
				baseLossRate = 1e-4;
				break;
			case StellarClass.O_TYPE:
				baseLossRate = 1e-6;
				break;
		}

		if (evolutionStage === EvolutionStage.GIANT) {
			baseLossRate *= 100; // Dramatic mass loss in giant phase
		}

		return baseLossRate;
	}

	private generateMetallicity(stellarType: StellarTypeDefinition): number {
		// [Fe/H] ratio, 0 = solar metallicity
		let baseMetallicity = 0;

		switch (stellarType.class) {
			case StellarClass.O_TYPE:
			case StellarClass.WOLF_RAYET:
				baseMetallicity = 0.2; // High metallicity
				break;
			case StellarClass.M_TYPE:
				baseMetallicity = -0.3; // Lower metallicity
				break;
		}

		return baseMetallicity + (this.random() - 0.5) * 0.4;
	}

	private generateVisualFeatures(stellarType: StellarTypeDefinition, evolutionStage: EvolutionStage): StellarVisualFeatures {
		const features = { ...stellarType.visualFeatures };

		// Modify features based on evolution stage
		if (evolutionStage === EvolutionStage.GIANT) {
			features.pulsation = true;
			features.brightnessCycles = true;
			features.stellarWind = true;
		}

		if (evolutionStage === EvolutionStage.FORMATION) {
			features.accretionDisk = true;
			features.jetStreams = true;
			features.brightnessCycles = true;
		}

		return features;
	}

	// Binary system calculations
	private calculateBinaryPeriod(mass1: number, mass2: number): number {
		// Simplified calculation in days
		const totalMass = mass1 + mass2;
		const separation = 1 + this.random() * 10; // AU
		return Math.sqrt(Math.pow(separation, 3) / totalMass) * 365.25;
	}

	private calculateBinarySeparation(mass1: number, mass2: number, period: number): number {
		// Calculate orbital separation in AU
		const totalMass = mass1 + mass2;
		const periodYears = period / 365.25;
		return Math.pow(totalMass * periodYears * periodYears, 1 / 3);
	}

	// Calculate detailed statistics
	private calculateStatistics(config: EnhancedStarConfig, stellarType: StellarTypeDefinition, physics: StellarPhysics, generationTime: number): StellarStatistics {
		const massInSolarMasses = config.mass;
		const radiusInSolarRadii = config.radius;
		const luminosityInSolarLuminosities = config.luminosity;

		// Physical calculations
		const surfaceAreaInSolarAreas = 4 * Math.PI * config.radius * config.radius;
		const volumeInSolarVolumes = (4 / 3) * Math.PI * Math.pow(config.radius, 3);
		const density = config.mass / volumeInSolarVolumes; // Relative to Sun

		// Energy calculations
		const energyOutput = config.luminosity * 3.8e26; // Watts

		// Evolutionary calculations
		const timeToNextStage = config.lifespan - config.age;

		// Observational calculations
		const absoluteMagnitude = 4.74 - 2.5 * Math.log10(config.luminosity); // Solar absolute magnitude is 4.74
		const colorIndex = stellarType.spectralData.colorIndex;

		// System calculations
		const tidalLockingRadius = Math.pow(config.mass, 1 / 3) * 0.1; // AU
		const magnetosphereRadius = config.radius * Math.sqrt(config.magneticField);

		return {
			// Physical Data
			massInSolarMasses,
			radiusInSolarRadii,
			luminosityInSolarLuminosities,
			surfaceAreaInSolarAreas,
			volumeInSolarVolumes,
			density,

			// Energy Data
			energyOutput,
			surfaceTemperature: config.temperature,
			coreTemperature: physics.coreTemperature,
			fusionRate: physics.fusionRate,

			// Evolutionary Data
			ageInMillionYears: config.age,
			lifespanInMillionYears: config.lifespan,
			evolutionaryStage: config.evolutionStage,
			timeToNextStage,

			// System Data
			habitableZoneRange: [config.habitableZoneInner, config.habitableZoneOuter],
			tidalLockingRadius,
			stellarWindVelocity: config.stellarWind,
			magnetosphereRadius,

			// Observational Data
			apparentMagnitude: 0, // Would need distance
			absoluteMagnitude,
			colorIndex,
			spectralClass: stellarType.spectralType,

			// Resource Data
			energyHarvestPotential: config.luminosity * 10,
			scientificResearchValue: config.scientificValue,
			explorationRisk: config.dangerLevel,

			// Generation Data
			vertices: 0, // Will be calculated after mesh creation
			faces: 0, // Will be calculated after mesh creation
			effects: Math.floor(config.effectDensity * 10),
			generationTime,
		};
	}
}
