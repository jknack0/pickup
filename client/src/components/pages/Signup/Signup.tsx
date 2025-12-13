import { AuthLayout } from '@templates/AuthLayout';
import { SignupForm } from '@organisms/SignupForm';

export const Signup = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};
