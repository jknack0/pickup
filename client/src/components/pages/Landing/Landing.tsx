import { Box } from '@atoms/Box';
import { Container } from '@atoms/Container';
import { Typography } from '@atoms/Typography';
import { Button } from '@atoms/Button';
import { useNavigate } from 'react-router-dom';
import { HomeLayout } from '@templates/HomeLayout';
import { Paper } from '@mui/material';

import paymentIcon from '@assets/payment-feature.png';
import teamsIcon from '@assets/teams-feature.png';
import facilityIcon from '@assets/facility-feature.png';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <HomeLayout>
      {/* Hero Section */}
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 800, color: 'text.primary', mb: 3 }}
          >
            Organize Pickup Games <br />
            <Box component="span" sx={{ color: 'primary.main' }}>
              Like a Pro.
            </Box>
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ mb: 5, maxWidth: '600px', mx: 'auto' }}
          >
            Effortlessly collect payments, generate balanced teams, and organize your rentals. The
            all-in-one platform for the modern pickup game organizer.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}
          >
            {[
              {
                title: 'Easy Payments',
                desc: 'Handle transactions directly in the app. No more headaches trying to figure out who’s paid or not.',
                icon: paymentIcon,
              },
              {
                title: 'Group Events',
                desc: "Easily create and manage your group's events. Schedule games, track attendance, and keep everyone in the loop.",
                icon: teamsIcon,
              },
              {
                title: 'Find & Rent Courts',
                desc: 'Seamlessly find, rent, and pay for court time directly in the app.',
                icon: facilityIcon,
              },
            ].map((feature, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{ p: 4, borderRadius: 2, height: '100%', textAlign: 'center' }}
              >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: 'text.primary' }}>
            Ready to elevate your game?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Join thousands of organizers making pickup games easier for everyone.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ px: 6, py: 2, fontSize: '1.2rem', borderRadius: 4 }}
          >
            Get Started for Free
          </Button>
        </Container>
      </Box>
    </HomeLayout>
  );
};
