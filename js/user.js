async function verificarRolUsuario() {
    try {
        const response = await fetch("api/public/user", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const usuario = await response.json();

            if (usuario.rol === "ALUMNO") {
                const crearSensorBtn = document.getElementById("addSensorModalLabel");
                if (crearSensorBtn) {
                    crearSensorBtn.style.display = "none";
                }
            }
        } else {
            console.error("No se pudo cargar la información del usuario.");
        }
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
    }
}

// Ejecutar cuando la página haya cargado
document.addEventListener("DOMContentLoaded", verificarRolUsuario);
