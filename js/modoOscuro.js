document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("toggle-theme");

    // Función para obtener la cookie
    const getCookie = (name) => {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            let [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    };

    // Función para establecer la cookie
    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}`;
    };

    // Cargar el tema desde la cookie
    const currentTheme = getCookie("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.innerText = currentTheme === "dark" ? "Modo Claro" : "Modo Oscuro";
    themeToggle.classList.toggle("btn-light", currentTheme === "dark");
    themeToggle.classList.toggle("btn-dark", currentTheme === "light");

    // Alternar el tema
    themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const newTheme = current === "dark" ? "light" : "dark";

        // Cambiar el tema y el texto del botón
        document.documentElement.setAttribute("data-theme", newTheme);
        setCookie("theme", newTheme, 30); // Guardar cookie por 30 días

        // Cambiar el texto y la clase del botón
        themeToggle.innerText = newTheme === "dark" ? "Modo Claro" : "Modo Oscuro";
        themeToggle.classList.toggle("btn-light", newTheme === "dark");
        themeToggle.classList.toggle("btn-dark", newTheme === "light");
    });
});