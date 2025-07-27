# Tauri Desktop App Setup

This document explains how the Tauri desktop application integrates with our Svelte web application.

## Overview

Our Tauri app serves as a desktop wrapper around the Svelte web application, providing:
- Native desktop window and controls
- Access to system APIs
- Cross-platform distribution
- Better performance than Electron

## Architecture

```
┌─────────────────────────────────────┐
│           Tauri Desktop App         │
├─────────────────────────────────────┤
│         Svelte Web App              │
│  (Runs on http://localhost:5173)    │
├─────────────────────────────────────┤
│         System APIs                 │
│  (File system, notifications, etc.) │
└─────────────────────────────────────┘
```

## Development

### Prerequisites

1. **Rust**: Install Rust from https://rustup.rs/
2. **System Dependencies**:
   - **macOS**: Xcode Command Line Tools
   - **Linux**: `build-essential`, `libwebkit2gtk-4.0-dev`
   - **Windows**: Visual Studio Build Tools

### Running the App

#### Development Mode
```bash
# Start the Tauri app in development mode
bun run tauri:dev

# This will:
# 1. Start the Svelte dev server (http://localhost:5173)
# 2. Launch the Tauri desktop window
# 3. Enable hot reload for both frontend and backend
```

#### Build for Production
```bash
# Build the Svelte app and create desktop executable
bun run tauri:build

# Output will be in src-tauri/target/release/
```

### Available Scripts

- `bun run tauri:dev` - Development mode with hot reload
- `bun run tauri:build` - Build production executable
- `bun run tauri:preview` - Preview production build

## Configuration

### Tauri Config (`src-tauri/tauri.conf.json`)

```json
{
  "productName": "Galactic Clans",
  "version": "0.1.0",
  "identifier": "com.galacticclans.dev",
  "build": {
    "beforeDevCommand": "bun run dev",
    "beforeBuildCommand": "bun run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  }
}
```

### Window Settings

- **Size**: 1400x900 (minimum 800x600)
- **Features**: Resizable, centered, decorated
- **Title**: "Galactic Clans"

## Integration Points

### Frontend (Svelte)
- Located in `src/` directory
- Uses SvelteKit for routing
- Integrates with Tauri APIs via `@tauri-apps/api`

### Backend (Rust)
- Located in `src-tauri/` directory
- Handles system-level operations
- Provides native APIs to frontend

### Communication

The frontend and backend communicate through Tauri's command system:

```typescript
// Frontend (Svelte)
import { invoke } from '@tauri-apps/api/tauri';

// Call Rust function
const result = await invoke('my_rust_function', { arg: 'value' });
```

```rust
// Backend (Rust)
#[tauri::command]
fn my_rust_function(arg: String) -> String {
    format!("Hello from Rust: {}", arg)
}
```

## Features

### Current Features
- ✅ Desktop window with native controls
- ✅ Hot reload during development
- ✅ Cross-platform compilation
- ✅ Integration with Svelte app
- ✅ Logging system

### Planned Features
- 🔄 File system access
- 🔄 System notifications
- 🔄 Auto-updates
- 🔄 Native menus
- 🔄 System tray integration

## Troubleshooting

### Common Issues

1. **"Command not found: tauri"**
   ```bash
   bun install
   # or
   npm install -g @tauri-apps/cli
   ```

2. **Build errors on macOS**
   ```bash
   xcode-select --install
   ```

3. **Build errors on Linux**
   ```bash
   sudo apt install build-essential libwebkit2gtk-4.0-dev
   ```

4. **Port already in use**
   ```bash
   # Kill existing processes
   pkill -f "vite\|tauri"
   ```

### Debug Mode

Enable debug logging:
```bash
RUST_LOG=debug bun run tauri:dev
```

## Distribution

### Building for Different Platforms

```bash
# macOS
bun run tauri:build

# Windows (from macOS/Linux)
bun run tauri:build --target x86_64-pc-windows-msvc

# Linux
bun run tauri:build --target x86_64-unknown-linux-gnu
```

### Output Files

- **macOS**: `.app` bundle in `src-tauri/target/release/bundle/macos/`
- **Windows**: `.exe` and installer in `src-tauri/target/release/bundle/msi/`
- **Linux**: `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`

## Security

The app uses a relaxed CSP for development:
```json
"security": {
  "csp": null
}
```

For production, consider implementing proper CSP rules.

## Performance

Tauri provides better performance than Electron:
- Smaller bundle size (~10MB vs ~100MB)
- Lower memory usage
- Faster startup time
- Native performance

## Next Steps

1. Add system-specific features (file dialogs, notifications)
2. Implement auto-update system
3. Add native menus and shortcuts
4. Create installer packages
5. Set up CI/CD for automated builds 