import { useState } from 'react';
import { Paper, Alert } from '@mui/material';
import { Button } from '@atoms/Button';
import { AuthHeader } from '@molecules/AuthHeader';
import { SignupFields } from '@molecules/SignupFields';
import { useRegister } from '@hooks/useAuth';
import type { RegisterInput } from '@pickup/shared';

export const SignupForm = () => {
  const { mutate: register, isPending } = useRegister();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;

    const credentials: RegisterInput = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
    };

    register(credentials, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        const responseData = err.response?.data;

        // Handle Zod array errors
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          const newFieldErrors: Record<string, string> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responseData.errors.forEach((issue: any) => {
            const path = issue.path[0];
            if (path) {
              newFieldErrors[path] = issue.message;
            }
          });
          setFieldErrors(newFieldErrors);
        }

        // Handle generic message if no field errors or as fallback
        if (responseData?.message) {
          setGlobalError(responseData.message);
        } else if (!responseData?.errors) {
          setGlobalError('Registration failed');
        }
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
      {globalError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {globalError}
        </Alert>
      )}
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}
      >
        <SignupFields errors={fieldErrors} />
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
      </form>
    </Paper>
  );
};
