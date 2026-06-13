import ObrasSocialesServicio from '../servicios/obrasSocialesServicio.js';

export default class ObrasSocialesControlador {
    constructor() {
        this.obrasSociales = new ObrasSocialesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const obras_sociales = await this.obrasSociales.buscarTodas();
            res.status(200).json({ estado: true, obras_sociales });
        } catch (error) {
            console.log(`Error en GET /obras-sociales: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const obra = await this.obrasSociales.buscarPorId(req.params.id_obra_social);
            if (!obra) {
                return res.status(404).json({ estado: false, mensaje: 'Obra social no encontrada' });
            }
            res.status(200).json({ estado: true, obra_social: obra });
        } catch (error) {
            console.log(`Error en GET /obras-sociales/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    crear = async (req, res) => {
        try {
            const id = await this.obrasSociales.crear(req.dto);
            res.status(201).json({ estado: true, mensaje: 'Obra social creada', id_obra_social: id });
        } catch (error) {
            console.log(`Error en POST /obras-sociales: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    modificar = async (req, res) => {
        try {
            const filas = await this.obrasSociales.modificar(req.params.id_obra_social, req.dto);
            if (filas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Obra social no encontrada' });
            }
            res.status(200).json({ estado: true, mensaje: 'Obra social modificada' });
        } catch (error) {
            console.log(`Error en PUT /obras-sociales/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const filas = await this.obrasSociales.eliminar(req.params.id_obra_social);
            if (filas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Obra social no encontrada' });
            }
            res.status(200).json({ estado: true, mensaje: 'Obra social eliminada' });
        } catch (error) {
            console.log(`Error en DELETE /obras-sociales/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
}
