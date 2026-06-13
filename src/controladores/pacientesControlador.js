import PacientesServicio from '../servicios/pacientesServicio.js';

export default class PacientesControlador {
    constructor() {
        this.pacientes = new PacientesServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const pacientes = await this.pacientes.buscarTodos();
            res.status(200).json({ estado: true, pacientes });
        } catch (error) {
            console.log(`Error en GET /pacientes: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const paciente = await this.pacientes.buscarPorId(req.params.id_paciente);
            if (!paciente) {
                return res.status(404).json({ estado: false, mensaje: 'Paciente no encontrado' });
            }
            res.status(200).json({ estado: true, paciente });
        } catch (error) {
            console.log(`Error en GET /pacientes/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    modificar = async (req, res) => {
        try {
            const filas = await this.pacientes.modificar(req.params.id_paciente, req.body);
            if (filas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Paciente no encontrado' });
            }
            res.status(200).json({ estado: true, mensaje: 'Paciente modificado' });
        } catch (error) {
            console.log(`Error en PUT /pacientes/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
}
