import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory (../../.env relative to src/index.ts)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import logger early for startup messages
import logger from '@/utils/logger.js';

logger.info('[Startup] Starting server...');
logger.info(`[Startup] NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`[Startup] PORT: ${process.env.PORT}`);
logger.info(`[Startup] MONGODB_URI provided: ${!!process.env.MONGODB_URI}`);

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from '@/routes/auth.routes.js';
import eventRoutes from '@/routes/event.routes.js';
import paymentRoutes from '@/routes/payment.routes.js';

import { requestLogger } from '@/middleware/requestLogger.js';

const app = express();
const port = process.env.PORT || 3000;

logger.info(`[Startup] Port configured: ${port}`);

app.use(
  cors({
    origin: true, // Automatically reflect the request origin
    credentials: true, // Allow cookies
  }),
);

// Stripe Webhook (Must be before express.json() to get raw body)
import { handleStripeWebhook } from '@/controllers/payment.controller.js';
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);

import { errorHandler } from '@/middleware/error.middleware.js';
app.use(errorHandler);

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  logger.info(`[Startup] Serving static files from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

logger.info('[Startup] Connecting to MongoDB...');
mongoose
  .connect(process.env.MONGODB_URI as string, {
    serverSelectionTimeoutMS: 30000, // Increase timeout for Cloud Run cold starts
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    logger.info('[Startup] Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('[Startup] Failed to connect to MongoDB', err);
  });

logger.info(`[Startup] About to start listening on port ${port}`);
const server = app.listen(Number(port), '0.0.0.0', () => {
  logger.info(`[Startup] Server is now listening on http://0.0.0.0:${port}`);
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
