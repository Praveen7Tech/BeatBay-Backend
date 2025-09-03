// src/app.ts
import express, { type Application } from 'express';
import exampleRoutes from './routes/exampleRoutes';

const app: Application = express();

// Use your imported route file
app.use('/api', exampleRoutes);

// Export the application for use by your server file
export default app;
