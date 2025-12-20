import { useQuery, useMutation } from '@tanstack/react-query';
import { onboardOrganizer, getOnboardingStatus, createCheckoutSession } from '@/api/payment';

export const useStripeConnect = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await onboardOrganizer();
      return response.data; // Expect { url: string }
    },
  });
};

export const useStripeStatus = () => {
  return useQuery({
    queryKey: ['stripeStatus'],
    queryFn: async () => {
      const response = await getOnboardingStatus();
      return response.data;
      // Expect { onboardingComplete: boolean, chargesEnabled: boolean, payoutsEnabled: boolean, accountId?: string }
    },
    retry: false,
  });
};

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: async ({ eventId, positions }: { eventId: string; positions?: string[] }) => {
      const response = await createCheckoutSession(eventId, positions);
      return response.data; // Expect { sessionId, url }
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await import('@/api/payment').then((mod) =>
        mod.verifyPayment(sessionId).then((r) => r.data),
      );
      return response;
    },
  });
};
