import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVG0RczltI2w3wUpjkKD4PcWNyN7-oNXc",
  authDomain: "alonmoneytime.firebaseapp.com",
  projectId: "alonmoneytime",
  storageBucket: "alonmoneytime.firebasestorage.app",
  messagingSenderId: "687090727777",
  appId: "1:687090727777:web:1252b6b2d68862780ca320",
  measurementId: "G-0NF9M6GXZC"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };