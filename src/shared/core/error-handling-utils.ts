/**
 * @file error-handling-utils.ts
 * @description Minimal error handling utilities for Next.js compatibility
 * @version 1.0.0
 */

import type { ErrorRecoverable, GameError } from "./error-system";

export class ErrorRecoveryChain {
	private handlers: ErrorRecoverable[] = [];

	addHandler(handler: ErrorRecoverable): void {
		this.handlers.push(handler);
	}

	async recover(): Promise<boolean> {
		for (const handler of this.handlers) {
			if (handler.canRecover()) {
				try {
					const success = await handler.recover();
					if (success) return true;
				} catch (error) {
					console.error("Recovery handler failed:", error);
				}
			}
		}
		return false;
	}
}

export class ResourceCleanupManager {
	private cleanupTasks: (() => void)[] = [];

	addCleanupTask(task: () => void): void {
		this.cleanupTasks.push(task);
	}

	cleanup(): void {
		this.cleanupTasks.forEach((task) => {
			try {
				task();
			} catch (error) {
				console.error("Cleanup task failed:", error);
			}
		});
		this.cleanupTasks = [];
	}
}
