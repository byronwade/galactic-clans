#!/usr/bin/env node

/**
 * Audio Directory Setup Script
 * Creates the recommended directory structure for game audio files
 */

const fs = require("fs");
const path = require("path");

const AUDIO_DIRECTORIES = ["public/audio/combat", "public/audio/weapons", "public/audio/explosions", "public/audio/mechanical", "public/audio/nature", "public/audio/space", "public/audio/alien", "public/audio/vehicles", "public/audio/footsteps", "public/audio/voice", "public/audio/powerups", "public/audio/notifications", "public/audio/music"];

const README_CONTENT = `# Audio Directory

This directory contains game audio files organized by category.

## Directory Structure:
- \`combat/\` - Battle and fighting sounds
- \`weapons/\` - Weapon firing and impact sounds  
- \`explosions/\` - Explosive and destructive sounds
- \`mechanical/\` - Machinery and technology sounds
- \`nature/\` - Environmental and weather sounds
- \`space/\` - Sci-fi and space-themed sounds
- \`alien/\` - Extraterrestrial and otherworldly sounds
- \`vehicles/\` - Transportation and engine sounds
- \`footsteps/\` - Character movement sounds
- \`voice/\` - Character voices and speech
- \`powerups/\` - Collectible and enhancement sounds
- \`notifications/\` - Alert and notification sounds
- \`music/\` - Background music tracks

## File Formats:
- UI Sounds: .wav (16-bit, 44.1kHz)
- Music: .mp3 (320kbps) or .wav
- Keep files under 5MB each

## Naming Convention:
\`category_description_variant.extension\`

Examples:
- laser_shot_01.wav
- explosion_large_debris.wav
- battle_theme_intense.mp3

See AUDIO_EXPANSION_GUIDE.md for detailed information on downloading and adding audio files.
`;

function createDirectory(dirPath) {
	try {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
			console.log(`✅ Created: ${dirPath}`);
		} else {
			console.log(`📁 Already exists: ${dirPath}`);
		}
	} catch (error) {
		console.error(`❌ Failed to create ${dirPath}:`, error.message);
	}
}

function createReadme() {
	const readmePath = "public/audio/README.md";
	try {
		fs.writeFileSync(readmePath, README_CONTENT);
		console.log(`📖 Created: ${readmePath}`);
	} catch (error) {
		console.error(`❌ Failed to create README:`, error.message);
	}
}

function main() {
	console.log("🎵 Setting up audio directory structure...\n");

	// Create all audio directories
	AUDIO_DIRECTORIES.forEach(createDirectory);

	// Create README
	createReadme();

	console.log("\n🎉 Audio directory setup complete!");
	console.log("\n📝 Next steps:");
	console.log("1. Download audio files from the sources in AUDIO_EXPANSION_GUIDE.md");
	console.log("2. Place files in the appropriate directories");
	console.log("3. Update file paths in src/shared/audio/game-audio-system.ts");
	console.log("4. Test your audio at /test/audio");
	console.log("\n🎮 Happy game development!");
}

if (require.main === module) {
	main();
}

module.exports = { createDirectory, AUDIO_DIRECTORIES };
