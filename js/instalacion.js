document.addEventListener("DOMContentLoaded", function () {
    // Cargar dinámicamente el header
    fetch("header.html") // ⚠️ Verifica que la ruta sea correcta
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar el header");
            return response.text();
        })
        .then(data => {
            document.getElementById("header").innerHTML = data;

            // 🔥 Asegurar que los dropdowns del perfil funcionan
            setTimeout(() => {
                const dropdowns = document.querySelectorAll('.dropdown-toggle');
                dropdowns.forEach(dropdown => {
                    new bootstrap.Dropdown(dropdown);
                });
            }, 300);

            // 🔥 Asegurar que el botón hamburguesa funcione correctamente
            setTimeout(() => {
                const menuToggle = document.querySelector('.navbar-toggler');
                const menu = document.getElementById('menu');

                if (menuToggle) {
                    menuToggle.addEventListener("click", function () {
                        menu.classList.toggle("active");
                    });
                }
            }, 300);
        })
        .catch(error => console.error("Error cargando el header:", error));

    // 🔥 Inicializar los ACCORDIONS para que funcionen los desplegables
    const accordions = document.querySelectorAll(".accordion");
    accordions.forEach(acc => {
        acc.addEventListener("click", function () {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
                document.querySelector(".content-wrapper").style.minHeight = "auto"; // Ajusta la altura si se expande
            }
        });
    });
});