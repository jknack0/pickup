import { z } from 'zod';

// Schema for creating a checkout session
export const CheckoutSessionSchema = z.object({
    eventId: z.string().min(1, 'Event ID is required'),
    positions: z.array(z.string()).optional(),
});

export type CheckoutSessionInput = z.infer<typeof CheckoutSessionSchema>;

// Schema for verifying a payment
export const VerifyPaymentSchema = z.object({
    sessionId: z.string().min(1, 'Session ID is required'),
});

export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
