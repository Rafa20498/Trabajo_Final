import { pool } from './conexion.js';

export default class Medicos {
    buscarTodos = async () => {
        const sql = `SELECT * FROM v_medicos`;
        const [medicos] = await pool.execute(sql);
        return medicos;
    }

    buscarPorId = async (id_medico) => {
        const sql = `SELECT m.*, u.apellido, u.nombres, u.email, u.foto_path, e.nombre AS especialidad
                     FROM medicos m
                     JOIN usuarios u ON m.id_usuario = u.id_usuario
                     JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                     WHERE m.id_medico = ? AND u.activo = 1`;
        const [medico] = await pool.execute(sql, [id_medico]);
        return medico[0];
    }

    buscarPorEspecialidad = async (id_especialidad) => {
        const sql = `SELECT m.*, u.apellido, u.nombres, u.email, u.foto_path
                     FROM medicos m
                     JOIN usuarios u ON m.id_usuario = u.id_usuario
                     WHERE m.id_especialidad = ? AND u.activo = 1`;
        const [medicos] = await pool.execute(sql, [id_especialidad]);
        return medicos;
    }

    buscarPorIdUsuario = async (id_usuario) => {
        const sql = `SELECT * FROM medicos WHERE id_usuario = ?`;
        const [medico] = await pool.execute(sql, [id_usuario]);
        return medico[0];
    }

    crear = async (datos) => {
        const sql = `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)`;
        const [resultado] = await pool.execute(sql, [datos.id_usuario, datos.id_especialidad, datos.matricula, datos.descripcion || null, datos.valor_consulta]);
        return resultado.insertId;
    }

    modificar = async (id, datos) => {
        const sql = `UPDATE medicos SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?`;
        const [resultado] = await pool.execute(sql, [datos.id_especialidad, datos.matricula, datos.descripcion, datos.valor_consulta, id]);
        return resultado.affectedRows;
    }

    relacionarConObraSocial = async (id_medico, obras_sociales) => {
        const conexion = await pool.getConnection();
        try {
            await conexion.beginTransaction();
            for (const os of obras_sociales) {
                await conexion.execute(
                    `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)`,
                    [id_medico, os.id_obra_social]
                );
            }
            await conexion.commit();
            return true;
        } catch (error) {
            await conexion.rollback();
            return false;
        } finally {
            conexion.release();
        }
    }

    listarObrasSociales = async (id_medico) => {
        const sql = `SELECT os.* FROM medicos_obras_sociales mos
                     JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
                     WHERE mos.id_medico = ? AND mos.activo = 1 AND os.activo = 1`;
        const [obras] = await pool.execute(sql, [id_medico]);
        return obras;
    }
}
