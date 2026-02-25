import { motion } from 'framer-motion'

function ShapeDisplay({ shape }) {
  const { type, numbers, missingIndex } = shape

  if (type === 'triangle') {
    return (
      <svg viewBox="0 0 200 180" className="w-48 h-44 mx-auto">
        <polygon
          points="100,10 10,170 190,170"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
        />
        {/* Top */}
        <text x="100" y="45" textAnchor="middle" fill={missingIndex === 0 ? '#fbbf24' : 'white'} fontSize="24" fontWeight="bold">
          {missingIndex === 0 ? '?' : numbers[0]}
        </text>
        {/* Bottom left */}
        <text x="45" y="155" textAnchor="middle" fill={missingIndex === 1 ? '#fbbf24' : 'white'} fontSize="24" fontWeight="bold">
          {missingIndex === 1 ? '?' : numbers[1]}
        </text>
        {/* Bottom right */}
        <text x="155" y="155" textAnchor="middle" fill={missingIndex === 2 ? '#fbbf24' : 'white'} fontSize="24" fontWeight="bold">
          {missingIndex === 2 ? '?' : numbers[2]}
        </text>
        {/* Center */}
        {numbers[3] !== undefined && (
          <text x="100" y="120" textAnchor="middle" fill={missingIndex === 3 ? '#fbbf24' : '#93c5fd'} fontSize="20">
            {missingIndex === 3 ? '?' : numbers[3]}
          </text>
        )}
      </svg>
    )
  }

  if (type === 'circle') {
    return (
      <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
        <circle cx="100" cy="100" r="85" fill="none" stroke="#60a5fa" strokeWidth="3" />
        <line x1="100" y1="15" x2="100" y2="185" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />
        <line x1="15" y1="100" x2="185" y2="100" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />
        {/* Top-right */}
        <text x="140" y="65" textAnchor="middle" fill={missingIndex === 0 ? '#fbbf24' : 'white'} fontSize="22" fontWeight="bold">
          {missingIndex === 0 ? '?' : numbers[0]}
        </text>
        {/* Top-left */}
        <text x="60" y="65" textAnchor="middle" fill={missingIndex === 1 ? '#fbbf24' : 'white'} fontSize="22" fontWeight="bold">
          {missingIndex === 1 ? '?' : numbers[1]}
        </text>
        {/* Bottom-left */}
        <text x="60" y="145" textAnchor="middle" fill={missingIndex === 2 ? '#fbbf24' : 'white'} fontSize="22" fontWeight="bold">
          {missingIndex === 2 ? '?' : numbers[2]}
        </text>
        {/* Bottom-right */}
        <text x="140" y="145" textAnchor="middle" fill={missingIndex === 3 ? '#fbbf24' : 'white'} fontSize="22" fontWeight="bold">
          {missingIndex === 3 ? '?' : numbers[3]}
        </text>
      </svg>
    )
  }

  // Default: square/rectangle
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      <rect x="15" y="15" width="170" height="170" rx="10" fill="none" stroke="#60a5fa" strokeWidth="3" />
      <line x1="100" y1="15" x2="100" y2="185" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />
      <line x1="15" y1="100" x2="185" y2="100" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />
      {/* Top-right */}
      <text x="145" y="65" textAnchor="middle" fill={missingIndex === 0 ? '#fbbf24' : 'white'} fontSize="24" fontWeight="bold">
        {missingIndex === 0 ? '?' : numbers[0]}
      </text>
      {/* Top-left */}
      <text x="55" y="65" textAnchor="middle" fill={missingIndex === 1 ? '#fbbf24' : 'white'} fontSize="24" fontWeight="bold">
        {missingIndex === 1 ? '?' : numbers[1]}
      </text>
      {/* Bottom-left */}
      <text x="55" y="145" textAnchor="middle" fill={missingIndex === 2 ? '#fbbf24' : 'white'} fontSize="24" fontWeight="bold">
        {missingIndex === 2 ? '?' : numbers[2]}
      </text>
      {/* Bottom-right */}
      <text x="145" y="145" textAnchor="middle" fill={missingIndex === 3 ? '#fbbf24' : 'white'} fontSize="24" fontWeight="bold">
        {missingIndex === 3 ? '?' : numbers[3]}
      </text>
    </svg>
  )
}

export default function NumbersInShapes({ question, onAnswer, showFeedback }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Crystal decoration */}
      <div className="flex gap-4 text-3xl">
        <span className="animate-sparkle">💎</span>
        <span className="animate-sparkle" style={{ animationDelay: '0.3s' }}>🔮</span>
        <span className="animate-sparkle" style={{ animationDelay: '0.6s' }}>💎</span>
      </div>

      {/* Shape with numbers */}
      <div className="bg-blue-900/50 border border-blue-500/30 rounded-2xl p-6">
        <p className="text-sm text-blue-300 mb-3 text-center">מצאי את המספר החסר:</p>
        <ShapeDisplay shape={question.shape} />
        {question.operation && (
          <p className="text-xs text-blue-400/60 mt-2 text-center">({question.operation})</p>
        )}
      </div>

      {/* Options as crystals */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {question.options.map((num, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAnswer(i)}
            disabled={showFeedback === 'correct'}
            className={`
              p-4 rounded-2xl text-2xl font-bold transition-all cursor-pointer
              ${showFeedback === 'correct' && i === question.correct
                ? 'bg-green-600 text-white border-2 border-green-400'
                : 'bg-blue-800/40 hover:bg-blue-700/50 text-white border-2 border-blue-500/30 hover:border-blue-400/50'
              }
              disabled:cursor-default
            `}
          >
            💎 {num}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
