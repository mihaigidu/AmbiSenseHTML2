document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("auth_token", data.token);  // Guardar JWT en localStorage
            alert("Inicio de sesión exitoso");
            window.location.href = "/home.html";  // Redirige tras login
        } else {
            alert("Error en el inicio de sesión");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
