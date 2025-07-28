/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: ["lucide-react", "@react-three/drei", "@react-three/fiber"],
	},
	webpack: (config, { isServer }) => {
		// Handle three.js and other 3D libraries
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				path: false,
				os: false,
			};
		}

		// Handle audio files
		config.module.rules.push({
			test: /\.(wav|mp3|ogg|flac)$/,
			type: "asset/resource",
		});

		return config;
	},
};

export default nextConfig;
