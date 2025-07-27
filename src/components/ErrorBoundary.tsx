/**
 * @file ErrorBoundary.tsx
 * @description Application-level error boundary with comprehensive error handling
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Catches and handles React component errors
 * - Detailed error reporting and logging
 * - User-friendly error display with recovery options
 * - Performance monitoring integration
 * - Error categorization and severity levels
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug, Clock, Monitor, Cpu, MemoryStick } from "lucide-react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	showDetails?: boolean;
	level?: "page" | "component" | "critical";
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
	errorId: string;
	timestamp: string;
	userAgent: string;
	url: string;
	performanceMetrics: {
		memory?: number;
		cpuUsage?: number;
		renderTime?: number;
	};
	retryCount: number;
	isRecovering: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	private retryTimeoutId: NodeJS.Timeout | null = null;
	private maxRetries = 3;

	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			errorId: "",
			timestamp: "",
			userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			performanceMetrics: {},
			retryCount: 0,
			isRecovering: false,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		// Generate unique error ID
		const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const timestamp = new Date().toISOString();

		// Collect performance metrics if available
		const performanceMetrics: any = {};

		if (typeof window !== "undefined") {
			// Memory usage
			if ("memory" in performance) {
				const memory = (performance as any).memory;
				performanceMetrics.memory = memory.usedJSHeapSize / 1024 / 1024; // MB
			}

			// Timing metrics
			if (performance.timing) {
				const timing = performance.timing;
				performanceMetrics.renderTime = timing.loadEventEnd - timing.navigationStart;
			}
		}

		return {
			hasError: true,
			error,
			errorId,
			timestamp,
			performanceMetrics,
			url: typeof window !== "undefined" ? window.location.href : "",
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error details
		console.group("🚨 Error Boundary Caught Error");
		console.error("Error:", error);
		console.error("Error Info:", errorInfo);
		console.error("Component Stack:", errorInfo.componentStack);
		console.error("Error ID:", this.state.errorId);
		console.error("Timestamp:", this.state.timestamp);
		console.error("URL:", this.state.url);
		console.error("Performance Metrics:", this.state.performanceMetrics);
		console.groupEnd();

		// Update state with error info
		this.setState({
			errorInfo,
			performanceMetrics: {
				...this.state.performanceMetrics,
				...this.collectAdditionalMetrics(),
			},
		});

		// Call custom error handler if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// Report error to monitoring service (if configured)
		this.reportError(error, errorInfo);
	}

	private collectAdditionalMetrics() {
		const metrics: any = {};

		if (typeof window !== "undefined") {
			// Connection information
			if ("connection" in navigator) {
				const connection = (navigator as any).connection;
				metrics.networkType = connection.effectiveType;
				metrics.downlink = connection.downlink;
			}

			// Device information
			metrics.deviceMemory = (navigator as any).deviceMemory;
			metrics.hardwareConcurrency = navigator.hardwareConcurrency;
		}

		return metrics;
	}

	private reportError(error: Error, errorInfo: ErrorInfo) {
		// In a real application, this would send to an error reporting service
		// like Sentry, Bugsnag, or custom analytics
		const errorReport = {
			errorId: this.state.errorId,
			timestamp: this.state.timestamp,
			error: {
				name: error.name,
				message: error.message,
				stack: error.stack,
			},
			errorInfo: {
				componentStack: errorInfo.componentStack,
			},
			context: {
				url: this.state.url,
				userAgent: this.state.userAgent,
				performanceMetrics: this.state.performanceMetrics,
			},
			level: this.props.level || "component",
		};

		// Store locally for debugging
		if (typeof window !== "undefined") {
			try {
				const existingErrors = JSON.parse(localStorage.getItem("galactic-clans-errors") || "[]");
				existingErrors.push(errorReport);

				// Keep only last 10 errors
				if (existingErrors.length > 10) {
					existingErrors.splice(0, existingErrors.length - 10);
				}

				localStorage.setItem("galactic-clans-errors", JSON.stringify(existingErrors));
			} catch (e) {
				console.warn("Failed to store error report locally:", e);
			}
		}
	}

	private handleRetry = () => {
		if (this.state.retryCount >= this.maxRetries) {
			console.warn("Maximum retry attempts reached");
			return;
		}

		this.setState({
			isRecovering: true,
			retryCount: this.state.retryCount + 1,
		});

		// Clear error state after a brief delay
		this.retryTimeoutId = setTimeout(() => {
			this.setState({
				hasError: false,
				error: null,
				errorInfo: null,
				isRecovering: false,
			});
		}, 1000);
	};

	private handleReload = () => {
		if (typeof window !== "undefined") {
			window.location.reload();
		}
	};

	private handleGoHome = () => {
		if (typeof window !== "undefined") {
			window.location.href = "/";
		}
	};

	private handleReportBug = () => {
		if (typeof window !== "undefined") {
			const errorDetails = {
				id: this.state.errorId,
				error: this.state.error?.message,
				timestamp: this.state.timestamp,
				url: this.state.url,
			};

			const subject = `Bug Report: ${this.state.error?.name} - ${this.state.errorId}`;
			const body = `Error Details:\n${JSON.stringify(errorDetails, null, 2)}`;

			window.open(`mailto:support@galactic-clans.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
		}
	};

	componentWillUnmount() {
		if (this.retryTimeoutId) {
			clearTimeout(this.retryTimeoutId);
		}
	}

	render() {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			const errorSeverity = this.getErrorSeverity();
			const canRetry = this.state.retryCount < this.maxRetries;

			return (
				<div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-black flex items-center justify-center p-4">
					<div className="max-w-2xl w-full bg-slate-900/95 backdrop-blur-xl border border-red-400/30 rounded-lg shadow-2xl">
						{/* Header */}
						<div className="p-6 border-b border-red-400/20 bg-gradient-to-r from-red-900/50 to-orange-900/50">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-red-500/20 rounded-lg">
									<AlertTriangle className="w-6 h-6 text-red-400" />
								</div>
								<div>
									<h1 className="text-xl font-bold text-white">{errorSeverity === "critical" ? "Critical Error" : "Something went wrong"}</h1>
									<p className="text-red-300 text-sm">{errorSeverity === "critical" ? "A critical error occurred that requires immediate attention" : "An unexpected error occurred in the application"}</p>
								</div>
							</div>
						</div>

						{/* Content */}
						<div className="p-6 space-y-6">
							{/* Error Summary */}
							<div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
								<h3 className="font-semibold text-white mb-2">Error Summary</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-400">Error Type:</span>
										<span className="text-white font-mono">{this.state.error?.name || "Unknown"}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Error ID:</span>
										<span className="text-white font-mono">{this.state.errorId}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Timestamp:</span>
										<span className="text-white font-mono">{new Date(this.state.timestamp).toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Retry Attempts:</span>
										<span className="text-white font-mono">
											{this.state.retryCount}/{this.maxRetries}
										</span>
									</div>
								</div>
							</div>

							{/* Performance Metrics */}
							{Object.keys(this.state.performanceMetrics).length > 0 && (
								<div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
									<h3 className="font-semibold text-white mb-2 flex items-center gap-2">
										<Monitor className="w-4 h-4" />
										System Information
									</h3>
									<div className="grid grid-cols-2 gap-2 text-sm">
										{this.state.performanceMetrics.memory && (
											<div className="flex items-center gap-2">
												<MemoryStick className="w-3 h-3 text-slate-400" />
												<span className="text-slate-400">Memory:</span>
												<span className="text-white font-mono">{this.state.performanceMetrics.memory.toFixed(1)}MB</span>
											</div>
										)}
										{this.state.performanceMetrics.renderTime && (
											<div className="flex items-center gap-2">
												<Clock className="w-3 h-3 text-slate-400" />
												<span className="text-slate-400">Load Time:</span>
												<span className="text-white font-mono">{this.state.performanceMetrics.renderTime}ms</span>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Error Details (if enabled) */}
							{this.props.showDetails && this.state.error && (
								<details className="bg-slate-800/50 border border-slate-600/50 rounded-lg">
									<summary className="p-4 cursor-pointer text-white font-semibold hover:bg-slate-700/30">Technical Details</summary>
									<div className="p-4 border-t border-slate-600/50">
										<div className="space-y-3 text-sm">
											<div>
												<span className="text-slate-400">Message:</span>
												<pre className="mt-1 p-2 bg-slate-900 rounded text-red-300 text-xs overflow-x-auto">{this.state.error.message}</pre>
											</div>
											{this.state.error.stack && (
												<div>
													<span className="text-slate-400">Stack Trace:</span>
													<pre className="mt-1 p-2 bg-slate-900 rounded text-slate-300 text-xs overflow-x-auto max-h-32">{this.state.error.stack}</pre>
												</div>
											)}
										</div>
									</div>
								</details>
							)}

							{/* Recovery Actions */}
							<div className="space-y-3">
								<h3 className="font-semibold text-white">Recovery Options</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{canRetry && (
										<button onClick={this.handleRetry} disabled={this.state.isRecovering} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-lg transition-colors">
											<RefreshCw className={`w-4 h-4 ${this.state.isRecovering ? "animate-spin" : ""}`} />
											{this.state.isRecovering ? "Recovering..." : "Try Again"}
										</button>
									)}

									<button onClick={this.handleReload} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
										<RefreshCw className="w-4 h-4" />
										Reload Page
									</button>

									<button onClick={this.handleGoHome} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
										<Home className="w-4 h-4" />
										Go Home
									</button>

									<button onClick={this.handleReportBug} className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
										<Bug className="w-4 h-4" />
										Report Bug
									</button>
								</div>
							</div>

							{/* Help Text */}
							<div className="text-xs text-slate-400 bg-slate-800/30 rounded-lg p-3">
								<p>If this error persists, please try refreshing the page or restarting the application. For technical support, use the "Report Bug" button above to send error details to our team.</p>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}

	private getErrorSeverity(): "low" | "medium" | "high" | "critical" {
		if (this.props.level === "critical") return "critical";

		const error = this.state.error;
		if (!error) return "low";

		// Categorize based on error type and message
		if (error.name === "ChunkLoadError" || error.message.includes("Loading chunk")) {
			return "medium"; // Network/build issues
		}

		if (error.message.includes("WebGL") || error.message.includes("Three")) {
			return "high"; // Graphics issues
		}

		if (error.name === "TypeError" && error.message.includes("Cannot read property")) {
			return "medium"; // Likely data/state issues
		}

		return "medium"; // Default
	}
}

// Convenience wrapper components
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
	<ErrorBoundary level="page" showDetails={process.env.NODE_ENV === "development"}>
		{children}
	</ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ children: ReactNode; name?: string }> = ({ children, name }) => (
	<ErrorBoundary
		level="component"
		showDetails={false}
		fallback={
			<div className="p-4 bg-slate-800/50 border border-red-400/30 rounded-lg">
				<div className="flex items-center gap-2 text-red-400">
					<AlertTriangle className="w-4 h-4" />
					<span className="text-sm">Error in {name || "component"}</span>
				</div>
			</div>
		}
	>
		{children}
	</ErrorBoundary>
);

export const CriticalErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
	<ErrorBoundary level="critical" showDetails={true}>
		{children}
	</ErrorBoundary>
);

export default ErrorBoundary;
