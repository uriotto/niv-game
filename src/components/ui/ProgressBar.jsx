import { motion } from 'framer-motion'

export default function ProgressBar({ current, total, color = 'magic-purple' }) {
  const percent = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full bg-white/[0.05] rounded-full h-2.5 overflow-hidden border border-white/[0.06]">
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(90deg, var(--color-${color}), var(--color-${color})cc)`,
          boxShadow: `0 0 8px var(--color-${color})60`,
        }}
      />
    </div>
  )
}
