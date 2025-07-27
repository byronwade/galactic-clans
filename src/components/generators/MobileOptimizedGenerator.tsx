/**
 * @file MobileOptimizedGenerator.tsx
 * @description Mobile optimization wrapper for generator components
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Touch-friendly interface scaling
 * - Mobile-responsive panels
 * - Gesture controls
 * - Orientation handling
 * - Performance optimizations
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { Smartphone, Tablet, Monitor, Menu, X } from "lucide-react";

interface MobileOptimizedGeneratorProps {
	children: ReactNode;
	title: string;
	subtitle: string;
	icon: React.ComponentType<{ className?: string }>;
	headerControls?: ReactNode;
	settingsPanel?: ReactNode;
	infoPanel?: ReactNode;
	statsPanel?: ReactNode;
	showSettings?: boolean;
	showInfo?: boolean;
	onToggleSettings?: () => void;
	onToggleInfo?: () => void;
	className?: string;
}

interface DeviceInfo {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	orientation: "portrait" | "landscape";
	touchSupported: boolean;
	width: number;
	height: number;
}

export function MobileOptimizedGenerator({ children, title, subtitle, icon: Icon, headerControls, settingsPanel, infoPanel, statsPanel, showSettings = false, showInfo = false, onToggleSettings, onToggleInfo, className = "" }: MobileOptimizedGeneratorProps) {
	const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
		orientation: "landscape",
		touchSupported: false,
		width: 1920,
		height: 1080,
	});

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Update device info
	const updateDeviceInfo = useCallback(() => {
		if (typeof window === "undefined") return;

		const width = window.innerWidth;
		const height = window.innerHeight;
		const isMobile = width < 768;
		const isTablet = width >= 768 && width < 1024;
		const isDesktop = width >= 1024;
		const orientation = width > height ? "landscape" : "portrait";
		const touchSupported = "ontouchstart" in window || navigator.maxTouchPoints > 0;

		setDeviceInfo({
			isMobile,
			isTablet,
			isDesktop,
			orientation,
			touchSupported,
			width,
			height,
		});
	}, []);

	useEffect(() => {
		updateDeviceInfo();
		window.addEventListener("resize", updateDeviceInfo);
		window.addEventListener("orientationchange", updateDeviceInfo);

		return () => {
			window.removeEventListener("resize", updateDeviceInfo);
			window.removeEventListener("orientationchange", updateDeviceInfo);
		};
	}, [updateDeviceInfo]);

	// Close mobile menu when panels are toggled
	useEffect(() => {
		if (showSettings || showInfo) {
			setMobileMenuOpen(false);
		}
	}, [showSettings, showInfo]);

	const headerHeight = deviceInfo.isMobile ? "h-14" : "h-16";
	const panelWidth = deviceInfo.isMobile ? "w-full" : "w-80";
	const fontSize = deviceInfo.isMobile ? "text-base" : "text-lg";
	const iconSize = deviceInfo.isMobile ? "w-6 h-6" : "w-8 h-8";
	const buttonSize = deviceInfo.isMobile ? "p-3" : "p-2";

	return (
		<div className={`fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-black overflow-hidden ${className}`}>
			{/* Header */}
			<div className={`absolute top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 ${headerHeight}`}>
				<div className="flex items-center justify-between px-4 h-full">
					<div className="flex items-center space-x-3">
						<div className={`${deviceInfo.isMobile ? "w-8 h-8" : "w-10 h-10"} rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center`}>
							<Icon className={`${deviceInfo.isMobile ? "w-4 h-4" : "w-5 h-5"} text-white`} />
						</div>
						<div>
							<h1 className={`${fontSize} font-semibold text-white`}>{title}</h1>
							{!deviceInfo.isMobile && <p className="text-sm text-slate-300">{subtitle}</p>}
						</div>
					</div>

					{/* Desktop Header Controls */}
					{deviceInfo.isDesktop ? (
						<div className="flex items-center space-x-2">{headerControls}</div>
					) : (
						/* Mobile Menu Button */
						<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${buttonSize} rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors`} aria-label="Toggle mobile menu">
							{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</button>
					)}
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			{deviceInfo.isMobile && mobileMenuOpen && (
				<div className="absolute top-14 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
					<div className="space-y-3">{headerControls}</div>
				</div>
			)}

			{/* Main Content Area */}
			<div className={`absolute inset-0 ${deviceInfo.isMobile ? "top-14" : "top-16"}`}>{children}</div>

			{/* Settings Panel - Mobile Optimized */}
			{showSettings && settingsPanel && (
				<div className={`absolute ${deviceInfo.isMobile ? "inset-0 top-14" : "top-24 left-6"} z-30 bg-slate-900/95 backdrop-blur-xl ${deviceInfo.isMobile ? "" : "rounded-xl"} border border-slate-700/30 ${panelWidth} ${deviceInfo.isMobile ? "h-auto" : "max-h-[calc(100vh-8rem)]"} overflow-y-auto`}>
					{deviceInfo.isMobile && (
						<div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/30 p-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-white">Settings</h2>
							<button onClick={onToggleSettings} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors">
								<X className="w-5 h-5" />
							</button>
						</div>
					)}
					<div className={deviceInfo.isMobile ? "p-4" : ""}>{settingsPanel}</div>
				</div>
			)}

			{/* Info Panel - Mobile Optimized */}
			{showInfo && infoPanel && (
				<div className={`absolute ${deviceInfo.isMobile ? "inset-0 top-14" : "top-24 right-6"} z-30 bg-slate-900/95 backdrop-blur-xl ${deviceInfo.isMobile ? "" : "rounded-xl"} border border-slate-700/30 ${panelWidth} ${deviceInfo.isMobile ? "h-auto" : "max-h-[calc(100vh-8rem)]"} overflow-y-auto`}>
					{deviceInfo.isMobile && (
						<div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/30 p-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-white">Information</h2>
							<button onClick={onToggleInfo} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white transition-colors">
								<X className="w-5 h-5" />
							</button>
						</div>
					)}
					<div className={deviceInfo.isMobile ? "p-4" : ""}>{infoPanel}</div>
				</div>
			)}

			{/* Stats Panel - Mobile Optimized */}
			{statsPanel && <div className={`absolute ${deviceInfo.isMobile ? "bottom-4 left-4 right-4" : "bottom-6 right-6"} z-20 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-700/30`}>{statsPanel}</div>}

			{/* Touch Enhancement Indicator */}
			{deviceInfo.touchSupported && deviceInfo.isMobile && (
				<div className="absolute top-20 right-4 z-10 flex items-center space-x-1 text-xs text-slate-400">
					<Smartphone className="w-3 h-3" />
					<span>Touch Optimized</span>
				</div>
			)}
		</div>
	);
}

export default MobileOptimizedGenerator;
