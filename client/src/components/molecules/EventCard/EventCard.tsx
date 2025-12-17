import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import type { IEvent } from '@pickup/shared';
import { useNavigate } from 'react-router';
import MapPreview from '@/components/atoms/MapPreview/MapPreview';

export interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

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
        <Button size="small" onClick={() => navigate(`/events/${event._id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
