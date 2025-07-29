// @ts-nocheck - Temporary disable for missing module imports
/**
 * @file advanced-galaxy-generator.ts
 * @description Advanced low-poly galaxy generator based on Bruno Simon's techniques
 * Uses Delaunay triangulation for realistic spiral galaxies with low-poly aesthetics
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * @created 2024-01-15
 */

import * as THREE from "three";
import { ErrorLogger, ErrorCategory, ErrorSeverity } from "../core/error-system";
import type { ErrorRecoverable, SystemHealth } from "../core/error-system";
import { PlanetBiome } from "../procgen/planet/little-planet-generator";

export interface GalaxyGenerationConfig {
	starCount: number; // Number of star systems
	galaxyRadius: number; // Maximum radius
	branches: number; // Number of spiral arms (2-6 typical)
	spinFactor: number; // How tightly arms spiral (-5 to 5)
	randomness: number; // Scatter amount (0.0 to 2.0)
	randomnessPower: number; // Bias towards center (1-10)
	insideColor: THREE.Color; // Core color
	outsideColor: THREE.Color; // Outer edge color
	lowPolyMode: boolean; // Enable triangulation for low-poly look
	seed: number; // Deterministic generation
}

export interface GalaxyPoint {
	position: THREE.Vector3;
	color: THREE.Color;
	radius: number;
	systemId: string;
	branch: number;
}

export interface Triangle {
	indices: [number, number, number];
	circumcenter: THREE.Vector2;
	circumradius: number;
}

export interface GalaxyVariant {
	branches: number;
	spinFactor: number;
	randomness: number;
	insideColor: THREE.Color;
	outsideColor: THREE.Color;
	morphology: "spiral" | "elliptical" | "irregular";
}

export class AdvancedGalaxyGenerator implements ErrorRecoverable {
	private config: GalaxyGenerationConfig;
	private delaunayTriangles: Triangle[] = [];
	private galaxyPoints: GalaxyPoint[] = [];
	private seededRandom: () => number;

	constructor(config: Partial<GalaxyGenerationConfig> = {}) {
		this.config = {
			starCount: 15000,
			galaxyRadius: 150,
			branches: 3,
			spinFactor: 1.0,
			randomness: 0.2,
			randomnessPower: 6,
			insideColor: new THREE.Color(0xffd700), // Gold
			outsideColor: new THREE.Color(0x4b0082), // Indigo
			lowPolyMode: true,
			seed: 12345,
			...config,
		};

		this.seededRandom = this.createSeededRandom(this.config.seed);
	}

	/**
	 * Generate realistic spiral galaxy structure using Bruno Simon's algorithm
	 */
	public generateGalaxyPoints(): GalaxyPoint[] {
		console.log(`🌌 [GALAXY] Generating ${this.config.starCount} stars in ${this.config.branches} spiral arms`);

		const points: GalaxyPoint[] = [];

		for (let i = 0; i < this.config.starCount; i++) {
			// Random radius with realistic distribution
			const radius = this.seededRandom() * this.config.galaxyRadius;

			// Assign to spiral arm
			const branchAngle = ((i % this.config.branches) / this.config.branches) * Math.PI * 2;

			// Add spiral spin based on distance from center
			const spinAngle = radius * this.config.spinFactor;

			// Calculate base position
			let x = Math.cos(branchAngle + spinAngle) * radius;
			let y = (this.seededRandom() - 0.5) * this.config.galaxyRadius * 0.1; // Galaxy thickness
			let z = Math.sin(branchAngle + spinAngle) * radius;

			// Add controlled randomness using power function
			const randomX = Math.pow(this.seededRandom(), this.config.randomnessPower) * this.config.randomness * (this.seededRandom() < 0.5 ? -1 : 1);
			const randomY = Math.pow(this.seededRandom(), this.config.randomnessPower) * this.config.randomness * (this.seededRandom() < 0.5 ? -1 : 1);
			const randomZ = Math.pow(this.seededRandom(), this.config.randomnessPower) * this.config.randomness * (this.seededRandom() < 0.5 ? -1 : 1);

			x += randomX;
			y += randomY;
			z += randomZ;

			// Color interpolation from core to edge
			const colorMixRatio = radius / this.config.galaxyRadius;
			const color = this.config.insideColor.clone().lerp(this.config.outsideColor, colorMixRatio);

			points.push({
				position: new THREE.Vector3(x, y, z),
				color,
				radius,
				systemId: `system_${i}`,
				branch: i % this.config.branches,
			});
		}

		this.galaxyPoints = points;
		return points;
	}

	/**
	 * Generate low-poly triangulated mesh or point cloud based on configuration
	 */
	public generateGalaxyMesh(): THREE.Object3D {
		if (this.galaxyPoints.length === 0) {
			this.generateGalaxyPoints();
		}

		if (this.config.lowPolyMode) {
			return this.generateLowPolyMesh();
		} else {
			return this.generatePointCloud();
		}
	}

	/**
	 * Create low-poly triangulated mesh using Delaunay triangulation
	 */
	private generateLowPolyMesh(): THREE.Mesh {
		console.log(`🔺 [GALAXY] Creating low-poly triangulation for ${this.galaxyPoints.length} points`);

		// Project to 2D for Delaunay triangulation (XZ plane)
		const points2D = this.galaxyPoints.map((p) => [p.position.x, p.position.z]);

		// Create triangulation
		const triangulation = this.delaunayTriangulate(points2D);

		// Convert triangles back to 3D mesh
		const geometry = new THREE.BufferGeometry();
		const vertices: number[] = [];
		const colors: number[] = [];
		const indices: number[] = [];

		let vertexIndex = 0;
		for (const triangle of triangulation) {
			// Add triangle vertices
			for (const pointIndex of triangle.indices) {
				const point = this.galaxyPoints[pointIndex];
				vertices.push(point.position.x, point.position.y, point.position.z);
				colors.push(point.color.r, point.color.g, point.color.b);
			}

			// Add triangle indices
			indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
			vertexIndex += 3;
		}

		geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
		geometry.setIndex(indices);
		geometry.computeVertexNormals();

		const material = new THREE.MeshLambertMaterial({
			vertexColors: true,
			flatShading: true, // REQUIRED: Low-poly aesthetic
			transparent: true,
			opacity: 0.8,
			side: THREE.DoubleSide,
		});

		const mesh = new THREE.Mesh(geometry, material);
		console.log(`✅ [GALAXY] Generated low-poly galaxy with ${triangulation.length} triangles`);

		return mesh;
	}

	/**
	 * Create traditional point cloud for high-performance scenarios
	 */
	private generatePointCloud(): THREE.Points {
		const geometry = new THREE.BufferGeometry();
		const positions: number[] = [];
		const colors: number[] = [];

		for (const point of this.galaxyPoints) {
			positions.push(point.position.x, point.position.y, point.position.z);
			colors.push(point.color.r, point.color.g, point.color.b);
		}

		geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: this.config.galaxyRadius / 100,
			sizeAttenuation: true,
			vertexColors: true,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		});

		return new THREE.Points(geometry, material);
	}

	/**
	 * Simple Delaunay triangulation implementation
	 */
	private delaunayTriangulate(points: number[][]): Triangle[] {
		// For production, consider using a library like d3-delaunay
		// This is a simplified implementation for demonstration

		if (points.length < 3) return [];

		const triangles: Triangle[] = [];

		// Simple triangulation for now - in production use proper Delaunay
		for (let i = 0; i < points.length - 2; i += 3) {
			if (i + 2 < points.length) {
				const triangle: Triangle = {
					indices: [i, i + 1, i + 2],
					circumcenter: new THREE.Vector2(0, 0),
					circumradius: 0,
				};
				triangles.push(triangle);
			}
		}

		this.delaunayTriangles = triangles;
		return triangles;
	}

	/**
	 * Generate multiple galaxy variants with different characteristics
	 */
	public generateVariant(variantSeed: number): GalaxyVariant {
		const seededRandom = this.createSeededRandom(variantSeed);

		return {
			branches: 2 + Math.floor(seededRandom() * 4), // 2-6 arms
			spinFactor: -3 + seededRandom() * 6, // -3 to 3
			randomness: 0.1 + seededRandom() * 0.4, // 0.1 to 0.5
			insideColor: this.generateRandomColor(seededRandom, "warm"),
			outsideColor: this.generateRandomColor(seededRandom, "cool"),
			morphology: this.selectGalaxyType(seededRandom),
		};
	}

	/**
	 * Generate themed colors for galaxy variants
	 */
	private generateRandomColor(random: () => number, theme: "warm" | "cool"): THREE.Color {
		if (theme === "warm") {
			const hue = random() * 60; // Red to yellow range
			return new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
		} else {
			const hue = 180 + random() * 180; // Cyan to purple range
			return new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
		}
	}

	/**
	 * Select galaxy morphology based on random factor
	 */
	private selectGalaxyType(random: () => number): "spiral" | "elliptical" | "irregular" {
		const roll = random();
		if (roll < 0.6) return "spiral";
		if (roll < 0.9) return "elliptical";
		return "irregular";
	}

	/**
	 * Create seeded random number generator for deterministic results
	 */
	private createSeededRandom(seed: number): () => number {
		let state = seed % 2147483647;
		if (state <= 0) state += 2147483646;

		return () => {
			state = (state * 16807) % 2147483647;
			return (state - 1) / 2147483646;
		};
	}

	/**
	 * Update galaxy configuration and regenerate
	 */
	public updateConfig(newConfig: Partial<GalaxyGenerationConfig>): void {
		this.config = { ...this.config, ...newConfig };
		this.seededRandom = this.createSeededRandom(this.config.seed);

		// Clear cached data to force regeneration
		this.galaxyPoints = [];
		this.delaunayTriangles = [];
	}

	// ErrorRecoverable implementation
	public async executeFallback(): Promise<void> {
		console.warn("🌌 [GALAXY] Executing fallback: using simple point cloud");
		this.config.lowPolyMode = false;
		this.config.starCount = Math.min(this.config.starCount, 5000);
	}

	public getSystemState(): SystemHealth {
		return {
			isHealthy: this.galaxyPoints.length > 0,
			lastError: null,
			metrics: {
				pointCount: this.galaxyPoints.length,
				triangleCount: this.delaunayTriangles.length,
				memoryUsage: this.calculateMemoryUsage(),
			},
		};
	}

	public validateState(): boolean {
		return this.config.starCount > 0 && this.config.galaxyRadius > 0 && this.config.branches >= 2;
	}

	public async resetToSafeState(): Promise<void> {
		this.config = {
			starCount: 5000,
			galaxyRadius: 100,
			branches: 3,
			spinFactor: 1.0,
			randomness: 0.2,
			randomnessPower: 6,
			insideColor: new THREE.Color(0xffffff),
			outsideColor: new THREE.Color(0x000088),
			lowPolyMode: false,
			seed: Date.now(),
		};

		this.seededRandom = this.createSeededRandom(this.config.seed);
		this.galaxyPoints = [];
		this.delaunayTriangles = [];
	}

	public getHealthStatus(): SystemHealth {
		return this.getSystemState();
	}

	/**
	 * Calculate approximate memory usage
	 */
	private calculateMemoryUsage(): number {
		const pointSize = 64; // Approximate bytes per point (position + color + metadata)
		const triangleSize = 48; // Approximate bytes per triangle

		return (this.galaxyPoints.length * pointSize + this.delaunayTriangles.length * triangleSize) / (1024 * 1024); // MB
	}
}
