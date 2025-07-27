/**
 * @file enhanced-solarsystem-generator.ts
 * @description Advanced solar system generator utilizing comprehensive system classification
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Generates scientifically accurate solar systems using the complete
 * classification system with realistic orbital mechanics, stellar evolution, and planet formation.
 */

import * as THREE from "three";
import {
	SolarSystemClass,
	SolarSystemTypeDefinition,
	StellarMultiplicity,
	ResonanceType,
	MigrationType,
	FormationMechanism,
	HabitabilityZone,
	OrbitalDynamics,
	StellarProperties,
	DiskProperties,
	getSolarSystemTypeByClass,
	getRandomSolarSystemType,
	calculateHabitabilityZone,
	calculateOrbitalResonance,
	calculateHillStability,
	calculateMigrationTimescale,
	calculateTidalLockingTime,
	assessSystemStability,
	generateSystemResources,
	predictSystemEvolution,
	classifySystemByArchitecture,
	calculateSystemHabitability,
	getObservationalSignatures,
	SOLAR_SYSTEM_TYPES,
} from "./solar-system-types";

// Enhanced Solar System Configuration
export interface EnhancedSolarSystemConfig {
	// Core Properties
	systemClass: SolarSystemClass;
	seed: number;

	// Stellar Properties
	numberOfStars: number;
	stellarMasses: number[]; // Solar masses
	stellarAges: number[]; // years
	binaryProperties?: {
		separation: number; // AU
		eccentricity: number; // 0-1
		inclination: number; // degrees
		period: number; // days
	};

	// Planetary Architecture
	numberOfPlanets: number;
	planetTypes: string[]; // References to planet types
	orbitalPeriods: number[]; // days
	semiMajorAxes: number[]; // AU
	eccentricities: number[]; // 0-1
	inclinations: number[]; // degrees
	masses: number[]; // Earth masses

	// System Properties
	systemAge: number; // years
	metallicity: number; // [Fe/H]
	galacticEnvironment: string;

	// Orbital Dynamics
	resonanceChain: ResonanceType;
	migrationHistory: MigrationType[];
	stabilityFactor: number;
	chaosParameter: number;

	// Disk Properties
	hasDisk: boolean;
	diskMass: number; // Solar masses
	diskRadius: number; // AU
	debrisDisks: {
		mass: number; // Earth masses
		innerRadius: number; // AU
		outerRadius: number; // AU
		temperature: number; // K
	}[];

	// Habitability
	habitabilityZone: HabitabilityZone;
	habitablePlanets: number[];

	// Visual Properties
	renderDistance: number; // AU
	orbitResolution: number;
	showDebrisDisks: boolean;
	showResonances: boolean;
	showHabitableZone: boolean;
	showStellarEvolution: boolean;

	// Advanced Features
	enableNBodyPhysics: boolean;
	enableTidalEffects: boolean;
	enableAtmosphericEvolution: boolean;
	enableStellarActivity: boolean;

	// Special Features
	uniqueFeatures: string[];
	astrophysicalProcesses: string[];
	scientificValue: number;
	explorationChallenges: string[];
}

// Solar System Generation Result
export interface EnhancedSolarSystemResult {
	mesh: THREE.Group;
	config: EnhancedSolarSystemConfig;
	systemType: SolarSystemTypeDefinition;
	statistics: SolarSystemStatistics;
	planets: PlanetData[];
	stars: StarData[];
	disks: DiskData[];
	dynamics: DynamicsData;
}

// Detailed Solar System Statistics
export interface SolarSystemStatistics {
	// Basic Properties
	totalSystemMass: number; // Solar masses
	systemRadius: number; // AU
	totalAngularMomentum: number; // kg⋅m²/s
	systemAge: number; // years

	// Stellar Properties
	totalStellarMass: number; // Solar masses
	totalStellarLuminosity: number; // Solar luminosities
	combinedStellarTemperature: number; // K
	stellarMetallicity: number; // [Fe/H]

	// Planetary Properties
	totalPlanetaryMass: number; // Earth masses
	rockyPlanetCount: number;
	gasGiantCount: number;
	iceGiantCount: number;
	habitablePlanetCount: number;

	// Orbital Properties
	innerMostOrbit: number; // AU
	outerMostOrbit: number; // AU
	orbitalSpacing: number; // average spacing factor
	eccentricityMean: number; // average eccentricity
	inclinationMean: number; // average inclination (degrees)

	// Resonance Properties
	resonantPairs: number;
	strongestResonance: [number, number]; // ratio
	resonanceStrength: number; // 0-1
	librationAmplitude: number; // degrees

	// Stability Properties
	hillStabilityFactor: number;
	lyapunovTimescale: number; // years
	dynamicalLifetime: number; // years
	collisionalLifetime: number; // years

	// Habitability Properties
	habitableZoneRange: [number, number]; // AU
	habitabilityScore: number; // 0-1
	waterDeliveryPotential: number; // 0-1
	atmosphericRetentionFactor: number; // 0-1

	// Formation Properties
	formationTimescale: number; // years
	migrationExtent: number; // AU
	diskDissipationTime: number; // years
	bombardmentIntensity: number; // impacts/Myr

	// Observable Properties
	transitProbability: number; // 0-1
	rvAmplitude: number; // m/s
	astrometricSignal: number; // μas
	infraredExcess: number; // factor

	// Evolution Properties
	stellarEvolutionPhase: string;
	remainingMainSequenceTime: number; // years
	futureHabitabilityChanges: string[];
	systemEvolutionPredictions: string[];

	// Generation Metadata
	generationTime: number; // ms
	complexityLevel: number; // 1-5
	physicsAccuracy: number; // 0-1
	visualFidelity: number; // 0-1
}

// Individual Celestial Body Data
export interface PlanetData {
	id: string;
	name: string;
	type: string;
	mass: number; // Earth masses
	radius: number; // Earth radii
	semiMajorAxis: number; // AU
	eccentricity: number;
	inclination: number; // degrees
	period: number; // days
	temperature: number; // K
	atmosphere: boolean;
	habitability: number; // 0-1
	moons: number;
	rings: boolean;
	tidallyLocked: boolean;
	mesh: THREE.Group;
}

export interface StarData {
	id: string;
	name: string;
	type: string;
	mass: number; // Solar masses
	radius: number; // Solar radii
	temperature: number; // K
	luminosity: number; // Solar luminosities
	age: number; // years
	metallicity: number; // [Fe/H]
	position: THREE.Vector3;
	mesh: THREE.Group;
}

export interface DiskData {
	id: string;
	name: string;
	type: "protoplanetary" | "debris" | "transitional";
	mass: number; // Solar masses or Earth masses
	innerRadius: number; // AU
	outerRadius: number; // AU
	temperature: number; // K
	dustToGasRatio: number;
	mesh: THREE.Group;
}

export interface DynamicsData {
	orbitalElements: number[][]; // Keplerian elements for each planet
	resonances: { planets: [number, number]; ratio: [number, number]; strength: number }[];
	stabilityAnalysis: { stable: boolean; timescale: number; factors: string[] };
	evolutionPrediction: string[];
	interactionMatrix: number[][]; // Gravitational interaction strengths
}

export class EnhancedSolarSystemGenerator {
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

	// Generate a complete solar system with specified type
	public generateSolarSystem(systemClass?: SolarSystemClass): EnhancedSolarSystemResult {
		const startTime = performance.now();

		// Get system type definition
		const systemType = systemClass ? getSolarSystemTypeByClass(systemClass) : getRandomSolarSystemType();
		if (!systemType) {
			throw new Error(`Invalid solar system class: ${systemClass}`);
		}

		// Generate system configuration
		const config = this.generateSystemConfig(systemType);

		// Generate stellar components
		const stars = this.generateStars(config, systemType);

		// Generate planetary system
		const planets = this.generatePlanets(config, systemType, stars);

		// Generate disk components
		const disks = this.generateDisks(config, systemType);

		// Calculate system dynamics
		const dynamics = this.calculateSystemDynamics(config, planets, stars);

		// Create 3D visualization
		const mesh = this.createSystemMesh(config, systemType, planets, stars, disks);

		// Calculate comprehensive statistics
		const statistics = this.calculateStatistics(config, systemType, planets, stars, disks, dynamics, performance.now() - startTime);

		return {
			mesh,
			config,
			systemType,
			statistics,
			planets,
			stars,
			disks,
			dynamics,
		};
	}

	// Generate specific system architectures
	public generateBinarySystem(primaryClass?: SolarSystemClass, secondaryClass?: SolarSystemClass): EnhancedSolarSystemResult {
		const systemConfig = this.generateBinaryConfiguration(primaryClass, secondaryClass);
		return this.generateSolarSystem(SolarSystemClass.BINARY_STAR);
	}

	public generateCompactSystem(starType: string = "M_dwarf"): EnhancedSolarSystemResult {
		return this.generateSolarSystem(SolarSystemClass.COMPACT_SYSTEM);
	}

	public generateResonantChain(numberOfPlanets: number = 6): EnhancedSolarSystemResult {
		const system = this.generateSolarSystem(SolarSystemClass.RESONANT_CHAIN);
		system.config.numberOfPlanets = numberOfPlanets;
		return system;
	}

	public generateProtoplanetarySystem(diskMass: number = 0.1): EnhancedSolarSystemResult {
		const system = this.generateSolarSystem(SolarSystemClass.PROTO_SYSTEM);
		system.config.diskMass = diskMass;
		return system;
	}

	public generatePostStellarSystem(stellarRemnantType: "white_dwarf" | "neutron_star" | "pulsar"): EnhancedSolarSystemResult {
		const system = this.generateSolarSystem(SolarSystemClass.POST_STELLAR_SYSTEM);
		system.stars[0].type = stellarRemnantType;
		return system;
	}

	// Generate system evolution sequence
	public generateEvolutionSequence(initialClass: SolarSystemClass, timeSteps: number[] = [0, 1e9, 5e9, 10e9]): EnhancedSolarSystemResult[] {
		const sequence: EnhancedSolarSystemResult[] = [];

		const baseSystem = this.generateSolarSystem(initialClass);
		sequence.push(baseSystem);

		for (const timeStep of timeSteps.slice(1)) {
			const evolvedConfig = this.evolveSystem(baseSystem.config, timeStep);
			const evolvedSystem = this.generateSystemFromConfig(evolvedConfig);
			sequence.push(evolvedSystem);
		}

		return sequence;
	}

	// Generate system configuration from type definition
	private generateSystemConfig(systemType: SolarSystemTypeDefinition): EnhancedSolarSystemConfig {
		const numberOfStars = systemType.numberOfStars;
		const numberOfPlanets = this.randomInRange(systemType.numberOfPlanets[0], systemType.numberOfPlanets[1]);

		// Generate stellar properties
		const stellarMasses = this.generateStellarMasses(numberOfStars, systemType);
		const stellarAges = stellarMasses.map(() => systemType.stellarProperties.primaryAge);

		// Generate binary properties if applicable
		let binaryProperties;
		if (numberOfStars > 1) {
			binaryProperties = {
				separation: systemType.stellarProperties.binarySeparation,
				eccentricity: systemType.stellarProperties.binaryEccentricity,
				inclination: systemType.stellarProperties.binaryInclination,
				period: systemType.stellarProperties.binaryPeriod,
			};
		}

		// Generate planetary architecture
		const { orbitalPeriods, semiMajorAxes, eccentricities, inclinations, masses, planetTypes } = this.generatePlanetaryArchitecture(numberOfPlanets, systemType);

		// Calculate habitability zone
		const totalLuminosity = stellarMasses.reduce((sum, mass) => sum + this.massToLuminosity(mass), 0);
		const habitabilityZone = calculateHabitabilityZone(stellarMasses[0], totalLuminosity);

		// Determine habitable planets
		const habitablePlanets = semiMajorAxes
			.map((a, i) => ({ index: i, semiMajorAxis: a, mass: masses[i] }))
			.filter((p) => p.semiMajorAxis >= habitabilityZone.innerEdge && p.semiMajorAxis <= habitabilityZone.outerEdge && p.mass >= 0.1 && p.mass <= 5) // Habitable mass range
			.map((p) => p.index);

		// Generate disk properties
		const hasDisk = systemType.diskProperties.diskMass > 0;
		const debrisDisks = this.generateDebrisDisks(systemType);

		return {
			systemClass: systemType.class,
			seed: this.seed,
			numberOfStars,
			stellarMasses,
			stellarAges,
			binaryProperties,
			numberOfPlanets,
			planetTypes,
			orbitalPeriods,
			semiMajorAxes,
			eccentricities,
			inclinations,
			masses,
			systemAge: systemType.stellarProperties.primaryAge,
			metallicity: systemType.stellarProperties.primaryMetallicity,
			galacticEnvironment: systemType.galacticEnvironment,
			resonanceChain: this.selectResonanceType(systemType),
			migrationHistory: systemType.migrationHistory,
			stabilityFactor: systemType.hillStabilityFactor,
			chaosParameter: systemType.orbitalDynamics.chaosParameter,
			hasDisk,
			diskMass: systemType.diskProperties.diskMass,
			diskRadius: systemType.diskProperties.diskRadius,
			debrisDisks,
			habitabilityZone,
			habitablePlanets,
			renderDistance: 100,
			orbitResolution: 128,
			showDebrisDisks: true,
			showResonances: systemType.resonanceTypes.length > 0,
			showHabitableZone: habitablePlanets.length > 0,
			showStellarEvolution: systemType.stellarProperties.currentEvolutionPhase !== "main_sequence",
			enableNBodyPhysics: numberOfPlanets <= 8, // Limit for performance
			enableTidalEffects: true,
			enableAtmosphericEvolution: true,
			enableStellarActivity: systemType.stellarProperties.stellarActivityLevel > 0.1,
			uniqueFeatures: systemType.uniqueFeatures,
			astrophysicalProcesses: systemType.astrophysicalProcesses,
			scientificValue: systemType.scientificValue,
			explorationChallenges: systemType.explorationChallenges,
		};
	}

	// Generate stellar components
	private generateStars(config: EnhancedSolarSystemConfig, systemType: SolarSystemTypeDefinition): StarData[] {
		const stars: StarData[] = [];

		for (let i = 0; i < config.numberOfStars; i++) {
			const mass = config.stellarMasses[i];
			const age = config.stellarAges[i];
			const temperature = this.massToTemperature(mass);
			const luminosity = this.massToLuminosity(mass);
			const radius = this.massToRadius(mass);

			// Position stars in binary/multiple configuration
			let position = new THREE.Vector3(0, 0, 0);
			if (i > 0 && config.binaryProperties) {
				const angle = ((i - 1) * Math.PI * 2) / (config.numberOfStars - 1);
				const distance = config.binaryProperties.separation;
				position = new THREE.Vector3(distance * Math.cos(angle), 0, distance * Math.sin(angle));
			}

			// Create stellar mesh
			const starMesh = this.createStarMesh(mass, temperature, luminosity, radius);
			starMesh.position.copy(position);

			stars.push({
				id: `star_${i}`,
				name: i === 0 ? "Primary" : `Secondary_${i}`,
				type: this.classifyStellarType(mass, temperature),
				mass,
				radius,
				temperature,
				luminosity,
				age,
				metallicity: config.metallicity,
				position,
				mesh: starMesh,
			});
		}

		return stars;
	}

	// Generate planetary system
	private generatePlanets(config: EnhancedSolarSystemConfig, systemType: SolarSystemTypeDefinition, stars: StarData[]): PlanetData[] {
		const planets: PlanetData[] = [];

		for (let i = 0; i < config.numberOfPlanets; i++) {
			const mass = config.masses[i];
			const semiMajorAxis = config.semiMajorAxes[i];
			const eccentricity = config.eccentricities[i];
			const inclination = config.inclinations[i];
			const period = config.orbitalPeriods[i];

			// Calculate planet properties
			const radius = this.massToRadius(mass);
			const temperature = this.calculatePlanetTemperature(semiMajorAxis, stars);
			const atmosphere = this.hasAtmosphere(mass, temperature, semiMajorAxis);
			const habitability = this.calculateHabitability(mass, semiMajorAxis, temperature, atmosphere, config.habitabilityZone);
			const moons = this.generateMoonCount(mass);
			const rings = this.hasRings(mass, semiMajorAxis);
			const tidallyLocked = this.isTidallyLocked(mass, semiMajorAxis, stars[0].mass);

			// Create planet mesh
			const planetMesh = this.createPlanetMesh(mass, radius, config.planetTypes[i], atmosphere, rings);

			planets.push({
				id: `planet_${i}`,
				name: `Planet ${String.fromCharCode(98 + i)}`, // b, c, d, etc.
				type: config.planetTypes[i],
				mass,
				radius,
				semiMajorAxis,
				eccentricity,
				inclination,
				period,
				temperature,
				atmosphere,
				habitability,
				moons,
				rings,
				tidallyLocked,
				mesh: planetMesh,
			});
		}

		return planets;
	}

	// Generate disk components
	private generateDisks(config: EnhancedSolarSystemConfig, systemType: SolarSystemTypeDefinition): DiskData[] {
		const disks: DiskData[] = [];

		// Protoplanetary disk
		if (config.hasDisk) {
			const diskMesh = this.createDiskMesh(config.diskMass, config.diskRadius, systemType.diskProperties.diskTemperature, "protoplanetary");

			disks.push({
				id: "protoplanetary_disk",
				name: "Protoplanetary Disk",
				type: "protoplanetary",
				mass: config.diskMass,
				innerRadius: 0.1,
				outerRadius: config.diskRadius,
				temperature: systemType.diskProperties.diskTemperature,
				dustToGasRatio: systemType.diskProperties.dustToGasRatio,
				mesh: diskMesh,
			});
		}

		// Debris disks
		config.debrisDisks.forEach((debris, index) => {
			const debrisMesh = this.createDiskMesh(
				debris.mass / 333000, // Convert Earth masses to Solar masses
				debris.outerRadius,
				debris.temperature,
				"debris"
			);

			disks.push({
				id: `debris_disk_${index}`,
				name: `Debris Disk ${index + 1}`,
				type: "debris",
				mass: debris.mass,
				innerRadius: debris.innerRadius,
				outerRadius: debris.outerRadius,
				temperature: debris.temperature,
				dustToGasRatio: 1.0, // Debris disks are dust-dominated
				mesh: debrisMesh,
			});
		});

		return disks;
	}

	// Calculate system dynamics
	private calculateSystemDynamics(config: EnhancedSolarSystemConfig, planets: PlanetData[], stars: StarData[]): DynamicsData {
		// Orbital elements matrix
		const orbitalElements = planets.map((planet) => [
			planet.semiMajorAxis,
			planet.eccentricity,
			planet.inclination,
			0, // longitude of ascending node
			0, // argument of periapsis
			this.random() * 360, // mean anomaly
		]);

		// Resonance detection
		const resonances: { planets: [number, number]; ratio: [number, number]; strength: number }[] = [];
		for (let i = 0; i < planets.length - 1; i++) {
			for (let j = i + 1; j < planets.length; j++) {
				const resonance = calculateOrbitalResonance(planets[i].period, planets[j].period);
				if (resonance.strength > 0.1) {
					resonances.push({
						planets: [i, j],
						ratio: resonance.ratio,
						strength: resonance.strength,
					});
				}
			}
		}

		// Stability analysis
		const planetData = planets.map((p) => ({ mass: p.mass, semiMajorAxis: p.semiMajorAxis }));
		const hillStability = calculateHillStability(planetData, stars[0].mass);
		const stabilityAnalysis = {
			stable: hillStability > 3,
			timescale: config.stabilityFactor * 1e6,
			factors: hillStability < 3 ? ["Hill sphere overlap"] : ["Dynamically stable"],
		};

		// Evolution prediction
		const evolutionPrediction = this.predictDynamicalEvolution(config, planets, stars);

		// Interaction matrix
		const interactionMatrix = this.calculateInteractionMatrix(planets, stars);

		return {
			orbitalElements,
			resonances,
			stabilityAnalysis,
			evolutionPrediction,
			interactionMatrix,
		};
	}

	// Create 3D visualization mesh
	private createSystemMesh(config: EnhancedSolarSystemConfig, systemType: SolarSystemTypeDefinition, planets: PlanetData[], stars: StarData[], disks: DiskData[]): THREE.Group {
		const systemGroup = new THREE.Group();
		systemGroup.name = `solar_system_${systemType.class}`;

		// Add stars
		stars.forEach((star) => {
			systemGroup.add(star.mesh);
		});

		// Add planets with orbital paths
		planets.forEach((planet, index) => {
			// Create orbital path
			if (config.orbitResolution > 0) {
				const orbitPath = this.createOrbitPath(planet.semiMajorAxis, planet.eccentricity, planet.inclination, config.orbitResolution);
				orbitPath.name = `orbit_${index}`;
				systemGroup.add(orbitPath);
			}

			// Position planet in orbit
			const angle = this.random() * Math.PI * 2;
			const distance = planet.semiMajorAxis * (1 - planet.eccentricity * Math.cos(angle));
			planet.mesh.position.set(distance * Math.cos(angle), distance * Math.sin(((angle * Math.PI) / 180) * planet.inclination), distance * Math.sin(angle));

			systemGroup.add(planet.mesh);
		});

		// Add disks
		disks.forEach((disk) => {
			systemGroup.add(disk.mesh);
		});

		// Add habitability zone visualization
		if (config.showHabitableZone && config.habitablePlanets.length > 0) {
			const hzVisualization = this.createHabitabilityZoneVisualization(config.habitabilityZone);
			systemGroup.add(hzVisualization);
		}

		// Add resonance indicators
		if (config.showResonances) {
			const resonanceVisualization = this.createResonanceVisualization(planets);
			systemGroup.add(resonanceVisualization);
		}

		// Add binary orbit if applicable
		if (stars.length > 1 && config.binaryProperties) {
			const binaryOrbit = this.createBinaryOrbitVisualization(config.binaryProperties);
			systemGroup.add(binaryOrbit);
		}

		return systemGroup;
	}

	// Helper methods for generation

	private generateStellarMasses(numberOfStars: number, systemType: SolarSystemTypeDefinition): number[] {
		const masses: number[] = [];

		// Primary star
		masses.push(systemType.stellarProperties.primaryMass);

		// Secondary stars
		for (let i = 1; i < numberOfStars; i++) {
			if (i === 1 && systemType.stellarProperties.secondaryMass > 0) {
				masses.push(systemType.stellarProperties.secondaryMass);
			} else if (i === 2 && systemType.stellarProperties.tertiaryMass > 0) {
				masses.push(systemType.stellarProperties.tertiaryMass);
			} else {
				// Generate additional masses following mass ratio distribution
				masses.push(masses[0] * this.randomInRange(0.1, 0.8));
			}
		}

		return masses;
	}

	private generatePlanetaryArchitecture(
		numberOfPlanets: number,
		systemType: SolarSystemTypeDefinition
	): {
		orbitalPeriods: number[];
		semiMajorAxes: number[];
		eccentricities: number[];
		inclinations: number[];
		masses: number[];
		planetTypes: string[];
	} {
		const orbitalPeriods: number[] = [];
		const semiMajorAxes: number[] = [];
		const eccentricities: number[] = [];
		const inclinations: number[] = [];
		const masses: number[] = [];
		const planetTypes: string[] = [];

		// Generate based on system architecture
		switch (systemType.class) {
			case SolarSystemClass.COMPACT_SYSTEM:
				this.generateCompactArchitecture(numberOfPlanets, systemType, {
					orbitalPeriods,
					semiMajorAxes,
					eccentricities,
					inclinations,
					masses,
					planetTypes,
				});
				break;
			case SolarSystemClass.RESONANT_CHAIN:
				this.generateResonantArchitecture(numberOfPlanets, systemType, {
					orbitalPeriods,
					semiMajorAxes,
					eccentricities,
					inclinations,
					masses,
					planetTypes,
				});
				break;
			case SolarSystemClass.GAS_GIANT_DOMINATED:
				this.generateGasGiantArchitecture(numberOfPlanets, systemType, {
					orbitalPeriods,
					semiMajorAxes,
					eccentricities,
					inclinations,
					masses,
					planetTypes,
				});
				break;
			case SolarSystemClass.ROCKY_DOMINATED:
				this.generateRockyArchitecture(numberOfPlanets, systemType, {
					orbitalPeriods,
					semiMajorAxes,
					eccentricities,
					inclinations,
					masses,
					planetTypes,
				});
				break;
			default:
				this.generateStandardArchitecture(numberOfPlanets, systemType, {
					orbitalPeriods,
					semiMajorAxes,
					eccentricities,
					inclinations,
					masses,
					planetTypes,
				});
				break;
		}

		return {
			orbitalPeriods,
			semiMajorAxes,
			eccentricities,
			inclinations,
			masses,
			planetTypes,
		};
	}

	private generateCompactArchitecture(numberOfPlanets: number, systemType: SolarSystemTypeDefinition, result: any): void {
		// Planets packed close to star in resonant chain
		const stellarMass = systemType.stellarProperties.primaryMass;

		for (let i = 0; i < numberOfPlanets; i++) {
			// Tightly packed orbits with resonant spacing
			const resonanceRatio = 1.5 + this.random() * 0.3; // 3:2 to 9:5 ratios
			const basePeriod = 1.5; // days
			const period = basePeriod * Math.pow(resonanceRatio, i);
			const semiMajorAxis = Math.pow((period * period * stellarMass) / 365.25 / 365.25, 1 / 3);

			result.orbitalPeriods.push(period);
			result.semiMajorAxes.push(semiMajorAxis);
			result.eccentricities.push(this.randomInRange(0, 0.05)); // Low eccentricity
			result.inclinations.push(this.randomInRange(0, 2)); // Low inclination
			result.masses.push(this.randomInRange(0.3, 3)); // Earth-like masses
			result.planetTypes.push(this.selectPlanetType(result.masses[i], semiMajorAxis));
		}
	}

	private generateResonantArchitecture(numberOfPlanets: number, systemType: SolarSystemTypeDefinition, result: any): void {
		// Perfect resonant chain
		const stellarMass = systemType.stellarProperties.primaryMass;
		const resonanceRatios = [3 / 2, 4 / 3, 5 / 4, 6 / 5, 7 / 6]; // Common resonances

		let currentPeriod = 5; // days

		for (let i = 0; i < numberOfPlanets; i++) {
			const period = currentPeriod;
			const semiMajorAxis = Math.pow((period * period * stellarMass) / 365.25 / 365.25, 1 / 3);

			result.orbitalPeriods.push(period);
			result.semiMajorAxes.push(semiMajorAxis);
			result.eccentricities.push(this.randomInRange(0, 0.02)); // Very low eccentricity
			result.inclinations.push(this.randomInRange(0, 1)); // Very low inclination
			result.masses.push(this.randomInRange(1, 10)); // Super-Earth masses
			result.planetTypes.push(this.selectPlanetType(result.masses[i], semiMajorAxis));

			// Next planet in resonance
			if (i < numberOfPlanets - 1) {
				const ratio = resonanceRatios[i % resonanceRatios.length];
				currentPeriod *= ratio;
			}
		}
	}

	private generateGasGiantArchitecture(numberOfPlanets: number, systemType: SolarSystemTypeDefinition, result: any): void {
		// System dominated by giant planets
		const stellarMass = systemType.stellarProperties.primaryMass;

		for (let i = 0; i < numberOfPlanets; i++) {
			const semiMajorAxis = this.randomInRange(0.5, 20); // Wide range
			const period = Math.sqrt((semiMajorAxis * semiMajorAxis * semiMajorAxis) / stellarMass) * 365.25;

			result.orbitalPeriods.push(period);
			result.semiMajorAxes.push(semiMajorAxis);
			result.eccentricities.push(this.randomInRange(0, 0.3)); // Moderate eccentricity
			result.inclinations.push(this.randomInRange(0, 5)); // Moderate inclination

			// Bias toward giant planets
			const mass =
				i < numberOfPlanets / 2
					? this.randomInRange(50, 500) // Gas giants
					: this.randomInRange(0.5, 5); // Some terrestrials

			result.masses.push(mass);
			result.planetTypes.push(this.selectPlanetType(mass, semiMajorAxis));
		}
	}

	private generateRockyArchitecture(numberOfPlanets: number, systemType: SolarSystemTypeDefinition, result: any): void {
		// System dominated by rocky planets
		const stellarMass = systemType.stellarProperties.primaryMass;

		for (let i = 0; i < numberOfPlanets; i++) {
			const semiMajorAxis = this.randomInRange(0.3, 3); // Inner system
			const period = Math.sqrt((semiMajorAxis * semiMajorAxis * semiMajorAxis) / stellarMass) * 365.25;

			result.orbitalPeriods.push(period);
			result.semiMajorAxes.push(semiMajorAxis);
			result.eccentricities.push(this.randomInRange(0, 0.1)); // Low eccentricity
			result.inclinations.push(this.randomInRange(0, 3)); // Low inclination
			result.masses.push(this.randomInRange(0.1, 8)); // Rocky planet masses
			result.planetTypes.push(this.selectPlanetType(result.masses[i], semiMajorAxis));
		}
	}

	private generateStandardArchitecture(numberOfPlanets: number, systemType: SolarSystemTypeDefinition, result: any): void {
		// Solar System-like architecture
		const stellarMass = systemType.stellarProperties.primaryMass;

		for (let i = 0; i < numberOfPlanets; i++) {
			// Logarithmic spacing like Solar System
			const semiMajorAxis = 0.4 * Math.pow(1.7, i); // Titius-Bode-like law
			const period = Math.sqrt((semiMajorAxis * semiMajorAxis * semiMajorAxis) / stellarMass) * 365.25;

			result.orbitalPeriods.push(period);
			result.semiMajorAxes.push(semiMajorAxis);
			result.eccentricities.push(this.randomInRange(0, 0.2));
			result.inclinations.push(this.randomInRange(0, 5));

			// Mass distribution: inner terrestrials, outer giants
			const mass =
				semiMajorAxis < 2
					? this.randomInRange(0.1, 2) // Terrestrial
					: this.randomInRange(10, 300); // Giant

			result.masses.push(mass);
			result.planetTypes.push(this.selectPlanetType(mass, semiMajorAxis));
		}
	}

	// Physics and utility methods

	private massToLuminosity(mass: number): number {
		// Main sequence mass-luminosity relation
		if (mass < 0.43) {
			return 0.23 * Math.pow(mass, 2.3);
		} else if (mass < 2) {
			return Math.pow(mass, 4);
		} else if (mass < 20) {
			return 1.4 * Math.pow(mass, 3.5);
		} else {
			return 32000 * Math.pow(mass, 1);
		}
	}

	private massToTemperature(mass: number): number {
		// Approximate main sequence mass-temperature relation
		return 5778 * Math.pow(mass, 0.5); // K
	}

	private massToRadius(mass: number): number {
		// Mass-radius relation for planets (Earth units)
		if (mass < 2) {
			return Math.pow(mass, 0.27); // Rocky planets
		} else if (mass < 100) {
			return Math.pow(mass, 0.58); // Sub-Neptunes
		} else {
			return Math.pow(mass, -0.04); // Gas giants
		}
	}

	private calculatePlanetTemperature(semiMajorAxis: number, stars: StarData[]): number {
		// Equilibrium temperature calculation
		const totalLuminosity = stars.reduce((sum, star) => sum + star.luminosity, 0);
		const solarLuminosity = 3.828e26; // W
		const stefanBoltzmann = 5.67e-8; // W/m²/K⁴
		const albedo = 0.3; // Typical planetary albedo

		const flux = (totalLuminosity * solarLuminosity) / (4 * Math.PI * Math.pow(semiMajorAxis * 1.496e11, 2));
		const temperature = Math.pow(((1 - albedo) * flux) / (4 * stefanBoltzmann), 0.25);

		return temperature;
	}

	private hasAtmosphere(mass: number, temperature: number, semiMajorAxis: number): boolean {
		// Atmospheric retention criteria
		const escapeVelocity = Math.sqrt((2 * 6.674e-11 * mass * 5.97e24) / (this.massToRadius(mass) * 6.371e6));
		const thermalVelocity = Math.sqrt((3 * 1.381e-23 * temperature) / (2 * 1.67e-27)); // H2 molecules

		return escapeVelocity > 6 * thermalVelocity; // Jeans escape criterion
	}

	private calculateHabitability(mass: number, semiMajorAxis: number, temperature: number, atmosphere: boolean, hz: HabitabilityZone): number {
		let score = 0;

		// Distance from habitable zone center
		const hzScore = 1 - Math.abs(semiMajorAxis - hz.optimumZone) / (hz.outerEdge - hz.innerEdge);
		score += Math.max(0, hzScore) * 0.4;

		// Mass factor (Earth-like optimal)
		const massScore = 1 - Math.abs(Math.log10(mass)) / 2;
		score += Math.max(0, massScore) * 0.3;

		// Temperature factor
		const tempScore = temperature > 273 && temperature < 373 ? 1 : 0;
		score += tempScore * 0.2;

		// Atmosphere bonus
		if (atmosphere) score += 0.1;

		return Math.min(1, Math.max(0, score));
	}

	private generateMoonCount(planetMass: number): number {
		// Empirical moon count based on planet mass
		if (planetMass < 0.1) return 0;
		if (planetMass < 1) return Math.random() < 0.5 ? 1 : 0;
		if (planetMass < 10) return Math.floor(this.random() * 3);
		if (planetMass < 100) return Math.floor(this.random() * 20);
		return Math.floor(this.random() * 80); // Jupiter-like
	}

	private hasRings(mass: number, semiMajorAxis: number): boolean {
		// Ring formation probability
		return mass > 10 && this.random() < 0.3; // Giant planets more likely
	}

	private isTidallyLocked(planetMass: number, semiMajorAxis: number, stellarMass: number): boolean {
		const lockingTime = calculateTidalLockingTime(planetMass, this.massToRadius(planetMass), semiMajorAxis, stellarMass);
		return lockingTime < 4.6e9; // Locked within Solar System age
	}

	private selectPlanetType(mass: number, semiMajorAxis: number): string {
		if (mass < 0.3) return "mercury_like";
		if (mass < 2 && semiMajorAxis < 1) return "venus_like";
		if (mass < 2 && semiMajorAxis >= 1) return "earth_like";
		if (mass < 10) return "super_earth";
		if (mass < 30) return "mini_neptune";
		if (mass < 100) return "neptune_like";
		return "jupiter_like";
	}

	private selectResonanceType(systemType: SolarSystemTypeDefinition): ResonanceType {
		if (systemType.resonanceTypes.length === 0) return ResonanceType.NONE;
		return systemType.resonanceTypes[Math.floor(this.random() * systemType.resonanceTypes.length)];
	}

	private generateDebrisDisks(systemType: SolarSystemTypeDefinition): any[] {
		const debrisDisks: any[] = [];

		if (systemType.diskProperties.debrisDiskMass > 0) {
			debrisDisks.push({
				mass: systemType.diskProperties.debrisDiskMass,
				innerRadius: systemType.diskProperties.debrisDiskRadius * 0.8,
				outerRadius: systemType.diskProperties.debrisDiskRadius * 1.2,
				temperature: 50, // K
			});
		}

		return debrisDisks;
	}

	private classifyStellarType(mass: number, temperature: number): string {
		if (temperature > 30000) return "O";
		if (temperature > 10000) return "B";
		if (temperature > 7500) return "A";
		if (temperature > 6000) return "F";
		if (temperature > 5200) return "G";
		if (temperature > 3700) return "K";
		return "M";
	}

	// 3D Mesh Creation Methods

	private createStarMesh(mass: number, temperature: number, luminosity: number, radius: number): THREE.Group {
		const starGroup = new THREE.Group();

		// Main star body
		const starGeometry = new THREE.SphereGeometry(radius * 0.1, 32, 32); // Scale for rendering
		const starColor = this.temperatureToColor(temperature);
		const starMaterial = new THREE.MeshBasicMaterial({
			color: starColor,
			emissive: starColor.clone().multiplyScalar(0.8),
		});

		const starMesh = new THREE.Mesh(starGeometry, starMaterial);
		starMesh.name = "star_surface";
		starGroup.add(starMesh);

		// Corona/atmosphere
		const coronaGeometry = new THREE.SphereGeometry(radius * 0.15, 16, 16);
		const coronaMaterial = new THREE.MeshBasicMaterial({
			color: starColor,
			transparent: true,
			opacity: 0.3,
			side: THREE.BackSide,
		});

		const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
		corona.name = "corona";
		starGroup.add(corona);

		// Add point light
		const light = new THREE.PointLight(starColor, luminosity, 1000);
		light.name = "stellar_light";
		starGroup.add(light);

		return starGroup;
	}

	private createPlanetMesh(mass: number, radius: number, type: string, atmosphere: boolean, rings: boolean): THREE.Group {
		const planetGroup = new THREE.Group();

		// Main planet body
		const planetGeometry = new THREE.SphereGeometry(radius * 0.01, 16, 16); // Scale for rendering
		const planetColor = this.getPlanetColor(type, mass);
		const planetMaterial = new THREE.MeshPhongMaterial({
			color: planetColor,
			shininess: 30,
		});

		const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
		planetMesh.name = "planet_surface";
		planetGroup.add(planetMesh);

		// Atmosphere
		if (atmosphere) {
			const atmosphereGeometry = new THREE.SphereGeometry(radius * 0.012, 16, 16);
			const atmosphereMaterial = new THREE.MeshBasicMaterial({
				color: 0x87ceeb,
				transparent: true,
				opacity: 0.2,
				side: THREE.BackSide,
			});

			const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
			atmosphereMesh.name = "atmosphere";
			planetGroup.add(atmosphereMesh);
		}

		// Rings
		if (rings) {
			const ringGeometry = new THREE.RingGeometry(radius * 0.015, radius * 0.025, 32);
			const ringMaterial = new THREE.MeshBasicMaterial({
				color: 0xd2691e,
				transparent: true,
				opacity: 0.7,
				side: THREE.DoubleSide,
			});

			const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
			ringMesh.rotation.x = Math.PI / 2;
			ringMesh.name = "rings";
			planetGroup.add(ringMesh);
		}

		return planetGroup;
	}

	private createDiskMesh(mass: number, radius: number, temperature: number, type: string): THREE.Group {
		const diskGroup = new THREE.Group();

		// Main disk
		const diskGeometry = new THREE.RingGeometry(radius * 0.1, radius, 64, 8);
		const diskColor = this.temperatureToColor(temperature);
		const diskMaterial = new THREE.MeshBasicMaterial({
			color: diskColor,
			transparent: true,
			opacity: type === "protoplanetary" ? 0.6 : 0.3,
			side: THREE.DoubleSide,
		});

		const disk = new THREE.Mesh(diskGeometry, diskMaterial);
		disk.rotation.x = -Math.PI / 2;
		disk.name = `${type}_disk`;
		diskGroup.add(disk);

		return diskGroup;
	}

	private createOrbitPath(semiMajorAxis: number, eccentricity: number, inclination: number, resolution: number): THREE.Line {
		const points: THREE.Vector3[] = [];

		for (let i = 0; i <= resolution; i++) {
			const theta = (i / resolution) * Math.PI * 2;
			const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(theta));

			const x = r * Math.cos(theta);
			const y = r * Math.sin(theta) * Math.cos((inclination * Math.PI) / 180);
			const z = r * Math.sin(theta) * Math.sin((inclination * Math.PI) / 180);

			points.push(new THREE.Vector3(x, y, z));
		}

		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial({
			color: 0x666666,
			transparent: true,
			opacity: 0.5,
		});

		return new THREE.Line(geometry, material);
	}

	private createHabitabilityZoneVisualization(hz: HabitabilityZone): THREE.Mesh {
		const hzGeometry = new THREE.RingGeometry(hz.innerEdge, hz.outerEdge, 64);
		const hzMaterial = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.1,
			side: THREE.DoubleSide,
		});

		const hzMesh = new THREE.Mesh(hzGeometry, hzMaterial);
		hzMesh.rotation.x = -Math.PI / 2;
		hzMesh.name = "habitable_zone";

		return hzMesh;
	}

	private createResonanceVisualization(planets: PlanetData[]): THREE.Group {
		const resonanceGroup = new THREE.Group();

		for (let i = 0; i < planets.length - 1; i++) {
			const resonance = calculateOrbitalResonance(planets[i].period, planets[i + 1].period);
			if (resonance.strength > 0.1) {
				const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(planets[i].semiMajorAxis, 0, 0), new THREE.Vector3(planets[i + 1].semiMajorAxis, 0, 0)]);
				const lineMaterial = new THREE.LineBasicMaterial({
					color: 0xff6600,
					transparent: true,
					opacity: resonance.strength,
				});

				const resonanceLine = new THREE.Line(lineGeometry, lineMaterial);
				resonanceLine.name = `resonance_${i}_${i + 1}`;
				resonanceGroup.add(resonanceLine);
			}
		}

		return resonanceGroup;
	}

	private createBinaryOrbitVisualization(binaryProps: any): THREE.Line {
		const points: THREE.Vector3[] = [];
		const resolution = 128;

		for (let i = 0; i <= resolution; i++) {
			const theta = (i / resolution) * Math.PI * 2;
			const r = (binaryProps.separation * (1 - binaryProps.eccentricity * binaryProps.eccentricity)) / (1 + binaryProps.eccentricity * Math.cos(theta));

			const x = r * Math.cos(theta);
			const y = r * Math.sin(theta) * Math.cos((binaryProps.inclination * Math.PI) / 180);
			const z = r * Math.sin(theta) * Math.sin((binaryProps.inclination * Math.PI) / 180);

			points.push(new THREE.Vector3(x, y, z));
		}

		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial({
			color: 0xff9900,
			transparent: true,
			opacity: 0.7,
		});

		const binaryOrbit = new THREE.Line(geometry, material);
		binaryOrbit.name = "binary_orbit";

		return binaryOrbit;
	}

	// Utility methods

	private randomInRange(min: number, max: number): number {
		return min + this.random() * (max - min);
	}

	private temperatureToColor(temperature: number): THREE.Color {
		// Black body radiation color
		if (temperature < 3500) return new THREE.Color(0xff4500); // Red
		if (temperature < 5000) return new THREE.Color(0xff8c00); // Orange
		if (temperature < 6000) return new THREE.Color(0xffff88); // Yellow
		if (temperature < 7500) return new THREE.Color(0xffffff); // White
		if (temperature < 10000) return new THREE.Color(0x87ceeb); // Blue-white
		return new THREE.Color(0x4169e1); // Blue
	}

	private getPlanetColor(type: string, mass: number): THREE.Color {
		switch (type) {
			case "mercury_like":
				return new THREE.Color(0x8c7853);
			case "venus_like":
				return new THREE.Color(0xffc649);
			case "earth_like":
				return new THREE.Color(0x6b93d6);
			case "mars_like":
				return new THREE.Color(0xcd5c5c);
			case "super_earth":
				return new THREE.Color(0x4f94cd);
			case "mini_neptune":
				return new THREE.Color(0x4682b4);
			case "neptune_like":
				return new THREE.Color(0x4169e1);
			case "jupiter_like":
				return new THREE.Color(0xd2691e);
			default:
				return new THREE.Color(0x808080);
		}
	}

	private predictDynamicalEvolution(config: EnhancedSolarSystemConfig, planets: PlanetData[], stars: StarData[]): string[] {
		const predictions: string[] = [];

		if (config.chaosParameter > 1e-5) {
			predictions.push("System shows chaotic behavior - long-term instability possible");
		}

		if (config.stabilityFactor < 5) {
			predictions.push("Close planetary encounters likely within 1 Gyr");
		}

		if (stars[0].age > stars[0].mass * 1e9) {
			predictions.push("Stellar evolution will disrupt planetary orbits");
		}

		return predictions;
	}

	private calculateInteractionMatrix(planets: PlanetData[], stars: StarData[]): number[][] {
		const n = planets.length;
		const matrix: number[][] = Array(n)
			.fill(null)
			.map(() => Array(n).fill(0));

		for (let i = 0; i < n; i++) {
			for (let j = i + 1; j < n; j++) {
				const deltaA = Math.abs(planets[i].semiMajorAxis - planets[j].semiMajorAxis);
				const interaction = (planets[i].mass * planets[j].mass) / (deltaA * deltaA);
				matrix[i][j] = matrix[j][i] = interaction;
			}
		}

		return matrix;
	}

	private evolveSystem(config: EnhancedSolarSystemConfig, timeStep: number): EnhancedSolarSystemConfig {
		const evolved = { ...config };

		// Stellar evolution effects
		evolved.systemAge += timeStep;

		// Orbital migration
		if (timeStep > evolved.stellarMasses[0] * 1e8) {
			evolved.semiMajorAxes = evolved.semiMajorAxes.map((a) => a * 1.1); // Expansion
		}

		return evolved;
	}

	private generateBinaryConfiguration(primaryClass?: SolarSystemClass, secondaryClass?: SolarSystemClass): EnhancedSolarSystemConfig {
		// Generate binary system configuration
		return {} as EnhancedSolarSystemConfig; // Placeholder
	}

	private generateSystemFromConfig(config: EnhancedSolarSystemConfig): EnhancedSolarSystemResult {
		// Generate system from evolved configuration
		return {} as EnhancedSolarSystemResult; // Placeholder
	}

	// Calculate comprehensive statistics
	private calculateStatistics(config: EnhancedSolarSystemConfig, systemType: SolarSystemTypeDefinition, planets: PlanetData[], stars: StarData[], disks: DiskData[], dynamics: DynamicsData, generationTime: number): SolarSystemStatistics {
		// Implementation of comprehensive statistics calculation
		const totalSystemMass = stars.reduce((sum, star) => sum + star.mass, 0) + planets.reduce((sum, planet) => sum + planet.mass / 333000, 0);

		const systemRadius = Math.max(...planets.map((p) => p.semiMajorAxis));
		const totalStellarMass = stars.reduce((sum, star) => sum + star.mass, 0);
		const totalPlanetaryMass = planets.reduce((sum, planet) => sum + planet.mass, 0);

		const rockyPlanetCount = planets.filter((p) => p.mass < 10).length;
		const gasGiantCount = planets.filter((p) => p.mass >= 100).length;
		const iceGiantCount = planets.filter((p) => p.mass >= 10 && p.mass < 100).length;
		const habitablePlanetCount = planets.filter((p) => p.habitability > 0.5).length;

		const habitabilityScore = calculateSystemHabitability(
			systemType,
			planets.map((p) => ({ mass: p.mass, semiMajorAxis: p.semiMajorAxis, atmosphere: p.atmosphere }))
		);

		return {
			totalSystemMass,
			systemRadius,
			totalAngularMomentum: config.stellarMasses[0] * systemRadius * systemRadius * 2e30,
			systemAge: config.systemAge,
			totalStellarMass,
			totalStellarLuminosity: stars.reduce((sum, star) => sum + star.luminosity, 0),
			combinedStellarTemperature: stars.reduce((sum, star) => sum + star.temperature, 0) / stars.length,
			stellarMetallicity: config.metallicity,
			totalPlanetaryMass,
			rockyPlanetCount,
			gasGiantCount,
			iceGiantCount,
			habitablePlanetCount,
			innerMostOrbit: Math.min(...planets.map((p) => p.semiMajorAxis)),
			outerMostOrbit: Math.max(...planets.map((p) => p.semiMajorAxis)),
			orbitalSpacing: systemRadius / planets.length,
			eccentricityMean: planets.reduce((sum, p) => sum + p.eccentricity, 0) / planets.length,
			inclinationMean: planets.reduce((sum, p) => sum + p.inclination, 0) / planets.length,
			resonantPairs: dynamics.resonances.length,
			strongestResonance: dynamics.resonances.length > 0 ? dynamics.resonances[0].ratio : [1, 1],
			resonanceStrength: dynamics.resonances.length > 0 ? Math.max(...dynamics.resonances.map((r) => r.strength)) : 0,
			librationAmplitude: systemType.orbitalDynamics.librationAmplitude,
			hillStabilityFactor: config.stabilityFactor,
			lyapunovTimescale: systemType.lyapunovTimescale,
			dynamicalLifetime: dynamics.stabilityAnalysis.timescale,
			collisionalLifetime: systemType.orbitalDynamics.collisionalTimescale,
			habitableZoneRange: [config.habitabilityZone.innerEdge, config.habitabilityZone.outerEdge],
			habitabilityScore,
			waterDeliveryPotential: habitabilityScore * 0.8,
			atmosphericRetentionFactor: habitablePlanetCount / planets.length,
			formationTimescale: systemType.formationTimescale,
			migrationExtent: systemRadius * 0.5,
			diskDissipationTime: systemType.diskProperties.diskDissipationTime,
			bombardmentIntensity: (1e6 / config.systemAge) * 1e6,
			transitProbability: systemType.transitProbability,
			rvAmplitude: systemType.radialVelocityAmplitude,
			astrometricSignal: systemType.astrometricSignal,
			infraredExcess: disks.length > 0 ? 1.5 : 1.0,
			stellarEvolutionPhase: systemType.stellarProperties.currentEvolutionPhase,
			remainingMainSequenceTime: Math.max(0, systemType.stellarProperties.mainSequenceLifetime - config.systemAge),
			futureHabitabilityChanges: dynamics.evolutionPrediction.filter((p) => p.includes("habitable")),
			systemEvolutionPredictions: dynamics.evolutionPrediction,
			generationTime,
			complexityLevel: Math.min(5, Math.floor(planets.length / 2) + (stars.length - 1) + disks.length),
			physicsAccuracy: systemType.observationalStatus === "confirmed" ? 1.0 : 0.7,
			visualFidelity: config.orbitResolution / 512,
		};
	}

	// Public utility methods

	/**
	 * Get all available solar system types
	 */
	public getAvailableSystemTypes(): SolarSystemClass[] {
		return Array.from(SOLAR_SYSTEM_TYPES.keys());
	}

	/**
	 * Get system type information
	 */
	public getSystemTypeInfo(systemClass: SolarSystemClass): SolarSystemTypeDefinition | undefined {
		return getSolarSystemTypeByClass(systemClass);
	}

	/**
	 * Calculate system habitability score
	 */
	public calculateHabitabilityScore(system: EnhancedSolarSystemResult): number {
		return calculateSystemHabitability(
			system.systemType,
			system.planets.map((p) => ({
				mass: p.mass,
				semiMajorAxis: p.semiMajorAxis,
				atmosphere: p.atmosphere,
			}))
		);
	}

	/**
	 * Predict system evolution
	 */
	public predictEvolution(system: EnhancedSolarSystemResult, timeStep: number): Partial<EnhancedSolarSystemConfig> {
		return predictSystemEvolution(system.systemType, timeStep);
	}

	/**
	 * Analyze system stability
	 */
	public analyzeStability(system: EnhancedSolarSystemResult): { stable: boolean; timescale: number; factors: string[] } {
		return assessSystemStability(system.systemType);
	}
}
