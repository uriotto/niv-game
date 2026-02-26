import { useGameState } from '../hooks/useGameState'
import { getRandomMessage, FUNNY_CORRECT, FUNNY_WRONG } from '../utils/scoring'
import StarRating from './ui/StarRating'
import ProgressBar from './ui/ProgressBar'
import Character from './ui/Character'
import HintButton from './ui/HintButton'
import CelebrationModal from './ui/CelebrationModal'
import SentenceCompletion from './questions/SentenceCompletion'
import WordRelations from './questions/WordRelations'
import NumbersInShapes from './questions/NumbersInShapes'
import WordProblems from './questions/WordProblems'
import PatternRecognition from './questions/PatternRecognition'
import { motion } from 'framer-motion'

const QUESTION_COMPONENTS = {
  sentences: SentenceCompletion,
  words: WordRelations,
  numbers: NumbersInShapes,
  problems: WordProblems,
  patterns: PatternRecognition,
}

export default function GameLevel({ kingdom, levelIndex, questions, levelName, onComplete, onBack, initialResults, onPartialProgress }) {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    results,
    attempt,
    usedHint,
    showFeedback,
    isComplete,
    submitAnswer,
    useHint,
    reset,
  } = useGameState(questions, {
    initialResults: initialResults || [],
    onResultsChange: (newResults) => {
      if (onPartialProgress && newResults.length < questions.length) {
        onPartialProgress(kingdom.id, levelIndex, newResults)
      }
    },
  })

  const QuestionComponent = QUESTION_COMPONENTS[kingdom.id]

  const mood = showFeedback === 'correct' ? 'correct' : showFeedback === 'wrong' ? 'wrong' : 'idle'
  const message = showFeedback === 'correct'
    ? getRandomMessage(FUNNY_CORRECT)
    : showFeedback === 'wrong'
      ? getRandomMessage(FUNNY_WRONG)
      : null

  return (
    <div className="min-h-screen p-4 flex flex-col relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="glass-card rounded-xl px-4 py-2 text-[#c0b89c] hover:text-white hover:border-white/20 cursor-pointer text-base font-bold transition-all"
        >
          ← חזרה
        </motion.button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">{kingdom.icon} {kingdom.name}</h2>
          <p className="text-sm text-[#8080a0]">{levelName}</p>
        </div>
        <div className="glass-card rounded-full px-3 py-1 text-sm text-[#c0b89c]">
          {currentIndex + 1}/{totalQuestions}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <ProgressBar current={currentIndex + (showFeedback === 'correct' ? 1 : 0)} total={totalQuestions} color={kingdom.color} />
      </div>
      <div className="mb-6">
        <StarRating results={results} total={totalQuestions} />
      </div>

      {/* Character */}
      <div className="flex justify-center mb-4">
        <Character mood={mood} message={message} />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {currentQuestion && QuestionComponent && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-lg"
          >
            <QuestionComponent
              question={currentQuestion}
              onAnswer={submitAnswer}
              showFeedback={showFeedback}
              attempt={attempt}
            />
          </motion.div>
        )}
      </div>

      {/* Hint */}
      {currentQuestion?.hint && (
        <div className="mt-4 flex justify-center">
          <HintButton
            hint={currentQuestion.hint}
            usedHint={usedHint}
            onUseHint={useHint}
          />
        </div>
      )}

      {/* Celebration */}
      <CelebrationModal
        show={isComplete}
        results={results}
        levelName={levelName}
        kingdomName={kingdom.name}
        magicPower={levelIndex === 2 ? kingdom.name : null}
        onContinue={() => {
          onComplete(results)
        }}
        onRetry={reset}
      />
    </div>
  )
}
