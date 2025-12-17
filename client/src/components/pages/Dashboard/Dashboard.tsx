import React from 'react';
import { Container, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getMyEvents } from '@/api/client';
import EventCard from '@/components/molecules/EventCard/EventCard';
import type { IEvent } from '@pickup/shared';
import { useNavigate } from 'react-router';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['myEvents'],
    queryFn: getMyEvents,
  });

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

  const events: IEvent[] = data?.data?.events || [];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate('/events/new')}>
          Create Event
        </Button>
      </Box>

      {events.length === 0 ? (
        <Typography variant="body1">You haven't created or joined any events yet.</Typography>
      ) : (
        events.map((event) => <EventCard key={event._id} event={event} />)
      )}
    </Container>
  );
};

export default Dashboard;
