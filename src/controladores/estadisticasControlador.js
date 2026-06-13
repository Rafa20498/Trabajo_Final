import EstadisticasServicio from '../servicios/estadisticasServicio.js';

export default class EstadisticasControlador {
    constructor() {
        this.estadisticas = new EstadisticasServicio();
    }

    obtenerEstadisticas = async (req, res) => {
        try {
            const data = await this.estadisticas.obtenerEstadisticas();
            res.status(200).json({ estado: true, ...data });
        } catch (error) {
            console.log(`Error en GET /estadisticas: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
}
