import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { playGoldStar, playSilverStar } from '../../utils/sounds'

export default function StarRating({ results, total }) {
  const prevLength = useRef(results.length)

  useEffect(() => {
    if (results.length > prevLength.current) {
      const latest = results[results.length - 1]
      if (latest === 'gold') {
        playGoldStar()
      } else if (latest === 'silver') {
        playSilverStar()
      }
    }
    prevLength.current = results.length
  }, [results])

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
