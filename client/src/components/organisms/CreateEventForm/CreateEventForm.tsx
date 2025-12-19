import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography } from '@mui/material';
import { CreateEventSchema, EventType, EventFormat } from '@pickup/shared';
import type { CreateEventInput } from '@pickup/shared';
import { useCreateEvent } from '@/hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LocationAutocomplete from '@/components/atoms/LocationAutocomplete/LocationAutocomplete';

const CreateEventForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(CreateEventSchema),
    mode: 'onBlur',
    defaultValues: {
      type: EventType.VOLLEYBALL,
      format: EventFormat.OPEN_GYM,
      location: '',
      title: '',
      date: '',
      description: '',
    },
  });

  // Register coordinates field manually since it doesn't have an input
  useEffect(() => {
    register('coordinates');
  }, [register]);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createEvent } = useCreateEvent();

  const onSubmit = async (data: CreateEventInput) => {
    try {
      const response = await createEvent(data);
      enqueueSnackbar('Event created successfully', { variant: 'success' });
      navigate(`/events/${response.data.event._id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { errors?: unknown[]; message?: string } } };
      if (err.response?.data?.errors) {
        // Handle field-specific errors if returned
      }
      enqueueSnackbar(err.response?.data?.message || 'Failed to create event', {
        variant: 'error',
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Create New Event
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Event Title"
        autoFocus
        error={!!errors.title}
        helperText={errors.title?.message}
        {...register('title')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="date"
        label="Date & Time"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.date}
        helperText={errors.date?.message}
        {...register('date')}
      />

      <LocationAutocomplete
        onPlaceSelect={(place) => {
          if (place) {
            setValue('location', place.name || place.formatted_address || '', {
              shouldValidate: true,
            });
            if (place.geometry?.location) {
              setValue('coordinates', {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              });
            }
          } else {
            setValue('location', '', { shouldValidate: true });
            setValue('coordinates', undefined);
          }
        }}
        error={!!errors.location}
        helperText={errors.location?.message}
      />

      <TextField
        select
        margin="normal"
        fullWidth
        id="type"
        label="Event Type"
        defaultValue={EventType.VOLLEYBALL}
        error={!!errors.type}
        helperText={errors.type?.message}
        {...register('type')}
        SelectProps={{
          native: true,
        }}
      >
        <option value={EventType.VOLLEYBALL}>Volleyball</option>
      </TextField>

      <TextField
        select
        margin="normal"
        fullWidth
        id="format"
        label="Event Format"
        defaultValue={EventFormat.OPEN_GYM}
        error={!!errors.format}
        helperText={errors.format?.message}
        {...register('format')}
        SelectProps={{
          native: true,
        }}
      >
        <option value={EventFormat.OPEN_GYM}>Open Gym</option>
        <option value={EventFormat.LEAGUE}>League</option>
        <option value={EventFormat.TOURNAMENT}>Tournament</option>
      </TextField>

      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Description"
        multiline
        rows={4}
        error={!!errors.description}
        helperText={errors.description?.message}
        {...register('description')}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Event'}
      </Button>
    </Box>
  );
};

export default CreateEventForm;
