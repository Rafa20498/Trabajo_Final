import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gestión de Turnos Médicos',
            version: '1.0.0',
            description: 'API para la gestión de turnos médicos con roles de Médico, Paciente y Administrador'
        },
        servers: [
            { url: `http://localhost:${process.env.PUERTO || 3000}/api/v1`, description: 'Servidor de desarrollo' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenido del login (Authorization: Bearer <token>)'
                }
            }
        }
    },
    apis: ['./src/rutas/v1/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
