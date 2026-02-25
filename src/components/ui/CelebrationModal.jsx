import { motion, AnimatePresence } from 'framer-motion'
import { countStars, STAR_GOLD } from '../../utils/scoring'

export default function CelebrationModal({ show, results, levelName, kingdomName, magicPower, onContinue, onRetry }) {
  const totalStars = countStars(results)
  const goldStars = results.filter(r => r === STAR_GOLD).length
  const passed = totalStars >= 11

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          {/* Confetti */}
          {passed && Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#fbbf24', '#a78bfa', '#10b981', '#f97316', '#ec4899'][i % 5],
                left: `${Math.random() * 100}%`,
              }}
              initial={{ top: '-5%', rotate: 0, opacity: 1 }}
              animate={{
                top: '105%',
                rotate: 720,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeIn',
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-amber-500/50 rounded-2xl p-8 max-w-sm w-full text-center relative"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-4"
            >
              {passed ? '🏆' : '💫'}
            </motion.div>

            <h2 className="text-2xl font-bold text-amber-300 mb-2">
              {passed ? 'כל הכבוד!' : 'ניסיון טוב!'}
            </h2>

            <p className="text-white/80 mb-4">
              {kingdomName} - {levelName}
            </p>

            <div className="flex justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl text-star-gold">★</div>
                <div className="text-sm text-gray-300">{goldStars} זהב</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-star-silver">★</div>
                <div className="text-sm text-gray-300">{totalStars - goldStars} כסף</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-amber-400">{totalStars}/15</div>
                <div className="text-sm text-gray-300">כוכבים</div>
              </div>
            </div>

            {passed && magicPower && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 mb-4"
              >
                <p className="text-amber-300 text-sm">✨ קיבלת כוח קסום חדש:</p>
                <p className="text-amber-100 font-bold">{magicPower}</p>
              </motion.div>
            )}

            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl transition-colors cursor-pointer"
              >
                🔄 שוב
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-xl transition-colors cursor-pointer"
              >
                {passed ? '⭐ המשך' : '🏠 חזרה'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
