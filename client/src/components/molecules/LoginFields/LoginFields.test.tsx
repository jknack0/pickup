import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import { LoginFields } from './LoginFields';
import type { LoginInput } from '@pickup/shared';

const TestWrapper = () => {
  const {
    register,
    formState: { errors },
  } = useForm<LoginInput>();
  return <LoginFields register={register} errors={errors} />;
};

describe('LoginFields', () => {
  it('renders email and password fields', () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('fields are required', () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText(/email address/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
  });
});
