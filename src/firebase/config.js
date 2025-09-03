// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBd-GH5gbIVDsBnh85DgZgf9IvnEdbOlas",
  authDomain: "uae-fashion.firebaseapp.com",
  projectId: "uae-fashion",
  storageBucket: "uae-fashion.firebasestorage.app",
  messagingSenderId: "509688975921",
  appId: "1:509688975921:web:c1783c486b5b512088bb10",
  measurementId: "G-0N6GKPXB53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()

export default app
