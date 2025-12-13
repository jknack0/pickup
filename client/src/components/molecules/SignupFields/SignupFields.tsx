import { TextField } from '../../atoms/TextField';
import { Stack } from '../../atoms/Stack';

export const SignupFields = () => {
  return (
    <Stack spacing={3}>
      <TextField label="Full Name" fullWidth variant="outlined" required />
      <TextField label="Email Address" fullWidth variant="outlined" type="email" required />
      <TextField label="Password" fullWidth variant="outlined" type="password" required />
    </Stack>
  );
};
