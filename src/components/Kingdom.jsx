import { useState } from 'react'
import { motion } from 'framer-motion'
import { LEVEL_NAMES } from '../utils/scoring'
import GameLevel from './GameLevel'

// Import question data
import sentencesData from '../data/sentences.json'
import wordsData from '../data/word-relations.json'
import numbersData from '../data/numbers-shapes.json'
import problemsData from '../data/word-problems.json'
import patternsData from '../data/patterns.json'

const DATA_MAP = {
  sentences: sentencesData,
  words: wordsData,
  numbers: numbersData,
  problems: problemsData,
  patterns: patternsData,
}

export default function Kingdom({ kingdom, progress, onComplete, onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const kingdomProgress = progress.kingdoms[kingdom.id]
  const allQuestions = DATA_MAP[kingdom.id]

  if (selectedLevel !== null) {
    const levelQuestions = allQuestions.levels[selectedLevel]
    return (
      <GameLevel
        kingdom={kingdom}
        levelIndex={selectedLevel}
        questions={levelQuestions}
        levelName={LEVEL_NAMES[selectedLevel]}
        onComplete={(results) => {
          onComplete(kingdom.id, selectedLevel, results)
          setSelectedLevel(null)
        }}
        onBack={() => setSelectedLevel(null)}
      />
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${kingdom.bgGradient} p-6 flex flex-col items-center`}>
      {/* Back button */}
      <div className="w-full max-w-md flex justify-start mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="text-white/70 hover:text-white cursor-pointer"
        >
          → חזרה למפה
        </motion.button>
      </div>

      {/* Kingdom header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <span className="text-6xl block mb-3">{kingdom.icon}</span>
        <h1 className="text-3xl font-bold text-white text-shadow-glow">{kingdom.name}</h1>
        <p className="text-white/60 mt-1">{kingdom.description}</p>
      </motion.div>

      {/* Levels */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {LEVEL_NAMES.map((name, i) => {
          const isUnlocked = kingdomProgress.unlocked[i]
          const results = kingdomProgress.levels[i]
          const isDone = results.length === 15
          const stars = results.filter(r => r === 'gold' || r === 'silver').length

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={isUnlocked ? { scale: 1.03 } : {}}
              whileTap={isUnlocked ? { scale: 0.97 } : {}}
              onClick={() => isUnlocked && setSelectedLevel(i)}
              disabled={!isUnlocked}
              className={`
                p-5 rounded-2xl text-right transition-all
                ${isUnlocked
                  ? 'bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 cursor-pointer'
                  : 'bg-gray-800/30 border-2 border-gray-600/20 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isUnlocked ? `שלב ${i + 1}: ${name}` : `🔒 שלב ${i + 1}: ${name}`}
                  </h3>
                  <p className="text-sm text-white/60 mt-1">
                    {isDone ? `✅ הושלם - ${stars}/15 כוכבים` : isUnlocked ? '15 שאלות' : 'נעול - צריך 11 כוכבים בשלב הקודם'}
                  </p>
                </div>
                {isDone && (
                  <div className="text-3xl">
                    {stars >= 13 ? '🏆' : stars >= 11 ? '⭐' : '💫'}
                  </div>
                )}
              </div>

              {isDone && (
                <div className="flex gap-0.5 mt-2">
                  {results.map((r, j) => (
                    <span key={j} className={`text-xs ${r === 'gold' ? 'text-star-gold' : r === 'silver' ? 'text-star-silver' : 'text-gray-600'}`}>★</span>
                  ))}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
