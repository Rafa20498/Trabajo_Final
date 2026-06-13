import MedicosServicio from '../servicios/medicosServicio.js';

export default class MedicosControlador {
    constructor() {
        this.medicos = new MedicosServicio();
    }

    buscarTodos = async (req, res) => {
        try {
            const medicos = await this.medicos.buscarTodos();
            res.status(200).json({
                estado: true,
                mensaje: 'Médicos encontrados.',
                medicos
            });
        } catch (error) {
            console.log(`Error en GET /medicos ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const medico = await this.medicos.buscarPorId(req.params.id_medico);
            if (!medico) {
                return res.status(404).json({ estado: false, mensaje: 'Médico no encontrado' });
            }
            res.status(200).json({ estado: true, medico });
        } catch (error) {
            console.log(`Error en GET /medicos/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    buscarPorEspecialidad = async (req, res) => {
        try {
            const medicos = await this.medicos.buscarPorEspecialidad(req.params.id_especialidad);
            res.status(200).json({ estado: true, medicos });
        } catch (error) {
            console.log(`Error en GET /medicos/especialidad/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    modificar = async (req, res) => {
        try {
            const filas = await this.medicos.modificar(req.params.id_medico, req.body);
            if (filas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Médico no encontrado' });
            }
            res.status(200).json({ estado: true, mensaje: 'Médico modificado' });
        } catch (error) {
            console.log(`Error en PUT /medicos/:id: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    asociarMedicoObrasSociales = async (req, res) => {
        try {
            const { id_medico, obras_sociales } = req.dto;
            const relacion = await this.medicos.asociarMedicoObrasSociales(id_medico, obras_sociales);
            if (!relacion) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'No se crearon las relaciones'
                });
            }
            res.status(201).json({
                estado: 'ok',
                mensaje: 'Médico y obras sociales relacionadas'
            });
        } catch (error) {
            console.log(`Error en POST /medicos/obras-sociales ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno.' });
        }
    }

    listarObrasSociales = async (req, res) => {
        try {
            const obras = await this.medicos.listarObrasSociales(req.params.id_medico);
            res.status(200).json({ estado: true, obras_sociales: obras });
        } catch (error) {
            console.log(`Error en GET /medicos/:id/obras-sociales: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
}
