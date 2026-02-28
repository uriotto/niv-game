import { useState } from 'react'
import { motion } from 'framer-motion'
import { g } from '../contexts/PlayerContext'
import { checkPlayerExists, getPlayerCode } from '../hooks/useProgress'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function WelcomeScreen({ onStart, totalStars, player, onPlayerChange }) {
  const [nameInput, setNameInput] = useState(player?.name || '')
  const [pinInput, setPinInput] = useState(player?.pin || '')
  const [gender, setGender] = useState(player?.gender || 'female')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const isValid = nameInput.trim().length > 0 && /^\d{4}$/.test(pinInput)

  const handleStart = async () => {
    if (!isValid || checking) return
    const newPlayer = { name: nameInput.trim(), pin: pinInput, gender, isGuest: false }
    const code = getPlayerCode(newPlayer)

    // If returning as the same player, skip collision check
    if (player && getPlayerCode(player) === code) {
      onPlayerChange({ ...newPlayer, gender })
      onStart()
      return
    }

    // New registration - check for collision
    setError('')
    setChecking(true)
    try {
      const result = await checkPlayerExists(code)
      if (result.exists && result.gender && result.gender !== gender) {
        setError('הקוד הזה כבר תפוס! נסו קוד אחר.')
        setChecking(false)
        return
      }
    } catch {
      // Network error - allow login anyway
    }
    setChecking(false)
    onPlayerChange(newPlayer)
    onStart()
  }

  const handleGuestStart = () => {
    const guestName = g('אורח', 'אורחת', gender)
    onPlayerChange({ name: guestName, pin: null, gender, isGuest: true })
    onStart()
  }

  const displayName = nameInput.trim() || g('קוסם', 'קוסמת', gender)
  const wizardTitle = g('הקוסם', 'הקוסמת', gender)

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10"
    >
      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Magic book with glow */}
      <motion.div
        variants={fadeUp}
        className="relative mb-8"
      >
        <div className="absolute inset-0 w-40 h-40 -translate-x-4 -translate-y-4 bg-amber-500/20 rounded-full blur-2xl" />
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <img src={`${import.meta.env.BASE_URL}images/magic-book.jpg`} alt="ספר קסום" className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-2xl" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={fadeUp}
        className="font-display text-5xl md:text-6xl text-[#f0c850] text-shadow-glow mb-3 text-center leading-tight"
      >
        {nameInput.trim() || 'ניב'} והספר הקסום
      </motion.h1>

      {/* Decorative line */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 mb-6"
      >
        <div className="h-px w-16 bg-gradient-to-l from-amber-500/50 to-transparent" />
        <span className="text-amber-400/60 text-sm">✦</span>
        <div className="h-px w-16 bg-gradient-to-r from-amber-500/50 to-transparent" />
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-[#a0a0b8] text-lg mb-6 text-center max-w-md leading-relaxed"
      >
        מסע קסום דרך חמש ממלכות
        <br />
        מלאות חידות, מילים, מספרים וצורות
      </motion.p>

      {/* Gender selection */}
      <motion.div
        variants={fadeUp}
        className="flex gap-3 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGender('male')}
          className={`px-5 py-3 rounded-2xl text-lg font-bold transition-all cursor-pointer ${
            gender === 'male'
              ? 'glass-card-warm border-2 border-[#f0c850]/60 text-[#f0c850]'
              : 'glass-card text-[#a0a0b8] hover:border-white/20'
          }`}
        >
          🧙‍♂️ קוסם
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGender('female')}
          className={`px-5 py-3 rounded-2xl text-lg font-bold transition-all cursor-pointer ${
            gender === 'female'
              ? 'glass-card-warm border-2 border-[#f0c850]/60 text-[#f0c850]'
              : 'glass-card text-[#a0a0b8] hover:border-white/20'
          }`}
        >
          🧙‍♀️ קוסמת
        </motion.button>
      </motion.div>

      {/* Player login */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-2xl px-6 py-4 mb-6 w-full max-w-xs"
      >
        <label className="block text-[#a0a0b8] text-sm mb-2 text-center">
          שם
        </label>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder={g('למשל: דניאל', 'למשל: ניב', gender)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white text-lg placeholder-white/20 focus:outline-none focus:border-[#f0c850]/50 transition-colors"
          dir="rtl"
        />
        <label className="block text-[#a0a0b8] text-sm mb-2 mt-3 text-center">
          קוד סודי (4 ספרות)
        </label>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={4}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="1234"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white text-2xl tracking-[0.5em] placeholder-white/20 focus:outline-none focus:border-[#f0c850]/50 transition-colors font-mono"
          dir="ltr"
        />
        <p className="text-[#50506a] text-xs mt-2 text-center">
          השם והקוד שומרים את ההתקדמות בכל מכשיר.
          <br />
          אפשר גם לשחק בלי רישום 😊
        </p>
        {error && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}
      </motion.div>

      {/* Character card */}
      <motion.div
        variants={fadeUp}
        className="glass-card-warm rounded-2xl px-6 py-4 flex items-center gap-4 mb-6"
      >
        <motion.img
          src={`${import.meta.env.BASE_URL}images/niv-wizard.png`}
          alt={displayName}
          className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-xl"
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div>
          <p className="font-display text-[#f0c850] text-lg">{displayName} {wizardTitle}</p>
          <p className="text-[#a0a0b8] text-sm">{g('מוכן', 'מוכנה', gender)} להרפתקה!</p>
        </div>
      </motion.div>

      {/* Stars counter */}
      {totalStars > 0 && (
        <motion.div
          variants={fadeUp}
          className="glass-card rounded-xl px-5 py-2.5 mb-6 flex items-center gap-2"
        >
          <span className="text-star-gold text-lg">★</span>
          <span className="text-[#c0b89c]">{totalStars} כוכבים נאספו</span>
        </motion.div>
      )}

      {/* Start buttons */}
      <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          disabled={!isValid || checking}
          className={`btn-magic text-xl px-12 py-4 ${!isValid || checking ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {checking ? 'בודק...' : 'יאללה להרפתקה ✨'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGuestStart}
          className="glass-card hover:border-white/20 text-[#a0a0b8] hover:text-white px-8 py-2.5 rounded-xl transition-all cursor-pointer text-sm"
        >
          {g('שחק', 'שחקי', gender)} בלי רישום
        </motion.button>
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        variants={fadeUp}
        className="text-[#50506a] text-xs mt-8"
      >
        הכנה למבחן מחוננים ותכנית YUNI
      </motion.p>
    </motion.div>
  )
}
