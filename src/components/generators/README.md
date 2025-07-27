# Generator Components - Modular Architecture

This directory contains modular, reusable generator components that follow a consistent architecture pattern. All generators should follow this exact structure for uniformity and maintainability.

## 📁 File Structure Pattern

Each generator should have these exact files:

```
/generators/
  ├── [name]-generator.tsx          # Main component (full-screen)
  ├── [name]-renderer-3d.tsx        # 3D rendering component
  ├── [name]-controls.tsx           # Header controls
  ├── [name]-settings.tsx           # Settings panel
  ├── [name]-info.tsx               # Info panel
  ├── [name]-stats.tsx              # Quick stats
  └── README.md                     # This file
```

## 🎯 Component Architecture

### 1. Main Generator Component (`[name]-generator.tsx`)

**Purpose**: Main orchestrator component
**Layout**: Full-screen with consistent header
**Responsibilities**:
- State management
- Component coordination
- Layout structure
- Event handling

```tsx
export default function [Name]Generator() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        {/* Title and Controls */}
      </div>
      
      {/* 3D Renderer - Full Screen */}
      <[Name]Renderer3D />
      
      {/* Conditional Panels */}
      {showSettings && <[Name]Settings />}
      {showInfo && <[Name]Info />}
      
      {/* Stats */}
      <[Name]Stats />
    </div>
  );
}
```

### 2. 3D Renderer Component (`[name]-renderer-3d.tsx`)

**Purpose**: Handle all Three.js rendering
**Layout**: Full-screen canvas with padding for header
**Responsibilities**:
- Three.js scene management
- Animation loops
- Resize handling
- Asset loading

```tsx
export function [Name]Renderer3D({ config, isLoading, onLoadingChange }) {
  return (
    <div className="absolute inset-0 pt-16">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
```

### 3. Controls Component (`[name]-controls.tsx`)

**Purpose**: Header control buttons and selectors
**Layout**: Horizontal flex layout in header
**Responsibilities**:
- Type selectors
- Action buttons
- Panel toggles

```tsx
export function [Name]Controls({ config, onConfigChange, ... }) {
  return (
    <div className="flex items-center space-x-3">
      {/* Selector */}
      <select>{/* Options */}</select>
      
      {/* Action Buttons */}
      <button><Shuffle /></button>
      <button><Settings /></button>
      <button><Info /></button>
      <button><RotateCcw /></button>
    </div>
  );
}
```

### 4. Settings Panel (`[name]-settings.tsx`)

**Purpose**: Configurable options panel
**Layout**: Top-right overlay panel
**Responsibilities**:
- Configuration controls
- Real-time updates
- Panel management

```tsx
export function [Name]Settings({ config, onConfigChange, onClose }) {
  return (
    <div className="absolute top-24 right-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80">
      {/* Settings Controls */}
    </div>
  );
}
```

### 5. Info Panel (`[name]-info.tsx`)

**Purpose**: Display detailed information
**Layout**: Top-left overlay panel
**Responsibilities**:
- Scientific data
- Properties display
- Reference information

```tsx
export function [Name]Info({ data, onClose }) {
  return (
    <div className="absolute top-24 left-6 z-30 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 w-80">
      {/* Information Display */}
    </div>
  );
}
```

### 6. Stats Component (`[name]-stats.tsx`)

**Purpose**: Quick statistics display
**Layout**: Bottom-right overlay
**Responsibilities**:
- Real-time stats
- Current state display
- Key metrics

```tsx
export function [Name]Stats({ config, data }) {
  return (
    <div className="absolute bottom-6 right-6 z-20 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-slate-700/30">
      {/* Quick Stats */}
    </div>
  );
}
```

## 🎨 Consistent Styling

### Colors & Theme
- **Background**: `bg-gradient-to-br from-slate-950 via-blue-950 to-black`
- **Header**: `bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50`
- **Panels**: `bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700/30`
- **Stats**: `bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/30`

### Layout Standards
- **Header Height**: `h-16` (64px)
- **Panel Width**: `w-80` (320px)
- **Panel Spacing**: `top-24` (96px from top), `left-6`/`right-6` (24px from sides)
- **Stats Position**: `bottom-6 right-6` (24px from bottom-right)

### Z-Index Layers
- **3D Canvas**: `z-10` (background)
- **Header**: `z-20` (above canvas)
- **Panels**: `z-30` (above header)
- **Loading**: `z-50` (top layer)

## 🔧 Configuration Pattern

All generators should use a similar config interface:

```tsx
interface Simple[Name]Config {
  type: [Name]Class;
  size: number;
  color: string;
  feature1: boolean;
  feature2: boolean;
  feature3: boolean;
}
```

## 📱 Responsive Design

- **Full-screen by default**
- **Header responsive to content**
- **Panels adapt to content**
- **Canvas automatically resizes**

## 🚀 Performance Standards

- **60 FPS rendering**
- **Efficient state updates**
- **Proper cleanup on unmount**
- **Loading states for heavy operations**

## 📋 Implementation Checklist

When creating a new generator:

- [ ] Create all 6 component files
- [ ] Follow exact naming convention
- [ ] Use consistent styling classes
- [ ] Implement proper TypeScript interfaces
- [ ] Add proper error handling
- [ ] Include loading states
- [ ] Test full-screen functionality
- [ ] Verify all controls work
- [ ] Check panel positioning
- [ ] Test responsive behavior

## 🎯 Examples

### Current Generators
- **Planet Generator**: `planet-*` files (reference implementation)

### Future Generators
- **Galaxy Generator**: `galaxy-*` files
- **Star Generator**: `star-*` files
- **Solar System Generator**: `solarsystem-*` files
- **Black Hole Generator**: `blackhole-*` files

## 🔄 Migration Guide

If updating existing generators:

1. **Break out the monolithic component** into 6 separate files
2. **Extract 3D logic** into renderer component
3. **Move controls** to controls component
4. **Separate panels** into settings/info components
5. **Extract stats** into stats component
6. **Update main component** to orchestrate others
7. **Test full functionality** remains intact

This modular approach ensures:
- **Consistency** across all generators
- **Maintainability** through separation of concerns
- **Reusability** of common patterns
- **Scalability** for new features
- **Testability** of individual components 