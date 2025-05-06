// cart.js - Sistema de carrito
export const Cart = {
    items: [],
    
    init() {
      this.load();
      this.render();
    },
    
    load() {
      const saved = localStorage.getItem('cart');
      this.items = saved ? JSON.parse(saved) : [];
    },
    
    save() {
      localStorage.setItem('cart', JSON.stringify(this.items));
      this.updateCounter();
    },
    
    addItem(product, quantity = 1) {
      const existing = this.items.find(item => item.id === product.id);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          quantity
        });
      }
      
      this.save();
      this.showToast(`${product.name} añadido al carrito`);
    },
    
    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.save();
    },
    
    updateCounter() {
      const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
      document.querySelectorAll('.cart-badge').forEach(el => el.textContent = count);
    },
    
    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast show';
      toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => toast.remove(), 3000);
    }
  };