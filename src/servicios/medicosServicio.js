import Medicos from '../db/medicos.js';
import MedicosRespuestaDTO from '../dtos/medicosRespuestaDTO.js';

export default class MedicosServicio {
    constructor() {
        this.medicos = new Medicos();
    }

    buscarPorId = (id_medico) => {
        return this.medicos.buscarPorId(id_medico);
    }

    buscarTodos = async () => {
        const datos = await this.medicos.buscarTodos();
        return datos.map(row => new MedicosRespuestaDTO(row));
    }

    buscarPorEspecialidad = (id_especialidad) => {
        return this.medicos.buscarPorEspecialidad(id_especialidad);
    }

    listarObrasSociales = (id_medico) => {
        return this.medicos.listarObrasSociales(id_medico);
    }

    crear = async (datos) => {
        return this.medicos.crear(datos);
    }

    modificar = (id, datos) => {
        return this.medicos.modificar(id, datos);
    }

    asociarMedicoObrasSociales = async (id_medico, obras_sociales) => {
        return this.medicos.relacionarConObraSocial(id_medico, obras_sociales);
    }
}
