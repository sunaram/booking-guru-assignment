// src/app.ts
import express, { type NextFunction, type Request, type Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import pollutionRouter from './route/pollution.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI setup - only in dev environment
if (process.env.NODE_ENV === 'dev') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

// since we have only one endpoint which is in pollution.route.ts
app.use('/', pollutionRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Booking Guru!');
});

// error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    // ideally handle errors based on their type
    // log error here
    console.error(err);
    // send error response
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});