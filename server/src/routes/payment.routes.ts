import express from 'express';
import {
  onboardOrganizer,
  checkOnboardingStatus,
  createCheckoutSession,
  verifyPayment,
} from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Onboarding
router.post('/connect/onboard', authenticate, onboardOrganizer);
router.get('/connect/status', authenticate, checkOnboardingStatus);

// Payment
router.post('/checkout-session', authenticate, createCheckoutSession);
router.post('/verify', authenticate, verifyPayment);

export default router;
