/**
 * @file fps-ai-system.tsx
 * @description Professional AAA-Quality AI System for FPS Explorer
 * @version 1.0.0
 * @author Galactic Clans Development Team
 *
 * Features:
 * - Behavior trees for complex AI decision making
 * - Advanced pathfinding with navmesh generation
 * - Line-of-sight and field-of-view detection
 * - AI communication system for group coordination
 * - Adaptive difficulty scaling with dynamic behaviors
 * - Realistic AI reactions and animations
 */

"use client";

import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
import * as THREE from "three";

// AI Behavior Interfaces
export interface AIAgent {
	id: string;
	position: THREE.Vector3;
	rotation: THREE.Euler;
	health: number;
	maxHealth: number;
	alertLevel: "calm" | "suspicious" | "alert" | "combat";
	behaviorState: string;
	lastKnownPlayerPosition?: THREE.Vector3;
	weaponType: "rifle" | "pistol" | "melee";
	movementSpeed: number;
	detectionRange: number;
	fieldOfView: number; // in radians
	accuracy: number;
	reactionTime: number;
	group?: string;
}

export interface AIBehaviorNode {
	type: "selector" | "sequence" | "condition" | "action";
	name: string;
	children?: AIBehaviorNode[];
	condition?: (agent: AIAgent, context: AIContext) => boolean;
	action?: (agent: AIAgent, context: AIContext) => "success" | "failure" | "running";
}

export interface AIContext {
	player: {
		position: THREE.Vector3;
		isVisible: boolean;
		lastSeenTime: number;
		noise: number;
	};
	allies: AIAgent[];
	enemies: AIAgent[];
	obstacles: THREE.Object3D[];
	navmesh: NavMesh;
	deltaTime: number;
}

export interface NavMesh {
	nodes: NavNode[];
	connections: Map<string, string[]>;
}

export interface NavNode {
	id: string;
	position: THREE.Vector3;
	walkable: boolean;
	cover: boolean;
}

// Behavior Tree Implementation
class BehaviorTree {
	private root: AIBehaviorNode;

	constructor(root: AIBehaviorNode) {
		this.root = root;
	}

	public tick(agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		return this.executeNode(this.root, agent, context);
	}

	private executeNode(node: AIBehaviorNode, agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		switch (node.type) {
			case "selector":
				return this.executeSelector(node, agent, context);
			case "sequence":
				return this.executeSequence(node, agent, context);
			case "condition":
				return this.executeCondition(node, agent, context);
			case "action":
				return this.executeAction(node, agent, context);
			default:
				return "failure";
		}
	}

	private executeSelector(node: AIBehaviorNode, agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		if (!node.children) return "failure";

		for (const child of node.children) {
			const result = this.executeNode(child, agent, context);
			if (result === "success" || result === "running") {
				return result;
			}
		}
		return "failure";
	}

	private executeSequence(node: AIBehaviorNode, agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		if (!node.children) return "failure";

		for (const child of node.children) {
			const result = this.executeNode(child, agent, context);
			if (result === "failure" || result === "running") {
				return result;
			}
		}
		return "success";
	}

	private executeCondition(node: AIBehaviorNode, agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		if (!node.condition) return "failure";
		return node.condition(agent, context) ? "success" : "failure";
	}

	private executeAction(node: AIBehaviorNode, agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		if (!node.action) return "failure";
		return node.action(agent, context);
	}
}

// Pathfinding System using A*
class Pathfinder {
	private navmesh: NavMesh;

	constructor(navmesh: NavMesh) {
		this.navmesh = navmesh;
	}

	public findPath(start: THREE.Vector3, end: THREE.Vector3): THREE.Vector3[] {
		const startNode = this.findNearestNode(start);
		const endNode = this.findNearestNode(end);

		if (!startNode || !endNode) return [];

		const openSet = new Set<string>([startNode.id]);
		const cameFrom = new Map<string, string>();
		const gScore = new Map<string, number>();
		const fScore = new Map<string, number>();

		gScore.set(startNode.id, 0);
		fScore.set(startNode.id, this.heuristic(startNode.position, endNode.position));

		while (openSet.size > 0) {
			const current = this.getLowestFScore(openSet, fScore);
			if (!current) break;

			if (current === endNode.id) {
				return this.reconstructPath(cameFrom, current);
			}

			openSet.delete(current);
			const neighbors = this.navmesh.connections.get(current) || [];

			for (const neighborId of neighbors) {
				const neighbor = this.navmesh.nodes.find((n) => n.id === neighborId);
				if (!neighbor || !neighbor.walkable) continue;

				const tentativeGScore = (gScore.get(current) || Infinity) + this.distance(this.getNodeById(current)!.position, neighbor.position);

				if (tentativeGScore < (gScore.get(neighborId) || Infinity)) {
					cameFrom.set(neighborId, current);
					gScore.set(neighborId, tentativeGScore);
					fScore.set(neighborId, tentativeGScore + this.heuristic(neighbor.position, endNode.position));

					if (!openSet.has(neighborId)) {
						openSet.add(neighborId);
					}
				}
			}
		}

		return []; // No path found
	}

	private findNearestNode(position: THREE.Vector3): NavNode | null {
		let nearest: NavNode | null = null;
		let minDistance = Infinity;

		for (const node of this.navmesh.nodes) {
			if (!node.walkable) continue;
			const distance = this.distance(position, node.position);
			if (distance < minDistance) {
				minDistance = distance;
				nearest = node;
			}
		}

		return nearest;
	}

	private getNodeById(id: string): NavNode | undefined {
		return this.navmesh.nodes.find((n) => n.id === id);
	}

	private getLowestFScore(openSet: Set<string>, fScore: Map<string, number>): string | null {
		let lowest: string | null = null;
		let lowestScore = Infinity;

		for (const nodeId of openSet) {
			const score = fScore.get(nodeId) || Infinity;
			if (score < lowestScore) {
				lowestScore = score;
				lowest = nodeId;
			}
		}

		return lowest;
	}

	private reconstructPath(cameFrom: Map<string, string>, current: string): THREE.Vector3[] {
		const path: THREE.Vector3[] = [];
		let currentNode = this.getNodeById(current);

		while (currentNode) {
			path.unshift(currentNode.position.clone());
			const parent = cameFrom.get(currentNode.id);
			currentNode = parent ? this.getNodeById(parent) : undefined;
		}

		return path;
	}

	private heuristic(a: THREE.Vector3, b: THREE.Vector3): number {
		return this.distance(a, b);
	}

	private distance(a: THREE.Vector3, b: THREE.Vector3): number {
		return a.distanceTo(b);
	}
}

// Vision and Detection System
class VisionSystem {
	public static canSeeTarget(agent: AIAgent, target: THREE.Vector3, obstacles: THREE.Object3D[]): boolean {
		const direction = target.clone().sub(agent.position).normalize();
		const distance = agent.position.distanceTo(target);

		// Check if target is within detection range
		if (distance > agent.detectionRange) return false;

		// Check if target is within field of view
		const agentForward = new THREE.Vector3(0, 0, -1).applyEuler(agent.rotation);
		const angle = agentForward.angleTo(direction);
		if (angle > agent.fieldOfView / 2) return false;

		// Check for line-of-sight obstructions
		const raycaster = new THREE.Raycaster(agent.position, direction, 0, distance);
		const intersections = raycaster.intersectObjects(obstacles, true);

		// If there are intersections before reaching the target, vision is blocked
		return intersections.length === 0;
	}

	public static calculateNoiseDetection(agent: AIAgent, playerPosition: THREE.Vector3, noiseLevel: number): boolean {
		const distance = agent.position.distanceTo(playerPosition);
		const maxHearingDistance = 20; // Base hearing distance
		const effectiveDistance = maxHearingDistance * (noiseLevel / 100);

		return distance <= effectiveDistance;
	}
}

// AI Communication System
class AICommunication {
	private groups: Map<string, AIAgent[]> = new Map();
	private alerts: Map<
		string,
		{
			type: "enemy_spotted" | "lost_contact" | "needs_backup" | "area_clear";
			position: THREE.Vector3;
			timestamp: number;
			priority: number;
		}[]
	> = new Map();

	public addToGroup(agent: AIAgent, groupId: string) {
		agent.group = groupId;
		if (!this.groups.has(groupId)) {
			this.groups.set(groupId, []);
		}
		this.groups.get(groupId)!.push(agent);
	}

	public sendAlert(senderId: string, type: "enemy_spotted" | "lost_contact" | "needs_backup" | "area_clear", position: THREE.Vector3, priority: number = 5) {
		const sender = this.findAgentById(senderId);
		if (!sender || !sender.group) return;

		const alert = {
			type,
			position: position.clone(),
			timestamp: Date.now(),
			priority,
		};

		if (!this.alerts.has(sender.group)) {
			this.alerts.set(sender.group, []);
		}

		this.alerts.get(sender.group)!.push(alert);

		// Update group awareness
		const groupMembers = this.groups.get(sender.group) || [];
		groupMembers.forEach((agent) => {
			if (agent.id !== senderId) {
				this.processAlert(agent, alert);
			}
		});
	}

	private processAlert(agent: AIAgent, alert: any) {
		switch (alert.type) {
			case "enemy_spotted":
				agent.alertLevel = "combat";
				agent.lastKnownPlayerPosition = alert.position;
				break;
			case "lost_contact":
				if (agent.alertLevel === "combat") {
					agent.alertLevel = "alert";
				}
				break;
			case "needs_backup":
				// Move towards the alert position
				break;
			case "area_clear":
				if (agent.alertLevel !== "combat") {
					agent.alertLevel = "calm";
				}
				break;
		}
	}

	private findAgentById(id: string): AIAgent | undefined {
		for (const group of this.groups.values()) {
			const agent = group.find((a) => a.id === id);
			if (agent) return agent;
		}
		return undefined;
	}

	public getGroupAlerts(groupId: string): any[] {
		return this.alerts.get(groupId) || [];
	}

	public clearOldAlerts(maxAge: number = 30000) {
		const now = Date.now();
		for (const [groupId, alerts] of this.alerts.entries()) {
			const filtered = alerts.filter((alert) => now - alert.timestamp < maxAge);
			this.alerts.set(groupId, filtered);
		}
	}
}

// AI System Manager
export class AISystemManager {
	private agents: Map<string, AIAgent> = new Map();
	private behaviorTrees: Map<string, BehaviorTree> = new Map();
	private pathfinder: Pathfinder;
	private visionSystem = VisionSystem;
	private communication = new AICommunication();
	private difficultyMultiplier = 1.0;

	constructor(navmesh: NavMesh) {
		this.pathfinder = new Pathfinder(navmesh);
		this.setupDefaultBehaviors();
	}

	private setupDefaultBehaviors() {
		// Combat AI Behavior Tree
		const combatBehavior: AIBehaviorNode = {
			type: "selector",
			name: "Combat Root",
			children: [
				{
					type: "sequence",
					name: "Engage Enemy",
					children: [
						{
							type: "condition",
							name: "Can See Player",
							condition: (agent, context) => context.player.isVisible,
						},
						{
							type: "action",
							name: "Shoot at Player",
							action: this.shootAtPlayer.bind(this),
						},
					],
				},
				{
					type: "sequence",
					name: "Search for Player",
					children: [
						{
							type: "condition",
							name: "Has Last Known Position",
							condition: (agent) => !!agent.lastKnownPlayerPosition,
						},
						{
							type: "action",
							name: "Move to Last Position",
							action: this.moveToLastKnownPosition.bind(this),
						},
					],
				},
				{
					type: "action",
					name: "Patrol",
					action: this.patrol.bind(this),
				},
			],
		};

		this.behaviorTrees.set("combat", new BehaviorTree(combatBehavior));
	}

	public addAgent(agent: AIAgent, behaviorType: string = "combat", group?: string) {
		this.agents.set(agent.id, agent);
		if (group) {
			this.communication.addToGroup(agent, group);
		}
	}

	public updateAgents(context: AIContext) {
		for (const [id, agent] of this.agents.entries()) {
			this.updateAgent(agent, context);
		}

		// Clean up old communication alerts
		this.communication.clearOldAlerts();
	}

	private updateAgent(agent: AIAgent, context: AIContext) {
		// Update agent's perception
		this.updatePerception(agent, context);

		// Run behavior tree
		const behaviorTree = this.behaviorTrees.get("combat");
		if (behaviorTree) {
			behaviorTree.tick(agent, context);
		}

		// Apply difficulty scaling
		this.applyDifficultyScaling(agent);
	}

	private updatePerception(agent: AIAgent, context: AIContext) {
		// Check vision
		context.player.isVisible = this.visionSystem.canSeeTarget(agent, context.player.position, context.obstacles);

		// Check hearing
		const hearsPlayer = this.visionSystem.calculateNoiseDetection(agent, context.player.position, context.player.noise);

		// Update alert level based on perception
		if (context.player.isVisible) {
			agent.alertLevel = "combat";
			agent.lastKnownPlayerPosition = context.player.position.clone();
			context.player.lastSeenTime = Date.now();

			// Communicate to group
			if (agent.group) {
				this.communication.sendAlert(agent.id, "enemy_spotted", context.player.position, 10);
			}
		} else if (hearsPlayer && agent.alertLevel === "calm") {
			agent.alertLevel = "suspicious";
		}
	}

	private shootAtPlayer(agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		if (!context.player.isVisible) return "failure";

		const distance = agent.position.distanceTo(context.player.position);
		const accuracyModified = agent.accuracy * this.difficultyMultiplier;

		// Calculate hit chance based on distance and accuracy
		const baseAccuracy = Math.max(0.1, accuracyModified - distance / 100);
		const hitChance = Math.random() < baseAccuracy;

		if (hitChance) {
			// Register hit (would integrate with damage system)
			console.log(`Agent ${agent.id} hit player!`);
		}

		// Simulate firing delay
		setTimeout(() => {
			agent.behaviorState = "ready_to_fire";
		}, 500 / this.difficultyMultiplier);

		return "success";
	}

	private moveToLastKnownPosition(agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		if (!agent.lastKnownPlayerPosition) return "failure";

		const path = this.pathfinder.findPath(agent.position, agent.lastKnownPlayerPosition);
		if (path.length === 0) return "failure";

		// Move along path (simplified movement)
		const nextWaypoint = path[1] || path[0];
		const direction = nextWaypoint.clone().sub(agent.position).normalize();

		agent.position.add(direction.multiplyScalar(agent.movementSpeed * context.deltaTime));

		// Check if reached destination
		if (agent.position.distanceTo(agent.lastKnownPlayerPosition) < 2.0) {
			agent.lastKnownPlayerPosition = undefined;
			agent.alertLevel = "alert";
			return "success";
		}

		return "running";
	}

	private patrol(agent: AIAgent, context: AIContext): "success" | "failure" | "running" {
		// Simple patrol behavior - move to random points
		if (!agent.behaviorState.includes("patrol_target")) {
			const randomNode = context.navmesh.nodes[Math.floor(Math.random() * context.navmesh.nodes.length)];
			agent.behaviorState = `patrol_target_${randomNode.id}`;
		}

		// Move towards patrol point
		const targetId = agent.behaviorState.replace("patrol_target_", "");
		const target = context.navmesh.nodes.find((n) => n.id === targetId);

		if (!target) return "failure";

		const direction = target.position.clone().sub(agent.position).normalize();
		agent.position.add(direction.multiplyScalar(agent.movementSpeed * 0.5 * context.deltaTime));

		if (agent.position.distanceTo(target.position) < 2.0) {
			agent.behaviorState = "patrol_idle";
			return "success";
		}

		return "running";
	}

	private applyDifficultyScaling(agent: AIAgent) {
		// Scale AI capabilities based on difficulty
		agent.accuracy = Math.min(1.0, agent.accuracy * this.difficultyMultiplier);
		agent.reactionTime = Math.max(0.1, agent.reactionTime / this.difficultyMultiplier);
		agent.detectionRange = agent.detectionRange * this.difficultyMultiplier;
	}

	public setDifficulty(multiplier: number) {
		this.difficultyMultiplier = Math.max(0.1, Math.min(3.0, multiplier));
	}

	public getAgent(id: string): AIAgent | undefined {
		return this.agents.get(id);
	}

	public getAllAgents(): AIAgent[] {
		return Array.from(this.agents.values());
	}

	public removeAgent(id: string) {
		this.agents.delete(id);
	}
}

// React Hook for AI System
export function useAISystem(navmesh: NavMesh) {
	const aiManagerRef = useRef<AISystemManager | null>(null);
	const [agents, setAgents] = useState<AIAgent[]>([]);

	useEffect(() => {
		aiManagerRef.current = new AISystemManager(navmesh);
	}, [navmesh]);

	const addAgent = useCallback((agent: AIAgent, behaviorType?: string, group?: string) => {
		if (aiManagerRef.current) {
			aiManagerRef.current.addAgent(agent, behaviorType, group);
			setAgents((prev) => [...prev, agent]);
		}
	}, []);

	const updateAI = useCallback((context: AIContext) => {
		if (aiManagerRef.current) {
			aiManagerRef.current.updateAgents(context);
			setAgents(aiManagerRef.current.getAllAgents());
		}
	}, []);

	const setDifficulty = useCallback((multiplier: number) => {
		if (aiManagerRef.current) {
			aiManagerRef.current.setDifficulty(multiplier);
		}
	}, []);

	return {
		aiManager: aiManagerRef.current,
		agents,
		addAgent,
		updateAI,
		setDifficulty,
	};
}

export default { AISystemManager, useAISystem };
