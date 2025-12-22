import React from 'react';
import { Card, CardContent, Typography, ButtonGroup, Button, useTheme, alpha } from '@mui/material';
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
  const theme = useTheme();
  const dark = theme.palette.dark;

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: dark.light,
        border: `1px solid ${alpha(dark.textActive, 0.1)}`,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: dark.textActive }}>
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
                ? {
                    bgcolor: dark.main,
                    color: dark.text,
                    '&:hover': { bgcolor: alpha(dark.textActive, 0.1) },
                  }
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
                ? {
                    bgcolor: dark.main,
                    color: dark.text,
                    '&:hover': { bgcolor: alpha(dark.textActive, 0.1) },
                  }
                : {}
            }
          >
            Maybe
          </Button>
          <Button
            color={currentStatus === AttendeeStatus.NO ? 'error' : 'inherit'}
            onClick={() => onUpdateStatus(AttendeeStatus.NO)}
            sx={
              currentStatus !== AttendeeStatus.NO
                ? {
                    bgcolor: dark.main,
                    color: dark.text,
                    '&:hover': { bgcolor: alpha(dark.textActive, 0.1) },
                  }
                : {}
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
