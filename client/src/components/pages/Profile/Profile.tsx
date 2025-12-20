import React, { useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useUser } from '@/hooks/useAuth';
import ConnectStripe from '@/components/molecules/ConnectStripe';
import { useSearchParams } from 'react-router-dom';
import { useStripeStatus } from '@/hooks/usePayment';
import { useSnackbar } from 'notistack';

const Profile: React.FC = () => {
  const { data: userData } = useUser();
  const user = userData?.user;
  const [searchParams] = useSearchParams();
  const { refetch } = useStripeStatus();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (searchParams.get('stripe_return')) {
      refetch().then(() => {
        enqueueSnackbar('Stripe onboarding completed (or updated).', { variant: 'info' });
      });
    }
    if (searchParams.get('stripe_refresh')) {
      enqueueSnackbar('Stripe onboarding was interrupted. Please try again.', {
        variant: 'warning',
      });
    }
  }, [searchParams, refetch, enqueueSnackbar]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Personal Information</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            <strong>Name:</strong> {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user?.email}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <ConnectStripe />
      </Paper>
    </Container>
  );
};

export default Profile;
