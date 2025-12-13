import { useState } from 'react';
import { Paper, Alert } from '@mui/material';
import { Button } from '../../atoms/Button';
import { AuthHeader } from '../../molecules/AuthHeader';
import { SignupFields } from '../../molecules/SignupFields';
import { useRegister } from '../../../hooks/useAuth';
import type { RegisterInput } from '@pickup/shared';

export const SignupForm = () => {
  const { mutate: register, isPending, error } = useRegister();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const credentials: RegisterInput = { name, email, password };

    register(credentials, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        setErrorMessage(err.response?.data?.message || 'Registration failed');
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
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(error as any)?.response?.data?.errors && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {JSON.stringify((error as any).response.data.errors)}
        </Alert>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}
      >
        <SignupFields />
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
