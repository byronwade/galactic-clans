import { useEffect, useRef, useState } from "react";

interface ThreeJSHook {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	scene: any;
	camera: any;
	renderer: any;
	controls: any;
	isLoading: boolean;
	error: string | null;
}

export function useThreeJS(): ThreeJSHook {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [scene, setScene] = useState<any>(null);
	const [camera, setCamera] = useState<any>(null);
	const [renderer, setRenderer] = useState<any>(null);
	const [controls, setControls] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") return;

		let mounted = true;

		const initThreeJS = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Dynamic imports to ensure client-side only
				const [THREE, { OrbitControls }] = await Promise.all([import("three"), import("three/examples/jsm/controls/OrbitControls.js")]);

				if (!mounted || !canvasRef.current) return;

				// Create scene
				const newScene = new THREE.Scene();
				newScene.background = new THREE.Color(0x0a0a0a);

				// Create camera
				const aspect = window.innerWidth / window.innerHeight;
				const newCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
				newCamera.position.set(0, 5, 10);

				// Create renderer
				const newRenderer = new THREE.WebGLRenderer({
					canvas: canvasRef.current,
					antialias: true,
					alpha: true,
				});
				newRenderer.setSize(window.innerWidth, window.innerHeight);
				newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				newRenderer.shadowMap.enabled = true;
				newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

				// Create controls
				const newControls = new OrbitControls(newCamera, newRenderer.domElement);
				newControls.enableDamping = true;
				newControls.dampingFactor = 0.05;
				newControls.enableZoom = true;
				newControls.autoRotate = false;

				// Add basic lighting
				const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
				const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
				directionalLight.position.set(10, 10, 5);
				directionalLight.castShadow = true;
				directionalLight.shadow.mapSize.width = 1024;
				directionalLight.shadow.mapSize.height = 1024;

				newScene.add(ambientLight);
				newScene.add(directionalLight);

				// Handle window resize
				const handleResize = () => {
					if (!newCamera || !newRenderer) return;

					const aspect = window.innerWidth / window.innerHeight;
					newCamera.aspect = aspect;
					newCamera.updateProjectionMatrix();
					newRenderer.setSize(window.innerWidth, window.innerHeight);
				};

				window.addEventListener("resize", handleResize);

				// Animation loop
				const animate = () => {
					if (!mounted) return;

					requestAnimationFrame(animate);
					newControls.update();
					newRenderer.render(newScene, newCamera);
				};

				animate();

				// Set state
				if (mounted) {
					setScene(newScene);
					setCamera(newCamera);
					setRenderer(newRenderer);
					setControls(newControls);
					setIsLoading(false);
				}

				// Cleanup function
				return () => {
					window.removeEventListener("resize", handleResize);
					newRenderer.dispose();
					newControls.dispose();
				};
			} catch (err) {
				console.error("Failed to initialize Three.js:", err);
				if (mounted) {
					setError(err instanceof Error ? err.message : "Failed to initialize 3D renderer");
					setIsLoading(false);
				}
			}
		};

		const cleanup = initThreeJS();

		return () => {
			mounted = false;
			cleanup?.then((cleanupFn) => cleanupFn?.());
		};
	}, []);

	return {
		canvasRef,
		scene,
		camera,
		renderer,
		controls,
		isLoading,
		error,
	};
}
