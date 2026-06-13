import express from 'express';
import EstadisticasControlador from '../../controladores/estadisticasControlador.js';
import passport from 'passport';
import validarRoles from '../../middleware/validarRoles.js';

const router = express.Router();
const estadisticas = new EstadisticasControlador();

/**
 * @swagger
 * /estadisticas:
 *   get:
 *     summary: Obtener estadísticas generales (Admin)
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 */
router.get('/', [
    passport.authenticate('jwt', { session: false }),
    validarRoles(3)
], estadisticas.obtenerEstadisticas);

export { router };
