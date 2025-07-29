/**
 * @file stellar-types.ts
 * @description Comprehensive stellar classification system with scientifically accurate star types
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * 
 * @purpose Defines all stellar types, evolutionary stages, and physical properties
 * for realistic star generation and stellar physics simulation.
 */

import { Vector3, Color } from 'three';

// Stellar Classifications
export enum StellarClass {
    // Pre-Main Sequence
    PROTOSTAR = 'protostar',
    T_TAURI = 't_tauri',
    HERBIG_AE_BE = 'herbig_ae_be',
    
    // Main Sequence (Morgan-Keenan Classification)
    O_TYPE = 'o_type',           // Very hot, blue
    B_TYPE = 'b_type',           // Hot, blue-white
    A_TYPE = 'a_type',           // Hot, white
    F_TYPE = 'f_type',           // Hot, yellow-white
    G_TYPE = 'g_type',           // Medium, yellow (Sun-like)
    K_TYPE = 'k_type',           // Cool, orange
    M_TYPE = 'm_type',           // Cool, red
    
    // Post-Main Sequence
    RED_GIANT = 'red_giant',
    RED_SUPERGIANT = 'red_supergiant',
    BLUE_GIANT = 'blue_giant',
    BLUE_SUPERGIANT = 'blue_supergiant',
    
    // Evolved and Variable Stars
    WOLF_RAYET = 'wolf_rayet',
    CARBON_STAR = 'carbon_star',
    CEPHEID_VARIABLE = 'cepheid_variable',
    RR_LYRAE = 'rr_lyrae',
    
    // Compact Objects
    WHITE_DWARF = 'white_dwarf',
    NEUTRON_STAR = 'neutron_star',
    PULSAR = 'pulsar',
    MAGNETAR = 'magnetar',
    BLACK_HOLE = 'black_hole',
    
    // Failed Stars and Brown Dwarfs
    BROWN_DWARF = 'brown_dwarf',
    
    // Theoretical and Exotic Objects
    BLACK_DWARF = 'black_dwarf',
    THORNE_ZYTKOW = 'thorne_zytkow',
    QUARK_STAR = 'quark_star',
    ELECTROWEAK_STAR = 'electroweak_star'
}

// Stellar Evolution Stages
export enum EvolutionStage {
    FORMATION = 'formation',
    PRE_MAIN_SEQUENCE = 'pre_main_sequence',
    MAIN_SEQUENCE = 'main_sequence',
    SUBGIANT = 'subgiant',
    GIANT = 'giant',
    ASYMPTOTIC_GIANT = 'asymptotic_giant',
    HORIZONTAL_BRANCH = 'horizontal_branch',
    PLANETARY_NEBULA = 'planetary_nebula',
    SUPERNOVA = 'supernova',
    REMNANT = 'remnant',
    DEATH = 'death'
}

// Spectral Characteristics
export interface SpectralData {
    temperature: number; // Kelvin
    luminosity: number; // Solar luminosities
    radius: number; // Solar radii
    mass: number; // Solar masses
    lifespan: number; // Million years
    spectralLines: string[]; // Dominant spectral lines
    colorIndex: number; // B-V color index
}

// Stellar Physical Properties
export interface StellarPhysics {
    // Core Properties
    coreTemperature: number; // Kelvin
    corePressure: number; // Pascals
    coreDensity: number; // kg/m³
    fusionRate: number; // Watts
    
    // Atmospheric Properties
    surfaceTemperature: number; // Kelvin
    surfaceGravity: number; // m/s²
    escapeVelocity: number; // km/s
    rotationPeriod: number; // hours
    
    // Magnetic Properties
    magneticFieldStrength: number; // Tesla
    stellarWindSpeed: number; // km/s
    massLossRate: number; // Solar masses per year
    
    // Energy Output
    bolometricLuminosity: number; // Watts
    surfaceBrightness: number; // W/m²
    effectiveTemperature: number; // Kelvin
}

// Visual Characteristics for Low-Poly Generation
export interface StellarVisualFeatures {
    // Core Appearance
    coronaVisible: boolean;
    stellarFlares: boolean;
    sunspots: boolean;
    granulation: boolean;
    
    // Atmospheric Effects
    stellarWind: boolean;
    jetStreams: boolean;
    accretionDisk: boolean;
    planetaryNebula: boolean;
    
    // Exotic Features
    magnetosphere: boolean;
    gravitationalLensing: boolean;
    hawkingRadiation: boolean;
    ergosphere: boolean;
    
    // Variable Features
    pulsation: boolean;
    brightnessCycles: boolean;
    spectralVariation: boolean;
    
    // Environmental Effects
    habitableZone: boolean;
    tidaLocking: boolean;
    stellarClassification: string;
}

// Stellar System Properties
export interface StellarSystemData {
    // Companion Stars
    isBinary: boolean;
    isMultiple: boolean;
    companionTypes: StellarClass[];
    orbitalPeriods: number[]; // days
    
    // Planetary System
    planetarySystemAge: number; // million years
    habitableZoneInner: number; // AU
    habitableZoneOuter: number; // AU
    frostLine: number; // AU
    
    // Debris and Structure
    protoplanetaryDisk: boolean;
    asteroidBelt: boolean;
    cometCloud: boolean;
    
    // Galactic Context
    galacticLocation: Vector3;
    metallicity: number; // [Fe/H]
    kinematics: Vector3; // km/s
    age: number; // billion years
}

// Complete Stellar Type Definition
export interface StellarTypeDefinition {
    class: StellarClass;
    name: string;
    description: string;
    realWorldExample: string;
    evolutionStage: EvolutionStage;
    
    // Physical Ranges
    massRange: [number, number]; // Solar masses
    radiusRange: [number, number]; // Solar radii
    temperatureRange: [number, number]; // Kelvin
    luminosityRange: [number, number]; // Solar luminosities
    lifespanRange: [number, number]; // Million years
    
    // Spectral Data
    spectralType: string;
    spectralData: SpectralData;
    
    // Physics
    stellarPhysics: StellarPhysics;
    
    // Visual Properties
    primaryColors: Color[];
    secondaryColors: Color[];
    visualFeatures: StellarVisualFeatures;
    
    // System Properties
    systemData: StellarSystemData;
    
    // Formation and Evolution
    formationRequirements: string[];
    evolutionPath: EvolutionStage[];
    deathScenarios: string[];
    
    // Low-Poly Generation Parameters
    geometryComplexity: number; // 1-5
    effectDensity: number; // 0-1
    animationIntensity: number; // 0-1
    renderingTechniques: string[];
    
    // Gameplay Properties
    discoverability: number; // 0-1 (rarer = lower)
    scientificValue: number; // 1-10
    dangerLevel: number; // 0-10
    resourceValue: number; // 1-10
    
    // Special Properties
    uniqueTraits: string[];
    stellarPhenomena: string[];
    observationalChallenges: string[];
}

// Complete Stellar Database
export const STELLAR_TYPES: Map<StellarClass, StellarTypeDefinition> = new Map([
	[
		StellarClass.PROTOSTAR,
		{
			class: StellarClass.PROTOSTAR,
			name: "Protostar",
			description: "A star in the earliest stage of formation, still accreting mass",
			realWorldExample: "HL Tauri, FU Orionis",
			evolutionStage: EvolutionStage.FORMATION,

			massRange: [0.01, 50],
			radiusRange: [1, 100],
			temperatureRange: [1000, 4000],
			luminosityRange: [0.0001, 1000],
			lifespanRange: [0.1, 10],

			spectralType: "Variable",
			spectralData: {
				temperature: 2500,
				luminosity: 0.1,
				radius: 10,
				mass: 1,
				lifespan: 1,
				spectralLines: ["H2O", "CO", "silicates"],
				colorIndex: 2.5,
			},

			stellarPhysics: {
				coreTemperature: 1e6,
				corePressure: 1e10,
				coreDensity: 1e3,
				fusionRate: 0,
				surfaceTemperature: 2500,
				surfaceGravity: 100,
				escapeVelocity: 50,
				rotationPeriod: 240,
				magneticFieldStrength: 0.1,
				stellarWindSpeed: 10,
				massLossRate: 1e-6,
				bolometricLuminosity: 3.8e25,
				surfaceBrightness: 1e4,
				effectiveTemperature: 2500,
			},

			primaryColors: [new Color(0xff4500), new Color(0x8b0000), new Color(0xff6347)],
			secondaryColors: [new Color(0x2f2f2f), new Color(0x4b0082), new Color(0x800080)],

			visualFeatures: {
				coronaVisible: false,
				stellarFlares: false,
				sunspots: false,
				granulation: false,
				stellarWind: true,
				jetStreams: true,
				accretionDisk: true,
				planetaryNebula: false,
				magnetosphere: true,
				gravitationalLensing: false,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: true,
				brightnessCycles: true,
				spectralVariation: true,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "Pre-MS",
			},

			systemData: {
				isBinary: false,
				isMultiple: false,
				companionTypes: [],
				orbitalPeriods: [],
				planetarySystemAge: 1,
				habitableZoneInner: 0,
				habitableZoneOuter: 0,
				frostLine: 0.1,
				protoplanetaryDisk: true,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(0, 0, 0),
				metallicity: -0.5,
				kinematics: new Vector3(10, 5, 8),
				age: 0.001,
			},

			formationRequirements: ["molecular cloud collapse", "sufficient mass", "low metallicity acceptable"],
			evolutionPath: [EvolutionStage.FORMATION, EvolutionStage.PRE_MAIN_SEQUENCE, EvolutionStage.MAIN_SEQUENCE],
			deathScenarios: ["T Tauri phase", "brown dwarf (if insufficient mass)"],

			geometryComplexity: 4,
			effectDensity: 0.9,
			animationIntensity: 0.8,
			renderingTechniques: ["particle systems", "volumetric rendering", "disk simulation"],

			discoverability: 0.3,
			scientificValue: 9,
			dangerLevel: 3,
			resourceValue: 2,

			uniqueTraits: ["active accretion", "variable luminosity", "outflow jets"],
			stellarPhenomena: ["FU Orionis outbursts", "Herbig-Haro objects", "molecular outflows"],
			observationalChallenges: ["embedded in dust", "highly variable", "infrared observation required"],
		},
	],

	[
		StellarClass.G_TYPE,
		{
			class: StellarClass.G_TYPE,
			name: "G-Type Main Sequence Star",
			description: "Sun-like star in stable hydrogen burning phase",
			realWorldExample: "The Sun, Alpha Centauri A, Tau Ceti",
			evolutionStage: EvolutionStage.MAIN_SEQUENCE,

			massRange: [0.8, 1.2],
			radiusRange: [0.7, 1.3],
			temperatureRange: [5200, 6000],
			luminosityRange: [0.6, 1.5],
			lifespanRange: [8000, 12000],

			spectralType: "G V",
			spectralData: {
				temperature: 5778,
				luminosity: 1.0,
				radius: 1.0,
				mass: 1.0,
				lifespan: 10000,
				spectralLines: ["H I", "Ca II H&K", "G-band", "Mg I"],
				colorIndex: 0.65,
			},

			stellarPhysics: {
				coreTemperature: 15.7e6,
				corePressure: 2.65e11,
				coreDensity: 1.6e5,
				fusionRate: 3.8e26,
				surfaceTemperature: 5778,
				surfaceGravity: 274,
				escapeVelocity: 618,
				rotationPeriod: 600,
				magneticFieldStrength: 1e-4,
				stellarWindSpeed: 400,
				massLossRate: 2e-14,
				bolometricLuminosity: 3.8e26,
				surfaceBrightness: 6.3e7,
				effectiveTemperature: 5778,
			},

			primaryColors: [new Color(0xffd700), new Color(0xffa500), new Color(0xffff00)],
			secondaryColors: [new Color(0xffffff), new Color(0xffe4b5), new Color(0xf0e68c)],

			visualFeatures: {
				coronaVisible: true,
				stellarFlares: true,
				sunspots: true,
				granulation: true,
				stellarWind: true,
				jetStreams: false,
				accretionDisk: false,
				planetaryNebula: false,
				magnetosphere: true,
				gravitationalLensing: false,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: false,
				brightnessCycles: false,
				spectralVariation: false,
				habitableZone: true,
				tidaLocking: true,
				stellarClassification: "G V",
			},

			systemData: {
				isBinary: false,
				isMultiple: false,
				companionTypes: [],
				orbitalPeriods: [],
				planetarySystemAge: 5000,
				habitableZoneInner: 0.95,
				habitableZoneOuter: 1.37,
				frostLine: 2.7,
				protoplanetaryDisk: false,
				asteroidBelt: true,
				cometCloud: true,
				galacticLocation: new Vector3(8500, 0, 20),
				metallicity: 0.0,
				kinematics: new Vector3(220, 12, 7),
				age: 4.6,
			},

			formationRequirements: ["solar metallicity", "1 solar mass", "Population I"],
			evolutionPath: [EvolutionStage.MAIN_SEQUENCE, EvolutionStage.SUBGIANT, EvolutionStage.GIANT, EvolutionStage.PLANETARY_NEBULA, EvolutionStage.REMNANT],
			deathScenarios: ["red giant", "planetary nebula", "white dwarf"],

			geometryComplexity: 3,
			effectDensity: 0.6,
			animationIntensity: 0.4,
			renderingTechniques: ["surface granulation", "coronal loops", "solar wind"],

			discoverability: 0.8,
			scientificValue: 8,
			dangerLevel: 2,
			resourceValue: 8,

			uniqueTraits: ["stable luminosity", "11-year magnetic cycle", "habitable zone"],
			stellarPhenomena: ["solar flares", "coronal mass ejections", "sunspot cycles"],
			observationalChallenges: ["none - ideal reference star"],
		},
	],

	[
		StellarClass.O_TYPE,
		{
			class: StellarClass.O_TYPE,
			name: "O-Type Blue Giant",
			description: "Extremely massive, hot, and luminous blue star",
			realWorldExample: "Alnitak, Mintaka, Cygnus OB2-12",
			evolutionStage: EvolutionStage.MAIN_SEQUENCE,

			massRange: [15, 90],
			radiusRange: [6.6, 17.8],
			temperatureRange: [30000, 50000],
			luminosityRange: [30000, 1000000],
			lifespanRange: [3, 11],

			spectralType: "O V",
			spectralData: {
				temperature: 40000,
				luminosity: 100000,
				radius: 12,
				mass: 40,
				lifespan: 5,
				spectralLines: ["He II", "H I", "N III", "O III"],
				colorIndex: -0.33,
			},

			stellarPhysics: {
				coreTemperature: 30e6,
				corePressure: 1e12,
				coreDensity: 5e4,
				fusionRate: 1e29,
				surfaceTemperature: 40000,
				surfaceGravity: 1000,
				escapeVelocity: 2000,
				rotationPeriod: 24,
				magneticFieldStrength: 1e-2,
				stellarWindSpeed: 3000,
				massLossRate: 1e-6,
				bolometricLuminosity: 3.8e31,
				surfaceBrightness: 2e9,
				effectiveTemperature: 40000,
			},

			primaryColors: [new Color(0x0066ff), new Color(0x4169e1), new Color(0x87ceeb)],
			secondaryColors: [new Color(0xffffff), new Color(0xe6e6fa), new Color(0xb0e0e6)],

			visualFeatures: {
				coronaVisible: true,
				stellarFlares: true,
				sunspots: false,
				granulation: false,
				stellarWind: true,
				jetStreams: false,
				accretionDisk: false,
				planetaryNebula: false,
				magnetosphere: true,
				gravitationalLensing: false,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: false,
				brightnessCycles: false,
				spectralVariation: false,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "O V",
			},

			systemData: {
				isBinary: true,
				isMultiple: true,
				companionTypes: [StellarClass.O_TYPE, StellarClass.B_TYPE],
				orbitalPeriods: [1, 100],
				planetarySystemAge: 5,
				habitableZoneInner: 10,
				habitableZoneOuter: 50,
				frostLine: 100,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(8000, 0, 100),
				metallicity: 0.2,
				kinematics: new Vector3(200, 20, 15),
				age: 0.005,
			},

			formationRequirements: ["very high mass", "high metallicity", "stellar nursery"],
			evolutionPath: [EvolutionStage.MAIN_SEQUENCE, EvolutionStage.SUPERNOVA, EvolutionStage.REMNANT],
			deathScenarios: ["core collapse supernova", "black hole", "neutron star"],

			geometryComplexity: 5,
			effectDensity: 1.0,
			animationIntensity: 0.9,
			renderingTechniques: ["volumetric scattering", "stellar wind visualization", "UV emission"],

			discoverability: 0.1,
			scientificValue: 10,
			dangerLevel: 9,
			resourceValue: 3,

			uniqueTraits: ["extreme UV output", "powerful stellar winds", "short lifespan"],
			stellarPhenomena: ["stellar wind bubbles", "shock waves", "ionization fronts"],
			observationalChallenges: ["extreme brightness", "UV observation required", "often obscured"],
		},
	],

	[
		StellarClass.RED_SUPERGIANT,
		{
			class: StellarClass.RED_SUPERGIANT,
			name: "Red Supergiant",
			description: "Massive evolved star in final evolutionary stages",
			realWorldExample: "Betelgeuse, Antares, VY Canis Majoris",
			evolutionStage: EvolutionStage.GIANT,

			massRange: [10, 40],
			radiusRange: [200, 1700],
			temperatureRange: [3000, 4500],
			luminosityRange: [10000, 500000],
			lifespanRange: [0.1, 1],

			spectralType: "M Ia",
			spectralData: {
				temperature: 3500,
				luminosity: 100000,
				radius: 700,
				mass: 20,
				lifespan: 0.5,
				spectralLines: ["TiO", "H2O", "OH", "CO"],
				colorIndex: 2.0,
			},

			stellarPhysics: {
				coreTemperature: 100e6,
				corePressure: 1e13,
				coreDensity: 1e6,
				fusionRate: 1e30,
				surfaceTemperature: 3500,
				surfaceGravity: 0.01,
				escapeVelocity: 40,
				rotationPeriod: 8760,
				magneticFieldStrength: 1e-6,
				stellarWindSpeed: 30,
				massLossRate: 1e-4,
				bolometricLuminosity: 3.8e31,
				surfaceBrightness: 1e5,
				effectiveTemperature: 3500,
			},

			primaryColors: [new Color(0x8b0000), new Color(0xff4500), new Color(0xff6347)],
			secondaryColors: [new Color(0xffa500), new Color(0xdc143c), new Color(0xb22222)],

			visualFeatures: {
				coronaVisible: false,
				stellarFlares: false,
				sunspots: false,
				granulation: true,
				stellarWind: true,
				jetStreams: false,
				accretionDisk: false,
				planetaryNebula: false,
				magnetosphere: false,
				gravitationalLensing: false,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: true,
				brightnessCycles: true,
				spectralVariation: true,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "M Ia",
			},

			systemData: {
				isBinary: false,
				isMultiple: false,
				companionTypes: [],
				orbitalPeriods: [],
				planetarySystemAge: 10,
				habitableZoneInner: 50,
				habitableZoneOuter: 200,
				frostLine: 500,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(7500, 0, 50),
				metallicity: 0.1,
				kinematics: new Vector3(180, 25, 20),
				age: 0.01,
			},

			formationRequirements: ["high initial mass", "post-main sequence", "heavy element fusion"],
			evolutionPath: [EvolutionStage.MAIN_SEQUENCE, EvolutionStage.GIANT, EvolutionStage.SUPERNOVA, EvolutionStage.REMNANT],
			deathScenarios: ["Type II supernova", "hypernova", "black hole formation"],

			geometryComplexity: 4,
			effectDensity: 0.8,
			animationIntensity: 0.7,
			renderingTechniques: ["atmospheric dynamics", "mass loss visualization", "convection cells"],

			discoverability: 0.05,
			scientificValue: 10,
			dangerLevel: 10,
			resourceValue: 1,

			uniqueTraits: ["extreme size", "mass loss", "supernova progenitor"],
			stellarPhenomena: ["stellar wind mass loss", "convective transport", "heavy element synthesis"],
			observationalChallenges: ["extreme variability", "dust obscuration", "unstable structure"],
		},
	],

	[
		StellarClass.WHITE_DWARF,
		{
			class: StellarClass.WHITE_DWARF,
			name: "White Dwarf",
			description: "Dense stellar remnant composed of electron-degenerate matter",
			realWorldExample: "Sirius B, 40 Eridani B, Van Maanen's star",
			evolutionStage: EvolutionStage.REMNANT,

			massRange: [0.17, 1.33],
			radiusRange: [0.008, 0.02],
			temperatureRange: [4000, 150000],
			luminosityRange: [0.0001, 100],
			lifespanRange: [1e6, 1e10],

			spectralType: "DA",
			spectralData: {
				temperature: 25000,
				luminosity: 0.001,
				radius: 0.01,
				mass: 0.6,
				lifespan: 1e9,
				spectralLines: ["H I", "He I", "C I", "heavy metals"],
				colorIndex: -0.5,
			},

			stellarPhysics: {
				coreTemperature: 25000,
				corePressure: 1e15,
				coreDensity: 1e9,
				fusionRate: 0,
				surfaceTemperature: 25000,
				surfaceGravity: 1e6,
				escapeVelocity: 5000,
				rotationPeriod: 1,
				magneticFieldStrength: 1e4,
				stellarWindSpeed: 0,
				massLossRate: 0,
				bolometricLuminosity: 3.8e23,
				surfaceBrightness: 1e12,
				effectiveTemperature: 25000,
			},

			primaryColors: [new Color(0xffffff), new Color(0xe6e6fa), new Color(0xf0f8ff)],
			secondaryColors: [new Color(0x87ceeb), new Color(0xb0e0e6), new Color(0xadd8e6)],

			visualFeatures: {
				coronaVisible: false,
				stellarFlares: false,
				sunspots: false,
				granulation: false,
				stellarWind: false,
				jetStreams: false,
				accretionDisk: false,
				planetaryNebula: true,
				magnetosphere: true,
				gravitationalLensing: true,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: true,
				brightnessCycles: false,
				spectralVariation: false,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "WD",
			},

			systemData: {
				isBinary: true,
				isMultiple: false,
				companionTypes: [StellarClass.M_TYPE],
				orbitalPeriods: [1000],
				planetarySystemAge: 1000,
				habitableZoneInner: 0.005,
				habitableZoneOuter: 0.02,
				frostLine: 0.1,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(8500, 0, 300),
				metallicity: -0.2,
				kinematics: new Vector3(240, 40, 30),
				age: 1.0,
			},

			formationRequirements: ["low/medium mass progenitor", "planetary nebula phase", "cooling process"],
			evolutionPath: [EvolutionStage.REMNANT, EvolutionStage.DEATH],
			deathScenarios: ["black dwarf (theoretical)", "Type Ia supernova (if accreting)"],

			geometryComplexity: 2,
			effectDensity: 0.3,
			animationIntensity: 0.2,
			renderingTechniques: ["surface crystallization", "gravitational field visualization"],

			discoverability: 0.4,
			scientificValue: 9,
			dangerLevel: 7,
			resourceValue: 6,

			uniqueTraits: ["extreme density", "slow cooling", "quantum degeneracy"],
			stellarPhenomena: ["crystallization", "gravitational redshift", "cooling process"],
			observationalChallenges: ["very faint", "requires UV observation", "small size"],
		},
	],

	[
		StellarClass.NEUTRON_STAR,
		{
			class: StellarClass.NEUTRON_STAR,
			name: "Neutron Star",
			description: "Ultra-dense stellar remnant composed of neutron-degenerate matter",
			realWorldExample: "PSR B1919+21, Vela Pulsar, Crab Pulsar",
			evolutionStage: EvolutionStage.REMNANT,

			massRange: [1.17, 2.16],
			radiusRange: [0.000017, 0.000023],
			temperatureRange: [600000, 1800000],
			luminosityRange: [0.0001, 1],
			lifespanRange: [1e10, 1e15],

			spectralType: "NS",
			spectralData: {
				temperature: 1000000,
				luminosity: 0.001,
				radius: 0.00002,
				mass: 1.4,
				lifespan: 1e12,
				spectralLines: ["cyclotron lines", "atomic lines (in atmosphere)"],
				colorIndex: -1.0,
			},

			stellarPhysics: {
				coreTemperature: 1e8,
				corePressure: 1e35,
				coreDensity: 1e18,
				fusionRate: 0,
				surfaceTemperature: 1000000,
				surfaceGravity: 1e12,
				escapeVelocity: 100000,
				rotationPeriod: 0.001,
				magneticFieldStrength: 1e8,
				stellarWindSpeed: 30000,
				massLossRate: 0,
				bolometricLuminosity: 1e28,
				surfaceBrightness: 1e20,
				effectiveTemperature: 1000000,
			},

			primaryColors: [new Color(0x8a2be2), new Color(0x4b0082), new Color(0x9400d3)],
			secondaryColors: [new Color(0xffffff), new Color(0x00ffff), new Color(0xff00ff)],

			visualFeatures: {
				coronaVisible: false,
				stellarFlares: false,
				sunspots: false,
				granulation: false,
				stellarWind: true,
				jetStreams: true,
				accretionDisk: false,
				planetaryNebula: false,
				magnetosphere: true,
				gravitationalLensing: true,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: true,
				brightnessCycles: true,
				spectralVariation: false,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "NS",
			},

			systemData: {
				isBinary: true,
				isMultiple: false,
				companionTypes: [StellarClass.WHITE_DWARF, StellarClass.M_TYPE],
				orbitalPeriods: [0.1],
				planetarySystemAge: 100,
				habitableZoneInner: 0,
				habitableZoneOuter: 0,
				frostLine: 0,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(8000, 0, 500),
				metallicity: 0.0,
				kinematics: new Vector3(300, 100, 80),
				age: 0.1,
			},

			formationRequirements: ["massive star supernova", "core collapse", "neutron degeneracy"],
			evolutionPath: [EvolutionStage.REMNANT],
			deathScenarios: ["black hole (rare)", "cooling (very long timescale)"],

			geometryComplexity: 3,
			effectDensity: 0.9,
			animationIntensity: 1.0,
			renderingTechniques: ["magnetic field lines", "radiation beams", "gravitational effects"],

			discoverability: 0.02,
			scientificValue: 10,
			dangerLevel: 10,
			resourceValue: 2,

			uniqueTraits: ["extreme density", "powerful magnetic field", "precise rotation"],
			stellarPhenomena: ["pulsar emissions", "starquakes", "frame dragging"],
			observationalChallenges: ["radio detection required", "timing precision", "extreme physics"],
		},
	],

	[
		StellarClass.BLACK_HOLE,
		{
			class: StellarClass.BLACK_HOLE,
			name: "Stellar Black Hole",
			description: "Gravitational singularity from massive star collapse",
			realWorldExample: "Cygnus X-1, V616 Monocerotis, GW150914",
			evolutionStage: EvolutionStage.DEATH,

			massRange: [3, 20],
			radiusRange: [0.00000001, 0.00000006],
			temperatureRange: [0.0000006, 0.000002],
			luminosityRange: [0, 1e6],
			lifespanRange: [1e64, 1e67],

			spectralType: "BH",
			spectralData: {
				temperature: 0.000001,
				luminosity: 0,
				radius: 0.00000003,
				mass: 10,
				lifespan: 1e65,
				spectralLines: ["none (direct)", "accretion disk emissions"],
				colorIndex: 0,
			},

			stellarPhysics: {
				coreTemperature: 0,
				corePressure: Infinity,
				coreDensity: Infinity,
				fusionRate: 0,
				surfaceTemperature: 0.000001,
				surfaceGravity: Infinity,
				escapeVelocity: 300000000,
				rotationPeriod: 0.001,
				magneticFieldStrength: 1e12,
				stellarWindSpeed: 0,
				massLossRate: 0,
				bolometricLuminosity: 0,
				surfaceBrightness: 0,
				effectiveTemperature: 0.000001,
			},

			primaryColors: [new Color(0x000000), new Color(0x1a1a1a), new Color(0x333333)],
			secondaryColors: [new Color(0xff4500), new Color(0xffd700), new Color(0xffffff)],

			visualFeatures: {
				coronaVisible: false,
				stellarFlares: false,
				sunspots: false,
				granulation: false,
				stellarWind: false,
				jetStreams: true,
				accretionDisk: true,
				planetaryNebula: false,
				magnetosphere: true,
				gravitationalLensing: true,
				hawkingRadiation: true,
				ergosphere: true,
				pulsation: false,
				brightnessCycles: true,
				spectralVariation: true,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "BH",
			},

			systemData: {
				isBinary: true,
				isMultiple: false,
				companionTypes: [StellarClass.O_TYPE, StellarClass.B_TYPE],
				orbitalPeriods: [0.1],
				planetarySystemAge: 100,
				habitableZoneInner: 0,
				habitableZoneOuter: 0,
				frostLine: 0,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(7000, 0, 200),
				metallicity: 0.2,
				kinematics: new Vector3(500, 200, 150),
				age: 0.1,
			},

			formationRequirements: ["very massive star", "core collapse supernova", "insufficient neutron degeneracy pressure"],
			evolutionPath: [EvolutionStage.DEATH],
			deathScenarios: ["Hawking radiation evaporation (extremely long timescale)"],

			geometryComplexity: 5,
			effectDensity: 1.0,
			animationIntensity: 1.0,
			renderingTechniques: ["event horizon", "accretion disk", "gravitational lensing", "relativistic jets"],

			discoverability: 0.001,
			scientificValue: 10,
			dangerLevel: 10,
			resourceValue: 1,

			uniqueTraits: ["event horizon", "spacetime curvature", "information paradox"],
			stellarPhenomena: ["gravitational waves", "time dilation", "spaghettification"],
			observationalChallenges: ["invisible direct observation", "requires gravitational effects", "X-ray emissions from accretion"],
		},
	],

	[
		StellarClass.BROWN_DWARF,
		{
			class: StellarClass.BROWN_DWARF,
			name: "Brown Dwarf",
			description: "Substellar object too small to sustain hydrogen fusion",
			realWorldExample: "Gliese 229B, Teide 1, Luhman 16",
			evolutionStage: EvolutionStage.MAIN_SEQUENCE,

			massRange: [0.012, 0.08],
			radiusRange: [0.08, 0.15],
			temperatureRange: [300, 2500],
			luminosityRange: [0.000001, 0.001],
			lifespanRange: [1e5, 1e12],

			spectralType: "L/T",
			spectralData: {
				temperature: 1000,
				luminosity: 0.00001,
				radius: 0.1,
				mass: 0.05,
				lifespan: 1e8,
				spectralLines: ["H2O", "CH4", "CO", "alkali metals"],
				colorIndex: 5.0,
			},

			stellarPhysics: {
				coreTemperature: 3e6,
				corePressure: 1e11,
				coreDensity: 1e5,
				fusionRate: 0,
				surfaceTemperature: 1000,
				surfaceGravity: 1000,
				escapeVelocity: 50,
				rotationPeriod: 2,
				magneticFieldStrength: 0.1,
				stellarWindSpeed: 1,
				massLossRate: 1e-15,
				bolometricLuminosity: 3.8e22,
				surfaceBrightness: 1e7,
				effectiveTemperature: 1000,
			},

			primaryColors: [new Color(0x8b0000), new Color(0x4b0000), new Color(0x2f1b14)],
			secondaryColors: [new Color(0x654321), new Color(0x800080), new Color(0x000000)],

			visualFeatures: {
				coronaVisible: false,
				stellarFlares: true,
				sunspots: false,
				granulation: false,
				stellarWind: false,
				jetStreams: false,
				accretionDisk: false,
				planetaryNebula: false,
				magnetosphere: true,
				gravitationalLensing: false,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: false,
				brightnessCycles: true,
				spectralVariation: true,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "BD",
			},

			systemData: {
				isBinary: true,
				isMultiple: false,
				companionTypes: [StellarClass.M_TYPE],
				orbitalPeriods: [100],
				planetarySystemAge: 1000,
				habitableZoneInner: 0.01,
				habitableZoneOuter: 0.03,
				frostLine: 0.1,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(8500, 0, 50),
				metallicity: 0.0,
				kinematics: new Vector3(220, 15, 10),
				age: 1.0,
			},

			formationRequirements: ["insufficient mass", "molecular cloud collapse", "substellar mass"],
			evolutionPath: [EvolutionStage.FORMATION, EvolutionStage.MAIN_SEQUENCE],
			deathScenarios: ["continuous cooling", "becomes cold brown dwarf"],

			geometryComplexity: 2,
			effectDensity: 0.2,
			animationIntensity: 0.3,
			renderingTechniques: ["atmospheric bands", "weather patterns", "infrared glow"],

			discoverability: 0.6,
			scientificValue: 7,
			dangerLevel: 1,
			resourceValue: 3,

			uniqueTraits: ["failed star", "atmospheric weather", "continuous cooling"],
			stellarPhenomena: ["atmospheric dynamics", "auroral activity", "methane bands"],
			observationalChallenges: ["very faint", "infrared observation required", "planetary mass companions"],
		},
	],

	[
		StellarClass.WOLF_RAYET,
		{
			class: StellarClass.WOLF_RAYET,
			name: "Wolf-Rayet Star",
			description: "Evolved massive star with strong stellar winds stripping outer layers",
			realWorldExample: "WR 104, WR 136, Gamma Velorum",
			evolutionStage: EvolutionStage.GIANT,

			massRange: [5, 25],
			radiusRange: [0.5, 20],
			temperatureRange: [30000, 210000],
			luminosityRange: [30000, 3000000],
			lifespanRange: [0.2, 2],

			spectralType: "WR",
			spectralData: {
				temperature: 80000,
				luminosity: 200000,
				radius: 5,
				mass: 15,
				lifespan: 1,
				spectralLines: ["He II", "C IV", "N V", "O VI"],
				colorIndex: -0.5,
			},

			stellarPhysics: {
				coreTemperature: 100e6,
				corePressure: 1e12,
				coreDensity: 1e5,
				fusionRate: 1e30,
				surfaceTemperature: 80000,
				surfaceGravity: 100,
				escapeVelocity: 1000,
				rotationPeriod: 12,
				magneticFieldStrength: 0.01,
				stellarWindSpeed: 5000,
				massLossRate: 1e-5,
				bolometricLuminosity: 7.6e31,
				surfaceBrightness: 1e10,
				effectiveTemperature: 80000,
			},

			primaryColors: [new Color(0x00ffff), new Color(0x87ceeb), new Color(0x4169e1)],
			secondaryColors: [new Color(0xffffff), new Color(0xe0ffff), new Color(0xb0e0e6)],

			visualFeatures: {
				coronaVisible: true,
				stellarFlares: false,
				sunspots: false,
				granulation: false,
				stellarWind: true,
				jetStreams: false,
				accretionDisk: false,
				planetaryNebula: false,
				magnetosphere: false,
				gravitationalLensing: false,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: false,
				brightnessCycles: true,
				spectralVariation: true,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "WR",
			},

			systemData: {
				isBinary: true,
				isMultiple: false,
				companionTypes: [StellarClass.O_TYPE],
				orbitalPeriods: [10],
				planetarySystemAge: 10,
				habitableZoneInner: 20,
				habitableZoneOuter: 80,
				frostLine: 200,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(7500, 0, 100),
				metallicity: 0.3,
				kinematics: new Vector3(200, 30, 25),
				age: 0.01,
			},

			formationRequirements: ["massive O/B star evolution", "strong stellar winds", "surface layer stripping"],
			evolutionPath: [EvolutionStage.MAIN_SEQUENCE, EvolutionStage.GIANT, EvolutionStage.SUPERNOVA],
			deathScenarios: ["Type Ib/Ic supernova", "gamma-ray burst"],

			geometryComplexity: 4,
			effectDensity: 0.9,
			animationIntensity: 0.8,
			renderingTechniques: ["stellar wind bubbles", "shock fronts", "spectral line emission"],

			discoverability: 0.03,
			scientificValue: 10,
			dangerLevel: 9,
			resourceValue: 2,

			uniqueTraits: ["extreme mass loss", "surface composition visible", "supernova progenitor"],
			stellarPhenomena: ["stellar wind collisions", "ring nebulae", "heavy element enrichment"],
			observationalChallenges: ["broad emission lines", "rapid evolution", "often in binaries"],
		},
	],

	[
		StellarClass.CARBON_STAR,
		{
			class: StellarClass.CARBON_STAR,
			name: "Carbon Star",
			description: "Evolved giant star with carbon-rich atmosphere",
			realWorldExample: "La Superba, T Lyrae, R Coronae Borealis",
			evolutionStage: EvolutionStage.ASYMPTOTIC_GIANT,

			massRange: [0.8, 8],
			radiusRange: [100, 500],
			temperatureRange: [2400, 3200],
			luminosityRange: [1000, 50000],
			lifespanRange: [1, 100],

			spectralType: "C",
			spectralData: {
				temperature: 2800,
				luminosity: 5000,
				radius: 200,
				mass: 3,
				lifespan: 10,
				spectralLines: ["C2", "CN", "CH", "C3"],
				colorIndex: 3.0,
			},

			stellarPhysics: {
				coreTemperature: 80e6,
				corePressure: 1e11,
				coreDensity: 1e4,
				fusionRate: 1e28,
				surfaceTemperature: 2800,
				surfaceGravity: 0.1,
				escapeVelocity: 20,
				rotationPeriod: 2000,
				magneticFieldStrength: 1e-5,
				stellarWindSpeed: 10,
				massLossRate: 1e-7,
				bolometricLuminosity: 1.9e30,
				surfaceBrightness: 1e4,
				effectiveTemperature: 2800,
			},

			primaryColors: [new Color(0x8b0000), new Color(0x2f2f2f), new Color(0x654321)],
			secondaryColors: [new Color(0xff4500), new Color(0x800080), new Color(0x4b0082)],

			visualFeatures: {
				coronaVisible: false,
				stellarFlares: false,
				sunspots: false,
				granulation: true,
				stellarWind: true,
				jetStreams: false,
				accretionDisk: false,
				planetaryNebula: false,
				magnetosphere: false,
				gravitationalLensing: false,
				hawkingRadiation: false,
				ergosphere: false,
				pulsation: true,
				brightnessCycles: true,
				spectralVariation: true,
				habitableZone: false,
				tidaLocking: false,
				stellarClassification: "C",
			},

			systemData: {
				isBinary: false,
				isMultiple: false,
				companionTypes: [],
				orbitalPeriods: [],
				planetarySystemAge: 1000,
				habitableZoneInner: 10,
				habitableZoneOuter: 50,
				frostLine: 100,
				protoplanetaryDisk: false,
				asteroidBelt: false,
				cometCloud: false,
				galacticLocation: new Vector3(8200, 0, 200),
				metallicity: -0.3,
				kinematics: new Vector3(210, 35, 25),
				age: 1.0,
			},

			formationRequirements: ["AGB evolution", "helium flash", "carbon dredge-up"],
			evolutionPath: [EvolutionStage.MAIN_SEQUENCE, EvolutionStage.GIANT, EvolutionStage.ASYMPTOTIC_GIANT, EvolutionStage.PLANETARY_NEBULA],
			deathScenarios: ["planetary nebula", "white dwarf formation"],

			geometryComplexity: 3,
			effectDensity: 0.6,
			animationIntensity: 0.5,
			renderingTechniques: ["carbon dust", "molecular bands", "atmospheric dynamics"],

			discoverability: 0.15,
			scientificValue: 8,
			dangerLevel: 3,
			resourceValue: 4,

			uniqueTraits: ["carbon-rich atmosphere", "dust formation", "infrared excess"],
			stellarPhenomena: ["thermal pulses", "carbon star wind", "dust shell formation"],
			observationalChallenges: ["variable brightness", "dust obscuration", "complex spectra"],
		},
	],
]);

// Utility Functions for Stellar System
export function getStellarTypeByClass(stellarClass: StellarClass): StellarTypeDefinition | undefined {
    return STELLAR_TYPES.get(stellarClass);
}

export function getRandomStellarType(): StellarTypeDefinition {
	const types = Array.from(STELLAR_TYPES.values());
	const weightedTypes = types.filter((type) => Math.random() < type.discoverability);

	if (weightedTypes.length > 0) {
		const selectedType = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
		return selectedType!; // We know this exists since array length > 0
	}

	const selectedType = types[Math.floor(Math.random() * types.length)];
	return selectedType!; // We know STELLAR_TYPES is never empty
}

export function getStellarTypesByEvolutionStage(stage: EvolutionStage): StellarTypeDefinition[] {
    return Array.from(STELLAR_TYPES.values()).filter(type => type.evolutionStage === stage);
}

export function calculateStellarHabitableZone(star: StellarTypeDefinition): [number, number] {
    const luminosity = star.spectralData.luminosity;
    const innerEdge = Math.sqrt(luminosity / 1.1); // AU
    const outerEdge = Math.sqrt(luminosity / 0.53); // AU
    return [innerEdge, outerEdge];
}

export function calculateStellarLifespan(mass: number): number {
    // Main sequence lifetime in million years
    return 10000 * Math.pow(mass, -2.5);
}

export function getStellarEvolutionPath(initialMass: number): EvolutionStage[] {
    if (initialMass < 0.08) {
        return [EvolutionStage.FORMATION]; // Brown dwarf
    } else if (initialMass < 8) {
        return [
            EvolutionStage.FORMATION,
            EvolutionStage.PRE_MAIN_SEQUENCE,
            EvolutionStage.MAIN_SEQUENCE,
            EvolutionStage.SUBGIANT,
            EvolutionStage.GIANT,
            EvolutionStage.ASYMPTOTIC_GIANT,
            EvolutionStage.PLANETARY_NEBULA,
            EvolutionStage.REMNANT
        ];
    } else {
        return [
            EvolutionStage.FORMATION,
            EvolutionStage.PRE_MAIN_SEQUENCE,
            EvolutionStage.MAIN_SEQUENCE,
            EvolutionStage.GIANT,
            EvolutionStage.SUPERNOVA,
            EvolutionStage.REMNANT
        ];
    }
}

export function classifyStellarType(temperature: number, luminosity: number, mass: number): StellarClass {
    // Simplified classification based on temperature and luminosity
    if (mass > 20) {
        if (temperature > 30000) return StellarClass.O_TYPE;
        if (temperature > 10000) return StellarClass.B_TYPE;
        if (temperature < 5000) return StellarClass.RED_SUPERGIANT;
    }
    
    if (mass < 0.08) return StellarClass.BROWN_DWARF;
    
    if (temperature > 30000) return StellarClass.O_TYPE;
    if (temperature > 10000) return StellarClass.B_TYPE;
    if (temperature > 7500) return StellarClass.A_TYPE;
    if (temperature > 6000) return StellarClass.F_TYPE;
    if (temperature > 5200) return StellarClass.G_TYPE;
    if (temperature > 3700) return StellarClass.K_TYPE;
    return StellarClass.M_TYPE;
}

export function generateStellarResources(star: StellarTypeDefinition): Map<string, number> {
    const resources = new Map<string, number>();
    
    // Energy resources based on stellar output
    resources.set('energy', star.spectralData.luminosity);
    resources.set('heat', star.stellarPhysics.surfaceTemperature / 10000);
    resources.set('radiation', star.stellarPhysics.bolometricLuminosity / 1e26);
    
    // Special resources for different star types
    switch (star.class) {
        case StellarClass.NEUTRON_STAR:
            resources.set('exotic_matter', 0.9);
            resources.set('gravitational_waves', 0.8);
            break;
        case StellarClass.BLACK_HOLE:
            resources.set('spacetime_distortion', 1.0);
            resources.set('hawking_radiation', 0.1);
            break;
        case StellarClass.WHITE_DWARF:
            resources.set('dense_matter', 0.7);
            resources.set('crystalline_carbon', 0.5);
            break;
        case StellarClass.WOLF_RAYET:
            resources.set('heavy_elements', 0.9);
            resources.set('stellar_wind_energy', 0.8);
            break;
    }
    
    return resources;
} 