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
      <div className="bg-orange-900/50 border border-orange-500/30 rounded-2xl p-6 max-w-lg relative">
        {/* Speech bubble tail */}
        <div className="absolute -top-3 right-10 w-6 h-6 bg-orange-900/50 border-r border-t border-orange-500/30 rotate-[-45deg]" />

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
                ? 'bg-green-600 text-white border-2 border-green-400'
                : 'bg-orange-800/40 hover:bg-orange-700/50 text-white border-2 border-orange-500/30 hover:border-orange-400/50'
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
