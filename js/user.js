async function PerfilUsuario() {
    try {
        const response = await fetch("api/public/user", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const usuario = await response.json();
            return usuario;
        } else {
            console.error("No se pudo cargar la información del usuario.");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
        return null;
    }
}
