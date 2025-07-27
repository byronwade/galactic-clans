/**
 * @file GlobalInputAlert.tsx
 * @description Global Input Method Switch Alert Component
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Beautiful animated alerts for input method switches
 * - Controller connection/disconnection notifications
 * - Automatic dismissal with smooth animations
 * - Click to dismiss functionality
 * - Styled icons for different input methods
 */

"use client";

import React, { useEffect, useState } from "react";
import { Gamepad2, Mouse, Keyboard, Wifi, WifiOff, X } from "lucide-react";
import { useGlobalInputDetection } from "@/hooks/useGlobalInputDetection";

interface AlertIconProps {
	type: string;
	className?: string;
}

function AlertIcon({ type, className = "" }: AlertIconProps) {
	switch (type) {
		case "switch_to_controller":
		case "controller_connected":
			return <Gamepad2 className={`w-6 h-6 ${className}`} />;
		case "switch_to_keyboard":
			return <Keyboard className={`w-6 h-6 ${className}`} />;
		case "controller_disconnected":
			return <WifiOff className={`w-6 h-6 ${className}`} />;
		default:
			return <Mouse className={`w-6 h-6 ${className}`} />;
	}
}

export function GlobalInputAlert() {
	const { showAlert, alertMessage, alertType, dismissAlert, currentMethod, isControllerConnected, controllerType } = useGlobalInputDetection();

	const [isVisible, setIsVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	// Handle alert visibility with smooth animations
	useEffect(() => {
		if (showAlert) {
			setShouldRender(true);
			// Small delay to ensure element is rendered before animation
			setTimeout(() => setIsVisible(true), 10);
		} else {
			setIsVisible(false);
			// Wait for animation to complete before removing from DOM
			setTimeout(() => setShouldRender(false), 300);
		}
	}, [showAlert]);

	// Handle manual dismissal
	const handleDismiss = () => {
		dismissAlert();
	};

	// Don't render if not supposed to be visible
	if (!shouldRender) return null;

	// Determine alert styling based on type
	const getAlertStyles = () => {
		switch (alertType) {
			case "switch_to_controller":
				return {
					bg: "bg-gradient-to-r from-blue-600/90 to-purple-600/90",
					border: "border-blue-400/50",
					icon: "text-blue-300",
					glow: "shadow-blue-500/25",
				};
			case "switch_to_keyboard":
				return {
					bg: "bg-gradient-to-r from-green-600/90 to-emerald-600/90",
					border: "border-green-400/50",
					icon: "text-green-300",
					glow: "shadow-green-500/25",
				};
			case "controller_connected":
				return {
					bg: "bg-gradient-to-r from-cyan-600/90 to-blue-600/90",
					border: "border-cyan-400/50",
					icon: "text-cyan-300",
					glow: "shadow-cyan-500/25",
				};
			case "controller_disconnected":
				return {
					bg: "bg-gradient-to-r from-red-600/90 to-orange-600/90",
					border: "border-red-400/50",
					icon: "text-red-300",
					glow: "shadow-red-500/25",
				};
			default:
				return {
					bg: "bg-gradient-to-r from-slate-700/90 to-slate-600/90",
					border: "border-slate-400/50",
					icon: "text-slate-300",
					glow: "shadow-slate-500/25",
				};
		}
	};

	const styles = getAlertStyles();

	return (
		<div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-300 ease-in-out ${isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95"}`}>
			<div
				className={`
					${styles.bg} ${styles.border} ${styles.glow}
					backdrop-blur-md border rounded-xl shadow-2xl
					px-6 py-4 max-w-sm
					animate-pulse-subtle
				`}
				onClick={handleDismiss}
				role="alert"
				aria-live="polite"
			>
				<div className="flex items-center space-x-4">
					{/* Alert Icon */}
					<div className={`flex-shrink-0 ${styles.icon}`}>
						<AlertIcon type={alertType} />
					</div>

					{/* Alert Content */}
					<div className="flex-1 min-w-0">
						<p className="text-white font-semibold text-sm leading-tight">{alertMessage}</p>

						{/* Additional context */}
						<div className="mt-1 flex items-center space-x-2">
							{currentMethod === "controller" && isControllerConnected && (
								<div className="flex items-center space-x-1">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
									<span className="text-xs text-white/80">{controllerType}</span>
								</div>
							)}
							{currentMethod === "keyboard_mouse" && (
								<div className="flex items-center space-x-1">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
									<span className="text-xs text-white/80">KB+M Active</span>
								</div>
							)}
						</div>
					</div>

					{/* Dismiss Button */}
					<button onClick={handleDismiss} className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors duration-200" aria-label="Dismiss alert">
						<X className="w-4 h-4 text-white/60 hover:text-white" />
					</button>
				</div>

				{/* Progress Bar */}
				<div className="mt-3 w-full h-1 bg-white/20 rounded-full overflow-hidden">
					<div
						className="h-full bg-white/60 rounded-full animate-progress-bar"
						style={{
							animation: "progress-shrink 3s linear forwards",
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default GlobalInputAlert;
