import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Renderer {
	private scene!: THREE.Scene;
	public camera!: THREE.Camera;
	private renderer!: THREE.WebGLRenderer;
	private controls!: OrbitControls;
	private orthoControls!: OrbitControls;
	public perspectiveCamera!: THREE.PerspectiveCamera;
	public orthoCamera!: THREE.OrthographicCamera;
	private canvas: HTMLCanvasElement;

	constructor(canvas?: HTMLCanvasElement) {
		// Use provided canvas or create one
		this.canvas = canvas || this.createCanvas();
		// Defer heavy initialization to initialize() method
	}

	public async initialize(): Promise<void> {
		this.scene = new THREE.Scene();
		this.perspectiveCamera = new THREE.PerspectiveCamera(75, this.getCanvasAspect(), 0.1, 2000);
		this.orthoCamera = new THREE.OrthographicCamera(this.getCanvasWidth() / -2, this.getCanvasWidth() / 2, this.getCanvasHeight() / 2, this.getCanvasHeight() / -2, 1, 1000);
		this.camera = this.perspectiveCamera;

		// Create renderer with the canvas
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			alpha: true,
		});

		this.updateRendererSize();

		this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
		this.perspectiveCamera.position.set(0, 5, 10);

		this.orthoControls = new OrbitControls(this.orthoCamera, this.canvas);
		this.orthoControls.enableRotate = false; // Disable rotation for galaxy view
		this.orthoCamera.position.set(0, 0, 100);
		this.orthoCamera.lookAt(0, 0, 0);

		this.controls.update();
		this.orthoControls.update();

		window.addEventListener("resize", this.onWindowResize.bind(this), false);

		console.log(`🎨 Renderer initialized with canvas: ${this.getCanvasWidth()}x${this.getCanvasHeight()}`);
	}

	private createCanvas(): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.id = "game-canvas";

		// Get actual viewport dimensions
		const width = window.innerWidth;
		const height = window.innerHeight;

		// Set canvas internal resolution to match viewport
		canvas.width = width;
		canvas.height = height;

		canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 1;
			background: #0a0a0a;
			display: block;
		`;

		document.body.appendChild(canvas);
		console.log(`🎨 [RENDERER] Canvas created: ${width}×${height} (matches viewport)`);
		return canvas;
	}

	private resizeCanvasToClient(canvas: HTMLCanvasElement): void {
		const displayWidth = canvas.clientWidth;
		const displayHeight = canvas.clientHeight;

		// Set the canvas buffer size to match the display size
		canvas.width = displayWidth;
		canvas.height = displayHeight;

		console.log(`🎨 [RENDERER] Canvas resized to client dimensions: ${displayWidth}×${displayHeight}`);
	}

	public updateRendererSize(): void {
		const canvas = this.canvas;
		this.resizeCanvasToClient(canvas);

		const displayWidth = canvas.width;
		const displayHeight = canvas.height;

		// Update renderer size with the exact canvas dimensions
		this.renderer.setSize(displayWidth, displayHeight, false);

		// Update camera aspect ratio
		if (this.perspectiveCamera) {
			this.perspectiveCamera.aspect = displayWidth / displayHeight;
			this.perspectiveCamera.updateProjectionMatrix();
		}

		console.log(`🎨 Renderer size updated to match viewport: ${displayWidth}×${displayHeight}`);
	}

	/**
	 * Render method that accepts custom scene and camera
	 * This is what the main application calls
	 */
	public render(scene: THREE.Scene, camera: THREE.Camera): void {
		// Update controls based on active camera
		if (camera === this.perspectiveCamera) {
			this.controls.update();
		} else if (camera === this.orthoCamera) {
			this.orthoControls.update();
		}

		// Render the provided scene with the provided camera
		this.renderer.render(scene, camera);
	}

	public setActiveSceneAndCamera(scene: THREE.Scene, camera: THREE.Camera): void {
		this.scene = scene;
		this.camera = camera;
	}

	public getWebGLRenderer(): THREE.WebGLRenderer {
		return this.renderer;
	}

	public getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}

	public getCanvasWidth(): number {
		return this.canvas.width;
	}

	public getCanvasHeight(): number {
		return this.canvas.height;
	}

	public getCanvasAspect(): number {
		return this.canvas.width / this.canvas.height;
	}

	private onWindowResize(): void {
		const width = this.getCanvasWidth();
		const height = this.getCanvasHeight();

		this.perspectiveCamera.aspect = width / height;
		this.perspectiveCamera.updateProjectionMatrix();

		this.orthoCamera.left = width / -2;
		this.orthoCamera.right = width / 2;
		this.orthoCamera.top = height / 2;
		this.orthoCamera.bottom = height / -2;
		this.orthoCamera.updateProjectionMatrix();

		this.updateRendererSize();
	}

	public getScene(): THREE.Scene {
		return this.scene;
	}

	public getCamera(): THREE.Camera {
		return this.camera;
	}

	public async restart(): Promise<void> {
		console.log("🎨 [RENDERER:DEBUG] Restarting renderer...");

		try {
			// Dispose current resources
			this.dispose();

			// Reinitialize
			await this.initialize();

			console.log("🎨 [RENDERER:DEBUG] Renderer restarted successfully");
		} catch (error) {
			console.error("🎨 [RENDERER:ERROR] Failed to restart renderer:", error);
			throw error;
		}
	}

	public dispose(): void {
		this.controls?.dispose();
		this.orthoControls?.dispose();
		this.renderer?.dispose();
		window.removeEventListener("resize", this.onWindowResize.bind(this));
	}
}
