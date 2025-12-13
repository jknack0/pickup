import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

// Helper to determine if we are in production or strictly API mode
// For this setup, we'll assume if built frontend exists, we serve it
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('Failed to connect to MongoDB', err));

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
