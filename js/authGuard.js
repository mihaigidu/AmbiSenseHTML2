// authGuard.js: Verifica si el usuario está logueado y redirige si no lo está
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/auth/user", {
            credentials: "include"  // Envia la cookie de sesión
        });

        if (!response.ok) {
            // Si no está autenticado, redirige a la página de login
            console.warn("Usuario no autenticado. Redirigiendo a la página de login.");
            window.location.href = "/login.html";
        }
    } catch (error) {
        console.error("Error al verificar la sesión:", error);
        window.location.href = "/login.html";
    }
});
