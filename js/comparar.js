function fetchSensors() {
    $.get("http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/sensores", function (data) {
        let sensors = [...new Set(data.map(item => item.id))];

        $("#sensor1, #sensor2").empty().append('<option value="" disabled selected>Selecciona un sensor</option>');

        sensors.forEach(sensorId => {
            $("#sensor1, #sensor2").append(`<option value="${sensorId}">Sensor ${sensorId}</option>`);
        });
    });
}

function fetchDates(sensorNumber) {
    let sensorId = $(`#sensor${sensorNumber}`).val();
    if (!sensorId) return;

    $.get(`http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/sensores`, function (data) {
        let sensor = data.find(s => s.id == sensorId);
        if (!sensor) return;

        let uniqueDates = [...new Set(sensor.lecturas.map(lectura => lectura.dateLectura.split('T')[0]))];
        let dateFilter = $(`#dayFilter${sensorNumber}`);

        dateFilter.empty().append('<option value="" disabled selected>Selecciona una fecha</option>');

        uniqueDates.forEach(date => {
            dateFilter.append(`<option value="${date}">${date}</option>`);
        });
    });
}




let allData = { sensor1: {}, sensor2: {} };
let timeLabels = { sensor1: [], sensor2: [] };

function fetchData(sensorNumber) {
    let sensorId = $(`#sensor${sensorNumber}`).val();
    let date = $(`#dayFilter${sensorNumber}`).val();
    $.get(`http://ambisensepruebaapi.us-east-1.elasticbeanstalk.com/sensores`, function (data) {
        let sensor = data.find(s => s.id == sensorId);
        if (!sensor) return;

        let filteredData = sensor.lecturas.filter(lectura => lectura.dateLectura.startsWith(date));

        // ✅ Ordenar las lecturas por hora antes de procesarlas
        filteredData.sort((a, b) => {
            let timeA = a.dateLectura.split('T')[1];
            let timeB = b.dateLectura.split('T')[1];
            return timeA.localeCompare(timeB); // Ordena alfabéticamente, lo que en HH:MM funciona correctamente
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

        // Dibujamos el gráfico con la variable seleccionada o PM2.5 por defecto
        let selectedVariable = $("#variableSelector").val() || "PM2.5";
        renderChart(`chart${sensorNumber}`, `Sensor ${sensorId}`, timeLabels[`sensor${sensorNumber}`], allData[`sensor${sensorNumber}`][selectedVariable]);
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