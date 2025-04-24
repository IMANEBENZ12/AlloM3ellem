// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDcNGhTpa-GHoOlPEyUyrwBVVAp2SXLVSk",
  authDomain: "allom3ellem-8910c.firebaseapp.com",
  projectId: "allom3ellem-8910c",
  storageBucket: "allom3ellem-8910c.firebasestorage.app",
  messagingSenderId: "564478304589",
  appId: "1:564478304589:web:2a9fab16e131c84d8fd704",
  measurementId: "G-TMZH26FM5T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };