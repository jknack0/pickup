import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/User.js';
import { RegisterInput, LoginInput } from '@pickup/shared';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { AppError } from '@/middleware/error.middleware.js';

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
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

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-origin (if separate domains)
  });

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

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.json({
    message: 'Logged in successfully',
    user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
});

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

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
