import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

export const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
