# 🏷️ Types Directory

## Purpose
TypeScript type definitions and interfaces for the entire application.

## Structure
```
types/
├── game.ts            # Core game entities and data structures
├── ui.ts              # UI component prop types
├── api.ts             # API request/response types (future)
└── common.ts          # Shared utility types
```

## Standards
- **Descriptive Names**: Use clear, descriptive interface names
- **Documentation**: Add JSDoc comments for complex types
- **Composition**: Use type composition and unions effectively
- **Exports**: Export all types for use across the application
- **Validation**: Consider runtime validation with Zod (future)

## Examples

### Game Types
```tsx
interface Planet {
  id: string
  name: string
  type: 'terrestrial' | 'gas_giant' | 'ice_giant'
  radius: number
  position: Vector3
  biome: PlanetBiome
}

interface PlanetBiome {
  type: 'temperate' | 'desert' | 'arctic' | 'volcanic'
  temperature: number
  atmosphere: boolean
}
```

### UI Types
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}
```

### Utility Types
```tsx
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }
type NonEmptyArray<T> = [T, ...T[]]
```
