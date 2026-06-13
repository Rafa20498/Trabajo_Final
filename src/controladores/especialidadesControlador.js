import EspecialidadesServicio from '../servicios/especialidadesServicio.js';

export default class EspecialidadesControlador {
    constructor() {
        this.especialidades = new EspecialidadesServicio();
    }

    buscarTodas = async (req, res) => {
        try {
            const especialidades = await this.especialidades.buscarTodas();
            res.status(200).json({
                estado: true,
                especialidades
            });
        } catch (error) {
            console.log(`Error en GET /especialidades ${error}`);
            res.status(500).json({
                estado: false,
                mensaje: 'Error interno'
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const { id_especialidad } = req.params;
            const especialidad = await this.especialidades.buscarPorId(id_especialidad);
            if (!especialidad) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Especialidad no encontrada'
                });
            }
            res.status(200).json({
                estado: true,
                especialidad
            });
        } catch (error) {
            console.log(`Error en GET /especialidades/:id ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    crear = async (req, res) => {
        try {
            const id = await this.especialidades.crear(req.dto);
            res.status(201).json({
                estado: true,
                mensaje: 'Especialidad creada',
                id_especialidad: id
            });
        } catch (error) {
            console.log(`Error en POST /especialidades ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    modificar = async (req, res) => {
        try {
            const { id_especialidad } = req.params;
            const filas = await this.especialidades.modificar(id_especialidad, req.dto);
            if (filas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Especialidad no encontrada' });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Especialidad modificada'
            });
        } catch (error) {
            console.log(`Error en PUT /especialidades/:id ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }

    eliminar = async (req, res) => {
        try {
            const { id_especialidad } = req.params;
            const filas = await this.especialidades.eliminar(id_especialidad);
            if (filas === 0) {
                return res.status(404).json({ estado: false, mensaje: 'Especialidad no encontrada' });
            }
            res.status(200).json({
                estado: true,
                mensaje: 'Especialidad eliminada'
            });
        } catch (error) {
            console.log(`Error en DELETE /especialidades/:id ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
}
