import { TextField } from '@atoms/TextField';
import { Stack } from '@atoms/Stack';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import type { RegisterInput } from '@pickup/shared';

interface SignupFieldsProps {
  register: UseFormRegister<RegisterInput>;
  errors: FieldErrors<RegisterInput>;
}

export const SignupFields = ({ register, errors }: SignupFieldsProps) => {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="First Name"
          fullWidth
          variant="outlined"
          autoComplete="given-name"
          required
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          {...register('firstName')}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
        <TextField
          label="Last Name"
          fullWidth
          variant="outlined"
          autoComplete="family-name"
          required
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          {...register('lastName')}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
      </Stack>

      <TextField
        label="Date of Birth"
        type="date"
        fullWidth
        variant="outlined"
        required
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth?.message}
        InputLabelProps={{ shrink: true }}
        {...register('dateOfBirth')}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            '&:hover fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        label="Email Address"
        fullWidth
        variant="outlined"
        type="email"
        autoComplete="email"
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
        autoComplete="new-password"
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
      <TextField
        label="Confirm Password"
        fullWidth
        variant="outlined"
        type="password"
        autoComplete="new-password"
        required
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        {...register('confirmPassword')}
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
