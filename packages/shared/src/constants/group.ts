export const GROUP_CONSTRAINTS = {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    DESC_MAX_LENGTH: 1000,
} as const;

export const GROUP_DEFAULTS = {
    CURRENCY: 'usd',
    PAGE_LIMIT: 20,
} as const;
