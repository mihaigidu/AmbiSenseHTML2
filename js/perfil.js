document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        const response = await fetch("api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            alert(response);
            alert("Sesión cerrada con éxito.");
            
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
    }
});