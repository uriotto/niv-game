import { motion } from 'framer-motion'

const expressions = {
  idle: { emoji: '🧙‍♀️', label: 'ניב הקוסמת' },
  thinking: { emoji: '🤔', label: 'חושבת...' },
  correct: { emoji: '🎉', label: 'יופי!' },
  wrong: { emoji: '💪', label: 'ננסה שוב!' },
  celebration: { emoji: '🌟', label: 'מדהים!' },
}

export default function Character({ mood = 'idle', message }) {
  const { emoji } = expressions[mood] || expressions.idle
  const showAvatar = mood === 'idle'

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      animate={mood === 'correct' ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {showAvatar ? (
        <motion.img
          src={`${import.meta.env.BASE_URL}images/niv-wizard.png`}
          alt="ניב"
          className="w-12 h-12 object-contain drop-shadow-lg"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <motion.span
          className="text-4xl"
          animate={mood === 'celebration' ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.span>
      )}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-xl px-3 py-1.5 text-sm text-[#f0c850] max-w-48 text-center"
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  )
}
