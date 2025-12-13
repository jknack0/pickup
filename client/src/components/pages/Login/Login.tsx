import { Navigate } from 'react-router-dom';
import { useUser } from '@hooks/useAuth';
import { AuthLayout } from '@templates/AuthLayout';
import { LoginForm } from '@organisms/LoginForm';

export const Login = () => {
  const { data: user } = useUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
