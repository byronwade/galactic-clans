/**
 * @file shadcn-menu-demo.ts
 * @description Demo showcasing the new Shadcn main menu system
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * @created 2024-01-15
 */

import { ShadcnMainMenu } from "./shared/ui/shadcn-main-menu";

// Initialize and show the modern Shadcn menu
async function initializeShadcnMenuDemo() {
	try {
		console.log("🎮 [DEMO] Initializing Shadcn Main Menu Demo...");

		// Create the new menu system
		const modernMenu = new ShadcnMainMenu({
			showLoadingScreen: true,
			fadeTransitions: true,
			planetAnimation: true,
			particleEffects: true,
		});

		// Set up menu callbacks
		modernMenu.setCallbacks({
			onPlay: () => {
				console.log("🚀 [DEMO] Starting Galactic Clans...");
				alert("🚀 Starting Galactic Clans!\n\nThis would transition to the main game.");
			},
			onSettings: () => {
				console.log("⚙️ [DEMO] Opening Settings...");
				alert("⚙️ Settings would open here with our Shadcn components!");
			},
			onProfile: () => {
				console.log("👤 [DEMO] Opening Profile...");
				alert("👤 Player profile would display with achievements and stats!");
			},
			onQuit: () => {
				console.log("🚪 [DEMO] Quit requested...");
				if (confirm("🚪 Are you sure you want to quit Galactic Clans?")) {
					window.close();
				}
			},
		});

		// Initialize the menu (this handles the loading screen and prevents UI flash)
		await modernMenu.initialize();

		console.log("✅ [DEMO] Shadcn Main Menu Demo ready!");
		console.log("🌟 Features:");
		console.log("  - No UI flash on load");
		console.log("  - Modern Shadcn components");
		console.log("  - Animated 3D planet");
		console.log("  - Smooth loading transitions");
		console.log("  - Consistent design system");

		// Store reference globally for testing
		(window as any).modernMenu = modernMenu;
	} catch (error) {
		console.error("❌ [DEMO] Failed to initialize Shadcn menu:", error);

		// Fallback message
		document.body.innerHTML = `
            <div class="fixed inset-0 bg-slate-950 flex items-center justify-center">
                <div class="text-center text-white">
                    <h1 class="text-2xl font-bold mb-4">Galactic Clans</h1>
                    <p class="text-slate-400">Failed to load modern menu</p>
                    <p class="text-sm text-slate-500 mt-2">Error: ${error instanceof Error ? error.message : String(error)}</p>
                </div>
            </div>
        `;
	}
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeShadcnMenuDemo);
} else {
	initializeShadcnMenuDemo();
}

export { initializeShadcnMenuDemo };
