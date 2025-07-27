/**
 * @file AccessibleSelect.tsx
 * @description Fully accessible select component with comprehensive ARIA support
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { forwardRef } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
	description?: string;
}

interface AccessibleSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
	label?: string;
	options: SelectOption[];
	placeholder?: string;
	error?: string;
	helpText?: string;
	required?: boolean;
	ariaLabel?: string;
	ariaDescribedBy?: string;
	announcement?: string;
	size?: "sm" | "md" | "lg";
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(({ label, options, placeholder, error, helpText, required = false, ariaLabel, ariaDescribedBy, announcement, size = "md", disabled, className = "", onChange, ...props }, ref) => {
	// Size styles
	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
	const helpTextId = `${selectId}-help`;
	const errorId = `${selectId}-error`;

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		// Announce selection for screen readers
		if (announcement) {
			const selectedOption = options.find((opt) => opt.value === event.target.value);
			const announcementText = announcement.replace("{selection}", selectedOption?.label || event.target.value);

			const announcement_div = document.createElement("div");
			announcement_div.setAttribute("aria-live", "polite");
			announcement_div.setAttribute("aria-atomic", "true");
			announcement_div.className = "sr-only";
			announcement_div.textContent = announcementText;
			document.body.appendChild(announcement_div);

			setTimeout(() => {
				document.body.removeChild(announcement_div);
			}, 1000);
		}

		onChange?.(event);
	};

	const describedByIds = [ariaDescribedBy, helpText ? helpTextId : null, error ? errorId : null].filter(Boolean).join(" ");

	return (
		<div className="space-y-2">
			{/* Label */}
			{label && (
				<label htmlFor={selectId} className="block text-sm font-medium text-slate-300">
					{label}
					{required && (
						<span className="text-red-400 ml-1" aria-label="required">
							*
						</span>
					)}
				</label>
			)}

			{/* Select Container */}
			<div className="relative">
				<select
					ref={ref}
					id={selectId}
					disabled={disabled}
					required={required}
					className={`
							w-full appearance-none rounded-lg border transition-all duration-200
							focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
							disabled:opacity-50 disabled:cursor-not-allowed
							${error ? "border-red-500 bg-red-500/10 text-red-300 focus:ring-red-500" : "border-slate-600/50 bg-slate-800/50 text-white hover:bg-slate-700/70"}
							${sizeClasses[size]}
							${className}
						`}
					aria-label={ariaLabel || label}
					aria-describedby={describedByIds || undefined}
					aria-invalid={error ? "true" : "false"}
					aria-required={required}
					onChange={handleChange}
					{...props}
				>
					{/* Placeholder Option */}
					{placeholder && (
						<option value="" disabled hidden>
							{placeholder}
						</option>
					)}

					{/* Options */}
					{options.map((option) => (
						<option key={option.value} value={option.value} disabled={option.disabled} title={option.description}>
							{option.label}
						</option>
					))}
				</select>

				{/* Dropdown Icon */}
				<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
					<ChevronDown className="w-5 h-5 text-slate-400" aria-hidden="true" />
				</div>
			</div>

			{/* Help Text */}
			{helpText && (
				<p id={helpTextId} className="text-sm text-slate-400" role="note">
					{helpText}
				</p>
			)}

			{/* Error Message */}
			{error && (
				<p id={errorId} className="text-sm text-red-400 flex items-center gap-1" role="alert" aria-live="polite">
					<svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
						<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
					</svg>
					{error}
				</p>
			)}

			{/* Screen Reader Instructions */}
			<div className="sr-only">
				<p>
					Use arrow keys to navigate options, Enter to select, and Escape to close.
					{required && " This field is required."}
					{options.length > 0 && ` ${options.length} options available.`}
				</p>
			</div>
		</div>
	);
});

AccessibleSelect.displayName = "AccessibleSelect";

export default AccessibleSelect;
