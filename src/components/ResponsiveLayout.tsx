/**
 * @file ResponsiveLayout.tsx
 * @description Responsive layout wrapper for generators with mobile optimization
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Mobile-first responsive design
 * - Touch-friendly interface adaptations
 * - Orientation change handling
 * - Performance optimizations for mobile devices
 */

"use client";

import React, { useState, useEffect, useCallback, type ReactNode } from "react";
import { Smartphone, Tablet, Monitor, RotateCcw } from "lucide-react";

interface ScreenInfo {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	orientation: "portrait" | "landscape";
	width: number;
	height: number;
	touchSupported: boolean;
	pixelRatio: number;
}

interface ResponsiveLayoutProps {
	children: ReactNode;
	mobileBreakpoint?: number;
	tabletBreakpoint?: number;
	className?: string;
	enableMobileOptimizations?: boolean;
	showDeviceIndicator?: boolean;
}

export function ResponsiveLayout({ children, mobileBreakpoint = 768, tabletBreakpoint = 1024, className = "", enableMobileOptimizations = true, showDeviceIndicator = false }: ResponsiveLayoutProps) {
	const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
		orientation: "landscape",
		width: 1920,
		height: 1080,
		touchSupported: false,
		pixelRatio: 1,
	});

	const [isOrientationWarning, setIsOrientationWarning] = useState(false);

	// Update screen information
	const updateScreenInfo = useCallback(() => {
		if (typeof window === "undefined") return;

		const width = window.innerWidth;
		const height = window.innerHeight;
		const isMobile = width < mobileBreakpoint;
		const isTablet = width >= mobileBreakpoint && width < tabletBreakpoint;
		const isDesktop = width >= tabletBreakpoint;
		const orientation = width > height ? "landscape" : "portrait";
		const touchSupported = "ontouchstart" in window || navigator.maxTouchPoints > 0;
		const pixelRatio = window.devicePixelRatio || 1;

		setScreenInfo({
			isMobile,
			isTablet,
			isDesktop,
			orientation,
			width,
			height,
			touchSupported,
			pixelRatio,
		});

		// Show orientation warning for mobile devices in portrait mode
		setIsOrientationWarning(isMobile && orientation === "portrait");
	}, [mobileBreakpoint, tabletBreakpoint]);

	// Handle resize and orientation changes
	useEffect(() => {
		updateScreenInfo();

		const handleResize = () => {
			updateScreenInfo();
		};

		const handleOrientationChange = () => {
			// Delay to allow for orientation change completion
			setTimeout(updateScreenInfo, 100);
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleOrientationChange);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleOrientationChange);
		};
	}, [updateScreenInfo]);

	// Apply mobile optimizations
	useEffect(() => {
		if (!enableMobileOptimizations || typeof window === "undefined") return;

		const body = document.body;
		const html = document.documentElement;

		if (screenInfo.isMobile) {
			// Prevent zoom on double-tap
			let lastTouchEnd = 0;
			const preventZoom = (e: TouchEvent) => {
				const now = new Date().getTime();
				if (now - lastTouchEnd <= 300) {
					e.preventDefault();
				}
				lastTouchEnd = now;
			};

			// Prevent scrolling bounce
			const preventBounce = (e: TouchEvent) => {
				if (e.touches.length > 1) {
					e.preventDefault();
				}
			};

			// Add mobile-specific styles
			body.style.touchAction = "manipulation";
			body.style.userSelect = "none";
			body.style.webkitUserSelect = "none";
			(body.style as any).webkitTouchCallout = "none";
			html.style.overscrollBehavior = "none";

			document.addEventListener("touchend", preventZoom, { passive: false });
			document.addEventListener("touchstart", preventBounce, { passive: false });

			return () => {
				document.removeEventListener("touchend", preventZoom);
				document.removeEventListener("touchstart", preventBounce);
				body.style.touchAction = "";
				body.style.userSelect = "";
				body.style.webkitUserSelect = "";
				(body.style as any).webkitTouchCallout = "";
				html.style.overscrollBehavior = "";
			};
		}
	}, [screenInfo.isMobile, enableMobileOptimizations]);

	// Get responsive classes
	const getResponsiveClasses = () => {
		const classes = ["responsive-layout"];

		if (screenInfo.isMobile) classes.push("mobile");
		if (screenInfo.isTablet) classes.push("tablet");
		if (screenInfo.isDesktop) classes.push("desktop");
		if (screenInfo.touchSupported) classes.push("touch-supported");
		classes.push(screenInfo.orientation);

		return classes.join(" ");
	};

	// Device indicator
	const DeviceIndicator = () => {
		if (!showDeviceIndicator) return null;

		const DeviceIcon = screenInfo.isMobile ? Smartphone : screenInfo.isTablet ? Tablet : Monitor;

		return (
			<div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-2">
				<DeviceIcon className="w-4 h-4" />
				<span>
					{screenInfo.width}×{screenInfo.height}
					{screenInfo.pixelRatio > 1 && ` @${screenInfo.pixelRatio}x`}
				</span>
				<span className="text-gray-400">{screenInfo.isMobile ? "Mobile" : screenInfo.isTablet ? "Tablet" : "Desktop"}</span>
			</div>
		);
	};

	// Orientation warning
	const OrientationWarning = () => {
		if (!isOrientationWarning) return null;

		return (
			<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
				<div className="bg-slate-900 border border-orange-400/50 rounded-lg p-6 max-w-sm text-center">
					<RotateCcw className="w-12 h-12 text-orange-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-white mb-2">Rotate Your Device</h3>
					<p className="text-slate-300 text-sm mb-4">For the best experience with Galactic Clans generators, please rotate your device to landscape orientation.</p>
					<button onClick={() => setIsOrientationWarning(false)} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm">
						Continue Anyway
					</button>
				</div>
			</div>
		);
	};

	return (
		<div
			className={`${getResponsiveClasses()} ${className}`}
			style={
				{
					"--screen-width": `${screenInfo.width}px`,
					"--screen-height": `${screenInfo.height}px`,
					"--mobile-breakpoint": `${mobileBreakpoint}px`,
					"--tablet-breakpoint": `${tabletBreakpoint}px`,
				} as React.CSSProperties
			}
		>
			{children}
			<DeviceIndicator />
			<OrientationWarning />

			{/* Responsive CSS variables and styles */}
			<style jsx global>{`
				.responsive-layout {
					--mobile-padding: 0.5rem;
					--tablet-padding: 1rem;
					--desktop-padding: 1.5rem;
					--mobile-header-height: 3rem;
					--tablet-header-height: 4rem;
					--desktop-header-height: 4rem;
					--mobile-panel-width: 100%;
					--tablet-panel-width: 320px;
					--desktop-panel-width: 320px;
				}

				.responsive-layout.mobile {
					--current-padding: var(--mobile-padding);
					--current-header-height: var(--mobile-header-height);
					--current-panel-width: var(--mobile-panel-width);
				}

				.responsive-layout.tablet {
					--current-padding: var(--tablet-padding);
					--current-header-height: var(--tablet-header-height);
					--current-panel-width: var(--tablet-panel-width);
				}

				.responsive-layout.desktop {
					--current-padding: var(--desktop-padding);
					--current-header-height: var(--desktop-header-height);
					--current-panel-width: var(--desktop-panel-width);
				}

				/* Mobile-specific generator optimizations */
				.responsive-layout.mobile .generator-header {
					padding: var(--mobile-padding);
					height: var(--mobile-header-height);
					flex-wrap: wrap;
				}

				.responsive-layout.mobile .generator-controls {
					padding: 0.25rem;
					gap: 0.5rem;
				}

				.responsive-layout.mobile .generator-controls button {
					min-height: 44px; /* Touch target minimum */
					min-width: 44px;
					font-size: 0.875rem;
				}

				.responsive-layout.mobile .generator-panel {
					width: 100%;
					max-width: none;
					height: 50vh;
					top: auto;
					bottom: 0;
					border-radius: 1rem 1rem 0 0;
					transform: translateY(calc(100% - 3rem));
					transition: transform 0.3s ease;
				}

				.responsive-layout.mobile .generator-panel.open {
					transform: translateY(0);
				}

				.responsive-layout.mobile .generator-stats {
					position: static;
					width: 100%;
					margin-top: auto;
					border-radius: 0.5rem;
					margin: 0.5rem;
				}

				/* Touch-specific improvements */
				.responsive-layout.touch-supported button {
					min-height: 44px;
					min-width: 44px;
				}

				.responsive-layout.touch-supported .slider {
					height: 44px;
					padding: 1rem 0;
				}

				.responsive-layout.touch-supported .slider::-webkit-slider-thumb {
					width: 28px;
					height: 28px;
				}

				/* High DPI optimizations */
				@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
					.responsive-layout canvas {
						image-rendering: -webkit-optimize-contrast;
						image-rendering: crisp-edges;
					}
				}

				/* Landscape mobile optimizations */
				.responsive-layout.mobile.landscape .generator-panel {
					width: 320px;
					height: calc(100vh - var(--mobile-header-height));
					top: var(--mobile-header-height);
					bottom: auto;
					right: 0;
					transform: translateX(100%);
					border-radius: 1rem 0 0 1rem;
				}

				.responsive-layout.mobile.landscape .generator-panel.open {
					transform: translateX(0);
				}

				/* Performance optimizations for mobile */
				.responsive-layout.mobile * {
					will-change: auto;
				}

				.responsive-layout.mobile canvas {
					image-rendering: optimizeSpeed;
				}

				/* Accessibility improvements */
				@media (prefers-reduced-motion: reduce) {
					.responsive-layout * {
						animation-duration: 0.01ms !important;
						animation-iteration-count: 1 !important;
						transition-duration: 0.01ms !important;
					}
				}
			`}</style>
		</div>
	);
}

// Hook for accessing screen information
export function useScreenInfo(): ScreenInfo {
	const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
		orientation: "landscape",
		width: 1920,
		height: 1080,
		touchSupported: false,
		pixelRatio: 1,
	});

	useEffect(() => {
		const updateScreenInfo = () => {
			if (typeof window === "undefined") return;

			const width = window.innerWidth;
			const height = window.innerHeight;
			const isMobile = width < 768;
			const isTablet = width >= 768 && width < 1024;
			const isDesktop = width >= 1024;
			const orientation = width > height ? "landscape" : "portrait";
			const touchSupported = "ontouchstart" in window || navigator.maxTouchPoints > 0;
			const pixelRatio = window.devicePixelRatio || 1;

			setScreenInfo({
				isMobile,
				isTablet,
				isDesktop,
				orientation,
				width,
				height,
				touchSupported,
				pixelRatio,
			});
		};

		updateScreenInfo();
		window.addEventListener("resize", updateScreenInfo);
		window.addEventListener("orientationchange", updateScreenInfo);

		return () => {
			window.removeEventListener("resize", updateScreenInfo);
			window.removeEventListener("orientationchange", updateScreenInfo);
		};
	}, []);

	return screenInfo;
}

export default ResponsiveLayout;
