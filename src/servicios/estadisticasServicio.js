import Estadisticas from '../db/estadisticas.js';

export default class EstadisticasServicio {
    constructor() {
        this.estadisticas = new Estadisticas();
    }

    obtenerEstadisticas = async () => {
        const generales = await this.estadisticas.obtenerGenerales();
        const por_medico = await this.estadisticas.obtenerPorMedico();
        const por_especialidad = await this.estadisticas.obtenerPorEspecialidad();
        const por_obra_social = await this.estadisticas.obtenerPorObraSocial();

        return {
            generales,
            por_medico,
            por_especialidad,
            por_obra_social
        };
    }
}
