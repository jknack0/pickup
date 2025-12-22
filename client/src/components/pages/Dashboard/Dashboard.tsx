import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMyEvents } from '@/hooks/useEvents';
import EventCard from '@/components/molecules/EventCard/EventCard';
import { useNavigate } from 'react-router-dom';
import { EventStatus } from '@pickup/shared';
import { useUser } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;
  const { data: events = [], isLoading, error } = useMyEvents();
  const { data: userData } = useUser();

  const firstName = userData?.user?.firstName || 'there';

  const activeEvents = React.useMemo(
    () => events.filter((event) => event.status !== EventStatus.CANCELED),
    [events],
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: dark.accent }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load events</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${dark.light} 0%, ${alpha(dark.accent, 0.2)} 100%)`,
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${dark.accentGlow} 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: dark.textActive,
              fontWeight: 700,
              mb: 1,
            }}
          >
            Welcome back, {firstName}! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: dark.text,
              mb: 3,
              maxWidth: 500,
            }}
          >
            Manage your events, track attendance, and organize your next pickup game.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/events/new')}
            sx={{
              background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
              boxShadow: `0 4px 15px ${alpha(dark.accent, 0.4)}`,
              px: 3,
              py: 1.25,
              borderRadius: '10px',
              fontWeight: 600,
              '&:hover': {
                background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                boxShadow: `0 6px 20px ${alpha(dark.accent, 0.5)}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Create Event
          </Button>
        </Box>
      </Box>

      {/* Events Section */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: dark.textActive,
          }}
        >
          Your Events
        </Typography>

        {activeEvents.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              bgcolor: dark.light,
              borderRadius: 3,
              border: '1px dashed',
              borderColor: alpha(dark.textActive, 0.2),
            }}
          >
            <Typography variant="h6" sx={{ color: dark.textActive }} gutterBottom>
              No events yet
            </Typography>
            <Typography variant="body2" sx={{ color: dark.text, mb: 3 }}>
              Create your first event to get started!
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/events/new')}
              sx={{
                borderColor: dark.accent,
                color: dark.accent,
                '&:hover': {
                  borderColor: dark.accent,
                  backgroundColor: alpha(dark.accent, 0.1),
                },
              }}
            >
              Create Event
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {activeEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
