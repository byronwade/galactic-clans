# 🎵 Audio Integration Template

Use this template to quickly add new audio files to your game system.

## Step 1: Add Audio Entry to `src/shared/audio/game-audio-system.ts`

Copy and modify this template in the `SOUND_EFFECTS` object:

```typescript
// Add this to the SOUND_EFFECTS object
your_sound_name: {
    id: "your_sound_name",
    category: AudioCategory.YOUR_CATEGORY, // Choose from available categories
    path: "/audio/category/your_file.wav", // Path to your audio file
    description: "Description of your sound",
    loop: false, // true for background music/ambient sounds
    volume: 0.7, // 0.0 to 1.0
},
```

## Step 2: Available Categories

Choose the appropriate category for your sound:

### Interface Sounds
- `AudioCategory.CLICK` - Button clicks
- `AudioCategory.CONFIRMATION` - Success sounds
- `AudioCategory.ERROR` - Error notifications
- `AudioCategory.OPEN` - Opening menus/panels
- `AudioCategory.CLOSE` - Closing menus/panels

### Game Sounds
- `AudioCategory.COMBAT` - Battle sounds
- `AudioCategory.WEAPONS` - Weapon firing
- `AudioCategory.EXPLOSIONS` - Explosive sounds
- `AudioCategory.MECHANICAL` - Technology sounds
- `AudioCategory.SPACE` - Sci-fi ambience
- `AudioCategory.ALIEN` - Alien/otherworldly sounds
- `AudioCategory.VEHICLE` - Ship/transport sounds
- `AudioCategory.FOOTSTEPS` - Movement sounds
- `AudioCategory.POWER_UPS` - Collectible sounds
- `AudioCategory.NOTIFICATIONS` - Game alerts

### Music & Ambient
- `AudioCategory.MUSIC` - Background music
- `AudioCategory.AMBIENT` - Environmental sounds
- `AudioCategory.CINEMATIC` - Dramatic moments

## Step 3: Example Integrations

### Combat Sound Example:
```typescript
plasma_rifle_shot: {
    id: "plasma_rifle_shot",
    category: AudioCategory.WEAPONS,
    path: "/audio/weapons/plasma_rifle_shot.wav",
    description: "High-energy plasma rifle discharge",
    loop: false,
    volume: 0.8,
},
```

### Background Music Example:
```typescript
galaxy_exploration: {
    id: "galaxy_exploration",
    category: AudioCategory.MUSIC,
    path: "/audio/music/galaxy_exploration.mp3",
    description: "Peaceful galaxy exploration theme",
    loop: true,
    volume: 0.4,
},
```

### Ambient Sound Example:
```typescript
station_hum: {
    id: "station_hum",
    category: AudioCategory.AMBIENT,
    path: "/audio/ambient/station_hum.wav",
    description: "Low space station ambient hum",
    loop: true,
    volume: 0.2,
},
```

## Step 4: Adding Music to Background Manager

If you're adding background music, also update `src/components/BackgroundMusicManager.tsx`:

```typescript
const BACKGROUND_TRACKS = [
    "epic_march",
    "mystic_plains",
    "space_ambient_2",
    "space_ambient_3", 
    "space_ambient_improved",
    "victory_fanfare",
    "your_new_music_track", // Add your music ID here
];
```

## Step 5: Using Your New Audio

### In Components:
```typescript
import { useGameAudio } from "@/hooks/useGameAudio";

function YourComponent() {
    const { play } = useGameAudio();
    
    const handleAction = async () => {
        await play("your_sound_name");
    };
    
    return (
        <button onClick={handleAction}>
            Play Sound
        </button>
    );
}
```

### With Custom Options:
```typescript
// Play with custom volume
await play("your_sound_name", { volume: 0.5 });

// Play with fade in
await play("your_sound_name", { fadeIn: 1000 }); // 1 second fade
```

## Step 6: Preloading Important Sounds

For sounds that need instant playback, add them to preload lists:

```typescript
const { play } = useGameAudio({
    preloadSounds: [
        "your_critical_sound",
        "button_click",
        "error_alert"
    ]
});
```

## Step 7: Testing

1. Visit `/test/audio` in your game
2. Find your new category
3. Test your sound with the play button
4. Adjust volume and settings as needed

## Quick Checklist

- [ ] Audio file placed in correct `/public/audio/category/` directory
- [ ] Entry added to `SOUND_EFFECTS` object
- [ ] Correct category selected
- [ ] Appropriate volume set (0.0-1.0)
- [ ] Loop setting configured (true for ambient/music)
- [ ] Music track added to `BACKGROUND_TRACKS` if applicable
- [ ] Tested in `/test/audio` page
- [ ] Preloading configured if needed

---

**💡 Pro Tip**: Start with lower volumes (0.3-0.5) and adjust up. It's easier to increase than to fix overly loud sounds! 