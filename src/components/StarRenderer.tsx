"use client";

import React, { useEffect, useState, useRef } from "react";
import { useThreeJS } from "@/hooks/useThreeJS";

interface StarConfig {
	type: string;
	mass: number;
	temperature: number;
	luminosity: number;
	radius: number;
	age: number;
	evolutionStage: string;
	hasCompanion: boolean;
	companionType: string;
	companionDistance: number;
}

interface StarRendererProps {
	onGenerate?: () => void;
	onClear?: () => void;
	config?: Partial<StarConfig>;
}

export default function StarRenderer({ onGenerate, onClear, config = {} }: StarRendererProps) {
	const { canvasRef, scene, camera, renderer, controls, isLoading, error } = useThreeJS();
	const [currentStar, setCurrentStar] = useState<any>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const animationRef = useRef<number | undefined>(undefined);

	const defaultConfig: StarConfig = {
		type: "G2V",
		mass: 1.0,
		temperature: 5778,
		luminosity: 1.0,
		radius: 1.0,
		age: 4.6,
		evolutionStage: "Main Sequence",
		hasCompanion: false,
		companionType: "None",
		companionDistance: 0,
		...config,
	};

	// Get star color based on temperature
	const getStarColor = (temperature: number): number => {
		if (temperature >= 30000) return 0x87ceeb; // Blue
		if (temperature >= 10000) return 0x87ceeb; // Blue-white
		if (temperature >= 7500) return 0xf0f8ff; // White
		if (temperature >= 6000) return 0xfff8dc; // Yellow-white
		if (temperature >= 5200) return 0xffff00; // Yellow
		if (temperature >= 3700) return 0xffa500; // Orange
		return 0xff0000; // Red
	};

	// Generate star
	const generateStar = async () => {
		if (!scene || isGenerating) return;

		setIsGenerating(true);

		try {
			// Dynamic import of Three.js
			const THREE = await import("three");

			// Clear existing star
			clearStar();

			// Create star geometry
			const geometry = new THREE.SphereGeometry(defaultConfig.radius, 32, 32);

			// Create star material with emission
			const starColor = getStarColor(defaultConfig.temperature);
			const material = new THREE.MeshBasicMaterial({
				color: starColor,
			});

			// Create star mesh
			const star = new THREE.Mesh(geometry, material);
			star.position.set(0, 0, 0);
			star.castShadow = true;
			star.receiveShadow = false;

			// Add star to scene
			scene.add(star);
			setCurrentStar(star);

			// Add companion if specified
			if (defaultConfig.hasCompanion && defaultConfig.companionType !== "None") {
				const companionGeometry = new THREE.SphereGeometry(defaultConfig.radius * 0.3, 16, 16);
				const companionColor = getStarColor(defaultConfig.temperature * 0.7);
				const companionMaterial = new THREE.MeshBasicMaterial({
					color: companionColor,
				});

				const companion = new THREE.Mesh(companionGeometry, companionMaterial);
				companion.position.set(defaultConfig.companionDistance, 0, 0);
				companion.castShadow = true;
				companion.receiveShadow = false;

				scene.add(companion);
			}

			// Add ambient light for star glow
			const ambientLight = new THREE.AmbientLight(starColor, 0.3);
			scene.add(ambientLight);

			// Add point light from star
			const pointLight = new THREE.PointLight(starColor, defaultConfig.luminosity, 50);
			pointLight.position.set(0, 0, 0);
			scene.add(pointLight);

			// Start animation
			const animate = () => {
				if (star) {
					star.rotation.y += 0.005;
				}
				animationRef.current = requestAnimationFrame(animate);
			};
			animate();
		} catch (error) {
			console.error("Error generating star:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	// Clear star
	const clearStar = () => {
		if (!scene) return;

		// Stop animation
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = undefined;
		}

		// Remove star
		if (currentStar) {
			scene.remove(currentStar);
			currentStar.geometry.dispose();
			currentStar.material.dispose();
			setCurrentStar(null);
		}

		// Remove all lights
		const lights = scene.children.filter((child: any) => child.type === "PointLight" || child.type === "AmbientLight");
		lights.forEach((light: any) => scene.remove(light));

		// Remove companions
		const companions = scene.children.filter((child: any) => child.type === "Mesh" && child !== currentStar);
		companions.forEach((companion: any) => {
			scene.remove(companion);
			companion.geometry.dispose();
			companion.material.dispose();
		});
	};

	// Generate star when config changes
	useEffect(() => {
		if (!isLoading && scene) {
			generateStar();
		}
	}, [defaultConfig, isLoading, scene]);

	// Clear star when component unmounts
	useEffect(() => {
		return () => {
			clearStar();
		};
	}, []);

	if (error) {
		return (
			<div className="fixed inset-0 bg-red-900/20 flex items-center justify-center">
				<div className="text-red-400 text-center">
					<h3 className="text-lg font-semibold mb-2">Error Loading Star Renderer</h3>
					<p className="text-sm">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
			{isGenerating && (
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
					<div className="text-center space-y-4">
						<div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto" />
						<p className="text-white font-medium">Generating star...</p>
					</div>
				</div>
			)}
		</>
	);
}
