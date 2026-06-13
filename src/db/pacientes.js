import { pool } from './conexion.js';

export default class Pacientes {
    buscarTodos = async () => {
        const sql = `SELECT * FROM v_pacientes`;
        const [pacientes] = await pool.execute(sql);
        return pacientes;
    }

    buscarPorId = async (id_paciente) => {
        const sql = `SELECT * FROM pacientes WHERE id_paciente = ?`;
        const [paciente] = await pool.execute(sql, [id_paciente]);
        return paciente[0];
    }

    buscarPorIdUsuario = async (id_usuario) => {
        const sql = `SELECT * FROM pacientes WHERE id_usuario = ?`;
        const [paciente] = await pool.execute(sql, [id_usuario]);
        return paciente[0];
    }

    modificar = async (id, datos) => {
        const sql = `UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?`;
        const [resultado] = await pool.execute(sql, [datos.id_obra_social, id]);
        return resultado.affectedRows;
    }
}
