import React from 'react';
import { Box, Typography, Chip, IconButton, Button, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { EventStatus, type IEvent } from '@pickup/shared';

interface EventHeaderProps {
  event: IEvent;
  isOrganizer: boolean;
  isAttending: boolean;
  onJoinClick: () => void;
  onShareClick: () => void;
  onCancelEventClick: () => void;
  price?: number;
  JoinButtonComponent?: React.ReactNode;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  isOrganizer,
  isAttending,
  onJoinClick,
  onShareClick,
  onCancelEventClick,
  price,
  JoinButtonComponent,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShare = () => {
    onShareClick();
    handleMenuClose();
  };

  const handleCancel = () => {
    onCancelEventClick();
    handleMenuClose();
  };

  return (
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
          {!isAttending &&
            !isOrganizer &&
            event.status !== EventStatus.CANCELED &&
            (JoinButtonComponent ? (
              JoinButtonComponent
            ) : (
              <Button variant="contained" size="large" onClick={onJoinClick}>
                {price && price > 0 ? `Pay & Join ($${(price / 100).toFixed(2)})` : 'Join Event'}
              </Button>
            ))}
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem onClick={handleShare}>Share Event</MenuItem>
            {isOrganizer && event.status !== EventStatus.CANCELED && (
              <MenuItem onClick={handleCancel} sx={{ color: 'error.main' }}>
                Cancel Event
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default EventHeader;
