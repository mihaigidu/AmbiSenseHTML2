async function verificarRolUsuario() {
    try {
        const response = await fetch("api/public/user", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const usuario = await response.json();

            if (usuario.rol === "ALUMNO") {
                const crearSensorBtn = document.getElementById("addSensor");
                if (crearSensorBtn) {
                    crearSensorBtn.style.display = "none";
                }
                const botonesEliminar = document.querySelectorAll(".btn.btn-danger.btn-sm");
                botonesEliminar.forEach(boton => {
                    boton.classList.add("d-none"); // Oculta el botón con Bootstrap
                });
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
