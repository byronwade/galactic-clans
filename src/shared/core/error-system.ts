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

	logError(error: GameError): void;
	logError(category: string, message: string, errorData?: any): void;
	logError(errorOrCategory: GameError | string, message?: string, errorData?: any): void {
		if (typeof errorOrCategory === "string") {
			// Handle string-based error logging
			const gameError: GameError = {
				id: Date.now().toString(),
				category: ErrorCategory.SYSTEM,
				severity: ErrorSeverity.HIGH,
				message: `[${errorOrCategory}] ${message}`,
				timestamp: Date.now(),
				context: errorData,
			};
			this.errors.push(gameError);
			console.error(`[${gameError.category}:${gameError.severity}] ${gameError.message}`, errorData);
		} else {
			// Handle GameError object
			this.errors.push(errorOrCategory);
			console.error(`[${errorOrCategory.category}:${errorOrCategory.severity}] ${errorOrCategory.message}`, errorOrCategory);
		}
	}

	logInfo(category: string, message: string): void {
		console.log(`[${category}:INFO] ${message}`);
	}

	logWarning(category: string, message: string): void {
		const gameError: GameError = {
			id: Date.now().toString(),
			category: ErrorCategory.SYSTEM,
			severity: ErrorSeverity.MEDIUM,
			message: `[${category}] ${message}`,
			timestamp: Date.now(),
		};
		this.errors.push(gameError);
		console.warn(`[${category}:WARNING] ${message}`);
	}

	getErrors(): GameError[] {
		return [...this.errors];
	}

	clearErrors(): void {
		this.errors = [];
	}
}
