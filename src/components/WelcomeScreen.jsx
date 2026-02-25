import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function WelcomeScreen({ onStart, totalStars }) {
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
        ניב והספר הקסום
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
        className="text-[#a0a0b8] text-lg mb-10 text-center max-w-md leading-relaxed"
      >
        מסע קסום דרך חמש ממלכות
        <br />
        מלאות חידות, מילים, מספרים וצורות
      </motion.p>

      {/* Character card */}
      <motion.div
        variants={fadeUp}
        className="glass-card-warm rounded-2xl px-6 py-4 flex items-center gap-4 mb-8"
      >
        <motion.img
          src={`${import.meta.env.BASE_URL}images/niv-wizard.png`}
          alt="ניב הקוסמת"
          className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-xl"
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div>
          <p className="font-display text-[#f0c850] text-lg">ניב הקוסמת</p>
          <p className="text-[#a0a0b8] text-sm">מוכנה להרפתקה!</p>
        </div>
      </motion.div>

      {/* Stars counter */}
      {totalStars > 0 && (
        <motion.div
          variants={fadeUp}
          className="glass-card rounded-xl px-5 py-2.5 mb-8 flex items-center gap-2"
        >
          <span className="text-star-gold text-lg">★</span>
          <span className="text-[#c0b89c]">{totalStars} כוכבים נאספו</span>
        </motion.div>
      )}

      {/* Start button */}
      <motion.button
        variants={fadeUp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="btn-magic text-xl px-12 py-4"
      >
        יאללה להרפתקה ✨
      </motion.button>

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
