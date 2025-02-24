document.addEventListener("DOMContentLoaded", function() {
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            // Agregar el footer al final del body
            document.body.insertAdjacentHTML("beforeend", data);
        })
        .catch(error => {
            console.error("Error cargando el footer:", error);

            // Crear y mostrar un alert de Bootstrap para advertir al usuario
            const warningDiv = document.createElement('div');
            warningDiv.className = 'alert alert-warning text-center m-2';
            warningDiv.role = 'alert';
            warningDiv.innerText = ' No se pudo cargar el footer. Por favor, revisa tu conexión o inténtalo más tarde.';

            // Insertar el alert justo antes del final del body
            document.body.insertAdjacentElement("beforeend", warningDiv);
        });
});
