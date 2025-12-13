import { Paper } from '@mui/material';
import { Button } from '../../atoms/Button';
import { Box } from '../../atoms/Box';
import { AuthHeader } from '../../molecules/AuthHeader';
import { SignupFields } from '../../molecules/SignupFields';

export const SignupForm = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        mb: 4,
        width: '100%',
        maxWidth: '500px',
        p: 4,
        borderRadius: 2,
      }}
    >
      <AuthHeader title="Sign Up" />
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        <SignupFields />
        <Button variant="contained" color="primary" size="large" fullWidth>
          Sign Up
        </Button>
      </Box>
    </Paper>
  );
};
