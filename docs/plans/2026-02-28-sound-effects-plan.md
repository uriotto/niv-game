# Sound Effects Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add synthesized magical/fantasy sound effects to the game using Web Audio API (zero audio files).

**Architecture:** A singleton `SoundManager` class in `src/utils/sounds.js` handles all audio synthesis via Web Audio API. Individual `play*()` functions are exported for each sound event. Mute state is persisted in localStorage. Integration via direct function calls at existing event points in hooks and components.

**Tech Stack:** Web Audio API (OscillatorNode, GainNode), localStorage for mute persistence.

---

### Task 1: Create SoundManager core

**Files:**
- Create: `src/utils/sounds.js`

**Step 1: Create sound utility file with SoundManager class**

```javascript
const MUTE_KEY = 'niv-magic-book-muted'

class SoundManager {
  constructor() {
    this.ctx = null
    this.muted = localStorage.getItem(MUTE_KEY) === 'true'
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  playTone(frequency, duration, { type = 'sine', gain = 0.3, delay = 0 } = {}) {
    if (this.muted) return
    const ctx = this.ensureContext()
    const osc = ctx.createOscillator()
    const vol = ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    vol.gain.setValueAtTime(0, ctx.currentTime + delay)
    vol.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.02)
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
    osc.connect(vol)
    vol.connect(ctx.destination)
    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  }

  playChord(frequencies, duration, options = {}) {
    frequencies.forEach(f => this.playTone(f, duration, options))
  }
}

const manager = new SoundManager()

// --- Sound functions ---

export function playClick() {
  manager.playTone(800, 0.08, { type: 'sine', gain: 0.15 })
}

export function playCorrect() {
  // Rising C-E-G chord sparkle
  manager.playTone(523, 0.3, { type: 'sine', gain: 0.2, delay: 0 })
  manager.playTone(659, 0.3, { type: 'sine', gain: 0.2, delay: 0.08 })
  manager.playTone(784, 0.4, { type: 'sine', gain: 0.25, delay: 0.16 })
}

export function playWrong() {
  // Gentle descending tone
  manager.playTone(330, 0.25, { type: 'sine', gain: 0.15, delay: 0 })
  manager.playTone(277, 0.3, { type: 'sine', gain: 0.12, delay: 0.12 })
}

export function playHint() {
  // Mysterious wand wave - minor chord
  manager.playTone(440, 0.4, { type: 'triangle', gain: 0.15, delay: 0 })
  manager.playTone(523, 0.35, { type: 'triangle', gain: 0.12, delay: 0.15 })
  manager.playTone(622, 0.3, { type: 'triangle', gain: 0.1, delay: 0.3 })
}

export function playGoldStar() {
  // Bright high sparkle
  manager.playTone(1047, 0.15, { type: 'sine', gain: 0.2, delay: 0 })
  manager.playTone(1319, 0.2, { type: 'sine', gain: 0.25, delay: 0.1 })
  manager.playTone(1568, 0.3, { type: 'sine', gain: 0.2, delay: 0.2 })
}

export function playSilverStar() {
  // Softer sparkle
  manager.playTone(784, 0.15, { type: 'sine', gain: 0.15, delay: 0 })
  manager.playTone(988, 0.2, { type: 'sine', gain: 0.15, delay: 0.1 })
}

export function playLevelComplete() {
  // Magical fanfare - ascending tones
  manager.playTone(523, 0.2, { type: 'sine', gain: 0.2, delay: 0 })
  manager.playTone(659, 0.2, { type: 'sine', gain: 0.2, delay: 0.15 })
  manager.playTone(784, 0.2, { type: 'sine', gain: 0.25, delay: 0.3 })
  manager.playTone(1047, 0.5, { type: 'sine', gain: 0.3, delay: 0.45 })
}

export function playLevelFail() {
  // Gentle descending melody
  manager.playTone(523, 0.3, { type: 'sine', gain: 0.15, delay: 0 })
  manager.playTone(440, 0.3, { type: 'sine', gain: 0.12, delay: 0.2 })
  manager.playTone(392, 0.4, { type: 'sine', gain: 0.1, delay: 0.4 })
}

export function playGameStart() {
  // Magical opening - ascending chime sequence
  manager.playTone(523, 0.2, { type: 'sine', gain: 0.15, delay: 0 })
  manager.playTone(659, 0.2, { type: 'sine', gain: 0.18, delay: 0.12 })
  manager.playTone(784, 0.2, { type: 'sine', gain: 0.2, delay: 0.24 })
  manager.playTone(1047, 0.4, { type: 'sine', gain: 0.25, delay: 0.36 })
  manager.playTone(1319, 0.5, { type: 'triangle', gain: 0.15, delay: 0.5 })
}

export function isMuted() {
  return manager.muted
}

export function toggleMute() {
  manager.muted = !manager.muted
  localStorage.setItem(MUTE_KEY, manager.muted)
  return manager.muted
}
```

**Step 2: Verify file was created**

Run: `ls src/utils/sounds.js`
Expected: File exists.

**Step 3: Commit**

```bash
git add src/utils/sounds.js
git commit -m "feat: add SoundManager with Web Audio API synthesized sounds"
```

---

### Task 2: Integrate sounds into useGameState (correct/wrong/hint)

**Files:**
- Modify: `src/hooks/useGameState.js`

**Step 1: Add sound imports and calls**

In `useGameState.js`:
- Import `playCorrect`, `playWrong`, `playHint` from `../utils/sounds`
- In `submitAnswer`, after `if (isCorrect)` (line 20), add `playCorrect()` before setting feedback
- In `submitAnswer`, in the else branch (line 41-44), add `playWrong()` before setting feedback
- In `useHint` callback (line 48-50), add `playHint()` before `setUsedHint(true)`

After changes, `submitAnswer` should look like:
```javascript
import { playCorrect, playWrong, playHint } from '../utils/sounds'

// In submitAnswer:
if (isCorrect) {
  playCorrect()
  const star = getStarType(attempt, usedHint)
  // ... rest unchanged
} else {
  playWrong()
  setAttempt(prev => prev + 1)
  // ... rest unchanged
}

// In useHint:
const useHint = useCallback(() => {
  playHint()
  setUsedHint(true)
}, [])
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add src/hooks/useGameState.js
git commit -m "feat: add correct/wrong/hint sounds to game flow"
```

---

### Task 3: Integrate sounds into CelebrationModal (level complete)

**Files:**
- Modify: `src/components/ui/CelebrationModal.jsx`

**Step 1: Add level complete sounds**

In `CelebrationModal.jsx`:
- Import `playLevelComplete`, `playLevelFail` from `../../utils/sounds`
- Add `useEffect` import from `react`
- Add a `useEffect` that plays the appropriate sound when `show` becomes true:

```javascript
import { useEffect } from 'react'
import { playLevelComplete, playLevelFail } from '../../utils/sounds'

// Inside component, before return:
useEffect(() => {
  if (show) {
    if (passed) {
      playLevelComplete()
    } else {
      playLevelFail()
    }
  }
}, [show, passed])
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/ui/CelebrationModal.jsx
git commit -m "feat: add level complete/fail sounds to celebration modal"
```

---

### Task 4: Integrate game start sound into WelcomeScreen

**Files:**
- Modify: `src/components/WelcomeScreen.jsx`

**Step 1: Add game start sound**

In `WelcomeScreen.jsx`:
- Import `playGameStart` from `../utils/sounds`
- In `handleStart()`, call `playGameStart()` right before `onStart()` (line 33 and line 52)
- In `handleGuestStart()`, call `playGameStart()` right before `onStart()` (line 58)

```javascript
import { playGameStart } from '../utils/sounds'

// In handleStart, before onStart():
playGameStart()
onStart()

// In handleGuestStart, before onStart():
playGameStart()
onStart()
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/WelcomeScreen.jsx
git commit -m "feat: add magical game start sound"
```

---

### Task 5: Add mute toggle to GameLevel header

**Files:**
- Modify: `src/components/GameLevel.jsx`

**Step 1: Add mute button to header**

In `GameLevel.jsx`:
- Import `useState` (already from react via useGameState)
- Import `isMuted`, `toggleMute` from `../utils/sounds`
- Add muted state: `const [muted, setMuted] = useState(isMuted())`
- Add toggle handler:
```javascript
const handleToggleMute = () => {
  const newMuted = toggleMute()
  setMuted(newMuted)
}
```
- Add mute button next to the "חזרה" button in the header (line 60-67):

```jsx
<div className="flex items-center gap-2">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onBack}
    className="glass-card rounded-xl px-4 py-2 text-[#c0b89c] hover:text-white hover:border-white/20 cursor-pointer text-base font-bold transition-all"
  >
    ← חזרה
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={handleToggleMute}
    className="glass-card rounded-xl px-3 py-2 text-lg cursor-pointer hover:border-white/20 transition-all"
  >
    {muted ? '🔇' : '🔊'}
  </motion.button>
</div>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/GameLevel.jsx
git commit -m "feat: add mute toggle button to game level header"
```

---

### Task 6: Add star sounds to StarRating

**Files:**
- Modify: `src/components/ui/StarRating.jsx`

**Step 1: Add star earned sounds**

In `StarRating.jsx`:
- Import `useEffect`, `useRef` from `react`
- Import `playGoldStar`, `playSilverStar` from `../../utils/sounds`
- Track previous results length to detect new stars
- Play sound only when a new star is added:

```javascript
import { useEffect, useRef } from 'react'
import { playGoldStar, playSilverStar } from '../../utils/sounds'

export default function StarRating({ results, total }) {
  const prevLength = useRef(results.length)

  useEffect(() => {
    if (results.length > prevLength.current) {
      const latest = results[results.length - 1]
      if (latest === 'gold') {
        playGoldStar()
      } else if (latest === 'silver') {
        playSilverStar()
      }
    }
    prevLength.current = results.length
  }, [results])

  return (
    // ... existing JSX unchanged
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/ui/StarRating.jsx
git commit -m "feat: add gold/silver star earned sounds"
```

---

### Task 7: Final build verification and combined commit

**Step 1: Full build check**

Run: `npm run build`
Expected: Build succeeds with no errors or warnings.

**Step 2: Manual test checklist**

Verify in browser (`npm run dev`):
- [ ] Click "יאללה להרפתקה" → hear game start chime
- [ ] Answer correctly → hear rising chord
- [ ] Answer wrong → hear gentle descending tone
- [ ] Use hint → hear mysterious tone
- [ ] Star appears → hear sparkle (gold or silver)
- [ ] Complete level (pass) → hear fanfare
- [ ] Complete level (fail) → hear gentle melody
- [ ] Mute button toggles between 🔊 and 🔇
- [ ] Muted state persists after page refresh
- [ ] All sounds are short, pleasant, not annoying

**Step 3: Push to main**

```bash
git push origin main
```
