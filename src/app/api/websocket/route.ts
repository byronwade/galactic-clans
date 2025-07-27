import { NextRequest } from "next/server";

const connections = new Set<any>();

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	// Handle WebSocket upgrade request
	if (request.headers.get("upgrade") !== "websocket") {
		return new Response("Expected WebSocket upgrade", { status: 400 });
	}

	// For Next.js, we'll return instructions on how to connect
	// The actual WebSocket server will be handled by the Bun server
	return new Response(
		JSON.stringify({
			message: "WebSocket endpoint available",
			endpoint: "ws://localhost:5173/ws",
			instructions: "Connect to the WebSocket endpoint using the provided URL",
		}),
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
}

// Handle other HTTP methods
export async function POST(request: NextRequest) {
	const body = await request.json();

	// Handle WebSocket-related HTTP requests
	console.log("🔗 [WS API] Received HTTP request:", body);

	return new Response(
		JSON.stringify({
			status: "received",
			timestamp: new Date().toISOString(),
		}),
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
}
