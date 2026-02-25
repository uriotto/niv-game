import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProgress } from './hooks/useProgress'
import WelcomeScreen from './components/WelcomeScreen'
import WorldMap from './components/WorldMap'
import Kingdom from './components/Kingdom'

const SCREENS = {
  WELCOME: 'welcome',
  MAP: 'map',
  KINGDOM: 'kingdom',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME)
  const [selectedKingdom, setSelectedKingdom] = useState(null)
  const { progress, saveLevelResults } = useProgress()

  const handleSelectKingdom = (kingdom) => {
    setSelectedKingdom(kingdom)
    setScreen(SCREENS.KINGDOM)
  }

  const handleLevelComplete = (kingdomId, levelIndex, results) => {
    saveLevelResults(kingdomId, levelIndex, results)
    setScreen(SCREENS.MAP)
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {screen === SCREENS.WELCOME && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeScreen
              onStart={() => setScreen(SCREENS.MAP)}
              totalStars={progress.totalStars}
            />
          </motion.div>
        )}

        {screen === SCREENS.MAP && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorldMap
              progress={progress}
              onSelectKingdom={handleSelectKingdom}
              onBack={() => setScreen(SCREENS.WELCOME)}
            />
          </motion.div>
        )}

        {screen === SCREENS.KINGDOM && selectedKingdom && (
          <motion.div
            key={`kingdom-${selectedKingdom.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Kingdom
              kingdom={selectedKingdom}
              progress={progress}
              onComplete={handleLevelComplete}
              onBack={() => setScreen(SCREENS.MAP)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
