/**
 * @file error-system.ts
 * @description Minimal error handling system for Next.js compatibility
 * @version 1.0.0
 */

export enum ErrorSeverity {
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	HIGH = "HIGH",
	CRITICAL = "CRITICAL",
}

export enum ErrorCategory {
	SYSTEM = "SYSTEM",
	NETWORK = "NETWORK",
	RENDER = "RENDER",
	AUDIO = "AUDIO",
	INPUT = "INPUT",
	PHYSICS = "PHYSICS",
	AI = "AI",
	STORAGE = "STORAGE",
}

export interface GameError {
	id: string;
	category: ErrorCategory;
	severity: ErrorSeverity;
	message: string;
	timestamp: number;
	context?: any;
}

export interface ErrorRecoverable {
	canRecover(): boolean;
	recover(): Promise<boolean>;
}

export interface SystemHealth {
	isHealthy: boolean;
	lastCheckTime: number;
	issues: GameError[];
}

export class ErrorLogger {
	private static instance: ErrorLogger;
	private errors: GameError[] = [];

	static getInstance(): ErrorLogger {
		if (!ErrorLogger.instance) {
			ErrorLogger.instance = new ErrorLogger();
		}
		return ErrorLogger.instance;
	}

	logError(error: GameError): void {
		this.errors.push(error);
		console.error(`[${error.category}:${error.severity}] ${error.message}`, error);
	}

	getErrors(): GameError[] {
		return [...this.errors];
	}

	clearErrors(): void {
		this.errors = [];
	}
}
