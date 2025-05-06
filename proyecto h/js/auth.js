import { auth, db } from './firebase-config';

export const registerUser = async (email, password, name) => {
  try {
    // 1. Crear usuario en Authentication
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    
    // 2. Guardar información adicional en Firestore
    await db.collection('users').doc(userCredential.user.uid).set({
      uid: userCredential.user.uid,
      email: email,
      displayName: name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      role: 'user', // Puedes definir roles si es necesario
      lastLogin: null,
      profileCompleted: false
    });

    // 3. Actualizar el perfil en Authentication
    await userCredential.user.updateProfile({
      displayName: name
    });

    return { success: true, user: userCredential.user };
    
  } catch (error) {
    console.error("Error en registro:", error);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};
// Obtener datos del usuario actual
export const getCurrentUserData = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  const doc = await db.collection('users').doc(user.uid).get();
  return doc.exists ? doc.data() : null;
};

// Actualizar datos del usuario
export const updateUserData = async (data) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No hay usuario autenticado');
  
  await db.collection('users').doc(user.uid).update(data);
  
  // Si actualizas el nombre, actualiza también en Auth
  if (data.displayName) {
    await user.updateProfile({
      displayName: data.displayName
    });
  }
};