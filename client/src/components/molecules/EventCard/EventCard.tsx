import React from 'react';
import { Card, CardContent, Typography, Button, CardActions, Box } from '@mui/material';
import type { IEvent } from '@pickup/shared';
import { useNavigate } from 'react-router-dom';
import MapPreview from '@/components/atoms/MapPreview/MapPreview';
import JoinEventButton from '@/components/organisms/JoinEventButton';
import { useUser } from '@/hooks/useAuth';
import { EventStatus } from '@pickup/shared';

export interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const { data: userData } = useUser();
  const userId = userData?.user._id;

  const isOrganizer =
    userData?.user._id ===
    (typeof event.organizer === 'object' && event.organizer !== null
      ? (event.organizer as unknown as { _id: string })._id
      : event.organizer);

  const attendeeRecord = event.attendees.find((att) => {
    const attUserId =
      typeof att.user === 'object' && att.user !== null
        ? (att.user as unknown as { _id: string })._id
        : att.user;
    return attUserId === userId;
  });

  const isAttending = !!attendeeRecord;

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography variant="body2">
          {event.location}
          <br />
          {event.description}
        </Typography>

        {event.coordinates && (
          <MapPreview lat={event.coordinates.lat} lng={event.coordinates.lng} height={150} />
        )}
      </CardContent>
      <CardActions>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small" onClick={() => navigate(`/events/${event._id}`)}>
            View Details
          </Button>
          {!isAttending && !isOrganizer && event.status !== EventStatus.CANCELED && (
            <JoinEventButton event={event} size="small" />
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventCard;
