/**
 * Authentication-related constants for JWT, cookies, and sessions.
 */

/** JWT token expiry in days */
export const JWT_EXPIRY_DAYS = 7;

/** JWT token expiry in milliseconds */
export const JWT_EXPIRY_MS = JWT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/** JWT token expiry string for jsonwebtoken library */
export const JWT_EXPIRY_STRING = `${JWT_EXPIRY_DAYS}d`;

/**
 * Get cookie options for authentication tokens.
 * @param isProduction - Whether the app is running in production
 * @param maxAge - Optional max age in milliseconds (defaults to JWT_EXPIRY_MS)
 */
export const getCookieOptions = (isProduction: boolean, maxAge: number = JWT_EXPIRY_MS) => ({
    httpOnly: true,
    secure: isProduction,
    maxAge,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
});

/**
 * Get expired cookie options for logout.
 * @param isProduction - Whether the app is running in production
 */
export const getExpiredCookieOptions = (isProduction: boolean) => ({
    httpOnly: true,
    secure: isProduction,
    expires: new Date(0),
});
