import React from 'react';
import { Container } from '@mui/material';
import { CreateEventForm } from '@/components/organisms/CreateEventForm';

const CreateEvent: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <CreateEventForm />
    </Container>
  );
};

export default CreateEvent;
