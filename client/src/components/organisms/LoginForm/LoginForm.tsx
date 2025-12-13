import { Paper } from '@mui/material';
import { Button } from '../../atoms/Button';
import { Box } from '../../atoms/Box';
import { AuthHeader } from '../../molecules/AuthHeader';
import { LoginFields } from '../../molecules/LoginFields';

export const LoginForm = () => {
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
      <AuthHeader title="Log In" subtitle="Welcome back! Please enter your details." />
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        <LoginFields />
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          Log In
        </Button>
      </Box>
    </Paper>
  );
};
