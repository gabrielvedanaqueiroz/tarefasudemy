
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXMRrro28mEMqL6jM5syApusxY3U362RA",
  authDomain: "tarefasudemy.firebaseapp.com",
  projectId: "tarefasudemy",
  storageBucket: "tarefasudemy.firebasestorage.app",
  messagingSenderId: "95768179367",
  appId: "1:95768179367:web:eebe5409bb3500209c6182",
  measurementId: "G-6DT3GY17LS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export {db};