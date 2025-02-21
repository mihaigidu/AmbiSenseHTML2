// js/auth.js

// URL del backend (ajústala según tu entorno)
const BASE_URL = 'http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com';

// Función para iniciar sesión
async function login() {
    try {
        const response = await fetch(`${BASE_URL}/auth/user`, {
            method: 'GET',
            credentials: 'include' // Incluye cookies si es necesario
        });

        if (!response.ok) {
            throw new Error('Error en el inicio de sesión.');
        }

        const data = await response.json();
        localStorage.setItem('jwtToken', data.token); // Guardar token en almacenamiento local
        alert(`Bienvenido, ${data.name}`);
        window.location.href = '/home2'; // Redirige a la página protegida
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('No se pudo iniciar sesión.');
    }
}

// Cierre de sesión
function logout() {
    localStorage.removeItem('jwtToken'); // Eliminar el token
    alert('Sesión cerrada con éxito.');
    window.location.href = '/login'; // Redirige al inicio
}
