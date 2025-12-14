import { Request, Response } from 'express';
import { validate } from '@/middleware/validation.js';
import { z } from 'zod';

describe('Validation Middleware', () => {
  const schema = z.object({
    name: z.string().min(3),
  });

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() for valid payload', () => {
    req.body = { name: 'ValidName' };
    validate(schema)(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // No error passed
  });

  it('should return 400 for invalid payload', () => {
    req.body = { name: 'No' }; // Too short
    validate(schema)(req as Request, res as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
      }),
    );
  });
});
