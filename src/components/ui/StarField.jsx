import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function StarField({ count = 40 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    })),
  [count])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.size > 2
              ? 'radial-gradient(circle, rgba(240, 200, 80, 0.9), rgba(240, 200, 80, 0))'
              : 'radial-gradient(circle, rgba(200, 210, 240, 0.8), rgba(200, 210, 240, 0))',
          }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
