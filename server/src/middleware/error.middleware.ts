import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  // Log only 500s or critical errors as 'error', others as 'warn'
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
    });
  } else {
    logger.warn(`${statusCode} - ${message}`, {
      method: req.method,
      url: req.originalUrl,
    });
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
