import ReportesServicio from '../servicios/reportesServicio.js';

export default class ReportesControlador {
    constructor() {
        this.reportes = new ReportesServicio();
    }

    reporteTurnos = async (req, res) => {
        try {
            const pdf = await this.reportes.generarReporteTurnos();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_turnos.pdf');
            res.send(pdf);
        } catch (error) {
            console.log(`Error en GET /reportes/turnos: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error al generar el reporte' });
        }
    }
}
