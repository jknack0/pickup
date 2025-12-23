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

  /**
   * Group related queries
   */
  groups: {
    all: ['groups'] as const,
    mine: () => [...queryKeys.groups.all, 'mine'] as const,
    public: (params?: { search?: string; limit?: number; offset?: number }) =>
      [...queryKeys.groups.all, 'public', params] as const,
    detail: (id: string) => ['group', id] as const,
    events: (id: string) => ['group', id, 'events'] as const,
  },
} as const;

// Type helpers for use in hooks
export type UserQueryKey = (typeof queryKeys.user)[keyof typeof queryKeys.user];
export type EventsQueryKey = ReturnType<(typeof queryKeys.events)['mine']>;
export type EventDetailQueryKey = ReturnType<(typeof queryKeys.events)['detail']>;
export type GroupsQueryKey = ReturnType<(typeof queryKeys.groups)['mine']>;
export type GroupDetailQueryKey = ReturnType<(typeof queryKeys.groups)['detail']>;
