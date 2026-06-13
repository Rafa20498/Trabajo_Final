import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middleware/validarCampos.js';
import TransformarDTO from '../../middleware/transformarDTOs.js';
import TurnosReservasControlador from '../../controladores/turnosReservasControlador.js';
import passport from 'passport';
import validarRoles from '../../middleware/validarRoles.js';

const router = express.Router();
const turnos = new TurnosReservasControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Lista todos los turnos (Admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de turnos
 */
router.get('/',
    [passport.authenticate('jwt', { session: false }), validarRoles(3)],
    turnos.buscarTodos
);

/**
 * @swagger
 * /turnos/mis-turnos:
 *   get:
 *     summary: Obtener turnos del usuario autenticado
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Turnos del usuario
 */
router.get('/mis-turnos',
    [passport.authenticate('jwt', { session: false }), validarRoles(1, 2)],
    turnos.misTurnos
);

/**
 * @swagger
 * /turnos/medico/{id_medico}:
 *   get:
 *     summary: Listar turnos por médico
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turnos del médico
 */
router.get('/medico/:id_medico',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(1, 3),
        param('id_medico', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnos.buscarPorMedico
);

/**
 * @swagger
 * /turnos/paciente/{id_paciente}:
 *   get:
 *     summary: Listar turnos por paciente
 *     tags: [Turnos]
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
 *         description: Turnos del paciente
 */
router.get('/paciente/:id_paciente',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(2, 3),
        param('id_paciente', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnos.buscarPorPaciente
);

/**
 * @swagger
 * /turnos/{id_turno}:
 *   get:
 *     summary: Obtener turno por ID (Admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_turno
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del turno
 *       404:
 *         description: Turno no encontrado
 */
router.get('/:id_turno',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_turno', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnos.buscarPorId
);

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear turno (Paciente o Admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_medico:
 *                 type: integer
 *               fecha_hora:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turno creado
 *       400:
 *         description: Faltan datos requeridos
 */
router.post('/',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(2, 3),
        check('id_medico', 'El médico es obligatorio.').isInt(),
        check('fecha_hora', 'La fecha y hora son obligatorias.').notEmpty(),
        validarCampos
    ],
    transformarDTO.turnosReservasCrearDTO,
    turnos.crear
);

/**
 * @swagger
 * /turnos/{id_turno}/atender:
 *   put:
 *     summary: Marcar turno como atendido (Médico)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_turno
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *       404:
 *         description: Turno no encontrado
 */
router.put('/:id_turno/atender',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(1),
        param('id_turno', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    turnos.marcarAtendido
);

export { router };
