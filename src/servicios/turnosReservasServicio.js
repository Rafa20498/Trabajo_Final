import TurnosReservas from '../db/turnosReservas.js';
import Medicos from '../db/medicos.js';
import Pacientes from '../db/pacientes.js';
import ObrasSociales from '../db/obras_sociales.js';

export default class TurnosReservasServicio {
    constructor() {
        this.turnos = new TurnosReservas();
        this.medicos = new Medicos();
        this.pacientes = new Pacientes();
        this.obrasSociales = new ObrasSociales();
    }

    buscarTodos = () => this.turnos.buscarTodos();

    buscarPorId = (id) => this.turnos.buscarPorId(id);

    buscarPorMedico = (id_medico) => this.turnos.buscarPorMedico(id_medico);

    buscarPorPaciente = (id_paciente) => this.turnos.buscarPorPaciente(id_paciente);

    misTurnos = async (id_usuario, rol) => {
        if (rol === 1) {
            const medico = await this.medicos.buscarPorIdUsuario(id_usuario);
            if (!medico) return [];
            return this.turnos.buscarPorMedico(medico.id_medico);
        } else if (rol === 2) {
            const paciente = await this.pacientes.buscarPorIdUsuario(id_usuario);
            if (!paciente) return [];
            return this.turnos.buscarPorPaciente(paciente.id_paciente);
        }
        return [];
    }

    crear = async (turnoReserva) => {
        const medico = await this.medicos.buscarPorId(turnoReserva.id_medico);
        const paciente = await this.pacientes.buscarPorId(turnoReserva.id_paciente);
        const obra_social = await this.obrasSociales.buscarPorId(paciente.id_obra_social);

        const ahora = new Date();
        const fechaTurno = new Date(turnoReserva.fecha_hora);
        if (fechaTurno < ahora) {
            throw new Error('No se puede crear un turno en el pasado');
        }

        const disponible = await this.turnos.verificarDisponibilidad(turnoReserva.id_medico, turnoReserva.fecha_hora);
        if (!disponible) {
            throw new Error('El médico ya tiene un turno en esa fecha y hora');
        }

        let valor = Number(medico.valor_consulta);

        if (Number(obra_social.es_particular) === 0) {
            valor = valor - (Number(obra_social.porcentaje_descuento) / 100 * valor);
        }

        turnoReserva.valor_total = Math.round(valor * 100) / 100;
        turnoReserva.id_obra_social = paciente.id_obra_social;

        const id_nuevo = await this.turnos.crear(turnoReserva);
        if (!id_nuevo) {
            throw new Error('No se pudo crear el turno');
        }
        return { insertId: id_nuevo, valor_total: turnoReserva.valor_total };
    }

    marcarAtendido = (id) => this.turnos.marcarAtendido(id);
}
