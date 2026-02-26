import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBkRWY7KAV6puMRNQohc-DN3wudySQ_IWY",
  authDomain: "niv-game.firebaseapp.com",
  projectId: "niv-game",
  storageBucket: "niv-game.firebasestorage.app",
  messagingSenderId: "140025909901",
  appId: "1:140025909901:web:3e7e4dffba8018ecea88c4",
  measurementId: "G-N3KH5Y31ZG",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
