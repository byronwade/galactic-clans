/**
 * @file AccessibleButton.tsx
 * @description Fully accessible button component with comprehensive ARIA support
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { forwardRef } from "react";
import type { ReactNode } from "react";

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	icon?: ReactNode;
	iconPosition?: "left" | "right";
	loading?: boolean;
	loadingText?: string;
	ariaLabel?: string;
	ariaDescribedBy?: string;
	announcement?: string;
	tooltip?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({ children, variant = "secondary", size = "md", icon, iconPosition = "left", loading = false, loadingText, ariaLabel, ariaDescribedBy, announcement, tooltip, disabled, className = "", onClick, ...props }, ref) => {
	// Variant styles
	const variantClasses = {
		primary: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 focus:ring-blue-500",
		secondary: "bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white border-slate-600/50 focus:ring-slate-500",
		ghost: "bg-transparent hover:bg-slate-800/30 text-slate-300 hover:text-white border-transparent focus:ring-slate-500",
		danger: "bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500",
	};

	// Size styles
	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	// Icon size
	const iconSizes = {
		sm: "w-4 h-4",
		md: "w-5 h-5",
		lg: "w-6 h-6",
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (loading || disabled) return;

		// Announce action for screen readers
		if (announcement) {
			const announcement_div = document.createElement("div");
			announcement_div.setAttribute("aria-live", "polite");
			announcement_div.setAttribute("aria-atomic", "true");
			announcement_div.className = "sr-only";
			announcement_div.textContent = announcement;
			document.body.appendChild(announcement_div);

			setTimeout(() => {
				document.body.removeChild(announcement_div);
			}, 1000);
		}

		onClick?.(event);
	};

	const buttonId = props.id || `button-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<>
			<button
				ref={ref}
				id={buttonId}
				disabled={disabled || loading}
				className={`
						inline-flex items-center justify-center gap-2 rounded-lg border transition-all duration-200
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
						disabled:opacity-50 disabled:cursor-not-allowed
						${variantClasses[variant]}
						${sizeClasses[size]}
						${className}
					`}
				aria-label={ariaLabel || (typeof children === "string" ? children : undefined)}
				aria-describedby={ariaDescribedBy || (tooltip ? `${buttonId}-tooltip` : undefined)}
				aria-busy={loading}
				aria-disabled={disabled || loading}
				role="button"
				tabIndex={disabled ? -1 : 0}
				onClick={handleClick}
				{...props}
			>
				{/* Loading Spinner */}
				{loading && (
					<svg className={`animate-spin ${iconSizes[size]}`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
				)}

				{/* Icon - Left */}
				{!loading && icon && iconPosition === "left" && (
					<span className={iconSizes[size]} aria-hidden="true">
						{icon}
					</span>
				)}

				{/* Button Text */}
				<span>{loading && loadingText ? loadingText : children}</span>

				{/* Icon - Right */}
				{!loading && icon && iconPosition === "right" && (
					<span className={iconSizes[size]} aria-hidden="true">
						{icon}
					</span>
				)}

				{/* Screen Reader Loading Text */}
				{loading && <span className="sr-only">{loadingText || "Loading, please wait..."}</span>}
			</button>

			{/* Tooltip */}
			{tooltip && (
				<div id={`${buttonId}-tooltip`} role="tooltip" className="sr-only">
					{tooltip}
				</div>
			)}
		</>
	);
});

AccessibleButton.displayName = "AccessibleButton";

export default AccessibleButton;
