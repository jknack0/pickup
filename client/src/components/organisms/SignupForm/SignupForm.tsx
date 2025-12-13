import { Button } from '../../atoms/Button';
import { Box } from '../../atoms/Box';
import { AuthHeader } from '../../molecules/AuthHeader';
import { SignupFields } from '../../molecules/SignupFields';

export const SignupForm = () => {
  return (
    <Box sx={{ mb: 4, width: '100%', maxWidth: '800px' }}>
      <AuthHeader title="Sign Up" />
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SignupFields />
        <Button variant="contained" color="primary" size="large" fullWidth>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};
