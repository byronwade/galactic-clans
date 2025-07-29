/**
 * @file useOptimizedThreeJS.ts
 * @description Optimized Three.js hook with performance monitoring and automatic optimizations
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Performance monitoring and FPS tracking
 * - Level of Detail (LOD) management
 * - Object pooling for frequently created objects
 * - Automatic quality adjustment based on performance
 * - Memory management and cleanup
 * - Render optimization techniques
 */

"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";

interface PerformanceSettings {
	targetFPS: number;
	minFPS: number;
	maxObjects: number;
	enableLOD: boolean;
	enableObjectPooling: boolean;
	enableAutoQuality: boolean;
	memoryLimit: number; // MB
}

interface ObjectPool<T extends THREE.Object3D> {
	available: T[];
	inUse: Set<T>;
	factory: () => T;
	reset: (obj: T) => void;
}

interface OptimizedThreeJSConfig {
	performanceSettings?: Partial<PerformanceSettings>;
	enableShadows?: boolean;
	enableAntialiasing?: boolean;
	pixelRatio?: number;
	maxTextureSize?: number;
}

interface OptimizedThreeJSReturn {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
	frameTime: number;
	fps: number;
	memoryUsage: number;
	performanceScore: number;
	qualityLevel: number;
	// Optimization methods
	setQualityLevel: (level: number) => void;
	optimizeScene: () => void;
	cleanupUnusedObjects: () => void;
	// Object pooling
	getPooledObject: <T extends THREE.Object3D>(poolName: string) => T | null;
	returnPooledObject: <T extends THREE.Object3D>(poolName: string, obj: T) => void;
	// LOD management
	addLODObject: (object: THREE.Object3D, distances: number[]) => THREE.LOD;
	updateLOD: (cameraPosition: THREE.Vector3) => void;
}

const defaultSettings: PerformanceSettings = {
	targetFPS: 60,
	minFPS: 45,
	maxObjects: 1000,
	enableLOD: true,
	enableObjectPooling: true,
	enableAutoQuality: true,
	memoryLimit: 512,
};

export function useOptimizedThreeJS(canvas: HTMLCanvasElement | null, config: OptimizedThreeJSConfig = {}): OptimizedThreeJSReturn | null {
	const settings = { ...defaultSettings, ...config.performanceSettings };

	// Core Three.js objects
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

	// Performance tracking
	const frameTimeRef = useRef(0);
	const fpsRef = useRef(0);
	const lastFrameTimeRef = useRef(performance.now());
	const frameCountRef = useRef(0);
	const fpsBufferRef = useRef<number[]>([]);

	// Optimization state
	const [qualityLevel, setQualityLevel] = useState(5); // 0-10 scale
	const [performanceScore, setPerformanceScore] = useState(100);
	const [memoryUsage, setMemoryUsage] = useState(0);

	// Object pools
	const objectPoolsRef = useRef<Map<string, ObjectPool<any>>>(new Map());

	// LOD objects
	const lodObjectsRef = useRef<THREE.LOD[]>([]);

	// Performance monitoring
	const updatePerformanceMetrics = useCallback(() => {
		const now = performance.now();
		const deltaTime = now - lastFrameTimeRef.current;
		lastFrameTimeRef.current = now;

		frameTimeRef.current = deltaTime;
		frameCountRef.current++;

		// Calculate FPS
		const instantFPS = 1000 / deltaTime;
		fpsBufferRef.current.push(instantFPS);

		if (fpsBufferRef.current.length > 60) {
			fpsBufferRef.current.shift();
		}

		fpsRef.current = fpsBufferRef.current.reduce((a, b) => a + b, 0) / fpsBufferRef.current.length;

		// Calculate memory usage
		if ("memory" in performance && (performance as any).memory) {
			const memoryInfo = (performance as any).memory;
			setMemoryUsage(memoryInfo.usedJSHeapSize / (1024 * 1024));
		}

		// Calculate performance score
		const fpsScore = Math.min(100, (fpsRef.current / settings.targetFPS) * 100);
		const memoryScore = Math.max(0, 100 - (memoryUsage / settings.memoryLimit) * 100);
		const newPerformanceScore = (fpsScore + memoryScore) / 2;
		setPerformanceScore(newPerformanceScore);

		// Auto quality adjustment
		if (settings.enableAutoQuality) {
			if (fpsRef.current < settings.minFPS && qualityLevel > 1) {
				setQualityLevel((prev) => Math.max(1, prev - 1));
			} else if (fpsRef.current > settings.targetFPS && qualityLevel < 10) {
				setQualityLevel((prev) => Math.min(10, prev + 1));
			}
		}
	}, [qualityLevel, memoryUsage, settings]);

	// Quality adjustment
	const applyQualitySettings = useCallback(
		(level: number) => {
			if (!rendererRef.current) return;

			const renderer = rendererRef.current;

			// Adjust pixel ratio
			const basePixelRatio = window.devicePixelRatio || 1;
			const qualityMultiplier = level / 10;
			renderer.setPixelRatio(Math.min(basePixelRatio, qualityMultiplier * 2));

			// Adjust shadow map size
			if (config.enableShadows) {
				// Shadow map size is set on individual lights, not the renderer
				// const shadowMapSizes = [256, 512, 1024, 1024, 2048, 2048, 4096, 4096, 4096, 4096];
				// Shadow map size should be configured on DirectionalLight.shadow.mapSize
			}

			// Adjust render target scale
			const canvas = renderer.domElement;
			const scale = Math.max(0.5, qualityMultiplier);
			renderer.setSize(canvas.clientWidth * scale, canvas.clientHeight * scale, false);
		},
		[config.enableShadows]
	);

	// Object pooling
	const createObjectPool = useCallback(<T extends THREE.Object3D>(poolName: string, factory: () => T, reset: (obj: T) => void, initialSize = 10) => {
		const pool: ObjectPool<T> = {
			available: [],
			inUse: new Set(),
			factory,
			reset,
		};

		// Pre-populate pool
		for (let i = 0; i < initialSize; i++) {
			pool.available.push(factory());
		}

		objectPoolsRef.current.set(poolName, pool);
	}, []);

	const getPooledObject = useCallback(<T extends THREE.Object3D>(poolName: string): T | null => {
		const pool = objectPoolsRef.current.get(poolName) as ObjectPool<T>;
		if (!pool) return null;

		let obj = pool.available.pop();
		if (!obj) {
			obj = pool.factory();
		}

		pool.inUse.add(obj);
		return obj;
	}, []);

	const returnPooledObject = useCallback(<T extends THREE.Object3D>(poolName: string, obj: T) => {
		const pool = objectPoolsRef.current.get(poolName) as ObjectPool<T>;
		if (!pool || !pool.inUse.has(obj)) return;

		pool.inUse.delete(obj);
		pool.reset(obj);
		pool.available.push(obj);
	}, []);

	// LOD management
	const addLODObject = useCallback((object: THREE.Object3D, distances: number[]): THREE.LOD => {
		const lod = new THREE.LOD();

		// Add the main object at closest distance
		lod.addLevel(object, distances[0] || 0);

		// Add simplified versions at further distances
		distances.slice(1).forEach((distance, index) => {
			// Create simplified version (this would need specific implementation per object type)
			const simplified = object.clone();
			// Reduce complexity based on distance
			const complexityReduction = (index + 1) * 0.3;
			// Apply simplification logic here

			lod.addLevel(simplified, distance);
		});

		lodObjectsRef.current.push(lod);
		return lod;
	}, []);

	const updateLOD = useCallback(
		(cameraPosition: THREE.Vector3) => {
			if (!settings.enableLOD) return;

			lodObjectsRef.current.forEach((lod) => {
				lod.update(cameraRef.current!);
			});
		},
		[settings.enableLOD]
	);

	// Scene optimization
	const optimizeScene = useCallback(() => {
		if (!sceneRef.current) return;

		const scene = sceneRef.current;

		// Remove objects outside frustum
		if (cameraRef.current) {
			const frustum = new THREE.Frustum();
			const matrix = new THREE.Matrix4().multiplyMatrices(cameraRef.current.projectionMatrix, cameraRef.current.matrixWorldInverse);
			frustum.setFromProjectionMatrix(matrix);

			scene.traverse((object) => {
				if (object.userData.canCull && !frustum.intersectsObject(object)) {
					object.visible = false;
				} else {
					object.visible = true;
				}
			});
		}

		// Limit total objects
		let objectCount = 0;
		scene.traverse(() => objectCount++);

		if (objectCount > settings.maxObjects) {
			// Remove least important objects
			const objects: THREE.Object3D[] = [];
			scene.traverse((obj) => {
				if (obj.userData.importance !== undefined) {
					objects.push(obj);
				}
			});

			objects.sort((a, b) => (a.userData.importance || 0) - (b.userData.importance || 0));
			const toRemove = objects.slice(0, objectCount - settings.maxObjects);
			toRemove.forEach((obj) => obj.removeFromParent());
		}
	}, [settings.maxObjects]);

	// Memory cleanup
	const cleanupUnusedObjects = useCallback(() => {
		if (!sceneRef.current) return;

		// Dispose of unused geometries and materials
		const geometries = new Set<THREE.BufferGeometry>();
		const materials = new Set<THREE.Material>();

		sceneRef.current.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				geometries.add(object.geometry);
				if (Array.isArray(object.material)) {
					object.material.forEach((mat) => materials.add(mat));
				} else {
					materials.add(object.material);
				}
			}
		});

		// Force garbage collection hint
		if (memoryUsage > settings.memoryLimit * 0.8) {
			// Aggressively clean up unused resources
			geometries.forEach((geo) => {
				if (geo.userData.unused) {
					geo.dispose();
				}
			});

			materials.forEach((mat) => {
				if (mat.userData.unused) {
					mat.dispose();
				}
			});
		}
	}, [memoryUsage, settings.memoryLimit]);

	// Initialize Three.js
	useEffect(() => {
		if (!canvas) return;

		// Create scene
		const scene = new THREE.Scene();
		sceneRef.current = scene;

		// Create camera
		const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
		cameraRef.current = camera;

		// Create renderer
		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: config.enableAntialiasing ?? true,
			powerPreference: "high-performance",
			stencil: false,
			depth: true,
		});

		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.setPixelRatio(config.pixelRatio ?? Math.min(window.devicePixelRatio, 2));

		if (config.enableShadows) {
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		}

		rendererRef.current = renderer;

		// Apply initial quality settings
		applyQualitySettings(qualityLevel);

		return () => {
			// Cleanup
			renderer.dispose();
			lodObjectsRef.current.forEach((lod) => {
				lod.levels.forEach((level) => {
					const mesh = level.object as any; // Cast to access geometry/material
					if (mesh.geometry) mesh.geometry.dispose();
					if (mesh.material) {
						if (Array.isArray(mesh.material)) {
							mesh.material.forEach((mat: any) => mat.dispose());
						} else {
							mesh.material.dispose();
						}
					}
				});
			});
		};
	}, [canvas, config, qualityLevel, applyQualitySettings]);

	// Apply quality changes
	useEffect(() => {
		applyQualitySettings(qualityLevel);
	}, [qualityLevel, applyQualitySettings]);

	// Create default object pools
	useEffect(() => {
		// Sphere pool
		createObjectPool(
			"sphere",
			() => new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshLambertMaterial()),
			(mesh) => {
				mesh.position.set(0, 0, 0);
				mesh.rotation.set(0, 0, 0);
				mesh.scale.set(1, 1, 1);
				mesh.visible = true;
			}
		);

		// Box pool
		createObjectPool(
			"box",
			() => new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial()),
			(mesh) => {
				mesh.position.set(0, 0, 0);
				mesh.rotation.set(0, 0, 0);
				mesh.scale.set(1, 1, 1);
				mesh.visible = true;
			}
		);
	}, [createObjectPool]);

	if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
		return null;
	}

	return {
		scene: sceneRef.current,
		camera: cameraRef.current,
		renderer: rendererRef.current,
		frameTime: frameTimeRef.current,
		fps: fpsRef.current,
		memoryUsage,
		performanceScore,
		qualityLevel,
		setQualityLevel,
		optimizeScene,
		cleanupUnusedObjects,
		getPooledObject,
		returnPooledObject,
		addLODObject,
		updateLOD,
	};
}

export default useOptimizedThreeJS;
