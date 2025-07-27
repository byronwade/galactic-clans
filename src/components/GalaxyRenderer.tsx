"use client";

import React, { useEffect, useState, useRef } from "react";
import { useThreeJS } from "@/hooks/useThreeJS";

interface GalaxyConfig {
	count: number;
	size: number;
	radius: number;
	branches: number;
	spin: number;
	randomness: number;
	randomnessPower: number;
	insideColor: string;
	outsideColor: string;
	type?: string;
}

interface ExtendedGalaxyConfig extends GalaxyConfig {
	starCount?: number;
	arms?: number;
	power?: number;
}

interface GalaxyRendererProps {
	onGenerate?: () => void;
	onClear?: () => void;
	config?: Partial<ExtendedGalaxyConfig>;
}

// Enhanced galaxy parameters with scientific accuracy
const GALAXY_PARAMS = {
	// Spiral Galaxies - Updated with detailed morphological parameters
	Sa: {
		arms: 2,
		tightness: 0.8,
		bulgeSize: 0.4,
		armThickness: 0.3,
		HII_regions: 50,
		dustLanes: 30,
		starFormationRate: 0.3,
		metallicity: 0.02,
		stellarMass: 1e11,
		gasMass: 0.15,
		rotationCurve: "flat",
		pitchAngle: 12,
		bulgeDominance: 0.6,
	},
	Sb: {
		arms: 3,
		tightness: 0.6,
		bulgeSize: 0.3,
		armThickness: 0.4,
		HII_regions: 100,
		dustLanes: 50,
		starFormationRate: 0.5,
		metallicity: 0.018,
		stellarMass: 8e10,
		gasMass: 0.2,
		rotationCurve: "flat",
		pitchAngle: 15,
		bulgeDominance: 0.4,
	},
	Sc: {
		arms: 4,
		tightness: 0.4,
		bulgeSize: 0.2,
		armThickness: 0.5,
		HII_regions: 150,
		dustLanes: 80,
		starFormationRate: 0.8,
		metallicity: 0.015,
		stellarMass: 5e10,
		gasMass: 0.3,
		rotationCurve: "flat",
		pitchAngle: 25,
		bulgeDominance: 0.2,
	},
	Sd: {
		arms: 5,
		tightness: 0.2,
		bulgeSize: 0.1,
		armThickness: 0.6,
		HII_regions: 200,
		dustLanes: 120,
		starFormationRate: 1.2,
		metallicity: 0.012,
		stellarMass: 3e10,
		gasMass: 0.4,
		rotationCurve: "rising",
		pitchAngle: 35,
		bulgeDominance: 0.1,
	},
	// Barred Spiral Galaxies with bar dynamics
	SBa: {
		arms: 2,
		tightness: 0.7,
		bulgeSize: 0.5,
		armThickness: 0.3,
		barLength: 0.8,
		barStrength: 0.8,
		barAngle: 0,
		HII_regions: 60,
		dustLanes: 40,
		starFormationRate: 0.4,
		metallicity: 0.02,
		stellarMass: 1.2e11,
		gasMass: 0.12,
	},
	SBb: {
		arms: 3,
		tightness: 0.5,
		bulgeSize: 0.4,
		armThickness: 0.4,
		barLength: 0.9,
		barStrength: 0.9,
		barAngle: 15,
		HII_regions: 120,
		dustLanes: 60,
		starFormationRate: 0.6,
		metallicity: 0.018,
		stellarMass: 9e10,
		gasMass: 0.18,
	},
	SBc: {
		arms: 4,
		tightness: 0.3,
		bulgeSize: 0.2,
		armThickness: 0.5,
		barLength: 1.0,
		barStrength: 1.0,
		barAngle: 30,
		HII_regions: 180,
		dustLanes: 100,
		starFormationRate: 0.9,
		metallicity: 0.015,
		stellarMass: 6e10,
		gasMass: 0.25,
	},
	// Elliptical Galaxies with stellar populations
	E0: {
		ellipticity: 0.1,
		bulgeSize: 0.8,
		concentration: 0.9,
		globularClusters: 100,
		stellarAge: 12e9,
		metallicity: 0.025,
		stellarMass: 2e11,
		gasMass: 0.02,
		xRayLuminosity: 1e42,
	},
	E3: {
		ellipticity: 0.3,
		bulgeSize: 0.7,
		concentration: 0.8,
		globularClusters: 80,
		stellarAge: 10e9,
		metallicity: 0.022,
		stellarMass: 1.5e11,
		gasMass: 0.03,
		xRayLuminosity: 8e41,
	},
	E7: {
		ellipticity: 0.7,
		bulgeSize: 0.6,
		concentration: 0.7,
		globularClusters: 60,
		stellarAge: 8e9,
		metallicity: 0.02,
		stellarMass: 1e11,
		gasMass: 0.05,
		xRayLuminosity: 5e41,
	},
	// Advanced special types
	Ring: {
		ringRadius: 0.8,
		ringWidth: 0.3,
		coreSize: 0.2,
		shockWaveStrength: 0.8,
		starFormationRate: 2.0,
		HII_regions: 300,
		dustLanes: 50,
	},
	S0: {
		diskThickness: 0.1,
		bulgeSize: 0.4,
		diskRadius: 1.0,
		stellarAge: 8e9,
		metallicity: 0.02,
		rotationCurve: "declining",
	},
	Irr: {
		clusters: 8,
		clusterSize: 0.2,
		irregularity: 0.8,
		HII_regions: 250,
		starFormationRate: 1.5,
		metallicity: 0.01,
		gasMass: 0.5,
		stellarMass: 1e9,
	},
	Dwarf: {
		size: 0.5,
		concentration: 0.6,
		clusters: 3,
		HII_regions: 30,
		stellarMass: 1e8,
		gasMass: 0.6,
		metallicity: 0.008,
		starFormationRate: 0.1,
	},
	Starburst: {
		arms: 3,
		tightness: 0.3,
		bulgeSize: 0.3,
		starFormation: 0.8,
		HII_regions: 500,
		starFormationRate: 10.0,
		gasMass: 0.4,
		infraredLuminosity: 1e12,
		dustTemperature: 40,
	},
	Seyfert: {
		arms: 2,
		tightness: 0.6,
		bulgeSize: 0.5,
		activeCore: true,
		HII_regions: 80,
		agn: true,
		blackHoleMass: 1e8,
		jetLuminosity: 1e44,
		accretionRate: 0.1,
	},
	UltraDiffuse: {
		size: 1.5,
		concentration: 0.3,
		brightness: 0.3,
		stellarMass: 1e8,
		darkMatterFraction: 0.98,
		globularClusters: 20,
		metallicity: 0.005,
	},
	GreenPea: {
		size: 0.3,
		concentration: 0.8,
		greenness: 0.9,
		HII_regions: 50,
		starFormationRate: 50.0,
		metallicity: 0.3,
		oxygenAbundance: 0.1,
		lymanAlphaEscape: 0.8,
	},
	PolarRing: {
		ringRadius: 0.8,
		ringWidth: 0.2,
		coreSize: 0.3,
		polar: true,
		gasMass: 0.3,
		starFormationRate: 0.5,
		ringInclinaton: 90,
	},
	// New galaxy types
	Antennae: {
		arms: 2,
		tightness: 0.1,
		collision: true,
		tidalTails: 2,
		starFormationRate: 5.0,
		HII_regions: 1000,
		bridgeMass: 0.2,
	},
	Tadpole: {
		headSize: 0.6,
		tailLength: 3.0,
		tailWidth: 0.2,
		starFormationRate: 2.0,
		HII_regions: 200,
		tidalStripping: 0.8,
	},
	BCD: {
		// Blue Compact Dwarf
		size: 0.4,
		concentration: 0.9,
		starburstRegions: 5,
		starFormationRate: 15.0,
		metallicity: 0.1,
		HII_regions: 100,
	},
	LSB: {
		// Low Surface Brightness
		size: 2.0,
		concentration: 0.2,
		brightness: 0.1,
		stellarMass: 5e9,
		darkMatterFraction: 0.95,
		gasMass: 0.8,
	},
};

// Enhanced color palettes with stellar population colors
const GALAXY_COLORS = {
	// Spiral Galaxies with realistic stellar populations
	Sa: {
		core: "#F7E8B7",
		arms: "#D6B9AE",
		halo: "#7987AA",
		stars: "#FFFFFF",
		HII: "#FF4500",
		dust: "#4B0082",
		youngStars: "#87CEEB",
		oldStars: "#FFA500",
		bulge: "#FFD700",
		disk: "#B8860B",
		background: "#1a1a2e",
	},
	Sb: {
		core: "#FFD700",
		arms: "#CD853F",
		halo: "#4682B4",
		stars: "#FFFFFF",
		HII: "#FF4500",
		dust: "#4B0082",
		youngStars: "#00BFFF",
		oldStars: "#FF8C00",
		bulge: "#FFA500",
		disk: "#DAA520",
		background: "#16213e",
	},
	Sc: {
		core: "#FFA500",
		arms: "#32CD32",
		halo: "#1E90FF",
		stars: "#87CEEB",
		HII: "#FF1493",
		dust: "#4B0082",
		youngStars: "#00CED1",
		oldStars: "#FF6347",
		bulge: "#FF8C00",
		disk: "#228B22",
		background: "#0f3460",
	},
	Sd: {
		core: "#FF6347",
		arms: "#00CED1",
		halo: "#4169E1",
		stars: "#00BFFF",
		HII: "#FF1493",
		dust: "#4B0082",
		youngStars: "#00FFFF",
		oldStars: "#FF4500",
		bulge: "#FF4500",
		disk: "#20B2AA",
		background: "#0e2954",
	},
	// Barred Spirals with bar structure colors
	SBa: {
		core: "#FFD700",
		bar: "#DAA520",
		arms: "#B8860B",
		halo: "#708090",
		stars: "#FFFFFF",
		HII: "#FF4500",
		dust: "#4B0082",
		barEnd: "#FFA500",
	},
	SBb: {
		core: "#FFA500",
		bar: "#FF8C00",
		arms: "#228B22",
		halo: "#4682B4",
		stars: "#87CEEB",
		HII: "#FF4500",
		dust: "#4B0082",
		barEnd: "#FF6347",
	},
	SBc: {
		core: "#FF4500",
		bar: "#FF6347",
		arms: "#00FA9A",
		halo: "#1E90FF",
		stars: "#00BFFF",
		HII: "#FF1493",
		dust: "#4B0082",
		barEnd: "#FF1493",
	},
	// Ellipticals with age-dependent colors
	E0: {
		core: "#F5DEB3",
		body: "#DEB887",
		halo: "#A0522D",
		stars: "#D2B48C",
		globulars: "#FFE4B5",
		xRay: "#00008B",
		background: "#2f1b69",
	},
	E3: {
		core: "#CD853F",
		body: "#A0522D",
		halo: "#8B4513",
		stars: "#BC8F8F",
		globulars: "#DEB887",
		xRay: "#191970",
		background: "#8b0000",
	},
	E7: {
		core: "#8B4513",
		body: "#654321",
		halo: "#2F1B14",
		stars: "#8B7355",
		globulars: "#A0522D",
		xRay: "#000080",
		background: "#654321",
	},
	// Special types with unique features
	Ring: {
		core: "#FFD700",
		ring: "#FF6347",
		halo: "#4169E1",
		stars: "#00CED1",
		shock: "#FF00FF",
		formation: "#00FFFF",
		background: "#000033",
	},
	S0: {
		core: "#F5DEB3",
		disk: "#DEB887",
		halo: "#A0522D",
		stars: "#D2B48C",
		background: "#2f1b69",
	},
	Irr: {
		core: "#FF69B4",
		body: "#9370DB",
		halo: "#4B0082",
		stars: "#FF1493",
		HII: "#FF00FF",
		background: "#4b0082",
	},
	Dwarf: {
		core: "#FFB6C1",
		body: "#DDA0DD",
		halo: "#9370DB",
		stars: "#FF69B4",
		HII: "#FF69B4",
		background: "#663399",
	},
	Starburst: {
		core: "#FF4500",
		arms: "#FF1493",
		halo: "#4B0082",
		stars: "#FFD700",
		HII: "#FF00FF",
		infrared: "#FF0000",
		background: "#8b0000",
	},
	Seyfert: {
		core: "#FFD700",
		arms: "#FF6347",
		halo: "#1E90FF",
		stars: "#00CED1",
		HII: "#FF4500",
		agn: "#FFFFFF",
		jets: "#00FFFF",
		background: "#000080",
	},
	UltraDiffuse: {
		core: "#708090",
		body: "#696969",
		halo: "#2F4F4F",
		stars: "#C0C0C0",
		darkMatter: "#1a1a1a",
		background: "#0a0a0a",
	},
	GreenPea: {
		core: "#32CD32",
		body: "#228B22",
		halo: "#006400",
		stars: "#00FF00",
		HII: "#ADFF2F",
		lyman: "#00FFFF",
		background: "#004000",
	},
	PolarRing: {
		core: "#FFD700",
		ring: "#00CED1",
		halo: "#4169E1",
		stars: "#FF6347",
		gas: "#00BFFF",
		background: "#000033",
	},
	// New types
	Antennae: {
		core: "#FFD700",
		arms: "#FF6347",
		tails: "#87CEEB",
		bridge: "#32CD32",
		collision: "#FF00FF",
		starformation: "#00FFFF",
		background: "#000080",
	},
	Tadpole: {
		head: "#FFD700",
		tail: "#87CEEB",
		stars: "#FFFFFF",
		gas: "#00CED1",
		background: "#000033",
	},
	BCD: {
		core: "#00BFFF",
		starburst: "#FF1493",
		HII: "#00FFFF",
		background: "#000080",
	},
	LSB: {
		core: "#696969",
		disk: "#2F4F4F",
		darkMatter: "#1a1a1a",
		gas: "#4682B4",
		background: "#0a0a0a",
	},
};

export default function GalaxyRenderer({ onGenerate, onClear, config = {} }: GalaxyRendererProps) {
	const { canvasRef, scene, camera, renderer, controls, isLoading, error } = useThreeJS();
	const [currentGalaxy, setCurrentGalaxy] = useState<any>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const animationRef = useRef<number>(0);

	// Enhanced configuration mapping
	const defaultConfig: GalaxyConfig = {
		count: config.starCount || 100000, // Increased particle count for detail
		size: 0.003, // Even smaller particles for realism
		radius: config.radius || 8, // Larger galaxy
		branches: config.arms || 3,
		spin: config.spin || 1,
		randomness: config.randomness || 0.15,
		randomnessPower: config.power || 4,
		insideColor: config.insideColor || "#ff6030",
		outsideColor: config.outsideColor || "#1b3984",
	};

	// Auto-generate galaxy when component loads
	useEffect(() => {
		if (scene && !isLoading && !currentGalaxy && !isGenerating) {
			generateGalaxy();
		}
	}, [scene, isLoading, currentGalaxy, isGenerating]);

	// Regenerate galaxy when config changes
	useEffect(() => {
		if (scene && !isLoading && currentGalaxy) {
			generateGalaxy();
		}
	}, [config]);

	// Enhanced animation loop with stellar evolution effects
	useEffect(() => {
		if (!currentGalaxy) return;

		const animate = (time: number) => {
			if (currentGalaxy && currentGalaxy.material && currentGalaxy.material.uniforms) {
				// Update time uniform for stellar twinkling
				currentGalaxy.material.uniforms.time.value = time * 0.001;

				// Add subtle rotation for disk galaxies
				const galaxyType = config.type || "Sc";
				if (galaxyType.includes("S") && !galaxyType.includes("E")) {
					currentGalaxy.rotation.z += 0.0002;
				}
			}
			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [currentGalaxy, config.type]);

	// Enhanced galaxy generation with advanced morphology
	const generateGalaxy = async () => {
		if (!scene || isGenerating) return;

		setIsGenerating(true);

		try {
			const THREE = await import("three");

			// Remove existing galaxy
			if (currentGalaxy) {
				scene.remove(currentGalaxy);
				if (currentGalaxy.geometry) currentGalaxy.geometry.dispose();
				if (currentGalaxy.material) currentGalaxy.material.dispose();
			}

			const galaxyType = config.type || "Sc";
			const colors = GALAXY_COLORS[galaxyType as keyof typeof GALAXY_COLORS] || GALAXY_COLORS.Sc;
			const params = GALAXY_PARAMS[galaxyType as keyof typeof GALAXY_PARAMS] || GALAXY_PARAMS.Sc;

			// Enhanced particle arrays
			const positions: number[] = [];
			const colors_array: number[] = [];
			const sizes: number[] = [];
			const randomness: number[] = [];
			const velocity: number[] = [];
			const age: number[] = [];
			const metallicity: number[] = [];

			// Generate particles based on galaxy type with enhanced features
			switch (galaxyType) {
				case "E0":
				case "E3":
				case "E7":
					generateAdvancedEllipticalParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
					break;
				case "Ring":
				case "PolarRing":
					generateAdvancedRingParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
					break;
				case "S0":
					generateAdvancedLenticularParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
					break;
				case "Irr":
				case "Dwarf":
				case "Starburst":
				case "Seyfert":
				case "UltraDiffuse":
				case "GreenPea":
				case "BCD":
				case "LSB":
					generateAdvancedIrregularParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
					break;
				case "SBa":
				case "SBb":
				case "SBc":
					generateAdvancedBarredSpiralParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
					break;
				case "Antennae":
					generateCollidingGalaxyParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
					break;
				case "Tadpole":
					generateTadpoleGalaxyParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
					break;
				default:
					generateAdvancedSpiralParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, defaultConfig, THREE);
			}

			// Create enhanced particle system
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
			geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors_array, 3));
			geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
			geometry.setAttribute("randomness", new THREE.Float32BufferAttribute(randomness, 1));
			geometry.setAttribute("velocity", new THREE.Float32BufferAttribute(velocity, 3));
			geometry.setAttribute("age", new THREE.Float32BufferAttribute(age, 1));
			geometry.setAttribute("metallicity", new THREE.Float32BufferAttribute(metallicity, 1));

			// Enhanced shader material with stellar physics
			const material = new THREE.ShaderMaterial({
				uniforms: {
					time: { value: 0 },
					galaxyRadius: { value: defaultConfig.radius },
				},
				vertexShader: `
					attribute float size;
					attribute vec3 color;
					attribute float randomness;
					attribute vec3 velocity;
					attribute float age;
					attribute float metallicity;
					varying vec3 vColor;
					varying float vAge;
					varying float vMetallicity;
					uniform float time;
					uniform float galaxyRadius;
					
					void main() {
						vColor = color;
						vAge = age;
						vMetallicity = metallicity;
						
						// Enhanced position calculation with orbital mechanics
						vec3 pos = position;
						float radius = length(pos.xy);
						
						// Simulate orbital motion
						if (radius > 0.1) {
							float orbitalVelocity = sqrt(galaxyRadius / radius) * 0.1;
							float angle = atan(pos.y, pos.x) + orbitalVelocity * time * 0.1;
							pos.x = radius * cos(angle);
							pos.y = radius * sin(angle);
						}
						
						vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
						
						// Enhanced size calculation based on stellar properties
						float stellarLuminosity = mix(0.5, 2.0, metallicity) * mix(0.8, 1.5, age);
						float distanceScale = 500.0 / -mvPosition.z;
						float twinkle = 1.0 + 0.2 * sin(time * 3.0 + randomness * 15.0) * (1.0 - age * 0.5);
						
						gl_PointSize = size * stellarLuminosity * distanceScale * twinkle;
						gl_Position = projectionMatrix * mvPosition;
					}
				`,
				fragmentShader: `
					varying vec3 vColor;
					varying float vAge;
					varying float vMetallicity;
					
					void main() {
						vec2 center = gl_PointCoord - vec2(0.5);
						float distance = length(center);
						
						if (distance > 0.5) discard;
						
						// Enhanced stellar appearance
						float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
						float coreIntensity = 1.0 - smoothstep(0.0, 0.2, distance);
						
						// Color temperature based on age and metallicity
						vec3 finalColor = vColor;
						finalColor = mix(finalColor, vec3(1.0, 0.8, 0.6), vAge * 0.3);
						finalColor = mix(finalColor, vec3(0.6, 0.8, 1.0), (1.0 - vAge) * 0.4);
						finalColor = mix(finalColor, vec3(1.0, 0.9, 0.7), vMetallicity * 0.2);
						
						// Add stellar core
						finalColor = mix(finalColor, vec3(1.0), coreIntensity * 0.3);
						
						gl_FragColor = vec4(finalColor, alpha * mix(0.7, 1.0, vAge));
					}
				`,
				transparent: true,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
			});

			// Create galaxy group for complex structures
			const galaxyGroup = new THREE.Group();
			const particles = new THREE.Points(geometry, material);
			galaxyGroup.add(particles);

			// Add environmental effects
			addEnvironmentalEffects(galaxyGroup, galaxyType, colors, params, THREE);

			scene.add(galaxyGroup);
			setCurrentGalaxy(galaxyGroup);

			// Enhanced camera positioning
			if (camera) {
				const cameraDistance = defaultConfig.radius * 2.5;
				camera.position.set(cameraDistance, cameraDistance * 0.6, cameraDistance);
				camera.lookAt(0, 0, 0);
			}

			// Disable controls for menu view
			if (controls) {
				controls.enabled = false;
			}

			onGenerate?.();
		} catch (error) {
			console.error("Failed to generate galaxy:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	// Enhanced spiral galaxy particles with stellar populations
	const generateAdvancedSpiralParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		const armCount = params.arms;
		const tightness = params.tightness;
		const bulgeSize = params.bulgeSize;
		const armThickness = params.armThickness;
		const HII_regions = params.HII_regions;
		const dustLanes = params.dustLanes;
		const starFormationRate = params.starFormationRate;

		// Core bulge particles (old stellar population)
		const coreParticles = Math.floor(config.count * 0.2);
		for (let i = 0; i < coreParticles; i++) {
			const radius = Math.pow(Math.random(), 3) * config.radius * bulgeSize;
			const theta = Math.random() * Math.PI * 2;
			const phi = (Math.random() - 0.5) * 0.4;

			positions.push(Math.cos(theta) * radius, Math.sin(phi) * radius * 0.3, Math.sin(theta) * radius);

			// Old stellar population - red/orange colors
			const coreColor = new THREE.Color(colors.bulge);
			colors_array.push(coreColor.r, coreColor.g, coreColor.b);
			sizes.push(config.size * (1.5 + Math.random()));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.8 + Math.random() * 0.2); // Old stars
			metallicity.push(params.metallicity + Math.random() * 0.005);
		}

		// Spiral arm particles (mixed stellar populations)
		const armParticles = Math.floor(config.count * 0.6);
		for (let i = 0; i < armParticles; i++) {
			const radius = Math.pow(Math.random(), 1.5) * config.radius;
			const spinAngle = radius * config.spin * tightness;
			const branchAngle = ((i % armCount) / armCount) * Math.PI * 2;
			const angle = branchAngle + spinAngle;

			// Add arm structure
			const armOffset = (Math.random() - 0.5) * armThickness;
			const x = Math.cos(angle) * (radius + armOffset);
			const z = Math.sin(angle) * (radius + armOffset);
			const y = (Math.random() - 0.5) * 0.2 * radius;

			positions.push(x, y, z);

			// Mixed stellar populations
			const distanceFromCore = radius / config.radius;
			const isYoungStar = Math.random() < starFormationRate * (1 - distanceFromCore);

			if (isYoungStar) {
				const youngColor = new THREE.Color(colors.youngStars);
				colors_array.push(youngColor.r, youngColor.g, youngColor.b);
				age.push(Math.random() * 0.3); // Young stars
				sizes.push(config.size * (2 + Math.random()));
			} else {
				const armColor = new THREE.Color(colors.arms);
				colors_array.push(armColor.r, armColor.g, armColor.b);
				age.push(0.4 + Math.random() * 0.4); // Intermediate age
				sizes.push(config.size * (1 + Math.random()));
			}

			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			metallicity.push(params.metallicity * (0.8 + Math.random() * 0.4));
		}

		// HII regions (star-forming regions)
		for (let i = 0; i < HII_regions; i++) {
			const radius = Math.random() * config.radius;
			const angle = Math.random() * Math.PI * 2;
			const clusterSize = 0.1 + Math.random() * 0.2;

			for (let j = 0; j < 20; j++) {
				const localRadius = Math.random() * clusterSize;
				const localAngle = Math.random() * Math.PI * 2;

				positions.push(Math.cos(angle) * radius + Math.cos(localAngle) * localRadius, (Math.random() - 0.5) * 0.1, Math.sin(angle) * radius + Math.sin(localAngle) * localRadius);

				const hiiColor = new THREE.Color(colors.HII);
				colors_array.push(hiiColor.r, hiiColor.g, hiiColor.b);
				sizes.push(config.size * (3 + Math.random() * 2));
				randomness.push(Math.random());
				velocity.push(0, 0, 0);
				age.push(Math.random() * 0.1); // Very young stars
				metallicity.push(params.metallicity * 1.2);
			}
		}

		// Dust lanes
		for (let i = 0; i < dustLanes; i++) {
			const radius = Math.random() * config.radius * 0.8;
			const angle = Math.random() * Math.PI * 2;

			for (let j = 0; j < 10; j++) {
				const dustOffset = (Math.random() - 0.5) * 0.3;
				positions.push(Math.cos(angle) * radius + dustOffset, (Math.random() - 0.5) * 0.05, Math.sin(angle) * radius + dustOffset);

				const dustColor = new THREE.Color(colors.dust);
				colors_array.push(dustColor.r, dustColor.g, dustColor.b);
				sizes.push(config.size * 0.5);
				randomness.push(Math.random());
				velocity.push(0, 0, 0);
				age.push(0.5); // Neutral
				metallicity.push(0.001); // Low metallicity dust
			}
		}
	};

	// Enhanced elliptical galaxy particles
	const generateAdvancedEllipticalParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		const ellipticity = params.ellipticity;
		const concentration = params.concentration;
		const globularClusters = params.globularClusters;

		// Main stellar body
		for (let i = 0; i < config.count * 0.9; i++) {
			const radius = Math.pow(Math.random(), concentration) * config.radius;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			// Apply ellipticity
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta) * (1 - ellipticity);
			const z = radius * Math.cos(phi);

			positions.push(x, y, z);

			// Old stellar population
			const bodyColor = new THREE.Color(colors.body);
			colors_array.push(bodyColor.r, bodyColor.g, bodyColor.b);
			sizes.push(config.size * (0.8 + Math.random() * 0.4));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.7 + Math.random() * 0.3); // Very old stars
			metallicity.push(params.metallicity + Math.random() * 0.01);
		}

		// Globular clusters
		for (let i = 0; i < globularClusters; i++) {
			const clusterRadius = config.radius * (0.8 + Math.random() * 0.8);
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			const centerX = clusterRadius * Math.sin(phi) * Math.cos(theta);
			const centerY = clusterRadius * Math.sin(phi) * Math.sin(theta);
			const centerZ = clusterRadius * Math.cos(phi);

			for (let j = 0; j < 50; j++) {
				const localRadius = Math.random() * 0.1;
				const localTheta = Math.random() * Math.PI * 2;
				const localPhi = Math.acos(2 * Math.random() - 1);

				positions.push(centerX + localRadius * Math.sin(localPhi) * Math.cos(localTheta), centerY + localRadius * Math.sin(localPhi) * Math.sin(localTheta), centerZ + localRadius * Math.cos(localPhi));

				const globularColor = new THREE.Color(colors.globulars);
				colors_array.push(globularColor.r, globularColor.g, globularColor.b);
				sizes.push(config.size * (1.5 + Math.random()));
				randomness.push(Math.random());
				velocity.push(0, 0, 0);
				age.push(0.9 + Math.random() * 0.1); // Ancient stars
				metallicity.push(params.metallicity * 0.5); // Low metallicity
			}
		}
	};

	// Enhanced barred spiral particles
	const generateAdvancedBarredSpiralParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		generateAdvancedSpiralParticles(positions, colors_array, sizes, randomness, velocity, age, metallicity, colors, params, config, THREE);

		// Add bar structure
		const barLength = params.barLength;
		const barStrength = params.barStrength;
		const barAngle = (params.barAngle * Math.PI) / 180;
		const barParticles = Math.floor(config.count * 0.15);

		for (let i = 0; i < barParticles; i++) {
			const t = (Math.random() - 0.5) * 2;
			const barRadius = Math.abs(t) * config.radius * barLength * 0.5;
			const thickness = (1 - Math.abs(t)) * 0.2;

			const x = t * config.radius * barLength * 0.5;
			const y = (Math.random() - 0.5) * thickness;
			const z = (Math.random() - 0.5) * thickness;

			// Rotate by bar angle
			const rotX = x * Math.cos(barAngle) - z * Math.sin(barAngle);
			const rotZ = x * Math.sin(barAngle) + z * Math.cos(barAngle);

			positions.push(rotX, y, rotZ);

			// Bar color
			const barColor = new THREE.Color(colors.bar);
			colors_array.push(barColor.r, barColor.g, barColor.b);
			sizes.push(config.size * (1.2 + Math.random() * 0.6));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.5 + Math.random() * 0.3);
			metallicity.push(params.metallicity);
		}
	};

	// Enhanced ring galaxy particles
	const generateAdvancedRingParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		const ringRadius = params.ringRadius;
		const ringWidth = params.ringWidth;
		const coreSize = params.coreSize;
		const shockWaveStrength = params.shockWaveStrength;

		// Central core
		const coreParticles = Math.floor(config.count * 0.2);
		for (let i = 0; i < coreParticles; i++) {
			const radius = Math.pow(Math.random(), 2) * config.radius * coreSize;
			const theta = Math.random() * Math.PI * 2;

			positions.push(Math.cos(theta) * radius, (Math.random() - 0.5) * radius * 0.2, Math.sin(theta) * radius);

			const coreColor = new THREE.Color(colors.core);
			colors_array.push(coreColor.r, coreColor.g, coreColor.b);
			sizes.push(config.size * (1 + Math.random()));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.7 + Math.random() * 0.3);
			metallicity.push(params.metallicity);
		}

		// Ring structure
		const ringParticles = Math.floor(config.count * 0.8);
		for (let i = 0; i < ringParticles; i++) {
			const theta = Math.random() * Math.PI * 2;
			const ringOffset = (Math.random() - 0.5) * ringWidth;
			const radius = config.radius * ringRadius + ringOffset;

			positions.push(Math.cos(theta) * radius, (Math.random() - 0.5) * 0.1, Math.sin(theta) * radius);

			// High star formation in ring
			const isStarForming = Math.random() < shockWaveStrength;
			if (isStarForming) {
				const formationColor = new THREE.Color(colors.formation);
				colors_array.push(formationColor.r, formationColor.g, formationColor.b);
				sizes.push(config.size * (2 + Math.random()));
				age.push(Math.random() * 0.2);
			} else {
				const ringColor = new THREE.Color(colors.ring);
				colors_array.push(ringColor.r, ringColor.g, ringColor.b);
				sizes.push(config.size * (1 + Math.random()));
				age.push(0.3 + Math.random() * 0.4);
			}

			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			metallicity.push(params.metallicity);
		}
	};

	// Enhanced lenticular galaxy particles
	const generateAdvancedLenticularParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		const diskThickness = params.diskThickness;
		const bulgeSize = params.bulgeSize;

		// Bulge
		const bulgeParticles = Math.floor(config.count * 0.4);
		for (let i = 0; i < bulgeParticles; i++) {
			const radius = Math.pow(Math.random(), 2) * config.radius * bulgeSize;
			const theta = Math.random() * Math.PI * 2;
			const phi = (Math.random() - 0.5) * 0.6;

			positions.push(Math.cos(theta) * radius, Math.sin(phi) * radius * 0.4, Math.sin(theta) * radius);

			const coreColor = new THREE.Color(colors.core);
			colors_array.push(coreColor.r, coreColor.g, coreColor.b);
			sizes.push(config.size * (1.2 + Math.random() * 0.6));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.6 + Math.random() * 0.4);
			metallicity.push(params.metallicity);
		}

		// Disk
		const diskParticles = Math.floor(config.count * 0.6);
		for (let i = 0; i < diskParticles; i++) {
			const radius = Math.random() * config.radius;
			const theta = Math.random() * Math.PI * 2;

			positions.push(Math.cos(theta) * radius, (Math.random() - 0.5) * diskThickness, Math.sin(theta) * radius);

			const diskColor = new THREE.Color(colors.disk);
			colors_array.push(diskColor.r, diskColor.g, diskColor.b);
			sizes.push(config.size * (0.8 + Math.random() * 0.4));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.5 + Math.random() * 0.4);
			metallicity.push(params.metallicity * 0.9);
		}
	};

	// Enhanced irregular galaxy particles
	const generateAdvancedIrregularParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		const clusters = params.clusters || 8;
		const clusterSize = params.clusterSize || 0.2;
		const irregularity = params.irregularity || 0.8;
		const HII_regions = params.HII_regions || 100;

		// Create cluster centers
		const clusterCenters = [];
		for (let i = 0; i < clusters; i++) {
			clusterCenters.push({
				x: (Math.random() - 0.5) * config.radius * 2,
				y: (Math.random() - 0.5) * config.radius * 0.4,
				z: (Math.random() - 0.5) * config.radius * 2,
				intensity: Math.random(),
			});
		}

		// Generate particles around clusters
		for (let i = 0; i < config.count; i++) {
			const clusterIndex = Math.floor(Math.random() * clusters);
			const cluster = clusterCenters[clusterIndex];
			if (!cluster) continue;

			const localRadius = Math.random() * clusterSize * config.radius;
			const localTheta = Math.random() * Math.PI * 2;
			const localPhi = Math.random() * Math.PI;

			const x = cluster.x + localRadius * Math.sin(localPhi) * Math.cos(localTheta);
			const y = cluster.y + localRadius * Math.sin(localPhi) * Math.sin(localTheta) * 0.3;
			const z = cluster.z + localRadius * Math.cos(localPhi);

			positions.push(x, y, z);

			// Color based on cluster properties
			if (Math.random() < cluster.intensity) {
				const hiiColor = new THREE.Color(colors.HII);
				colors_array.push(hiiColor.r, hiiColor.g, hiiColor.b);
				sizes.push(config.size * (2 + Math.random()));
				age.push(Math.random() * 0.2);
			} else {
				const bodyColor = new THREE.Color(colors.body);
				colors_array.push(bodyColor.r, bodyColor.g, bodyColor.b);
				sizes.push(config.size * (1 + Math.random()));
				age.push(0.3 + Math.random() * 0.5);
			}

			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			metallicity.push(params.metallicity * (0.5 + Math.random()));
		}
	};

	// Colliding galaxy particles (Antennae-style)
	const generateCollidingGalaxyParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		// First galaxy
		for (let i = 0; i < config.count * 0.4; i++) {
			const radius = Math.pow(Math.random(), 1.5) * config.radius * 0.6;
			const theta = Math.random() * Math.PI * 2;

			positions.push(Math.cos(theta) * radius - config.radius * 0.3, (Math.random() - 0.5) * 0.2, Math.sin(theta) * radius);

			const coreColor = new THREE.Color(colors.core);
			colors_array.push(coreColor.r, coreColor.g, coreColor.b);
			sizes.push(config.size * (1 + Math.random()));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.4 + Math.random() * 0.4);
			metallicity.push(params.metallicity);
		}

		// Second galaxy
		for (let i = 0; i < config.count * 0.4; i++) {
			const radius = Math.pow(Math.random(), 1.5) * config.radius * 0.6;
			const theta = Math.random() * Math.PI * 2;

			positions.push(Math.cos(theta) * radius + config.radius * 0.3, (Math.random() - 0.5) * 0.2, Math.sin(theta) * radius);

			const armsColor = new THREE.Color(colors.arms);
			colors_array.push(armsColor.r, armsColor.g, armsColor.b);
			sizes.push(config.size * (1 + Math.random()));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.4 + Math.random() * 0.4);
			metallicity.push(params.metallicity);
		}

		// Tidal tails
		for (let i = 0; i < config.count * 0.2; i++) {
			const t = Math.random();
			const tailLength = config.radius * 2;

			if (Math.random() < 0.5) {
				// First tail
				positions.push(-config.radius * 0.3 - t * tailLength, (Math.random() - 0.5) * 0.5 * t, (Math.random() - 0.5) * 0.3 * t);
			} else {
				// Second tail
				positions.push(config.radius * 0.3 + t * tailLength, (Math.random() - 0.5) * 0.5 * t, (Math.random() - 0.5) * 0.3 * t);
			}

			const tailColor = new THREE.Color(colors.tails);
			colors_array.push(tailColor.r, tailColor.g, tailColor.b);
			sizes.push(config.size * (0.5 + Math.random() * 0.5));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.5 + Math.random() * 0.3);
			metallicity.push(params.metallicity * 0.8);
		}
	};

	// Tadpole galaxy particles
	const generateTadpoleGalaxyParticles = (positions: number[], colors_array: number[], sizes: number[], randomness: number[], velocity: number[], age: number[], metallicity: number[], colors: any, params: any, config: GalaxyConfig, THREE: any) => {
		const headSize = params.headSize;
		const tailLength = params.tailLength;
		const tailWidth = params.tailWidth;

		// Head (main galaxy)
		const headParticles = Math.floor(config.count * 0.7);
		for (let i = 0; i < headParticles; i++) {
			const radius = Math.pow(Math.random(), 1.5) * config.radius * headSize;
			const theta = Math.random() * Math.PI * 2;

			positions.push(Math.cos(theta) * radius, (Math.random() - 0.5) * 0.2 * radius, Math.sin(theta) * radius);

			const headColor = new THREE.Color(colors.head);
			colors_array.push(headColor.r, headColor.g, headColor.b);
			sizes.push(config.size * (1.2 + Math.random() * 0.6));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.3 + Math.random() * 0.5);
			metallicity.push(params.metallicity);
		}

		// Tail
		const tailParticles = Math.floor(config.count * 0.3);
		for (let i = 0; i < tailParticles; i++) {
			const t = Math.random();
			const tailX = config.radius * headSize + t * config.radius * tailLength;
			const tailY = (Math.random() - 0.5) * tailWidth * (1 - t);
			const tailZ = (Math.random() - 0.5) * tailWidth * (1 - t);

			positions.push(tailX, tailY, tailZ);

			const tailColor = new THREE.Color(colors.tail);
			colors_array.push(tailColor.r, tailColor.g, tailColor.b);
			sizes.push(config.size * (1 - t * 0.8) * (1 + Math.random()));
			randomness.push(Math.random());
			velocity.push(0, 0, 0);
			age.push(0.4 + Math.random() * 0.4);
			metallicity.push(params.metallicity * (1 - t * 0.3));
		}
	};

	// Add environmental effects
	const addEnvironmentalEffects = (galaxyGroup: any, galaxyType: string, colors: any, params: any, THREE: any) => {
		// Add background nebula for certain galaxy types
		if (galaxyType === "Starburst" || galaxyType === "Seyfert" || galaxyType === "GreenPea") {
			const nebulaGeometry = new THREE.SphereGeometry(50, 32, 32);
			const nebulaMaterial = new THREE.MeshBasicMaterial({
				color: colors.background,
				transparent: true,
				opacity: 0.1,
				side: THREE.BackSide,
			});
			const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
			galaxyGroup.add(nebula);
		}

		// Add AGN jet for Seyfert galaxies
		if (galaxyType === "Seyfert" && params.agn) {
			const jetGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
			const jetMaterial = new THREE.MeshBasicMaterial({
				color: colors.jets,
				transparent: true,
				opacity: 0.6,
			});

			const jet1 = new THREE.Mesh(jetGeometry, jetMaterial);
			jet1.position.set(0, 10, 0);
			galaxyGroup.add(jet1);

			const jet2 = new THREE.Mesh(jetGeometry, jetMaterial);
			jet2.position.set(0, -10, 0);
			galaxyGroup.add(jet2);
		}

		// Add central supermassive black hole visualization for active galaxies
		if (params.blackHoleMass || params.agn) {
			const bhGeometry = new THREE.SphereGeometry(0.2, 16, 16);
			const bhMaterial = new THREE.MeshBasicMaterial({
				color: "#000000",
				transparent: true,
				opacity: 0.8,
			});
			const blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
			galaxyGroup.add(blackHole);

			// Add accretion disk
			const diskGeometry = new THREE.RingGeometry(0.3, 1.0, 32);
			const diskMaterial = new THREE.MeshBasicMaterial({
				color: colors.agn || "#ffffff",
				transparent: true,
				opacity: 0.4,
				side: THREE.DoubleSide,
			});
			const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
			accretionDisk.rotation.x = Math.PI / 2;
			galaxyGroup.add(accretionDisk);
		}
	};

	// Animation loop
	useEffect(() => {
		if (!currentGalaxy) return;

		let animationId: number;
		const animate = (time: number) => {
			if (currentGalaxy && currentGalaxy.material && currentGalaxy.material.uniforms) {
				currentGalaxy.material.uniforms.time.value = time * 0.0005;
				currentGalaxy.rotation.y += 0.0002;
			}
			animationId = requestAnimationFrame(animate);
		};
		animate(0);

		return () => cancelAnimationFrame(animationId);
	}, [currentGalaxy]);

	const clearGalaxy = () => {
		if (currentGalaxy && scene) {
			scene.remove(currentGalaxy);
			if (currentGalaxy.geometry) currentGalaxy.geometry.dispose();
			if (currentGalaxy.material) currentGalaxy.material.dispose();
			setCurrentGalaxy(null);
		}
		onClear?.();
	};

	if (error) {
		return (
			<div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="text-red-400 text-xl">❌ Galaxy Generation Failed</div>
					<div className="text-slate-400">{error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-full">
			<canvas ref={canvasRef} className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-black" />
			{isGenerating && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
					<div className="text-center space-y-4">
						<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
						<div className="space-y-2">
							<h2 className="text-xl font-semibold text-white">Generating Galaxy</h2>
							<p className="text-sm text-slate-300">Creating cosmic masterpiece...</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
