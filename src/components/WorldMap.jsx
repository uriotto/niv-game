import { motion } from 'framer-motion'
import { KINGDOMS } from '../utils/scoring'

const KINGDOM_POSITIONS = [
  { x: 50, y: 16 },
  { x: 18, y: 40 },
  { x: 82, y: 40 },
  { x: 25, y: 70 },
  { x: 75, y: 70 },
]

const PATH_CURVES = [
  { x1: 50, y1: 24, x2: 18, y2: 40, cx1: 35, cy1: 28, cx2: 20, cy2: 32 },
  { x1: 50, y1: 24, x2: 82, y2: 40, cx1: 65, cy1: 28, cx2: 80, cy2: 32 },
  { x1: 18, y1: 48, x2: 25, y2: 70, cx1: 15, cy1: 56, cx2: 20, cy2: 62 },
  { x1: 82, y1: 48, x2: 75, y2: 70, cx1: 85, cy1: 56, cx2: 80, cy2: 62 },
  { x1: 25, y1: 70, x2: 75, y2: 70, cx1: 40, cy1: 80, cx2: 60, cy2: 80 },
]

const KINGDOM_COLORS = {
  sentences: { bg: '#2d1b69', border: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
  words: { bg: '#134e3a', border: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  numbers: { bg: '#1e3a5f', border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
  problems: { bg: '#4a2510', border: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
  patterns: { bg: '#4a1042', border: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
}

export default function WorldMap({ progress, onSelectKingdom, onBack }) {
  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col items-center relative z-10">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="text-[#8080a0] hover:text-white cursor-pointer text-sm transition-colors"
        >
          ← חזרה
        </motion.button>
        <div className="glass-card rounded-full px-4 py-1.5 flex items-center gap-3 text-sm">
          <span className="text-star-gold">★ {progress.totalStars}</span>
          <span className="text-[#50506a]">|</span>
          <span className="text-[#8080a0]">{progress.completedKingdoms.length}/5 ממלכות</span>
        </div>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-display text-3xl md:text-4xl text-[#f0c850] text-shadow-glow mb-6 text-center"
      >
        מפת העולם הקסום
      </motion.h1>

      {/* Map container */}
      <div className="relative w-full max-w-2xl aspect-[4/3] glass-card rounded-3xl p-4 overflow-hidden">
        {/* World map background */}
        <img
          src={`${import.meta.env.BASE_URL}images/world-map.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-25 pointer-events-none"
        />
        {/* Background glow orbs */}
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Curved paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(208, 168, 80, 0.15)" />
              <stop offset="50%" stopColor="rgba(208, 168, 80, 0.3)" />
              <stop offset="100%" stopColor="rgba(208, 168, 80, 0.15)" />
            </linearGradient>
          </defs>
          {PATH_CURVES.map((p, i) => (
            <path
              key={i}
              d={`M ${p.x1} ${p.y1} C ${p.cx1} ${p.cy1}, ${p.cx2} ${p.cy2}, ${p.x2} ${p.y2}`}
              stroke="url(#pathGrad)"
              strokeWidth="0.4"
              fill="none"
              strokeDasharray="1.5,1.5"
            />
          ))}
        </svg>

        {/* Kingdom nodes */}
        {KINGDOMS.map((kingdom, i) => {
          const pos = KINGDOM_POSITIONS[i]
          const kProgress = progress.kingdoms[kingdom.id]
          const isCompleted = progress.completedKingdoms.includes(kingdom.id)
          const totalStarsK = kProgress.levels.flat().filter(r => r === 'gold' || r === 'silver').length
          const colors = KINGDOM_COLORS[kingdom.id]

          return (
            <motion.button
              key={kingdom.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring', damping: 12 }}
              whileHover={{ scale: 1.12, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectKingdom(kingdom)}
              className="absolute flex flex-col items-center cursor-pointer group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Glow ring */}
              <div
                className="absolute -inset-4 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: colors.glow }}
              />

              {/* Kingdom circle */}
              <motion.div
                animate={isCompleted ? { rotate: [0, 3, -3, 0] } : {}}
                transition={{ repeat: Infinity, duration: 4 }}
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl transition-shadow duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}cc)`,
                  border: `2px solid ${isCompleted ? '#f0c850' : colors.border}40`,
                  boxShadow: isCompleted
                    ? `0 0 20px rgba(240, 200, 80, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                    : `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                {kingdom.icon}
                {isCompleted && (
                  <div className="absolute -top-1 -left-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs">✓</div>
                )}
              </motion.div>

              {/* Label */}
              <p className="text-white text-[10px] md:text-xs font-bold mt-1.5 whitespace-nowrap text-shadow-soft">
                {kingdom.name}
              </p>

              {/* Level dots */}
              <div className="flex gap-1 mt-0.5">
                {[0, 1, 2].map(level => {
                  const levelDone = kProgress.levels[level].length === 15
                  const levelUnlocked = kProgress.unlocked[level]
                  return (
                    <div
                      key={level}
                      className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{
                        background: levelDone ? '#f0c850' : levelUnlocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  )
                })}
              </div>

              {totalStarsK > 0 && (
                <p className="text-star-gold text-[10px] mt-0.5">★ {totalStarsK}</p>
              )}
            </motion.button>
          )
        })}

        {/* Wandering Niv */}
        <motion.img
          src={`${import.meta.env.BASE_URL}images/niv-wizard.png`}
          alt="ניב"
          className="absolute w-12 h-12 md:w-16 md:h-16 object-contain pointer-events-none z-20 drop-shadow-lg"
          animate={{
            x: [0, 20, -15, 8, 0],
            y: [0, -10, 8, -5, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ left: '48%', top: '46%' }}
        />
      </div>
    </div>
  )
}
