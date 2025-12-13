import { Typography } from '@atoms/Typography';
import { Box } from '@atoms/Box';
import { Paper } from '@mui/material';

export const DashboardHome = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Welcome to your dashboard! Sub-routes will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};
