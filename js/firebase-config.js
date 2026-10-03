import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGsqRt0vayW_IAhLSxtYhDhl4WaxY3S1E",
  authDomain: "bookeyz-a5c00.firebaseapp.com",
  projectId: "bookeyz-a5c00",
  storageBucket: "bookeyz-a5c00.firebasestorage.app",
  messagingSenderId: "533737658557",
  appId: "1:533737658557:web:61091d24143d305d05ffd4",
  measurementId: "G-SY878YMMS8"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };