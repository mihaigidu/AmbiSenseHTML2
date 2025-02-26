// Función para mostrar/ocultar menú en móviles
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Cierra el menú al hacer clic en un enlace
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("header.html");
        const data = await response.text();
        document.getElementById("header").innerHTML = data;

        // Inicializar Bootstrap Dropdowns después de insertar el header
        document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
            new bootstrap.Dropdown(dropdown);
        });

        // 🔥 Obtener rol del usuario y ocultar el botón de configuración si es alumno
        await ocultarConfiguracionParaAlumnos();
        
    } catch (error) {
        console.error("Error cargando el header:", error);

        // Mostrar alerta si el header no carga
        const warningDiv = document.createElement('div');
        warningDiv.className = 'alert alert-warning m-2'; 
        warningDiv.role = 'alert';
        warningDiv.innerText = 'No se pudo cargar el header. Por favor, revisa tu conexión o inténtalo más tarde.';
        document.body.prepend(warningDiv);
    }
});

// Función para ocultar "Configuración" si el usuario es "ALUMNO"
async function ocultarConfiguracionParaAlumnos() {
    try {
        const response = await fetch("api/public/user", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const usuario = await response.json();
            if (usuario.rol === "ALUMNO") {
                const configItem = document.querySelector(".dropdown-menu li:nth-child(2)");
                if (configItem) {
                    configItem.style.display = "none"; // Oculta el botón "Configuración"
                }
            }
        } else {
            console.error("No se pudo obtener el rol del usuario.");
        }
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
    }
}
