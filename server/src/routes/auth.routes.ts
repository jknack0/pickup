import { Router } from 'express';
import { register, login, logout, getMe } from '@/controllers/auth.controller.js';
import { authenticate } from '@/middleware/auth.js';
import { validate } from '@/middleware/validation.js';
import { registerSchema, loginSchema } from '@pickup/shared';

// Force schema refresh
const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
