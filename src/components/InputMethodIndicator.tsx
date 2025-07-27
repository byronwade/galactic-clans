/**
 * @file InputMethodIndicator.tsx
 * @description Simple Input Method Status Indicator
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Shows current input method (Controller/Keyboard+Mouse)
 * - Compact design for corner placement
 * - Real-time updates when input method changes
 * - Optional position and styling customization
 */

"use client";

import React from "react";
import { Gamepad2, Mouse, Keyboard } from "lucide-react";
import { useGlobalInputDetection } from "@/hooks/useGlobalInputDetection";

interface InputMethodIndicatorProps {
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	size?: "sm" | "md" | "lg";
	showLabel?: boolean;
	className?: string;
}

const POSITION_CLASSES = {
	"top-left": "top-4 left-4",
	"top-right": "top-4 right-4",
	"bottom-left": "bottom-4 left-4",
	"bottom-right": "bottom-4 right-4",
};

const SIZE_CLASSES = {
	sm: {
		container: "px-2 py-1 text-xs",
		icon: "w-3 h-3",
		text: "text-xs",
	},
	md: {
		container: "px-3 py-2 text-sm",
		icon: "w-4 h-4",
		text: "text-sm",
	},
	lg: {
		container: "px-4 py-3 text-base",
		icon: "w-5 h-5",
		text: "text-base",
	},
};

export function InputMethodIndicator({ position = "bottom-right", size = "sm", showLabel = false, className = "" }: InputMethodIndicatorProps) {
	const { currentMethod, isControllerConnected, controllerType, isUsingController, isUsingKeyboardMouse } = useGlobalInputDetection();

	// Don't show indicator if input method is unknown
	if (currentMethod === "unknown") {
		return null;
	}

	const sizeConfig = SIZE_CLASSES[size];
	const positionClass = POSITION_CLASSES[position];

	// Determine icon and styling based on current input method
	const getIndicatorConfig = () => {
		if (isUsingController && isControllerConnected) {
			return {
				icon: <Gamepad2 className={`${sizeConfig.icon} text-blue-400`} />,
				bgColor: "bg-blue-600/20",
				borderColor: "border-blue-400/40",
				textColor: "text-blue-300",
				label: controllerType,
				status: "Controller",
			};
		} else if (isUsingKeyboardMouse) {
			return {
				icon: <Mouse className={`${sizeConfig.icon} text-green-400`} />,
				bgColor: "bg-green-600/20",
				borderColor: "border-green-400/40",
				textColor: "text-green-300",
				label: "Keyboard & Mouse",
				status: "KB+M",
			};
		} else {
			return {
				icon: <Keyboard className={`${sizeConfig.icon} text-slate-400`} />,
				bgColor: "bg-slate-600/20",
				borderColor: "border-slate-400/40",
				textColor: "text-slate-300",
				label: "Unknown",
				status: "Unknown",
			};
		}
	};

	const config = getIndicatorConfig();

	return (
		<div
			className={`
				fixed ${positionClass} z-40
				${config.bgColor} ${config.borderColor}
				backdrop-blur-sm border rounded-lg
				${sizeConfig.container}
				transition-all duration-200
				${className}
			`}
			title={`Current input method: ${config.label}`}
		>
			<div className="flex items-center space-x-2">
				{/* Input Method Icon */}
				<div className="flex-shrink-0">{config.icon}</div>

				{/* Optional Label */}
				{showLabel && <span className={`${sizeConfig.text} ${config.textColor} font-medium whitespace-nowrap`}>{config.status}</span>}

				{/* Connection Status Indicator */}
				{isUsingController && (
					<div className="flex-shrink-0">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
					</div>
				)}
			</div>
		</div>
	);
}

export default InputMethodIndicator;
