import { AuthLayout } from '@templates/AuthLayout';
import { LoginForm } from '@organisms/LoginForm';

export const Login = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
