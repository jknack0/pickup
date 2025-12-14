import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

// Using any for schema to avoid "Types have separate declarations of a private property"
// issue when importing Zod schemas from a shared package with its own node_modules
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
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
