// Usar sintaxis modular consistente
import { db } from './firebase-config.js';
import { 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

export const loadProducts = async (category = null) => {
  try {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) throw new Error("Contenedor no encontrado");

    productsContainer.innerHTML = '<p>Cargando productos...</p>';

    let q;
    if (category) {
      q = query(collection(db, 'products'), where('category', '==', category));
    } else {
      q = collection(db, 'products');
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (products.length === 0) {
      productsContainer.innerHTML = '<p>No hay productos</p>';
      return;
    }

    productsContainer.innerHTML = products.map(product => `
      <div class="product-card-page">
        <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
      </div>
    `).join('');

  } catch (error) {
    console.error("Error:", error);
    productsContainer.innerHTML = '<p>Error al cargar productos</p>';
  }
}