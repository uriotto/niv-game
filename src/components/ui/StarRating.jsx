import { motion } from 'framer-motion'

export default function StarRating({ results, total }) {
  return (
    <div className="flex gap-1 items-center justify-center flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const result = results[i]
        const isGold = result === 'gold'
        const isSilver = result === 'silver'
        const isDone = result !== undefined

        return (
          <motion.span
            key={i}
            initial={isDone ? { scale: 0 } : {}}
            animate={isDone ? { scale: 1 } : {}}
            className={`text-lg ${
              isGold ? 'text-star-gold' : isSilver ? 'text-star-silver' : 'text-[#25252f]'
            }`}
          >
            {isDone ? (isGold ? '★' : isSilver ? '★' : '☆') : '☆'}
          </motion.span>
        )
      })}
    </div>
  )
}
