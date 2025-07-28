"use client";

import { useRouter } from "next/navigation";

interface TestItem {
	title: string;
	href: string;
}

const testItems: TestItem[] = [
	{ title: "Audio Test", href: "/test/audio" },
	{ title: "Planet Test", href: "/test/planet" },
	{ title: "Galaxy Test", href: "/test/galaxy" },
];

function MinimalCard({ item }: { item: TestItem }) {
	const router = useRouter();

	return (
		<div className="border border-gray-700 bg-gray-800 rounded-lg p-4 hover:border-blue-500 transition-colors">
			<h3 className="text-white font-semibold mb-2">{item.title}</h3>
			<button
				onClick={() => {
					console.log(`Navigating to: ${item.href}`);
					router.push(item.href);
				}}
				className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
			>
				Launch
			</button>
		</div>
	);
}

export default function MinimalTestPage() {
	return (
		<div className="min-h-screen bg-black text-white p-8">
			<h1 className="text-2xl font-bold mb-6">Minimal Test Cards</h1>
			<p className="mb-8 text-gray-400">
				These cards have NO group classes, NO overlays, NO complex styling.
				If these work, the issue is in the main TestCard component.
			</p>
			
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
				{testItems.map((item) => (
					<MinimalCard key={item.title} item={item} />
				))}
			</div>

			<div className="mt-8">
				<button
					onClick={() => window.location.href = "/test"}
					className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
				>
					← Back to Main Test
				</button>
			</div>
		</div>
	);
} 