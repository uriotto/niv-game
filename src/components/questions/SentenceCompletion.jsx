import { motion } from 'framer-motion'

export default function SentenceCompletion({ question, onAnswer, showFeedback, attempt }) {
  const parts = question.text.split('___')

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Floating books decoration */}
      <div className="flex gap-4 text-3xl animate-float">
        <span>📚</span>
        <span className="animate-float" style={{ animationDelay: '0.5s' }}>📖</span>
        <span className="animate-float" style={{ animationDelay: '1s' }}>📕</span>
      </div>

      {/* Sentence with blank */}
      <div className="bg-purple-900/50 border border-purple-500/30 rounded-2xl p-6 text-center max-w-lg">
        <p className="text-xl text-white leading-relaxed">
          {parts[0]}
          <span className="inline-block mx-2 px-4 py-1 bg-amber-500/20 border-b-2 border-amber-400 rounded text-amber-300 min-w-20">
            {showFeedback === 'correct' ? question.options[question.correct] : '?'}
          </span>
          {parts[1]}
        </p>
      </div>

      {/* Options as floating bubbles */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(i)}
            disabled={showFeedback === 'correct'}
            className={`
              p-4 rounded-2xl text-lg font-medium transition-all cursor-pointer
              ${showFeedback === 'correct' && i === question.correct
                ? 'bg-green-600 text-white border-2 border-green-400'
                : showFeedback === 'wrong' && i === question.lastWrong
                  ? 'bg-red-900/50 text-red-300 border-2 border-red-500/50'
                  : 'bg-purple-800/50 hover:bg-purple-700/50 text-white border-2 border-purple-500/30 hover:border-purple-400/50'
              }
              disabled:cursor-default
            `}
          >
            <span className="animate-float inline-block" style={{ animationDelay: `${i * 0.2}s` }}>
              {option}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
