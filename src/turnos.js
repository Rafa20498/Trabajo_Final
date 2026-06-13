import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';

import { estrategia, validacion } from './config/passport.js';

import { router as v1EspecialidadesRutas } from './rutas/v1/especialidadesRutas.js';
import { router as v1AuthRutas } from './rutas/v1/authRutas.js';
import { router as v1MedicosRutas } from './rutas/v1/medicosRutas.js';
import { router as v1PacientesRutas } from './rutas/v1/pacientesRutas.js';
import { router as v1ObrasSocialesRutas } from './rutas/v1/obrasSocialesRutas.js';
import { router as v1TurnosRutas } from './rutas/v1/turnosReservasRutas.js';
import { router as v1EstadisticasRutas } from './rutas/v1/estadisticasRutas.js';
import { router as v1ReportesRutas } from './rutas/v1/reportesRutas.js';
import { testConexion } from './db/test_conection.js';
import { crearProcedimientos } from './db/crearProcedimientos.js';
import { swaggerSpec } from './docs/swagger.js';

process.loadEnvFile();

const app = express();

await testConexion();
await crearProcedimientos();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('src/uploads'));

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.status(200).send({ estado: true, mensaje: 'API OK' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', v1AuthRutas);
app.use('/api/v1/especialidades', v1EspecialidadesRutas);
app.use('/api/v1/medicos', v1MedicosRutas);
app.use('/api/v1/pacientes', v1PacientesRutas);
app.use('/api/v1/obras-sociales', v1ObrasSocialesRutas);
app.use('/api/v1/turnos', v1TurnosRutas);
app.use('/api/v1/estadisticas', v1EstadisticasRutas);
app.use('/api/v1/reportes', v1ReportesRutas);

app.use((req, res) => {
    res.status(404).json({ estado: false, mensaje: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ estado: false, mensaje: 'Error interno del servidor' });
});

export default app;
