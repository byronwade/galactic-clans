"use client";

import React, { useEffect, useRef, useState } from "react";
import { useThreeJS } from "@/hooks/useThreeJS";

// Enhanced Planet Configuration with Detailed Biomes
interface PlanetConfig {
	type: string;
	radius: number;
	biomes: BiomeConfig[];
	surfaceDetail: number;
	hasRings: boolean;
	hasMoons: boolean;
	moonCount: number;
	rotationSpeed: number;
	axialTilt: number;
	terrainComplexity: number;
	oceanLevel: number;
	cloudCover: number;
	vegetation: boolean;
	volcanism: number;
	tectonics: number;
	weatherIntensity: number;
}

// Biome Configuration for Realistic Surface Features
interface BiomeConfig {
	name: string;
	temperature: number; // -100 to 100°C
	humidity: number; // 0 to 1
	elevation: number; // -1 to 1 (sea level = 0)
	colors: {
		base: string;
		vegetation: string;
		rock: string;
		water: string;
		special: string;
	};
	features: {
		trees: number; // 0 to 1
		rocks: number; // 0 to 1
		water: number; // 0 to 1
		lava: number; // 0 to 1
		ice: number; // 0 to 1
		sand: number; // 0 to 1
	};
}

// Comprehensive Planet Types with Realistic Biomes
const PLANET_TYPES = {
	earth_like: {
		name: "Earth-like World",
		radius: 3.0,
		biomes: [
			{
				name: "Ocean",
				temperature: 15,
				humidity: 1.0,
				elevation: -0.3,
				colors: {
					base: "#006994",
					vegetation: "#004d6b",
					rock: "#2d4f5e",
					water: "#0080ff",
					special: "#ffffff",
				},
				features: { trees: 0, rocks: 0.1, water: 1.0, lava: 0, ice: 0, sand: 0.2 },
			},
			{
				name: "Tropical Rainforest",
				temperature: 27,
				humidity: 0.9,
				elevation: 0.1,
				colors: {
					base: "#2d5016",
					vegetation: "#228b22",
					rock: "#654321",
					water: "#4682b4",
					special: "#90ee90",
				},
				features: { trees: 0.95, rocks: 0.2, water: 0.7, lava: 0, ice: 0, sand: 0 },
			},
			{
				name: "Temperate Forest",
				temperature: 12,
				humidity: 0.6,
				elevation: 0.2,
				colors: {
					base: "#228b22",
					vegetation: "#32cd32",
					rock: "#696969",
					water: "#4682b4",
					special: "#ffd700",
				},
				features: { trees: 0.8, rocks: 0.3, water: 0.4, lava: 0, ice: 0, sand: 0 },
			},
			{
				name: "Desert",
				temperature: 45,
				humidity: 0.1,
				elevation: 0.0,
				colors: {
					base: "#daa520",
					vegetation: "#9acd32",
					rock: "#8b4513",
					water: "#4682b4",
					special: "#ffffe0",
				},
				features: { trees: 0.05, rocks: 0.6, water: 0.05, lava: 0, ice: 0, sand: 0.9 },
			},
			{
				name: "Tundra",
				temperature: -15,
				humidity: 0.3,
				elevation: 0.1,
				colors: {
					base: "#708090",
					vegetation: "#2e8b57",
					rock: "#696969",
					water: "#4682b4",
					special: "#f0f8ff",
				},
				features: { trees: 0.2, rocks: 0.7, water: 0.3, lava: 0, ice: 0.6, sand: 0 },
			},
			{
				name: "Mountain Peaks",
				temperature: -5,
				humidity: 0.4,
				elevation: 0.8,
				colors: {
					base: "#696969",
					vegetation: "#556b2f",
					rock: "#2f4f4f",
					water: "#87ceeb",
					special: "#ffffff",
				},
				features: { trees: 0.1, rocks: 0.9, water: 0.2, lava: 0, ice: 0.4, sand: 0 },
			},
		],
		surfaceDetail: 0.8,
		hasRings: false,
		hasMoons: true,
		moonCount: 1,
		rotationSpeed: 0.001,
		axialTilt: 23.5,
		terrainComplexity: 0.7,
		oceanLevel: 0.3,
		cloudCover: 0.6,
		vegetation: true,
		volcanism: 0.1,
		tectonics: 0.6,
		weatherIntensity: 0.7,
	},
	volcanic_world: {
		name: "Volcanic World",
		radius: 2.8,
		biomes: [
			{
				name: "Lava Fields",
				temperature: 800,
				humidity: 0.0,
				elevation: 0.0,
				colors: {
					base: "#8b0000",
					vegetation: "#000000",
					rock: "#2f2f2f",
					water: "#ff4500",
					special: "#ff6347",
				},
				features: { trees: 0, rocks: 0.8, water: 0, lava: 0.9, ice: 0, sand: 0 },
			},
			{
				name: "Volcanic Peaks",
				temperature: 400,
				humidity: 0.0,
				elevation: 0.6,
				colors: {
					base: "#2f2f2f",
					vegetation: "#000000",
					rock: "#1c1c1c",
					water: "#ff4500",
					special: "#ff0000",
				},
				features: { trees: 0, rocks: 0.95, water: 0, lava: 0.7, ice: 0, sand: 0 },
			},
			{
				name: "Ash Plains",
				temperature: 60,
				humidity: 0.1,
				elevation: -0.1,
				colors: {
					base: "#696969",
					vegetation: "#2f4f2f",
					rock: "#2f2f2f",
					water: "#000080",
					special: "#d2691e",
				},
				features: { trees: 0.05, rocks: 0.7, water: 0.1, lava: 0.2, ice: 0, sand: 0.6 },
			},
		],
		surfaceDetail: 0.9,
		hasRings: false,
		hasMoons: true,
		moonCount: 2,
		rotationSpeed: 0.002,
		axialTilt: 15,
		terrainComplexity: 0.9,
		oceanLevel: 0.1,
		cloudCover: 0.3,
		vegetation: false,
		volcanism: 0.9,
		tectonics: 0.8,
		weatherIntensity: 0.4,
	},
	ocean_world: {
		name: "Ocean World",
		radius: 3.2,
		biomes: [
			{
				name: "Deep Ocean",
				temperature: 4,
				humidity: 1.0,
				elevation: -0.6,
				colors: {
					base: "#000080",
					vegetation: "#008b8b",
					rock: "#2f4f4f",
					water: "#0000cd",
					special: "#00ffff",
				},
				features: { trees: 0, rocks: 0.3, water: 1.0, lava: 0, ice: 0, sand: 0.1 },
			},
			{
				name: "Shallow Seas",
				temperature: 18,
				humidity: 1.0,
				elevation: -0.2,
				colors: {
					base: "#4682b4",
					vegetation: "#20b2aa",
					rock: "#708090",
					water: "#87ceeb",
					special: "#00ced1",
				},
				features: { trees: 0, rocks: 0.2, water: 1.0, lava: 0, ice: 0, sand: 0.4 },
			},
			{
				name: "Island Chains",
				temperature: 25,
				humidity: 0.8,
				elevation: 0.1,
				colors: {
					base: "#228b22",
					vegetation: "#32cd32",
					rock: "#8b4513",
					water: "#4682b4",
					special: "#ffffe0",
				},
				features: { trees: 0.7, rocks: 0.4, water: 0.3, lava: 0, ice: 0, sand: 0.6 },
			},
			{
				name: "Polar Ice",
				temperature: -40,
				humidity: 0.9,
				elevation: 0.0,
				colors: {
					base: "#f0f8ff",
					vegetation: "#2e8b57",
					rock: "#696969",
					water: "#b0e0e6",
					special: "#ffffff",
				},
				features: { trees: 0, rocks: 0.5, water: 0.7, lava: 0, ice: 0.9, sand: 0 },
			},
		],
		surfaceDetail: 0.7,
		hasRings: false,
		hasMoons: true,
		moonCount: 3,
		rotationSpeed: 0.0015,
		axialTilt: 18,
		terrainComplexity: 0.5,
		oceanLevel: 0.8,
		cloudCover: 0.7,
		vegetation: true,
		volcanism: 0.2,
		tectonics: 0.4,
		weatherIntensity: 0.8,
	},
	forest_world: {
		name: "Forest World",
		radius: 2.9,
		biomes: [
			{
				name: "Mega Forest",
				temperature: 20,
				humidity: 0.9,
				elevation: 0.2,
				colors: {
					base: "#006400",
					vegetation: "#228b22",
					rock: "#8b4513",
					water: "#4682b4",
					special: "#90ee90",
				},
				features: { trees: 0.95, rocks: 0.2, water: 0.5, lava: 0, ice: 0, sand: 0 },
			},
			{
				name: "Ancient Groves",
				temperature: 15,
				humidity: 0.8,
				elevation: 0.4,
				colors: {
					base: "#2e4057",
					vegetation: "#3e7b3e",
					rock: "#654321",
					water: "#4682b4",
					special: "#ffd700",
				},
				features: { trees: 0.9, rocks: 0.3, water: 0.4, lava: 0, ice: 0, sand: 0 },
			},
			{
				name: "Canopy Rivers",
				temperature: 22,
				humidity: 1.0,
				elevation: 0.0,
				colors: {
					base: "#4682b4",
					vegetation: "#20b2aa",
					rock: "#708090",
					water: "#87ceeb",
					special: "#40e0d0",
				},
				features: { trees: 0.6, rocks: 0.1, water: 0.8, lava: 0, ice: 0, sand: 0.2 },
			},
		],
		surfaceDetail: 0.8,
		hasRings: false,
		hasMoons: true,
		moonCount: 1,
		rotationSpeed: 0.0012,
		axialTilt: 12,
		terrainComplexity: 0.6,
		oceanLevel: 0.4,
		cloudCover: 0.8,
		vegetation: true,
		volcanism: 0.1,
		tectonics: 0.3,
		weatherIntensity: 0.6,
	},
};

interface PlanetRendererProps {
	planetType?: keyof typeof PLANET_TYPES;
	showStats?: boolean;
	enableInteraction?: boolean;
	onPlanetClick?: () => void;
}

export default function PlanetRenderer({ planetType = "earth_like", showStats = true, enableInteraction = true, onPlanetClick }: PlanetRendererProps) {
	const { canvasRef, scene, camera, renderer, controls, isLoading, error } = useThreeJS();
	const [currentPlanet, setCurrentPlanet] = useState<any>(null);
	const [planetStats, setPlanetStats] = useState<any>(null);
	const animationRef = useRef<number | undefined>(undefined);
	const planetGroupRef = useRef<any>(null);

	// Get planet configuration
	const planetConfig = PLANET_TYPES[planetType];

	// Advanced Procedural Planet Texture Generation
	const generateDetailedPlanetTexture = async (config: typeof planetConfig) => {
		const canvas = document.createElement("canvas");
		canvas.width = 2048;
		canvas.height = 1024;
		const ctx = canvas.getContext("2d")!;

		// Create heightmap for terrain
		const heightData = generateHeightmap(canvas.width, canvas.height, config.terrainComplexity);

		// Generate biome map
		const biomeMap = generateBiomeMap(canvas.width, canvas.height, config.biomes, heightData);

		// Render detailed surface
		const imageData = ctx.createImageData(canvas.width, canvas.height);
		const data = imageData.data;

		for (let i = 0; i < data.length; i += 4) {
			const x = (i / 4) % canvas.width;
			const y = Math.floor(i / 4 / canvas.width);

			const height = heightData[y * canvas.width + x] ?? 0;
			const biome = biomeMap[y * canvas.width + x] ?? config.biomes[0];

			// Get surface color based on biome and features
			const surfaceColor = calculateSurfaceColor(x, y, height, biome, config);

			data[i] = surfaceColor.r * 255;
			data[i + 1] = surfaceColor.g * 255;
			data[i + 2] = surfaceColor.b * 255;
			data[i + 3] = 255;
		}

		ctx.putImageData(imageData, 0, 0);

		const { CanvasTexture, RepeatWrapping } = await import("three");
		const texture = new CanvasTexture(canvas);
		texture.wrapS = RepeatWrapping;
		texture.wrapT = RepeatWrapping;
		return texture;
	};

	// Generate realistic heightmap using multiple octaves of noise
	const generateHeightmap = (width: number, height: number, complexity: number) => {
		const heightData = new Float32Array(width * height);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = y * width + x;

				// Convert to spherical coordinates
				const longitude = (x / width) * 2 * Math.PI;
				const latitude = (y / height) * Math.PI;

				// Multi-octave noise for realistic terrain
				let elevation = 0;
				let amplitude = 1;
				let frequency = 0.005 * complexity;

				for (let octave = 0; octave < 6; octave++) {
					elevation += amplitude * (Math.sin(longitude * frequency) * Math.cos(latitude * frequency) + Math.sin(longitude * frequency * 2.1) * Math.cos(latitude * frequency * 1.7) * 0.5 + Math.sin(longitude * frequency * 4.3) * Math.cos(latitude * frequency * 3.9) * 0.25);
					amplitude *= 0.5;
					frequency *= 2;
				}

				// Add ridge noise for mountain ranges
				const ridgeNoise = Math.abs(Math.sin(longitude * 8) * Math.cos(latitude * 6)) * 0.3;
				elevation += ridgeNoise;

				// Normalize and store
				heightData[index] = Math.max(-1, Math.min(1, elevation));
			}
		}

		return heightData;
	};

	// Generate biome distribution map
	const generateBiomeMap = (width: number, height: number, biomes: BiomeConfig[], heightData: Float32Array) => {
		const biomeMap = new Array(width * height);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = y * width + x;
				const elevation = heightData[index] ?? 0;

				// Calculate temperature based on latitude and elevation
				const latitude = (y / height - 0.5) * Math.PI;
				const baseTemp = Math.cos(latitude) * 60; // -60 to 60°C based on latitude
				const elevationTemp = elevation * -30; // Colder at higher elevations
				const temperature = baseTemp + elevationTemp;

				// Calculate humidity based on distance from water and elevation
				const humidity = Math.max(0, Math.min(1, (1 - Math.abs(elevation)) * 0.8 + Math.random() * 0.4));

				// Find best matching biome
				let bestBiome = biomes[0];
				let bestScore = Infinity;

				for (const biome of biomes) {
					const tempDiff = Math.abs(temperature - biome.temperature);
					const humidityDiff = Math.abs(humidity - biome.humidity);
					const elevationDiff = Math.abs(elevation - biome.elevation);

					const score = tempDiff + humidityDiff * 50 + elevationDiff * 30;

					if (score < bestScore) {
						bestScore = score;
						bestBiome = biome;
					}
				}

				biomeMap[index] = bestBiome;
			}
		}

		return biomeMap;
	};

	// Calculate detailed surface color with features
	const calculateSurfaceColor = (x: number, y: number, height: number, biome: BiomeConfig, config: typeof planetConfig) => {
		const { Color } = require("three");

		// Base biome color
		let surfaceColor = new Color(biome.colors.base);

		// Add feature variations
		const featureNoise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5;
		const detailNoise = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.3 + 0.7;

		// Water features
		if (height < config.oceanLevel && biome.features.water > 0.5) {
			const waterColor = new Color(biome.colors.water);
			const depth = (config.oceanLevel - height) * 2;
			waterColor.multiplyScalar(Math.max(0.3, 1 - depth));
			surfaceColor = waterColor;
		}

		// Lava features for volcanic worlds
		else if (biome.features.lava > featureNoise) {
			const lavaColor = new Color("#ff4500");
			const intensity = biome.features.lava * detailNoise;
			lavaColor.multiplyScalar(0.5 + intensity * 0.5);
			surfaceColor.lerp(lavaColor, intensity);
		}

		// Vegetation
		else if (biome.features.trees > featureNoise * 0.8) {
			const vegColor = new Color(biome.colors.vegetation);
			const density = biome.features.trees * detailNoise;
			surfaceColor.lerp(vegColor, density * 0.7);
		}

		// Rocky terrain
		else if (biome.features.rocks > featureNoise * 0.6) {
			const rockColor = new Color(biome.colors.rock);
			surfaceColor.lerp(rockColor, biome.features.rocks * 0.5);
		}

		// Sand/desert
		else if (biome.features.sand > featureNoise * 0.7) {
			const sandColor = new Color("#daa520");
			surfaceColor.lerp(sandColor, biome.features.sand * 0.6);
		}

		// Ice features
		if (biome.features.ice > featureNoise * 0.8) {
			const iceColor = new Color("#e0ffff");
			surfaceColor.lerp(iceColor, biome.features.ice * 0.4);
		}

		// Add elevation-based variations
		if (height > 0.5) {
			// High elevation - snow caps
			const snowColor = new Color("#ffffff");
			const snowAmount = (height - 0.5) * 2;
			surfaceColor.lerp(snowColor, snowAmount * 0.3);
		}

		// Add atmospheric effects
		const atmosphereEffect = Math.sin(y * 0.05) * 0.1;
		surfaceColor.multiplyScalar(1 + atmosphereEffect);

		return surfaceColor;
	};

	// Generate advanced normal map for surface detail
	const generateAdvancedNormalMap = async (config: typeof planetConfig) => {
		const canvas = document.createElement("canvas");
		canvas.width = 1024;
		canvas.height = 512;
		const ctx = canvas.getContext("2d")!;

		const imageData = ctx.createImageData(canvas.width, canvas.height);
		const data = imageData.data;

		for (let y = 0; y < canvas.height; y++) {
			for (let x = 0; x < canvas.width; x++) {
				const i = (y * canvas.width + x) * 4;

				// Multi-scale normal mapping
				const noise1 = Math.sin(x * 0.02) * Math.cos(y * 0.02) * config.terrainComplexity;
				const noise2 = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 0.5;
				const noise3 = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.25;

				const combinedNoise = noise1 + noise2 + noise3;

				// Calculate normal vectors
				const normalX = combinedNoise * 0.5;
				const normalY = combinedNoise * 0.3;
				const normalZ = 1.0;

				// Encode as RGB
				data[i] = (normalX + 1) * 127.5; // Red channel (X normal)
				data[i + 1] = (normalY + 1) * 127.5; // Green channel (Y normal)
				data[i + 2] = normalZ * 255; // Blue channel (Z normal)
				data[i + 3] = 255; // Alpha
			}
		}

		ctx.putImageData(imageData, 0, 0);

		const { CanvasTexture } = await import("three");
		return new CanvasTexture(canvas);
	};

	// Create enhanced planet with detailed biomes
	const createDetailedPlanet = async (config: typeof planetConfig) => {
		const THREE = await import("three");

		// Generate detailed surface materials
		const generateDetailedSurfaceMaterial = async () => {
			const diffuseTexture = await generateDetailedPlanetTexture(config);
			const normalTexture = await generateAdvancedNormalMap(config);

			return new THREE.MeshPhongMaterial({
				map: diffuseTexture,
				normalMap: normalTexture,
				shininess: 30,
				specular: new THREE.Color(0x222222),
				bumpMap: normalTexture,
				bumpScale: 0.05,
				transparent: false,
			});
		};

		// Create atmospheric effects
		const createAtmosphere = () => {
			const atmosphereGeometry = new THREE.SphereGeometry(config.radius * 1.1, 64, 64);
			const atmosphereMaterial = new THREE.ShaderMaterial({
				vertexShader: `
					varying vec3 vNormal;
					varying vec3 vPosition;
					
					void main() {
						vNormal = normalize(normalMatrix * normal);
						vPosition = position;
						gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
					}
				`,
				fragmentShader: `
					uniform vec3 atmosphereColor;
					uniform float opacity;
					varying vec3 vNormal;
					varying vec3 vPosition;
					
					void main() {
						float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
						vec3 atmosphere = atmosphereColor * intensity;
						gl_FragColor = vec4(atmosphere, opacity * intensity);
					}
				`,
				uniforms: {
					atmosphereColor: { value: new THREE.Color(0x4a9eff) },
					opacity: { value: 0.6 },
				},
				transparent: true,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
			});

			return new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
		};

		// Create detailed cloud layers
		const createCloudLayers = () => {
			if (config.cloudCover < 0.1) return null;

			const cloudGeometry = new THREE.SphereGeometry(config.radius * 1.05, 48, 48);
			const cloudMaterial = new THREE.ShaderMaterial({
				vertexShader: `
					varying vec2 vUv;
					varying vec3 vNormal;
					
					void main() {
						vUv = uv;
						vNormal = normalize(normalMatrix * normal);
						gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
					}
				`,
				fragmentShader: `
					uniform float time;
					uniform float cloudCover;
					varying vec2 vUv;
					varying vec3 vNormal;
					
					float noise(vec2 p) {
						return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
					}
					
					float turbulence(vec2 p) {
						float value = 0.0;
						float amplitude = 1.0;
						float frequency = 1.0;
						
						for(int i = 0; i < 4; i++) {
							value += amplitude * abs(noise(p * frequency) * 2.0 - 1.0);
							amplitude *= 0.5;
							frequency *= 2.0;
						}
						return value;
					}
					
					void main() {
						vec2 cloudCoord = vUv * 4.0 + time * 0.01;
						float clouds = turbulence(cloudCoord) * cloudCover;
						
						float alpha = smoothstep(0.3, 0.8, clouds) * 0.7;
						vec3 cloudColor = vec3(0.9, 0.95, 1.0);
						
						gl_FragColor = vec4(cloudColor, alpha);
					}
				`,
				uniforms: {
					time: { value: 0 },
					cloudCover: { value: config.cloudCover },
				},
				transparent: true,
				depthWrite: false,
			});

			return new THREE.Mesh(cloudGeometry, cloudMaterial);
		};

		// Main planet group
		const planetGroup = new THREE.Group();

		// Create main planet with detailed surface
		const planetGeometry = new THREE.SphereGeometry(config.radius, 128, 128);
		const planetMaterial = await generateDetailedSurfaceMaterial();
		const planet = new THREE.Mesh(planetGeometry, planetMaterial);
		planet.castShadow = true;
		planet.receiveShadow = true;
		planetGroup.add(planet);

		// Add atmosphere
		const atmosphere = createAtmosphere();
		planetGroup.add(atmosphere);

		// Add clouds
		const clouds = createCloudLayers();
		if (clouds) {
			planetGroup.add(clouds);
		}

		// Add rings if specified
		if (config.hasRings) {
			const ringGeometry = new THREE.RingGeometry(config.radius * 1.2, config.radius * 2.0, 64);
			const ringMaterial = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.6,
				side: THREE.DoubleSide,
			});
			const rings = new THREE.Mesh(ringGeometry, ringMaterial);
			rings.rotation.x = Math.PI / 2 + (config.axialTilt * Math.PI) / 180;
			planetGroup.add(rings);
		}

		// Add moons
		if (config.hasMoons) {
			for (let i = 0; i < config.moonCount; i++) {
				const moonGeometry = new THREE.SphereGeometry(config.radius * 0.15, 32, 32);
				const moonMaterial = new THREE.MeshPhongMaterial({
					color: 0xaaaaaa,
					shininess: 10,
				});
				const moon = new THREE.Mesh(moonGeometry, moonMaterial);

				const distance = config.radius * (3 + i * 1.5);
				const angle = (i / config.moonCount) * Math.PI * 2;
				moon.position.set(Math.cos(angle) * distance, (Math.random() - 0.5) * config.radius * 0.5, Math.sin(angle) * distance);

				moon.userData = {
					orbitDistance: distance,
					orbitSpeed: 0.01 / distance,
					orbitAngle: angle,
				};

				planetGroup.add(moon);
			}
		}

		return planetGroup;
	};

	// Setup realistic lighting
	const setupPlanetLighting = async () => {
		if (!scene) return;

		try {
			const THREE = await import("three");

			// Clear existing lights
			const existingLights = scene.children.filter((child: any) => child.isLight);
			existingLights.forEach((light: any) => scene.remove(light));

			// Star light (main illumination)
			const starLight = new THREE.DirectionalLight(0xffffff, 2.0);
			starLight.position.set(10, 10, 10);
			starLight.castShadow = true;
			starLight.shadow.mapSize.width = 2048;
			starLight.shadow.mapSize.height = 2048;
			scene.add(starLight);

			// Ambient light for realistic space lighting
			const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
			scene.add(ambientLight);

			// Rim lighting for atmospheric effect
			const rimLight = new THREE.DirectionalLight(0x4a9eff, 0.5);
			rimLight.position.set(-5, 0, 5);
			scene.add(rimLight);
		} catch (error) {
			console.error("🌍 [PLANET] Lighting setup failed:", error);
		}
	};

	// Animation loop with realistic planetary motion
	const startPlanetAnimation = (planet: any, config: typeof planetConfig) => {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}

		const animate = () => {
			if (!planet) return;

			const time = Date.now() * 0.001;

			// Rotate planet
			planet.rotation.y += config.rotationSpeed;

			// Animate clouds
			planet.traverse((child: any) => {
				if (child.material && child.material.uniforms && child.material.uniforms.time) {
					child.material.uniforms.time.value = time;
				}

				// Animate moons
				if (child.userData && child.userData.orbitDistance) {
					child.userData.orbitAngle += child.userData.orbitSpeed;
					child.position.x = Math.cos(child.userData.orbitAngle) * child.userData.orbitDistance;
					child.position.z = Math.sin(child.userData.orbitAngle) * child.userData.orbitDistance;
					child.rotation.y += 0.02;
				}
			});

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();
	};

	// Generate planet when component mounts
	useEffect(() => {
		if (scene && camera && renderer && !isLoading) {
			const generatePlanet = async () => {
				try {
					// Generate detailed planet
					const planet = await createDetailedPlanet(planetConfig);

					// Setup lighting
					await setupPlanetLighting();

					// Add to scene
					scene.add(planet);
					planetGroupRef.current = planet;

					// Position camera
					if (camera) {
						const distance = planetConfig.radius * 4;
						camera.position.set(distance, distance * 0.5, distance);
						camera.lookAt(0, 0, 0);
						if (controls) {
							controls.target.set(0, 0, 0);
							controls.update();
						}
					}

					// Start animation
					startPlanetAnimation(planet, planetConfig);

					// Set planet stats
					setPlanetStats({
						name: planetConfig.name,
						type: planetType,
						biomes: planetConfig.biomes.length,
						vegetation: planetConfig.vegetation ? "Present" : "None",
						oceanLevel: `${(planetConfig.oceanLevel * 100).toFixed(0)}%`,
						volcanism: `${(planetConfig.volcanism * 100).toFixed(0)}%`,
						cloudCover: `${(planetConfig.cloudCover * 100).toFixed(0)}%`,
						moons: planetConfig.hasMoons ? planetConfig.moonCount : 0,
					});

					setCurrentPlanet(planet);

					console.log(`🌍 [PLANET] Generated detailed ${planetConfig.name} with ${planetConfig.biomes.length} biomes`);
				} catch (error) {
					console.error("🌍 [PLANET] Generation failed:", error);
				}
			};

			generatePlanet();
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [scene, camera, renderer, isLoading, planetType]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			if (planetGroupRef.current && scene) {
				scene.remove(planetGroupRef.current);
				planetGroupRef.current.traverse((child: any) => {
					if (child.geometry) child.geometry.dispose();
					if (child.material) {
						if (Array.isArray(child.material)) {
							child.material.forEach((mat: any) => mat.dispose());
						} else {
							child.material.dispose();
						}
					}
				});
			}
		};
	}, []);

	if (error) {
		return (
			<div className="flex absolute inset-0 justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-black">
				<div className="text-center">
					<div className="mx-auto mb-4 w-24 h-24 bg-blue-500 rounded-full opacity-50"></div>
					<p className="text-sm text-slate-400">Fallback Planet View</p>
				</div>
			</div>
		);
	}

	return (
		<div className="absolute inset-0">
			{isLoading && (
				<div className="flex absolute inset-0 z-10 justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-black">
					<div className="w-8 h-8 rounded-full border-2 border-blue-500 animate-spin border-t-transparent"></div>
				</div>
			)}

			{/* Planet Statistics Overlay */}
			{showStats && planetStats && (
				<div className="absolute top-4 left-4 z-20 p-4 max-w-xs text-sm text-white rounded-lg backdrop-blur-sm bg-black/50">
					<h3 className="mb-2 font-semibold text-blue-400">{planetStats.name}</h3>
					<div className="space-y-1">
						<div className="flex justify-between">
							<span>Type:</span>
							<span className="text-green-400">{planetStats.type}</span>
						</div>
						<div className="flex justify-between">
							<span>Biomes:</span>
							<span className="text-yellow-400">{planetStats.biomes}</span>
						</div>
						<div className="flex justify-between">
							<span>Vegetation:</span>
							<span className="text-green-400">{planetStats.vegetation}</span>
						</div>
						<div className="flex justify-between">
							<span>Ocean Level:</span>
							<span className="text-blue-400">{planetStats.oceanLevel}</span>
						</div>
						<div className="flex justify-between">
							<span>Volcanism:</span>
							<span className="text-red-400">{planetStats.volcanism}</span>
						</div>
						<div className="flex justify-between">
							<span>Cloud Cover:</span>
							<span className="text-gray-400">{planetStats.cloudCover}</span>
						</div>
						<div className="flex justify-between">
							<span>Moons:</span>
							<span className="text-purple-400">{planetStats.moons}</span>
						</div>
					</div>
				</div>
			)}

			<canvas
				ref={canvasRef}
				className="block w-full h-full"
				style={{
					background: "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 30%, #0f172a 100%)",
				}}
				onClick={enableInteraction ? onPlanetClick : undefined}
			/>
		</div>
	);
}
