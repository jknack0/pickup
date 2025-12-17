import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { SignupFields } from './SignupFields';
import { useForm } from 'react-hook-form';
import { MemoryRouter } from 'react-router-dom';
import type { RegisterInput } from '@pickup/shared';

const TestWrapper = () => {
  const {
    register,
    formState: { errors },
  } = useForm<RegisterInput>();
  return (
    <MemoryRouter>
      <SignupFields register={register} errors={errors} />
    </MemoryRouter>
  );
};

describe('SignupFields', () => {
  it('renders without crashing', () => {
    render(<TestWrapper />);
  });
});
