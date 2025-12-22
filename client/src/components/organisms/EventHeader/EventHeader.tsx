import React from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import EventIcon from '@mui/icons-material/Event';
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
  const theme = useTheme();
  const dark = theme.palette.dark;

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

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${dark.light} 0%, ${alpha(dark.accent, 0.2)} 100%)`,
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${dark.accentGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
        >
          <Box sx={{ flex: 1, minWidth: 280 }}>
            {/* Status Badge */}
            {event.status === EventStatus.CANCELED && (
              <Chip label="CANCELED" color="error" size="small" sx={{ mb: 2, fontWeight: 600 }} />
            )}

            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: dark.textActive,
                mb: 1.5,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              {event.title}
            </Typography>

            {/* Date/Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EventIcon sx={{ color: dark.text, fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: dark.text }}>
                {formattedDate} at {formattedTime}
              </Typography>
            </Box>

            {/* Tags */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={event.type.replace(/_/g, ' ')}
                sx={{
                  bgcolor: alpha(dark.accent, 0.15),
                  color: dark.accent,
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              />
              <Chip
                label={event.format.replace(/_/g, ' ')}
                sx={{
                  bgcolor: alpha(dark.textActive, 0.1),
                  color: dark.text,
                  borderRadius: '8px',
                }}
              />
              {event.isPaid && price && (
                <Chip
                  label={`$${(price / 100).toFixed(2)}`}
                  sx={{
                    bgcolor: alpha('#10b981', 0.15),
                    color: '#10b981',
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1.5} alignItems="flex-start">
            {!isAttending &&
              !isOrganizer &&
              event.status !== EventStatus.CANCELED &&
              (JoinButtonComponent ? (
                JoinButtonComponent
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={onJoinClick}
                  sx={{
                    background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                    boxShadow: `0 4px 15px ${alpha(dark.accent, 0.4)}`,
                    px: 3,
                    borderRadius: '10px',
                    fontWeight: 600,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                      boxShadow: `0 6px 20px ${alpha(dark.accent, 0.5)}`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {price && price > 0 ? `Pay & Join ($${(price / 100).toFixed(2)})` : 'Join Event'}
                </Button>
              ))}

            <IconButton
              onClick={onShareClick}
              sx={{
                bgcolor: alpha(dark.textActive, 0.1),
                color: dark.text,
                '&:hover': {
                  bgcolor: alpha(dark.textActive, 0.15),
                  color: dark.textActive,
                },
              }}
            >
              <ShareIcon />
            </IconButton>

            {isOrganizer && (
              <>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    bgcolor: alpha(dark.textActive, 0.1),
                    color: dark.text,
                    '&:hover': {
                      bgcolor: alpha(dark.textActive, 0.15),
                      color: dark.textActive,
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  sx={{
                    '& .MuiPaper-root': {
                      bgcolor: dark.main,
                      border: `1px solid ${dark.divider}`,
                    },
                  }}
                >
                  <MenuItem onClick={handleShare} sx={{ color: dark.text }}>
                    Share Event
                  </MenuItem>
                  {event.status !== EventStatus.CANCELED && (
                    <MenuItem onClick={handleCancel} sx={{ color: '#f87171' }}>
                      Cancel Event
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EventHeader;
