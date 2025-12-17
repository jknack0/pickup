import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  AvatarGroup,
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
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvent, joinEvent, updateRSVP } from '@/api/client';
import { AttendeeStatus } from '@pickup/shared';
import type { IEvent } from '@pickup/shared';
import { useSnackbar } from 'notistack';
import { useUser } from '@hooks/useAuth';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const [positionDialogOpen, setPositionDialogOpen] = React.useState(false);
  const [selectedPositions, setSelectedPositions] = React.useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const { data: userData } = useUser();
  const userId = userData?.user?._id;

  const [searchParams] = useSearchParams();
  const shouldJoin = searchParams.get('join') === 'true';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id as string),
    enabled: !!id,
  });

  // Join mutation
  const { mutate: join } = useMutation({
    mutationFn: (positions?: string[]) => joinEvent(id as string, positions),
    onSuccess: (responseData) => {
      enqueueSnackbar('You have joined the event!', { variant: 'success' });

      setPositionDialogOpen(false); // Close dialog if open

      // Update cache immediately with the updated event from the response
      queryClient.setQueryData(
        ['event', id],
        (oldData: { data: { event: IEvent } } | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              event: responseData.data.event,
            },
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ['event', id] });
      navigate(`/events/${id}`, { replace: true });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { status: number; data?: { message?: string } } };
      if (error.response?.status === 400) {
        enqueueSnackbar(error.response?.data?.message || 'Failed to join', { variant: 'info' });
      } else {
        enqueueSnackbar('Failed to join event', { variant: 'error' });
      }
      navigate(`/events/${id}`, { replace: true });
    },
  });

  const handleJoinClick = () => {
    if (data?.data?.event?.type === 'VOLLEYBALL') {
      setPositionDialogOpen(true);
    } else {
      join(undefined);
    }
  };

  const handlePositionToggle = (pos: string) => {
    setSelectedPositions(
      (prev) => (prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos].slice(0, 3)), // Max 3
    );
  };

  const handleConfirmJoin = () => {
    join(selectedPositions);
  };

  // Attempt join if param exists and we have data
  React.useEffect(() => {
    if (shouldJoin && id && data && userId) {
      const event: IEvent = data.data.event;
      // Attendee check: handle object structure
      const isAlreadyAttending = event.attendees.some(
        (att) => (typeof att === 'object' ? att.user : att) === userId,
      );

      if (!isAlreadyAttending) {
        if (event.type === 'VOLLEYBALL') {
          setPositionDialogOpen(true);
        } else {
          join(undefined);
        }
      } else {
        enqueueSnackbar('You are already attending this event.', { variant: 'info' });
        navigate(`/events/${id}`, { replace: true });
      }
    }
  }, [shouldJoin, id, join, data, userId, enqueueSnackbar, navigate]);

  // RSVP mutation
  const { mutate: updateStatus } = useMutation({
    mutationFn: (status: AttendeeStatus) => updateRSVP(id as string, status),
    onSuccess: (responseData) => {
      queryClient.setQueryData(['event', id], (old: { data: { event: IEvent } } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, event: responseData.data.event },
        };
      });
      enqueueSnackbar('RSVP updated', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Failed to update RSVP', { variant: 'error' });
    },
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
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

  if (error || !data) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load event details.</Alert>
      </Container>
    );
  }

  const event: IEvent = data.data.event;

  // Render Logic
  const attendeeRecord = event.attendees.find(
    (att) => (typeof att === 'object' ? att.user : att) === userId,
  );
  const isAttending = !!attendeeRecord;
  // Safe cast for status access since we verified existence
  const currentStatus = isAttending
    ? (attendeeRecord as unknown as { status: AttendeeStatus }).status
    : null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {event.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {new Date(event.date).toLocaleString()}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {event.location}
            </Typography>
            <Box mt={1} display="flex" gap={1}>
              <Typography
                variant="body2"
                sx={{ bgcolor: 'secondary.main', color: 'white', px: 1, borderRadius: 1 }}
              >
                {event.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </Typography>
              <Typography variant="body2" sx={{ bgcolor: 'grey.300', px: 1, borderRadius: 1 }}>
                {event.format.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            {!isAttending && (
              <Button variant="contained" onClick={handleJoinClick}>
                Join Event
              </Button>
            )}
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
              <MenuItem onClick={handleShare}>Share Event</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" paragraph>
          {event.description || 'No description provided.'}
        </Typography>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Attendees
          </Typography>
          <AvatarGroup max={5} sx={{ justifyContent: 'flex-start' }}>
            {event.attendees.map((att, index) => {
              // att is likely IAttendee object but with populated User
              const person = att as unknown as { user: { firstName: string } };
              const firstName = person.user?.firstName || '?';
              // Could eventually color code ring based on status
              return <Avatar key={index}>{firstName[0]}</Avatar>;
            })}
          </AvatarGroup>
        </Box>

        {isAttending && (
          <Box mt={4} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="subtitle2" gutterBottom>
              Your RSVP
            </Typography>
            <ButtonGroup variant="outlined" aria-label="rsvp button group">
              <Button
                variant={currentStatus === AttendeeStatus.YES ? 'contained' : 'outlined'}
                color="success"
                onClick={() => updateStatus(AttendeeStatus.YES)}
              >
                Going
              </Button>
              <Button
                variant={currentStatus === AttendeeStatus.MAYBE ? 'contained' : 'outlined'}
                color="warning"
                onClick={() => updateStatus(AttendeeStatus.MAYBE)}
              >
                Maybe
              </Button>
              <Button
                variant={currentStatus === AttendeeStatus.NO ? 'contained' : 'outlined'}
                color="error"
                onClick={() => updateStatus(AttendeeStatus.NO)}
              >
                No
              </Button>
            </ButtonGroup>
          </Box>
        )}
      </Paper>

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
    </Container>
  );
};

export default EventDetails;
