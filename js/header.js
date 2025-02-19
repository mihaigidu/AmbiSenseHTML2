// Función para mostrar/ocultar menú en móviles
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Cierra el menú al hacer clic en un enlace
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menu').classList.remove('active');
    });
});

// Cargar dinámicamente el header en cada página
document.addEventListener("DOMContentLoaded", () => {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;

            // Inicializar Bootstrap Dropdowns después de insertar el header
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(dropdown => {
                new bootstrap.Dropdown(dropdown);
            });

        })
        .catch(error => {
            console.error("Error cargando el header:", error);

            // Crear y mostrar un alert de Bootstrap para advertir al usuario
            const warningDiv = document.createElement('div');
            warningDiv.className = 'alert alert-warning m-2'; // Clase de Bootstrap
            warningDiv.role = 'alert';
            warningDiv.innerText = 'No se pudo cargar el header. Por favor, revisa tu conexión o inténtalo más tarde.';

            // Insertar el alert al principio del body (o donde prefieras)
            document.body.prepend(warningDiv);
        });
});

