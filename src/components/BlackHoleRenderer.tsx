"use client";

import React, { useRef, useEffect, useState } from "react";

interface BlackHoleConfig {
	mass: number; // Solar masses
	spin: number; // 0-1 (Kerr parameter)
	inclination: number; // Degrees
	diskInnerRadius: number; // Schwarzschild radii
	diskOuterRadius: number; // Schwarzschild radii
	temperature: number; // Kelvin
	accretionRate: number; // 0-1
	magneticField: number; // Tesla
	coronaTemperature: number; // Kelvin
	jetPower: number; // 0-1
	viewingDistance: number; // Schwarzschild radii
	type: "stellar" | "intermediate" | "supermassive";
	lensingStrength: number; // 0-1
	volumetricDensity: number; // 0-1
	plasmaDensity: number; // 0-1
	synchrotronEmission: number; // 0-1
	relativisticBeaming: number; // 0-1
}

interface BlackHoleRendererProps {
	onGenerate?: () => void;
	onClear?: () => void;
	config?: Partial<BlackHoleConfig>;
}

export default function BlackHoleRenderer({ onGenerate, onClear, config = {} }: BlackHoleRendererProps) {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<any>(null);
	const rendererRef = useRef<any>(null);
	const cameraRef = useRef<any>(null);
	const blackHoleGroupRef = useRef<any>(null);
	const animationIdRef = useRef<number | null>(null);

	const [scene, setScene] = useState<any>(null);
	const [camera, setCamera] = useState<any>(null);
	const [renderer, setRenderer] = useState<any>(null);
	const [currentBlackHole, setCurrentBlackHole] = useState<any>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Ultra-enhanced configuration based on advanced reference
	const defaultConfig: BlackHoleConfig = {
		mass: 10,
		spin: 0.95,
		inclination: 35,
		diskInnerRadius: 1.5,
		diskOuterRadius: 20,
		temperature: 80000,
		accretionRate: 0.85,
		magneticField: 2000000,
		coronaTemperature: 150000000,
		jetPower: 0.8,
		viewingDistance: 150,
		type: "supermassive",
		lensingStrength: 1.2,
		volumetricDensity: 0.7,
		plasmaDensity: 0.9,
		synchrotronEmission: 0.95,
		relativisticBeaming: 0.8,
		...config,
	};

	// Precise Schwarzschild radius calculation
	const calculateSchwarzschildRadius = (mass: number): number => {
		return mass * 3.0; // Simplified for visualization
	};

	// Enhanced blackbody radiation with relativistic corrections
	const blackBodyColor = (temperature: number): [number, number, number] => {
		const t = Math.max(temperature, 1000) / 10000;

		let r, g, b;

		if (t < 0.5) {
			r = 1.0;
			g = Math.pow(t * 2.0, 0.6);
			b = Math.pow(t * 2.0, 2.0);
		} else if (t < 0.8) {
			r = 1.0;
			g = 0.8 + (0.2 * (t - 0.5)) / 0.3;
			b = 0.6 + (0.4 * (t - 0.5)) / 0.3;
		} else {
			r = 1.0 - (0.2 * (t - 0.8)) / 0.2;
			g = 0.95 + (0.05 * (t - 0.8)) / 0.2;
			b = 1.0;
		}

		// Relativistic blue-shifting for extreme temperatures
		if (temperature > 200000) {
			const boost = Math.min(temperature / 2000000, 1.0);
			b = Math.min(1.0, b + boost * 0.4);
			r = Math.max(0.4, r - boost * 0.3);
		}

		return [r, g, b];
	};

	// Ultra-advanced gravitational lensing with Kerr spacetime
	const createAdvancedLensingShader = (config: BlackHoleConfig) => {
		return {
			vertexShader: `
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vWorldPosition;
				varying vec3 vViewDirection;
				
				void main() {
					vUv = uv;
					vPosition = position;
					vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
					vViewDirection = normalize(vWorldPosition - cameraPosition);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float time;
				uniform vec3 blackHolePosition;
				uniform float schwarzschildRadius;
				uniform float lensingStrength;
				uniform float mass;
				uniform float spin;
				uniform sampler2D backgroundTexture;
				uniform vec2 resolution;
				uniform vec3 cameraPosition;
				
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vWorldPosition;
				varying vec3 vViewDirection;
				
				#define PI 3.14159265359
				#define MAX_STEPS 48
				#define STEP_SIZE 0.15
				
				// Kerr metric components for spinning black hole
				float kerrMetric(vec3 pos, float a) {
					float r = length(pos);
					float theta = acos(clamp(pos.y / r, -1.0, 1.0));
					float rho2 = r * r + a * a * cos(theta) * cos(theta);
					float delta = r * r - 2.0 * r + a * a;
					return max(rho2 / delta, 0.1);
				}
				
				// Advanced photon geodesic integration
				vec3 integrateGeodesic(vec3 position, vec3 direction, float rs, float spin) {
					vec3 pos = position;
					vec3 dir = normalize(direction);
					float dt = STEP_SIZE;
					
					for (int i = 0; i < MAX_STEPS; i++) {
						float r = length(pos);
						if (r < rs) break; // Event horizon crossing
						
						// Kerr parameter
						float a = spin * rs * 0.5;
						
						// Metric coefficients
						float theta = acos(clamp(pos.y / r, -1.0, 1.0));
						float rho2 = r * r + a * a * cos(theta) * cos(theta);
						float delta = r * r - 2.0 * r + a * a;
						
						// Gravitational acceleration (Einstein field equations)
						vec3 radialForce = -1.5 * rs * rs * normalize(pos) / (r * r * r);
						
						// Frame dragging (Lense-Thirring effect)
						vec3 frameDragging = cross(normalize(pos), vec3(0, 1, 0)) * (a * rs) / (r * r * r);
						
						// Tidal forces
						vec3 tidalForce = -0.1 * rs * pos / (r * r);
						
						// Combined acceleration
						vec3 acceleration = radialForce + frameDragging * 0.2 + tidalForce;
						
						// Geodesic integration
						dir += acceleration * dt;
						pos += normalize(dir) * dt * 0.8;
						
						// Escape condition
						if (r > 200.0 * rs) break;
					}
					
					return pos;
				}
				
				// Multi-scale gravitational lensing
				vec2 gravitationalLensing(vec2 uv, vec3 bhPos, float rs, float strength, float spin) {
					vec3 rayOrigin = cameraPosition;
					vec3 rayDir = normalize(vWorldPosition - rayOrigin);
					
					// Impact parameter calculation
					vec3 toBH = bhPos - rayOrigin;
					float b = length(cross(rayDir, normalize(toBH)));
					float distance = length(toBH);
					
					// Einstein deflection with Kerr corrections
					float basicDeflection = 4.0 * rs / max(b, rs * 0.1);
					float kerrCorrection = 1.0 + spin * spin * 0.3;
					float deflection = basicDeflection * kerrCorrection * strength;
					
					// Critical radius for multiple imaging
					float criticalRadius = sqrt(27.0) * rs * 0.5;
					float primaryImageStrength = 1.0;
					float secondaryImageStrength = 0.0;
					
					if (b < criticalRadius) {
						primaryImageStrength = 1.5;
						secondaryImageStrength = 0.8 * exp(-(b - rs) * 2.0);
					}
					
					// Primary lensed image
					vec3 toCenter = normalize(bhPos - vWorldPosition);
					vec2 primaryOffset = toCenter.xy * deflection * 0.08 * primaryImageStrength;
					
					// Secondary image (Einstein ring)
					float ringRadius = 2.6 * rs / distance;
					vec2 ringCenter = vec2(0.5);
					vec2 toRing = normalize(uv - ringCenter);
					vec2 secondaryOffset = toRing * ringRadius * secondaryImageStrength * 0.3;
					
					// Apply total lensing
					vec2 lensedUV = uv + primaryOffset + secondaryOffset;
					
					// Photon sphere enhancement
					float distFromCenter = length(uv - 0.5);
					float photonSphere = smoothstep(0.24, 0.26, distFromCenter) * 
									   smoothstep(0.28, 0.26, distFromCenter);
					if (photonSphere > 0.1) {
						lensedUV += toCenter.xy * 0.15 * photonSphere;
					}
					
					// Wrap coordinates
					lensedUV = fract(lensedUV + 1.0);
					
					return lensedUV;
				}
				
				// Relativistic effects on light
				vec3 relativisticEffects(vec3 color, vec3 position, float rs, float spin) {
					float r = length(position);
					
					// Gravitational redshift (time dilation)
					float redshift = sqrt(max(1.0 - rs / r, 0.1));
					
					// Relativistic Doppler effect
					float phi = atan(position.z, position.x);
					float rotationalVel = spin * rs / (r * r) * 0.5;
					float dopplerFactor = 1.0 + rotationalVel * cos(phi + time * 0.1);
					
					// Apply frequency shifts
					vec3 shiftedColor = color;
					shiftedColor.r *= redshift * dopplerFactor;
					shiftedColor.g *= pow(redshift, 0.7) * sqrt(dopplerFactor);
					shiftedColor.b *= pow(redshift, 0.4) * pow(dopplerFactor, 0.3);
					
					// Intensity boosting from gravitational focusing
					float focusingBoost = 1.0 + 0.5 / (1.0 + pow(r / rs - 1.0, 2.0));
					shiftedColor *= focusingBoost;
					
					return shiftedColor;
				}
				
				void main() {
					vec2 lensedUV = gravitationalLensing(vUv, blackHolePosition, schwarzschildRadius, lensingStrength, spin);
					
					// Sample background with enhanced lensing
					vec3 lensedColor = texture2D(backgroundTexture, lensedUV).rgb;
					
					// Apply full relativistic effects
					lensedColor = relativisticEffects(lensedColor, vWorldPosition, schwarzschildRadius, spin);
					
					// Enhanced Einstein ring system
					float distanceFromCenter = length(vUv - 0.5) * 2.0;
					
					// Primary Einstein ring
					float primaryRing = smoothstep(0.46, 0.50, distanceFromCenter) * 
									   smoothstep(0.54, 0.50, distanceFromCenter);
					lensedColor += primaryRing * vec3(1.0, 0.95, 0.85) * 1.5;
					
					// Secondary Einstein ring
					float secondaryRing = smoothstep(0.72, 0.75, distanceFromCenter) * 
										 smoothstep(0.78, 0.75, distanceFromCenter);
					lensedColor += secondaryRing * vec3(0.9, 0.95, 1.0) * 0.8;
					
					// Photon sphere critical curve
					float photonRing = smoothstep(0.74, 0.76, distanceFromCenter) * 
									  smoothstep(0.78, 0.76, distanceFromCenter);
					lensedColor += photonRing * vec3(1.0, 0.9, 0.8) * 2.0;
					
					// Caustic light patterns
					vec2 causticCoord = lensedUV * 25.0 + time * 0.15;
					float caustic = abs(sin(causticCoord.x) * sin(causticCoord.y)) * 0.15;
					lensedColor += caustic * vec3(0.8, 0.9, 1.0);
					
					// Interference patterns from multiple paths
					float interference = sin(distanceFromCenter * 40.0 + time * 5.0) * 0.05;
					lensedColor += interference * vec3(1.0, 1.0, 0.9);
					
					gl_FragColor = vec4(lensedColor, 1.0);
				}
			`,
		};
	};

	// Volumetric accretion disk with plasma physics
	const createVolumetricDiskShader = (config: BlackHoleConfig) => {
		const rs = calculateSchwarzschildRadius(config.mass);
		const [r, g, b] = blackBodyColor(config.temperature);

		return {
			vertexShader: `
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vNormal;
				varying vec3 vWorldPosition;
				varying float vRadius;
				varying float vHeight;
				varying float vDistanceToCamera;
				
				void main() {
					vUv = uv;
					vPosition = position;
					vNormal = normal;
					vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
					vRadius = length(position.xz);
					vHeight = position.y;
					vDistanceToCamera = distance(cameraPosition, vWorldPosition);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float time;
				uniform float innerRadius;
				uniform float outerRadius;
				uniform float temperature;
				uniform float accretionRate;
				uniform float spin;
				uniform float inclination;
				uniform vec3 baseColor;
				uniform float magneticField;
				uniform float coronaTemp;
				uniform float volumetricDensity;
				uniform float plasmaDensity;
				uniform float synchrotronEmission;
				uniform float relativisticBeaming;
				uniform vec3 cameraPosition;
				
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vNormal;
				varying vec3 vWorldPosition;
				varying float vRadius;
				varying float vHeight;
				varying float vDistanceToCamera;
				
				#define PI 3.14159265359
				
				// Ultra-advanced 3D noise for plasma turbulence
				vec3 hash3(vec3 p) {
					p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
							dot(p, vec3(269.5, 183.3, 246.1)),
							dot(p, vec3(113.5, 271.9, 124.6)));
					return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
				}
				
				float noise3D(vec3 p) {
					vec3 i = floor(p);
					vec3 f = fract(p);
					vec3 u = f * f * (3.0 - 2.0 * f);
					
					float a = dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0));
					float b = dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0));
					float c = dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0));
					float d = dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0));
					float e = dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1));
					float f_val = dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1));
					float g = dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1));
					float h = dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1));
					
					float k0 = mix(a, b, u.x);
					float k1 = mix(c, d, u.x);
					float k2 = mix(e, f_val, u.x);
					float k3 = mix(g, h, u.x);
					
					float x1 = mix(k0, k1, u.y);
					float x2 = mix(k2, k3, u.y);
					
					return mix(x1, x2, u.z);
				}
				
				// Magnetohydrodynamic turbulence cascade
				float mhdTurbulence(vec3 pos, float time) {
					float turbulence = 0.0;
					float amplitude = 1.0;
					float frequency = 1.0;
					
					// Kolmogorov-like turbulence cascade
					for (int i = 0; i < 8; i++) {
						vec3 p = pos * frequency + vec3(time * 0.4, time * 0.6, time * 0.3);
						turbulence += amplitude * abs(noise3D(p));
						amplitude *= 0.5;
						frequency *= 2.3;
					}
					
					// Magnetorotational instability
					float mri = sin(pos.x * 12.0 + time * 3.0) * sin(pos.z * 12.0 + time * 2.5);
					turbulence += abs(mri) * 0.4;
					
					// Kelvin-Helmholtz instability
					float kh = sin((pos.x + pos.z) * 8.0 + time * 4.0) * 0.3;
					turbulence += abs(kh) * 0.2;
					
					return turbulence;
				}
				
				// Relativistic Keplerian velocity with ISCO
				float kerrVelocity(float radius, float spin, float mass) {
					float rs = 2.0 * mass;
					float a = spin * rs * 0.5;
					
					// ISCO for Kerr metric
					float z1 = 1.0 + pow(1.0 - spin * spin, 1.0/3.0) * 
							  (pow(1.0 + spin, 1.0/3.0) + pow(1.0 - spin, 1.0/3.0));
					float z2 = sqrt(3.0 * spin * spin + z1 * z1);
					float isco = rs * (3.0 + z2 - sqrt((3.0 - z1) * (3.0 + z1 + 2.0 * z2)));
					
					if (radius < isco) radius = isco;
					
					// Relativistic Keplerian frequency
					float omega = 1.0 / (pow(radius, 1.5) + a);
					return omega * radius * 0.3; // Scale for visualization
				}
				
				// Synchrotron radiation spectrum
				vec3 synchrotronSpectrum(float B, float ne, float gamma) {
					float nu_c = 1.6e-19 * B * gamma * gamma; // Critical frequency
					
					// Simplified synchrotron spectrum
					vec3 spectrum = vec3(1.0);
					if (nu_c < 0.3) {
						spectrum = vec3(1.0, 0.4, 0.1); // Radio
					} else if (nu_c < 0.7) {
						spectrum = vec3(1.0, 0.7, 0.5); // Optical
					} else {
						spectrum = vec3(0.7, 0.8, 1.0); // X-ray
					}
					
					float intensity = B * B * ne * gamma;
					return spectrum * intensity;
				}
				
				// Relativistic beaming and boosting
				float relativisticBeaming(vec3 velocity, vec3 viewDir, float gamma) {
					float beta = length(velocity);
					float cosTheta = dot(normalize(velocity), viewDir);
					
					// Doppler factor for relativistic beaming
					float doppler = 1.0 / (gamma * (1.0 - beta * cosTheta));
					
					// Intensity enhancement I ∝ δ^3
					return pow(max(doppler, 0.1), 3.0);
				}
				
				void main() {
					if (vRadius < innerRadius || vRadius > outerRadius) discard;
					
					// Coordinate system and motion
					float angle = atan(vPosition.z, vPosition.x);
					vec3 diskCoord = vec3(vRadius, angle + time * 0.7, vHeight * 5.0);
					
					// Advanced turbulence field
					float turbulence = mhdTurbulence(diskCoord * 0.2, time * 1.5);
					
					// Enhanced temperature profile
					float localTemp = temperature * pow(vRadius / innerRadius, -0.75);
					localTemp *= (1.0 - sqrt(innerRadius / vRadius)); // Zero at ISCO
					localTemp *= (0.6 + turbulence * 0.8);
					
					// Relativistic orbital velocity
					float orbitalVel = kerrVelocity(vRadius, spin, 1.0);
					
					// Enhanced magnetic field with flux conservation
					float localMagField = magneticField * pow(vRadius / innerRadius, -1.25);
					localMagField *= (1.0 + turbulence * 0.5);
					
					// Plasma density with hydrostatic equilibrium
					float localDensity = plasmaDensity * pow(vRadius / innerRadius, -1.5);
					localDensity *= exp(-abs(vHeight) * 3.0); // Vertical structure
					localDensity *= (0.8 + turbulence * 0.4);
					
					// Relativistic gamma factor for electrons
					float gamma = 1.0 + localTemp / 1000.0 + localMagField * 0.001;
					
					// Synchrotron emission
					vec3 synchrotron = synchrotronSpectrum(localMagField, localDensity, gamma);
					synchrotron *= synchrotronEmission;
					
					// Thermal emission temperature mapping
					vec3 thermalColor = baseColor;
					float tempRatio = localTemp / temperature;
					if (tempRatio > 1.5) {
						thermalColor = vec3(1.0, 0.98, 0.95); // Ultra-hot white-blue
					} else if (tempRatio > 1.0) {
						thermalColor = vec3(1.0, 0.92, 0.85); // Hot white
					} else if (tempRatio > 0.7) {
						thermalColor = vec3(1.0, 0.85, 0.7); // Warm white
					} else if (tempRatio > 0.4) {
						thermalColor = vec3(1.0, 0.75, 0.55); // Yellow
					} else {
						thermalColor = vec3(1.0, 0.6, 0.3); // Orange-red
					}
					
					// Combine emission mechanisms
					vec3 totalEmission = mix(thermalColor, synchrotron, 0.4);
					
					// Magnetic field visualization
					float magneticPattern = sin(angle * 16.0 + time * 4.0 + vRadius * 3.0);
					magneticPattern *= sin(vHeight * 20.0 + time * 2.0);
					totalEmission += vec3(0.2, 0.5, 0.9) * abs(magneticPattern) * 0.25;
					
					// Corona heating and X-ray emission
					float coronaEffect = exp(-abs(vHeight) * 4.0) * (coronaTemp / temperature);
					totalEmission += vec3(0.9, 0.95, 1.0) * coronaEffect * 0.4;
					
					// Surface intensity with realistic brightness
					float intensity = pow(localTemp / temperature, 1.2) * (0.4 + turbulence * 0.6);
					intensity *= localDensity * 2.0;
					intensity *= smoothstep(innerRadius, innerRadius * 1.15, vRadius);
					intensity *= smoothstep(outerRadius, outerRadius * 0.85, vRadius);
					
					// Relativistic beaming effects
					vec3 velocity = vec3(-vPosition.z, 0.0, vPosition.x) * orbitalVel;
					float beaming = relativisticBeaming(velocity, normalize(cameraPosition - vWorldPosition), gamma);
					intensity *= (1.0 + relativisticBeaming * (beaming - 1.0) * 0.3);
					
					// Doppler shift
					float dopplerShift = 1.0 + orbitalVel * cos(angle + time * 0.5) * 0.15;
					totalEmission.r *= dopplerShift;
					totalEmission.g *= sqrt(dopplerShift);
					
					// Enhanced scintillation with multiple frequencies
					float scint1 = sin(time * 25.0 + vRadius * 20.0 + angle * 12.0);
					float scint2 = sin(time * 18.0 + vRadius * 15.0 + angle * 8.0);
					float scintillation = 1.0 + (scint1 + scint2) * 0.08;
					intensity *= scintillation;
					
					// Final color composition
					vec3 finalColor = totalEmission * intensity;
					
					// Alpha channel with volumetric density
					float alpha = intensity * accretionRate * volumetricDensity;
					alpha *= smoothstep(0.0, 0.5, turbulence);
					alpha *= localDensity * 1.5;
					
					gl_FragColor = vec4(finalColor, alpha);
				}
			`,
		};
	};

	// Enhanced photon sphere shader with critical orbits
	const createPhotonSphereShader = (config: BlackHoleConfig) => {
		return {
			vertexShader: `
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vNormal;
				varying float vRadius;
				
				void main() {
					vUv = uv;
					vPosition = position;
					vNormal = normal;
					vRadius = length(position);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float time;
				uniform float schwarzschildRadius;
				uniform vec3 baseColor;
				uniform float spin;
				
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vNormal;
				varying float vRadius;
				
				// Photon sphere radius for Kerr metric
				float photonSphereRadius(float rs, float spin, float theta) {
					float a = spin * rs * 0.5;
					float rho = 2.0 * rs * (1.0 + cos(2.0 * theta) / 3.0);
					return rho;
				}
				
				// Orbital instability visualization
				float orbitalInstability(vec3 pos, float time) {
					float angle = atan(pos.z, pos.x);
					float precession = angle + time * 2.0 + sin(time * 0.5) * 0.3;
					
					// Chaotic orbital patterns
					float chaos = sin(precession * 8.0) * sin(pos.y * 15.0 + time * 3.0);
					chaos += sin(precession * 12.0 + time * 1.5) * 0.7;
					
					return abs(chaos);
				}
				
				void main() {
					float theta = acos(clamp(vPosition.y / vRadius, -1.0, 1.0));
					float photonRadius = photonSphereRadius(schwarzschildRadius, spin, theta);
					
					// Distance from photon sphere
					float distanceFromPhotonSphere = abs(vRadius - photonRadius);
					
					// Critical orbit visualization
					float criticalOrbit = 1.0 / (1.0 + distanceFromPhotonSphere * 10.0);
					
					// Unstable orbit patterns
					float instability = orbitalInstability(vPosition, time);
					
					// Light ray accumulation effect
					float rayAccumulation = exp(-distanceFromPhotonSphere * 5.0);
					
					// Intensity with quantum fluctuations
					float intensity = criticalOrbit * (0.7 + instability * 0.3);
					intensity *= rayAccumulation;
					
					// Pulsating effect from gravitational waves
					float gwPulsation = 1.0 + sin(time * 8.0 + vRadius * 20.0) * 0.2;
					intensity *= gwPulsation;
					
					// Color with relativistic blue-shifting
					vec3 color = baseColor;
					color += vec3(0.3, 0.4, 0.8) * instability * 0.5;
					color *= (1.0 + spin * 0.3); // Frame dragging effect
					
					// Alpha with proper transparency
					float alpha = intensity * 0.6;
					alpha *= smoothstep(photonRadius * 0.8, photonRadius * 1.2, vRadius);
					
					gl_FragColor = vec4(color, alpha);
				}
			`,
		};
	};

	// Ultra-realistic relativistic jets
	const createRelativisticJets = async (blackHoleGroup: any, config: BlackHoleConfig, THREE: any) => {
		const rs = calculateSchwarzschildRadius(config.mass);
		const jetHeight = rs * 50;
		const jetRadius = rs * 2;

		const jetShader = {
			vertexShader: `
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vWorldPosition;
				varying float vDistanceFromAxis;
				varying float vHeight;
				
				void main() {
					vUv = uv;
					vPosition = position;
					vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
					vDistanceFromAxis = length(position.xz);
					vHeight = abs(position.y);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float time;
				uniform float jetPower;
				uniform vec3 jetColor;
				uniform float spin;
				uniform float magneticField;
				
				varying vec2 vUv;
				varying vec3 vPosition;
				varying vec3 vWorldPosition;
				varying float vDistanceFromAxis;
				varying float vHeight;
				
				// Relativistic jet physics
				float jetVelocity(float height, float maxVel) {
					// Acceleration profile
					float acceleration = 1.0 - exp(-height * 0.1);
					return maxVel * acceleration;
				}
				
				// Synchrotron radiation from jet plasma
				vec3 jetSynchrotron(float B, float height, float velocity) {
					float gamma = 1.0 / sqrt(1.0 - velocity * velocity);
					float intensity = B * B * gamma * gamma;
					
					// Frequency-dependent emission
					float freq = height * 0.01 + time * 0.1;
					vec3 spectrum;
					if (freq < 0.3) {
						spectrum = vec3(1.0, 0.3, 0.1); // Radio
					} else if (freq < 0.7) {
						spectrum = vec3(1.0, 0.7, 0.4); // Optical
					} else {
						spectrum = vec3(0.6, 0.8, 1.0); // X-ray
					}
					
					return spectrum * intensity;
				}
				
				// Magnetic confinement and collimation
				float magneticConfinement(float radius, float height, float B) {
					float hoop_stress = B * B / (1.0 + radius * radius);
					float pressure_gradient = exp(-radius * 2.0);
					return hoop_stress * pressure_gradient;
				}
				
				void main() {
					// Jet velocity profile
					float velocity = jetVelocity(vHeight, 0.99); // Near light speed
					
					// Magnetic field strength
					float localB = magneticField * pow(vHeight + 1.0, -0.5);
					
					// Plasma density
					float density = jetPower * exp(-vDistanceFromAxis * 3.0);
					density *= exp(-vHeight * 0.05);
					
					// Synchrotron emission
					vec3 synchrotron = jetSynchrotron(localB, vHeight, velocity);
					
					// Magnetic confinement effects
					float confinement = magneticConfinement(vDistanceFromAxis, vHeight, localB);
					
					// Relativistic beaming
					float gamma = 1.0 / sqrt(1.0 - velocity * velocity);
					float beaming = pow(gamma, 3.0) * confinement;
					
					// Jet core and sheath structure
					float coreRadius = 0.3;
					float core = exp(-vDistanceFromAxis * 8.0);
					float sheath = exp(-vDistanceFromAxis * 2.0) - core;
					
					// Color mixing
					vec3 coreColor = jetColor * 2.0;
					vec3 sheathColor = mix(jetColor, synchrotron, 0.5);
					vec3 finalColor = core * coreColor + sheath * sheathColor;
					
					// Intensity with proper physics
					float intensity = density * beaming * jetPower;
					intensity *= (core * 2.0 + sheath * 0.8);
					
					// Turbulence and instabilities
					float turbulence = sin(vHeight * 0.5 + time * 3.0) * sin(vDistanceFromAxis * 10.0 + time * 2.0);
					intensity *= (1.0 + abs(turbulence) * 0.3);
					
					// Alpha with distance attenuation
					float alpha = intensity * 0.8;
					alpha *= exp(-vHeight * 0.02); // Atmospheric absorption
					
					gl_FragColor = vec4(finalColor, alpha);
				}
			`,
		};

		const jetGeometry = new THREE.CylinderGeometry(jetRadius * 0.1, jetRadius, jetHeight, 16, 32);

		const jetMaterial = new THREE.ShaderMaterial({
			vertexShader: jetShader.vertexShader,
			fragmentShader: jetShader.fragmentShader,
			uniforms: {
				time: { value: 0 },
				jetPower: { value: config.jetPower },
				jetColor: { value: new THREE.Vector3(0.8, 0.9, 1.0) },
				spin: { value: config.spin },
				magneticField: { value: config.magneticField },
			},
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		});

		// Top jet
		const topJet = new THREE.Mesh(jetGeometry, jetMaterial.clone());
		topJet.position.y = jetHeight / 2;
		blackHoleGroup.add(topJet);

		// Bottom jet
		const bottomJet = new THREE.Mesh(jetGeometry, jetMaterial.clone());
		bottomJet.position.y = -jetHeight / 2;
		bottomJet.rotation.z = Math.PI;
		blackHoleGroup.add(bottomJet);
	};

	// Enhanced starfield with realistic stellar distribution
	const createAdvancedStarfield = async (scene: any, THREE: any) => {
		const starCount = 8000;
		const starGeometry = new THREE.BufferGeometry();
		const starPositions = new Float32Array(starCount * 3);
		const starColors = new Float32Array(starCount * 3);
		const starSizes = new Float32Array(starCount);

		for (let i = 0; i < starCount; i++) {
			// Realistic stellar distribution
			const phi = Math.random() * Math.PI * 2;
			const cosTheta = Math.random() * 2 - 1;
			const theta = Math.acos(cosTheta);
			const r = 1000 + Math.random() * 2000;

			starPositions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
			starPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
			starPositions[i * 3 + 2] = r * Math.cos(theta);

			// Stellar colors based on temperature
			const temp = Math.random();
			if (temp < 0.1) {
				// Red giants
				starColors[i * 3] = 1.0;
				starColors[i * 3 + 1] = 0.4;
				starColors[i * 3 + 2] = 0.2;
				starSizes[i] = 3.0 + Math.random() * 2.0;
			} else if (temp < 0.3) {
				// Orange dwarfs
				starColors[i * 3] = 1.0;
				starColors[i * 3 + 1] = 0.7;
				starColors[i * 3 + 2] = 0.4;
				starSizes[i] = 1.5 + Math.random() * 1.0;
			} else if (temp < 0.7) {
				// Sun-like stars
				starColors[i * 3] = 1.0;
				starColors[i * 3 + 1] = 1.0;
				starColors[i * 3 + 2] = 0.9;
				starSizes[i] = 1.0 + Math.random() * 0.5;
			} else if (temp < 0.9) {
				// Blue-white stars
				starColors[i * 3] = 0.8;
				starColors[i * 3 + 1] = 0.9;
				starColors[i * 3 + 2] = 1.0;
				starSizes[i] = 2.0 + Math.random() * 1.5;
			} else {
				// Blue giants
				starColors[i * 3] = 0.6;
				starColors[i * 3 + 1] = 0.8;
				starColors[i * 3 + 2] = 1.0;
				starSizes[i] = 4.0 + Math.random() * 3.0;
			}
		}

		starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
		starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
		starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

		const starMaterial = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
			},
			vertexShader: `
				attribute float size;
				attribute vec3 color;
				varying vec3 vColor;
				uniform float time;
				
				void main() {
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
					
					// Subtle twinkling
					float twinkle = 1.0 + sin(time * 2.0 + position.x * 0.01) * 0.1;
					gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				varying vec3 vColor;
				
				void main() {
					float r = length(gl_PointCoord - vec2(0.5));
					if (r > 0.5) discard;
					
					float intensity = 1.0 - smoothstep(0.0, 0.5, r);
					gl_FragColor = vec4(vColor * intensity, intensity);
				}
			`,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			vertexColors: true,
		});

		const stars = new THREE.Points(starGeometry, starMaterial);
		scene.add(stars);

		return stars;
	};

	// Cinematic lighting setup with realistic illumination
	const setupCinematicLighting = async (scene: any, THREE: any, config: BlackHoleConfig) => {
		// Ambient space lighting
		const ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.1);
		scene.add(ambientLight);

		// Accretion disk luminosity
		const diskLight = new THREE.PointLight(0xffa366, 2.0, 100);
		diskLight.position.set(0, 0, 0);
		scene.add(diskLight);

		// Hot spot illumination
		const hotSpotLight = new THREE.PointLight(0xffffff, 1.5, 50);
		hotSpotLight.position.set(config.diskInnerRadius * 2, 0, 0);
		scene.add(hotSpotLight);

		// Jet illumination
		const jetLight1 = new THREE.PointLight(0x99ccff, 1.0, 200);
		jetLight1.position.set(0, 30, 0);
		scene.add(jetLight1);

		const jetLight2 = new THREE.PointLight(0x99ccff, 1.0, 200);
		jetLight2.position.set(0, -30, 0);
		scene.add(jetLight2);

		// Rim lighting for dramatic effect
		const rimLight = new THREE.DirectionalLight(0x4466aa, 0.5);
		rimLight.position.set(50, 50, 50);
		scene.add(rimLight);
	};

	// Generate ultra-realistic black hole with all advanced features
	const generateBlackHole = async () => {
		if (!scene || !camera || !renderer) return;

		setIsGenerating(true);
		setError(null);

		try {
			const THREE = await import("three");

			// Clear existing black hole
			clearBlackHole();

			const blackHoleGroup = new THREE.Group();
			const rs = calculateSchwarzschildRadius(defaultConfig.mass);

			console.log(`🕳️ [BLACK HOLE] Generating ultra-realistic ${defaultConfig.type} black hole`);
			console.log(`🔢 [PARAMS] Rs=${rs.toFixed(2)}, Spin=${defaultConfig.spin}, Temp=${defaultConfig.temperature}K`);

			// 1. Event Horizon (Perfect Black Sphere)
			const eventHorizonGeometry = new THREE.SphereGeometry(rs, 128, 128);
			const eventHorizonMaterial = new THREE.MeshBasicMaterial({
				color: 0x000000,
				transparent: false,
			});
			const eventHorizon = new THREE.Mesh(eventHorizonGeometry, eventHorizonMaterial);
			blackHoleGroup.add(eventHorizon);

			// 2. Enhanced Photon Sphere
			const photonSphereGeometry = new THREE.SphereGeometry(rs * 1.5, 64, 64);
			const photonSphereShader = createPhotonSphereShader(defaultConfig);
			const photonSphereMaterial = new THREE.ShaderMaterial({
				vertexShader: photonSphereShader.vertexShader,
				fragmentShader: photonSphereShader.fragmentShader,
				uniforms: {
					time: { value: 0 },
					schwarzschildRadius: { value: rs },
					baseColor: { value: new THREE.Vector3(1.0, 0.95, 0.8) },
					spin: { value: defaultConfig.spin },
				},
				transparent: true,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				depthWrite: false,
			});
			const photonSphere = new THREE.Mesh(photonSphereGeometry, photonSphereMaterial);
			blackHoleGroup.add(photonSphere);

			// 3. Ultra-Realistic Volumetric Accretion Disk
			const diskGeometry = new THREE.RingGeometry(defaultConfig.diskInnerRadius * rs, defaultConfig.diskOuterRadius * rs, 512, 128);

			const diskShader = createVolumetricDiskShader(defaultConfig);
			const [r, g, b] = blackBodyColor(defaultConfig.temperature);

			const diskMaterial = new THREE.ShaderMaterial({
				vertexShader: diskShader.vertexShader,
				fragmentShader: diskShader.fragmentShader,
				uniforms: {
					time: { value: 0 },
					innerRadius: { value: defaultConfig.diskInnerRadius * rs },
					outerRadius: { value: defaultConfig.diskOuterRadius * rs },
					temperature: { value: defaultConfig.temperature },
					accretionRate: { value: defaultConfig.accretionRate },
					spin: { value: defaultConfig.spin },
					inclination: { value: (defaultConfig.inclination * Math.PI) / 180 },
					baseColor: { value: new THREE.Vector3(r, g, b) },
					magneticField: { value: defaultConfig.magneticField },
					coronaTemp: { value: defaultConfig.coronaTemperature },
					volumetricDensity: { value: defaultConfig.volumetricDensity },
					plasmaDensity: { value: defaultConfig.plasmaDensity },
					synchrotronEmission: { value: defaultConfig.synchrotronEmission },
					relativisticBeaming: { value: defaultConfig.relativisticBeaming },
					cameraPosition: { value: camera.position },
				},
				transparent: true,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				depthWrite: false,
			});

			const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
			accretionDisk.rotation.x = -Math.PI / 2;
			accretionDisk.rotation.z = (defaultConfig.inclination * Math.PI) / 180;
			blackHoleGroup.add(accretionDisk);

			// 4. Enhanced Inner Hot Spot
			const hotSpotGeometry = new THREE.RingGeometry(rs * 1.4, rs * 2.2, 64, 16);
			const hotSpotMaterial = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.9,
				blending: THREE.AdditiveBlending,
			});
			const hotSpot = new THREE.Mesh(hotSpotGeometry, hotSpotMaterial);
			hotSpot.rotation.x = -Math.PI / 2;
			blackHoleGroup.add(hotSpot);

			// 5. Ultra-Realistic Relativistic Jets
			await createRelativisticJets(blackHoleGroup, defaultConfig, THREE);

			// 6. Advanced Starfield Background
			await createAdvancedStarfield(scene, THREE);

			// 7. Advanced Gravitational Lensing Layer
			const lensingGeometry = new THREE.PlaneGeometry(200, 200);
			const lensingShader = createAdvancedLensingShader(defaultConfig);
			const lensingMaterial = new THREE.ShaderMaterial({
				vertexShader: lensingShader.vertexShader,
				fragmentShader: lensingShader.fragmentShader,
				uniforms: {
					time: { value: 0 },
					blackHolePosition: { value: new THREE.Vector3(0, 0, 0) },
					schwarzschildRadius: { value: rs },
					lensingStrength: { value: defaultConfig.lensingStrength },
					mass: { value: defaultConfig.mass },
					spin: { value: defaultConfig.spin },
					backgroundTexture: { value: null }, // Will be set to scene texture
					resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
					cameraPosition: { value: camera.position },
				},
				transparent: true,
				blending: THREE.NormalBlending,
				side: THREE.DoubleSide,
			});

			const lensingLayer = new THREE.Mesh(lensingGeometry, lensingMaterial);
			lensingLayer.position.z = -50;
			blackHoleGroup.add(lensingLayer);

			// 8. Cinematic Lighting
			await setupCinematicLighting(scene, THREE, defaultConfig);

			// Add to scene
			scene.add(blackHoleGroup);
			blackHoleGroupRef.current = blackHoleGroup;
			setCurrentBlackHole(blackHoleGroup);

			console.log(`✅ [BLACK HOLE] Ultra-realistic black hole generated successfully`);
			onGenerate?.();
		} catch (error) {
			console.error("❌ [BLACK HOLE] Generation failed:", error);
			setError(`Failed to generate black hole: ${error instanceof Error ? error.message : "Unknown error"}`);
		} finally {
			setIsGenerating(false);
		}
	};

	// Enhanced animation loop with all effects
	const startBlackHoleAnimation = () => {
		if (animationIdRef.current) {
			cancelAnimationFrame(animationIdRef.current);
		}

		const animate = (time: number) => {
			if (currentBlackHole) {
				const timeSeconds = time * 0.001;

				// Update all shader uniforms
				currentBlackHole.traverse((child: any) => {
					if (child.material && child.material.uniforms) {
						if (child.material.uniforms.time) {
							child.material.uniforms.time.value = timeSeconds;
						}
						if (child.material.uniforms.cameraPosition && camera) {
							child.material.uniforms.cameraPosition.value.copy(camera.position);
						}
					}
				});

				// Animate accretion disk rotation
				const disk = currentBlackHole.children.find((child: any) => child.geometry && child.geometry.type === "RingGeometry");
				if (disk) {
					disk.rotation.z += 0.005 * defaultConfig.spin;
				}

				// Animate relativistic jets
				const jets = currentBlackHole.children.filter((child: any) => child.geometry && child.geometry.type === "CylinderGeometry");
				jets.forEach((jet: any, index: number) => {
					jet.rotation.y += 0.01 * (index % 2 === 0 ? 1 : -1);
				});

				// Animate photon sphere
				const photonSphere = currentBlackHole.children.find((child: any) => child.material && child.material.uniforms && child.material.uniforms.schwarzschildRadius);
				if (photonSphere && photonSphere.material.uniforms) {
					// Pulsating opacity for quantum effects
					const opacity = 0.3 + Math.sin(timeSeconds * 4) * 0.2;
					photonSphere.material.opacity = opacity;
				}
			}

			animationIdRef.current = requestAnimationFrame(animate);
		};

		animationIdRef.current = requestAnimationFrame(animate);
	};

	// Enhanced cleanup
	const clearBlackHole = () => {
		if (currentBlackHole && scene) {
			// Stop animation
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
				animationIdRef.current = null;
			}

			// Dispose of all materials and geometries
			currentBlackHole.traverse((child: any) => {
				if (child.geometry) {
					child.geometry.dispose();
				}
				if (child.material) {
					if (Array.isArray(child.material)) {
						child.material.forEach((material: any) => material.dispose());
					} else {
						child.material.dispose();
					}
				}
			});

			scene.remove(currentBlackHole);
			setCurrentBlackHole(null);
			blackHoleGroupRef.current = null;

			console.log("🧹 [BLACK HOLE] Cleaned up successfully");
		}
		onClear?.();
	};

	// Initialize Three.js scene
	useEffect(() => {
		if (!mountRef.current) return;

		const initScene = async () => {
			try {
				const THREE = await import("three");

				// Scene setup
				const newScene = new THREE.Scene();
				const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
				const newRenderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true,
					powerPreference: "high-performance",
				});

				newRenderer.setSize(window.innerWidth, window.innerHeight);
				newRenderer.setClearColor(0x000000, 1);
				newRenderer.toneMapping = THREE.ACESFilmicToneMapping;
				newRenderer.toneMappingExposure = 1.0;

				// Enhanced camera positioning
				newCamera.position.set(80, 30, 80);
				newCamera.lookAt(0, 0, 0);

				// Controls
				const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls");
				const controls = new OrbitControls(newCamera, newRenderer.domElement);
				controls.enableDamping = true;
				controls.dampingFactor = 0.05;
				controls.minDistance = 10;
				controls.maxDistance = 500;

				mountRef.current.appendChild(newRenderer.domElement);

				setScene(newScene);
				setCamera(newCamera);
				setRenderer(newRenderer);

				sceneRef.current = newScene;
				cameraRef.current = newCamera;
				rendererRef.current = newRenderer;

				// Render loop
				const renderLoop = () => {
					controls.update();
					newRenderer.render(newScene, newCamera);
					requestAnimationFrame(renderLoop);
				};
				renderLoop();

				// Handle resize
				const handleResize = () => {
					newCamera.aspect = window.innerWidth / window.innerHeight;
					newCamera.updateProjectionMatrix();
					newRenderer.setSize(window.innerWidth, window.innerHeight);
				};
				window.addEventListener("resize", handleResize);

				return () => {
					window.removeEventListener("resize", handleResize);
					const mountElement = mountRef.current;
					if (mountElement && newRenderer.domElement) {
						mountElement.removeChild(newRenderer.domElement);
					}
					newRenderer.dispose();
				};
			} catch (error) {
				console.error("Failed to initialize Three.js scene:", error);
				setError(`Failed to initialize 3D scene: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		};

		initScene();
	}, []);

	// Start animation when black hole is generated
	useEffect(() => {
		if (currentBlackHole) {
			startBlackHoleAnimation();
		}
		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
		};
	}, [currentBlackHole, camera]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			clearBlackHole();
		};
	}, []);

	return (
		<div className="overflow-hidden relative w-full h-screen bg-black">
			<div ref={mountRef} className="w-full h-full" />

			{/* Enhanced UI Panel */}
			<div className="absolute top-4 left-4 p-4 rounded-lg border backdrop-blur-sm bg-black/80 border-blue-500/30">
				<h3 className="mb-3 text-lg font-bold text-blue-400">🕳️ Ultra-Realistic Black Hole</h3>

				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-300">Type:</span>
						<span className="text-blue-300">{defaultConfig.type}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-300">Mass:</span>
						<span className="text-blue-300">{defaultConfig.mass} M☉</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-300">Spin:</span>
						<span className="text-blue-300">{defaultConfig.spin.toFixed(2)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-300">Temperature:</span>
						<span className="text-orange-300">{defaultConfig.temperature.toLocaleString()} K</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-300">Accretion Rate:</span>
						<span className="text-yellow-300">{(defaultConfig.accretionRate * 100).toFixed(0)}%</span>
					</div>
				</div>

				<div className="flex mt-4 space-x-2">
					<button onClick={generateBlackHole} disabled={isGenerating} className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded transition-colors hover:bg-blue-700 disabled:bg-gray-600">
						{isGenerating ? "⚫ Generating..." : "🚀 Generate"}
					</button>

					<button onClick={clearBlackHole} disabled={!currentBlackHole} className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded transition-colors hover:bg-red-700 disabled:bg-gray-600">
						🧹 Clear
					</button>
				</div>

				{error && <div className="p-2 mt-3 text-xs text-red-300 rounded border border-red-500 bg-red-900/50">{error}</div>}
			</div>

			{/* Physics Information Panel */}
			<div className="absolute top-4 right-4 p-4 max-w-xs rounded-lg border backdrop-blur-sm bg-black/80 border-purple-500/30">
				<h4 className="mb-2 font-bold text-purple-400">🔬 Physics Features</h4>
				<ul className="space-y-1 text-xs text-gray-300">
					<li>✨ Kerr Spacetime Geometry</li>
					<li>🌌 Gravitational Lensing</li>
					<li>💫 Relativistic Jets</li>
					<li>🔥 Synchrotron Radiation</li>
					<li>⚡ Magnetohydrodynamics</li>
					<li>🌀 Frame Dragging</li>
					<li>💎 Photon Sphere</li>
					<li>🎯 Einstein Rings</li>
					<li>🌡️ Blackbody Radiation</li>
					<li>⚛️ Plasma Physics</li>
				</ul>
			</div>

			{isGenerating && (
				<div className="flex absolute inset-0 justify-center items-center bg-black/50">
					<div className="text-xl text-white">⚫ Generating Ultra-Realistic Black Hole...</div>
				</div>
			)}
		</div>
	);
}
