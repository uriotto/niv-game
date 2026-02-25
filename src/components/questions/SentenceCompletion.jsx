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
      <div className="glass-card rounded-2xl p-6 text-center max-w-lg" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
        <p className="text-xl text-white leading-relaxed">
          {parts[0]}
          <span className="inline-block mx-2 px-4 py-1 bg-[#f0c850]/15 border-b-2 border-[#f0c850] rounded text-[#f0c850] min-w-20">
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
                ? 'bg-emerald-600/80 text-white border-2 border-emerald-400/60'
                : showFeedback === 'wrong' && i === question.lastWrong
                  ? 'bg-red-900/30 text-red-300 border-2 border-red-500/30'
                  : 'glass-card hover:border-purple-400/30 text-white'
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
