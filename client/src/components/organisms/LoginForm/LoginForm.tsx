import { useState } from 'react';
import { Paper, Alert } from '@mui/material';
import { Button } from '../../atoms/Button';
import { AuthHeader } from '../../molecules/AuthHeader';
import { LoginFields } from '../../molecules/LoginFields';
import { useLogin } from '../../../hooks/useAuth';
import type { LoginInput } from '@pickup/shared';

export const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const credentials: LoginInput = { email, password };

    login(credentials, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        setErrorMessage(err.response?.data?.message || 'Login failed');
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
        <LoginFields />
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
      </form>
    </Paper>
  );
};
