/**
 * @file Card3D.tsx
 * @description Immersive 3D UI card component inspired by Tom Clancy's The Division
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/utils/utils";

// Simple Card components for 3D UI
const Card = ({ children, className, style, ...props }: any) => (
	<div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} style={style} {...props}>
		{children}
	</div>
);

const CardHeader = ({ children, className, ...props }: any) => (
	<div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
		{children}
	</div>
);

const CardTitle = ({ children, className, ...props }: any) => (
	<h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
		{children}
	</h3>
);

const CardContent = ({ children, className, ...props }: any) => (
	<div className={cn("p-6 pt-0", className)} {...props}>
		{children}
	</div>
);

interface Card3DProps {
	// 3D Positioning
	position?: [number, number, number];
	lookAtCamera?: boolean;
	followCamera?: boolean;

	// Interaction
	trigger?: "hover" | "click" | "always";
	visible?: boolean;
	onEnter?: () => void;
	onExit?: () => void;
	onClick?: () => void;

	// Styling
	className?: string;
	holographic?: boolean;
	glowColor?: string;

	// Content
	title?: string;
	children: React.ReactNode;

	// Performance
	occlusionAware?: boolean;
	distanceFade?: boolean;
	maxDistance?: number;
}

export function Card3D({ position = [0, 0, 0], lookAtCamera = true, followCamera = false, trigger = "hover", visible = trigger === "always", onEnter, onExit, onClick, className = "", holographic = true, glowColor = "#00ff88", title, children, occlusionAware = false, distanceFade = true, maxDistance = 10 }: Card3DProps) {
	const groupRef = useRef<THREE.Group>(null);
	const htmlRef = useRef<any>(null);
	const [isVisible, setIsVisible] = useState(visible);
	const [opacity, setOpacity] = useState(visible ? 1 : 0);
	const { camera } = useThree();

	// Handle visibility state
	useEffect(() => {
		if (trigger === "always") {
			setIsVisible(true);
			setOpacity(1);
		} else {
			setIsVisible(visible);
			setOpacity(visible ? 1 : 0);
		}
	}, [visible, trigger]);

	// Animation frame updates
	useFrame((state) => {
		if (!groupRef.current) return;

		// Billboard behavior - look at camera
		if (lookAtCamera) {
			groupRef.current.lookAt(camera.position);
		}

		// Follow camera behavior
		if (followCamera) {
			const targetPosition = new THREE.Vector3(...position);
			const cameraDirection = new THREE.Vector3();
			camera.getWorldDirection(cameraDirection);
			targetPosition.add(cameraDirection.multiplyScalar(-2));
			groupRef.current.position.lerp(targetPosition, 0.05);
		}

		// Distance-based fade
		if (distanceFade) {
			const distance = camera.position.distanceTo(groupRef.current.position);
			const fadeOpacity = Math.max(0, 1 - distance / maxDistance);
			setOpacity((prev) => (isVisible ? fadeOpacity : 0));
		}

		// Smooth opacity animation
		if (htmlRef.current && htmlRef.current.style) {
			const targetOpacity = isVisible ? (distanceFade ? opacity : 1) : 0;
			const currentOpacity = parseFloat(htmlRef.current.style.opacity || "0");
			const newOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, 0.1);
			htmlRef.current.style.opacity = newOpacity.toString();

			// Handle visibility for performance
			if (newOpacity < 0.01) {
				htmlRef.current.style.display = "none";
			} else {
				htmlRef.current.style.display = "block";
			}
		}
	});

	// Handle mouse interactions
	const handlePointerEnter = () => {
		if (trigger === "hover") {
			setIsVisible(true);
			onEnter?.();
		}
	};

	const handlePointerLeave = () => {
		if (trigger === "hover") {
			setIsVisible(false);
			onExit?.();
		}
	};

	const handleClick = () => {
		if (trigger === "click") {
			setIsVisible(!isVisible);
		}
		onClick?.();
	};

	// Build holographic styles
	const holographicStyles = holographic
		? {
				background: `linear-gradient(135deg, 
			rgba(0, 255, 136, 0.1) 0%, 
			rgba(0, 191, 255, 0.1) 50%, 
			rgba(138, 43, 226, 0.1) 100%)`,
				backdropFilter: "blur(16px)",
				border: `1px solid ${glowColor}40`,
				boxShadow: `
			0 0 20px ${glowColor}40,
			0 0 40px ${glowColor}20,
			inset 0 0 20px rgba(255, 255, 255, 0.1)
		`,
		  }
		: {};

	return (
		<group ref={groupRef} position={position} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} onClick={handleClick}>
			<Html
				ref={htmlRef}
				center
				transform
				sprite
				style={{
					pointerEvents: isVisible ? "auto" : "none",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					...holographicStyles,
				}}
			>
				<Card
					className={cn("w-80 min-h-32 transition-all duration-300", "bg-slate-900/90 border-cyan-400/50 text-white", "backdrop-blur-xl shadow-2xl", isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0", holographic && "animate-pulse-glow", className)}
					style={{
						transform: isVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
						...holographicStyles,
					}}
				>
					{title && (
						<CardHeader className="pb-3">
							<CardTitle className="text-cyan-400 font-bold text-lg flex items-center space-x-2">
								<div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
								<span>{title}</span>
							</CardTitle>
						</CardHeader>
					)}
					<CardContent className="pt-0">{children}</CardContent>
				</Card>
			</Html>
		</group>
	);
}

// Additional styling component for holographic effects
export const HolographicStyle = () => (
	<style jsx global>{`
		@keyframes pulse-glow {
			0%,
			100% {
				box-shadow: 0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1);
			}
			50% {
				box-shadow: 0 0 30px rgba(0, 255, 136, 0.6), 0 0 60px rgba(0, 255, 136, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.15);
			}
		}

		.animate-pulse-glow {
			animation: pulse-glow 2s ease-in-out infinite;
		}
	`}</style>
);
