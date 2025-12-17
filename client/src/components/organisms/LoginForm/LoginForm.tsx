import { Paper, Box, Typography, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button } from '@atoms/Button';
import { AuthHeader } from '@molecules/AuthHeader';
import { LoginFields } from '@molecules/LoginFields';
import { useLogin } from '@hooks/useAuth';
import { type LoginInput, loginSchema } from '@pickup/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';

interface ApiErrorResponse {
  message?: string;
  errors?: { path: (string | number)[]; message: string }[];
}

interface ApiError {
  response?: {
    data?: ApiErrorResponse;
  };
  message?: string;
}

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });
  // ... existing code ...
  <Box sx={{ mt: 2, textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">
      Don't have an account?{' '}
      <Link
        component={RouterLink}
        to="/signup"
        state={location.state}
        underline="hover"
        sx={{ fontWeight: 600 }}
      >
        Sign Up
      </Link>
    </Typography>
  </Box>;

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onError: (err: ApiError) => {
        const responseData = err.response?.data;

        // Handle Zod array errors from server
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach((issue) => {
            const path = issue.path[0];
            if (path) {
              setError(path as keyof LoginInput, { message: issue.message });
            }
          });
          // Also show a generic toast if validation failed
          enqueueSnackbar('Please check the fields for errors.', { variant: 'warning' });
          return;
        }

        const message = responseData?.message || err.message || 'Login failed';
        enqueueSnackbar(message, { variant: 'error' });
      },
      onSuccess: () => {
        enqueueSnackbar('Logged in successfully!', { variant: 'success' });
      },
    });
  };

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}
      >
        <LoginFields register={register} errors={errors} />
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isPending}
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
          {isPending ? 'Logging in...' : 'Log In'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" underline="hover" sx={{ fontWeight: 600 }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
};
