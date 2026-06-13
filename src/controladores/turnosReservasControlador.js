import TurnosReservasServicio from '../servicios/turnosReservasServicio.js';
import Pacientes from '../db/pacientes.js';

export default class TurnosReservasControlador {
    constructor() {
        this.turnos = new TurnosReservasServicio();
        this.pacientes = new Pacientes();
    }

    buscarTodos = async (req, res) => {
        try {
            const turnos = await this.turnos.buscarTodos();
            res.status(200).json({ estado: true, turnos });
        } catch (error) {
            console.log(`Error en GET /turnos: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const turno = await this.turnos.buscarPorId(req.params.id_turno);
            if (!turno) {
                return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado' });
            }
            res.status(200).json({ estado: true, turno });
        } catch (error) {
            console.log(`Error en GET /turnos/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    misTurnos = async (req, res) => {
        try {
            const turnos = await this.turnos.misTurnos(req.user.id_usuario, req.user.rol);
            res.status(200).json({ estado: true, turnos });
        } catch (error) {
            console.log(`Error en GET /turnos/mis-turnos: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    buscarPorMedico = async (req, res) => {
        try {
            const turnos = await this.turnos.buscarPorMedico(req.params.id_medico);
            res.status(200).json({ estado: true, turnos });
        } catch (error) {
            console.log(`Error en GET /turnos/medico/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    buscarPorPaciente = async (req, res) => {
        try {
            const turnos = await this.turnos.buscarPorPaciente(req.params.id_paciente);
            res.status(200).json({ estado: true, turnos });
        } catch (error) {
            console.log(`Error en GET /turnos/paciente/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    crear = async (req, res) => {
        try {
            const datos = req.dto;
            if (req.user.rol === 2) {
                const paciente = await this.pacientes.buscarPorIdUsuario(req.user.id_usuario);
                if (!paciente) {
                    return res.status(404).json({ estado: false, mensaje: 'Paciente no encontrado' });
                }
                datos.id_paciente = paciente.id_paciente;
            }

            if (!datos.id_medico || !datos.id_paciente || !datos.fecha_hora) {
                return res.status(400).json({ estado: false, mensaje: 'Faltan datos requeridos' });
            }

            const resultado = await this.turnos.crear(datos);
            res.status(201).json({
                estado: true,
                mensaje: 'Turno creado',
                id_turno_reserva: resultado.insertId,
                valor_total: resultado.valor_total
            });
        } catch (error) {
            console.log(`Error en POST /turnos: ${error.message}`);
            const erroresConocidos = ['No se puede crear un turno en el pasado', 'El médico ya tiene un turno en esa fecha y hora', 'No se pudo crear el turno'];
            if (erroresConocidos.includes(error.message)) {
                return res.status(400).json({ estado: false, mensaje: error.message });
            }
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    marcarAtendido = async (req, res) => {
        try {
            const filas = await this.turnos.marcarAtendido(req.params.id_turno);
            if (filas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado' });
            }
            res.status(200).json({ estado: true, mensaje: 'Turno marcado como atendido' });
        } catch (error) {
            console.log(`Error en PUT /turnos/:id/atender: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
}
