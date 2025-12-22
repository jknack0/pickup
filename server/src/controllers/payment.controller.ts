import { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../utils/stripe.js';
import User, { IUser } from '../models/User.js';
import logger from '../utils/logger.js';
import {
  IAttendee,
  AuthRequest,
  calculatePlatformFee,
  calculateRefundAmount,
  REFUND_CUTOFF_HOURS,
  TransactionType,
  TransactionStatus,
  AttendeeStatus,
} from '@pickup/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/error.middleware.js';

// Lazy model loaders to avoid circular dependency issues
// These are used instead of static imports because payment.controller.ts is imported
// by event.controller.ts which imports Event model, creating a circular dependency
const getEventModel = async () => (await import('../models/Event.js')).default;
const getTransactionModel = async () => (await import('../models/Transaction.js')).default;

// 1. Onboard Organizer
export const onboardOrganizer = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if user already has a stripe account
  let accountId = user.stripeAccountId;

  if (!accountId) {
    // Create a Standard or Express account. Standard is best for "Organizer" who manages their own dashboard.
    const account = await stripe.accounts.create({
      type: 'standard',
      email: user.email,
      business_type: 'individual',
      business_profile: {
        name: `${user.firstName} ${user.lastName}`,
      },
    });
    accountId = account.id;
    user.stripeAccountId = accountId;
    await user.save();
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  // Create Account Link
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${clientUrl}/profile?stripe_refresh=true`,
    return_url: `${clientUrl}/profile?stripe_return=true`,
    type: 'account_onboarding',
  });

  res.json({ url: accountLink.url });
});

// 2. Check Onboarding Status
export const checkOnboardingStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await User.findById(userId);
  if (!user || !user.stripeAccountId) {
    return res.json({ onboardingComplete: false, chargesEnabled: false, payoutsEnabled: false });
  }

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  const onboardingComplete = account.details_submitted;
  const chargesEnabled = account.charges_enabled;
  const payoutsEnabled = account.payouts_enabled;

  // Update local DB if changed
  if (user.stripeOnboardingComplete !== onboardingComplete) {
    user.stripeOnboardingComplete = onboardingComplete;
    await user.save();
  }

  res.json({
    onboardingComplete,
    chargesEnabled,
    payoutsEnabled,
    accountId: user.stripeAccountId,
  });
});

// 3. Create Checkout Session
export const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  const { eventId, positions } = req.body;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const EventModel = await getEventModel();
  const event = await EventModel.findById(eventId).populate('organizer');

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  if (!event.isPaid || !event.price) {
    throw new AppError('This event is free, use regular join', 400);
  }

  // Cast organizer to IUser since it was populated
  const organizer = event.organizer as unknown as IUser;
  if (!organizer.stripeAccountId || !organizer.stripeOnboardingComplete) {
    throw new AppError('Organizer cannot accept payments yet', 400);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: event.currency || 'usd',
          unit_amount: event.price, // Amount in cents
          product_data: {
            name: `Ticket for ${event.title}`,
            description: event.description ? event.description.substring(0, 200) : undefined,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: calculatePlatformFee(event.price),
      transfer_data: {
        destination: organizer.stripeAccountId,
      },
    },
    metadata: {
      userId,
      eventId,
      type: 'EVENT_JOIN',
      ...(positions && { positions: JSON.stringify(positions) }),
    },
    success_url: `${process.env.CLIENT_URL}/events/${eventId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/events/${eventId}`,
  });

  res.json({ sessionId: session.id, url: session.url });
});

// 4. Webhook Handler (Exported separately for raw body usage)
// NOTE: This handler intentionally uses manual try/catch because:
// 1. It needs to verify Stripe signatures with raw body
// 2. It should always return 200 to Stripe after signature verification passes
// 3. Internal errors during processing should be logged but not returned to Stripe
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send('Webhook Error: Missing signature or secret');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${(err as Error).message}`);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type === 'EVENT_JOIN') {
      const { userId, eventId, positions } = session.metadata;

      try {
        // Add user to event
        const EventModel = await getEventModel();
        const eventDoc = await EventModel.findById(eventId);
        const TransactionModel = await getTransactionModel();

        if (eventDoc) {
          // Check if already joined
          const attending = eventDoc.attendees.some((a) => a.user.toString() === userId);
          if (!attending) {
            const newAttendee = {
              user: userId,
              status: AttendeeStatus.YES,
              positions: positions ? JSON.parse(positions) : [],
              joinedAt: new Date(),
            };
            eventDoc.attendees.push(newAttendee as unknown as IAttendee);
            await eventDoc.save();
          }
        }

        // Record Transaction
        await TransactionModel.create({
          userId,
          eventId,
          stripePaymentIntentId: session.payment_intent as string,
          amount: session.amount_total || 0,
          type: TransactionType.PAYMENT,
          status: TransactionStatus.SUCCEEDED,
        });
      } catch (err) {
        logger.error('Error processing webhook event join:', err);
      }
    }
  }

  res.json({ received: true });
};

// 5. Verify Payment (Fallback for frontend)
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    throw new AppError('Payment not completed', 400);
  }

  if (session.metadata?.type !== 'EVENT_JOIN') {
    throw new AppError('Invalid session type', 400);
  }

  const { eventId, positions } = session.metadata;

  // Add user to event
  const EventModel = await getEventModel();
  const eventDoc = await EventModel.findById(eventId);
  const TransactionModel = await getTransactionModel();

  if (!eventDoc) {
    throw new AppError('Event not found', 404);
  }

  // Check if already joined
  const attending = eventDoc.attendees.some((a) => a.user.toString() === userId);
  if (!attending) {
    const newAttendee = {
      user: userId,
      status: AttendeeStatus.YES,
      positions: positions ? JSON.parse(positions) : [],
      joinedAt: new Date(),
    };
    eventDoc.attendees.push(newAttendee as unknown as IAttendee);
    await eventDoc.save();
  }

  // Record Transaction (Idempotent check)
  const existingTransaction = await TransactionModel.findOne({
    stripePaymentIntentId: session.payment_intent as string,
  });

  if (!existingTransaction) {
    await TransactionModel.create({
      userId,
      eventId,
      stripePaymentIntentId: session.payment_intent as string,
      amount: session.amount_total || 0,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.SUCCEEDED,
    });
  }

  res.json({ message: 'Payment verified successfully', verified: true });
});

// Refund result type for consumer use
export interface RefundResult {
  refunded: true;
  amount: number; // In cents
  currency: string;
  stripeRefundId: string;
}

// 6. Process Refund (Internal)
// Returns RefundResult if refund processed, null if no payment to refund
export const processRefund = async (
  userId: string,
  eventId: string,
): Promise<RefundResult | null> => {
  const TransactionModel = await getTransactionModel();
  const EventModel = await getEventModel();
  const event = await EventModel.findById(eventId);

  if (!event) throw new Error('Event not found');

  // Check refund window
  const now = new Date();
  const eventDate = new Date(event.date);
  const hoursDiff = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursDiff < REFUND_CUTOFF_HOURS) {
    throw new Error(`Too late to refund (less than ${REFUND_CUTOFF_HOURS}h before event)`);
  }

  const transaction = await TransactionModel.findOne({
    userId,
    eventId,
    type: TransactionType.PAYMENT,
    status: TransactionStatus.SUCCEEDED,
  });

  if (!transaction || !transaction.stripePaymentIntentId) {
    return null; // No payment to refund
  }

  // Calculate Refund Amount using centralized fee constants
  const refundAmount = calculateRefundAmount(transaction.amount);

  if (refundAmount <= 0) {
    throw new Error('Refund amount is zero or negative after fees');
  }

  // Process Refund
  const refund = await stripe.refunds.create({
    payment_intent: transaction.stripePaymentIntentId,
    amount: refundAmount,
    reverse_transfer: true,
    refund_application_fee: false,
  });

  // Record Refund Transaction
  await TransactionModel.create({
    userId,
    eventId,
    stripeRefundId: refund.id,
    amount: refundAmount,
    type: TransactionType.REFUND,
    status: TransactionStatus.SUCCEEDED,
  });

  transaction.status = TransactionStatus.REFUNDED;
  await transaction.save();

  // Return structured refund details for consumer use
  return {
    refunded: true,
    amount: refundAmount,
    currency: event.currency || 'usd',
    stripeRefundId: refund.id,
  };
};
