import { Paper, Box, Typography, Link } from '@mui/material';
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
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          {isPending ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              state={location.state}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Log In
            </Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
};
