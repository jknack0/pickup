import React from 'react';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useStripeConnect, useStripeStatus } from '@/hooks/usePayment';

const ConnectStripe: React.FC = () => {
  const { data: status, isLoading, error } = useStripeStatus();
  const { mutate: connect, isPending: isConnecting } = useStripeConnect();

  const handleConnect = () => {
    connect(undefined, {
      onSuccess: (data) => {
        window.location.href = data.url;
      },
    });
  };

  if (isLoading) return <CircularProgress />;

  if (error) {
    return <Alert severity="error">Failed to load payout status.</Alert>;
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payouts & Payments
      </Typography>

      {status?.onboardingComplete ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your Stripe account is connected.
            {status.chargesEnabled && ' You can accept payments.'}
            {status.payoutsEnabled && ' Payouts are enabled.'}
          </Alert>
          {/* Maybe add a button to login to Stripe Dashboard if we had that link, 
               but for standard accounts, they login via Stripe.com directly usually. 
               We could generate a login link if we wanted using the API */}
          <Typography variant="body2" color="textSecondary">
            Account ID: {status.accountId}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" paragraph>
            To organize paid events, you must connect a Stripe account.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Redirecting...' : 'Connect with Stripe'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ConnectStripe;
