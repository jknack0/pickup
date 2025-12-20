import React from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { AttendeeStatus } from '@pickup/shared';
import type { IEvent } from '@pickup/shared';
import { useSnackbar } from 'notistack';
import { useUser } from '@hooks/useAuth';
import MapPreview from '@/components/atoms/MapPreview/MapPreview';
import {
  useEvent,
  useJoinEvent,
  useUpdateRSVP,
  useCancelEvent,
  useRemoveAttendee,
  useAddAttendee,
} from '@/hooks/useEvents';
import { EventStatus } from '@pickup/shared';
import TextField from '@mui/material/TextField';
import ConfirmationDialog from '@/components/molecules/ConfirmationDialog';

// New Components
import EventHeader from '@/components/organisms/EventHeader';
import RSVPControls from '@/components/molecules/RSVPControls';
import AttendeeList from '@/components/organisms/AttendeeList';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const [positionDialogOpen, setPositionDialogOpen] = React.useState(false);
  const [selectedPositions, setSelectedPositions] = React.useState<string[]>([]);

  // Confirmation Dialog State
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

  const { data: userData } = useUser();
  const userId = userData?.user?._id;

  const [searchParams] = useSearchParams();
  const shouldJoin = searchParams.get('join') === 'true';
  const navigate = useNavigate();

  // Queries and Mutations
  const { data: eventData, isLoading, error } = useEvent(id as string);
  const { mutate: join } = useJoinEvent(id as string);
  const { mutate: updateStatus } = useUpdateRSVP(id as string);
  const { mutate: cancel, isPending: isCanceling } = useCancelEvent(id as string);
  const { mutate: remove } = useRemoveAttendee(id as string);
  const { mutate: add } = useAddAttendee(id as string);

  // Wrappers for side effects
  const executeJoin = (positions?: string[]) => {
    join(positions || [], {
      onSuccess: () => {
        enqueueSnackbar('You have joined the event!', { variant: 'success' });
        setPositionDialogOpen(false);
        // Remove the join param so it doesn't re-trigger
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('join');
        navigate(`/events/${id}?${newParams.toString()}`, { replace: true });
      },
      onError: (err: unknown) => {
        const error = err as { response?: { status: number; data?: { message?: string } } };
        if (error.response?.status === 400) {
          enqueueSnackbar(error.response?.data?.message || 'Failed to join', { variant: 'info' });
        } else {
          enqueueSnackbar('Failed to join event', { variant: 'error' });
        }
        setPositionDialogOpen(false);
        // Also clear param on error to prevent infinite loops
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('join');
        navigate(`/events/${id}?${newParams.toString()}`, { replace: true });
      },
    });
  };

  const executeUpdateStatus = (status: AttendeeStatus) => {
    updateStatus(status, {
      onSuccess: () => {
        enqueueSnackbar('RSVP updated', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Failed to update RSVP', { variant: 'error' });
      },
    });
  };

  const executeCancel = () => {
    cancel(undefined, {
      onSuccess: () => {
        enqueueSnackbar('Event canceled', { variant: 'success' });
        setCancelDialogOpen(false);
      },
      onError: () => {
        enqueueSnackbar('Failed to cancel event', { variant: 'error' });
        setCancelDialogOpen(false);
      },
    });
  };

  const executeRemove = (targetUserId: string) => {
    remove(targetUserId, {
      onSuccess: () => {
        enqueueSnackbar('Attendee removed', { variant: 'success' });
      },
      onError: () => enqueueSnackbar('Failed to remove attendee', { variant: 'error' }),
    });
  };

  const executeAdd = () => {
    add(attendeeEmail, {
      onSuccess: () => {
        enqueueSnackbar('Attendee added successfully', { variant: 'success' });
        setAddAttendeeDialogOpen(false);
        setAttendeeEmail('');
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        const msg = error.response?.data?.message || 'Failed to add attendee';
        enqueueSnackbar(msg, { variant: 'error' });
      },
    });
  };

  const handleJoinClick = () => {
    if (eventData?.type === 'VOLLEYBALL') {
      setPositionDialogOpen(true);
    } else {
      executeJoin(undefined);
    }
  };

  const handlePositionToggle = (pos: string) => {
    setSelectedPositions(
      (prev) => (prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos].slice(0, 3)), // Max 3
    );
  };

  const handleConfirmJoin = () => {
    executeJoin(selectedPositions);
  };

  // Attempt join if param exists and we have data
  React.useEffect(() => {
    if (shouldJoin && id && eventData && userId) {
      const event: IEvent = eventData;
      // Attendee check: handle object structure
      const isAlreadyAttending = event.attendees.some((att) => {
        const attUserId =
          typeof att.user === 'object' && att.user !== null
            ? (att.user as unknown as { _id: string })._id
            : att.user;
        return attUserId === userId;
      });

      if (!isAlreadyAttending) {
        if (event.type === 'VOLLEYBALL') {
          setPositionDialogOpen(true);
        } else {
          executeJoin(undefined);
        }
      } else {
        enqueueSnackbar('You are already attending this event.', { variant: 'info' });
        navigate(`/events/${id}`, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldJoin, id, eventData, userId]); // Dependencies simplified

  // Add Attendee Dialog State
  const [addAttendeeDialogOpen, setAddAttendeeDialogOpen] = React.useState(false);
  const [attendeeEmail, setAttendeeEmail] = React.useState('');

  const handleRemoveAttendee = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this attendee?')) {
      executeRemove(userId);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/events/${id}?join=true`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar('Invite link copied to clipboard!', { variant: 'success' });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !eventData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load event details.</Alert>
      </Container>
    );
  }

  const event: IEvent = eventData;

  // Render Logic
  const attendeeRecord = event.attendees.find((att) => {
    const attUserId =
      typeof att.user === 'object' && att.user !== null
        ? (att.user as unknown as { _id: string })._id
        : att.user;
    return attUserId === userId;
  });
  const isAttending = !!attendeeRecord;
  // Safe cast for status access since we verified existence
  const currentStatus = isAttending
    ? (attendeeRecord as unknown as { status: AttendeeStatus }).status
    : null;

  const organizerId =
    typeof event.organizer === 'object' && event.organizer !== null
      ? (event.organizer as unknown as { _id: string })._id
      : event.organizer;
  const isOrganizer = organizerId === userId;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header Section */}
      <EventHeader
        event={event}
        isOrganizer={isOrganizer}
        isAttending={isAttending}
        onJoinClick={handleJoinClick}
        onShareClick={handleShare}
        onCancelEventClick={() => setCancelDialogOpen(true)}
      />

      <Grid container spacing={4}>
        {/* Left Column: Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="600">
                About this Event
              </Typography>
              <Box my={2}>
                <Divider />
              </Box>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {event.description || 'No description provided by the organizer.'}
              </Typography>
            </CardContent>
          </Card>
          {/* Future: Comments Section */}
        </Grid>

        {/* Right Column: Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Maps & Location Card */}
            <Card elevation={2}>
              {event.coordinates && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <MapPreview
                    lat={event.coordinates.lat}
                    lng={event.coordinates.lng}
                    height={200}
                  />
                </Box>
              )}
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" gap={2} alignItems="center">
                    <LocationOnIcon color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" gap={2} alignItems="center">
                    <CalendarTodayIcon color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* RSVP Actions (If Attending) */}
            {isAttending && (
              <RSVPControls
                currentStatus={currentStatus}
                onUpdateStatus={executeUpdateStatus}
                isLoading={false}
              />
            )}

            {/* Attendees Card */}
            <AttendeeList
              attendees={event.attendees}
              organizer={event.organizer}
              isOrganizer={isOrganizer}
              isCanceled={event.status === EventStatus.CANCELED}
              onAddAttendeeClick={() => setAddAttendeeDialogOpen(true)}
              onRemoveAttendee={handleRemoveAttendee}
            />
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={positionDialogOpen} onClose={() => setPositionDialogOpen(false)}>
        <DialogTitle>Select Positions</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select up to 3 preferred positions.
          </Typography>
          <Box display="flex" flexDirection="column">
            {['Setter', 'Outside', 'Opposite', 'Middle', 'Libero', 'DS'].map((pos) => (
              <FormControlLabel
                key={pos}
                control={
                  <Checkbox
                    checked={selectedPositions.includes(pos)}
                    onChange={() => handlePositionToggle(pos)}
                    disabled={!selectedPositions.includes(pos) && selectedPositions.length >= 3}
                  />
                }
                label={pos}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPositionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmJoin} variant="contained" autoFocus>
            Confirm & Join
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Attendee Dialog */}
      <Dialog open={addAttendeeDialogOpen} onClose={() => setAddAttendeeDialogOpen(false)}>
        <DialogTitle>Add Attendee</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter the email address of the user you want to add. They must have an account.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={attendeeEmail}
            onChange={(e) => setAttendeeEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddAttendeeDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => executeAdd()} variant="contained" disabled={!attendeeEmail}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={cancelDialogOpen}
        title="Cancel Event"
        content="Are you sure you want to cancel this event? This action cannot be undone and all attendees will be notified."
        onConfirm={executeCancel}
        onCancel={() => setCancelDialogOpen(false)}
        confirmText="Yes, Cancel Event"
        confirmColor="error"
        isLoading={isCanceling}
      />
    </Container>
  );
};

export default EventDetails;
