import { motion } from 'framer-motion'
import { getRandomMessage, FUNNY_HINT } from '../../utils/scoring'

export default function HintButton({ hint, usedHint, onUseHint }) {
  if (usedHint) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-900/50 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-sm text-center"
      >
        <p className="text-xs text-amber-400 mb-1">{getRandomMessage(FUNNY_HINT)}</p>
        <p>{hint}</p>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onUseHint}
      className="bg-amber-800/30 hover:bg-amber-800/50 border border-amber-500/30 text-amber-300 rounded-xl px-4 py-2 text-sm transition-colors cursor-pointer"
    >
      🪄 רמז קסום (מוריד לכוכב כסף)
    </motion.button>
  )
}
