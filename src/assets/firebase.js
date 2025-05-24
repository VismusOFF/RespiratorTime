// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Импортируем Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6d9PTHKD2vphre2fjnrK6FIxdtJzbQdw",
  authDomain: "respiratortime.firebaseapp.com",
  projectId: "respiratortime",
  storageBucket: "respiratortime.firebasestorage.app",
  messagingSenderId: "1050775157785",
  appId: "1:1050775157785:web:c1b7f9c1171203b1bcbe88",
  measurementId: "G-091N9Z1KBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app); // Инициализируем Realtime Database

export { auth, database }; // Экспортируем auth и database
