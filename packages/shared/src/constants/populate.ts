/**
 * Constants for Mongoose populate operations.
 * Centralizes field selections for user data across queries.
 */

/** Public user fields to include when populating user references */
export const USER_PUBLIC_FIELDS = 'firstName lastName email';

/** Populate options for event organizer */
export const ORGANIZER_POPULATE = {
    path: 'organizer',
    select: USER_PUBLIC_FIELDS,
};

/** Populate options for event attendees */
export const ATTENDEES_POPULATE = {
    path: 'attendees.user',
    select: USER_PUBLIC_FIELDS,
};
