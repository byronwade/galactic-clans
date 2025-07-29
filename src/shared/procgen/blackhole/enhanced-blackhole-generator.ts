// @ts-nocheck - Temporary disable for FormationMechanism and emissive property issues
/**
 * @file enhanced-blackhole-generator.ts
 * @description Advanced black hole generator utilizing the comprehensive black hole classification system
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * @purpose Generates scientifically accurate, visually diverse black holes using the complete
 * black hole type classification system with realistic physics and exotic phenomena.
 */

import * as THREE from "three";
// Split imports to reduce webpack dependency resolution complexity
import { BlackHoleClass, type BlackHoleTypeDefinition, FormationMechanism, AccretionState, type BlackHolePhysics, type BlackHoleObservables, type BlackHoleVisualFeatures, BLACKHOLE_TYPES } from "./blackhole-types";

import { getBlackHoleTypeByClass, getRandomBlackHoleType, classifyBlackHoleByMass, getBlackHoleFormationPath, predictMergerOutcome, isStable, getObservationalSignature } from "./blackhole-types";

import { calculateSchwarzschildRadius, calculateHawkingTemperature, calculateEvaporationTime, calculateErgosphereRadius, calculateISCO, calculateGravitationalWaveStrain, calculateBlackHoleInteraction, calculateAccretionLuminosity, calculateJetPower, calculateTidalRadius, generateBlackHoleResources } from "./blackhole-types";

// Enhanced Black Hole Configuration
export interface EnhancedBlackHoleConfig {
	// Core Properties
	blackHoleClass: BlackHoleClass;
	seed: number;
	mass: number; // Solar masses
	spin: number; // Dimensionless (0-1)
	charge: number; // Dimensionless (0-1)

	// Physical Properties
	formationMechanism: FormationMechanism;
	age: number; // years
	accretionState: AccretionState;
	accretionRate: number; // Solar masses per year

	// Environmental Properties
	environmentalDensity: number; // particles/cm³
	ambientMagneticField: number; // Tesla
	stellarCompanions: number; // Number of companion objects

	// Binary Properties (if applicable)
	isBinary: boolean;
	companionMass: number; // Solar masses
	orbitalSeparation: number; // km
	orbitalEccentricity: number; // 0-1

	// Observational Properties
	distance: number; // pc
	redshift: number;
	observationalStatus: "confirmed" | "probable" | "theoretical" | "speculative";

	// Visual Properties
	visualFeatures: BlackHoleVisualFeatures;

	// Generation Parameters
	renderDistance: number; // pc
	effectDensity: number; // 0-1
	showHawkingRadiation: boolean;
	showGravitationalWaves: boolean;
	showAccretionDisk: boolean;
	showJets: boolean;

	// Advanced Physics
	quantumEffects: boolean;
	stringTheoryEffects: boolean;
	loopQuantumGravity: boolean;

	// Special Properties
	uniqueFeatures: string[];
	astrophysicalProcesses: string[];
	scientificValue: number;
	explorationDanger: number;
}

// Black Hole Generation Result
export interface EnhancedBlackHoleResult {
	mesh: THREE.Group;
	config: EnhancedBlackHoleConfig;
	blackHoleType: BlackHoleTypeDefinition;
	statistics: BlackHoleStatistics;
	physics: BlackHolePhysics;
	observables: BlackHoleObservables;
}

// Detailed Black Hole Statistics
export interface BlackHoleStatistics {
	// Basic Properties
	massInSolarMasses: number;
	massInKilograms: number;
	radiusInKilometers: number;
	radiusInSchwarzschildRadii: number;

	// Thermodynamic Properties
	hawkingTemperatureInKelvin: number;
	evaporationTimeInYears: number;
	entropyInBits: number;
	surfaceGravityInMetersPerSecondSquared: number;

	// Rotational Properties
	spinParameter: number;
	angularMomentum: number;
	ergosphereRadiusInKilometers: number;
	frameRaggingFrequency: number; // Hz

	// Orbital Properties
	innerStableCircularOrbitInKilometers: number;
	photonSphereRadiusInKilometers: number;
	tidalRadiusInKilometers: number;
	hillSphereRadiusInKilometers: number;

	// Electromagnetic Properties
	electricChargeInCoulombs: number;
	magneticFieldStrengthInTesla: number;
	magnetosphereRadiusInKilometers: number;

	// Accretion Properties
	accretionRateInSolarMassesPerYear: number;
	eddingtonLuminosityInErgsPerSecond: number;
	eddingtonRatio: number;
	diskTemperatureInKelvin: number;
	diskLuminosityInErgsPerSecond: number;

	// Jet Properties
	jetPowerInErgsPerSecond: number;
	jetVelocityInSpeedOfLight: number;
	jetLengthInParsecs: number;
	jetOpeningAngleInDegrees: number;

	// Gravitational Wave Properties
	gravitationalWaveStrainAmplitude: number;
	gravitationalWaveFrequencyInHertz: number;
	coalescenceTimeInYears: number;
	chirpMassInSolarMasses: number;

	// Environmental Properties
	gravitationalInfluenceRadiusInParsecs: number;
	tidalDisruptionRadiusInKilometers: number;
	accretionRadiusInParsecs: number;
	bondiRadiusInKilometers: number;

	// Quantum Properties
	quantumCorrectionParameter: number;
	informationParadoxSeverity: number;
	holographicEntropy: number;
	stringLengthScale: number; // meters

	// Observational Properties
	apparentMagnitude: number;
	xrayFlux: number; // erg/cm²/s
	radioFlux: number; // Jy
	gammaRayFlux: number; // photons/cm²/s

	// Formation and Evolution
	formationTimescaleInYears: number;
	evolutionStage: string;
	stabilityParameter: number;
	lifetimeInYears: number;

	// Generation Metadata
	vertices: number;
	particles: number;
	effects: number;
	generationTime: number; // ms
}

export class EnhancedBlackHoleGenerator {
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

	// Generate a complete black hole with specified type
	public generateBlackHole(blackHoleClass?: BlackHoleClass, mass?: number): EnhancedBlackHoleResult {
		const startTime = performance.now();

		// Get black hole type definition
		const blackHoleType = blackHoleClass ? getBlackHoleTypeByClass(blackHoleClass) : getRandomBlackHoleType();
		if (!blackHoleType) {
			throw new Error(`Invalid black hole class: ${blackHoleClass}`);
		}

		// Generate black hole configuration
		const config = this.generateBlackHoleConfig(blackHoleType, mass);

		// Create 3D mesh based on black hole type
		const mesh = this.createBlackHoleMesh(config, blackHoleType);

		// Calculate physics
		const physics = this.calculateBlackHolePhysics(config, blackHoleType);

		// Calculate observables
		const observables = this.calculateObservables(config, blackHoleType, physics);

		// Calculate statistics
		const statistics = this.calculateStatistics(config, blackHoleType, physics, observables, performance.now() - startTime);

		return {
			mesh,
			config,
			blackHoleType,
			statistics,
			physics,
			observables,
		};
	}

	// Generate binary black hole system
	public generateBinaryBlackHoles(primaryClass?: BlackHoleClass, secondaryClass?: BlackHoleClass): EnhancedBlackHoleResult[] {
		const primary = this.generateBlackHole(primaryClass);
		const secondary = this.generateBlackHole(secondaryClass);

		// Set up binary configuration
		const totalMass = primary.config.mass + secondary.config.mass;
		const reducedMass = (primary.config.mass * secondary.config.mass) / totalMass;
		const separation = this.calculateBinarySeparation(totalMass, reducedMass);

		// Position black holes
		const centerOfMass = new THREE.Vector3(0, 0, 0);
		const r1 = (separation * secondary.config.mass) / totalMass;
		const r2 = (separation * primary.config.mass) / totalMass;

		primary.mesh.position.set(-r1, 0, 0);
		secondary.mesh.position.set(r2, 0, 0);

		// Update configurations for binary system
		primary.config.isBinary = true;
		primary.config.companionMass = secondary.config.mass;
		primary.config.orbitalSeparation = separation;

		secondary.config.isBinary = true;
		secondary.config.companionMass = primary.config.mass;
		secondary.config.orbitalSeparation = separation;

		// Add gravitational wave effects
		this.addGravitationalWaveEffects(primary.mesh, secondary.mesh, totalMass, separation);

		return [primary, secondary];
	}

	// Generate black hole merger sequence
	public generateMergerSequence(primaryClass: BlackHoleClass, secondaryClass: BlackHoleClass): EnhancedBlackHoleResult[] {
		const sequence: EnhancedBlackHoleResult[] = [];

		// Pre-merger binary
		const preMerger = this.generateBinaryBlackHoles(primaryClass, secondaryClass);
		sequence.push(...preMerger);

		// Merger remnant
		if (!preMerger[0] || !preMerger[1]) {
			throw new Error("Invalid merger configuration: missing black hole data");
		}
		const remnantClass = predictMergerOutcome(preMerger[0].blackHoleType, preMerger[1].blackHoleType);
		const remnantMass = preMerger[0].config.mass + preMerger[1].config.mass * 0.95; // 5% mass loss to GWs
		const remnant = this.generateBlackHole(remnantClass, remnantMass);

		// Position remnant at center of mass
		remnant.mesh.position.set(0, 0, 0);

		// Add merger signatures
		this.addMergerSignatures(remnant.mesh, remnant.config);

		sequence.push(remnant);

		return sequence;
	}

	// Generate black hole formation sequence
	public generateFormationSequence(mechanism: FormationMechanism, finalMass: number): EnhancedBlackHoleResult[] {
		const sequence: EnhancedBlackHoleResult[] = [];

		switch (mechanism) {
			case FormationMechanism.STELLAR_COLLAPSE:
				sequence.push(...this.generateStellarCollapseSequence(finalMass));
				break;
			case FormationMechanism.DIRECT_COLLAPSE:
				sequence.push(...this.generateDirectCollapseSequence(finalMass));
				break;
			case FormationMechanism.HIERARCHICAL_MERGER:
				sequence.push(...this.generateHierarchicalMergerSequence(finalMass));
				break;
			case FormationMechanism.PRIMORDIAL_FORMATION:
				sequence.push(...this.generatePrimordialFormationSequence(finalMass));
				break;
		}

		return sequence;
	}

	// Generate primordial black hole population
	public generatePrimordialPopulation(massFunction: "monochromatic" | "power-law" | "lognormal", count: number = 100): EnhancedBlackHoleResult[] {
		const population: EnhancedBlackHoleResult[] = [];

		for (let i = 0; i < count; i++) {
			const mass = this.samplePrimordialMass(massFunction);
			const pbh = this.generateBlackHole(BlackHoleClass.PRIMORDIAL_MICRO, mass);

			// Random spatial distribution
			const radius = this.random() * 1000; // pc
			const theta = this.random() * Math.PI * 2;
			const phi = this.random() * Math.PI;

			pbh.mesh.position.set(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));

			population.push(pbh);
		}

		return population;
	}

	// Get all available black hole types
	public getAvailableBlackHoleTypes(): BlackHoleClass[] {
		return Array.from(BLACKHOLE_TYPES.keys());
	}

	// Generate black hole configuration from type definition
	private generateBlackHoleConfig(blackHoleType: BlackHoleTypeDefinition, mass?: number): EnhancedBlackHoleConfig {
		// Physical properties
		const bhMass = mass !== undefined ? mass : Math.pow(10, this.randomInRange(blackHoleType.massRange[0], blackHoleType.massRange[1]));
		const spin = this.randomInRange(blackHoleType.spinRange[0], blackHoleType.spinRange[1]);
		const charge = this.randomInRange(blackHoleType.chargeRange[0], blackHoleType.chargeRange[1]);

		// Formation properties
		const formationMechanism = blackHoleType.formationMechanism[Math.floor(this.random() * blackHoleType.formationMechanism.length)];
		const age = this.calculateAge(blackHoleType, formationMechanism);

		// Accretion properties
		const accretionState = this.selectAccretionState(blackHoleType, bhMass);
		const accretionRate = blackHoleType.physics.accretionRate * (0.1 + this.random() * 1.9);

		// Environmental properties
		const environmentalDensity = blackHoleType.physics.environmentalDensity * (0.1 + this.random() * 1.9);
		const ambientMagneticField = blackHoleType.physics.ambientMagneticField * (0.1 + this.random() * 1.9);
		const stellarCompanions = this.random() < 0.3 ? Math.floor(this.random() * 5) : 0;

		// Observational properties
		const distance = this.randomInRange(0.1, 1000); // pc
		const redshift = Math.max(0, distance / 3000); // Rough approximation

		// Visual features
		const visualFeatures = this.generateVisualFeatures(blackHoleType, bhMass, spin);

		return {
			blackHoleClass: blackHoleType.class,
			seed: this.seed,
			mass: bhMass,
			spin,
			charge,
			formationMechanism,
			age,
			accretionState,
			accretionRate,
			environmentalDensity,
			ambientMagneticField,
			stellarCompanions,
			isBinary: false,
			companionMass: 0,
			orbitalSeparation: 0,
			orbitalEccentricity: 0,
			distance,
			redshift,
			observationalStatus: blackHoleType.observationalStatus,
			visualFeatures,
			renderDistance: 100,
			effectDensity: blackHoleType.effectDensity,
			showHawkingRadiation: blackHoleType.class.includes("primordial"),
			showGravitationalWaves: blackHoleType.class.includes("binary"),
			showAccretionDisk: visualFeatures.accretionDisk,
			showJets: visualFeatures.jetStructure,
			quantumEffects: blackHoleType.physics.quantumCorrections > 1e-5,
			stringTheoryEffects: blackHoleType.physics.stringyCoupling > 0,
			loopQuantumGravity: blackHoleType.physics.loopQuantumEffects > 0,
			uniqueFeatures: blackHoleType.uniqueFeatures,
			astrophysicalProcesses: blackHoleType.astrophysicalProcesses,
			scientificValue: blackHoleType.scientificValue,
			explorationDanger: blackHoleType.explorationDanger,
		};
	}

	// Create 3D mesh based on black hole configuration
	private createBlackHoleMesh(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): THREE.Group {
		const blackHoleGroup = new THREE.Group();

		// Create event horizon (or equivalent structure)
		const horizon = this.createEventHorizon(config, blackHoleType);
		blackHoleGroup.add(horizon);

		// Add ergosphere for rotating black holes
		if (config.spin > 0.1 && config.visualFeatures.ergosphere) {
			const ergosphere = this.createErgosphere(config, blackHoleType);
			blackHoleGroup.add(ergosphere);
		}

		// Add accretion disk
		if (config.showAccretionDisk && config.visualFeatures.accretionDisk) {
			const accretionDisk = this.createAccretionDisk(config, blackHoleType);
			blackHoleGroup.add(accretionDisk);
		}

		// Add relativistic jets
		if (config.showJets && config.visualFeatures.jetStructure) {
			const jets = this.createRelativisticJets(config, blackHoleType);
			blackHoleGroup.add(jets);
		}

		// Add gravitational lensing effects
		if (config.visualFeatures.gravitationalLensing) {
			this.addGravitationalLensing(blackHoleGroup, config, blackHoleType);
		}

		// Add Hawking radiation for small black holes
		if (config.showHawkingRadiation && config.mass < 1e-10) {
			const hawkingRadiation = this.createHawkingRadiation(config, blackHoleType);
			blackHoleGroup.add(hawkingRadiation);
		}

		// Add gravitational waves for binary systems
		if (config.showGravitationalWaves && config.isBinary) {
			this.addGravitationalWaveVisualization(blackHoleGroup, config);
		}

		// Add special effects based on black hole type
		this.addSpecialEffects(blackHoleGroup, config, blackHoleType);

		return blackHoleGroup;
	}

	// Create event horizon
	private createEventHorizon(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): THREE.Mesh {
		const radius = calculateSchwarzschildRadius(config.mass) / 1000; // Convert to rendering units

		let geometry: THREE.BufferGeometry;

		if (config.spin > 0.1) {
			// Oblate spheroid for rotating black holes
			geometry = new THREE.SphereGeometry(radius, 32, 32);
			const oblateness = 1 - config.spin * 0.2;
			geometry.scale(1, oblateness, 1);
		} else {
			// Perfect sphere for non-rotating black holes
			geometry = new THREE.SphereGeometry(radius, 32, 32);
		}

		const material = new THREE.MeshBasicMaterial({
			color: blackHoleType.primaryColors[0],
			transparent: true,
			opacity: 0.9,
			side: THREE.BackSide,
		});

		const horizon = new THREE.Mesh(geometry, material);
		horizon.name = "event_horizon";

		return horizon;
	}

	// Create ergosphere for Kerr black holes
	private createErgosphere(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): THREE.Mesh {
		const ergoRadius = calculateErgosphereRadius(config.mass, config.spin) / 1000;

		const geometry = new THREE.SphereGeometry(ergoRadius, 32, 32);
		const material = new THREE.MeshBasicMaterial({
			color: blackHoleType.secondaryColors[0],
			transparent: true,
			opacity: 0.3,
			wireframe: true,
		});

		const ergosphere = new THREE.Mesh(geometry, material);
		ergosphere.name = "ergosphere";

		return ergosphere;
	}

	// Create accretion disk
	private createAccretionDisk(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): THREE.Group {
		const diskGroup = new THREE.Group();

		const innerRadius = calculateISCO(config.mass, config.spin) / 1000;
		const outerRadius = innerRadius * 50;

		// Main disk
		const diskGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64, 8);
		const diskMaterial = this.createAccretionDiskMaterial(config, blackHoleType);

		const disk = new THREE.Mesh(diskGeometry, diskMaterial);
		disk.rotation.x = -Math.PI / 2;
		disk.name = "accretion_disk";
		diskGroup.add(disk);

		// Hot spots and spiral structure
		this.addDiskSpiral(diskGroup, config, innerRadius, outerRadius);
		this.addHotSpots(diskGroup, config, innerRadius, outerRadius);

		// Corona
		if (config.visualFeatures.coronalHotSpot) {
			const corona = this.createCorona(config, blackHoleType, innerRadius);
			diskGroup.add(corona);
		}

		return diskGroup;
	}

	// Create accretion disk material with temperature gradient
	private createAccretionDiskMaterial(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): THREE.Material {
		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext("2d")!;

		// Create radial temperature gradient
		const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
		gradient.addColorStop(0, "#ffffff"); // Hot inner region
		gradient.addColorStop(0.3, "#ffaa00"); // Orange
		gradient.addColorStop(0.6, "#ff4400"); // Red
		gradient.addColorStop(1, "#000000"); // Cool outer region

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 512, 512);

		const texture = new THREE.CanvasTexture(canvas);

		return new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			opacity: 0.8,
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
		});
	}

	// Create relativistic jets
	private createRelativisticJets(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): THREE.Group {
		const jetGroup = new THREE.Group();

		const jetLength = config.mass * 10; // Scale with mass
		const jetRadius = config.mass * 0.1;

		for (let i = 0; i < 2; i++) {
			const jetGeometry = new THREE.ConeGeometry(jetRadius, jetLength, 16);
			const jetMaterial = new THREE.MeshBasicMaterial({
				color: blackHoleType.secondaryColors[1],
				emissive: blackHoleType.secondaryColors[1].clone().multiplyScalar(0.5),
				transparent: true,
				opacity: 0.7,
			});

			const jet = new THREE.Mesh(jetGeometry, jetMaterial);
			jet.position.y = ((i === 0 ? 1 : -1) * jetLength) / 2;
			jet.name = `jet_${i}`;

			jetGroup.add(jet);
		}

		return jetGroup;
	}

	// Add gravitational lensing effects
	private addGravitationalLensing(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): void {
		// Create lensing ring
		const photonSphereRadius = (1.5 * calculateSchwarzschildRadius(config.mass)) / 1000;

		const ringGeometry = new THREE.RingGeometry(photonSphereRadius * 0.95, photonSphereRadius * 1.05, 64);

		const ringMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.2,
			side: THREE.DoubleSide,
		});

		const lensingRing = new THREE.Mesh(ringGeometry, ringMaterial);
		lensingRing.name = "photon_sphere";
		blackHoleGroup.add(lensingRing);
	}

	// Create Hawking radiation visualization
	private createHawkingRadiation(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): THREE.Points {
		const particleCount = Math.floor(config.mass * 1e15); // More particles for larger primordial BHs
		const particles = new THREE.BufferGeometry();
		const positions = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);

		const horizonRadius = calculateSchwarzschildRadius(config.mass) / 1000;

		for (let i = 0; i < particleCount; i++) {
			// Particles appear just outside horizon
			const radius = horizonRadius * (1.01 + this.random() * 0.5);
			const theta = this.random() * Math.PI * 2;
			const phi = this.random() * Math.PI;

			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = radius * Math.cos(phi);
			positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

			// High-energy photon colors
			const energy = this.random();
			colors[i * 3] = energy; // R
			colors[i * 3 + 1] = energy * 0.5; // G
			colors[i * 3 + 2] = 1.0; // B
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 0.01,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			blending: THREE.AdditiveBlending,
		});

		const hawkingRadiation = new THREE.Points(particles, material);
		hawkingRadiation.name = "hawking_radiation";

		return hawkingRadiation;
	}

	// Add special effects based on black hole type
	private addSpecialEffects(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): void {
		switch (blackHoleType.class) {
			case BlackHoleClass.WHITE_HOLE:
				this.addWhiteHoleEffects(blackHoleGroup, config);
				break;
			case BlackHoleClass.WORMHOLE:
				this.addWormholeEffects(blackHoleGroup, config);
				break;
			case BlackHoleClass.FUZZBALL:
				this.addFuzzballEffects(blackHoleGroup, config);
				break;
			case BlackHoleClass.GRAVASTAR:
				this.addGravastarEffects(blackHoleGroup, config);
				break;
			case BlackHoleClass.PLANCK_STAR:
				this.addPlanckStarEffects(blackHoleGroup, config);
				break;
		}
	}

	// Add white hole effects
	private addWhiteHoleEffects(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Matter ejection streams
		const streamCount = 8;

		for (let i = 0; i < streamCount; i++) {
			const angle = (i / streamCount) * Math.PI * 2;
			const streamGeometry = new THREE.CylinderGeometry(0.1, 0.5, config.mass * 2, 8);
			const streamMaterial = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				emissive: new THREE.Color(0xffd700).multiplyScalar(0.6),
				transparent: true,
				opacity: 0.7,
			});

			const stream = new THREE.Mesh(streamGeometry, streamMaterial);
			stream.position.set(Math.cos(angle) * config.mass, 0, Math.sin(angle) * config.mass);
			stream.lookAt(Math.cos(angle) * config.mass * 2, 0, Math.sin(angle) * config.mass * 2);

			blackHoleGroup.add(stream);
		}
	}

	// Add wormhole effects
	private addWormholeEffects(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Throat visualization
		const throatGeometry = new THREE.TorusGeometry(config.mass * 0.5, config.mass * 0.1, 16, 32);
		const throatMaterial = new THREE.MeshBasicMaterial({
			color: 0x9966ff,
			emissive: new THREE.Color(0x6633cc).multiplyScalar(0.4),
			transparent: true,
			opacity: 0.8,
			wireframe: true,
		});

		const throat = new THREE.Mesh(throatGeometry, throatMaterial);
		throat.name = "wormhole_throat";
		blackHoleGroup.add(throat);

		// Exotic matter rings
		for (let i = 0; i < 3; i++) {
			const ringRadius = config.mass * (0.3 + i * 0.2);
			const ringGeometry = new THREE.RingGeometry(ringRadius * 0.9, ringRadius * 1.1, 32);
			const ringMaterial = new THREE.MeshBasicMaterial({
				color: 0x00ffff,
				transparent: true,
				opacity: 0.3,
				side: THREE.DoubleSide,
			});

			const ring = new THREE.Mesh(ringGeometry, ringMaterial);
			ring.position.z = (i - 1) * config.mass * 0.2;
			blackHoleGroup.add(ring);
		}
	}

	// Add fuzzball effects
	private addFuzzballEffects(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Quantum fuzz visualization
		const fuzzCount = 1000;
		const fuzzGeometry = new THREE.BufferGeometry();
		const positions = new Float32Array(fuzzCount * 3);

		const horizonRadius = calculateSchwarzschildRadius(config.mass) / 1000;

		for (let i = 0; i < fuzzCount; i++) {
			const radius = horizonRadius * (0.8 + this.random() * 0.4);
			const theta = this.random() * Math.PI * 2;
			const phi = this.random() * Math.PI;

			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = radius * Math.cos(phi);
			positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
		}

		fuzzGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		const fuzzMaterial = new THREE.PointsMaterial({
			color: 0xff00ff,
			size: 0.05,
			transparent: true,
			opacity: 0.6,
			blending: THREE.AdditiveBlending,
		});

		const fuzz = new THREE.Points(fuzzGeometry, fuzzMaterial);
		fuzz.name = "quantum_fuzz";
		blackHoleGroup.add(fuzz);
	}

	// Helper functions

	private randomInRange(min: number, max: number): number {
		return min + this.random() * (max - min);
	}

	private calculateAge(blackHoleType: BlackHoleTypeDefinition, mechanism: FormationMechanism): number {
		switch (mechanism) {
			case FormationMechanism.STELLAR_COLLAPSE:
				return this.randomInRange(1e6, 1e10); // 1 Myr to 10 Gyr
			case FormationMechanism.PRIMORDIAL_FORMATION:
				return 13.8e9; // Age of universe
			case FormationMechanism.DIRECT_COLLAPSE:
				return this.randomInRange(1e8, 1e9); // 100 Myr to 1 Gyr
			default:
				return this.randomInRange(1e6, 1e10);
		}
	}

	private selectAccretionState(blackHoleType: BlackHoleTypeDefinition, mass: number): AccretionState {
		if (mass < 1e-10) return AccretionState.DORMANT;
		if (blackHoleType.physics.eddingtonRatio > 1) return AccretionState.SLIM_DISK;
		if (blackHoleType.physics.eddingtonRatio > 0.1) return AccretionState.THIN_DISK;
		if (blackHoleType.physics.eddingtonRatio > 0.01) return AccretionState.RADIATIVELY_INEFFICIENT;
		return AccretionState.DORMANT;
	}

	private generateVisualFeatures(blackHoleType: BlackHoleTypeDefinition, mass: number, spin: number): BlackHoleVisualFeatures {
		const features = { ...blackHoleType.visualFeatures };

		// Modify features based on physical properties
		features.ergosphere = spin > 0.1;
		features.accretionDisk = mass > 3 && this.random() > 0.3;
		features.jetStructure = features.accretionDisk && spin > 0.5;
		features.gravitationalLensing = mass > 1e6;
		features.shadowImage = mass > 1e6;

		return features;
	}

	private calculateBinarySeparation(totalMass: number, reducedMass: number): number {
		// Typical binary separation for stellar mass black holes
		return this.randomInRange(100, 1000); // km
	}

	private addGravitationalWaveEffects(mesh1: THREE.Group, mesh2: THREE.Group, totalMass: number, separation: number): void {
		// Add gravitational wave visualization
		const waveGeometry = new THREE.RingGeometry(separation * 0.5, separation * 2, 32, 1);
		const waveMaterial = new THREE.MeshBasicMaterial({
			color: 0x00ffff,
			transparent: true,
			opacity: 0.1,
			side: THREE.DoubleSide,
		});

		const waveRing = new THREE.Mesh(waveGeometry, waveMaterial);
		waveRing.name = "gravitational_waves";

		// Position at center of mass
		const centerOfMass = new THREE.Vector3().addVectors(mesh1.position, mesh2.position).multiplyScalar(0.5);
		waveRing.position.copy(centerOfMass);

		mesh1.add(waveRing);
	}

	private addMergerSignatures(mesh: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Add post-merger effects
		config.visualFeatures.gravitationalWaves = true;

		// Disturbed spacetime visualization
		const distortionGeometry = new THREE.SphereGeometry(config.mass * 2, 16, 16);
		const distortionMaterial = new THREE.MeshBasicMaterial({
			color: 0x4169e1,
			transparent: true,
			opacity: 0.2,
			wireframe: true,
		});

		const distortion = new THREE.Mesh(distortionGeometry, distortionMaterial);
		distortion.name = "spacetime_distortion";
		mesh.add(distortion);
	}

	private generateStellarCollapseSequence(finalMass: number): EnhancedBlackHoleResult[] {
		// Simplified stellar collapse sequence
		const progenitor = this.generateBlackHole(BlackHoleClass.STELLAR_MASS, finalMass);
		return [progenitor];
	}

	private generateDirectCollapseSequence(finalMass: number): EnhancedBlackHoleResult[] {
		// Direct collapse to supermassive black hole
		const smbh = this.generateBlackHole(BlackHoleClass.SUPERMASSIVE, finalMass);
		return [smbh];
	}

	private generateHierarchicalMergerSequence(finalMass: number): EnhancedBlackHoleResult[] {
		// Series of mergers
		const mass1 = finalMass * 0.6;
		const mass2 = finalMass * 0.4;

		const merger = this.generateMergerSequence(BlackHoleClass.STELLAR_MASS, BlackHoleClass.STELLAR_MASS);
		return merger;
	}

	private generatePrimordialFormationSequence(finalMass: number): EnhancedBlackHoleResult[] {
		// Primordial black hole formation
		const pbh = this.generateBlackHole(BlackHoleClass.PRIMORDIAL_MICRO, finalMass);
		return [pbh];
	}

	private samplePrimordialMass(massFunction: string): number {
		switch (massFunction) {
			case "monochromatic":
				return 1e-12; // Fixed mass
			case "power-law":
				return Math.pow(10, this.randomInRange(-15, -5)); // Power law
			case "lognormal":
				return Math.exp(this.randomInRange(-30, -10)); // Log-normal
			default:
				return 1e-12;
		}
	}

	private addDiskSpiral(diskGroup: THREE.Group, config: EnhancedBlackHoleConfig, innerRadius: number, outerRadius: number): void {
		// Add spiral structure to accretion disk
		const spiralCount = 2;

		for (let spiral = 0; spiral < spiralCount; spiral++) {
			const spiralGeometry = this.createSpiralGeometry(innerRadius, outerRadius, spiral);
			const spiralMaterial = new THREE.MeshBasicMaterial({
				color: 0xffaa00,
				transparent: true,
				opacity: 0.6,
			});

			const spiralMesh = new THREE.Mesh(spiralGeometry, spiralMaterial);
			spiralMesh.rotation.x = -Math.PI / 2;
			diskGroup.add(spiralMesh);
		}
	}

	private createSpiralGeometry(innerRadius: number, outerRadius: number, spiralIndex: number): THREE.BufferGeometry {
		const points: THREE.Vector3[] = [];
		const segments = 100;

		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const radius = innerRadius + t * (outerRadius - innerRadius);
			const angle = spiralIndex * Math.PI + t * Math.PI * 4; // 2 full turns

			points.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
		}

		return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 50, outerRadius * 0.01, 8, false);
	}

	private addHotSpots(diskGroup: THREE.Group, config: EnhancedBlackHoleConfig, innerRadius: number, outerRadius: number): void {
		const spotCount = Math.floor(config.mass * 5);

		for (let i = 0; i < spotCount; i++) {
			const radius = this.randomInRange(innerRadius, outerRadius);
			const angle = this.random() * Math.PI * 2;

			const spotGeometry = new THREE.SphereGeometry(radius * 0.05, 8, 8);
			const spotMaterial = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				emissive: new THREE.Color(0xffffff).multiplyScalar(0.8),
				transparent: true,
				opacity: 0.9,
			});

			const hotSpot = new THREE.Mesh(spotGeometry, spotMaterial);
			hotSpot.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));

			diskGroup.add(hotSpot);
		}
	}

	private createCorona(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition, innerRadius: number): THREE.Mesh {
		const coronaGeometry = new THREE.SphereGeometry(innerRadius * 2, 16, 16);
		const coronaMaterial = new THREE.MeshBasicMaterial({
			color: 0x00ffff,
			transparent: true,
			opacity: 0.3,
			side: THREE.BackSide,
		});

		const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
		corona.name = "corona";

		return corona;
	}

	private addGravitationalWaveVisualization(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Ripple effects for gravitational waves
		const rippleCount = 5;

		for (let i = 0; i < rippleCount; i++) {
			const rippleRadius = config.orbitalSeparation * (1 + i * 0.5);
			const rippleGeometry = new THREE.RingGeometry(rippleRadius * 0.95, rippleRadius * 1.05, 32);

			const rippleMaterial = new THREE.MeshBasicMaterial({
				color: 0x00ffff,
				transparent: true,
				opacity: 0.1 / (i + 1),
				side: THREE.DoubleSide,
			});

			const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
			ripple.name = `gw_ripple_${i}`;
			blackHoleGroup.add(ripple);
		}
	}

	private addGravastarEffects(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Granular surface structure
		const grainCount = 200;
		const grainGeometry = new THREE.BufferGeometry();
		const positions = new Float32Array(grainCount * 3);

		const radius = calculateSchwarzschildRadius(config.mass) / 1000;

		for (let i = 0; i < grainCount; i++) {
			const theta = this.random() * Math.PI * 2;
			const phi = this.random() * Math.PI;

			positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			positions[i * 3 + 1] = radius * Math.cos(phi);
			positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
		}

		grainGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		const grainMaterial = new THREE.PointsMaterial({
			color: 0x888888,
			size: 0.1,
			transparent: true,
			opacity: 0.8,
		});

		const grains = new THREE.Points(grainGeometry, grainMaterial);
		grains.name = "gravastar_surface";
		blackHoleGroup.add(grains);
	}

	private addPlanckStarEffects(blackHoleGroup: THREE.Group, config: EnhancedBlackHoleConfig): void {
		// Quantum bounce effects
		const bounceGeometry = new THREE.SphereGeometry(calculateSchwarzschildRadius(config.mass) / 1000, 16, 16);

		const bounceMaterial = new THREE.MeshBasicMaterial({
			color: 0xff00ff,
			emissive: new THREE.Color(0x9966ff).multiplyScalar(0.5),
			transparent: true,
			opacity: 0.7,
			wireframe: true,
		});

		const bounce = new THREE.Mesh(bounceGeometry, bounceMaterial);
		bounce.name = "quantum_bounce";
		blackHoleGroup.add(bounce);
	}

	// Calculate black hole physics
	private calculateBlackHolePhysics(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): BlackHolePhysics {
		const mass = config.mass;
		const spin = config.spin;
		const charge = config.charge;

		return {
			mass,
			spin,
			charge,
			schwarzschildRadius: calculateSchwarzschildRadius(mass),
			ergosphereRadius: calculateErgosphereRadius(mass, spin),
			innerStableCircularOrbit: calculateISCO(mass, spin),
			photonSphere: 1.5 * calculateSchwarzschildRadius(mass),
			hawkingTemperature: calculateHawkingTemperature(mass),
			entropy: mass * mass * 1e77, // Bekenstein-Hawking
			surface_gravity: 1.5e12 / mass, // Inversely proportional to mass
			evaporationTime: calculateEvaporationTime(mass),
			magneticFieldStrength: blackHoleType.physics.magneticFieldStrength,
			electricCharge: charge * mass * 1e20,
			magnetosphereSize: blackHoleType.physics.magnetosphereSize,
			accretionRate: config.accretionRate,
			eddingtonRatio: blackHoleType.physics.eddingtonRatio,
			jetPower: calculateJetPower(mass, spin, config.accretionRate, blackHoleType.physics.magneticFieldStrength),
			diskTemperature: blackHoleType.physics.diskTemperature,
			diskLuminosity: calculateAccretionLuminosity(mass, config.accretionRate),
			environmentalDensity: config.environmentalDensity,
			ambientMagneticField: config.ambientMagneticField,
			stellarWindDensity: blackHoleType.physics.stellarWindDensity,
			orbitalPeriod: config.isBinary ? this.calculateOrbitalPeriod(config.mass, config.companionMass, config.orbitalSeparation) : 0,
			orbitalSeparation: config.orbitalSeparation,
			eccentricity: config.orbitalEccentricity,
			inclination: blackHoleType.physics.inclination,
			strainAmplitude: config.isBinary ? calculateGravitationalWaveStrain(config.mass, config.companionMass, config.distance, 100) : 0,
			coalescenceTime: config.isBinary ? this.calculateCoalescenceTime(config.mass, config.companionMass, config.orbitalSeparation) : 0,
			chirpMass: config.isBinary ? Math.pow(config.mass * config.companionMass, 3 / 5) / Math.pow(config.mass + config.companionMass, 1 / 5) : 0,
			quantumCorrections: blackHoleType.physics.quantumCorrections,
			stringyCoupling: blackHoleType.physics.stringyCoupling,
			loopQuantumEffects: blackHoleType.physics.loopQuantumEffects,
		};
	}

	private calculateOrbitalPeriod(mass1: number, mass2: number, separation: number): number {
		// Kepler's third law
		const G = 6.674e-11; // m³/kg/s²
		const solarMass = 1.989e30; // kg
		const totalMass = (mass1 + mass2) * solarMass;
		const separationMeters = separation * 1000; // Convert km to m

		return (2 * Math.PI * Math.sqrt(Math.pow(separationMeters, 3) / (G * totalMass))) / (24 * 3600); // Convert to days
	}

	private calculateCoalescenceTime(mass1: number, mass2: number, separation: number): number {
		// Gravitational wave inspiral time
		const G = 6.674e-11;
		const c = 2.998e8;
		const solarMass = 1.989e30;

		const m1 = mass1 * solarMass;
		const m2 = mass2 * solarMass;
		const a = separation * 1000; // Convert to meters

		const reducedMass = (m1 * m2) / (m1 + m2);
		const totalMass = m1 + m2;

		const time = (5 * Math.pow(c, 5) * Math.pow(a, 4)) / (256 * Math.pow(G, 3) * reducedMass * Math.pow(totalMass, 2));

		return time / (365.25 * 24 * 3600); // Convert to years
	}

	// Calculate observables
	private calculateObservables(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition, physics: BlackHolePhysics): BlackHoleObservables {
		return {
			...blackHoleType.observables,
			xrayLuminosity: physics.diskLuminosity * 0.1,
			gravitationalWaveStrain: physics.strainAmplitude,
			mergerSignature: config.isBinary && config.orbitalSeparation < 1000,
			inspiralDetectable: physics.strainAmplitude > 1e-23,
		};
	}

	// Calculate detailed statistics
	private calculateStatistics(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition, physics: BlackHolePhysics, observables: BlackHoleObservables, generationTime: number): BlackHoleStatistics {
		const solarMass = 1.989e30; // kg

		return {
			// Basic Properties
			massInSolarMasses: config.mass,
			massInKilograms: config.mass * solarMass,
			radiusInKilometers: physics.schwarzschildRadius,
			radiusInSchwarzschildRadii: 1.0,

			// Thermodynamic Properties
			hawkingTemperatureInKelvin: physics.hawkingTemperature,
			evaporationTimeInYears: physics.evaporationTime,
			entropyInBits: physics.entropy,
			surfaceGravityInMetersPerSecondSquared: physics.surface_gravity,

			// Rotational Properties
			spinParameter: config.spin,
			angularMomentum: config.spin * config.mass * physics.schwarzschildRadius,
			ergosphereRadiusInKilometers: physics.ergosphereRadius,
			frameRaggingFrequency: config.spin / ((2 * Math.PI * physics.schwarzschildRadius) / 299792458),

			// Orbital Properties
			innerStableCircularOrbitInKilometers: physics.innerStableCircularOrbit,
			photonSphereRadiusInKilometers: physics.photonSphere,
			tidalRadiusInKilometers: calculateTidalRadius(config.mass, 1), // For 1 solar mass object
			hillSphereRadiusInKilometers: physics.schwarzschildRadius * 100, // Approximation

			// Electromagnetic Properties
			electricChargeInCoulombs: physics.electricCharge,
			magneticFieldStrengthInTesla: physics.magneticFieldStrength,
			magnetosphereRadiusInKilometers: physics.magnetosphereSize,

			// Accretion Properties
			accretionRateInSolarMassesPerYear: physics.accretionRate,
			eddingtonLuminosityInErgsPerSecond: 1.3e38 * config.mass,
			eddingtonRatio: physics.eddingtonRatio,
			diskTemperatureInKelvin: physics.diskTemperature,
			diskLuminosityInErgsPerSecond: physics.diskLuminosity,

			// Jet Properties
			jetPowerInErgsPerSecond: physics.jetPower,
			jetVelocityInSpeedOfLight: 0.9, // Typical relativistic jet speed
			jetLengthInParsecs: config.mass * 0.01, // Empirical scaling
			jetOpeningAngleInDegrees: 5, // Typical jet opening angle

			// Gravitational Wave Properties
			gravitationalWaveStrainAmplitude: physics.strainAmplitude,
			gravitationalWaveFrequencyInHertz: config.isBinary ? 1 / (physics.orbitalPeriod * 24 * 3600) : 0,
			coalescenceTimeInYears: physics.coalescenceTime,
			chirpMassInSolarMasses: physics.chirpMass,

			// Environmental Properties
			gravitationalInfluenceRadiusInParsecs: blackHoleType.gravitationalInfluence,
			tidalDisruptionRadiusInKilometers: calculateTidalRadius(config.mass, 1) * 1000,
			accretionRadiusInParsecs: blackHoleType.accretionRadius,
			bondiRadiusInKilometers: physics.schwarzschildRadius * 1000, // Approximation

			// Quantum Properties
			quantumCorrectionParameter: physics.quantumCorrections,
			informationParadoxSeverity: config.mass < 1e-10 ? 1.0 : 0.1,
			holographicEntropy: physics.entropy,
			stringLengthScale: 1.6e-35, // Planck length

			// Observational Properties
			apparentMagnitude: this.calculateApparentMagnitude(physics.diskLuminosity, config.distance),
			xrayFlux: observables.xrayLuminosity / (4 * Math.PI * Math.pow(config.distance * 3.086e18, 2)),
			radioFlux: observables.radioLuminosity / (4 * Math.PI * Math.pow(config.distance * 3.086e18, 2)),
			gammaRayFlux: observables.gammaRayLuminosity / (4 * Math.PI * Math.pow(config.distance * 3.086e18, 2)),

			// Formation and Evolution
			formationTimescaleInYears: blackHoleType.formationTimescale,
			evolutionStage: this.getEvolutionStage(config, blackHoleType),
			stabilityParameter: isStable(blackHoleType) ? 1.0 : 0.0,
			lifetimeInYears: physics.evaporationTime,

			// Generation Metadata
			vertices: 0, // Will be calculated after mesh creation
			particles: config.showHawkingRadiation ? Math.floor(config.mass * 1e15) : 0,
			effects: Math.floor(config.effectDensity * 10),
			generationTime,
		};
	}

	// Helper functions
	private calculateApparentMagnitude(luminosity: number, distance: number): number {
		// Convert luminosity to apparent magnitude
		const absoluteMagnitude = -2.5 * Math.log10(luminosity / 3.828e33); // Solar luminosity
		const distanceModulus = 5 * Math.log10(distance / 10); // Distance in pc
		return absoluteMagnitude + distanceModulus;
	}

	private getEvolutionStage(config: EnhancedBlackHoleConfig, blackHoleType: BlackHoleTypeDefinition): string {
		if (config.age < blackHoleType.formationTimescale * 2) {
			return "formation";
		} else if (config.accretionRate > 1e-6) {
			return "active_accretion";
		} else if (config.isBinary && config.orbitalSeparation < 10000) {
			return "binary_inspiral";
		} else {
			return "quiescent";
		}
	}
}
