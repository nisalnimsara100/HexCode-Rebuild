import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD_mq2ETgW45C-qEaOVjc3ZEgCPbPPfPoE",
  authDomain: "hexcode-website-897f4.firebaseapp.com",
  databaseURL: "https://hexcode-website-897f4-default-rtdb.firebaseio.com",
  projectId: "hexcode-website-897f4",
  storageBucket: "hexcode-website-897f4.firebasestorage.app",
  messagingSenderId: "968376624063",
  appId: "1:968376624063:web:e4c893fa4945b155b4370a",
  measurementId: "G-Z8J9M847RD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { db, auth, storage, database };