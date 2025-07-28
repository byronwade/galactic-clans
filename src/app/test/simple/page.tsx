"use client";

import { useRouter } from "next/navigation";

export default function SimpleTestPage() {
	const router = useRouter();

	const handleNavigation = (path: string) => {
		console.log(`Navigating to: ${path}`);
		router.push(path);
	};

	return (
		<div style={{ padding: "20px", backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
			<h1>Simple Test Page - No Overlays</h1>
			<p>This page has zero complex components to test button functionality.</p>
			
			<div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "200px" }}>
				<button 
					onClick={() => handleNavigation("/test/audio")}
					style={{
						padding: "10px 15px",
						backgroundColor: "#0066cc",
						color: "#fff",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					Audio Test
				</button>
				
				<button 
					onClick={() => handleNavigation("/test/planet")}
					style={{
						padding: "10px 15px",
						backgroundColor: "#0066cc",
						color: "#fff",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					Planet Test
				</button>
				
				<button 
					onClick={() => handleNavigation("/test")}
					style={{
						padding: "10px 15px",
						backgroundColor: "#cc6600",
						color: "#fff",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer"
					}}
				>
					Main Test Suite
				</button>
			</div>

			<div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#333", borderRadius: "5px" }}>
				<h3>Instructions:</h3>
				<ol>
					<li>These buttons use only inline styles</li>
					<li>No Tailwind CSS classes</li>
					<li>No complex components</li>
					<li>No overlays or gradients</li>
					<li>If these work, the issue is in the main test page</li>
				</ol>
			</div>
		</div>
	);
} 