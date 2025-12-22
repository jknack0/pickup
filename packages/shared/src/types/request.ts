import type { Request } from 'express';

/**
 * Extended Express Request with authenticated user information.
 * Used by middleware and controllers after authentication.
 */
export interface AuthRequest extends Request {
    user?: {
        id: string;
        [key: string]: unknown; // Allow additional user properties from populate
    };
}
