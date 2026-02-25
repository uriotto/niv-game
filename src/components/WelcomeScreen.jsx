import { motion } from 'framer-motion'

export default function WelcomeScreen({ onStart, totalStars }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating stars background */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-300/20 text-2xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Magic book */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
        className="text-8xl mb-6 animate-float"
      >
        📖
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-5xl font-bold text-amber-300 text-shadow-glow mb-2 text-center"
      >
        ניב והספר הקסום
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/60 text-lg mb-8 text-center max-w-md"
      >
        מסע קסום דרך 5 ממלכות מלאות חידות, מילים, מספרים וצורות!
      </motion.p>

      {/* Character */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col items-center mb-8"
      >
        <span className="text-6xl mb-2">🧙‍♀️</span>
        <p className="text-amber-200 text-sm">ניב הקוסמת מוכנה להרפתקה!</p>
      </motion.div>

      {/* Stars counter */}
      {totalStars > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 mb-6"
        >
          <span className="text-star-gold">★</span>
          <span className="text-amber-200 mr-1">{totalStars} כוכבים נאספו</span>
        </motion.div>
      )}

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="bg-gradient-to-l from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
      >
        ✨ יאללה להרפתקה!
      </motion.button>
    </div>
  )
}
