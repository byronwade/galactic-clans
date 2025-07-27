/**
 * @file GeneratorErrorBoundary.tsx
 * @description Error boundary component for generator components
 * @version 1.0.0
 * @author Galactic Clans Development Team
 */

"use client";

import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
	children: ReactNode;
	generatorName: string;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export class GeneratorErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
			errorInfo: null,
		};
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(`🚨 [${this.props.generatorName}] Generator Error:`, error, errorInfo);

		this.setState({
			error,
			errorInfo,
		});

		// Log error to monitoring service (if available)
		this.logError(error, errorInfo);
	}

	private logError(error: Error, errorInfo: ErrorInfo) {
		// In a real application, this would send to a monitoring service
		const errorReport = {
			generator: this.props.generatorName,
			error: error.message,
			stack: error.stack,
			componentStack: errorInfo.componentStack,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href,
		};

		console.error("Error Report:", errorReport);
	}

	private handleRetry = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	private handleGoHome = () => {
		window.location.href = "/test";
	};

	override render() {
		if (this.state.hasError) {
			return (
				<div className="fixed inset-0 bg-gradient-to-br from-red-950 via-slate-950 to-black flex items-center justify-center z-50">
					<div className="max-w-2xl mx-auto p-8 bg-slate-900/90 backdrop-blur-xl border border-red-500/30 rounded-xl text-center">
						{/* Error Icon */}
						<div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<AlertTriangle className="w-10 h-10 text-red-400" />
						</div>

						{/* Error Title */}
						<h1 className="text-2xl font-bold text-white mb-4">{this.props.generatorName} Generator Error</h1>

						{/* Error Message */}
						<div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left">
							<p className="text-red-300 mb-2">
								<strong>Error:</strong> {this.state.error?.message || "Unknown error occurred"}
							</p>
							{process.env.NODE_ENV === "development" && this.state.error?.stack && (
								<details className="mt-3">
									<summary className="text-slate-400 cursor-pointer text-sm">Show Stack Trace</summary>
									<pre className="text-xs text-slate-500 mt-2 whitespace-pre-wrap overflow-auto max-h-32">{this.state.error.stack}</pre>
								</details>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button onClick={this.handleRetry} className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
								<RefreshCw className="w-4 h-4" />
								<span>Retry Generator</span>
							</button>

							<Link href="/test" className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
								<ArrowLeft className="w-4 h-4" />
								<span>Back to Test Menu</span>
							</Link>

							<button onClick={this.handleGoHome} className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
								<Home className="w-4 h-4" />
								<span>Go Home</span>
							</button>
						</div>

						{/* Technical Info */}
						{process.env.NODE_ENV === "development" && (
							<div className="mt-6 p-4 bg-slate-800/30 rounded-lg text-left">
								<h3 className="text-sm font-semibold text-slate-300 mb-2">Technical Information</h3>
								<div className="text-xs text-slate-400 space-y-1">
									<p>
										<strong>Generator:</strong> {this.props.generatorName}
									</p>
									<p>
										<strong>Timestamp:</strong> {new Date().toLocaleString()}
									</p>
									<p>
										<strong>Environment:</strong> {process.env.NODE_ENV}
									</p>
									<p>
										<strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...
									</p>
								</div>
							</div>
						)}

						{/* Help Text */}
						<div className="mt-6 text-sm text-slate-400">
							<p>If this error persists, please try refreshing the page or contact support.</p>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(WrappedComponent: React.ComponentType<P>, generatorName: string) {
	return function WithErrorBoundary(props: P) {
		return (
			<GeneratorErrorBoundary generatorName={generatorName}>
				<WrappedComponent {...props} />
			</GeneratorErrorBoundary>
		);
	};
}
