import jwt from 'jsonwebtoken';

const generarJWT = (id_usuario, rol) => {
    return new Promise((resolve, reject) => {
        const payload = { id_usuario, rol };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

export default generarJWT;
