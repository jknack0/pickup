import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import type { IEvent } from '@pickup/shared';
import { useNavigate } from 'react-router-dom';
import MapPreview from '@/components/atoms/MapPreview/MapPreview';
import JoinEventButton from '@/components/organisms/JoinEventButton';
import { useUser } from '@/hooks/useAuth';
import { EventStatus, EventFormat } from '@pickup/shared';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';

export interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const { data: userData } = useUser();
  const userId = userData?.user._id;
  const theme = useTheme();
  const dark = theme.palette.dark;

  // Determine user relationship to event
  const isOrganizer =
    userData?.user._id ===
    (typeof event.organizer === 'object' && event.organizer !== null
      ? (event.organizer as unknown as { _id: string })._id
      : event.organizer);

  const isAttending = event.attendees.some((att) => {
    const attUserId =
      typeof att.user === 'object' && att.user !== null
        ? (att.user as unknown as { _id: string })._id
        : att.user;
    return attUserId === userId;
  });

  // Format date/time
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Format price
  const priceDisplay = event.isPaid && event.price ? `$${(event.price / 100).toFixed(0)}` : 'Free';

  // Format label
  const formatLabel = {
    [EventFormat.OPEN_GYM]: 'Open Gym',
    [EventFormat.LEAGUE]: 'League',
    [EventFormat.TOURNAMENT]: 'Tournament',
  }[event.format];

  const isCanceled = event.status === EventStatus.CANCELED;
  const attendeeCount = event.attendees.length;

  return (
    <Card
      elevation={0}
      onClick={() => navigate(`/events/${event._id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 3,
        bgcolor: dark.light,
        border: `1px solid ${alpha(dark.textActive, 0.1)}`,
        '&:hover': {
          boxShadow: `0 8px 24px ${alpha(dark.main, 0.4)}`,
          transform: 'translateY(-2px)',
          borderColor: alpha(dark.accent, 0.4),
        },
        ...(isCanceled && { opacity: 0.6 }),
      }}
    >
      {/* Map Section */}
      {event.coordinates && (
        <Box sx={{ p: 1.5, pb: 0 }}>
          <Box
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <MapPreview lat={event.coordinates.lat} lng={event.coordinates.lng} height="100%" />
          </Box>
        </Box>
      )}

      {/* Content Section */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Badges Row */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={formatLabel}
            size="small"
            sx={{
              bgcolor: alpha(dark.accent, 0.15),
              color: dark.accent,
              fontWeight: 600,
              border: `1px solid ${alpha(dark.accent, 0.3)}`,
            }}
          />
          <Chip
            label={priceDisplay}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: event.isPaid ? dark.accent : '#10b981',
              color: 'white',
            }}
          />
          {isCanceled && (
            <Chip
              label="Canceled"
              size="small"
              sx={{
                bgcolor: theme.palette.error.main,
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            color: dark.textActive,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </Typography>

        {/* Info Stack */}
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Date & Time */}
          <Box display="flex" gap={2} alignItems="center">
            <CalendarTodayIcon sx={{ color: dark.text }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: dark.text }}>
                Date & Time
              </Typography>
              <Typography variant="body2" fontWeight="500" sx={{ color: dark.textActive }}>
                {formattedDate}
              </Typography>
              <Typography variant="caption" sx={{ color: dark.text }}>
                {formattedTime}
              </Typography>
            </Box>
          </Box>

          {/* Location */}
          <Box display="flex" gap={2} alignItems="center">
            <LocationOnIcon sx={{ color: dark.text }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ color: dark.text }}>
                Location
              </Typography>
              <Typography
                variant="body2"
                fontWeight="500"
                sx={{
                  color: dark.textActive,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {event.location}
              </Typography>
            </Box>
          </Box>

          {/* Attendees */}
          <Box display="flex" gap={2} alignItems="center">
            <GroupIcon sx={{ color: dark.text }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: dark.text }}>
                Attendees
              </Typography>
              <Typography variant="body2" fontWeight="500" sx={{ color: dark.textActive }}>
                {attendeeCount} {attendeeCount === 1 ? 'person' : 'people'} going
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* Spacer */}
        <Box sx={{ flex: 1, minHeight: 16 }} />

        {/* Action Button */}
        <Box onClick={(e) => e.stopPropagation()} sx={{ mt: 2 }}>
          {!isAttending && !isOrganizer && !isCanceled && (
            <JoinEventButton event={event} size="medium" fullWidth />
          )}
          {(isAttending || isOrganizer) && !isCanceled && (
            <Button
              fullWidth
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/${event._id}`);
              }}
              sx={{
                borderColor: dark.accent,
                color: dark.accent,
                fontWeight: 600,
                '&:hover': {
                  borderColor: dark.accent,
                  bgcolor: alpha(dark.accent, 0.1),
                },
              }}
            >
              View Event
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
