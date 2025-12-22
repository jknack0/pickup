import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders title and subtitle', () => {
    render(<LoginForm />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText(/enter your credentials/i)).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<LoginForm />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders input fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation error on blur', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Focus and blur email
    await user.click(emailInput);
    await user.click(passwordInput); // Blur email by clicking password

    // Check email error
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });
});
