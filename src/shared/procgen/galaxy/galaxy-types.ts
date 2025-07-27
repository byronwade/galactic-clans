/**
 * @file galaxy-types.ts
 * @description Comprehensive galaxy classification system with scientifically accurate galaxy types
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Defines all galaxy types, morphologies, and physical properties
 * for realistic galaxy generation and cosmic structure simulation.
 */

import { Vector3, Color } from "three";

// Galaxy Classifications (Hubble-de Vaucouleurs System)
export enum GalaxyClass {
	// Spiral Galaxies
	SPIRAL_SA = "spiral_sa", // Sa - Tight spiral arms
	SPIRAL_SAB = "spiral_sab", // Sab - Intermediate spiral
	SPIRAL_SB = "spiral_sb", // Sb - Normal spiral arms
	SPIRAL_SBC = "spiral_sbc", // Sbc - Intermediate spiral
	SPIRAL_SC = "spiral_sc", // Sc - Open spiral arms

	// Barred Spiral Galaxies
	BARRED_SBA = "barred_sba", // SBa - Tight barred spiral
	BARRED_SBAB = "barred_sbab", // SBab - Intermediate barred
	BARRED_SBB = "barred_sbb", // SBb - Normal barred spiral
	BARRED_SBBC = "barred_sbbc", // SBbc - Intermediate barred
	BARRED_SBC = "barred_sbc", // SBc - Open barred spiral

	// Elliptical Galaxies
	ELLIPTICAL_E0 = "elliptical_e0", // E0 - Circular
	ELLIPTICAL_E1 = "elliptical_e1", // E1 - Slightly flattened
	ELLIPTICAL_E2 = "elliptical_e2", // E2 - Moderately flattened
	ELLIPTICAL_E3 = "elliptical_e3", // E3 - More flattened
	ELLIPTICAL_E4 = "elliptical_e4", // E4 - Significantly flattened
	ELLIPTICAL_E5 = "elliptical_e5", // E5 - Highly flattened
	ELLIPTICAL_E6 = "elliptical_e6", // E6 - Very flattened
	ELLIPTICAL_E7 = "elliptical_e7", // E7 - Extremely flattened

	// Lenticular Galaxies
	LENTICULAR_S0 = "lenticular_s0", // S0 - Pure lenticular
	LENTICULAR_S0A = "lenticular_s0a", // S0a - Early lenticular

	// Irregular Galaxies
	IRREGULAR_I = "irregular_i", // Irr I - Magellanic type
	IRREGULAR_II = "irregular_ii", // Irr II - Amorphous
	DWARF_IRREGULAR = "dwarf_irregular", // dIrr - Dwarf irregular

	// Dwarf Galaxies
	DWARF_ELLIPTICAL = "dwarf_elliptical", // dE - Dwarf elliptical
	DWARF_SPHEROIDAL = "dwarf_spheroidal", // dSph - Dwarf spheroidal
	DWARF_SPIRAL = "dwarf_spiral", // dS - Dwarf spiral

	// Active Galaxies
	STARBURST = "starburst", // High star formation rate
	SEYFERT_I = "seyfert_i", // Type 1 Seyfert
	SEYFERT_II = "seyfert_ii", // Type 2 Seyfert
	QUASAR = "quasar", // Quasi-stellar object
	BLAZAR = "blazar", // Beamed AGN
	RADIO_GALAXY = "radio_galaxy", // Strong radio emission

	// Peculiar Galaxies
	PECULIAR = "peculiar", // Disturbed morphology
	RING = "ring", // Ring galaxy
	POLAR_RING = "polar_ring", // Polar ring galaxy
	SHELL = "shell", // Shell galaxy
	INTERACTING = "interacting", // Galaxy pair/group
	MERGER = "merger", // Ongoing merger

	// Extreme Objects
	ULTRA_COMPACT_DWARF = "ultra_compact_dwarf", // UCD
	FOSSIL_GROUP = "fossil_group", // Fossil galaxy group
	GREEN_PEA = "green_pea", // Compact starburst
	LYMAN_ALPHA_EMITTER = "lyman_alpha_emitter", // LAE
}

// Galaxy Evolution Stages
export enum GalaxyEvolutionStage {
	PRIMORDIAL = "primordial", // Early universe formation
	FORMATION = "formation", // Active assembly
	MATURE = "mature", // Stable evolution
	INTERACTING = "interacting", // Galaxy interactions
	POST_MERGER = "post_merger", // Post-merger evolution
	QUENCHED = "quenched", // Star formation ceased
	DISRUPTED = "disrupted", // Tidal disruption
	FOSSIL = "fossil", // End-stage remnant
}

// Stellar Population Types
export enum StellarPopulation {
	POPULATION_I = "population_i", // Young, metal-rich stars
	POPULATION_II = "population_ii", // Old, metal-poor stars
	POPULATION_III = "population_iii", // Primordial stars
	INTERMEDIATE = "intermediate", // Mixed populations
	STARBURST = "starburst", // Recent massive star formation
	POST_STARBURST = "post_starburst", // Post-starburst population
}

// Physical Properties
export interface GalaxyPhysics {
	// Mass Properties
	stellarMass: number; // Solar masses
	totalMass: number; // Including dark matter
	darkMatterFraction: number; // 0-1
	gasMass: number; // Solar masses

	// Size Properties
	effectiveRadius: number; // kpc
	scaleLength: number; // kpc for disks
	scaleHeight: number; // kpc for disks

	// Kinematics
	rotationVelocity: number; // km/s
	velocityDispersion: number; // km/s
	angularMomentum: number; // Specific angular momentum

	// Star Formation
	starFormationRate: number; // Solar masses per year
	starFormationEfficiency: number; // 0-1
	gasDepletion: number; // Gyr

	// Nuclear Properties
	centralBlackHoleMass: number; // Solar masses
	blackHoleAccretionRate: number; // Solar masses per year
	eddingtonRatio: number; // L/L_Edd

	// Environmental Properties
	environmentalDensity: number; // Galaxies per Mpc³
	clusterMembership: boolean;
	satelliteCount: number;

	// Chemical Properties
	metallicity: number; // [Fe/H]
	oxygenAbundance: number; // 12 + log(O/H)
	alphaEnhancement: number; // [α/Fe]
}

// Morphological Features
export interface GalaxyMorphology {
	// Overall Structure
	hasNucleus: boolean;
	hasBulge: boolean;
	hasDisk: boolean;
	hasHalo: boolean;

	// Spiral Features
	armCount: number;
	armTightness: number; // Pitch angle
	armSymmetry: number; // 0-1
	hasBar: boolean;
	barStrength: number; // 0-1
	barLength: number; // kpc

	// Elliptical Features
	ellipticity: number; // 0-1
	triaxiality: number; // 0-1
	diskiness: number; // -1 to 1

	// Irregular Features
	asymmetryIndex: number; // 0-1
	clumpiness: number; // 0-1
	fragmentationLevel: number; // 0-1

	// Active Features
	hasActiveNucleus: boolean;
	jetLength: number; // kpc
	jetPower: number; // erg/s

	// Environmental Features
	tidalTails: boolean;
	tidalTailLength: number; // kpc
	bridgeFeatures: boolean;
	ringStructures: boolean;
}

// Visual Characteristics for Low-Poly Generation
export interface GalaxyVisualFeatures {
	// Core Structure
	nuclearBulge: boolean;
	centralBar: boolean;
	spiralArms: boolean;
	diskStructure: boolean;
	stellarHalo: boolean;

	// Active Features
	activeNucleus: boolean;
	jetEmission: boolean;
	radioBubbles: boolean;
	accretionDisk: boolean;
	coronalLines: boolean;

	// Star Formation
	starFormingRegions: boolean;
	hiiRegions: boolean;
	dustLanes: boolean;
	molecularClouds: boolean;
	supernovaRemnants: boolean;

	// Environmental
	tidalStreams: boolean;
	satelliteGalaxies: boolean;
	galaxyInteraction: boolean;
	mergerSignatures: boolean;

	// Observational
	surfaceBrightness: number;
	colorGradient: boolean;
	metallicityGradient: boolean;
	ageGradient: boolean;

	// Special Effects
	gravitationalLensing: boolean;
	darkMatterClumps: boolean;
	cosmicWebFilaments: boolean;
}

// Galaxy System Properties
export interface GalaxySystemData {
	// Local Group Context
	localGroupMember: boolean;
	distanceFromMilkyWay: number; // Mpc
	radialVelocity: number; // km/s

	// Large Scale Structure
	filamentMember: boolean;
	voidGalaxy: boolean;
	clusterMember: boolean;
	wallMember: boolean;

	// Cosmic Evolution
	formationRedshift: number;
	majorMergerHistory: number[];
	quenchingEpoch: number; // Gyr

	// Dark Matter Context
	haloMass: number; // Solar masses
	haloConcentration: number;
	subhaloCount: number;

	// Observational Properties
	redshift: number;
	lookbackTime: number; // Gyr
	comovingDistance: number; // Mpc
	luminosityDistance: number; // Mpc

	// Multi-wavelength Properties
	xrayLuminosity: number; // erg/s
	radioLuminosity: number; // erg/s
	infraredLuminosity: number; // erg/s
	uvLuminosity: number; // erg/s
}

// Complete Galaxy Type Definition
export interface GalaxyTypeDefinition {
	class: GalaxyClass;
	name: string;
	description: string;
	realWorldExample: string;
	hubbleType: string;
	evolutionStage: GalaxyEvolutionStage;

	// Physical Ranges
	massRange: [number, number]; // Solar masses (log10)
	sizeRange: [number, number]; // kpc
	starFormationRange: [number, number]; // Solar masses per year
	metallicityRange: [number, number]; // [Fe/H]
	ageRange: [number, number]; // Gyr

	// Stellar Population
	dominantPopulation: StellarPopulation;
	populationMix: Map<StellarPopulation, number>;

	// Physics
	galaxyPhysics: GalaxyPhysics;

	// Morphology
	morphology: GalaxyMorphology;

	// Visual Properties
	primaryColors: Color[];
	secondaryColors: Color[];
	visualFeatures: GalaxyVisualFeatures;

	// System Properties
	systemData: GalaxySystemData;

	// Formation and Evolution
	formationMechanism: string[];
	evolutionPath: GalaxyEvolutionStage[];
	fateScenarios: string[];

	// Low-Poly Generation Parameters
	geometryComplexity: number; // 1-5
	starDensity: number; // 0-1
	effectDensity: number; // 0-1
	renderingTechniques: string[];

	// Gameplay Properties
	discoverability: number; // 0-1 (rarer = lower)
	scientificValue: number; // 1-10
	explorationDifficulty: number; // 0-10
	resourceValue: number; // 1-10

	// Special Properties
	uniqueFeatures: string[];
	astrophysicalProcesses: string[];
	observationalChallenges: string[];
}

// Complete Galaxy Database
export const GALAXY_TYPES: Map<GalaxyClass, GalaxyTypeDefinition> = new Map([
	[
		GalaxyClass.SPIRAL_SB,
		{
			class: GalaxyClass.SPIRAL_SB,
			name: "Normal Spiral Galaxy",
			description: "Classic spiral galaxy with well-defined arms and active star formation",
			realWorldExample: "Andromeda Galaxy (M31), Whirlpool Galaxy (M51)",
			hubbleType: "Sb",
			evolutionStage: GalaxyEvolutionStage.MATURE,

			massRange: [10, 12], // 10^10 to 10^12 solar masses
			sizeRange: [10, 50], // 10-50 kpc
			starFormationRange: [0.1, 10], // 0.1-10 solar masses/year
			metallicityRange: [-0.5, 0.5], // [Fe/H]
			ageRange: [8, 13], // 8-13 Gyr

			dominantPopulation: StellarPopulation.POPULATION_I,
			populationMix: new Map([
				[StellarPopulation.POPULATION_I, 0.7],
				[StellarPopulation.POPULATION_II, 0.3],
			]),

			galaxyPhysics: {
				stellarMass: 5e10,
				totalMass: 1e12,
				darkMatterFraction: 0.85,
				gasMass: 5e9,
				effectiveRadius: 3.5,
				scaleLength: 2.5,
				scaleHeight: 0.3,
				rotationVelocity: 220,
				velocityDispersion: 30,
				angularMomentum: 550,
				starFormationRate: 2.0,
				starFormationEfficiency: 0.02,
				gasDepletion: 2.5,
				centralBlackHoleMass: 1e8,
				blackHoleAccretionRate: 0.01,
				eddingtonRatio: 0.001,
				environmentalDensity: 1.0,
				clusterMembership: false,
				satelliteCount: 5,
				metallicity: 0.0,
				oxygenAbundance: 8.7,
				alphaEnhancement: 0.0,
			},

			morphology: {
				hasNucleus: true,
				hasBulge: true,
				hasDisk: true,
				hasHalo: true,
				armCount: 2,
				armTightness: 15, // degrees
				armSymmetry: 0.8,
				hasBar: false,
				barStrength: 0,
				barLength: 0,
				ellipticity: 0.1,
				triaxiality: 0.1,
				diskiness: 0.5,
				asymmetryIndex: 0.1,
				clumpiness: 0.3,
				fragmentationLevel: 0.2,
				hasActiveNucleus: false,
				jetLength: 0,
				jetPower: 0,
				tidalTails: false,
				tidalTailLength: 0,
				bridgeFeatures: false,
				ringStructures: false,
			},

			primaryColors: [new Color(0x4169e1), new Color(0x87ceeb), new Color(0xffd700)],
			secondaryColors: [new Color(0xff6347), new Color(0xffa500), new Color(0xdc143c)],

			visualFeatures: {
				nuclearBulge: true,
				centralBar: false,
				spiralArms: true,
				diskStructure: true,
				stellarHalo: true,
				activeNucleus: false,
				jetEmission: false,
				radioBubbles: false,
				accretionDisk: false,
				coronalLines: false,
				starFormingRegions: true,
				hiiRegions: true,
				dustLanes: true,
				molecularClouds: true,
				supernovaRemnants: true,
				tidalStreams: false,
				satelliteGalaxies: true,
				galaxyInteraction: false,
				mergerSignatures: false,
				surfaceBrightness: 22.0,
				colorGradient: true,
				metallicityGradient: true,
				ageGradient: true,
				gravitationalLensing: false,
				darkMatterClumps: true,
				cosmicWebFilaments: false,
			},

			systemData: {
				localGroupMember: false,
				distanceFromMilkyWay: 10,
				radialVelocity: 500,
				filamentMember: true,
				voidGalaxy: false,
				clusterMember: false,
				wallMember: true,
				formationRedshift: 2.0,
				majorMergerHistory: [1.0, 3.0],
				quenchingEpoch: 0,
				haloMass: 1e12,
				haloConcentration: 10,
				subhaloCount: 20,
				redshift: 0.01,
				lookbackTime: 0.14,
				comovingDistance: 40,
				luminosityDistance: 40.4,
				xrayLuminosity: 1e38,
				radioLuminosity: 1e36,
				infraredLuminosity: 1e44,
				uvLuminosity: 1e42,
			},

			formationMechanism: ["cold accretion", "minor mergers", "disk instabilities"],
			evolutionPath: [GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.MATURE],
			fateScenarios: ["continued evolution", "eventual merger with Andromeda"],

			geometryComplexity: 4,
			starDensity: 0.7,
			effectDensity: 0.6,
			renderingTechniques: ["spiral wave generation", "star formation tracers", "dust extinction"],

			discoverability: 0.6,
			scientificValue: 8,
			explorationDifficulty: 4,
			resourceValue: 7,

			uniqueFeatures: ["grand design spiral pattern", "active star formation", "metallicity gradient"],
			astrophysicalProcesses: ["density wave theory", "stellar feedback", "galactic fountain"],
			observationalChallenges: ["distance measurement", "extinction correction", "population synthesis"],
		},
	],

	[
		GalaxyClass.BARRED_SBB,
		{
			class: GalaxyClass.BARRED_SBB,
			name: "Barred Spiral Galaxy",
			description: "Spiral galaxy with prominent central bar structure driving spiral arms",
			realWorldExample: "Milky Way, NGC 1300, M109",
			hubbleType: "SBb",
			evolutionStage: GalaxyEvolutionStage.MATURE,

			massRange: [10.5, 12.5],
			sizeRange: [15, 60],
			starFormationRange: [0.5, 15],
			metallicityRange: [-0.3, 0.7],
			ageRange: [7, 12],

			dominantPopulation: StellarPopulation.POPULATION_I,
			populationMix: new Map([
				[StellarPopulation.POPULATION_I, 0.65],
				[StellarPopulation.POPULATION_II, 0.35],
			]),

			galaxyPhysics: {
				stellarMass: 8e10,
				totalMass: 1.5e12,
				darkMatterFraction: 0.82,
				gasMass: 8e9,
				effectiveRadius: 4.2,
				scaleLength: 3.0,
				scaleHeight: 0.35,
				rotationVelocity: 240,
				velocityDispersion: 35,
				angularMomentum: 720,
				starFormationRate: 3.5,
				starFormationEfficiency: 0.025,
				gasDepletion: 2.3,
				centralBlackHoleMass: 2e8,
				blackHoleAccretionRate: 0.02,
				eddingtonRatio: 0.002,
				environmentalDensity: 0.8,
				clusterMembership: false,
				satelliteCount: 8,
				metallicity: 0.1,
				oxygenAbundance: 8.8,
				alphaEnhancement: 0.1,
			},

			morphology: {
				hasNucleus: true,
				hasBulge: true,
				hasDisk: true,
				hasHalo: true,
				armCount: 2,
				armTightness: 12,
				armSymmetry: 0.9,
				hasBar: true,
				barStrength: 0.7,
				barLength: 3.5,
				ellipticity: 0.15,
				triaxiality: 0.2,
				diskiness: 0.6,
				asymmetryIndex: 0.05,
				clumpiness: 0.4,
				fragmentationLevel: 0.15,
				hasActiveNucleus: false,
				jetLength: 0,
				jetPower: 0,
				tidalTails: false,
				tidalTailLength: 0,
				bridgeFeatures: false,
				ringStructures: true,
			},

			primaryColors: [new Color(0x1e90ff), new Color(0x87cefa), new Color(0xffa500)],
			secondaryColors: [new Color(0xff4500), new Color(0xdaa520), new Color(0xcd853f)],

			visualFeatures: {
				nuclearBulge: true,
				centralBar: true,
				spiralArms: true,
				diskStructure: true,
				stellarHalo: true,
				activeNucleus: false,
				jetEmission: false,
				radioBubbles: false,
				accretionDisk: false,
				coronalLines: false,
				starFormingRegions: true,
				hiiRegions: true,
				dustLanes: true,
				molecularClouds: true,
				supernovaRemnants: true,
				tidalStreams: false,
				satelliteGalaxies: true,
				galaxyInteraction: false,
				mergerSignatures: false,
				surfaceBrightness: 21.5,
				colorGradient: true,
				metallicityGradient: true,
				ageGradient: true,
				gravitationalLensing: false,
				darkMatterClumps: true,
				cosmicWebFilaments: false,
			},

			systemData: {
				localGroupMember: true,
				distanceFromMilkyWay: 0,
				radialVelocity: 0,
				filamentMember: true,
				voidGalaxy: false,
				clusterMember: false,
				wallMember: false,
				formationRedshift: 1.8,
				majorMergerHistory: [2.0, 4.0],
				quenchingEpoch: 0,
				haloMass: 1.5e12,
				haloConcentration: 12,
				subhaloCount: 25,
				redshift: 0,
				lookbackTime: 0,
				comovingDistance: 0,
				luminosityDistance: 0,
				xrayLuminosity: 2e38,
				radioLuminosity: 1.5e36,
				infraredLuminosity: 1.2e44,
				uvLuminosity: 8e41,
			},

			formationMechanism: ["bar-driven evolution", "gas inflow", "secular processes"],
			evolutionPath: [GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.MATURE],
			fateScenarios: ["Andromeda collision", "continued bar evolution"],

			geometryComplexity: 5,
			starDensity: 0.8,
			effectDensity: 0.7,
			renderingTechniques: ["bar potential modeling", "resonance structures", "gas dynamics"],

			discoverability: 0.8,
			scientificValue: 10,
			explorationDifficulty: 1,
			resourceValue: 10,

			uniqueFeatures: ["central stellar bar", "resonance-driven spiral arms", "enhanced star formation"],
			astrophysicalProcesses: ["bar-disk dynamics", "Lindblad resonances", "gas channeling"],
			observationalChallenges: ["foreground extinction", "stellar crowding", "kinematic modeling"],
		},
	],

	[
		GalaxyClass.ELLIPTICAL_E4,
		{
			class: GalaxyClass.ELLIPTICAL_E4,
			name: "Elliptical Galaxy",
			description: "Massive elliptical galaxy with old stellar population and little gas",
			realWorldExample: "M87, M49, NGC 4472",
			hubbleType: "E4",
			evolutionStage: GalaxyEvolutionStage.QUENCHED,

			massRange: [11, 13.5],
			sizeRange: [20, 200],
			starFormationRange: [0, 0.1],
			metallicityRange: [0, 1.0],
			ageRange: [10, 13],

			dominantPopulation: StellarPopulation.POPULATION_II,
			populationMix: new Map([
				[StellarPopulation.POPULATION_II, 0.9],
				[StellarPopulation.POPULATION_I, 0.1],
			]),

			galaxyPhysics: {
				stellarMass: 5e11,
				totalMass: 1e13,
				darkMatterFraction: 0.9,
				gasMass: 1e8,
				effectiveRadius: 15,
				scaleLength: 0,
				scaleHeight: 0,
				rotationVelocity: 50,
				velocityDispersion: 300,
				angularMomentum: 100,
				starFormationRate: 0.01,
				starFormationEfficiency: 0.001,
				gasDepletion: 100,
				centralBlackHoleMass: 1e9,
				blackHoleAccretionRate: 0.1,
				eddingtonRatio: 0.01,
				environmentalDensity: 10,
				clusterMembership: true,
				satelliteCount: 50,
				metallicity: 0.5,
				oxygenAbundance: 9.2,
				alphaEnhancement: 0.3,
			},

			morphology: {
				hasNucleus: true,
				hasBulge: false,
				hasDisk: false,
				hasHalo: true,
				armCount: 0,
				armTightness: 0,
				armSymmetry: 0,
				hasBar: false,
				barStrength: 0,
				barLength: 0,
				ellipticity: 0.4,
				triaxiality: 0.6,
				diskiness: -0.5,
				asymmetryIndex: 0.02,
				clumpiness: 0.1,
				fragmentationLevel: 0.05,
				hasActiveNucleus: true,
				jetLength: 100,
				jetPower: 1e44,
				tidalTails: false,
				tidalTailLength: 0,
				bridgeFeatures: false,
				ringStructures: false,
			},

			primaryColors: [new Color(0xffd700), new Color(0xffa500), new Color(0xf4a460)],
			secondaryColors: [new Color(0xffebcd), new Color(0xffe4b5), new Color(0xdaa520)],

			visualFeatures: {
				nuclearBulge: false,
				centralBar: false,
				spiralArms: false,
				diskStructure: false,
				stellarHalo: true,
				activeNucleus: true,
				jetEmission: true,
				radioBubbles: true,
				accretionDisk: true,
				coronalLines: true,
				starFormingRegions: false,
				hiiRegions: false,
				dustLanes: false,
				molecularClouds: false,
				supernovaRemnants: false,
				tidalStreams: true,
				satelliteGalaxies: true,
				galaxyInteraction: false,
				mergerSignatures: true,
				surfaceBrightness: 20.0,
				colorGradient: true,
				metallicityGradient: true,
				ageGradient: false,
				gravitationalLensing: true,
				darkMatterClumps: true,
				cosmicWebFilaments: true,
			},

			systemData: {
				localGroupMember: false,
				distanceFromMilkyWay: 50,
				radialVelocity: 1200,
				filamentMember: false,
				voidGalaxy: false,
				clusterMember: true,
				wallMember: false,
				formationRedshift: 3.0,
				majorMergerHistory: [0.5, 1.0, 2.0, 5.0],
				quenchingEpoch: 8.0,
				haloMass: 1e13,
				haloConcentration: 5,
				subhaloCount: 100,
				redshift: 0.1,
				lookbackTime: 1.3,
				comovingDistance: 400,
				luminosityDistance: 440,
				xrayLuminosity: 1e42,
				radioLuminosity: 1e40,
				infraredLuminosity: 1e43,
				uvLuminosity: 1e39,
			},

			formationMechanism: ["major mergers", "monolithic collapse", "dry mergers"],
			evolutionPath: [GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.POST_MERGER, GalaxyEvolutionStage.QUENCHED],
			fateScenarios: ["continued growth", "cluster cannibalism", "disruption"],

			geometryComplexity: 2,
			starDensity: 0.9,
			effectDensity: 0.3,
			renderingTechniques: ["Sersic profile", "velocity dispersion", "X-ray emission"],

			discoverability: 0.3,
			scientificValue: 9,
			explorationDifficulty: 7,
			resourceValue: 5,

			uniqueFeatures: ["massive black hole", "old stellar population", "X-ray halo"],
			astrophysicalProcesses: ["AGN feedback", "galactic cannibalism", "dynamical friction"],
			observationalChallenges: ["surface brightness profiles", "stellar kinematics", "dark matter content"],
		},
	],

	[
		GalaxyClass.IRREGULAR_I,
		{
			class: GalaxyClass.IRREGULAR_I,
			name: "Irregular Galaxy",
			description: "Asymmetric galaxy with active star formation and chaotic structure",
			realWorldExample: "Large Magellanic Cloud, Small Magellanic Cloud, M82",
			hubbleType: "Irr I",
			evolutionStage: GalaxyEvolutionStage.FORMATION,

			massRange: [8, 11],
			sizeRange: [3, 20],
			starFormationRange: [0.1, 50],
			metallicityRange: [-1.5, 0],
			ageRange: [0.1, 10],

			dominantPopulation: StellarPopulation.POPULATION_I,
			populationMix: new Map([
				[StellarPopulation.POPULATION_I, 0.8],
				[StellarPopulation.STARBURST, 0.2],
			]),

			galaxyPhysics: {
				stellarMass: 1e9,
				totalMass: 1e10,
				darkMatterFraction: 0.7,
				gasMass: 3e9,
				effectiveRadius: 2.0,
				scaleLength: 1.5,
				scaleHeight: 0.5,
				rotationVelocity: 50,
				velocityDispersion: 15,
				angularMomentum: 75,
				starFormationRate: 0.5,
				starFormationEfficiency: 0.1,
				gasDepletion: 6.0,
				centralBlackHoleMass: 1e5,
				blackHoleAccretionRate: 0.001,
				eddingtonRatio: 0.1,
				environmentalDensity: 0.1,
				clusterMembership: false,
				satelliteCount: 2,
				metallicity: -0.7,
				oxygenAbundance: 8.0,
				alphaEnhancement: -0.2,
			},

			morphology: {
				hasNucleus: false,
				hasBulge: false,
				hasDisk: false,
				hasHalo: false,
				armCount: 0,
				armTightness: 0,
				armSymmetry: 0,
				hasBar: false,
				barStrength: 0,
				barLength: 0,
				ellipticity: 0.3,
				triaxiality: 0.8,
				diskiness: 0,
				asymmetryIndex: 0.7,
				clumpiness: 0.9,
				fragmentationLevel: 0.8,
				hasActiveNucleus: false,
				jetLength: 0,
				jetPower: 0,
				tidalTails: true,
				tidalTailLength: 10,
				bridgeFeatures: true,
				ringStructures: false,
			},

			primaryColors: [new Color(0x0066ff), new Color(0x4169e1), new Color(0xffffff)],
			secondaryColors: [new Color(0xff1493), new Color(0xff6347), new Color(0xffa500)],

			visualFeatures: {
				nuclearBulge: false,
				centralBar: false,
				spiralArms: false,
				diskStructure: false,
				stellarHalo: false,
				activeNucleus: false,
				jetEmission: false,
				radioBubbles: false,
				accretionDisk: false,
				coronalLines: false,
				starFormingRegions: true,
				hiiRegions: true,
				dustLanes: true,
				molecularClouds: true,
				supernovaRemnants: true,
				tidalStreams: true,
				satelliteGalaxies: false,
				galaxyInteraction: true,
				mergerSignatures: false,
				surfaceBrightness: 25.0,
				colorGradient: false,
				metallicityGradient: false,
				ageGradient: false,
				gravitationalLensing: false,
				darkMatterClumps: false,
				cosmicWebFilaments: false,
			},

			systemData: {
				localGroupMember: true,
				distanceFromMilkyWay: 0.05,
				radialVelocity: 100,
				filamentMember: false,
				voidGalaxy: false,
				clusterMember: false,
				wallMember: false,
				formationRedshift: 0.5,
				majorMergerHistory: [],
				quenchingEpoch: 0,
				haloMass: 1e10,
				haloConcentration: 15,
				subhaloCount: 5,
				redshift: 0.001,
				lookbackTime: 0.01,
				comovingDistance: 0.2,
				luminosityDistance: 0.2,
				xrayLuminosity: 1e37,
				radioLuminosity: 1e35,
				infraredLuminosity: 1e42,
				uvLuminosity: 1e41,
			},

			formationMechanism: ["tidal interactions", "ram pressure stripping", "starburst triggered"],
			evolutionPath: [GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.INTERACTING],
			fateScenarios: ["merger with Milky Way", "continued interaction", "tidal disruption"],

			geometryComplexity: 3,
			starDensity: 0.4,
			effectDensity: 0.9,
			renderingTechniques: ["stochastic star formation", "tidal modeling", "gas dynamics"],

			discoverability: 0.7,
			scientificValue: 7,
			explorationDifficulty: 3,
			resourceValue: 6,

			uniqueFeatures: ["chaotic morphology", "high gas fraction", "ongoing star formation"],
			astrophysicalProcesses: ["tidal interactions", "ram pressure", "stellar feedback"],
			observationalChallenges: ["low surface brightness", "complex kinematics", "distance uncertainties"],
		},
	],

	[
		GalaxyClass.QUASAR,
		{
			class: GalaxyClass.QUASAR,
			name: "Quasar",
			description: "Extremely luminous active galactic nucleus powered by supermassive black hole",
			realWorldExample: "3C 273, 3C 48, SDSS J1030+0524",
			hubbleType: "AGN",
			evolutionStage: GalaxyEvolutionStage.FORMATION,

			massRange: [11.5, 13],
			sizeRange: [10, 100],
			starFormationRange: [10, 1000],
			metallicityRange: [-0.5, 0.5],
			ageRange: [0.5, 3],

			dominantPopulation: StellarPopulation.STARBURST,
			populationMix: new Map([
				[StellarPopulation.STARBURST, 0.6],
				[StellarPopulation.POPULATION_I, 0.4],
			]),

			galaxyPhysics: {
				stellarMass: 2e11,
				totalMass: 5e12,
				darkMatterFraction: 0.8,
				gasMass: 5e10,
				effectiveRadius: 8,
				scaleLength: 6,
				scaleHeight: 1,
				rotationVelocity: 400,
				velocityDispersion: 200,
				angularMomentum: 2400,
				starFormationRate: 100,
				starFormationEfficiency: 0.1,
				gasDepletion: 0.5,
				centralBlackHoleMass: 1e10,
				blackHoleAccretionRate: 10,
				eddingtonRatio: 1.0,
				environmentalDensity: 5,
				clusterMembership: false,
				satelliteCount: 20,
				metallicity: 0.2,
				oxygenAbundance: 9.0,
				alphaEnhancement: 0.2,
			},

			morphology: {
				hasNucleus: true,
				hasBulge: true,
				hasDisk: true,
				hasHalo: true,
				armCount: 2,
				armTightness: 20,
				armSymmetry: 0.5,
				hasBar: false,
				barStrength: 0,
				barLength: 0,
				ellipticity: 0.2,
				triaxiality: 0.3,
				diskiness: 0.3,
				asymmetryIndex: 0.4,
				clumpiness: 0.8,
				fragmentationLevel: 0.6,
				hasActiveNucleus: true,
				jetLength: 1000,
				jetPower: 1e46,
				tidalTails: false,
				tidalTailLength: 0,
				bridgeFeatures: false,
				ringStructures: false,
			},

			primaryColors: [new Color(0xffffff), new Color(0x87ceeb), new Color(0x0066ff)],
			secondaryColors: [new Color(0xff69b4), new Color(0xff1493), new Color(0xdc143c)],

			visualFeatures: {
				nuclearBulge: true,
				centralBar: false,
				spiralArms: true,
				diskStructure: true,
				stellarHalo: true,
				activeNucleus: true,
				jetEmission: true,
				radioBubbles: true,
				accretionDisk: true,
				coronalLines: true,
				starFormingRegions: true,
				hiiRegions: true,
				dustLanes: true,
				molecularClouds: true,
				supernovaRemnants: true,
				tidalStreams: false,
				satelliteGalaxies: true,
				galaxyInteraction: false,
				mergerSignatures: true,
				surfaceBrightness: 18.0,
				colorGradient: true,
				metallicityGradient: true,
				ageGradient: true,
				gravitationalLensing: true,
				darkMatterClumps: true,
				cosmicWebFilaments: true,
			},

			systemData: {
				localGroupMember: false,
				distanceFromMilkyWay: 2000,
				radialVelocity: 50000,
				filamentMember: true,
				voidGalaxy: false,
				clusterMember: false,
				wallMember: true,
				formationRedshift: 6.0,
				majorMergerHistory: [0.1, 0.5],
				quenchingEpoch: 0,
				haloMass: 5e12,
				haloConcentration: 8,
				subhaloCount: 50,
				redshift: 2.0,
				lookbackTime: 10.3,
				comovingDistance: 6000,
				luminosityDistance: 18000,
				xrayLuminosity: 1e45,
				radioLuminosity: 1e43,
				infraredLuminosity: 1e46,
				uvLuminosity: 1e46,
			},

			formationMechanism: ["major merger", "rapid accretion", "primordial black hole growth"],
			evolutionPath: [GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.MATURE, GalaxyEvolutionStage.QUENCHED],
			fateScenarios: ["AGN shutdown", "radio galaxy phase", "elliptical remnant"],

			geometryComplexity: 5,
			starDensity: 0.9,
			effectDensity: 1.0,
			renderingTechniques: ["AGN jet modeling", "accretion disk", "relativistic beaming"],

			discoverability: 0.01,
			scientificValue: 10,
			explorationDifficulty: 10,
			resourceValue: 2,

			uniqueFeatures: ["extreme luminosity", "relativistic jets", "broad emission lines"],
			astrophysicalProcesses: ["black hole accretion", "jet formation", "photoionization"],
			observationalChallenges: ["high redshift", "variability", "relativistic effects"],
		},
	],

	[
		GalaxyClass.DWARF_ELLIPTICAL,
		{
			class: GalaxyClass.DWARF_ELLIPTICAL,
			name: "Dwarf Elliptical Galaxy",
			description: "Small, gas-poor galaxy with old stellar population",
			realWorldExample: "Leo I, Leo II, Fornax Dwarf",
			hubbleType: "dE",
			evolutionStage: GalaxyEvolutionStage.QUENCHED,

			massRange: [6, 9],
			sizeRange: [0.5, 5],
			starFormationRange: [0, 0.01],
			metallicityRange: [-2.5, -0.5],
			ageRange: [10, 13],

			dominantPopulation: StellarPopulation.POPULATION_II,
			populationMix: new Map([
				[StellarPopulation.POPULATION_II, 0.95],
				[StellarPopulation.POPULATION_I, 0.05],
			]),

			galaxyPhysics: {
				stellarMass: 1e7,
				totalMass: 1e8,
				darkMatterFraction: 0.95,
				gasMass: 1e5,
				effectiveRadius: 0.5,
				scaleLength: 0,
				scaleHeight: 0,
				rotationVelocity: 10,
				velocityDispersion: 10,
				angularMomentum: 5,
				starFormationRate: 0.001,
				starFormationEfficiency: 0.0001,
				gasDepletion: 1000,
				centralBlackHoleMass: 1e3,
				blackHoleAccretionRate: 0,
				eddingtonRatio: 0,
				environmentalDensity: 1,
				clusterMembership: false,
				satelliteCount: 0,
				metallicity: -1.5,
				oxygenAbundance: 7.0,
				alphaEnhancement: 0.5,
			},

			morphology: {
				hasNucleus: false,
				hasBulge: false,
				hasDisk: false,
				hasHalo: true,
				armCount: 0,
				armTightness: 0,
				armSymmetry: 0,
				hasBar: false,
				barStrength: 0,
				barLength: 0,
				ellipticity: 0.3,
				triaxiality: 0.2,
				diskiness: -0.8,
				asymmetryIndex: 0.1,
				clumpiness: 0.05,
				fragmentationLevel: 0.02,
				hasActiveNucleus: false,
				jetLength: 0,
				jetPower: 0,
				tidalTails: true,
				tidalTailLength: 2,
				bridgeFeatures: false,
				ringStructures: false,
			},

			primaryColors: [new Color(0xffd700), new Color(0xdaa520), new Color(0xb8860b)],
			secondaryColors: [new Color(0xf4a460), new Color(0xd2b48c), new Color(0xbc8f8f)],

			visualFeatures: {
				nuclearBulge: false,
				centralBar: false,
				spiralArms: false,
				diskStructure: false,
				stellarHalo: true,
				activeNucleus: false,
				jetEmission: false,
				radioBubbles: false,
				accretionDisk: false,
				coronalLines: false,
				starFormingRegions: false,
				hiiRegions: false,
				dustLanes: false,
				molecularClouds: false,
				supernovaRemnants: false,
				tidalStreams: true,
				satelliteGalaxies: false,
				galaxyInteraction: true,
				mergerSignatures: false,
				surfaceBrightness: 26.0,
				colorGradient: false,
				metallicityGradient: true,
				ageGradient: false,
				gravitationalLensing: false,
				darkMatterClumps: true,
				cosmicWebFilaments: false,
			},

			systemData: {
				localGroupMember: true,
				distanceFromMilkyWay: 0.3,
				radialVelocity: 50,
				filamentMember: false,
				voidGalaxy: false,
				clusterMembership: false,
				wallMember: false,
				formationRedshift: 5.0,
				majorMergerHistory: [],
				quenchingEpoch: 10.0,
				haloMass: 1e8,
				haloConcentration: 20,
				subhaloCount: 0,
				redshift: 0.0001,
				lookbackTime: 0.001,
				comovingDistance: 0.3,
				luminosityDistance: 0.3,
				xrayLuminosity: 1e35,
				radioLuminosity: 1e32,
				infraredLuminosity: 1e38,
				uvLuminosity: 1e36,
			},

			formationMechanism: ["tidal stripping", "ram pressure stripping", "reionization quenching"],
			evolutionPath: [GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.QUENCHED],
			fateScenarios: ["continued tidal stripping", "eventual disruption", "stable satellite"],

			geometryComplexity: 1,
			starDensity: 0.3,
			effectDensity: 0.1,
			renderingTechniques: ["dark matter dominated", "low surface brightness", "tidal features"],

			discoverability: 0.9,
			scientificValue: 6,
			explorationDifficulty: 2,
			resourceValue: 3,

			uniqueFeatures: ["dark matter dominated", "ancient stellar population", "tidal features"],
			astrophysicalProcesses: ["tidal stripping", "environmental quenching", "stellar evolution"],
			observationalChallenges: ["low surface brightness", "foreground contamination", "distance measurement"],
		},
	],

	[
		GalaxyClass.STARBURST,
		{
			class: GalaxyClass.STARBURST,
			name: "Starburst Galaxy",
			description: "Galaxy undergoing intense star formation episode",
			realWorldExample: "M82, Arp 220, NGC 253",
			hubbleType: "SB",
			evolutionStage: GalaxyEvolutionStage.FORMATION,

			massRange: [9, 12],
			sizeRange: [5, 30],
			starFormationRange: [10, 1000],
			metallicityRange: [-0.5, 0.5],
			ageRange: [0.01, 1],

			dominantPopulation: StellarPopulation.STARBURST,
			populationMix: new Map([
				[StellarPopulation.STARBURST, 0.8],
				[StellarPopulation.POPULATION_I, 0.2],
			]),

			galaxyPhysics: {
				stellarMass: 5e10,
				totalMass: 2e11,
				darkMatterFraction: 0.75,
				gasMass: 2e10,
				effectiveRadius: 2,
				scaleLength: 1.5,
				scaleHeight: 0.2,
				rotationVelocity: 200,
				velocityDispersion: 100,
				angularMomentum: 400,
				starFormationRate: 100,
				starFormationEfficiency: 0.5,
				gasDepletion: 0.2,
				centralBlackHoleMass: 1e7,
				blackHoleAccretionRate: 1,
				eddingtonRatio: 0.1,
				environmentalDensity: 2,
				clusterMembership: false,
				satelliteCount: 3,
				metallicity: 0.1,
				oxygenAbundance: 8.8,
				alphaEnhancement: 0.1,
			},

			morphology: {
				hasNucleus: true,
				hasBulge: true,
				hasDisk: true,
				hasHalo: false,
				armCount: 0,
				armTightness: 0,
				armSymmetry: 0,
				hasBar: false,
				barStrength: 0,
				barLength: 0,
				ellipticity: 0.4,
				triaxiality: 0.6,
				diskiness: 0.2,
				asymmetryIndex: 0.6,
				clumpiness: 0.9,
				fragmentationLevel: 0.8,
				hasActiveNucleus: false,
				jetLength: 0,
				jetPower: 0,
				tidalTails: true,
				tidalTailLength: 15,
				bridgeFeatures: true,
				ringStructures: false,
			},

			primaryColors: [new Color(0xff1493), new Color(0xff69b4), new Color(0x0066ff)],
			secondaryColors: [new Color(0xffa500), new Color(0xff4500), new Color(0xdc143c)],

			visualFeatures: {
				nuclearBulge: true,
				centralBar: false,
				spiralArms: false,
				diskStructure: true,
				stellarHalo: false,
				activeNucleus: false,
				jetEmission: false,
				radioBubbles: false,
				accretionDisk: false,
				coronalLines: false,
				starFormingRegions: true,
				hiiRegions: true,
				dustLanes: true,
				molecularClouds: true,
				supernovaRemnants: true,
				tidalStreams: true,
				satelliteGalaxies: false,
				galaxyInteraction: true,
				mergerSignatures: true,
				surfaceBrightness: 19.0,
				colorGradient: false,
				metallicityGradient: false,
				ageGradient: false,
				gravitationalLensing: false,
				darkMatterClumps: false,
				cosmicWebFilaments: false,
			},

			systemData: {
				localGroupMember: false,
				distanceFromMilkyWay: 12,
				radialVelocity: 800,
				filamentMember: true,
				voidGalaxy: false,
				clusterMember: false,
				wallMember: false,
				formationRedshift: 0.1,
				majorMergerHistory: [0.01],
				quenchingEpoch: 0,
				haloMass: 2e11,
				haloConcentration: 12,
				subhaloCount: 5,
				redshift: 0.01,
				lookbackTime: 0.14,
				comovingDistance: 50,
				luminosityDistance: 50.5,
				xrayLuminosity: 1e41,
				radioLuminosity: 1e38,
				infraredLuminosity: 1e45,
				uvLuminosity: 1e44,
			},

			formationMechanism: ["galaxy merger", "gas-rich interaction", "disk instability"],
			evolutionPath: [GalaxyEvolutionStage.INTERACTING, GalaxyEvolutionStage.POST_MERGER, GalaxyEvolutionStage.QUENCHED],
			fateScenarios: ["starburst shutdown", "AGN phase", "post-starburst galaxy"],

			geometryComplexity: 4,
			starDensity: 1.0,
			effectDensity: 1.0,
			renderingTechniques: ["extreme star formation", "outflow modeling", "dust extinction"],

			discoverability: 0.2,
			scientificValue: 9,
			explorationDifficulty: 6,
			resourceValue: 8,

			uniqueFeatures: ["extreme star formation", "galactic winds", "intense infrared emission"],
			astrophysicalProcesses: ["triggered star formation", "stellar feedback", "galactic outflows"],
			observationalChallenges: ["dust extinction", "complex kinematics", "variability"],
		},
	],
]);

// Utility Functions for Galaxy System
export function getGalaxyTypeByClass(galaxyClass: GalaxyClass): GalaxyTypeDefinition | undefined {
	return GALAXY_TYPES.get(galaxyClass);
}

export function getRandomGalaxyType(): GalaxyTypeDefinition {
	const types = Array.from(GALAXY_TYPES.values());
	const weightedTypes = types.filter((type) => Math.random() < type.discoverability);
	return weightedTypes.length > 0 ? weightedTypes[Math.floor(Math.random() * weightedTypes.length)] : types[Math.floor(Math.random() * types.length)];
}

export function getGalaxyTypesByEvolutionStage(stage: GalaxyEvolutionStage): GalaxyTypeDefinition[] {
	return Array.from(GALAXY_TYPES.values()).filter((type) => type.evolutionStage === stage);
}

export function getGalaxyTypesByMorphology(hasDisk: boolean, hasSpirals: boolean): GalaxyTypeDefinition[] {
	return Array.from(GALAXY_TYPES.values()).filter((type) => type.morphology.hasDisk === hasDisk && type.morphology.armCount > 0 === hasSpirals);
}

export function calculateGalaxyLuminosity(stellarMass: number, starFormationRate: number): number {
	// Simple stellar mass-to-light ratio with SFR boost
	const baseLuminosity = stellarMass * 1.0; // Solar luminosities
	const starburstBoost = starFormationRate * 1e8; // UV luminosity boost
	return baseLuminosity + starburstBoost;
}

export function calculateGalaxySize(mass: number, morphology: string): number {
	// Size-mass relation varies by morphology
	let baseSizeExponent = 0.14; // Default for spirals

	if (morphology.includes("elliptical")) {
		baseSizeExponent = 0.75;
	} else if (morphology.includes("dwarf")) {
		baseSizeExponent = 0.3;
	}

	return 3.0 * Math.pow(mass / 1e11, baseSizeExponent); // kpc
}

export function classifyGalaxyByMass(stellarMass: number): string {
	if (stellarMass < 1e8) return "ultra-faint dwarf";
	if (stellarMass < 1e9) return "dwarf";
	if (stellarMass < 1e10) return "small galaxy";
	if (stellarMass < 1e11) return "normal galaxy";
	if (stellarMass < 1e12) return "massive galaxy";
	return "giant galaxy";
}

export function getGalaxyEvolutionPath(initialMass: number, environment: string): GalaxyEvolutionStage[] {
	if (initialMass < 1e8) {
		// Dwarf galaxy evolution
		return [GalaxyEvolutionStage.PRIMORDIAL, GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.QUENCHED];
	} else if (environment === "cluster") {
		// Cluster galaxy evolution
		return [GalaxyEvolutionStage.PRIMORDIAL, GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.INTERACTING, GalaxyEvolutionStage.POST_MERGER, GalaxyEvolutionStage.QUENCHED];
	} else {
		// Field galaxy evolution
		return [GalaxyEvolutionStage.PRIMORDIAL, GalaxyEvolutionStage.FORMATION, GalaxyEvolutionStage.MATURE, GalaxyEvolutionStage.INTERACTING, GalaxyEvolutionStage.POST_MERGER];
	}
}

export function generateGalaxyResources(galaxy: GalaxyTypeDefinition): Map<string, number> {
	const resources = new Map<string, number>();

	// Basic resources based on stellar mass and SFR
	resources.set("stellar_mass", galaxy.galaxyPhysics.stellarMass / 1e10);
	resources.set("star_formation", galaxy.galaxyPhysics.starFormationRate);
	resources.set("gas_reserves", galaxy.galaxyPhysics.gasMass / 1e9);
	resources.set("dark_matter", (galaxy.galaxyPhysics.totalMass * galaxy.galaxyPhysics.darkMatterFraction) / 1e12);

	// Special resources for different galaxy types
	switch (galaxy.class) {
		case GalaxyClass.QUASAR:
			resources.set("energy_output", 1.0);
			resources.set("exotic_physics", 0.9);
			resources.set("high_energy_particles", 0.8);
			break;
		case GalaxyClass.STARBURST:
			resources.set("young_stars", 0.9);
			resources.set("heavy_elements", 0.7);
			resources.set("stellar_nurseries", 0.8);
			break;
		case GalaxyClass.ELLIPTICAL_E4:
			resources.set("old_stellar_population", 0.9);
			resources.set("gravitational_stability", 0.8);
			resources.set("central_black_hole", 0.7);
			break;
		case GalaxyClass.DWARF_ELLIPTICAL:
			resources.set("pristine_gas", 0.6);
			resources.set("ancient_stars", 0.8);
			resources.set("dark_matter_concentration", 0.95);
			break;
	}

	return resources;
}

export function calculateGalaxyInteractionStrength(galaxy1: GalaxyTypeDefinition, galaxy2: GalaxyTypeDefinition, separation: number): number {
	// Gravitational interaction strength based on masses and separation
	const mass1 = galaxy1.galaxyPhysics.totalMass;
	const mass2 = galaxy2.galaxyPhysics.totalMass;
	const size1 = galaxy1.galaxyPhysics.effectiveRadius;
	const size2 = galaxy2.galaxyPhysics.effectiveRadius;

	const gravitationalParameter = (mass1 * mass2) / Math.pow(separation, 2);
	const tidalRadius = Math.max(size1, size2);

	return gravitationalParameter / Math.pow(tidalRadius, 3);
}

export function predictGalaxyMergerOutcome(primary: GalaxyTypeDefinition, secondary: GalaxyTypeDefinition): GalaxyClass {
	const massRatio = secondary.galaxyPhysics.stellarMass / primary.galaxyPhysics.stellarMass;
	const totalMass = primary.galaxyPhysics.stellarMass + secondary.galaxyPhysics.stellarMass;

	if (massRatio < 0.1) {
		// Minor merger - primary dominates
		return primary.class;
	} else if (massRatio < 0.3) {
		// Intermediate merger
		if (primary.morphology.hasDisk && secondary.morphology.hasDisk) {
			return GalaxyClass.PECULIAR;
		} else {
			return primary.class;
		}
	} else {
		// Major merger
		if (totalMass > 1e11) {
			return GalaxyClass.ELLIPTICAL_E4;
		} else {
			return GalaxyClass.IRREGULAR_I;
		}
	}
}
