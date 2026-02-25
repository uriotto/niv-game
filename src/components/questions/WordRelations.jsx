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
      <div className="glass-card rounded-2xl p-6 text-center" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
        <p className="text-sm text-emerald-400/80 mb-2">מצאי את הזוג עם אותו יחס:</p>
        <div className="flex items-center justify-center gap-3 text-2xl">
          <span className="bg-emerald-500/15 px-4 py-2 rounded-xl text-white font-bold border border-emerald-500/20">
            {question.pair[0]}
          </span>
          <span className="text-emerald-400 text-lg">:</span>
          <span className="bg-emerald-500/15 px-4 py-2 rounded-xl text-white font-bold border border-emerald-500/20">
            {question.pair[1]}
          </span>
        </div>
        {question.relation && (
          <p className="text-xs text-emerald-400/50 mt-2">({question.relation})</p>
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
                ? 'bg-emerald-600/80 text-white border-2 border-emerald-400/60'
                : 'glass-card hover:border-emerald-400/30 text-white'
              }
              disabled:cursor-default
            `}
          >
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>{pair[0]}</span>
              <span className="text-emerald-400/60 text-sm">:</span>
              <span>{pair[1]}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
