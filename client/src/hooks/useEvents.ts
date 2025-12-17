import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyEvents,
  getEvent,
  createEvent,
  joinEvent,
  updateRSVP,
  cancelEvent,
  removeAttendee,
  addAttendee,
} from '@/api/client';
import type { IEvent, CreateEventInput, AnyData } from '@pickup/shared';

// -- Queries --

export const useMyEvents = () => {
  return useQuery({
    queryKey: ['events', 'mine'],
    queryFn: async () => {
      const { data } = await getMyEvents();
      return data.events as IEvent[];
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await getEvent(id);
      return data.event as IEvent;
    },
    enabled: !!id,
  });
};

// -- Mutations --

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventInput) => createEvent(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['events', 'mine'] });
      // Return data so component can navigate to new event
      return response;
    },
  });
};

export const useJoinEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (positions: string[]) => joinEvent(eventId, positions),
    onSuccess: (responseData) => {
      // Optimistic update or refetch
      // Here we just update the specific event in cache if returned, or invalidate
      if (responseData.data && responseData.data.event) {
        queryClient.setQueryData(['event', eventId], (old: AnyData) => {
          if (!old) return old;
          // If the API returns the full event structure in a consistent way:
          // The controller returns { message, data: { event } } usually?
          // Checking controller: joinEvent returns { message, event }?
          // Let's rely on invalidation or the passed data if we trust it.
          // Controller joinEvent returns: res.json({ message: 'Joined...', event })
          // So responseData.data.event exists.
          return { ...old, data: { ...old.data, event: responseData.data.event } };
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
      queryClient.invalidateQueries({ queryKey: ['events', 'mine'] });
    },
  });
};

export const useUpdateRSVP = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => updateRSVP(eventId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', 'mine'] });
    },
  });
};

export const useCancelEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelEvent(eventId),
    onSuccess: (responseData) => {
      if (responseData.data && responseData.data.event) {
        queryClient.setQueryData(['event', eventId], (old: AnyData) => ({
          ...old,
          data: { ...old.data, event: responseData.data.event },
        }));
      } else {
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
      queryClient.invalidateQueries({ queryKey: ['events', 'mine'] });
    },
  });
};

export const useRemoveAttendee = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeAttendee(eventId, userId),
    onSuccess: (responseData) => {
      if (responseData.data && responseData.data.event) {
        queryClient.setQueryData(['event', eventId], (old: AnyData) => ({
          ...old,
          data: { ...old.data, event: responseData.data.event },
        }));
      } else {
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
    },
  });
};

export const useAddAttendee = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => addAttendee(eventId, email),
    onSuccess: (responseData) => {
      if (responseData.data && responseData.data.event) {
        queryClient.setQueryData(['event', eventId], (old: AnyData) => ({
          ...old,
          data: { ...old.data, event: responseData.data.event },
        }));
      } else {
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
    },
  });
};
