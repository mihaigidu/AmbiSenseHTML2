let charts = [];
const COOKIE_NAME = "recent_sensors";
const MAX_SENSORS = 5; // Número máximo de sensores a almacenar

/**
 * 📌 Función para guardar en cookies los sensores abiertos recientemente
 * @param {number} sensorId - ID del sensor
 */
function saveSensorToCookies(sensorId) {
    let sensors = getSensorsFromCookies();

    // Evitar duplicados y mantener el orden de apertura
    sensors = sensors.filter(id => id !== sensorId);
    sensors.unshift(sensorId);

    // Limitar la cantidad de sensores guardados
    sensors = sensors.slice(0, MAX_SENSORS);

    // Guardar en cookies (Expira en 7 días)
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(sensors)};path=/;max-age=${7 * 24 * 60 * 60}`;
}

/**
 * 📌 Función para obtener sensores guardados en cookies
 * @returns {Array} Array con los IDs de sensores
 */
function getSensorsFromCookies() {
    let cookies = document.cookie.split("; ");
    let sensorCookie = cookies.find(row => row.startsWith(COOKIE_NAME + "="));
    return sensorCookie ? JSON.parse(sensorCookie.split("=")[1]) : [];
}

/**
 * 📌 Función para crear gráficos de sensores guardados en cookies
 */
function loadRecentSensors() {
    let sensors = getSensorsFromCookies();
    
    if (sensors.length === 0) {
        console.warn("⚠️ No hay sensores recientes en cookies.");
        return;
    }

    // Limpiar carrusel antes de agregar nuevos
    document.querySelector(".carousel-inner").innerHTML = "";

    // Crear gráficos para cada sensor almacenado
    sensors.forEach(sensorId => {
        createSensorChart(`api/public/sensores/${sensorId}`, sensorId);
    });
}

/**
 * 📌 Función para crear un gráfico de un sensor
 * @param {string} url - API endpoint del sensor
 * @param {number} sensorId - ID del sensor
 */
function createSensorChart(url, sensorId) {
    fetch(url)
        .then(response => response.json())
        .then(sensor => {
            if (!sensor.lecturas || sensor.lecturas.length === 0) {
                console.warn(`⚠️ El sensor ${sensor.name} no tiene lecturas registradas.`);
                //añadir
                return;
            }

            // Guardar en cookies el sensor abierto
            saveSensorToCookies(sensor.id);

            let latestDate = sensor.lecturas
                .map(lectura => lectura.dateLectura.split("T")[0])
                .sort()
                .reverse()[0];

                //modular el ordenar funcion
            let latestReadings = sensor.lecturas.filter(lectura => lectura.dateLectura.startsWith(latestDate));
            latestReadings.sort((a, b) => new Date(a.dateLectura) - new Date(b.dateLectura));

            let chartId = `sensorChart${sensorId}`;
            let timestamp = new Date(latestReadings[latestReadings.length - 1].dateLectura).toLocaleString();

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

/**
 * 📌 Función para procesar los datos de los sensores
 */
function processSensorReadings(readings) {
    let timeLabels = [];
    let tempValues = [];
    let humidityValues = [];
    let aqiValues = [];
    let pm25Values = [];
    let pm10Values = [];

    readings.forEach(lectura => {
        let date = new Date(lectura.dateLectura);
        let timeLabel = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

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

/**
 * 📌 Función para generar la gráfica con ECharts
 */
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

// 📌 Cargar sensores recientes al iniciar la página
document.addEventListener("DOMContentLoaded", loadRecentSensors);

// 📌 Redimensionar gráficos al cambiar el tamaño de la ventana
window.addEventListener('resize', () => charts.forEach(chart => chart.resize()));
