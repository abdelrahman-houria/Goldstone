// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALvr8sVaGoh4RRqwGeyPOHljMBttMeldo",
  authDomain: "goldstone-db.firebaseapp.com",
  projectId: "goldstone-db",
  storageBucket: "goldstone-db.appspot.com",
  messagingSenderId: "779215555436",
  appId: "1:779215555436:web:cf3810ac66ca51710b4149"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };