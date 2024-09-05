const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación de la API',
      version: '1.0.0',
      description: 'Documentación generada por Swagger para la API de productos y carritos.',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a los archivos de rutas que contienen anotaciones Swagger
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
