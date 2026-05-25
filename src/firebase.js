import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBD22He1rnaqjSd9UxamgFsbt6mizfz9qI",
  authDomain: "personal-expense-tracker-77690.firebaseapp.com",
  projectId: "personal-expense-tracker-77690",
  storageBucket: "personal-expense-tracker-77690.firebasestorage.app",
  messagingSenderId: "1020646165835",
  appId: "1:1020646165835:web:dd7b19e64e9f4e3f922cce",
  measurementId: "G-5QQ4GKJMBR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
