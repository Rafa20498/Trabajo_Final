import passport from 'passport';
import generarJWT from '../helpers/generarJWT.js';
import Usuarios from '../db/usuarios.js';

export default class AuthControlador {
    constructor() {
        this.usuarios = new Usuarios();
    }


    login = (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, usuario, info) => {
            if (err) return next(err);
            if (!usuario) return res.status(401).json(info);
            generarJWT(usuario.id_usuario, usuario.rol).then(token => {
                res.status(200).json({
                    estado: true,
                    mensaje: info.mensaje,
                    token,
                    usuario: usuario.usuario
                });
            }).catch(next);
        })(req, res, next);
    }

    perfil = async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ estado: false, mensaje: 'No autenticado' });
            }
            res.status(200).json({ estado: true, usuario: req.user });
        } catch (error) {
            next(error);
        }
    }

    subirFoto = async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ estado: false, mensaje: 'Debe seleccionar una imagen' });
            }
            const foto_path = '/uploads/' + req.file.filename;
            await this.usuarios.actualizarFoto(req.user.id_usuario, foto_path);
            res.status(200).json({ estado: true, mensaje: 'Foto subida correctamente', foto_path });
        } catch (error) {
            next(error);
        }
    }
}
