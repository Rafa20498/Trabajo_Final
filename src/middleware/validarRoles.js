const validarRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            return res.status(500).json({ estado: false, mensaje: 'Se requiere validar el rol primero' });
        }
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ estado: false, mensaje: 'No tiene permisos para esta acción' });
        }
        next();
    };
};

export default validarRoles;
