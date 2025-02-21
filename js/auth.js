// js/auth.js

// URL del backend (ajústala según tu entorno)
const BASE_URL = 'http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com';


// Iniciar sesión con GitHub
function githubLogin() {
    // Redirige al flujo de autenticación de GitHub
    window.location.href = `${BASE_URL}/oauth2/authorization/github`;
}

// Almacenar el token después de la redirección
async function handleGitHubCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const response = await fetch(`${BASE_URL}/auth/github`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al autenticar con GitHub.');
            }

            const data = await response.json();
            localStorage.setItem('jwtToken', data.token); // Guardar token JWT
            alert(`Bienvenido, ${data.name}`);
            window.location.href = '/home2'; // Redirigir al dashboard
        } catch (error) {
            console.error('Error en la autenticación:', error);
        }
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('jwtToken');
    alert('Sesión cerrada.');
    window.location.href = 'index.html';
}
