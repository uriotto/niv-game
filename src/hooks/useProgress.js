import { useState, useCallback } from 'react'

const STORAGE_KEY = 'niv-magic-book-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to load progress:', e)
  }
  return getDefaultProgress()
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

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  const saveProgress = useCallback((newProgress) => {
    setProgress(newProgress)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
    } catch (e) {
      console.warn('Failed to save progress:', e)
    }
  }, [])

  const saveLevelResults = useCallback((kingdomId, levelIndex, results) => {
    setProgress(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next.kingdoms[kingdomId].levels[levelIndex] = results

      // Unlock next level if enough stars
      const stars = results.filter(r => r === 'gold' || r === 'silver').length
      if (stars >= 11 && levelIndex < 2) {
        next.kingdoms[kingdomId].unlocked[levelIndex + 1] = true
      }

      // Check if kingdom is completed (all 3 levels done)
      const allDone = next.kingdoms[kingdomId].levels.every(l => l.length === 15)
      if (allDone && !next.completedKingdoms.includes(kingdomId)) {
        next.completedKingdoms.push(kingdomId)
      }

      // Count total stars
      let total = 0
      for (const k of Object.values(next.kingdoms)) {
        for (const level of k.levels) {
          total += level.filter(r => r === 'gold' || r === 'silver').length
        }
      }
      next.totalStars = total

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.warn('Failed to save progress:', e)
      }
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = getDefaultProgress()
    saveProgress(fresh)
  }, [saveProgress])

  return { progress, saveLevelResults, resetProgress }
}
