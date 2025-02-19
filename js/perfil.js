document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            alert("Sesión cerrada con éxito.");
            window.location.href = "/login.html";
        }
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
    }
});