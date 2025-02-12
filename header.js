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
        })
        .catch(error => console.error("Error cargando el header:", error));
});
