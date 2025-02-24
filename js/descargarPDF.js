// Acceder a las librerías globales desde el objeto window
const { jsPDF } = window.jspdf;

async function generarReporte(sensorId) {
    try {
        // Obtener los datos del sensor desde la API
        const response = await fetch(`api/public/sensores/${sensorId}`);
        const sensorData = await response.json();

        // Encontrar el último día con datos
        const fechasDisponibles = [...new Set(sensorData.lecturas.map(lectura => lectura.dateLectura.split('T')[0]))];
        const ultimoDia = fechasDisponibles.sort().pop();
        let lecturasUltimoDia = sensorData.lecturas.filter(lectura => lectura.dateLectura.startsWith(ultimoDia));
        
        // Ordenar lecturas por hora y eliminar duplicados
        lecturasUltimoDia = lecturasUltimoDia.sort((a, b) => a.dateLectura.localeCompare(b.dateLectura));
        const horasRegistradas = new Set();
        lecturasUltimoDia = lecturasUltimoDia.filter(lectura => {
            const hora = lectura.dateLectura.split('T')[1];
            if (horasRegistradas.has(hora)) {
                return false;
            } else {
                horasRegistradas.add(hora);
                return true;
            }
        });

        // Crear un nuevo documento PDF
        const pdf = new jsPDF();
        pdf.setFontSize(16);
        pdf.text(`Reporte del Sensor: ${sensorData.name}`, 10, 10);
        pdf.text(`Ubicación: ${sensorData.ubication}`, 10, 20);
        pdf.text(`Fecha: ${ultimoDia}`, 10, 30);
        
        // Crear una tabla con datos
        const tableData = [];
        lecturasUltimoDia.forEach((lectura) => {
            lectura.variables.forEach(variable => {
                tableData.push([lectura.dateLectura.split('T')[1], variable.nombre, variable.valor, variable.unidad]);
            });
        });
        
        pdf.autoTable({
            head: [['Hora', 'Variable', 'Valor', 'Unidad']],
            body: tableData,
            startY: 40
        });

        // Agregar resumen de valores promedio
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text('Resumen de Datos', 10, 10);
        
        //quitar duplicados new map
        const summaryData = {};
        lecturasUltimoDia.forEach(lectura => {
            lectura.variables.forEach(variable => {
                if (!summaryData[variable.nombre]) {
                    summaryData[variable.nombre] = [];
                }
                summaryData[variable.nombre].push(variable.valor);
            });
        });

        let yPosition = 20;
        Object.keys(summaryData).forEach(variable => {
            const valores = summaryData[variable];
            const promedio = (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
            pdf.text(`${variable}: Promedio ${promedio}`, 10, yPosition);
            yPosition += 10;
        });

        pdf.save(`Reporte_Sensor_${sensorData.name}_${ultimoDia}.pdf`);
    } catch (error) {
        console.error("Error al generar el reporte:", error);
    }
}
let urlParams = new URLSearchParams(window.location.search);
let sensorId = urlParams.get("sensorId"); // Obtiene el ID del sensor desde la URL

// Agregar evento al botón para generar el PDF
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnGenerarReporte").addEventListener("click", function () {
         // Cambia esto con el ID real del sensor
        generarReporte(sensorId);
    });
});
