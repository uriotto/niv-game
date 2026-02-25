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

const KINGDOM_COLORS = {
  sentences: { accent: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.25)', image: 'kingdom-sentences.jpg' },
  words: { accent: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)', image: 'kingdom-words.jpg' },
  numbers: { accent: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.25)', image: 'kingdom-numbers.jpg' },
  problems: { accent: '#f97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.25)', image: 'kingdom-problems.jpg' },
  patterns: { accent: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.25)', image: 'kingdom-patterns.jpg' },
}

export default function Kingdom({ kingdom, progress, onComplete, onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const kingdomProgress = progress.kingdoms[kingdom.id]
  const allQuestions = DATA_MAP[kingdom.id]
  const colors = KINGDOM_COLORS[kingdom.id]

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
    <div className="min-h-screen p-4 md:p-6 flex flex-col items-center relative z-10">
      {/* Kingdom background illustration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={`${import.meta.env.BASE_URL}images/${colors.image}`}
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d24]/80 via-transparent to-[#0d0d24]/90" />
      </div>
      {/* Back button */}
      <div className="w-full max-w-md flex justify-start mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="text-[#8080a0] hover:text-white cursor-pointer text-sm transition-colors"
        >
          ← חזרה למפה
        </motion.button>
      </div>

      {/* Kingdom header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <motion.span
          className="text-6xl block mb-3"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {kingdom.icon}
        </motion.span>
        <h1 className="font-display text-3xl text-[#f0c850] text-shadow-glow">{kingdom.name}</h1>
        <p className="text-[#8080a0] mt-1 text-sm">{kingdom.description}</p>
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
                  ? 'glass-card hover:border-white/20 cursor-pointer'
                  : 'bg-white/[0.02] border border-white/[0.04] opacity-40 cursor-not-allowed'
                }
              `}
              style={isUnlocked ? {
                borderColor: `${colors.accent}30`,
                background: `linear-gradient(135deg, ${colors.bg}, rgba(255,255,255,0.02))`,
              } : {}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isUnlocked ? `שלב ${i + 1}: ${name}` : `🔒 שלב ${i + 1}: ${name}`}
                  </h3>
                  <p className="text-sm text-[#8080a0] mt-1">
                    {isDone
                      ? <span className="text-[#f0c850]">✅ הושלם - {stars}/15 כוכבים</span>
                      : isUnlocked
                        ? '15 שאלות'
                        : 'נעול - צריך 11 כוכבים בשלב הקודם'
                    }
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
                    <span key={j} className={`text-xs ${r === 'gold' ? 'text-star-gold' : r === 'silver' ? 'text-star-silver' : 'text-[#30303a]'}`}>★</span>
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
