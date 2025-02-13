let charts = [];

function createSensorChart(url, sensorId) {
    fetch(url)
        .then(response => response.json())
        .then(sensor => {
            if (!sensor.lecturas || sensor.lecturas.length === 0) {
                console.warn(`⚠️ El sensor ${sensor.name} no tiene lecturas registradas.`);
                return;
            }

            // Ordenar lecturas por fecha descendente y obtener la más reciente
            let latestDate = sensor.lecturas
                .map(lectura => lectura.dateLectura.split("T")[0])
                .sort()
                .reverse()[0];

            // Filtrar lecturas del último día con datos
            let latestReadings = sensor.lecturas.filter(lectura => lectura.dateLectura.startsWith(latestDate));

            let chartId = `sensorChart${sensorId}`;
            let timestamp = new Date(latestReadings[latestReadings.length - 1].dateLectura).toLocaleString();

            // Insertar el gráfico dentro del carrusel
            let carouselInner = document.querySelector(".carousel-inner");
            let carouselItem = document.createElement("div");
            carouselItem.classList.add("carousel-item");
            if (charts.length === 0) carouselItem.classList.add("active");

            carouselItem.innerHTML = `
                <div class="sensor-box">
                    <div class="sensor-header">${sensor.name} (${sensor.ubication})</div>
                    <p class="text-center"><strong>Última lectura:</strong> ${timestamp}</p>
                    <div class="chart-container" id="${chartId}"></div>
                </div>
            `;

            carouselInner.appendChild(carouselItem);

            let { timeLabels, tempValues, humidityValues, aqiValues, pm25Values, pm10Values } = processSensorReadings(latestReadings);
            setTimeout(() => generateEChart(chartId, timeLabels, tempValues, humidityValues, aqiValues, pm25Values, pm10Values), 100);
        })
        .catch(error => {
            console.error("❌ Error al obtener datos del sensor:", error);
        });
}

function processSensorReadings(readings) {
    let timeLabels = [];
    let tempValues = [];
    let humidityValues = [];
    let aqiValues = [];
    let pm25Values = [];
    let pm10Values = [];

    readings.forEach(lectura => {
        let date = new Date(lectura.dateLectura);
        let timeLabel = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

        let temperatura = lectura.variables.find(v => v.nombre === "Temperatura")?.valor || 0;
        let humedad = lectura.variables.find(v => v.nombre === "Humedad")?.valor || 0;
        let aqi = lectura.variables.find(v => v.nombre === "AQI")?.valor || 0;
        let pm25 = lectura.variables.find(v => v.nombre === "PM2.5")?.valor || 0;
        let pm10 = lectura.variables.find(v => v.nombre === "PM10")?.valor || 0;

        timeLabels.push(timeLabel);
        tempValues.push(temperatura);
        humidityValues.push(humedad);
        aqiValues.push(aqi);
        pm25Values.push(pm25);
        pm10Values.push(pm10);
    });

    return { timeLabels, tempValues, humidityValues, aqiValues, pm25Values, pm10Values };
}

function generateEChart(chartId, timeLabels, tempValues, humidityValues, aqiValues, pm25Values, pm10Values) {
    let chart = echarts.init(document.getElementById(chartId));

    let option = {
        tooltip: { trigger: 'axis' },
        legend: { 
            data: ['Temperatura (°C)', 'Humedad (%)', 'AQI', 'PM2.5 (µg/m³)', 'PM10 (µg/m³)'], 
            top: '10%', left: 'center' 
        },
        xAxis: { type: 'category', data: timeLabels },
        yAxis: { type: 'value', min: 0 },
        series: [
            { name: 'Temperatura (°C)', type: 'line', data: tempValues, itemStyle: { color: 'red' } },
            { name: 'Humedad (%)', type: 'line', data: humidityValues, itemStyle: { color: 'blue' } },
            { name: 'AQI', type: 'line', data: aqiValues, itemStyle: { color: 'purple' } },
            { name: 'PM2.5 (µg/m³)', type: 'line', data: pm25Values, itemStyle: { color: 'orange' } },
            { name: 'PM10 (µg/m³)', type: 'line', data: pm10Values, itemStyle: { color: 'green' } }
        ]
    };

    chart.setOption(option);
    charts.push(chart);
}

// Ejemplo de uso con un sensor
document.addEventListener("DOMContentLoaded", () => {
    createSensorChart("http://localhost:8080/sensores/8", 8);
});

window.addEventListener('resize', () => charts.forEach(chart => chart.resize()));
