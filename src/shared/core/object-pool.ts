/**
 * @file object-pool.ts
 * @description Minimal object pooling system for Next.js compatibility
 * @version 1.0.0
 */

export class PoolManager {
	private static instance: PoolManager;
	private pools = new Map<string, any[]>();

	static getInstance(): PoolManager {
		if (!PoolManager.instance) {
			PoolManager.instance = new PoolManager();
		}
		return PoolManager.instance;
	}

	getPool<T>(name: string): T[] {
		if (!this.pools.has(name)) {
			this.pools.set(name, []);
		}
		return this.pools.get(name) as T[];
	}

	addToPool<T>(name: string, item: T): void {
		const pool = this.getPool<T>(name);
		pool.push(item);
	}

	getFromPool<T>(name: string): T | null {
		const pool = this.getPool<T>(name);
		return pool.pop() || null;
	}

	clearPool(name: string): void {
		this.pools.delete(name);
	}

	clearAllPools(): void {
		this.pools.clear();
	}
}

export class GameObjectPools {
	private static poolManager = PoolManager.getInstance();

	static getParticle(): any {
		return GameObjectPools.poolManager.getFromPool("particles");
	}

	static returnParticle(particle: any): void {
		GameObjectPools.poolManager.addToPool("particles", particle);
	}

	static getBullet(): any {
		return GameObjectPools.poolManager.getFromPool("bullets");
	}

	static returnBullet(bullet: any): void {
		GameObjectPools.poolManager.addToPool("bullets", bullet);
	}

	static getEffect(): any {
		return GameObjectPools.poolManager.getFromPool("effects");
	}

	static returnEffect(effect: any): void {
		GameObjectPools.poolManager.addToPool("effects", effect);
	}
}
