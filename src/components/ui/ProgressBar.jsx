import { motion } from 'framer-motion'

export default function ProgressBar({ current, total, color = 'magic-purple' }) {
  const percent = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-full bg-${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ background: `var(--color-${color})` }}
      />
    </div>
  )
}
