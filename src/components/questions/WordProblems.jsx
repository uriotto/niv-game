import { motion } from 'framer-motion'

export default function WordProblems({ question, onAnswer, showFeedback }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Funny character */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-5xl"
      >
        {question.character || '🧑‍🌾'}
      </motion.div>

      {/* Speech bubble with problem */}
      <div className="glass-card rounded-2xl p-6 max-w-lg relative" style={{ borderColor: 'rgba(249, 115, 22, 0.2)' }}>
        {/* Speech bubble tail */}
        <div className="absolute -top-3 right-10 w-6 h-6 rotate-[-45deg]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            borderRight: '1px solid rgba(249, 115, 22, 0.2)',
            borderTop: '1px solid rgba(249, 115, 22, 0.2)',
          }}
        />

        <p className="text-lg text-white leading-relaxed text-center">
          {question.text}
        </p>

        {question.illustration && (
          <div className="text-center text-3xl mt-3">
            {question.illustration}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(i)}
            disabled={showFeedback === 'correct'}
            className={`
              p-4 rounded-2xl text-xl font-bold transition-all cursor-pointer
              ${showFeedback === 'correct' && i === question.correct
                ? 'bg-emerald-600/80 text-white border-2 border-emerald-400/60'
                : 'glass-card hover:border-orange-400/30 text-white'
              }
              disabled:cursor-default
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
