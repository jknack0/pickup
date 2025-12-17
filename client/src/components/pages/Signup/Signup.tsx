import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@hooks/useAuth';
import { AuthLayout } from '@templates/AuthLayout';
import { SignupForm } from '@organisms/SignupForm';

export const Signup = () => {
  const { data: user } = useUser();
  const location = useLocation();
  const from =
    (location.state?.from?.pathname || '/dashboard') + (location.state?.from?.search || '');

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};
