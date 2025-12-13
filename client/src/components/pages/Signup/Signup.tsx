import { Box } from '../../atoms/Box';
import { MainLayout } from '../../templates/MainLayout/MainLayout';
import { SignupForm } from '../../organisms/SignupForm';

export const Signup = () => {
  return (
    <MainLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
          bgcolor: 'grey.100', // Add slight contrast
          p: 2, // Ensure some spacing on small screens
        }}
      >
        <SignupForm />
      </Box>
    </MainLayout>
  );
};
