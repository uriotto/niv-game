import { motion } from 'framer-motion'

function PatternShape({ shape, size = 40, color = '#fff' }) {
  if (!shape) return <span className="text-2xl">❓</span>

  // Emoji-based shapes for simplicity
  if (typeof shape === 'string') {
    return <span className="text-2xl">{shape}</span>
  }

  // SVG-based shapes
  const { type, fill, stroke, rotation = 0 } = shape
  const s = size

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ transform: `rotate(${rotation}deg)` }}>
      {type === 'circle' && (
        <circle cx={s/2} cy={s/2} r={s/2 - 4} fill={fill || 'none'} stroke={stroke || color} strokeWidth="2" />
      )}
      {type === 'square' && (
        <rect x="4" y="4" width={s-8} height={s-8} fill={fill || 'none'} stroke={stroke || color} strokeWidth="2" />
      )}
      {type === 'triangle' && (
        <polygon points={`${s/2},4 4,${s-4} ${s-4},${s-4}`} fill={fill || 'none'} stroke={stroke || color} strokeWidth="2" />
      )}
      {type === 'diamond' && (
        <polygon points={`${s/2},4 ${s-4},${s/2} ${s/2},${s-4} 4,${s/2}`} fill={fill || 'none'} stroke={stroke || color} strokeWidth="2" />
      )}
      {type === 'star' && (
        <polygon
          points={`${s/2},2 ${s*0.62},${s*0.38} ${s-2},${s*0.38} ${s*0.68},${s*0.6} ${s*0.78},${s-2} ${s/2},${s*0.72} ${s*0.22},${s-2} ${s*0.32},${s*0.6} 2,${s*0.38} ${s*0.38},${s*0.38}`}
          fill={fill || 'none'}
          stroke={stroke || color}
          strokeWidth="2"
        />
      )}
    </svg>
  )
}

function MatrixGrid({ matrix, missingRow, missingCol }) {
  return (
    <div className="grid grid-cols-3 gap-2 bg-pink-900/30 border border-pink-500/20 rounded-xl p-3">
      {matrix.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`w-14 h-14 flex items-center justify-center rounded-lg ${
              r === missingRow && c === missingCol
                ? 'bg-amber-500/20 border-2 border-amber-400 border-dashed'
                : 'bg-pink-800/30 border border-pink-500/20'
            }`}
          >
            {r === missingRow && c === missingCol ? (
              <span className="text-amber-400 text-xl">?</span>
            ) : (
              <PatternShape shape={cell} />
            )}
          </div>
        ))
      )}
    </div>
  )
}

function SequenceRow({ sequence }) {
  return (
    <div className="flex gap-2 items-center justify-center bg-pink-900/30 border border-pink-500/20 rounded-xl p-3">
      {sequence.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-14 h-14 flex items-center justify-center rounded-lg ${
            item === null
              ? 'bg-amber-500/20 border-2 border-amber-400 border-dashed'
              : 'bg-pink-800/30 border border-pink-500/20'
          }`}>
            {item === null ? (
              <span className="text-amber-400 text-xl">?</span>
            ) : (
              <PatternShape shape={item} />
            )}
          </div>
          {i < sequence.length - 1 && <span className="text-pink-400">→</span>}
        </div>
      ))}
    </div>
  )
}

export default function PatternRecognition({ question, onAnswer, showFeedback }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Castle decoration */}
      <div className="flex gap-4 text-3xl">
        <span className="animate-float">🏰</span>
        <span className="animate-sparkle" style={{ animationDelay: '0.3s' }}>✨</span>
        <span className="animate-float" style={{ animationDelay: '0.6s' }}>🗝️</span>
      </div>

      <p className="text-sm text-pink-300 text-center">מצאי את הצורה שמשלימה את הדפוס:</p>

      {/* Pattern display */}
      {question.type === 'matrix' ? (
        <MatrixGrid
          matrix={question.matrix}
          missingRow={question.missingRow}
          missingCol={question.missingCol}
        />
      ) : (
        <SequenceRow sequence={question.sequence} />
      )}

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
              p-4 rounded-2xl flex items-center justify-center transition-all cursor-pointer min-h-16
              ${showFeedback === 'correct' && i === question.correct
                ? 'bg-green-600 border-2 border-green-400'
                : 'bg-pink-800/40 hover:bg-pink-700/50 border-2 border-pink-500/30 hover:border-pink-400/50'
              }
              disabled:cursor-default
            `}
          >
            <PatternShape shape={option} size={44} />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
