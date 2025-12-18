import React from 'react';
import { Container, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { useMyEvents } from '@/hooks/useEvents';
import EventCard from '@/components/molecules/EventCard/EventCard';
import { useNavigate } from 'react-router-dom';
import { EventStatus } from '@pickup/shared';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: events = [], isLoading, error } = useMyEvents();

  const activeEvents = events.filter((event) => event.status !== EventStatus.CANCELED);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load events</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate('/events/new')}>
          Create Event
        </Button>
      </Box>

      {activeEvents.length === 0 ? (
        <Typography variant="body1">You haven't created or joined any events yet.</Typography>
      ) : (
        activeEvents.map((event) => <EventCard key={event._id} event={event} />)
      )}
    </Container>
  );
};

export default Dashboard;
