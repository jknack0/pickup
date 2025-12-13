import { Container } from '../../atoms/Container';
import { MainLayout } from '../../templates/MainLayout/MainLayout';
import { SignupForm } from '../../organisms/SignupForm';

export const Signup = () => {
  return (
    <MainLayout>
      <Container maxWidth="sm">
        <SignupForm />
      </Container>
    </MainLayout>
  );
};
