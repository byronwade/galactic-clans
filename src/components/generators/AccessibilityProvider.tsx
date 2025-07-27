/**
 * @file AccessibilityProvider.tsx
 * @description Comprehensive accessibility provider for generator components
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Screen reader support with live regions
 * - Keyboard navigation enhancements
 * - Focus management
 * - ARIA labels and roles
 * - High contrast mode support
 * - Reduced motion preferences
 */

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";

interface AccessibilitySettings {
	screenReader: boolean;
	highContrast: boolean;
	reducedMotion: boolean;
	largeText: boolean;
	keyboardNavigation: boolean;
	announcements: boolean;
}

interface AccessibilityProviderProps {
	children: ReactNode;
	generatorName: string;
	currentAction?: string;
	isLoading?: boolean;
	status?: string;
}

interface FocusableElement {
	element: HTMLElement;
	tabIndex: number;
	originalTabIndex: string;
}

export function AccessibilityProvider({ children, generatorName, currentAction, isLoading = false, status }: AccessibilityProviderProps) {
	const [settings, setSettings] = useState<AccessibilitySettings>({
		screenReader: false,
		highContrast: false,
		reducedMotion: false,
		largeText: false,
		keyboardNavigation: true,
		announcements: true,
	});

	const [currentFocus, setCurrentFocus] = useState<number>(0);
	const [focusableElements, setFocusableElements] = useState<FocusableElement[]>([]);
	const [announceText, setAnnounceText] = useState<string>("");

	const containerRef = useRef<HTMLDivElement>(null);
	const announcementRef = useRef<HTMLDivElement>(null);
	const lastAnnouncementRef = useRef<string>("");

	// Detect accessibility preferences
	useEffect(() => {
		if (typeof window === "undefined") return;

		const detectPreferences = () => {
			const hasScreenReader = navigator.userAgent.includes("JAWS") || navigator.userAgent.includes("NVDA") || navigator.userAgent.includes("ORCA") || window.speechSynthesis?.getVoices().length > 0;

			const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches;

			setSettings((prev) => ({
				...prev,
				screenReader: hasScreenReader,
				reducedMotion: prefersReducedMotion,
				highContrast: prefersHighContrast,
			}));
		};

		detectPreferences();

		// Listen for preference changes
		const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const highContrastQuery = window.matchMedia("(prefers-contrast: high)");

		const handleReducedMotionChange = (e: MediaQueryListEvent) => {
			setSettings((prev) => ({ ...prev, reducedMotion: e.matches }));
		};

		const handleHighContrastChange = (e: MediaQueryListEvent) => {
			setSettings((prev) => ({ ...prev, highContrast: e.matches }));
		};

		reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
		highContrastQuery.addEventListener("change", handleHighContrastChange);

		return () => {
			reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
			highContrastQuery.removeEventListener("change", handleHighContrastChange);
		};
	}, []);

	// Update focusable elements
	const updateFocusableElements = useCallback(() => {
		if (!containerRef.current) return;

		const focusableSelectors = ["button:not([disabled])", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", '[tabindex]:not([tabindex="-1"])', "a[href]", '[role="button"]:not([disabled])', '[role="menuitem"]:not([disabled])'].join(", ");

		const elements = Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];

		const focusableElements: FocusableElement[] = elements.map((element, index) => ({
			element,
			tabIndex: index,
			originalTabIndex: element.getAttribute("tabindex") || "0",
		}));

		setFocusableElements(focusableElements);
	}, []);

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!settings.keyboardNavigation || focusableElements.length === 0) return;

			switch (event.key) {
				case "Tab":
					// Let natural tab behavior work, but track focus
					break;

				case "F6":
					// Cycle through major sections
					event.preventDefault();
					const nextFocus = event.shiftKey ? (currentFocus - 1 + focusableElements.length) % focusableElements.length : (currentFocus + 1) % focusableElements.length;

					setCurrentFocus(nextFocus);
					focusableElements[nextFocus]?.element.focus();
					break;

				case "Escape":
					// Return focus to main content
					event.preventDefault();
					const mainContent = containerRef.current?.querySelector('[role="main"]') as HTMLElement;
					if (mainContent) {
						mainContent.focus();
						announce("Returned to main content");
					}
					break;

				case "Enter":
				case " ":
					// Activate focused element if it's not naturally activatable
					const activeElement = document.activeElement as HTMLElement;
					if (activeElement && activeElement.getAttribute("role") === "button" && !activeElement.tagName.match(/button|input/i)) {
						event.preventDefault();
						activeElement.click();
					}
					break;
			}
		},
		[settings.keyboardNavigation, focusableElements, currentFocus]
	);

	// Announcement function
	const announce = useCallback(
		(text: string, priority: "polite" | "assertive" = "polite") => {
			if (!settings.announcements || text === lastAnnouncementRef.current) return;

			lastAnnouncementRef.current = text;
			setAnnounceText(text);

			// Clear after a delay to allow re-announcement
			setTimeout(() => {
				if (lastAnnouncementRef.current === text) {
					lastAnnouncementRef.current = "";
				}
			}, 1000);
		},
		[settings.announcements]
	);

	// Announce status changes
	useEffect(() => {
		if (status) {
			announce(`${generatorName}: ${status}`);
		}
	}, [status, generatorName, announce]);

	// Announce loading state changes
	useEffect(() => {
		if (isLoading) {
			announce(`${generatorName} is loading`, "assertive");
		}
	}, [isLoading, generatorName, announce]);

	// Announce current action
	useEffect(() => {
		if (currentAction) {
			announce(`Current action: ${currentAction}`);
		}
	}, [currentAction, announce]);

	// Setup keyboard listeners
	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	// Update focusable elements when children change
	useEffect(() => {
		const timer = setTimeout(updateFocusableElements, 100);
		return () => clearTimeout(timer);
	}, [children, updateFocusableElements]);

	// CSS classes for accessibility features
	const accessibilityClasses = [settings.highContrast && "accessibility-high-contrast", settings.reducedMotion && "accessibility-reduced-motion", settings.largeText && "accessibility-large-text", settings.keyboardNavigation && "accessibility-keyboard-nav"].filter(Boolean).join(" ");

	return (
		<div ref={containerRef} className={`accessibility-provider ${accessibilityClasses}`} role="application" aria-label={`${generatorName} - Space Exploration Tool`} aria-live="polite" aria-busy={isLoading}>
			{/* Screen Reader Announcements */}
			<div ref={announcementRef} className="sr-only" aria-live="polite" aria-atomic="true" role="status">
				{announceText}
			</div>

			{/* Skip Navigation Link */}
			<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
				Skip to main content
			</a>

			{/* Accessibility Instructions */}
			{settings.screenReader && (
				<div className="sr-only">
					<h2>Accessibility Instructions</h2>
					<p>Use Tab to navigate between controls, Enter or Space to activate buttons, and F6 to cycle through major sections. Press Escape to return to main content.</p>
					<p>
						Current tool: {generatorName}.{status && `Status: ${status}.`}
						{isLoading && "Content is currently loading."}
					</p>
				</div>
			)}

			{/* Main Content */}
			<main id="main-content" tabIndex={-1} className="focus:outline-none" role="main" aria-label={`${generatorName} main interface`}>
				{children}
			</main>

			{/* Accessibility Styles */}
			<style jsx global>{`
				/* High Contrast Mode */
				.accessibility-high-contrast {
					filter: contrast(150%);
				}

				.accessibility-high-contrast button,
				.accessibility-high-contrast select,
				.accessibility-high-contrast input {
					border: 2px solid currentColor !important;
				}

				/* Reduced Motion */
				.accessibility-reduced-motion *,
				.accessibility-reduced-motion *::before,
				.accessibility-reduced-motion *::after {
					animation-duration: 0.01ms !important;
					animation-iteration-count: 1 !important;
					transition-duration: 0.01ms !important;
					scroll-behavior: auto !important;
				}

				/* Large Text */
				.accessibility-large-text {
					font-size: 120% !important;
				}

				/* Keyboard Navigation Enhancements */
				.accessibility-keyboard-nav *:focus {
					outline: 3px solid #3b82f6 !important;
					outline-offset: 2px !important;
				}

				/* Screen Reader Only */
				.sr-only {
					position: absolute;
					width: 1px;
					height: 1px;
					padding: 0;
					margin: -1px;
					overflow: hidden;
					clip: rect(0, 0, 0, 0);
					white-space: nowrap;
					border: 0;
				}

				.sr-only.focus:focus {
					position: static;
					width: auto;
					height: auto;
					padding: 0.5rem 1rem;
					margin: 0;
					overflow: visible;
					clip: auto;
					white-space: normal;
				}

				/* Focus Management */
				[role="application"] button:focus,
				[role="application"] select:focus,
				[role="application"] input:focus {
					z-index: 100;
					position: relative;
				}
			`}</style>
		</div>
	);
}

export default AccessibilityProvider;
