import PDFDocument from 'pdfkit';
import { pool } from '../db/conexion.js';

export default class ReportesServicio {
    generarReporteTurnos = async () => {
        const [turnos] = await pool.query(
            `SELECT tr.fecha_hora, tr.valor_total, tr.atentido,
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
             ORDER BY tr.fecha_hora`
        );

        const [stats] = await pool.query('CALL sp_estadisticas_generales()');
        const generales = stats[0][0];

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 30 });
            const buffers = [];

            doc.on('data', chunk => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            doc.fontSize(18).text('Reporte de Turnos', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-AR')}`, { align: 'right' });
            doc.moveDown();

            doc.fontSize(12).text('Resumen General', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Total de turnos: ${generales.total_turnos}`);
            doc.text(`Turnos atendidos: ${generales.total_atendidos}`);
            doc.text(`Turnos pendientes: ${generales.total_pendientes}`);
            doc.text(`Total pacientes: ${generales.total_pacientes}`);
            doc.text(`Total médicos: ${generales.total_medicos}`);
            doc.text(`Total obras sociales: ${generales.total_obras_sociales}`);
            doc.text(`Total facturado: $${Number(generales.total_facturado).toFixed(2)}`);
            doc.moveDown();

            doc.fontSize(12).text('Detalle de Turnos', { underline: true });
            doc.moveDown(0.5);

            turnos.forEach((t, i) => {
                const estado = t.atentido === 1 ? 'Atendido' : 'Pendiente';
                doc.fontSize(9).text(
                    `${i + 1}. ${new Date(t.fecha_hora).toLocaleString('es-AR')} | ${t.medico_apellido}, ${t.medico_nombres} | ${t.paciente_apellido}, ${t.paciente_nombres} | ${t.obra_social} | $${Number(t.valor_total).toFixed(2)} | ${estado}`
                );
                if ((i + 1) % 30 === 0) {
                    doc.addPage();
                }
            });

            doc.end();
        });
    }
}
