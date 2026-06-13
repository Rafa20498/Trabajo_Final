import { pool } from './conexion.js';

export default class Estadisticas {
    obtenerGenerales = async () => {
        const [resultados] = await pool.execute('CALL sp_estadisticas_generales()');
        return resultados[0][0];
    }

    obtenerPorMedico = async () => {
        const [resultados] = await pool.execute('CALL sp_estadisticas_por_medico()');
        return resultados[0];
    }

    obtenerPorEspecialidad = async () => {
        const [resultados] = await pool.execute('CALL sp_estadisticas_por_especialidad()');
        return resultados[0];
    }

    obtenerPorObraSocial = async () => {
        const [resultados] = await pool.execute('CALL sp_estadisticas_por_obra_social()');
        return resultados[0];
    }
}
