import { motion } from 'framer-motion'
import { KINGDOMS } from '../utils/scoring'

const KINGDOM_POSITIONS = [
  { x: 50, y: 20 },   // sentences - top center
  { x: 15, y: 42 },   // words - left
  { x: 85, y: 42 },   // numbers - right
  { x: 25, y: 72 },   // problems - bottom left
  { x: 75, y: 72 },   // patterns - bottom right
]

const PATH_POINTS = [
  [50, 28, 15, 42],    // sentences → words
  [50, 28, 85, 42],    // sentences → numbers
  [15, 50, 25, 72],    // words → problems
  [85, 50, 75, 72],    // numbers → patterns
  [25, 72, 75, 72],    // problems → patterns (bottom)
]

export default function WorldMap({ progress, onSelectKingdom, onBack }) {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center relative overflow-hidden">
      {/* Back button */}
      <div className="w-full max-w-2xl flex justify-start mb-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="text-white/70 hover:text-white cursor-pointer text-sm"
        >
          → חזרה
        </motion.button>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-amber-300 text-shadow-glow mb-2 text-center"
      >
        🗺️ מפת העולם הקסום
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white/50 text-sm mb-4"
      >
        ★ {progress.totalStars} כוכבים | {progress.completedKingdoms.length}/5 ממלכות הושלמו
      </motion.p>

      {/* Map */}
      <div className="relative w-full max-w-2xl aspect-[4/3] bg-indigo-950/50 border border-indigo-500/20 rounded-3xl p-4">
        {/* Paths between kingdoms */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {PATH_POINTS.map((p, i) => (
            <line
              key={i}
              x1={`${p[0]}%`} y1={`${p[1]}%`}
              x2={`${p[2]}%`} y2={`${p[3]}%`}
              stroke="rgba(167, 139, 250, 0.2)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}
        </svg>

        {/* Kingdom nodes */}
        {KINGDOMS.map((kingdom, i) => {
          const pos = KINGDOM_POSITIONS[i]
          const kProgress = progress.kingdoms[kingdom.id]
          const totalDone = kProgress.levels.reduce((sum, l) => sum + l.length, 0)
          const isCompleted = progress.completedKingdoms.includes(kingdom.id)
          const totalStarsK = kProgress.levels.flat().filter(r => r === 'gold' || r === 'silver').length

          return (
            <motion.button
              key={kingdom.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectKingdom(kingdom)}
              className="absolute flex flex-col items-center cursor-pointer group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Glow effect */}
              <div className={`absolute -inset-3 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity bg-${kingdom.color}`} />

              {/* Kingdom icon */}
              <motion.div
                animate={isCompleted ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 3 }}
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl
                  ${isCompleted
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30'
                    : `bg-gradient-to-br ${kingdom.bgGradient} border-2 border-white/20`
                  }
                `}
              >
                {kingdom.icon}
              </motion.div>

              {/* Kingdom name */}
              <p className="text-white text-xs md:text-sm font-bold mt-1 whitespace-nowrap">
                {kingdom.name}
              </p>

              {/* Progress indicator */}
              <div className="flex gap-0.5 mt-0.5">
                {[0, 1, 2].map(level => {
                  const levelDone = kProgress.levels[level].length === 15
                  const levelUnlocked = kProgress.unlocked[level]
                  return (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        levelDone ? 'bg-star-gold' : levelUnlocked ? 'bg-white/40' : 'bg-gray-600'
                      }`}
                    />
                  )
                })}
              </div>

              {/* Star count */}
              {totalStarsK > 0 && (
                <p className="text-star-gold text-xs">★ {totalStarsK}</p>
              )}
            </motion.button>
          )
        })}

        {/* Wandering character */}
        <motion.div
          className="absolute text-3xl pointer-events-none"
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -15, 10, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ left: '48%', top: '48%' }}
        >
          🧙‍♀️
        </motion.div>
      </div>
    </div>
  )
}
