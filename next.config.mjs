/** @type {import('next').NextConfig} */
const nextConfig = {
	// Enable experimental features for better performance
	experimental: {
		optimizePackageImports: ["three", "zustand"],
	},
	turbopack: {
		resolveAlias: {
			canvas: "./src/shared/core/canvas-fallback.js",
		},
	},

	// Configure for game assets and WebGL
	webpack: (config, { isServer }) => {
		// Handle Three.js and WebGL dependencies
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				path: false,
				crypto: false,
			};
		}

		// Handle audio files for the game
		config.module.rules.push({
			test: /\.(ogg|mp3|wav|mpe?g)$/i,
			type: "asset/resource",
			generator: {
				filename: "static/media/[name].[hash][ext]",
			},
		});

		// Handle GLSL shaders
		config.module.rules.push({
			test: /\.(glsl|vs|fs|vert|frag)$/,
			type: "asset/source",
		});

		// Handle game icons and images
		config.module.rules.push({
			test: /\.(png|jpe?g|gif|svg|ico)$/i,
			type: "asset/resource",
			generator: {
				filename: "static/images/[name].[hash][ext]",
			},
		});

		return config;
	},

	// Headers for WebGL and CORS - Development-friendly configuration
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					// Only set COEP/COOP in production for WebGL features that need it
					...(process.env.NODE_ENV === "production"
						? [
								{
									key: "Cross-Origin-Embedder-Policy",
									value: "credentialless",
								},
								{
									key: "Cross-Origin-Opener-Policy",
									value: "same-origin",
								},
						  ]
						: []),
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PUT, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization",
					},
				],
			},
		];
	},

	// Enable static exports for pages that don't need server-side features
	output: "standalone",

	// Optimize images for game assets
	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},

	// Configure TypeScript
	typescript: {
		ignoreBuildErrors: false,
	},

	// SWC minification is enabled by default in Next.js 15+

	// Configure redirects for backward compatibility
	async redirects() {
		return [
			{
				source: "/test.html",
				destination: "/test",
				permanent: true,
			},
			{
				source: "/controller-test.html",
				destination: "/test/controller",
				permanent: true,
			},
			{
				source: "/planet-test.html",
				destination: "/test/planet",
				permanent: true,
			},
			{
				source: "/solar-system-test.html",
				destination: "/test/solar-system",
				permanent: true,
			},
			{
				source: "/galaxy-test.html",
				destination: "/test/galaxy",
				permanent: true,
			},
		];
	},

	// Configure rewrites for API compatibility
	async rewrites() {
		return [
			{
				source: "/ws",
				destination: "/api/websocket",
			},
		];
	},
};

export default nextConfig;
