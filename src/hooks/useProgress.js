import { useState, useCallback, useEffect, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const STORAGE_KEY = 'niv-magic-book-progress'
const PARTIAL_KEY = 'niv-magic-book-partial'
const PLAYER_KEY = 'niv-magic-book-player'

function getDefaultProgress() {
  return {
    kingdoms: {
      sentences: { levels: [[], [], []], unlocked: [true, false, false] },
      words: { levels: [[], [], []], unlocked: [true, false, false] },
      numbers: { levels: [[], [], []], unlocked: [true, false, false] },
      problems: { levels: [[], [], []], unlocked: [true, false, false] },
      patterns: { levels: [[], [], []], unlocked: [true, false, false] },
    },
    completedKingdoms: [],
    totalStars: 0,
  }
}

function loadLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to load local progress:', e)
  }
  return null
}

function saveLocal(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.warn('Failed to save local progress:', e)
  }
}

function loadPartialProgress(kingdomId, levelIndex) {
  try {
    const saved = localStorage.getItem(PARTIAL_KEY)
    if (saved) {
      const partial = JSON.parse(saved)
      if (partial.kingdomId === kingdomId && partial.levelIndex === levelIndex) {
        return partial.results
      }
    }
  } catch (e) {
    console.warn('Failed to load partial progress:', e)
  }
  return null
}

function savePartialToStorage(kingdomId, levelIndex, results) {
  try {
    localStorage.setItem(PARTIAL_KEY, JSON.stringify({ kingdomId, levelIndex, results }))
  } catch (e) {
    console.warn('Failed to save partial progress:', e)
  }
}

function clearPartialFromStorage() {
  try {
    localStorage.removeItem(PARTIAL_KEY)
  } catch (e) {
    console.warn('Failed to clear partial progress:', e)
  }
}

// Load saved player profile (with migration from old string format)
export function getSavedPlayer() {
  try {
    const raw = localStorage.getItem(PLAYER_KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      if (parsed.name) return parsed
    } catch {}
    // Migrate old "name-PIN" string format
    const dashIndex = raw.indexOf('-')
    if (dashIndex > 0) {
      const name = raw.slice(0, dashIndex)
      const pin = raw.slice(dashIndex + 1)
      const migrated = { name, pin, gender: 'female', isGuest: false }
      localStorage.setItem(PLAYER_KEY, JSON.stringify(migrated))
      return migrated
    }
    return null
  } catch {
    return null
  }
}

export function savePlayer(player) {
  try {
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player))
  } catch (e) {
    console.warn('Failed to save player:', e)
  }
}

export function getPlayerCode(player) {
  if (!player || player.isGuest) return null
  return `${player.name}-${player.pin}`
}

// Keep old exports for backward compatibility
export function getSavedPlayerCode() {
  const player = getSavedPlayer()
  return getPlayerCode(player)
}

export function savePlayerCode(code) {
  if (!code) return
  const dashIndex = code.indexOf('-')
  if (dashIndex > 0) {
    const player = { name: code.slice(0, dashIndex), pin: code.slice(dashIndex + 1), gender: 'female', isGuest: false }
    savePlayer(player)
  }
}

async function loadFromCloud(playerCode) {
  try {
    const docRef = doc(db, 'players', playerCode)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data().progress
    }
  } catch (e) {
    console.warn('Failed to load from cloud:', e)
  }
  return null
}

async function saveToCloud(playerCode, progress) {
  try {
    const docRef = doc(db, 'players', playerCode)
    await setDoc(docRef, { progress, updatedAt: new Date().toISOString() }, { merge: true })
  } catch (e) {
    console.warn('Failed to save to cloud:', e)
  }
}

export function useProgress(playerCode) {
  const [progress, setProgress] = useState(() => loadLocal() || getDefaultProgress())
  const [isLoading, setIsLoading] = useState(!!playerCode)
  const playerCodeRef = useRef(playerCode)
  playerCodeRef.current = playerCode

  // Load from cloud on mount or when playerCode changes
  useEffect(() => {
    if (!playerCode) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    loadFromCloud(playerCode).then(cloudProgress => {
      if (cloudProgress) {
        const local = loadLocal()
        // Use whichever has more total stars (more progress)
        const cloudStars = cloudProgress.totalStars || 0
        const localStars = local?.totalStars || 0
        const best = cloudStars >= localStars ? cloudProgress : local || cloudProgress
        setProgress(best)
        saveLocal(best)
        saveToCloud(playerCode, best)
      } else {
        // No cloud data - push local data to cloud
        const local = loadLocal() || getDefaultProgress()
        setProgress(local)
        saveToCloud(playerCode, local)
      }
      setIsLoading(false)
    })
  }, [playerCode])

  const saveLevelResults = useCallback((kingdomId, levelIndex, results) => {
    clearPartialFromStorage()
    setProgress(prev => {
      const next = JSON.parse(JSON.stringify(prev))

      // Keep the better score when replaying a level
      const oldResults = next.kingdoms[kingdomId].levels[levelIndex]
      const oldStars = oldResults.filter(r => r === 'gold' || r === 'silver').length
      const newStars = results.filter(r => r === 'gold' || r === 'silver').length
      next.kingdoms[kingdomId].levels[levelIndex] = newStars >= oldStars ? results : oldResults

      const stars = results.filter(r => r === 'gold' || r === 'silver').length
      if (stars >= 11 && levelIndex < 2) {
        next.kingdoms[kingdomId].unlocked[levelIndex + 1] = true
      }

      const allDone = next.kingdoms[kingdomId].levels.every(l => l.length === 15)
      if (allDone && !next.completedKingdoms.includes(kingdomId)) {
        next.completedKingdoms.push(kingdomId)
      }

      let total = 0
      for (const k of Object.values(next.kingdoms)) {
        for (const level of k.levels) {
          total += level.filter(r => r === 'gold' || r === 'silver').length
        }
      }
      next.totalStars = total

      saveLocal(next)
      if (playerCodeRef.current) {
        saveToCloud(playerCodeRef.current, next)
      }
      return next
    })
  }, [])

  const savePartialProgress = useCallback((kingdomId, levelIndex, results) => {
    savePartialToStorage(kingdomId, levelIndex, results)
  }, [])

  const getPartialProgress = useCallback((kingdomId, levelIndex) => {
    return loadPartialProgress(kingdomId, levelIndex)
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = getDefaultProgress()
    setProgress(fresh)
    saveLocal(fresh)
    clearPartialFromStorage()
    if (playerCodeRef.current) {
      saveToCloud(playerCodeRef.current, fresh)
    }
  }, [])

  return { progress, isLoading, saveLevelResults, savePartialProgress, getPartialProgress, resetProgress }
}
