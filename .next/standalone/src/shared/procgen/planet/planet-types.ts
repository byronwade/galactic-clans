/**
 * @file planet-types.ts
 * @description Comprehensive planet type system with scientifically accurate classifications
 * @version 3.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Defines all planet types with their unique characteristics, visual features,
 * resource distributions, habitability factors, and low-poly design specifications.
 */

import { Vector3, Color } from "three";

// Planet Type Classifications
export enum PlanetClass {
	TERRESTRIAL = "terrestrial",
	GAS_GIANT = "gas_giant",
	ICE_GIANT = "ice_giant",
	OCEAN_WORLD = "ocean_world",
	CARBON_WORLD = "carbon_world",
	IRON_WORLD = "iron_world",
	DWARF_PLANET = "dwarf_planet",
	SUPER_EARTH = "super_earth",
	MINI_NEPTUNE = "mini_neptune",
	MEGA_EARTH = "mega_earth",
	HOT_JUPITER = "hot_jupiter",
	WARM_NEPTUNE = "warm_neptune",
	ROGUE_PLANET = "rogue_planet",
	PUFFY_PLANET = "puffy_planet",
	TIDALLY_LOCKED = "tidally_locked",
	CIRCUMBINARY = "circumbinary",
	LAVA_WORLD = "lava_world",
	HELIUM_PLANET = "helium_planet",
	DESERT_WORLD = "desert_world",
	PULSAR_PLANET = "pulsar_planet",
	EVAPORATING_PLANET = "evaporating_planet",
}

// Biome Classifications
export enum BiomeType {
	// Terrestrial Biomes
	TEMPERATE_FOREST = "temperate_forest",
	TROPICAL_JUNGLE = "tropical_jungle",
	ARCTIC_TUNDRA = "arctic_tundra",
	ARID_DESERT = "arid_desert",
	VOLCANIC_WASTELAND = "volcanic_wasteland",
	CRYSTALLINE_FIELDS = "crystalline_fields",

	// Aquatic Biomes
	DEEP_OCEAN = "deep_ocean",
	SHALLOW_SEAS = "shallow_seas",
	FROZEN_OCEAN = "frozen_ocean",
	ACIDIC_SEAS = "acidic_seas",

	// Atmospheric Biomes
	DENSE_ATMOSPHERE = "dense_atmosphere",
	THIN_ATMOSPHERE = "thin_atmosphere",
	TOXIC_ATMOSPHERE = "toxic_atmosphere",
	HELIUM_CLOUDS = "helium_clouds",

	// Exotic Biomes
	METALLIC_SURFACE = "metallic_surface",
	DIAMOND_FORMATIONS = "diamond_formations",
	LAVA_FLOWS = "lava_flows",
	RADIATION_ZONES = "radiation_zones",
	ZERO_ATMOSPHERE = "zero_atmosphere",
}

// Resource Types
export enum ResourceType {
	// Basic Resources
	MINERALS = "minerals",
	ENERGY_CRYSTALS = "energy_crystals",
	WATER = "water",
	ORGANIC_COMPOUNDS = "organic_compounds",

	// Rare Resources
	DIAMONDS = "diamonds",
	RARE_METALS = "rare_metals",
	EXOTIC_MATTER = "exotic_matter",
	QUANTUM_MATERIALS = "quantum_materials",

	// Energy Sources
	GEOTHERMAL = "geothermal",
	SOLAR_POTENTIAL = "solar_potential",
	TIDAL_ENERGY = "tidal_energy",
	WIND_ENERGY = "wind_energy",

	// Special Resources
	ANTIMATTER = "antimatter",
	DARK_MATTER = "dark_matter",
	TEMPORAL_CRYSTALS = "temporal_crystals",
}

// Habitability Factors
export interface HabitabilityFactors {
	temperature: number; // 0-100 (optimal around 50)
	atmosphere: number; // 0-100 (breathable atmosphere)
	radiation: number; // 0-100 (lower is better)
	gravity: number; // 0-100 (Earth-like is optimal)
	waterAvailability: number; // 0-100
	overallScore: number; // calculated from factors
}

// Visual Features for Low-Poly Generation
export interface VisualFeatures {
	// Surface Features
	mountains: boolean;
	craters: boolean;
	rivers: boolean;
	forests: boolean;
	deserts: boolean;
	oceans: boolean;
	iceCaps: boolean;
	volcanos: boolean;
	crystalFormations: boolean;
	metallicDeposits: boolean;

	// Atmospheric Features
	clouds: boolean;
	storms: boolean;
	aurorae: boolean;
	atmosphericGlow: boolean;
	weatherPatterns: boolean;

	// Exotic Features
	rings: boolean;
	moons: number;
	magnetosphere: boolean;
	tidalHeating: boolean;
	geysers: boolean;
	lavaFlows: boolean;

	// Visual Effects
	dayNightCycle: boolean;
	seasons: boolean;
	eclipses: boolean;
	meteorShowers: boolean;
}

// Planet Type Definition
export interface PlanetTypeDefinition {
	class: PlanetClass;
	name: string;
	description: string;
	realWorldExample: string;

	// Physical Properties
	massRange: [number, number]; // Earth masses
	radiusRange: [number, number]; // Earth radii
	densityRange: [number, number]; // g/cm³
	temperatureRange: [number, number]; // Kelvin

	// Composition
	primaryComposition: string[];
	secondaryComposition: string[];
	atmosphereComposition: string[];

	// Habitability
	baseHabitability: HabitabilityFactors;

	// Visual Properties
	primaryColors: Color[];
	secondaryColors: Color[];
	features: VisualFeatures;

	// Biome Possibilities
	possibleBiomes: BiomeType[];

	// Resource Distribution
	resourceAbundance: Map<ResourceType, number>; // 0-1 probability

	// Formation Requirements
	starDistanceRange: [number, number]; // AU
	starTypes: string[]; // Compatible star types
	formationProbability: number; // 0-1

	// Special Properties
	uniqueTraits: string[];
	dangerLevel: number; // 0-10
	explorationDifficulty: number; // 0-10

	// Low-Poly Generation Parameters
	geometryComplexity: number; // 1-5
	featureDensity: number; // 0-1
	colorVariation: number; // 0-1
	textureTypes: string[];

	// Gameplay Mechanics
	buildingRestrictions: string[];
	specialBuildings: string[];
	environmentalHazards: string[];

	// Rarity and Discovery
	discoveryRarity: number; // 0-1 (rarer = lower number)
	scientificValue: number; // 1-10
	economicValue: number; // 1-10
}

// Complete Planet Type Database
export const PLANET_TYPES: Map<PlanetClass, PlanetTypeDefinition> = new Map([
	[
		PlanetClass.TERRESTRIAL,
		{
			class: PlanetClass.TERRESTRIAL,
			name: "Terrestrial World",
			description: "Rocky planet with solid surface, similar to Earth",
			realWorldExample: "Earth, Mars, Venus",

			massRange: [0.1, 5.0],
			radiusRange: [0.3, 2.0],
			densityRange: [3.0, 8.0],
			temperatureRange: [150, 800],

			primaryComposition: ["silicate rock", "iron core"],
			secondaryComposition: ["water", "carbon dioxide"],
			atmosphereComposition: ["nitrogen", "oxygen", "carbon dioxide"],

			baseHabitability: {
				temperature: 70,
				atmosphere: 80,
				radiation: 85,
				gravity: 90,
				waterAvailability: 75,
				overallScore: 80,
			},

			primaryColors: [new Color(0x4a7c59), new Color(0x8b4513), new Color(0x2e8b57)],
			secondaryColors: [new Color(0x87ceeb), new Color(0xffffff), new Color(0x32cd32)],

			features: {
				mountains: true,
				craters: true,
				rivers: true,
				forests: true,
				deserts: true,
				oceans: true,
				iceCaps: true,
				volcanos: true,
				crystalFormations: false,
				metallicDeposits: true,
				clouds: true,
				storms: true,
				aurorae: true,
				atmosphericGlow: false,
				weatherPatterns: true,
				rings: false,
				moons: 1,
				magnetosphere: true,
				tidalHeating: false,
				geysers: false,
				lavaFlows: false,
				dayNightCycle: true,
				seasons: true,
				eclipses: true,
				meteorShowers: true,
			},

			possibleBiomes: [BiomeType.TEMPERATE_FOREST, BiomeType.TROPICAL_JUNGLE, BiomeType.ARCTIC_TUNDRA, BiomeType.ARID_DESERT, BiomeType.SHALLOW_SEAS],

			resourceAbundance: new Map([
				[ResourceType.MINERALS, 0.8],
				[ResourceType.WATER, 0.7],
				[ResourceType.ORGANIC_COMPOUNDS, 0.6],
				[ResourceType.RARE_METALS, 0.3],
				[ResourceType.ENERGY_CRYSTALS, 0.2],
			]),

			starDistanceRange: [0.5, 3.0],
			starTypes: ["G", "K", "M"],
			formationProbability: 0.4,

			uniqueTraits: ["plate tectonics", "magnetic field", "diverse biomes"],
			dangerLevel: 2,
			explorationDifficulty: 3,

			geometryComplexity: 4,
			featureDensity: 0.7,
			colorVariation: 0.8,
			textureTypes: ["rock", "vegetation", "water", "ice"],

			buildingRestrictions: [],
			specialBuildings: ["biodomes", "terraforming stations"],
			environmentalHazards: ["earthquakes", "storms", "volcanic eruptions"],

			discoveryRarity: 0.8,
			scientificValue: 7,
			economicValue: 8,
		},
	],

	[
		PlanetClass.GAS_GIANT,
		{
			class: PlanetClass.GAS_GIANT,
			name: "Gas Giant",
			description: "Massive planet composed primarily of hydrogen and helium",
			realWorldExample: "Jupiter, Saturn",

			massRange: [10, 5000],
			radiusRange: [3, 25],
			densityRange: [0.3, 2.0],
			temperatureRange: [50, 2000],

			primaryComposition: ["hydrogen", "helium"],
			secondaryComposition: ["methane", "ammonia", "water ice"],
			atmosphereComposition: ["hydrogen", "helium", "methane"],

			baseHabitability: {
				temperature: 20,
				atmosphere: 10,
				radiation: 30,
				gravity: 20,
				waterAvailability: 0,
				overallScore: 16,
			},

			primaryColors: [new Color(0xd2b48c), new Color(0xffa500), new Color(0xcd853f)],
			secondaryColors: [new Color(0xffffff), new Color(0x8b4513), new Color(0xff6347)],

			features: {
				mountains: false,
				craters: false,
				rivers: false,
				forests: false,
				deserts: false,
				oceans: false,
				iceCaps: false,
				volcanos: false,
				crystalFormations: false,
				metallicDeposits: false,
				clouds: true,
				storms: true,
				aurorae: true,
				atmosphericGlow: true,
				weatherPatterns: true,
				rings: true,
				moons: 15,
				magnetosphere: true,
				tidalHeating: true,
				geysers: false,
				lavaFlows: false,
				dayNightCycle: false,
				seasons: false,
				eclipses: true,
				meteorShowers: false,
			},

			possibleBiomes: [BiomeType.DENSE_ATMOSPHERE, BiomeType.HELIUM_CLOUDS],

			resourceAbundance: new Map([
				[ResourceType.ENERGY_CRYSTALS, 0.4],
				[ResourceType.EXOTIC_MATTER, 0.6],
				[ResourceType.WIND_ENERGY, 0.9],
				[ResourceType.QUANTUM_MATERIALS, 0.3],
			]),

			starDistanceRange: [3, 20],
			starTypes: ["G", "K", "F"],
			formationProbability: 0.2,

			uniqueTraits: ["massive storm systems", "ring systems", "many moons"],
			dangerLevel: 8,
			explorationDifficulty: 9,

			geometryComplexity: 3,
			featureDensity: 0.9,
			colorVariation: 0.6,
			textureTypes: ["gas bands", "storm vortices", "cloud layers"],

			buildingRestrictions: ["no surface construction"],
			specialBuildings: ["orbital platforms", "atmospheric processors"],
			environmentalHazards: ["extreme storms", "crushing pressure", "radiation"],

			discoveryRarity: 0.6,
			scientificValue: 8,
			economicValue: 6,
		},
	],

	[
		PlanetClass.ICE_GIANT,
		{
			class: PlanetClass.ICE_GIANT,
			name: "Ice Giant",
			description: "Cold giant planet with icy volatiles and atmospheric gases",
			realWorldExample: "Neptune, Uranus",

			massRange: [5, 50],
			radiusRange: [2, 8],
			densityRange: [1.0, 2.5],
			temperatureRange: [30, 200],

			primaryComposition: ["water ice", "methane", "ammonia"],
			secondaryComposition: ["hydrogen", "helium", "rock core"],
			atmosphereComposition: ["hydrogen", "helium", "methane", "hydrogen sulfide"],

			baseHabitability: {
				temperature: 10,
				atmosphere: 5,
				radiation: 40,
				gravity: 30,
				waterAvailability: 80,
				overallScore: 33,
			},

			primaryColors: [new Color(0x4682b4), new Color(0x87ceeb), new Color(0x00bfff)],
			secondaryColors: [new Color(0xffffff), new Color(0xe0ffff), new Color(0xb0e0e6)],

			features: {
				mountains: false,
				craters: false,
				rivers: false,
				forests: false,
				deserts: false,
				oceans: true,
				iceCaps: true,
				volcanos: false,
				crystalFormations: true,
				metallicDeposits: false,
				clouds: true,
				storms: true,
				aurorae: true,
				atmosphericGlow: true,
				weatherPatterns: true,
				rings: true,
				moons: 8,
				magnetosphere: true,
				tidalHeating: false,
				geysers: true,
				lavaFlows: false,
				dayNightCycle: false,
				seasons: true,
				eclipses: true,
				meteorShowers: false,
			},

			possibleBiomes: [BiomeType.FROZEN_OCEAN, BiomeType.CRYSTALLINE_FIELDS, BiomeType.DENSE_ATMOSPHERE],

			resourceAbundance: new Map([
				[ResourceType.WATER, 0.9],
				[ResourceType.ENERGY_CRYSTALS, 0.5],
				[ResourceType.RARE_METALS, 0.4],
				[ResourceType.EXOTIC_MATTER, 0.3],
			]),

			starDistanceRange: [10, 50],
			starTypes: ["G", "K", "F"],
			formationProbability: 0.15,

			uniqueTraits: ["extreme tilt", "diamond rain", "subsurface oceans"],
			dangerLevel: 7,
			explorationDifficulty: 8,

			geometryComplexity: 3,
			featureDensity: 0.6,
			colorVariation: 0.4,
			textureTypes: ["ice crystals", "frozen gases", "atmospheric bands"],

			buildingRestrictions: ["no surface construction", "extreme cold"],
			specialBuildings: ["ice mining stations", "cryogenic facilities"],
			environmentalHazards: ["extreme cold", "methane storms", "radiation"],

			discoveryRarity: 0.4,
			scientificValue: 7,
			economicValue: 5,
		},
	],

	[
		PlanetClass.OCEAN_WORLD,
		{
			class: PlanetClass.OCEAN_WORLD,
			name: "Ocean Planet",
			description: "Planet entirely covered by deep oceans",
			realWorldExample: "GJ 1214b (theoretical)",

			massRange: [0.5, 10],
			radiusRange: [1, 4],
			densityRange: [2.0, 6.0],
			temperatureRange: [250, 400],

			primaryComposition: ["water", "silicate core"],
			secondaryComposition: ["dissolved salts", "organic compounds"],
			atmosphereComposition: ["water vapor", "nitrogen", "oxygen"],

			baseHabitability: {
				temperature: 85,
				atmosphere: 70,
				radiation: 80,
				gravity: 75,
				waterAvailability: 100,
				overallScore: 82,
			},

			primaryColors: [new Color(0x006994), new Color(0x4682b4), new Color(0x00bfff)],
			secondaryColors: [new Color(0x87ceeb), new Color(0xffffff), new Color(0x20b2aa)],

			features: {
				mountains: false,
				craters: false,
				rivers: false,
				forests: false,
				deserts: false,
				oceans: true,
				iceCaps: true,
				volcanos: true,
				crystalFormations: false,
				metallicDeposits: false,
				clouds: true,
				storms: true,
				aurorae: false,
				atmosphericGlow: false,
				weatherPatterns: true,
				rings: false,
				moons: 2,
				magnetosphere: true,
				tidalHeating: true,
				geysers: true,
				lavaFlows: false,
				dayNightCycle: true,
				seasons: true,
				eclipses: true,
				meteorShowers: true,
			},

			possibleBiomes: [BiomeType.DEEP_OCEAN, BiomeType.SHALLOW_SEAS, BiomeType.FROZEN_OCEAN],

			resourceAbundance: new Map([
				[ResourceType.WATER, 1.0],
				[ResourceType.ORGANIC_COMPOUNDS, 0.8],
				[ResourceType.TIDAL_ENERGY, 0.9],
				[ResourceType.MINERALS, 0.4],
				[ResourceType.RARE_METALS, 0.2],
			]),

			starDistanceRange: [0.8, 2.5],
			starTypes: ["G", "K", "M"],
			formationProbability: 0.1,

			uniqueTraits: ["global ocean", "underwater volcanism", "tidal forces"],
			dangerLevel: 4,
			explorationDifficulty: 6,

			geometryComplexity: 2,
			featureDensity: 0.5,
			colorVariation: 0.3,
			textureTypes: ["water surface", "ocean depths", "underwater features"],

			buildingRestrictions: ["underwater only", "floating structures"],
			specialBuildings: ["submarine bases", "floating cities", "tidal generators"],
			environmentalHazards: ["tsunamis", "underwater volcanism", "deep pressure"],

			discoveryRarity: 0.2,
			scientificValue: 9,
			economicValue: 7,
		},
	],

	[
		PlanetClass.CARBON_WORLD,
		{
			class: PlanetClass.CARBON_WORLD,
			name: "Carbon Planet",
			description: "Carbon-rich world with potential diamond formations",
			realWorldExample: "55 Cancri e (theoretical)",

			massRange: [0.5, 8],
			radiusRange: [0.8, 3],
			densityRange: [4.0, 12.0],
			temperatureRange: [500, 3000],

			primaryComposition: ["carbon", "silicon carbide", "diamond"],
			secondaryComposition: ["graphite", "carbides", "iron"],
			atmosphereComposition: ["carbon monoxide", "carbon dioxide", "methane"],

			baseHabitability: {
				temperature: 5,
				atmosphere: 0,
				radiation: 20,
				gravity: 60,
				waterAvailability: 0,
				overallScore: 17,
			},

			primaryColors: [new Color(0x2f2f2f), new Color(0xffffff), new Color(0x800080)],
			secondaryColors: [new Color(0xc0c0c0), new Color(0x4b0082), new Color(0x708090)],

			features: {
				mountains: true,
				craters: true,
				rivers: false,
				forests: false,
				deserts: true,
				oceans: false,
				iceCaps: false,
				volcanos: true,
				crystalFormations: true,
				metallicDeposits: true,
				clouds: false,
				storms: false,
				aurorae: false,
				atmosphericGlow: false,
				weatherPatterns: false,
				rings: false,
				moons: 1,
				magnetosphere: false,
				tidalHeating: false,
				geysers: false,
				lavaFlows: true,
				dayNightCycle: true,
				seasons: false,
				eclipses: true,
				meteorShowers: true,
			},

			possibleBiomes: [BiomeType.DIAMOND_FORMATIONS, BiomeType.METALLIC_SURFACE, BiomeType.VOLCANIC_WASTELAND],

			resourceAbundance: new Map([
				[ResourceType.DIAMONDS, 1.0],
				[ResourceType.RARE_METALS, 0.7],
				[ResourceType.ENERGY_CRYSTALS, 0.8],
				[ResourceType.EXOTIC_MATTER, 0.4],
				[ResourceType.QUANTUM_MATERIALS, 0.5],
			]),

			starDistanceRange: [0.1, 1.0],
			starTypes: ["O", "B", "A"],
			formationProbability: 0.05,

			uniqueTraits: ["diamond surface", "extreme hardness", "valuable resources"],
			dangerLevel: 9,
			explorationDifficulty: 10,

			geometryComplexity: 5,
			featureDensity: 0.8,
			colorVariation: 0.9,
			textureTypes: ["diamond facets", "carbon structures", "crystalline formations"],

			buildingRestrictions: ["extreme temperature", "toxic atmosphere"],
			specialBuildings: ["diamond refineries", "heat-resistant facilities"],
			environmentalHazards: ["extreme heat", "toxic gases", "diamond storms"],

			discoveryRarity: 0.02,
			scientificValue: 10,
			economicValue: 10,
		},
	],

	[
		PlanetClass.IRON_WORLD,
		{
			class: PlanetClass.IRON_WORLD,
			name: "Iron Planet",
			description: "Metallic world composed primarily of iron and heavy metals",
			realWorldExample: "Mercury (partially)",

			massRange: [0.2, 3],
			radiusRange: [0.4, 1.5],
			densityRange: [8.0, 15.0],
			temperatureRange: [100, 1200],

			primaryComposition: ["iron", "nickel", "cobalt"],
			secondaryComposition: ["platinum group metals", "rare earth elements"],
			atmosphereComposition: ["none", "metal vapor"],

			baseHabitability: {
				temperature: 40,
				atmosphere: 0,
				radiation: 60,
				gravity: 80,
				waterAvailability: 0,
				overallScore: 36,
			},

			primaryColors: [new Color(0x8c7853), new Color(0xc0c0c0), new Color(0x696969)],
			secondaryColors: [new Color(0xffd700), new Color(0xb87333), new Color(0x708090)],

			features: {
				mountains: true,
				craters: true,
				rivers: false,
				forests: false,
				deserts: true,
				oceans: false,
				iceCaps: false,
				volcanos: false,
				crystalFormations: false,
				metallicDeposits: true,
				clouds: false,
				storms: false,
				aurorae: true,
				atmosphericGlow: false,
				weatherPatterns: false,
				rings: false,
				moons: 0,
				magnetosphere: true,
				tidalHeating: false,
				geysers: false,
				lavaFlows: false,
				dayNightCycle: true,
				seasons: false,
				eclipses: false,
				meteorShowers: true,
			},

			possibleBiomes: [BiomeType.METALLIC_SURFACE, BiomeType.ZERO_ATMOSPHERE],

			resourceAbundance: new Map([
				[ResourceType.RARE_METALS, 1.0],
				[ResourceType.MINERALS, 0.9],
				[ResourceType.QUANTUM_MATERIALS, 0.6],
				[ResourceType.ANTIMATTER, 0.2],
			]),

			starDistanceRange: [0.1, 0.8],
			starTypes: ["G", "K", "M"],
			formationProbability: 0.1,

			uniqueTraits: ["magnetic field", "metal surface", "solar wind interaction"],
			dangerLevel: 6,
			explorationDifficulty: 7,

			geometryComplexity: 3,
			featureDensity: 0.4,
			colorVariation: 0.5,
			textureTypes: ["metallic surface", "crater patterns", "magnetic field lines"],

			buildingRestrictions: ["no atmosphere", "extreme temperatures"],
			specialBuildings: ["metal refineries", "magnetic field generators"],
			environmentalHazards: ["solar radiation", "temperature extremes", "meteor impacts"],

			discoveryRarity: 0.3,
			scientificValue: 8,
			economicValue: 9,
		},
	],

	[
		PlanetClass.SUPER_EARTH,
		{
			class: PlanetClass.SUPER_EARTH,
			name: "Super-Earth",
			description: "Large rocky planet with enhanced geological features",
			realWorldExample: "Kepler-452b, Gliese 667Cc",

			massRange: [1.5, 10],
			radiusRange: [1.2, 2.5],
			densityRange: [4.0, 8.0],
			temperatureRange: [200, 600],

			primaryComposition: ["silicate rock", "large iron core"],
			secondaryComposition: ["water", "carbon compounds"],
			atmosphereComposition: ["nitrogen", "oxygen", "carbon dioxide", "water vapor"],

			baseHabitability: {
				temperature: 75,
				atmosphere: 85,
				radiation: 70,
				gravity: 60,
				waterAvailability: 80,
				overallScore: 74,
			},

			primaryColors: [new Color(0x228b22), new Color(0x4682b4), new Color(0x8b4513)],
			secondaryColors: [new Color(0x87ceeb), new Color(0xffffff), new Color(0x32cd32)],

			features: {
				mountains: true,
				craters: true,
				rivers: true,
				forests: true,
				deserts: true,
				oceans: true,
				iceCaps: true,
				volcanos: true,
				crystalFormations: true,
				metallicDeposits: true,
				clouds: true,
				storms: true,
				aurorae: true,
				atmosphericGlow: false,
				weatherPatterns: true,
				rings: false,
				moons: 3,
				magnetosphere: true,
				tidalHeating: true,
				geysers: true,
				lavaFlows: true,
				dayNightCycle: true,
				seasons: true,
				eclipses: true,
				meteorShowers: true,
			},

			possibleBiomes: [BiomeType.TEMPERATE_FOREST, BiomeType.TROPICAL_JUNGLE, BiomeType.ARCTIC_TUNDRA, BiomeType.DEEP_OCEAN, BiomeType.VOLCANIC_WASTELAND],

			resourceAbundance: new Map([
				[ResourceType.MINERALS, 0.9],
				[ResourceType.WATER, 0.8],
				[ResourceType.ORGANIC_COMPOUNDS, 0.7],
				[ResourceType.RARE_METALS, 0.5],
				[ResourceType.GEOTHERMAL, 0.8],
			]),

			starDistanceRange: [0.5, 4.0],
			starTypes: ["G", "K", "M"],
			formationProbability: 0.25,

			uniqueTraits: ["enhanced geology", "strong magnetic field", "diverse ecosystems"],
			dangerLevel: 3,
			explorationDifficulty: 4,

			geometryComplexity: 5,
			featureDensity: 0.8,
			colorVariation: 0.9,
			textureTypes: ["enhanced rock", "deep vegetation", "large water bodies"],

			buildingRestrictions: ["high gravity construction"],
			specialBuildings: ["gravity compensators", "enhanced terraforming"],
			environmentalHazards: ["strong storms", "tectonic activity", "high gravity"],

			discoveryRarity: 0.5,
			scientificValue: 8,
			economicValue: 8,
		},
	],

	[
		PlanetClass.LAVA_WORLD,
		{
			class: PlanetClass.LAVA_WORLD,
			name: "Lava Planet",
			description: "Molten surface world with constant volcanic activity",
			realWorldExample: "K2-141b, CoRoT-7b",

			massRange: [0.3, 5],
			radiusRange: [0.5, 2],
			densityRange: [5.0, 10.0],
			temperatureRange: [1500, 4000],

			primaryComposition: ["molten rock", "metal sulfides"],
			secondaryComposition: ["vaporized rock", "metal oxides"],
			atmosphereComposition: ["rock vapor", "metal vapor", "sulfur compounds"],

			baseHabitability: {
				temperature: 0,
				atmosphere: 0,
				radiation: 10,
				gravity: 70,
				waterAvailability: 0,
				overallScore: 16,
			},

			primaryColors: [new Color(0xff4500), new Color(0xff6347), new Color(0x8b0000)],
			secondaryColors: [new Color(0xffa500), new Color(0xff8c00), new Color(0x2f2f2f)],

			features: {
				mountains: true,
				craters: true,
				rivers: false,
				forests: false,
				deserts: false,
				oceans: false,
				iceCaps: false,
				volcanos: true,
				crystalFormations: false,
				metallicDeposits: true,
				clouds: false,
				storms: false,
				aurorae: false,
				atmosphericGlow: true,
				weatherPatterns: false,
				rings: false,
				moons: 0,
				magnetosphere: false,
				tidalHeating: true,
				geysers: false,
				lavaFlows: true,
				dayNightCycle: true,
				seasons: false,
				eclipses: false,
				meteorShowers: false,
			},

			possibleBiomes: [BiomeType.LAVA_FLOWS, BiomeType.VOLCANIC_WASTELAND, BiomeType.TOXIC_ATMOSPHERE],

			resourceAbundance: new Map([
				[ResourceType.GEOTHERMAL, 1.0],
				[ResourceType.RARE_METALS, 0.8],
				[ResourceType.ENERGY_CRYSTALS, 0.6],
				[ResourceType.EXOTIC_MATTER, 0.4],
			]),

			starDistanceRange: [0.01, 0.1],
			starTypes: ["all"],
			formationProbability: 0.08,

			uniqueTraits: ["molten surface", "extreme heat", "tidal heating"],
			dangerLevel: 10,
			explorationDifficulty: 10,

			geometryComplexity: 4,
			featureDensity: 0.9,
			colorVariation: 0.7,
			textureTypes: ["lava flows", "molten rock", "volcanic emissions"],

			buildingRestrictions: ["extreme heat resistance required"],
			specialBuildings: ["heat-proof stations", "thermal extractors"],
			environmentalHazards: ["molten surface", "toxic atmosphere", "extreme radiation"],

			discoveryRarity: 0.15,
			scientificValue: 7,
			economicValue: 6,
		},
	],

	[
		PlanetClass.ROGUE_PLANET,
		{
			class: PlanetClass.ROGUE_PLANET,
			name: "Rogue Planet",
			description: "Starless wanderer drifting through interstellar space",
			realWorldExample: "CFBDSIR 2149-0403, PSO J318.5-22",

			massRange: [0.1, 50],
			radiusRange: [0.5, 15],
			densityRange: [0.5, 8.0],
			temperatureRange: [3, 100],

			primaryComposition: ["varies", "frozen gases", "rock/ice"],
			secondaryComposition: ["exotic matter", "dark matter traces"],
			atmosphereComposition: ["frozen", "minimal"],

			baseHabitability: {
				temperature: 0,
				atmosphere: 0,
				radiation: 95,
				gravity: 50,
				waterAvailability: 10,
				overallScore: 31,
			},

			primaryColors: [new Color(0x2f2f2f), new Color(0x4b0082), new Color(0x191970)],
			secondaryColors: [new Color(0x800080), new Color(0x483d8b), new Color(0x0f0f0f)],

			features: {
				mountains: true,
				craters: true,
				rivers: false,
				forests: false,
				deserts: true,
				oceans: false,
				iceCaps: true,
				volcanos: false,
				crystalFormations: true,
				metallicDeposits: false,
				clouds: false,
				storms: false,
				aurorae: true,
				atmosphericGlow: true,
				weatherPatterns: false,
				rings: false,
				moons: 2,
				magnetosphere: false,
				tidalHeating: false,
				geysers: false,
				lavaFlows: false,
				dayNightCycle: false,
				seasons: false,
				eclipses: false,
				meteorShowers: false,
			},

			possibleBiomes: [BiomeType.ZERO_ATMOSPHERE, BiomeType.FROZEN_OCEAN, BiomeType.RADIATION_ZONES],

			resourceAbundance: new Map([
				[ResourceType.DARK_MATTER, 0.8],
				[ResourceType.EXOTIC_MATTER, 0.7],
				[ResourceType.QUANTUM_MATERIALS, 0.5],
				[ResourceType.TEMPORAL_CRYSTALS, 0.3],
			]),

			starDistanceRange: [1000, 100000], // Very far from any star
			starTypes: ["none"],
			formationProbability: 0.03,

			uniqueTraits: ["no star", "interstellar wanderer", "exotic physics"],
			dangerLevel: 8,
			explorationDifficulty: 9,

			geometryComplexity: 3,
			featureDensity: 0.3,
			colorVariation: 0.8,
			textureTypes: ["cosmic ice", "dark matter traces", "stellar remnants"],

			buildingRestrictions: ["no solar power", "extreme isolation"],
			specialBuildings: ["deep space stations", "dark matter collectors"],
			environmentalHazards: ["cosmic radiation", "absolute cold", "isolation"],

			discoveryRarity: 0.01,
			scientificValue: 10,
			economicValue: 4,
		},
	],

	[
		PlanetClass.TIDALLY_LOCKED,
		{
			class: PlanetClass.TIDALLY_LOCKED,
			name: "Tidally Locked World",
			description: "Planet with permanent day and night sides",
			realWorldExample: "Proxima Centauri b, TRAPPIST-1 planets",

			massRange: [0.2, 8],
			radiusRange: [0.5, 2.5],
			densityRange: [3.0, 8.0],
			temperatureRange: [50, 1500],

			primaryComposition: ["silicate rock", "iron core"],
			secondaryComposition: ["water ice", "atmospheric gases"],
			atmosphereComposition: ["carbon dioxide", "nitrogen", "water vapor"],

			baseHabitability: {
				temperature: 40,
				atmosphere: 60,
				radiation: 50,
				gravity: 75,
				waterAvailability: 30,
				overallScore: 51,
			},

			primaryColors: [new Color(0xff4500), new Color(0x2f2f2f), new Color(0x4682b4)],
			secondaryColors: [new Color(0xffa500), new Color(0x483d8b), new Color(0x87ceeb)],

			features: {
				mountains: true,
				craters: true,
				rivers: true,
				forests: false,
				deserts: true,
				oceans: true,
				iceCaps: true,
				volcanos: true,
				crystalFormations: false,
				metallicDeposits: true,
				clouds: true,
				storms: true,
				aurorae: true,
				atmosphericGlow: false,
				weatherPatterns: true,
				rings: false,
				moons: 1,
				magnetosphere: true,
				tidalHeating: false,
				geysers: false,
				lavaFlows: false,
				dayNightCycle: false,
				seasons: false,
				eclipses: false,
				meteorShowers: true,
			},

			possibleBiomes: [BiomeType.ARID_DESERT, BiomeType.FROZEN_OCEAN, BiomeType.TEMPERATE_FOREST],

			resourceAbundance: new Map([
				[ResourceType.SOLAR_POTENTIAL, 0.5],
				[ResourceType.MINERALS, 0.7],
				[ResourceType.WATER, 0.4],
				[ResourceType.WIND_ENERGY, 0.9],
			]),

			starDistanceRange: [0.1, 1.5],
			starTypes: ["M", "K"],
			formationProbability: 0.3,

			uniqueTraits: ["permanent day/night", "extreme weather", "terminator zone"],
			dangerLevel: 5,
			explorationDifficulty: 6,

			geometryComplexity: 4,
			featureDensity: 0.6,
			colorVariation: 1.0,
			textureTypes: ["scorched surface", "frozen terrain", "twilight zone"],

			buildingRestrictions: ["extreme temperature zones"],
			specialBuildings: ["terminator settlements", "thermal exchangers"],
			environmentalHazards: ["extreme temperatures", "perpetual storms", "radiation"],

			discoveryRarity: 0.4,
			scientificValue: 8,
			economicValue: 6,
		},
	],
]);

// Utility Functions
export function getPlanetTypeByClass(planetClass: PlanetClass): PlanetTypeDefinition | undefined {
	return PLANET_TYPES.get(planetClass);
}

export function getRandomPlanetType(): PlanetTypeDefinition {
	const types = Array.from(PLANET_TYPES.values());
	const weightedTypes = types.filter((type) => Math.random() < type.formationProbability);
	if (weightedTypes.length > 0) {
		const selectedType = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
		if (selectedType) return selectedType;
	}
	const fallbackType = types[Math.floor(Math.random() * types.length)];
	if (!fallbackType) {
		// Fallback to terrestrial if something goes wrong
		return PLANET_TYPES.get(PlanetClass.TERRESTRIAL)!;
	}
	return fallbackType;
}

export function calculateHabitabilityScore(planet: PlanetTypeDefinition, starDistance: number): number {
	const base = planet.baseHabitability;
	const distanceModifier = starDistance >= planet.starDistanceRange[0] && starDistance <= planet.starDistanceRange[1] ? 1.0 : 0.5;

	return Math.round(base.overallScore * distanceModifier);
}

export function generatePlanetResources(planet: PlanetTypeDefinition): Map<ResourceType, number> {
	const resources = new Map<ResourceType, number>();

	for (const [resource, probability] of planet.resourceAbundance) {
		if (Math.random() < probability) {
			const abundance = Math.random() * probability;
			resources.set(resource, abundance);
		}
	}

	return resources;
}
