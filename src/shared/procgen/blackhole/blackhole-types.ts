/**
 * @file blackhole-types.ts
 * @description Comprehensive black hole classification system with scientifically accurate properties
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Defines all black hole types, from stellar remnants to exotic theoretical objects,
 * with realistic physics, visual effects, and astrophysical processes.
 */

import { Vector3, Color } from "three";

// Black Hole Classifications
export enum BlackHoleClass {
	// Real/Observed Black Holes
	STELLAR_MASS = "stellar_mass", // 3-100 M☉
	INTERMEDIATE_MASS = "intermediate_mass", // 100-100,000 M☉
	SUPERMASSIVE = "supermassive", // 10^6-10^10 M☉
	ULTRAMASSIVE = "ultramassive", // >10^10 M☉

	// Primordial Black Holes
	PRIMORDIAL_MICRO = "primordial_micro", // <1 g
	PRIMORDIAL_LUNAR = "primordial_lunar", // ~Moon mass
	PRIMORDIAL_EARTH = "primordial_earth", // ~Earth mass
	PRIMORDIAL_STELLAR = "primordial_stellar", // ~Solar mass

	// Mathematical/Physical Types
	SCHWARZSCHILD = "schwarzschild", // Non-rotating, uncharged
	KERR = "kerr", // Rotating, uncharged
	REISSNER_NORDSTROM = "reissner_nordstrom", // Non-rotating, charged
	KERR_NEWMAN = "kerr_newman", // Rotating, charged

	// Theoretical/Exotic Objects
	WHITE_HOLE = "white_hole", // Time-reversed black hole
	WORMHOLE = "wormhole", // Einstein-Rosen bridge
	GRAVASTAR = "gravastar", // Gravitational vacuum star
	FUZZBALL = "fuzzball", // String theory object
	PLANCK_STAR = "planck_star", // Loop quantum gravity

	// Binary Systems
	BINARY_STELLAR = "binary_stellar", // Two stellar mass BHs
	BINARY_SUPERMASSIVE = "binary_supermassive", // Two SMBHs
	MIXED_BINARY = "mixed_binary", // Different mass BHs

	// Extreme/Exotic States
	EXTREMAL_KERR = "extremal_kerr", // Maximum rotation
	NEAR_EXTREMAL = "near_extremal", // Near-maximum rotation
	HYPERMASSIVE = "hypermassive", // Unstable, massive
	MAGNETOSPHERIC = "magnetospheric", // Strong magnetic fields
}

// Black Hole Formation Mechanisms
export enum FormationMechanism {
	STELLAR_COLLAPSE = "stellar_collapse", // Core collapse supernova
	DIRECT_COLLAPSE = "direct_collapse", // First stars/gas clouds
	HIERARCHICAL_MERGER = "hierarchical_merger", // BH-BH mergers
	ACCRETION_GROWTH = "accretion_growth", // Mass accretion
	PRIMORDIAL_FORMATION = "primordial_formation", // Early universe
	VACUUM_DECAY = "vacuum_decay", // Quantum fluctuations
	COSMIC_STRING = "cosmic_string", // Topological defects
	EXOTIC_MATTER = "exotic_matter", // Theoretical processes
}

// Accretion States
export enum AccretionState {
	DORMANT = "dormant", // No accretion
	THIN_DISK = "thin_disk", // Standard Shakura-Sunyaev
	THICK_DISK = "thick_disk", // Advection-dominated
	SLIM_DISK = "slim_disk", // Super-Eddington
	RADIATIVELY_INEFFICIENT = "radiatively_inefficient", // RIAF
	MAGNETICALLY_ARRESTED = "magnetically_arrested", // MAD state
	TIDAL_DISRUPTION = "tidal_disruption", // TDE flare
	OUTBURST = "outburst", // Transient accretion
}

// Physical Properties
export interface BlackHolePhysics {
	// Basic Properties
	mass: number; // Solar masses
	spin: number; // Dimensionless spin parameter (0-1)
	charge: number; // Dimensionless charge parameter

	// Derived Properties
	schwarzschildRadius: number; // km
	ergosphereRadius: number; // km (for rotating BHs)
	innerStableCircularOrbit: number; // km
	photonSphere: number; // km

	// Thermodynamic Properties
	hawkingTemperature: number; // Kelvin
	entropy: number; // Bekenstein-Hawking entropy
	surface_gravity: number; // m/s²
	evaporationTime: number; // years

	// Electromagnetic Properties
	magneticFieldStrength: number; // Tesla
	electricCharge: number; // Coulombs
	magnetosphereSize: number; // km

	// Accretion Properties
	accretionRate: number; // Solar masses per year
	eddingtonRatio: number; // L/L_Edd
	jetPower: number; // erg/s
	diskTemperature: number; // Kelvin
	diskLuminosity: number; // erg/s

	// Environmental Properties
	environmentalDensity: number; // particles/cm³
	ambientMagneticField: number; // Tesla
	stellarWindDensity: number; // particles/cm³

	// Orbital Properties (for binaries)
	orbitalPeriod: number; // days
	orbitalSeparation: number; // km
	eccentricity: number; // 0-1
	inclination: number; // degrees

	// Gravitational Wave Properties
	strainAmplitude: number; // dimensionless
	coalescenceTime: number; // years
	chirpMass: number; // Solar masses

	// Quantum Properties
	quantumCorrections: number; // dimensionless
	stringyCoupling: number; // for fuzzballs
	loopQuantumEffects: number; // for planck stars
}

// Observational Signatures
export interface BlackHoleObservables {
	// Electromagnetic Signatures
	xrayLuminosity: number; // erg/s
	radioLuminosity: number; // erg/s
	opticalLuminosity: number; // erg/s
	infraredLuminosity: number; // erg/s
	gammaRayLuminosity: number; // erg/s

	// Spectral Features
	ironKAlphaLine: boolean; // 6.4 keV line
	thermalDiskSpectrum: boolean;
	powerLawComponent: boolean;
	cyclotronLines: boolean;

	// Variability
	quasiPeriodicOscillations: boolean; // QPOs
	xrayFlares: boolean;
	jetVariability: boolean;
	diskVariability: boolean;

	// Gravitational Signatures
	stellarOrbitalMotion: boolean; // S-stars
	gravitationalLensing: boolean;
	timeDelayEchoes: boolean;
	frameDragging: boolean;

	// Gravitational Waves
	gravitationalWaveStrain: number;
	mergerSignature: boolean;
	inspiralDetectable: boolean;
	postNewtonian: number; // PN order

	// Jet/Outflow Signatures
	relativisticJets: boolean;
	radioJets: boolean;
	jetPrecession: boolean;
	outflowSignatures: boolean;

	// Environmental Effects
	accretionShock: boolean;
	bowShock: boolean;
	cavityFormation: boolean;
	stellarCapture: boolean;
}

// Visual Features for Low-Poly Generation
export interface BlackHoleVisualFeatures {
	// Core Structure
	eventHorizon: boolean;
	ergosphere: boolean; // For rotating BHs
	accretionDisk: boolean;
	coronalHotSpot: boolean;
	jetStructure: boolean;

	// Accretion Features
	diskSpiral: boolean;
	hotSpots: boolean;
	diskWarping: boolean;
	diskPrecession: boolean;
	accretionStream: boolean;

	// Magnetic Features
	magneticFieldLines: boolean;
	magnetosphere: boolean;
	magneticReconnection: boolean;
	plasmoids: boolean;

	// Relativistic Effects
	gravitationalLensing: boolean;
	timeDelays: boolean;
	redshiftGradient: boolean;
	frameDragging: boolean;
	ergosphereGlow: boolean;

	// Environmental Effects
	gravitationalWaves: boolean;
	tidalDisruption: boolean;
	stellarWind: boolean;
	shockFronts: boolean;
	cavityBubbles: boolean;

	// Exotic Features
	whiteHoleEmission: boolean; // For white holes
	wormholeThroat: boolean; // For wormholes
	quantumFuzz: boolean; // For fuzzballs
	granularStructure: boolean; // For gravastars
	planckScaleEffects: boolean; // For Planck stars

	// Binary Features
	gravitationalWavePattern: boolean;
	accretionStreamExchange: boolean;
	jetInteraction: boolean;
	tidalDistortion: boolean;

	// Observational
	shadowImage: boolean; // Event Horizon Telescope
	photonRing: boolean;
	causticStructure: boolean;
	eisnteinRing: boolean;
}

// Complete Black Hole Type Definition
export interface BlackHoleTypeDefinition {
	class: BlackHoleClass;
	name: string;
	description: string;
	realWorldExample: string;
	observationalStatus: "confirmed" | "probable" | "theoretical" | "speculative";

	// Physical Ranges
	massRange: [number, number]; // Solar masses (log10)
	spinRange: [number, number]; // 0-1
	chargeRange: [number, number]; // 0-1
	temperatureRange: [number, number]; // Kelvin

	// Formation
	formationMechanism: FormationMechanism[];
	formationTimescale: number; // years
	formationEfficiency: number; // 0-1

	// Physics
	physics: BlackHolePhysics;

	// Observables
	observables: BlackHoleObservables;

	// Visual Properties
	primaryColors: Color[];
	secondaryColors: Color[];
	visualFeatures: BlackHoleVisualFeatures;

	// Environmental Impact
	gravitationalInfluence: number; // pc
	accretionRadius: number; // pc
	jetLength: number; // pc
	tidalRadius: number; // pc

	// Low-Poly Generation Parameters
	geometryComplexity: number; // 1-5
	effectDensity: number; // 0-1
	renderingTechniques: string[];

	// Gameplay Properties
	discoverability: number; // 0-1 (rarer = lower)
	scientificValue: number; // 1-10
	explorationDanger: number; // 0-10
	resourceValue: number; // 1-10
	technologyRequirement: number; // 1-10

	// Special Properties
	uniqueFeatures: string[];
	astrophysicalProcesses: string[];
	theoreticalBasis: string[];
	observationalChallenges: string[];

	// Research Applications
	fundamentalPhysics: string[];
	cosmologicalImplications: string[];
	technologyApplications: string[];
}

// Complete Black Hole Database
export const BLACKHOLE_TYPES: Map<BlackHoleClass, BlackHoleTypeDefinition> = new Map([
	[
		BlackHoleClass.STELLAR_MASS,
		{
			class: BlackHoleClass.STELLAR_MASS,
			name: "Stellar Mass Black Hole",
			description: "Black hole formed from the collapse of a massive star, typically 20-100 solar masses",
			realWorldExample: "Cygnus X-1, V404 Cygni, GW150914",
			observationalStatus: "confirmed",

			massRange: [0.5, 2], // 3-100 solar masses
			spinRange: [0, 0.99],
			chargeRange: [0, 0.01], // Essentially uncharged
			temperatureRange: [1e-8, 1e-7], // Kelvin

			formationMechanism: [FormationMechanism.STELLAR_COLLAPSE],
			formationTimescale: 1, // Seconds (core collapse)
			formationEfficiency: 0.1, // 10% of massive stars

			physics: {
				mass: 10, // 10 solar masses
				spin: 0.7,
				charge: 0,
				schwarzschildRadius: 30, // km
				ergosphereRadius: 45, // km
				innerStableCircularOrbit: 90, // km
				photonSphere: 45, // km
				hawkingTemperature: 6e-9, // Kelvin
				entropy: 1e77, // bits
				surface_gravity: 1.5e12, // m/s²
				evaporationTime: 2e67, // years
				magneticFieldStrength: 1e8, // Tesla
				electricCharge: 0,
				magnetosphereSize: 1000, // km
				accretionRate: 1e-9, // Solar masses per year
				eddingtonRatio: 0.1,
				jetPower: 1e38, // erg/s
				diskTemperature: 1e7, // Kelvin
				diskLuminosity: 1e38, // erg/s
				environmentalDensity: 1e6, // particles/cm³
				ambientMagneticField: 1e-4, // Tesla
				stellarWindDensity: 1e3, // particles/cm³
				orbitalPeriod: 0, // Single BH
				orbitalSeparation: 0,
				eccentricity: 0,
				inclination: 0,
				strainAmplitude: 0,
				coalescenceTime: 0,
				chirpMass: 0,
				quantumCorrections: 1e-10,
				stringyCoupling: 0,
				loopQuantumEffects: 0,
			},

			observables: {
				xrayLuminosity: 1e38,
				radioLuminosity: 1e35,
				opticalLuminosity: 1e36,
				infraredLuminosity: 1e37,
				gammaRayLuminosity: 1e36,
				ironKAlphaLine: true,
				thermalDiskSpectrum: true,
				powerLawComponent: true,
				cyclotronLines: false,
				quasiPeriodicOscillations: true,
				xrayFlares: true,
				jetVariability: true,
				diskVariability: true,
				stellarOrbitalMotion: true,
				gravitationalLensing: false,
				timeDelayEchoes: false,
				frameDragging: true,
				gravitationalWaveStrain: 1e-22,
				mergerSignature: false,
				inspiralDetectable: false,
				postNewtonian: 1,
				relativisticJets: true,
				radioJets: true,
				jetPrecession: true,
				outflowSignatures: true,
				accretionShock: true,
				bowShock: true,
				cavityFormation: false,
				stellarCapture: true,
			},

			primaryColors: [new Color(0x000000), new Color(0xff6600), new Color(0xffffff)],
			secondaryColors: [new Color(0x0066ff), new Color(0xff0066), new Color(0xffff00)],

			visualFeatures: {
				eventHorizon: true,
				ergosphere: true,
				accretionDisk: true,
				coronalHotSpot: true,
				jetStructure: true,
				diskSpiral: true,
				hotSpots: true,
				diskWarping: false,
				diskPrecession: true,
				accretionStream: false,
				magneticFieldLines: true,
				magnetosphere: true,
				magneticReconnection: true,
				plasmoids: true,
				gravitationalLensing: false,
				timeDelays: false,
				redshiftGradient: true,
				frameDragging: true,
				ergosphereGlow: false,
				gravitationalWaves: false,
				tidalDisruption: true,
				stellarWind: true,
				shockFronts: true,
				cavityBubbles: false,
				whiteHoleEmission: false,
				wormholeThroat: false,
				quantumFuzz: false,
				granularStructure: false,
				planckScaleEffects: false,
				gravitationalWavePattern: false,
				accretionStreamExchange: false,
				jetInteraction: false,
				tidalDistortion: false,
				shadowImage: false,
				photonRing: false,
				causticStructure: false,
				eisnteinRing: false,
			},

			gravitationalInfluence: 0.1, // pc
			accretionRadius: 0.01, // pc
			jetLength: 1, // pc
			tidalRadius: 0.001, // pc

			geometryComplexity: 4,
			effectDensity: 0.8,
			renderingTechniques: ["accretion disk", "relativistic jets", "gravitational lensing", "X-ray emission"],

			discoverability: 0.3,
			scientificValue: 8,
			explorationDanger: 9,
			resourceValue: 6,
			technologyRequirement: 7,

			uniqueFeatures: ["stellar mass remnant", "X-ray binary systems", "relativistic jets", "accretion physics"],
			astrophysicalProcesses: ["accretion disk dynamics", "jet formation", "tidal disruption", "frame dragging"],
			theoreticalBasis: ["general relativity", "magnetohydrodynamics", "plasma physics"],
			observationalChallenges: ["X-ray timing", "spectroscopy", "jet morphology"],

			fundamentalPhysics: ["strong gravity", "event horizon physics", "no-hair theorem"],
			cosmologicalImplications: ["stellar evolution endpoints", "galactic feedback"],
			technologyApplications: ["gravitational wave detectors", "X-ray astronomy"],
		},
	],

	[
		BlackHoleClass.SUPERMASSIVE,
		{
			class: BlackHoleClass.SUPERMASSIVE,
			name: "Supermassive Black Hole",
			description: "Massive black hole found at galaxy centers, millions to billions of solar masses",
			realWorldExample: "Sagittarius A*, M87*, Messier 77",
			observationalStatus: "confirmed",

			massRange: [6, 10], // 10^6 to 10^10 solar masses
			spinRange: [0, 0.998],
			chargeRange: [0, 0.01],
			temperatureRange: [1e-14, 1e-12],

			formationMechanism: [FormationMechanism.DIRECT_COLLAPSE, FormationMechanism.HIERARCHICAL_MERGER, FormationMechanism.ACCRETION_GROWTH],
			formationTimescale: 1e8, // years
			formationEfficiency: 1.0, // All massive galaxies

			physics: {
				mass: 4.15e6, // Sgr A* mass
				spin: 0.94,
				charge: 0,
				schwarzschildRadius: 1.2e7, // km
				ergosphereRadius: 1.8e7, // km
				innerStableCircularOrbit: 3.6e7, // km
				photonSphere: 1.8e7, // km
				hawkingTemperature: 1.5e-14, // Kelvin
				entropy: 1e90, // bits
				surface_gravity: 1.5e5, // m/s²
				evaporationTime: 2e87, // years
				magneticFieldStrength: 1e4, // Tesla
				electricCharge: 0,
				magnetosphereSize: 1e9, // km
				accretionRate: 1e-6, // Solar masses per year
				eddingtonRatio: 0.01,
				jetPower: 1e44, // erg/s
				diskTemperature: 1e6, // Kelvin
				diskLuminosity: 1e44, // erg/s
				environmentalDensity: 1e3, // particles/cm³
				ambientMagneticField: 1e-6, // Tesla
				stellarWindDensity: 1e2, // particles/cm³
				orbitalPeriod: 0,
				orbitalSeparation: 0,
				eccentricity: 0,
				inclination: 0,
				strainAmplitude: 0,
				coalescenceTime: 0,
				chirpMass: 0,
				quantumCorrections: 1e-20,
				stringyCoupling: 0,
				loopQuantumEffects: 0,
			},

			observables: {
				xrayLuminosity: 1e44,
				radioLuminosity: 1e40,
				opticalLuminosity: 1e43,
				infraredLuminosity: 1e44,
				gammaRayLuminosity: 1e42,
				ironKAlphaLine: true,
				thermalDiskSpectrum: true,
				powerLawComponent: true,
				cyclotronLines: false,
				quasiPeriodicOscillations: true,
				xrayFlares: true,
				jetVariability: true,
				diskVariability: true,
				stellarOrbitalMotion: true,
				gravitationalLensing: true,
				timeDelayEchoes: true,
				frameDragging: true,
				gravitationalWaveStrain: 1e-18,
				mergerSignature: false,
				inspiralDetectable: true,
				postNewtonian: 3,
				relativisticJets: true,
				radioJets: true,
				jetPrecession: true,
				outflowSignatures: true,
				accretionShock: true,
				bowShock: true,
				cavityFormation: true,
				stellarCapture: true,
			},

			primaryColors: [new Color(0x000000), new Color(0xff4500), new Color(0xffd700)],
			secondaryColors: [new Color(0x4169e1), new Color(0xff1493), new Color(0x00ffff)],

			visualFeatures: {
				eventHorizon: true,
				ergosphere: true,
				accretionDisk: true,
				coronalHotSpot: true,
				jetStructure: true,
				diskSpiral: true,
				hotSpots: true,
				diskWarping: true,
				diskPrecession: true,
				accretionStream: false,
				magneticFieldLines: true,
				magnetosphere: true,
				magneticReconnection: true,
				plasmoids: true,
				gravitationalLensing: true,
				timeDelays: true,
				redshiftGradient: true,
				frameDragging: true,
				ergosphereGlow: true,
				gravitationalWaves: false,
				tidalDisruption: true,
				stellarWind: false,
				shockFronts: true,
				cavityBubbles: true,
				whiteHoleEmission: false,
				wormholeThroat: false,
				quantumFuzz: false,
				granularStructure: false,
				planckScaleEffects: false,
				gravitationalWavePattern: false,
				accretionStreamExchange: false,
				jetInteraction: false,
				tidalDistortion: false,
				shadowImage: true,
				photonRing: true,
				causticStructure: true,
				eisnteinRing: true,
			},

			gravitationalInfluence: 100, // pc
			accretionRadius: 10, // pc
			jetLength: 10000, // pc
			tidalRadius: 1, // pc

			geometryComplexity: 5,
			effectDensity: 1.0,
			renderingTechniques: ["Event Horizon Telescope", "relativistic magnetohydrodynamics", "GRMHD simulations", "photon mapping"],

			discoverability: 0.8,
			scientificValue: 10,
			explorationDanger: 10,
			resourceValue: 9,
			technologyRequirement: 10,

			uniqueFeatures: ["galactic center", "Event Horizon Telescope imaging", "gravitational wave sources", "cosmic accelerators"],
			astrophysicalProcesses: ["GRMHD turbulence", "magnetic field amplification", "relativistic jet launching", "stellar tidal disruption"],
			theoreticalBasis: ["general relativity", "magnetohydrodynamics", "plasma physics", "radiative transfer"],
			observationalChallenges: ["very long baseline interferometry", "Event Horizon Telescope", "astrometry"],

			fundamentalPhysics: ["strong gravity regime", "spacetime curvature", "general relativistic effects"],
			cosmologicalImplications: ["galaxy formation", "cosmic evolution", "feedback mechanisms"],
			technologyApplications: ["VLBI", "gravitational wave astronomy", "high-energy astrophysics"],
		},
	],

	[
		BlackHoleClass.PRIMORDIAL_MICRO,
		{
			class: BlackHoleClass.PRIMORDIAL_MICRO,
			name: "Micro Primordial Black Hole",
			description: "Tiny black holes formed in the early universe from density fluctuations",
			realWorldExample: "None observed (theoretical)",
			observationalStatus: "theoretical",

			massRange: [-15, -10], // 10^-15 to 10^-10 kg
			spinRange: [0, 0.99],
			chargeRange: [0, 0.1],
			temperatureRange: [1e10, 1e15], // Kelvin

			formationMechanism: [FormationMechanism.PRIMORDIAL_FORMATION],
			formationTimescale: 1e-23, // seconds (Planck time)
			formationEfficiency: 1e-10, // Extremely rare

			physics: {
				mass: 1e-12, // kg
				spin: 0.5,
				charge: 0,
				schwarzschildRadius: 1.5e-39, // km (smaller than Planck length!)
				ergosphereRadius: 2e-39, // km
				innerStableCircularOrbit: 4.5e-39, // km
				photonSphere: 2.25e-39, // km
				hawkingTemperature: 1.2e12, // Kelvin
				entropy: 1e3, // bits
				surface_gravity: 8e51, // m/s²
				evaporationTime: 1e-17, // years (already evaporated)
				magneticFieldStrength: 1e20, // Tesla
				electricCharge: 1e-30, // Coulombs
				magnetosphereSize: 1e-30, // km
				accretionRate: 0, // No accretion
				eddingtonRatio: 0,
				jetPower: 0,
				diskTemperature: 0,
				diskLuminosity: 0,
				environmentalDensity: 1, // particles/cm³
				ambientMagneticField: 1e-10, // Tesla
				stellarWindDensity: 0,
				orbitalPeriod: 0,
				orbitalSeparation: 0,
				eccentricity: 0,
				inclination: 0,
				strainAmplitude: 0,
				coalescenceTime: 0,
				chirpMass: 0,
				quantumCorrections: 1, // Dominant
				stringyCoupling: 1, // String effects important
				loopQuantumEffects: 1, // LQG effects important
			},

			observables: {
				xrayLuminosity: 0,
				radioLuminosity: 0,
				opticalLuminosity: 0,
				infraredLuminosity: 0,
				gammaRayLuminosity: 1e50, // Hawking radiation
				ironKAlphaLine: false,
				thermalDiskSpectrum: false,
				powerLawComponent: false,
				cyclotronLines: false,
				quasiPeriodicOscillations: false,
				xrayFlares: false,
				jetVariability: false,
				diskVariability: false,
				stellarOrbitalMotion: false,
				gravitationalLensing: false,
				timeDelayEchoes: false,
				frameDragging: false,
				gravitationalWaveStrain: 0,
				mergerSignature: false,
				inspiralDetectable: false,
				postNewtonian: 0,
				relativisticJets: false,
				radioJets: false,
				jetPrecession: false,
				outflowSignatures: false,
				accretionShock: false,
				bowShock: false,
				cavityFormation: false,
				stellarCapture: false,
			},

			primaryColors: [new Color(0x000000), new Color(0xffffff), new Color(0x9966ff)],
			secondaryColors: [new Color(0x00ffff), new Color(0xff00ff), new Color(0xffff00)],

			visualFeatures: {
				eventHorizon: false, // Too small to resolve
				ergosphere: false,
				accretionDisk: false,
				coronalHotSpot: false,
				jetStructure: false,
				diskSpiral: false,
				hotSpots: false,
				diskWarping: false,
				diskPrecession: false,
				accretionStream: false,
				magneticFieldLines: false,
				magnetosphere: false,
				magneticReconnection: false,
				plasmoids: false,
				gravitationalLensing: false,
				timeDelays: false,
				redshiftGradient: false,
				frameDragging: false,
				ergosphereGlow: false,
				gravitationalWaves: false,
				tidalDisruption: false,
				stellarWind: false,
				shockFronts: false,
				cavityBubbles: false,
				whiteHoleEmission: false,
				wormholeThroat: false,
				quantumFuzz: true, // Quantum effects dominant
				granularStructure: false,
				planckScaleEffects: true, // Planck scale physics
				gravitationalWavePattern: false,
				accretionStreamExchange: false,
				jetInteraction: false,
				tidalDistortion: false,
				shadowImage: false,
				photonRing: false,
				causticStructure: false,
				eisnteinRing: false,
			},

			gravitationalInfluence: 1e-30, // pc
			accretionRadius: 0,
			jetLength: 0,
			tidalRadius: 1e-35, // pc

			geometryComplexity: 1,
			effectDensity: 0.1,
			renderingTechniques: ["quantum effects", "Hawking radiation", "Planck scale physics"],

			discoverability: 0.001,
			scientificValue: 10,
			explorationDanger: 2, // Too small to be dangerous
			resourceValue: 1,
			technologyRequirement: 10,

			uniqueFeatures: ["quantum gravity regime", "Hawking radiation", "dark matter candidates", "information paradox"],
			astrophysicalProcesses: ["quantum tunneling", "vacuum fluctuations", "information scrambling"],
			theoreticalBasis: ["quantum gravity", "string theory", "loop quantum gravity", "holographic principle"],
			observationalChallenges: ["indirect detection", "dark matter searches", "gamma-ray bursts"],

			fundamentalPhysics: ["quantum gravity", "Planck scale physics", "information theory"],
			cosmologicalImplications: ["dark matter", "early universe", "cosmic inflation"],
			technologyApplications: ["quantum sensors", "dark matter detectors"],
		},
	],

	[
		BlackHoleClass.KERR,
		{
			class: BlackHoleClass.KERR,
			name: "Kerr Black Hole",
			description: "Rotating black hole described by the Kerr metric, most realistic astrophysical black holes",
			realWorldExample: "Most observed black holes (Cygnus X-1, Sgr A*)",
			observationalStatus: "confirmed",

			massRange: [0.5, 10], // 3 to 10^10 solar masses
			spinRange: [0.1, 0.998], // Rapidly rotating
			chargeRange: [0, 0.01],
			temperatureRange: [1e-14, 1e-7],

			formationMechanism: [FormationMechanism.STELLAR_COLLAPSE, FormationMechanism.ACCRETION_GROWTH],
			formationTimescale: 1e6, // years (spin-up)
			formationEfficiency: 0.9, // Most BHs rotate

			physics: {
				mass: 10,
				spin: 0.9, // Rapidly rotating
				charge: 0,
				schwarzschildRadius: 30, // km
				ergosphereRadius: 35, // km
				innerStableCircularOrbit: 60, // km (closer than Schwarzschild)
				photonSphere: 40, // km
				hawkingTemperature: 6e-9, // Kelvin
				entropy: 1e77, // bits
				surface_gravity: 1.5e12, // m/s²
				evaporationTime: 2e67, // years
				magneticFieldStrength: 1e8, // Tesla
				electricCharge: 0,
				magnetosphereSize: 2000, // km (enhanced by rotation)
				accretionRate: 1e-8, // Solar masses per year
				eddingtonRatio: 0.3, // Enhanced efficiency
				jetPower: 1e39, // erg/s (Blandford-Znajek)
				diskTemperature: 2e7, // Kelvin
				diskLuminosity: 3e38, // erg/s
				environmentalDensity: 1e6, // particles/cm³
				ambientMagneticField: 1e-4, // Tesla
				stellarWindDensity: 1e3, // particles/cm³
				orbitalPeriod: 0,
				orbitalSeparation: 0,
				eccentricity: 0,
				inclination: 0,
				strainAmplitude: 0,
				coalescenceTime: 0,
				chirpMass: 0,
				quantumCorrections: 1e-10,
				stringyCoupling: 0,
				loopQuantumEffects: 0,
			},

			observables: {
				xrayLuminosity: 3e38,
				radioLuminosity: 1e36,
				opticalLuminosity: 1e36,
				infraredLuminosity: 1e37,
				gammaRayLuminosity: 1e37,
				ironKAlphaLine: true,
				thermalDiskSpectrum: true,
				powerLawComponent: true,
				cyclotronLines: false,
				quasiPeriodicOscillations: true,
				xrayFlares: true,
				jetVariability: true,
				diskVariability: true,
				stellarOrbitalMotion: true,
				gravitationalLensing: true,
				timeDelayEchoes: true,
				frameDragging: true, // Key Kerr signature
				gravitationalWaveStrain: 1e-22,
				mergerSignature: false,
				inspiralDetectable: false,
				postNewtonian: 2,
				relativisticJets: true,
				radioJets: true,
				jetPrecession: true,
				outflowSignatures: true,
				accretionShock: true,
				bowShock: true,
				cavityFormation: false,
				stellarCapture: true,
			},

			primaryColors: [new Color(0x000000), new Color(0xff8800), new Color(0x0088ff)],
			secondaryColors: [new Color(0xff0044), new Color(0x44ff00), new Color(0xffffff)],

			visualFeatures: {
				eventHorizon: true,
				ergosphere: true, // Key Kerr feature
				accretionDisk: true,
				coronalHotSpot: true,
				jetStructure: true,
				diskSpiral: true,
				hotSpots: true,
				diskWarping: true, // Frame dragging effect
				diskPrecession: true,
				accretionStream: false,
				magneticFieldLines: true,
				magnetosphere: true,
				magneticReconnection: true,
				plasmoids: true,
				gravitationalLensing: true,
				timeDelays: true,
				redshiftGradient: true,
				frameDragging: true, // Signature effect
				ergosphereGlow: true, // Unique to Kerr
				gravitationalWaves: false,
				tidalDisruption: true,
				stellarWind: true,
				shockFronts: true,
				cavityBubbles: false,
				whiteHoleEmission: false,
				wormholeThroat: false,
				quantumFuzz: false,
				granularStructure: false,
				planckScaleEffects: false,
				gravitationalWavePattern: false,
				accretionStreamExchange: false,
				jetInteraction: false,
				tidalDistortion: false,
				shadowImage: true,
				photonRing: true,
				causticStructure: true,
				eisnteinRing: false,
			},

			gravitationalInfluence: 1, // pc
			accretionRadius: 0.1, // pc
			jetLength: 10, // pc
			tidalRadius: 0.01, // pc

			geometryComplexity: 5,
			effectDensity: 0.9,
			renderingTechniques: ["Kerr metric", "frame dragging", "ergosphere dynamics", "enhanced jets"],

			discoverability: 0.5,
			scientificValue: 9,
			explorationDanger: 9,
			resourceValue: 7,
			technologyRequirement: 8,

			uniqueFeatures: ["frame dragging", "ergosphere", "enhanced jet power", "disk warping"],
			astrophysicalProcesses: ["Blandford-Znajek mechanism", "Lense-Thirring precession", "magnetorotational instability"],
			theoreticalBasis: ["Kerr metric", "general relativity", "magnetohydrodynamics"],
			observationalChallenges: ["frame dragging detection", "spin measurement", "jet morphology"],

			fundamentalPhysics: ["rotating spacetime", "dragging of inertial frames", "angular momentum"],
			cosmologicalImplications: ["jet feedback", "galaxy evolution", "cosmic ray acceleration"],
			technologyApplications: ["gyroscope physics", "precision astrometry"],
		},
	],

	[
		BlackHoleClass.WHITE_HOLE,
		{
			class: BlackHoleClass.WHITE_HOLE,
			name: "White Hole",
			description: "Theoretical time-reversed black hole that ejects matter and energy",
			realWorldExample: "None observed (purely theoretical)",
			observationalStatus: "theoretical",

			massRange: [0, 15], // Any mass theoretically
			spinRange: [0, 0.99],
			chargeRange: [0, 0.1],
			temperatureRange: [0, 1e15], // Undefined for classical white holes

			formationMechanism: [FormationMechanism.VACUUM_DECAY],
			formationTimescale: 0, // Instantaneous (time-reversed)
			formationEfficiency: 0, // Never observed

			physics: {
				mass: 10,
				spin: 0.5,
				charge: 0,
				schwarzschildRadius: 30, // km (same as BH)
				ergosphereRadius: 0, // No ergosphere for white holes
				innerStableCircularOrbit: 0, // No stable orbits
				photonSphere: 45, // km
				hawkingTemperature: 0, // No Hawking radiation
				entropy: -1e77, // Negative entropy (information creation)
				surface_gravity: -1.5e12, // Negative (repulsive)
				evaporationTime: 0, // Instantaneous formation
				magneticFieldStrength: 1e8, // Tesla
				electricCharge: 0,
				magnetosphereSize: 0, // No magnetosphere
				accretionRate: -1e-6, // Mass ejection
				eddingtonRatio: -1, // Ejection, not accretion
				jetPower: -1e39, // Inward jets (time-reversed)
				diskTemperature: 0, // No accretion disk
				diskLuminosity: 1e40, // Matter ejection luminosity
				environmentalDensity: 0, // Vacuum around white hole
				ambientMagneticField: 1e-4, // Tesla
				stellarWindDensity: 0,
				orbitalPeriod: 0,
				orbitalSeparation: 0,
				eccentricity: 0,
				inclination: 0,
				strainAmplitude: 0,
				coalescenceTime: 0,
				chirpMass: 0,
				quantumCorrections: 1, // Quantum origin
				stringyCoupling: 0.5, // String theory relevance
				loopQuantumEffects: 0.5, // LQG bounce scenarios
			},

			observables: {
				xrayLuminosity: 1e40, // Matter ejection
				radioLuminosity: 1e37,
				opticalLuminosity: 1e39,
				infraredLuminosity: 1e38,
				gammaRayLuminosity: 1e39,
				ironKAlphaLine: false,
				thermalDiskSpectrum: false,
				powerLawComponent: false,
				cyclotronLines: false,
				quasiPeriodicOscillations: false,
				xrayFlares: true,
				jetVariability: false,
				diskVariability: false,
				stellarOrbitalMotion: false,
				gravitationalLensing: true,
				timeDelayEchoes: false,
				frameDragging: false,
				gravitationalWaveStrain: 0,
				mergerSignature: false,
				inspiralDetectable: false,
				postNewtonian: 0,
				relativisticJets: false,
				radioJets: false,
				jetPrecession: false,
				outflowSignatures: true, // Matter ejection
				accretionShock: false,
				bowShock: false,
				cavityFormation: false,
				stellarCapture: false,
			},

			primaryColors: [new Color(0xffffff), new Color(0xffd700), new Color(0xff6600)],
			secondaryColors: [new Color(0x00ffff), new Color(0xff1493), new Color(0x9966ff)],

			visualFeatures: {
				eventHorizon: false, // No event horizon (future boundary)
				ergosphere: false,
				accretionDisk: false,
				coronalHotSpot: false,
				jetStructure: false,
				diskSpiral: false,
				hotSpots: false,
				diskWarping: false,
				diskPrecession: false,
				accretionStream: false,
				magneticFieldLines: false,
				magnetosphere: false,
				magneticReconnection: false,
				plasmoids: false,
				gravitationalLensing: true,
				timeDelays: false,
				redshiftGradient: false,
				frameDragging: false,
				ergosphereGlow: false,
				gravitationalWaves: false,
				tidalDisruption: false,
				stellarWind: false,
				shockFronts: false,
				cavityBubbles: false,
				whiteHoleEmission: true, // Key feature
				wormholeThroat: false,
				quantumFuzz: false,
				granularStructure: false,
				planckScaleEffects: false,
				gravitationalWavePattern: false,
				accretionStreamExchange: false,
				jetInteraction: false,
				tidalDistortion: false,
				shadowImage: false,
				photonRing: false,
				causticStructure: false,
				eisnteinRing: false,
			},

			gravitationalInfluence: 1, // pc
			accretionRadius: 0, // No accretion
			jetLength: 0, // No jets
			tidalRadius: 0.01, // pc

			geometryComplexity: 3,
			effectDensity: 0.6,
			renderingTechniques: ["matter ejection", "inverse time flow", "exotic emissions"],

			discoverability: 0.001,
			scientificValue: 10,
			explorationDanger: 5, // Unpredictable
			resourceValue: 2,
			technologyRequirement: 10,

			uniqueFeatures: ["time-reversed physics", "matter ejection", "negative entropy", "information creation"],
			astrophysicalProcesses: ["spontaneous matter creation", "entropy decrease", "causality violation"],
			theoreticalBasis: ["general relativity", "time reversal", "thermodynamics violation"],
			observationalChallenges: ["stability issues", "causality paradoxes", "thermodynamic violations"],

			fundamentalPhysics: ["arrow of time", "thermodynamics", "information theory"],
			cosmologicalImplications: ["Big Bang models", "universe creation", "entropy problems"],
			technologyApplications: ["time travel research", "exotic matter production"],
		},
	],

	[
		BlackHoleClass.WORMHOLE,
		{
			class: BlackHoleClass.WORMHOLE,
			name: "Traversable Wormhole",
			description: "Hypothetical spacetime tunnel connecting distant regions of the universe",
			realWorldExample: "None observed (science fiction favorite)",
			observationalStatus: "speculative",

			massRange: [-5, 15], // Can have negative mass
			spinRange: [0, 0.5], // Limited rotation
			chargeRange: [0, 1], // Can be highly charged
			temperatureRange: [0, 1e10],

			formationMechanism: [FormationMechanism.EXOTIC_MATTER],
			formationTimescale: 1e-10, // Requires exotic matter
			formationEfficiency: 0, // Never observed

			physics: {
				mass: -1, // Negative mass (exotic matter)
				spin: 0.1,
				charge: 0.5, // Can be charged
				schwarzschildRadius: 0, // No event horizon
				ergosphereRadius: 0,
				innerStableCircularOrbit: 10, // km (throat size)
				photonSphere: 0,
				hawkingTemperature: 0, // No Hawking radiation
				entropy: 0, // Zero entropy
				surface_gravity: 0, // No gravity at throat
				evaporationTime: 0, // Stable with exotic matter
				magneticFieldStrength: 1e6, // Tesla
				electricCharge: 1e20, // Coulombs
				magnetosphereSize: 100, // km
				accretionRate: 0, // No accretion
				eddingtonRatio: 0,
				jetPower: 0,
				diskTemperature: 0,
				diskLuminosity: 0,
				environmentalDensity: 1e-10, // Very low density
				ambientMagneticField: 1e-8, // Tesla
				stellarWindDensity: 0,
				orbitalPeriod: 0,
				orbitalSeparation: 0,
				eccentricity: 0,
				inclination: 0,
				strainAmplitude: 0,
				coalescenceTime: 0,
				chirpMass: 0,
				quantumCorrections: 1, // Quantum effects important
				stringyCoupling: 1, // String theory origin
				loopQuantumEffects: 0.5,
			},

			observables: {
				xrayLuminosity: 0,
				radioLuminosity: 0,
				opticalLuminosity: 1e35, // Exotic matter glow
				infraredLuminosity: 1e34,
				gammaRayLuminosity: 0,
				ironKAlphaLine: false,
				thermalDiskSpectrum: false,
				powerLawComponent: false,
				cyclotronLines: true, // From charged exotic matter
				quasiPeriodicOscillations: false,
				xrayFlares: false,
				jetVariability: false,
				diskVariability: false,
				stellarOrbitalMotion: false,
				gravitationalLensing: true, // Unique lensing signature
				timeDelayEchoes: true,
				frameDragging: false,
				gravitationalWaveStrain: 0,
				mergerSignature: false,
				inspiralDetectable: false,
				postNewtonian: 0,
				relativisticJets: false,
				radioJets: false,
				jetPrecession: false,
				outflowSignatures: false,
				accretionShock: false,
				bowShock: false,
				cavityFormation: false,
				stellarCapture: false,
			},

			primaryColors: [new Color(0x9966ff), new Color(0x00ffff), new Color(0xff00ff)],
			secondaryColors: [new Color(0xffff00), new Color(0xff6600), new Color(0x66ff00)],

			visualFeatures: {
				eventHorizon: false, // No event horizon
				ergosphere: false,
				accretionDisk: false,
				coronalHotSpot: false,
				jetStructure: false,
				diskSpiral: false,
				hotSpots: false,
				diskWarping: false,
				diskPrecession: false,
				accretionStream: false,
				magneticFieldLines: true,
				magnetosphere: true,
				magneticReconnection: false,
				plasmoids: false,
				gravitationalLensing: true, // Distinctive pattern
				timeDelays: true,
				redshiftGradient: false,
				frameDragging: false,
				ergosphereGlow: false,
				gravitationalWaves: false,
				tidalDisruption: false,
				stellarWind: false,
				shockFronts: false,
				cavityBubbles: false,
				whiteHoleEmission: false,
				wormholeThroat: true, // Key feature
				quantumFuzz: true, // Quantum fluctuations
				granularStructure: false,
				planckScaleEffects: true,
				gravitationalWavePattern: false,
				accretionStreamExchange: false,
				jetInteraction: false,
				tidalDistortion: false,
				shadowImage: false,
				photonRing: false,
				causticStructure: true, // Unique lensing
				eisnteinRing: true,
			},

			gravitationalInfluence: 0.01, // pc
			accretionRadius: 0,
			jetLength: 0,
			tidalRadius: 0.001, // pc

			geometryComplexity: 4,
			effectDensity: 0.7,
			renderingTechniques: ["exotic matter", "spacetime tunneling", "non-trivial topology"],

			discoverability: 0.0001,
			scientificValue: 10,
			explorationDanger: 8, // Unknown physics
			resourceValue: 10, // Ultimate transportation
			technologyRequirement: 10,

			uniqueFeatures: ["spacetime tunnel", "faster-than-light travel", "exotic matter", "non-trivial topology"],
			astrophysicalProcesses: ["exotic matter dynamics", "topological stability", "Casimir effect"],
			theoreticalBasis: ["general relativity", "exotic matter", "quantum field theory"],
			observationalChallenges: ["exotic matter detection", "stability requirements", "energy conditions"],

			fundamentalPhysics: ["spacetime topology", "exotic matter", "quantum gravity"],
			cosmologicalImplications: ["universe connectivity", "time travel", "causality"],
			technologyApplicationations: ["interstellar travel", "time machines", "exotic matter engineering"],
		},
	],

	[
		BlackHoleClass.BINARY_STELLAR,
		{
			class: BlackHoleClass.BINARY_STELLAR,
			name: "Stellar Binary Black Holes",
			description: "Two stellar mass black holes in close orbit, gravitational wave sources",
			realWorldExample: "GW150914, GW170104, GW190521",
			observationalStatus: "confirmed",

			massRange: [0.5, 2.5], // Combined mass
			spinRange: [0, 0.99],
			chargeRange: [0, 0.01],
			temperatureRange: [1e-8, 1e-7],

			formationMechanism: [FormationMechanism.STELLAR_COLLAPSE, FormationMechanism.HIERARCHICAL_MERGER],
			formationTimescale: 1e9, // years (evolution time)
			formationEfficiency: 0.001, // Very rare

			physics: {
				mass: 30, // Combined mass (solar masses)
				spin: 0.7, // Average spin
				charge: 0,
				schwarzschildRadius: 90, // km (combined)
				ergosphereRadius: 135, // km
				innerStableCircularOrbit: 270, // km
				photonSphere: 135, // km
				hawkingTemperature: 2e-9, // Kelvin
				entropy: 5e77, // bits
				surface_gravity: 5e11, // m/s²
				evaporationTime: 5e67, // years
				magneticFieldStrength: 1e7, // Tesla
				electricCharge: 0,
				magnetosphereSize: 500, // km
				accretionRate: 1e-10, // Solar masses per year
				eddingtonRatio: 0.01,
				jetPower: 1e37, // erg/s
				diskTemperature: 5e6, // Kelvin
				diskLuminosity: 1e37, // erg/s
				environmentalDensity: 1e3, // particles/cm³
				ambientMagneticField: 1e-6, // Tesla
				stellarWindDensity: 1e2, // particles/cm³
				orbitalPeriod: 0.2, // days (at merger)
				orbitalSeparation: 300, // km
				eccentricity: 0.1,
				inclination: 45, // degrees
				strainAmplitude: 1e-21, // GW strain
				coalescenceTime: 1e6, // years
				chirpMass: 25, // Solar masses
				quantumCorrections: 1e-12,
				stringyCoupling: 0,
				loopQuantumEffects: 0,
			},

			observables: {
				xrayLuminosity: 1e37,
				radioLuminosity: 1e34,
				opticalLuminosity: 1e35,
				infraredLuminosity: 1e36,
				gammaRayLuminosity: 1e35,
				ironKAlphaLine: false,
				thermalDiskSpectrum: false,
				powerLawComponent: false,
				cyclotronLines: false,
				quasiPeriodicOscillations: false,
				xrayFlares: false,
				jetVariability: false,
				diskVariability: false,
				stellarOrbitalMotion: false,
				gravitationalLensing: false,
				timeDelayEchoes: false,
				frameDragging: false,
				gravitationalWaveStrain: 1e-21, // Key signature
				mergerSignature: true, // Merger waveform
				inspiralDetectable: true, // LIGO/Virgo
				postNewtonian: 3.5, // High-order effects
				relativisticJets: false,
				radioJets: false,
				jetPrecession: false,
				outflowSignatures: false,
				accretionShock: false,
				bowShock: false,
				cavityFormation: false,
				stellarCapture: false,
			},

			primaryColors: [new Color(0x000000), new Color(0x4169e1), new Color(0xff6600)],
			secondaryColors: [new Color(0x00ffff), new Color(0xff1493), new Color(0xffffff)],

			visualFeatures: {
				eventHorizon: true,
				ergosphere: true,
				accretionDisk: false, // Usually no disks
				coronalHotSpot: false,
				jetStructure: false,
				diskSpiral: false,
				hotSpots: false,
				diskWarping: false,
				diskPrecession: false,
				accretionStream: false,
				magneticFieldLines: false,
				magnetosphere: false,
				magneticReconnection: false,
				plasmoids: false,
				gravitationalLensing: false,
				timeDelays: false,
				redshiftGradient: false,
				frameDragging: false,
				ergosphereGlow: false,
				gravitationalWaves: true, // Key feature
				tidalDisruption: false,
				stellarWind: false,
				shockFronts: false,
				cavityBubbles: false,
				whiteHoleEmission: false,
				wormholeThroat: false,
				quantumFuzz: false,
				granularStructure: false,
				planckScaleEffects: false,
				gravitationalWavePattern: true, // Chirp pattern
				accretionStreamExchange: false,
				jetInteraction: false,
				tidalDistortion: true, // Tidal deformation
				shadowImage: false,
				photonRing: false,
				causticStructure: false,
				eisnteinRing: false,
			},

			gravitationalInfluence: 0.1, // pc
			accretionRadius: 0.001, // pc
			jetLength: 0, // pc
			tidalRadius: 0.0001, // pc

			geometryComplexity: 5,
			effectDensity: 0.8,
			renderingTechniques: ["gravitational waves", "orbital dynamics", "tidal effects", "merger simulation"],

			discoverability: 0.05,
			scientificValue: 10,
			explorationDanger: 10, // Extreme gravity
			resourceValue: 4,
			technologyRequirement: 10,

			uniqueFeatures: ["gravitational wave sources", "LIGO detections", "orbital decay", "merger events"],
			astrophysicalProcesses: ["orbital evolution", "gravitational wave emission", "tidal heating", "final merger"],
			theoreticalBasis: ["general relativity", "post-Newtonian theory", "numerical relativity"],
			observationalChallenges: ["gravitational wave interferometry", "parameter estimation", "sky localization"],

			fundamentalPhysics: ["strong field gravity", "dynamical spacetime", "nonlinear general relativity"],
			cosmologicalImplications: ["cosmic merger rates", "gravitational wave background", "black hole formation"],
			technologyApplications: ["gravitational wave detectors", "precision interferometry", "laser technology"],
		},
	],
]);

// Utility Functions for Black Hole System
export function getBlackHoleTypeByClass(blackHoleClass: BlackHoleClass): BlackHoleTypeDefinition | undefined {
	return BLACKHOLE_TYPES.get(blackHoleClass);
}

export function getRandomBlackHoleType(): BlackHoleTypeDefinition {
	const types = Array.from(BLACKHOLE_TYPES.values());
	const weightedTypes = types.filter((type) => Math.random() < type.discoverability);
	return weightedTypes.length > 0 ? weightedTypes[Math.floor(Math.random() * weightedTypes.length)] : types[Math.floor(Math.random() * types.length)];
}

export function getBlackHoleTypesByObservationalStatus(status: "confirmed" | "probable" | "theoretical" | "speculative"): BlackHoleTypeDefinition[] {
	return Array.from(BLACKHOLE_TYPES.values()).filter((type) => type.observationalStatus === status);
}

export function getBlackHoleTypesByMassRange(minMass: number, maxMass: number): BlackHoleTypeDefinition[] {
	return Array.from(BLACKHOLE_TYPES.values()).filter((type) => type.massRange[0] <= Math.log10(maxMass) && type.massRange[1] >= Math.log10(minMass));
}

export function calculateSchwarzschildRadius(mass: number): number {
	// R_s = 2GM/c² in km
	const G = 6.674e-11; // m³/kg/s²
	const c = 2.998e8; // m/s
	const solarMass = 1.989e30; // kg

	return (2 * G * mass * solarMass) / (c * c) / 1000; // Convert to km
}

export function calculateHawkingTemperature(mass: number): number {
	// T = ℏc³/(8πGMk_B) in Kelvin
	const hbar = 1.055e-34; // J⋅s
	const c = 2.998e8; // m/s
	const G = 6.674e-11; // m³/kg/s²
	const kB = 1.381e-23; // J/K
	const solarMass = 1.989e30; // kg

	return (hbar * Math.pow(c, 3)) / (8 * Math.PI * G * mass * solarMass * kB);
}

export function calculateEvaporationTime(mass: number): number {
	// t = 5120πG²M³/(ℏc⁴) in seconds
	const G = 6.674e-11; // m³/kg/s²
	const c = 2.998e8; // m/s
	const hbar = 1.055e-34; // J⋅s
	const solarMass = 1.989e30; // kg

	const massKg = mass * solarMass;
	const timeSeconds = (5120 * Math.PI * G * G * Math.pow(massKg, 3)) / (hbar * Math.pow(c, 4));

	return timeSeconds / (365.25 * 24 * 3600); // Convert to years
}

export function calculateErgosphereRadius(mass: number, spin: number): number {
	// For Kerr black hole: r_ergo = GM/c² + sqrt((GM/c²)² - a²cos²θ)
	// At θ=π/2: r_ergo = GM/c² + sqrt((GM/c²)² - a²)
	const rs = calculateSchwarzschildRadius(mass);
	const a = (spin * rs) / 2; // Angular momentum parameter

	return rs / 2 + Math.sqrt(Math.pow(rs / 2, 2) - a * a);
}

export function calculateISCO(mass: number, spin: number): number {
	// Inner Stable Circular Orbit radius for Kerr black hole
	const rs = calculateSchwarzschildRadius(mass);

	if (spin === 0) {
		return 3 * rs; // Schwarzschild case
	}

	// Simplified formula for Kerr ISCO
	const a = spin;
	const Z1 = 1 + Math.pow(1 - a * a, 1 / 3) * (Math.pow(1 + a, 1 / 3) + Math.pow(1 - a, 1 / 3));
	const Z2 = Math.sqrt(3 * a * a + Z1 * Z1);
	const rISCO = 3 + Z2 - Math.sqrt((3 - Z1) * (3 + Z1 + 2 * Z2));

	return (rISCO * rs) / 2;
}

export function calculateGravitationalWaveStrain(mass1: number, mass2: number, distance: number, frequency: number): number {
	// GW strain amplitude for circular binary
	const G = 6.674e-11; // m³/kg/s²
	const c = 2.998e8; // m/s
	const solarMass = 1.989e30; // kg
	const pc = 3.086e16; // m

	const M = (mass1 + mass2) * solarMass;
	const μ = ((mass1 * mass2) / (mass1 + mass2)) * solarMass;
	const d = distance * pc;

	const strain = ((G / c ** 4) * (5 / 24) * Math.pow((Math.PI * G * M * frequency) / c ** 3, 2 / 3) * μ) / d;

	return strain;
}

export function classifyBlackHoleByMass(mass: number): string {
	if (mass < 0) return "exotic object";
	if (mass < 1e-10) return "quantum black hole";
	if (mass < 1e-5) return "primordial micro";
	if (mass < 1) return "primordial mini";
	if (mass < 3) return "impossible mass gap";
	if (mass < 100) return "stellar mass";
	if (mass < 1e5) return "intermediate mass";
	if (mass < 1e9) return "supermassive";
	return "ultramassive";
}

export function getBlackHoleFormationPath(mass: number): FormationMechanism[] {
	if (mass < 1e-10) {
		return [FormationMechanism.PRIMORDIAL_FORMATION];
	} else if (mass < 100) {
		return [FormationMechanism.STELLAR_COLLAPSE];
	} else if (mass < 1e5) {
		return [FormationMechanism.HIERARCHICAL_MERGER, FormationMechanism.DIRECT_COLLAPSE];
	} else {
		return [FormationMechanism.DIRECT_COLLAPSE, FormationMechanism.ACCRETION_GROWTH, FormationMechanism.HIERARCHICAL_MERGER];
	}
}

export function generateBlackHoleResources(blackHole: BlackHoleTypeDefinition): Map<string, number> {
	const resources = new Map<string, number>();

	// Basic resources based on mass and type
	resources.set("gravitational_energy", Math.log10(blackHole.physics.mass));
	resources.set("exotic_physics", blackHole.physics.spin);
	resources.set("spacetime_curvature", blackHole.physics.mass / 1e6);

	// Special resources for different types
	switch (blackHole.class) {
		case BlackHoleClass.SUPERMASSIVE:
			resources.set("galactic_influence", 1.0);
			resources.set("jet_power", 0.9);
			resources.set("time_dilation", 0.8);
			break;
		case BlackHoleClass.STELLAR_MASS:
			resources.set("x_ray_emission", 0.8);
			resources.set("relativistic_effects", 0.7);
			resources.set("accretion_physics", 0.9);
			break;
		case BlackHoleClass.PRIMORDIAL_MICRO:
			resources.set("hawking_radiation", 1.0);
			resources.set("quantum_effects", 0.95);
			resources.set("dark_matter_clues", 0.8);
			break;
		case BlackHoleClass.BINARY_STELLAR:
			resources.set("gravitational_waves", 1.0);
			resources.set("spacetime_ripples", 0.9);
			resources.set("merger_physics", 0.8);
			break;
		case BlackHoleClass.KERR:
			resources.set("frame_dragging", 0.9);
			resources.set("ergosphere_energy", 0.8);
			resources.set("enhanced_jets", 0.7);
			break;
		case BlackHoleClass.WHITE_HOLE:
			resources.set("exotic_matter", 0.9);
			resources.set("time_reversal", 1.0);
			resources.set("causality_violation", 0.8);
			break;
		case BlackHoleClass.WORMHOLE:
			resources.set("exotic_matter", 1.0);
			resources.set("faster_than_light", 1.0);
			resources.set("spacetime_topology", 0.9);
			break;
	}

	return resources;
}

export function calculateBlackHoleInteraction(bh1: BlackHoleTypeDefinition, bh2: BlackHoleTypeDefinition, separation: number): number {
	// Gravitational interaction strength
	const mass1 = bh1.physics.mass;
	const mass2 = bh2.physics.mass;

	return (mass1 * mass2) / Math.pow(separation, 2);
}

export function predictMergerOutcome(primary: BlackHoleTypeDefinition, secondary: BlackHoleTypeDefinition): BlackHoleClass {
	const totalMass = primary.physics.mass + secondary.physics.mass;
	const averageSpin = (primary.physics.spin + secondary.physics.spin) / 2;

	if (totalMass < 100) {
		return BlackHoleClass.STELLAR_MASS;
	} else if (totalMass < 1e5) {
		return BlackHoleClass.INTERMEDIATE_MASS;
	} else if (totalMass < 1e10) {
		return BlackHoleClass.SUPERMASSIVE;
	} else {
		return BlackHoleClass.ULTRAMASSIVE;
	}
}

export function calculateAccretionLuminosity(mass: number, accretionRate: number, efficiency: number = 0.1): number {
	// L = η * Ṁ * c²
	const c = 2.998e8; // m/s
	const solarMass = 1.989e30; // kg
	const yearToSeconds = 365.25 * 24 * 3600;

	const massFlowRate = (accretionRate * solarMass) / yearToSeconds; // kg/s
	const luminosity = efficiency * massFlowRate * c * c; // Watts

	return luminosity * 1e7; // Convert to erg/s
}

export function calculateJetPower(mass: number, spin: number, accretionRate: number, magneticField: number): number {
	// Blandford-Znajek mechanism for jet power
	// P_jet ∝ a² * (B²/8π) * (GM/c)² * (c/r_H)

	const rs = calculateSchwarzschildRadius(mass) * 1000; // Convert to meters
	const rH = (rs / 2) * (1 + Math.sqrt(1 - spin * spin)); // Horizon radius

	const power = (spin * spin * magneticField * magneticField * rs * rs * 2.998e8) / (8 * Math.PI * rH);

	return power * 1e7; // Convert to erg/s
}

export function calculateTidalRadius(mass: number, companionMass: number): number {
	// Roche radius for tidal disruption
	const massRatio = companionMass / mass;
	const rs = calculateSchwarzschildRadius(mass);

	return 2.44 * rs * Math.pow(mass / companionMass, 1 / 3);
}

export function isStable(blackHole: BlackHoleTypeDefinition): boolean {
	// Stability criteria for different black hole types
	switch (blackHole.class) {
		case BlackHoleClass.WHITE_HOLE:
			return false; // Unstable
		case BlackHoleClass.WORMHOLE:
			return blackHole.physics.mass < 0; // Requires exotic matter
		case BlackHoleClass.PRIMORDIAL_MICRO:
			return blackHole.physics.evaporationTime > 13.8e9; // Age of universe
		default:
			return true; // Generally stable
	}
}

export function getObservationalSignature(blackHole: BlackHoleTypeDefinition): string[] {
	const signatures: string[] = [];

	if (blackHole.observables.gravitationalWaveStrain > 1e-25) {
		signatures.push("gravitational waves");
	}
	if (blackHole.observables.xrayLuminosity > 1e35) {
		signatures.push("X-ray emission");
	}
	if (blackHole.observables.relativisticJets) {
		signatures.push("relativistic jets");
	}
	if (blackHole.observables.ironKAlphaLine) {
		signatures.push("iron K-α line");
	}
	if (blackHole.observables.frameDragging) {
		signatures.push("frame dragging");
	}
	if (blackHole.visualFeatures.shadowImage) {
		signatures.push("event horizon shadow");
	}
	if (blackHole.physics.hawkingTemperature > 1e-10) {
		signatures.push("Hawking radiation");
	}

	return signatures;
}
