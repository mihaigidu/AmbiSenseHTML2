// js/app.js

const BASE_URL = 'http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com';


// Verificar token
function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('No estás autenticado. Redirigiendo...');
        window.location.href = '/login';
        return null;
    }
    return token;
}

// Cargar usuarios
async function loadUsers() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${BASE_URL}/public/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los usuarios.');
        }

        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        users.forEach(user => {
            const item = document.createElement('li');
            item.textContent = `${user.name} - ${user.email}`;
            userList.appendChild(item);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', loadUsers);
