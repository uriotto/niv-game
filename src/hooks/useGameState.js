import { useState, useCallback } from 'react'
import { getStarType } from '../utils/scoring'

export function useGameState(questions, { initialResults = [], onResultsChange } = {}) {
  const [currentIndex, setCurrentIndex] = useState(initialResults.length)
  const [results, setResults] = useState(initialResults)
  const [attempt, setAttempt] = useState(1)
  const [usedHint, setUsedHint] = useState(false)
  const [showFeedback, setShowFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = questions[currentIndex] || null
  const totalQuestions = questions.length

  const submitAnswer = useCallback((answerIndex) => {
    if (!currentQuestion || showFeedback === 'correct') return

    const isCorrect = answerIndex === currentQuestion.correct

    if (isCorrect) {
      const star = getStarType(attempt, usedHint)
      const newResults = [...results, star]
      setResults(newResults)
      setShowFeedback('correct')

      // Save partial progress after each correct answer
      if (onResultsChange) {
        onResultsChange(newResults)
      }

      setTimeout(() => {
        setShowFeedback(null)
        setAttempt(1)
        setUsedHint(false)
        if (currentIndex + 1 >= totalQuestions) {
          setIsComplete(true)
        } else {
          setCurrentIndex(prev => prev + 1)
        }
      }, 1500)
    } else {
      setAttempt(prev => prev + 1)
      setShowFeedback('wrong')
      setTimeout(() => setShowFeedback(null), 1000)
    }
  }, [currentQuestion, currentIndex, totalQuestions, attempt, usedHint, showFeedback, results, onResultsChange])

  const useHint = useCallback(() => {
    setUsedHint(true)
  }, [])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setResults([])
    setAttempt(1)
    setUsedHint(false)
    setShowFeedback(null)
    setIsComplete(false)
    if (onResultsChange) {
      onResultsChange([])
    }
  }, [onResultsChange])

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    results,
    attempt,
    usedHint,
    showFeedback,
    isComplete,
    submitAnswer,
    useHint,
    reset,
  }
}
