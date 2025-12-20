import { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../utils/stripe.js';
import User, { IUser } from '../models/User.js';
import logger from '../utils/logger.js';
import { IAttendee } from '@pickup/shared';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// 1. Onboard Organizer
export const onboardOrganizer = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
  } catch (error) {
    logger.error('Error onboarding organizer:', error);
    res
      .status(500)
      .json({ message: 'Failed to create onboarding link', error: (error as Error).message });
  }
};

// 2. Check Onboarding Status
export const checkOnboardingStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

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
  } catch (error) {
    logger.error('Error checking Stripe status:', error);
    res.status(500).json({ message: 'Failed to check status' });
  }
};

// 3. Create Checkout Session
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { eventId, positions } = req.body;

    if (!userId || !eventId) return res.status(400).json({ message: 'Missing required fields' });

    const event = await (await import('../models/Event.js')).default
      .findById(eventId)
      .populate('organizer');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!event.isPaid || !event.price) {
      return res.status(400).json({ message: 'This event is free, use regular join' });
    }

    // Cast organizer to IUser since it was populated
    const organizer = event.organizer as unknown as IUser;
    if (!organizer.stripeAccountId || !organizer.stripeOnboardingComplete) {
      return res.status(400).json({ message: 'Organizer cannot accept payments yet' });
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
        application_fee_amount: Math.round(event.price * 0.05), // 5% platform fee
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
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

// 4. Webhook Handler (Exported separately for raw body usage)
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
        const EventModel = (await import('../models/Event.js')).default;
        const eventDoc = await EventModel.findById(eventId);
        const TransactionModel = (await import('../models/Transaction.js')).default;

        if (eventDoc) {
          // Check if already joined
          // Cast 'a.user' to string for comparison or check type
          const attending = eventDoc.attendees.some((a) => a.user.toString() === userId);
          if (!attending) {
            const newAttendee = {
              user: userId,
              status: 'YES', // Or whatever default status
              positions: positions ? JSON.parse(positions) : [],
              joinedAt: new Date(),
            };
            // Use push with unknown cast if needed, or specific type if IAttendee matches Mongoose schema
            // Assuming Mongoose's types are a bit loose with subdocuments pushes of raw objects
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
          type: 'PAYMENT',
          status: 'SUCCEEDED',
        });
      } catch (err) {
        logger.error('Error processing webhook event join:', err);
      }
    }
  }

  res.json({ received: true });
};

// 5. Verify Payment (Fallback for frontend)
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const userId = (req as AuthRequest).user?.id;

    if (!userId || !sessionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    if (session.metadata?.type !== 'EVENT_JOIN') {
      return res.status(400).json({ message: 'Invalid session type' });
    }

    const { eventId, positions } = session.metadata;

    // Add user to event (Reuse logic or copy safely)
    const EventModel = (await import('../models/Event.js')).default;
    const eventDoc = await EventModel.findById(eventId);
    const TransactionModel = (await import('../models/Transaction.js')).default;

    if (!eventDoc) return res.status(404).json({ message: 'Event not found' });

    // Check if already joined
    const attending = eventDoc.attendees.some((a) => a.user.toString() === userId);
    if (!attending) {
      const newAttendee = {
        user: userId,
        status: 'YES',
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
        type: 'PAYMENT',
        status: 'SUCCEEDED',
      });
    }

    res.json({ message: 'Payment verified and verified', verified: true });
  } catch (error) {
    logger.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

// 6. Process Refund (Internal)
export const processRefund = async (userId: string, eventId: string) => {
  const TransactionModel = (await import('../models/Transaction.js')).default;
  const EventModel = (await import('../models/Event.js')).default;
  const event = await EventModel.findById(eventId);

  if (!event) throw new Error('Event not found');

  // Check 24h window
  const now = new Date();
  const eventDate = new Date(event.date);
  const hoursDiff = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursDiff < 24) {
    throw new Error('Too late to refund (less than 24h before event)');
  }

  const transaction = await TransactionModel.findOne({
    userId,
    eventId,
    type: 'PAYMENT',
    status: 'SUCCEEDED',
  });

  if (!transaction || !transaction.stripePaymentIntentId) {
    return; // No payment to refund
  }

  // Calculate Refund Amount
  const stripeFee = Math.round(transaction.amount * 0.029) + 30;
  const platformFee = Math.round(transaction.amount * 0.05);
  const refundAmount = transaction.amount - stripeFee - platformFee;

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
    type: 'REFUND',
    status: 'SUCCEEDED',
  });

  transaction.status = 'REFUNDED';
  await transaction.save();

  return refund;
};
