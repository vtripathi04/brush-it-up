import express from 'express';
import cors from 'cors';
import parseRoutes from './routes/parseRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/parse', parseRoutes);
app.use(errorHandler);

export default app;
