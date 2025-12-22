import { Box, Typography, Link, useTheme, alpha } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { Button } from '@atoms/Button';
import { AuthHeader } from '@molecules/AuthHeader';
import { SignupFields } from '@molecules/SignupFields';
import { useRegister } from '@hooks/useAuth';
import { type RegisterInput, registerSchema } from '@pickup/shared';

export const SignupForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: registerUser, isPending } = useRegister();
  const location = useLocation();
  const theme = useTheme();
  const dark = theme.palette.dark;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: RegisterInput) => {
    registerUser(data, {
      onError: (err: {
        response?: {
          data?: { errors?: { path: (string | number)[]; message: string }[]; message?: string };
        };
        message?: string;
      }) => {
        const responseData = err.response?.data;

        // Handle Zod array errors from server
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach((issue) => {
            const path = issue.path[0];
            if (path) {
              setError(path as keyof RegisterInput, { message: issue.message });
            }
          });
          // Also show a generic toast if validation failed
          enqueueSnackbar('Please check the fields for errors.', { variant: 'warning' });
          return;
        }

        // Handle generic message
        const message = responseData?.message || err.message || 'Registration failed';
        enqueueSnackbar(message, { variant: 'error' });
      },
      onSuccess: () => {
        enqueueSnackbar('Account created successfully!', { variant: 'success' });
      },
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AuthHeader title="Create account" subtitle="Get started with your free account" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}
      >
        <SignupFields register={register} errors={errors} />
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
          {isPending ? 'Creating account...' : 'Create Account'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              state={location.state}
              underline="hover"
              sx={{ fontWeight: 600, color: dark.accent }}
            >
              Log In
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};
