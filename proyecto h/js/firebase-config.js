// Usa rutas completas del CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAoxGtyX-1ucdj6alF_TkjaXbGJrYoOa5M",
  authDomain: "lumina-a2fa6.firebaseapp.com",
  projectId: "lumina-a2fa6",
  storageBucket: "lumina-a2fa6.firebasestorage.app",
  messagingSenderId: "191530513410",
  appId: "1:191530513410:web:c9ea5529a84e00d0b4a31b",
  measurementId: "G-VCHMCTDZDK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);