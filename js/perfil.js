document.addEventListener("DOMContentLoaded", async () => {
    await cargarPerfilUsuario();

    document.getElementById("logoutButton").addEventListener("click", async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                alert("Sesión cerrada con éxito.");
                window.location.href = "/login";
            } else {
                alert("Error al cerrar la sesión.");
            }
        } catch (error) {
            console.error("Error al cerrar la sesión:", error);
        }
    });
});

async function cargarPerfilUsuario() {
    try {
        const response = await fetch("api/public/user", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const usuario = await response.json();
            console.log("Información del usuario:", usuario);
            console.log(response);

            // Actualizar la interfaz con la información del usuario
            document.querySelector(".profile-pic").src = usuario.profilePicture || "imagenes/FotonUsuario.jpg";
            document.querySelector("h2").textContent = usuario.name || "Error A2";
            document.querySelector(".text-muted").textContent = `Usuario desde ${usuario.createdAt?.substring(0, 4) || "N/A"}`;
            document.querySelector("p strong:nth-of-type(1)").nextSibling.textContent = ` ${usuario.email}`;
            document.getElementById("rol").textContent = usuario.rol || "error";

        } else {
            console.error("No se pudo cargar la información del usuario.");
        }
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
    }
}
