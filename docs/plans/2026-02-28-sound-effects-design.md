# Sound Effects Design - Magical Fantasy Theme

## Context
Adding sound effects to enhance the game experience. Using Web Audio API for synthesized magical sounds - zero audio files, zero bundle size increase.

## Sound Effects

| Event | Function | Description |
|-------|----------|-------------|
| Game start | `playGameStart()` | Magical opening - ascending chime sequence |
| Correct answer | `playCorrect()` | Rising chord (C-E-G) - sparkle |
| Wrong answer | `playWrong()` | Soft descending tone - gentle "oops" |
| Hint used | `playHint()` | Mysterious minor tone - wand wave |
| Gold star | `playGoldStar()` | Bright high sparkle |
| Silver star | `playSilverStar()` | Softer sparkle |
| Level complete (pass) | `playLevelComplete()` | Magical fanfare - ascending tones |
| Level complete (fail) | `playLevelFail()` | Gentle descending melody |
| Button click | `playClick()` | Light click |

## Architecture

### New file: `src/utils/sounds.js`
- `SoundManager` class with Web Audio API
- AudioContext created on first user interaction (browser requirement)
- Each sound = oscillator(s) with envelope (attack/decay)
- Mute state saved in localStorage (`niv-magic-book-muted`)
- Export individual play functions + `isMuted`/`toggleMute`

### Integration points
- `useGameState.js` - correct/wrong/hint events
- `CelebrationModal.jsx` - level complete (pass/fail)
- `StarRating.jsx` - star earned
- `WelcomeScreen.jsx` - game start button
- `GameLevel.jsx` - mute toggle button (top bar)

### Mute button
- Small speaker icon in GameLevel header (next to "חזרה" button)
- Toggles between 🔊 and 🔇
- Persists in localStorage

## Technical notes
- Web Audio API requires user gesture to start AudioContext
- First sound played after a click automatically resumes context
- All sounds are short (<1s) synthesized tones
- No external dependencies
