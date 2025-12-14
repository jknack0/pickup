import { TextField } from '@atoms/TextField';
import { Stack } from '@atoms/Stack';

interface SignupFieldsProps {
  errors?: Record<string, string>;
}

export const SignupFields = ({ errors = {} }: SignupFieldsProps) => {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          name="firstName"
          label="First Name"
          fullWidth
          variant="outlined"
          autoComplete="given-name"
          required
          error={!!errors.firstName}
          helperText={errors.firstName}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
        <TextField
          name="lastName"
          label="Last Name"
          fullWidth
          variant="outlined"
          autoComplete="family-name"
          required
          error={!!errors.lastName}
          helperText={errors.lastName}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
      </Stack>

      <TextField
        name="dateOfBirth"
        label="Date of Birth"
        type="date"
        fullWidth
        variant="outlined"
        required
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth}
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            '&:hover fieldset': { borderColor: 'primary.main' },
          },
        }}
      />
      <TextField
        name="email"
        label="Email Address"
        fullWidth
        variant="outlined"
        type="email"
        autoComplete="off"
        required
        error={!!errors.email}
        helperText={errors.email}
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
        name="password"
        label="Password"
        fullWidth
        variant="outlined"
        type="password"
        autoComplete="new-password"
        required
        error={!!errors.password}
        helperText={errors.password}
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
        name="confirmPassword"
        label="Confirm Password"
        fullWidth
        variant="outlined"
        type="password"
        autoComplete="new-password"
        required
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
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
