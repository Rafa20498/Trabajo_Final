import ObrasSociales from '../db/obras_sociales.js';
import ObrasSocialesRespuestaDTO from '../dtos/obrasSocialesRespuestaDTO.js';

export default class ObrasSocialesServicio {
    constructor() {
        this.obrasSociales = new ObrasSociales();
    }

    buscarTodas = async () => {
        const datos = await this.obrasSociales.buscarTodas();
        return datos.map(row => new ObrasSocialesRespuestaDTO(row));
    }

    buscarPorId = (id) => this.obrasSociales.buscarPorId(id);

    crear = (datos) => this.obrasSociales.crear(datos);

    modificar = (id, datos) => this.obrasSociales.modificar(id, datos);

    eliminar = (id) => this.obrasSociales.eliminar(id);
}
