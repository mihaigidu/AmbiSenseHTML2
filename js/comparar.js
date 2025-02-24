function fetchSensors() {
    $.get("api/public/sensores")
        .done(function (data) {
            if (!data || data.length === 0) {
                showErrorRow("No se encontraron sensores disponibles.");
                return;
            }

            let sensors = [...new Set(data.map(item => item.id))];

            $("#sensor1, #sensor2").empty().append('<option value="" disabled selected>Selecciona un sensor</option>');

            sensors.forEach(sensorId => {
                $("#sensor1, #sensor2").append(`<option value="${sensorId}">Sensor ${sensorId}</option>`);
            });
        })
        .fail(function () {
            console.error("Error al obtener la lista de sensores.");
            showErrorRow("Error A2 Ambisense: No se pudo cargar la lista de sensores.");
        });
}

function fetchDates(sensorNumber) {
    let sensorId = $(`#sensor${sensorNumber}`).val();
    if (!sensorId) return;

    $.get(`api/public/sensores`)
        .done(function (data) {
            let sensor = data.find(s => s.id == sensorId);
            if (!sensor) {
                showErrorRow(`No se encontraron lecturas para el sensor ${sensorId}.`);
                return;
            }

            let uniqueDates = [...new Set(sensor.lecturas.map(lectura => lectura.dateLectura.split('T')[0]))];
            let dateFilter = $(`#dayFilter${sensorNumber}`);

            dateFilter.empty().append('<option value="" disabled selected>Selecciona una fecha</option>');

            uniqueDates.forEach(date => {
                dateFilter.append(`<option value="${date}">${date}</option>`);
            });
        })
        .fail(function () {
            console.error(`Error al obtener las fechas para el sensor ${sensorNumber}.`);
            showErrorRow(`Error A2 Ambisense: No se pudieron cargar las fechas del sensor ${sensorNumber}.`);
        });
}

let allData = { sensor1: {}, sensor2: {} };
let timeLabels = { sensor1: [], sensor2: [] };

function fetchData(sensorNumber) {
    let sensorId = $(`#sensor${sensorNumber}`).val();
    let date = $(`#dayFilter${sensorNumber}`).val();
    if (!sensorId || !date) {
        showErrorRow(`Por favor, selecciona un sensor y una fecha para continuar.`);
        return;
    }

    $.get(`api/public/sensores`)
        .done(function (data) {
            let sensor = data.find(s => s.id == sensorId);
            if (!sensor || !sensor.lecturas) {
                showErrorRow(`No hay lecturas disponibles para el sensor ${sensorId} en la fecha seleccionada.`);
                return;
            }

            let filteredData = sensor.lecturas.filter(lectura => lectura.dateLectura.startsWith(date));

            if (filteredData.length === 0) {
                showErrorRow(`No hay datos disponibles para el sensor ${sensorId} en la fecha ${date}.`);
                return;
            }

            // ✅ Ordenar las lecturas por hora antes de procesarlas
            filteredData.sort((a, b) => {
                let timeA = a.dateLectura.split('T')[1];
                let timeB = b.dateLectura.split('T')[1];
                return timeA.localeCompare(timeB);
            });

            // Variables a extraer
            let variables = ["PM2.5", "PM10", "Partículas", "AQI", "HCHO", "TVOC", "Temperatura", "Humedad"];
            allData[`sensor${sensorNumber}`] = {};
            timeLabels[`sensor${sensorNumber}`] = [];

            variables.forEach(variable => {
                allData[`sensor${sensorNumber}`][variable] = [];
            });

            filteredData.forEach(lectura => {
                let hour = lectura.dateLectura.split('T')[1].substring(0, 5); // Extrae HH:MM
                timeLabels[`sensor${sensorNumber}`].push(hour);

                lectura.variables.forEach(v => {
                    if (variables.includes(v.nombre)) {
                        allData[`sensor${sensorNumber}`][v.nombre].push(v.valor);
                    }
                });
            });

            // Dibujar el gráfico con la variable seleccionada o PM2.5 por defecto
            let selectedVariable = $("#variableSelector").val() || "PM2.5";
            renderChart(`chart${sensorNumber}`, `Sensor ${sensorId}`, timeLabels[`sensor${sensorNumber}`], allData[`sensor${sensorNumber}`][selectedVariable]);
        })
        .fail(function () {
            console.error(`Error al obtener datos para el sensor ${sensorNumber} en la fecha ${date}.`);
            showErrorRow(`Error A2 Ambisense: No se pudieron cargar los datos del sensor ${sensorNumber}.`);
        });
}

function renderChart(containerId, sensor, labels, data) {
    let chart = echarts.init(document.getElementById(containerId));
    chart.setOption({
        title: { text: sensor },
        tooltip: { trigger: 'axis' },
        xAxis: { type: "category", data: labels },
        yAxis: { type: "value" },
        series: [{ type: "line", data: data }]
    });
}

// ✅ Función para mostrar el mensaje de error
function showErrorRow(message) {
    console.warn(message);

    // Si existe una tabla, muestra el error en el tbody
    let tableBody = $("table tbody");
    if (tableBody.length > 0) {
        const errorRow = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                     ${message}
                </td>
            </tr>
        `;
        tableBody.html(errorRow);
    } else {
        // Si no hay tabla, muestra el error como alerta al final de la página
        const errorAlert = `
            <div class="alert alert-danger text-center mt-3" role="alert">
                 ${message}
            </div>
        `;
        $("body").append(errorAlert);
    }
}

// Cambiar variable en ambas gráficas cuando el usuario seleccione una nueva
$("#variableSelector").change(function () {
    let selectedVariable = $(this).val();
    renderChart("chart1", "Sensor 1", timeLabels.sensor1, allData.sensor1[selectedVariable]);
    renderChart("chart2", "Sensor 2", timeLabels.sensor2, allData.sensor2[selectedVariable]);
});

$(document).ready(function () {
    fetchSensors();
    $("#sensor1").change(function () { fetchDates(1); });
    $("#sensor2").change(function () { fetchDates(2); });
    $("#dayFilter1").change(function () { fetchData(1); });
    $("#dayFilter2").change(function () { fetchData(2); });
});
