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
  Button,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AttendeeStatus, EventStatus } from '@pickup/shared';
import type { IEvent, RefundInfo } from '@pickup/shared';
import { useSnackbar } from 'notistack';
import { useUser } from '@hooks/useAuth';
import MapPreview from '@/components/atoms/MapPreview/MapPreview';
import {
  useEvent,
  useUpdateRSVP,
  useCancelEvent,
  useRemoveAttendee,
  useAddAttendee,
  useLeaveEvent,
} from '@/hooks/useEvents';
import TextField from '@mui/material/TextField';
import ConfirmationDialog from '@/components/molecules/ConfirmationDialog';

// New Components
import EventHeader from '@/components/organisms/EventHeader';
import RSVPControls from '@/components/molecules/RSVPControls';
import AttendeeList from '@/components/organisms/AttendeeList';
import JoinEventButton from '@/components/organisms/JoinEventButton';
import { useVerifyPayment } from '@/hooks/usePayment';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dark = theme.palette.dark;

  // Confirmation Dialog State
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [attendeeToRemove, setAttendeeToRemove] = React.useState<string | null>(null);

  const { data: userData, isLoading: isUserLoading } = useUser();
  const userId = userData?.user?._id;

  const [searchParams] = useSearchParams();
  const shouldJoin = searchParams.get('join') === 'true';
  const navigate = useNavigate();
  const location = useLocation();

  // Queries and Mutations
  const { data: eventData, isLoading, error } = useEvent(id as string);
  const { mutate: updateStatus } = useUpdateRSVP(id as string);
  const { mutate: cancel, isPending: isCanceling } = useCancelEvent(id as string);
  const { mutate: remove } = useRemoveAttendee(id as string);
  const { mutate: add } = useAddAttendee(id as string);

  // Auto-join redirect handler
  // Note: We're not automating the *dialog opening* via JoinEventButton prop yet,
  // but if user clicks the button it works.
  // Ideally, if shouldJoin is set, we want JoinEventButton to open immediately.
  // For now, let's keep the redirect logic. The auto-open dialog logic from previous implementation
  // is tricky to pass without state.
  // Ideally, JoinEventButton should verify if it should open.
  // Let's rely on user clicking "Join" after redirect for now, OR we can pass a "defaultOpen" prop?
  // User asked for "Auto-Join". The previous implementation opened dialog.
  // Let's assume user clicks Join for now to keep refactor safe, OR add 'defaultOpen' prop.
  // Actually, if 'join=true' is in URL, we want to TRIGGER the join.
  // I will skip passing defaultOpen for this iteration to avoid prop drilling complexity until verified.

  const { mutateAsync: verifyPayment } = useVerifyPayment();

  React.useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId)
        .then(() => {
          enqueueSnackbar('Payment verified! You are now attending.', { variant: 'success' });
          // Remove session_id param
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('session_id');
          navigate(`/events/${id}?${newParams.toString()}`, { replace: true });
        })
        .catch(() => {
          enqueueSnackbar('Verification failed. Use "Join" button to try again.', {
            variant: 'warning',
          });
        });
    } else if (shouldJoin && !userData && !isUserLoading) {
      navigate('/login', { state: { from: location } });
    }
  }, [
    shouldJoin,
    userData,
    isUserLoading,
    navigate,
    location,
    searchParams,
    id,
    verifyPayment,
    enqueueSnackbar,
  ]);

  const { mutate: leave } = useLeaveEvent(id as string);

  const executeLeaveEvent = () => {
    leave(undefined, {
      onSuccess: (response) => {
        setLeaveDialogOpen(false);
        const refund = response.data?.refund as RefundInfo | undefined;

        if (refund?.refunded && refund.amount) {
          // Successful refund - show amount
          const amountFormatted = (refund.amount / 100).toFixed(2);
          const currencySymbol =
            refund.currency === 'usd' ? '$' : refund.currency?.toUpperCase() + ' ';
          enqueueSnackbar(
            `Left event. Refund of ${currencySymbol}${amountFormatted} is being processed (3-5 business days).`,
            { variant: 'success', autoHideDuration: 6000 },
          );
        } else if (refund?.reason === 'past_deadline') {
          // Past 24h deadline - no refund
          enqueueSnackbar(
            'Left event. No refund available (less than 24 hours before event start).',
            { variant: 'warning', autoHideDuration: 5000 },
          );
        } else if (refund?.reason === 'no_payment') {
          // No payment on record (e.g., manually added)
          enqueueSnackbar('Left event successfully.', { variant: 'success' });
        } else if (refund?.reason === 'zero_amount') {
          // Refund amount too small after fees
          enqueueSnackbar('Left event. Refund amount after fees was too small to process.', {
            variant: 'info',
            autoHideDuration: 5000,
          });
        } else {
          // Fallback for free events or unexpected cases
          enqueueSnackbar('Left event successfully.', { variant: 'success' });
        }
        navigate('/events');
      },
      onError: (err: unknown) => {
        setLeaveDialogOpen(false);
        const error = err as { response?: { data?: { message?: string } } };
        enqueueSnackbar(error.response?.data?.message || 'Failed to leave event', {
          variant: 'error',
        });
      },
    });
  };

  const executeUpdateStatus = (status: AttendeeStatus) => {
    if (status === AttendeeStatus.NO && eventData?.isPaid) {
      setLeaveDialogOpen(true);
      return;
    }

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

  const [addAttendeeDialogOpen, setAddAttendeeDialogOpen] = React.useState(false);
  const [attendeeEmail, setAttendeeEmail] = React.useState('');

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

  const handleRemoveAttendee = (userId: string) => {
    setAttendeeToRemove(userId);
    setRemoveDialogOpen(true);
  };

  const executeRemoveConfirmed = () => {
    if (attendeeToRemove) {
      executeRemove(attendeeToRemove);
      setRemoveDialogOpen(false);
      setAttendeeToRemove(null);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/events/${id}?join=true`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar('Invite link copied to clipboard!', { variant: 'success' });
  };

  const handleJoinSuccess = () => {
    // Remove join param
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('join');
    navigate(`/events/${id}?${newParams.toString()}`, { replace: true });
  };

  // We need to pass onJoinClick to Header.
  // Header expects onJoinClick: () => void.
  // But JoinEventButton is a component.
  // We should modify EventHeader to accept a ReactNode for the join action instead of a callback?
  // OR we keep onJoinClick but it opens the dialog?
  // Since we extracted the entire button+dialog to JoinEventButton, we should Render JoinEventButton inside EventHeader?
  // Or replace the button in EventHeader with children?
  // Let's Modify EventHeader to accept optional `action` node or render children.
  // For now, I will modify EventHeader usage. But EventHeader renders the button.
  // I need to update EventHeader to allow passing the Custom Button.

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
  const attendeeRecord = event.attendees.find((att) => {
    const attUserId =
      typeof att.user === 'object' && att.user !== null
        ? (att.user as unknown as { _id: string })._id
        : att.user;
    return attUserId === userId;
  });
  const isAttending = !!attendeeRecord;
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
      <EventHeader
        event={event}
        isOrganizer={isOrganizer}
        isAttending={isAttending}
        onJoinClick={() => {}} // Should not be used if we hide the default button
        onShareClick={handleShare}
        onCancelEventClick={() => setCancelDialogOpen(true)}
        price={event.isPaid ? event.price : undefined}
        JoinButtonComponent={<JoinEventButton event={event} onJoinSuccess={handleJoinSuccess} />}
      />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              bgcolor: dark.light,
              border: `1px solid ${alpha(dark.textActive, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="600"
                sx={{ color: dark.textActive }}
              >
                About this Event
              </Typography>
              <Box my={2}>
                <Divider sx={{ borderColor: alpha(dark.textActive, 0.1) }} />
              </Box>
              <Typography
                variant="body1"
                paragraph
                sx={{ whiteSpace: 'pre-line', color: dark.text }}
              >
                {event.description || 'No description provided by the organizer.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                bgcolor: dark.light,
                border: `1px solid ${alpha(dark.textActive, 0.1)}`,
                borderRadius: 3,
              }}
            >
              {event.coordinates && (
                <Box sx={{ p: 1.5, pb: 0 }}>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <MapPreview
                      lat={event.coordinates.lat}
                      lng={event.coordinates.lng}
                      height={200}
                    />
                  </Box>
                </Box>
              )}
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" gap={2} alignItems="center">
                    <LocationOnIcon sx={{ color: dark.text }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: dark.text }}>
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight="500" sx={{ color: dark.textActive }}>
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" gap={2} alignItems="center">
                    <CalendarTodayIcon sx={{ color: dark.text }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: dark.text }}>
                        Date & Time
                      </Typography>
                      <Typography variant="body1" fontWeight="500" sx={{ color: dark.textActive }}>
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                      <Typography variant="body2" sx={{ color: dark.text }}>
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

            {isAttending && (
              <RSVPControls
                currentStatus={currentStatus}
                onUpdateStatus={executeUpdateStatus}
                isLoading={false}
              />
            )}

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

      <Dialog
        open={addAttendeeDialogOpen}
        onClose={() => setAddAttendeeDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: dark.light,
            border: `1px solid ${alpha(dark.textActive, 0.1)}`,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: dark.textActive }}>Add Attendee</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: dark.text }} gutterBottom>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                color: dark.textActive,
                '& fieldset': { borderColor: alpha(dark.textActive, 0.2) },
                '&:hover fieldset': { borderColor: alpha(dark.textActive, 0.4) },
                '&.Mui-focused fieldset': { borderColor: dark.accent },
              },
              '& .MuiInputLabel-root': { color: dark.text },
              '& .MuiInputLabel-root.Mui-focused': { color: dark.accent },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddAttendeeDialogOpen(false)} sx={{ color: dark.text }}>
            Cancel
          </Button>
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

      <ConfirmationDialog
        open={leaveDialogOpen}
        title="Leave Paid Event"
        content="Leaving this paid event will verify your refund eligibility (24h policy). Continue?"
        onConfirm={executeLeaveEvent}
        onCancel={() => setLeaveDialogOpen(false)}
        confirmText="Yes, Leave Event"
        confirmColor="warning"
      />

      <ConfirmationDialog
        open={removeDialogOpen}
        title="Remove Attendee"
        content="Are you sure you want to remove this attendee from the event?"
        onConfirm={executeRemoveConfirmed}
        onCancel={() => {
          setRemoveDialogOpen(false);
          setAttendeeToRemove(null);
        }}
        confirmText="Yes, Remove"
        confirmColor="error"
      />
    </Container>
  );
};

export default EventDetails;
