import { Navigate } from 'react-router-dom';
import { useUser } from '@hooks/useAuth';
import { AuthLayout } from '@templates/AuthLayout';
import { SignupForm } from '@organisms/SignupForm';

export const Signup = () => {
  const { data: user } = useUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};
