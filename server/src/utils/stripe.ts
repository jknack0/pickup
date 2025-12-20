import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars if not already loaded (safeguard)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
  // We don't throw here to avoid crashing dev if not using payments, but warn.
  // In production, this should probably crash.
  console.warn('STRIPE_SECRET_KEY is not defined in environment variables.');
}

export const stripe = new Stripe(apiKey || '', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2025-12-15.clover' as any, // Cast to avoid strict check
  typescript: true,
});
