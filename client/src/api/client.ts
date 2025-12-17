import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL, // Adjust for prod
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

import type { CreateEventInput } from '@pickup/shared';

export const createEvent = (data: CreateEventInput) => api.post('/events', data);
export const getMyEvents = () => api.get('/events/mine');
export const getEvent = (id: string) => api.get(`/events/${id}`);
export const joinEvent = (id: string, positions?: string[]) =>
  api.post(`/events/${id}/join`, { positions });
export const updateRSVP = (id: string, status: string) =>
  api.patch(`/events/${id}/rsvp`, { status });

export default api;
