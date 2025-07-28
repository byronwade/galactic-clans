/**
 * @file game-audio-system.ts
 * @description Comprehensive audio system for Galactic Clans incorporating all interface sounds and background music
 * @version 1.0.0
 * @author Galactic Clans Development Team
 * @created 2025-01-27
 *
 * @purpose Manages all UI, game audio, and background music with categorized sound effects
 * @dependencies HTML5 Audio API, React hooks
 * @exports GameAudioSystem class, AudioCategory enum, sound effect mappings
 */

export enum AudioCategory {
	BACK = "back",
	CLICK = "click",
	CLOSE = "close",
	CONFIRMATION = "confirmation",
	DROP = "drop",
	ERROR = "error",
	GLASS = "glass",
	GLITCH = "glitch",
	MAXIMIZE = "maximize",
	MINIMIZE = "minimize",
	OPEN = "open",
	PLUCK = "pluck",
	QUESTION = "question",
	SCRATCH = "scratch",
	SCROLL = "scroll",
	SELECT = "select",
	SWITCH = "switch",
	TICK = "tick",
	TOGGLE = "toggle",
	BONG = "bong",
	PROGRAMMATIC = "programmatic",
	// Background Music Categories
	MUSIC = "music",
	AMBIENT = "ambient",
	CINEMATIC = "cinematic",
	// Game-Specific Sound Categories
	COMBAT = "combat",
	WEAPONS = "weapons",
	EXPLOSIONS = "explosions",
	MECHANICAL = "mechanical",
	NATURE = "nature",
	SPACE = "space",
	ALIEN = "alien",
	VEHICLE = "vehicle",
	FOOTSTEPS = "footsteps",
	VOICE = "voice",
	POWER_UPS = "power_ups",
	NOTIFICATIONS = "notifications",
}

export interface AudioConfig {
	volume: number;
	enabled: boolean;
	preload: boolean;
	fadeIn?: number;
	fadeOut?: number;
	loop?: boolean;
}

export interface SoundEffect {
	id: string;
	category: AudioCategory;
	path: string;
	description: string;
	variants?: number;
	loop?: boolean;
	volume?: number;
}

// Comprehensive sound effects library
export const SOUND_EFFECTS: Record<string, SoundEffect> = {
	// Back/Navigation Sounds
	back_subtle: {
		id: "back_001",
		category: AudioCategory.BACK,
		path: "/audio/kenney_interface_sounds/back_001.wav",
		description: "Subtle back navigation sound",
	},
	back_soft: {
		id: "back_002",
		category: AudioCategory.BACK,
		path: "/audio/kenney_interface_sounds/back_002.wav",
		description: "Soft back navigation sound",
	},
	back_quick: {
		id: "back_003",
		category: AudioCategory.BACK,
		path: "/audio/kenney_interface_sounds/back_003.wav",
		description: "Quick back navigation sound",
	},
	back_deep: {
		id: "back_004",
		category: AudioCategory.BACK,
		path: "/audio/kenney_interface_sounds/back_004.wav",
		description: "Deep back navigation sound",
	},

	// Click Sounds
	click_sharp: {
		id: "click_001",
		category: AudioCategory.CLICK,
		path: "/audio/kenney_interface_sounds/click_001.wav",
		description: "Sharp click sound",
	},
	click_soft: {
		id: "click_002",
		category: AudioCategory.CLICK,
		path: "/audio/kenney_interface_sounds/click_002.wav",
		description: "Soft click sound",
	},
	click_crisp: {
		id: "click_003",
		category: AudioCategory.CLICK,
		path: "/audio/kenney_interface_sounds/click_003.wav",
		description: "Crisp click sound",
	},
	click_metallic: {
		id: "click_004",
		category: AudioCategory.CLICK,
		path: "/audio/kenney_interface_sounds/click_004.wav",
		description: "Metallic click sound",
	},
	click_wooden: {
		id: "click_005",
		category: AudioCategory.CLICK,
		path: "/audio/kenney_interface_sounds/click_005.wav",
		description: "Wooden click sound",
	},

	// Close Sounds
	close_gentle: {
		id: "close_001",
		category: AudioCategory.CLOSE,
		path: "/audio/kenney_interface_sounds/close_001.wav",
		description: "Gentle close sound",
	},
	close_firm: {
		id: "close_002",
		category: AudioCategory.CLOSE,
		path: "/audio/kenney_interface_sounds/close_002.wav",
		description: "Firm close sound",
	},
	close_snap: {
		id: "close_003",
		category: AudioCategory.CLOSE,
		path: "/audio/kenney_interface_sounds/close_003.wav",
		description: "Snap close sound",
	},
	close_whoosh: {
		id: "close_004",
		category: AudioCategory.CLOSE,
		path: "/audio/kenney_interface_sounds/close_004.wav",
		description: "Whoosh close sound",
	},

	// Confirmation Sounds
	confirm_success: {
		id: "confirmation_001",
		category: AudioCategory.CONFIRMATION,
		path: "/audio/kenney_interface_sounds/confirmation_001.wav",
		description: "Success confirmation",
	},
	confirm_positive: {
		id: "confirmation_002",
		category: AudioCategory.CONFIRMATION,
		path: "/audio/kenney_interface_sounds/confirmation_002.wav",
		description: "Positive confirmation",
	},
	confirm_complete: {
		id: "confirmation_003",
		category: AudioCategory.CONFIRMATION,
		path: "/audio/kenney_interface_sounds/confirmation_003.wav",
		description: "Task complete confirmation",
	},
	confirm_achievement: {
		id: "confirmation_004",
		category: AudioCategory.CONFIRMATION,
		path: "/audio/kenney_interface_sounds/confirmation_004.wav",
		description: "Achievement confirmation",
	},

	// Drop/Drag Sounds
	drop_soft: {
		id: "drop_001",
		category: AudioCategory.DROP,
		path: "/audio/kenney_interface_sounds/drop_001.wav",
		description: "Soft drop sound",
	},
	drop_heavy: {
		id: "drop_002",
		category: AudioCategory.DROP,
		path: "/audio/kenney_interface_sounds/drop_002.wav",
		description: "Heavy drop sound",
	},
	drop_bounce: {
		id: "drop_003",
		category: AudioCategory.DROP,
		path: "/audio/kenney_interface_sounds/drop_003.wav",
		description: "Bouncy drop sound",
	},
	drop_thud: {
		id: "drop_004",
		category: AudioCategory.DROP,
		path: "/audio/kenney_interface_sounds/drop_004.wav",
		description: "Thud drop sound",
	},

	// Error Sounds
	error_alert: {
		id: "error_001",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_001.wav",
		description: "Alert error sound",
	},
	error_warning: {
		id: "error_002",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_002.wav",
		description: "Warning error sound",
	},
	error_critical: {
		id: "error_003",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_003.wav",
		description: "Critical error sound",
	},
	error_buzz: {
		id: "error_004",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_004.wav",
		description: "Buzz error sound",
	},
	error_beep: {
		id: "error_005",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_005.wav",
		description: "Beep error sound",
	},
	error_deny: {
		id: "error_006",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_006.wav",
		description: "Deny error sound",
	},
	error_negative: {
		id: "error_007",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_007.wav",
		description: "Negative error sound",
	},
	error_fail: {
		id: "error_008",
		category: AudioCategory.ERROR,
		path: "/audio/kenney_interface_sounds/error_008.wav",
		description: "Fail error sound",
	},

	// Glass/Crystal Sounds
	glass_chime: {
		id: "glass_001",
		category: AudioCategory.GLASS,
		path: "/audio/kenney_interface_sounds/glass_001.wav",
		description: "Glass chime sound",
	},
	glass_clink: {
		id: "glass_002",
		category: AudioCategory.GLASS,
		path: "/audio/kenney_interface_sounds/glass_002.wav",
		description: "Glass clink sound",
	},
	glass_ping: {
		id: "glass_003",
		category: AudioCategory.GLASS,
		path: "/audio/kenney_interface_sounds/glass_003.wav",
		description: "Glass ping sound",
	},
	glass_break: {
		id: "glass_004",
		category: AudioCategory.GLASS,
		path: "/audio/kenney_interface_sounds/glass_004.wav",
		description: "Glass break sound",
	},
	glass_shatter: {
		id: "glass_005",
		category: AudioCategory.GLASS,
		path: "/audio/kenney_interface_sounds/glass_005.wav",
		description: "Glass shatter sound",
	},
	glass_crystal: {
		id: "glass_006",
		category: AudioCategory.GLASS,
		path: "/audio/kenney_interface_sounds/glass_006.wav",
		description: "Crystal glass sound",
	},

	// Glitch/Digital Sounds
	glitch_static: {
		id: "glitch_001",
		category: AudioCategory.GLITCH,
		path: "/audio/kenney_interface_sounds/glitch_001.wav",
		description: "Static glitch sound",
	},
	glitch_digital: {
		id: "glitch_002",
		category: AudioCategory.GLITCH,
		path: "/audio/kenney_interface_sounds/glitch_002.wav",
		description: "Digital glitch sound",
	},
	glitch_corrupt: {
		id: "glitch_003",
		category: AudioCategory.GLITCH,
		path: "/audio/kenney_interface_sounds/glitch_003.wav",
		description: "Corrupt glitch sound",
	},
	glitch_interference: {
		id: "glitch_004",
		category: AudioCategory.GLITCH,
		path: "/audio/kenney_interface_sounds/glitch_004.wav",
		description: "Interference glitch sound",
	},

	// Maximize/Expand Sounds
	maximize_expand: {
		id: "maximize_001",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_001.wav",
		description: "Expand maximize sound",
	},
	maximize_grow: {
		id: "maximize_002",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_002.wav",
		description: "Grow maximize sound",
	},
	maximize_bloom: {
		id: "maximize_003",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_003.wav",
		description: "Bloom maximize sound",
	},
	maximize_unfold: {
		id: "maximize_004",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_004.wav",
		description: "Unfold maximize sound",
	},
	maximize_open: {
		id: "maximize_005",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_005.wav",
		description: "Open maximize sound",
	},
	maximize_rise: {
		id: "maximize_006",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_006.wav",
		description: "Rise maximize sound",
	},
	maximize_swell: {
		id: "maximize_007",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_007.wav",
		description: "Swell maximize sound",
	},
	maximize_zoom: {
		id: "maximize_008",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_008.wav",
		description: "Zoom maximize sound",
	},
	maximize_burst: {
		id: "maximize_009",
		category: AudioCategory.MAXIMIZE,
		path: "/audio/kenney_interface_sounds/maximize_009.wav",
		description: "Burst maximize sound",
	},

	// Minimize/Collapse Sounds
	minimize_shrink: {
		id: "minimize_001",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_001.wav",
		description: "Shrink minimize sound",
	},
	minimize_collapse: {
		id: "minimize_002",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_002.wav",
		description: "Collapse minimize sound",
	},
	minimize_fold: {
		id: "minimize_003",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_003.wav",
		description: "Fold minimize sound",
	},
	minimize_compress: {
		id: "minimize_004",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_004.wav",
		description: "Compress minimize sound",
	},
	minimize_hide: {
		id: "minimize_005",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_005.wav",
		description: "Hide minimize sound",
	},
	minimize_duck: {
		id: "minimize_006",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_006.wav",
		description: "Duck minimize sound",
	},
	minimize_retract: {
		id: "minimize_007",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_007.wav",
		description: "Retract minimize sound",
	},
	minimize_close: {
		id: "minimize_008",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_008.wav",
		description: "Close minimize sound",
	},
	minimize_fade: {
		id: "minimize_009",
		category: AudioCategory.MINIMIZE,
		path: "/audio/kenney_interface_sounds/minimize_009.wav",
		description: "Fade minimize sound",
	},

	// Open Sounds
	open_reveal: {
		id: "open_001",
		category: AudioCategory.OPEN,
		path: "/audio/kenney_interface_sounds/open_001.wav",
		description: "Reveal open sound",
	},
	open_slide: {
		id: "open_002",
		category: AudioCategory.OPEN,
		path: "/audio/kenney_interface_sounds/open_002.wav",
		description: "Slide open sound",
	},
	open_unfold: {
		id: "open_003",
		category: AudioCategory.OPEN,
		path: "/audio/kenney_interface_sounds/open_003.wav",
		description: "Unfold open sound",
	},
	open_emerge: {
		id: "open_004",
		category: AudioCategory.OPEN,
		path: "/audio/kenney_interface_sounds/open_004.wav",
		description: "Emerge open sound",
	},

	// Pluck/String Sounds
	pluck_string: {
		id: "pluck_001",
		category: AudioCategory.PLUCK,
		path: "/audio/kenney_interface_sounds/pluck_001.wav",
		description: "String pluck sound",
	},
	pluck_harp: {
		id: "pluck_002",
		category: AudioCategory.PLUCK,
		path: "/audio/kenney_interface_sounds/pluck_002.wav",
		description: "Harp pluck sound",
	},

	// Question/Query Sounds
	question_curious: {
		id: "question_001",
		category: AudioCategory.QUESTION,
		path: "/audio/kenney_interface_sounds/question_001.wav",
		description: "Curious question sound",
	},
	question_prompt: {
		id: "question_002",
		category: AudioCategory.QUESTION,
		path: "/audio/kenney_interface_sounds/question_002.wav",
		description: "Prompt question sound",
	},
	question_inquiry: {
		id: "question_003",
		category: AudioCategory.QUESTION,
		path: "/audio/kenney_interface_sounds/question_003.wav",
		description: "Inquiry question sound",
	},
	question_wonder: {
		id: "question_004",
		category: AudioCategory.QUESTION,
		path: "/audio/kenney_interface_sounds/question_004.wav",
		description: "Wonder question sound",
	},

	// Scratch Sounds
	scratch_vinyl: {
		id: "scratch_001",
		category: AudioCategory.SCRATCH,
		path: "/audio/kenney_interface_sounds/scratch_001.wav",
		description: "Vinyl scratch sound",
	},
	scratch_rough: {
		id: "scratch_002",
		category: AudioCategory.SCRATCH,
		path: "/audio/kenney_interface_sounds/scratch_002.wav",
		description: "Rough scratch sound",
	},
	scratch_record: {
		id: "scratch_003",
		category: AudioCategory.SCRATCH,
		path: "/audio/kenney_interface_sounds/scratch_003.wav",
		description: "Record scratch sound",
	},
	scratch_scrape: {
		id: "scratch_004",
		category: AudioCategory.SCRATCH,
		path: "/audio/kenney_interface_sounds/scratch_004.wav",
		description: "Scrape scratch sound",
	},
	scratch_drag: {
		id: "scratch_005",
		category: AudioCategory.SCRATCH,
		path: "/audio/kenney_interface_sounds/scratch_005.wav",
		description: "Drag scratch sound",
	},

	// Scroll Sounds
	scroll_smooth: {
		id: "scroll_001",
		category: AudioCategory.SCROLL,
		path: "/audio/kenney_interface_sounds/scroll_001.wav",
		description: "Smooth scroll sound",
	},
	scroll_wheel: {
		id: "scroll_002",
		category: AudioCategory.SCROLL,
		path: "/audio/kenney_interface_sounds/scroll_002.wav",
		description: "Wheel scroll sound",
	},
	scroll_page: {
		id: "scroll_003",
		category: AudioCategory.SCROLL,
		path: "/audio/kenney_interface_sounds/scroll_003.wav",
		description: "Page scroll sound",
	},
	scroll_list: {
		id: "scroll_004",
		category: AudioCategory.SCROLL,
		path: "/audio/kenney_interface_sounds/scroll_004.wav",
		description: "List scroll sound",
	},
	scroll_fast: {
		id: "scroll_005",
		category: AudioCategory.SCROLL,
		path: "/audio/kenney_interface_sounds/scroll_005.wav",
		description: "Fast scroll sound",
	},

	// Select Sounds
	select_choose: {
		id: "select_001",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_001.wav",
		description: "Choose select sound",
	},
	select_pick: {
		id: "select_002",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_002.wav",
		description: "Pick select sound",
	},
	select_highlight: {
		id: "select_003",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_003.wav",
		description: "Highlight select sound",
	},
	select_focus: {
		id: "select_004",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_004.wav",
		description: "Focus select sound",
	},
	select_activate: {
		id: "select_005",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_005.wav",
		description: "Activate select sound",
	},
	select_target: {
		id: "select_006",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_006.wav",
		description: "Target select sound",
	},
	select_confirm: {
		id: "select_007",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_007.wav",
		description: "Confirm select sound",
	},
	select_lock: {
		id: "select_008",
		category: AudioCategory.SELECT,
		path: "/audio/kenney_interface_sounds/select_008.wav",
		description: "Lock select sound",
	},

	// Switch Sounds
	switch_flip: {
		id: "switch_001",
		category: AudioCategory.SWITCH,
		path: "/audio/kenney_interface_sounds/switch_001.wav",
		description: "Flip switch sound",
	},
	switch_change: {
		id: "switch_002",
		category: AudioCategory.SWITCH,
		path: "/audio/kenney_interface_sounds/switch_002.wav",
		description: "Change switch sound",
	},
	switch_mode: {
		id: "switch_003",
		category: AudioCategory.SWITCH,
		path: "/audio/kenney_interface_sounds/switch_003.wav",
		description: "Mode switch sound",
	},
	switch_tab: {
		id: "switch_004",
		category: AudioCategory.SWITCH,
		path: "/audio/kenney_interface_sounds/switch_004.wav",
		description: "Tab switch sound",
	},
	switch_view: {
		id: "switch_005",
		category: AudioCategory.SWITCH,
		path: "/audio/kenney_interface_sounds/switch_005.wav",
		description: "View switch sound",
	},
	switch_option: {
		id: "switch_006",
		category: AudioCategory.SWITCH,
		path: "/audio/kenney_interface_sounds/switch_006.wav",
		description: "Option switch sound",
	},
	switch_setting: {
		id: "switch_007",
		category: AudioCategory.SWITCH,
		path: "/audio/kenney_interface_sounds/switch_007.wav",
		description: "Setting switch sound",
	},

	// Tick Sounds
	tick_clock: {
		id: "tick_001",
		category: AudioCategory.TICK,
		path: "/audio/kenney_interface_sounds/tick_001.wav",
		description: "Clock tick sound",
	},
	tick_metronome: {
		id: "tick_002",
		category: AudioCategory.TICK,
		path: "/audio/kenney_interface_sounds/tick_002.wav",
		description: "Metronome tick sound",
	},
	tick_step: {
		id: "tick_004",
		category: AudioCategory.TICK,
		path: "/audio/kenney_interface_sounds/tick_004.wav",
		description: "Step tick sound",
	},

	// Toggle Sounds
	toggle_on: {
		id: "toggle_001",
		category: AudioCategory.TOGGLE,
		path: "/audio/kenney_interface_sounds/toggle_001.wav",
		description: "Toggle on sound",
	},
	toggle_off: {
		id: "toggle_002",
		category: AudioCategory.TOGGLE,
		path: "/audio/kenney_interface_sounds/toggle_002.wav",
		description: "Toggle off sound",
	},
	toggle_enable: {
		id: "toggle_003",
		category: AudioCategory.TOGGLE,
		path: "/audio/kenney_interface_sounds/toggle_003.wav",
		description: "Enable toggle sound",
	},
	toggle_disable: {
		id: "toggle_004",
		category: AudioCategory.TOGGLE,
		path: "/audio/kenney_interface_sounds/toggle_004.wav",
		description: "Disable toggle sound",
	},

	// Bong/Bell Sound
	bong_bell: {
		id: "bong_001",
		category: AudioCategory.BONG,
		path: "/audio/kenney_interface_sounds/bong_001.wav",
		description: "Bell bong sound",
	},

	// Programmatic UI Sounds
	beep_glide: {
		id: "beep_glide",
		category: AudioCategory.PROGRAMMATIC,
		path: "/audio/programmatic_ui/beep_glide.wav",
		description: "Gliding beep sound",
	},
	beep_noise_highpass: {
		id: "beep_noise_highpass",
		category: AudioCategory.PROGRAMMATIC,
		path: "/audio/programmatic_ui/beep_noise_highpass.wav",
		description: "High-pass noise beep",
	},
	beep_saw: {
		id: "beep_saw",
		category: AudioCategory.PROGRAMMATIC,
		path: "/audio/programmatic_ui/beep_saw.wav",
		description: "Saw wave beep",
	},
	beep_sine: {
		id: "beep_sine",
		category: AudioCategory.PROGRAMMATIC,
		path: "/audio/programmatic_ui/beep_sine.wav",
		description: "Sine wave beep",
	},
	beep_triangle: {
		id: "beep_triangle",
		category: AudioCategory.PROGRAMMATIC,
		path: "/audio/programmatic_ui/beep_triangle.wav",
		description: "Triangle wave beep",
	},

	// Background Music & Ambient Tracks
	epic_march: {
		id: "epic_march",
		category: AudioCategory.MUSIC,
		path: "/audio/epic_march.wav",
		description: "Epic march theme music",
		loop: true,
		volume: 0.6,
	},
	mystic_plains: {
		id: "mystic_plains",
		category: AudioCategory.AMBIENT,
		path: "/audio/mystic_plains.wav",
		description: "Mystic plains ambient background",
		loop: true,
		volume: 0.4,
	},
	space_ambient_2: {
		id: "space_ambient_2",
		category: AudioCategory.AMBIENT,
		path: "/audio/space_ambient_2.wav",
		description: "Deep space ambient atmosphere",
		loop: true,
		volume: 0.3,
	},
	space_ambient_3: {
		id: "space_ambient_3",
		category: AudioCategory.AMBIENT,
		path: "/audio/space_ambient_3.wav",
		description: "Cosmic space ambient soundscape",
		loop: true,
		volume: 0.3,
	},
	space_ambient_improved: {
		id: "space_ambient_improved",
		category: AudioCategory.AMBIENT,
		path: "/audio/space_ambient_improved.wav",
		description: "Enhanced space ambient with stellar winds",
		loop: true,
		volume: 0.4,
	},
	victory_fanfare: {
		id: "victory_fanfare",
		category: AudioCategory.CINEMATIC,
		path: "/audio/victory_fanfare.wav",
		description: "Victory celebration fanfare",
		loop: false,
		volume: 0.8,
	},

	// New Music Tracks from /audio/music/
	club_diver: {
		id: "club_diver",
		category: AudioCategory.MUSIC,
		path: "/audio/music/Club Diver.mp3",
		description: "Club Diver - Electronic dance track",
		loop: true,
		volume: 0.6,
	},
	steel_rods: {
		id: "steel_rods",
		category: AudioCategory.MUSIC,
		path: "/audio/music/Steel Rods.mp3",
		description: "Steel Rods - Industrial electronic music",
		loop: true,
		volume: 0.6,
	},
	ice_flow: {
		id: "ice_flow",
		category: AudioCategory.AMBIENT,
		path: "/audio/music/Ice Flow.mp3",
		description: "Ice Flow - Chill ambient electronic",
		loop: true,
		volume: 0.5,
	},
	space_goddess: {
		id: "space_goddess",
		category: AudioCategory.AMBIENT,
		path: "/audio/music/mixkit-space-goddess-428.mp3",
		description: "Space Goddess - Ethereal space ambient",
		loop: true,
		volume: 0.4,
	},
	space_game: {
		id: "space_game",
		category: AudioCategory.MUSIC,
		path: "/audio/music/mixkit-space-game-668.mp3",
		description: "Space Game - Sci-fi gaming soundtrack",
		loop: true,
		volume: 0.6,
	},

	// Game-Specific Sounds (Placeholders - Replace with your downloaded audio)
	// Combat Sounds
	sword_clash: {
		id: "sword_clash",
		category: AudioCategory.COMBAT,
		path: "/audio/combat/sword_clash.wav",
		description: "Metal sword clashing sound",
		loop: false,
		volume: 0.7,
	},
	laser_shot: {
		id: "laser_shot",
		category: AudioCategory.WEAPONS,
		path: "/audio/weapons/laser_shot.wav",
		description: "Sci-fi laser weapon fire",
		loop: false,
		volume: 0.6,
	},
	explosion_large: {
		id: "explosion_large",
		category: AudioCategory.EXPLOSIONS,
		path: "/audio/explosions/explosion_large.wav",
		description: "Large explosion with debris",
		loop: false,
		volume: 0.8,
	},

	// Mechanical & Space Sounds
	engine_hum: {
		id: "engine_hum",
		category: AudioCategory.MECHANICAL,
		path: "/audio/mechanical/engine_hum.wav",
		description: "Spaceship engine humming",
		loop: true,
		volume: 0.4,
	},
	radar_ping: {
		id: "radar_ping",
		category: AudioCategory.SPACE,
		path: "/audio/space/radar_ping.wav",
		description: "Radar detection ping",
		loop: false,
		volume: 0.5,
	},
	alien_communication: {
		id: "alien_communication",
		category: AudioCategory.ALIEN,
		path: "/audio/alien/communication.wav",
		description: "Alien language sounds",
		loop: false,
		volume: 0.6,
	},

	// Environment & Atmosphere
	wind_space: {
		id: "wind_space",
		category: AudioCategory.NATURE,
		path: "/audio/nature/wind_space.wav",
		description: "Ethereal space wind",
		loop: true,
		volume: 0.3,
	},
	footstep_metal: {
		id: "footstep_metal",
		category: AudioCategory.FOOTSTEPS,
		path: "/audio/footsteps/metal_step.wav",
		description: "Footstep on metal surface",
		loop: false,
		volume: 0.5,
	},

	// Vehicles & Power-ups
	spaceship_takeoff: {
		id: "spaceship_takeoff",
		category: AudioCategory.VEHICLE,
		path: "/audio/vehicles/spaceship_takeoff.wav",
		description: "Spaceship launching sequence",
		loop: false,
		volume: 0.7,
	},
	power_up_collect: {
		id: "power_up_collect",
		category: AudioCategory.POWER_UPS,
		path: "/audio/powerups/collect.wav",
		description: "Power-up collection sound",
		loop: false,
		volume: 0.6,
	},

	// Notifications & UI
	incoming_message: {
		id: "incoming_message",
		category: AudioCategory.NOTIFICATIONS,
		path: "/audio/notifications/incoming_message.wav",
		description: "New message notification",
		loop: false,
		volume: 0.5,
	},
	mission_complete: {
		id: "mission_complete",
		category: AudioCategory.NOTIFICATIONS,
		path: "/audio/notifications/mission_complete.wav",
		description: "Mission completion sound",
		loop: false,
		volume: 0.7,
	},

	// Additional Music Tracks (Add your downloaded music here)
	battle_theme: {
		id: "battle_theme",
		category: AudioCategory.MUSIC,
		path: "/audio/music/battle_theme.mp3",
		description: "Intense battle background music",
		loop: true,
		volume: 0.5,
	},
	exploration_theme: {
		id: "exploration_theme",
		category: AudioCategory.MUSIC,
		path: "/audio/music/exploration_theme.mp3",
		description: "Peaceful exploration music",
		loop: true,
		volume: 0.4,
	},
	menu_theme: {
		id: "menu_theme",
		category: AudioCategory.MUSIC,
		path: "/audio/music/menu_theme.mp3",
		description: "Main menu background music",
		loop: true,
		volume: 0.3,
	},
};

export class GameAudioSystem {
	private audioInstances = new Map<string, HTMLAudioElement>();
	private config: AudioConfig;
	private isInitialized = false;
	private preloadedSounds = new Set<string>();

	constructor(config: Partial<AudioConfig> = {}) {
		this.config = {
			volume: 0.7,
			enabled: true,
			preload: true,
			fadeIn: 0,
			fadeOut: 0,
			...config,
		};
	}

	/**
	 * Initialize the audio system and optionally preload sounds
	 */
	public async initialize(soundsToPreload: string[] = []): Promise<void> {
		if (this.isInitialized) return;

		try {
			// Test audio support
			const testAudio = new Audio();
			if (!testAudio.canPlayType) {
				console.warn("🔊 [AUDIO] Browser does not support HTML5 Audio");
				return;
			}

			// Preload specified sounds
			if (this.config.preload && soundsToPreload.length > 0) {
				await this.preloadSounds(soundsToPreload);
			}

			this.isInitialized = true;
			console.log("🔊 [AUDIO] Game Audio System initialized successfully");
		} catch (error) {
			console.error("🔊 [AUDIO] Failed to initialize audio system:", error);
		}
	}

	/**
	 * Preload specific sounds for instant playback
	 */
	public async preloadSounds(soundIds: string[]): Promise<void> {
		const preloadPromises = soundIds.map(async (soundId) => {
			const soundEffect = SOUND_EFFECTS[soundId];
			if (!soundEffect) {
				console.warn(`🔊 [AUDIO] Sound effect not found: ${soundId}`);
				return;
			}

			try {
				const audio = new Audio(soundEffect.path);
				audio.volume = this.config.volume;
				audio.preload = "auto";

				// Wait for audio to be ready
				await new Promise<void>((resolve, reject) => {
					audio.addEventListener("canplaythrough", () => resolve(), { once: true });
					audio.addEventListener("error", reject, { once: true });
					audio.load();
				});

				this.audioInstances.set(soundId, audio);
				this.preloadedSounds.add(soundId);
				console.log(`🔊 [AUDIO] Preloaded: ${soundId}`);
			} catch (error) {
				console.warn(`🔊 [AUDIO] Failed to preload ${soundId} (${soundEffect?.path || "unknown path"}):`, error instanceof Error ? error.message : "Unknown error");
				// Continue without crashing - the sound just won't be available
			}
		});

		await Promise.allSettled(preloadPromises);
	}

	/**
	 * Play a sound effect by ID
	 */
	public async play(soundId: string, options: Partial<AudioConfig> = {}): Promise<void> {
		if (!this.config.enabled || !this.isInitialized) return;

		const soundEffect = SOUND_EFFECTS[soundId];
		if (!soundEffect) {
			console.warn(`🔊 [AUDIO] Sound effect not found: ${soundId}`);
			return;
		}

		try {
			let audio = this.audioInstances.get(soundId);

			if (!audio) {
				// Create new audio instance if not preloaded
				audio = new Audio(soundEffect.path);
				// Set volume from sound effect config or options or global config
				audio.volume = options.volume ?? soundEffect.volume ?? this.config.volume;
				// Set looping from sound effect config or options
				audio.loop = options.loop ?? soundEffect.loop ?? false;
				this.audioInstances.set(soundId, audio);
			}

			// Reset audio to beginning (unless it's a looping background track already playing)
			if (!audio.loop || audio.paused) {
				audio.currentTime = 0;
			}

			// Apply fade in effect
			if (options.fadeIn || this.config.fadeIn) {
				const fadeTime = options.fadeIn ?? this.config.fadeIn ?? 0;
				if (fadeTime > 0) {
					audio.volume = 0;
					await audio.play();
					const targetVolume = options.volume ?? soundEffect.volume ?? this.config.volume;
					this.fadeIn(audio, targetVolume, fadeTime);
				} else {
					await audio.play();
				}
			} else {
				await audio.play();
			}

			console.log(`🔊 [AUDIO] Playing: ${soundEffect.description}${audio.loop ? " (looping)" : ""}`);
		} catch (error) {
			console.error(`🔊 [AUDIO] Failed to play ${soundId}:`, error);
		}
	}

	/**
	 * Play a random sound from a category
	 */
	public async playRandom(category: AudioCategory, options: Partial<AudioConfig> = {}): Promise<void> {
		const categorySounds = Object.keys(SOUND_EFFECTS).filter((id) => SOUND_EFFECTS[id]?.category === category);

		if (categorySounds.length === 0) {
			console.warn(`🔊 [AUDIO] No sounds found in category: ${category}`);
			return;
		}

		const randomSound = categorySounds[Math.floor(Math.random() * categorySounds.length)];
		if (randomSound) {
			await this.play(randomSound, options);
		}
	}

	/**
	 * Stop a specific sound or all sounds
	 */
	public stop(soundId?: string): void {
		if (soundId) {
			const audio = this.audioInstances.get(soundId);
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			}
		} else {
			// Stop all sounds
			this.audioInstances.forEach((audio) => {
				audio.pause();
				audio.currentTime = 0;
			});
		}
	}

	/**
	 * Update global audio configuration
	 */
	public updateConfig(newConfig: Partial<AudioConfig>): void {
		this.config = { ...this.config, ...newConfig };

		// Update volume for all existing audio instances
		this.audioInstances.forEach((audio) => {
			audio.volume = this.config.volume;
		});
	}

	/**
	 * Get all sounds by category
	 */
	public getSoundsByCategory(category: AudioCategory): SoundEffect[] {
		return Object.values(SOUND_EFFECTS).filter((sound) => sound.category === category);
	}

	/**
	 * Get available categories
	 */
	public getCategories(): AudioCategory[] {
		return Object.values(AudioCategory);
	}

	/**
	 * Fade in audio
	 */
	private fadeIn(audio: HTMLAudioElement, targetVolume: number, duration: number): void {
		const step = targetVolume / (duration * 60); // Assuming 60fps
		const fade = () => {
			if (audio.volume < targetVolume) {
				audio.volume = Math.min(audio.volume + step, targetVolume);
				requestAnimationFrame(fade);
			}
		};
		fade();
	}

	/**
	 * Fade out audio
	 */
	private fadeOut(audio: HTMLAudioElement, duration: number): Promise<void> {
		return new Promise((resolve) => {
			const startVolume = audio.volume;
			const step = startVolume / (duration * 60);

			const fade = () => {
				if (audio.volume > 0) {
					audio.volume = Math.max(audio.volume - step, 0);
					requestAnimationFrame(fade);
				} else {
					audio.pause();
					resolve();
				}
			};
			fade();
		});
	}

	/**
	 * Clean up resources
	 */
	public dispose(): void {
		this.audioInstances.forEach((audio) => {
			audio.pause();
			audio.src = "";
		});
		this.audioInstances.clear();
		this.preloadedSounds.clear();
		this.isInitialized = false;
		console.log("🔊 [AUDIO] Game Audio System disposed");
	}
}

// Export default instance
export const gameAudio = new GameAudioSystem();
