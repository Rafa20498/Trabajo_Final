import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middleware/validarCampos.js';
import TransformarDTO from '../../middleware/transformarDTOs.js';
import EspecialidadesControlador from '../../controladores/especialidadesControlador.js';
import passport from 'passport';
import validarRoles from '../../middleware/validarRoles.js';

const router = express.Router();
const especialidadesControlador = new EspecialidadesControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Lista todas las especialidades
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Listado de especialidades
 */
router.get('/', especialidadesControlador.buscarTodas);

/**
 * @swagger
 * /especialidades/{id_especialidad}:
 *   get:
 *     summary: Obtener especialidad por ID
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la especialidad
 *       404:
 *         description: Especialidad no encontrada
 */
router.get('/:id_especialidad',
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.buscarPorId
);

/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Crear especialidad (Admin)
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Especialidad creada
 *       401:
 *         description: No autorizado
 */
router.post('/',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        check('nombre', 'El nombre es obligatorio.').notEmpty().isLength({ max: 120 }),
        validarCampos
    ],
    transformarDTO.especialidadesCrearDTO,
    especialidadesControlador.crear
);

/**
 * @swagger
 * /especialidades/{id_especialidad}:
 *   put:
 *     summary: Modificar especialidad (Admin)
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
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
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Especialidad modificada
 *       404:
 *         description: Especialidad no encontrada
 */
router.put('/:id_especialidad',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        check('nombre', 'El nombre no puede estar vacío.').optional().notEmpty().isLength({ max: 120 }),
        validarCampos
    ],
    transformarDTO.especialidadesActualizarDTO,
    especialidadesControlador.modificar
);

/**
 * @swagger
 * /especialidades/{id_especialidad}:
 *   delete:
 *     summary: Eliminar especialidad (Admin)
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Especialidad eliminada
 *       404:
 *         description: Especialidad no encontrada
 */
router.delete('/:id_especialidad',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    especialidadesControlador.eliminar
);

export { router };
