import express from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import AuthControlador from '../../controladores/authControlador.js';
import { validarCampos } from '../../middleware/validarCampos.js';
import upload from '../../middleware/subirArchivo.js';

const router = express.Router();
const auth = new AuthControlador();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', [
    body('email', 'El email es obligatorio').isEmail(),
    body('contrasenia', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], auth.login);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: Token requerido
 */
router.get('/perfil', passport.authenticate('jwt', { session: false }), auth.perfil);

/**
 * @swagger
 * /auth/foto:
 *   post:
 *     summary: Subir foto de perfil
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto subida correctamente
 *       400:
 *         description: Debe seleccionar una imagen
 */
router.post('/foto', passport.authenticate('jwt', { session: false }), upload.single('foto'), auth.subirFoto);



export { router };
