// Basic Service Worker for Cosmic Application
// This service worker provides basic caching and offline functionality

const CACHE_NAME = "cosmic-v1";
const urlsToCache = ["/", "/test", "/test/audio", "/test/planet", "/test/galaxy", "/test/star", "/test/solar-system", "/test/blackhole", "/test/settings", "/test/menu", "/test/controller", "/favicon.png", "/manifest.json"];

// Install Service Worker
self.addEventListener("install", (event) => {
	console.log("🔧 [SW] Installing service worker...");
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log("📦 [SW] Caching app shell");
				return cache.addAll(urlsToCache);
			})
			.catch((error) => {
				console.warn("⚠️ [SW] Cache installation failed:", error);
			})
	);
});

// Fetch Event
self.addEventListener("fetch", (event) => {
	// Skip caching for audio files and API routes
	if (event.request.url.includes("/audio/") || event.request.url.includes("/api/") || event.request.method !== "GET") {
		return;
	}

	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				// Return cached version or fetch from network
				return response || fetch(event.request);
			})
			.catch(() => {
				// Return offline page for navigation requests
				if (event.request.mode === "navigate") {
					return caches.match("/");
				}
			})
	);
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
	console.log("✅ [SW] Service worker activated");
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log("🗑️ [SW] Deleting old cache:", cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
