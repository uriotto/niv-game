import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { countStars, STAR_GOLD } from '../../utils/scoring'
import { playLevelComplete, playLevelFail } from '../../utils/sounds'

export default function CelebrationModal({ show, results, levelName, kingdomName, magicPower, onContinue, onRetry }) {
  const totalStars = countStars(results)
  const goldStars = results.filter(r => r === STAR_GOLD).length
  const passed = totalStars >= 11

  useEffect(() => {
    if (show) {
      if (passed) {
        playLevelComplete()
      } else {
        playLevelFail()
      }
    }
  }, [show, passed])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          {/* Confetti */}
          {passed && Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 6 + Math.random() * 8,
                height: 6 + Math.random() * 8,
                background: ['#f0c850', '#8b5cf6', '#10b981', '#f97316', '#ec4899', '#3b82f6'][i % 6],
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
            className="glass-card-warm rounded-3xl p-8 max-w-sm w-full text-center relative"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-4"
            >
              {passed ? '🏆' : '💫'}
            </motion.div>

            <h2 className="font-display text-2xl text-[#f0c850] text-shadow-glow mb-2">
              {passed ? 'כל הכבוד!' : 'ניסיון טוב!'}
            </h2>

            <p className="text-[#8080a0] mb-5">
              {kingdomName} - {levelName}
            </p>

            <div className="flex justify-center gap-6 mb-5">
              <div className="text-center">
                <div className="text-3xl text-star-gold">★</div>
                <div className="text-sm text-[#8080a0]">{goldStars} זהב</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-star-silver">★</div>
                <div className="text-sm text-[#8080a0]">{totalStars - goldStars} כסף</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-[#f0c850] font-display">{totalStars}/15</div>
                <div className="text-sm text-[#8080a0]">כוכבים</div>
              </div>
            </div>

            {passed && magicPower && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card-warm rounded-xl p-3 mb-5"
              >
                <p className="text-[#f0c850] text-sm">✨ קיבלת כוח קסום חדש:</p>
                <p className="text-white font-display text-lg">{magicPower}</p>
              </motion.div>
            )}

            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="glass-card hover:border-white/20 text-[#c0b89c] px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                🔄 שוב
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="btn-magic px-6 py-2.5 text-base"
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
