# Galactic Clans

🚀 **Epic Space Strategy Game** - Build your galactic empire, explore procedurally generated worlds, and dominate the cosmos in this revolutionary real-time strategy game.

## ✨ Features

### 🎮 **AAA Game Loading Experience**
- **Cinematic Loading Screen**: Professional AAA-quality loading screen with realistic loading phases
- **Dynamic Backgrounds**: Animated starfield, nebula effects, and scanning lines
- **Progressive Loading**: 8 realistic loading phases with dynamic progress tracking
- **System Status**: Real-time loading stats and system information
- **Smooth Animations**: Fade-in effects and smooth transitions between phases

### 🌍 **Enhanced Planetary Generation System**
- **40+ Planet Types**: Desert worlds, frozen tundras, volcanic planets, gas giants, and more
- **Realistic Biomes**: Scientifically accurate environmental systems
- **Low-Poly Aesthetic**: Beautiful, optimized 3D models with artistic flair
- **Dynamic Features**: Procedural terrain, water systems, vegetation, and atmospheric effects

### 🌌 **Advanced Galaxy Generation**
- **40+ Galaxy Types**: Spiral, barred spiral, elliptical, irregular, and exotic galaxy types
- **Scientific Accuracy**: Based on real astronomical data and classifications
- **Particle-Based Rendering**: High-performance particle systems for realistic galaxy structures
- **Dynamic Colors**: Evolving color schemes based on galaxy type and stellar populations

### ⭐ **Stellar Object Generation**
- **25+ Star Types**: Main sequence, giants, supergiants, white dwarfs, neutron stars
- **Stellar Evolution**: Realistic physics and lifecycle modeling
- **Advanced Visuals**: Custom shaders and particle effects
- **Companion Systems**: Binary and multiple star systems

### 🕳️ **Black Hole Simulation**
- **13+ Black Hole Types**: Stellar, intermediate, supermassive, and exotic black holes
- **Gravitational Effects**: Realistic spacetime distortion and lensing
- **Accretion Physics**: Dynamic accretion disks with temperature gradients
- **Hawking Radiation**: Particle emission and quantum effects

### 🎮 **Professional UI Systems**
- **Modern Design**: Sleek, compact interface inspired by AAA games
- **Comprehensive Settings**: Graphics, audio, controls, accessibility, and performance options
- **Test Suite**: Professional development and testing environment
- **Credits System**: Beautiful acknowledgment page for all contributors

## 🛠️ **Technology Stack**

- **Framework**: Next.js 15 with App Router
- **3D Graphics**: Three.js with WebGL2
- **Physics**: Cannon-ES for realistic simulations
- **Styling**: Tailwind CSS with custom animations
- **Language**: TypeScript for type safety
- **Runtime**: Bun for fast package management

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser with WebGL2 support

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd cosmic

# Install dependencies with Bun (recommended)
bun install

# Or with npm
npm install

# Start the development server
bun run dev
# Or: npm run dev

# Open http://localhost:5173
```

### 🧪 **Test Pages**

Access the comprehensive test suite at `http://localhost:5173/test`:

- **Planet Generator**: `/test/planet` - Test all 40+ planet types
- **Solar System Generator**: `/test/solar-system` - Test realistic solar systems
- **Galaxy Generator**: `/test/galaxy` - Test 40+ galaxy types with particle effects
- **Star Generator**: `/test/star` - Test stellar objects and physics
- **Black Hole Generator**: `/test/blackhole` - Test black hole simulations
- **Controller Test**: `/test/controller` - Professional gamepad testing
- **AAA Game Menu**: `/test/menu` - Modern game menu system

## 📁 **Project Structure**

```
cosmic/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Main game page with AAA loading screen
│   │   ├── credits/           # Credits page
│   │   └── test/              # Test suite pages
│   ├── components/            # React components
│   │   ├── MainMenu.tsx       # Main game menu
│   │   ├── PlanetRenderer.tsx # 3D planet rendering
│   │   ├── GalaxyRenderer.tsx # 3D galaxy rendering
│   │   └── settings/          # Settings components
│   └── shared/                # Core game systems
│       ├── procgen/           # Procedural generation
│       ├── physics/           # Physics systems
│       └── rendering/         # Rendering pipeline
├── assets/                    # Game assets
└── docs/                      # Documentation
```

## 🎯 **Key Features Showcase**

### AAA Loading Screen
The game features a professional loading screen with:
- **8 Loading Phases**: Quantum Core → Hyperdrive → Galactic Mapping → Neural Networks → Fleet Protocols → Defense Grids → Tactical Database → Empire Deployment
- **Real-time Progress**: Both overall and phase-specific progress tracking
- **Visual Effects**: Animated starfield, color-changing nebula effects, scanning lines
- **System Information**: Version info, build numbers, connection status
- **Smooth Animations**: Fade-in effects and smooth transitions

### Test Suite Integration
Professional testing environment with:
- **Compact Headers**: Consistent design across all test pages
- **Modern UI**: Dark mode with glassmorphism effects
- **Real-time Controls**: Interactive parameter adjustment
- **Performance Monitoring**: Built-in performance tracking

## 🤝 **Contributing**

This project uses modern development practices:
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first styling
- **Component Architecture**: Modular, reusable components

## 📄 **License & Credits**

See `/credits` page for full acknowledgments of all contributors and assets.

**Made with ❤️ by Byron Wade and the community**

---

🌌 **Ready to conquer the galaxy?** Start your cosmic journey today!
