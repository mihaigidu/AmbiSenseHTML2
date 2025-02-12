// Importar jsPDF y autoTable correctamente
const { jsPDF } = window.jspdf;

async function generarReporte(sensorId) {
    try {
        // Obtener los datos del sensor desde la API
        const response = await fetch(`http://localhost:8080/sensores/${sensorId}`);
        const sensorData = await response.json();

        // Filtrar lecturas del día actual
        const hoy = new Date().toISOString().split('T')[0];
        const lecturasHoy = sensorData.lecturas.filter(lectura => lectura.dateLectura.startsWith(hoy));

        // Crear un nuevo documento PDF
        const pdf = new jsPDF();
        pdf.setFontSize(16);
        pdf.text(`Reporte del Sensor: ${sensorData.name}`, 10, 10);
        pdf.text(`Ubicación: ${sensorData.ubication}`, 10, 20);
        pdf.text(`Fecha: ${hoy}`, 10, 30);
        
        // Crear una tabla con datos
        const tableData = [];
        lecturasHoy.forEach((lectura) => {
            lectura.variables.forEach(variable => {
                tableData.push([lectura.dateLectura.split('T')[1], variable.nombre, variable.valor, variable.unidad]);
            });
        });
        
        autoTable(pdf, {
            head: [['Hora', 'Variable', 'Valor', 'Unidad']],
            body: tableData,
            startY: 40
        });

        // Agregar resumen de valores promedio
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text('Resumen de Datos', 10, 10);
        
        const summaryData = {};
        lecturasHoy.forEach(lectura => {
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

        pdf.save(`Reporte_Sensor_${sensorData.name}_${hoy}.pdf`);
    } catch (error) {
        console.error("Error al generar el reporte:", error);
    }
}

// Agregar evento al botón para generar el PDF
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnGenerarReporte").addEventListener("click", function () {
        const sensorId = 8; // Cambia esto con el ID real del sensor
        generarReporte(sensorId);
    });
});
