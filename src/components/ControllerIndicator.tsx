/**
 * @file ControllerIndicator.tsx
 * @description Universal Controller Indicator and Help System
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Provides consistent controller support indicators and help overlays
 * for all test pages in the Galactic Clans test suite.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Gamepad2, X } from "lucide-react";
import { useGamepadController, type GamepadActions } from "@/hooks/useGamepadController";

interface ControllerHelpItem {
	control: string;
	action: string;
	category?: "3D Navigation" | "UI Controls" | "Actions" | "System";
}

interface ControllerIndicatorProps {
	// Visual configuration
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	showHelpButton?: boolean;
	accentColor?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";

	// Controller configuration
	actions?: GamepadActions;
	controllerOptions?: {
		deadzone?: number;
		sensitivity?: number;
		enableHaptics?: boolean;
	};

	// Help content
	helpItems?: ControllerHelpItem[];
	pageTitle?: string;
	autoShowHelp?: boolean;
	autoHideDelay?: number;
}

const DEFAULT_HELP_ITEMS: ControllerHelpItem[] = [
	{ control: "Right Stick", action: "Rotate camera", category: "3D Navigation" },
	{ control: "Left Stick", action: "Move camera", category: "3D Navigation" },
	{ control: "Triggers", action: "Zoom in/out", category: "3D Navigation" },
	{ control: "A/X Button", action: "Primary action", category: "Actions" },
	{ control: "B/Circle", action: "Back/Cancel", category: "Actions" },
	{ control: "Start/Options", action: "Toggle help", category: "System" },
];

const ACCENT_COLORS = {
	blue: {
		bg: "bg-blue-500/20",
		border: "border-blue-400/30",
		text: "text-blue-400",
		textSecondary: "text-blue-300",
		button: "bg-blue-600 hover:bg-blue-700",
	},
	green: {
		bg: "bg-green-500/20",
		border: "border-green-400/30",
		text: "text-green-400",
		textSecondary: "text-green-300",
		button: "bg-green-600 hover:bg-green-700",
	},
	purple: {
		bg: "bg-purple-500/20",
		border: "border-purple-400/30",
		text: "text-purple-400",
		textSecondary: "text-purple-300",
		button: "bg-purple-600 hover:bg-purple-700",
	},
	orange: {
		bg: "bg-orange-500/20",
		border: "border-orange-400/30",
		text: "text-orange-400",
		textSecondary: "text-orange-300",
		button: "bg-orange-600 hover:bg-orange-700",
	},
	red: {
		bg: "bg-red-500/20",
		border: "border-red-400/30",
		text: "text-red-400",
		textSecondary: "text-red-300",
		button: "bg-red-600 hover:bg-red-700",
	},
	cyan: {
		bg: "bg-cyan-500/20",
		border: "border-cyan-400/30",
		text: "text-cyan-400",
		textSecondary: "text-cyan-300",
		button: "bg-cyan-600 hover:bg-cyan-700",
	},
};

const POSITION_CLASSES = {
	"top-left": "top-4 left-4",
	"top-right": "top-4 right-4",
	"bottom-left": "bottom-4 left-4",
	"bottom-right": "bottom-4 right-4",
};

export function ControllerIndicator({ position = "top-left", showHelpButton = true, accentColor = "blue", actions = {}, controllerOptions = {}, helpItems = DEFAULT_HELP_ITEMS, pageTitle = "Test Page", autoShowHelp = true, autoHideDelay = 4000 }: ControllerIndicatorProps) {
	const [showControllerHelp, setShowControllerHelp] = useState(false);
	const colors = ACCENT_COLORS[accentColor];

	// Enhanced controller actions with help toggle
	const enhancedActions: GamepadActions = {
		...actions,
		onMenuToggle: () => {
			setShowControllerHelp((prev) => !prev);
			actions.onMenuToggle?.();
		},
	};

	const { isConnected, controllerType, triggerHapticFeedback } = useGamepadController({
		deadzone: 0.15,
		sensitivity: 1.0,
		enableHaptics: true,
		...controllerOptions,
		actions: enhancedActions,
	});

	// Auto-show help when controller connects
	useEffect(() => {
		if (isConnected && autoShowHelp) {
			setShowControllerHelp(true);
			if (autoHideDelay > 0) {
				const timer = setTimeout(() => setShowControllerHelp(false), autoHideDelay);
				return () => clearTimeout(timer);
			}
		}
	}, [isConnected, autoShowHelp, autoHideDelay]);

	// Group help items by category
	const groupedHelpItems = helpItems.reduce((groups, item) => {
		const category = item.category || "General";
		if (!groups[category]) {
			groups[category] = [];
		}
		groups[category].push(item);
		return groups;
	}, {} as Record<string, ControllerHelpItem[]>);

	if (!isConnected) {
		return null;
	}

	return (
		<>
			{/* Controller Indicator */}
			<div className={`absolute ${POSITION_CLASSES[position]} z-40 flex items-center space-x-3`}>
				<div className={`flex items-center space-x-2 px-3 py-2 ${colors.bg} border ${colors.border} rounded-lg backdrop-blur-sm`}>
					<Gamepad2 className={`w-4 h-4 ${colors.text}`} />
					<span className={`text-sm ${colors.textSecondary}`}>{controllerType}</span>
					{showHelpButton && (
						<button
							onClick={() => {
								setShowControllerHelp(true);
								triggerHapticFeedback(0.3, 75);
							}}
							className={`text-xs px-2 py-1 ${colors.button} rounded transition-colors`}
						>
							Help
						</button>
					)}
				</div>
			</div>

			{/* Controller Help Overlay */}
			{showControllerHelp && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
					<div className={`bg-slate-900/95 border ${colors.border} rounded-xl p-8 max-w-2xl text-center space-y-6 relative`}>
						{/* Close Button */}
						<button onClick={() => setShowControllerHelp(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
							<X className="w-5 h-5 text-slate-400 hover:text-white" />
						</button>

						{/* Header */}
						<div className={`flex items-center justify-center space-x-3 ${colors.text}`}>
							<Gamepad2 className="w-8 h-8" />
							<div>
								<h2 className="text-xl font-bold">{controllerType} Controller</h2>
								<p className="text-sm text-slate-400">{pageTitle}</p>
							</div>
						</div>

						{/* Help Content */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
							{Object.entries(groupedHelpItems).map(([category, items]) => (
								<div key={category} className="space-y-3">
									<h3 className={`font-semibold ${colors.text} border-b ${colors.border} pb-2`}>{category}</h3>
									<div className="space-y-2">
										{items.map((item, index) => (
											<div key={index} className="flex justify-between text-sm">
												<span className="text-slate-300 font-medium">{item.control}:</span>
												<span className="text-slate-400">{item.action}</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>

						{/* Footer */}
						<div className="pt-4 border-t border-slate-700/50">
							<button onClick={() => setShowControllerHelp(false)} className={`px-6 py-3 ${colors.button} rounded-lg transition-colors font-medium`}>
								Start Using Controller!
							</button>
							<p className="text-xs text-slate-500 mt-2">Press Start/Options anytime to toggle this help</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default ControllerIndicator;
