import { db } from './firebase-config.js';
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export const loadFeaturedProducts = async () => {
    try {
        const container = document.getElementById('featuredProducts');
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Cargando productos...
            </div>
        `;
        
        const q = query(
            collection(db, 'products'),
            where('featured', '==', true),
            limit(4)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No hay productos destacados disponibles</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        querySnapshot.forEach(doc => {
            const product = doc.data();
            container.innerHTML += `
                <div class="featured-product-card">
                    <div class="product-image">
                        <img src="${product.imageUrl || 'img/default-product.jpg'}" 
                             alt="${product.name}" 
                             loading="lazy"
                             onerror="this.src='img/default-product.jpg'">
                        ${product.featured ? '<span class="featured-badge">Destacado</span>' : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="price-section">
                            <span class="price">$${(product.price || 0).toFixed(2)}</span>
                            ${product.rating ? `<div class="stars">${'★'.repeat(Math.round(product.rating))}</div>` : ''}
                        </div>
                        <a href="producto.html?id=${doc.id}" class="btn">Ver detalles</a>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading featured products:", error);
        const container = document.getElementById('featuredProducts');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar productos. <button class="btn-retry" onclick="window.location.reload()">Reintentar</button></p>
                </div>
            `;
        }
    }
};