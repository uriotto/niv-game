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
    <div className="grid grid-cols-3 gap-2 glass-card rounded-xl p-3" style={{ borderColor: 'rgba(236, 72, 153, 0.15)' }}>
      {matrix.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`w-14 h-14 flex items-center justify-center rounded-lg ${
              r === missingRow && c === missingCol
                ? 'bg-[#f0c850]/15 border-2 border-[#f0c850]/50 border-dashed'
                : 'bg-white/[0.03] border border-white/[0.06]'
            }`}
          >
            {r === missingRow && c === missingCol ? (
              <span className="text-[#f0c850] text-xl">?</span>
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
    <div className="flex gap-2 items-center justify-center glass-card rounded-xl p-3" style={{ borderColor: 'rgba(236, 72, 153, 0.15)' }}>
      {sequence.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-14 h-14 flex items-center justify-center rounded-lg ${
            item === null
              ? 'bg-[#f0c850]/15 border-2 border-[#f0c850]/50 border-dashed'
              : 'bg-white/[0.03] border border-white/[0.06]'
          }`}>
            {item === null ? (
              <span className="text-[#f0c850] text-xl">?</span>
            ) : (
              <PatternShape shape={item} />
            )}
          </div>
          {i < sequence.length - 1 && <span className="text-pink-400/60">→</span>}
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

      <p className="text-sm text-pink-400/80 text-center">מצאי את הצורה שמשלימה את הדפוס:</p>

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
                ? 'bg-emerald-600/80 border-2 border-emerald-400/60'
                : 'glass-card hover:border-pink-400/30'
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
