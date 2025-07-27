/**
 * @file system-health-monitor.ts
 * @description Minimal system health monitoring for Next.js compatibility
 * @version 1.0.0
 */

import type { SystemHealth, GameError } from "./error-system";

export class SystemHealthMonitor {
	private static instance: SystemHealthMonitor;
	private health: SystemHealth;

	constructor() {
		this.health = {
			isHealthy: true,
			lastCheckTime: Date.now(),
			issues: [],
		};
	}

	static getInstance(): SystemHealthMonitor {
		if (!SystemHealthMonitor.instance) {
			SystemHealthMonitor.instance = new SystemHealthMonitor();
		}
		return SystemHealthMonitor.instance;
	}

	getHealth(): SystemHealth {
		return { ...this.health };
	}

	addIssue(error: GameError): void {
		this.health.issues.push(error);
		this.health.isHealthy = this.health.issues.length === 0;
		this.health.lastCheckTime = Date.now();
	}

	clearIssues(): void {
		this.health.issues = [];
		this.health.isHealthy = true;
		this.health.lastCheckTime = Date.now();
	}

	checkHealth(): boolean {
		this.health.lastCheckTime = Date.now();
		return this.health.isHealthy;
	}
}
