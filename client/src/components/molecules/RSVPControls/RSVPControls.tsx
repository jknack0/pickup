import React from 'react';
import { Card, CardContent, Typography, ButtonGroup, Button } from '@mui/material';
import { AttendeeStatus } from '@pickup/shared';

interface RSVPControlsProps {
  currentStatus: AttendeeStatus | null;
  onUpdateStatus: (status: AttendeeStatus) => void;
  isLoading?: boolean;
}

const RSVPControls: React.FC<RSVPControlsProps> = ({
  currentStatus,
  onUpdateStatus,
  isLoading = false,
}) => {
  return (
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
          disabled={isLoading}
        >
          <Button
            color={currentStatus === AttendeeStatus.YES ? 'success' : 'inherit'}
            onClick={() => onUpdateStatus(AttendeeStatus.YES)}
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
            onClick={() => onUpdateStatus(AttendeeStatus.MAYBE)}
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
            onClick={() => onUpdateStatus(AttendeeStatus.NO)}
            sx={
              currentStatus !== AttendeeStatus.NO ? { bgcolor: 'white', color: 'text.primary' } : {}
            }
          >
            No
          </Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
};

export default RSVPControls;
