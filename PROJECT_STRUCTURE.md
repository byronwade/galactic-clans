# 📁 Project Structure - Galactic Clans

## 🏗️ Clean Directory Structure

```
cosmic/
├── 📁 src/                         # Source code (organized)
│   ├── 📁 app/                     # Next.js App Router pages
│   │   ├── 📄 layout.tsx          # Root layout with providers
│   │   ├── 📄 page.tsx            # Main game page
│   │   ├── 📄 globals.css         # Global styles
│   │   ├── 📁 generators/         # Generator tools
│   │   │   └── 📁 planet/         # Planet generator page
│   │   ├── 📁 test/               # Test pages
│   │   └── 📁 test-suite/         # Migration testing suite
│   ├── 📁 components/             # React components
│   │   ├── 📁 ui/                 # UI components (Button, etc.)
│   │   └── 📁 generators/         # Generator components
│   ├── 📁 lib/                    # Libraries and utilities
│   │   └── 📁 stores/             # State management (React Context)
│   ├── 📁 types/                  # TypeScript type definitions
│   ├── 📁 hooks/                  # Custom React hooks
│   └── 📁 utils/                  # Utility functions
│
├── 📁 src-tauri/                   # Tauri desktop app source
│   ├── 📄 Cargo.toml              # Rust dependencies
│   ├── 📄 tauri.conf.json         # Tauri configuration
│   └── 📁 src/                    # Rust source code
│
├── 📁 public/                      # Static assets
│   ├── 📁 audio/                   # Game audio files
│   └── 📄 favicon.png              # App icon
│
├── 📁 docs/                        # Documentation
│   ├── 📁 migration/               # Migration documentation
│   └── 📁 setup/                   # Setup guides
│
├── 📄 next.config.mjs              # Next.js configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 package.json                 # Dependencies and scripts
└── 📄 README.md                    # Project overview
```

## 🎯 Key Features

### ✅ **Proper Next.js Structure**
- **src/app/**: Follows Next.js 14 App Router conventions
- **Separation of Concerns**: App logic, components, and utilities are clearly separated
- **Scalable Structure**: Easy to add new features and components
- **Type Safety**: Full TypeScript support with proper path mapping

### ✅ **Next.js 14 Integration**
- **App Router**: Modern routing with file-based navigation in `src/app/`
- **Server Components**: Optimized performance and SEO
- **Static Export**: Compatible with Tauri desktop builds

### ✅ **Tauri Desktop App**
- **Cross-Platform**: Windows, macOS, and Linux support
- **Native Performance**: Rust backend with web frontend
- **Small Bundle Size**: Optimized for desktop distribution

### ✅ **Development Experience**
- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and intellisense
- **Path Mapping**: Clean imports with `@/` aliases

## 🚀 Development Commands

```bash
# Next.js Development
bun dev                 # Start Next.js dev server (http://localhost:3000)
bun build              # Build for production
bun start              # Start production server

# Tauri Desktop App
bun run tauri:dev      # Start desktop app in development
bun run tauri:build    # Build desktop app for distribution

# Utilities
bun lint               # Run ESLint
bun format             # Format code with Prettier
```

## 📂 Directory Purposes

### `src/app/` - Next.js App Router
- **Purpose**: Page components and routing
- **Structure**: File-based routing with layout hierarchy
- **Key Files**: `layout.tsx`, `page.tsx`, route pages
- **Convention**: Follows Next.js 14 App Router standards

### `src/components/` - React Components
- **Purpose**: Reusable UI and game components
- **Structure**: Organized by functionality (ui, generators, etc.)
- **Standards**: TypeScript, proper prop interfaces

### `src/lib/` - Libraries and Core Logic
- **Purpose**: State management, business logic, utilities
- **Structure**: Feature-based organization
- **Key Features**: React Context stores, game logic

### `src/types/` - TypeScript Definitions
- **Purpose**: Shared type definitions and interfaces
- **Structure**: Organized by feature/domain
- **Standards**: Consistent naming and documentation

### `src/hooks/` - Custom React Hooks
- **Purpose**: Reusable stateful logic
- **Structure**: One hook per file
- **Standards**: Proper dependency arrays and cleanup

### `src/utils/` - Utility Functions
- **Purpose**: Pure functions and helpers
- **Structure**: Categorized by functionality
- **Standards**: Well-tested, documented functions

### `src-tauri/` - Desktop App Backend
- **Purpose**: Rust backend for native desktop features
- **Structure**: Standard Cargo project layout
- **Features**: File system access, native APIs

### `public/` - Static Assets
- **Purpose**: Images, audio, fonts, and other static files
- **Structure**: Organized by asset type
- **Access**: Available at root URL path

### `docs/` - Documentation
- **Purpose**: Project documentation and guides
- **Structure**: Organized by topic
- **Contents**: Setup guides, API docs, migration notes

## 🔧 Configuration Files

### `next.config.mjs`
- Next.js build configuration
- Static export settings for Tauri
- Performance optimizations

### `tailwind.config.js`
- Tailwind CSS customization
- Design system tokens
- Custom utilities and components
- **Content Paths**: `"./src/**/*.{js,ts,jsx,tsx,mdx}"`

### `tsconfig.json`
- TypeScript compiler options
- Path mapping for clean imports
- Build targets and output

### `package.json`
- Dependencies and versions
- Build and development scripts
- Project metadata

## 🎮 Game-Specific Structure

### State Management
- **Location**: `src/lib/stores/`
- **Pattern**: React Context API
- **Files**: `game-state.tsx`

### UI Components
- **Location**: `src/components/ui/`
- **Pattern**: Compound components
- **Examples**: Button, Card, Modal

### Game Features
- **Location**: `src/components/generators/`
- **Pattern**: Feature-based components
- **Examples**: Planet generator, Galaxy viewer

### Types
- **Location**: `src/types/`
- **Pattern**: Domain-driven interfaces
- **Examples**: Game entities, UI props

## 📱 Cross-Platform Support

### Web Application
- **Framework**: Next.js 14
- **Deployment**: Static export
- **URL**: `http://localhost:3000`

### Desktop Application
- **Framework**: Tauri
- **Backend**: Rust
- **Frontend**: Next.js components
- **Platforms**: Windows, macOS, Linux

## 🔍 Path Mapping

```typescript
// Import examples with clean paths
import { Button } from '@/components/ui/button'
import { useGameState } from '@/lib/stores/game-state'
import { GameEntity } from '@/types/game'
import { usePlayer } from '@/hooks/usePlayer'
import { cn } from '@/utils/utils'
```

## 📈 Scalability

This structure supports:
- ✅ **Adding new pages**: Drop files in `src/app/`
- ✅ **Creating components**: Add to `src/components/`
- ✅ **Managing state**: Extend stores in `src/lib/`
- ✅ **Type definitions**: Add to `src/types/`
- ✅ **Custom hooks**: Add to `src/hooks/`
- ✅ **Utility functions**: Add to `src/utils/`

## 🧹 Maintenance

- **Consistent**: Standard patterns throughout
- **Documented**: README files in each directory
- **Typed**: Full TypeScript coverage
- **Tested**: Structure supports easy testing
- **Optimized**: Build and bundle optimization

## ✅ Next.js Compliance

This structure follows [Next.js 14 conventions](https://nextjs.org/docs/app/building-your-application/configuring/src-directory):

- **src/app/**: App Router pages and layouts
- **src/components/**: Reusable React components
- **src/lib/**: Core libraries and utilities
- **Proper path mapping**: TypeScript and import aliases
- **Static assets**: `public/` directory in root
- **Configuration**: All config files in root

---

**Structure Status: ✅ NEXT.JS COMPLIANT**  
**Ready for Development: ✅**  
**Tauri Compatible: ✅** 