// Importar jsPDF y autoTable correctamente
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Chart from "chart.js/auto";

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
        const tableData = lecturasHoy.flatMap(lectura =>
            lectura.variables.map(variable => [
                lectura.dateLectura.split('T')[1],
                variable.nombre,
                variable.valor,
                variable.unidad
            ])
        );

        autoTable(pdf, {
            head: [['Hora', 'Variable', 'Valor', 'Unidad']],
            body: tableData,
            startY: 40
        });

        // Crear y agregar un canvas temporal al DOM para que Chart.js pueda renderizar correctamente
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        document.body.appendChild(canvas); // IMPORTANTE: Agregarlo temporalmente al DOM

        const ctx = canvas.getContext('2d');
        const labels = lecturasHoy.map(lectura => lectura.dateLectura.split('T')[1]);
        const pm25Data = lecturasHoy.map(lectura =>
            lectura.variables.find(v => v.nombre === "PM2.5")?.valor || 0
        );

        // Crear gráfico con Chart.js
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'PM2.5 (µg/m³)',
                    data: pm25Data,
                    borderColor: 'blue',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: false,
                animation: false,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });

        // Esperar a que el gráfico esté completamente renderizado antes de capturar la imagen
        setTimeout(() => {
            const imgData = canvas.toDataURL('image/png');

            pdf.addPage();
            pdf.text('Gráfico de PM2.5', 10, 10);
            pdf.addImage(imgData, 'PNG', 10, 20, 180, 100);
            pdf.save(`Reporte_Sensor_${sensorData.name}_${hoy}.pdf`);

            // Remover el canvas después de usarlo
            document.body.removeChild(canvas);
        }, 1500); // Esperar 1.5 segundos para asegurar que Chart.js renderizó todo

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
