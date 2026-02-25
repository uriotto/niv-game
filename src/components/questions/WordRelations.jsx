import { motion } from 'framer-motion'

export default function WordRelations({ question, onAnswer, showFeedback }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Forest decoration */}
      <div className="flex gap-4 text-3xl">
        <span className="animate-float">🌲</span>
        <span className="animate-float" style={{ animationDelay: '0.3s' }}>🦊</span>
        <span className="animate-float" style={{ animationDelay: '0.6s' }}>🌳</span>
      </div>

      {/* Word pair on sign */}
      <div className="bg-emerald-900/60 border-2 border-emerald-500/40 rounded-2xl p-6 text-center">
        <p className="text-sm text-emerald-300 mb-2">מצאי את הזוג עם אותו יחס:</p>
        <div className="flex items-center justify-center gap-3 text-2xl">
          <span className="bg-emerald-700/50 px-4 py-2 rounded-xl text-white font-bold">
            {question.pair[0]}
          </span>
          <span className="text-emerald-400 text-lg">:</span>
          <span className="bg-emerald-700/50 px-4 py-2 rounded-xl text-white font-bold">
            {question.pair[1]}
          </span>
        </div>
        {question.relation && (
          <p className="text-xs text-emerald-400/60 mt-2">({question.relation})</p>
        )}
      </div>

      {/* Options as leaves */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {question.options.map((pair, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(i)}
            disabled={showFeedback === 'correct'}
            className={`
              p-4 rounded-2xl transition-all cursor-pointer
              ${showFeedback === 'correct' && i === question.correct
                ? 'bg-green-600 text-white border-2 border-green-400'
                : 'bg-emerald-800/40 hover:bg-emerald-700/50 text-white border-2 border-emerald-500/30 hover:border-emerald-400/50'
              }
              disabled:cursor-default
            `}
          >
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>{pair[0]}</span>
              <span className="text-emerald-400 text-sm">:</span>
              <span>{pair[1]}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
