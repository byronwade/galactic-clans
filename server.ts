/**
 * @file server.ts
 * @description Bun server for Galactic Clans - serves static files and handles WebSocket connections
 * @version 1.0.0
 * @author Cosmic Gaming Development Team
 */

import { serve, file } from "bun";
import { join } from "path";

const PORT = process.env.PORT || 5173;

// Simple WebSocket connection tracking
const connections = new Set<any>();

const server = serve({
	port: PORT,

	// Serve static files
	async fetch(req, server) {
		const url = new URL(req.url);
		let pathname = url.pathname;

		// Default to index.html for root
		if (pathname === "/") {
			pathname = "/index.html";
		}

		// Handle WebSocket upgrade
		if (pathname === "/ws" || req.headers.get("upgrade") === "websocket") {
			if (server.upgrade(req)) {
				return; // WebSocket upgrade successful
			}
			return new Response("WebSocket upgrade failed", { status: 400 });
		}

		try {
			// Try to serve static file from root directory
			const filePath = join(process.cwd(), pathname.slice(1));
			const staticFile = file(filePath);

			if (await staticFile.exists()) {
				return new Response(staticFile);
			}

			// Try to serve from src directory for development
			const srcPath = join(process.cwd(), "src", pathname.slice(1));
			const srcFile = file(srcPath);

			if (await srcFile.exists()) {
				return new Response(srcFile);
			}

			// 404 for missing files
			return new Response("File not found", { status: 404 });
		} catch (error) {
			console.error("Error serving file:", error);
			return new Response("Internal server error", { status: 500 });
		}
	},

	// WebSocket handling
	websocket: {
		message(ws, message) {
			console.log(`🔗 [WS] Received message:`, message);

			// Echo message back to all connected clients
			connections.forEach((connection) => {
				if (connection !== ws) {
					connection.send(message);
				}
			});
		},

		open(ws) {
			connections.add(ws);
			console.log(`🔗 [WS] Client connected. Total connections: ${connections.size}`);

			// Send welcome message
			ws.send(
				JSON.stringify({
					type: "welcome",
					data: { message: "Connected to Galactic Clans server" },
				})
			);
		},

		close(ws) {
			connections.delete(ws);
			console.log(`🔗 [WS] Client disconnected. Total connections: ${connections.size}`);
		},

		// Note: Bun's WebSocket doesn't have error handler in this version,
	},
});

console.log(`🎮 [SERVER] Galactic Clans server started on port ${PORT}`);
console.log(`🌐 [INFO] Game available at http://localhost:${PORT}`);
console.log(`🎮 [INFO] Controller test: http://localhost:${PORT}/controller-test.html`);
console.log(`🌍 [INFO] Planet test: http://localhost:${PORT}/planet-test.html`);
console.log(`☀️ [INFO] Solar system test: http://localhost:${PORT}/solar-system-test.html`);
console.log(`🌌 [INFO] Galaxy test: http://localhost:${PORT}/galaxy-test.html`);
console.log(`🧪 [INFO] Test suite: http://localhost:${PORT}/test/`);

// Graceful shutdown
process.on("SIGINT", () => {
	console.log("🔄 [SERVER] Shutting down gracefully...");
	server.stop();
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.log("🔄 [SERVER] Shutting down gracefully...");
	server.stop();
	process.exit(0);
});
