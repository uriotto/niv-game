# ניב והספר הקסום - הנחיות פיתוח

## על הפרויקט
משחק הרפתקאות חינוכי לניב (בת 9, כיתה ד') - הכנה למבחן מחוננים שלב ב' ולמבחן הקבלה לתכנית YUNI של בר-אילן.

## Stack
- React 18 + Vite
- Tailwind CSS (v4 with @tailwindcss/vite)
- Framer Motion (animations)
- localStorage (progress persistence)
- GitHub Pages deployment (base: `/niv-game/`)

## שפה ו-RTL
- **כל הממשק בעברית** - כולל שאלות, רמזים, משוב, תפריטים
- **RTL** - הגדרה ב-index.html (`dir="rtl" lang="he"`)
- אל תוסיף טקסט באנגלית לממשק

## מבנה הפרויקט
- `src/components/` - קומפוננטות React
- `src/components/questions/` - 5 סוגי שאלות (אחד לכל ממלכה)
- `src/components/ui/` - קומפוננטות UI משותפות
- `src/data/` - קבצי JSON עם 225 שאלות (5 x 3 x 15)
- `src/hooks/` - useProgress, useGameState
- `src/utils/scoring.js` - קבועים, הגדרות ממלכות, הודעות

## כללים לשאלות (data/*.json)
- **לעולם אל תשנה שאלות בלי לבדוק חישובים** - במיוחד numbers-shapes ו-word-problems
- **התפלגות תשובות**: `correct` חייב להיות מפוזר באופן שווה בין 0-3 (כ-4 מכל ערך בכל רמה)
- **רמת קושי**: גם רמה 1 חייבת להיות מאתגרת - זה הכנה למבחן מחוננים, לא שיעורי בית רגילים
- **מסיחים**: תשובות שגויות חייבות להיות סבירות (לא שטויות ברורות)
- **כתיב**: בדוק כתיב עברי תקין

## Deploy
- GitHub Pages: `https://uriotto.github.io/niv-game/`
- Auto-deploy via GitHub Actions on push to main
- `vite.config.js` has `base: '/niv-game/'` - don't remove this

## בדיקות
- `npm run build` - חייב לעבור בלי שגיאות
- בדוק RTL, ניווט בין ממלכות, תשובות נכונות/שגויות, שמירת localStorage
