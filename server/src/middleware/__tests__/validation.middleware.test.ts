import { Request, Response } from 'express';
import { validate } from '@/middleware/validation.js';
import { z } from 'zod';

describe('Validation Middleware', () => {
  const schema = z.object({
    name: z.string().min(3),
    email: z.string().email().optional(),
  });

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {}, method: 'POST' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Valid Payloads', () => {
    it('should call next() for valid payload', () => {
      req.body = { name: 'ValidName' };
      validate(schema)(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(); // No error passed
    });

    it('should call next() for valid payload with optional fields', () => {
      req.body = { name: 'ValidName', email: 'test@example.com' };
      validate(schema)(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('Invalid Payloads', () => {
    it('should return 400 for payload with field too short', () => {
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

    it('should return 400 for missing required field', () => {
      req.body = {}; // Missing 'name'
      validate(schema)(req as Request, res as Response, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid email format', () => {
      req.body = { name: 'ValidName', email: 'not-an-email' };
      validate(schema)(req as Request, res as Response, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.errors.some((e: { path: string[] }) => e.path.includes('email'))).toBe(true);
    });

    it('should return multiple errors for multiple invalid fields', () => {
      req.body = { name: 'No', email: 'bad' }; // Both invalid
      validate(schema)(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('OPTIONS Bypass', () => {
    it('should skip validation for OPTIONS requests', () => {
      req.method = 'OPTIONS';
      req.body = {}; // Invalid but should be skipped
      validate(schema)(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Non-Zod Errors', () => {
    it('should pass non-Zod errors to next()', () => {
      const badSchema = {
        parse: () => {
          throw new Error('Non-Zod error');
        },
      };
      req.body = { name: 'ValidName' };
      validate(badSchema)(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
