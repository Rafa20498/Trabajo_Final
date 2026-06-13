import { pool } from './conexion.js';

export default class Especialidades {
    buscarTodas = async () => {
        const sql = `SELECT * FROM especialidades WHERE activo = 1`;
        const [especialidades] = await pool.execute(sql);
        return especialidades;
    }

    buscarPorId = async (id_especialidad) => {
        const sql = `SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1`;
        const [especialidad] = await pool.execute(sql, [id_especialidad]);
        return especialidad[0];
    }

    crear = async (datos) => {
        const sql = `INSERT INTO especialidades (nombre) VALUES (?)`;
        const [resultado] = await pool.execute(sql, [datos.nombre]);
        return resultado.insertId;
    }

    modificar = async (id_especialidad, datos) => {
        const sql = `UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1`;
        const [resultado] = await pool.execute(sql, [datos.nombre, id_especialidad]);
        return resultado.affectedRows;
    }

    eliminar = async (id) => {
        const sql = `UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?`;
        const [resultado] = await pool.execute(sql, [id]);
        return resultado.affectedRows;
    }
}
