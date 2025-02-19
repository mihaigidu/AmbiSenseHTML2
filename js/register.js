document.addEventListener("DOMContentLoaded", function () {
    const loginContainer = document.getElementById("loginContainer");
    const registerLink = document.getElementById("registerLink");
    const backToLoginLink = document.getElementById("backToLoginLink");

    backToLoginLink.addEventListener("click", function (event) {
        event.preventDefault();
        loginContainer.classList.add("rotated");
        loginContainer.style.minHeight = "450px"; // Ajustar altura para el formulario de login
    });

    registerLink.addEventListener("click", function (event) {
        event.preventDefault();
        loginContainer.classList.remove("rotated");
        loginContainer.style.minHeight = "500px"; // Volver al tamaño original del registro
    });
});