import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { SignupForm } from './SignupForm';

describe('SignupForm', () => {
  it('renders title and subtitle', () => {
    render(<SignupForm />);

    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByText(/get started with your free account/i)).toBeInTheDocument();
  });

  it('renders sign up button', () => {
    render(<SignupForm />);

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders input fields', () => {
    render(<SignupForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    // Use getAllByLabelText for password fields since there are 2
    const passwordFields = screen.getAllByLabelText(/password/i);
    expect(passwordFields.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
  });

  it('shows validation error on blur', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInputs = screen.getAllByLabelText(/password/i);

    // Focus and blur email
    await user.click(emailInput);
    await user.click(passwordInputs[0]); // Blur email by clicking password

    // Check email error
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });
});
