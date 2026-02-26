import { createContext, useContext } from 'react'

const PlayerContext = createContext({
  name: '',
  gender: 'female',
  isGuest: false,
})

export function PlayerProvider({ value, children }) {
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}

export function g(male, female, gender) {
  return gender === 'male' ? male : female
}
