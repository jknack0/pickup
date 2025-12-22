import express from 'express';
import {
  onboardOrganizer,
  checkOnboardingStatus,
  createCheckoutSession,
  verifyPayment,
} from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { CheckoutSessionSchema, VerifyPaymentSchema } from '@pickup/shared';

const router = express.Router();

// Onboarding
router.post('/connect/onboard', authenticate, onboardOrganizer);
router.get('/connect/status', authenticate, checkOnboardingStatus);

// Payment
router.post(
  '/checkout-session',
  authenticate,
  validate(CheckoutSessionSchema),
  createCheckoutSession,
);
router.post('/verify', authenticate, validate(VerifyPaymentSchema), verifyPayment);

export default router;
