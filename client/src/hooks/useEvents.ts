import { useQuery } from '@tanstack/react-query';
import { getMyEvents } from '@api/client';
import type { IEvent } from '@pickup/shared';

export const useMyEvents = () => {
  return useQuery({
    queryKey: ['events', 'mine'],
    queryFn: async () => {
      const { data } = await getMyEvents();
      return data.events as IEvent[];
    },
  });
};
