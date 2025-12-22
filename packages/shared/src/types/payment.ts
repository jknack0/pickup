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

/** Reason why a refund was not processed */
export type RefundReason = 'past_deadline' | 'no_payment' | 'zero_amount';

/**
 * Refund information returned to client after leaving a paid event.
 * Used in leaveEvent API response.
 */
export interface RefundInfo {
    refunded: boolean;
    /** Refund amount in cents (only present if refunded) */
    amount?: number;
    /** Currency code (e.g., 'usd') */
    currency?: string;
    /** Reason if refund was not processed */
    reason?: RefundReason;
}

