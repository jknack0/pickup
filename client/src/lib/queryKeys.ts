/**
 * Centralized query keys for React Query.
 * Using a factory pattern ensures type safety and prevents typos.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

export const queryKeys = {
  /**
   * User/auth related queries
   */
  user: {
    me: ['me'] as const,
  },

  /**
   * Event related queries
   */
  events: {
    all: ['events'] as const,
    mine: () => [...queryKeys.events.all, 'mine'] as const,
    detail: (id: string) => ['event', id] as const,
  },
} as const;

// Type helpers for use in hooks
export type UserQueryKey = (typeof queryKeys.user)[keyof typeof queryKeys.user];
export type EventsQueryKey = ReturnType<(typeof queryKeys.events)['mine']>;
export type EventDetailQueryKey = ReturnType<(typeof queryKeys.events)['detail']>;
