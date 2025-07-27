# 🧩 Components Directory

## Purpose
React components for the Galactic Clans game application.

## Structure
```
components/
├── ui/                 # Reusable UI components
│   ├── button.tsx     # Button component with variants
│   └── ...            # Other UI primitives
├── generators/         # Game-specific generator tools
│   ├── planet-generator.tsx  # Planet creation interface
│   └── ...            # Other generators
└── game/              # Core game components (future)
```

## Standards
- **TypeScript**: All components must be typed
- **Props Interface**: Define clear prop interfaces
- **Composition**: Prefer composition over inheritance
- **Accessibility**: Follow ARIA guidelines
- **Performance**: Use React.memo when appropriate

## Examples

### UI Component
```tsx
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'default', size = 'md', children, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles[variant], sizeStyles[size])} {...props}>{children}</button>
}
```

### Game Component
```tsx
interface PlanetGeneratorProps {
  onGenerate?: (planet: PlanetData) => void
  showControls?: boolean
}

export function PlanetGenerator({ onGenerate, showControls = true }: PlanetGeneratorProps) {
  // Component implementation
}
``` 