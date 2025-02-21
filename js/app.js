// js/app.js

const BASE_URL = 'http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com';

// Verificar si el token existe y es válido
function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('No estás autenticado. Redirigiendo...');
        window.location.href = '/login';
        return;
    }
    return token;
}

// Obtener la lista de usuarios (endpoint protegido)
async function loadUsers() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${BASE_URL}/public/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Envía el token en la cabecera
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los usuarios.');
        }

        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.name} - ${user.email}`;
            userList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('No se pudieron cargar los usuarios.');
    }
}

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', loadUsers);
