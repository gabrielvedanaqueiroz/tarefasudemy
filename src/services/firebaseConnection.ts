
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  
 apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
 authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
 projectId: "tarefasudemy",
 storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
 messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
 appId: process.env.REACT_APP_FIREBASE_APP_ID, 
 measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,

};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export {db};