import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  Paper,
  Link,
  useTheme,
  alpha,
  Stack,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import { TextField } from '@/components/atoms/TextField';
import { Button } from '@/components/atoms/Button';
import { CreateEventSchema, EventType, EventFormat } from '@pickup/shared';
import type { CreateEventInput } from '@pickup/shared';
import { useCreateEvent } from '@/hooks/useEvents';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LocationAutocomplete from '@/components/atoms/LocationAutocomplete/LocationAutocomplete';
import { useGroup } from '@/hooks/useGroups';

const CreateEventForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('groupId');
  const theme = useTheme();
  const dark = theme.palette.dark;
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createEvent, isPending } = useCreateEvent();
  const { data: group } = useGroup(groupId || '');

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(CreateEventSchema) as Resolver<CreateEventInput>,
    mode: 'onBlur',
    defaultValues: {
      type: EventType.VOLLEYBALL,
      format: EventFormat.OPEN_GYM,
      location: '',
      title: '',
      date: '',
      description: '',
      isPaid: false,
      price: 0,
      currency: 'usd',
      coordinates: undefined,
    },
  });

  // Register coordinates field manually since it doesn't have an input
  useEffect(() => {
    register('coordinates');
  }, [register]);

  const isPaid = watch('isPaid');

  const onSubmit: SubmitHandler<CreateEventInput> = async (data) => {
    try {
      // Include groupId if creating a group event
      const eventData = groupId ? { ...data, groupId } : data;
      const response = await createEvent(eventData);
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100%',
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          backgroundColor: alpha('#ffffff', 0.98),
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: `0 25px 50px -12px ${alpha(dark.main, 0.25)}`,
          width: '100%',
          maxWidth: 500,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            {group ? `New Event for ${group.name}` : 'Create an Event'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {group
              ? 'This event will be associated with your group'
              : 'Set up a new game for your community'}
          </Typography>
        </Box>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <Stack spacing={2.5}>
            <TextField
              label="Event Title"
              fullWidth
              variant="outlined"
              required
              autoFocus
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
            />

            <TextField
              label="Date & Time"
              type="datetime-local"
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date?.message}
              {...register('date')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
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
              fullWidth
              variant="outlined"
              label="Event Type"
              defaultValue={EventType.VOLLEYBALL}
              error={!!errors.type}
              helperText={errors.type?.message}
              {...register('type')}
              SelectProps={{ native: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
            >
              <option value={EventType.VOLLEYBALL}>Volleyball</option>
            </TextField>

            <TextField
              select
              fullWidth
              variant="outlined"
              label="Event Format"
              defaultValue={EventFormat.OPEN_GYM}
              error={!!errors.format}
              helperText={errors.format?.message}
              {...register('format')}
              SelectProps={{ native: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
            >
              <option value={EventFormat.OPEN_GYM}>Open Gym</option>
              <option value={EventFormat.LEAGUE}>League</option>
              <option value={EventFormat.TOURNAMENT}>Tournament</option>
            </TextField>

            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register('description')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
            />

            <FormControlLabel
              control={<Checkbox {...register('isPaid')} color="primary" />}
              label="This is a paid event"
              sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
            />

            <Controller
              name="price"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Price (USD)"
                  placeholder="0.00"
                  disabled={!isPaid}
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                  }}
                  value={value ? (value / 100).toFixed(2) : ''}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    onChange(Number(digits));
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      '&:hover fieldset': { borderColor: 'primary.main' },
                    },
                  }}
                />
              )}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isPending}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
              boxShadow: `0 4px 15px ${alpha(dark.accent, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                boxShadow: `0 6px 20px ${alpha(dark.accent, 0.4)}`,
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: theme.palette.action.disabledBackground,
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isPending ? 'Creating...' : 'Create Event'}
          </Button>

          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Changed your mind?{' '}
              <Link
                component={RouterLink}
                to="/dashboard"
                underline="hover"
                sx={{ fontWeight: 600, color: dark.accent }}
              >
                Back to Dashboard
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateEventForm;
