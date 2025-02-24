let urlParams = new URLSearchParams(window.location.search);
        let sensorId = urlParams.get("sensorId"); // Obtiene el ID del sensor desde la URL
        let sensorData = {}; // Almacena los datos del sensor
        let timeLabels = []; // Etiquetas de tiempo reales

        saveSensorToCookies(sensorId);
        function fetchSensorData() {
            if (!sensorId) {
                alert("No se especificó un sensor en la URL.");
                return;
            }

            $.get(`api/public/sensores/${sensorId}`, function (sensor) {
                if (!sensor || !sensor.lecturas || sensor.lecturas.length === 0) {
                    alert("No se encontraron datos para este sensor.");
                    return;
                }

                // 📅 Obtener fechas únicas disponibles para el sensor
                let uniqueDates = [...new Set(sensor.lecturas.map(lectura => lectura.dateLectura.split('T')[0]))];

                // 📌 Llenar el selector de fechas dinámicamente
                let dateSelect = $("#date-select");
                dateSelect.empty().append('<option value="" disabled selected>Selecciona una fecha</option>');
                uniqueDates.forEach(date => {
                    dateSelect.append(`<option value="${date}">${date}</option>`);
                });

                // 🔄 Mostrar la última fecha disponible por defecto
                let latestDate = uniqueDates[uniqueDates.length - 1];
                dateSelect.val(latestDate);
                fetchSensorValues(latestDate);

                // 🏷️ Actualizar información del sensor
                $("#last-update").text(latestDate);
            });
        }

        function fetchSensorValues(selectedDate) {
            $.get(`api/public/sensores/${sensorId}`, function (sensor) {
                if (!sensor) return;

                let filteredData = sensor.lecturas.filter(lectura => lectura.dateLectura.startsWith(selectedDate));

                // Ordenar por hora ascendente
                filteredData.sort((a, b) => new Date(a.dateLectura) - new Date(b.dateLectura));

                // Variables a extraer
                let variables = ["PM2.5", "PM10", "Partículas", "AQI", "Temperatura"];
                sensorData = {};
                timeLabels = [];

                variables.forEach(variable => {
                    sensorData[variable] = [];
                });

                filteredData.forEach(lectura => {
                    let hour = lectura.dateLectura.split('T')[1].substring(0, 5); // Formato HH:MM
                    timeLabels.push(hour);

                    lectura.variables.forEach(v => {
                        if (variables.includes(v.nombre)) {
                            sensorData[v.nombre].push(v.valor);
                        }
                    });
                });

                // 🔄 Actualizar gráficos con los nuevos datos
                updateCharts();
            });
        }

        function updateCharts() {
            createChart("chart-aqi", "Evolución del AQI", sensorData["AQI"]);
            createChart("chart1", "PM2.5 (ug/m3)", sensorData["PM2.5"]);
            createChart("chart2", "PM10 (ug/m3)", sensorData["PM10"]);
            createChart("chart3", "Partículas (per/L)", sensorData["Partículas"]);
            createChart("chart4", "Evolución de Temperatura", sensorData["Temperatura"]);
        }

        function createChart(container, title, data) {
            let chart = echarts.init(document.getElementById(container));
            chart.setOption({
                title: { text: title },
                xAxis: { type: "category", data: timeLabels },
                yAxis: { type: "value" },
                series: [{ type: "line", data: data }]
            });
        }

        // 📅 Cambiar datos cuando el usuario seleccione otra fecha
        $("#date-select").change(function () {
            let selectedDate = $(this).val();
            fetchSensorValues(selectedDate);
        });

        $(document).ready(function () {
            fetchSensorData();
        });
