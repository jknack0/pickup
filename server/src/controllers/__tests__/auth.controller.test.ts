import { Request, Response } from 'express';
import { register, login } from '@/controllers/auth.controller.js';
import User from '@/models/User.js';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('@/models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('@/utils/logger'); // Mock logger to suppress logs during tests

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let mockNext: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockNext = jest.fn().mockImplementation((error: unknown) => {
      const err = error as { statusCode?: number; message?: string };
      if (err) {
        statusMock(err.statusCode || 500).json({ message: err.message });
      }
    });

    res = {
      status: statusMock,
      json: jsonMock,
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = mockNext;
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('register', () => {
    it('should create a new user and return user data + token', async () => {
      req.body = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
        dateOfBirth: '1990-01-01',
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

      // Mock the User constructor to return an object with save
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'userid',
        id: 'userid',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
      });
      const mockUserInstance = {
        _id: 'userid',
        id: 'userid',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        save: mockSave,
      };
      (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);

      await register(req as Request, res as Response, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(mockSave).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('token', 'mocktoken', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: { id: 'userid', firstName: 'Test', lastName: 'User', email: 'test@test.com' },
      });
    });

    it('should reject existing email', async () => {
      req.body = { name: 'Test', email: 'existing@test.com', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue({ _id: 'existing' });

      await register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should authenticate valid user', async () => {
      req.body = { email: 'test@test.com', password: 'password' };
      const mockUser = {
        _id: 'userid',
        id: 'userid',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

      await login(req as Request, res as Response, next);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('password');
      expect(res.cookie).toHaveBeenCalledWith('token', 'mocktoken', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged in successfully',
        user: { id: 'userid', firstName: 'Test', lastName: 'User', email: 'test@test.com' },
      });
    });

    it('should reject invalid password', async () => {
      req.body = { email: 'test@test.com', password: 'wrong' };
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
  });
});
