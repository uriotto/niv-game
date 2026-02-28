import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProgress, getSavedPlayer, savePlayer, getPlayerCode } from './hooks/useProgress'
import { PlayerProvider } from './contexts/PlayerContext'
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
  const [player, setPlayer] = useState(getSavedPlayer)
  const playerCode = getPlayerCode(player)
  const { progress, isLoading, cloudSyncFailed, saveLevelResults, savePartialProgress, getPartialProgress } = useProgress(playerCode, player?.gender)

  const handlePlayerChange = (newPlayer) => {
    setPlayer(newPlayer)
    savePlayer(newPlayer)
  }

  const handleSelectKingdom = (kingdom) => {
    setSelectedKingdom(kingdom)
    setScreen(SCREENS.KINGDOM)
  }

  const handleLevelComplete = (kingdomId, levelIndex, results) => {
    saveLevelResults(kingdomId, levelIndex, results)
    setScreen(SCREENS.MAP)
  }

  const playerContext = player || { name: '', gender: 'female', isGuest: true }

  return (
    <PlayerProvider value={playerContext}>
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
                player={player}
                onPlayerChange={handlePlayerChange}
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
                <>
                  <WorldMap
                    progress={progress}
                    onSelectKingdom={handleSelectKingdom}
                    onBack={() => setScreen(SCREENS.WELCOME)}
                  />
                  {cloudSyncFailed && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#2a2a3a]/90 rounded-xl px-4 py-2 text-sm text-[#a0a0b8] z-50 backdrop-blur-sm">
                      לא הצלחנו להתחבר לענן. ההתקדמות נשמרת מקומית.
                    </div>
                  )}
                </>
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
    </PlayerProvider>
  )
}

export default App
