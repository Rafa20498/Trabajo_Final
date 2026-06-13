import Pacientes from '../db/pacientes.js';

export default class PacientesServicio {
    constructor() {
        this.pacientes = new Pacientes();
    }

    buscarTodos = () => this.pacientes.buscarTodos();

    buscarPorId = (id) => this.pacientes.buscarPorId(id);

    modificar = (id, datos) => this.pacientes.modificar(id, datos);
}
