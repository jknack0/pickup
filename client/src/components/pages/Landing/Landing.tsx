import { Box } from '@atoms/Box';
import { Container } from '@atoms/Container';
import { Typography } from '@atoms/Typography';
import { Button } from '@atoms/Button';
import { useNavigate } from 'react-router-dom';
import { HomeLayout } from '@templates/HomeLayout';
import { Paper, alpha, useTheme } from '@mui/material';

import paymentIcon from '@assets/payment-feature.png';
import teamsIcon from '@assets/teams-feature.png';
import facilityIcon from '@assets/facility-feature.png';

export const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;

  return (
    <HomeLayout>
      {/* Hero Section - Dark Gradient */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          textAlign: 'center',
          background: `linear-gradient(180deg, ${dark.main} 0%, ${dark.light} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          // Subtle glow effect
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: `radial-gradient(circle, ${dark.accentGlow} 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: dark.textActive,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            Organize Pickup Games{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Like a Pro.
            </Box>
          </Typography>
          <Typography
            variant="h5"
            paragraph
            sx={{
              mb: 5,
              maxWidth: '600px',
              mx: 'auto',
              color: dark.text,
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.7,
            }}
          >
            Effortlessly collect payments, generate balanced teams, and organize your rentals. The
            all-in-one platform for the modern pickup game organizer.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                px: 5,
                py: 1.75,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                boxShadow: `0 4px 20px ${alpha(dark.accent, 0.4)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                  boxShadow: `0 6px 25px ${alpha(dark.accent, 0.5)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 5,
                py: 1.75,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '12px',
                borderColor: alpha(dark.textActive, 0.3),
                color: dark.textActive,
                '&:hover': {
                  borderColor: dark.textActive,
                  backgroundColor: alpha(dark.textActive, 0.05),
                },
              }}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2, color: dark.main }}>
            Everything you need
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: dark.text, mb: 8, maxWidth: 600, mx: 'auto' }}
          >
            Stop juggling multiple apps. Pickup gives you all the tools to run successful games.
          </Typography>

          <Box
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}
          >
            {[
              {
                title: 'Easy Payments',
                desc: "Handle transactions directly in the app. No more headaches trying to figure out who's paid or not.",
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
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  height: '100%',
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: `0 8px 30px ${alpha(dark.main, 0.08)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '16px',
                      backgroundColor: alpha(dark.accent, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                    />
                  </Box>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: dark.main }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: dark.text, lineHeight: 1.7 }}>
                  {feature.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Final CTA Section - Dark */}
      <Box
        sx={{
          py: 12,
          textAlign: 'center',
          background: `linear-gradient(180deg, ${dark.light} 0%, ${dark.main} 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 800, color: dark.textActive, mb: 2 }}
          >
            Ready to elevate your game?
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{ mb: 5, color: dark.text, maxWidth: 500, mx: 'auto' }}
          >
            Join thousands of organizers making pickup games easier for everyone.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
              boxShadow: `0 4px 20px ${alpha(dark.accent, 0.4)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                boxShadow: `0 6px 25px ${alpha(dark.accent, 0.5)}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Get Started for Free
          </Button>
        </Container>
      </Box>
    </HomeLayout>
  );
};
