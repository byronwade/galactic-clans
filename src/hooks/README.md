# 🎣 Hooks Directory

## Purpose
Custom React hooks for reusable stateful logic and side effects.

## Structure
```
hooks/
├── useGameState.ts    # Game state management hook
├── usePlayer.ts       # Player-specific logic (future)
├── useAudio.ts        # Audio system integration (future)
├── useKeyboard.ts     # Keyboard input handling (future)
└── usePerformance.ts  # Performance monitoring (future)
```

## Standards
- **Single Responsibility**: One hook per file, one concern per hook
- **TypeScript**: Full type coverage for parameters and return values
- **Dependencies**: Proper dependency arrays for useEffect
- **Cleanup**: Always cleanup side effects (event listeners, timers, etc.)
- **Testing**: Unit tests for complex hook logic
- **Documentation**: JSDoc comments for public hooks

## Examples

### Basic Hook
```tsx
interface UseCounterReturn {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => setCount(prev => prev + 1), [])
  const decrement = useCallback(() => setCount(prev => prev - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  
  return { count, increment, decrement, reset }
}
```

### Effect Hook
```tsx
interface UseKeyboardOptions {
  enabled?: boolean
  preventDefault?: boolean
}

export function useKeyboard(
  key: string, 
  callback: (event: KeyboardEvent) => void,
  options: UseKeyboardOptions = {}
) {
  const { enabled = true, preventDefault = false } = options
  
  useEffect(() => {
    if (!enabled) return
    
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        if (preventDefault) event.preventDefault()
        callback(event)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [key, callback, enabled, preventDefault])
}
```

### Game-Specific Hook
```tsx
interface UsePlayerReturn {
  player: Player | null
  isLoading: boolean
  updatePosition: (position: Vector3) => void
  updateResources: (resources: Resources) => void
}

export function usePlayer(): UsePlayerReturn {
  const { state, updateState } = useGameState()
  const [isLoading, setIsLoading] = useState(false)
  
  const updatePosition = useCallback((position: Vector3) => {
    updateState({
      player: {
        ...state.player,
        position
      }
    })
  }, [state.player, updateState])
  
  const updateResources = useCallback((resources: Resources) => {
    updateState({
      player: {
        ...state.player,
        resources
      }
    })
  }, [state.player, updateState])
  
  return {
    player: state.player,
    isLoading,
    updatePosition,
    updateResources
  }
}
```
