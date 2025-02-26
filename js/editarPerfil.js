document.addEventListener("DOMContentLoaded", async () => {
    await cargarDatosUsuario();

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




// Actualizar el perfil del usuario y mostrar los datos actualizados
async function actualizarPerfilUsuario() {
    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const fileInput = document.getElementById("profile-pic");

    if (!nombre || !email) {
        alert("El nombre y el correo electrónico son obligatorios.");
        return;
    }

    try {
        const response = await fetch("api/public/user", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            let usuario = await response.json();

            // Crear objeto de usuario para enviar como JSON
            let usuarioData = {
                id: usuario.id,
                name: nombre,
                email: email,
                password: usuario.password,
                rol: usuario.rol,
                loggedIn: usuario.loggedIn,
                createdAt: usuario.createdAt,
                profilePicture: usuario.profilePicture,
                sensores: usuario.sensores,
            };

            // Crear FormData para enviar el JSON y la imagen (si se sube)
            const formData = new FormData();
            formData.append("usuario", JSON.stringify(usuarioData));

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
                    const usuarioActualizado = await response.json();
        
                    // Actualizar la interfaz con los datos devueltos
                    document.getElementById("name").value = usuarioActualizado.name;
        
                    // Actualizar la foto de perfil si fue cambiada
                    const profilePic = document.querySelector(".profile-pic");
                    profilePic.src = usuarioActualizado.profilePicture || "imagenes/FotonUsuario.jpg";
        
                    alert("Perfil actualizado con éxito." + "json" + usuarioActualizado);
        
                } else {
                    alert("Error al actualizar el perfil.");
                }
            } catch (error) {
                console.error("Error al enviar la actualización del perfil:", error);
            }

        } else {
            alert("No se pudo cargar la información del usuario.");
        }
    } catch (error) {
        console.error("Error al cargar la información del usuario:", error);
    }


   
}
