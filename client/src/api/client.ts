import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { CreateEventInput, IEvent, RefundInfo } from '@pickup/shared';

const API_URL = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !API_URL) {
  throw new Error('VITE_API_URL is missing in production environment');
}

const baseURL = API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL, // Adjust for prod
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Response Types
interface EventResponse {
  event: IEvent;
}

interface EventsResponse {
  events: IEvent[];
}

interface MessageResponse {
  message: string;
}

interface LeaveEventResponse extends MessageResponse {
  event: IEvent;
  refund: RefundInfo;
}

// Event API Functions with explicit return types
export const createEvent = (data: CreateEventInput): Promise<AxiosResponse<EventResponse>> =>
  api.post('/events', data);

export const getMyEvents = (): Promise<AxiosResponse<EventsResponse>> => api.get('/events/mine');

export const getEvent = (id: string): Promise<AxiosResponse<EventResponse>> =>
  api.get(`/events/${id}`);

export const joinEvent = (
  id: string,
  positions?: string[],
): Promise<AxiosResponse<EventResponse>> => api.post(`/events/${id}/join`, { positions });

export const updateRSVP = (id: string, status: string): Promise<AxiosResponse<EventResponse>> =>
  api.patch(`/events/${id}/rsvp`, { status });

export const cancelEvent = (id: string): Promise<AxiosResponse<EventResponse>> =>
  api.put(`/events/${id}/cancel`);

export const leaveEvent = (id: string): Promise<AxiosResponse<LeaveEventResponse>> =>
  api.post(`/events/${id}/leave`);

export const removeAttendee = (
  eventId: string,
  userId: string,
): Promise<AxiosResponse<EventResponse>> => api.delete(`/events/${eventId}/attendees/${userId}`);

export const addAttendee = (
  eventId: string,
  email: string,
): Promise<AxiosResponse<EventResponse>> => api.post(`/events/${eventId}/attendees`, { email });

export default api;
