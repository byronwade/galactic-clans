"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useThreeJS } from "@/hooks/useThreeJS";
import { usePlanetHover } from "@/hooks/usePlanetHover";

interface Planet {
	name: string;
	distance: number;
	radius: number;
	period: number;
	color: number;
	tilt: number;
	mass?: string;
	type?: string;
	atmosphere?: string;
	temperature?: string;
	moons?: number;
	habitability?: string;
	resources?: string[];
	threat_level?: string;
}

const PLANET_DATA: Record<string, Planet> = {
	mercury: {
		name: "Mercury",
		distance: 0.39,
		radius: 0.38,
		period: 88,
		tilt: 0.1,
		color: 0x8c7853,
		mass: "3.3 × 10²³ kg",
		type: "Terrestrial",
		atmosphere: "None",
		temperature: "167°C avg",
		moons: 0,
		habitability: "None",
		resources: ["Iron", "Nickel", "Sulfur"],
		threat_level: "low",
	},
	venus: {
		name: "Venus",
		distance: 0.72,
		radius: 0.95,
		period: 225,
		tilt: 177.4,
		color: 0xffc649,
		mass: "4.9 × 10²⁴ kg",
		type: "Terrestrial",
		atmosphere: "CO₂ Dense",
		temperature: "462°C",
		moons: 0,
		habitability: "None",
		resources: ["Carbon", "Sulfuric Compounds"],
		threat_level: "high",
	},
	earth: {
		name: "Earth",
		distance: 1.0,
		radius: 1.0,
		period: 365,
		tilt: 23.4,
		color: 0x6b93d6,
		mass: "5.9 × 10²⁴ kg",
		type: "Terrestrial",
		atmosphere: "N₂, O₂",
		temperature: "15°C avg",
		moons: 1,
		habitability: "High",
		resources: ["Water", "Oxygen", "Minerals"],
		threat_level: "low",
	},
	mars: {
		name: "Mars",
		distance: 1.52,
		radius: 0.53,
		period: 687,
		tilt: 25.2,
		color: 0xcd5c5c,
		mass: "6.4 × 10²³ kg",
		type: "Terrestrial",
		atmosphere: "CO₂ Thin",
		temperature: "-65°C avg",
		moons: 2,
		habitability: "Medium",
		resources: ["Iron Oxide", "Water Ice", "CO₂"],
		threat_level: "medium",
	},
	jupiter: {
		name: "Jupiter",
		distance: 5.2,
		radius: 11.2,
		period: 4333,
		tilt: 3.1,
		color: 0xd8ca9d,
		mass: "1.9 × 10²⁷ kg",
		type: "Gas Giant",
		atmosphere: "H₂, He",
		temperature: "-110°C",
		moons: 79,
		habitability: "None",
		resources: ["Hydrogen", "Helium", "Methane"],
		threat_level: "critical",
	},
	saturn: {
		name: "Saturn",
		distance: 9.5,
		radius: 9.4,
		period: 10759,
		tilt: 26.7,
		color: 0xfad5a5,
		mass: "5.7 × 10²⁶ kg",
		type: "Gas Giant",
		atmosphere: "H₂, He",
		temperature: "-140°C",
		moons: 82,
		habitability: "None",
		resources: ["Hydrogen", "Helium", "Ring Materials"],
		threat_level: "high",
	},
	uranus: {
		name: "Uranus",
		distance: 19.2,
		radius: 4.0,
		period: 30687,
		tilt: 97.8,
		color: 0x4fd0e4,
		mass: "8.7 × 10²⁵ kg",
		type: "Ice Giant",
		atmosphere: "H₂, He, CH₄",
		temperature: "-195°C",
		moons: 27,
		habitability: "None",
		resources: ["Methane", "Water Ice", "Ammonia"],
		threat_level: "medium",
	},
	neptune: {
		name: "Neptune",
		distance: 30.1,
		radius: 3.9,
		period: 60190,
		tilt: 28.3,
		color: 0x4b70dd,
		mass: "1.0 × 10²⁶ kg",
		type: "Ice Giant",
		atmosphere: "H₂, He, CH₄",
		temperature: "-200°C",
		moons: 14,
		habitability: "None",
		resources: ["Methane", "Hydrogen", "Helium"],
		threat_level: "high",
	},
	pluto: {
		name: "Pluto",
		distance: 39.5,
		radius: 0.18,
		period: 90560,
		tilt: 122.5,
		color: 0xd4af9a,
		mass: "1.3 × 10²² kg",
		type: "Dwarf Planet",
		atmosphere: "N₂ Thin",
		temperature: "-230°C",
		moons: 5,
		habitability: "None",
		resources: ["Nitrogen", "Methane", "Water Ice"],
		threat_level: "low",
	},
};

interface SolarSystemRendererProps {
	onGenerate?: () => void;
	onClear?: () => void;
	config?: {
		distanceScale: number;
		sizeScale: number;
		subdivisions: number;
		showOrbits: boolean;
		includePluto: boolean;
		realisticPhysics: boolean;
	};
}

export default function SolarSystemRenderer({
	onGenerate,
	onClear,
	config = {
		distanceScale: 1.0,
		sizeScale: 1.0,
		subdivisions: 2,
		showOrbits: true,
		includePluto: true,
		realisticPhysics: true,
	},
}: SolarSystemRendererProps) {
	const { canvasRef, scene, camera, renderer, controls, isLoading: threeLoading, error } = useThreeJS();
	const { initializeRaycaster, handleMouseMove, handleMouseLeave, attachPlanetData } = usePlanetHover();
	const [isLoading, setIsLoading] = useState(false);
	const [planetMeshes, setPlanetMeshes] = useState<any[]>([]);
	const configRef = useRef(config);

	// Update config ref when config changes
	useEffect(() => {
		configRef.current = config;
	}, [config]);

	const createSolarSystem = useCallback(async () => {
		if (!scene || !camera || !renderer) return;

		setIsLoading(true);
		const currentConfig = configRef.current;

		try {
			const THREE = await import("three");

			// Clear existing objects
			scene.clear();
			setPlanetMeshes([]);

			// Setup lighting
			const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
			scene.add(ambientLight);

			const sunLight = new THREE.PointLight(0xffffff, 2, 100);
			sunLight.position.set(0, 0, 0);
			sunLight.castShadow = true;
			scene.add(sunLight);

			// Create Sun
			const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
			const sunMaterial = new THREE.MeshLambertMaterial({
				color: 0xffff00,
				emissive: 0xffaa00,
			});
			const sun = new THREE.Mesh(sunGeometry, sunMaterial);
			scene.add(sun);

			// Store planet meshes for hover detection
			const meshes: any[] = [];

			// Create planets
			const planetsToCreate = currentConfig.includePluto ? Object.values(PLANET_DATA) : Object.values(PLANET_DATA).filter((p) => p.name !== "Pluto");

			planetsToCreate.forEach((planetData) => {
				// Create planet geometry
				const geometry = new THREE.SphereGeometry(planetData.radius * currentConfig.sizeScale * 0.5, currentConfig.subdivisions * 8 + 16, currentConfig.subdivisions * 4 + 8);

				const material = new THREE.MeshPhongMaterial({
					color: planetData.color,
					shininess: 30,
					specular: 0x111111,
				});

				const planet = new THREE.Mesh(geometry, material);
				planet.castShadow = true;
				planet.receiveShadow = true;

				// Position planet
				const distance = planetData.distance * currentConfig.distanceScale * 10;
				planet.position.set(distance, 0, 0);

				// Store planet data for hover detection
				attachPlanetData(planet, planetData);
				meshes.push(planet);

				scene.add(planet);

				// Create orbit visualization
				if (currentConfig.showOrbits) {
					const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64);
					const orbitMaterial = new THREE.MeshBasicMaterial({
						color: 0x444444,
						transparent: true,
						opacity: 0.3,
						side: THREE.DoubleSide,
					});
					const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
					orbit.rotation.x = Math.PI / 2;
					scene.add(orbit);
				}

				// Add moons for major planets
				if (planetData.moons && planetData.moons > 0 && planetData.name === "Earth") {
					const moonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
					const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
					const moon = new THREE.Mesh(moonGeometry, moonMaterial);
					moon.position.set(planetData.radius * 2, 0, 0);
					planet.add(moon);
				}
			});

			setPlanetMeshes(meshes);

			// Add stars background
			const starsGeometry = new THREE.BufferGeometry();
			const starsCount = 2000;
			const positions = new Float32Array(starsCount * 3);

			for (let i = 0; i < starsCount * 3; i++) {
				positions[i] = (Math.random() - 0.5) * 400;
			}

			starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
			const starsMaterial = new THREE.PointsMaterial({
				color: 0xffffff,
				size: 0.5,
				sizeAttenuation: false,
			});
			const stars = new THREE.Points(starsGeometry, starsMaterial);
			scene.add(stars);

			// Set camera position
			camera.position.set(20, 15, 20);
			camera.lookAt(0, 0, 0);

			console.log("Solar system generated with Division-style hover cards");
		} catch (error) {
			console.error("Error creating solar system:", error);
		} finally {
			setIsLoading(false);
		}
	}, [scene, camera, renderer, attachPlanetData]); // Removed config from dependencies

	// Regenerate when config changes
	useEffect(() => {
		if (scene && camera && renderer) {
			createSolarSystem();
		}
	}, [scene, camera, renderer, createSolarSystem, config]); // Keep config here to trigger regeneration

	const clearSystem = useCallback(() => {
		if (scene) {
			scene.clear();
			setPlanetMeshes([]);
			onClear?.();
		}
	}, [scene, onClear]);

	// Mouse event handlers
	const onMouseMove = useCallback(
		(event: MouseEvent) => {
			if (camera && planetMeshes.length > 0) {
				handleMouseMove(event, camera, planetMeshes);
			}
		},
		[camera, planetMeshes, handleMouseMove]
	);

	const onMouseLeave = useCallback(() => {
		handleMouseLeave();
	}, [handleMouseLeave]);

	useEffect(() => {
		if (canvasRef.current) {
			initializeRaycaster();

			// Add mouse event listeners
			const canvas = canvasRef.current;
			canvas.addEventListener("mousemove", onMouseMove);
			canvas.addEventListener("mouseleave", onMouseLeave);

			return () => {
				canvas.removeEventListener("mousemove", onMouseMove);
				canvas.removeEventListener("mouseleave", onMouseLeave);
			};
		}
	}, [canvasRef, initializeRaycaster, onMouseMove, onMouseLeave]);

	if (error) {
		return (
			<div className="flex items-center justify-center h-full bg-red-900/20 rounded-lg border border-red-500/30">
				<div className="text-center">
					<h3 className="text-red-400 font-semibold mb-2">3D Renderer Error</h3>
					<p className="text-red-300 text-sm">{error}</p>
					<p className="text-red-400 text-xs mt-2">WebGL may not be supported in your browser</p>
				</div>
			</div>
		);
	}

	return (
		<div className="absolute inset-0">
			{threeLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
					<div className="text-center">
						<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
						<p className="text-slate-300">Loading 3D Renderer...</p>
					</div>
				</div>
			)}

			<canvas ref={canvasRef} className="w-full h-full block" style={{ background: "transparent" }} />
		</div>
	);
}
