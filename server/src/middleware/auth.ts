import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '@/models/User.js';
import { AuthRequest } from '@pickup/shared';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.id || decoded.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: String(user._id), ...user.toObject() };
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
