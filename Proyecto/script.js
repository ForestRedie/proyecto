document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cuestionarioBtn = document.getElementById('cuestionario-btn');
    const cuestionarioSection = document.getElementById('cuestionario-section');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const usernameDisplay = document.getElementById('username-display');
    const cuestionarioForm = document.getElementById('cuestionario-form');
    const estadoButtons = document.querySelectorAll('.estado');
    const estadoInfo = document.getElementById('estado-info');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const loginLinkFromRegister = document.getElementById('login-link-from-register');
    const estadisticasLoginBtn = document.getElementById('estadisticas-login-btn');
    const estadosLoginBtn = document.getElementById('estados-login-btn');
    const cuestionarioLoginBtn = document.getElementById('cuestionario-login-btn');
    
    // Comprobar estado de login al cargar la página
    window.addEventListener('load', function() {
        updateLoginStatus();
        checkRestrictedSections();
    });
    
    // Mostrar/ocultar cuestionario
    if (cuestionarioBtn) {
        cuestionarioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isLoggedIn()) {
                cuestionarioSection.style.display = cuestionarioSection.style.display === 'none' ? 'block' : 'none';
                
                // Desplazar la página hasta el cuestionario si se está mostrando
                if (cuestionarioSection.style.display === 'block') {
                    cuestionarioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                openLoginModal();
            }
        });
    }
    
    // Gestión de los modales
    if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
    if (loginLink) loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
    });
    
    if (registerLink) registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        closeLoginModal();
        openRegisterModal();
    });
    
    if (loginLinkFromRegister) loginLinkFromRegister.addEventListener('click', function(e) {
        e.preventDefault();
        closeRegisterModal();
        openLoginModal();
    });
    
    // Botones de login en secciones restringidas
    if (estadisticasLoginBtn) estadisticasLoginBtn.addEventListener('click', openLoginModal);
    if (estadosLoginBtn) estadosLoginBtn.addEventListener('click', openLoginModal);
    if (cuestionarioLoginBtn) cuestionarioLoginBtn.addEventListener('click', openLoginModal);
    
    // Cerrar modales con el botón X
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeLoginModal();
        } else if (e.target === registerModal) {
            closeRegisterModal();
        }
    });
    
    // Procesar formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validación básica
            if (!username || !password) {
                showToast('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Simulación de autenticación (en producción debería usar HTTPS y backend)
            if (checkCredentials(username, password)) {
                // Guardar en localStorage (solo para demo)
                localStorage.setItem('username', username);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loginTime', Date.now());
                
                // Actualizar UI
                updateLoginStatus();
                checkRestrictedSections();
                closeLoginModal();
                showToast(`¡Bienvenido, ${username}!`, 'success');
            } else {
                showToast('Usuario o contraseña incorrectos', 'error');
            }
        });
    }
    
    // Procesar formulario de registro
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            // Validación básica
            if (!username || !email || !password || !confirmPassword) {
                showToast('Por favor, completa todos los campos', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Las contraseñas no coinciden', 'error');
                return;
            }
            
            if (password.length < 6) {
                showToast('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Simular registro (en producción debería usar HTTPS y backend)
            // Almacenar usuario en localStorage (solo para demostración)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Verificar si el usuario ya existe
            if (users.some(user => user.username === username)) {
                showToast('El nombre de usuario ya está en uso', 'error');
                return;
            }
            
            // Añadir nuevo usuario
            users.push({
                username,
                email,
                password // En producción nunca almacenar contraseñas en texto plano
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // Iniciar sesión automáticamente
            localStorage.setItem('username', username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginTime', Date.now());
            
            // Actualizar UI
            updateLoginStatus();
            checkRestrictedSections();
            closeRegisterModal();
            showToast('Registro exitoso. ¡Bienvenido!', 'success');
        });
    }
    
    // Cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('username');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTime');
            
            updateLoginStatus();
            checkRestrictedSections();
            showToast('Has cerrado sesión correctamente', 'success');
            
            // Ocultar cuestionario si estaba visible
            if (cuestionarioSection) {
                cuestionarioSection.style.display = 'none';
            }
        });
    }
    
    // Procesar formulario de cuestionario
    if (cuestionarioForm) {
        cuestionarioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const edad = document.getElementById('edad').value;
            const genero = document.getElementById('genero').value;
            const escolaridad = document.getElementById('escolaridad').value;
            const estadoResidencia = document.getElementById('estado-residencia').value;
            const abandono = document.querySelector('input[name="abandono"]:checked');
            
            if (!edad || !genero || !escolaridad || !estadoResidencia || !abandono) {
                showToast('Por favor, completa todos los campos obligatorios', 'error');
                return;
            }
            
            // En producción, aquí enviaríamos los datos al servidor
            
            // Simulación de envío exitoso
            showToast('¡Gracias por tus respuestas! Los datos han sido enviados correctamente.', 'success');
            cuestionarioForm.reset();
            
            // Ocultar el cuestionario después de un breve retraso
            setTimeout(() => {
                cuestionarioSection.style.display = 'none';
            }, 2000);
        });
    }
    
    // Manejar selección de estados en el mapa
    estadoButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!isLoggedIn()) {
                openLoginModal();
                return;
            }
            
            const estadoId = this.getAttribute('data-estado');
            mostrarInfoEstado(estadoId);
        });
    });
    
    // Implementar navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // No procesar enlaces especiales que ya tienen sus propios handlers
            if (this.id === 'cuestionario-btn' || this.id === 'login-link' || 
                this.id === 'register-link' || this.id === 'login-link-from-register') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Comprobar y actualizar secciones restringidas
    checkRestrictedSections();
});

// Verificar si el usuario está logueado
function isLoggedIn() {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const loginTime = parseInt(localStorage.getItem('loginTime') || '0');
    const currentTime = Date.now();
    
    // Sesión expira después de 24 horas (en milisegundos)
    const sessionDuration = 24 * 60 * 60 * 1000;
    
    // Si la sesión ha expirado, hacer logout automático
    if (loginStatus && (currentTime - loginTime > sessionDuration)) {
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        return false;
    }
    
    return loginStatus;
}

// Actualizar UI según estado de login
function updateLoginStatus() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameDisplay = document.getElementById('username-display');
    const restrictedNotice = document.getElementById('restricted-content-notice');
    
    if (isLoggedIn()) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (usernameDisplay) {
            usernameDisplay.style.display = 'inline-block';
            usernameDisplay.textContent = `¡Hola, ${localStorage.getItem('username')}!`;
        }
        if (restrictedNotice) restrictedNotice.style.display = 'none';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (usernameDisplay) usernameDisplay.style.display = 'none';
        if (restrictedNotice) restrictedNotice.style.display = 'block';
    }
}

// Comprobar y actualizar visibilidad de secciones restringidas
function checkRestrictedSections() {
    const restrictedSections = document.querySelectorAll('.restricted-section');
    const isLogged = isLoggedIn();
    
    restrictedSections.forEach(section => {
        const overlay = section.querySelector('.login-required-overlay');
        if (overlay) {
            overlay.style.display = isLogged ? 'none' : 'flex';
        }
    });
}

// Función para simular verificación de credenciales
function checkCredentials(username, password) {
    // Lista de usuarios predefinidos para demo
    const defaultUsers = [
        { username: 'admin', password: 'admin123' },
        { username: 'usuario', password: 'usuario123' }
    ];
    
    // Obtener usuarios registrados en localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Combinar usuarios predefinidos y registrados
    const allUsers = [...defaultUsers, ...storedUsers];
    
    // Verificar credenciales
    return allUsers.some(user => 
        user.username === username && user.password === password
    );
}

// Abrir modal de login
function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('username').focus();
}

// Cerrar modal de login
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Abrir modal de registro
function openRegisterModal() {
    document.getElementById('register-modal').style.display = 'flex';
    document.getElementById('reg-username').focus();
}

// Cerrar modal de registro
function closeRegisterModal() {
    document.getElementById('register-modal').style.display = 'none';
}

// Cerrar todos los modales
function closeAllModals() {
    closeLoginModal();
    closeRegisterModal();
}

// Mostrar mensajes toast
function showToast(message, type = 'info') {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Añadir al DOM
    document.body.appendChild(toast);
    
    // Mostrar con efecto
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}