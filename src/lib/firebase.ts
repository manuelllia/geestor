
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeivkf5LLGLmGLMjAvdEbA1XixO6TTGIo",
  authDomain: "geestor-233c7.firebaseapp.com",
  projectId: "geestor-233c7",
  storageBucket: "geestor-233c7.firebasestorage.app",
  messagingSenderId: "527354711115",
  appId: "1:527354711115:web:8cd62049f17e3bbc3251ce",
  measurementId: "G-THLPMNCBZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, analytics, auth, Timestamp, serverTimestamp };
