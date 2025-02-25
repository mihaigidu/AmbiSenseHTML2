document.addEventListener("DOMContentLoaded", async () => {
    // Cargar datos del usuario al cargar la página
    await cargarDatosUsuario();

    // Manejar el envío del formulario
    document.querySelector("form").addEventListener("submit", async (e) => {
        e.preventDefault();
        await actualizarPerfilUsuario();
    });
});

// Cargar datos del usuario desde la API
async function cargarDatosUsuario() {
    try {
        const response = await fetch("api/public/user", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const usuario = await response.json();

            // Llenar el formulario con los datos actuales del usuario
            document.getElementById("name").value = usuario.name || "";
            document.getElementById("email").value = usuario.email || "";
            

            // Cargar imagen si tiene una, o mostrar imagen por defecto
            const profilePic = document.querySelector(".profile-pic");
            profilePic.src = usuario.profilePicture || "imagenes/FotonUsuario.jpg";
        } else {
            alert("No se pudo cargar la información del usuario.");
        }
    } catch (error) {
        console.error("Error al cargar la información del usuario:", error);
    }
}

// Actualizar el perfil del usuario
async function actualizarPerfilUsuario() {
    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    
    const fileInput = document.getElementById("profile-pic");

    if (!nombre || !email) {
        alert("El nombre y el correo electrónico son obligatorios.");
        return;
    }

    // Crear objeto de usuario para enviar como JSON
    const usuarioData = {
        name: nombre,
        email: email,
        
    };

    // Crear FormData para enviar el JSON y la imagen (si se sube)
    const formData = new FormData();
    formData.append("usuario", new Blob([JSON.stringify(usuarioData)], { type: "application/json" }));

    // Adjuntar la imagen si el usuario subió una
    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
    }

    try {
        const response = await fetch("api/public/user/update", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (response.ok) {
            alert("Perfil actualizado con éxito.");
            window.location.href = "perfil";  // Redirige de nuevo a la página de perfil
        } else {
            alert("Error al actualizar el perfil.");
        }
    } catch (error) {
        console.error("Error al enviar la actualización del perfil:", error);
    }
}
