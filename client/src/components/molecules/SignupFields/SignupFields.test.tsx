import { render } from '@/test-utils';
import { describe, it } from 'vitest';
import { SignupFields } from './SignupFields';
import { useForm } from 'react-hook-form';
import type { RegisterInput } from '@pickup/shared';

// Wrapper component to provide form context
const TestWrapper = () => {
  const {
    register,
    formState: { errors },
  } = useForm<RegisterInput>();
  return <SignupFields register={register} errors={errors} />;
};

describe('SignupFields', () => {
  it('renders without crashing', () => {
    render(<TestWrapper />);
  });
});
