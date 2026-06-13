import Especialidades from '../db/especialidades.js';


export default class especialidadesServicio{
    constructor(){
        this.especialidades = new Especialidades();
    }
    buscarTodas = () => {
        return this.especialidades.buscarTodas();
    }

    buscarPorId = (id) => {
        return this.especialidades.buscarPorId(id);
    }

    crear = (datos) => {
        return this.especialidades.crear(datos);
    }

    modificar = (id, datos) => {
        return this.especialidades.modificar(id, datos);
    }

    eliminar = (id) => {
        return this.especialidades.eliminar(id);
    }

}