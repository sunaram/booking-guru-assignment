import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Booking Guru API',
      version: '1.0.0',
      description: 'API for getting pollution data for cities in a country.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ['./src/swagger/pollution.route.ts', './src/swagger/components.ts'], // Paths to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;