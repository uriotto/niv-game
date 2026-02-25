export const STAR_GOLD = 'gold'
export const STAR_SILVER = 'silver'
export const STAR_NONE = 'none'

export function getStarType(attempt, usedHint) {
  if (attempt === 1 && !usedHint) return STAR_GOLD
  if (attempt <= 2 || usedHint) return STAR_SILVER
  return STAR_NONE
}

export function countStars(results) {
  return results.filter(r => r === STAR_GOLD || r === STAR_SILVER).length
}

export function canUnlockNextLevel(results) {
  return countStars(results) >= 11
}

export const KINGDOMS = [
  {
    id: 'sentences',
    name: 'ממלכת המשפטים הקסומים',
    description: 'השלמת משפטים',
    icon: '📚',
    color: 'kingdom-sentences',
    bgGradient: 'from-purple-900 to-purple-700',
  },
  {
    id: 'words',
    name: 'יער המילים המכושף',
    description: 'יחסי מילים',
    icon: '🌳',
    color: 'kingdom-words',
    bgGradient: 'from-emerald-900 to-emerald-700',
  },
  {
    id: 'numbers',
    name: 'הר המספרים המסתורי',
    description: 'מספרים בצורות',
    icon: '💎',
    color: 'kingdom-numbers',
    bgGradient: 'from-blue-900 to-blue-700',
  },
  {
    id: 'problems',
    name: 'עמק החידות',
    description: 'בעיות מילוליות',
    icon: '🏘️',
    color: 'kingdom-problems',
    bgGradient: 'from-orange-900 to-orange-700',
  },
  {
    id: 'patterns',
    name: 'טירת הצורות',
    description: 'חשיבה צורנית',
    icon: '🏰',
    color: 'kingdom-patterns',
    bgGradient: 'from-pink-900 to-pink-700',
  },
]

export const LEVEL_NAMES = ['מתחיל', 'מתקדם', 'מומחה']

export const MAGIC_POWERS = [
  'כוח ההבנה',
  'כוח הקשרים',
  'כוח המספרים',
  'כוח הפתרונות',
  'כוח הדפוסים',
]

export const FUNNY_CORRECT = [
  'וואו, מדהים! 🌟',
  'את גאונה! ✨',
  'קסם אמיתי! 🪄',
  'הספר הקסום זוהר! 📖',
  'כוח מוחי על! 🧠',
  'תותחית! 💥',
  'בול פגיעה! 🎯',
  'מהממת! 🌈',
]

export const FUNNY_WRONG = [
  'אופס! ננסה שוב? 💪',
  'כמעט! עוד ניסיון! 🔮',
  'גם קוסמים טועים לפעמים 🧙‍♀️',
  'לא נורא, את יכולה! ⭐',
  'חשבי שוב... 🤔',
]

export const FUNNY_HINT = [
  'הספר הקסום לוחש לך רמז... 📖',
  'שרביט הרמזים פועל! 🪄',
  'סוד קטן בדרך... 🤫',
]

export function getRandomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)]
}
