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
}

const manager = new SoundManager()

// --- Sound functions ---

export function playClick() {
  manager.playTone(800, 0.08, { type: 'sine', gain: 0.15 })
}

export function playCorrect() {
  manager.playTone(523, 0.3, { type: 'sine', gain: 0.2, delay: 0 })
  manager.playTone(659, 0.3, { type: 'sine', gain: 0.2, delay: 0.08 })
  manager.playTone(784, 0.4, { type: 'sine', gain: 0.25, delay: 0.16 })
}

export function playWrong() {
  manager.playTone(330, 0.25, { type: 'sine', gain: 0.15, delay: 0 })
  manager.playTone(277, 0.3, { type: 'sine', gain: 0.12, delay: 0.12 })
}

export function playHint() {
  manager.playTone(440, 0.4, { type: 'triangle', gain: 0.15, delay: 0 })
  manager.playTone(523, 0.35, { type: 'triangle', gain: 0.12, delay: 0.15 })
  manager.playTone(622, 0.3, { type: 'triangle', gain: 0.1, delay: 0.3 })
}

export function playGoldStar() {
  manager.playTone(1047, 0.15, { type: 'sine', gain: 0.2, delay: 0 })
  manager.playTone(1319, 0.2, { type: 'sine', gain: 0.25, delay: 0.1 })
  manager.playTone(1568, 0.3, { type: 'sine', gain: 0.2, delay: 0.2 })
}

export function playSilverStar() {
  manager.playTone(784, 0.15, { type: 'sine', gain: 0.15, delay: 0 })
  manager.playTone(988, 0.2, { type: 'sine', gain: 0.15, delay: 0.1 })
}

export function playLevelComplete() {
  manager.playTone(523, 0.2, { type: 'sine', gain: 0.2, delay: 0 })
  manager.playTone(659, 0.2, { type: 'sine', gain: 0.2, delay: 0.15 })
  manager.playTone(784, 0.2, { type: 'sine', gain: 0.25, delay: 0.3 })
  manager.playTone(1047, 0.5, { type: 'sine', gain: 0.3, delay: 0.45 })
}

export function playLevelFail() {
  manager.playTone(523, 0.3, { type: 'sine', gain: 0.15, delay: 0 })
  manager.playTone(440, 0.3, { type: 'sine', gain: 0.12, delay: 0.2 })
  manager.playTone(392, 0.4, { type: 'sine', gain: 0.1, delay: 0.4 })
}

export function playGameStart() {
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
