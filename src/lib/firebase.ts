// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzFo2IxNUaeylaPKhyCV33vFBYalmkRB4",
  authDomain: "top-up-store-bf9f0.firebaseapp.com",
  projectId: "top-up-store-bf9f0",
  storageBucket: "top-up-store-bf9f0.appspot.com",
  messagingSenderId: "1005431265712",
  appId: "1:1005431265712:web:596ae608cf4cb8df3a5e75"
};


// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
