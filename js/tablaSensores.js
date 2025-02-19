document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            new bootstrap.Dropdown(dropdown);
        });
    }, 500);
});
function deleteSensor(sensorId) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el sensor con ID ${sensorId}?`)) {
        return;
    }

    fetch(`http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/private/sensores/delete/${sensorId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la eliminación del sensor");
            }
            return response.json();
        })
        .then(data => {
            alert("Sensor eliminado correctamente");
            fetchSensorsAQI(); // Refrescar la lista de sensores
        })
        .catch(error => {
            console.error("Error al eliminar el sensor:", error);
            alert("No se pudo eliminar el sensor.");
        });
}
function compararSensores() {
    window.location.href = "/comparacion"; // Redirige a la página de comparación de sensores
}

// Establecer la fecha actual en el campo creation_date por defecto
document.addEventListener("DOMContentLoaded", function () {
    let now = new Date();
    let formattedDate = now.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:mm
    document.getElementById("creationDate").value = formattedDate;
});


// Evento submit para el formulario de agregar sensor
document.getElementById("addSensorForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar recarga de la página

    // Obtener los valores del formulario
    let sensorName = document.getElementById("sensorName").value.trim();
    let sensorLocation = document.getElementById("sensorLocation").value.trim();
    let sensorType = document.getElementById("sensorType").value.trim();
    let creationDate = document.getElementById("creationDate").value;

    if (!sensorName || !sensorLocation || !sensorType || !creationDate) {
        document.getElementById("addSensorMessage").innerHTML = `<div class="alert alert-danger">Por favor, completa todos los campos.</div>`;
        return;
    }

    let sensorData = {
        name: sensorName,
        ubication: sensorLocation,
        type: sensorType,
        creationDate: creationDate,
        usuarios: [],
        alertas: [],
        lecturas: []
    };

    // Enviar la información a la API
    fetch("http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/private/sensores/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sensorData)
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("addSensorMessage").innerHTML = `<div class="alert alert-success">Sensor creado correctamente.</div>`;
            setTimeout(() => {
                document.getElementById("addSensorMessage").innerHTML = "";
                document.getElementById("addSensorForm").reset();
                new bootstrap.Modal(document.getElementById('addSensorModal')).hide(); // Cerrar modal
                fetchSensorsAQI(); // Refrescar la tabla
            }, 2000);
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("addSensorMessage").innerHTML = `<div class="alert alert-danger">Error al crear el sensor.</div>`;
        });
});

function fetchSensorsAQI() {
    let tableBody = $("tbody");

    // 🔄 Mensaje de carga
    tableBody.html(`
        <tr>
            <td colspan="5" class="text-center">Cargando sensores...</td>
        </tr>
    `);

    $.ajax({
        url: "http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/public/sensores",
        method: "GET",
        xhrFields: {
            withCredentials: true // Envía cookies entre dominios
        },
        crossDomain: true,      // Habilita solicitudes CORS
        success: function (data) {
            if (!Array.isArray(data)) {
                console.error("Respuesta inesperada:", data);
                tableBody.html(`<tr><td colspan="5" class="text-center text-danger">Error: Respuesta no válida</td></tr>`);
                return;
            }

            tableBody.empty();
            console.log(data);

            data.forEach((sensor, index) => {
                if (!sensor.lecturas || sensor.lecturas.length === 0) return;

                let latestReading = sensor.lecturas
                    .slice()
                    .sort((a, b) => new Date(b.dateLectura) - new Date(a.dateLectura))
                    .shift();

                let lastAQI = 0;
                if (latestReading && latestReading.variables) {
                    let aqiVariable = latestReading.variables.find(v => v.nombre === "AQI");
                    lastAQI = aqiVariable ? aqiVariable.valor : 0;
                }

                let row = `
                    <tr>
                        <td class="align-middle">${sensor.id}</td>
                        <td class="align-middle">${sensor.name || `Sensor ${sensor.id}`}</td>
                        <td class="align-middle">${sensor.ubication || "Ubicación desconocida"}</td>
                        <td>
                            <div class="gauge-container">
                                <div id="gauge-${index + 1}" class="gauge-chart"></div>
                            </div>
                        </td>
                        <td>
                            <div class="btn-container">
                                <button class="btn btn-info btn-sm" onclick="window.location.href = '/sensorInfo?sensorId=${sensor.id}'">
                                    Ver Detalles 
                                </button>
                                
                                <button class="btn btn-danger btn-sm" onclick="deleteSensor(${sensor.id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>
                `;
                tableBody.append(row);

                createGauge(`gauge-${index + 1}`, lastAQI);
            });
        },
        error: function (xhr) {
            console.error("Error en la API:", xhr.responseText);
            tableBody.html(`
                <tr>
                    <td colspan="5" class="text-center text-danger">Error al cargar los sensores. Inténtelo de nuevo.</td>
                </tr>
            `);
        }
    });
}



function createGauge(chartId, value) {
    console.log(`⏳ Creando gauge para ID: ${chartId} con valor: ${value}`);

    let chartElement = document.getElementById(chartId);
    if (!chartElement) {
        console.error(`❌ Error: No se encontró el elemento con ID: ${chartId}`);
        return;
    }

    // Ajustar el tamaño del gráfico de forma más compacta
    chartElement.style.width = "80px";
    chartElement.style.height = "80px";

    // Eliminar cualquier instancia previa de ECharts para evitar conflictos
    if (chartElement.getAttribute("_echarts_instance_")) {
        echarts.dispose(chartElement);
    }

    var chart = echarts.init(chartElement);
    var option = {
        series: [
            {

                type: "gauge",
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 200,
                axisLine: {
                    lineStyle: {
                        width: 15, /* 🔹 Reducimos el grosor del arco */
                        color: [
                            [0.25, "green"],
                            [0.5, "yellow"],
                            [0.75, "orange"],
                            [1, "red"]
                        ]
                    }
                },
                pointer: {
                    width: 3, /* 🔹 Flecha más delgada */
                    length: "75%",
                    itemStyle: { color: "black" }


                },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false },
                detail: {

                    formatter: `{value}`,
                    fontSize: 12, /* 🔹 Reducimos el tamaño del número */
                    color: "black",
                    offsetCenter: [0, "50%"]
                },
                data: [{ value: value }]
            }
        ]
    };

    chart.setOption(option);
    console.log(`✅ Gauge creado exitosamente para ${chartId}`);
}




$(document).ready(function () {
    fetchSensorsAQI();
});
