import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/User.js';
import {
  RegisterInput,
  LoginInput,
  AuthRequest,
  JWT_EXPIRY_STRING,
  getCookieOptions,
  getExpiredCookieOptions,
} from '@pickup/shared';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { AppError } from '@/middleware/error.middleware.js';

const isProduction = process.env.NODE_ENV === 'production';

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: JWT_EXPIRY_STRING,
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, dateOfBirth } = req.body as RegisterInput;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Create user
  const user = new User({ email, passwordHash: password, firstName, lastName, dateOfBirth });
  await user.save();

  const token = generateToken(user._id.toString());

  res.cookie('token', token, getCookieOptions(isProduction));

  res.status(201).json({
    message: 'User registered successfully',
    user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id.toString());

  res.cookie('token', token, getCookieOptions(isProduction));

  res.json({
    message: 'Logged in successfully',
    user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', '', getExpiredCookieOptions(isProduction));
  res.json({ message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ user });
});
