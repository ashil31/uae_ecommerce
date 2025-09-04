// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBARg64CreM5IBuZMNTkYcfgSN2K7EuoYc",
  authDomain: "uae-project-afab5.firebaseapp.com",
  projectId: "uae-project-afab5",
  storageBucket: "uae-project-afab5.firebasestorage.app",
  messagingSenderId: "925412857307",
  appId: "1:925412857307:web:6dd5f0f1654fef3e0603fe",
  measurementId: "G-K12T41L9CJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()

export default app
