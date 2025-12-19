import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory (../../.env relative to src/index.ts)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import logger from '@/utils/logger.js';
import authRoutes from '@/routes/auth.routes.js';
import eventRoutes from '@/routes/event.routes.js';

import { requestLogger } from '@/middleware/requestLogger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true, // Automatically reflect the request origin
    credentials: true, // Allow cookies
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

import { errorHandler } from '@/middleware/error.middleware.js';
app.use(errorHandler);

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('Failed to connect to MongoDB', err));

const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

const gracefulShutdown = () => {
  logger.info('Received shutdown signal. Closing server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
