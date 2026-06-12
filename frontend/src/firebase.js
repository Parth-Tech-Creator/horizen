// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your exact config from image_28d8bf.jpg
const firebaseConfig = {
  apiKey: "AiZaSyAoKPH1NXOcD8GP5ZVOP8oUH-08HxGC7pM",
  authDomain: "horizen-879c9.firebaseapp.com",
  projectId: "horizen-879c9",
  storageBucket: "horizen-879c9.firebasestorage.app",
  messagingSenderId: "560501534862",
  appId: "1:560501534862:web:e9d8634c163869e93499df"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// The function to trigger the Google popup
export const loginWithGoogle = () => {
  return signInWithPopup(auth, provider);
};