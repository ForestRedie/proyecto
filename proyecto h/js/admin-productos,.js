import { db } from '../firebase-config.js';
import { collection, addDoc, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Referencia a la colección
const productsRef = collection(db, 'products');

// Función para añadir producto
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      price: Number(productData.price),
      stock: Number(productData.stock) || 0,
      featured: productData.featured || false
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error };
  }
};

// Manejador del formulario
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

  const productData = {
    name: form.productName.value,
    price: form.productPrice.value,
    imageUrl: form.productImage.value,
    category: form.productCategory.value,
    description: form.productDescription.value,
    stock: form.productStock.value,
    featured: form.productFeatured.checked
  };

  const result = await addProduct(productData);

  if (result.success) {
    alert(`Producto añadido con ID: ${result.id}`);
    form.reset();
    await loadProducts(); // Recargar la lista
  } else {
    alert('Error al añadir producto. Ver consola para detalles.');
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Guardar Producto';
});