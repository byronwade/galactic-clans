# 🛠️ Utils Directory

## Purpose
Pure utility functions and helper modules for common operations.

## Structure
```
utils/
├── utils.ts           # Main utility functions (cn, etc.)
├── math.ts            # Mathematical calculations (future)
├── format.ts          # Data formatting helpers (future)
├── validation.ts      # Input validation functions (future)
└── constants.ts       # Application constants (future)
```

## Standards
- **Pure Functions**: No side effects, predictable inputs/outputs
- **TypeScript**: Full type coverage
- **Documentation**: JSDoc comments for all public functions
- **Testing**: Unit tests for all utility functions
- **Performance**: Optimize for frequently used functions
- **Tree Shaking**: Export functions individually

## Core Utilities

### Class Name Utility (cn)
```tsx
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines and merges CSS class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })
```

## Examples

### Math Utilities
```tsx
/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Converts degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}
```

### Formatting Utilities
```tsx
/**
 * Formats a number as a currency string
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formats a large number with abbreviated suffixes (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T']
  const suffixNum = Math.floor(Math.log10(Math.abs(num)) / 3)
  const shortValue = (num / Math.pow(1000, suffixNum)).toFixed(1)
  return shortValue + suffixes[suffixNum]
}
```

### Validation Utilities
```tsx
/**
 * Checks if a value is not null or undefined
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
```

### Game-Specific Utilities
```tsx
/**
 * Generates a random planet name
 */
export function generatePlanetName(): string {
  const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']
  const suffixes = ['Prime', 'Major', 'Minor', 'Centauri', 'Proxima']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  return `${prefix} ${suffix} ${Math.floor(Math.random() * 1000)}`
}

/**
 * Calculates distance between two 3D points
 */
export function distance3D(a: Vector3, b: Vector3): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
```
