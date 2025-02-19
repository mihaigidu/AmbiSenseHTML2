document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("toggle-theme");

    // Función para obtener la cookie por nombre
    const getCookie = (name) => {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            let [key, value] = cookie.split("=");
            if (key === name) {
                return value;
            }
        }
        return null;
    };

    // Cargar el tema desde las cookies
    const currentTheme = getCookie("theme");
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }

    // Alternar tema y guardar en cookies
    themeToggle.addEventListener("click", () => {
        const theme = document.documentElement.getAttribute("data-theme");
        const newTheme = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);

        // Guardar la cookie con expiración de 30 días
        document.cookie = `theme=${newTheme}; path=/; max-age=${30 * 24 * 60 * 60}`;
    });
});
