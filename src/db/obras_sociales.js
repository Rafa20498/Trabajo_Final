import { pool } from './conexion.js';

export default class ObrasSociales {
    buscarTodas = async () => {
        const sql = `SELECT * FROM obras_sociales WHERE activo = 1`;
        const [obras] = await pool.execute(sql);
        return obras;
    }

    buscarPorId = async (id) => {
        const sql = `SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1`;
        const [obra] = await pool.execute(sql, [id]);
        return obra[0];
    }

    crear = async (datos) => {
        const sql = `INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)`;
        const [resultado] = await pool.execute(sql, [datos.nombre, datos.descripcion, datos.porcentaje_descuento, datos.es_particular || 0]);
        return resultado.insertId;
    }

    modificar = async (id, datos) => {
        const sql = `UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ? AND activo = 1`;
        const [resultado] = await pool.execute(sql, [datos.nombre, datos.descripcion, datos.porcentaje_descuento, datos.es_particular, id]);
        return resultado.affectedRows;
    }

    eliminar = async (id) => {
        const sql = `UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?`;
        const [resultado] = await pool.execute(sql, [id]);
        return resultado.affectedRows;
    }
}
