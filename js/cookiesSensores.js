const COOKIE_NAME = "recent_sensors";
const MAX_SENSORS = 5; // Número máximo de sensores guardados en cookies

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

function getSensorsFromCookies() {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [name, value] = cookie.split("=");
        if (name === COOKIE_NAME) {
            return JSON.parse(value);
        }
    }
    return [];
}
