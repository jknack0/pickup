/**
 * Payment-related constants for fees, limits, and policies.
 * These values are used across payment processing logic.
 */

/** Platform fee as a decimal (5%) */
export const PLATFORM_FEE_RATE = 0.05;

/** Stripe processing fee as a decimal (2.9%) */
export const STRIPE_FEE_RATE = 0.029;

/** Stripe fixed fee in cents ($0.30) */
export const STRIPE_FIXED_FEE_CENTS = 30;

/** Minimum hours before event start to allow refunds */
export const REFUND_CUTOFF_HOURS = 24;

/**
 * Calculate the platform fee amount for a given price.
 * @param priceInCents - The price in cents
 * @returns The platform fee in cents (rounded)
 */
export const calculatePlatformFee = (priceInCents: number): number =>
    Math.round(priceInCents * PLATFORM_FEE_RATE);

/**
 * Calculate the Stripe fee amount for a given price.
 * @param amountInCents - The amount in cents
 * @returns The Stripe fee in cents (percentage + fixed fee, rounded)
 */
export const calculateStripeFee = (amountInCents: number): number =>
    Math.round(amountInCents * STRIPE_FEE_RATE) + STRIPE_FIXED_FEE_CENTS;

/**
 * Calculate the refund amount after deducting Stripe and platform fees.
 * @param originalAmountInCents - The original payment amount in cents
 * @returns The refund amount in cents
 */
export const calculateRefundAmount = (originalAmountInCents: number): number => {
    const stripeFee = calculateStripeFee(originalAmountInCents);
    const platformFee = calculatePlatformFee(originalAmountInCents);
    return originalAmountInCents - stripeFee - platformFee;
};

/** Transaction types */
export enum TransactionType {
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND',
}

/** Transaction statuses */
export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}
