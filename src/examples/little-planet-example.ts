/**
 * @file little-planet-example.ts
 * @description Example demonstrating how to use the Little Planet system
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * @created 2024-01-15
 */

import * as THREE from "three";
import { PlanetRenderer, PlanetRenderConfig, PlanetType, DetailLevel } from "../shared/procgen/planet/planet-renderer";
import { PlanetBiome } from "../shared/procgen/planet/little-planet-generator";

/**
 * Example: Creating Little Planets for different biomes
 * This demonstrates the style inspired by the Three.js little-planet project
 */
export class LittlePlanetExample {
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private renderer: THREE.WebGLRenderer;
	private planetRenderer: PlanetRenderer;

	constructor(canvas: HTMLCanvasElement) {
		// Initialize Three.js scene
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000011);

		// Initialize planet renderer
		this.planetRenderer = new PlanetRenderer();

		// Setup lighting
		this.setupLighting();

		// Position camera
		this.camera.position.set(0, 5, 15);
		this.camera.lookAt(0, 0, 0);
	}

	private setupLighting(): void {
		// Ambient light for overall illumination
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		this.scene.add(ambientLight);

		// Directional light as main sun
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
		directionalLight.position.set(10, 10, 5);
		this.scene.add(directionalLight);

		// Additional fill light
		const fillLight = new THREE.DirectionalLight(0x4040ff, 0.3);
		fillLight.position.set(-5, 5, -5);
		this.scene.add(fillLight);
	}

	/**
	 * Create a showcase of different little planets
	 */
	public async createLittlePlanetShowcase(): Promise<void> {
		console.log("🌍 [EXAMPLE] Creating Little Planet Showcase...");

		// Define different planet configurations
		const planetConfigs: PlanetRenderConfig[] = [
			// Temperate Earth-like planet
			{
				id: "temperate-world",
				name: "Temperate World",
				type: PlanetType.TERRESTRIAL,
				radius: 2,
				biome: PlanetBiome.TEMPERATE,
				position: new THREE.Vector3(-6, 0, 0),
				seed: 12345,
				detailLevel: DetailLevel.LITTLE_PLANET,
				atmosphere: true,
				rings: false,
				moons: 1,
			},

			// Tropical jungle planet
			{
				id: "jungle-world",
				name: "Jungle World",
				type: PlanetType.TERRESTRIAL,
				radius: 2.2,
				biome: PlanetBiome.TROPICAL,
				position: new THREE.Vector3(-2, 0, 0),
				seed: 67890,
				detailLevel: DetailLevel.LITTLE_PLANET,
				atmosphere: true,
				rings: false,
				moons: 0,
			},

			// Desert planet with cacti
			{
				id: "desert-world",
				name: "Desert World",
				type: PlanetType.DESERT,
				radius: 1.8,
				biome: PlanetBiome.DESERT,
				position: new THREE.Vector3(2, 0, 0),
				seed: 11111,
				detailLevel: DetailLevel.LITTLE_PLANET,
				atmosphere: true,
				rings: false,
				moons: 2,
			},

			// Arctic ice planet
			{
				id: "ice-world",
				name: "Ice World",
				type: PlanetType.ICE_GIANT,
				radius: 1.9,
				biome: PlanetBiome.ARCTIC,
				position: new THREE.Vector3(6, 0, 0),
				seed: 22222,
				detailLevel: DetailLevel.LITTLE_PLANET,
				atmosphere: true,
				rings: true,
				moons: 1,
			},

			// Volcanic lava planet
			{
				id: "volcanic-world",
				name: "Volcanic World",
				type: PlanetType.LAVA,
				radius: 2.1,
				biome: PlanetBiome.VOLCANIC,
				position: new THREE.Vector3(0, -4, 0),
				seed: 33333,
				detailLevel: DetailLevel.LITTLE_PLANET,
				atmosphere: true,
				rings: false,
				moons: 0,
			},

			// Ocean water world
			{
				id: "ocean-world",
				name: "Ocean World",
				type: PlanetType.OCEAN,
				radius: 2.0,
				biome: PlanetBiome.OCEAN,
				position: new THREE.Vector3(0, 4, 0),
				seed: 44444,
				detailLevel: DetailLevel.LITTLE_PLANET,
				atmosphere: true,
				rings: false,
				moons: 3,
			},
		];

		// Generate all planets
		for (const config of planetConfigs) {
			try {
				const planetResult = await this.planetRenderer.renderPlanet(config);
				this.scene.add(planetResult.group);

				console.log(`✅ [EXAMPLE] Created ${config.name} with ${planetResult.features.length} surface features`);
			} catch (error) {
				console.error(`❌ [EXAMPLE] Failed to create ${config.name}:`, error);
			}
		}

		console.log("🌌 [EXAMPLE] Little Planet Showcase completed!");
	}

	/**
	 * Create a single detailed little planet for close inspection
	 */
	public async createDetailedLittlePlanet(): Promise<void> {
		console.log("🌍 [EXAMPLE] Creating detailed little planet...");

		const detailedConfig: PlanetRenderConfig = {
			id: "detailed-world",
			name: "Detailed Little World",
			type: PlanetType.TERRESTRIAL,
			radius: 3,
			biome: PlanetBiome.TEMPERATE,
			position: new THREE.Vector3(0, 0, 0),
			seed: 98765,
			detailLevel: DetailLevel.LITTLE_PLANET,
			atmosphere: true,
			rings: false,
			moons: 2,
		};

		try {
			const planetResult = await this.planetRenderer.renderPlanet(detailedConfig);
			this.scene.add(planetResult.group);

			// Add some orbital animation for the planet
			this.addOrbitalAnimation(planetResult.group);

			console.log(`✅ [EXAMPLE] Created detailed planet with:`);
			console.log(`   - ${planetResult.features.length} surface features`);
			console.log(`   - ${planetResult.moons.length} moons`);
			console.log(`   - Atmosphere: ${planetResult.atmosphere ? "Yes" : "No"}`);

			// Position camera for better view
			this.camera.position.set(8, 8, 8);
			this.camera.lookAt(0, 0, 0);
		} catch (error) {
			console.error("❌ [EXAMPLE] Failed to create detailed planet:", error);
		}
	}

	/**
	 * Add gentle orbital animation to a planet group
	 */
	private addOrbitalAnimation(planetGroup: THREE.Group): void {
		let time = 0;

		const animate = () => {
			time += 0.01;

			// Gentle vertical bobbing motion
			planetGroup.position.y = Math.sin(time) * 0.2;

			// Slow rotation around Y axis
			planetGroup.rotation.y += 0.005;

			requestAnimationFrame(animate);
		};

		animate();
	}

	/**
	 * Start the rendering loop
	 */
	public startRenderLoop(): void {
		const animate = () => {
			requestAnimationFrame(animate);

			// Add camera rotation for showcase
			if (this.scene.children.length > 3) {
				// More than just lights
				const time = Date.now() * 0.0005;
				this.camera.position.x = Math.cos(time) * 20;
				this.camera.position.z = Math.sin(time) * 20;
				this.camera.lookAt(0, 0, 0);
			}

			this.renderer.render(this.scene, this.camera);
		};

		animate();
	}

	/**
	 * Handle window resize
	 */
	public onWindowResize(): void {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	/**
	 * Cleanup resources
	 */
	public dispose(): void {
		this.renderer.dispose();
		this.scene.clear();
	}
}

/**
 * Usage example function
 */
export async function runLittlePlanetExample(canvas: HTMLCanvasElement): Promise<void> {
	const example = new LittlePlanetExample(canvas);

	// You can choose one of these modes:

	// Mode 1: Create a showcase of different biomes
	await example.createLittlePlanetShowcase();

	// Mode 2: Create a single detailed planet (comment out the above and uncomment below)
	// await example.createDetailedLittlePlanet();

	// Start rendering
	example.startRenderLoop();

	// Handle window resize
	window.addEventListener("resize", () => example.onWindowResize());

	console.log("🎮 [EXAMPLE] Little Planet Example is running!");
	console.log("Features:");
	console.log("  🌳 Trees and vegetation based on biome");
	console.log("  🪨 Rocks and geological features");
	console.log("  🌊 Lakes and water bodies");
	console.log("  🌋 Biome-specific features (cacti, crystals, lava pools)");
	console.log("  🌍 Atmospheric glow effects");
	console.log("  🌙 Orbiting moons");
	console.log("  ✨ Gentle rotation animations");
}

/**
 * Integration helper for existing galaxy view
 */
export function integrateLittlePlanetsIntoGalaxyView(galaxyScene: THREE.Scene): PlanetRenderer {
	const planetRenderer = new PlanetRenderer();

	// Example: Convert existing planet to little planet
	const convertPlanetToLittlePlanet = async (existingPlanet: THREE.Mesh, biome: PlanetBiome = PlanetBiome.TEMPERATE): Promise<void> => {
		const config: PlanetRenderConfig = {
			id: "converted-planet",
			name: "Converted Little Planet",
			type: PlanetType.TERRESTRIAL,
			radius: 1.5,
			biome,
			position: existingPlanet.position.clone(),
			seed: Math.random() * 100000,
			detailLevel: DetailLevel.LITTLE_PLANET,
			atmosphere: true,
			rings: false,
			moons: Math.floor(Math.random() * 3),
		};

		// Remove existing planet
		galaxyScene.remove(existingPlanet);

		// Add new little planet
		const planetResult = await planetRenderer.renderPlanet(config);
		galaxyScene.add(planetResult.group);
	};

	return planetRenderer;
}
