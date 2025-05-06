import { db, serverTimestamp } from './firebase-config';
import { collection, addDoc } from 'firebase/firestore';

const setupContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Clona el formulario para eliminar listeners anteriores
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    const btn = newForm.querySelector('button[type="submit"]');
    try {
      btn.disabled = true;
      
      await addDoc(collection(db, 'contactMessages'), {
        name: newForm.name.value,
        email: newForm.email.value,
        message: newForm.message.value,
        timestamp: serverTimestamp()
      });

      alert('¡Mensaje enviado con éxito!');
      newForm.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar: ' + error.message);
    } finally {
      btn.disabled = false;
    }
  }, { capture: true }); // Critical!
};

// Inicialización segura
document.addEventListener('DOMContentLoaded', setupContactForm);