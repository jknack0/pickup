import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url } = req;

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    logger.info(`Request completed`, {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
