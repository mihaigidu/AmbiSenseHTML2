const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');
        const dataTable = document.querySelector('#dataTable tbody');
        const uploadBtn = document.getElementById('uploadBtn');
        const sensorSelect = document.getElementById('sensorSelect');
        let jsonData = [];

        // Obtener sensores y llenar el select
        function fetchSensores() {
            fetch("api/public/sensores")
                .then(response => response.json())
                .then(data => {
                    sensorSelect.innerHTML = "<option value=''>Selecciona un sensor</option>";
                    data.forEach(sensor => {
                        let option = document.createElement("option");
                        option.value = sensor.id;
                        option.textContent = `${sensor.name || 'Sensor ' + sensor.id} - ${sensor.ubication || 'Ubicación desconocida'}`;
                        sensorSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Error al cargar sensores:", error);
                    sensorSelect.innerHTML = "<option value=''>Error al cargar sensores</option>";
                });
        }

        // Manejo de arrastrar y soltar archivos
        dropzone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropzone.classList.remove('dragover');
            const file = event.dataTransfer.files[0];
            processCSV(file);
        });

        dropzone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            processCSV(file);
        });

        const parseValue = (val) => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

        function processCSV(file) {
            if (!file || !file.name.toLowerCase().endsWith('.csv')) {
                alert("Por favor, selecciona un archivo CSV válido.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                let rows = content.split("\n").map(row => row.trim()).filter(row => row.length > 0);
                if (rows.length <= 1) {
                    alert("El archivo CSV está vacío o no tiene datos.");
                    return;
                }

                // Detectar separador correcto
                const separator = rows[0].includes("\t") ? "\t" : (rows[0].includes(";") ? ";" : ",");

                jsonData = [];
                dataTable.innerHTML = "";

                rows.slice(1).forEach(row => {
                    const cleanRow = row.replace(/[\r\n]+/g, "").trim(); // Eliminar caracteres ocultos
                    const cols = cleanRow.split(separator).map(col => col.trim()).filter(col => col !== "");

                    if (cols.length >= 9) { // Asegurar que solo se tomen 9 columnas
                        let fechaCompleta = cols[0].trim();
                        let fechaISO = fechaCompleta.replace(" ", "T");

                        const lectura = {
                            dateLectura: fechaISO,
                            variables: [
                                { "nombre": "PM2.5", "valor": parseValue(cols[1]), "unidad": "µg/m³" },
                                { "nombre": "PM10", "valor": parseValue(cols[2]), "unidad": "µg/m³" },
                                { "nombre": "Partículas", "valor": parseValue(cols[3]), "unidad": "PM" },
                                { "nombre": "AQI", "valor": parseValue(cols[4]), "unidad": "AQI" },
                                { "nombre": "HCHO", "valor": parseValue(cols[5]), "unidad": "HCHO" },
                                { "nombre": "TVOC", "valor": parseValue(cols[6]), "unidad": "TVOC" },
                                { "nombre": "Temperatura", "valor": parseValue(cols[7]), "unidad": "°C" },
                                { "nombre": "Humedad", "valor": parseValue(cols[8]), "unidad": "%" }
                            ]
                        };

                        jsonData.push(lectura);

                        // Crear fila en la tabla sin columna extra
                        const tr = document.createElement("tr");
                        cols.slice(0, 9).forEach(col => { // Solo 9 columnas
                            const td = document.createElement("td");
                            td.textContent = col;
                            tr.appendChild(td);
                        });
                        dataTable.appendChild(tr);
                    }
                });

                uploadBtn.disabled = jsonData.length === 0;
            };
            reader.readAsText(file);
        }


        uploadBtn.addEventListener('click', () => {
            const sensorId = sensorSelect.value;
            document.getElementById('loading-overlay').style.display = 'flex';

            if (!sensorId) {
                alert("Por favor, selecciona un sensor antes de subir el archivo.");
                return;
            }

            if (jsonData.length === 0) {
                alert("No hay datos para enviar.");
                return;
            }

            fetch(`api/private/lecturas/upload/${sensorId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('loading-overlay').style.display = 'none';
                    alert("Respuesta del servidor: " + data.mensaje);
                    uploadBtn.disabled = true;
                })
                .catch(error => {
                    document.getElementById('loading-overlay').style.display = 'none';
                    console.error("Error en la subida:", error);
                    alert("Error al subir los datos: " + error.message);

                });
        });

        // Cargar sensores al inicio
        document.addEventListener("DOMContentLoaded", fetchSensores);