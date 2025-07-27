"use client";

import { useEffect, useRef } from "react";

export default function GameWrapper() {
	const gameContainerRef = useRef<HTMLDivElement>(null);
	const gameInstanceRef = useRef<any>(null);

	useEffect(() => {
		const initializeGame = async () => {
			try {
				console.log("🎮 [NEXTJS] Starting game initialization...");

				// For now, initialize a placeholder until all dependencies are resolved
				if (gameContainerRef.current && !gameInstanceRef.current) {
					// Create a placeholder scene with Three.js
					const THREE = await import("three");

					const scene = new THREE.Scene();
					scene.background = new THREE.Color(0x000011);

					const camera = new THREE.PerspectiveCamera(75, gameContainerRef.current.clientWidth / gameContainerRef.current.clientHeight, 0.1, 1000);

					const renderer = new THREE.WebGLRenderer({ antialias: true });
					renderer.setSize(gameContainerRef.current.clientWidth, gameContainerRef.current.clientHeight);
					gameContainerRef.current.appendChild(renderer.domElement);

					// Add some stars
					const starsGeometry = new THREE.BufferGeometry();
					const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });

					const starsVertices = [];
					for (let i = 0; i < 1000; i++) {
						starsVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
					}

					starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));
					const stars = new THREE.Points(starsGeometry, starsMaterial);
					scene.add(stars);

					camera.position.z = 5;

					// Animation loop
					const animate = () => {
						requestAnimationFrame(animate);
						stars.rotation.x += 0.0005;
						stars.rotation.y += 0.0005;
						renderer.render(scene, camera);
					};
					animate();

					// Store references for cleanup
					gameInstanceRef.current = {
						scene,
						camera,
						renderer,
						dispose: () => {
							renderer.dispose();
							scene.clear();
						},
					};

					console.log("🎮 [NEXTJS] Placeholder game scene initialized");
				}
			} catch (error) {
				console.error("❌ [NEXTJS] Failed to initialize game:", error);

				// Show error message in the container
				if (gameContainerRef.current) {
					gameContainerRef.current.innerHTML = `
						<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; background: #000011;">
							<div style="text-align: center; padding: 2rem;">
								<h2>🚀 Galactic Clans</h2>
								<p>Game systems loading...</p>
								<p style="font-size: 0.8em; color: #999;">Next.js migration in progress</p>
							</div>
						</div>
					`;
				}
			}
		};

		initializeGame();

		// Cleanup function
		return () => {
			if (gameInstanceRef.current?.dispose) {
				gameInstanceRef.current.dispose();
				gameInstanceRef.current = null;
			}
		};
	}, []);

	return (
		<div
			ref={gameContainerRef}
			id="game-root"
			className="w-full h-full"
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		/>
	);
}
