import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middleware/validarCampos.js';
import TransformarDTO from '../../middleware/transformarDTOs.js';
import MedicosControlador from '../../controladores/medicosControlador.js';
import passport from 'passport';
import validarRoles from '../../middleware/validarRoles.js';

const router = express.Router();
const medicosControlador = new MedicosControlador();
const transformarDTO = new TransformarDTO();

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Lista todos los médicos
 *     tags: [Médicos]
 *     responses:
 *       200:
 *         description: Listado de médicos
 */
router.get('/', medicosControlador.buscarTodos);

/**
 * @swagger
 * /medicos/especialidad/{id_especialidad}:
 *   get:
 *     summary: Lista médicos por especialidad
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Médicos filtrados
 */
router.get('/especialidad/:id_especialidad',
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    medicosControlador.buscarPorEspecialidad
);

/**
 * @swagger
 * /medicos/{id_medico}:
 *   get:
 *     summary: Obtener médico por ID
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del médico
 *       404:
 *         description: Médico no encontrado
 */
router.get('/:id_medico',
    [
        param('id_medico', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    medicosControlador.buscarPorId
);

/**
 * @swagger
 * /medicos/{id_medico}:
 *   put:
 *     summary: Modificar médico (Admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_medico
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
 *               id_especialidad:
 *                 type: integer
 *               matricula:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               valor_consulta:
 *                 type: number
 *     responses:
 *       200:
 *         description: Médico modificado
 *       404:
 *         description: Médico no encontrado
 */
router.put('/:id_medico',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_medico', 'El parámetro debe ser entero').isInt(),
        check('id_especialidad').optional().isInt().withMessage('Debe ser entero.'),
        check('matricula').optional().isInt().withMessage('Debe ser entero.'),
        check('descripcion').optional().isString().withMessage('Debe ser texto.'),
        check('valor_consulta').optional().isDecimal().withMessage('Debe ser decimal.'),
        validarCampos
    ],
    medicosControlador.modificar
);

/**
 * @swagger
 * /medicos/{id_medico}/obras-sociales:
 *   post:
 *     summary: Asociar obras sociales a un médico (Admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_medico
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
 *               obras_sociales:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_obra_social:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Relaciones creadas
 *       400:
 *         description: Error al crear relaciones
 */
router.post('/:id_medico/obras-sociales',
    [
        passport.authenticate('jwt', { session: false }),
        validarRoles(3),
        param('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.')
            .isInt().withMessage('El id_medico debe ser un número entero.'),
        check('obras_sociales')
            .isArray().withMessage('obras_sociales debe ser un array.')
            .notEmpty().withMessage('obras_sociales no puede estar vacío.'),
        check('obras_sociales.*.id_obra_social')
            .notEmpty().withMessage('Cada obra social debe tener id_obra_social.')
            .isInt().withMessage('id_obra_social debe ser un número entero.'),
        validarCampos
    ],
    transformarDTO.medicosAsociarDTO,
    medicosControlador.asociarMedicoObrasSociales
);

/**
 * @swagger
 * /medicos/{id_medico}/obras-sociales:
 *   get:
 *     summary: Listar obras sociales de un médico
 *     tags: [Médicos]
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obras sociales del médico
 */
router.get('/:id_medico/obras-sociales',
    [
        param('id_medico', 'El parámetro debe ser entero').isInt(),
        validarCampos
    ],
    medicosControlador.listarObrasSociales
);

export { router };
