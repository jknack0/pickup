import client from './client';

export const onboardOrganizer = () => client.post('/payments/connect/onboard');
export const getOnboardingStatus = () => client.get('/payments/connect/status');
export const createCheckoutSession = (eventId: string, positions?: string[]) =>
  client.post('/payments/checkout-session', { eventId, positions });
