// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ,
  authDomain: "prepwise-8a9ef.firebaseapp.com",
  projectId: "prepwise-8a9ef",
  storageBucket: "prepwise-8a9ef.firebasestorage.app",
  messagingSenderId: "533735357185",
  appId: "1:533735357185:web:e40f552c0a3233645c3900",
  measurementId: "G-MB0F3TC2KM"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);