import { useState, useCallback, useEffect, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const LEGACY_STORAGE_KEY = 'niv-magic-book-progress'
const LEGACY_PARTIAL_KEY = 'niv-magic-book-partial'
const PLAYER_KEY = 'niv-magic-book-player'

function storageKey(playerCode) {
  return playerCode ? `niv-magic-book-progress-${playerCode}` : LEGACY_STORAGE_KEY
}

function partialKey(playerCode) {
  return playerCode ? `niv-magic-book-partial-${playerCode}` : LEGACY_PARTIAL_KEY
}

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

function migrateLocalStorage(playerCode) {
  if (!playerCode) return
  const perUserKey = storageKey(playerCode)
  if (!localStorage.getItem(perUserKey)) {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      localStorage.setItem(perUserKey, legacy)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    }
  }
  const perUserPartial = partialKey(playerCode)
  if (!localStorage.getItem(perUserPartial)) {
    const legacyPartial = localStorage.getItem(LEGACY_PARTIAL_KEY)
    if (legacyPartial) {
      localStorage.setItem(perUserPartial, legacyPartial)
      localStorage.removeItem(LEGACY_PARTIAL_KEY)
    }
  }
}

function loadLocal(playerCode) {
  try {
    const saved = localStorage.getItem(storageKey(playerCode))
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to load local progress:', e)
  }
  return null
}

function saveLocal(playerCode, progress) {
  try {
    localStorage.setItem(storageKey(playerCode), JSON.stringify(progress))
  } catch (e) {
    console.warn('Failed to save local progress:', e)
  }
}

function loadPartialProgress(playerCode, kingdomId, levelIndex) {
  try {
    const saved = localStorage.getItem(partialKey(playerCode))
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

function savePartialToStorage(playerCode, kingdomId, levelIndex, results) {
  try {
    localStorage.setItem(partialKey(playerCode), JSON.stringify({ kingdomId, levelIndex, results }))
  } catch (e) {
    console.warn('Failed to save partial progress:', e)
  }
}

function clearPartialFromStorage(playerCode) {
  try {
    localStorage.removeItem(partialKey(playerCode))
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

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ])
}

async function loadFromCloud(playerCode) {
  try {
    const docRef = doc(db, 'players', playerCode)
    const docSnap = await withTimeout(getDoc(docRef), 5000)
    if (docSnap.exists()) {
      return docSnap.data()
    }
  } catch (e) {
    console.warn('Failed to load from cloud:', e)
  }
  return null
}

async function saveToCloud(playerCode, progress, gender) {
  try {
    const docRef = doc(db, 'players', playerCode)
    const data = { progress, updatedAt: new Date().toISOString() }
    if (gender) data.gender = gender
    await setDoc(docRef, data, { merge: true })
  } catch (e) {
    console.warn('Failed to save to cloud:', e)
  }
}

export async function checkPlayerExists(playerCode) {
  try {
    const docRef = doc(db, 'players', playerCode)
    const docSnap = await withTimeout(getDoc(docRef), 5000)
    if (docSnap.exists()) {
      return { exists: true, gender: docSnap.data().gender || null }
    }
  } catch (e) {
    console.warn('Failed to check player:', e)
  }
  return { exists: false }
}

export function useProgress(playerCode, gender) {
  const [progress, setProgress] = useState(() => {
    if (playerCode) migrateLocalStorage(playerCode)
    return loadLocal(playerCode) || getDefaultProgress()
  })
  const [isLoading, setIsLoading] = useState(!!playerCode)
  const [cloudSyncFailed, setCloudSyncFailed] = useState(false)
  const playerCodeRef = useRef(playerCode)
  playerCodeRef.current = playerCode
  const genderRef = useRef(gender)
  genderRef.current = gender

  // Load from cloud on mount or when playerCode changes
  useEffect(() => {
    if (!playerCode) {
      setIsLoading(false)
      return
    }

    migrateLocalStorage(playerCode)
    setIsLoading(true)
    setCloudSyncFailed(false)

    loadFromCloud(playerCode)
      .then(cloudData => {
        const cloudProgress = cloudData?.progress
        if (cloudProgress) {
          const local = loadLocal(playerCode)
          const cloudStars = cloudProgress.totalStars || 0
          const localStars = local?.totalStars || 0
          const best = cloudStars >= localStars ? cloudProgress : local || cloudProgress
          setProgress(best)
          saveLocal(playerCode, best)
          saveToCloud(playerCode, best, genderRef.current)
        } else {
          const local = loadLocal(playerCode) || getDefaultProgress()
          setProgress(local)
          saveToCloud(playerCode, local, genderRef.current)
        }
      })
      .catch(() => {
        setCloudSyncFailed(true)
        const local = loadLocal(playerCode) || getDefaultProgress()
        setProgress(local)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [playerCode])

  const saveLevelResults = useCallback((kingdomId, levelIndex, results) => {
    clearPartialFromStorage(playerCodeRef.current)
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

      saveLocal(playerCodeRef.current, next)
      if (playerCodeRef.current) {
        saveToCloud(playerCodeRef.current, next, genderRef.current)
      }
      return next
    })
  }, [])

  const savePartialProgress = useCallback((kingdomId, levelIndex, results) => {
    savePartialToStorage(playerCodeRef.current, kingdomId, levelIndex, results)
  }, [])

  const getPartialProgress = useCallback((kingdomId, levelIndex) => {
    return loadPartialProgress(playerCodeRef.current, kingdomId, levelIndex)
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = getDefaultProgress()
    setProgress(fresh)
    saveLocal(playerCodeRef.current, fresh)
    clearPartialFromStorage(playerCodeRef.current)
    if (playerCodeRef.current) {
      saveToCloud(playerCodeRef.current, fresh, genderRef.current)
    }
  }, [])

  return { progress, isLoading, cloudSyncFailed, saveLevelResults, savePartialProgress, getPartialProgress, resetProgress }
}
