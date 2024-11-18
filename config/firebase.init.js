import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
// import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDXkuXybjU5nOQlAqYUMGkZaNyp3eGNVvA",
  authDomain: "earth-55e2e.firebaseapp.com",
  projectId: "earth-55e2e",
  storageBucket: "earth-55e2e.firebasestorage.app",
  messagingSenderId: "813775147715",
  appId: "1:813775147715:web:4a5af11196e992d43a4876"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)

export { auth, db, storage }
