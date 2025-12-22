import { Box, Typography, Link, useTheme, alpha } from '@mui/material';
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
  const theme = useTheme();
  const dark = theme.palette.dark;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

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
    <Box sx={{ width: '100%' }}>
      <AuthHeader title="Welcome back" subtitle="Enter your credentials to access your account" />

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
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
            boxShadow: `0 4px 15px ${alpha(dark.accent, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
              boxShadow: `0 6px 20px ${alpha(dark.accent, 0.4)}`,
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: theme.palette.action.disabledBackground,
              boxShadow: 'none',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isPending ? 'Logging in...' : 'Log In'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/signup"
              state={location.state}
              underline="hover"
              sx={{ fontWeight: 600, color: dark.accent }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};
