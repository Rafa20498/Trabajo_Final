import { pool } from './conexion.js';

export const crearProcedimientos = async () => {
    const procedures = [
        {
            nombre: 'sp_estadisticas_generales',
            sql: `CREATE PROCEDURE IF NOT EXISTS sp_estadisticas_generales()
            BEGIN
                SELECT
                    (SELECT COUNT(*) FROM turnos_reservas WHERE activo = 1) AS total_turnos,
                    (SELECT COUNT(*) FROM turnos_reservas WHERE activo = 1 AND atentido = 1) AS total_atendidos,
                    (SELECT COUNT(*) FROM turnos_reservas WHERE activo = 1 AND atentido = 0) AS total_pendientes,
                    (SELECT COUNT(*) FROM pacientes) AS total_pacientes,
                    (SELECT COUNT(*) FROM medicos) AS total_medicos,
                    (SELECT COUNT(*) FROM obras_sociales WHERE activo = 1) AS total_obras_sociales,
                    (SELECT COUNT(*) FROM especialidades WHERE activo = 1) AS total_especialidades,
                    COALESCE((SELECT SUM(valor_total) FROM turnos_reservas WHERE activo = 1), 0) AS total_facturado;
            END`
        },
        {
            nombre: 'sp_estadisticas_por_medico',
            sql: `CREATE PROCEDURE IF NOT EXISTS sp_estadisticas_por_medico()
            BEGIN
                SELECT
                    m.id_medico,
                    u.apellido,
                    u.nombres,
                    COUNT(tr.id_turno_reserva) AS cantidad_turnos,
                    SUM(CASE WHEN tr.atentido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
                    COALESCE(SUM(tr.valor_total), 0) AS total_facturado
                FROM medicos m
                JOIN usuarios u ON m.id_usuario = u.id_usuario
                LEFT JOIN turnos_reservas tr ON m.id_medico = tr.id_medico AND tr.activo = 1
                WHERE u.activo = 1
                GROUP BY m.id_medico, u.apellido, u.nombres;
            END`
        },
        {
            nombre: 'sp_estadisticas_por_especialidad',
            sql: `CREATE PROCEDURE IF NOT EXISTS sp_estadisticas_por_especialidad()
            BEGIN
                SELECT
                    e.id_especialidad,
                    e.nombre,
                    COUNT(tr.id_turno_reserva) AS cantidad_turnos,
                    SUM(CASE WHEN tr.atentido = 1 THEN 1 ELSE 0 END) AS turnos_atendidos,
                    COALESCE(SUM(tr.valor_total), 0) AS total_facturado
                FROM especialidades e
                LEFT JOIN medicos m ON e.id_especialidad = m.id_especialidad
                LEFT JOIN turnos_reservas tr ON m.id_medico = tr.id_medico AND tr.activo = 1
                WHERE e.activo = 1
                GROUP BY e.id_especialidad, e.nombre;
            END`
        },
        {
            nombre: 'sp_estadisticas_por_obra_social',
            sql: `CREATE PROCEDURE IF NOT EXISTS sp_estadisticas_por_obra_social()
            BEGIN
                SELECT
                    os.id_obra_social,
                    os.nombre,
                    COUNT(tr.id_turno_reserva) AS cantidad_turnos,
                    COALESCE(SUM(tr.valor_total), 0) AS total_facturado
                FROM obras_sociales os
                LEFT JOIN turnos_reservas tr ON os.id_obra_social = tr.id_obra_social AND tr.activo = 1
                WHERE os.activo = 1
                GROUP BY os.id_obra_social, os.nombre;
            END`
        }
    ];

    for (const proc of procedures) {
        try {
            await pool.query(proc.sql);
            console.log(`Procedimiento ${proc.nombre} creado/verificado`);
        } catch (error) {
            console.error(`Error al crear ${proc.nombre}: ${error.message}`);
        }
    }
};
