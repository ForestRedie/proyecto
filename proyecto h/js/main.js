import { db } from './js/firebase-config.js';
import { collection, addDoc, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Prueba de lectura de Firestore
async function testFirestore() {
    try {
        const docRef = await addDoc(collection(db, 'test'), {
            test: "Conexión exitosa",
            timestamp: serverTimestamp()
        });
        console.log("Documento escrito con ID: ", docRef.id);
        
        const querySnapshot = await getDocs(collection(db, 'test'));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
    } catch (e) {
        console.error("Error en Firestore: ", e);
    }
}
// En auth.js o main.js
export function updateUserDisplay() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    const userIcon = document.getElementById('user-icon');
    
    if(userData) {
        userIcon.className = 'nav-icon logged-in';
        userIcon.innerHTML = `
            <div class="user-avatar">
                ${userData.name.charAt(0).toUpperCase()}
            </div>
            <div class="user-dropdown">
                <span>${userData.name}</span>
                <a href="#" id="logoutBtn">Cerrar sesión</a>
            </div>
        `;
    } else {
        userIcon.className = 'nav-icon';
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
    }
}
import { setupContactForm } from './firebase-contact';

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si Firebase está cargado
  if (typeof firebase === 'undefined') {
    console.error('Firebase no está cargado');
    return;
  }

  // Configurar formulario
  setupContactForm();

  // Verificación adicional
  console.log('Firebase cargado correctamente:', firebase.app().name);
});
