import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  AvatarGroup,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ButtonGroup,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '@/components/molecules/ConfirmationDialog';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const [positionDialogOpen, setPositionDialogOpen] = React.useState(false);
  const [selectedPositions, setSelectedPositions] = React.useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

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
        navigate(`/events/${id}`, { replace: true });
      },
      onError: (err: unknown) => {
        const error = err as { response?: { status: number; data?: { message?: string } } };
        if (error.response?.status === 400) {
          enqueueSnackbar(error.response?.data?.message || 'Failed to join', { variant: 'info' });
        } else {
          enqueueSnackbar('Failed to join event', { variant: 'error' });
        }
        setPositionDialogOpen(false);
        navigate(`/events/${id}`, { replace: true });
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
        handleMenuClose();
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

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
    handleMenuClose();
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
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {event.title}
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <Chip
                label={event.type.replace(/_/g, ' ')}
                color="secondary"
                sx={{ fontWeight: 'bold' }}
              />
              <Chip
                label={event.format.replace(/_/g, ' ')}
                variant="outlined"
                sx={{ bgcolor: 'background.paper' }}
              />
              {event.status === EventStatus.CANCELED && (
                <Chip label="CANCELED" color="error" sx={{ fontWeight: 'bold' }} />
              )}
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            <IconButton onClick={handleShare} title="Share">
              <ShareIcon />
            </IconButton>
            {!isAttending && !isOrganizer && event.status !== EventStatus.CANCELED && (
              <Button variant="contained" size="large" onClick={handleJoinClick}>
                Join Event
              </Button>
            )}
            {isOrganizer && (
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            )}
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
              <MenuItem onClick={handleShare}>Share Event</MenuItem>
              {isOrganizer && event.status !== EventStatus.CANCELED && (
                <MenuItem
                  onClick={() => {
                    setCancelDialogOpen(true);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  Cancel Event
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
      </Box>

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
              <Card elevation={2} sx={{ bgcolor: 'primary.50' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Your RSVP
                  </Typography>
                  <ButtonGroup
                    fullWidth
                    variant="contained"
                    aria-label="rsvp button group"
                    size="small"
                    sx={{ boxShadow: 0 }}
                  >
                    <Button
                      color={currentStatus === AttendeeStatus.YES ? 'success' : 'inherit'}
                      onClick={() => executeUpdateStatus(AttendeeStatus.YES)}
                      sx={
                        currentStatus !== AttendeeStatus.YES
                          ? { bgcolor: 'white', color: 'text.primary' }
                          : {}
                      }
                    >
                      Going
                    </Button>
                    <Button
                      color={currentStatus === AttendeeStatus.MAYBE ? 'warning' : 'inherit'}
                      onClick={() => executeUpdateStatus(AttendeeStatus.MAYBE)}
                      sx={
                        currentStatus !== AttendeeStatus.MAYBE
                          ? { bgcolor: 'white', color: 'text.primary' }
                          : {}
                      }
                    >
                      Maybe
                    </Button>
                    <Button
                      color={currentStatus === AttendeeStatus.NO ? 'error' : 'inherit'}
                      onClick={() => executeUpdateStatus(AttendeeStatus.NO)}
                      sx={
                        currentStatus !== AttendeeStatus.NO
                          ? { bgcolor: 'white', color: 'text.primary' }
                          : {}
                      }
                    >
                      No
                    </Button>
                  </ButtonGroup>
                </CardContent>
              </Card>
            )}

            {/* Attendees Card */}
            <Card elevation={0} variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">Attendees</Typography>
                    <Chip label={`${event.attendees.length}`} size="small" />
                  </Box>
                  {isOrganizer && event.status !== EventStatus.CANCELED && (
                    <IconButton
                      size="small"
                      onClick={() => setAddAttendeeDialogOpen(true)}
                      title="Add Attendee"
                      color="primary"
                    >
                      <PersonAddIcon />
                    </IconButton>
                  )}
                </Box>

                {/* List View for Organizer to Manage, Avatar Group for others */}
                {isOrganizer ? (
                  <Stack spacing={1} mt={1}>
                    {event.attendees.map((att, index) => {
                      const person = att as unknown as {
                        user: { _id: string; firstName: string; lastName: string; email: string };
                      };
                      const name = person.user
                        ? `${person.user.firstName} ${person.user.lastName || ''}`
                        : 'Unknown';
                      return (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={1}
                          bgcolor="background.default"
                          borderRadius={1}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                              {person.user?.firstName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                {name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {person.user?.email}
                              </Typography>
                            </Box>
                          </Box>
                          {/* Don't remove self */}
                          {person.user?._id !== organizerId && (
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveAttendee(person.user?._id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <AvatarGroup max={7} sx={{ justifyContent: 'flex-start' }}>
                    {event.attendees.map((att, index) => {
                      const person = att as unknown as {
                        user: { firstName: string; lastName: string };
                      };
                      const name = person.user
                        ? `${person.user.firstName} ${person.user.lastName || ''}`
                        : '?';
                      return (
                        <Avatar key={index} alt={name}>
                          {person.user?.firstName?.[0]}
                        </Avatar>
                      );
                    })}
                  </AvatarGroup>
                )}

                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Organized by{' '}
                    <strong>
                      {(event.organizer as unknown as { firstName: string }).firstName}
                    </strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
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
