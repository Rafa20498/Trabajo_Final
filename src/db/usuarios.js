import { pool } from "./conexion.js";

export default class Usuarios {

    buscarPorId = async(id_usuario) => {
        const sql = `SELECT * FROM usuarios WHERE id_usuario = ?`;
        const [usuario] = await pool.execute(sql, [id_usuario]);
        return usuario[0];
    }

    actualizarFoto = async (id_usuario, foto_path) => {
        const sql = `UPDATE usuarios SET foto_path = ? WHERE id_usuario = ? AND activo = 1`;
        const [resultado] = await pool.execute(sql, [foto_path, id_usuario]);
        return resultado.affectedRows;
    }

    buscar = async (email, contrasenia) => {
        const sql = `SELECT u.id_usuario, CONCAT(u.nombres, ' ', u.apellido) as usuario, u.rol
                        FROM usuarios  AS u
                        WHERE u.email = ? 
                            AND u.contrasenia = SHA2(?, 256) 
                            AND u.activo = 1;`
        const [result] = await pool.execute(sql, [email, contrasenia]);
        return result[0];
    }
}
