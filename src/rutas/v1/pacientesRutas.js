import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middleware/validarCampos.js';
import PacientesControlador from '../../controladores/pacientesControlador.js';
import passport from 'passport';
import validarRoles from '../../middleware/validarRoles.js';

const router = express.Router();
const pacientes = new PacientesControlador();

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Lista todos los pacientes (Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de pacientes
 */
router.get('/',
    [passport.authenticate('jwt', { session: false }), validarRoles(3)],
    pacientes.buscarTodos
);

/**
 * @swagger
 * /pacientes/{id_paciente}:
 *   get:
 *     summary: Obtener paciente por ID (Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del paciente
 *       404:
 *         description: Paciente no encontrado
 */
router.get('/:id_paciente',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_paciente', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    pacientes.buscarPorId
);

/**
 * @swagger
 * /pacientes/{id_paciente}:
 *   put:
 *     summary: Modificar paciente (Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_paciente
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Paciente modificado
 *       404:
 *         description: Paciente no encontrado
 */
router.put('/:id_paciente',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_paciente', 'El parámetro debe ser entero').isInt(),
        check('id_obra_social').optional().isInt().withMessage('Debe ser entero.'),
        validarCampos
    ],
    pacientes.modificar
);

export { router };
