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
async function loadProducts(category = null) {
    try {
      const productsContainer = document.getElementById('products-container');
      if (!productsContainer) throw new Error("No se encontró el contenedor de productos");
  
      // Limpia el contenedor antes de cargar nuevos productos
      productsContainer.innerHTML = '<p>Cargando productos...</p>';
  
      // Obtiene los productos desde Firestore
      let query = firebase.firestore().collection('products');
      
      // Filtra por categoría si se especifica
      if (category) {
        query = query.where('category', '==', category);
      }
  
      const snapshot = await query.get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Renderiza los productos
      if (products.length === 0) {
        productsContainer.innerHTML = '<p>No se encontraron productos.</p>';
        return;
      }
  
      productsContainer.innerHTML = products.map(product => `
        <div class="product-card-page">
          <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <button onclick="addToCart('${product.id}')">Añadir al carrito</button>
        </div>
      `).join('');
  
      console.log(`${products.length} productos cargados desde Firebase`);
  
    } catch (error) {
      console.error("Error al cargar productos:", error);
      document.getElementById('products-container').innerHTML = 
        '<p>Error al cargar los productos. Recarga la página.</p>';
    }
  }// Configuración centralizada de eventos
import { loadProducts } from './productos.js';
import { updateUserDisplay } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización
  loadProducts();
  updateUserDisplay();

  // Manejo del carrito
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      addToCart(e.target.dataset.id);
    }
  });
});