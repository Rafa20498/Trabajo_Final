import { pool } from './conexion.js';

export default class TurnosReservas {
    buscarTodos = async () => {
        const sql = `SELECT tr.*, 
                     u_med.apellido AS medico_apellido, u_med.nombres AS medico_nombres,
                     u_pac.apellido AS paciente_apellido, u_pac.nombres AS paciente_nombres,
                     os.nombre AS obra_social, e.nombre AS especialidad
                     FROM turnos_reservas tr
                     JOIN medicos m ON tr.id_medico = m.id_medico
                     JOIN usuarios u_med ON m.id_usuario = u_med.id_usuario
                     JOIN pacientes p ON tr.id_paciente = p.id_paciente
                     JOIN usuarios u_pac ON p.id_usuario = u_pac.id_usuario
                     JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
                     JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                     WHERE tr.activo = 1
                     ORDER BY tr.fecha_hora DESC`;
        const [turnos] = await pool.execute(sql);
        return turnos;
    }

    buscarPorId = async (id) => {
        const sql = `SELECT tr.*,
                     u_med.apellido AS medico_apellido, u_med.nombres AS medico_nombres,
                     u_pac.apellido AS paciente_apellido, u_pac.nombres AS paciente_nombres,
                     os.nombre AS obra_social
                     FROM turnos_reservas tr
                     JOIN medicos m ON tr.id_medico = m.id_medico
                     JOIN usuarios u_med ON m.id_usuario = u_med.id_usuario
                     JOIN pacientes p ON tr.id_paciente = p.id_paciente
                     JOIN usuarios u_pac ON p.id_usuario = u_pac.id_usuario
                     JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
                     WHERE tr.id_turno_reserva = ? AND tr.activo = 1`;
        const [turno] = await pool.execute(sql, [id]);
        return turno[0];
    }

    buscarPorMedico = async (id_medico) => {
        const sql = `SELECT tr.*,
                     u_pac.apellido AS paciente_apellido, u_pac.nombres AS paciente_nombres,
                     os.nombre AS obra_social
                     FROM turnos_reservas tr
                     JOIN pacientes p ON tr.id_paciente = p.id_paciente
                     JOIN usuarios u_pac ON p.id_usuario = u_pac.id_usuario
                     JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
                     WHERE tr.id_medico = ? AND tr.activo = 1
                     ORDER BY tr.fecha_hora ASC`;
        const [turnos] = await pool.execute(sql, [id_medico]);
        return turnos;
    }

    buscarPorPaciente = async (id_paciente) => {
        const sql = `SELECT tr.*,
                     u_med.apellido AS medico_apellido, u_med.nombres AS medico_nombres,
                     os.nombre AS obra_social, e.nombre AS especialidad
                     FROM turnos_reservas tr
                     JOIN medicos m ON tr.id_medico = m.id_medico
                     JOIN usuarios u_med ON m.id_usuario = u_med.id_usuario
                     JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
                     JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                     WHERE tr.id_paciente = ? AND tr.activo = 1
                     ORDER BY tr.fecha_hora DESC`;
        const [turnos] = await pool.execute(sql, [id_paciente]);
        return turnos;
    }

    crear = async (turnoReserva) => {
        const { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total } = turnoReserva;
        const sql = `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total) VALUES (?,?,?,?,?)`;
        const [result] = await pool.execute(sql, [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]);
        if (result.affectedRows === 0) {
            return null;
        }
        return result.insertId;
    }

    verificarDisponibilidad = async (id_medico, fecha_hora) => {
        const sql = `SELECT id_turno_reserva FROM turnos_reservas WHERE id_medico = ? AND fecha_hora = ? AND activo = 1`;
        const [existente] = await pool.execute(sql, [id_medico, fecha_hora]);
        return existente.length === 0;
    }

    marcarAtendido = async (id) => {
        const sql = `UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ? AND activo = 1`;
        const [resultado] = await pool.execute(sql, [id]);
        return resultado.affectedRows;
    }


}
