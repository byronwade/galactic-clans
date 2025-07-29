// @ts-nocheck - Temporary disable for array access and type issues
/**
 * @file solar-system-types.ts
 * @description Comprehensive solar system classification with scientifically accurate orbital dynamics
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Defines all solar system types, from single-star to exotic post-stellar systems,
 * with realistic orbital mechanics, stellar evolution, and planetary formation physics.
 */

import { Vector3, Color } from "three";

// Solar System Classifications
export enum SolarSystemClass {
	// Star Count Classifications
	SINGLE_STAR = "single_star", // 1 star (like Solar System)
	BINARY_STAR = "binary_star", // 2 stars (Kepler-16, Alpha Centauri)
	TRIPLE_STAR = "triple_star", // 3 stars (HD 188753)
	QUADRUPLE_STAR = "quadruple_star", // 4 stars (rare configurations)
	MULTIPLE_STAR = "multiple_star", // 5+ stars (very rare)

	// Planetary Architecture Classifications
	ROCKY_DOMINATED = "rocky_dominated", // Mostly terrestrial planets
	GAS_GIANT_DOMINATED = "gas_giant_dominated", // Large outer planets
	SUPER_EARTH_SYSTEM = "super_earth_system", // 1.25-2x Earth mass planets
	MINI_NEPTUNE_SYSTEM = "mini_neptune_system", // Small ice giants
	HOT_JUPITER_SYSTEM = "hot_jupiter_system", // Close-in gas giants

	// Orbital Architecture Classifications
	COMPACT_SYSTEM = "compact_system", // Planets close to star (TRAPPIST-1)
	EXTENDED_SYSTEM = "extended_system", // Wide orbital separations
	RESONANT_CHAIN = "resonant_chain", // Orbital resonances (Kepler-223)
	HIERARCHICAL_SYSTEM = "hierarchical_system", // Nested orbital groups
	CHAOTIC_SYSTEM = "chaotic_system", // Eccentric, unstable orbits

	// Evolutionary State Classifications
	PROTO_SYSTEM = "proto_system", // Young, still forming (HL Tauri)
	MATURE_SYSTEM = "mature_system", // Main sequence age
	EVOLVED_SYSTEM = "evolved_system", // Post-main sequence
	POST_STELLAR_SYSTEM = "post_stellar_system", // White dwarf/pulsar systems

	// Special Environment Classifications
	DEBRIS_RICH_SYSTEM = "debris_rich_system", // Active bombardment (Beta Pictoris)
	MIGRATION_SYSTEM = "migration_system", // Planetary migration ongoing
	DISRUPTED_SYSTEM = "disrupted_system", // Gravitational disruption
	CAPTURED_SYSTEM = "captured_system", // Rogue system capture
	STRIPPED_SYSTEM = "stripped_system", // Stellar encounter effects

	// Exotic Configurations
	CIRCUMBINARY_SYSTEM = "circumbinary_system", // Planets around binary stars
	S_TYPE_BINARY = "s_type_binary", // Planets around one star in binary
	P_TYPE_BINARY = "p_type_binary", // Planets around both stars
	TROJAN_SYSTEM = "trojan_system", // Co-orbital planets
	RETROGRADE_SYSTEM = "retrograde_system", // Backwards orbital motion

	// Extreme Environments
	PULSAR_SYSTEM = "pulsar_system", // Around neutron stars
	WHITE_DWARF_SYSTEM = "white_dwarf_system", // Evolved stellar remnants
	BROWN_DWARF_SYSTEM = "brown_dwarf_system", // Failed star systems
	ROGUE_SYSTEM = "rogue_system", // Unbound, drifting systems
	GALACTIC_HALO_SYSTEM = "galactic_halo_system", // Metal-poor halo systems
}

// Stellar Multiplicity Types
export enum StellarMultiplicity {
	SINGLE = "single", // One star
	CLOSE_BINARY = "close_binary", // <1 AU separation
	WIDE_BINARY = "wide_binary", // >10 AU separation
	CONTACT_BINARY = "contact_binary", // Touching stars
	ECLIPSING_BINARY = "eclipsing_binary", // Mutually eclipsing
	HIERARCHICAL_TRIPLE = "hierarchical_triple", // A+B orbited by C
	LINEAR_TRIPLE = "linear_triple", // Three in a line
	TRAPEZIUM = "trapezium", // 4+ stars in cluster
}

// Orbital Resonance Types
export enum ResonanceType {
	NONE = "none", // No resonances
	FIRST_ORDER = "first_order", // 2:1, 3:2 resonances
	SECOND_ORDER = "second_order", // 5:3, 7:4 resonances
	LAPLACE_RESONANCE = "laplace_resonance", // 4:2:1 chain
	SECULAR_RESONANCE = "secular_resonance", // Precession resonances
	MEAN_MOTION = "mean_motion", // Orbital period ratios
	KOZAI_LIDOV = "kozai_lidov", // Inclination oscillations
}

// Planetary Migration Types
export enum MigrationType {
	NONE = "none", // No migration
	TYPE_I = "type_i", // Embedded in disk
	TYPE_II = "type_ii", // Gap-opening giants
	TYPE_III = "type_iii", // Runaway migration
	STOCHASTIC = "stochastic", // Random walk
	STELLAR_EVOLUTION = "stellar_evolution", // Due to stellar mass loss
	TIDAL_MIGRATION = "tidal_migration", // Tidal circularization
}

// System Formation Mechanism
export enum FormationMechanism {
	CORE_ACCRETION = "core_accretion", // Standard model
	GRAVITATIONAL_INSTABILITY = "gravitational_instability", // Direct collapse
	PEBBLE_ACCRETION = "pebble_accretion", // Enhanced growth
	STREAMING_INSTABILITY = "streaming_instability", // Dust concentration
	STELLAR_CAPTURE = "stellar_capture", // Gravitational capture
	DISK_FRAGMENTATION = "disk_fragmentation", // Disk instability
	COLLISION_CASCADE = "collision_cascade", // Impact-driven
}

// Habitability Zone Configuration
export interface HabitabilityZone {
	innerEdge: number; // AU
	outerEdge: number; // AU
	optimumZone: number; // AU (best habitability)
	snowLine: number; // AU (water ice formation)
	habitablePlanets: number; // Count of potentially habitable worlds
	tidallyLockedZone: number; // AU (tidal locking radius)
	runawayGreenhouseZone: number; // AU (Venus-like)
	maximumGreenhouseZone: number; // AU (Mars-like)
}

// Orbital Dynamics Properties
export interface OrbitalDynamics {
	// System-wide properties
	totalAngularMomentum: number; // kg⋅m²/s
	systemAge: number; // years
	dynamicalStability: number; // 0-1 (1 = stable)
	kozaiTimescale: number; // years

	// Migration properties
	migrationTimescale: number; // years
	diskLifetime: number; // years
	gasDissipationTime: number; // years

	// Resonance properties
	resonanceStrength: number; // dimensionless
	librationAmplitude: number; // degrees
	chaosParameter: number; // Lyapunov exponent

	// Tidal properties
	tidalQFactor: number; // Tidal quality factor
	tidalCircularizationTime: number; // years
	tidalHeatingRate: number; // W

	// Collision properties
	impactVelocity: number; // km/s
	collisionProbability: number; // per Myr
	debrisProductionRate: number; // kg/yr
}

// Stellar Properties for System
export interface StellarProperties {
	// Primary star
	primaryMass: number; // Solar masses
	primaryAge: number; // years
	primaryMetallicity: number; // [Fe/H]
	primaryTemperature: number; // K
	primaryLuminosity: number; // Solar luminosities

	// Secondary star (if binary+)
	secondaryMass: number; // Solar masses
	binaryPeriod: number; // days
	binaryEccentricity: number; // 0-1
	binaryInclination: number; // degrees
	binarySeparation: number; // AU

	// Tertiary star (if triple+)
	tertiaryMass: number; // Solar masses
	tertiaryPeriod: number; // years
	tertiarySeparation: number; // AU

	// Stellar evolution
	mainSequenceLifetime: number; // years
	currentEvolutionPhase: string;
	stellarWindMassLossRate: number; // Solar masses/year
	magneticFieldStrength: number; // Gauss
	stellarActivityLevel: number; // 0-1
}

// Disk Properties
export interface DiskProperties {
	// Protoplanetary disk
	diskMass: number; // Solar masses
	diskRadius: number; // AU
	diskScaleHeight: number; // AU
	diskTemperature: number; // K (at 1 AU)
	diskViscosity: number; // α parameter

	// Dust properties
	dustToGasRatio: number; // by mass
	grainSizeDistribution: number; // power law index
	settlingTimescale: number; // years

	// Debris disk
	debrisDiskMass: number; // Earth masses
	debrisDiskRadius: number; // AU
	collisionalAge: number; // years
	stirringMechanism: string;

	// Gas disk evolution
	photoevaporationRate: number; // Solar masses/year
	diskDissipationTime: number; // years
	transitionalDiskPhase: boolean;
}

// Complete Solar System Type Definition
export interface SolarSystemTypeDefinition {
	class: SolarSystemClass;
	name: string;
	description: string;
	realWorldExample: string;
	observationalStatus: "confirmed" | "probable" | "theoretical" | "speculative";

	// System Architecture
	stellarMultiplicity: StellarMultiplicity;
	numberOfStars: number;
	numberOfPlanets: [number, number]; // [min, max]
	planetMassRange: [number, number]; // Earth masses (log10)
	orbitalPeriodRange: [number, number]; // days (log10)

	// Physical Properties
	stellarProperties: StellarProperties;
	orbitalDynamics: OrbitalDynamics;
	diskProperties: DiskProperties;
	habitabilityZone: HabitabilityZone;

	// Formation and Evolution
	formationMechanism: FormationMechanism[];
	formationTimescale: number; // years
	formationEfficiency: number; // 0-1
	migrationHistory: MigrationType[];
	resonanceTypes: ResonanceType[];

	// Observable Properties
	transitProbability: number; // 0-1
	radialVelocityAmplitude: number; // m/s
	astrometricSignal: number; // microarcseconds
	photometricVariability: number; // parts per million

	// Stability and Dynamics
	hillStabilityFactor: number;
	lyapunovTimescale: number; // years
	collisionalTimescale: number; // years
	escapeTimescale: number; // years

	// Environmental Factors
	galacticEnvironment: string;
	stellarDensity: number; // stars/pc³
	encounterRate: number; // encounters/Myr
	supernovaRate: number; // SN/Myr/kpc²

	// Visual Properties
	primaryColors: Color[];
	secondaryColors: Color[];
	diskColors: Color[];
	debrisColors: Color[];

	// Low-Poly Generation Parameters
	geometryComplexity: number; // 1-5
	orbitResolution: number; // number of orbit points
	renderingTechniques: string[];

	// Gameplay Properties
	discoverability: number; // 0-1 (rarer = lower)
	scientificValue: number; // 1-10
	colonizationDifficulty: number; // 1-10
	resourceAbundance: number; // 1-10
	explorationChallenges: string[];

	// Special Properties
	uniqueFeatures: string[];
	astrophysicalProcesses: string[];
	theoreticalBasis: string[];
	observationalChallenges: string[];

	// Research Applications
	planetFormationInsights: string[];
	stellarEvolutionInsights: string[];
	habitabilityImplications: string[];
	astrobiologyPotential: string[];
}

// Complete Solar System Database
export const SOLAR_SYSTEM_TYPES: Map<SolarSystemClass, SolarSystemTypeDefinition> = new Map([
	[
		SolarSystemClass.SINGLE_STAR,
		{
			class: SolarSystemClass.SINGLE_STAR,
			name: "Single-Star System",
			description: "Solar system with one central star, like our own Solar System",
			realWorldExample: "Solar System, Kepler-442, HD 40307",
			observationalStatus: "confirmed",

			stellarMultiplicity: StellarMultiplicity.SINGLE,
			numberOfStars: 1,
			numberOfPlanets: [0, 15],
			planetMassRange: [-2, 3], // 0.01 to 1000 Earth masses
			orbitalPeriodRange: [-1, 4], // 0.1 to 10,000 days

			stellarProperties: {
				primaryMass: 1.0, // Solar masses
				primaryAge: 4.6e9, // years
				primaryMetallicity: 0.0, // [Fe/H]
				primaryTemperature: 5778, // K
				primaryLuminosity: 1.0, // Solar luminosities
				secondaryMass: 0,
				binaryPeriod: 0,
				binaryEccentricity: 0,
				binaryInclination: 0,
				binarySeparation: 0,
				tertiaryMass: 0,
				tertiaryPeriod: 0,
				tertiarySeparation: 0,
				mainSequenceLifetime: 10e9, // years
				currentEvolutionPhase: "main_sequence",
				stellarWindMassLossRate: 2e-14, // Solar masses/year
				magneticFieldStrength: 1, // Gauss
				stellarActivityLevel: 0.1,
			},

			orbitalDynamics: {
				totalAngularMomentum: 3.15e43, // kg⋅m²/s
				systemAge: 4.6e9, // years
				dynamicalStability: 0.99,
				kozaiTimescale: 0, // Not applicable
				migrationTimescale: 1e8, // years
				diskLifetime: 3e6, // years
				gasDissipationTime: 3e6, // years
				resonanceStrength: 0.1,
				librationAmplitude: 10, // degrees
				chaosParameter: 1e-7, // Lyapunov exponent
				tidalQFactor: 100,
				tidalCircularizationTime: 1e9, // years
				tidalHeatingRate: 1e14, // W
				impactVelocity: 20, // km/s
				collisionProbability: 1e-8, // per year
				debrisProductionRate: 1e12, // kg/year
			},

			diskProperties: {
				diskMass: 0, // No disk for mature system
				diskRadius: 0,
				diskScaleHeight: 0,
				diskTemperature: 0,
				diskViscosity: 0,
				dustToGasRatio: 0,
				grainSizeDistribution: 0,
				settlingTimescale: 0,
				debrisDiskMass: 1e-6, // Earth masses (asteroid belt)
				debrisDiskRadius: 3, // AU
				collisionalAge: 4.6e9, // years
				stirringMechanism: "planetary_perturbations",
				photoevaporationRate: 0,
				diskDissipationTime: 3e6, // years (past)
				transitionalDiskPhase: false,
			},

			habitabilityZone: {
				innerEdge: 0.95, // AU
				outerEdge: 1.67, // AU
				optimumZone: 1.0, // AU
				snowLine: 2.7, // AU
				habitablePlanets: 1, // Earth
				tidallyLockedZone: 0.1, // AU
				runawayGreenhouseZone: 0.84, // AU
				maximumGreenhouseZone: 1.67, // AU
			},

			formationMechanism: [FormationMechanism.CORE_ACCRETION],
			formationTimescale: 100e6, // years
			formationEfficiency: 0.1,
			migrationHistory: [MigrationType.TYPE_II],
			resonanceTypes: [ResonanceType.FIRST_ORDER, ResonanceType.SECULAR_RESONANCE],

			transitProbability: 0.5, // Geometric probability
			radialVelocityAmplitude: 0.1, // m/s (Earth-like planet)
			astrometricSignal: 0.3, // microarcseconds
			photometricVariability: 10, // ppm

			hillStabilityFactor: 10,
			lyapunovTimescale: 5e6, // years
			collisionalTimescale: 1e8, // years
			escapeTimescale: 1e10, // years

			galacticEnvironment: "galactic_disk",
			stellarDensity: 0.14, // stars/pc³
			encounterRate: 0.2, // encounters/Myr
			supernovaRate: 1.2, // SN/Myr/kpc²

			primaryColors: [new Color(0xffff88), new Color(0x4169e1), new Color(0x228b22)],
			secondaryColors: [new Color(0xff6347), new Color(0x9370db), new Color(0xffd700)],
			diskColors: [new Color(0x8b4513), new Color(0xd2691e)],
			debrisColors: [new Color(0x696969), new Color(0xa0522d)],

			geometryComplexity: 3,
			orbitResolution: 128,
			renderingTechniques: ["elliptical_orbits", "planetary_textures", "ring_systems", "asteroid_belts"],

			discoverability: 0.8,
			scientificValue: 7,
			colonizationDifficulty: 3,
			resourceAbundance: 8,
			explorationChallenges: ["asteroid_impacts", "solar_radiation", "orbital_mechanics"],

			uniqueFeatures: ["habitable_zone", "diverse_planet_types", "stable_orbits", "asteroid_belt"],
			astrophysicalProcesses: ["planetary_formation", "tidal_evolution", "atmospheric_evolution"],
			theoreticalBasis: ["nebular_hypothesis", "core_accretion_model", "migration_theory"],
			observationalChallenges: ["radial_velocity", "transit_photometry", "direct_imaging"],

			planetFormationInsights: ["inside-out_formation", "giant_planet_migration", "terrestrial_planet_assembly"],
			stellarEvolutionInsights: ["main_sequence_evolution", "solar_wind_effects", "luminosity_evolution"],
			habitabilityImplications: ["continuous_habitable_zone", "water_delivery", "atmospheric_retention"],
			astrobiologyPotential: ["liquid_water", "chemical_diversity", "energy_sources"],
		},
	],

	[
		SolarSystemClass.BINARY_STAR,
		{
			class: SolarSystemClass.BINARY_STAR,
			name: "Binary Star System",
			description: "System with two stars, supporting circumbinary or S-type planetary orbits",
			realWorldExample: "Kepler-16, Kepler-47, Alpha Centauri",
			observationalStatus: "confirmed",

			stellarMultiplicity: StellarMultiplicity.CLOSE_BINARY,
			numberOfStars: 2,
			numberOfPlanets: [0, 10],
			planetMassRange: [-1, 2.5], // 0.1 to 300 Earth masses
			orbitalPeriodRange: [0, 3.5], // 1 to 3000 days

			stellarProperties: {
				primaryMass: 0.69, // Solar masses (Kepler-16A)
				primaryAge: 3e9, // years
				primaryMetallicity: -0.3, // [Fe/H]
				primaryTemperature: 4450, // K
				primaryLuminosity: 0.2, // Solar luminosities
				secondaryMass: 0.2, // Solar masses (Kepler-16B)
				binaryPeriod: 41.08, // days
				binaryEccentricity: 0.16,
				binaryInclination: 90.34, // degrees
				binarySeparation: 0.22, // AU
				tertiaryMass: 0,
				tertiaryPeriod: 0,
				tertiarySeparation: 0,
				mainSequenceLifetime: 15e9, // years
				currentEvolutionPhase: "main_sequence",
				stellarWindMassLossRate: 1e-14, // Solar masses/year
				magneticFieldStrength: 10, // Gauss
				stellarActivityLevel: 0.3,
			},

			orbitalDynamics: {
				totalAngularMomentum: 1e43, // kg⋅m²/s
				systemAge: 3e9, // years
				dynamicalStability: 0.85, // Reduced due to binary
				kozaiTimescale: 1e5, // years
				migrationTimescale: 5e7, // years
				diskLifetime: 1e6, // years (shortened)
				gasDissipationTime: 1e6, // years
				resonanceStrength: 0.3,
				librationAmplitude: 30, // degrees
				chaosParameter: 1e-5, // Higher chaos
				tidalQFactor: 50,
				tidalCircularizationTime: 1e8, // years
				tidalHeatingRate: 1e15, // W
				impactVelocity: 30, // km/s
				collisionProbability: 1e-7, // per year
				debrisProductionRate: 1e13, // kg/year
			},

			diskProperties: {
				diskMass: 0.01, // Solar masses (circumbinary disk)
				diskRadius: 5, // AU
				diskScaleHeight: 0.5, // AU
				diskTemperature: 150, // K (at 1 AU)
				diskViscosity: 0.01, // α parameter
				dustToGasRatio: 0.01,
				grainSizeDistribution: -3.5,
				settlingTimescale: 1e5, // years
				debrisDiskMass: 1e-5, // Earth masses
				debrisDiskRadius: 5, // AU
				collisionalAge: 3e9, // years
				stirringMechanism: "binary_perturbations",
				photoevaporationRate: 1e-10, // Solar masses/year
				diskDissipationTime: 1e6, // years
				transitionalDiskPhase: false,
			},

			habitabilityZone: {
				innerEdge: 0.6, // AU (circumbinary)
				outerEdge: 1.2, // AU
				optimumZone: 0.9, // AU
				snowLine: 1.8, // AU
				habitablePlanets: 0, // Typically none observed
				tidallyLockedZone: 0.3, // AU
				runawayGreenhouseZone: 0.5, // AU
				maximumGreenhouseZone: 1.2, // AU
			},

			formationMechanism: [FormationMechanism.CORE_ACCRETION, FormationMechanism.GRAVITATIONAL_INSTABILITY],
			formationTimescale: 200e6, // years
			formationEfficiency: 0.05, // Reduced efficiency
			migrationHistory: [MigrationType.TYPE_I, MigrationType.STOCHASTIC],
			resonanceTypes: [ResonanceType.MEAN_MOTION, ResonanceType.KOZAI_LIDOV],

			transitProbability: 0.3, // Reduced probability
			radialVelocityAmplitude: 50, // m/s (binary dominates)
			astrometricSignal: 10, // microarcseconds
			photometricVariability: 1000, // ppm (eclipses)

			hillStabilityFactor: 3,
			lyapunovTimescale: 1e4, // years
			collisionalTimescale: 1e7, // years
			escapeTimescale: 1e8, // years

			galacticEnvironment: "galactic_disk",
			stellarDensity: 0.14, // stars/pc³
			encounterRate: 0.2, // encounters/Myr
			supernovaRate: 1.2, // SN/Myr/kpc²

			primaryColors: [new Color(0xff8c00), new Color(0xff4500), new Color(0x8b0000)],
			secondaryColors: [new Color(0x4169e1), new Color(0x9370db), new Color(0x228b22)],
			diskColors: [new Color(0xb8860b), new Color(0xd2691e)],
			debrisColors: [new Color(0x778899), new Color(0x2f4f4f)],

			geometryComplexity: 4,
			orbitResolution: 256,
			renderingTechniques: ["binary_orbits", "circumbinary_planets", "tidal_effects", "eclipse_geometry"],

			discoverability: 0.3,
			scientificValue: 9,
			colonizationDifficulty: 8,
			resourceAbundance: 6,
			explorationChallenges: ["complex_dynamics", "radiation_environment", "tidal_forces"],

			uniqueFeatures: ["binary_stars", "circumbinary_planets", "complex_tides", "eclipsing_geometry"],
			astrophysicalProcesses: ["binary_evolution", "circumbinary_disk_dynamics", "kozai_oscillations"],
			theoreticalBasis: ["three_body_problem", "tidal_theory", "disk_planet_interaction"],
			observationalChallenges: ["eclipse_timing_variations", "binary_doppler_shifts", "complex_light_curves"],

			planetFormationInsights: ["disk_truncation", "migration_barriers", "eccentricity_excitation"],
			stellarEvolutionInsights: ["mass_transfer", "common_envelope_evolution", "stellar_mergers"],
			habitabilityImplications: ["variable_stellar_flux", "complex_seasons", "tidal_heating"],
			astrobiologyPotential: ["multiple_energy_sources", "complex_chemistry", "variable_environments"],
		},
	],

	[
		SolarSystemClass.COMPACT_SYSTEM,
		{
			class: SolarSystemClass.COMPACT_SYSTEM,
			name: "Compact Planetary System",
			description: "System with planets packed close to the star in tight, often resonant orbits",
			realWorldExample: "TRAPPIST-1, Kepler-11, HD 219134",
			observationalStatus: "confirmed",

			stellarMultiplicity: StellarMultiplicity.SINGLE,
			numberOfStars: 1,
			numberOfPlanets: [3, 8],
			planetMassRange: [-1, 1], // 0.1 to 10 Earth masses
			orbitalPeriodRange: [-1, 1.5], // 0.1 to 30 days

			stellarProperties: {
				primaryMass: 0.089, // Solar masses (TRAPPIST-1)
				primaryAge: 7.6e9, // years
				primaryMetallicity: 0.04, // [Fe/H]
				primaryTemperature: 2511, // K
				primaryLuminosity: 0.000525, // Solar luminosities
				secondaryMass: 0,
				binaryPeriod: 0,
				binaryEccentricity: 0,
				binaryInclination: 0,
				binarySeparation: 0,
				tertiaryMass: 0,
				tertiaryPeriod: 0,
				tertiarySeparation: 0,
				mainSequenceLifetime: 12e12, // years (M dwarf)
				currentEvolutionPhase: "main_sequence",
				stellarWindMassLossRate: 1e-15, // Solar masses/year
				magneticFieldStrength: 600, // Gauss
				stellarActivityLevel: 0.8,
			},

			orbitalDynamics: {
				totalAngularMomentum: 1e41, // kg⋅m²/s
				systemAge: 7.6e9, // years
				dynamicalStability: 0.95, // High stability in resonance
				kozaiTimescale: 0, // Not applicable
				migrationTimescale: 1e7, // years
				diskLifetime: 10e6, // years
				gasDissipationTime: 10e6, // years
				resonanceStrength: 0.8, // Strong resonances
				librationAmplitude: 5, // degrees (small)
				chaosParameter: 1e-8, // Very stable
				tidalQFactor: 50,
				tidalCircularizationTime: 1e6, // years (fast)
				tidalHeatingRate: 1e16, // W (significant)
				impactVelocity: 15, // km/s
				collisionProbability: 1e-9, // per year
				debrisProductionRate: 1e10, // kg/year
			},

			diskProperties: {
				diskMass: 0.001, // Solar masses (small disk)
				diskRadius: 1, // AU (compact)
				diskScaleHeight: 0.05, // AU
				diskTemperature: 300, // K (at 0.1 AU)
				diskViscosity: 0.001, // α parameter
				dustToGasRatio: 0.01,
				grainSizeDistribution: -3.5,
				settlingTimescale: 1e4, // years
				debrisDiskMass: 1e-8, // Earth masses
				debrisDiskRadius: 0.5, // AU
				collisionalAge: 7.6e9, // years
				stirringMechanism: "planetary_resonances",
				photoevaporationRate: 1e-12, // Solar masses/year
				diskDissipationTime: 10e6, // years
				transitionalDiskPhase: false,
			},

			habitabilityZone: {
				innerEdge: 0.011, // AU
				outerEdge: 0.054, // AU
				optimumZone: 0.028, // AU
				snowLine: 0.1, // AU
				habitablePlanets: 3, // TRAPPIST-1 e, f, g
				tidallyLockedZone: 0.1, // AU (all planets)
				runawayGreenhouseZone: 0.009, // AU
				maximumGreenhouseZone: 0.054, // AU
			},

			formationMechanism: [FormationMechanism.PEBBLE_ACCRETION, FormationMechanism.CORE_ACCRETION],
			formationTimescale: 50e6, // years
			formationEfficiency: 0.2, // High efficiency
			migrationHistory: [MigrationType.TYPE_I],
			resonanceTypes: [ResonanceType.FIRST_ORDER, ResonanceType.LAPLACE_RESONANCE],

			transitProbability: 0.8, // High probability (all aligned)
			radialVelocityAmplitude: 5, // m/s
			astrometricSignal: 0.1, // microarcseconds
			photometricVariability: 1000, // ppm (transits)

			hillStabilityFactor: 8,
			lyapunovTimescale: 1e7, // years
			collisionalTimescale: 1e9, // years
			escapeTimescale: 1e11, // years

			galacticEnvironment: "galactic_disk",
			stellarDensity: 0.14, // stars/pc³
			encounterRate: 0.2, // encounters/Myr
			supernovaRate: 1.2, // SN/Myr/kpc²

			primaryColors: [new Color(0xff4500), new Color(0x8b0000), new Color(0x654321)],
			secondaryColors: [new Color(0x4169e1), new Color(0x228b22), new Color(0x9370db)],
			diskColors: [new Color(0x2f4f4f), new Color(0x556b2f)],
			debrisColors: [new Color(0x2f4f4f), new Color(0x696969)],

			geometryComplexity: 5,
			orbitResolution: 512,
			renderingTechniques: ["resonant_chains", "tidal_locking", "atmospheric_escape", "stellar_irradiation"],

			discoverability: 0.6,
			scientificValue: 10,
			colonizationDifficulty: 9,
			resourceAbundance: 7,
			explorationChallenges: ["tidal_locking", "stellar_flares", "atmospheric_escape", "close_orbits"],

			uniqueFeatures: ["resonant_chains", "tidally_locked_planets", "multiple_habitable_worlds", "compact_architecture"],
			astrophysicalProcesses: ["tidal_evolution", "atmospheric_escape", "resonant_capture", "stellar_irradiation"],
			theoreticalBasis: ["disk_migration_theory", "resonant_trapping", "atmospheric_escape_models"],
			observationalChallenges: ["transit_timing_variations", "atmospheric_characterization", "mass_measurements"],

			planetFormationInsights: ["rapid_formation", "resonant_trapping", "water_delivery_mechanisms"],
			stellarEvolutionInsights: ["M_dwarf_activity", "extended_pre_main_sequence", "magnetic_field_evolution"],
			habitabilityImplications: ["tidal_locking_effects", "atmospheric_retention", "stellar_variability"],
			astrobiologyPotential: ["multiple_habitable_worlds", "atmospheric_interactions", "tidal_heating"],
		},
	],

	[
		SolarSystemClass.RESONANT_CHAIN,
		{
			class: SolarSystemClass.RESONANT_CHAIN,
			name: "Resonant Chain System",
			description: "System with planets locked in a chain of mean-motion resonances",
			realWorldExample: "Kepler-223, TOI-178, K2-138",
			observationalStatus: "confirmed",

			stellarMultiplicity: StellarMultiplicity.SINGLE,
			numberOfStars: 1,
			numberOfPlanets: [4, 8],
			planetMassRange: [-0.5, 1.5], // 0.3 to 30 Earth masses
			orbitalPeriodRange: [0, 2], // 1 to 100 days

			stellarProperties: {
				primaryMass: 1.13, // Solar masses (Kepler-223)
				primaryAge: 3.5e9, // years
				primaryMetallicity: 0.1, // [Fe/H]
				primaryTemperature: 5930, // K
				primaryLuminosity: 1.5, // Solar luminosities
				secondaryMass: 0,
				binaryPeriod: 0,
				binaryEccentricity: 0,
				binaryInclination: 0,
				binarySeparation: 0,
				tertiaryMass: 0,
				tertiaryPeriod: 0,
				tertiarySeparation: 0,
				mainSequenceLifetime: 8e9, // years
				currentEvolutionPhase: "main_sequence",
				stellarWindMassLossRate: 3e-14, // Solar masses/year
				magneticFieldStrength: 2, // Gauss
				stellarActivityLevel: 0.2,
			},

			orbitalDynamics: {
				totalAngularMomentum: 5e42, // kg⋅m²/s
				systemAge: 3.5e9, // years
				dynamicalStability: 0.98, // Very stable due to resonances
				kozaiTimescale: 0, // Not applicable
				migrationTimescale: 2e7, // years
				diskLifetime: 5e6, // years
				gasDissipationTime: 5e6, // years
				resonanceStrength: 0.9, // Very strong
				librationAmplitude: 2, // degrees (very small)
				chaosParameter: 1e-9, // Extremely stable
				tidalQFactor: 100,
				tidalCircularizationTime: 1e7, // years
				tidalHeatingRate: 1e15, // W
				impactVelocity: 25, // km/s
				collisionProbability: 1e-10, // per year (very low)
				debrisProductionRate: 1e9, // kg/year
			},

			diskProperties: {
				diskMass: 0.05, // Solar masses
				diskRadius: 10, // AU
				diskScaleHeight: 0.8, // AU
				diskTemperature: 200, // K (at 1 AU)
				diskViscosity: 0.005, // α parameter
				dustToGasRatio: 0.01,
				grainSizeDistribution: -3.5,
				settlingTimescale: 5e4, // years
				debrisDiskMass: 1e-6, // Earth masses
				debrisDiskRadius: 8, // AU
				collisionalAge: 3.5e9, // years
				stirringMechanism: "resonant_perturbations",
				photoevaporationRate: 1e-11, // Solar masses/year
				diskDissipationTime: 5e6, // years
				transitionalDiskPhase: false,
			},

			habitabilityZone: {
				innerEdge: 1.1, // AU
				outerEdge: 2.0, // AU
				optimumZone: 1.5, // AU
				snowLine: 3.0, // AU
				habitablePlanets: 0, // Inner system
				tidallyLockedZone: 0.15, // AU
				runawayGreenhouseZone: 0.9, // AU
				maximumGreenhouseZone: 2.0, // AU
			},

			formationMechanism: [FormationMechanism.CORE_ACCRETION, FormationMechanism.PEBBLE_ACCRETION],
			formationTimescale: 80e6, // years
			formationEfficiency: 0.15,
			migrationHistory: [MigrationType.TYPE_I],
			resonanceTypes: [ResonanceType.FIRST_ORDER, ResonanceType.SECOND_ORDER, ResonanceType.LAPLACE_RESONANCE],

			transitProbability: 0.9, // Very high (perfect alignment)
			radialVelocityAmplitude: 10, // m/s
			astrometricSignal: 0.5, // microarcseconds
			photometricVariability: 2000, // ppm (multiple transits)

			hillStabilityFactor: 15,
			lyapunovTimescale: 1e8, // years (very stable)
			collisionalTimescale: 1e10, // years
			escapeTimescale: 1e12, // years

			galacticEnvironment: "galactic_disk",
			stellarDensity: 0.14, // stars/pc³
			encounterRate: 0.2, // encounters/Myr
			supernovaRate: 1.2, // SN/Myr/kpc²

			primaryColors: [new Color(0xffff88), new Color(0x87ceeb), new Color(0x98fb98)],
			secondaryColors: [new Color(0xff69b4), new Color(0xdda0dd), new Color(0xf0e68c)],
			diskColors: [new Color(0xffd700), new Color(0xffa500)],
			debrisColors: [new Color(0xc0c0c0), new Color(0x808080)],

			geometryComplexity: 5,
			orbitResolution: 1024,
			renderingTechniques: ["resonance_visualization", "libration_motion", "synchronized_orbits", "transit_geometry"],

			discoverability: 0.4,
			scientificValue: 10,
			colonizationDifficulty: 6,
			resourceAbundance: 8,
			explorationChallenges: ["precise_navigation", "resonant_perturbations", "synchronized_dynamics"],

			uniqueFeatures: ["perfect_resonant_chain", "synchronized_orbits", "stable_architecture", "predictable_dynamics"],
			astrophysicalProcesses: ["resonant_capture", "convergent_migration", "eccentricity_damping"],
			theoreticalBasis: ["resonant_theory", "migration_models", "N_body_dynamics"],
			observationalChallenges: ["precise_period_ratios", "transit_timing_variations", "dynamical_modeling"],

			planetFormationInsights: ["convergent_migration", "resonant_trapping", "disk_planet_interactions"],
			stellarEvolutionInsights: ["stellar_mass_effects", "disk_lifetime", "migration_timescales"],
			habitabilityImplications: ["orbital_stability", "tidal_heating", "atmospheric_dynamics"],
			astrobiologyPotential: ["stable_climates", "predictable_environments", "synchronized_evolution"],
		},
	],

	[
		SolarSystemClass.DEBRIS_RICH_SYSTEM,
		{
			class: SolarSystemClass.DEBRIS_RICH_SYSTEM,
			name: "Debris-Rich System",
			description: "System with significant dust, debris disks, and ongoing collisional activity",
			realWorldExample: "Beta Pictoris, Fomalhaut, HR 4796A",
			observationalStatus: "confirmed",

			stellarMultiplicity: StellarMultiplicity.SINGLE,
			numberOfStars: 1,
			numberOfPlanets: [0, 6],
			planetMassRange: [0, 3], // 1 to 1000 Earth masses
			orbitalPeriodRange: [1, 4], // 10 to 10,000 days

			stellarProperties: {
				primaryMass: 1.75, // Solar masses (Beta Pictoris)
				primaryAge: 23e6, // years (young)
				primaryMetallicity: 0.05, // [Fe/H]
				primaryTemperature: 8052, // K
				primaryLuminosity: 8.7, // Solar luminosities
				secondaryMass: 0,
				binaryPeriod: 0,
				binaryEccentricity: 0,
				binaryInclination: 0,
				binarySeparation: 0,
				tertiaryMass: 0,
				tertiaryPeriod: 0,
				tertiarySeparation: 0,
				mainSequenceLifetime: 2e9, // years
				currentEvolutionPhase: "main_sequence",
				stellarWindMassLossRate: 1e-13, // Solar masses/year
				magneticFieldStrength: 20, // Gauss
				stellarActivityLevel: 0.9,
			},

			orbitalDynamics: {
				totalAngularMomentum: 1e44, // kg⋅m²/s
				systemAge: 23e6, // years
				dynamicalStability: 0.7, // Reduced due to debris
				kozaiTimescale: 0, // Not applicable
				migrationTimescale: 1e6, // years (ongoing)
				diskLifetime: 100e6, // years (extended)
				gasDissipationTime: 10e6, // years
				resonanceStrength: 0.2,
				librationAmplitude: 45, // degrees
				chaosParameter: 1e-4, // High chaos
				tidalQFactor: 10,
				tidalCircularizationTime: 1e5, // years
				tidalHeatingRate: 1e17, // W
				impactVelocity: 50, // km/s
				collisionProbability: 1e-5, // per year (very high)
				debrisProductionRate: 1e15, // kg/year (massive)
			},

			diskProperties: {
				diskMass: 0.1, // Solar masses (massive debris disk)
				diskRadius: 1000, // AU (extended)
				diskScaleHeight: 10, // AU
				diskTemperature: 50, // K (at 100 AU)
				diskViscosity: 0.1, // α parameter
				dustToGasRatio: 0.1, // High dust content
				grainSizeDistribution: -3.0, // Shallow (more large grains)
				settlingTimescale: 1e6, // years
				debrisDiskMass: 100, // Earth masses
				debrisDiskRadius: 500, // AU
				collisionalAge: 23e6, // years
				stirringMechanism: "planetary_perturbations",
				photoevaporationRate: 1e-9, // Solar masses/year
				diskDissipationTime: 100e6, // years
				transitionalDiskPhase: true,
			},

			habitabilityZone: {
				innerEdge: 2.5, // AU
				outerEdge: 4.5, // AU
				optimumZone: 3.5, // AU
				snowLine: 6.0, // AU
				habitablePlanets: 0, // Too much debris
				tidallyLockedZone: 0.3, // AU
				runawayGreenhouseZone: 2.0, // AU
				maximumGreenhouseZone: 4.5, // AU
			},

			formationMechanism: [FormationMechanism.CORE_ACCRETION, FormationMechanism.COLLISION_CASCADE],
			formationTimescale: 500e6, // years (slow due to debris)
			formationEfficiency: 0.02, // Very low
			migrationHistory: [MigrationType.STOCHASTIC, MigrationType.TYPE_II],
			resonanceTypes: [ResonanceType.SECULAR_RESONANCE],

			transitProbability: 0.1, // Low (debris obscuration)
			radialVelocityAmplitude: 100, // m/s
			astrometricSignal: 10, // microarcseconds
			photometricVariability: 500, // ppm (debris transits)

			hillStabilityFactor: 2,
			lyapunovTimescale: 1e3, // years (very unstable)
			collisionalTimescale: 1e5, // years (rapid)
			escapeTimescale: 1e7, // years

			galacticEnvironment: "galactic_disk",
			stellarDensity: 0.14, // stars/pc³
			encounterRate: 0.2, // encounters/Myr
			supernovaRate: 1.2, // SN/Myr/kpc²

			primaryColors: [new Color(0x87ceeb), new Color(0xffd700), new Color(0xff6347)],
			secondaryColors: [new Color(0x8b4513), new Color(0x2f4f4f), new Color(0x696969)],
			diskColors: [new Color(0xdaa520), new Color(0xd2691e), new Color(0xa0522d)],
			debrisColors: [new Color(0x696969), new Color(0x778899), new Color(0x2f4f4f)],

			geometryComplexity: 4,
			orbitResolution: 256,
			renderingTechniques: ["debris_disks", "collisional_cascades", "dust_scattering", "impact_effects"],

			discoverability: 0.7,
			scientificValue: 9,
			colonizationDifficulty: 10,
			resourceAbundance: 4,
			explorationChallenges: ["debris_impacts", "dust_storms", "unstable_orbits", "radiation_hazards"],

			uniqueFeatures: ["massive_debris_disk", "ongoing_collisions", "dust_asymmetries", "young_age"],
			astrophysicalProcesses: ["collisional_cascade", "Poynting_Robertson_drag", "radiation_pressure"],
			theoreticalBasis: ["debris_disk_evolution", "collisional_models", "dust_dynamics"],
			observationalChallenges: ["infrared_excess", "scattered_light_imaging", "debris_disk_structure"],

			planetFormationInsights: ["late_heavy_bombardment", "terrestrial_planet_formation", "water_delivery"],
			stellarEvolutionInsights: ["young_star_properties", "stellar_wind_effects", "disk_dispersal"],
			habitabilityImplications: ["impact_sterilization", "atmospheric_erosion", "debris_shielding"],
			astrobiologyPotential: ["prebiotic_chemistry", "impact_delivery", "environmental_stress"],
		},
	],

	[
		SolarSystemClass.PROTO_SYSTEM,
		{
			class: SolarSystemClass.PROTO_SYSTEM,
			name: "Protoplanetary System",
			description: "Young system still forming planets from a circumstellar disk",
			realWorldExample: "HL Tauri, TW Hydrae, HD 163296",
			observationalStatus: "confirmed",

			stellarMultiplicity: StellarMultiplicity.SINGLE,
			numberOfStars: 1,
			numberOfPlanets: [0, 3], // Few formed planets
			planetMassRange: [-1, 2], // 0.1 to 100 Earth masses
			orbitalPeriodRange: [1, 3], // 10 to 1000 days

			stellarProperties: {
				primaryMass: 0.55, // Solar masses (HL Tauri)
				primaryAge: 1e6, // years (very young)
				primaryMetallicity: 0.0, // [Fe/H]
				primaryTemperature: 4000, // K
				primaryLuminosity: 0.7, // Solar luminosities
				secondaryMass: 0,
				binaryPeriod: 0,
				binaryEccentricity: 0,
				binaryInclination: 0,
				binarySeparation: 0,
				tertiaryMass: 0,
				tertiaryPeriod: 0,
				tertiarySeparation: 0,
				mainSequenceLifetime: 20e9, // years
				currentEvolutionPhase: "pre_main_sequence",
				stellarWindMassLossRate: 1e-12, // Solar masses/year
				magneticFieldStrength: 1000, // Gauss
				stellarActivityLevel: 1.0,
			},

			orbitalDynamics: {
				totalAngularMomentum: 1e42, // kg⋅m²/s
				systemAge: 1e6, // years
				dynamicalStability: 0.5, // Very unstable
				kozaiTimescale: 0, // Not applicable
				migrationTimescale: 1e5, // years (rapid)
				diskLifetime: 3e6, // years (current)
				gasDissipationTime: 3e6, // years
				resonanceStrength: 0.05, // Very weak
				librationAmplitude: 90, // degrees (chaotic)
				chaosParameter: 1e-2, // Extremely chaotic
				tidalQFactor: 1,
				tidalCircularizationTime: 1e4, // years
				tidalHeatingRate: 1e18, // W
				impactVelocity: 10, // km/s
				collisionProbability: 1e-3, // per year (very high)
				debrisProductionRate: 1e16, // kg/year
			},

			diskProperties: {
				diskMass: 0.3, // Solar masses (massive)
				diskRadius: 100, // AU
				diskScaleHeight: 8, // AU
				diskTemperature: 300, // K (at 1 AU)
				diskViscosity: 0.01, // α parameter
				dustToGasRatio: 0.01,
				grainSizeDistribution: -3.5,
				settlingTimescale: 1e4, // years
				debrisDiskMass: 1000, // Earth masses
				debrisDiskRadius: 100, // AU
				collisionalAge: 1e6, // years
				stirringMechanism: "turbulence",
				photoevaporationRate: 1e-8, // Solar masses/year
				diskDissipationTime: 3e6, // years
				transitionalDiskPhase: false,
			},

			habitabilityZone: {
				innerEdge: 0.6, // AU
				outerEdge: 1.2, // AU
				optimumZone: 0.9, // AU
				snowLine: 2.0, // AU
				habitablePlanets: 0, // None yet formed
				tidallyLockedZone: 0.1, // AU
				runawayGreenhouseZone: 0.5, // AU
				maximumGreenhouseZone: 1.2, // AU
			},

			formationMechanism: [FormationMechanism.CORE_ACCRETION, FormationMechanism.STREAMING_INSTABILITY],
			formationTimescale: 10e6, // years (ongoing)
			formationEfficiency: 0.5, // High during formation
			migrationHistory: [MigrationType.TYPE_I],
			resonanceTypes: [ResonanceType.NONE],

			transitProbability: 0.01, // Very low (no planets yet)
			radialVelocityAmplitude: 1, // m/s
			astrometricSignal: 0.01, // microarcseconds
			photometricVariability: 10000, // ppm (disk variability)

			hillStabilityFactor: 1,
			lyapunovTimescale: 100, // years
			collisionalTimescale: 1e4, // years
			escapeTimescale: 1e6, // years

			galacticEnvironment: "star_forming_region",
			stellarDensity: 100, // stars/pc³
			encounterRate: 10, // encounters/Myr
			supernovaRate: 10, // SN/Myr/kpc²

			primaryColors: [new Color(0xff4500), new Color(0xff6347), new Color(0xffd700)],
			secondaryColors: [new Color(0x8b4513), new Color(0xd2691e), new Color(0xa0522d)],
			diskColors: [new Color(0xffa500), new Color(0xff8c00), new Color(0xdaa520)],
			debrisColors: [new Color(0x2f4f4f), new Color(0x696969), new Color(0x778899)],

			geometryComplexity: 5,
			orbitResolution: 512,
			renderingTechniques: ["protoplanetary_disk", "gap_structures", "spiral_waves", "accretion_flows"],

			discoverability: 0.9,
			scientificValue: 10,
			colonizationDifficulty: 10,
			resourceAbundance: 10,
			explorationChallenges: ["disk_turbulence", "stellar_variability", "formation_chaos", "high_temperatures"],

			uniqueFeatures: ["active_planet_formation", "massive_disk", "gap_structures", "young_star"],
			astrophysicalProcesses: ["disk_accretion", "planetesimal_formation", "gap_opening", "stellar_outflows"],
			theoreticalBasis: ["core_accretion_model", "disk_instability", "magnetorotational_instability"],
			observationalChallenges: ["ALMA_observations", "near_infrared_imaging", "spectroscopy"],

			planetFormationInsights: ["early_formation_stages", "disk_planet_interactions", "migration_processes"],
			stellarEvolutionInsights: ["pre_main_sequence_evolution", "disk_dispersal", "stellar_winds"],
			habitabilityImplications: ["water_snowline", "organic_chemistry", "early_bombardment"],
			astrobiologyPotential: ["prebiotic_synthesis", "water_delivery", "organic_molecules"],
		},
	],

	[
		SolarSystemClass.POST_STELLAR_SYSTEM,
		{
			class: SolarSystemClass.POST_STELLAR_SYSTEM,
			name: "Post-Stellar System",
			description: "System around evolved stellar remnants like white dwarfs or pulsars",
			realWorldExample: "PSR B1257+12, WD 1145+017, PSR J1719-1438",
			observationalStatus: "confirmed",

			stellarMultiplicity: StellarMultiplicity.SINGLE,
			numberOfStars: 1,
			numberOfPlanets: [1, 4],
			planetMassRange: [-2, 1], // 0.01 to 10 Earth masses
			orbitalPeriodRange: [-2, 2], // 0.01 to 100 days

			stellarProperties: {
				primaryMass: 1.4, // Solar masses (neutron star)
				primaryAge: 1e9, // years (post-supernova)
				primaryMetallicity: 0.0, // [Fe/H]
				primaryTemperature: 1e6, // K (neutron star surface)
				primaryLuminosity: 0.0001, // Solar luminosities
				secondaryMass: 0,
				binaryPeriod: 0,
				binaryEccentricity: 0,
				binaryInclination: 0,
				binarySeparation: 0,
				tertiaryMass: 0,
				tertiaryPeriod: 0,
				tertiarySeparation: 0,
				mainSequenceLifetime: 0, // Already evolved
				currentEvolutionPhase: "neutron_star",
				stellarWindMassLossRate: 1e-16, // Solar masses/year
				magneticFieldStrength: 1e12, // Gauss
				stellarActivityLevel: 0.1,
			},

			orbitalDynamics: {
				totalAngularMomentum: 1e40, // kg⋅m²/s
				systemAge: 1e9, // years
				dynamicalStability: 0.9, // Stable after formation
				kozaiTimescale: 0, // Not applicable
				migrationTimescale: 1e8, // years
				diskLifetime: 0, // No disk
				gasDissipationTime: 0, // No gas
				resonanceStrength: 0.1,
				librationAmplitude: 10, // degrees
				chaosParameter: 1e-6, // Stable
				tidalQFactor: 1000, // High Q
				tidalCircularizationTime: 1e10, // years
				tidalHeatingRate: 1e12, // W
				impactVelocity: 100, // km/s
				collisionProbability: 1e-12, // per year
				debrisProductionRate: 1e6, // kg/year
			},

			diskProperties: {
				diskMass: 0, // No disk
				diskRadius: 0,
				diskScaleHeight: 0,
				diskTemperature: 0,
				diskViscosity: 0,
				dustToGasRatio: 0,
				grainSizeDistribution: 0,
				settlingTimescale: 0,
				debrisDiskMass: 1e-10, // Earth masses
				debrisDiskRadius: 1, // AU
				collisionalAge: 1e9, // years
				stirringMechanism: "none",
				photoevaporationRate: 0,
				diskDissipationTime: 0,
				transitionalDiskPhase: false,
			},

			habitabilityZone: {
				innerEdge: 0.001, // AU (very close)
				outerEdge: 0.002, // AU
				optimumZone: 0.0015, // AU
				snowLine: 0.01, // AU
				habitablePlanets: 0, // Unlikely to be habitable
				tidallyLockedZone: 1, // AU (all planets locked)
				runawayGreenhouseZone: 0.0005, // AU
				maximumGreenhouseZone: 0.002, // AU
			},

			formationMechanism: [FormationMechanism.STELLAR_CAPTURE, FormationMechanism.DISK_FRAGMENTATION],
			formationTimescale: 1e6, // years (post-supernova)
			formationEfficiency: 0.001, // Very low
			migrationHistory: [MigrationType.STELLAR_EVOLUTION],
			resonanceTypes: [ResonanceType.FIRST_ORDER],

			transitProbability: 0.8, // High (aligned system)
			radialVelocityAmplitude: 1000, // m/s (massive star)
			astrometricSignal: 100, // microarcseconds
			photometricVariability: 100, // ppm (pulsar timing)

			hillStabilityFactor: 20,
			lyapunovTimescale: 1e9, // years
			collisionalTimescale: 1e12, // years
			escapeTimescale: 1e13, // years

			galacticEnvironment: "galactic_disk",
			stellarDensity: 0.14, // stars/pc³
			encounterRate: 0.2, // encounters/Myr
			supernovaRate: 1.2, // SN/Myr/kpc²

			primaryColors: [new Color(0x9966ff), new Color(0x00ffff), new Color(0xff00ff)],
			secondaryColors: [new Color(0x0000ff), new Color(0x8a2be2), new Color(0x4b0082)],
			diskColors: [new Color(0x2f4f4f), new Color(0x000000)],
			debrisColors: [new Color(0x696969), new Color(0x2f4f4f)],

			geometryComplexity: 3,
			orbitResolution: 128,
			renderingTechniques: ["pulsar_beams", "magnetic_fields", "radiation_zones", "extreme_orbits"],

			discoverability: 0.1,
			scientificValue: 10,
			colonizationDifficulty: 10,
			resourceAbundance: 1,
			explorationChallenges: ["intense_radiation", "magnetic_fields", "tidal_forces", "extreme_physics"],

			uniqueFeatures: ["neutron_star_host", "pulsar_timing", "extreme_magnetic_fields", "post_supernova_formation"],
			astrophysicalProcesses: ["pulsar_emission", "magnetospheric_physics", "relativistic_effects"],
			theoreticalBasis: ["neutron_star_physics", "general_relativity", "plasma_physics"],
			observationalChallenges: ["pulsar_timing", "X_ray_observations", "gravitational_effects"],

			planetFormationInsights: ["second_generation_planets", "fallback_disks", "supernova_survival"],
			stellarEvolutionInsights: ["neutron_star_formation", "supernova_explosions", "stellar_remnants"],
			habitabilityImplications: ["extreme_radiation", "tidal_heating", "magnetic_shielding"],
			astrobiologyPotential: ["extremophile_analogs", "radiation_resistance", "exotic_chemistry"],
		},
	],
]);

// Utility Functions for Solar System Classification
export function getSolarSystemTypeByClass(systemClass: SolarSystemClass): SolarSystemTypeDefinition | undefined {
	return SOLAR_SYSTEM_TYPES.get(systemClass);
}

export function getRandomSolarSystemType(): SolarSystemTypeDefinition {
	const types = Array.from(SOLAR_SYSTEM_TYPES.values());
	const weightedTypes = types.filter((type) => Math.random() < type.discoverability);
	return weightedTypes.length > 0 ? weightedTypes[Math.floor(Math.random() * weightedTypes.length)] : types[Math.floor(Math.random() * types.length)];
}

export function getSolarSystemTypesByStarCount(starCount: number): SolarSystemTypeDefinition[] {
	return Array.from(SOLAR_SYSTEM_TYPES.values()).filter((type) => type.numberOfStars === starCount);
}

export function getSolarSystemTypesByAge(minAge: number, maxAge: number): SolarSystemTypeDefinition[] {
	return Array.from(SOLAR_SYSTEM_TYPES.values()).filter((type) => type.stellarProperties.primaryAge >= minAge && type.stellarProperties.primaryAge <= maxAge);
}

export function calculateHabitabilityZone(stellarMass: number, stellarLuminosity: number): HabitabilityZone {
	// Conservative and optimistic habitable zone boundaries
	const innerEdge = Math.sqrt(stellarLuminosity / 1.1); // AU
	const outerEdge = Math.sqrt(stellarLuminosity / 0.53); // AU
	const optimumZone = Math.sqrt(stellarLuminosity); // AU
	const snowLine = 2.7 * Math.sqrt(stellarLuminosity); // AU

	return {
		innerEdge,
		outerEdge,
		optimumZone,
		snowLine,
		habitablePlanets: 0, // To be determined
		tidallyLockedZone: 0.1 * Math.sqrt(stellarLuminosity),
		runawayGreenhouseZone: innerEdge * 0.9,
		maximumGreenhouseZone: outerEdge,
	};
}

export function calculateOrbitalResonance(period1: number, period2: number): { ratio: [number, number]; strength: number } {
	const ratio = period2 / period1;

	// Check for common resonances
	const commonResonances = [
		[2, 1],
		[3, 2],
		[4, 3],
		[5, 4],
		[5, 3],
		[7, 4],
		[3, 1],
		[4, 1],
		[5, 1],
	];

	let bestMatch = [1, 1];
	let bestStrength = 0;

	for (const [p, q] of commonResonances) {
		const theoreticalRatio = p / q;
		const deviation = Math.abs(ratio - theoreticalRatio) / theoreticalRatio;

		if (deviation < 0.05) {
			// Within 5%
			const strength = 1 - deviation * 20; // Convert to strength
			if (strength > bestStrength) {
				bestMatch = [p, q];
				bestStrength = strength;
			}
		}
	}

	return {
		ratio: bestMatch as [number, number],
		strength: bestStrength,
	};
}

export function calculateHillStability(planets: { mass: number; semiMajorAxis: number }[], stellarMass: number): number {
	let minStabilityFactor = Infinity;

	for (let i = 0; i < planets.length - 1; i++) {
		const planet1 = planets[i];
		const planet2 = planets[i + 1];

		const deltaA = planet2.semiMajorAxis - planet1.semiMajorAxis;
		const avgA = (planet1.semiMajorAxis + planet2.semiMajorAxis) / 2;
		const totalMass = (planet1.mass + planet2.mass) / 333000; // Convert to solar masses

		const hillRadius = avgA * Math.pow(totalMass / (3 * stellarMass), 1 / 3);
		const stabilityFactor = deltaA / (2.4 * hillRadius);

		minStabilityFactor = Math.min(minStabilityFactor, stabilityFactor);
	}

	return minStabilityFactor;
}

export function calculateMigrationTimescale(planetMass: number, diskMass: number, semiMajorAxis: number): number {
	// Type I migration timescale (in years)
	const earthMass = 5.97e24; // kg
	const solarMass = 1.989e30; // kg
	const au = 1.496e11; // m

	const mass = planetMass * earthMass;
	const diskMassSI = diskMass * solarMass;
	const aSI = semiMajorAxis * au;

	// Simplified Type I migration formula
	const timescale = (solarMass / diskMassSI) * Math.pow(aSI / au, 2) * (solarMass / mass) * 1e6;

	return timescale * 365.25 * 24 * 3600; // Convert to years
}

export function calculateTidalLockingTime(planetMass: number, planetRadius: number, semiMajorAxis: number, stellarMass: number, qFactor: number = 100): number {
	// Tidal locking timescale calculation
	const G = 6.674e-11; // m³/kg/s²
	const earthMass = 5.97e24; // kg
	const earthRadius = 6.371e6; // m
	const solarMass = 1.989e30; // kg
	const au = 1.496e11; // m

	const mass = planetMass * earthMass;
	const radius = planetRadius * earthRadius;
	const a = semiMajorAxis * au;
	const mStar = stellarMass * solarMass;

	// Tidal locking timescale (simplified)
	const timescale = ((((qFactor / 63) * (mass * radius * radius)) / mStar) * Math.pow(a / radius, 6)) / ((G * mStar) / (a * a * a));

	return timescale / (365.25 * 24 * 3600); // Convert to years
}

export function assessSystemStability(system: SolarSystemTypeDefinition): { stable: boolean; timescale: number; factors: string[] } {
	const factors: string[] = [];
	let stable = true;
	let timescale = system.lyapunovTimescale;

	// Check various stability factors
	if (system.hillStabilityFactor < 3) {
		stable = false;
		factors.push("Hill sphere overlap");
	}

	if (system.orbitalDynamics.chaosParameter > 1e-3) {
		stable = false;
		factors.push("Chaotic dynamics");
	}

	if (system.stellarMultiplicity !== StellarMultiplicity.SINGLE && system.orbitalDynamics.kozaiTimescale < 1e6) {
		stable = false;
		factors.push("Kozai-Lidov oscillations");
	}

	if (system.orbitalDynamics.collisionalTimescale < system.stellarProperties.primaryAge) {
		stable = false;
		factors.push("Collisional disruption");
	}

	return { stable, timescale, factors };
}

export function generateSystemResources(system: SolarSystemTypeDefinition): Map<string, number> {
	const resources = new Map<string, number>();

	// Basic resources based on system properties
	resources.set("stellar_energy", Math.log10(system.stellarProperties.primaryLuminosity + 0.01));
	resources.set("planetary_materials", system.numberOfPlanets[1] / 10);
	resources.set("orbital_stability", system.orbitalDynamics.dynamicalStability);

	// Type-specific resources
	switch (system.class) {
		case SolarSystemClass.SINGLE_STAR:
			resources.set("habitable_zones", 1.0);
			resources.set("stable_orbits", 0.9);
			resources.set("predictable_dynamics", 0.95);
			break;
		case SolarSystemClass.BINARY_STAR:
			resources.set("complex_dynamics", 1.0);
			resources.set("tidal_heating", 0.8);
			resources.set("variable_irradiation", 0.9);
			break;
		case SolarSystemClass.COMPACT_SYSTEM:
			resources.set("resonant_stability", 1.0);
			resources.set("synchronized_motion", 0.95);
			resources.set("tidal_interactions", 0.8);
			break;
		case SolarSystemClass.DEBRIS_RICH_SYSTEM:
			resources.set("raw_materials", 1.0);
			resources.set("active_formation", 0.9);
			resources.set("impact_hazards", -0.8);
			break;
		case SolarSystemClass.PROTO_SYSTEM:
			resources.set("formation_potential", 1.0);
			resources.set("disk_materials", 0.95);
			resources.set("stellar_variability", -0.7);
			break;
		case SolarSystemClass.POST_STELLAR_SYSTEM:
			resources.set("exotic_physics", 1.0);
			resources.set("timing_precision", 0.99);
			resources.set("radiation_hazard", -0.9);
			break;
	}

	return resources;
}

export function predictSystemEvolution(system: SolarSystemTypeDefinition, timeStep: number): Partial<SolarSystemTypeDefinition> {
	const evolution: Partial<SolarSystemTypeDefinition> = {};

	// Stellar evolution
	const newAge = system.stellarProperties.primaryAge + timeStep;
	const mainSequenceLifetime = system.stellarProperties.mainSequenceLifetime;

	if (newAge > mainSequenceLifetime) {
		evolution.stellarProperties = {
			...system.stellarProperties,
			primaryAge: newAge,
			currentEvolutionPhase: "post_main_sequence",
			primaryLuminosity: system.stellarProperties.primaryLuminosity * 10, // Red giant phase
			primaryTemperature: system.stellarProperties.primaryTemperature * 0.7,
		};
	}

	// Orbital evolution
	if (system.orbitalDynamics.migrationTimescale < timeStep) {
		evolution.orbitalDynamics = {
			...system.orbitalDynamics,
			dynamicalStability: system.orbitalDynamics.dynamicalStability * 0.9,
			chaosParameter: system.orbitalDynamics.chaosParameter * 1.1,
		};
	}

	return evolution;
}

export function classifySystemByArchitecture(planets: { mass: number; period: number; semiMajorAxis: number }[]): SolarSystemClass {
	if (planets.length === 0) return SolarSystemClass.SINGLE_STAR;

	// Check for compact systems (all planets within 1 AU)
	if (planets.every((p) => p.semiMajorAxis < 1)) {
		return SolarSystemClass.COMPACT_SYSTEM;
	}

	// Check for resonant chains
	let resonantCount = 0;
	for (let i = 0; i < planets.length - 1; i++) {
		const ratio = planets[i + 1].period / planets[i].period;
		if (Math.abs(ratio - 2) < 0.1 || Math.abs(ratio - 1.5) < 0.1) {
			resonantCount++;
		}
	}

	if (resonantCount >= planets.length - 2) {
		return SolarSystemClass.RESONANT_CHAIN;
	}

	// Check for gas giant dominated
	const gasGiants = planets.filter((p) => p.mass > 100); // Earth masses
	if (gasGiants.length > planets.length / 2) {
		return SolarSystemClass.GAS_GIANT_DOMINATED;
	}

	// Check for rocky dominated
	const rockyPlanets = planets.filter((p) => p.mass < 10); // Earth masses
	if (rockyPlanets.length > planets.length * 0.8) {
		return SolarSystemClass.ROCKY_DOMINATED;
	}

	return SolarSystemClass.SINGLE_STAR; // Default
}

export function calculateSystemHabitability(system: SolarSystemTypeDefinition, planets: { mass: number; semiMajorAxis: number; atmosphere: boolean }[]): number {
	let habitabilityScore = 0;

	for (const planet of planets) {
		// Check if planet is in habitable zone
		if (planet.semiMajorAxis >= system.habitabilityZone.innerEdge && planet.semiMajorAxis <= system.habitabilityZone.outerEdge) {
			let planetScore = 0.5; // Base score for being in HZ

			// Mass factor (Earth-like is optimal)
			const massRatio = planet.mass / 1; // Earth masses
			if (massRatio >= 0.5 && massRatio <= 2) {
				planetScore += 0.3;
			}

			// Atmosphere factor
			if (planet.atmosphere) {
				planetScore += 0.2;
			}

			habitabilityScore = Math.max(habitabilityScore, planetScore);
		}
	}

	// System-wide factors
	if (system.orbitalDynamics.dynamicalStability > 0.9) {
		habitabilityScore *= 1.2;
	}

	if (system.stellarProperties.stellarActivityLevel > 0.5) {
		habitabilityScore *= 0.8; // High activity reduces habitability
	}

	return Math.min(1, habitabilityScore);
}

export function getObservationalSignatures(system: SolarSystemTypeDefinition): string[] {
	const signatures: string[] = [];

	if (system.transitProbability > 0.1) {
		signatures.push("transit_photometry");
	}

	if (system.radialVelocityAmplitude > 1) {
		signatures.push("radial_velocity");
	}

	if (system.astrometricSignal > 0.1) {
		signatures.push("astrometry");
	}

	if (system.photometricVariability > 100) {
		signatures.push("photometric_variability");
	}

	if (system.diskProperties.debrisDiskMass > 1e-6) {
		signatures.push("infrared_excess");
	}

	if (system.stellarMultiplicity !== StellarMultiplicity.SINGLE) {
		signatures.push("binary_signatures");
	}

	if (system.class === SolarSystemClass.POST_STELLAR_SYSTEM) {
		signatures.push("pulsar_timing");
	}

	return signatures;
}
