import { motion } from 'framer-motion'
import { getRandomMessage, FUNNY_HINT } from '../../utils/scoring'

export default function HintButton({ hint, usedHint, onUseHint }) {
  if (usedHint) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-warm rounded-xl p-3 text-[#c0b89c] text-sm text-center max-w-sm"
      >
        <p className="text-xs text-[#f0c850] mb-1">{getRandomMessage(FUNNY_HINT)}</p>
        <p>{hint}</p>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onUseHint}
      className="glass-card hover:border-amber-500/30 text-[#f0c850] rounded-xl px-4 py-2 text-sm transition-all cursor-pointer"
    >
      🪄 רמז קסום (מוריד לכוכב כסף)
    </motion.button>
  )
}
