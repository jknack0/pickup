import { TextField } from '@atoms/TextField';
import { Stack } from '@atoms/Stack';

export const SignupFields = () => {
  return (
    <Stack spacing={2.5}>
      <TextField
        label="Full Name"
        fullWidth
        variant="outlined"
        required
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
        label="Email Address"
        fullWidth
        variant="outlined"
        type="email"
        required
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
