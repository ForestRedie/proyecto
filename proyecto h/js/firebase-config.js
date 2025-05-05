// js/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4wz7tEXQ8rcpcoGypzVmVNQ_m8jH7zzA",
  authDomain: "ironstrength-gymequipment.firebaseapp.com",
  projectId: "ironstrength-gymequipment",
  storageBucket: "ironstrength-gymequipment.appspot.com",
  messagingSenderId: "710205438519",
  appId: "1:710205438519:web:897375a5f6b5d7eec99db2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, serverTimestamp };