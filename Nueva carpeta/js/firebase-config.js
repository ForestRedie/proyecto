// Usa ONLY la versión modular (v9+)
import { initializeApp } from 'firebase/app';
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
const db = getFirestore(app);

export { db, serverTimestamp };