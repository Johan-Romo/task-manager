import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvdsjJIMVPdHnLukUVPtQVYJ2hA9BDQcw",
  authDomain: "task-manager-cca1d.firebaseapp.com",
  projectId: "task-manager-cca1d",
  storageBucket: "task-manager-cca1d.appspot.com",
  messagingSenderId: "876953152044",
  appId: "1:876953152044:web:7e0b8f6e0cb708aef37f89",
  measurementId: "G-26CRLLG61Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword };