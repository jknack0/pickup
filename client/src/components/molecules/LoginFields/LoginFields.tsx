import { TextField } from '@atoms/TextField';
import { Stack } from '@atoms/Stack';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import type { LoginInput } from '@pickup/shared';

interface LoginFieldsProps {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
}

export const LoginFields = ({ register, errors }: LoginFieldsProps) => {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Email Address"
        fullWidth
        variant="outlined"
        type="email"
        required
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
      <TextField
        label="Password"
        fullWidth
        variant="outlined"
        type="password"
        required
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
    </Stack>
  );
};
