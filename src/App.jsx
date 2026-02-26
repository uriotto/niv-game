import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProgress, getSavedPlayerCode, savePlayerCode } from './hooks/useProgress'
import WelcomeScreen from './components/WelcomeScreen'
import WorldMap from './components/WorldMap'
import Kingdom from './components/Kingdom'
import StarField from './components/ui/StarField'

const SCREENS = {
  WELCOME: 'welcome',
  MAP: 'map',
  KINGDOM: 'kingdom',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME)
  const [selectedKingdom, setSelectedKingdom] = useState(null)
  const [playerCode, setPlayerCode] = useState(getSavedPlayerCode)
  const { progress, isLoading, saveLevelResults, savePartialProgress, getPartialProgress } = useProgress(playerCode)

  const handlePlayerCodeChange = (code) => {
    setPlayerCode(code)
    savePlayerCode(code)
  }

  const handleSelectKingdom = (kingdom) => {
    setSelectedKingdom(kingdom)
    setScreen(SCREENS.KINGDOM)
  }

  const handleLevelComplete = (kingdomId, levelIndex, results) => {
    saveLevelResults(kingdomId, levelIndex, results)
    setScreen(SCREENS.MAP)
  }

  return (
    <>
      <div className="magic-bg" />
      <StarField count={50} />
      <div className="min-h-screen relative">
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
                playerCode={playerCode}
                onPlayerCodeChange={handlePlayerCodeChange}
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
              {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <p className="text-[#a0a0b8] text-lg">טוען התקדמות...</p>
                </div>
              ) : (
                <WorldMap
                  progress={progress}
                  onSelectKingdom={handleSelectKingdom}
                  onBack={() => setScreen(SCREENS.WELCOME)}
                />
              )}
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
                getPartialProgress={getPartialProgress}
                savePartialProgress={savePartialProgress}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default App
