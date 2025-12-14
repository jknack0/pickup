import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '@/utils/logger.js';

interface AnyZodSchema {
  parse(data: unknown): unknown;
}

export const validate =
  (schema: AnyZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return next();
    }
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error', error.issues);
        res.status(400).json({ errors: error.issues });
      } else {
        next(error);
      }
    }
  };
