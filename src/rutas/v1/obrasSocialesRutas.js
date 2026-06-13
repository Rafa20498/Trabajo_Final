import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middleware/validarCampos.js';
import TransformarDTO from '../../middleware/transformarDTOs.js';
import ObrasSocialesControlador from '../../controladores/obrasSocialesControlador.js';
import passport from 'passport';
import validarRoles from '../../middleware/validarRoles.js';

const router = express.Router();
const obrasSociales = new ObrasSocialesControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /obras-sociales:
 *   get:
 *     summary: Lista todas las obras sociales (Admin)
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de obras sociales
 */
router.get('/',
    [passport.authenticate('jwt', { session: false }), validarRoles(3)],
    obrasSociales.buscarTodas
);

/**
 * @swagger
 * /obras-sociales/{id_obra_social}:
 *   get:
 *     summary: Obtener obra social por ID (Admin)
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la obra social
 *       404:
 *         description: Obra social no encontrada
 */
router.get('/:id_obra_social',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    obrasSociales.buscarPorId
);

/**
 * @swagger
 * /obras-sociales:
 *   post:
 *     summary: Crear obra social (Admin)
 *     tags: [Obras Sociales]
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
 *               descripcion:
 *                 type: string
 *               porcentaje_descuento:
 *                 type: number
 *               es_particular:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Obra social creada
 */
router.post('/',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        check('nombre', 'El nombre es obligatorio.')
            .notEmpty().isLength({ max: 120 }),
        check('descripcion', 'La descripción es obligatoria.')
            .notEmpty().isLength({ max: 255 }),
        check('porcentaje_descuento', 'El porcentaje de descuento es obligatorio.')
            .notEmpty(),
        check('es_particular', 'es_particular es obligatorio y debe ser booleano.').isBoolean(),
        validarCampos
    ],
    transformarDTO.obrasSocialesCrearDTO,
    obrasSociales.crear
);

/**
 * @swagger
 * /obras-sociales/{id_obra_social}:
 *   put:
 *     summary: Modificar obra social (Admin)
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_obra_social
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
 *               descripcion:
 *                 type: string
 *               porcentaje_descuento:
 *                 type: number
 *               es_particular:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Obra social modificada
 *       404:
 *         description: Obra social no encontrada
 */
router.put('/:id_obra_social',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        check('nombre')
            .optional()
            .notEmpty().withMessage('El nombre no puede estar vacío.').isLength({ max: 120 }),
        check('descripcion')
            .optional().notEmpty().withMessage('La descripción no puede estar vacía.').isLength({ max: 255 }),
        check('porcentaje_descuento')
            .optional().isNumeric().withMessage('Debe ser numérico.'),
        check('es_particular')
            .optional().isBoolean().withMessage('Debe ser verdadero o falso.'),
        validarCampos
    ],
    transformarDTO.obrasSocialesActualizarDTO,
    obrasSociales.modificar
);

/**
 * @swagger
 * /obras-sociales/{id_obra_social}:
 *   delete:
 *     summary: Eliminar obra social (Admin)
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obra social eliminada
 *       404:
 *         description: Obra social no encontrada
 */
router.delete('/:id_obra_social',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    obrasSociales.eliminar
);

export { router };
