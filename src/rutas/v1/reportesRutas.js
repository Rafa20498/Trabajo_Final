import express from 'express';
import ReportesControlador from '../../controladores/reportesControlador.js';
import passport from 'passport';
import validarRoles from '../../middleware/validarRoles.js';

const router = express.Router();
const reportes = new ReportesControlador();

/**
 * @swagger
 * /reportes/turnos:
 *   get:
 *     summary: Generar reporte PDF de turnos (Admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF con reporte de turnos
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/turnos', [
    passport.authenticate('jwt', { session: false }),
    validarRoles(3)
], reportes.reporteTurnos);

export { router };
