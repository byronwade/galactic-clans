# 🎵 Audio Expansion Guide for Galactic Clans

This guide will help you download and integrate additional sounds and music into your game.

## 📁 Directory Structure

Create these directories in your `public/audio/` folder:

```
public/audio/
├── combat/
├── weapons/ 
├── explosions/
├── mechanical/
├── nature/
├── space/
├── alien/
├── vehicles/
├── footsteps/
├── voice/
├── powerups/
├── notifications/
└── music/
```

## 🎮 Recommended Audio Sources

### **Free High-Quality Sources:**

#### **Freesound.org** (CC-Licensed)
- **Combat**: Search "sword clash", "metal hit", "battle"
- **Weapons**: Search "laser shot", "gun fire", "plasma"
- **Explosions**: Search "explosion", "blast", "bomb"
- **Space**: Search "space ambient", "radar ping", "sci-fi"

#### **Kenney.nl** (Public Domain)
- **Digital Audio Package**: https://kenney.nl/assets/digital-audio
- **Sci-Fi Sounds**: https://kenney.nl/assets/sci-fi-sounds
- **RPG Audio**: https://kenney.nl/assets/rpg-audio

#### **Zapsplat** (Free Account)
- Professional game audio library
- High-quality sci-fi and fantasy sounds

### **Music Sources:**

#### **Incompetech (Kevin MacLeod)**
- **Battle Music**: "Invariably", "Come Play with Me", "Volatile Reaction"
- **Ambient**: "Mystic Grooves", "Ambience"
- **Exploration**: "Atlantis", "Cipher"

#### **Free Music Archive**
- Search for "sci-fi", "space", "ambient", "electronic"

## 🔧 How to Add New Audio Files

### Step 1: Download and Organize
1. Download audio files from the sources above
2. Convert to `.wav` or `.mp3` format if needed
3. Place files in the appropriate `public/audio/` subdirectories
4. Use descriptive filenames (e.g., `laser_shot_01.wav`)

### Step 2: Update the Audio System
Once you have files, update the paths in `src/shared/audio/game-audio-system.ts`:

```typescript
// Example: Replace placeholder with actual file
sword_clash: {
    id: "sword_clash",
    category: AudioCategory.COMBAT,
    path: "/audio/combat/sword_clash.wav", // ← Your downloaded file
    description: "Metal sword clashing sound",
    loop: false,
    volume: 0.7,
},
```

### Step 3: Enable Background Music
In `src/components/BackgroundMusicManager.tsx`, uncomment new tracks:

```typescript
const BACKGROUND_TRACKS = [
    "epic_march",
    "mystic_plains", 
    "space_ambient_2",
    "space_ambient_3",
    "space_ambient_improved",
    "victory_fanfare",
    "battle_theme",        // ← Uncomment when file added
    "exploration_theme",   // ← Uncomment when file added
    "menu_theme"          // ← Uncomment when file added
];
```

## 🎨 Audio File Specifications

### **Recommended Formats:**
- **UI Sounds**: `.wav` (16-bit, 44.1kHz)
- **Music**: `.mp3` (320kbps) or `.wav`
- **File Size**: Keep individual files under 5MB

### **Naming Convention:**
```
category_description_variant.extension
Examples:
- laser_shot_01.wav
- explosion_large_debris.wav
- battle_theme_intense.mp3
- footstep_metal_heavy.wav
```

## 🚀 Quick Start Downloads

### Essential Game Sounds (Download These First):

1. **Combat Pack:**
   - Sword clashing sounds
   - Energy weapon shots
   - Shield impacts

2. **Space Pack:**
   - Engine humming
   - Radar pings
   - Ambient space drones

3. **UI Enhancement Pack:**
   - Power-up collection sounds
   - Mission completion chimes
   - Alert notifications

4. **Music Pack:**
   - Battle background music
   - Exploration ambient tracks
   - Victory/defeat stingers

## 📝 Example File Downloads

### From Freesound.org:
```bash
# Search terms for good results:
- "laser shot sci-fi"
- "explosion debris"
- "metal footstep"
- "engine hum spaceship"
- "radar ping sonar"
```

### From Incompetech:
```bash
# Recommended tracks:
- "Invariably" (Battle music)
- "Atlantis" (Exploration)
- "Cipher" (Mysterious ambient)
- "Come Play with Me" (Action)
```

## 🔊 Audio Integration Examples

### Playing Combat Sounds:
```typescript
const { play } = useGameAudio();

// Play weapon sound
await play("laser_shot");

// Play with custom volume
await play("explosion_large", { volume: 0.8 });
```

### Background Music Control:
```typescript
// In your game components
<BackgroundMusicManager 
    autoStart={true} 
    initialTrack="exploration_theme" 
/>
```

## ⚡ Performance Tips

1. **Preload Important Sounds:**
   ```typescript
   const { play } = useGameAudio({
       preloadSounds: ["laser_shot", "explosion_large", "power_up_collect"]
   });
   ```

2. **Use Appropriate Volumes:**
   - UI sounds: 0.5-0.7
   - Background music: 0.3-0.5
   - Combat sounds: 0.6-0.8

3. **Optimize File Sizes:**
   - Compress music files
   - Use shorter samples for repetitive sounds
   - Consider looping for ambient tracks

## 🎯 Test Your Audio

Visit `/test/audio` to test all your new sounds and music in the comprehensive audio demo!

## 📚 Additional Resources

Based on the web search results:
- [How to use audio MP3 files in Next.js](https://www.debasish.tech/blogs/how-to-use-audio-mp3-files-in-next-js)
- [Adding Sound to a React Project](https://dev.to/daveguz97/adding-sound-to-a-react-project-51m3)
- [JavaScript in Plain English - Loading MP3s](https://javascript.plainenglish.io/one-step-to-load-mp3-in-react-b952250912e2)

---

Happy audio hunting! 🎵🚀 